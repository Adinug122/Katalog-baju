import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react'; // Gunakan Link dari Inertia
import { ShoppingBasket } from 'lucide-react';

export default function CartButton() {
    const [count, setCount] = useState(0);

    const getCartCount = () => {
      
        const cart = JSON.parse(localStorage.getItem('rent_cart') || '[]');
        
     
        const total = cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
        setCount(total);
    }

    useEffect(() => {
        getCartCount();
        
        window.addEventListener('cart-updated', getCartCount);
        
        return () => window.removeEventListener('cart-updated', getCartCount);
    }, []);

    return (
        <Link
            href={route('cart.index')}
            className="flex items-center gap-3 bg-white border border-gray-200 pl-5 pr-2 py-2 rounded-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
        >
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest group-hover:text-primary">
                Keranjang Belanja
            </span>

            <div className="relative">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#1a2a4a] group-hover:bg-primary transition-colors">
                    <ShoppingBasket size={18} className="text-white" />
                </div>

            
                {count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center leading-none border-2 border-white animate-in zoom-in duration-300">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
            </div>
        </Link>
    );
}