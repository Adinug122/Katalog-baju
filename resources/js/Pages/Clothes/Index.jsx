import { Link, router, useForm } from '@inertiajs/react'; // Tambahkan useForm
import Layout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';

export default function ClothesIndex({ clothes }) {
 
  const { data, setData, post, reset, processing, errors } = useForm({
    name: '',
    size: '',
    price: '',
    description: '',
    is_active: 1,
    stock: 1,
  });

  const [keyword, setKeyword] = useState('');

  const HasilBaju = (clothes,key) =>{
    if(!key) return clothes;
    return clothes.filter((item) => {
      return( 
      item.kode?.toLowerCase().includes(key.toLowerCase()) ||
      item.name?.toLowerCase().includes(key.toLowerCase())
    )})
  }

  const hasilPencarian = HasilBaju(clothes.data,keyword);

  // 2. Fungsi Delete
  const deleteClothes = (kode) => {
    if (!confirm('Hapus produk ini?')) return;
    router.delete(route('clothes.destroy', kode));
  };


 

  function submit(e) {
    e.preventDefault();
    post(route('clothes.store'), {
      onSuccess: () => reset(),
    });
  }

  return (
    <div className="space-y-6"> 
<div className="flex flex-col md:flex-row items-start md:items-center  justify-between text-sm">
        <div className='mb-4'>
          <h1 className="text-2xl font-bold text-slate-900">Katalog Baju</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola inventory produk kamu di sini.</p>
        </div>
      <div className="flex gap-4">
    
          <input
            type="text"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-primary` focus:ring-primary`"
            placeholder="Cari nama atau kode..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
         <Link
  href={route('clothes.create')}
  className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition hover:bg-primary sm:text-sm md:px-4 md:py-2.5"
>
  <span className="mr-1 text-lg leading-none">+</span> 
  Buat Produk Baru
</Link>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[600px] w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500 tracking-wider">Foto</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500 tracking-wider">Kode</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500 tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500 tracking-wider">Ukuran</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500 tracking-wider">Harga</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500 tracking-wider">Stok</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500 tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-slate-500 tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {hasilPencarian?.length > 0 ? (
              hasilPencarian.map((item) => (
                <tr key={item.kode} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={item.images?.[0]?.path ? `/storage/${item.images[0].path}` : 'https://via.placeholder.com/64?text=No+Image'}
                      alt={item.name}
                      className="h-11 w-11 rounded object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.kode}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {item.size}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.stock}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {item.is_active ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm space-x-2">
                    <Link
                      href={route('clothes.edit', item.kode)}
                      className="rounded-lg bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold capitalize hover:bg-amber-200 transition"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteClothes(item.kode)}
                      className="rounded-lg bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold capitalize hover:bg-red-200 transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-10 text-center text-sm text-slate-500" colSpan={7}>Belum ada data pakaian.</td>
              </tr>
            )}
          </tbody>
        </table>
      
      </div>
      <Pagination links={clothes.links}/>
    </div>
  );
}

ClothesIndex.layout = (page) => <Layout>{page}</Layout>;