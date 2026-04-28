import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import { BarChart, Bar,reportData, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ReportsDashboard({ summary, time_range, start_date, end_date, filters }) {
    const { data, setData, get, processing } = useForm({
        range: time_range || '30',
    });

    const handleRangeChange = (range) => {
        setData('range', range);
        get(route('reports.dashboard'), { preserveScroll: true });
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num || 0);
    };

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return (
        <Layout>
            <div className="py-6 px-4 sm:px-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Laporan</h1>
                    <p className="text-gray-600 text-sm mt-1">Ringkasan performa bisnis rental baju</p>
                </div>

                {/* Filter Range */}
                <div className="mb-6 flex gap-2 flex-wrap">
                    {[
                        { key: '7h', label: '7 Hari' },
                        { key: '30h', label: '30 Hari' },
                        { key: '90h', label: '90 Hari' },
                        { key: 'all', label: 'Semua Data' },
                    ].map((range) => (
                        <button
                            key={range.key}
                            onClick={() => handleRangeChange(range.key)}
                            disabled={processing}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                data.range === range.key
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } disabled:opacity-50`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    {/* Total Pesanan */}
                    <div className="bg-white rounded-lg shadow p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Pesanan</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{summary?.total_orders || 0}</p>
                            </div>
                            <div className="bg-blue-100 rounded-lg p-3">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Pesanan Terbayar */}
                    <div className="bg-white rounded-lg shadow p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Pesanan Selesai</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{summary?.completed_orders || 0}</p>
                            </div>
                            <div className="bg-green-100 rounded-lg p-3">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Pendapatan */}
                    <div className="bg-white rounded-lg shadow p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Pendapatan</p>
                                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(summary?.revenue || 0)}</p>
                            </div>
                            <div className="bg-emerald-100 rounded-lg p-3">
                                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.16 2.75a.75.75 0 00-1.32 0l-3.5 9.5A.75.75 0 004.5 13h11a.75.75 0 00.66-1.25l-3.5-9.5z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Denda */}
                    <div className="bg-white rounded-lg shadow p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Denda</p>
                                <p className="text-lg font-bold text-orange-600 mt-1">{formatCurrency(summary?.total_fines || 0)}</p>
                            </div>
                            <div className="bg-orange-100 rounded-lg p-3">
                                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Piutang DP */}
                    <div className="bg-white rounded-lg shadow p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Terlambat</p>
                                <p className="text-lg font-bold text-red-600 mt-1">{summary?.late_orders || 0}</p>
                            </div>
                            <div className="bg-red-100 rounded-lg p-3">
                                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 2a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 3H3zM5 16a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Revenue Chart */}
                    {reportData.revenueChart && reportData.revenueChart.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pendapatan Bulanan</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={reportData.revenueChart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Bar dataKey="revenue" fill="#3B82F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Order Volume Chart */}
                    {reportData.volumeChart && reportData.volumeChart.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Pesanan Bulanan</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={reportData.volumeChart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Category Revenue & Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue by Category */}
                    {reportData.categoryRevenue && reportData.categoryRevenue.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pendapatan per Kategori</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={reportData.categoryRevenue}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="revenue"
                                    >
                                        {reportData.categoryRevenue.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Top 5 Products */}
                    {reportData.topProducts && reportData.topProducts.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Produk Terlaris</h3>
                            <div className="space-y-3">
                                {reportData.topProducts.map((product, idx) => (
                                    <div key={idx} className="flex items-center justify-between border-b pb-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{idx + 1}. {product.name}</p>
                                            <p className="text-sm text-gray-600">{product.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{product.rent_count}x</p>
                                            <p className="text-sm text-gray-600">{formatCurrency(product.revenue)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
