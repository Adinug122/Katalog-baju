import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';

export default function RentsEdit({ rent, clothes }) {
  const { data, setData, put, processing, errors } = useForm({
    clothes_kode: rent.clothes_kode,
    customer_name: rent.customer_name,
    customer_phone: rent.customer_phone,
    rent_date: rent.rent_date,
    return_date: rent.return_date,
    actual_return_date: rent.actual_return_date || '',
    rent_price: rent.rent_price ?? 0,
    total_price: rent.total_price ?? 0,
    denda: rent.denda,
    status: rent.status,
  });

  useEffect(() => {
    const rentDays = data.rent_date && data.return_date
      ? Math.max(1, Math.ceil((new Date(data.return_date).getTime() - new Date(data.rent_date).getTime()) / (1000 * 60 * 60 * 24)) + 1)
      : 0;

    const total = (parseInt(data.rent_price, 10) || 0) * rentDays + (parseInt(data.denda, 10) || 0);
    setData('total_price', total);
  }, [data.rent_date, data.return_date, data.rent_price, data.denda]);

  const handleClothesChange = (kode) => {
    const selected = clothes.find((item) => item.kode === kode);
    setData('clothes_kode', kode);
    setData('rent_price', selected?.price || 0);
  };

  function submit(e) {
    e.preventDefault();
    put(route('rents.update', rent.id));
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit Sewa</h1>
      <p className="mt-2 text-sm text-slate-600">Ubah data sewa.</p>
      <div className="mt-4 mb-4">
        <Link href={route('rents.index')} className="rounded px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-gray-600 text-white hover:bg-gray-700 transition">Kembali</Link>
      </div>

      <form onSubmit={submit} className="space-y-3 rounded border bg-white p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <select value={data.clothes_kode} onChange={(e) => handleClothesChange(e.target.value)} className="rounded border px-2 py-1">
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