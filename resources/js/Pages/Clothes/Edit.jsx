import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';

export default function ClothesEdit({ clothes, categories }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data, setData, put, processing, errors } = useForm({
    category_id: clothes.category_id,
    name: clothes.name,
    size: clothes.size,
    status: clothes.status,
    price: clothes.price,
    description: clothes.description,
    is_active: clothes.is_active ? 1 : 0,
    stock: clothes.stock,
    condition: clothes.condition || 'Bagus',
  });

  const {
    data: uploadData,
    setData: setUploadData,
    post: upload,
    processing: uploadProcessing,
    errors: uploadErrors,
    reset: resetUpload,
  } = useForm({
    clothes_kode: clothes.kode,
    image: null,
  });

  function submit(e) {
    e.preventDefault();
    put(route('clothes.update', clothes.kode));
  }

  function handleImageChange(e) {
    setUploadData('image', e.target.files[0] ?? null);
    // reset agar bisa pilih file yang sama lagi
    e.target.value = '';
  }

  function submitImage(e) {
    e.preventDefault();
    if (!uploadData.image) return;

    upload(route('clothes-images.store'), {
      forceFormData: true,
      onSuccess() {
        resetUpload();
        setCurrentIndex(0);
        router.reload();
      },
    });
  }

  function deleteImage(id) {
    if (!confirm('Hapus gambar ini?')) return;

    router.delete(route('clothes-images.destroy', id), {
      onSuccess() {
        setCurrentIndex(0);
        router.reload();
      },
    });
  }

  const images = clothes.images || [];
  const hasImages = images.length > 0;
  const displayedIndex = hasImages
    ? ((currentIndex % images.length) + images.length) % images.length
    : 0;
  const currentImage = hasImages ? images[displayedIndex] : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit Produk</h1>
      <p className="mt-2 text-sm text-slate-600">Perbarui data produk.</p>
      <div className="mt-4 mb-4 flex gap-2">
        <Link href={route('clothes.index')} className="rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-gray-600 text-white hover:bg-gray-700 transition">
          Kembali
        </Link>
      </div>

      <section className="mb-6 rounded border bg-white p-4">
        <h2 className="text-lg font-semibold">Gambar Produk</h2>

        <div className="mt-3">
          {hasImages ? (
            <div>
              {/* Main image */}
              <div className="rounded border bg-slate-100 p-2 text-center">
                <img
                  src={`/storage/${currentImage.path}`}
                  alt={`Gambar ${clothes.name} ${displayedIndex + 1}`}
                  className="mx-auto h-64 w-full max-w-md object-cover"
                />
              </div>

              {/* Prev / counter / Next */}
              <div className="mt-2 flex justify-between">
                <button
                  type="button"
                  className="rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-slate-500 text-white hover:bg-slate-600 transition"
                  onClick={() =>
                    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
                  }
                >
                  Prev
                </button>
                <span className="inline-flex items-center text-sm">
                  {displayedIndex + 1} / {images.length}
                </span>
                <button
                  type="button"
                  className="rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-slate-500 text-white hover:bg-slate-600 transition"
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % images.length)
                  }
                >
                  Next
                </button>
              </div>

              {/* Thumbnails */}
              <div className="mt-2 flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-14 w-14 overflow-hidden rounded border ${
                      idx === displayedIndex
                        ? 'border-blue-500 ring-2 ring-blue-300'
                        : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={`/storage/${img.path}`}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Hapus gambar aktif */}
              <button
                type="button"
                onClick={() => deleteImage(currentImage.id)}
                className="mt-3 rounded bg-rose-600 px-3 py-1 text-white"
              >
                Hapus gambar ini
              </button>
            </div>
          ) : (
            <div className="rounded border border-dashed border-gray-400 bg-slate-100 p-8 text-center text-sm text-gray-500">
              Tidak ada gambar, silakan unggah dulu.
            </div>
          )}
        </div>

        {/* Form upload — terpisah dari form data produk */}
        <form onSubmit={submitImage} className="mt-4 flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="rounded border px-2 py-1"
          />

          {uploadErrors &&
            Object.values(uploadErrors).map((msg) => (
              <p key={msg} className="text-xs text-red-500">{msg}</p>
            ))}

          <button
            type="submit"
            disabled={uploadProcessing}
            className="rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-primary text-white hover:bg-sidebar-primary/90 transition"
          >
            Unggah Gambar
          </button>
        </form>
      </section>

      <form onSubmit={submit} className="space-y-3 rounded border bg-white p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600">Kategori</label>
            <select
              value={data.category_id}
              onChange={(e) => setData('category_id', e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Nama Produk</label>
            <input
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
              required
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-600">Ukuran</label>
            <select
              value={data.size}
              onChange={(e) => setData('size', e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
            >
              {['S', 'M', 'L', 'XL'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Kondisi</label>
            <select
              value={data.condition}
              onChange={(e) => setData('condition', e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
            >
              <option value="Bagus">Bagus</option>
              <option value="Cukup">Cukup</option>
              <option value="Perlu Perbaikan">Perlu Perbaikan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Harga (Rp)</label>
            <input
              type="number"
              value={data.price}
              onChange={(e) => setData('price', e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
              required
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600">Stok</label>
            <input
              type="number"
              value={data.stock}
              onChange={(e) => setData('stock', e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-xs font-medium text-slate-600">Aktif</label>
            <label className="mt-1 flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.is_active}
                onChange={(e) => setData('is_active', e.target.checked ? 1 : 0)}
              />
              Ya
            </label>
          </div>
        </div>


          <div>
            <label className="block text-xs font-medium text-slate-600">Deskripsi</label>
            <textarea
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
          className="w-full rounded border px-2 py-1"
          rows={4}
          required
        />

          </div>
      
      

        {errors &&
          Object.values(errors).map((msg) => (
            <p key={msg} className="text-xs text-red-500">{msg}</p>
          ))}

        <button
          type="submit"
          disabled={processing}
          className="rounded px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
}

ClothesEdit.layout = (page) => <Layout>{page}</Layout>;