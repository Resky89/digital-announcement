'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Megaphone,
  Users,
  FileImage,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores';
import { ROUTES } from '@/config/constants';

const adminMenuItems = [
  {
    label: 'Dashboard',
    href: ROUTES.ADMIN.HOME,
    icon: LayoutDashboard,
  },
  {
    label: 'Pengumuman',
    href: ROUTES.ADMIN.ANNOUNCEMENTS,
    icon: Megaphone,
  },
  {
    label: 'Assets',
    href: ROUTES.ADMIN.ASSETS,
    icon: FileImage,
  },
  {
    label: 'Users',
    href: ROUTES.ADMIN.USERS,
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out',
        'bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950',
        'border-r border-slate-700/50',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/50">
        <Link href={ROUTES.ADMIN.HOME} className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="text-lg font-bold text-white">Admin Panel</span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {adminMenuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                'group relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-white')} />
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-600/10 to-transparent pointer-events-none" />
    </aside>
  );
}
