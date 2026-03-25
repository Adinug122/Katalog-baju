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
                      Desa Sukamahi, RT.004 RW.002, Kota Deltamas, <br className="hidden md:block" />
                      Kec. Cikarang Pusat, Kab. Bekasi, Jawa Barat 17530
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
                        <p className='text-[12px] md:text-[13px] font-bold text-gray-800'>0878-8429-0400</p>
                        <a href="https://wa.me/6287884290400" className='text-[10px] text-green-600 font-bold hover:underline flex items-center gap-1 mt-1'>
                          Chat Sales 1 <ChevronRight size={12} />
                        </a>
                      </div>
                      <div>
                        <p className='text-[12px] md:text-[13px] font-bold text-gray-800'>0877-3772-2826</p>
                        <a href="https://wa.me/6287737722826" className='text-[10px] text-green-600 font-bold hover:underline flex items-center gap-1 mt-1'>
                          Chat Sales 2 <ChevronRight size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2'>
                  <div className='flex gap-4 items-center'>
                    <div className='w-10 h-10 bg-blue-50 rounded-xl flex-shrink-0 flex items-center justify-center text-blue-600'>
                      <Phone size={18} />
                    </div>
                    <div>
                      <h5 className='text-[8px] md:text-[9px] font-bold text-gray-400 uppercase mb-0.5'>Telephone</h5>
                      <p className='text-[11px] md:text-xs font-bold text-gray-800'>021-22157052</p>
                    </div>
                  </div>
                  <div className='flex gap-4 items-center'>
                    <div className='w-10 h-10 bg-red-50 rounded-xl flex-shrink-0 flex items-center justify-center text-red-500'>
                      <Mail size={18} />
                    </div>
                    <div>
                      <h5 className='text-[8px] md:text-[9px] font-bold text-gray-400 uppercase mb-0.5'>Email Resmi</h5>
                      <p className='text-[11px] md:text-xs font-bold text-gray-800'>sales@baju.co.id</p>
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
                    <p className='text-lg md:text-2xl font-black tracking-tight'>08:00 - 17:00</p>
                  </div>
                </div>

              </div>

              <div className='rounded-xl overflow-hidden shadow-xl relative min-h-[350px] md:min-h-[500px]'>
                 <iframe 
                    title="Lokasi"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.544715970868!2d107.16875887586523!3d-6.323385761873155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e699be61614777d%3A0xc6106e21074a3f45!2sDesa%20Sukamahi%2C%20Kec.%20Cikarang%20Pusat%2C%20Kabupaten%20Bekasi%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1711000000000!5m2!1sid!2sid" 
                    className="w-full h-full border-0 grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                    allowFullScreen="" 
                    loading="lazy" 
                  ></iframe>
                
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