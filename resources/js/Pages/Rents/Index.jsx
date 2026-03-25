import { Link, router, usePage } from '@inertiajs/react';
import Layout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/Pagination';
import { useState } from 'react';
import dayjs from 'dayjs';

export default function RentsIndex({ rents }) {

  const [selectRented,setSelectRent] = useState(null);
  const [denda, setDenda] = useState(0);

  const { flash, month: initialMonth, year: initialYear } = usePage().props;
  const [filterMonth, setFilterMonth] = useState(initialMonth || '');
  const [filterYear, setFilterYear] = useState(initialYear || '');

  const deleteRent = (id) => {
    if (!confirm('Hapus data sewa?')) return;
    router.delete(route('rents.destroy', id));
  };


  const openReturnModal = (rent) =>{
    const tglKembali = dayjs(rent.return_date);
    const hariIni = dayjs();
    const selisihHari = hariIni.diff(tglKembali,'day');
    
    const estimasi = selisihHari > 0 ? selisihHari * 20000 : 0;
    setDenda(estimasi);
    setSelectRent(rent)
  }

  const confirmReturn = () => {
    if (!selectRented) return;

    router.patch(
      route('rents.return', selectRented.id),
      { denda: parseInt(denda) || 0 },
      {
        onSuccess: () => setSelectRent(null),
      }
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* 1. Header Responsif */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Data Sewa</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar transaksi sewa (edit/hapus tersedia).
          </p>
        </div>

        <div className='flex gap-1'>
        <Link 
          href={route('rents.create')} 
          className="w-full sm:w-auto text-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sidebar-accent transition"
        >
          + Buat Sewa Baru
        </Link>

        <a href={route('laporan.export')} className='w-full sm:w-auto text-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition'>
          Export Laporan
        </a>

        </div>
      </div>

      {flash?.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm">
          <div>{flash.success}</div>
          {flash.invoice_code && (
            <div className="mt-1 font-semibold text-slate-700">Invoice: {flash.invoice_code}</div>
          )}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.get(route('rents.index', { month: filterMonth, year: filterYear }));
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-2"
        >
          <div>
            <label className="block text-xs font-medium text-slate-600">Bulan</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              <option value="">Semua</option>
              {[...Array(12)].map((_, index) => {
                const monthValue = String(index + 1).padStart(2, '0');
                return (
                  <option key={monthValue} value={monthValue}>
                    {monthValue}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Tahun</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              <option value="">Semua</option>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="md:col-span-2 flex items-end gap-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-sidebar-accent transition"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterMonth('');
                setFilterYear('');
                router.get(route('rents.index'));
              }}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto"> {/* Pembungkus khusus scroll horizontal di HP */}
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Pemesan</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Baju</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Pinjam</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Kembali</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Kembali Aktual</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Total Harga</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Denda</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rents?.data?.length > 0 ? rents.data.map((rent) => (
                <tr key={rent.id} className="hover:bg-slate-50 transition-colors">
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">
                    {rent.invoice_code || '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900">
                    {rent.customer_name}
                  </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                    {rent.details?.length > 0
                      ? rent.details.map((d, i) => (
                          <div key={i}>{d.cloth?.name ?? d.clothes_kode} (x{d.qty})</div>
                        ))
                      : '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {rent.rent_date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {rent.return_date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {rent.actual_return_date || '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    Rp {Number(rent.total_price || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    Rp {Number(rent.denda).toLocaleString('id-ID')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      rent.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rent.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium space-x-2">
                  {rent.status !== 'completed' && (
                    <button
                      onClick={() => openReturnModal(rent)}
                      className="rounded-lg bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold capitalize hover:bg-emerald-200 transition"
                    >
                      Selesai
                    </button>
                  )}
                    <button
                      onClick={() => deleteRent(rent.id)}
                      className="rounded-lg bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold capitalize hover:bg-red-200 transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={7}>
                    Belum ada data sewa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination links={rents.links} />
      {selectRented && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900">Selesaikan Sewa</h2>
                        <p className="text-sm text-slate-500 mt-1">Konfirmasi pengembalian untuk <strong>{selectRented.customer_name}</strong></p>
                        
                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nominal Denda (Rp)</label>
                                <input 
                                    type="number" 
                                    value={denda} 
                                    onChange={(e) => setDenda(e.target.value)}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <p className="text-[10px] text-slate-400 mt-1 italic">*Anda bisa mengubah denda jika ada kerusakan fisik.</p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button onClick={() => setSelectRent(null)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
                                Batal
                            </button>
                            <button onClick={confirmReturn} className="flex-1 px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
                                Konfirmasi Kembali
                            </button>
                        </div>
                    </div>
                </div>
            )}

    </div>
  );
}

RentsIndex.layout = (page) => <Layout>{page}</Layout>;