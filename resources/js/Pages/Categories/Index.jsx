import { router, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';
import { Pencil, Trash2, X, Tag, AlertTriangle } from 'lucide-react';

function EditModal({ category, onClose }) {
  const { data, setData, put, processing, errors } = useForm({
    name: category.name,
    fine_per_day: category.fine_per_day ?? '',
  });

  function submit(e) {
    e.preventDefault();
    put(route('categories.update', category.id), {
      onSuccess: () => onClose(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Pencil size={15} className="text-amber-600" />
            </div>
            <h2 className="font-bold text-slate-800">Edit Kategori</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Nama Kategori
            </label>
            <input
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="Nama kategori"
              required
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Denda Per Hari (Rp)
            </label>
            <input
              type="number"
              value={data.fine_per_day}
              onChange={e => setData('fine_per_day', e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="0"
              required
            />
            {errors.fine_per_day && <p className="mt-1 text-xs text-red-500">{errors.fine_per_day}</p>}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex-1 rounded-lg bg-primary text-white px-4 py-2 text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-60"
            >
              {processing ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal Hapus ───────────────────────────────────────────────────────────────
function DeleteModal({ category, onClose }) {
  const [processing, setProcessing] = useState(false);

  function handleConfirm() {
    setProcessing(true);
    router.delete(route('categories.destroy', category.id), {
      onFinish: () => { setProcessing(false); onClose(); },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="px-6 py-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h2 className="font-bold text-slate-800 text-lg mb-1">Hapus Kategori?</h2>
          <p className="text-sm text-slate-500">
            Kategori <span className="font-semibold text-slate-700">"{category.name}"</span> akan dihapus permanen.
          </p>
        </div>
        <div className="flex border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition border-r border-slate-100"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing}
            className="flex-1 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-60"
          >
            {processing ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama ─────────────────────────────────────────────────────────────
export default function CategoriesIndex({ categories }) {

  const { data, setData, post, reset, processing, errors } = useForm({
    name: '',
    fine_per_day: '',
  });
  const { flash } = usePage().props;

  // State modal
  const [editTarget, setEditTarget] = useState(null);  
  const [deleteTarget, setDeleteTarget] = useState(null); // category object | null

  function submit(e) {
    e.preventDefault();
    post(route('categories.store'), {
      onSuccess: () => reset(),
    });
  }

  function handleDelete(category) {
    // Cek clothes_count sebelum buka modal
    if (category.clothes_count > 0) {
      alert(`Kategori "${category.name}" tidak bisa dihapus karena masih dipakai ${category.clothes_count} baju.`);
      return;
    }
    setDeleteTarget(category);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Kategori</h1>
      <p className="mt-2 text-sm text-slate-600">Daftar kategori tersedia.</p>

      {/* Flash messages */}
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
            onChange={e => setData('name', e.target.value)}
            className="rounded border px-2 py-1 text-sm"
            placeholder="Nama kategori"
            required
          />
          <input
            type="number"
            value={data.fine_per_day}
            onChange={e => setData('fine_per_day', e.target.value)}
            className="rounded border px-2 py-1 text-sm"
            placeholder="Harga Denda per hari"
            required
          />
          <button
            type="submit"
            disabled={processing}
            className="rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-primary text-white hover:bg-opacity-90 transition disabled:opacity-60"
          >
            {processing ? 'Menyimpan...' : 'Tambah Kategori'}
          </button>
        </form>

        {errors.name && <p className="text-xs text-red-500 mb-2">{errors.name}</p>}
        {errors.fine_per_day && <p className="text-xs text-red-500 mb-2">{errors.fine_per_day}</p>}

   
        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
          <table className="min-w-[400px] w-full text-left bg-white">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Nama Kategori</th>
                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Denda / Hari</th>
                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories?.data?.length > 0 ? (
                categories.data.map(category => (
                  <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Tag size={13} className="text-slate-400" />
                        {category.name}
                        {category.clothes_count > 0 && (
                          <span className="text-xs text-slate-400">({category.clothes_count} baju)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      {category.fine_per_day
                        ? `Rp ${Number(category.fine_per_day).toLocaleString('id-ID')}`
                        : <span className="text-slate-300 italic">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1">
                   
                        <button
                          onClick={() => setEditTarget(category)}
                          className="rounded-lg bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold hover:bg-amber-200 transition flex items-center gap-1"
                        >
                          <Pencil size={11} /> Edit
                        </button>
                  
                        <button
                          onClick={() => handleDelete(category)}
                          className="rounded-lg bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold hover:bg-red-200 transition flex items-center gap-1"
                        >
                          <Trash2 size={11} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-slate-400 italic">
                    Belum ada kategori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination links={categories.links} />
      </div>

      {editTarget && (
        <EditModal
          category={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

CategoriesIndex.layout = (page) => <Layout>{page}</Layout>;