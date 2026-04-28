import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';

export default function ReportsDebt({ orders, total_debt, filters }) {
    const { data, setData, get, processing } = useForm({
        range: filters?.range || '30',
        sort: filters?.sort || 'outstanding_desc',
    });

    const handleRangeChange = (range) => {
        setData('range', range);
        get(route('reports.debt'), { preserveScroll: true });
    };

    const handleSortChange = (sort) => {
        setData('sort', sort);
        get(route('reports.debt'), { preserveScroll: true });
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num || 0);
    };

    const totalOutstanding = total_debt || 0;
    const totalDP = (orders?.data || orders || []).reduce((sum, order) => sum + (order.down_payment || 0), 0);

    return (
        <Layout>
            <div className="py-6 px-4 sm:px-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Piutang DP</h1>
                    <p className="text-gray-600 text-sm mt-1">Daftar pesanan dengan pembayaran DP tertunggak</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                            <div className="flex gap-2">
                                {[
                                    { key: '7h', label: '7 Hari' },
                                    { key: '30h', label: '30 Hari' },
                                    { key: '90h', label: '90 Hari' },
                                    { key: 'all', label: 'Semua' },
                                ].map((range) => (
                                    <button
                                        key={range.key}
                                        onClick={() => handleRangeChange(range.key)}
                                        disabled={processing}
                                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                                            data.range === range.key
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
                            <select
                                value={data.sort}
                                onChange={(e) => handleSortChange(e.target.value)}
                                disabled={processing}
                                className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="outstanding_desc">Sisa Terbesar</option>
                                <option value="outstanding_asc">Sisa Terkecil</option>
                                <option value="dp_desc">DP Terbesar</option>
                                <option value="date_newest">Tanggal Sewa (Terbaru)</option>
                                <option value="date_oldest">Tanggal Sewa (Tertua)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700 font-medium">Total Piutang DP</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalOutstanding)}</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-sm text-orange-700 font-medium">Total DP Diterima</p>
                        <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(totalDP)}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700 font-medium">Jumlah Order</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{debtOrders.length}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    {(orders?.data || orders || []).length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">No. Invoice</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nama Pelanggan</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kontak</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Total Tagihan</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">DP Diterima</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Sisa Pembayaran</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tanggal Sewa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {(orders?.data || orders || []).map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-mono font-semibold text-blue-600">
                                            {order.invoice_code}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{order.customer_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{order.customer_phone}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                                            {formatCurrency(order.total_price)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-green-600 font-semibold">
                                            {formatCurrency(order.down_payment)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-right">
                                            <span className="text-red-600">{formatCurrency(order.remaining_payment)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.rent_date).toLocaleDateString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-600 font-medium">Tidak ada piutang DP</p>
                            <p className="text-gray-500 text-sm mt-1">Semua pesanan sudah lunas!</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
