import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';

export default function ClothesCreate({ categories }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [previewFiles, setPreviewFiles] = useState([]);

  const { data, setData, post, processing, errors } = useForm({
    category_id: categories.length ? categories[0].id : '',
    name: '',
    size: 'S',
    price: '',
    description: '',
    is_active: 1,
    stock: 1,
    condition: 'Bagus',
    images: [],
  });

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newUrls = files.map((file) => URL.createObjectURL(file));

    setPreviewFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newUrls]);
    setData('images', [...previewFiles, ...files]);
    setSelectedIndex(0);

    e.target.value = '';
  }

  function removePreviewImage(idx) {
    if (!confirm('Hapus gambar ini?')) return;

    const newUrls = previewUrls.filter((_, i) => i !== idx);
    const newFiles = previewFiles.filter((_, i) => i !== idx);

    URL.revokeObjectURL(previewUrls[idx]);

    setPreviewUrls(newUrls);
    setPreviewFiles(newFiles);
    setData('images', newFiles);
    setSelectedIndex((prev) => Math.min(prev, Math.max(newUrls.length - 1, 0)));
  }

  function submit(e) {
    e.preventDefault();

    post(route('clothes.store'), {
      forceFormData: true,
      onSuccess: () => {
        setData('name', '');
        setData('price', '');
        setData('description', '');
        setData('stock', 1);
        setData('images', []);
        setPreviewUrls([]);
        setPreviewFiles([]);
        setSelectedIndex(0);
      },
    });
  }

  const hasPreviews = previewUrls.length > 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Tambah Produk</h1>
      <p className="mt-2 text-sm text-slate-600">Masukkan data produk baru.</p>

      <div className="mt-4 mb-4">
        <Link href={route('clothes.index')} className="rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-gray-600 text-white hover:bg-gray-700 transition">Kembali</Link>
      </div>

      <section className="mb-6 rounded border bg-white p-4">
        <h2 className="text-lg font-semibold">Gambar Produk</h2>

        <div className="mt-3">
          {hasPreviews ? (
            <div>
              {/* Main preview */}
              <div className="rounded border bg-slate-100 p-2 text-center">
                <img
                  src={previewUrls[selectedIndex]}
                  alt={`Preview ${selectedIndex + 1}`}
                  className="mx-auto h-64 w-full max-w-md object-cover"
                />
              </div>

              {/* Prev / counter / Next */}
              <div className="mt-2 flex justify-between">
                <button
                  type="button"
                  className="rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-slate-500 text-white hover:bg-slate-600 transition"
                  onClick={() =>
                    setSelectedIndex((prev) => (prev - 1 + previewUrls.length) % previewUrls.length)
                  }
                >
                  Prev
                </button>
                <span className="inline-flex items-center gap-1 text-sm">
                  {selectedIndex + 1} / {previewUrls.length}
                </span>
                <button
                  type="button"
                  className="rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-slate-500 text-white hover:bg-slate-600 transition"
                  onClick={() =>
                    setSelectedIndex((prev) => (prev + 1) % previewUrls.length)
                  }
                >
                  Next
                </button>
              </div>

              {/* Thumbnails */}
              <div className="mt-2 flex flex-wrap gap-2">
                {previewUrls.map((url, idx) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`h-14 w-14 overflow-hidden rounded border ${
                      idx === selectedIndex ? 'border-primary ring-2 ring-primary' : 'border-gray-300'
                    }`}
                  >
                    <img src={url} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Hapus gambar aktif */}
              <button
                type="button"
                onClick={() => removePreviewImage(selectedIndex)}
                className="mt-3 rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Hapus gambar ini
              </button>
            </div>
          ) : (
            <div className="rounded border border-dashed border-gray-400 bg-slate-100 p-8 text-center text-sm text-gray-500">
              Tidak ada gambar, silakan pilih file di bawah.
            </div>
          )}

          {/* Input file — di luar form utama, cukup update state */}
          <div className="mt-4 flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="rounded border px-2 py-1"
            />
            <p className="text-xs text-slate-500">
              Bisa pilih beberapa gambar sekaligus. Gambar akan dikirim bersama form.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={submit} className="space-y-3 rounded border bg-white p-4" encType="multipart/form-data">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600">Kategori</label>
            <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className="mt-1 w-full rounded border px-2 py-1">
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Nama Produk</label>
            <input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama produk" className="mt-1 w-full rounded border px-2 py-1" required />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600">Ukuran</label>
            <select value={data.size} onChange={(e) => setData('size', e.target.value)} className="mt-1 w-full rounded border px-2 py-1">
              {['S', 'M', 'L', 'XL'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Harga (Rp)</label>
            <input type="number" value={data.price} onChange={(e) => setData('price', e.target.value)} placeholder="Harga" className="mt-1 w-full rounded border px-2 py-1" required />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600">Kondisi</label>
            <select value={data.condition} onChange={(e) => setData('condition', e.target.value)} className="mt-1 w-full rounded border px-2 py-1">
              <option value="Bagus">Bagus</option>
              <option value="Cukup">Cukup</option>
              <option value="Perlu Perbaikan">Perlu Perbaikan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Stok</label>
            <input type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} className="mt-1 w-full rounded border px-2 py-1" required />
          </div>
        </div>

        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Deskripsi" className="w-full rounded border px-2 py-1" rows={4} required />

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex flex-col">
            <label className="block text-xs font-medium text-slate-600">Status</label>
            <label className="mt-1 flex items-center gap-2">
              <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked ? 1 : 0)} /> Aktif
            </label>
          </div>
        </div>

        {errors && Object.values(errors).map((msg) => <p className="text-xs text-red-500" key={msg}>{msg}</p>)}

        <button type="submit" disabled={processing} className="rounded px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-primary text-primary-foreground text-white hover:bg-primary/90 transition">Simpan</button>
      </form>
    </div>
  );
}

ClothesCreate.layout = (page) => <Layout>{page}</Layout>;