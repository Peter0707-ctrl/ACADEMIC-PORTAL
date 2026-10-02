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
  Bell,
  ListTodo,
  CheckSquare,
  Square,
  MessageSquare,
  BarChart3,
  ClipboardList,
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

interface TodayLesson {
  period: number;
  time: string;
  subject: string;
  className: string;
  topic: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  hasLessonPlan: boolean;
}

interface PendingTask {
  id: string;
  title: string;
  category: 'ATTENDANCE' | 'MARKS' | 'LESSON_PLAN' | 'ASSIGNMENT';
  due: string;
  done: boolean;
  link: string;
}

const DEFAULT_TODAY_LESSONS: TodayLesson[] = [
  {
    period: 1,
    time: '08:00 - 08:40',
    subject: 'Mathematics (Hisabati)',
    className: 'Standard 6 (Grade 6)',
    topic: 'Sehemu na Desimali (Fractions & Decimals)',
    status: 'COMPLETED',
    hasLessonPlan: true,
  },
  {
    period: 2,
    time: '08:40 - 09:20',
    subject: 'Science & Technology (Sayansi)',
    className: 'Standard 6 (Grade 6)',
    topic: 'Mfumo wa Upumuaji wa Binadamu',
    status: 'IN_PROGRESS',
    hasLessonPlan: true,
  },
  {
    period: 4,
    time: '10:20 - 11:00',
    subject: 'Civic & Moral Education',
    className: 'Standard 7 (Grade 7)',
    topic: 'Haki na Wajibu wa Raia wa Tanzania',
    status: 'UPCOMING',
    hasLessonPlan: true,
  },
  {
    period: 6,
    time: '12:00 - 12:40',
    subject: 'Mathematics (Hisabati)',
    className: 'Standard 7 (Grade 7)',
    topic: 'Maumbo ya Jiometria na Eneo',
    status: 'UPCOMING',
    hasLessonPlan: false,
  },
];

const DEFAULT_PENDING_TASKS: PendingTask[] = [
  {
    id: 't-01',
    title: 'Wasilisha Roll-Call ya Mahudhurio ya Leo (Standard 6)',
    category: 'ATTENDANCE',
    due: 'Kabla ya 09:00 Asubuhi',
    done: true,
    link: '/teacher/attendance',
  },
  {
    id: 't-02',
    title: 'Weka Alama za Majaribio ya Mwezi wa Machi (Continuous Assessment)',
    category: 'MARKS',
    due: 'Ijumaa, 27 Machi 2026',
    done: false,
    link: '/teacher/marks',
  },
  {
    id: 't-03',
    title: 'Sahihisha Kazi 3 za Mazoezi ya Sehemu (Decimals Homework)',
    category: 'ASSIGNMENT',
    due: 'Leo, 16:00 Jioni',
    done: false,
    link: '/teacher/assignments',
  },
  {
    id: 't-04',
    title: 'Andaa Andiko la Somo (Lesson Plan) la Jiometria — Std 7 Kipindi cha 6',
    category: 'LESSON_PLAN',
    due: 'Leo, 11:30 Asubuhi',
    done: false,
    link: '/teacher/curriculum',
  },
];

export default function TeacherDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_BLUEPRINT_ACCOUNTS[0] || null);
  const [teachingClasses, setTeachingClasses] = useState<string[]>(
    INITIAL_BLUEPRINT_ACCOUNTS[0]?.assignedClasses || ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)']
  );

  const [todayLessons, setTodayLessons] = useState<TodayLesson[]>(DEFAULT_TODAY_LESSONS);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>(DEFAULT_PENDING_TASKS);

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

  // Toggle task done
  const handleToggleTask = (taskId: string) => {
    setPendingTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  };

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

  // Dynamic pupil count
  const totalPupilsTaught = teachingClasses.reduce((acc, c) => {
    if (c.includes('7')) return acc + 15;
    if (c.includes('6')) return acc + 35;
    if (c.includes('5')) return acc + 32;
    if (c.includes('4')) return acc + 40;
    return acc + 30;
  }, 0);

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
    "Primary School Teacher Portal: Madarasa uliyopangiwa (Standard 1–7), vipindi vya leo, majukumu yanayosubiri, matangazo ya shule na tathmini ya matokeo.";

  return (
    <TeacherShell pageTitle={shellTitle} pageDescription={shellDesc}>
      <div className="space-y-6 animate-fade-in">
        {/* ================================================================= */}
        {/* 1. WELCOME BOX WITH PICTURE OF TEACHER / HEADTEACHER */}
        {/* ================================================================= */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-emerald-700/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
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
                <span>•</span>
                <span className="font-bold text-amber-300">{teachingClasses.join(', ')}</span>
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
        {/* 2. DASHBOARD OVERVIEW: THE 5 REQUIRED TEACHER CORE CARDS */}
        {/*    (My Class/Classes, Number of Pupils, Today's Lessons, Pending Tasks, Notifications) */}
        {/* ================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Dashboard Overview (Muhtasari wa Mwalimu):
            </h2>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Primary School Dashboard
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. My Class / Classes */}
            <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  My Classes (Madarasa Yangu)
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 block">{teachingClasses.length} Madarasa</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {teachingClasses.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      {c.split(' ')[0] + ' ' + c.split(' ')[1]}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href="/teacher/classes"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
              >
                <span>Tazama Orodha ya Madarasa</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* 2. Number of Pupils */}
            <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Number of Pupils (Wanafunzi)
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 block">{totalPupilsTaught} Wanafunzi</span>
                <span className="text-[11px] font-semibold text-blue-700 block mt-0.5">
                  Wameandikishwa katika madarasa yako yote
                </span>
              </div>
              <Link
                href="/teacher/attendance"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
              >
                <span>Chukua Mahudhurio Leo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* 3. Today's Lessons Quick Count */}
            <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Today&apos;s Lessons (Vipindi Leo)
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 block">
                  {todayLessons.length} Vipindi
                </span>
                <span className="text-[11px] font-semibold text-amber-700 block mt-0.5">
                  {todayLessons.filter((l) => l.status === 'COMPLETED').length} Vimekamilika •{' '}
                  {todayLessons.filter((l) => l.status === 'UPCOMING').length} Vimebaki
                </span>
              </div>
              <Link
                href="/teacher/curriculum"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
              >
                <span>Ratiba &amp; Lesson Plans</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* 4. Pending Tasks Summary */}
            <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pending Tasks (Majukumu)
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ListTodo className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 block">
                  {pendingTasks.filter((t) => !t.done).length} Yanayosubiri
                </span>
                <span className="text-[11px] font-semibold text-purple-700 block mt-0.5">
                  {pendingTasks.filter((t) => t.done).length} kati ya {pendingTasks.length} zimekamilika leo
                </span>
              </div>
              <a
                href="#pending-tasks-section"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 group"
              >
                <span>Tazama Orodha ya Kazi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. TODAY'S LESSONS & PENDING TASKS DUAL INTERACTIVE WIDGETS */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Lessons Schedule */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Today&apos;s Lessons (Vipindi vya Leo)
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Ratiba ya Leo
              </span>
            </div>

            <div className="space-y-2.5">
              {todayLessons.map((lesson) => (
                <div
                  key={lesson.period}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    lesson.status === 'IN_PROGRESS'
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
                      : lesson.status === 'COMPLETED'
                      ? 'bg-slate-50/80 border-slate-200 opacity-80'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center text-[10px] font-black shrink-0 ${
                        lesson.status === 'IN_PROGRESS'
                          ? 'bg-amber-400 text-emerald-950'
                          : lesson.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>P{lesson.period}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900">{lesson.subject}</h4>
                        <span className="text-[10px] font-bold text-slate-500">• {lesson.className}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate max-w-[220px] sm:max-w-xs">
                        Mada: {lesson.topic}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">{lesson.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {lesson.hasLessonPlan ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Lesson Plan Tayari
                      </span>
                    ) : (
                      <Link
                        href="/teacher/curriculum"
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                      >
                        + Andaa Plan
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Kipindi kinachofuata: Kipindi cha 4 (Std 7)</span>
              <Link
                href="/teacher/curriculum"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <span>Fungua Maandalio ya Masomo (Lesson Plans)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pending Tasks & Action Checklist */}
          <div id="pending-tasks-section" className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Pending Tasks (Majukumu Yanayosubiri)
                </h3>
              </div>
              <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                To-Do Checklist
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    task.done
                      ? 'bg-slate-50 border-slate-200 line-through text-slate-400'
                      : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  <button type="button" className="mt-0.5 text-emerald-700 shrink-0">
                    {task.done ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold leading-snug ${task.done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      Mwisho: {task.due}
                    </span>
                  </div>

                  <Link
                    href={task.link}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-lg hover:bg-emerald-50 text-emerald-700 text-xs font-bold shrink-0"
                    title="Fungua ukurasa wa kazi hii"
                  >
                    Fanya &rarr;
                  </Link>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Majukumu yanakamilika kadiri unavyofanya kazi</span>
              <button
                type="button"
                onClick={() => notifyUser('info', 'Majukumu', 'Unaweza kuongeza jukumu jipya kutoka ukurasa wa kalenda.')}
                className="font-bold text-emerald-700 hover:text-emerald-900"
              >
                + Ongeza Jukumu Jipya
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. NOTIFICATIONS & SCHOOL ANNOUNCEMENTS WIDGET */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Notifications &amp; School Announcements (Matangazo ya Shule)
              </h3>
            </div>
            <Link
              href="/teacher/communication"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Tazama Yote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 uppercase">
                  Taaluma (Academic)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">27 Machi</span>
              </div>
              <h4 className="text-xs font-black text-slate-900">Uwasilishaji wa Alama za Machi</h4>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                Walimu wote mnatakiwa kuwasilisha alama za majaribio ya mwezi kabla ya Ijumaa saa 10:00 jioni.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 uppercase">
                  Mkuu wa Shule
                </span>
                <span className="text-[10px] text-slate-400 font-mono">26 Machi</span>
              </div>
              <h4 className="text-xs font-black text-slate-900">Kikao cha Wafanyakazi Wote</h4>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                Kikao cha wafanyakazi wote kitafanyika Jumatatu saa 8:00 mchana ukumbini kuhusu mitihani ya Nusu Muhula.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 uppercase">
                  Wizara (MoEST)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">20 Machi</span>
              </div>
              <h4 className="text-xs font-black text-slate-900">Mtaala Ulioboreshwa 2026</h4>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                Muhtasari wa stadi za Sayansi na TEHAMA unapatikana kwa walimu wote wa madarasa ya msingi.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 5. PRIMARY SCHOOL TEACHER DASHBOARD: CORE WORKSPACE MODULES */}
        {/* ================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Primary School Teacher Workspace Modules:
            </h2>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Moduli Kuu 10
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. My Classes */}
            <Link
              href="/teacher/classes"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
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
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Madarasa uliyopangiwa, orodha ya wanafunzi, wasifu wa mwanafunzi na wastani wa darasa.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Madarasa</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. My Subjects */}
            <Link
              href="/teacher/subjects"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
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
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Masomo uliyopangiwa kufundisha, wanafunzi wa kila somo na maendeleo ya mtaala (Syllabus progress).
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Masomo</span>
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
                  Daily Roll-Call
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Attendance (Mahudhurio)
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Weka mahudhurio ya leo (Present, Absent, Late), kalenda ya siku zilizopita na muhtasari wa mahudhurio.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Mahudhurio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. Lesson Plans */}
            <Link
              href="/teacher/curriculum"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-full">
                  MoEST Format
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Lesson Plans (Maandalio ya Somo)
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Andaa lesson plan kwa mfumo rasmi wa Wizara, pakua templates, na fuatilia mada zilizofundishwa.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Lesson Plans</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 5. Assignments / Class Activities */}
            <Link
              href="/teacher/assignments"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-900 border border-teal-200 px-2 py-0.5 rounded-full">
                  Mazoezi
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Assignments / Class Activities
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Tunga mazoezi, tazama kazi zilizowasilishwa na wanafunzi, sahihisha na weka alama kwenye rekodi.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Mazoezi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 6. Assessment & Marks */}
            <Link
              href="/teacher/marks"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-full">
                  12 Months Calendar
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Assessment &amp; Marks (Uwekaji Alama)
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Weka alama za majaribio ya kila mwezi (Miezi 12), pakua/pakia Excel, hariri kabla ya kuwasilisha kwa Taaluma.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Jedwali la Alama</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 7. Pupil Performance */}
            <Link
              href="/teacher/performance"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Ufaulu
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Pupil Performance (Tathmini ya Ufaulu)
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Ufaulu wa kila mwanafunzi, wastani wa masomo, na orodha ya wanaohitaji uangalizi maalum wa kitaaluma.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Tathmini</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 8. School Communication */}
            <Link
              href="/teacher/communication"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
                  SMS &amp; Chat
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  School Communication (Mawasiliano)
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Matangazo rasmi ya shule, jumbe za walimu na uongozi, na SMS zilizoidhinishwa kutumwa kwa wazazi.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Mawasiliano</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 9. Profile & Timetable */}
            <Link
              href="/teacher/settings"
              className="p-5 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-full">
                  Wasifu Wangu
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Profile &amp; Settings (Wasifu &amp; Ratiba)
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Wasifu wa mwalimu, madarasa na masomo uliyopangiwa, ratiba ya wiki, nenosiri na nambari ya simu.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Wasifu</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 6. EXECUTIVE LEADERSHIP TOOLS (PRESERVED INTACT FOR HEADMASTER & ACADEMIC) */}
        {/* ================================================================= */}
        {(currentUser?.role === 'HEADTEACHER' || currentUser?.role === 'ACADEMIC' || currentUser?.role === 'ADMIN') && (
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-800" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Zana za Uongozi wa Shule (Executive Leadership Tools)
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                Utawala &amp; Taaluma
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentUser?.role === 'HEADTEACHER' && (
                <Link
                  href="/teacher/approvals"
                  className="p-4 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 transition-all flex items-center justify-between group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-800">
                        Idhini ya Matokeo na Muhuri
                      </h4>
                      <span className="text-[11px] text-slate-500 font-semibold block">
                        {hasApprovedTermResults ? 'Imeidhinishwa (Muhuri Rasmi)' : 'Inasubiri Idhini ya Mkuu'}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}

              <Link
                href="/teacher/broadsheet"
                className="p-4 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-800">
                      Broadsheet ya Shule Nzima
                    </h4>
                    <span className="text-[11px] text-slate-500 font-semibold block">
                      Daraja A–F na Nafasi za Wanafunzi
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/teacher/candidates"
                className="p-4 rounded-2xl bg-white border border-emerald-200 hover:border-emerald-400 transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-800">
                      Watahiniwa wa Taifa (NECTA)
                    </h4>
                    <span className="text-[11px] text-slate-500 font-semibold block">
                      190 Watahiniwa (PSLE &amp; SFNA)
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 7. ADD CLASS MODAL */}
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
