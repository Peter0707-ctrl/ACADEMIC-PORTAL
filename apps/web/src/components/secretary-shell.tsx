'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FileText,
  FolderArchive,
  UploadCloud,
  Search,
  CheckSquare,
  Mail,
  Phone,
  Send,
  Users,
  UserCheck,
  Shield,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Building2,
  Award,
  BookOpen,
  DollarSign,
  Calendar,
  Layers,
  History,
  CheckCircle2,
  LogOut,
  ChevronRight,
  ChevronDown,
  Globe,
  Settings,
  Plus,
  Home,
  FileCheck,
  FileSpreadsheet,
  Menu,
  X,
} from 'lucide-react';
import {
  UserAccount,
  getStoredAccounts,
  getCurrentSession,
  setCurrentSession,
  clearCurrentSession,
  canAccessPortal,
} from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

interface SecretaryShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

export default function SecretaryShell({
  children,
  pageTitle,
  pageDescription,
}: SecretaryShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [registryDropdownOpen, setRegistryDropdownOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);



  // Access Verification
  useEffect(() => {
    const accounts = getStoredAccounts();
    let session = getCurrentSession();

    if (!session) {
      const defaultSecretary =
        accounts.find((a) => a.role === 'SECRETARY') ||
        accounts.find((a) => a.role === 'HEADTEACHER') ||
        accounts.find((a) => a.role === 'ADMIN') ||
        accounts[0];
      if (defaultSecretary) {
        setCurrentSession(defaultSecretary);
        session = defaultSecretary;
      }
    }

    if (!canAccessPortal(session, 'SECRETARY')) {
      setIsAuthorized(false);
      notifyUser(
        'error',
        'Eneo Lililozuiliwa',
        'Sehemu hii imehifadhiwa mahsusi kwa Katibu wa Shule (School Secretary) na Mwalimu Mkuu pekee. Huna idhini ya kuingia.'
      );
      setTimeout(() => {
        router.push('/');
      }, 2500);
      return;
    }

    setIsAuthorized(true);
    setCurrentUser(session);
  }, [router]);

  const handleLogout = () => {
    clearCurrentSession();
    router.push('/');
  };

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white text-slate-800 p-6 shadow-md border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Eneo Lililozuiliwa (Restricted Access)</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Moduli hii ya Masjala na Hati za Shule (Digital Records) inaruhusiwa kwa Katibu wa Shule na Uongozi Mkuu pekee.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Rudi Ukurasa Mkuu
          </Link>
        </div>
      </div>
    );
  }

  const userInitials = currentUser?.fullName
    ? currentUser.fullName
        .replace(/^(Bi\.|Bw\.|Mwl\.|Dr\.)\s*/i, '')
        .trim()
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
    : 'SR';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col lg:flex-row">
      {/* Backdrop overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ===================================================================== */}
      {/* 1. LEFT SIDEBAR: RESPONSIVE SLIDE-OVER DRAWER ON MOBILE, STICKY ON DESKTOP */}
      {/* ===================================================================== */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 w-72 sm:w-80 bg-white/98 backdrop-blur-md border-r border-teal-200/80 shrink-0 flex flex-col justify-between shadow-2xl lg:shadow-xs transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-5 space-y-4">
          {/* Brand Header + Mobile Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-teal-100">
            <div className="flex items-center gap-3">
              <Link
                href="/secretary"
                className="w-10 h-10 rounded-xl bg-teal-700 text-white flex flex-col items-center justify-center shadow-xs shrink-0 hover:bg-teal-800 transition-colors"
                title="Masjala Kuu ya Shule"
              >
                <FileCheck className="w-5 h-5 text-teal-300" />
                <span className="text-[7px] font-black uppercase tracking-wider text-teal-200">Masjala</span>
              </Link>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
                  PRIMARY &amp; NURSERY
                </h2>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                  Digital Records &bull; Masjala
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Funga Menyu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SIDEBAR NAVIGATION LIST (Section 27 Specification) */}
          <nav className="space-y-1 text-xs">
            {/* 1. Dashboard */}
            <Link
              href="/secretary"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className={`w-4 h-4 ${pathname === '/secretary' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Dashboard</span>
              </div>
            </Link>

            {/* 2. Document Registry (With Expandable Sub-Categories) */}
            <div className="space-y-0.5 pt-1">
              <div
                onClick={() => setRegistryDropdownOpen(!registryDropdownOpen)}
                className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer select-none ${
                  pathname.startsWith('/secretary/registry')
                    ? 'bg-teal-800 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className={`w-4 h-4 ${pathname.startsWith('/secretary/registry') ? 'text-teal-200' : 'text-teal-700'}`} />
                  <span>Document Registry</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${registryDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {registryDropdownOpen && (
                <div className="pl-6 pr-1 space-y-0.5 pt-0.5 border-l-2 border-teal-200 ml-4">
                  <Link
                    href="/secretary/registry?category=ALL"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/secretary/registry'
                        ? 'bg-teal-100 text-teal-950 font-bold'
                        : 'text-slate-600 hover:bg-teal-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>All Documents</span>
                  </Link>

                  <Link
                    href="/secretary/registry?category=SCHOOL_ADMINISTRATION"
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-600 hover:bg-teal-50/70 hover:text-slate-900 font-medium"
                  >
                    <span>School Administration</span>
                  </Link>

                  <Link
                    href="/secretary/registry?category=STUDENT_RECORDS"
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-600 hover:bg-teal-50/70 hover:text-slate-900 font-medium"
                  >
                    <span>Student Records</span>
                  </Link>

                  <Link
                    href="/secretary/registry?category=STAFF_RECORDS"
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-600 hover:bg-teal-50/70 hover:text-slate-900 font-medium"
                  >
                    <span>Staff Records</span>
                  </Link>

                  <Link
                    href="/secretary/registry?category=ACADEMIC_RECORDS"
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-600 hover:bg-teal-50/70 hover:text-slate-900 font-medium"
                  >
                    <span>Academic Records</span>
                  </Link>

                  <Link
                    href="/secretary/registry?category=FINANCIAL_DOCUMENTS"
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-600 hover:bg-teal-50/70 hover:text-slate-900 font-medium"
                  >
                    <span>Financial Documents</span>
                  </Link>

                  <Link
                    href="/secretary/meetings"
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-600 hover:bg-teal-50/70 hover:text-slate-900 font-medium"
                  >
                    <span>Meetings</span>
                  </Link>

                  <Link
                    href="/secretary/correspondence"
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-600 hover:bg-teal-50/70 hover:text-slate-900 font-medium"
                  >
                    <span>Correspondence</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Student Files */}
            <Link
              href="/secretary/students"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/students'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 ${pathname === '/secretary/students' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Student Files</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-teal-100 text-teal-900">
                Kila Mwanafunzi
              </span>
            </Link>

            {/* 4. Staff Files */}
            <Link
              href="/secretary/staff"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/staff'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className={`w-4 h-4 ${pathname === '/secretary/staff' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Staff Files</span>
              </div>
            </Link>

            {/* 5. Upload Document */}
            <Link
              href="/secretary/upload"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/upload'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UploadCloud className={`w-4 h-4 ${pathname === '/secretary/upload' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Upload Document</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-900">
                + Pakia
              </span>
            </Link>

            {/* 6. Document Search */}
            <Link
              href="/secretary/search"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/search'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Search className={`w-4 h-4 ${pathname === '/secretary/search' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Document Search</span>
              </div>
            </Link>

            {/* 7. Document Checklists */}
            <Link
              href="/secretary/checklists"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/checklists'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className={`w-4 h-4 ${pathname === '/secretary/checklists' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Document Checklists</span>
              </div>
            </Link>

            {/* 8. Incoming Correspondence */}
            <Link
              href="/secretary/correspondence?tab=INCOMING"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/correspondence'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className={`w-4 h-4 ${pathname === '/secretary/correspondence' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Barua Zilizoingia (Incoming)</span>
              </div>
            </Link>

            {/* 9. Outgoing Correspondence */}
            <Link
              href="/secretary/correspondence?tab=OUTGOING"
              className="w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-teal-700" />
                <span>Barua Zilizotoka (Outgoing)</span>
              </div>
            </Link>

            {/* 10. Meeting Records */}
            <Link
              href="/secretary/meetings"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/meetings'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className={`w-4 h-4 ${pathname === '/secretary/meetings' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Meeting Records</span>
              </div>
            </Link>

            {/* 11. Archive */}
            <Link
              href="/secretary/archive"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/archive'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderArchive className={`w-4 h-4 ${pathname === '/secretary/archive' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Archive (Jalada Kuu)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                2020–2025
              </span>
            </Link>

            {/* 12. Alerts */}
            <Link
              href="/secretary/alerts"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/alerts'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-4 h-4 ${pathname === '/secretary/alerts' ? 'text-amber-200' : 'text-amber-600'}`} />
                <span>Alerts &amp; Warnings</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-900">
                19
              </span>
            </Link>

            {/* 13. Reports */}
            <Link
              href="/secretary/reports"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/reports'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className={`w-4 h-4 ${pathname === '/secretary/reports' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Reports (PDF / Excel)</span>
              </div>
            </Link>

            {/* 14. Audit Trail */}
            <Link
              href="/secretary/audit"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/audit'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className={`w-4 h-4 ${pathname === '/secretary/audit' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>Audit Trail</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-600">
                Log
              </span>
            </Link>

            {/* 15. My Profile */}
            <Link
              href="/secretary/profile"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/secretary/profile'
                  ? 'bg-teal-800 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-teal-50 hover:text-teal-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className={`w-4 h-4 ${pathname === '/secretary/profile' ? 'text-teal-200' : 'text-teal-700'}`} />
                <span>My Profile</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-teal-100 bg-teal-50/50">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-900 text-white text-[10px] font-bold shadow-xs">
              <Globe className="w-3.5 h-3.5 text-teal-300" />
              <span>MASJALA: SWA</span>
              <span className="px-1.5 py-0.2 rounded-full bg-teal-700 text-teal-100 text-[9px]">TZ</span>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="text-[11px] font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
              title="Ondoka kwenye mfumo kwa usalama"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Toka</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 2. RIGHT MAIN WORKSPACE */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-teal-200/80 sticky top-0 z-20 px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-xs">
          {/* Breadcrumbs / Mobile Hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 transition-colors shrink-0 cursor-pointer"
              aria-label="Fungua Menyu ya Masjala"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-500 truncate">
              <Link href="/secretary" className="hover:text-teal-900 transition-colors shrink-0">
                Masjala ya Shule
              </Link>
              {pathname !== '/secretary' && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-slate-800 font-bold truncate max-w-[120px] sm:max-w-none">{pageTitle || 'Ukurasa'}</span>
                </>
              )}
            </div>
            <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 text-[10px] font-bold border border-teal-200 shrink-0">
              Muhula wa 1, 2026
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Upload Button */}
            <Link
              href="/secretary/upload"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-teal-100" />
              <span>Pakia Hati</span>
            </Link>

            {/* Secretary Profile Chip */}
            <Link
              href="/secretary/profile"
              className="flex items-center gap-2.5 pl-2 sm:border-l border-teal-200 hover:opacity-85 transition-opacity group cursor-pointer"
              title="Fungua Wasifu wa Katibu wa Shule"
            >
              <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center font-bold text-xs ring-2 ring-teal-500/20 shadow-xs group-hover:ring-teal-400">
                {userInitials}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-xs font-black text-slate-800 block leading-tight truncate max-w-[170px] group-hover:text-teal-900">
                  {currentUser?.fullName || 'Katibu wa Shule'}
                </span>
                <span className="text-[10px] text-teal-800 font-semibold block truncate max-w-[170px]">
                  {currentUser?.identifier || 'Idara ya Masjala'} &bull; Katibu
                </span>
              </div>
            </Link>

            {/* Prominent Logout Button */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Toka kwenye mfumo kwa usalama"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Toka Salama</span>
              <span className="sm:hidden">Toka</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-teal-200/80 bg-white/90 backdrop-blur-xs py-4 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p className="font-medium">
              &copy; {new Date().getFullYear()} PRIMARY &amp; NURSERY SCHOOL. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 font-medium">
              <span>School Registry &amp; Secretary Workspace</span>
            </div>
          </div>
        </footer>
      </div>

      {/* ===================================================================== */}
      {/* 3. LOGOUT CONFIRMATION MODAL */}
      {/* ===================================================================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-rose-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-black text-slate-900">Uthibitisho wa Usalama wa Kikao</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Je, una uhakika unataka kutoka kwenye Masjala Kuu ya Shule? Hati na faili zote ulizopandisha zimehifadhiwa salama kwenye kumbukumbu ya mfumo.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-1">
              <div className="flex items-center gap-2 font-bold text-teal-900">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Ulinzi wa Data &amp; Usalama wa Kumbukumbu Upo Hai</span>
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                Kutoka kutalinda akaunti yako ya Masjala isitumiwe na mtu mwingine kwenye kompyuta hii ya shule.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Ghairi (Baki Mfumoni)
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Ndiyo, Toka Salama</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
