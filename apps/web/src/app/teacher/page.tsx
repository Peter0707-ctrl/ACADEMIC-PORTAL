'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle2,
  Calendar,
  Award,
  Clock,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Search,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle,
  Info,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Sparkles,
  Shield,
  FileText,
  Building2,
  AlertTriangle,
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

interface StudentMark {
  id: string;
  admNo: string;
  name: string;
  gender: 'M' | 'F';
  mark: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  attendance: 'PRESENT' | 'ABSENT' | 'PERMISSION';
}

const INITIAL_PUPILS: Record<string, StudentMark[]> = {
  'Standard 5 (Grade 5)': [
    { id: 'p1', admNo: 'PUP-2026-085', name: 'Baraka David', gender: 'M', mark: 86, grade: 'A', attendance: 'PRESENT' },
    { id: 'p2', admNo: 'PUP-2026-086', name: 'Zuhura Ally', gender: 'F', mark: 92, grade: 'A', attendance: 'PRESENT' },
    { id: 'p3', admNo: 'PUP-2026-087', name: 'Joshua Peter', gender: 'M', mark: 74, grade: 'B', attendance: 'PRESENT' },
    { id: 'p4', admNo: 'PUP-2026-088', name: 'Dorothy Michael', gender: 'F', mark: 65, grade: 'C', attendance: 'PRESENT' },
    { id: 'p5', admNo: 'PUP-2026-089', name: 'Emanuel Joseph', gender: 'M', mark: 80, grade: 'A', attendance: 'PERMISSION' },
  ],
  'Standard 4 (Grade 4)': [
    { id: 'p6', admNo: 'SFNA-2026-0112', name: 'Juma Bakari (Candidate)', gender: 'M', mark: 88, grade: 'A', attendance: 'PRESENT' },
    { id: 'p7', admNo: 'SFNA-2026-0113', name: 'Fatma Hassan (Candidate)', gender: 'F', mark: 94, grade: 'A', attendance: 'PRESENT' },
    { id: 'p8', admNo: 'PUP-2026-045', name: 'Saidi Mohamed', gender: 'M', mark: 70, grade: 'B', attendance: 'PRESENT' },
    { id: 'p9', admNo: 'PUP-2026-046', name: 'Rehema John', gender: 'F', mark: 58, grade: 'C', attendance: 'ABSENT' },
  ],
  'Standard 6 (Grade 6)': [
    { id: 'p13', admNo: 'PUP-2026-061', name: 'Rashid Hamisi', gender: 'M', mark: 85, grade: 'A', attendance: 'PRESENT' },
    { id: 'p14', admNo: 'PUP-2026-062', name: 'Amina Salum', gender: 'F', mark: 89, grade: 'A', attendance: 'PRESENT' },
    { id: 'p15', admNo: 'PUP-2026-063', name: 'Frank Leonard', gender: 'M', mark: 76, grade: 'B', attendance: 'PRESENT' },
    { id: 'p16', admNo: 'PUP-2026-064', name: 'Grace Mlay', gender: 'F', mark: 92, grade: 'A', attendance: 'PRESENT' },
  ],
  'Standard 7 (Grade 7)': [
    { id: 'p10', admNo: 'PSLE-2026-0428', name: 'Kelvin Shirima (Candidate)', gender: 'M', mark: 96, grade: 'A', attendance: 'PRESENT' },
    { id: 'p11', admNo: 'PSLE-2026-0429', name: 'Neema Massawe (Candidate)', gender: 'F', mark: 91, grade: 'A', attendance: 'PRESENT' },
    { id: 'p12', admNo: 'PSLE-2026-0430', name: 'Amani Charles (Candidate)', gender: 'M', mark: 84, grade: 'A', attendance: 'PRESENT' },
  ],
};

function calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 81) return 'A';
  if (score >= 65) return 'B';
  if (score >= 45) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

export default function TeacherPortalPage() {
  const router = useRouter();

  // Active Teacher Session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [allAccounts, setAllAccounts] = useState<UserAccount[]>([]);

  // Centered Small Blue Modal Notification
  const [notification, setNotification] = useState<CenteredNotification | null>(null);

  // Active Tab:
  // General: 'MARKS' | 'ATTENDANCE' | 'STAFF_ROSTER'
  // Headteacher: 'HT_APPROVALS' | 'HT_STAFF_OVERSIGHT'
  // Academic: 'ACAD_CANDIDATES' | 'ACAD_BROADSHEET'
  // Discipline: 'DISC_WHOLE_SCHOOL' | 'DISC_INCIDENTS'
  const [activeTab, setActiveTab] = useState<string>('MARKS');

  // Active Selected Class & Subject for teaching
  const [selectedClass, setSelectedClass] = useState<string>('Standard 5 (Grade 5)');
  const [selectedSubject, setSelectedSubject] = useState<string>('English Language');

  // Pupils & Attendance State
  const [pupilsData, setPupilsData] = useState<Record<string, StudentMark[]>>(INITIAL_PUPILS);
  const [searchPupil, setSearchPupil] = useState('');

  const triggerNotification = useCallback((type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => {
    setNotification({ type, title, message });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // 1. Strict Security & Session Verification
  useEffect(() => {
    const accounts = getStoredAccounts();
    setAllAccounts(accounts);

    let session = getCurrentSession();

    // If no session, default to Headteacher (Mwl. Augustine Mrosso) to showcase leadership
    if (!session) {
      const defaultLeader = accounts.find((a) => a.role === 'HEADTEACHER') || accounts[1];
      setCurrentSession(defaultLeader);
      session = defaultLeader;
    }

    // Role-based security check: Students or Parents cannot view teacher portal!
    if (!canAccessPortal(session, 'TEACHER')) {
      setIsAuthorized(false);
      triggerNotification(
        'error',
        'Unauthorized Access',
        'Only primary teaching staff or school leadership may access the Teacher Portal. Your current role does not have permission.'
      );
      return;
    }

    setIsAuthorized(true);
    setCurrentUser(session);

    // Set default class & subject from teacher's assignments
    if (session.assignedClasses && session.assignedClasses.length > 0) {
      setSelectedClass(session.assignedClasses[0]);
    } else if (session.assignedClass && session.assignedClass !== 'Whole School') {
      setSelectedClass(session.assignedClass);
    }

    if (session.subjects && session.subjects.length > 0) {
      setSelectedSubject(session.subjects[0]);
    }

    // Default tab based on role
    if (session.role === 'HEADTEACHER' || session.leadershipRole === 'HEADTEACHER') {
      setActiveTab('HT_APPROVALS');
    } else if (session.role === 'ACADEMIC' || session.leadershipRole === 'ACADEMIC') {
      setActiveTab('ACAD_CANDIDATES');
    } else if (session.role === 'DISCIPLINE' || session.leadershipRole === 'DISCIPLINE') {
      setActiveTab('DISC_WHOLE_SCHOOL');
    } else {
      setActiveTab('MARKS');
    }
  }, [triggerNotification]);

  // Switch Teacher Identity
  const handleSwitchTeacher = (teacher: UserAccount) => {
    setCurrentSession(teacher);
    setCurrentUser(teacher);

    if (teacher.assignedClasses && teacher.assignedClasses.length > 0) {
      setSelectedClass(teacher.assignedClasses[0]);
    } else if (teacher.assignedClass && teacher.assignedClass !== 'Whole School') {
      setSelectedClass(teacher.assignedClass);
    }

    if (teacher.subjects && teacher.subjects.length > 0) {
      setSelectedSubject(teacher.subjects[0]);
    }

    if (teacher.role === 'HEADTEACHER' || teacher.leadershipRole === 'HEADTEACHER') {
      setActiveTab('HT_APPROVALS');
    } else if (teacher.role === 'ACADEMIC' || teacher.leadershipRole === 'ACADEMIC') {
      setActiveTab('ACAD_CANDIDATES');
    } else if (teacher.role === 'DISCIPLINE' || teacher.leadershipRole === 'DISCIPLINE') {
      setActiveTab('DISC_WHOLE_SCHOOL');
    } else {
      setActiveTab('MARKS');
    }

    triggerNotification(
      'success',
      'Teacher Switched',
      `Now logged in as ${teacher.fullName} (${teacher.role.replace('_', ' ')}).`
    );
  };

  // Logout Handler
  const handleLogout = () => {
    clearCurrentSession();
    router.push('/');
  };

  // List of all primary teachers for roster
  const teachersList = useMemo(() => {
    return allAccounts.filter((a) => ['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(a.role));
  }, [allAccounts]);

  // Candidates list (for Academic Master)
  const candidatesList = useMemo(() => {
    return allAccounts.filter((a) => a.role === 'CANDIDATE');
  }, [allAccounts]);

  // Current class pupils
  const currentPupils = useMemo(() => {
    const list = pupilsData[selectedClass] || pupilsData['Standard 5 (Grade 5)'] || [];
    if (!searchPupil.trim()) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(searchPupil.toLowerCase()) ||
        p.admNo.toLowerCase().includes(searchPupil.toLowerCase())
    );
  }, [pupilsData, selectedClass, searchPupil]);

  // Handle Mark Change
  const handleMarkChange = (pupilId: string, newMark: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(newMark) ? 0 : newMark));
    const grade = calculateGrade(clamped);

    setPupilsData((prev) => {
      const classList = [...(prev[selectedClass] || prev['Standard 5 (Grade 5)'] || [])];
      const idx = classList.findIndex((p) => p.id === pupilId);
      if (idx !== -1) {
        classList[idx] = { ...classList[idx], mark: clamped, grade };
      }
      return { ...prev, [selectedClass]: classList };
    });
  };

  // Handle Attendance Toggle
  const handleAttendanceChange = (pupilId: string, status: 'PRESENT' | 'ABSENT' | 'PERMISSION') => {
    setPupilsData((prev) => {
      const classList = [...(prev[selectedClass] || prev['Standard 5 (Grade 5)'] || [])];
      const idx = classList.findIndex((p) => p.id === pupilId);
      if (idx !== -1) {
        classList[idx] = { ...classList[idx], attendance: status };
      }
      return { ...prev, [selectedClass]: classList };
    });
  };

  // Teacher leadership flags
  const isHeadteacher = currentUser?.role === 'HEADTEACHER' || currentUser?.leadershipRole === 'HEADTEACHER';
  const isAcademicMaster = currentUser?.role === 'ACADEMIC' || currentUser?.leadershipRole === 'ACADEMIC';
  const isDisciplineMaster = currentUser?.role === 'DISCIPLINE' || currentUser?.leadershipRole === 'DISCIPLINE';
  const isLeader = isHeadteacher || isAcademicMaster || isDisciplineMaster;

  // If unauthorized, block view
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        {notification && (
          <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-6 shadow-2xl text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold">{notification.title}</h3>
            <p className="text-xs text-blue-100/90">{notification.message}</p>
            <Link
              href="/"
              className="block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs"
            >
              Return to Login Portal
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 font-sans flex flex-col">
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
      {/* 2. HEADER: SCHOOL IDENTITY & TEACHER BADGE */}
      {/* ===================================================================== */}
      <header className="bg-white/95 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* School Crest */}
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
                    {isHeadteacher ? 'Mwalimu Mkuu (Headteacher)' : isAcademicMaster ? 'Mwl. wa Taaluma' : isDisciplineMaster ? 'Mwl. wa Nidhamu' : 'Class Teacher Portal'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {isHeadteacher ? 'Executive Oversight & Academic Endorsement' : 'Classroom Teaching & Academic Records'}
                </p>
              </div>
            </div>

            {/* Active Teacher Identity & Navigation */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block">{currentUser?.fullName}</span>
                <span className="text-[10px] font-mono text-emerald-700">{currentUser?.identifier}</span>
              </div>

              {/* Only System Admin gets access to technical admin settings */}
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

          {/* TEACHER SWITCHER STRIP (Effortlessly test different teacher leaders & regular teachers) */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Active Teacher Account:
            </span>
            {teachersList.map((t) => {
              const isCurrent = currentUser?.id === t.id;
              const isLeader = ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(t.role);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSwitchTeacher(t)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : isLeader
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
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 3. MAIN TEACHER DASHBOARD CONTENT */}
      {/* ===================================================================== */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">

        {/* LOGGED-IN TEACHER PROFILE BANNER */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-300 shadow-2xs">
                {isHeadteacher ? <Award className="w-6 h-6 text-emerald-800" /> : currentUser?.fullName.charAt(0) || 'T'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-800">{currentUser?.fullName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                    {isHeadteacher
                      ? 'Mwalimu Mkuu (Headteacher / Principal)'
                      : isAcademicMaster
                      ? 'Mwalimu wa Taaluma (Academic Master)'
                      : isDisciplineMaster
                      ? 'Mwalimu wa Nidhamu (Discipline Master)'
                      : 'Primary Class Teacher'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-0.5">
                  <span className="font-mono text-emerald-800 font-semibold">{currentUser?.identifier}</span>
                  <span>•</span>
                  <span>{currentUser?.email}</span>
                  <span>•</span>
                  <span>Teaching: {currentUser?.subjects?.join(', ') || 'Primary Curriculum'}</span>
                </div>
              </div>
            </div>

            {/* Quick Authority Seal Badge */}
            {isHeadteacher && (
              <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="block leading-tight">Headteacher Official Seal</span>
                  <span className="text-[10px] text-amber-700 font-normal">Authorized to approve &amp; sign end-of-term broadsheets</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* DUAL-MODE CONTROLLER FOR TEACHER LEADERS (OFISI YA MKUU VS DARASANI) */}
        {/* =================================================================== */}
        {isLeader && (
          <div className="bg-white/95 rounded-2xl border border-emerald-200/90 p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                Eneo la Kazi:
              </span>
              <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    if (isHeadteacher) setActiveTab('HT_APPROVALS');
                    else if (isAcademicMaster) setActiveTab('ACAD_CANDIDATES');
                    else if (isDisciplineMaster) setActiveTab('DISC_WHOLE_SCHOOL');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    ['HT_APPROVALS', 'HT_STAFF_OVERSIGHT', 'ACAD_CANDIDATES', 'ACAD_BROADSHEET', 'DISC_WHOLE_SCHOOL', 'DISC_INCIDENTS'].includes(activeTab)
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>
                    {isHeadteacher
                      ? 'Ofisi ya Mkuu (Executive Leadership)'
                      : isAcademicMaster
                      ? 'Ofisi ya Taaluma (Academic Master)'
                      : 'Ofisi ya Nidhamu (Discipline Master)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('MARKS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    ['MARKS', 'ATTENDANCE', 'STAFF_ROSTER'].includes(activeTab)
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Darasani Kwangu (Teaching Dashboard)</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 font-medium px-1 flex items-center gap-1.5">
              {['MARKS', 'ATTENDANCE', 'STAFF_ROSTER'].includes(activeTab) ? (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    Modi ya Kufundisha: Unajaza alama na mahudhurio ya madarasa unayofundisha ({currentUser?.assignedClasses?.join(', ') || currentUser?.assignedClass}).
                  </span>
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Modi ya Uongozi: Una mamlaka ya kiutendaji na usimamizi wa shule nzima.
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* WORKSPACE NAVIGATION TABS (ADAPTS DYNAMICALLY TO TEACHER'S ROLE) */}
        <div className="flex items-center gap-2 border-b border-emerald-200/80 pb-2 overflow-x-auto scrollbar-none text-xs font-bold">
          
          {/* 1. Headteacher Exclusive Tabs */}
          {isHeadteacher && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('HT_APPROVALS')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'HT_APPROVALS'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Idhini ya Matokeo (Approvals &amp; Seal)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('HT_STAFF_OVERSIGHT')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'HT_STAFF_OVERSIGHT'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Usimamizi wa Walimu &amp; Mitaala</span>
              </button>
            </>
          )}

          {/* 2. Academic Master Exclusive Tabs */}
          {isAcademicMaster && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('ACAD_CANDIDATES')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'ACAD_CANDIDATES'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Watahiniwa wa Taifa (PSLE &amp; SFNA)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ACAD_BROADSHEET')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'ACAD_BROADSHEET'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Uratibu wa Mitihani &amp; Broadsheet</span>
              </button>
            </>
          )}

          {/* 3. Discipline Master Exclusive Tabs */}
          {isDisciplineMaster && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('DISC_WHOLE_SCHOOL')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'DISC_WHOLE_SCHOOL'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-300" />
                <span>Mahudhurio ya Shule Nzima &amp; Utoro</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('DISC_INCIDENTS')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'DISC_INCIDENTS'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Nidhamu, Sare &amp; Wito wa Wazazi</span>
              </button>
            </>
          )}

          {/* 4. Common Teaching Tabs (Every teacher teaches subjects and manages roll-call) */}
          <button
            type="button"
            onClick={() => setActiveTab('MARKS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'MARKS'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Kujaza Alama za Somo (Marks Entry)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ATTENDANCE')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ATTENDANCE'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Roll-Call ya Darasa Langu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('STAFF_ROSTER')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'STAFF_ROSTER'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Walimu Wenzangu ({teachersList.length})</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* VIEW: HEADTEACHER APPROVALS & OFFICIAL SEAL */}
        {/* =================================================================== */}
        {activeTab === 'HT_APPROVALS' && isHeadteacher && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 mb-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>Ofisi ya Mwalimu Mkuu (Headteacher Executive Desk)</span>
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  Uidhinishaji wa Matokeo ya Muhula &amp; Muhuri Rasmi wa Shule
                </h3>
                <p className="text-xs text-slate-500">
                  Mwalimu Mkuu pekee ana mamlaka ya kupitia alama zote za madarasa ya awali hadi darasa la 7 na kutia saini rasmi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => triggerNotification('success', 'Matokeo Yameidhinishwa', 'Mwalimu Mkuu ametia Muhuri Rasmi wa Shule. Matokeo sasa yanaonekana rasmi kwenye portal za wazazi na wanafunzi.')}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tia Saini &amp; Muhuri Rasmi wa Shule</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <span className="font-bold text-slate-700 block">Madarasa Yaliyokamilisha Alama</span>
                <span className="text-2xl font-black text-emerald-800 block">7 / 7 Madarasa</span>
                <p className="text-[11px] text-slate-500">Kuanzia Nursery hadi Standard 7 walimu wote wamewasilisha alama.</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <span className="font-bold text-slate-700 block">Watahiniwa wa Mtihani wa Taifa (PSLE)</span>
                <span className="text-2xl font-black text-amber-900 block">Wastani: 89.2% (Grade A)</span>
                <p className="text-[11px] text-slate-500">Watahiniwa wote 4 wamefaulu mitihani ya majaribio ya NECTA.</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                <span className="font-bold text-slate-700 block">Hali ya Ripoti za Wazazi</span>
                <span className="text-2xl font-black text-blue-900 block">Tayari kwa Uidhinisho</span>
                <p className="text-[11px] text-slate-500">SMS na PDF za ripoti zitatumwa mara baada ya saini ya Mkuu.</p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW: HEADTEACHER STAFF & SYLLABUS OVERSIGHT */}
        {/* =================================================================== */}
        {activeTab === 'HT_STAFF_OVERSIGHT' && isHeadteacher && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800">
                Usimamizi wa Maendeleo ya Walimu &amp; Ufundishaji wa Mitaala (Syllabus Coverage)
              </h3>
              <p className="text-xs text-slate-500">
                Tathmini ya maandalio ya masomo (Lesson Plans) na kasi ya kumaliza muhtasari wa masomo.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Jina la Mwalimu</th>
                    <th className="py-3 px-4">Masomo Anayofundisha</th>
                    <th className="py-3 px-4">Madarasa</th>
                    <th className="py-3 px-4">Maandalio (Lesson Plans)</th>
                    <th className="py-3 px-4">Muhtasari wa Somo (%)</th>
                    <th className="py-3 px-4">Tathmini ya Mkuu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {teachersList.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-800">{t.fullName}</td>
                      <td className="py-3 px-4 text-slate-600">{t.subjects?.join(', ') || 'Mtaala wa Msingi'}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{t.assignedClasses?.join(', ') || t.assignedClass}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Yamewasilishwa Kila Wiki
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700">96% - 98%</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">Kazi Nzuri Sana</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW: ACADEMIC MASTER CANDIDATES TRACKING */}
        {/* =================================================================== */}
        {activeTab === 'ACAD_CANDIDATES' && isAcademicMaster && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                  <span>Ofisi ya Mwalimu wa Taaluma (Academic Desk)</span>
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  Usimamizi wa Watahiniwa wa Mitihani ya Taifa (PSLE Std 7 &amp; SFNA Std 4)
                </h3>
                <p className="text-xs text-slate-500">
                  Fuatilia namba za watahiniwa wa NECTA, matokeo ya mitihani ya majaribio (Mock Exams), na maandalizi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => triggerNotification('info', 'NECTA Sync', 'Watahiniwa wote 4 wamethibitishwa na namba zao za mtihani zinalingana na mfumo wa NECTA.')}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Thibitisha Namba za NECTA</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Jina la Mtahiniwa</th>
                    <th className="py-3 px-4">Aina ya Mtihani</th>
                    <th className="py-3 px-4">Namba ya Mtihani (Index No)</th>
                    <th className="py-3 px-4">Darasa</th>
                    <th className="py-3 px-4">Wastani wa Mock</th>
                    <th className="py-3 px-4">Daraja Linalotarajiwa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {candidatesList.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-800">{c.fullName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                          {c.candidateType} Candidate
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-800 font-bold">{c.examIndexNo}</td>
                      <td className="py-3 px-4 text-slate-700">{c.assignedClass}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">92%</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                          Grade A (Distinction)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW: DISCIPLINE MASTER WHOLE-SCHOOL ATTENDANCE & TRUANCY */}
        {/* =================================================================== */}
        {activeTab === 'DISC_WHOLE_SCHOOL' && isDisciplineMaster && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 mb-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Ofisi ya Mwalimu wa Nidhamu (Discipline Desk)</span>
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  Mahudhurio ya Shule Nzima, Utoro &amp; Sare za Wanafunzi
                </h3>
                <p className="text-xs text-slate-500">
                  Ripoti ya mahudhurio ya asubuhi kutoka kwa walimu wote wa madarasa na wito wa wazazi kwa utoro.
                </p>
              </div>

              <button
                type="button"
                onClick={() => triggerNotification('info', 'Ripoti ya Nidhamu', 'Mahudhurio ya shule nzima leo ni 99.4%. Wanafunzi 2 watoro wametumiwa barua rasmi za wito wa wazazi.')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Toa Wito wa Wazazi Kiotomatiki</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block">Asilimia ya Mahudhurio Leo</span>
                <span className="text-2xl font-black text-emerald-700 block">99.4%</span>
                <p className="text-[11px] text-slate-500">Wanafunzi 412 wapo shuleni, 2 pekee hawapo.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block">Ukaguzi wa Sare &amp; Usafi</span>
                <span className="text-2xl font-black text-emerald-700 block">Kiwango A</span>
                <p className="text-[11px] text-slate-500">Ukaguzi wa gwaride la asubuhi umekamilika vizuri.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block">Wito wa Wazazi Unaosubiri</span>
                <span className="text-2xl font-black text-slate-800 block">2 Wito</span>
                <p className="text-[11px] text-slate-500">Wazazi wamejulishwa kupitia ujumbe wa mfumo.</p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* WORKSPACE VIEW: SUBJECT MARKS ENTRY (For all teachers) */}
        {/* =================================================================== */}
        {activeTab === 'MARKS' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            {/* Class & Subject Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Uwekaji wa Alama za Somo ({currentUser?.fullName})
                </h3>
                <p className="text-xs text-slate-500">
                  Jaza alama za majaribio na Continuous Assessment (CA) kwa masomo unayofundisha. Madaraja (Grade A, B, C, D, F) yanapigwa kiotomatiki.
                </p>
              </div>

              {/* Class & Subject Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Chagua Darasa</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    {Object.keys(pupilsData).map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Somo Lako</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    {currentUser?.subjects?.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    )) || (
                      <option value="Somo Rasmi">Somo Rasmi</option>
                    )}
                  </select>
                </div>

                <div className="self-end">
                  <button
                    type="button"
                    onClick={() => triggerNotification('success', 'Alama Zimehifadhiwa', `Alama za ${selectedClass} (${selectedSubject}) zimehifadhiwa kikamilifu na kupelekwa kwa Mwalimu wa Taaluma.`)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hifadhi Alama Zote</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Teaching leader contextual notice */}
            {isLeader && currentUser?.subjects && currentUser.subjects.length > 0 && (
              <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-800">
                      Dashboard ya Mwalimu Darasani ({isHeadteacher ? 'Mwalimu Mkuu anayefundisha' : isAcademicMaster ? 'Mwl wa Taaluma anayefundisha' : 'Mwl wa Nidhamu anayefundisha'})
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Unasimamia ufundishaji wa: <strong className="text-emerald-900">{currentUser.subjects.join(', ')}</strong> kwa madarasa: <strong className="text-emerald-900">{currentUser.assignedClasses?.join(' na ') || currentUser.assignedClass}</strong>. Alama unazoingiza hapa zitaingizwa moja kwa moja kwenye ripoti na broadsheet ya shule.
                    </span>
                  </div>
                </div>
                {isHeadteacher && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('HT_APPROVALS')}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 flex items-center gap-1.5 self-start sm:self-auto transition-all shadow-2xs"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Rudi Ofisi ya Mkuu</span>
                  </button>
                )}
              </div>
            )}

            {/* Marks Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Jina la Mwanafunzi</th>
                    <th className="py-3 px-4">Namba ya Usajili</th>
                    <th className="py-3 px-4">Jinsia</th>
                    <th className="py-3 px-4">Alama (0 - 100)</th>
                    <th className="py-3 px-4">Daraja</th>
                    <th className="py-3 px-4">Maoni ya Ufaulu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {currentPupils.map((pupil, idx) => (
                    <tr key={pupil.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{pupil.name}</td>
                      <td className="py-3 px-4 font-mono text-emerald-700">{pupil.admNo}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{pupil.gender}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={pupil.mark}
                          onChange={(e) => handleMarkChange(pupil.id, parseInt(e.target.value, 10))}
                          className="w-20 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white text-center"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-black text-xs ${
                            pupil.grade === 'A'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : pupil.grade === 'B'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : pupil.grade === 'C'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}
                        >
                          Grade {pupil.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {pupil.grade === 'A' && 'Ufaulu Bora Sana'}
                        {pupil.grade === 'B' && 'Ufaulu Mzuri'}
                        {pupil.grade === 'C' && 'Wastani wa Kuridhisha'}
                        {pupil.grade === 'D' && 'Anahitaji Masomo ya Ziada'}
                        {pupil.grade === 'F' && 'Uangalizi Maalum'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* WORKSPACE VIEW: DAILY ROLL-CALL ATTENDANCE */}
        {/* =================================================================== */}
        {activeTab === 'ATTENDANCE' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Rejista ya Mahudhurio ya Kila Siku ({selectedClass})
                </h3>
                <p className="text-xs text-slate-500">
                  Weka alama nani yupo (Present), hayupo (Absent), au ana ruhusa (Permission). Taarifa hutumwa moja kwa moja kwa Mwalimu wa Nidhamu.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    {Object.keys(pupilsData).map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => triggerNotification('success', 'Mahudhurio Yamewasilishwa', `Roll-call ya ${selectedClass} imethibitishwa na kuhifadhiwa kwenye rejista rasmi ya shule.`)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Wasilisha Mahudhurio</span>
                </button>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Jina la Mwanafunzi</th>
                    <th className="py-3 px-4">Namba ya Usajili</th>
                    <th className="py-3 px-4 text-center">Hali ya Mahudhurio (Bofya Kubadili)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {currentPupils.map((pupil, idx) => (
                    <tr key={pupil.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{pupil.name}</td>
                      <td className="py-3 px-4 font-mono text-emerald-700">{pupil.admNo}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(pupil.id, 'PRESENT')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              pupil.attendance === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Yupo (Present)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(pupil.id, 'ABSENT')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              pupil.attendance === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Hayupo (Absent)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(pupil.id, 'PERMISSION')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              pupil.attendance === 'PERMISSION'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Ruhusa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* WORKSPACE VIEW: TEACHING STAFF ROSTER */}
        {/* =================================================================== */}
        {activeTab === 'STAFF_ROSTER' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Orodha ya Walimu Wote wa Shule ya Msingi
                </h3>
                <p className="text-xs text-slate-500">
                  Orodha kamili ya walimu wote, wakuu wa shule, walimu wa taaluma na nidhamu, na masomo yao.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                {teachersList.length} Walimu
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachersList.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-200">
                      {t.fullName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm block">{t.fullName}</span>
                      <span className="text-[11px] font-mono text-emerald-700">{t.identifier}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Nafasi / Cheo:</span>
                      <span className="font-bold text-emerald-900">
                        {t.role === 'HEADTEACHER' ? 'Mwalimu Mkuu' : t.role === 'ACADEMIC' ? 'Mwl. wa Taaluma' : t.role === 'DISCIPLINE' ? 'Mwl. wa Nidhamu' : 'Class Teacher'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Madarasa:</span>
                      <span className="font-semibold text-slate-700">
                        {t.assignedClasses?.join(', ') || t.assignedClass || 'Shule Nzima'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Masomo Anayofundisha:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {t.subjects?.map((sub, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-semibold">
                          {sub}
                        </span>
                      )) || <span className="text-[10px] text-slate-400">Mtaala wa Msingi</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-emerald-200/80 bg-white/80 py-4 text-center text-xs text-slate-500 mt-auto">
        <p>© {new Date().getFullYear()} PRIMARY &amp; NURSERY SCHOOL • Teacher Leadership &amp; Classroom Portal</p>
      </footer>
    </div>
  );
}
