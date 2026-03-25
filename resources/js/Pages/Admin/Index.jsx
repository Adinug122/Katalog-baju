import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head,router } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
export default function Index({auth,admins}) {
    const toggleStatus = (id)=>{
        if(confirm('Apakah ingin menghapus')){
        router.post(route('manage.admin', id));
        }
    };

    const [search,setSearch] = useState("");

    const hasil = (admins,key) =>{
        if (!key) return admins;
    return admins.filter((item) =>
        item.name.toLowerCase().includes(key.toLowerCase()) ||
        item.email.toLowerCase().includes(key.toLowerCase())
    );
};
const filtered = hasil(admins, search);

  return (
   <AuthenticatedLayout
   user={auth.user}
   header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Akun Admin</h2>}
   >
    <Head title='kelola Admin'/>
    <div className='py-12'>
        
    <input type="text"
    className='rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500'
    value={search}
    onChange={(e)=> setSearch(e.target.value)}
    placeholder='Masukan nama / email'
    />
     <div className="overflow-x-auto mt-3 rounded-lg border border-slate-200" style={{borderWidth:'0.5px'}}>

  <table className="min-w-full w-full text-left bg-white">
    <thead className="bg-slate-50 border-b border-slate-200">
      <tr>
        <th className="px-4 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Nama</th>
        <th className="px-4 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Email</th>
        <th className="px-4 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider text-center">Status</th>
        <th className="px-4 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider text-center">Aksi</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
     {filtered?.length > 0 ?(
         filtered.map((admin) => {
           return (
             <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
               <td className="px-4 py-3">
                 <div className="flex items-center gap-3">
                   <span className="text-sm text-slate-800">{admin.name}</span>
                 </div>
               </td>
               <td className="px-4 py-3 text-sm text-slate-500">{admin.email}</td>
               <td className="px-4 py-3 text-center">
                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium
                   ${admin.is_active ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                   <span className={`w-1.5 h-1.5 rounded-full ${admin.is_active ? 'bg-green-600' : 'bg-red-500'}`}/>
                   {admin.is_active ? 'Aktif' : 'Nonaktif'}
                 </span>
               </td>
               <td className="px-4 py-3 text-center">
                 <Button
                   size="sm"
                   onClick={() => toggleStatus(admin.id)}
                   variant={admin.is_active ? "destructive" : "default"}
                   className={`${admin.is_active ? 'bg-red-500 px-2 py-2 text-white rounded-lg hover:bg-red-700'
                        : 'bg-green-500 px-2 py-2 text-white rounded-lg hover:bg-green-700'}`}
                 >
                   {admin.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                 </Button>
               </td>
             </tr>
           );
         })
     ):(
          <tr>
                <td className="px-6 py-10 text-center text-sm text-slate-500" colSpan={7}>Belum ada data pakaian.</td>
              </tr>
     )}
    </tbody>
  </table>
</div>
    </div>
   </AuthenticatedLayout>
  )
}
