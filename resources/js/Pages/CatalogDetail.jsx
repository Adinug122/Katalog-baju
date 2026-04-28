import React, { useState } from 'react'
import Navbar from '@/Components/Navbar'
import { Head, Link } from '@inertiajs/react'
import Footer from '@/Components/Footer';
import { ShoppingCart, X, CheckCircle2 } from 'lucide-react';
import CartButton from '@/Components/CartButton';

export default function ({ cloth }) {

    const [activeImage, setActiveImage] = useState(
        cloth.images.length > 0 ? cloth.images[0].path : null
    );


    const [toast, setToast] = useState(null); // { name, image, price }

    const addToCart = (product) => {
      
        let cart = JSON.parse(localStorage.getItem('rent_cart') || '[]');

        const isExist = cart.findIndex(item => item.kode === product.kode);

        if (isExist > -1) {
            cart[isExist].qty += 1;
        } else {
            cart.push({
                kode: product.kode,
                name: product.name,
                // price: product.price,
                image: product.images && product.images.length > 0 ? product.images[0].path : null,
                qty: 1
            });
        }

        localStorage.setItem('rent_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));

    
        setToast({
            name: product.name,
            image: product.images && product.images.length > 0 ? product.images[0].path : null,
            // price: product.price,
        });

        // Auto hide setelah 3 detik
        setTimeout(() => setToast(null), 3000);
    };

    const handleSewa = () => {
        const adminPhone = "6282335436100";
        const text = `Halo Admin Saya ingin memesan baju ini:%0A%0A` +
            ` *Nama*: ${cloth.name}%0A` +
            ` *Kode*: ${cloth.kode}%0A` +
            // ` *Harga*: Rp ${cloth.price.toLocaleString()}%0A%0A` +
            `Apakah baju ini masih *tersedia* untuk tanggal [isi tanggal sewa di sini]?`;
        const waUrl = `https://wa.me/${adminPhone}?text=${text}`;
        window.open(waUrl, '_blank');
    }

    return (
        <>
            <Head title={`Detail - ${cloth.name}`} />
            <Navbar />

            <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out ${
                toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}>
                <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 flex items-center gap-3 w-72">
                
                    <CheckCircle2 className="text-green-500 flex-shrink-0" size={22} />

              
                    {toast?.image ? (
                        <img
                            src={`/storage/${toast.image}`}
                            className="w-12 h-12 rounded-lg object-cover border flex-shrink-0"
                            alt="produk"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0" />
                    )}

                  
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
                            Ditambahkan ke keranjang
                        </p>
                        <p className="text-sm font-bold text-gray-800 truncate">{toast?.name}</p>
                        {/* <p className="text-xs text-orange-500 font-bold">
                            Rp {toast?.price?.toLocaleString()}
                        </p> */}
                    </div>

                  
                    <button
                        onClick={() => setToast(null)}
                        className="text-gray-300 hover:text-gray-500 flex-shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                {toast && (
                    <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-400 rounded-full"
                            style={{
                                animation: 'shrink 3s linear forwards'
                            }}
                        />
                    </div>
                )}
            </div>

       
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>

            <div className="min-h-screen bg-gray-50 pb-10 pt-10">
                <div className="container mx-auto px-5 pt-5">
                    <nav className="text-xs text-gray-500 mb-5">
                        <Link href={route('catalog')} className="hover:text-primary">Katalog</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-800 font-bold">{cloth.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 rounded-xl shadow-sm">

                        <div className="md:col-span-5 space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border">
                                {activeImage ? (
                                    <img
                                        src={`/storage/${activeImage}`}
                                        className="w-full h-full object-contain"
                                        alt={cloth.name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {cloth.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(img.path)}
                                        className={`w-20 h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 ${activeImage === img.path ? 'border-primary' : 'border-transparent'}`}
                                    >
                                        <img src={`/storage/${img.path}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-7 flex flex-col">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                                {cloth.category?.name}
                            </span>
                            <div className='flex justify-between'>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 uppercase">
                                {cloth.name}
                            </h1>
                            <CartButton/>
                            </div>
                            <p className="text-sm text-gray-400 mb-4 uppercase font-mono">KODE: {cloth.kode}</p>

                            {/* <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <span className="text-gray-500 text-sm">Harga Sewa / Jual</span>
                                <h2 className="text-3xl font-black text-orange-500">
                                    Rp {cloth.price.toLocaleString()}
                                </h2>
                            </div> */}

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="border p-3 rounded-lg">
                                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Ukuran Tersedia</span>
                                    <span className="text-lg font-bold text-gray-800">{cloth.size}</span>
                                </div>
                                <div className="border p-3 rounded-lg">
                                    <span className="block text-[10px] text-gray-400 uppercase font-bold">Stok Barang</span>
                                    <span className={`text-lg font-bold ${cloth.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {cloth.stock > 0 ? `${cloth.stock} Pcs` : 'Habis'}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="font-bold border-b pb-2 mb-3">Deskripsi Produk</h3>
                                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line text-justify">
                                    {cloth.description || 'Tidak ada deskripsi untuk produk ini.'}
                                </p>
                            </div>

            
                            <div className="mt-auto flex gap-3">
                                <button
                                    onClick={() => addToCart(cloth)}
                                    disabled={cloth.stock === 0}
                                    className="flex-1 bg-primary text-white py-4 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart size={16} /> + KERANJANG
                                </button>
                                <button
                                    onClick={handleSewa}
                                    className="flex-1 bg-green-500 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                >
                                    HUBUNGI ADMIN (WA)
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}