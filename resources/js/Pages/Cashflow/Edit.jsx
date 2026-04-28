import React from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';

export default function CashflowEdit({ cashflow, types }) {
    const { data, setData, put, errors, processing } = useForm({
        date: cashflow.date,
        type: cashflow.type,
        amount: cashflow.amount,
        description: cashflow.description,
        notes: cashflow.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('cashflow.update', cashflow.id));
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
                    <h1 className="text-2xl font-bold text-gray-900">Edit Transaksi Cashflow</h1>
                    <p className="text-gray-600 text-sm mt-1">Perbarui detail transaksi</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    {/* Error Alert */}
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="font-semibold text-red-800 mb-2">Terjadi kesalahan:</p>
                            <ul className="list-disc list-inside space-y-1">
                                {Object.values(errors).map((error, idx) => (
                                    <li key={idx} className="text-red-600 text-sm">{error}</li>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
                    </div>

                    {/* Tipe Transaksi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            {Object.entries(types).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type}</p>}
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                        <input
                            type="text"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Contoh: Sewa hari ini, Biaya perbaikan, dll"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
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
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes}</p>}
                    </div>

                    {/* Info Balance */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                            <span className="font-semibold">Saldo Saat Ini:</span> {formatCurrency(cashflow.balance_after)}
                        </p>
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
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
                        >
                            {processing ? 'Menyimpan...' : 'Perbarui Transaksi'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
