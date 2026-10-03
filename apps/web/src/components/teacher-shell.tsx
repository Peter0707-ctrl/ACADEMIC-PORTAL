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
  Layers,
  MessageSquare,
  BarChart3,
  Calendar,
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
    // Mwalimu Mkuu (HEADTEACHER) and ADMIN have universal executive oversight across all school modules
    if (
      requiredRole &&
      session.role !== requiredRole &&
      session.leadershipRole !== requiredRole &&
      session.role !== 'ADMIN' &&
      session.role !== 'HEADTEACHER'
    ) {
      setIsAuthorized(false);
      triggerNotification(
        'error',
        'Eneo Lililozuiliwa',
        `Sehemu hii imehifadhiwa mahsusi kwa ${requiredRole === 'HEADTEACHER' ? 'Mwalimu Mkuu' : requiredRole === 'ACADEMIC' ? 'Mwalimu wa Taaluma' : 'Mwalimu wa Nidhamu'}. Utaelekezwa kwenye Dashibodi Kuu.`
      );
      setTimeout(() => {
        router.push('/teacher');
      }, 2500);
      return;
    }

    setIsAuthorized(true);
    setCurrentUser(session);
  }, [requiredRole, router, triggerNotification]);

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
      {/* 2. LEFT SIDEBAR: PURE LIGHT-GREEN THEME & LOGICAL HEADTEACHER ROLES */}
      {/* ===================================================================== */}
      <aside className="w-full lg:w-72 xl:w-80 bg-white/95 backdrop-blur-md border-r border-emerald-200/90 shrink-0 flex flex-col justify-between shadow-xs lg:min-h-screen lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto z-30">
        <div className="p-4 sm:p-5 space-y-5">
          {/* School Brand / Logo */}
          <div className="flex items-center gap-3 pb-4 border-b border-emerald-100">
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
          {/* GROUP 1: TEACHER WORKSPACE (DASHBOARD & CLASSROOM MODULES) */}
          {/* ================================================================= */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center justify-between">
              <span>Teacher Workspace</span>
              <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">Walimu</span>
            </div>

            {/* Dashboard Overview */}
            <Link
              href="/teacher"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className={`w-4 h-4 ${pathname === '/teacher' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Dashboard Overview</span>
              </div>
            </Link>

            {/* My Classes */}
            <Link
              href="/teacher/classes"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher/classes'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 ${pathname === '/teacher/classes' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>My Classes</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pathname === '/teacher/classes' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'}`}>
                Std 1–7
              </span>
            </Link>

            {/* My Subjects */}
            <Link
              href="/teacher/subjects"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher/subjects'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className={`w-4 h-4 ${pathname === '/teacher/subjects' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>My Subjects</span>
              </div>
            </Link>

            {/* Attendance */}
            <Link
              href="/teacher/attendance"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher/attendance'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className={`w-4 h-4 ${pathname === '/teacher/attendance' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Attendance</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pathname === '/teacher/attendance' ? 'bg-emerald-700 text-white' : 'bg-blue-100 text-blue-900'}`}>
                Daily
              </span>
            </Link>

            {/* Lesson Plans */}
            <Link
              href="/teacher/curriculum"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher/curriculum'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className={`w-4 h-4 ${pathname === '/teacher/curriculum' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Lesson Plans</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pathname === '/teacher/curriculum' ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-900'}`}>
                MoEST
              </span>
            </Link>

            {/* Assignments / Class Activities */}
            <Link
              href="/teacher/assignments"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher/assignments'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${pathname === '/teacher/assignments' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Assignments &amp; Activities</span>
              </div>
            </Link>

            {/* Assessment & Marks */}
            <Link
              href="/teacher/marks"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher/marks'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className={`w-4 h-4 ${pathname === '/teacher/marks' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Assessment &amp; Marks</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pathname === '/teacher/marks' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'}`}>
                12 Months
              </span>
            </Link>

            {/* Pupil Performance */}
            <Link
              href="/teacher/performance"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher/performance'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className={`w-4 h-4 ${pathname === '/teacher/performance' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Pupil Performance</span>
              </div>
            </Link>

            {/* School Timetable (Ratiba ya Shule ya Mwaka Mzima) */}
            <Link
              href="/teacher/timetable"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher/timetable'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className={`w-4 h-4 ${pathname === '/teacher/timetable' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>School Timetable</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pathname === '/teacher/timetable' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'}`}>
                Mwaka Mzima
              </span>
            </Link>

            {/* School Communication */}
            <Link
              href="/teacher/communication"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher/communication'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className={`w-4 h-4 ${pathname === '/teacher/communication' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>School Communication</span>
              </div>
            </Link>

            {/* Profile & Settings */}
            <Link
              href="/teacher/settings"
              className={`w-full px-3 py-2 rounded-xl transition-all flex items-center justify-between text-xs ${
                pathname === '/teacher/settings'
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className={`w-4 h-4 ${pathname === '/teacher/settings' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                <span>Profile &amp; Settings</span>
              </div>
            </Link>
          </div>

          {/* ================================================================= */}
          {/* GROUP 2: OFISI YA MWALIMU MKUU & TAALUMA (EXECUTIVE & ACADEMIC LEADERSHIP) */}
          {/* GATED: Only rendered for Headteacher, Academic Master, Discipline Master, or Admin */}
          {/* NEVER SHOWN TO REGULAR TEACHERS */}
          {/* ================================================================= */}
          {(isHeadteacher || isAcademicMaster || isDisciplineMaster || isAdmin) && (
            <div className="space-y-1 pt-3 border-t border-emerald-100">
              <div className="px-2.5 py-1 flex items-center justify-between text-slate-700">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                  {isHeadteacher ? 'Ofisi ya Mwalimu Mkuu' : isAcademicMaster ? 'Ofisi ya Taaluma' : 'Ofisi ya Uongozi'}
                </span>
                <Award className="w-3.5 h-3.5 text-amber-500" />
              </div>

              <div className="space-y-1">
                {/* Idhini ya Matokeo & Muhuri (Headteacher Only) */}
                {(isHeadteacher || isAdmin) && (
                  <Link
                    href="/teacher/approvals"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      pathname === '/teacher/approvals'
                        ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className={`w-4 h-4 ${pathname === '/teacher/approvals' ? 'text-amber-300' : 'text-amber-600'}`} />
                      <span>Results Approval &amp; Seal</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pathname === '/teacher/approvals' ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-900'}`}>
                      Mkuu
                    </span>
                  </Link>
                )}

                {/* Broadsheet ya Shule Nzima (Headteacher & Academic Master) */}
                {(isHeadteacher || isAcademicMaster || isAdmin) && (
                  <Link
                    href="/teacher/broadsheet"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      pathname === '/teacher/broadsheet'
                        ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className={`w-4 h-4 ${pathname === '/teacher/broadsheet' ? 'text-blue-200' : 'text-blue-600'}`} />
                      <span>School Broadsheet</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pathname === '/teacher/broadsheet' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900'}`}>
                      Taaluma
                    </span>
                  </Link>
                )}

                {/* Walimu Wangu (Staff Directory - Headteacher Only) */}
                {(isHeadteacher || isAdmin) && (
                  <Link
                    href="/teacher/staff"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      pathname === '/teacher/staff'
                        ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className={`w-4 h-4 ${pathname === '/teacher/staff' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                      <span>Staff Directory</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pathname === '/teacher/staff' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                      Walimu
                    </span>
                  </Link>
                )}

                {/* Watahiniwa wa Taifa (NECTA Candidates - Headteacher & Academic Master) */}
                {(isHeadteacher || isAcademicMaster || isAdmin) && (
                  <Link
                    href="/teacher/candidates"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      pathname === '/teacher/candidates'
                        ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className={`w-4 h-4 ${pathname === '/teacher/candidates' ? 'text-purple-200' : 'text-purple-600'}`} />
                      <span>National Candidates (NECTA)</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pathname === '/teacher/candidates' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-900'}`}>
                      Std 4 &amp; 7
                    </span>
                  </Link>
                )}

                {/* Discipline & Truancy (Headteacher & Discipline Master) */}
                {(isHeadteacher || isDisciplineMaster || isAdmin) && (
                  <Link
                    href="/teacher/discipline"
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                      pathname === '/teacher/discipline'
                        ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-950/20 font-bold'
                        : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className={`w-4 h-4 ${pathname === '/teacher/discipline' ? 'text-rose-200' : 'text-rose-600'}`} />
                      <span>Discipline &amp; Truancy</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${pathname === '/teacher/discipline' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-900'}`}>
                      Nidhamu
                    </span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* GROUP 3: UTAWALA WA MFUMO - STRICTLY RENDERED FOR ADMIN ONLY */}
          {/* (Never shown to Mwalimu Mkuu or Teachers) */}
          {/* ================================================================= */}
          {isAdmin && (
            <div className="space-y-1 pt-2 border-t border-emerald-100">
              <div className="px-2 py-1 flex items-center justify-between text-slate-700">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Utawala wa Mfumo
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              </div>

              <Link
                href="/admin"
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>Watumiaji Wote &amp; Kufuta</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  Admin IT
                </span>
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
              <span>LUGHA: SWA</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-emerald-100 text-[9px]">TZ</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-[11px] font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
              title="Ondoka kwenye mfumo na kurudi ukurasa wa Login"
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
        {/* Top Header Bar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          {/* Quick Breadcrumb / Term Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/teacher" className="hover:text-emerald-900 transition-colors">
                Portal ya Walimu
              </Link>
              {pathname !== '/teacher' && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-800 font-bold">{pageTitle || 'Ukurasa'}</span>
                </>
              )}
            </div>
            <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold border border-emerald-200">
              Muhula wa 1, 2026
            </span>
          </div>

          {/* Right Controls: User Profile Chip */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* User Profile Chip (Avatar + Full Name + Role) */}
            <Link
              href="/teacher/settings"
              className="flex items-center gap-2.5 pl-2 sm:border-l border-emerald-200 hover:opacity-85 transition-opacity group cursor-pointer"
              title="Fungua Mipangilio na Wasifu Wako"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20 shadow-xs group-hover:ring-emerald-500">
                {userInitials}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-xs font-black text-slate-800 block leading-tight truncate max-w-[170px] group-hover:text-emerald-900">
                  {currentUser?.fullName}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold block truncate max-w-[170px]">
                  {currentUser?.identifier} • {currentUser?.role === 'HEADTEACHER' ? 'Mwalimu Mkuu' : currentUser?.role === 'ACADEMIC' ? 'Mwl. Taaluma' : currentUser?.role === 'DISCIPLINE' ? 'Mwl. Nidhamu' : 'Class Teacher'}
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
