'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  FileSpreadsheet,
  User,
  GraduationCap,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Users,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import {
  getCurrentSession,
  setCurrentSession,
  getStoredAccounts,
  saveStoredAccounts,
  INITIAL_BLUEPRINT_ACCOUNTS,
  PRIMARY_CLASSES_LIST,
  PRIMARY_SUBJECTS_LIST,
  UserAccount,
  TeachingLoad,
} from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

export default function TeacherDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_BLUEPRINT_ACCOUNTS[0] || null);

  // Teaching Assignments (Pair of Class + Subject)
  const [teachingAssignments, setTeachingAssignments] = useState<TeachingLoad[]>([
    { class: 'Standard 7 (Grade 7)', subject: 'Civic & Moral Education (Uraia na Maadili)' },
    { class: 'Standard 6 (Grade 6)', subject: 'Social Studies (Maarifa ya Jamii)' },
  ]);

  // Modal State for Adding Class & Subject
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>(PRIMARY_CLASSES_LIST[0]);
  const [selectedSubject, setSelectedSubject] = useState<string>(PRIMARY_SUBJECTS_LIST[0]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      if (session.teachingAssignments && session.teachingAssignments.length > 0) {
        setTeachingAssignments(session.teachingAssignments);
      } else if (session.assignedClasses && session.assignedClasses.length > 0) {
        // Fallback: build from existing assignedClasses & subjects
        const built = session.assignedClasses.map((cls, idx) => ({
          class: cls,
          subject: (session.subjects && session.subjects[idx]) || 'Civic & Moral Education (Uraia na Maadili)',
        }));
        setTeachingAssignments(built);
      }
    }
  }, []);

  // Handler: Add Class and Subject
  const handleAddClassAndSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Check if duplicate assignment exists
    const exists = teachingAssignments.some(
      (a) => a.class === selectedClass && a.subject === selectedSubject
    );
    if (exists) {
      notifyUser('warning', 'Mgawo Upo Tayari', `${selectedClass} somo la ${selectedSubject} tayari lipo kwenye ratiba yako.`);
      return;
    }

    const updatedAssignments: TeachingLoad[] = [
      ...teachingAssignments,
      { class: selectedClass, subject: selectedSubject },
    ];

    // Also sync assignedClasses and subjects arrays
    const updatedClasses = Array.from(new Set(updatedAssignments.map((a) => a.class)));
    const updatedSubjects = Array.from(new Set(updatedAssignments.map((a) => a.subject)));

    const updatedUser: UserAccount = {
      ...currentUser,
      teachingAssignments: updatedAssignments,
      assignedClasses: updatedClasses,
      assignedClass: updatedClasses.join(', '),
      subjects: updatedSubjects,
    };

    setCurrentUser(updatedUser);
    setTeachingAssignments(updatedAssignments);
    setCurrentSession(updatedUser);

    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    setShowAddModal(false);
    notifyUser(
      'success',
      'Darasa na Somo Limeongezwa',
      `${selectedClass} — somo la ${selectedSubject} limeongezwa kikamilifu.`
    );
  };

  // Handler: Remove Assignment
  const handleRemoveAssignment = (indexToRemove: number) => {
    if (!currentUser) return;
    if (teachingAssignments.length <= 1) {
      notifyUser('warning', 'Kizuizi', 'Lazima ubakiwe na angalau darasa na somo moja unalofundisha.');
      return;
    }

    const removed = teachingAssignments[indexToRemove];
    const updatedAssignments = teachingAssignments.filter((_, idx) => idx !== indexToRemove);
    const updatedClasses = Array.from(new Set(updatedAssignments.map((a) => a.class)));
    const updatedSubjects = Array.from(new Set(updatedAssignments.map((a) => a.subject)));

    const updatedUser: UserAccount = {
      ...currentUser,
      teachingAssignments: updatedAssignments,
      assignedClasses: updatedClasses,
      assignedClass: updatedClasses.join(', '),
      subjects: updatedSubjects,
    };

    setCurrentUser(updatedUser);
    setTeachingAssignments(updatedAssignments);
    setCurrentSession(updatedUser);

    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    notifyUser('info', 'Darasa Limeondolewa', `${removed.class} — ${removed.subject} limeondolewa kwenye ratiba yako.`);
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
      <div className="space-y-10 animate-fade-in max-w-4xl mx-auto py-6 sm:py-10">
        {/* 1. HERO: Frameless Avatar, Dynamic Salutation & Teacher Profile */}
        <div className="flex flex-col items-center justify-center text-center space-y-5">
          {/* Dynamic Self-Writing Salutation */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm tracking-wide shadow-2xs">
            <span>{timeGreetingSwahili}, {roleTitleSwahili}</span>
            <span className="text-emerald-500">•</span>
            <span className="text-emerald-800">{timeGreetingEnglish}, {roleTitleEnglish}</span>
          </div>

          {/* Frameless Picture / Avatar (NO frame, NO border) */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-xl shadow-emerald-950/20">
            <User className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-200" />
          </div>

          {/* Teacher Name & Role Under the Picture */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {currentUser?.fullName || 'Mwl. Augustine Mrosso'}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-xs">
                {roleTitleSwahili}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold border border-slate-200">
                {currentUser?.identifier || 'HT-2026-001'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center justify-center gap-2 pt-1">
              <span>{currentUser?.email || 'headteacher@primaryschool.ac.tz'}</span>
              <span className="text-slate-300">•</span>
              <span>{currentUser?.phone || '+255 754 112 233'}</span>
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {currentUser?.role === 'HEADTEACHER' && (
              <Link
                href="/teacher/approvals"
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs transition-all shadow-md flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-emerald-950" />
                <span>Idhinisha Matokeo na Muhuri</span>
              </Link>
            )}
            <Link
              href="/teacher/marks"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Weka Alama za Masomo Yangu</span>
            </Link>
          </div>
        </div>

        {/* 2. MADARASA NA MASOMO NINAYOFUNDISHA SECTION */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-800" />
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
                  Madarasa na Masomo Ninayofundisha ({teachingAssignments.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Madarasa na masomo uliyopangiwa kufundisha muhula huu. Unaweza kuongeza au kubadilisha.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ongeza Darasa na Somo</span>
            </button>
          </div>

          {/* Cards Grid: Teaching Assignments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachingAssignments.map((assignment, index) => (
              <div
                key={`${assignment.class}-${assignment.subject}-${index}`}
                className="bg-white rounded-3xl border border-emerald-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase tracking-wider">
                      Darasa
                    </span>
                    <h3 className="text-lg font-black text-slate-900">{assignment.class}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-50/80 px-2.5 py-1 rounded-xl border border-emerald-100 mt-1">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Somo: {assignment.subject}</span>
                    </div>
                  </div>

                  {teachingAssignments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAssignment(index)}
                      title={`Ondoa ${assignment.class} - ${assignment.subject}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Actions for this specific class and subject */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Link
                    href={`/teacher/marks?class=${encodeURIComponent(assignment.class)}&subject=${encodeURIComponent(assignment.subject)}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Weka Alama</span>
                  </Link>

                  <Link
                    href={`/teacher/attendance?class=${encodeURIComponent(assignment.class)}`}
                    className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mahudhurio</span>
                  </Link>

                  <Link
                    href={`/teacher/classes`}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Wanafunzi</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. MODAL: ONGEZA DARASA NA SOMO */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-base font-black text-slate-900">Ongeza Darasa na Somo</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddClassAndSubject} className="space-y-4">
                {/* 1. Chagua Darasa */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    1. Chagua Darasa (Standard 1–7):
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-800 bg-white"
                  >
                    {PRIMARY_CLASSES_LIST.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Chagua Somo */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    2. Chagua Somo Utakalofundisha:
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-800 bg-white"
                  >
                    {PRIMARY_SUBJECTS_LIST.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  Utaongezewa darasa hili na somo ulilochagua kwenye ratiba yako ya kufundisha na uwekaji wa alama.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md"
                  >
                    Hifadhi Darasa & Somo
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
