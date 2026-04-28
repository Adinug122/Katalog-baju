import React, { useState } from 'react';
import Layout from '@/Layouts/AuthenticatedLayout';

export default function Calendar({ clothes = [] }) {
  // --- 1. STATE & SETUP TANGGAL ---
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 = Jan, 11 = Des

  // Helper: Set jam ke 00:00:00 untuk komparasi yang akurat
  const getStartOfDay = (dateStr) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // --- 2. LOGIKA GRID KALENDER ---
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Hari pertama jatuhnya di index ke berapa? (Kita buat Senin = 0, Minggu = 6)
  let startOffset = firstDayOfMonth.getDay() - 1;
  if (startOffset === -1) startOffset = 6; // Jika hari Minggu, geser ke paling kanan

  // Bikin array kosong untuk hari-hari sebelum tanggal 1
  const blanks = Array.from({ length: startOffset }).map(() => null);

  // Bikin array tanggal dari 1 sampai akhir bulan (28/29/30/31)
  const days = Array.from({ length: daysInMonth }).map((_, i) => new Date(year, month, i + 1));

  // Gabungkan slot kosong dan slot tanggal untuk di-render di Grid
  const totalCells = [...blanks, ...days];

  // --- 3. FILTER BOOKING UNTUK TANGGAL TERTENTU ---
  const getBookingsForDate = (date) => {
    const bookings = [];
    const cellTime = getStartOfDay(date).getTime();

    clothes.forEach((cloth) => {
      cloth.rent_items?.forEach((item) => {
        const rent = item.rent;
        if (!rent) return;

        const start = getStartOfDay(rent.rent_date).getTime();
        const end = getStartOfDay(rent.return_date).getTime();

        // Cek apakah tanggal di kotak ini berada di antara tgl pinjam & kembali
        if (cellTime >= start && cellTime <= end) {
          let status = rent.status;
          // Cek kalau terlambat
          if (status !== 'completed' && end < getStartOfDay().getTime()) {
            status = 'terlambat';
          }
          
          bookings.push({
            id: `${item.id}-${date.getDate()}`,
            clothName: cloth.name,
            customer: rent.customer_name,
            status: status,
            qty: item.qty
          });
        }
      });
    });
    return bookings;
  };

  // Handler Ganti Bulan
  const handleMonthChange = (e) => {
    const [y, m] = e.target.value.split('-');
    setCurrentDate(new Date(y, m - 1, 1));
  };
  const monthInputValue = `${year}-${String(month + 1).padStart(2, '0')}`;
  const namaHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Navigasi Bulan */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kalender Booking</h1>
          <p className="text-sm text-gray-500">Pantau jadwal sewa baju secara keseluruhan</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="month" 
            value={monthInputValue}
            onChange={handleMonthChange}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
          />
          <button 
            onClick={() => setCurrentDate(new Date())} 
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm transition hover:opacity-90 whitespace-nowrap"
          >
            Bulan Ini
          </button>
        </div>
      </div>

      {/* Grid Kalender */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        
        {/* Header Nama Hari */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {namaHari.map((hari, i) => (
            <div key={i} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-r last:border-r-0 border-gray-200">
              <span className="hidden md:inline">{hari}</span>
              <span className="md:hidden">{hari.slice(0, 3)}</span>
            </div>
          ))}
        </div>

        {/* Kotak-kotak Tanggal */}
        <div className="grid grid-cols-7 bg-gray-200 gap-px">
          {totalCells.map((date, idx) => {
            // Render Kotak Kosong
            if (!date) {
              return <div key={`blank-${idx}`} className="bg-gray-50 min-h-[100px] md:min-h-[120px]"></div>;
            }

            const isToday = getStartOfDay().getTime() === date.getTime();
            const bookings = getBookingsForDate(date);

         
            return (
              <div key={idx} className={`bg-white min-h-[100px] md:min-h-[120px] flex flex-col transition hover:bg-blue-50/30 ${isToday ? 'bg-blue-50/50' : ''}`}>
              
                <div className="p-2 flex justify-end">
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                    {date.getDate()}
                  </span>
                </div>

                {/* List Booking di Hari Tersebut */}
                <div className="px-1 pb-1 flex-1 flex flex-col gap-1 overflow-y-auto max-h-[80px] md:max-h-[100px] scrollbar-thin scrollbar-thumb-gray-300">
                  {bookings.map((b) => {
                    // Penentuan Warna Badge
                    let bgColor = 'bg-gray-100 text-gray-800 border-gray-200';
                    if (b.status === 'booked') bgColor = 'bg-amber-100 text-amber-800 border-amber-200';
                    if (b.status === 'ongoing') bgColor = 'bg-blue-100 text-blue-800 border-blue-200';
                    if (b.status === 'terlambat') bgColor = 'bg-red-100 text-red-800 border-red-200';

                    return (
                      <div 
                        key={b.id} 
                        className={`text-[10px] md:text-xs px-1.5 py-1 rounded border leading-tight truncate cursor-default ${bgColor}`}
                        title={`${b.clothName} - ${b.customer} (${b.qty} pcs)`}
                      >
                        <span className="font-bold">{b.customer}</span>
                        <span className="hidden md:inline"> &bull; {b.clothName}</span>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Keterangan Warna (Legend) */}
      <div className="flex flex-wrap gap-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-400 rounded-sm"></div> 
          <span className="text-xs font-semibold text-gray-600 uppercase">Booked (DP)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> 
          <span className="text-xs font-semibold text-gray-600 uppercase">Ongoing (Dibawa)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div> 
          <span className="text-xs font-semibold text-gray-600 uppercase">Terlambat</span>
        </div>
      </div>

    </div>
  );
}