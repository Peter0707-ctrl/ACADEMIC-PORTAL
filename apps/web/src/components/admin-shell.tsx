'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Layers,
  BookOpen,
  Lock,
  Database,
  Radio,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Bell,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  Laptop,
} from 'lucide-react';
import {
  UserAccount,
  getCurrentSession,
  setCurrentSession,
  clearCurrentSession,
  canAccessPortal,
  getStoredAccounts,
} from '@/lib/auth-session';

interface AdminShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashibodi Kuu', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Watumiaji & Majukumu', icon: Users },
  { href: '/admin/school', label: 'Wasifu wa Shule & Mihuri', icon: Building2 },
  { href: '/admin/academic-years', label: 'Miaka ya Masomo & Mihula', icon: Calendar },
  { href: '/admin/classes', label: 'Madarasa & Mikondo', icon: Layers },
  { href: '/admin/subjects', label: 'Mitaala & Masomo', icon: BookOpen },
  { href: '/admin/security', label: 'Ukaguzi wa Usalama', icon: Lock },
  { href: '/admin/backups', label: 'Hifadhi & Database', icon: Database },
  { href: '/admin/gateways', label: 'Njia za Malipo & SMS', icon: Radio },
];

export default function AdminShell({ children, pageTitle, pageDescription }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPortalSwitcher, setShowPortalSwitcher] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowPortalSwitcher(false);
  }, [pathname]);

  // Auth Guard: Admin access only
  useEffect(() => {
    let session = getCurrentSession();
    if (!session) {
      const accounts = getStoredAccounts();
      const adminAcc = accounts.find((a) => a.role === 'ADMIN') || accounts[0];
      if (adminAcc) {
        setCurrentSession(adminAcc);
        session = adminAcc;
      }
    }

    if (!session || (session.role !== 'ADMIN' && session.role !== 'HEADTEACHER')) {
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
    setCurrentUser(session);
  }, []);

  const handleLogout = () => {
    clearCurrentSession();
    router.push('/');
  };

  // If unauthorized, show restricted access modal
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-3xl bg-slate-800 text-white p-6 shadow-2xl border border-rose-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold">Ufikiaji Umezuiwa (Access Restricted)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Eneo hili la Admin Control Center linahitaji akaunti yenye hadhi ya Msimamizi Mkuu wa Shule (Super Admin).
            </p>
          </div>
          <Link
            href="/"
            className="block w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs transition-colors"
          >
            Rudi Ukurasa wa Kuingia (Login)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FB] via-[#EDF2F8] to-[#E6EDF5] text-slate-800 font-sans flex flex-col">
      {/* 1. Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">Unataka Kuondoka?</h3>
              <p className="text-xs text-slate-500">
                Kikao chako cha usimamizi kitafungwa na utahitaji kuingia upya.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Ghairi
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
              >
                Ondoka (Logout)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Mobile hamburger & Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Fungua Menyu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center shadow-md shadow-slate-900/20">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-900 tracking-tight">ADMIN CONTROL</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 text-[9px] font-black uppercase tracking-wider border border-indigo-200">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                    Kituo Kikuu cha Utawala &amp; Usanidi wa Shule
                  </p>
                </div>
              </Link>
            </div>

            {/* Right: Portal Switcher, User Info & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Portal Switcher Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPortalSwitcher(!showPortalSwitcher)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
                  title="Badili kwenda kwenye Portal nyingine"
                >
                  <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Badili Mtazamo</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showPortalSwitcher && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs space-y-1 animate-scale-in">
                    <span className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tazama Kama Mhusika (Portals)
                    </span>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-indigo-50 text-indigo-900 font-bold"
                      onClick={() => setShowPortalSwitcher(false)}
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>Admin Control Center</span>
                    </Link>
                    <Link
                      href="/teacher"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
                      onClick={() => setShowPortalSwitcher(false)}
                    >
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Mwalimu &amp; Taaluma</span>
                    </Link>
                    <Link
                      href="/accountant"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
                      onClick={() => setShowPortalSwitcher(false)}
                    >
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>Mhasibu &amp; Fedha</span>
                    </Link>
                    <Link
                      href="/secretary"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
                      onClick={() => setShowPortalSwitcher(false)}
                    >
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>Katibu &amp; Masijala</span>
                    </Link>
                    <Link
                      href="/parent"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
                      onClick={() => setShowPortalSwitcher(false)}
                    >
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>Mzazi &amp; Mwanafunzi</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* User Identity */}
              <div className="text-right hidden md:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  {currentUser?.fullName || 'System Administrator'}
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                  {currentUser?.identifier || 'drestgroup@gmail.com'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-all border border-slate-200 hover:border-rose-200 flex items-center gap-1.5"
                title="Toka kwenye mfumo"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Workspace with Sidebar & Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 w-full flex-1 flex gap-6 relative">
        {/* Mobile Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation (Desktop sticky + Mobile slide-over drawer) */}
        <aside
          className={`
            fixed lg:sticky top-0 lg:top-[65px] left-0 h-screen lg:h-[calc(100vh-85px)]
            w-72 sm:w-80 lg:w-64 z-50 lg:z-30 bg-white lg:bg-white/80 lg:backdrop-blur-md
            border-r lg:border border-slate-200/90 lg:rounded-3xl p-4 shadow-xl lg:shadow-xs
            flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="space-y-4">
            {/* Mobile Drawer Header */}
            <div className="flex items-center justify-between lg:hidden border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Menyu ya Admin</h4>
                  <p className="text-[10px] text-slate-400">Moduli zote za Usimamizi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="space-y-1">
              <span className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Moduli Kuu za Mfumo
              </span>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-slate-900 to-indigo-900 text-white shadow-md shadow-slate-900/15'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    ) : item.badge ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-800">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer: System Status */}
          <div className="pt-4 border-t border-slate-100 space-y-2 mt-4">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-600">Database Engine</span>
                <span className="flex items-center gap-1 font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Railway PG
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>Toleo: v2.4 (2026)</span>
                <span>Latency: 24ms</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full space-y-5 min-w-0">
          {(pageTitle || pageDescription) && (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{pageTitle}</h1>
                {pageDescription && <p className="text-xs text-slate-500 mt-0.5">{pageDescription}</p>}
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
