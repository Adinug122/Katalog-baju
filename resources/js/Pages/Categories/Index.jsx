import { router, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';

export default function CategoriesIndex({ categories }) {
  const { data, setData, post, reset, processing, errors } = useForm({ name: '' });
  const { flash } = usePage().props;

  function submit(e) {
    e.preventDefault();
    post(route('categories.store'), {
      onSuccess: () => reset('name'),
    });
  }

  function handleDelete(category){
    if (category.clothes_count > 0) {
      alert('Kategori ini tidak bisa dihapus karena masih ada baju yang menggunakan.');
      return;
    }

    if (!confirm('Apakah anda yakin ingin menghapus ini?')) return;
    router.delete(route('categories.destroy', category.id));
  }

  function handleEdit(category) {
    const name = prompt('Ubah nama kategori:', category.name);
    if (!name || name.trim() === '' || name.trim() === category.name) return;

    router.put(route('categories.update', category.id), {
      name: name.trim(),
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Kategori</h1>
      <p className="mt-2 text-sm text-slate-600">Daftar kategori tersedia.</p>
      {flash?.success && (
        <div className="mt-3 rounded border border-green-300 bg-green-50 px-4 py-2 text-green-700">{flash.success}</div>
      )}
      {flash?.error && (
        <div className="mt-3 rounded border border-red-300 bg-red-50 px-4 py-2 text-red-700">{flash.error}</div>
      )}
      <div className="mt-4">
        <form onSubmit={submit} className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="rounded border px-2 py-1"
            placeholder="Nama kategori"
            required
          />
          <button type="submit" disabled={processing} className="rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-primary text-white hover:bg-sidebar-accent transition">
            Tambah Kategori
          </button>
        </form>

        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
          <table className="min-w-[360px] w-full text-left bg-white">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Nama Kategori</th>
                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories?.data?.length > 0 ? (
                categories.data.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {category.name}
                      {category.clothes_count > 0 && (
                        <span className="ml-2 text-xs text-slate-500">({category.clothes_count} baju)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-1">
                      <button
                        onClick={() => handleEdit(category)}
                  className="rounded-lg bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold capitalize hover:bg-amber-200 transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(category)} 
   className="rounded-lg bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold capitalize hover:bg-red-200 transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-4 py-6 text-center text-slate-400 italic">
                    Belum ada kategori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination links={categories.links} />
      </div>
    </div>
  );
}

CategoriesIndex.layout = (page) => <Layout>{page}</Layout>;
