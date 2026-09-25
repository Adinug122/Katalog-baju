import Footer from '@/Components/Footer'
import Navbar from '@/Components/Navbar'
import React from 'react'

export default function About() {
  return (
 <>
 <Navbar/>

<section className='bg-white py-24 px-5'>
    <div className='max-w-7xl mx-auto'>

        <div className="mb-12">
            <h3 className='font-bold text-3xl text-primary uppercase tracking-wider'>
                Tentang Kami
            </h3>
            <div className='w-24 bg-primary h-[3px] mt-2'></div> 
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          
            <div className='space-y-6'>
                <div>
                    <h2 className='text-4xl font-extrabold text-gray-900 leading-tight mb-4'>
                       Kami fokus ke <br />
                        <span className="text-primary">Kualitas & Kenyamanan</span>
                    </h2>
                    <p className='text-gray-600 leading-relaxed'>
                      Berawal dari semangat menghadirkan fashion lengkap (jas, kebaya, dress, dll) yang affordable tapi tetap berkualitas.
Hadir buat nemenin style dan lifestyle Gen Z kamu.
Karena setiap outfit bukan cuma baju, tapi juga cerita dan vibe diri kamu.
                    </p>
                </div>

                <div className='grid grid-cols-2 gap-6 pt-4'>
                    <div>
                        <h4 className='font-bold text-xl text-primary'>100%</h4>
                        <p className='text-xs text-gray-500 uppercase font-bold tracking-tight'>Bahan Pilihan</p>
                    </div>
                    <div>
                        <h4 className='font-bold text-xl text-primary'>500+</h4>
                        <p className='text-xs text-gray-500 uppercase font-bold tracking-tight'>Koleksi Produk</p>
                    </div>
                </div>

                <div className="pt-6">
                    <button className="bg-primary text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg transition-all">
                        PELAJARI LEBIH LANJUT
                    </button>
                </div>
            </div>

            <div className='relative'>
           
                <div className='relative z-10 rounded-2xl overflow-hidden shadow-2xl'>
                    <img 
                        src="/img/about.jpeg" 
                        alt="Tim Kami atau Workshop" 
                        className="w-full h-[400px] object-cover"
                    />
                    {/* <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg border-l-4 border-primary">
                        <p className="text-xs font-bold text-gray-400 uppercase">Sejak Tahun</p>
                        <p className="text-xl font-black text-gray-800">2023</p>
                    </div> */}
                </div>
            </div>

        </div>
    </div>
</section>

<Footer/>
 </>
  )
}
