import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Link, MessageCircle, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'

export default function Cart() {
  const [items,setItems] = useState([]);
  const [dates,setDates] = useState({start:'',end:''});

  useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('rent_cart') || '[]');
        setItems(savedCart);
    }, []);

 const updateQty = (kode,delta) =>{
    const newItems = items.map(item =>{
        if(item.kode === kode){
            const newQty = Math.max(1,item.qty + delta);
            return {...item,qty:newQty};
        }
        return item;
    });
    updateStorage(newItems);
 }
 const removeItem = (kode) => {
        if (confirm('Hapus item ini dari keranjang?')) {
            const newItems = items.filter(item => item.kode !== kode);
            updateStorage(newItems);
        }
    };

const updateStorage = (newItems) =>{
    setItems(newItems);
    localStorage.setItem('rent_cart',JSON.stringify(newItems));
    window.dispatchEvent(new Event('cart-updated'));
}

const summary = useMemo(() => {
        const totalHarga = items.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
        return {
            totalItems: items.length,
            totalQty: items.reduce((acc, curr) => acc + curr.qty, 0),
            totalHarga: totalHarga
        };
    }, [items]);

    const handleSendWA = () => {
        if (!dates.start) {
            alert('Silakan pilih tanggal sewa terlebih dahulu!');
            return;
        }

        const adminPhone = "6282335436100";
        let message = `*HALO ADMIN, SAYA INGIN MENYEWA BAJU*%0A%0A`;
        
        items.forEach((item, index) => {
            message += `${index + 1}. *${item.name}* (${item.kode})%0A`;
            message += `   Jumlah: ${item.qty} set%0A`;
            // message += `   Harga: Rp ${(item.price * item.qty).toLocaleString()}%0A%0A`;
        });

        message += `*RENCANA SEWA:*%0A`;
        message += `Mulai: ${dates.start}%0A`;
        // message += `*ESTIMASI TOTAL:* Rp ${summary.totalHarga.toLocaleString()}%0A%0A`;
        message += `Apakah baju tersebut tersedia di tanggal tersebut?`;

        window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
    };

return (
        <>
            <Head title="Keranjang Belanja" />
            <Navbar />

            <div className="min-h-screen bg-[#F8F9FA] pt-28 pb-20 font-body">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="flex items-center gap-2 mb-8">
                        <Link href={route('catalog')} className="p-2 bg-white rounded-full shadow-sm hover:text-primary transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-black text-slate-900 uppercase">Keranjang <span className="text-primary">Belanja</span></h1>
                    </div>
                    {items.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                            <div className="lg:col-span-8 space-y-4">
                                {items.map((item) => (
                                    <div key={item.kode} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                                        <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={`/storage/${item.image}`} className="w-full h-full object-cover" alt={item.name} />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 uppercase  text-sm mb-1">{item.name}</h3>
                                                    <p className="text-[10px] text-gray-400 font-mono mb-2 uppercase">KODE: {item.kode}</p>
                                                    {/* <p className="text-primary font-black text-sm">Rp {item.price.toLocaleString()}</p> */}
                                                </div>
                                                <button onClick={() => removeItem(item.kode)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <div className="flex justify-end mt-4">
                                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                    <button onClick={() => updateQty(item.kode, -1)} className="p-2 hover:bg-gray-50 text-gray-500"><Minus size={14}/></button>
                                                    <span className="px-4 py-1 text-sm font-bold border-x border-gray-100">{item.qty}</span>
                                                    <button onClick={() => updateQty(item.kode, 1)} className="p-2 hover:bg-gray-50 text-gray-500"><Plus size={14}/></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* KOLOM KANAN: RINGKASAN & TANGGAL (STICKY) */}
                            <div className="lg:col-span-4">
                                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-gray-100 sticky top-28">
                                    <h2 className="font-bold text-slate-900 uppercase text-xs mb-6 border-b pb-4">Ringkasan Pesanan</h2>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Tanggal Mulai Sewa</label>
                                            <input 
                                                type="date" 
                                                className="w-full border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary"
                                                onChange={(e) => setDates({...dates, start: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Total Item</span>
                                            <span className="font-bold text-slate-800">{summary.totalQty} Pcs</span>
                                        </div>
                                        {/* <div className="flex justify-between items-center pt-2">
                                            <span className="text-sm font-bold text-slate-900">Total Estimasi</span>
                                            <span className="text-xl font-black text-primary">Rp {summary.totalHarga.toLocaleString()}</span>
                                        </div> */}
                                    </div>

                                    <button 
                                        onClick={handleSendWA}
                                        className="w-full bg-[#25D366] text-white py-4 rounded-2xl mt-8 font-black text-xs flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all active:scale-95 shadow-lg shadow-green-100"
                                    >
                                        <MessageCircle size={20} /> KIRIM KE WHATSAPP
                                    </button>
                                    <p className="text-[9px] text-gray-400 text-center mt-4 leading-relaxed">
                                        *Pemesanan akan diteruskan ke Admin via WhatsApp untuk pengecekan stok manual.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
                            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingCart className="text-gray-300" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Keranjang Kosong</h2>
                            <p className="text-gray-400 text-sm mb-8">Anda belum memilih koleksi baju untuk disewa.</p>
                            <Link href={route('catalog')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm">
                                Mulai Cari Baju
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
