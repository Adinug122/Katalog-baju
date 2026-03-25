import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return(
        <div className='flex flex-wrap mt-6 justify-center gap-1'>
        {links.map((link,key)=>(
            link.url === null ? (
                <div
                        key={key}
                        className="px-4 py-2 text-sm text-slate-400 border rounded-lg bg-white"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
            ):(
                <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm border rounded-lg transition-all ${
                            link.active 
                                ? 'bg-primary text-white border-sidebar-accent font-bold' 
                                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
            )
        ))}
        </div>
    );
}

