'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  CheckCircle2,
  Award,
  BookOpen,
  Users,
  Shield,
  FileText,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Plus,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';

export default function TeacherMainDashboard() {
  const currentUser = getCurrentSession();

  const isHeadteacher = currentUser?.role === 'HEADTEACHER' || currentUser?.leadershipRole === 'HEADTEACHER';
  const isAcademicMaster = currentUser?.role === 'ACADEMIC' || currentUser?.leadershipRole === 'ACADEMIC';
  const isDisciplineMaster = currentUser?.role === 'DISCIPLINE' || currentUser?.leadershipRole === 'DISCIPLINE';

  return (
    <TeacherShell
      pageTitle="Dashibodi Kuu ya Taaluma"
      pageDescription="Kitovu kikuu cha usimamizi wa elimu, alama za masomo, mahudhurio, mitaala na uongozi wa shule."
    >
      <div className="space-y-6 animate-fade-in">
        {/* ===================================================================== */}
        {/* 1. TOP QUICK ACTIONS CONTAINER (EXACT AJIRAMARKET BLUE BANNER STYLE) */}
        {/* ===================================================================== */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-blue-100/70 border border-blue-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-200/50 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0F2942] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ERP
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-blue-950 uppercase tracking-wider">
                  VITENDO VYA HARAKA VYA TAALUMA &amp; UONGOZI (QUICK ACTIONS)
                </h2>
                <p className="text-[11px] text-blue-800/80">
                  Bofya kitufe chochote kwenda moja kwa moja kwenye ukurasa wa shughuli hiyo:
                </p>
              </div>
            </div>

            <Link
              href="/teacher/marks"
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-[#0F2942] hover:bg-blue-900 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>+ Weka Alama Sasa</span>
            </Link>
          </div>

          {/* Quick Action Horizontal Pills Grid (Exact look of screenshot) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <Link
              href="/teacher/marks"
              className="py-2.5 px-3 rounded-2xl bg-white hover:bg-blue-50/90 text-slate-800 text-xs font-bold border border-blue-200 shadow-xs hover:border-blue-400 transition-all text-center flex items-center justify-center gap-1.5 group"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>+ Kujaza Alama</span>
            </Link>

            <Link
              href="/teacher/attendance"
              className="py-2.5 px-3 rounded-2xl bg-white hover:bg-blue-50/90 text-slate-800 text-xs font-bold border border-blue-200 shadow-xs hover:border-blue-400 transition-all text-center flex items-center justify-center gap-1.5 group"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>+ Chukua Roll-Call</span>
            </Link>

            <Link
              href="/teacher/approvals"
              className="py-2.5 px-3 rounded-2xl bg-white hover:bg-blue-50/90 text-slate-800 text-xs font-bold border border-blue-200 shadow-xs hover:border-blue-400 transition-all text-center flex items-center justify-center gap-1.5 group"
            >
              <Award className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
              <span>+ Idhini &amp; Muhuri</span>
            </Link>

            <Link
              href="/teacher/curriculum"
              className="py-2.5 px-3 rounded-2xl bg-white hover:bg-blue-50/90 text-slate-800 text-xs font-bold border border-blue-200 shadow-xs hover:border-blue-400 transition-all text-center flex items-center justify-center gap-1.5 group"
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>+ Kagua Mitaala</span>
            </Link>

            <Link
              href="/teacher/candidates"
              className="py-2.5 px-3 rounded-2xl bg-white hover:bg-blue-50/90 text-slate-800 text-xs font-bold border border-blue-200 shadow-xs hover:border-blue-400 transition-all text-center flex items-center justify-center gap-1.5 group"
            >
              <FileText className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
              <span>+ Watahiniwa NECTA</span>
            </Link>

            <Link
              href="/teacher/broadsheet"
              className="py-2.5 px-3 rounded-2xl bg-white hover:bg-blue-50/90 text-slate-800 text-xs font-bold border border-blue-200 shadow-xs hover:border-blue-400 transition-all text-center flex items-center justify-center gap-1.5 group"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>+ Broadsheet Shule</span>
            </Link>

            <Link
              href="/teacher/discipline"
              className="py-2.5 px-3 rounded-2xl bg-white hover:bg-blue-50/90 text-slate-800 text-xs font-bold border border-blue-200 shadow-xs hover:border-blue-400 transition-all text-center flex items-center justify-center gap-1.5 group"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>+ Rekodi Nidhamu</span>
            </Link>

            <Link
              href="/teacher/staff"
              className="py-2.5 px-3 rounded-2xl bg-white hover:bg-blue-50/90 text-slate-800 text-xs font-bold border border-blue-200 shadow-xs hover:border-blue-400 transition-all text-center flex items-center justify-center gap-1.5 group"
            >
              <Users className="w-3.5 h-3.5 text-slate-600 group-hover:scale-110 transition-transform" />
              <span>+ Orodha ya Walimu</span>
            </Link>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. TWO-COLUMN WORKSPACE: APPLICATION TIPS & READINESS SCORE */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: ACADEMIC TIPS (Matching APPLICATION TIPS in the screenshot) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                i
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                MWONGOZO WA UTENDAJI KAZI (ACADEMIC GUIDELINES)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Kamilisha Kujaza Alama</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-9">
                  Walimu wote wa masomo lazima wajaze alama za majaribio (30%) na mtihani wa muhula (70%) kwa madarasa yote ili kutoa wastani na madaraja sahihi.
                </p>
                <div className="pl-9 pt-1">
                  <Link
                    href="/teacher/marks"
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                  >
                    <span>Fungua Kujaza Alama</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Step 2 Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#0F2942] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Idhini ya Mwalimu Mkuu</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-9">
                  Mwalimu Mkuu huweka saini na Muhuri Rasmi wa Kidigitali kwenye Broadsheet ya shule ili kuruhusu uchapishaji wa ripoti rasmi kwa wazazi na NECTA.
                </p>
                <div className="pl-9 pt-1">
                  <Link
                    href="/teacher/approvals"
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                  >
                    <span>Fungua Idhini &amp; Muhuri</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: SCHOOL READINESS SCORE (Matching Profile Completeness 100% in screenshot) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Hali ya Shule
                </h3>
                <span className="text-[11px] text-slate-500">School Readiness</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                Live Session
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-black text-slate-900">100%</span>
              <span className="text-xs text-slate-500 font-semibold">Target: 100%</span>
            </div>

            {/* Progress Bar (Gradient teal/emerald) */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Shughuli zote za msingi za muhula zimekidhi vigezo vya ukaguzi wa kitaaluma:
            </p>

            {/* Checklist with green check pills (Exact look of screenshot) */}
            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-semibold truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Alama za Masomo &amp; Madaraja</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md shrink-0">
                  +25%
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-semibold truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Mahudhurio ya Kila Siku</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md shrink-0">
                  +25%
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-semibold truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Maazimio ya Kazi (Syllabus)</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md shrink-0">
                  +25%
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-semibold truncate">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Uthibitisho wa Mwalimu Mkuu</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md shrink-0">
                  +25%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. SCHOOL METRICS OVERVIEW CARDS */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Wanafunzi Wote</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">342</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Std 1 - 7
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Watahiniwa NECTA</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">93</span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Std 4 &amp; 7
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Walimu wa Shule</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">6</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Staff
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Wastani wa Ufaulu</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-800">84.6%</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Daraja B+
              </span>
            </div>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
