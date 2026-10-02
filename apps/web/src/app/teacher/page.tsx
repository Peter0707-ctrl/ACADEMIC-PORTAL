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
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

const STORAGE_APPROVAL_KEY = 'headteacher_results_approval_status_v1';
const STORAGE_RECORDS_KEY = 'school_records_documents_v1';

export default function TeacherDashboardPage() {
  const currentUser = getCurrentSession();

  const [hasApprovedTermResults, setHasApprovedTermResults] = useState(false);
  const [approvalTimestamp, setApprovalTimestamp] = useState<string | null>(null);
  const [resultsReleaseDate, setResultsReleaseDate] = useState<string>('2026-03-27');
  const [resultsReleaseTime, setResultsReleaseTime] = useState<string>('08:00');
  const [sealCertNumber, setSealCertNumber] = useState<string>('VER-2026-HT-08492');

  // Load existing approval from storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
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

  return (
    <TeacherShell
      pageTitle="Dashibodi ya Mwalimu Mkuu (Headmaster's Executive Dashboard)"
      pageDescription="Ofisi ya Mkuu wa Shule: Usimamizi mkuu wa ufundishaji, idhini ya matokeo kwa muhuri rasmi, ufuatiliaji wa walimu na mahudhurio ya shule."
    >
      <div className="space-y-6 animate-fade-in">
        {/* ================================================================= */}
        {/* 1. EXECUTIVE WELCOME & IDENTITY BANNER */}
        {/* ================================================================= */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-2xl text-amber-300 shadow-inner shrink-0">
              <Award className="w-8 h-8 text-amber-300" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight">{currentUser?.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px] tracking-wide uppercase">
                  Mwalimu Mkuu
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-100 font-mono text-[10px] font-bold">
                  {currentUser?.identifier}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 flex flex-wrap items-center gap-2">
                <span>{currentUser?.email}</span>
                <span>•</span>
                <span>{currentUser?.phone}</span>
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-emerald-200">
                <span className="font-semibold text-white">Madarasa Unayofundisha:</span>
                <span className="bg-emerald-800/80 px-2 py-0.5 rounded-lg border border-emerald-600/40">
                  {currentUser?.assignedClasses?.join(' & ') || 'Standard 6 & Standard 7'}
                </span>
                <span>•</span>
                <span className="font-semibold text-white">Masomo:</span>
                <span className="bg-emerald-800/80 px-2 py-0.5 rounded-lg border border-emerald-600/40">
                  Civic & Moral Education (Uraia na Maadili), Social Studies
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <Link
              href="/teacher/approvals"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-emerald-950" />
              <span>Idhinisha Matokeo na Muhuri</span>
            </Link>
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
        {/* 2. EXECUTIVE KEY METRICS SUMMARY */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Broadsheet Approval Status */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Muhuri wa Matokeo
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${hasApprovedTermResults ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-lg font-black text-slate-900 block">
                {hasApprovedTermResults ? 'YAMEIDHINISHWA' : 'YANASUBIRI IDHINI'}
              </span>
              <span className={`text-[11px] font-semibold block mt-0.5 ${hasApprovedTermResults ? 'text-emerald-700' : 'text-amber-700'}`}>
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
              <span className="text-2xl font-black text-slate-900 block">2 Madarasa</span>
              <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">
                Std 6 & Std 7 • Masomo 2
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
        {/* 3. OFFICIAL DIGITAL SEAL BANNER & DIRECT APPROVAL (HEADMASTER ACTION) */}
        {/* ================================================================= */}
        <div className="p-6 rounded-3xl bg-white border-2 border-emerald-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-black text-slate-900">
                  Uthibitisho &amp; Muhuri Rasmi wa Mwalimu Mkuu
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                  Muhula wa 1, 2026
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Kulingana na muundo wa mfumo, Mwalimu Mkuu huweka Muhuri Rasmi wa Kidigitali (Official Digital Seal) kuidhinisha broadsheet kabla haijatolewa kwa wazazi.
              </p>
            </div>

            <div>
              {!hasApprovedTermResults ? (
                <button
                  type="button"
                  onClick={handleApproveWithSeal}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Weka Muhuri Rasmi wa Mkuu</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Yameidhinishwa ({approvalTimestamp})</span>
                  </div>
                  <Link
                    href="/teacher/approvals"
                    className="px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition-colors"
                  >
                    Maelezo Zaidi
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-4 border-emerald-600 bg-white flex flex-col items-center justify-center text-center shadow-md shrink-0">
                <Award className="w-5 h-5 text-emerald-700" />
                <span className="text-[7px] font-black uppercase text-emerald-800 leading-none">SEAL</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-emerald-950">
                  PRIMARY SCHOOL • HEADTEACHER OFFICIAL STAMP
                </h3>
                <p className="text-xs text-emerald-800 font-medium">
                  {hasApprovedTermResults
                    ? `Muhuri Umepigwa Kidigitali: ${approvalTimestamp} na Mwl. Augustine Mrosso`
                    : 'Hali: Inasubiri idhini na muhuri wa Mwalimu Mkuu'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Nambari ya Cheti cha Uthibitisho: <span className="font-mono font-bold text-emerald-900">{sealCertNumber}</span> • Tarehe ya Kutolewa: <span className="font-bold">{resultsReleaseDate} saa {resultsReleaseTime}</span>
                </p>
              </div>
            </div>

            <Link
              href="/teacher/approvals"
              className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs shadow-2xs transition-colors shrink-0"
            >
              Fungua Ukurasa wa Idhini &amp; Masijala &rarr;
            </Link>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. EXECUTIVE DIRECT ACTION MODULES GRID */}
        {/* ================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              Njia za Haraka za Kazi za Mwalimu Mkuu (Quick Modules):
            </h2>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Ofisi ya Mkuu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Idhini ya Matokeo */}
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
                  Std 6 &amp; 7
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-800">
                  Kujaza Alama za Masomo Yangu
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Ingiza alama za Uraia &amp; Maadili na Maarifa ya Jamii kwa kutumia Excel au jedwali, kisha tuma kwa Taaluma.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Jedwali la Alama</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Mahudhurio & Roll-Call */}
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
                  Roll-Call ya Mahudhurio
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Tazama ripoti za utoro na mahudhurio zilizotumwa moja kwa moja kwako na walimu wa madarasa yote shuleni.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <span>Fungua Mahudhurio</span>
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
      </div>
    </TeacherShell>
  );
}
