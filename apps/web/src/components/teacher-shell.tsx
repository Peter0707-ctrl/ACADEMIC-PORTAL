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
  UploadCloud,
  Settings,
  Calendar,
  Layers,
  Clock,
  Sparkles,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Bell,
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
        'Only teaching staff or leadership may access the Teacher Portal. Your current role does not have permission.'
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
      notifyUser(
        'info',
        'Akaunti ya Mwalimu Imebadilishwa',
        `Sasa umeingia kama: ${target.fullName} (${target.role === 'HEADTEACHER' ? 'Mwalimu Mkuu' : target.role === 'ACADEMIC' ? 'Mwl. Taaluma' : 'Mwalimu'})`
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
    if (!name) return 'MW';
    const parts = name.replace(/^(Mwl\.|Dr\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const userInitials = getInitials(currentUser?.fullName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 font-sans flex flex-col lg:flex-row">
      {/* ===================================================================== */}
      {/* LEFT SIDEBAR: COMPLETE PRIMARY SCHOOL TEACHER WORKSPACE */}
      {/* ===================================================================== */}
      <aside className="w-full lg:w-72 xl:w-80 bg-white/95 backdrop-blur-md border-r border-emerald-200/90 shrink-0 flex flex-col justify-between shadow-xs lg:min-h-screen lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto z-30">
        <div className="p-4 sm:p-5 space-y-4">
          {/* School Brand / Logo */}
          <div className="flex items-center gap-3 pb-3 border-b border-emerald-100">
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
                Educational ERP Portal
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* GROUP 1: TEACHER WORKSPACE (PRIMARY SCHOOL TEACHER DASHBOARD) */}
          {/* ================================================================= */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 px-2 block mb-1">
              Teacher Workspace
            </span>

            {/* 1. Dashboard Overview */}
            <Link
              href="/teacher"
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

            {/* 7. Assessment & Marks (Marks Entry) */}
            <Link
              href="/teacher/marks"
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
          {/* (Preserved completely so no built feature is ever lost) */}
          {/* ================================================================= */}
          {(isHeadteacher || isAcademicMaster || isDisciplineMaster || isAdmin) && (
            <div className="space-y-1 pt-2 border-t border-emerald-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 block mb-1">
                Executive Leadership
              </span>

              {/* Results Approval & Seal */}
              <Link
                href="/teacher/approvals"
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/approvals'
                    ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700'
                    : 'text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Results Approval &amp; Seal</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold">
                  Head
                </span>
              </Link>

              {/* School Broadsheet */}
              <Link
                href="/teacher/broadsheet"
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/broadsheet'
                    ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700'
                    : 'text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                  <span>School Broadsheet</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-900 font-bold">
                  Report
                </span>
              </Link>

              {/* Staff Directory */}
              <Link
                href="/teacher/staff"
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/staff'
                    ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700'
                    : 'text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Staff Directory</span>
                </div>
              </Link>

              {/* National Candidates (NECTA) */}
              <Link
                href="/teacher/candidates"
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/candidates'
                    ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700'
                    : 'text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>National Candidates (NECTA)</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-900 font-bold">
                  Std 4 &amp; 7
                </span>
              </Link>

              {/* Discipline & Truancy */}
              <Link
                href="/teacher/discipline"
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  pathname === '/teacher/discipline'
                    ? 'bg-emerald-100/80 text-emerald-950 font-bold border-l-2 border-emerald-700'
                    : 'text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Discipline &amp; Truancy</span>
                </div>
              </Link>
            </div>
          )}

          {/* ================================================================= */}
          {/* GROUP 3: SYSTEM ADMINISTRATION */}
          {/* ================================================================= */}
          {isAdmin && (
            <div className="space-y-1 pt-2 border-t border-emerald-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 block mb-1">
                Admin
              </span>
              <Link
                href="/admin"
                className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>User Management</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* SIDEBAR FOOTER: LANGUAGE PILL & LOGOUT */}
        {/* ================================================================= */}
        <div className="p-4 border-t border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900 text-white text-[10px] font-bold shadow-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span>LANG: ENG</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-emerald-100 text-[9px]">EN</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-[11px] font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
              title="Logout from portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* RIGHT MAIN WORKSPACE: TOP BAR + PAGE CONTENT */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-xs">
          {/* Quick Breadcrumb / Term Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/teacher" className="hover:text-emerald-900 transition-colors">
                Teacher Portal
              </Link>
              {pathname !== '/teacher' && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-800 font-bold">{pageTitle || 'Workspace'}</span>
                </>
              )}
            </div>
            <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold border border-emerald-200">
              Muhula wa 1, 2026
            </span>
          </div>

          {/* Right Controls: Multi-Teacher Switcher + User Profile */}
          <div className="flex items-center gap-3">
            {/* MULTI-TEACHER ACCOUNT SWITCHER */}
            <div className="flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-300 rounded-2xl px-2.5 py-1">
              <User className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">Active Teacher:</span>
              <select
                value={currentUser?.identifier || ''}
                onChange={(e) => handleSwitchTeacher(e.target.value)}
                className="bg-transparent text-xs font-black text-emerald-950 focus:outline-none cursor-pointer"
                title="Badili mwalimu ili kuona mfumo kwa kila mwalimu"
              >
                {allAccounts.map((acc) => (
                  <option key={acc.id} value={acc.identifier}>
                    {acc.fullName} ({acc.role === 'HEADTEACHER' ? 'Headmaster' : acc.role === 'ACADEMIC' ? 'Academic Master' : 'Teacher'})
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-emerald-100">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {userInitials}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-black text-slate-900 block leading-tight">
                  {currentUser?.fullName?.split(' ')[0]} {currentUser?.fullName?.split(' ')[1]}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block leading-tight">
                  {currentUser?.role === 'HEADTEACHER'
                    ? 'Headmaster & Teacher'
                    : currentUser?.role === 'ACADEMIC'
                    ? 'Academic Master'
                    : 'Class & Subject Teacher'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {pageTitle && (
            <div className="border-b border-emerald-100 pb-4">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{pageTitle}</h1>
              {pageDescription && <p className="text-xs sm:text-sm text-slate-500 mt-1">{pageDescription}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
