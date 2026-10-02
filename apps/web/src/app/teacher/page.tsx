'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Shield,
  FileText,
  UserCheck,
  Building2,
  AlertTriangle,
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
      pageTitle="Dashibodi Kuu & Shughuli za Mwalimu (Activity Hub)"
      pageDescription="Chagua shughuli unayotaka kufanya leo. Kila shughuli ina ukurasa wake maalum unaojitegemea kikamilifu."
    >
      <div className="space-y-8 animate-fade-in">

        {/* =================================================================== */}
        {/* 1. WELCOME PROFILE & TEACHING CONTEXT CARD */}
        {/* =================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl border border-emerald-300 shadow-2xs">
                {isHeadteacher ? <Award className="w-7 h-7 text-emerald-800" /> : currentUser?.fullName.charAt(0) || 'T'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-800">{currentUser?.fullName}</h2>
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
                <p className="text-xs text-slate-500 mt-0.5">
                  Kitambulisho: <span className="font-mono font-bold text-emerald-800">{currentUser?.identifier}</span> • Mawasiliano: {currentUser?.email || currentUser?.phone}
                </p>
              </div>
            </div>

            {/* Teaching Subjects Context */}
            {currentUser?.subjects && currentUser.subjects.length > 0 && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-bold block">Ratiba Yako ya Kufundisha:</span>
                  <span className="text-[11px] text-slate-600">
                    {currentUser.subjects.join(', ')} • {currentUser.assignedClasses?.join(', ') || currentUser.assignedClass}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. EXECUTIVE LEADERSHIP PAGES (FOR HEADTEACHER, ACADEMIC, DISCIPLINE) */}
        {/* =================================================================== */}
        {(isHeadteacher || isAcademicMaster || isDisciplineMaster) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-800" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  {isHeadteacher
                    ? 'Shughuli za Ofisi ya Mwalimu Mkuu (Executive Pages)'
                    : isAcademicMaster
                    ? 'Shughuli za Idara ya Taaluma (Academic Pages)'
                    : 'Shughuli za Idara ya Nidhamu (Discipline Pages)'}
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Ukurasa Maalum kwa Kila Shughuli</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Headteacher Page 1: Approvals & Seal */}
              {isHeadteacher && (
                <div className="bg-white rounded-3xl border border-amber-200/90 hover:border-amber-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        Idhini ya Matokeo &amp; Muhuri Rasmi
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Kuidhinisha broadsheets za mitihani, kuweka muhuri wa kidigitali wa Mkuu wa Shule, na kutoa idhini ya ripoti kwa wazazi.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/teacher/approvals"
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <span>Fungua Ukurasa wa Idhini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Headteacher & Academic Page 2: Curriculum & Syllabus */}
              {(isHeadteacher || isAcademicMaster) && (
                <div className="bg-white rounded-3xl border border-emerald-200 hover:border-emerald-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        Usimamizi wa Mitaala &amp; Walimu
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Kufuatilia ukamilishaji wa mitaala (Syllabus Coverage), uwasilishaji wa maazimio ya kazi ya kila wiki, na maandalio ya walimu.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/teacher/curriculum"
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <span>Fungua Ukurasa wa Mitaala</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Academic Master Page: NECTA Candidates */}
              {(isAcademicMaster || isHeadteacher) && (
                <div className="bg-white rounded-3xl border border-purple-200 hover:border-purple-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        Watahiniwa wa Taifa (PSLE &amp; SFNA)
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Orodha ya watahiniwa wa NECTA wa Darasa la Saba na Nne, nambari za mitihani, na ufuatiliaji wa mitihani ya majaribio (Mock).
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/teacher/candidates"
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <span>Fungua Watahiniwa wa Taifa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Academic Master Page: Broadsheet Coordination */}
              {isAcademicMaster && (
                <div className="bg-white rounded-3xl border border-blue-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        Uratibu wa Broadsheet &amp; Mitihani
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Kukusanya alama zote za masomo, kuhesabu wastani, madaraja, na kupanga nafasi za ufaulu wa shule nzima.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/teacher/broadsheet"
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <span>Fungua Broadsheet ya Shule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Discipline Master Page: Whole School Attendance & Summons */}
              {(isDisciplineMaster || isHeadteacher) && (
                <div className="bg-white rounded-3xl border border-emerald-200 hover:border-emerald-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Shield className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        Mahudhurio ya Shule Nzima &amp; Utoro
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Kufuatilia utoro wa shule nzima, kuandika barua za wito kwa wazazi, na kusimamia nidhamu na sare za shule.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/teacher/discipline"
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <span>Fungua Ukurasa wa Nidhamu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. CLASSROOM TEACHING PAGES (AVAILABLE TO ALL TEACHERS & LEADERS) */}
        {/* =================================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                Shughuli za Darasani (My Classroom Pages)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              Kila Mwalimu Ana Masomo &amp; Madarasa Yake
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Classroom Page 1: Marks Entry */}
            <div className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    Kujaza Alama za Somo (Marks Entry)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Weka alama za majaribio ya kila wiki, Continuous Assessment (CA), na mitihani ya muhula kwa wanafunzi unaowafundisha.
                  </p>
                </div>
              </div>

              <Link
                href="/teacher/marks"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>Fungua Kujaza Alama</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Classroom Page 2: Attendance Roll-Call */}
            <div className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    Roll-Call ya Darasa Langu (Attendance)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Chukua mahudhurio ya kila siku ya darasa lako (Yupo / Hayupo / Ruhusa). Taarifa hutumwa moja kwa moja kwa Mwalimu wa Nidhamu.
                  </p>
                </div>
              </div>

              <Link
                href="/teacher/attendance"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>Fungua Rejista ya Mahudhurio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Classroom Page 3: Staff Roster */}
            <div className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    Walimu Wenzangu (Staff Directory)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Tazama orodha ya walimu wote wa shule, madarasa na masomo wanayofundisha, pamoja na mawasiliano yao ya kikazi.
                  </p>
                </div>
              </div>

              <Link
                href="/teacher/staff"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>Fungua Orodha ya Walimu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </TeacherShell>
  );
}
