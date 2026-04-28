import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen bg-[#FAF7F2] overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-primary/8 blur-2xl pointer-events-none" />
            
            {/* Decorative lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <svg className="absolute right-0 top-0 h-full opacity-[0.02]" viewBox="0 0 200 800" preserveAspectRatio="none">
                    <line x1="180" y1="0" x2="20" y2="800" stroke="#C9A834" strokeWidth="1"/>
                    <line x1="160" y1="0" x2="0" y2="800" stroke="#C9A834" strokeWidth="1"/>
                    <line x1="200" y1="0" x2="60" y2="800" stroke="#C9A834" strokeWidth="1"/>
                </svg>
            </div>

            <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-12">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl bg-white shadow-xl shadow-black/5 border border-slate-100 overflow-hidden">
                    
                        <div className="h-1 bg-gradient-to-r from-primary to-primary/70" />
                        <div className="flex justify-center items-center">

                <Link href="/" className="mb-2 mt-4 inline-block transform transition-transform duration-300 hover:scale-105">
                    <div className="flex items-center justify-center text-white w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                        <ApplicationLogo className="h-12 w-12 fill-white" />
                    </div>
                </Link>
                        </div>
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold font-heading text-primary mb-2">Katalog Baju</h1>
                    <p className="text-slate-600 text-sm font-body">Kelola bisnis penyewaan baju Anda dengan mudah</p>
                </div>
                        
                        <div className="px-8 py-8">
                            {children}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
