import React, { useState } from 'react'
import { Link,usePage,router } from '@inertiajs/react';
export default function Navbar() {

  const {url,component} = usePage();

  const [searchValue,setSearchValue] = useState('');

const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('catalog'),
     { search: searchValue },
      {
      preserveState: true,
    });
  };
    const [isOpen,setIsOpen] = useState(false);
  return (
    <header className="border-b fixed w-full z-20  border-gray-200 bg-white">
  <div className="mx-auto flex h-20  items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8">
        
    <a
      href="#"
      title=""
      className="flex items-center gap-1 text-xl text-gray-700 :text-gray-200"
    >
    
      <span className="font-semibold sm:block">Pian</span>
      <span className="font-light sm:block text-primary">Collections</span>
    </a>
       <nav className="hidden md:flex items-center gap-6 text-sm">
    <Link href={route('home')}
    className={`block ${route().current('home') ? 'font-bold text-[#C9A834]': 'text-gray-500'}`}>Beranda</Link>
    <Link href={route('catalog')}
      className={`block ${route().current('catalog*') ? 'font-bold text-[#C9A834]': 'text-gray-500'}`}>Katalog</Link>
    <Link href={route('about')}
      className={`block ${route().current('about') ? 'font-bold text-[#C9A834]': 'text-gray-500'}`}>Tentang</Link>
          <Link href={route('contact')}
      className={`block ${route().current('contact') ? 'font-bold text-[#C9A834]': 'text-gray-500'}`}>Kontak</Link>

    </nav>
<div className={`${isOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg py-4 z-50`}>
  <div className="px-5 flex flex-col gap-4 text-sm">
    
    {/* Navigasi Links */}
    <div className="flex flex-col gap-2">
      <Link 
        href={route('home')}
        onClick={() => setIsOpen(false)}
        className={`block py-2 ${route().current('home') ? 'font-bold text-[#C9A834]' : 'text-gray-600'}`}
      >
        Beranda
      </Link>
      <Link 
        href={route('catalog')}
        onClick={() => setIsOpen(false)}
        className={`block py-2 ${route().current('catalog*') ? 'font-bold text-[#C9A834]' : 'text-gray-600'}`}
      >
        Katalog
      </Link>
      <Link 
        href={route('about')}
        onClick={() => setIsOpen(false)}
        className={`block py-2 ${route().current('about') ? 'font-bold text-[#C9A834]' : 'text-gray-600'}`}
      >
        Tentang
      </Link>
      <Link 
        href={route('contact')}
        onClick={() => setIsOpen(false)}
        className={`block py-2 ${route().current('contact') ? 'font-bold text-[#C9A834]' : 'text-gray-600'}`}
      >
        Kontak
      </Link>
    </div>

    {/* Pembatas Opsional */}
    <hr className="border-gray-100" />

    {/* Form Pencarian */}
    <form onSubmit={handleSearch} className="pb-2">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        /* Tambahkan w-full dan bg-gray-100 agar lebih jelas di layar HP */
        className="w-full focus:ring-2 focus:border-transparent focus:ring-[#C9A834] bg-gray-100 border-none rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400"
        placeholder="Cari Baju..."
      />
    </form>

  </div>
</div>
    <div className="flex items-center">
      <div className="flex items-center gap-4">
          
    <form onSubmit={handleSearch}>
     <input
        type="text"
        value={searchValue}
        onChange={(e)=>setSearchValue(e.target.value)}
        className="hidden md:block focus:ring-2 focus:border-transparent focus:ring-[#C9A834] bg-white rounded-xl px-3 py-2"
        placeholder="Cari Baju"
      />
    </form>

        <button onClick={()=>setIsOpen(!isOpen)} className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden :bg-gray-800 :text-white :hover:text-white/75">
          <span className="sr-only">Toggle menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>
  )
}
