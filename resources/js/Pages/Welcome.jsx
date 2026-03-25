import Navbar from '@/Components/Navbar';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import TextType from '@/Components/TextType';
import Footer from '@/Components/Footer';
export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };
const [activeAccordion,setAccordiont] = useState(null);

const toggleAccordion = (id)=>{
  setAccordiont(activeAccordion === id ? null:id)
}
const faqs = [
    {
        id: 1,
        question: "Bagaimana cara menentukan ukuran baju?",
        answer: "Kami menyediakan layanan fitting gratis di butik kami. Jika Anda berada di luar kota, tim admin akan memandu Anda melakukan pengukuran mandiri sesuai standar size chart kami."
    },
    {
        id: 2,
        question: "Berapa lama durasi sewa yang diberikan?",
        answer: "Durasi standar sewa adalah 1 hari"
    },
    {
        id: 3,
        question: "Apakah baju harus dicuci sebelum dikembalikan?",
        answer: "Tidak perlu. Harga sewa sudah termasuk biaya laundry profesional dan sterilisasi. Anda cukup menggunakan dan mengembalikannya, kami yang urus kebersihannya."
    },
    {
        id: 4,
        question: "Bagaimana jika baju yang disewa rusak atau kotor?",
        answer: "Noda ringan adalah hal wajar. Namun untuk kerusakan permanen atau noda berat (seperti terkena lilin/sobek parah), akan dikenakan biaya perbaikan sesuai tingkat kerusakannya."
    }
];
    return (
        <>
            <Head title="Beranda" />
        <Navbar/>
<div className="relative bg-[#FAF7F2]  overflow-hidden min-h-screen">


  <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#C9A834]/15 blur-3xl pointer-events-none" />
  <div className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-[#C9A834]/10 blur-2xl pointer-events-none" />

  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <svg className="absolute right-0 top-0 h-full opacity-[0.04]" viewBox="0 0 200 800" preserveAspectRatio="none">
      <line x1="180" y1="0" x2="20" y2="800" stroke="#C9A834" strokeWidth="1"/>
      <line x1="160" y1="0" x2="0" y2="800" stroke="#C9A834" strokeWidth="1"/>
      <line x1="200" y1="0" x2="60" y2="800" stroke="#C9A834" strokeWidth="1"/>
    </svg>
  </div>

  <section className="relative max-w-7xl mx-auto px-6 lg:px-8 min-h-screen flex items-center">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full py-10 md:-mt-12">

      <div className="space-y-8 z-10">
        <div className='flex'>
          {   
<div className='inline-flex justify-center items-center text-xl font-heading text-white px-4 py-2 
bg-primary rounded-full transition-all duration-300 ease-in-out'>

<div className='w-3 h-3 rounded-full bg-white mr-3'></div>
<TextType 
  text={["Selamat datang di katalog kami!", "Temukan berbagai pilihan produk terbaik"
    ,
    "yang siap melengkapi gaya dan kebutuhanmu"]}
  typingSpeed={75}
  pauseDuration={1500}
  showCursor={true}
  cursorCharacter="|"
  texts={["Welcome to React Bits! Good to see you!","Build some amazing experiences!"]}
  deletingSpeed={50}
  variableSpeedEnabled={false}
  variableSpeedMin={60}
  variableSpeedMax={120}
  cursorBlinkDuration={0.5}
/>
</div>
          }
        </div>


        <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-wider text-gray-900 ">
          Temukan <br />
          <span className="text-[#C9A834]">Style </span>
          Terbaikmu
        </h1>

        <p className="text-gray-500 font-body text-lg leading-relaxed max-w-sm">
          Koleksi baju terbaru dengan kualitas premium dan desain modern. Cocok untuk semua gaya kamu.
        </p>

        <div className="flex gap-4 flex-wrap">
          <Link href={route('catalog')} className="bg-[#C9A834] text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-[#b8932b] transition shadow-lg shadow-[#C9A834]/30 text-sm">
            Lihat Katalog
          </Link>
          <Link href='#faq' className="border border-gray-300 px-7 py-3.5 rounded-xl text-gray-700 hover:bg-gray-100 transition text-sm font-medium">
            Pelajari →
          </Link >
        </div>

        {/* Stats */}
        <div className="flex gap-8 pt-4 border-t border-gray-200">
          <div>
            <div className="text-2xl font-bold text-gray-900">200+</div>
            <div className="text-xs text-gray-400 mt-0.5">Koleksi</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">5K+</div>
            <div className="text-xs text-gray-400 mt-0.5">Pelanggan</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">4.9★</div>
            <div className="text-xs text-gray-400 mt-0.5">Rating</div>
          </div>
        </div>
      </div>

      <div className="relative flex justify-center md:justify-end z-10">

        <div className="absolute top-6 right-6 w-[80%] h-[90%] rounded-3xl bg-[#C9A834]/20 border border-[#C9A834]/20" />
        <div className="absolute top-3 right-3 w-[80%] h-[90%] rounded-3xl bg-[#C9A834]/10" />

   
        <div className="relative w-[70%]">
          <img
            src="/img/hero.png"
            alt="Fashion"
            className="relative z-10 w-full  object-cover rounded-3xl shadow-2xl"
          />

          <div className="absolute bottom-6 left-[-40px] z-20 bg-white shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#C9A834] rounded-full flex items-center justify-center text-white text-xs font-bold">
              26
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800">Trend 2026</div>
              <div className="text-[10px] text-gray-400">Premium Collection</div>
            </div>
          </div>

          {/* Badge New Arrival */}
          <div className="absolute top-6 left-[-30px] z-20 bg-[#C9A834] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg rotate-[-6deg]">
            New Arrival ✦
          </div>
        </div>
      </div>

    </div>
  </section>
</div>

  <div className='pt-16 pb-24 bg-[#FAF7F2]'>

    <h3 className='text-center text-3xl md:text-5xl font-bold font-heading text-[#9A7A1A] tracking-tight'>
      Pusat Sewa Baju <span className="text-[#C9A834]">Terlengkap</span>
    </h3>
    <div className="w-24 h-1 bg-[#C9A834] mx-auto mt-4  rounded-full opacity-50"></div>
    <p className='text-center max-w-2xl mx-auto pt-2 text-slate-500'>Tampil memukau tanpa harus membeli. Temukan ratusan koleksi baju terbaru dari desainer ternama yang siap buat penampilanmu jadi pusat perhatian di setiap acara."</p>

    <section className=' max-w-7xl mx-auto'>

    <div className='max-w-7xl mx-auto px-6'>
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-12 gap-6 max-w-7xl mx-auto px-6'>
    
    <div className="bg-white border rounded-2xl shadow-sm p-7 border-neutral-200/60 hover:border-[#C9A834]/50 transition-all group">
      <div className="w-12 h-12 bg-[#C9A834]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#C9A834] transition-colors">
        <span className="inline-block w-7 h-7 text-[#C9A834] group-hover:text-white transition-colors duration-300">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M14.7 4.00181L14.46 3.69574C13.52 2.51266 13.05 1.92112 12.51 2.00845C11.96 2.09577 11.7 2.80412 11.18 4.22083L11.05 4.58735C10.9 4.98993 10.82 5.19122 10.68 5.33897C10.54 5.48671 10.35 5.56417 9.96 5.71911L7.48 7.24324C7.39 7.80849 7.97 8.29205 9.11 9.25915L10.12 10.9441L10.78 13.8794C11.27 14.1414 11.89 13.7319 13.11 12.9129L14.96 12.456C16.75 12.9522 17.46 13.1493 17.85 12.746C18.24 12.3427 18.04 11.6061 17.66 10.1328L17.43 8.91657C17.46 8.70951 17.57 8.52816 17.79 8.16546L18.92 5.40935C18.66 4.89806 17.93 4.85229 16.46 4.76076L15.28 4.60208C15.1 4.5061 14.96 4.338 14.7 4.00181Z" fill="currentColor"/>
            <path opacity="0.5" d="M10.27 16.5148C10.77 16.9068 11.69 17.8689 13.48 18.2768C13.54 18.5174 12.13 19.6932 11.72 21.4847C11.48 21.5423 10.3 20.1306 8.51 19.7227C8.45 19.4821 9.86 18.3062 10.27 16.5148Z" fill="currentColor"/>
          </svg>
        </span>
      </div>
      <h5 className="text-xl font-bold text-neutral-900 mb-3">Koleksi Terlengkap</h5>
      <p className="text-sm leading-relaxed text-neutral-500">Mulai dari Jas, Kebaya, hingga Gaun Internasional dengan 200+ pilihan model terbaru.</p>
    </div>
    <div className="bg-white border rounded-2xl shadow-sm p-7 border-neutral-200/60 hover:border-[#C9A834]/50 transition-all group">
      <div className="w-12 h-12 bg-[#C9A834]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#C9A834] transition-colors">
        <span className="inline-block w-7 h-7 text-[#C9A834] group-hover:text-white transition-colors duration-300">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
            <path opacity="0.5" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z" fill="currentColor"/>
          </svg>
        </span>
      </div>
      <h5 className="text-xl font-bold text-neutral-900 mb-3">Laundry & Steril</h5>
      <p className="text-sm leading-relaxed text-neutral-500">Proses laundry profesional dan sterilisasi sebelum disewakan. Higienis 100% terjamin.</p>
    </div>

    <div className="bg-white border rounded-2xl shadow-sm p-7 border-neutral-200/60 hover:border-[#C9A834]/50 transition-all group">
      <div className="w-12 h-12 bg-[#C9A834]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#C9A834] transition-colors">
        <span className="inline-block w-7 h-7 text-[#C9A834] group-hover:text-white transition-colors duration-300">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M20 7H4C2.89543 7 2 7.89543 2 9V15C2 16.1046 2.89543 17 4 17H20C21.1046 17 22 16.1046 22 15V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M6 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M18 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      </div>
      <h5 className="text-xl font-bold text-neutral-900 mb-3">Layanan Fitting</h5>
      <p className="text-sm leading-relaxed text-neutral-500">Nikmati layanan fitting gratis dan jasa penyesuaian ukuran minor agar baju pas di badan.</p>
    </div>

    <div className="bg-white border rounded-2xl shadow-sm p-7 border-neutral-200/60 hover:border-[#C9A834]/50 transition-all group">
      <div className="w-12 h-12 bg-[#C9A834]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#C9A834] transition-colors">
        <span className="inline-block w-7 h-7 text-[#C9A834] group-hover:text-white transition-colors duration-300">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M17 10C15.8954 10 15 10.8954 15 12C15 13.1046 15.8954 14 17 14C18.1046 14 19 13.1046 19 12C19 10.8954 18.1046 10 17 10Z" fill="currentColor"/>
            <path opacity="0.5" d="M22 10V15C22 18 20 20 17 20H7C4 20 2 18 2 15V9C2 6 4 4 7 4H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 10H22V14H17C15.8954 14 15 13.1046 15 12C15 10.8954 15.8954 10 17 10Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </span>
      </div>
      <h5 className="text-xl font-bold text-neutral-900 mb-3">Harga Kompetitif</h5>
      <p className="text-sm leading-relaxed text-neutral-500">Tampil mewah tidak harus mahal. Paket sewa mulai dari harga pelajar hingga koleksi eksklusif.</p>
    </div>

  </div>
  </div>
    </section>
  </div>
<div className='pt-10 pb-10  bg-gradient-to-br from-[#EBD18B] via-[#C9A834] to-[#9A7A1A] relative overflow-hidden'>

  <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
    <div className="absolute top-[-10px] left-[-10px] w-64 h-64 bg-white blur-[100px] rounded-full"></div>
  </div>

  <div className="relative z-10">
    <h3 className='text-center text-3xl md:text-5xl font-bold font-heading text-white tracking-tight drop-shadow-md'>
      Cara Mudah <span className="text-[#FDF2D1]">Sewa Katalog</span>
    </h3>
    <div className="w-24 h-1 bg-white/50 mx-auto mt-4 rounded-full"></div>
    <p className='text-center max-w-2xl mx-auto pt-4 text-white/90 px-6'>
      Nikmati kemudahan sewa baju premium langsung melalui WhatsApp. Pilih koleksimu dan tampil memukau sekarang juga!
    </p>

    <section className='max-w-7xl mx-auto px-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-16 gap-6'>
        
   
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 hover:bg-white/20 transition-all group">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-lg">
            <span className="text-[#C9A834] font-bold text-xl">01</span>
          </div>
          <h5 className="text-xl font-bold text-white mb-3 tracking-wide">Pilih Katalog</h5>
          <p className="text-sm leading-relaxed text-white/80">
            Jelajahi berbagai koleksi premium kami di website atau Instagram. Catat kode atau screenshot baju favoritmu.
          </p>
        </div>

      
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 hover:bg-white/20 transition-all group">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-lg">
            <span className="text-[#C9A834] font-bold text-xl">02</span>
          </div>
          <h5 className="text-xl font-bold text-white mb-3 tracking-wide">Kirim Pesan</h5>
          <p className="text-sm leading-relaxed text-white/80">
            Klik tombol WhatsApp, kirim foto baju yang dipilih dan informasikan tanggal acara Anda untuk cek ketersediaan.
          </p>
        </div>

    
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 hover:bg-white/20 transition-all group">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-lg">
            <span className="text-[#C9A834] font-bold text-xl">03</span>
          </div>
          <h5 className="text-xl font-bold text-white mb-3 tracking-wide">Fitting & Bayar</h5>
          <p className="text-sm leading-relaxed text-white/80">
            Lakukan fitting (opsional) untuk memastikan ukuran pas, lalu selesaikan pembayaran DP untuk amankan slot tanggal.
          </p>
        </div>

      
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7 hover:bg-white/20 transition-all group">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 shadow-lg">
            <span className="text-[#C9A834] font-bold text-xl">04</span>
          </div>
          <h5 className="text-xl font-bold text-white mb-3 tracking-wide">Ambil & Tampil</h5>
          <p className="text-sm leading-relaxed text-white/80">
            Ambil baju di toko atau kirim via kurir sesuai jadwal. Anda siap tampil mempesona di momen spesial!
          </p>
        </div>

      </div>


      <div className="mt-16 text-center">
        <a href="https://wa.me/yournumber" target="_blank" className="inline-flex items-center gap-2 bg-white text-[#9A7A1A] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#FDF2D1] transition-all shadow-xl hover:scale-105">
           Hubungi Admin Sekarang 
           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.499-5.688-1.447l-6.305 1.65zm6.59-3.407c1.535.911 3.327 1.391 5.151 1.392 5.534 0 10.039-4.505 10.04-10.039 0-2.684-1.045-5.207-2.943-7.105-1.9-1.898-4.42-2.942-7.11-2.942-5.533 0-10.038 4.505-10.039 10.039-.001 1.91.53 3.774 1.535 5.39l-1.013 3.7 3.793-.995z"/></svg>
        </a>
      </div>
    </section>
  </div>
</div>

<div className='mt-32 p-4'>
  <section id='faq' className='max-w-7xl mx-auto '>
<div className='grid grid-cols-1 md:grid-cols-2'>
<div>
  <img src="/img/hero2.jpg" alt="background2" className='w-[500px] object-cover rounded-3xl shadow-2xl'  />
</div>
<div>
<div className='className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm'>
<div className="mb-10 text-left">

    <div className="inline-flex mt-3 items-center gap-2 bg-[#C9A834]/10 text-[#9A7A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A834] animate-pulse"></span>
        Support System
    </div>
    <h3 className='text-4xl md:text-5xl font-bold font-heading text-[#9A7A1A] tracking-tight leading-tight'>
        Pusat <span className="text-[#C9A834]">Bantuan</span>
    </h3>
    
    <div className="w-20 h-1.5 bg-[#C9A834] mt-6 rounded-full"></div>
    
    <p className='mt-6 text-gray-500 text-lg max-w-md leading-relaxed'>
        Punya pertanyaan sebelum menyewa? Kami telah merangkum segala hal yang perlu Anda ketahui agar pengalaman sewa Anda berjalan sempurna.
    </p>
</div>
{faqs.map((faq)=>(
<div key={faq.id} className="border-b border-gray-100 last:border-none">
      <button 
    onClick={() => toggleAccordion(faq.id)}
                                className="flex items-center justify-between w-full p-5 text-left select-none hover:bg-gray-50 transition-colors"
                            >
                                <span className={`font-semibold ${activeAccordion === faq.id ? 'text-[#C9A834]' : 'text-gray-700'}`}>
                                    {faq.question}
                                </span>
                                <svg 
                                    className={`w-5 h-5 text-[#C9A834] transition-transform duration-300 ${activeAccordion === faq.id ? 'rotate-180' : ''}`} 
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === faq.id ? 'max-h-40' : 'max-h-0'}`}>
                                <div className="p-5 pt-0 text-gray-500 leading-relaxed text-sm">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>                            
))}
</div>
</div>
</div>
  </section>
</div>
<Footer/>
        </>
    );
}
