'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Building2,
  Calendar,
  Check,
  ShieldCheck,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';

export default function HeadteacherApprovalsPage() {
  const currentUser = getCurrentSession();
  const [hasApprovedTermResults, setHasApprovedTermResults] = useState(false);
  const [approvalTimestamp, setApprovalTimestamp] = useState<string | null>(null);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  const handleApproveWithSeal = () => {
    const stampTime = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setHasApprovedTermResults(true);
    setApprovalTimestamp(stampTime);
    setActiveNotice(`Matokeo ya Muhula yameidhinishwa rasmi na Mwalimu Mkuu (${currentUser?.fullName || 'Mwl. Augustine Mrosso'}). Muhuri wa kidigitali umewekwa.`);
  };

  return (
    <TeacherShell
      pageTitle="Idhini ya Matokeo & Muhuri Rasmi wa Shule"
      pageDescription="Ofisi ya Mwalimu Mkuu: Kuidhinisha broadsheets, kuthibitisha ufaulu wa shule nzima, na kuweka Muhuri Rasmi wa Kidigitali."
      requiredRole="HEADTEACHER"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Notice alert */}
        {activeNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{activeNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveNotice(null)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0"
            >
              Funga
            </button>
          </div>
        )}

        {/* Headteacher Executive Authority Card */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-800">
                  Uthibitisho wa Broadsheet ya Muhula wa Kwanza 2026
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                  Idhini ya Mwisho
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mwalimu wa Taaluma amekamilisha ukusanyaji wa alama zote. Sasa inahitajika saini na muhuri wako kabla ya kutoa ripoti kwa wazazi na NECTA.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {!hasApprovedTermResults ? (
                <button
                  type="button"
                  onClick={handleApproveWithSeal}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Weka Muhuri na Idhinisha Matokeo</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Yameidhinishwa ({approvalTimestamp})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNotice('Ripoti rasmi ya broadsheet inapakuliwa ikiwa na muhuri wa Mkuu wa Shule.')}
                    className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Pakua PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Official Digital Seal Visual Display */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200/90 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-600 bg-white flex flex-col items-center justify-center text-center shadow-md shrink-0">
                <Award className="w-6 h-6 text-emerald-700" />
                <span className="text-[7px] font-black uppercase text-emerald-800 leading-none">SEAL</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-emerald-950">
                  PRIMARY SCHOOL • HEADTEACHER OFFICIAL STAMP
                </h4>
                <p className="text-xs text-emerald-800 font-medium">
                  {hasApprovedTermResults
                    ? `Muhuri Umepigwa Kidigitali: Tarehe ${approvalTimestamp} na ${currentUser?.fullName || 'Mwl. Augustine Mrosso'}`
                    : 'Hali: Inasubiri idhini na muhuri wa Mwalimu Mkuu'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Nambari ya Cheti cha Uthibitisho: <span className="font-mono font-bold text-emerald-900">VER-2026-HT-08492</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${
                hasApprovedTermResults
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {hasApprovedTermResults ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                <span>{hasApprovedTermResults ? 'STAMPED & VERIFIED' : 'PENDING APPROVAL'}</span>
              </span>
            </div>
          </div>

          {/* Classes Summary & Pass Rates */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Muhtasari wa Madarasa Yote (Pass Rate Summary)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Darasa la 7 (PSLE Candidates)</span>
                <span className="text-xl font-black text-slate-800 block mt-1">100% Pass Rate</span>
                <span className="text-[11px] text-emerald-700 font-bold">Watahiniwa 86 • Wastani: 88.4%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Darasa la 6 (Grade 6)</span>
                <span className="text-xl font-black text-slate-800 block mt-1">94.2% Pass Rate</span>
                <span className="text-[11px] text-emerald-700 font-bold">Wanafunzi 92 • Wastani: 79.1%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Darasa la 5 (Grade 5)</span>
                <span className="text-xl font-black text-slate-800 block mt-1">91.8% Pass Rate</span>
                <span className="text-[11px] text-emerald-700 font-bold">Wanafunzi 98 • Wastani: 76.5%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Darasa la 4 (SFNA Candidates)</span>
                <span className="text-xl font-black text-slate-800 block mt-1">96.5% Pass Rate</span>
                <span className="text-[11px] text-emerald-700 font-bold">Watahiniwa 104 • Wastani: 82.3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Link to Classroom Teaching for Headteacher */}
        <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Unataka Kujaza Alama za Darasa Lako?</h4>
              <p className="text-xs text-slate-500">
                Kama Mwalimu Mkuu unafundisha Standard 6 &amp; 7 (Uraia na Maadili &amp; Maarifa ya Jamii). Bofya hapa kwenda moja kwa moja kwenye ukurasa wa kujaza alama zako.
              </p>
            </div>
          </div>
          <Link
            href="/teacher/marks"
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-colors shadow-xs"
          >
            <span>Kujaza Alama Zangu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </TeacherShell>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
