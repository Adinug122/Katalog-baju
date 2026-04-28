import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';

export default function ReportsLateOrders({ orders, filters }) {
    const lateOrders = orders?.data || orders || [];
    const { data, setData, get, processing } = useForm({
        range: filters?.range || '30',
        sort: filters?.sort || 'return_date',
    });

    const handleRangeChange = (range) => {
        setData('range', range);
        get(route('reports.late'), { preserveScroll: true });
    };

    const handleSortChange = (sort) => {
        setData('sort', sort);
        get(route('reports.late'), { preserveScroll: true });
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num || 0);
    };

    const getStatusColor = (status) => {
        const colors = {
            'terlambat': 'bg-red-100 text-red-800',
            'belum_dikembalikan': 'bg-orange-100 text-orange-800',
            'dikembalikan': 'bg-green-100 text-green-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <Layout>
            <div className="py-6 px-4 sm:px-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Pesanan Terlambat</h1>
                    <p className="text-gray-600 text-sm mt-1">Daftar pesanan yang melampaui jadwal pengembalian</p>
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
                                <option value="days_late_desc">Hari Terlambat (Tertinggi)</option>
                                <option value="days_late_asc">Hari Terlambat (Terendah)</option>
                                <option value="fine_amount_desc">Denda (Tertinggi)</option>
                                <option value="date_asc">Tanggal Kembali (Tertua)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700 font-medium">Total Terlambat</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{lateOrders.length}</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-sm text-orange-700 font-medium">Rata-rata Hari Terlambat</p>
                        <p className="text-2xl font-bold text-orange-600 mt-1">
                            {lateOrders.length > 0
                                ? (lateOrders.reduce((sum, order) => sum + (order.late_days || 0), 0) / lateOrders.length).toFixed(1)
                                : 0}
                            <span className="text-sm"> hari</span>
                        </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-700 font-medium">Total Denda Estimasi</p>
                        <p className="text-lg font-bold text-yellow-600 mt-1">
                            {formatCurrency(
                                lateOrders.reduce((sum, order) => sum + (order.estimated_fine || 0), 0)
                            )}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    {lateOrders.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">No. Invoice</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nama Pelanggan</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tanggal Kembali</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Hari Terlambat</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Denda/Hari</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Est. Denda</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {lateOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-mono font-semibold text-blue-600">
                                            {order.invoice_code}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{order.customer_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.return_date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-red-600 text-right">
                                            {order.late_days} hari
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-700">
                                            {formatCurrency(order.fine_per_day)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-right text-orange-600">
                                            {formatCurrency(order.estimated_fine)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status === 'terlambat' && 'Terlambat'}
                                                {order.status === 'belum_dikembalikan' && 'Belum Dikembalikan'}
                                                {order.status === 'dikembalikan' && 'Dikembalikan'}
                                            </span>
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
                            <p className="text-gray-600 font-medium">Tidak ada pesanan terlambat dalam periode ini</p>
                            <p className="text-gray-500 text-sm mt-1">Semua pesanan kembali tepat waktu!</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
