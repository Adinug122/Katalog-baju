import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ReportsRevenue({ revenueData, categories, filters }) {
    const { data, setData, get, processing } = useForm({
        range: filters.range || '30h',
        groupBy: filters.groupBy || 'month',
        categoryId: filters.categoryId || 'all',
    });

    const handleRangeChange = (range) => {
        setData('range', range);
        get(route('reports.revenue'), { preserveScroll: true });
    };

    const handleGroupByChange = (groupBy) => {
        setData('groupBy', groupBy);
        get(route('reports.revenue'), { preserveScroll: true });
    };

    const handleCategoryChange = (categoryId) => {
        setData('categoryId', categoryId);
        get(route('reports.revenue'), { preserveScroll: true });
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num || 0);
    };

    const totalRevenue = revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalOrders = revenueData.reduce((sum, item) => sum + (item.order_count || 0), 0);
    const avgRevenuePerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return (
        <Layout>
            <div className="py-6 px-4 sm:px-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Pendapatan</h1>
                    <p className="text-gray-600 text-sm mt-1">Analisis pendapatan berdasarkan periode dan kategori</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                            <div className="flex gap-2 flex-wrap">
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
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Group By Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kelompokkan Berdasarkan</label>
                            <select
                                value={data.groupBy}
                                onChange={(e) => handleGroupByChange(e.target.value)}
                                disabled={processing}
                                className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="month">Per Bulan</option>
                                <option value="category">Per Kategori</option>
                                <option value="week">Per Minggu</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                            <select
                                value={data.categoryId}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                disabled={processing}
                                className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-700 font-medium">Total Pendapatan</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-700 font-medium">Total Pesanan</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{totalOrders}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-purple-700 font-medium">Rata-rata per Pesanan</p>
                        <p className="text-xl font-bold text-purple-600 mt-1">{formatCurrency(avgRevenuePerOrder)}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-700 font-medium">Periode</p>
                        <p className="text-lg font-bold text-amber-600 mt-1 capitalize">{
                            data.range === '7h' ? '7 Hari' :
                            data.range === '30h' ? '30 Hari' :
                            data.range === '90h' ? '90 Hari' :
                            'Semua Data'
                        }</p>
                    </div>
                </div>

                {/* Chart */}
                {revenueData && revenueData.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Pendapatan {
                                data.groupBy === 'month' ? 'Per Bulan' :
                                data.groupBy === 'category' ? 'Per Kategori' :
                                'Per Minggu'
                            }
                        </h3>
                        <ResponsiveContainer width="100%" height={350}>
                            {data.groupBy === 'category' ? (
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#10B981" name="Pendapatan" />
                                </BarChart>
                            ) : (
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="label" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Pendapatan" />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Detail Table */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    {revenueData.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        {
                                            data.groupBy === 'month' ? 'Bulan' :
                                            data.groupBy === 'category' ? 'Kategori' :
                                            'Minggu'
                                        }
                                    </th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Jumlah Pesanan</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Pendapatan</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Rata-rata</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Persentase</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {revenueData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {row.label || row.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-600">
                                            {row.order_count || row.count}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-green-600">
                                            {formatCurrency(row.revenue)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-700">
                                            {formatCurrency((row.revenue) / (row.order_count || row.count || 1))}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-semibold text-gray-800">
                                            {((row.revenue / totalRevenue) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <p className="text-gray-600 font-medium">Tidak ada data pendapatan dalam periode ini</p>
                            <p className="text-gray-500 text-sm mt-1">Coba ubah filter atau periode</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
