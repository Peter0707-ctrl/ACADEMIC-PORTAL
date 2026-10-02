'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  FileSpreadsheet,
  Plus,
  Trash2,
  X,
  GraduationCap,
  User,
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

function getTimeSalutation(role?: string) {
  const hour = new Date().getHours();
  let timeOfDaySwa = 'Habari za Asubuhi';
  let timeOfDayEng = 'Good Morning';

  if (hour >= 12 && hour < 16) {
    timeOfDaySwa = 'Habari za Mchana';
    timeOfDayEng = 'Good Afternoon';
  } else if (hour >= 16 || hour < 5) {
    timeOfDaySwa = 'Habari za Jioni';
    timeOfDayEng = 'Good Evening';
  }

  let roleSwa = 'Mwalimu';
  let roleEng = 'Teacher';

  if (role === 'HEADTEACHER') {
    roleSwa = 'Mwalimu Mkuu';
    roleEng = 'Head Teacher';
  } else if (role === 'ACADEMIC') {
    roleSwa = 'Mwalimu wa Taaluma';
    roleEng = 'Academic Master';
  } else if (role === 'DISCIPLINE') {
    roleSwa = 'Mwalimu wa Nidhamu';
    roleEng = 'Discipline Master';
  } else if (role === 'ADMIN') {
    roleSwa = 'Msimamizi Mkuu';
    roleEng = 'Administrator';
  }

  return {
    greetingSwa: `${timeOfDaySwa}, ${roleSwa}`,
    greetingEng: `${timeOfDayEng}, ${roleEng}`,
    roleSwa,
  };
}

export default function TeacherDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_BLUEPRINT_ACCOUNTS[0] || null);
  const [teachingClasses, setTeachingClasses] = useState<string[]>(
    INITIAL_BLUEPRINT_ACCOUNTS[0]?.assignedClasses || ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)']
  );

  // Modal State for adding another class to teach
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newSelectedClass, setNewSelectedClass] = useState<string>('Standard 5 (Grade 5)');
  const [newSelectedSubject, setNewSelectedSubject] = useState<string>('Mathematics (Hisabati)');

  // Load existing session from storage
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

  const salutation = getTimeSalutation(currentUser?.role);

  const shellTitle =
    currentUser?.role === 'HEADTEACHER'
      ? "Dashibodi ya Mwalimu Mkuu (Headmaster's Executive Dashboard)"
      : currentUser?.role === 'ACADEMIC'
      ? "Dashibodi ya Taaluma (Academic Master's Dashboard)"
      : currentUser?.role === 'DISCIPLINE'
      ? "Dashibodi ya Nidhamu (Discipline Master's Dashboard)"
      : "Dashibodi ya Mwalimu (Teacher's Dashboard)";

  const shellDesc =
    "Usimamizi wa masomo na madarasa unayofundisha, uwekaji wa alama za mitihani, mahudhurio ya wanafunzi na maandalio ya kazi.";

  return (
    <TeacherShell pageTitle={shellTitle} pageDescription={shellDesc}>
      <div className="space-y-6 animate-fade-in">
        {/* ================================================================= */}
        {/* 1. CLEAN SALUTATION & USER PROFILE (NO GREEN BOX, NO FRAMES)      */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-emerald-100 pb-5">
          <div className="flex items-center gap-4">
            {/* Picha bila frame yoyote */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center shadow-md shrink-0">
              <User className="w-9 h-9 sm:w-11 sm:h-11 text-amber-300" />
            </div>

            {/* Jina na Salutation (Asubuhi / Mchana / Jioni) na Cheo */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-emerald-800 tracking-wide">
                  {salutation.greetingSwa}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  • {salutation.greetingEng}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {currentUser?.fullName}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase">
                  {salutation.roleSwa}
                </span>
                <span className="font-mono font-bold text-slate-600">{currentUser?.identifier}</span>
                <span>•</span>
                <span>{currentUser?.email}</span>
                <span>•</span>
                <span>{currentUser?.phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-auto">
            {currentUser?.role === 'HEADTEACHER' && (
              <Link
                href="/teacher/approvals"
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs transition-all shadow-xs flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-emerald-950" />
                <span>Idhinisha Matokeo na Muhuri</span>
              </Link>
            )}
            <Link
              href="/teacher/marks"
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Weka Alama za Masomo Yangu</span>
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. MADARASA NINAYOFUNDISHA (CLASSES I TEACH) SECTION              */}
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
        {/* 3. ADD CLASS MODAL                                                */}
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
