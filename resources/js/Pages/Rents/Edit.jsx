import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';

export default function RentsEdit({ rent, clothes }) {
    const { data, setData, put, errors, processing } = useForm({
        customer_name: rent.customer_name,
        customer_phone: rent.customer_phone,
        customer_ktp: rent.customer_ktp || '',
        rent_date: rent.rent_date,
        return_date: rent.return_date,
        down_payment: rent.down_payment || 0,
        note: rent.note || '',
        items: rent.rent_items.map(item => ({
            clothes_id: item.clothes_id,
            quantity: item.quantity,
        })),
    });

    // Auto-adjust return_date to minimum 3 days from rent_date
    useEffect(() => {
        if (data.rent_date) {
            const rentDate = new Date(data.rent_date);
            const minReturnDate = new Date(rentDate);
            minReturnDate.setDate(minReturnDate.getDate() + 3);
            
            const formatted = minReturnDate.toISOString().split('T')[0];
            
            if (!data.return_date || new Date(data.return_date) < minReturnDate) {
                setData('return_date', formatted);
            }
        }
    }, [data.rent_date]);

    // Calculate total price
    const getTotalPrice = () => {
        const rentDate = new Date(data.rent_date);
        const returnDate = new Date(data.return_date);
        const days = Math.max(3, Math.ceil((returnDate - rentDate) / (1000 * 60 * 60 * 24)));

        let pricePerDay = 0;
        data.items.forEach(item => {
            const clothe = clothes.find(c => c.id === item.clothes_id);
            if (clothe) {
                pricePerDay += clothe.price * item.quantity;
            }
        });

        return pricePerDay * Math.max(3, days);
    };

    const rentDays = data.rent_date && data.return_date 
        ? Math.max(3, Math.ceil((new Date(data.return_date) - new Date(data.rent_date)) / (1000 * 60 * 60 * 24)))
        : 0;

    const totalPrice = getTotalPrice();

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('rents.update', rent.id));
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
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Pesanan Sewa</h1>
                    <p className="text-gray-600 text-sm mt-1">Invoice: <span className="font-mono font-semibold text-blue-600">{rent.invoice_code}</span></p>
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

                    {/* Info Status */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900">
                            <span className="font-semibold">Status Pesanan:</span> {rent.status === 'active' ? 'Aktif' : rent.status === 'dikembalikan' ? 'Dikembalikan' : rent.status}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">Anda hanya dapat mengubah informasi pelanggan, tanggal, dan pembayaran. Untuk mengubah item, silakan buat pesanan baru.</p>
                    </div>

                    {/* Customer Info Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pelanggan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Pelanggan</label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.customer_name && <p className="text-red-600 text-sm mt-1">{errors.customer_name}</p>}
                            </div>

                            {/* No. Telepon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon / WA</label>
                                <input
                                    type="tel"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    placeholder="08xx"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.customer_phone && <p className="text-red-600 text-sm mt-1">{errors.customer_phone}</p>}
                            </div>

                            {/* KTP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">No. KTP / Identitas</label>
                                <input
                                    type="text"
                                    value={data.customer_ktp}
                                    onChange={(e) => setData('customer_ktp', e.target.value)}
                                    placeholder="Nomor identitas pelanggan"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.customer_ktp && <p className="text-red-600 text-sm mt-1">{errors.customer_ktp}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Tanggal Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tanggal Sewa</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tanggal Sewa */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Sewa</label>
                                <input
                                    type="date"
                                    value={data.rent_date}
                                    onChange={(e) => setData('rent_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.rent_date && <p className="text-red-600 text-sm mt-1">{errors.rent_date}</p>}
                            </div>

                            {/* Tanggal Kembali */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kembali (Min. 3 Hari)</label>
                                <input
                                    type="date"
                                    value={data.return_date}
                                    onChange={(e) => setData('return_date', e.target.value)}
                                    min={data.rent_date ? new Date(new Date(data.rent_date).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.return_date && <p className="text-red-600 text-sm mt-1">{errors.return_date}</p>}
                                {data.rent_date && <p className="text-xs text-gray-600 mt-1">Total sewa: {rentDays} hari</p>}
                            </div>
                        </div>
                    </div>

                    {/* Items Section - Read Only */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Sewa</h3>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-amber-900">Item tidak dapat diubah dalam edit pesanan. Jika ingin mengubah item, silakan buat pesanan baru.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Produk</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-900">Harga/Hari</th>
                                        <th className="px-4 py-2 text-center font-semibold text-gray-900">Qty</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-900">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {data.items.map((item, idx) => {
                                        const clothe = clothes.find(c => c.id === item.clothes_id);
                                        return (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">{clothe?.name || 'Item tidak ditemukan'}</td>
                                                <td className="px-4 py-2 text-right">{formatCurrency(clothe?.price || 0)}</td>
                                                <td className="px-4 py-2 text-center">{item.quantity}</td>
                                                <td className="px-4 py-2 text-right font-semibold">
                                                    {formatCurrency((clothe?.price || 0) * item.quantity)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pembayaran</h3>
                        <div className="space-y-4">
                            {/* Total Tagihan */}
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700">Total Tagihan:</span>
                                    <span className="text-lg font-bold text-gray-900">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>

                            {/* DP Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment (DP)</label>
                                <div className="flex items-center">
                                    <span className="text-gray-600 mr-2">Rp</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.down_payment}
                                        onChange={(e) => setData('down_payment', parseInt(e.target.value) || 0)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                {errors.down_payment && <p className="text-red-600 text-sm mt-1">{errors.down_payment}</p>}
                            </div>

                            {/* Sisa Pembayaran */}
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-700">Sisa Pembayaran:</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {formatCurrency(totalPrice - (data.down_payment || 0))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Catatan */}
                    <div className="border-t pt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Khusus</label>
                        <textarea
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            placeholder="Instruksi khusus atau catatan untuk pesanan ini..."
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.note && <p className="text-red-600 text-sm mt-1">{errors.note}</p>}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <a
                            href={route('rents.index')}
                            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            Batal
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
            {clothes.map((item) => <option key={item.kode} value={item.kode}>{item.name}</option>)}
          </select>
          <input value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} className="rounded border px-2 py-1" placeholder="Nama pelanggan" required />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <input value={data.customer_phone} onChange={(e) => setData('customer_phone', e.target.value)} className="rounded border px-2 py-1" placeholder="No. Telepon" required />
          <input type="date" value={data.rent_date} onChange={(e) => setData('rent_date', e.target.value)} className="rounded border px-2 py-1" required />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <input type="date" value={data.return_date} onChange={(e) => setData('return_date', e.target.value)} className="rounded border px-2 py-1" required />
          <input type="number" value={data.denda} onChange={(e) => setData('denda', e.target.value)} className="rounded border px-2 py-1" required />
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Harga Sewa / Hari</label>
            <input type="number" value={data.rent_price} readOnly className="rounded border bg-slate-100 px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Total Harga</label>
            <input type="number" value={data.total_price} readOnly className="rounded border bg-slate-100 px-2 py-1" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Tanggal Kembali Aktual (opsional)</label>
          <input
            type="date"
            value={data.actual_return_date}
            onChange={(e) => setData('actual_return_date', e.target.value)}
            className="mt-1 w-full rounded border px-2 py-1"
          />
          {errors.actual_return_date && <p className="text-xs text-red-500">{errors.actual_return_date}</p>}
        </div>

        <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="rounded border px-2 py-1">
          <option value="booked">Booked</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {errors && Object.values(errors).map((msg) => <p key={msg} className="text-xs text-red-500">{msg}</p>)}
        <button disabled={processing} className="rounded px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700 transition">Update</button>
      </form>
    </div>
  );
}

RentsEdit.layout = (page) => <Layout>{page}</Layout>;