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

  // Active Workspace Tab: 'MARKS' | 'ATTENDANCE' | 'STAFF_ROSTER'
  const [activeTab, setActiveTab] = useState<'MARKS' | 'ATTENDANCE' | 'STAFF_ROSTER'>('MARKS');

  // Active Selected Class & Subject
  const [selectedClass, setSelectedClass] = useState<string>('Standard 5 (Grade 5)');
  const [selectedSubject, setSelectedSubject] = useState<string>('English Language');

  // Marks & Attendance State
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

    // If no active session, default to first demo teacher (Mwl. Sarah Mollel) for immediate testing
    if (!session) {
      const defaultTeacher = accounts.find((a) => a.role === 'TEACHER') || accounts[4];
      setCurrentSession(defaultTeacher);
      session = defaultTeacher;
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
    } else if (session.assignedClass) {
      setSelectedClass(session.assignedClass);
    }

    if (session.subjects && session.subjects.length > 0) {
      setSelectedSubject(session.subjects[0]);
    }
  }, [triggerNotification]);

  // Switch Teacher Identity (For testing different teachers)
  const handleSwitchTeacher = (teacher: UserAccount) => {
    setCurrentSession(teacher);
    setCurrentUser(teacher);

    if (teacher.assignedClasses && teacher.assignedClasses.length > 0) {
      setSelectedClass(teacher.assignedClasses[0]);
    } else if (teacher.assignedClass) {
      setSelectedClass(teacher.assignedClass);
    }

    if (teacher.subjects && teacher.subjects.length > 0) {
      setSelectedSubject(teacher.subjects[0]);
    }

    triggerNotification(
      'success',
      'Teacher Switched',
      `Now logged in as ${teacher.fullName}. Teaching: ${teacher.subjects?.join(', ') || 'General'}`
    );
  };

  // Logout Handler
  const handleLogout = () => {
    clearCurrentSession();
    router.push('/');
  };

  // List of all primary teachers for roster
  const teachersList = useMemo(() => {
    return allAccounts.filter((a) => ['TEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(a.role));
  }, [allAccounts]);

  // Current class pupils
  const currentPupils = useMemo(() => {
    const list = pupilsData[selectedClass] || [];
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
      const classList = [...(prev[selectedClass] || [])];
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
      const classList = [...(prev[selectedClass] || [])];
      const idx = classList.findIndex((p) => p.id === pupilId);
      if (idx !== -1) {
        classList[idx] = { ...classList[idx], attendance: status };
      }
      return { ...prev, [selectedClass]: classList };
    });
  };

  // Class statistics
  const classStats = useMemo(() => {
    const list = pupilsData[selectedClass] || [];
    if (list.length === 0) return { avg: 0, presentCount: 0, passCount: 0 };
    const avg = Math.round(list.reduce((acc, p) => acc + p.mark, 0) / list.length);
    const presentCount = list.filter((p) => p.attendance === 'PRESENT').length;
    const passCount = list.filter((p) => p.mark >= 45).length;
    return { avg, presentCount, passCount };
  }, [pupilsData, selectedClass]);

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
                    Teacher Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Classroom Roll-Call, Marks Entry &amp; Teaching Staff Roster
                </p>
              </div>
            </div>

            {/* Active Teacher Identity & Navigation */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block">{currentUser?.fullName}</span>
                <span className="text-[10px] font-mono text-emerald-700">{currentUser?.identifier}</span>
              </div>

              {/* Admin Link if authorized */}
              {['ADMIN', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(currentUser?.role || '') && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/80 transition-all flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Executive Admin</span>
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

          {/* TEACHER SWITCHER STRIP (To effortlessly test different teachers and their specific subjects) */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Test As Teacher:
            </span>
            {teachersList.map((t) => {
              const isCurrent = currentUser?.id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSwitchTeacher(t)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{t.fullName}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isCurrent ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {t.assignedClasses?.[0]?.replace(' (Grade 5)', '').replace(' (Grade 4)', '') || t.assignedClass || 'Staff'}
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
                {currentUser?.fullName.charAt(0) || 'T'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-800">{currentUser?.fullName}</h2>
                  {currentUser?.isHomeroomMaster && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      Homeroom Class Master
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-0.5">
                  <span className="font-mono text-emerald-800 font-semibold">{currentUser?.identifier}</span>
                  <span>•</span>
                  <span>{currentUser?.email}</span>
                  {currentUser?.phone && (
                    <>
                      <span>•</span>
                      <span>{currentUser?.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Teacher's Allocated Subjects */}
            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Subjects</span>
              <div className="flex flex-wrap gap-1 sm:justify-end mt-1">
                {currentUser?.subjects?.map((sub, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200"
                  >
                    {sub}
                  </span>
                )) || <span className="text-xs text-slate-400">All Primary Subjects</span>}
              </div>
            </div>
          </div>
        </div>

        {/* TAB CONTROLS: MARKS ENTRY, ATTENDANCE, STAFF ROSTER */}
        <div className="flex items-center gap-2 border-b border-emerald-200/80 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('MARKS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'MARKS'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Subject Marks Entry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ATTENDANCE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ATTENDANCE'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Daily Roll-Call Register</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('STAFF_ROSTER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'STAFF_ROSTER'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-emerald-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Teaching Staff Directory ({teachersList.length})</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* WORKSPACE VIEW 1: SUBJECT MARKS ENTRY */}
        {/* =================================================================== */}
        {activeTab === 'MARKS' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            {/* Class & Subject Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Continuous Assessment &amp; Marks Entry
                </h3>
                <p className="text-xs text-slate-500">
                  Enter student assessment marks for your assigned subjects. Grades calculate automatically (NECTA Standard).
                </p>
              </div>

              {/* Class & Subject Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Select Class</label>
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
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Select Subject</label>
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
                      <option value="General Primary">General Primary</option>
                    )}
                  </select>
                </div>

                <div className="self-end">
                  <button
                    type="button"
                    onClick={() => triggerNotification('success', 'Marks Saved', `Student marks for ${selectedClass} (${selectedSubject}) saved successfully and queued for Mwalimu wa Taaluma review.`)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save All Marks</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Class Average</span>
                <span className="text-xl font-black text-emerald-800 block">{classStats.avg}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Pass Rate</span>
                <span className="text-xl font-black text-emerald-800 block">
                  {currentPupils.length > 0 ? Math.round((classStats.passCount / currentPupils.length) * 100) : 0}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Enrolled In Class</span>
                <span className="text-xl font-black text-slate-800 block">{currentPupils.length} Pupils</span>
              </div>
            </div>

            {/* Marks Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Pupil Name</th>
                    <th className="py-3 px-4">Admission No.</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">Score (0 - 100)</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Remarks</th>
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
                        {pupil.grade === 'A' && 'Excellent Performance'}
                        {pupil.grade === 'B' && 'Good Progress'}
                        {pupil.grade === 'C' && 'Satisfactory Effort'}
                        {pupil.grade === 'D' && 'Needs Remedial Support'}
                        {pupil.grade === 'F' && 'Urgent Remedial Attention'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* WORKSPACE VIEW 2: DAILY ROLL-CALL ATTENDANCE */}
        {/* =================================================================== */}
        {activeTab === 'ATTENDANCE' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Daily Primary Roll-Call Register
                </h3>
                <p className="text-xs text-slate-500">
                  Mark daily pupil attendance for {selectedClass}. Attendance alerts are relayed to Mwalimu wa Nidhamu.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  Today: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={() => triggerNotification('success', 'Attendance Submitted', `Roll-call register for ${selectedClass} has been verified and sent to the administration desk.`)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Roll-Call</span>
                </button>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Pupil Name</th>
                    <th className="py-3 px-4">Admission No.</th>
                    <th className="py-3 px-4 text-center">Status (Click to toggle)</th>
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
                            Present
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
                            Absent
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
                            Permission
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
        {/* WORKSPACE VIEW 3: TEACHING STAFF ROSTER (All Teachers in School) */}
        {/* =================================================================== */}
        {activeTab === 'STAFF_ROSTER' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Primary Teaching Staff Directory
                </h3>
                <p className="text-xs text-slate-500">
                  Directory of all active teachers, academic coordinators, and discipline masters in this primary school.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                {teachersList.length} Teaching Staff
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
                      <span className="text-slate-400">Primary Role:</span>
                      <span className="font-bold text-slate-700">{t.role.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Class:</span>
                      <span className="font-semibold text-slate-700">
                        {t.assignedClasses?.join(', ') || t.assignedClass || 'Whole School'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Teaching Subjects:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {t.subjects?.map((sub, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-semibold">
                          {sub}
                        </span>
                      )) || <span className="text-[10px] text-slate-400">General</span>}
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
        <p>© {new Date().getFullYear()} PRIMARY &amp; NURSERY SCHOOL • Teacher Classroom Management</p>
      </footer>
    </div>
  );
}
