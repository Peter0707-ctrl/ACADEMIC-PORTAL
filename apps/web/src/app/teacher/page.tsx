'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
  UserCheck,
  Shield,
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  Printer,
  Sparkles,
  Settings,
  AlertCircle,
  Plus,
  Trash2,
  X,
  GraduationCap,
  User,
  Camera,
  ListTodo,
  Bell,
  Layers,
  MessageSquare,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import {
  getCurrentSession,
  setCurrentSession,
  getStoredAccounts,
  saveStoredAccounts,
  INITIAL_BLUEPRINT_ACCOUNTS,
  UserAccount,
} from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

const STORAGE_APPROVAL_KEY = 'headteacher_results_approval_status_v1';
const STORAGE_RECORDS_KEY = 'school_records_documents_v1';

const ALL_PRIMARY_CLASSES = [
  'Standard 7 (Grade 7)',
  'Standard 6 (Grade 6)',
  'Standard 5 (Grade 5)',
  'Standard 4 (Grade 4)',
  'Standard 3 (Grade 3)',
  'Standard 2 (Grade 2)',
  'Standard 1 (Grade 1)',
  'Pre-Unit / Kindergarten',
  'Nursery & Day Care',
];

const ALL_PRIMARY_SUBJECTS = [
  'Civic & Moral Education (Uraia na Maadili)',
  'Social Studies (Maarifa ya Jamii)',
  'Mathematics (Hisabati)',
  'English Language',
  'Kiswahili',
  'Science & Technology (Sayansi)',
  'Vocational Skills (Stadi za Kazi)',
  'Religious Studies (Elimu ya Dini)',
  'ICT / Computer Studies (Tehama)',
];

export default function TeacherDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_BLUEPRINT_ACCOUNTS[0] || null);
  const [teachingClasses, setTeachingClasses] = useState<string[]>(
    INITIAL_BLUEPRINT_ACCOUNTS[0]?.assignedClasses || ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)']
  );

  // Modal State for adding another class to teach
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newSelectedClass, setNewSelectedClass] = useState<string>('Standard 5 (Grade 5)');
  const [newSelectedSubject, setNewSelectedSubject] = useState<string>('Mathematics (Hisabati)');

  const [hasApprovedTermResults, setHasApprovedTermResults] = useState(false);
  const [approvalTimestamp, setApprovalTimestamp] = useState<string | null>(null);
  const [resultsReleaseDate, setResultsReleaseDate] = useState<string>('2026-03-27');
  const [resultsReleaseTime, setResultsReleaseTime] = useState<string>('08:00');
  const [sealCertNumber, setSealCertNumber] = useState<string>('VER-2026-HT-08492');

  // Load existing session and approval from storage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      const classes = session.assignedClasses && session.assignedClasses.length > 0
        ? session.assignedClasses
        : ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)'];
      setTeachingClasses(classes);
    }

    try {
      const stored = localStorage.getItem(STORAGE_APPROVAL_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHasApprovedTermResults(Boolean(parsed.hasApproved));
        setApprovalTimestamp(parsed.approvalTimestamp || null);
        setResultsReleaseDate(parsed.resultsReleaseDate || '2026-03-27');
        setResultsReleaseTime(parsed.resultsReleaseTime || '08:00');
        setSealCertNumber(parsed.sealCertNumber || 'VER-2026-HT-08492');
      }
    } catch {}
  }, []);

  // Handler: Add Another Class to Teach
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (teachingClasses.includes(newSelectedClass)) {
      notifyUser('warning', 'Darasa Lipo Tayari', `${newSelectedClass} tayari lipo kwenye orodha ya madarasa unayofundisha.`);
      return;
    }

    const updatedClasses = [...teachingClasses, newSelectedClass];
    const currentSubjects = currentUser.subjects || [];
    const updatedSubjects = currentSubjects.includes(newSelectedSubject)
      ? currentSubjects
      : [...currentSubjects, newSelectedSubject];

    const updatedUser: UserAccount = {
      ...currentUser,
      assignedClasses: updatedClasses,
      assignedClass: updatedClasses.join(', '),
      subjects: updatedSubjects,
    };

    setCurrentUser(updatedUser);
    setTeachingClasses(updatedClasses);
    setCurrentSession(updatedUser);

    // Save to stored accounts
    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    setShowAddClassModal(false);
    notifyUser(
      'success',
      'Darasa Limeongezwa Kikamilifu',
      `${newSelectedClass} sasa limeongezwa kwenye ratiba yako ya ufundishaji.`
    );
  };

  // Handler: Remove Class from teaching schedule
  const handleRemoveClass = (clsToRemove: string) => {
    if (!currentUser) return;
    if (teachingClasses.length <= 1) {
      notifyUser('warning', 'Kizuizi', 'Lazima ubakiwe na angalau darasa moja unalofundisha.');
      return;
    }

    const updatedClasses = teachingClasses.filter((c) => c !== clsToRemove);
    const updatedUser: UserAccount = {
      ...currentUser,
      assignedClasses: updatedClasses,
      assignedClass: updatedClasses.join(', '),
    };

    setCurrentUser(updatedUser);
    setTeachingClasses(updatedClasses);
    setCurrentSession(updatedUser);

    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    notifyUser('info', 'Darasa Limeondolewa', `${clsToRemove} limeondolewa kwenye madarasa unayofundisha.`);
  };

  // Quick Approve Term 1 Results with Official Digital Seal
  const handleApproveWithSeal = () => {
    const stampTime = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const certNo = `VER-2026-HT-${Math.floor(10000 + Math.random() * 90000)}`;

    setHasApprovedTermResults(true);
    setApprovalTimestamp(stampTime);
    setSealCertNumber(certNo);

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        STORAGE_APPROVAL_KEY,
        JSON.stringify({
          hasApproved: true,
          approvalTimestamp: stampTime,
          resultsReleaseDate,
          resultsReleaseTime,
          sealCertNumber: certNo,
        })
      );

      // Save to Records Archive
      try {
        const existingRaw = localStorage.getItem(STORAGE_RECORDS_KEY);
        const list = existingRaw ? JSON.parse(existingRaw) : [];
        const newDoc = {
          id: 'doc-sealed-results-2026-term1',
          title: 'Matokeo Rasmi ya Muhula wa 1, 2026 (Yaliyoidhinishwa na Mkuu)',
          category: 'EXAMINATIONS_RESULTS',
          referenceNumber: certNo,
          dateCreated: stampTime,
          releaseDate: resultsReleaseDate,
          sealedBy: currentUser?.fullName || 'Mwl. Augustine Mrosso',
          status: 'OFFICIAL_ARCHIVED',
        };
        const filtered = list.filter((d: any) => d.id !== newDoc.id);
        filtered.unshift(newDoc);
        localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(filtered));
      } catch {}
    }

    notifyUser(
      'success',
      'Muhuri Rasmi Umewekwa & Matokeo Yameidhinishwa!',
      `Mwalimu Mkuu ameidhinisha broadsheet ya shule na kuweka Muhuri Rasmi (${stampTime}). Cheti: ${certNo}.`
    );
  };

  const currentHour = new Date().getHours();
  const timeGreetingSwahili =
    currentHour < 12
      ? 'Habari za Asubuhi'
      : currentHour < 16
      ? 'Habari za Mchana'
      : 'Habari za Jioni';
  const timeGreetingEnglish =
    currentHour < 12
      ? 'Good Morning'
      : currentHour < 16
      ? 'Good Afternoon'
      : 'Good Evening';

  const roleTitleSwahili =
    currentUser?.role === 'HEADTEACHER'
      ? 'Mwalimu Mkuu'
      : currentUser?.role === 'ACADEMIC'
      ? 'Mwalimu wa Taaluma'
      : currentUser?.role === 'DISCIPLINE'
      ? 'Mwalimu wa Nidhamu'
      : 'Mwalimu wa Darasa';

  const roleTitleEnglish =
    currentUser?.role === 'HEADTEACHER'
      ? 'Head Teacher'
      : currentUser?.role === 'ACADEMIC'
      ? 'Academic Master'
      : currentUser?.role === 'DISCIPLINE'
      ? 'Discipline Master'
      : 'Class Teacher';

  const shellTitle =
    currentUser?.role === 'HEADTEACHER'
      ? "Dashibodi ya Mwalimu Mkuu (Headmaster's Executive Dashboard)"
      : currentUser?.role === 'ACADEMIC'
      ? "Dashibodi ya Taaluma (Academic Master's Dashboard)"
      : currentUser?.role === 'DISCIPLINE'
      ? "Dashibodi ya Nidhamu (Discipline Master's Dashboard)"
      : "Dashibodi ya Mwalimu (Teacher's Dashboard)";

  const shellDesc =
    currentUser?.role === 'HEADTEACHER'
      ? "Ofisi ya Mkuu wa Shule: Usimamizi mkuu wa ufundishaji, idhini ya matokeo kwa muhuri rasmi, ufuatiliaji wa walimu na mahudhurio ya shule."
      : "Usimamizi wa masomo na madarasa, uwekaji wa alama za mitihani, mahudhurio ya wanafunzi na mawasiliano ya kitaaluma.";

  return (
    <TeacherShell
      pageTitle={shellTitle}
      pageDescription={shellDesc}
    >
      <div className="space-y-7 animate-fade-in">
        {/* ================================================================= */}
        {/* 1. TEACHER HERO: FRAMELESS PICTURE, ROLE & TIME SALUTATION */}
        {/* ================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-2">
          <div className="flex items-center gap-5">
            {/* Frameless Picture / Avatar (NO frame, NO border) */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-200" />
            </div>

            {/* Salutation, Name & Details */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 block">
                {timeGreetingSwahili}, {roleTitleSwahili} • {timeGreetingEnglish}, {roleTitleEnglish}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentUser?.fullName || 'Mwl. Augustine Mrosso'}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[10px] uppercase tracking-wide">
                  {roleTitleSwahili}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {currentUser?.identifier || 'HT-2026-001'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-600">
                  {currentUser?.email || 'headteacher@primaryschool.ac.tz'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-600">
                  {currentUser?.phone || '+255 754 112 233'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {currentUser?.role === 'HEADTEACHER' && (
              <Link
                href="/teacher/approvals"
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-emerald-950" />
                <span>Idhinisha Matokeo na Muhuri</span>
              </Link>
            )}
            <Link
              href="/teacher/marks"
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Weka Alama za Masomo Yangu</span>
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. DASHBOARD OVERVIEW: SUMMARY CARDS (MAIN TEACHER HIGHLIGHTS) */}
        {/* ================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* My Classes */}
          <Link
            href="/teacher/classes"
            className="p-4 rounded-2xl bg-white border border-emerald-200/90 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-700">
              <Users className="w-4 h-4 text-emerald-700" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classes</span>
            </div>
            <div className="mt-2">
              <span className="text-xl font-black text-slate-900 block">{teachingClasses.length} Madarasa</span>
              <span className="text-[11px] font-semibold text-slate-500 block truncate">{teachingClasses.join(', ')}</span>
            </div>
          </Link>

          {/* Number of Pupils */}
          <Link
            href="/teacher/classes"
            className="p-4 rounded-2xl bg-white border border-emerald-200/90 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-700">
              <GraduationCap className="w-4 h-4 text-blue-700" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pupils</span>
            </div>
            <div className="mt-2">
              <span className="text-xl font-black text-slate-900 block">50 Wanafunzi</span>
              <span className="text-[11px] font-semibold text-blue-700 block">Std 6: 35 • Std 7: 15</span>
            </div>
          </Link>

          {/* Today's Lessons */}
          <Link
            href="/teacher/curriculum"
            className="p-4 rounded-2xl bg-white border border-emerald-200/90 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-700">
              <Clock className="w-4 h-4 text-amber-700" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today</span>
            </div>
            <div className="mt-2">
              <span className="text-xl font-black text-slate-900 block">4 Vipindi Leo</span>
              <span className="text-[11px] font-semibold text-amber-700 block">P1, P2, P4, P6</span>
            </div>
          </Link>

          {/* Pending Tasks */}
          <Link
            href="/teacher/assignments"
            className="p-4 rounded-2xl bg-white border border-emerald-200/90 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-700">
              <ListTodo className="w-4 h-4 text-purple-700" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tasks</span>
            </div>
            <div className="mt-2">
              <span className="text-xl font-black text-slate-900 block">4 Majukumu</span>
              <span className="text-[11px] font-semibold text-purple-700 block">Roll-Call, Marks, Plan</span>
            </div>
          </Link>

          {/* Notifications */}
          <Link
            href="/teacher/communication"
            className="p-4 rounded-2xl bg-white border border-emerald-200/90 hover:border-emerald-500 hover:shadow-md transition-all group col-span-2 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between text-slate-400 group-hover:text-rose-700">
              <Bell className="w-4 h-4 text-rose-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alerts</span>
            </div>
            <div className="mt-2">
              <span className="text-xl font-black text-slate-900 block">3 Matangazo</span>
              <span className="text-[11px] font-semibold text-rose-700 block">Taaluma &amp; Wizara</span>
            </div>
          </Link>
        </div>

        {/* ================================================================= */}
        {/* 3. MY CLASSES (MADARASA NINAYOFUNDISHA & WANAFUNZI) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-black text-slate-900">
                  My Classes (Madarasa Ninayofundisha)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                  {teachingClasses.length} Madarasa
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Orodha ya madarasa unayofundisha, idadi ya wanafunzi, wasifu wa mwanafunzi na wastani wa ufaulu.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddClassModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ongeza Darasa Lingine (Add Class)</span>
            </button>
          </div>

          {/* Cards for each class taught */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teachingClasses.map((cls) => (
              <div
                key={cls}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/90 flex items-center justify-between gap-3 group hover:border-emerald-400 transition-all shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    <GraduationCap className="w-5 h-5 text-emerald-100" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{cls}</h3>
                    <span className="text-[11px] text-emerald-800 font-semibold block">
                      {cls.includes('6') ? '35 Wanafunzi' : cls.includes('7') ? '15 Wanafunzi' : 'Wanafunzi Wamesajiliwa'} • {currentUser?.subjects?.join(', ') || 'Uraia na Maadili'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/teacher/marks?class=${encodeURIComponent(cls)}`}
                    className="p-1.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                    title="Jaza alama au sajili wanafunzi wa darasa hili"
                  >
                    Alama &rarr;
                  </Link>
                  {teachingClasses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(cls)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Ondoa darasa hili"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. TODAY'S LESSONS & PENDING TASKS & NOTIFICATIONS */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Today's Lessons Schedule */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <h2 className="text-sm font-black text-slate-900">
                  Today&apos;s Lessons (Vipindi vya Leo)
                </h2>
              </div>
              <Link
                href="/teacher/curriculum"
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900"
              >
                Ratiba Yote &rarr;
              </Link>
            </div>

            <div className="space-y-2.5">
              {/* Period 1 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                    P1
                  </span>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      Mathematics (Hisabati) • Standard 6
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      08:00 - 08:40 • Mada: Sehemu na Desimali
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                  Plan Tayari
                </span>
              </div>

              {/* Period 2 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                    P2
                  </span>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      Science &amp; Technology • Standard 6
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      08:40 - 09:20 • Mada: Mfumo wa Upumuaji
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                  Plan Tayari
                </span>
              </div>

              {/* Period 4 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                    P4
                  </span>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      Civic &amp; Moral • Standard 7
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      10:20 - 11:00 • Mada: Haki na Wajibu wa Raia
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                  Plan Tayari
                </span>
              </div>

              {/* Period 6 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                    P6
                  </span>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">
                      Mathematics (Hisabati) • Standard 7
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      12:00 - 12:40 • Mada: Jiometria na Eneo
                    </span>
                  </div>
                </div>
                <Link
                  href="/teacher/curriculum"
                  className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] hover:bg-amber-200 shrink-0"
                >
                  + Andaa Plan
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Pending Tasks & Notifications */}
          <div className="space-y-6">
            {/* Pending Tasks */}
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-purple-700" />
                  <h2 className="text-sm font-black text-slate-900">
                    Pending Tasks (Majukumu Yanayosubiri)
                  </h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                  4 Majukumu
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800">
                    Wasilisha Roll-Call ya Mahudhurio ya Leo (Standard 6)
                  </span>
                  <Link
                    href="/teacher/attendance"
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 shrink-0"
                  >
                    Fanya &rarr;
                  </Link>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800">
                    Weka Alama za Continuous Assessment (Majaribio ya Machi)
                  </span>
                  <Link
                    href="/teacher/marks"
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 shrink-0"
                  >
                    Fanya &rarr;
                  </Link>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800">
                    Sahihisha Kazi 3 za Mazoezi ya Wanafunzi (Assignments)
                  </span>
                  <Link
                    href="/teacher/assignments"
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 shrink-0"
                  >
                    Fanya &rarr;
                  </Link>
                </div>

                <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800">
                    Andaa Andiko la Somo (Lesson Plan) la Jiometria — Std 7
                  </span>
                  <Link
                    href="/teacher/curriculum"
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 shrink-0"
                  >
                    Fanya &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-rose-600" />
                  <h2 className="text-sm font-black text-slate-900">
                    Notifications (Matangazo ya Shule)
                  </h2>
                </div>
                <Link
                  href="/teacher/communication"
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900"
                >
                  Tazama Yote &rarr;
                </Link>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs">
                  <span className="font-bold text-rose-950 block">Taaluma: Uwasilishaji wa Alama za Machi</span>
                  <span className="text-slate-600 block mt-0.5">Walimu wote mnatakiwa kuwasilisha alama kabla ya Ijumaa saa 10:00 jioni.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                  <span className="font-bold text-amber-950 block">Mkuu wa Shule: Kikao cha Wafanyakazi Wote</span>
                  <span className="text-slate-600 block mt-0.5">Kikao kitafanyika Jumatatu saa 8:00 mchana ukumbini kuhusu mitihani ya Nusu Muhula.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 5. PRIMARY SCHOOL TEACHER WORKSPACE MODULES (10 CORE MODULES)     */}
        {/* ================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Primary School Teacher Workspace Modules
              </h2>
              <p className="text-xs text-slate-500">
                Moduli zote za msingi kwa walimu wote (ikijumuisha Mkuu wa Shule, Taaluma na Nidhamu).
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
              Moduli Rasmi 10
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. My Classes */}
            <Link
              href="/teacher/classes"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Std 1–7
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    My Classes (Madarasa Yangu)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Standard 1–7 class assigned, pupils in each class, pupil profiles na class performance.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Madarasa</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. My Subjects */}
            <Link
              href="/teacher/subjects"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full">
                    Syllabus
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    My Subjects (Masomo Yangu)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Subjects assigned to teacher, subject pupils, and subject syllabus progress.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Masomo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Attendance */}
            <Link
              href="/teacher/attendance"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-teal-50 text-teal-900 border border-teal-200 px-2 py-0.5 rounded-full">
                    Daily Roll-Call
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    Attendance (Mahudhurio)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Mark today&apos;s attendance (Present, Absent, Late), attendance history and monthly summary.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Mahudhurio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Lesson Plans */}
            <Link
              href="/teacher/curriculum"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
                    MoEST Format
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    Lesson Plans (Maandalio ya Somo)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Create lesson plan, today&apos;s lesson, upcoming lessons, topic/subtopic, learning objectives &amp; activities.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Lesson Plans</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 5. Assignments / Class Activities */}
            <Link
              href="/teacher/assignments"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded-full">
                    Mazoezi
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    Assignments / Class Activities
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Create activity/assignment, view pupil submissions, mark/review work, and record performance.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Mazoezi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 6. Assessment & Marks */}
            <Link
              href="/teacher/marks"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-full">
                    12 Months Calendar
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    Assessment &amp; Marks (Uwekaji Alama)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter continuous assessment marks, edit marks before submission, download/upload Excel, and submit results.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Jedwali la Alama</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 7. Pupil Performance */}
            <Link
              href="/teacher/performance"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-900 border border-rose-200 px-2 py-0.5 rounded-full">
                    Ufaulu &amp; Wastani
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    Pupil Performance (Tathmini ya Ufaulu)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Individual pupil performance, subject performance, class average, and pupils needing academic attention.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Tathmini</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 8. School Communication */}
            <Link
              href="/teacher/communication"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-cyan-50 text-cyan-900 border border-cyan-200 px-2 py-0.5 rounded-full">
                    SMS &amp; Chat
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    School Communication (Mawasiliano)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    School announcements, messages, and authorized parent communication regarding academic status.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Mawasiliano</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 9. Profile & Settings */}
            <Link
              href="/teacher/settings"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-full">
                    Wasifu &amp; Ratiba
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    Profile &amp; Settings (Wasifu &amp; Ratiba)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Teacher profile, assigned class and subjects, weekly timetable, phone, and account settings.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Wasifu</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 6. EXECUTIVE LEADERSHIP TOOLS (FOR HEADTEACHER, ACADEMIC, DISCIPLINE) */}
        {/* ================================================================= */}
        <div className="space-y-4 pt-4 border-t border-emerald-100">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Zana za Uongozi wa Shule (Executive Leadership Tools)
              </h2>
              <p className="text-xs text-slate-500">
                Vipengele vya Utawala, Uidhinishaji wa Matokeo, Broadsheet na Watahiniwa wa Taifa.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
              Ofisi Kuu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Results Approval & Seal */}
            <Link
              href="/teacher/approvals"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
                    Idhini &amp; Muhuri
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    Idhini ya Matokeo na Muhuri Rasmi
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Kagua broadsheet ya shule nzima, weka Muhuri Rasmi wa Kidigitali, na panga tarehe ya kutangaza matokeo.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Idhini</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* School Broadsheet */}
            <Link
              href="/teacher/broadsheet"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full">
                    Shule Nzima
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    Broadsheet ya Shule Nzima
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Uchambuzi kamili wa masomo yote, wastani, madaraja (A–F), mgawanyo wa alama na takwimu za ufaulu.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Broadsheet</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* NECTA Candidates */}
            <Link
              href="/teacher/candidates"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-full">
                    PSLE &amp; SFNA
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    Watahiniwa wa Taifa (NECTA)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Watahiniwa 190 waliosajiliwa (Darasa la 4 SFNA &amp; Darasa la 7 PSLE) na ufuatiliaji wa maandalizi.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fuatilia Watahiniwa</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 6. ADD CLASS MODAL (UNIVERSALLY AVAILABLE TO ALL TEACHERS) */}
        {/* ================================================================= */}
        {showAddClassModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-emerald-200 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Ongeza Darasa la Kufundisha</h3>
                    <p className="text-[11px] text-slate-500">Chagua darasa na somo unalotaka kufundisha</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Chagua Darasa (Class):
                  </label>
                  <select
                    value={newSelectedClass}
                    onChange={(e) => setNewSelectedClass(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  >
                    {ALL_PRIMARY_CLASSES.map((c) => (
                      <option key={c} value={c} disabled={teachingClasses.includes(c)}>
                        {c} {teachingClasses.includes(c) ? '(Tayari Lipo)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Chagua Somo Unalofundisha Katika Darasa Hili:
                  </label>
                  <select
                    value={newSelectedSubject}
                    onChange={(e) => setNewSelectedSubject(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  >
                    {ALL_PRIMARY_SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Hifadhi Darasa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
