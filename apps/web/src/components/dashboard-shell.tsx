'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  School,
  LayoutDashboard,
  BookOpen,
  Users,
  Award,
  Calendar,
  FileSpreadsheet,
  ShieldCheck,
  DollarSign,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

interface DashboardShellProps {
  roleTitle: string;
  userName: string;
  userRole: string;
  institutionName?: string;
  sidebarItems: SidebarItem[];
  children: React.ReactNode;
}

export function DashboardShell({
  roleTitle,
  userName,
  userRole,
  institutionName = 'Kilimanjaro Secondary School',
  sidebarItems,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0e1424] border-r border-slate-800/80 flex-shrink-0 z-30">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <School className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">Academic OS</span>
            <span className="text-[11px] text-blue-400 font-semibold">{roleTitle}</span>
          </div>
        </div>

        {/* Institution Context Pill */}
        <div className="px-4 py-3 border-b border-slate-800/50">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">Active Institution</span>
            <span className="text-xs font-semibold text-slate-200 block truncate">{institutionName}</span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Role Switcher Sandbox Quick Links */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2 block mb-2">
            Switch Portal Role
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <Link
              href="/admin"
              className="px-2 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-center font-medium transition-colors"
            >
              Principal
            </Link>
            <Link
              href="/teacher"
              className="px-2 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-center font-medium transition-colors"
            >
              Teacher
            </Link>
            <Link
              href="/student"
              className="px-2 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-center font-medium transition-colors"
            >
              Student
            </Link>
            <Link
              href="/parent"
              className="px-2 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-center font-medium transition-colors"
            >
              Parent
            </Link>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-200 block truncate">{userName}</span>
              <span className="text-[10px] text-slate-400 block">{userRole}</span>
            </div>
          </div>
          <Link href="/login" className="text-slate-400 hover:text-red-400 transition-colors p-1.5">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-[#0e1424]/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search students, classes, results..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              2026 Academic Year • Term 1
            </span>

            <button className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
            </button>

            <Link
              href="/"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors hidden sm:block"
            >
              Public Home
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
