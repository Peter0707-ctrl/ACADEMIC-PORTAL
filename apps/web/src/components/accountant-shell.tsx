'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  DollarSign,
  Wallet,
  Receipt,
  FileText,
  CreditCard,
  Building2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Shield,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  LogOut,
  Home,
  Users,
  Search,
  Plus,
  Landmark,
  Scale,
  FolderOpen,
  PieChart,
  UserCheck,
  Settings,
  Printer,
  Sparkles,
  Lock,
  Phone,
  Mail,
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

interface AccountantShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

export default function AccountantShell({
  children,
  pageTitle,
  pageDescription,
}: AccountantShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Submenu open states
  const [studentFeesDropdownOpen, setStudentFeesDropdownOpen] = useState<boolean>(true);
  const [expensesDropdownOpen, setExpensesDropdownOpen] = useState<boolean>(true);
  const [bankingDropdownOpen, setBankingDropdownOpen] = useState<boolean>(true);
  const [reportsDropdownOpen, setReportsDropdownOpen] = useState<boolean>(true);



  // Access Verification
  useEffect(() => {
    const accounts = getStoredAccounts();
    let session = getCurrentSession();

    if (!session) {
      const defaultAccountant =
        accounts.find((a) => a.role === 'ACCOUNTANT') ||
        accounts.find((a) => a.role === 'HEADTEACHER') ||
        accounts.find((a) => a.role === 'ADMIN') ||
        accounts[0];
      if (defaultAccountant) {
        setCurrentSession(defaultAccountant);
        session = defaultAccountant;
      }
    }

    if (!canAccessPortal(session, 'ACCOUNTANT')) {
      setIsAuthorized(false);
      notifyUser(
        'error',
        'Eneo Lililozuiliwa (Restricted)',
        'Moduli hii ya Uhasibu na Fedha inaruhusiwa kwa Mhasibu wa Shule na Mwalimu Mkuu pekee. Huna idhini ya kuingia.'
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
            <h2 className="text-base font-bold text-slate-900">Eneo Lililozuiliwa (Finance Restricted)</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Moduli hii ya Mapato, Ankara, na Matumizi ya Shule (Accounting OS) inahitaji kibali maalum cha Mhasibu au Uongozi Mkuu.
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
        .replace(/^(Bw\.|Bi\.|Mwl\.|Dr\.)\s*/i, '')
        .trim()
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
    : 'RT';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] text-slate-800 font-sans flex flex-col lg:flex-row">
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
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 w-72 sm:w-80 bg-white/98 backdrop-blur-md border-r border-slate-200 shrink-0 flex flex-col justify-between shadow-2xl lg:shadow-xs transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-5 space-y-4">
          {/* Brand Header + Mobile Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Link
                href="/accountant"
                className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-950/20 shrink-0 hover:bg-emerald-900 transition-colors"
                title="Ofisi ya Mhasibu wa Shule"
              >
                <Wallet className="w-5 h-5 text-emerald-300" />
                <span className="text-[7px] font-black uppercase tracking-wider text-emerald-200">Fedha</span>
              </Link>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
                  PRIMARY &amp; NURSERY
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Accounting &bull; Uhasibu wa Shule
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
              href="/accountant"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/accountant'
                  ? 'bg-emerald-700 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className={`w-4 h-4 ${pathname === '/accountant' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Dashboard</span>
              </div>
            </Link>

            {/* 2. Student Fees (Expandable Submenu) */}
            <div className="space-y-0.5 pt-1">
              <div
                onClick={() => setStudentFeesDropdownOpen(!studentFeesDropdownOpen)}
                className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer select-none ${
                  pathname.startsWith('/accountant/students') ||
                  pathname.startsWith('/accountant/fees') ||
                  pathname.startsWith('/accountant/invoices') ||
                  pathname.startsWith('/accountant/payments') ||
                  pathname.startsWith('/accountant/outstanding') ||
                  pathname.startsWith('/accountant/clearance')
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Ada za Wanafunzi (Student Fees)</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${studentFeesDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {studentFeesDropdownOpen && (
                <div className="pl-6 pr-1 space-y-0.5 pt-0.5 border-l-2 border-emerald-200 ml-4">
                  <Link
                    href="/accountant/students"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/students'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Akaunti za Ada (Fee Accounts)</span>
                  </Link>

                  <Link
                    href="/accountant/fees"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/fees'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Miundo ya Ada (Fee Structures)</span>
                  </Link>

                  <Link
                    href="/accountant/invoices"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/invoices'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Ankara (Invoices)</span>
                  </Link>

                  <Link
                    href="/accountant/payments"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/payments'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Malipo &amp; Uhakiki (Payments)</span>
                  </Link>

                  <Link
                    href="/accountant/outstanding"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/outstanding'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Madeni ya Ada (Outstanding)</span>
                  </Link>

                  <Link
                    href="/accountant/clearance"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/clearance'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Kibali cha Fedha (Clearance)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Receipts */}
            <Link
              href="/accountant/receipts"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/accountant/receipts'
                  ? 'bg-emerald-700 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Receipt className={`w-4 h-4 ${pathname === '/accountant/receipts' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Stakabadhi (Receipts)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-900">
                Rasmi
              </span>
            </Link>

            {/* 4. Expenses (Expandable Submenu) */}
            <div className="space-y-0.5 pt-1">
              <div
                onClick={() => setExpensesDropdownOpen(!expensesDropdownOpen)}
                className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer select-none ${
                  pathname.startsWith('/accountant/expenses')
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                  <span>Matumizi ya Shule (Expenses)</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expensesDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {expensesDropdownOpen && (
                <div className="pl-6 pr-1 space-y-0.5 pt-0.5 border-l-2 border-emerald-200 ml-4">
                  <Link
                    href="/accountant/expenses"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/expenses'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Orodha ya Matumizi</span>
                  </Link>

                  <Link
                    href="/accountant/expenses?tab=requests"
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium"
                  >
                    <span>Maombi Mapya (Expense Requests)</span>
                  </Link>

                  <Link
                    href="/accountant/expenses?tab=approvals"
                    className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium"
                  >
                    <span>Uidhinisho wa Mkuu (Approvals)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Cash & Banking (Expandable Submenu) */}
            <div className="space-y-0.5 pt-1">
              <div
                onClick={() => setBankingDropdownOpen(!bankingDropdownOpen)}
                className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer select-none ${
                  pathname.startsWith('/accountant/cashbook') ||
                  pathname.startsWith('/accountant/banking') ||
                  pathname.startsWith('/accountant/reconciliation')
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-4 h-4 text-blue-600" />
                  <span>Fedha &amp; Benki (Cash &amp; Banking)</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${bankingDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {bankingDropdownOpen && (
                <div className="pl-6 pr-1 space-y-0.5 pt-0.5 border-l-2 border-emerald-200 ml-4">
                  <Link
                    href="/accountant/cashbook"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/cashbook'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Daftari la Fedha (Cashbook)</span>
                  </Link>

                  <Link
                    href="/accountant/banking"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/banking'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Akaunti za Benki (Bank Accounts)</span>
                  </Link>

                  <Link
                    href="/accountant/reconciliation"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/reconciliation'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Upatanisho wa Benki (Reconciliation)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Reports (Expandable Submenu) */}
            <div className="space-y-0.5 pt-1">
              <div
                onClick={() => setReportsDropdownOpen(!reportsDropdownOpen)}
                className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between cursor-pointer select-none ${
                  pathname.startsWith('/accountant/reports')
                    ? 'bg-emerald-700 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PieChart className="w-4 h-4 text-purple-600" />
                  <span>Ripoti za Fedha (Reports)</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${reportsDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {reportsDropdownOpen && (
                <div className="pl-6 pr-1 space-y-0.5 pt-0.5 border-l-2 border-emerald-200 ml-4">
                  <Link
                    href="/accountant/reports"
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] ${
                      pathname === '/accountant/reports'
                        ? 'bg-emerald-100 text-emerald-950 font-bold'
                        : 'text-slate-600 hover:bg-emerald-50/70 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>Ripoti Zote (Master Reports)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 7. Financial Documents */}
            <Link
              href="/accountant/documents"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/accountant/documents'
                  ? 'bg-emerald-700 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderOpen className={`w-4 h-4 ${pathname === '/accountant/documents' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Financial Documents</span>
              </div>
            </Link>

            {/* 8. Alerts */}
            <Link
              href="/accountant/alerts"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/accountant/alerts'
                  ? 'bg-emerald-700 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-4 h-4 ${pathname === '/accountant/alerts' ? 'text-amber-200' : 'text-amber-600'}`} />
                <span>Alerts &amp; Warnings</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-900">
                Tahadhari
              </span>
            </Link>

            {/* 9. My Profile */}
            <Link
              href="/accountant/profile"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                pathname === '/accountant/profile'
                  ? 'bg-emerald-700 text-white shadow-sm font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className={`w-4 h-4 ${pathname === '/accountant/profile' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Wasifu Wangu (My Profile)</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <span className="font-bold text-xs text-slate-900 truncate block">
                {currentUser?.fullName || 'Mhasibu wa Shule'}
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold truncate block">
                {currentUser?.identifier || 'Idara ya Fedha'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Toka Kwenye Mfumo (Logout)</span>
          </button>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 2. MAIN CONTENT AREA */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors shrink-0 cursor-pointer"
              aria-label="Fungua Menyu ya Uhasibu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">
                {pageTitle || 'Idara ya Fedha & Uhasibu'}
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                {pageDescription || 'Usimamizi wa Ada, Ankara, Stakabadhi na Matumizi ya Shule'}
              </p>
            </div>
          </div>

          {/* Quick Actions, Currency, User Profile & Top Logout Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sarafu: TZS (Tanzanian Shilling)</span>
            </div>

            <Link
              href="/accountant/payments"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">+ Rekodi Malipo</span>
              <span className="sm:hidden">Malipo</span>
            </Link>

            <Link
              href="/accountant/invoices"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Ankara Mpya</span>
            </Link>

            {/* User Profile Chip */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {userInitials}
              </div>
              <div className="text-left hidden xl:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight truncate max-w-[140px]">
                  {currentUser?.fullName || 'Mhasibu wa Shule'}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold block">
                  Mhasibu wa Shule
                </span>
              </div>
            </div>

            {/* PROMINENT TOP LOGOUT BUTTON */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs hover:scale-[1.02] cursor-pointer"
              title="Toka kwenye mfumo (Log Out)"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white/90 backdrop-blur-xs py-4 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p className="font-medium">
              &copy; {new Date().getFullYear()} PRIMARY &amp; NURSERY SCHOOL. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>0779304500</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>pj0040280@gmail.com</span>
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-base">Uhakiki wa Kufunga Kikao</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Je, una uhakika unataka kutoka kwenye mfumo wa Uhasibu na Fedha?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                Ghairi
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Toka Sasa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { AccountantShell };
