import { Calendar, Home, Inbox, Settings, Shirt, List, ShoppingBag,Users } from "lucide-react" // Import icon
import { Link, usePage } from "@inertiajs/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/Components/ui/sidebar"



export function AppSidebar() {
  const { url,auth } = usePage().props;
  const userRole = auth.user.role;

  const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Kategori", url: "/categories", icon: List },
  { title: "Produk", url: "/clothes", icon: Shirt },
  { title: "Sewa", url: "/rents", icon: ShoppingBag },
  { title: "Settings", url: "/profile", icon: Settings },
]
  if(userRole === 'owner'){
    items.push({title:"Kelola Admin",url:"/manage-admin",icon:Users});
  }

  return (
    <Sidebar className='w-72 min-w-[288px] border-r  min-h-screen text-sm'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-2xl font-bold mb-10 '>Katalog Baju</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        url === item.url ? 'bg-primary text-white' : 'text-current'
                      }`}
                    >
                      <item.icon className='h-4 w-4' />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}