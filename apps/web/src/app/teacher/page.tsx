'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, FileSpreadsheet, User } from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import {
  getCurrentSession,
  INITIAL_BLUEPRINT_ACCOUNTS,
  UserAccount,
} from '@/lib/auth-session';

export default function TeacherDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_BLUEPRINT_ACCOUNTS[0] || null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }
  }, []);


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
      <div className="py-8 sm:py-16 flex flex-col items-center justify-center text-center animate-fade-in max-w-2xl mx-auto space-y-6">
        {/* 1. Salutation that writes itself (Dynamic time of day & role) */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm tracking-wide shadow-2xs">
          <span>{timeGreetingSwahili}, {roleTitleSwahili}</span>
          <span className="text-emerald-500">•</span>
          <span className="text-emerald-800">{timeGreetingEnglish}, {roleTitleEnglish}</span>
        </div>

        {/* 2. Frameless Picture / Avatar (NO frame, NO border) */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-xl shadow-emerald-950/20">
          <User className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-200" />
        </div>

        {/* 3. Under the Image: Name & Role Details */}
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

        {/* 4. Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
    </TeacherShell>
  );
}
