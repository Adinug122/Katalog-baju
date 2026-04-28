import React, { useState } from 'react';
import Layout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Calendar as CalendarIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Pagination from '@/Components/Pagination'; 

export default function TrackerIndex({ trackerData, selectedDate }) {
    const [search, setSearch] = useState('');

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        router.get(route('tracker.index'), { date: newDate }, { preserveState: true, replace: true });
    };

    const changeDay = (daysToAdd) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + daysToAdd);
        const formattedDate = d.toISOString().split('T')[0];
        router.get(route('tracker.index'), { date: formattedDate }, { preserveState: true, replace: true });
    };

    const goToToday = () => {
        const today = new Date().toISOString().split('T')[0];
        router.get(route('tracker.index'), { date: today }, { preserveState: true, replace: true });
    };

  
    const filteredData = trackerData.data.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.kode.toLowerCase().includes(search.toLowerCase())
    );

    const displayDate = new Date(selectedDate).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
    
        <Layout>
            <Head title="Tracker Stok Barang" />

            <div className="py-10 bg-[#F8F9FA] min-h-screen font-body">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* --- HEADER & DATE NAVIGATOR --- */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tracker <span className="text-[#C9A834]">Ketersediaan</span></h1>
                            <p className="text-sm text-slate-500 mt-1">Cek riwayat booking dan stok fisik pada tanggal spesifik.</p>
                        </div>

                        {/* Date Controls */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                <button onClick={() => changeDay(-1)} className="p-2 hover:bg-white rounded-lg transition text-slate-600 shadow-sm">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                
                                <div className="relative flex items-center px-4 font-bold text-slate-800">
                                    <CalendarIcon className="w-4 h-4 text-[#C9A834] mr-2" />
                                    <span>{displayDate}</span>
                                    {/* Input date disembunyikan di atas teks biar bisa diklik */}
                                    <input 
                                        type="date" 
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                    />
                                </div>

                                <button onClick={() => changeDay(1)} className="p-2 hover:bg-white rounded-lg transition text-slate-600 shadow-sm">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <button onClick={goToToday} className="px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition shadow-md w-full sm:w-auto">
                                Hari Ini
                            </button>
                        </div>
                    </div>

                    {/* --- TABLE AREA --- */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        
                        {/* Search Bar */}
                        <div className="p-5 border-b border-slate-50 flex items-center bg-slate-50/50">
                            <Search className="w-5 h-5 text-slate-400 mr-3" />
                            <input 
                                type="text"
                                placeholder="Cari nama pakaian atau kode..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border-none bg-transparent focus:ring-0 w-full text-sm font-medium outline-none"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#C9A834]/10 text-slate-600 text-[10px] uppercase tracking-widest font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Nama Barang</th>
                                        <th className="px-6 py-4 text-center">Total Dimiliki</th>
                                        <th className="px-6 py-4 text-center">Tersedia Tgl Ini</th>
                                        <th className="px-6 py-4 text-center">Status Barang</th>
                                        <th className="px-6 py-4 text-center">Est. Bisa Disewa Lagi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800">{item.name}</div>
                                                    <div className="text-xs font-mono bg-slate-100 text-slate-500 inline-block px-2 py-0.5 rounded mt-1">{item.kode}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-slate-600">
                                                    {item.total_stock}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`text-xl font-black ${item.is_empty ? 'text-red-500' : 'text-emerald-600'}`}>
                                                        {item.available_stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center border ${
                                                        item.is_empty 
                                                        ? 'bg-red-50 text-red-600 border-red-200' 
                                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 text-center text-sm ${item.is_empty ? 'font-bold text-slate-800' : 'text-slate-400 italic'}`}>
                                                    {item.est_available}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">
                                                Barang tidak ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
             <div className="mt-2 flex justify-end">
                {trackerData?.links && <Pagination links={trackerData.links} />}
            </div>
            </div>
        </Layout>
    );
}