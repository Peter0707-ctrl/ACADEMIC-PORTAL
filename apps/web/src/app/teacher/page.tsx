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

  const roleGreeting =
    currentUser?.role === 'HEADTEACHER'
      ? 'Welcome Head Teacher (Karibu Mwalimu Mkuu)'
      : currentUser?.role === 'ACADEMIC'
      ? 'Welcome Academic Master (Karibu Mwalimu wa Taaluma)'
      : currentUser?.role === 'DISCIPLINE'
      ? 'Welcome Discipline Master (Karibu Mwalimu wa Nidhamu)'
      : 'Welcome Teacher (Karibu Mwalimu)';

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
      <div className="space-y-6 animate-fade-in">
        {/* ================================================================= */}
        {/* 1. WELCOME BOX WITH PICTURE OF HEADTEACHER / TEACHER */}
        {/* ================================================================= */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-emerald-700/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Box of Picture of Head Teacher / Teacher */}
            <Link
              href="/teacher/settings"
              title="Wasifu na Picha ya Mwalimu (Badili kwenye Mipangilio)"
              className="relative group shrink-0 block"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-amber-400 p-1 shadow-xl flex flex-col items-center justify-center text-center overflow-hidden group-hover:border-white transition-all">
                <div className="w-full h-full rounded-xl bg-gradient-to-b from-emerald-700 to-teal-900 flex flex-col items-center justify-center text-white relative group-hover:scale-105 transition-transform">
                  <User className="w-9 h-9 sm:w-11 sm:h-11 text-amber-300 drop-shadow" />
                  <span className="text-[8px] font-black text-amber-200 uppercase tracking-widest mt-0.5">
                    {currentUser?.role === 'HEADTEACHER' ? 'Mkuu' : 'Mwalimu'}
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-[9px] shadow-sm uppercase tracking-wide flex items-center gap-1 group-hover:bg-white group-hover:text-emerald-900 transition-colors">
                <Camera className="w-2.5 h-2.5" />
                <span>Picha</span>
              </span>
            </Link>

            {/* Welcoming Message & Details */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-black tracking-wide shadow-xs">
                <span>{roleGreeting}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser?.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px] tracking-wide uppercase">
                  {currentUser?.role === 'HEADTEACHER' ? 'Mwalimu Mkuu' : currentUser?.role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-emerald-100 font-mono text-[10px] font-bold border border-emerald-500/50">
                  {currentUser?.identifier}
                </span>
              </div>

              <p className="text-xs text-emerald-100/90 flex flex-wrap items-center gap-2">
                <span>{currentUser?.email}</span>
                <span>•</span>
                <span>{currentUser?.phone}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            {currentUser?.role === 'HEADTEACHER' && (
              <Link
                href="/teacher/approvals"
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-emerald-950" />
                <span>Idhinisha Matokeo na Muhuri</span>
              </Link>
            )}
            <Link
              href="/teacher/marks"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Weka Alama za Masomo Yangu</span>
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. CLASSES TAUGHT & ADD ANOTHER CLASS INTERACTIVE SECTION */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-black text-slate-900">
                  Madarasa Ninayofundisha (Classes I Teach)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                  {teachingClasses.length} Madarasa
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Orodha ya madarasa unayofundisha muhula huu. Unaweza kuongeza darasa lingine wakati wowote ili kuweka alama na mahudhurio.
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
        {/* 3. EXECUTIVE KEY METRICS SUMMARY */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Broadsheet Approval Status */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Muhuri wa Matokeo
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  hasApprovedTermResults ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-lg font-black text-slate-900 block">
                {hasApprovedTermResults ? 'YAMEIDHINISHWA' : 'YANASUBIRI IDHINI'}
              </span>
              <span
                className={`text-[11px] font-semibold block mt-0.5 ${
                  hasApprovedTermResults ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {hasApprovedTermResults ? `Saini: ${approvalTimestamp}` : 'Muhula wa 1 Broadsheet ipo tayari'}
              </span>
            </div>
            <Link
              href="/teacher/approvals"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
            >
              <span>{hasApprovedTermResults ? 'Tazama Muhuri Rasmi' : 'Idhinisha Broadsheet'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Teaching Responsibilities */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ufundishaji Wangu
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 block">{teachingClasses.length} Madarasa</span>
              <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">
                {teachingClasses.join(', ')}
              </span>
            </div>
            <Link
              href="/teacher/marks"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
            >
              <span>Jaza Alama za Masomo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Card 3: NECTA Candidates */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Watahiniwa wa Taifa
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 block">190 Watahiniwa</span>
              <span className="text-[11px] font-semibold text-purple-700 block mt-0.5">
                86 PSLE (Std 7) • 104 SFNA (Std 4)
              </span>
            </div>
            <Link
              href="/teacher/candidates"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
            >
              <span>Fuatilia Watahiniwa</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Card 4: Daily School Attendance */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mahudhurio ya Shule
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 block">97.6% Leo</span>
              <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                Madarasa yote yameshatuma roll-call
              </span>
            </div>
            <Link
              href="/teacher/attendance"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
            >
              <span>Tazama Roll-Call Zote</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>



        {/* ================================================================= */}
        {/* 5. EXECUTIVE DIRECT ACTION MODULES GRID */}
        {/* ================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Njia za Haraka za Kazi (Quick Modules):
            </h2>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Ofisi Kuu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Idhini ya Matokeo */}
            {currentUser?.role === 'HEADTEACHER' && (
              <Link
                href="/teacher/approvals"
                className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
                    Mkuu Pekee
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                    Idhini ya Matokeo &amp; Muhuri
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    Kagua broadsheet nzima ya shule, weka Muhuri Rasmi wa Kidigitali, panga tarehe ya matokeo, na tuma masijala.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <span>Fungua Idhini</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}

            {/* 2. Kujaza Alama za Masomo Yangu */}
            <Link
              href="/teacher/marks"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full">
                  Madarasa {teachingClasses.length}
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Kujaza Alama za Masomo Yangu
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Ingiza alama za masomo yako kwa kutumia Excel au jedwali la moja kwa moja, kisha wasilisha kwa Taaluma.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Jedwali la Alama</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Attendance */}
            <Link
              href="/teacher/attendance"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Kila Siku
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Attendance
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Tazama na rekodi attendance ya kila siku kwa madarasa unayofundisha, na uwasilishe kwa Mkuu na Nidhamu.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Attendance</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Broadsheet ya Shule Nzima */}
            <Link
              href="/teacher/broadsheet"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-900 border border-teal-200 px-2 py-0.5 rounded-full">
                  NECTA / Broadsheet
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Broadsheet ya Shule Nzima
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Uchambuzi kamili wa masomo yote, wastani, madaraja (A-F), mgawanyo wa alama na ukaguzi wa mfumo.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Broadsheet</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 5. Walimu Wangu (Staff Directory) */}
            <Link
              href="/teacher/staff"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-full">
                  Walimu Pekee
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Walimu Wangu (Teaching Staff)
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Orodha ya walimu unaowasimamia shuleni bila kuchanganywa na watumiaji wengine.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Tazama Orodha ya Walimu</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 6. Mipangilio & Wasifu */}
            <Link
              href="/teacher/settings"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Wasifu Wangu
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Mipangilio &amp; Wasifu
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Hariri taarifa zako za kibinafsi, weka PIN ya siri ya kuidhinisha matokeo, na mipangilio ya taarifa za SMS.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Mipangilio</span>
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
