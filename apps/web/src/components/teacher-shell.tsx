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
  const isLeader = isHeadteacher || isAcademicMaster || isDisciplineMaster;

  // Navigation Links based on role
  const navLinks = useMemo(() => {
    const links = [
      { href: '/teacher', label: 'Dashboard', icon: Home },
    ];

    if (isHeadteacher) {
      links.push(
        { href: '/teacher/approvals', label: 'Idhini ya Matokeo & Muhuri', icon: Award },
        { href: '/teacher/curriculum', label: 'Usimamizi wa Mitaala', icon: TrendingUp },
      );
    }

    if (isAcademicMaster) {
      links.push(
        { href: '/teacher/candidates', label: 'Watahiniwa NECTA', icon: Award },
        { href: '/teacher/broadsheet', label: 'Uratibu wa Broadsheet', icon: FileText },
        { href: '/teacher/curriculum', label: 'Mitaala & Walimu', icon: TrendingUp },
      );
    }

    if (isDisciplineMaster) {
      links.push(
        { href: '/teacher/discipline', label: 'Nidhamu & Utoro', icon: Shield },
      );
    }

    // Common teaching pages (Every teacher teaches and conducts roll-call)
    links.push(
      { href: '/teacher/marks', label: 'Kujaza Alama za Somo', icon: FileSpreadsheet },
      { href: '/teacher/attendance', label: 'Roll-Call ya Darasa', icon: UserCheck },
      { href: '/teacher/staff', label: 'Walimu Wenzangu', icon: Users },
    );

    return links;
  }, [isHeadteacher, isAcademicMaster, isDisciplineMaster]);

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
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 font-sans flex flex-col">
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

      {/* 2. Top Header & Identity */}
      <header className="bg-white/95 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-800/20 hover:bg-emerald-800 transition-colors"
                title="Return to School Home"
              >
                <GraduationCap className="w-5 h-5" />
                <span className="text-[7px] font-black uppercase tracking-wider">Logo</span>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-slate-800 tracking-tight">PRIMARY &amp; NURSERY SCHOOL</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    {isHeadteacher ? 'Mwalimu Mkuu' : isAcademicMaster ? 'Taaluma' : isDisciplineMaster ? 'Nidhamu' : 'Portal ya Mwalimu'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {isHeadteacher ? 'Executive Oversight & Academic Endorsement' : 'Classroom Teaching & Multi-Activity Workspace'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block">{currentUser?.fullName}</span>
                <span className="text-[10px] font-mono text-emerald-700">{currentUser?.identifier}</span>
              </div>

              {currentUser?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/80 transition-all flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>System Admin</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-all border border-slate-200 hover:border-rose-200"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Teacher Switcher Strip */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Active Teacher Account:
            </span>
            {teachersList.map((t) => {
              const isCurrent = currentUser?.id === t.id;
              const isLeaderAccount = ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(t.role);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSwitchTeacher(t)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
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
                    {t.role === 'HEADTEACHER' ? 'Mkuu wa Shule' : t.role === 'ACADEMIC' ? 'Taaluma' : t.role === 'DISCIPLINE' ? 'Nidhamu' : 'Class Teacher'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Activity Multi-Page Navigation Bar */}
          <nav className="mt-3 pt-2 border-t border-emerald-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/90 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 3. Main Page Shell Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {/* Breadcrumb & Page Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 rounded-3xl border border-emerald-200/80 p-5 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/teacher" className="hover:text-emerald-700 flex items-center gap-1">
                <Home className="w-3 h-3" />
                <span>Portal ya Walimu</span>
              </Link>
              {pathname !== '/teacher' && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold text-emerald-800">{pageTitle || 'Shughuli'}</span>
                </>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900">{pageTitle || 'Dashibodi Kuu'}</h1>
            {pageDescription && (
              <p className="text-xs text-slate-500 mt-0.5">{pageDescription}</p>
            )}
          </div>

          {/* Quick Context Pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isHeadteacher && (
              <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Mamlaka ya Mkuu wa Shule</span>
              </span>
            )}
            {currentUser?.assignedClasses && (
              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
                Madarasa: {currentUser.assignedClasses.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Injected Page Content */}
        {children}
      </main>
    </div>
  );
}
