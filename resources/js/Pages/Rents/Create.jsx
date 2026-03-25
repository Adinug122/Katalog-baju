import { useEffect, useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';

export default function RentsCreate({ clothes }) {
  // Sesuaikan data agar mengirim array 'items' sesuai validasi di Controller
  const { data, setData, post, errors, processing } = useForm({
    customer_name: '',
    customer_phone: '',
    rent_date: '',
    return_date: '',
    items: [
      {
        kode: clothes.length ? clothes[0].kode : '',
        qty: 1,
        price: clothes.length ? clothes[0].price : 0, // Helper untuk hitung total di frontend
      }
    ],
    total_price: 0,
  });

  const [keyword, setKeyword] = useState('');
// 1. Hitung durasi hari secara otomatis
const rentDays = useMemo(() => {
    if (!data.rent_date || !data.return_date) return 0;
    const start = new Date(data.rent_date);
    const end = new Date(data.return_date);
    const diffInMs = end - start;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return Math.max(1, diffInDays);
}, [data.rent_date, data.return_date]);


const totalPrice = useMemo(() => {
    const itemsTotal = data.items.reduce((acc, item) => {
        return acc + (item.price * item.qty);
    }, 0);
    return itemsTotal * rentDays;
}, [data.items, rentDays]);

  const handleClothesChange = (kode) => {
    const selected = clothes.find((item) => item.kode === kode);

    const newItems = [...data.items];
    newItems[0] = {
      ...newItems[0],
      kode: kode,
      price: selected?.price || 0
    };
    
    setData('items', newItems);
  };

  const filteredClothes = useMemo(() => {
    if (!keyword) return clothes;
    return clothes.filter((item) => {
      return (
        item.name?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.kode?.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  }, [clothes, keyword]);

  function submit(e) {
    e.preventDefault();
    post(route('rents.store'));
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-semibold">Input Sewa Baru</h1>
      
{/* Alert Error dari Validation & Flash Session */}
{(Object.keys(errors).length > 0) && (
  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
    <div className="flex items-center mb-1">
      <svg className="w-4 h-4 text-red-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <p className="text-sm font-bold text-red-700">Terjadi kesalahan input:</p>
    </div>
    <ul className="list-disc list-inside text-xs text-red-600 space-y-1 ml-6">
      {Object.values(errors).map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  </div>
)}

      <form onSubmit={submit} className="mt-4 space-y-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        
        {/* Pilih Barang */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Cari & Pilih Baju</label>
          <div className="mt-1 space-y-2">
            <input 
              type="text"
              placeholder="Ketik nama atau kode baju..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full rounded-lg border-slate-300 text-sm focus:ring-primary focus:border-primary"
            />
            
            <select
              value={data.items[0].kode}
              onChange={(e) => handleClothesChange(e.target.value)}
              className="w-full rounded-lg border-slate-300 text-sm focus:ring-primary focus:border-primary"
            >
              {filteredClothes.length > 0 ? (
                filteredClothes.map((item) => (
                  <option key={item.kode} value={item.kode}>
                    {item.kode} - {item.name} (Stok: {item.stock} | Rp {item.price.toLocaleString()})
                  </option>
                ))
              ) : (
                <option disabled>Baju tidak ditemukan...</option>
              )}
            </select>
          </div>
          {/* Error handling untuk item pertama */}
          {errors['items.0.kode'] && <p className="mt-1 text-xs text-red-600">{errors['items.0.kode']}</p>}
        </div>

<div className="mt-4">
  <label className="block text-sm font-medium text-slate-700">Jumlah (Qty)</label>
  <input
    type="number"
    min="1"
    value={data.items[0].qty}
    onChange={(e) => {
      const newItems = [...data.items];
      newItems[0].qty = parseInt(e.target.value) || 1;
      setData('items', newItems);
    }}
    className="mt-1 w-24 rounded-lg border-slate-300 text-sm focus:ring-primary focus:border-primary"
  />
  {errors['items.0.qty'] && <p className="text-xs text-red-600 mt-1">{errors['items.0.qty']}</p>}
</div>
        <hr className="border-slate-100" />

        {/* Data Pelanggan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nama Pemesan</label>
            <input
              value={data.customer_name}
              onChange={(e) => setData('customer_name', e.target.value)}
              className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:ring-primary focus:border-primary"
              placeholder="Masukkan nama"
            />
            {errors.customer_name && <p className="text-xs text-red-600 mt-1">{errors.customer_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">No. Telepon</label>
            <input
              value={data.customer_phone}
              onChange={(e) => setData('customer_phone', e.target.value)}
              className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:ring-primary focus:border-primary"
              placeholder="0812..."
            />
            {errors.customer_phone && <p className="text-xs text-red-600 mt-1">{errors.customer_phone}</p>}
          </div>
        </div>

        {/* Tanggal */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Tanggal Mulai</label>
            <input
              type="date"
              value={data.rent_date}
              onChange={(e) => setData('rent_date', e.target.value)}
              className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:ring-primary focus:border-primary"
            />
            {errors.rent_date && <p className="text-xs text-red-600 mt-1">{errors.rent_date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Tanggal Kembali</label>
            <input
              type="date"
              value={data.return_date}
              onChange={(e) => setData('return_date', e.target.value)}
              className="mt-1 w-full rounded-lg border-slate-300 text-sm focus:ring-primary focus:border-primary"
            />
            {errors.return_date && <p className="text-xs text-red-600 mt-1">{errors.return_date}</p>}
          </div>
        </div>

        {/* Info Harga */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500">Harga per Hari</label>
            <p className="text-lg font-bold text-slate-700">Rp {data.items[0].price.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-500">Total Tagihan</label>
            <p className="text-lg font-bold text-primary">Rp {totalPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center px-6 py-2 bg-primary border border-transparent rounded-lg font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition ease-in-out duration-150 disabled:opacity-50"
          >
            {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </div>
      </form>
    </div>
  );
}

RentsCreate.layout = (page) => <Layout>{page}</Layout>;