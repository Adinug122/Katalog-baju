import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar"
import { AppSidebar } from "@/Components/AppSidebar"
 
export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <SidebarProvider style={{ '--sidebar-width': '18rem', '--sidebar-width-icon': '3rem' }}>
      <div className="min-h-screen w-full ">
        <AppSidebar />

        <main className="flex-1 overflow-auto p-6 md:ml-[18rem]">
          <header className="flex h-16 items-center border-b px-4 bg-white/50 backdrop-blur">
            <SidebarTrigger />
            <h1 className="ml-4 font-bold text-lg">Katalog Baju</h1>
          </header>

          <div className="mt-4">{children}</div>
        </main>
      </div>
    </SidebarProvider>
    );
}
