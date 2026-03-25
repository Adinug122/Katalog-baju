import Footer from '@/Components/Footer'
import Navbar from '@/Components/Navbar'
import { Head,Link, usePage } from '@inertiajs/react'
import React from 'react'
export default function Catalog() {
const { clothes, categories, filters } = usePage().props;
  return (
    <>
    <Head title='Catalog'/>
   <Navbar/> 
   <section className='pt-20 px-5'>
   <div className='grid col-span-1  md:grid-cols-12 min-h-screen bg-gray-100 gap-5'>
    <aside className=' col-span-1 md:col-span-3 bg-white'>
    <div className="bg-primary  p-4 rounded-t-lg font-bold text-white">
    KATEGORI BAJU
    </div>
    <div className='flex flex-col gap-1'>
    <Link
    href={route('catalog')} 
     className="p-2 hover:bg-gray-100 rounded text-sm border-b"
    >
    Semua Produk
    </Link>

    {categories.map((item)=>(
        <Link
        key={item.id}
        href={route('catalog', { category: item.id ,search:filters?.search})}
      className={`p-2 hover:bg-orange-50 rounded text-sm border-b flex justify-between ${
            filters?.category == item.id ? 'bg-orange-100 font-bold' : ''
        }`}
        >
        {item.name}
        </Link>
    ))}

    </div>
    <ul className="space-y-2">
                        
    </ul>
    </aside>
    <main className='col-span-1 md:col-span-9 mt-6 '>

    <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
            {filters?.search ? `Hasil Pencarian: "${filters.search}"` : 'Katalog Produk'}
        </h1>
        {filters?.search && (
            <Link href={route('catalog')} className="text-xs text-primary underline">
                Hapus Pencarian
            </Link>
        )}
    </div>
    <hr className="mb-6" />
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
  {clothes.data.map((item) => (
    <div key={item.kode} className="border bg-white shadow-sm rounded-lg overflow-hidden flex flex-col">

        <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
            {item.images && item.images.length > 0 ? (
                <img 
                    src={`/storage/${item.images[0].path}`} 
                    className="w-full h-full object-cover" 
                    alt={item.name}
                />
            ) : (
                <div className="text-gray-300 text-xs">No Image</div>
            )}
        </div>

        <div className="p-3 flex-1 flex flex-col">
            <span className="text-[10px] w-fit px-2 py-1 text-white bg-primary rounded-lg font-bold uppercase mb-1">
                {item.category?.name || 'Uncategorized'}
            </span>
            
            <h3 className="text-xs font-bold text-gray-800 line-clamp-2 mb-1 uppercase">
                {item.name}
            </h3>
            
            <p className="text-sm font-bold text-primary mt-auto">
                Rp {item.price.toLocaleString()}
            </p>
            <Link 
                href={route('catalog.show', item.kode)}
                className="mt-3 block w-full bg-gray-100 text-center py-2 rounded-md text-[10px] font-bold hover:bg-gray-200 transition-colors"
            >
                LIHAT DETAIL ›
            </Link>
        </div>
    </div>
))}
  
    </div>
<div className="mt-10 mb-10 flex flex-wrap justify-center gap-1">
              {clothes.links.map((link, index) => (
                link.url ? (
                  <Link
                    key={index}
                    href={link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-2 border rounded-lg text-xs md:text-sm transition-colors ${
                      link.active ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  />
                ) : (
                  <span
                    key={index}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className="px-3 py-2 border rounded-lg text-xs md:text-sm text-gray-300 bg-gray-50 cursor-not-allowed"
                  />
                )
              ))}
            </div>
    </main>
    
   </div>
   </section>
    <Footer/>
    </>

  )
}
