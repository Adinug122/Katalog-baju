import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    Package, CheckCircle, ShoppingCart, Wallet, TrendingUp, BarChart3, Trophy 
} from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
    BarElement, Title, Tooltip, Filler, Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, 
    BarElement, Title, Tooltip, Filler, Legend
);

export default function Dashboard({ metrics, monthly_sales = [], top_rented = [], auth_role }) {
    const goldColor = '#C9A834';
    
    // Konfigurasi Font Global untuk Chart.js (Inter)
    const chartFontConfig = {
        family: "'Inter', sans-serif",
        size: 11,
        weight: '500'
    };

    // Pastikan revenue adalah angka murni untuk grafik
    const chartDataItems = monthly_sales.map(m => ({
        label: m.label,
        revenue: Number(m.revenue) || 0
    }));

    // 1. Konfigurasi Line Chart
    const lineChartData = {
        labels: chartDataItems.map((m) => m.label),
        datasets: [
            {
                fill: true,
                label: 'Pendapatan',
                data: chartDataItems.map((m) => m.revenue),
                borderColor: goldColor,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(201, 168, 52, 0.2)');
                    gradient.addColorStop(1, 'rgba(201, 168, 52, 0)');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                // FIX: Jika data cuma 1, munculkan titik agar tidak kosong
                pointRadius: chartDataItems.length === 1 ? 6 : 2, 
                pointHoverRadius: 8,
                pointBackgroundColor: goldColor,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
        ],
    };

    // 2. Konfigurasi Bar Chart
    const barChartData = {
        labels: chartDataItems.map((m) => m.label),
        datasets: [
            {
                label: 'Revenue',
                data: chartDataItems.map((m) => m.revenue),
                backgroundColor: '#1E293B',
                borderRadius: 6,
                hoverBackgroundColor: goldColor,
            },
        ],
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1E293B',
                titleColor: goldColor,
                titleFont: chartFontConfig,
                bodyFont: chartFontConfig,
                padding: 12,
                cornerRadius: 10,
                displayColors: false,
                callbacks: {
                    label: (context) => `Rp ${context.parsed.y.toLocaleString('id-ID')}`
                }
            },
        },
        scales: {
            x: { 
                grid: { display: false }, 
                ticks: { font: chartFontConfig, color: '#64748b' } 
            },
            y: { 
                beginAtZero: true, // FIX: Mulai dari angka 0
                border: { display: false },
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { 
                    font: chartFontConfig,
                    color: '#64748b',
                    callback: (value) => value >= 1000000 ? (value / 1000000) + 'jt' : value.toLocaleString('id-ID')
                } 
            },
        },
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-10 bg-[#F8F9FA] min-h-screen font-body">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                Overview <span className="text-[#C9A834]">Performance</span>
                            </h1>
                            <p className="text-slate-500 mt-1">Laporan statistik bisnis Anda sudah siap untuk dianalisis.</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard 
                            title="Total Produk" 
                            value={metrics.total_clothes} 
                            icon={<Package className="text-[#C9A834]" />} 
                            desc="Koleksi baju saat ini"
                        />
                        <StatCard 
                            title="Produk Aktif" 
                            value={metrics.active_clothes} 
                            icon={<CheckCircle className="text-[#C9A834]" />} 
                            desc="Tersedia untuk disewa"
                        />
                        <StatCard 
                            title="Sewa Tahun Ini" 
                            value={metrics.this_year_rents} 
                            icon={<ShoppingCart className="text-[#C9A834]" />} 
                            desc="Total transaksi berhasil"
                        />
                        {auth_role === 'owner' && (
                            <StatCard 
                                title="Revenue" 
                                value={`Rp ${Number(metrics.current_year_revenue).toLocaleString('id-ID')}`} 
                                icon={<Wallet className="text-[#C9A834]" />} 
                                desc="Pendapatan kotor tahun ini"
                                highlight
                            />
                        )}
                    </div>

                    {/* Charts Section */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <TrendingUp className="w-5 h-5 text-[#C9A834]" />
                                <h3 className="text-lg font-bold text-slate-800">Analisis Pendapatan</h3>
                            </div>
                            <div className="h-[350px]">
                                {chartDataItems.length > 0 ? (
                                    <Line data={lineChartData} options={commonOptions} />
                                ) : (
                                    <EmptyState />
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 className="w-5 h-5 text-[#C9A834]" />
                                <h3 className="text-lg font-bold text-slate-800">Volume Bulanan</h3>
                            </div>
                            <div className="flex-1 min-h-[300px]">
                                {chartDataItems.length > 0 ? (
                                    <Bar data={barChartData} options={commonOptions} />
                                ) : (
                                    <EmptyState />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Top Products Table */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-[#C9A834]" />
                                <h3 className="text-lg font-bold text-slate-800">Top 5 Baju Terpopuler</h3>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Nama Produk</th>
                                        <th className="px-6 py-4 font-bold text-center">Frekuensi Sewa</th>
                                        <th className="px-6 py-4 font-bold text-right">Label Kode</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {top_rented.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{item.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-[#C9A834] border border-[#C9A834]/20">
                                                    {item.rented_count}x Sewa
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                                    {item.kode}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Sub-komponen Card
function StatCard({ title, value, icon, desc, highlight = false }) {
    return (
        <div className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${highlight ? 'bg-slate-900 border-slate-800 shadow-xl shadow-[#C9A834]/10' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${highlight ? 'bg-slate-800' : 'bg-[#C9A834]/10'}`}>
                {icon}
            </div>
            <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
                <h4 className={`text-2xl font-black mt-1 ${highlight ? 'text-white' : 'text-slate-900'}`}>{value}</h4>
                <p className="text-[10px] font-medium mt-2 text-[#C9A834] opacity-80">{desc}</p>
            </div>
        </div>
    );
}

// Sub-komponen Loading/Empty
function EmptyState() {
    return (
        <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-sm italic">
            Belum ada data tersedia
        </div>
    );
}