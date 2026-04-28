import { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';

// ─── Icon kecil ──────────────────────────────────────────────────────────────
const IconPlus   = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>;
const IconTrash  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2-3h6a1 1 0 011 1H8a1 1 0 011-1h2z"/></svg>;
const IconSearch = () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>;
const IconTag    = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 014-4z"/></svg>;


const toLocalDate = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const addDays = (dateStr, days) => {
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(date.getDate() + days);
    return toLocalDate(date);
};

const makeItem = (clothes) => ({
    kode:  clothes?.kode  ?? '',
    qty:   1,
    price: clothes?.price ?? 0,
    name:  clothes?.name  ?? '',
    stock: clothes?.stock ?? 0,
});

const rp = (n) => 'Rp ' + (n || 0).toLocaleString('id-ID');

// ─── Komponen utama ───────────────────────────────────────────────────────────
export default function RentsCreate({ clothes }) {
    const { data, setData, post, errors, processing } = useForm({
        customer_name:  '',
        customer_phone: '',
        customer_ktp:   '',
        rent_date:      '',
        return_date:    '',
        down_payment:   0,
        note:           '',
        items: [makeItem(clothes[0])],
    });

    const [keywords, setKeywords] = useState(['']);

    const today = toLocalDate();

    const rentDays = useMemo(() => {
        if (!data.rent_date || !data.return_date) return 0;
        const start = new Date(data.rent_date + 'T00:00:00');
        const end   = new Date(data.return_date + 'T00:00:00');
        const diff  = Math.round((end - start) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    }, [data.rent_date, data.return_date]);

    const periods = useMemo(() => Math.ceil(rentDays / 3) || 0, [rentDays]);

    useEffect(() => {
        if (!data.rent_date) return;
        const minStr = addDays(data.rent_date, 3);
        if (!data.return_date || data.return_date < minStr) {
            setData('return_date', minStr);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.rent_date]);

    const minReturnDate = data.rent_date ? addDays(data.rent_date, 3) : '';

    const usedKodes = useMemo(() => data.items.map((i) => i.kode), [data.items]);

    const filteredFor = useCallback(
        (index) => {
            const kw  = keywords[index]?.toLowerCase() ?? '';
            const own = data.items[index]?.kode;
            return clothes.filter(
                (c) =>
                    (c.kode === own || !usedKodes.includes(c.kode)) &&
                    (c.name?.toLowerCase().includes(kw) || c.kode?.toLowerCase().includes(kw)||
                    c.category?.toLowerCase().includes(kw))
            );
        },
        [clothes, keywords, usedKodes]
    );

    const itemSubtotal = (item) => item.price * periods * (item.qty || 0);

    const totalPrice = useMemo(
        () => data.items.reduce((acc, item) => acc + itemSubtotal(item), 0),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data.items, periods]
    );

    const sisa = Math.max(0, totalPrice - (data.down_payment || 0));

    const updateItem = (index, field, value) => {
        const next = data.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
        setData('items', next);
    };

    const selectCloth = (index, kode) => {
        const cloth = clothes.find((c) => c.kode === kode);
        const next  = data.items.map((item, i) =>
            i === index
                ? { ...item, kode, price: cloth?.price ?? 0, name: cloth?.name ?? '', stock: cloth?.stock ?? 0 }
                : item
        );
        setData('items', next);
    };

    const addItem = () => {
        const unused = clothes.find((c) => !usedKodes.includes(c.kode));
        if (!unused) return;
        setData('items', [...data.items, makeItem(unused)]);
        setKeywords((prev) => [...prev, '']);
    };

    const removeItem = (index) => {
        if (data.items.length <= 1) return;
        setData('items', data.items.filter((_, i) => i !== index));
        setKeywords((prev) => prev.filter((_, i) => i !== index));
    };

    function submit(e) {
        e.preventDefault();
        post(route('rents.store'));
    }

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-slate-800">Input Sewa Baru</h1>
                <p className="text-sm text-slate-500 mt-1">Harga dihitung per 3 hari (dibulatkan ke atas)</p>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-sm font-semibold text-red-700 mb-1">Terjadi kesalahan:</p>
                    <ul className="list-disc list-inside text-xs text-red-600 space-y-0.5">
                        {Object.values(errors).map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">

                {/* BLOK 1 — DAFTAR PRODUK */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                            Produk yang Disewa
                        </h2>
                        <span className="text-xs text-slate-400">{data.items.length} item</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {data.items.map((item, index) => {
                            const filtered = filteredFor(index);
                            const subtotal = itemSubtotal(item);
                            const hasErr   = errors[`items.${index}.kode`] || errors[`items.${index}.qty`];

                            return (
                                <div key={index} className="px-5 py-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                            <IconTag /> Produk {index + 1}
                                        </span>
                                        {data.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <IconTrash /> Hapus
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Cari baju</label>
                                            <div className="relative">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2">
                                                    <IconSearch />
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="Ketik nama / kode..."
                                                    value={keywords[index] ?? ''}
                                                    onChange={(e) => {
                                                        const next = [...keywords];
                                                        next[index] = e.target.value;
                                                        setKeywords(next);
                                                    }}
                                                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Pilih produk</label>
                                            <select
                                                value={item.kode}
                                                onChange={(e) => selectCloth(index, e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                                            >
                                                {filtered.length > 0 ? (
                                                    filtered.map((c) => (
                                                        <option key={c.kode} value={c.kode}>
                                                            {c.kode} — {c.name} (Stok: {c.stock})
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>Tidak ada baju tersedia</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-end gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Jumlah (Qty)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.stock || 99}
                                                value={item.qty}
                                                onChange={(e) => {
                                                    const raw = e.target.value;
                                                    const nextQty = raw === ''
                                                        ? ''
                                                        : Math.max(1, Math.min(item.stock || 99, parseInt(raw) || 1));
                                                    updateItem(index, 'qty', nextQty);
                                                }}
                                                className="w-24 rounded-lg border border-slate-300 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                                            />
                                        </div>

                                        <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                                            <span>
                                                Harga/3 hari:{' '}
                                                <strong className="text-slate-800">{rp(item.price)}</strong>
                                            </span>
                                            {periods > 0 && (
                                                <>
                                                    <span>Periode: <strong className="text-slate-800">{periods}×</strong></span>
                                                    <span>Qty: <strong className="text-slate-800">{item.qty}×</strong></span>
                                                    <span className="ml-auto font-semibold text-primary">= {rp(subtotal)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {hasErr && (
                                        <p className="text-xs text-red-600">
                                            {errors[`items.${index}.kode`] || errors[`items.${index}.qty`]}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
                        <button
                            type="button"
                            onClick={addItem}
                            disabled={usedKodes.length >= clothes.length}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <IconPlus /> Tambah Produk Lain
                        </button>
                    </div>
                </section>

                {/* BLOK 2 — DATA PELANGGAN */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Data Pelanggan</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Nama Pemesan</label>
                            <input
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.customer_name && <p className="text-xs text-red-600 mt-1">{errors.customer_name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">No. Telepon / WA</label>
                            <input
                                value={data.customer_phone}
                                onChange={(e) => setData('customer_phone', e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                                placeholder="0812xxxxxxxx"
                            />
                            {errors.customer_phone && <p className="text-xs text-red-600 mt-1">{errors.customer_phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Nomor KTP</label>
                            <input
                                type="text"
                                value={data.customer_ktp}
                                onChange={(e) => setData('customer_ktp', e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                                placeholder="16 digit nomor KTP"
                            />
                            {errors.customer_ktp && <p className="text-xs text-red-600 mt-1">{errors.customer_ktp}</p>}
                        </div>
                    </div>
                </section>

                {/* BLOK 3 — PERIODE SEWA */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Periode Sewa</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={data.rent_date}
                                onChange={(e) => setData('rent_date', e.target.value)}
                                min={today}
                                className="mt-1 w-full rounded-lg border border-slate-300 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                            />
                            {errors.rent_date && <p className="text-xs text-red-600 mt-1">{errors.rent_date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Tanggal Kembali</label>
                            <input
                                type="date"
                                value={data.return_date}
                                onChange={(e) => setData('return_date', e.target.value)}
                                min={minReturnDate}
                                className="mt-1 w-full rounded-lg border border-slate-300 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                            />
                            {errors.return_date && <p className="text-xs text-red-600 mt-1">{errors.return_date}</p>}
                        </div>
                    </div>

                    {rentDays > 0 && (
                        <div className="flex gap-3 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1">
                                📅 {rentDays} hari
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-3 py-1">
                                🔄 {periods} periode (@ 3 hari)
                            </span>
                        </div>
                    )}
                </section>

                {/* BLOK 4 — RINGKASAN & DP */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Ringkasan Pembayaran</h2>

                    {periods > 0 ? (
                        <div className="space-y-1.5">
                            {data.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm text-slate-600">
                                    <span>{item.name || item.kode} × {item.qty} qty × {periods} periode</span>
                                    <span>{rp(itemSubtotal(item))}</span>
                                </div>
                            ))}
                            <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-semibold text-slate-800">
                                <span>Total Tagihan</span>
                                <span className="text-primary">{rp(totalPrice)}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 italic">Pilih tanggal sewa untuk melihat total tagihan.</p>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Uang Muka / DP (Opsional)</label>
                        <input
                            type="number"
                            min="0"
                            max={totalPrice}
                            value={data.down_payment}
                            onChange={(e) => {
                                const raw = e.target.value;
                                const next = raw === ''
                                    ? ''
                                    : Math.max(0, Math.min(totalPrice, parseInt(raw) || 0));
                                setData('down_payment', next);
                            }}
                            className="mt-1 w-full rounded-lg border border-slate-300 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                            placeholder="Rp 0"
                        />
                        {errors.down_payment && <p className="text-xs text-red-600 mt-1">{errors.down_payment}</p>}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">Sisa Pembayaran</span>
                        <span className="text-lg font-bold text-blue-600">{rp(sisa)}</span>
                    </div>
                </section>

                {/* BLOK 5 — CATATAN */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <label className="block text-sm font-medium text-slate-700">Catatan (Opsional)</label>
                    <textarea
                        value={data.note}
                        onChange={(e) => setData('note', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 text-sm py-2 px-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                        placeholder="Contoh: Harus bersih, ada acara khusus, dll..."
                        rows={3}
                    />
                    {errors.note && <p className="text-xs text-red-600 mt-1">{errors.note}</p>}
                </section>

                {/* SUBMIT */}
                <div className="flex justify-end pb-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-7 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing && (
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                        )}
                        {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                    </button>
                </div>
            </form>
        </div>
    );
}

RentsCreate.layout = (page) => <Layout>{page}</Layout>;