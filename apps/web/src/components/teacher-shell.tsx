'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  LogOut,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Shield,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Home,
  Check,
  Globe,
  Settings,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Menu,
  X,
  User,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSwitchDropdown, setShowSwitchDropdown] = useState(false);

  const triggerNotification = useCallback(
    (type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => {
      notifyUser(type, title, message);
    },
    []
  );

  // 1. Session & Access Verification
  useEffect(() => {
    const accounts = getStoredAccounts();
    setAllAccounts(accounts);

    let session = getCurrentSession();
    if (!session) {
      const defaultLeader = accounts.find((a) => a.role === 'HEADTEACHER') || accounts[0];
      setCurrentSession(defaultLeader);
      session = defaultLeader;
    }

    if (!canAccessPortal(session, 'TEACHER')) {
      setIsAuthorized(false);
      triggerNotification(
        'error',
        'Unauthorized Access',
        'Only teaching staff or leadership may access the Teacher Portal.'
      );
      return;
    }

    setIsAuthorized(true);
    setCurrentUser(session);
  }, [requiredRole, router, triggerNotification]);

  const handleLogout = () => {
    clearCurrentSession();
    router.push('/');
  };

  const handleSwitchTeacher = (identifier: string) => {
    const target = allAccounts.find((a) => a.identifier === identifier);
    if (target) {
      setCurrentSession(target);
      setCurrentUser(target);
      setShowSwitchDropdown(false);
      notifyUser(
        'info',
        'Akaunti ya Mwalimu Imebadilishwa',
        `Sasa umeingia kama: ${target.fullName} (${target.role === 'HEADTEACHER' ? 'Mwalimu Mkuu' : target.role === 'ACADEMIC' ? 'Mwl. Taaluma' : target.role === 'DISCIPLINE' ? 'Mwl. Nidhamu' : 'Mwalimu'})`
      );
      window.location.reload();
    }
  };

  const isHeadteacher = currentUser?.role === 'HEADTEACHER' || currentUser?.leadershipRole === 'HEADTEACHER';
  const isAcademicMaster = currentUser?.role === 'ACADEMIC' || currentUser?.leadershipRole === 'ACADEMIC';
  const isDisciplineMaster = currentUser?.role === 'DISCIPLINE' || currentUser?.leadershipRole === 'DISCIPLINE';
  const isAdmin = currentUser?.role === 'ADMIN';

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-6 shadow-2xl border border-rose-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold">Eneo Lililozuiliwa</h2>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              Huna ruhusa ya kufikia ukurasa huu au nafasi yako haina idhini inayotakiwa.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md"
          >
            Rudi Ukurasa Mkuu
          </Link>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 font-sans flex flex-col lg:flex-row">
      {/* ===================================================================== */}
      {/* 1. LEFT SIDEBAR: PURE LIGHT-GREEN THEME & COMPLETE TEACHER WORKSPACE */}
      {/* ===================================================================== */}
      <aside
        className={`w-full lg:w-72 xl:w-80 bg-white/95 backdrop-blur-md border-r border-emerald-200/90 shrink-0 flex flex-col justify-between shadow-xs lg:min-h-screen lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto z-30 transition-all ${
          isMobileMenuOpen ? 'block' : 'hidden lg:flex'
        }`}
      >
        <div className="p-4 sm:p-5 space-y-4">
          {/* School Brand / Logo */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-950/20 shrink-0 hover:bg-emerald-900 transition-colors"
                title="Rudi Ukurasa wa Kwanza wa Shule"
              >
                <GraduationCap className="w-5 h-5 text-emerald-300" />
                <span className="text-[7px] font-black uppercase tracking-wider text-emerald-200">Shule</span>
              </Link>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
                  PRIMARY &amp; NURSERY
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Teacher Portal
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ================================================================= */}
          {/* GROUP 1: TEACHER WORKSPACE (EVERY TEACHER, HEADMASTER, ACADEMIC & DISCIPLINE HAS THIS!) */}
          {/* ================================================================= */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 px-2 block mb-1">
              Teacher Workspace (Ufundishaji)
            </span>

            {/* 1. Dashboard Overview */}
            <Link
              href="/teacher"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2 px-3 rounded-xl transition-all flex items-center justify-between text-left font-bold text-xs ${
                pathname === '/teacher'
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                  : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className={`w-4 h-4 ${pathname === '/teacher' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Dashboard Overview</span>
              </div>
            </Link>

            {/* 2. My Classes */}
            <Link
              href="/teacher/classes"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2 px-3 rounded-xl transition-all flex items-center justify-between text-left font-semibold text-xs ${
                pathname === '/teacher/classes'
                  ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>My Classes</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                Std 1–7
              </span>
            </Link>

            {/* 3. My Subjects */}
            <Link
              href="/teacher/subjects"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2 px-3 rounded-xl transition-all flex items-center justify-between text-left font-semibold text-xs ${
                pathname === '/teacher/subjects'
                  ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>My Subjects</span>
              </div>
            </Link>

            {/* 4. Attendance */}
            <Link
              href="/teacher/attendance"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2 px-3 rounded-xl transition-all flex items-center justify-between text-left font-semibold text-xs ${
                pathname === '/teacher/attendance'
                  ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>Attendance</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Daily
              </span>
            </Link>

            {/* 5. Lesson Plans */}
            <Link
              href="/teacher/curriculum"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2 px-3 rounded-xl transition-all flex items-center justify-between text-left font-semibold text-xs ${
                pathname === '/teacher/curriculum'
                  ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-4 h-4 text-emerald-700" />
                <span>Lesson Plans</span>
              </div>
            </Link>

            {/* 6. Assignments & Activities */}
            <Link
              href="/teacher/assignments"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2 px-3 rounded-xl transition-all flex items-center justify-between text-left font-semibold text-xs ${
                pathname === '/teacher/assignments'
                  ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Assignments / Activities</span>
              </div>
            </Link>

            {/* 7. Assessment & Marks */}
            <Link
              href="/teacher/marks"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2 px-3 rounded-xl transition-all flex items-center justify-between text-left font-semibold text-xs ${
                pathname === '/teacher/marks'
                  ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>Marks Entry</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                12 Months
              </span>
            </Link>

            {/* 8. Pupil Performance */}
            <Link
              href="/teacher/performance"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2 px-3 rounded-xl transition-all flex items-center justify-between text-left font-semibold text-xs ${
                pathname === '/teacher/performance'
                  ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span>Pupil Performance</span>
              </div>
            </Link>

            {/* 9. School Communication */}
            <Link
              href="/teacher/communication"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2 px-3 rounded-xl transition-all flex items-center justify-between text-left font-semibold text-xs ${
                pathname === '/teacher/communication'
                  ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>School Communication</span>
              </div>
            </Link>

            {/* 10. Profile & Timetable */}
            <Link
              href="/teacher/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full py-2 px-3 rounded-xl transition-all flex items-center justify-between text-left font-semibold text-xs ${
                pathname === '/teacher/settings'
                  ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-emerald-700" />
                <span>Profile &amp; Timetable</span>
              </div>
            </Link>
          </div>

          {/* ================================================================= */}
          {/* GROUP 2: EXECUTIVE LEADERSHIP (HEADTEACHER, ACADEMIC, DISCIPLINE) */}
          {/* ================================================================= */}
          {(isHeadteacher || isAcademicMaster || isDisciplineMaster || isAdmin) && (
            <div className="space-y-1 pt-2 border-t border-emerald-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 block mb-1">
                Executive Leadership (Uongozi)
              </span>

              {/* Results Approval & Seal */}
              <Link
                href="/teacher/approvals"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/approvals'
                    ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Results Approval &amp; Seal</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold">
                  Official
                </span>
              </Link>

              {/* School Broadsheet */}
              <Link
                href="/teacher/broadsheet"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/broadsheet'
                    ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>School Broadsheet</span>
                </div>
              </Link>

              {/* National Candidates (NECTA) */}
              <Link
                href="/teacher/candidates"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/candidates'
                    ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-purple-700" />
                  <span>National Candidates</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-900 font-bold">
                  NECTA
                </span>
              </Link>

              {/* Teaching Staff Directory */}
              <Link
                href="/teacher/staff"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/staff'
                    ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-700" />
                  <span>Teaching Staff Directory</span>
                </div>
              </Link>

              {/* Discipline & Truancy */}
              <Link
                href="/teacher/discipline"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/discipline'
                    ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Discipline &amp; Truancy</span>
                </div>
              </Link>
            </div>
          )}

          {/* ================================================================= */}
          {/* GROUP 3: ADMIN IT (STRICTLY ADMIN ONLY) */}
          {/* ================================================================= */}
          {isAdmin && (
            <div className="space-y-1 pt-2 border-t border-emerald-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 block mb-1">
                Admin IT
              </span>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-slate-700" />
                  <span>Admin Panel</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* SIDEBAR FOOTER: LANGUAGE PILL & LOGOUT */}
        <div className="p-4 border-t border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900 text-white text-[10px] font-bold shadow-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span>LUGHA: SWA</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-emerald-100 text-[9px]">TZ</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-[11px] font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
              title="Ondoka kwenye mfumo"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Toka</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 2. RIGHT MAIN WORKSPACE: TOP BAR + PAGE CONTENT */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          {/* Mobile Menu Button & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Fungua Menyu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/teacher" className="hover:text-emerald-900 transition-colors">
                Portal ya Walimu
              </Link>
              {pathname !== '/teacher' && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-800 font-bold truncate max-w-[150px] sm:max-w-none">
                    {pageTitle || 'Ukurasa'}
                  </span>
                </>
              )}
            </div>

            <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold border border-emerald-200">
              Muhula wa 1, 2026
            </span>
          </div>

          {/* Right Controls: Active Teacher Switcher Dropdown & Profile Chip */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Teacher Account Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSwitchDropdown(!showSwitchDropdown)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title="Badilisha Mwalimu (Switch Active Teacher Account)"
              >
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Badili Mwalimu:</span>
                <span className="font-extrabold max-w-[100px] truncate sm:max-w-none">
                  {currentUser?.fullName?.split(' ')[1] || 'Mwalimu'}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-700" />
              </button>

              {showSwitchDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-emerald-200 shadow-2xl p-2 z-50 animate-scale-up space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                      Chagua Akaunti ya Kuingia (Switch Account):
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {allAccounts.map((account) => {
                      const isActive = account.identifier === currentUser?.identifier;
                      return (
                        <button
                          key={account.identifier}
                          type="button"
                          onClick={() => handleSwitchTeacher(account.identifier)}
                          className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                            isActive
                              ? 'bg-emerald-800 text-white font-bold'
                              : 'hover:bg-emerald-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="font-black block">{account.fullName}</span>
                            <span
                              className={`text-[10px] block ${
                                isActive ? 'text-emerald-200' : 'text-slate-500'
                              }`}
                            >
                              {account.role === 'HEADTEACHER'
                                ? 'Mwalimu Mkuu'
                                : account.role === 'ACADEMIC'
                                ? 'Mwalimu wa Taaluma'
                                : account.role === 'DISCIPLINE'
                                ? 'Mwalimu wa Nidhamu'
                                : 'Mwalimu wa Darasa'} • {account.identifier}
                            </span>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-amber-300" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Chip */}
            <Link
              href="/teacher/settings"
              className="flex items-center gap-2 pl-2 sm:border-l border-emerald-200 hover:opacity-85 transition-opacity group cursor-pointer"
              title="Fungua Wasifu na Mipangilio"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20 shadow-xs group-hover:ring-emerald-500">
                {userInitials}
              </div>
              <div className="text-left hidden xl:block">
                <span className="text-xs font-black text-slate-800 block leading-tight truncate max-w-[150px] group-hover:text-emerald-900">
                  {currentUser?.fullName}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold block truncate max-w-[150px]">
                  {currentUser?.role === 'HEADTEACHER'
                    ? 'Mwalimu Mkuu'
                    : currentUser?.role === 'ACADEMIC'
                    ? 'Mwl. Taaluma'
                    : currentUser?.role === 'DISCIPLINE'
                    ? 'Mwl. Nidhamu'
                    : 'Class Teacher'}
                </span>
              </div>
            </Link>
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
