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
  ChevronRight,
  Home,
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
      'Teacher Switched',
      `Now operating as ${teacher.fullName} (${teacher.role.replace('_', ' ')}).`
    );
  };

  const handleLogout = () => {
    clearCurrentSession();
    router.push('/');
  };

  const teachersList = useMemo(() => {
    return allAccounts.filter((a) => ['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(a.role));
  }, [allAccounts]);

  const isHeadteacher = currentUser?.role === 'HEADTEACHER' || currentUser?.leadershipRole === 'HEADTEACHER';
  const isAcademicMaster = currentUser?.role === 'ACADEMIC' || currentUser?.leadershipRole === 'ACADEMIC';
  const isDisciplineMaster = currentUser?.role === 'DISCIPLINE' || currentUser?.leadershipRole === 'DISCIPLINE';

  // Navigation Links for Specific Roles (Left Sidebar Group 1)
  const executiveLinks = useMemo(() => {
    const links = [];

    if (isHeadteacher) {
      links.push(
        {
          href: '/teacher/approvals',
          label: 'Idhini ya Matokeo & Muhuri',
          subtitle: 'Approvals & Official Seal',
          icon: Award,
        },
        {
          href: '/teacher/curriculum',
          label: 'Usimamizi wa Mitaala',
          subtitle: 'Syllabus & Lesson Plans',
          icon: TrendingUp,
        },
      );
    }

    if (isAcademicMaster) {
      links.push(
        {
          href: '/teacher/candidates',
          label: 'Watahiniwa wa Taifa',
          subtitle: 'NECTA PSLE & SFNA',
          icon: Award,
        },
        {
          href: '/teacher/broadsheet',
          label: 'Uratibu wa Broadsheet',
          subtitle: 'Rankings & Calculations',
          icon: FileText,
        },
        {
          href: '/teacher/curriculum',
          label: 'Mitaala & Walimu',
          subtitle: 'Syllabus Oversight',
          icon: TrendingUp,
        },
      );
    }

    if (isDisciplineMaster) {
      links.push(
        {
          href: '/teacher/discipline',
          label: 'Nidhamu & Utoro wa Shule',
          subtitle: 'Attendance & Summons',
          icon: Shield,
        },
      );
    }

    return links;
  }, [isHeadteacher, isAcademicMaster, isDisciplineMaster]);

  // Common Teaching Links (Left Sidebar Group 2: For All Teachers & Leaders)
  const classroomLinks = useMemo(() => {
    return [
      {
        href: '/teacher',
        label: 'Dashibodi Kuu (Home)',
        subtitle: 'Activity Launchpad',
        icon: Home,
      },
      {
        href: '/teacher/marks',
        label: 'Kujaza Alama za Somo',
        subtitle: 'Subject Marks Entry',
        icon: FileSpreadsheet,
      },
      {
        href: '/teacher/attendance',
        label: 'Roll-Call ya Darasa Langu',
        subtitle: 'Daily Attendance Register',
        icon: UserCheck,
      },
      {
        href: '/teacher/staff',
        label: 'Walimu Wangu & Idara',
        subtitle: 'Teaching Staff Directory',
        icon: Users,
      },
    ];
  }, []);

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        {notification && (
          <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-6 shadow-2xl text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold">{notification.title}</h3>
            <p className="text-xs text-blue-100/90">{notification.message}</p>
            <Link
              href="/teacher"
              className="block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs"
            >
              Return to Teacher Dashboard
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 font-sans flex flex-col lg:flex-row">
      {/* 1. Centered Small Blue Notification Modal */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-5 shadow-2xl border border-blue-500/30 text-center space-y-3 animate-scale-in"
            role="alert"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mx-auto text-blue-300">
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
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
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. LEFT SIDEBAR NAVIGATION (DEDICATED BUTTONS FOR SPECIFIC ROLES) */}
      {/* ===================================================================== */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-md border-r border-emerald-200/90 p-5 flex flex-col justify-between shadow-lg lg:shadow-xs transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:static lg:h-screen lg:overflow-y-auto
      `}>
        <div className="space-y-6">
          {/* School Brand & Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-800/20 group-hover:bg-emerald-800 transition-colors">
                <GraduationCap className="w-6 h-6" />
                <span className="text-[7px] font-black uppercase tracking-wider">Logo</span>
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-tight">PRIMARY SCHOOL</h2>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Academic Portal
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active User Card in Sidebar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                {isHeadteacher ? <Award className="w-5 h-5 text-amber-300" /> : currentUser?.fullName.charAt(0) || 'T'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-slate-900 truncate" title={currentUser?.fullName}>
                  {currentUser?.fullName}
                </h3>
                <span className="text-[10px] font-mono text-emerald-800 font-semibold block truncate">
                  {currentUser?.identifier}
                </span>
              </div>
            </div>
            <div className="pt-1 border-t border-emerald-200/50 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {isHeadteacher
                  ? 'Mwalimu Mkuu'
                  : isAcademicMaster
                  ? 'Mwl. Taaluma'
                  : isDisciplineMaster
                  ? 'Mwl. Nidhamu'
                  : 'Class Teacher'}
              </span>
              <span className="text-[9px] text-slate-500 font-medium">Active Session</span>
            </div>
          </div>

          {/* BUTTON GROUP 1: SPECIFIC ROLE PAGES (OFISI YA UONGOZI) */}
          {executiveLinks.length > 0 && (
            <div className="space-y-2">
              <div className="px-2 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <span>
                  {isHeadteacher
                    ? 'Ofisi ya Mkuu (Executive Pages)'
                    : isAcademicMaster
                    ? 'Idara ya Taaluma (Academic)'
                    : 'Idara ya Nidhamu (Discipline)'}
                </span>
                <span className="text-amber-600 font-bold">Exclusive</span>
              </div>
              <div className="space-y-1">
                {executiveLinks.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full p-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-between group ${
                        isActive
                          ? 'bg-emerald-700 text-white shadow-md shadow-emerald-800/20'
                          : 'bg-white/80 hover:bg-emerald-50 text-slate-700 hover:text-emerald-950 border border-slate-200/70 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-emerald-800 text-amber-300'
                              : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left truncate">
                          <span className="block truncate leading-tight">{item.label}</span>
                          <span
                            className={`text-[9px] block truncate font-normal ${
                              isActive ? 'text-emerald-100' : 'text-slate-400 group-hover:text-slate-500'
                            }`}
                          >
                            {item.subtitle}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isActive ? 'text-white translate-x-0.5' : 'text-slate-300 group-hover:text-emerald-700'
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* BUTTON GROUP 2: CLASSROOM TEACHING PAGES (DARASANI KWANGU) */}
          <div className="space-y-2">
            <div className="px-2 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <span>Shughuli za Darasani (Teaching)</span>
              <span className="text-emerald-700 font-bold">Classroom</span>
            </div>
            <div className="space-y-1">
              {classroomLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full p-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-800/20'
                        : 'bg-white/80 hover:bg-emerald-50 text-slate-700 hover:text-emerald-950 border border-slate-200/70 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-emerald-800 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left truncate">
                        <span className="block truncate leading-tight">{item.label}</span>
                        <span
                          className={`text-[9px] block truncate font-normal ${
                            isActive ? 'text-emerald-100' : 'text-slate-400 group-hover:text-slate-500'
                          }`}
                        >
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isActive ? 'text-white translate-x-0.5' : 'text-slate-300 group-hover:text-emerald-700'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Bottom: Admin Link & Logout */}
        <div className="pt-4 border-t border-slate-200/80 space-y-2 mt-4">
          {currentUser?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>System Admin (Control Room)</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-all border border-slate-200 hover:border-rose-200 flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Toka Nje (Logout)</span>
          </button>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 3. MAIN RIGHT WORKSPACE AREA */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Right Top Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-30 shadow-xs">
          <div className="px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Mobile Menu Toggle Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-50"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Link href="/teacher" className="hover:text-emerald-700 font-medium">
                    Teacher Portal
                  </Link>
                  {pathname !== '/teacher' && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-emerald-900">{pageTitle || 'Activity'}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Active Teacher Badge */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                  {currentUser?.fullName} ({currentUser?.identifier})
                </span>
              </div>
            </div>

            {/* Teacher Switcher Strip (1-Click Switch between Headteacher & Teachers) */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                Akaunti ya Kujaribu:
              </span>
              {teachersList.map((t) => {
                const isCurrent = currentUser?.id === t.id;
                const isLeaderAccount = ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(t.role);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSwitchTeacher(t)}
                    className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : isLeaderAccount
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {t.role === 'HEADTEACHER' && <Award className="w-3 h-3 text-amber-500" />}
                    {t.role === 'ACADEMIC' && <BookOpen className="w-3 h-3 text-blue-500" />}
                    {t.role === 'DISCIPLINE' && <Shield className="w-3 h-3 text-emerald-500" />}
                    {t.role === 'TEACHER' && <Users className="w-3 h-3 text-slate-400" />}
                    <span>{t.fullName}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isCurrent ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {t.role === 'HEADTEACHER' ? 'Mkuu wa Shule' : t.role === 'ACADEMIC' ? 'Taaluma' : t.role === 'DISCIPLINE' ? 'Nidhamu' : 'Mwalimu'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Page Title Card */}
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900">{pageTitle || 'Dashibodi Kuu'}</h1>
              {pageDescription && (
                <p className="text-xs text-slate-500 mt-0.5">{pageDescription}</p>
              )}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {isHeadteacher && (
                <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ofisi ya Mkuu wa Shule</span>
                </span>
              )}
              {currentUser?.assignedClasses && (
                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                  Madarasa Yako: {currentUser.assignedClasses.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Child Page Content Injected */}
          {children}
        </main>
      </div>
    </div>
  );
}
