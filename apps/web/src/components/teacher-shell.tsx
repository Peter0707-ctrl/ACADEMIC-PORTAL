'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle2,
  Award,
  LogOut,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  Info,
  TrendingUp,
  UserCheck,
  Shield,
  FileText,
  Building2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Home,
  Check,
  Globe,
  Plus,
} from 'lucide-react';
import {
  UserAccount,
  getStoredAccounts,
  getCurrentSession,
  setCurrentSession,
  clearCurrentSession,
  canAccessPortal,
} from '@/lib/auth-session';

interface CenteredNotification {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

interface TeacherShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  requiredRole?: 'HEADTEACHER' | 'ACADEMIC' | 'DISCIPLINE';
}

export default function TeacherShell({
  children,
  pageTitle,
  pageDescription,
  requiredRole,
}: TeacherShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [allAccounts, setAllAccounts] = useState<UserAccount[]>([]);
  const [notification, setNotification] = useState<CenteredNotification | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const triggerNotification = useCallback((type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => {
    setNotification({ type, title, message });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // 1. Session & Access Verification
  useEffect(() => {
    const accounts = getStoredAccounts();
    setAllAccounts(accounts);

    let session = getCurrentSession();
    if (!session) {
      const defaultLeader = accounts.find((a) => a.role === 'HEADTEACHER') || accounts[1];
      setCurrentSession(defaultLeader);
      session = defaultLeader;
    }

    if (!canAccessPortal(session, 'TEACHER')) {
      setIsAuthorized(false);
      triggerNotification(
        'error',
        'Unauthorized Access',
        'Only teaching staff or leadership may access the Teacher Portal. Your current role does not have permission.'
      );
      return;
    }

    // Role-specific check if page requires specific leadership role
    if (requiredRole && session.role !== requiredRole && session.leadershipRole !== requiredRole && session.role !== 'ADMIN') {
      setIsAuthorized(false);
      triggerNotification(
        'error',
        'Restricted Activity',
        `This section is strictly reserved for ${requiredRole.replace('_', ' ')}. You will be redirected to the main dashboard.`
      );
      setTimeout(() => {
        router.push('/teacher');
      }, 2500);
      return;
    }

    setIsAuthorized(true);
    setCurrentUser(session);
  }, [requiredRole, router, triggerNotification]);

  // Switch Teacher Identity
  const handleSwitchTeacher = (teacher: UserAccount) => {
    setCurrentSession(teacher);
    setCurrentUser(teacher);

    // If on a page requiring specific role that the new teacher doesn't have, redirect to /teacher
    if (requiredRole && teacher.role !== requiredRole && teacher.leadershipRole !== requiredRole && teacher.role !== 'ADMIN') {
      router.push('/teacher');
    } else {
      router.refresh();
    }

    triggerNotification(
      'success',
      'Akaunti Imebadilishwa',
      `Sasa unafanya kazi kama ${teacher.fullName} (${teacher.role.replace('_', ' ')}).`
    );
  };

  const handleLogout = () => {
    clearCurrentSession();
    router.push('/');
  };

  const teachersList = useMemo(() => {
    return allAccounts.filter((a) => ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE', 'TEACHER'].includes(a.role));
  }, [allAccounts]);

  const isHeadteacher = currentUser?.role === 'HEADTEACHER' || currentUser?.leadershipRole === 'HEADTEACHER';
  const isAcademicMaster = currentUser?.role === 'ACADEMIC' || currentUser?.leadershipRole === 'ACADEMIC';
  const isDisciplineMaster = currentUser?.role === 'DISCIPLINE' || currentUser?.leadershipRole === 'DISCIPLINE';

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        {notification && (
          <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-6 shadow-2xl border border-rose-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold">{notification.title}</h2>
              <p className="text-xs text-blue-100/90 leading-relaxed">{notification.message}</p>
            </div>
            <Link
              href="/"
              className="inline-block w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md"
            >
              Rudi Ukurasa Mkuu
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Determine user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'ED';
    const parts = name.replace(/^(Mwl\.|Dr\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const userInitials = getInitials(currentUser?.fullName);

  return (
    <div className="min-h-screen bg-[#F0F5FA] text-slate-800 font-sans flex flex-col lg:flex-row">
      {/* ===================================================================== */}
      {/* 1. CENTERED SMALL BLUE NOTIFICATION MODAL */}
      {/* ===================================================================== */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-5 shadow-2xl border border-blue-500/30 text-center space-y-3 animate-scale-in"
            role="alert"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mx-auto text-blue-300">
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {notification.type === 'info' && <Info className="w-5 h-5 text-blue-300" />}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold tracking-wide">{notification.title}</h3>
              <p className="text-xs text-blue-100/90 leading-relaxed px-2">{notification.message}</p>
            </div>
            <button
              type="button"
              onClick={dismissNotification}
              className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-900/40"
            >
              Nimeelewa
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. LEFT SIDEBAR: EXACT ARCHITECTURE FROM USER'S REFERENCE SCREENSHOT */}
      {/* ===================================================================== */}
      <aside className="w-full lg:w-72 xl:w-80 bg-white border-r border-slate-200/90 shrink-0 flex flex-col justify-between shadow-xs lg:min-h-screen lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto z-30">
        <div className="p-4 sm:p-5 space-y-5">
          {/* School Brand / Logo */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl bg-[#0F2942] text-white flex flex-col items-center justify-center shadow-md shadow-slate-900/20 shrink-0 hover:bg-blue-900 transition-colors"
              title="Return to School Home"
            >
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <span className="text-[7px] font-black uppercase tracking-wider text-slate-300">Logo</span>
            </Link>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
                PRIMARY &amp; NURSERY
              </h2>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                Educational ERP Portal
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* GROUP 1: DASHBOARD (PRIMARY ACTIVE PILL BUTTON AS IN SCREENSHOT) */}
          {/* ================================================================= */}
          <div className="space-y-1">
            <Link
              href="/teacher"
              className={`w-full p-3 rounded-xl transition-all flex items-center justify-between text-left font-bold text-xs ${
                pathname === '/teacher'
                  ? 'bg-[#0F2942] text-white shadow-md shadow-blue-950/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className={`w-4 h-4 ${pathname === '/teacher' ? 'text-blue-300' : 'text-slate-600'}`} />
                <span>Dashboard</span>
              </div>
              <ChevronDown className={`w-4 h-4 ${pathname === '/teacher' ? 'text-blue-300' : 'text-slate-400'}`} />
            </Link>

            {/* Sub-items under Dashboard (Cleanly spaced vertically as in screenshot) */}
            <div className="pl-6 pr-1 pt-1.5 pb-2 space-y-1">
              <Link
                href="/teacher/marks"
                className={`block py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  pathname === '/teacher/marks'
                    ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-600 pl-2.5'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                }`}
              >
                Kujaza Alama &amp; Madaraja
              </Link>

              <Link
                href="/teacher/attendance"
                className={`block py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  pathname === '/teacher/attendance'
                    ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-600 pl-2.5'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                }`}
              >
                Mahudhurio (Roll-Call)
              </Link>

              <Link
                href="/teacher/curriculum"
                className={`block py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  pathname === '/teacher/curriculum'
                    ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-600 pl-2.5'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                }`}
              >
                Mitaala &amp; Maazimio
              </Link>

              <Link
                href="/teacher/staff"
                className={`block py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  pathname === '/teacher/staff'
                    ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-600 pl-2.5'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-slate-50'
                }`}
              >
                Walimu Wangu (Staff)
              </Link>
            </div>
          </div>

          {/* ================================================================= */}
          {/* GROUP 2: UONGOZI WA SHULE (LEADERSHIP ACTIVITIES) */}
          {/* ================================================================= */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-2 py-1 flex items-center justify-between text-slate-700">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Usimamizi &amp; Mitihani
              </span>
              <Award className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="space-y-1">
              <Link
                href="/teacher/approvals"
                className={`w-full p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/approvals'
                    ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Idhini ya Matokeo &amp; Muhuri</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                  Mkuu
                </span>
              </Link>

              <Link
                href="/teacher/candidates"
                className={`w-full p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/candidates'
                    ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>Watahiniwa wa Taifa (NECTA)</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold">
                  Taaluma
                </span>
              </Link>

              <Link
                href="/teacher/broadsheet"
                className={`w-full p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/broadsheet'
                    ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                  <span>Broadsheet ya Shule</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">
                  Ripoti
                </span>
              </Link>

              <Link
                href="/teacher/discipline"
                className={`w-full p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/discipline'
                    ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nidhamu &amp; Utoro</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                  Nidhamu
                </span>
              </Link>
            </div>
          </div>

          {/* ================================================================= */}
          {/* GROUP 3: UTAWALA WA MFUMO (SYSTEM ADMIN) */}
          {/* ================================================================= */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-2 py-1 flex items-center justify-between text-slate-700">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Utawala wa Mfumo
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            </div>

            <Link
              href="/admin"
              className="w-full p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                <span>Watumiaji Wote &amp; Kufuta</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                Admin
              </span>
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SIDEBAR FOOTER: ROLE SWITCHER & LANGUAGE PILL (EXACT LIKE SCREENSHOT) */}
        {/* ================================================================= */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
          {/* Fast 1-Click Role Switcher */}
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Badili Akaunti (Kujaribu):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {teachersList.map((t) => {
                const isCurrent = currentUser?.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSwitchTeacher(t)}
                    className={`py-1 px-2 rounded-lg text-[10px] font-bold truncate text-left transition-all ${
                      isCurrent
                        ? 'bg-[#0F2942] text-white shadow-xs'
                        : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200'
                    }`}
                    title={`${t.fullName} (${t.role})`}
                  >
                    {t.role === 'HEADTEACHER' ? 'Mkuu wa Shule' : t.role === 'ACADEMIC' ? 'Mwl. Taaluma' : t.role === 'DISCIPLINE' ? 'Mwl. Nidhamu' : 'Class Teacher'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Pill (Exact look as bottom left of candidate screenshot) */}
          <div className="pt-1 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F2942] text-white text-[10px] font-bold shadow-xs">
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span>LANGUAGE: SWA</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/30 text-blue-200 text-[9px]">TZ</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-[11px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
              title="Ondoka kwenye mfumo"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Toka</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 3. RIGHT MAIN WORKSPACE: TOP BAR + PAGE CONTENT */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Matching AjiraMarket Top Bar) */}
        <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          {/* Quick Breadcrumb / Term Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/teacher" className="hover:text-blue-900 transition-colors">
                Primary Portal
              </Link>
              {pathname !== '/teacher' && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-800 font-bold">{pageTitle || 'Ukurasa'}</span>
                </>
              )}
            </div>
            <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
              Muhula wa 1, 2026
            </span>
          </div>

          {/* Right Controls: Available Badge + User Profile Chip */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Status Badge (Like 'Available for Work' in the screenshot) */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Amilifu Kazini</span>
            </div>

            {/* User Profile Chip (Avatar + Full Name + Role Dropdown) */}
            <div className="flex items-center gap-2.5 pl-2 sm:border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0F2942] text-blue-200 flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/20 shadow-xs">
                {userInitials}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-xs font-black text-slate-800 block leading-tight truncate max-w-[150px]">
                  {currentUser?.fullName}
                </span>
                <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                  {currentUser?.identifier} • {currentUser?.role === 'HEADTEACHER' ? 'Mwalimu Mkuu' : currentUser?.role === 'ACADEMIC' ? 'Taaluma' : currentUser?.role === 'DISCIPLINE' ? 'Nidhamu' : 'Class Teacher'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
