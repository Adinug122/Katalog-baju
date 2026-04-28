import React from 'react';
import { useForm,usePage } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';

export default function CashflowCreate({ types }) {
    // 1. TAMBAHKAN sumber_dana DI SINI BIAR GAK ERROR REQUIRED
    const { data, setData, post, errors, processing } = useForm({
        date: new Date().toISOString().split('T')[0],
        type: 'income',
        sumber_dana: 'operasional',
        amount: '',
        description: '',
        notes: '',
    });

    const {flash} = usePage().props;
  
    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        
        if (selectedType === 'initial_capital') {
            setData({ ...data, type: selectedType, sumber_dana: 'modal' });
        } else if (selectedType === 'income') {
            setData({ ...data, type: selectedType, sumber_dana: 'operasional' });
        } else {
            // Kalau Pengeluaran, biarkan admin milih
            setData('type', selectedType);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('cashflow.store'));
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num || 0);
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Transaksi Cashflow Baru</h1>
                    <p className="text-gray-600 text-sm mt-1">Catat transaksi modal, pemasukan, atau pengeluaran</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                 
                    {flash?.error && (
                        <div className="bg-red-600 border border-red-700 rounded-lg p-4 shadow-sm animate-pulse">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="font-bold text-white text-sm">{flash.error}</p>
                            </div>
                        </div>
                    )}

                    {/* Error Validasi Form (Tetap Ada) */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="font-semibold text-red-800 mb-2 text-sm">Cek kembali isian Anda:</p>
                            <ul className="list-disc list-inside space-y-1">
                                {Object.values(errors).map((error, idx) => (
                                    <li key={idx} className="text-red-600 text-xs">{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Tanggal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Transaksi</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                        />
                        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
                    </div>

               
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
                        <select
                            value={data.type}
                            onChange={handleTypeChange} // <--- Pakai fungsi pintar di sini
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                        >
                            {Object.entries(types).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
                    </div>
                    
                    {/* Sumber Dana (Laci) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sumber Dana / Laci Penyimpanan</label>
                        <select
                            value={data.sumber_dana}
                            onChange={(e) => setData('sumber_dana', e.target.value)}
                            disabled={data.type !== 'expense'}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary ${data.type !== 'expense' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="operasional">Laci Operasional (Uang Hasil Sewa)</option>
                            <option value="modal">Laci Modal (Dana Cadangan / Suntikan)</option>
                        </select>
                        
                        {/* Pesan Bantuan UI (Supaya admin ngerti kenapa kekunci) */}
                        {data.type === 'initial_capital' && <p className="text-xs text-amber-600 mt-1 font-medium">Otomatis masuk ke Brankas Modal.</p>}
                        {data.type === 'income' && <p className="text-xs text-green-600 mt-1 font-medium">Otomatis masuk ke Laci Operasional.</p>}
                        {data.type === 'expense' && <p className="text-xs text-red-600 mt-1 font-medium">Silakan pilih uang laci mana yang mau dipakai bayar.</p>}
                        
                        {errors.sumber_dana && <p className="text-red-600 text-sm mt-1">{errors.sumber_dana}</p>}
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                        <input
                            type="text"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Contoh: Sewa hari ini, Biaya perbaikan, dll"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                        />
                        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Jumlah */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah (Rp)</label>
                        <div className="flex items-center">
                            <span className="text-gray-600 mr-2">Rp</span>
                            <input
                                type="number"
                                min="0"
                                value={data.amount}
                                onChange={(e) => setData('amount', parseInt(e.target.value) || '')}
                                placeholder="0"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                            />
                        </div>
                        {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
                        {data.amount && (
                            <p className="text-green-600 text-sm mt-2 font-semibold">
                                {formatCurrency(data.amount)}
                            </p>
                        )}
                    </div>

                    {/* Catatan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Tambahan info atau detail transaksi..."
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                        />
                        {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes}</p>}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 justify-end pt-4">
                        <a
                            href={route('cashflow.index')}
                            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            Batal
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-sidebar-accent disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}