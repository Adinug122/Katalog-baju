import React from 'react'
import { Head } from '@inertiajs/react'
import Footer from '@/Components/Footer'
import Navbar from '@/Components/Navbar'
import { 
  MapPin, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight,
  Shirt
} from 'lucide-react'

export default function Contact() {
  return (
    <>
      <Head title="Kontak Kami" />
      <Navbar/>
      
    
      <section className='bg-gray-100 py-12 md:py-24 px-5 min-h-screen flex items-center font-sans'>
        <div className='max-w-6xl mx-auto w-full'>
            <div className="mb-8 md:mb-12">
              <h3 className='font-bold text-2xl md:text-3xl text-primary uppercase tracking-wider'>
                Kontak
              </h3>
              <div className='w-16 md:w-24 bg-primary h-[3px] mt-2'></div>
            </div>
        
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch'>
              
              <div className='bg-white rounded-xl p-6 md:p-12 shadow-sm flex flex-col gap-6 md:gap-8 border border-white'>

                <div className='flex items-center gap-3 mb-2 md:mb-4'>
                  <div className='w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100'>
                    <Shirt size={20} strokeWidth={2.5} />
                  </div>
                  <h2 className='text-xl md:text-2xl font-black tracking-tighter text-gray-800 uppercase'>
                    KATALOG <span className='text-primary'>BAJU</span>
                  </h2>
                </div>

           
                <div className='flex gap-4 md:gap-5'>
                  <div className='w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-blue-600 border border-gray-100'>
                    <MapPin size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h5 className='text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1'>Alamat Kantor</h5>
                    <p className='text-xs md:text-sm text-gray-700 leading-relaxed font-semibold'>
                   Perum TNI-AL Blok F3/31 RT 24 RW 08 Desa Kedungkendo, <br className="hidden md:block" />
                       Kec. Candi Kab. Sidoarjo 61271
                    </p>
                  </div>
                </div>

                {/* WhatsApp Sales */}
                <div className='flex gap-4 md:gap-5'>
                  <div className='w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-green-500 border border-green-100'>
                    <MessageCircle size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className='flex-1'>
                    <h5 className='text-[9px] md:text-[10px] font-bold text-green-600 uppercase tracking-widest mb-3'>Layanan Sales (WhatsApp)</h5>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-[12px] md:text-[13px] font-bold text-gray-800'>0812-2942-9816</p>
                        <a href="https://wa.me/6281229429816" className='text-[10px] text-green-600 font-bold hover:underline flex items-center gap-1 mt-1'>
                          Chat Admin <ChevronRight size={12} />
                        </a>
                      </div>
                      <div>
                        <p className='text-[12px] md:text-[13px] font-bold text-gray-800'>0857-0815-9800</p>
                        <a href="https://wa.me/6285708159800" className='text-[10px] text-green-600 font-bold hover:underline flex items-center gap-1 mt-1'>
                          Chat Admin <ChevronRight size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2'>
                
                  <div className='flex gap-4 items-center'>
                    <div className='w-10 h-10 bg-red-50 rounded-xl flex-shrink-0 flex items-center justify-center text-red-500'>
                      <Mail size={18} />
                    </div>
                    <div>
                      <h5 className='text-[8px] md:text-[9px] font-bold text-gray-400 uppercase mb-0.5'>Email Resmi</h5>
                      <p className='text-[11px] md:text-xs font-bold text-gray-800'>piancollections@gmail.com</p>
                    </div>
                
                  </div>
                </div>

                
                <div className='mt-6 md:mt-auto bg-primary text-white p-5 md:p-6 rounded-2xl md:rounded-[35px] flex gap-4 md:gap-5 items-center shadow-lg shadow-red-100'>
                  <div className='w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex-shrink-0 flex items-center justify-center'>
                    <Clock size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h5 className='text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-80'>Jam Operasional</h5>
                    <p className='text-[10px] md:text-xs mt-0.5'>Senin - Sabtu</p>
                    <p className='text-lg md:text-2xl font-black tracking-tight'>09:00 - 20:00</p>
                  </div>
                </div>

              </div>

              <div className='rounded-xl overflow-hidden shadow-xl relative min-h-[350px] md:min-h-[500px]'>
            <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15823.493659267611!2d112.68739505047114!3d-7.479227855270228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e0db63591bff%3A0x7ed4b80de0b7c8df!2sPerum%20TNI%20AL%2C%20Jl.%20Kayen%20No.21%2C%20Kayen%2C%20Kedungkendo%2C%20Kec.%20Candi%2C%20Kabupaten%20Sidoarjo%2C%20Jawa%20Timur%2061271!5e0!3m2!1sid!2sid!4v1777607765548!5m2!1sid!2sid"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className="w-full h-full"
/>
                
                  <div className="absolute top-4 right-4 md:top-6 md:right-6">
                     <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg flex items-center gap-2 border border-white transition-all">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter text-gray-700">Live Location</span>
                     </div>
                  </div>
              </div>

            </div>
        </div>
      </section>
      <Footer/>
    </>
  )
}