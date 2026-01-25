'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Home,
  FileText,
  Users,
  Code,
  LineChart,
  Settings,
  LogOut,
  Sparkles,
  CreditCard,
  Receipt,
  Briefcase,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { useFirebaseApp } from '@/firebase';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Claims', href: '/claims', icon: FileText },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Insurance', href: '/insurance', icon: Briefcase },
  { name: 'AI Coder', href: '/coding', icon: Code },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Billing', href: '/billing', icon: Receipt },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const app = useFirebaseApp();
  const auth = getAuth(app);

  const handleLogout = () => {
    auth.signOut();
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1 && parts[1]) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2 justify-center group-data-[collapsible=icon]:hidden">
            <Sparkles className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold text-sidebar-foreground">RevCycle AI</h1>
          </div>
          <div className="hidden items-center gap-2 p-2 justify-center group-data-[collapsible=icon]:flex">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                    tooltip={{ children: item.name }}
                  >
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/settings">
                  <SidebarMenuButton
                    isActive={pathname === '/settings'}
                    tooltip={{ children: 'Settings' }}
                  >
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-4">
                 <SidebarTrigger className="md:hidden" />
                 <h1 className="text-xl font-semibold hidden md:block">Welcome back, {user?.displayName?.split(' ')[0] || 'Admin'}</h1>
            </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoURL || ''} />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName || 'Anonymous User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
