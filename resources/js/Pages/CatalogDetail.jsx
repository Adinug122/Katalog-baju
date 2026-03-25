import React, { useState } from 'react'
import Navbar from '@/Components/Navbar'
import { Head,Link } from '@inertiajs/react'
import Footer from '@/Components/Footer';
export default function ({cloth}) {

    const [activeImage,setActiveImage] = useState(
        cloth.images.length > 0 ? cloth.images[0].path : null
    );


    const handleSewa = () =>{
        const adminPhone = "6282335436100";
        
        const text = `Halo Admin Saya ingin memesan baju ini:%0A%0A` +
                     ` *Nama*: ${cloth.name}%0A` +
                     ` *Kode*: ${cloth.kode}%0A` +
                     ` *Harga*: Rp ${cloth.price.toLocaleString()}%0A%0A` +
                     `Apakah baju ini masih *tersedia* untuk tanggal [isi tanggal sewa di sini]?`;
        const waUrl = `https://wa.me/${adminPhone}?text=${text}`;
        window.open(waUrl,'_blank');
    }

  return (
   <>
   <Head title={`Detail - ${cloth.name}`} />
   <Navbar/>

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
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 uppercase">
                                {cloth.name}
                            </h1>
                            <p className="text-sm text-gray-400 mb-4 uppercase font-mono">KODE: {cloth.kode}</p>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <span className="text-gray-500 text-sm">Harga Sewa / Jual</span>
                                <h2 className="text-3xl font-black text-orange-500">
                                    Rp {cloth.price.toLocaleString()}
                                </h2>
                            </div>

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
                                <button onClick={handleSewa} className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                                    <span></span> HUBUNGI ADMIN (WA)
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer/>
   </>
  )
}
