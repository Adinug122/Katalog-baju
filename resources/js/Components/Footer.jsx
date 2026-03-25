import React from 'react'

export default function Footer() {
  return (
<footer className="bg-[#1A1A1A] text-white pt-20 pb-10 relative overflow-hidden">
    {/* Dekorasi Gradient Halus di Background */}
    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C9A834]/5 blur-[120px] pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#C9A834]/5 blur-[100px] pointer-events-none"></div>

    <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            <div className="space-y-6">
                <h4 className="text-2xl font-bold tracking-wider">
                    Terminal <span className="text-[#C9A834]">Ultimate</span>
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed italic">
                    "Elevating your style for every precious moment."
                </p>
                <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-[#C9A834] hover:text-[#C9A834] transition-all duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                </div>
            </div>

            <div>
                <h5 className="font-bold text-[#C9A834] mb-6 uppercase tracking-widest text-xs">Explore</h5>
                <ul className="space-y-4 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>›</span> Beranda</a></li>
                    <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>›</span> Katalog Baju</a></li>
                    <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>›</span> Tentang</a></li>
                    <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>›</span> Kontak</a></li>
                </ul>
            </div>
            <div>
                <h5 className="font-bold text-[#C9A834] mb-6 uppercase tracking-widest text-xs">Services</h5>
                <ul className="space-y-4 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>›</span> Fitting Gratis</a></li>
                    <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>›</span> Laundry Steril</a></li>
                    <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>›</span> Custom Size</a></li>
                    <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><span>›</span> Member Reward</a></li>
                </ul>
            </div>

      
            <div>
                <h5 className="font-bold text-[#C9A834] mb-6 uppercase tracking-widest text-xs">Contact Us</h5>
                <ul className="space-y-4 text-sm text-gray-400">
                  <ul className="space-y-4 text-sm text-gray-400">
 
    <li className="flex items-start gap-4 group">
        <span className="text-[#C9A834] mt-1 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>
        </span>
        <span className="leading-relaxed group-hover:text-white transition-colors">Jl. Sudirman No. 123, Madiun, Jawa Timur</span>
    </li>

    <li className="flex items-center gap-4 group">
        <span className="text-[#C9A834] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
        </span>
        <span className="group-hover:text-white transition-colors">+62 812 3456 7890</span>
    </li>

    <li className="flex items-center gap-4 group">
        <span className="text-[#C9A834] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
        </span>
        <span className="break-all group-hover:text-white transition-colors">info@terminalultimate.com</span>
    </li>
</ul>
                </ul>
            </div>
        </div>

        {/* Garis Bawah & Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                © 2026 Terminal Ultimate. Crafted for Elegance.
            </p>
            <div className="flex gap-8 text-[10px] text-gray-500 uppercase tracking-widest">
                <a href="#" className="hover:text-[#C9A834]">Terms</a>
                <a href="#" className="hover:text-[#C9A834]">Privacy</a>
            </div>
        </div>
    </div>
</footer>
  )
}
