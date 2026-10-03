'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  GraduationCap,
  Plus,
  X,
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

  // Typewriter Greeting based on time of day
  const [typedGreeting, setTypedGreeting] = useState('');

  useEffect(() => {
    const currentHour = new Date().getHours();
    const greeting =
      currentHour >= 5 && currentHour < 12
        ? 'HABARI ZA ASUBUHI! KARIBU KWENYE PORTAL YA WALIMU'
        : currentHour >= 12 && currentHour < 16
        ? 'HABARI ZA MCHANA! KARIBU KWENYE PORTAL YA WALIMU'
        : currentHour >= 16 && currentHour < 20
        ? 'HABARI ZA JIONI! KARIBU KWENYE PORTAL YA WALIMU'
        : 'HABARI ZA USIKU! KARIBU KWENYE PORTAL YA WALIMU';

    let i = 0;
    setTypedGreeting('');
    const timer = setInterval(() => {
      i++;
      setTypedGreeting(greeting.slice(0, i));
      if (i >= greeting.length) {
        clearInterval(timer);
      }
    }, 35);

    return () => clearInterval(timer);
  }, []);

  const roleTitleSwahili =
    currentUser?.role === 'HEADTEACHER'
      ? 'Mwalimu Mkuu'
      : currentUser?.role === 'ACADEMIC'
      ? 'Mwalimu wa Taaluma'
      : currentUser?.role === 'DISCIPLINE'
      ? 'Mwalimu wa Nidhamu'
      : 'Mwalimu wa Darasa';

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
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto py-4 sm:py-6">
        {/* 1. HERO KIMSTARI: Typewriter Salutation Kubwa, Picha Kubwa + Jina Kubwa, na Cheo */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          {/* Juu: Salutation maneno makubwa in Capital Letters */}
          <div className="min-h-[30px] text-sm sm:text-base md:text-lg font-black tracking-wider text-emerald-800 uppercase flex items-center justify-center">
            <span>{typedGreeting}</span>
            <span className="inline-block w-2 h-4 sm:h-5 ml-1.5 bg-emerald-600 animate-pulse" />
          </div>

          {/* Chini yake: Picha kubwa bila frame + Jina lake kubwa kimstari */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-1">
            {/* Picha kubwa (NO frame, NO border) */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/15">
              <User className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-200" />
            </div>

            {/* Jina lake kubwa */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {currentUser?.fullName || 'Mwl. Augustine Mrosso'}
            </h1>
          </div>

          {/* Chini yake: Cheo chake in Capital Letters */}
          <div className="flex items-center justify-center gap-2 pt-0.5">
            <span className="px-3.5 py-1 rounded-full bg-emerald-100/90 text-emerald-900 font-black text-xs sm:text-sm uppercase tracking-widest border border-emerald-300/60 shadow-2xs">
              {roleTitleSwahili}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono font-bold text-slate-600 text-xs sm:text-sm tracking-wider">
              {currentUser?.identifier || 'HT-2026-001'}
            </span>
          </div>
        </div>

        {/* 2. TABS FUPI / VIDONGE (PILLS / BADGES) - MADARASA NA MASOMO NINAYOFUNDISHA */}
        <div className="w-full flex flex-col items-center justify-center space-y-3 pt-6 border-t border-emerald-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-emerald-800" />
            <span>Madarasa na Masomo Ninayofundisha:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
            {teachingAssignments.map((assignment, index) => (
              <div
                key={`${assignment.class}-${assignment.subject}-${index}`}
                className="group inline-flex items-center gap-2 pl-3.5 pr-2 py-1.5 rounded-full bg-white border border-emerald-300 shadow-2xs hover:border-emerald-500 hover:shadow-xs transition-all text-xs"
              >
                <span className="font-black text-slate-900">{assignment.class}</span>
                <span className="text-emerald-400">•</span>
                <span className="font-semibold text-emerald-800">{assignment.subject}</span>

                <Link
                  href={`/teacher/marks?class=${encodeURIComponent(assignment.class)}&subject=${encodeURIComponent(assignment.subject)}`}
                  title={`Weka Alama: ${assignment.class} - ${assignment.subject}`}
                  className="ml-1 px-2 py-0.5 rounded-full bg-emerald-100 hover:bg-emerald-800 text-emerald-800 hover:text-white font-bold text-[10px] transition-colors"
                >
                  Alama
                </Link>

                {teachingAssignments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignment(index)}
                    title={`Ondoa ${assignment.class} - ${assignment.subject}`}
                    className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {/* + Ongeza Button on the same row */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs shadow-2xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Ongeza</span>
            </button>
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
