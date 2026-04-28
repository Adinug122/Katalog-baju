import { Link, router, usePage } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';
import dayjs from 'dayjs';

export default function RentsIndex({ rents }) {
  const [selectRented, setSelectRent] = useState(null);
  const [denda, setDenda] = useState(0);

  // Ambil parameter 'search' dari props juga
  const { flash, month: initialMonth, year: initialYear, date_from: initialDateFrom, date_to: initialDateTo, search: initialSearch } = usePage().props;
  
  const [filterSearch, setFilterSearch] = useState(initialSearch || '');
  const [filterMonth, setFilterMonth] = useState(initialMonth || '');
  const [filterYear, setFilterYear] = useState(initialYear || '');
  const [filterDateFrom, setFilterDateFrom] = useState(initialDateFrom || '');
  const [filterDateTo, setFilterDateTo] = useState(initialDateTo || '');

  const deleteRent = (id) => {
    if (!confirm('Hapus data sewa?')) return;
    router.delete(route('rents.destroy', id));
  };

  const openReturnModal = (rent) =>{
    const tglKembali = dayjs(rent.return_date);
    const hariIni = dayjs();
    const selisihHari = hariIni.diff(tglKembali,'day');
    
    const estimasi = selisihHari > 0 ? selisihHari * 20000 : 0;
    setDenda(estimasi);
    setSelectRent(rent)
  }

  const handleSelesai = (invoice_code)=>{
    if(confirm("Konfirmasi pengembalian baju? Sistem akan menghitung denda otomatis")){
      router.post(route('rents.selesai',invoice_code))
    }
  }

  const exportPdf = (invoice_code)=>{
    if(confirm("Konfirmasi Export Invoce?")){
      router.get(route('invoice',invoice_code));
    }
  }

  const handlePelunasan = (invoice_code) =>{
    if(confirm("Konfirmasi pelunasan dan pengambilan baju")){
      router.post(route('rents.pelunasan',invoice_code))
    }
  }

  const confirmReturn = () => {
    if (!selectRented) return;

    router.patch(
      route('rents.return', selectRented.id),
      { denda: parseInt(denda) || 0 },
      {
        onSuccess: () => setSelectRent(null),
      }
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* 1. Header Responsif */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Data Sewa</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar transaksi sewa (edit/hapus tersedia).
          </p>
        </div>

        <div className='flex gap-2'>
          <Link 
            href={route('rents.create')} 
            className="w-full sm:w-auto text-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sidebar-accent transition"
          >
            + Buat Sewa Baru
          </Link>

          {/* Pastikan parameter search juga dibawa saat export */}
          <a 
            href={`${route('laporan.export')}?search=${filterSearch}&month=${filterMonth}&year=${filterYear}&date_from=${filterDateFrom}&date_to=${filterDateTo}`} 
            className='w-full sm:w-auto text-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition'
          >
            Export Laporan
          </a>
        </div>
      </div>

      {flash?.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm">
          <div>{flash.success}</div>
          {flash.invoice_code && (
            <div className="mt-1 font-semibold text-slate-700">Invoice: {flash.invoice_code}</div>
          )}
        </div>
      )}
    
      {/* FILTER SECTION */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.get(route('rents.index', { 
                search: filterSearch, // Kirim pencarian ke controller
                month: filterMonth, 
                year: filterYear,
                date_from: filterDateFrom,
                date_to: filterDateTo
            }));
          }}
          className="flex flex-col gap-4"
        >
          {/* Grid input diperbarui agar lebih proporsional */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-slate-600">Cari Invoice / Nama</label>
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Ketik invoice atau nama pembeli..."
                className="mt-1 w-full rounded border px-3 py-2 text-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Dari Tanggal</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 text-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Sampai Tanggal</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 text-sm focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Bulan</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 text-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Semua</option>
                {[...Array(12)].map((_, index) => {
                  const monthValue = String(index + 1).padStart(2, '0');
                  return (
                    <option key={monthValue} value={monthValue}>
                      {monthValue}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Tahun</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 text-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Semua</option>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => {
                setFilterSearch('');
                setFilterMonth('');
                setFilterYear('');
                setFilterDateFrom('');
                setFilterDateTo('');
                router.get(route('rents.index'));
              }}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-sidebar-accent transition"
            >
              Cari & Filter
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto"> {/* Pembungkus khusus scroll horizontal di HP */}
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Pemesan</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">NIK</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Baju</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Pinjam</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Kembali</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Kembali Aktual</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Total Harga</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">DP Item</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Denda</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Catatan</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rents?.data?.length > 0 ? rents.data.map((rent) => (
                <tr key={rent.id} className="hover:bg-slate-50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">
                    {rent.invoice_code || '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">
                    {rent.customer_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">
                    {rent.customer_ktp}
                  </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                    {rent.details?.length > 0
                      ? rent.details.map((d, i) => (
                          <div key={i}>{d.cloth?.name ?? d.clothes_kode} (x{d.qty})</div>
                        ))
                      : '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {rent.rent_date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {rent.return_date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {rent.actual_return_date || '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    Rp {Number(rent.total_price || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    Rp {Number(rent.down_payment || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    Rp {Number(rent.denda).toLocaleString('id-ID')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                        {rent.note}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      rent.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rent.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium space-x-2">
                  <a 
                    href={route('invoice', rent.invoice_code)} 
                    target="_blank" 
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Invoice
                  </a>
                  {rent.status == 'booked' && (
                    <button
                      onClick={() => handlePelunasan(rent.invoice_code)}
                      className="rounded-lg bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold capitalize hover:bg-emerald-200 transition"
                    >
                     Pelunasan
                    </button>
                  )}
                  
                  {rent.status == 'ongoing' && (
                    <button
                      onClick={() => handleSelesai(rent.invoice_code)}
                      className="rounded-lg bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold capitalize hover:bg-emerald-200 transition"
                    >
                      Selesai
                    </button>
                  )}
                    <button
                      onClick={() => deleteRent(rent.id)}
                      className="rounded-lg bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold capitalize hover:bg-red-200 transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={13}>
                    {filterSearch ? `Tidak ada transaksi yang cocok dengan "${filterSearch}"` : 'Belum ada data sewa.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Pagination links={rents.links} />

      {/* Modal Selesaikan Sewa (Return Modal) */}
      {selectRented && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Selesaikan Sewa</h2>
            <p className="text-sm text-slate-500 mt-1">Konfirmasi pengembalian untuk <strong>{selectRented.customer_name}</strong></p>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nominal Denda (Rp)</label>
                <input 
                  type="number" 
                  value={denda} 
                  onChange={(e) => setDenda(e.target.value)}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1 italic">*Anda bisa mengubah denda jika ada kerusakan fisik.</p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setSelectRent(null)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                Batal
              </button>
              <button onClick={confirmReturn} className="flex-1 px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
                Konfirmasi Kembali
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

RentsIndex.layout = (page) => <Layout>{page}</Layout>;