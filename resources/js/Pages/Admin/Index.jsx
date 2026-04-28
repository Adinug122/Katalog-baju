import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router, useForm } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'

export default function Index({ auth, admins }) {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Inisialisasi Form Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '', 
        password: '',
        password_confirmation: '',
    });

    const toggleStatus = (id) => {
        if (confirm('Apakah ingin mengubah status?')) {
            router.post(route('manage.admin', id));
        }
    };

    const submitAdmin = (e) => {
        e.preventDefault();
        post(route('admin.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset(); 
            },
        });
    };

    const hasil = (admins, key) => {
        if (!key) return admins;
        return admins.filter((item) =>
            item.name.toLowerCase().includes(key.toLowerCase()) ||
            item.email.toLowerCase().includes(key.toLowerCase()) ||
            (item.phone && item.phone.includes(key)) 
        );
    };

    const filtered = hasil(admins, search);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Akun Admin</h2>}
        >
            <Head title='Kelola Admin' />
            
            <div className='py-12 px-6'>
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6">
                    <input 
                        type="text"
                        className='rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-primary focus:ring-primary w-64'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Cari nama, email, atau HP...'
                    />

                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Tambah Admin
                    </button>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nama & Email</th>
                                {/* Kolom Phone baru menggantikan Verifikasi */}
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">No. Telepon</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered?.length > 0 ? (
                                filtered.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-800">{admin.name}</div>
                                            <div className="text-xs text-slate-500">{admin.email}</div>
                                        </td>
                                        {/* Menampilkan Phone di kolom sendiri */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm text-slate-600 font-medium">
                                                {admin.phone || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight
                                                ${admin.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${admin.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {admin.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Button
                                                size="sm"
                                                onClick={() => toggleStatus(admin.id)}
                                                className={`text-white font-bold transition-all ${admin.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:opacity-90'}`}
                                            >
                                                {admin.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-6 py-12 text-center text-sm text-slate-400" colSpan={4}>Data admin tidak ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Admin */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Tambah Admin Baru</h3>
                            <p className="text-sm text-slate-500 mb-6">Akun yang dibuat akan otomatis aktif.</p>
                            
                            <form onSubmit={submitAdmin} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-lg border-slate-200 text-sm focus:border-primary focus:ring-primary"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Contoh: Admin Pusat"
                                    />
                                    {errors.name && <div className="text-red-500 text-[11px] mt-1 font-medium">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Alamat Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full rounded-lg border-slate-200 text-sm focus:border-primary focus:ring-primary"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="admin@gym.com"
                                    />
                                    {errors.email && <div className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nomor WhatsApp / HP</label>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-lg border-slate-200 text-sm focus:border-primary focus:ring-primary"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        placeholder="081234567890"
                                    />
                                    {errors.phone && <div className="text-red-500 text-[11px] mt-1 font-medium">{errors.phone}</div>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                                        <input 
                                            type="password" 
                                            className="w-full rounded-lg border-slate-200 text-sm focus:border-primary focus:ring-primary"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                        />
                                        {errors.password && <div className="text-red-500 text-[11px] mt-1 font-medium">{errors.password}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Konfirmasi</label>
                                        <input 
                                            type="password" 
                                            className="w-full rounded-lg border-slate-200 text-sm focus:border-primary focus:ring-primary"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-sidebar-primary text-white px-8 py-2 rounded-lg font-bold hover:opacity-90 shadow-md transition-all"
                                    >
                                        {processing ? 'Memproses...' : 'Simpan Admin'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    )
}