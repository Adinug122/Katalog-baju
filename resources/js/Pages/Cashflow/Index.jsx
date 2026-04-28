import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import dayjs from 'dayjs';

export default function CashflowIndex({ auth, transactions, summary, start_date, end_date, filter_type, flash }) {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const initialSearch = params.get('search') || '';

    const [filterStartDate, setFilterStartDate] = useState(start_date || '');
    const [filterEndDate, setFilterEndDate] = useState(end_date || '');
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    
    const [filterType, setFilterType] = useState(filter_type || 'all');

    const handleFilter = (newFilterType = filterType) => {
        setFilterType(newFilterType);
        router.get(route('cashflow.index'), {
            start_date: filterStartDate,
            end_date: filterEndDate,
            search: searchQuery,
            filter_type: newFilterType,
        }, { preserveState: true });
    };

    const deleteCashflow = (id) => {
        if (!confirm('Hapus transaksi cashflow ini?')) return;
        router.delete(route('cashflow.destroy', id));
    };

    const formatCurrency = (num) => {
        const safeNum = Number(num) || 0; 
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
        }).format(safeNum);
    };

    const getTypeLabel = (type) => {
        const labels = { 'initial_capital': 'Modal', 'income': 'Pemasukan', 'expense': 'Pengeluaran' };
        return labels[type] || type;
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'initial_capital': return 'bg-purple-100 text-purple-800';
            case 'income': return 'bg-green-100 text-green-800';
            case 'expense': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const tabs = [
        { id: 'all', label: 'Semua Transaksi' },
        { id: 'income', label: 'Pemasukan' },
        { id: 'expense', label: 'Pengeluaran' },
        { id: 'initial_capital', label: 'Modal / Saldo' }
    ];

    return (
        <Layout user={auth?.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Cashflow Bisnis</h2>}>
            <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Cashflow Bisnis</h1>
                        <p className="text-gray-600 text-sm mt-1">Kelola modal, pemasukan, pengeluaran, dan piutang</p>
                    </div>
                    <Link href={route('cashflow.create')} className="bg-primary hover:bg-sidebar-accent text-white px-4 py-2 rounded-lg font-medium text-sm transition">
                        + Transaksi Baru
                    </Link>
                </div>

           {summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Saldo Awal</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(summary.balance_before)}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Tambahan Modal</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-2">{formatCurrency(summary.initial_capital)}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Pemasukan</p>
                            <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(summary.total_income)}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Total Pengeluaran</p>
                            <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(summary.total_expense)}</p>
                        </div>
                        
                        {/* PERBAIKAN: Laba Bersih Operasional */}
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 relative">
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Laba Bersih Ops</p>
                            <p className="text-2xl font-bold text-primary mt-2">
                                {/* Rumus Baru: Pemasukan - HANYA Pengeluaran Operasional */}
                                {formatCurrency((summary.total_income || 0) - (summary.expense_operasional || 0))}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 absolute bottom-2 right-4 italic">
                                *Tanpa memotong aset modal
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Uang Masuk (Baru DP)</p>
                            <p className="text-2xl font-bold text-teal-600 mt-2">{formatCurrency(summary.total_dp)}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Belum Dibayar (Sisa)</p>
                            <p className="text-2xl font-bold text-orange-600 mt-2">{formatCurrency(summary.total_unpaid)}</p>
                        </div>
                        
                     
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow p-4 text-white flex flex-col justify-center">
                            <p className="text-xs font-medium opacity-90 uppercase tracking-wider">Saldo Akhir</p>
                            <p className="text-3xl font-bold mt-1">{formatCurrency(summary.balance_after)}</p>
                            
                            {/* Rincian Kaca Pembesar */}
                            <div className="mt-3 pt-2 border-t border-indigo-400/50 flex justify-between text-xs font-medium">
                                <div>
                                    <span className="opacity-80">Laci Ops:</span> 
                                    <span className="ml-1 text-emerald-200">{formatCurrency(summary.saldo_operasional || 0)}</span>
                                </div>
                                <div>
                                    <span className="opacity-80">Laci Modal:</span> 
                                    <span className="ml-1 text-amber-200">{formatCurrency(summary.saldo_modal || 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="w-full lg:w-1/3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Transaksi</label>
                            <input
                                type="text" placeholder="Ketik kata kunci..." value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>
                        <div className="flex-1 w-full flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
                                <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
                                <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary outline-none" />
                            </div>
                            <button onClick={() => handleFilter()} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-sm transition whitespace-nowrap w-full sm:w-auto">
                                Cari & Filter
                            </button>
                            <a href={route('cashflow.export', { start_date: filterStartDate, end_date: filterEndDate, search: searchQuery, filter_type: filterType })} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium text-sm transition whitespace-nowrap w-full sm:w-auto text-center">
                                Export
                            </a>
                        </div>
                    </div>
                </div>

                {flash?.success && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">✓ {flash.success}</div>}

                <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleFilter(tab.id)}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${
                                filterType === tab.id
                                ? 'bg-gray-800 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tipe</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Deskripsi</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Jumlah</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Saldo</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions?.data && transactions.data.length > 0 ? (
                                    transactions.data.map((item, idx) => (
                                        <tr key={idx} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {dayjs(item.date).format('DD MMM YYYY')}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(item.type)}`}>
                                                        {getTypeLabel(item.type)}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.sumber_dana === 'modal' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                                                        {item.sumber_dana === 'modal' ? 'Laci Modal' : 'Operasional'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                <div className="font-medium">{item.description}</div>
                                                {item.notes && <div className="text-xs text-gray-500 mt-1">{item.notes}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                                                <span className={item.type === 'expense' ? 'text-red-600' : 'text-green-600'}>
                                                    {item.type === 'expense' ? '-' : '+'} {formatCurrency(item.amount)}
                                                </span>
                                            </td>
                                           <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {/* SALDO GLOBAL (Warna Hitam/Tebal) */}
                                                <div className="text-sm font-bold text-slate-900">
                                                    {formatCurrency(item.balance_after)}
                                                </div>
                                                
                                          
                                                <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">
                                                    Sisa {item.sumber_dana}: 
                                                    <span className="ml-1 font-medium">
                                                        {formatCurrency(item.sumber_dana_balance_after)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    {auth?.user?.role === 'owner' ? (
                                                        <>
                                                            <Link href={route('cashflow.edit', item.id)} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</Link>
                                                            <button onClick={() => deleteCashflow(item.id)} className="text-red-600 hover:text-red-800 font-medium text-xs">Hapus</button>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">-</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                            {searchQuery ? `Tidak ada transaksi dengan kata kunci "${searchQuery}"` : 'Belum ada transaksi di kategori ini'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {transactions?.links && <Pagination links={transactions.links} />}
            </div>
        </Layout>
    );
}