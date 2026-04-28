import React from 'react';

export default function InvoicePreview({ rent }) {
  // Helper format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white shadow-lg border border-slate-200 rounded-xl" id="invoice-print">
      {/* Header Invoice */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">INVOICE</h1>
          <p className="text-slate-500 mt-1 font-mono text-sm">{rent.invoice_code}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold text-slate-800">Sayur Verse Rental</h2>
          <p className="text-slate-500 text-xs">Jl. Raya Madiun No. 123</p>
          <p className="text-slate-500 text-xs">WhatsApp: 0812-3456-7890</p>
        </div>
      </div>

      {/* Info Pelanggan & Tanggal */}
      <div className="grid grid-cols-2 gap-8 py-8">
        <div>
          <h3 className="text-xs uppercase font-semibold text-slate-400 mb-2">Ditujukan Untuk:</h3>
          <p className="font-bold text-slate-800">{rent.customer_name}</p>
          <p className="text-slate-500 text-sm">{rent.customer_phone}</p>
          <p className="text-slate-500 text-sm">KTP: {rent.customer_ktp}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs uppercase font-semibold text-slate-400 mb-2">Detail Sewa:</h3>
          <p className="text-slate-800 text-sm"><span className="font-medium">Tgl Pinjam:</span> {rent.rent_date}</p>
          <p className="text-slate-800 text-sm"><span className="font-medium">Tgl Kembali:</span> {rent.return_date}</p>
          <span className={`inline-block mt-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${
            rent.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            Status: {rent.status}
          </span>
        </div>
      </div>

      {/* Tabel Item */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-y border-slate-200">
            <th className="py-4 font-semibold text-slate-700">Deskripsi Baju</th>
            <th className="py-4 font-semibold text-slate-700 text-center">Qty</th>
            <th className="py-4 font-semibold text-slate-700 text-right">Harga Satuan</th>
            <th className="py-4 font-semibold text-slate-700 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {rent.details.map((item, index) => (
            <tr key={index} className="border-b border-slate-100">
              <td className="py-4">
                <p className="font-medium text-slate-800">{item.cloth.name}</p>
                <p className="text-xs text-slate-500">Kode: {item.clothes_kode}</p>
              </td>
              <td className="py-4 text-center text-slate-600">{item.qty}</td>
              <td className="py-4 text-right text-slate-600">{formatRupiah(item.price_per_item)}</td>
              <td className="py-4 text-right font-semibold text-slate-800">
                {formatRupiah(item.price_per_item * item.qty)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Keuangan */}
      <div className="mt-8 flex justify-end">
        <div className="w-full md:w-64 space-y-3">
          <div className="flex justify-between text-slate-600">
            <span>Total Harga:</span>
            <span>{formatRupiah(rent.total_price)}</span>
          </div>
          {rent.denda > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Denda Telat:</span>
              <span>+ {formatRupiah(rent.denda)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>DP / Dibayar:</span>
            <span className="text-green-600">- {formatRupiah(rent.down_payment)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-800">
            <span>Sisa Tagihan:</span>
            <span>{formatRupiah((rent.total_price + (rent.denda || 0)) - rent.down_payment)}</span>
          </div>
        </div>
      </div>

      {/* Footer / Syarat */}
      <div className="mt-12 pt-8 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs">Terima kasih telah mempercayakan persewaan baju pada kami.</p>
        <p className="text-slate-400 text-[10px] mt-1 italic">* Harap simpan invoice ini sebagai bukti pengembalian.</p>
      </div>
    </div>
  );
}