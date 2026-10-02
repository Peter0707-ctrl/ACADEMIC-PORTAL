'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Calendar,
  Check,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  FolderArchive,
  Sparkles,
  RotateCcw,
  Clock,
  Send,
  X,
  Printer,
  QrCode,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

const STORAGE_APPROVAL_KEY = 'headteacher_results_approval_status_v1';
const STORAGE_RECORDS_KEY = 'school_records_documents_v1';

export default function HeadteacherApprovalsPage() {
  const currentUser = getCurrentSession();

  const [hasApprovedTermResults, setHasApprovedTermResults] = useState(false);
  const [approvalTimestamp, setApprovalTimestamp] = useState<string | null>(null);
  const [resultsReleaseDate, setResultsReleaseDate] = useState<string>('2026-03-27');
  const [resultsReleaseTime, setResultsReleaseTime] = useState<string>('08:00');
  const [sealCertNumber, setSealCertNumber] = useState<string>('VER-2026-HT-08492');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

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

  // Save Approved Results Document to School Records Archive
  const saveToRecordsArchive = (releaseDateStr: string) => {
    if (typeof window === 'undefined') return;
    try {
      const existingRaw = localStorage.getItem(STORAGE_RECORDS_KEY);
      let list = existingRaw ? JSON.parse(existingRaw) : [];

      const newRecordDoc = {
        id: `doc-sealed-results-2026-term1`,
        title: `Broadsheet Rasmi ya Matokeo ya Muhula wa 1 2026 (Yaliyowekwa Muhuri na Mkuu wa Shule)`,
        category: 'Taaluma & Mitihani',
        fileName: 'Broadsheet_Rasmi_Muhula_1_2026_SEALED.pdf',
        fileSize: '4.8 MB',
        version: 'v1.0 (Official Signed & Stamped)',
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: currentUser?.fullName || 'Mwl. Augustine Mrosso (Mkuu wa Shule)',
        accessLevel: 'PUBLIC',
        status: 'IMETHIBITISHWA_NA_MUHURI',
        releaseDate: releaseDateStr,
      };

      // Replace if existing or add to beginning
      list = [newRecordDoc, ...list.filter((d: any) => d.id !== newRecordDoc.id)];
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save to records archive', err);
    }
  };

  // Execute Approval with Official Seal and Set Release Date
  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();

    const stampTime = new Date().toLocaleString('sw-TZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const certNo = `VER-2026-HT-${Math.floor(10000 + Math.random() * 90000)}`;

    setHasApprovedTermResults(true);
    setApprovalTimestamp(stampTime);
    setSealCertNumber(certNo);
    setShowApprovalModal(false);

    // Save to local storage
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
    }

    // Auto archive to School Secretary / Records
    saveToRecordsArchive(resultsReleaseDate);

    // Trigger Centered Light Blue Notification for PASS
    notifyUser(
      'success',
      'Muhuri Umewekwa na Matokeo Yameidhinishwa!',
      `Muhuri rasmi wa Mwalimu Mkuu umewekwa kikamilifu. Matokeo yamehifadhiwa kwenye Masijala ya Shule (Records) na yatatolewa rasmi kwa wazazi na wanafunzi tarehe: ${resultsReleaseDate} saa ${resultsReleaseTime}.`
    );
  };

  // Reset / Clear Approval to test again
  const handleResetApproval = () => {
    setHasApprovedTermResults(false);
    setApprovalTimestamp(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_APPROVAL_KEY);
      // Remove from records
      try {
        const existingRaw = localStorage.getItem(STORAGE_RECORDS_KEY);
        if (existingRaw) {
          const list = JSON.parse(existingRaw);
          const filtered = list.filter((d: any) => d.id !== 'doc-sealed-results-2026-term1');
          localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(filtered));
        }
      } catch {}
    }

    notifyUser(
      'info',
      'Idhini ya Matokeo Imewekwa Upya',
      'Muhuri umeondolewa na matokeo yamerudishwa kwenye hali ya kusubiri idhini.'
    );
  };

  return (
    <TeacherShell
      pageTitle="Idhini ya Matokeo & Muhuri Rasmi wa Shule"
      pageDescription="Ofisi ya Mwalimu Mkuu: Kuidhinisha broadsheet ya shule nzima, kuweka Muhuri Rasmi wa Kidigitali, na kupanga tarehe ya kutolewa kwa matokeo."
      requiredRole="HEADTEACHER"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Headteacher Executive Authority Card */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-emerald-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Uthibitisho wa Broadsheet ya Muhula wa Kwanza 2026
                </h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    hasApprovedTermResults
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      : 'bg-amber-100 text-amber-950 border-amber-300'
                  }`}
                >
                  {hasApprovedTermResults ? 'Imethibitishwa na Mkuu' : 'Inasubiri Muhuri'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Mwalimu wa Taaluma amekamilisha ukusanyaji na ukokotoaji wa matokeo ya madarasa yote.
                Sasa inahitajika saini na muhuri wako rasmi, pamoja na kupanga tarehe rasmi ya kutolewa kwa matokeo kabla ya kufunguliwa kwa wazazi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!hasApprovedTermResults ? (
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(true)}
                  className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Weka Muhuri na Idhinisha Matokeo</span>
                </button>
              ) : (
                <>
                  <div className="px-4 py-2 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Imewekwa Muhuri ({approvalTimestamp?.split('saa')[0]})</span>
                  </div>

                  <Link
                    href="/teacher/records"
                    className="px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                    title="Angalia waraka huu uliowekwa muhuri kwenye masijala ya shule"
                  >
                    <FolderArchive className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Masijala ya Nyaraka</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleResetApproval}
                    className="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                    title="Ondoa muhuri ili kurudia zoezi la kuidhinisha"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Weka Upya</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ================================================================= */}
          {/* OFFICIAL STAMP & SEAL DISPLAY: VISUAL RUBBER STAMP IMPRESSION */}
          {/* ================================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Mwonekano Rasmi wa Muhuri wa Mwalimu Mkuu (Official Stamp Impression):
              </span>
              {hasApprovedTermResults && (
                <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cheti cha Uthibitisho: {sealCertNumber}</span>
                </span>
              )}
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 border-2 border-emerald-200/90 shadow-sm relative overflow-hidden">
              {/* Watermark Security Line */}
              <div className="absolute top-2 right-4 text-[9px] font-mono text-emerald-800/30 uppercase tracking-widest select-none">
                SECURITY WATERMARK • SECURE TAMPER PROOF SEAL
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* 1. VISUAL CIRCULAR RUBBER STAMP GRAPHIC */}
                <div className="relative group shrink-0">
                  <div
                    className={`w-52 h-52 sm:w-56 sm:h-56 rounded-full border-4 flex flex-col items-center justify-center text-center p-3 transition-all relative select-none ${
                      hasApprovedTermResults
                        ? 'border-emerald-800 bg-emerald-50/40 text-emerald-950 shadow-lg shadow-emerald-950/10 rotate-[-2deg]'
                        : 'border-dashed border-slate-300 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {/* Outer concentric stamp ring */}
                    <div
                      className={`absolute inset-1.5 rounded-full border-2 ${
                        hasApprovedTermResults ? 'border-emerald-700/80' : 'border-slate-200'
                      }`}
                    />

                    {/* Top Curved Text / Header */}
                    <div className="relative z-10 text-[8px] font-black uppercase tracking-wider text-emerald-900 leading-tight">
                      ★ JAMHURI YA MUUNGANO WA TANZANIA ★
                      <div className="text-[7px] text-emerald-800 font-bold tracking-tight">
                        WIZARA YA ELIMU, SAYANSI NA TEKNOLOJIA
                      </div>
                    </div>

                    {/* Center Stamp Core */}
                    <div className="relative z-10 my-1 py-1 px-3 border-y border-emerald-700/70 w-full">
                      <div className="text-[10px] font-black uppercase text-emerald-950 tracking-tight">
                        KUKUMBUKA PRIMARY
                      </div>
                      <div className="text-[8px] font-extrabold uppercase text-emerald-900 tracking-wider">
                        OFISI YA MWALIMU MKUU
                      </div>
                      <div
                        className={`text-[9px] font-black uppercase mt-0.5 px-1 py-0.2 rounded inline-block ${
                          hasApprovedTermResults
                            ? 'bg-emerald-800 text-white tracking-widest'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {hasApprovedTermResults ? '★ APPROVED & SEALED ★' : 'PENDING SEAL'}
                      </div>
                      {hasApprovedTermResults && (
                        <div className="text-[7px] font-mono text-emerald-950 font-bold mt-0.5">
                          {approvalTimestamp?.split('saa')[0] || '2026-03-27'}
                        </div>
                      )}
                    </div>

                    {/* Bottom Curved Text */}
                    <div className="relative z-10 text-[7px] font-black uppercase tracking-wider text-emerald-900 leading-tight">
                      HALMASHAURI YA WILAYA • IDARA YA ELIMU
                      <div className="text-[6.5px] font-mono text-emerald-800 font-bold mt-0.5">
                        REF: {sealCertNumber}
                      </div>
                    </div>
                  </div>

                  {/* Stamp Active Ribbon */}
                  {hasApprovedTermResults && (
                    <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-800 text-amber-200 text-[10px] font-black shadow-md border border-emerald-600 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      <span>MUHURI RASMI</span>
                    </div>
                  )}
                </div>

                {/* 2. OFFICIAL APPROVAL CERTIFICATE & DETAILS */}
                <div className="flex-1 space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Taarifa za Uthibitisho wa Shule
                    </span>
                    <h3 className="text-base font-black text-slate-900">
                      Cheti cha Idhini ya Matokeo • Muhula wa Kwanza 2026
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {hasApprovedTermResults
                        ? `Matokeo haya yamewekwa muhuri rasmi wa Mkuu wa Shule na kurekodiwa katika kumbukumbu za shule. Wazazi na wanafunzi wataweza kuona ripoti kulingana na tarehe iliyopangwa hapa chini.`
                        : `Muhuri haujawekwa bado. Bofya kitufe cha "Weka Muhuri na Idhinisha Matokeo" ili kuchagua tarehe ya kutoa matokeo na kupiga chapa ya muhuri rasmi.`}
                    </p>
                  </div>

                  {/* Date and Authority Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-emerald-200">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Mamlaka ya Idhini:
                      </span>
                      <span className="font-black text-slate-900 text-xs">
                        {currentUser?.fullName || 'Mwl. Augustine Mrosso'}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold block">
                        Mkuu wa Shule (Headteacher)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Tarehe ya Kugongwa Muhuri:
                      </span>
                      <span className="font-bold text-slate-800 text-xs">
                        {hasApprovedTermResults ? approvalTimestamp : 'Bado haijaidhinishwa'}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Namba: {sealCertNumber}
                      </span>
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                          Tarehe Rasmi ya Kutoa Matokeo kwa Wazazi &amp; Wanafunzi:
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Calendar className="w-4 h-4 text-emerald-700" />
                          <strong className="text-emerald-950 font-black text-xs">
                            {resultsReleaseDate} saa {resultsReleaseTime} Asubuhi
                          </strong>
                          {hasApprovedTermResults && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] border border-emerald-300">
                              Imepangwa Kwenye Mfumo
                            </span>
                          )}
                        </div>
                      </div>

                      {hasApprovedTermResults && (
                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                          <Link
                            href="/teacher/records"
                            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] shadow-xs flex items-center gap-1"
                          >
                            <FolderArchive className="w-3.5 h-3.5 text-emerald-200" />
                            <span>Angalia Kwenye Records</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Classes Submitted by Academic Master & Approved */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Madarasa Yaliyowasilishwa na Mwalimu wa Taaluma (Academic Broadsheets)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Masomo 6 ya kila darasa yameunganishwa na kuhakikiwa na AI kabla ya kufika hapa kwa ajili ya muhuri rasmi.
                </p>
              </div>
              <Link
                href="/teacher/broadsheet"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 underline"
              >
                <span>Fungua Broadsheet Kuu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Standard 7 (Grade 7)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[9px] font-black border border-emerald-300">
                    AI Verified ✓
                  </span>
                </div>
                <div className="text-xl font-black text-emerald-900">100% Pass Rate</div>
                <div className="text-[11px] text-emerald-800 font-bold">Watahiniwa 35 • Wastani: 89.2%</div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-emerald-100">
                  <span>Masomo 6 Yameunganishwa</span>
                  <span className="text-emerald-700 font-bold">{hasApprovedTermResults ? 'Imewekwa Muhuri' : 'Inasubiri Muhuri'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Standard 6 (Grade 6)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[9px] font-black border border-emerald-300">
                    AI Verified ✓
                  </span>
                </div>
                <div className="text-xl font-black text-emerald-900">97.1% Pass Rate</div>
                <div className="text-[11px] text-emerald-800 font-bold">Wanafunzi 35 • Wastani: 81.4%</div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-emerald-100">
                  <span>Masomo 6 Yameunganishwa</span>
                  <span className="text-emerald-700 font-bold">{hasApprovedTermResults ? 'Imewekwa Muhuri' : 'Inasubiri Muhuri'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Standard 5 (Grade 5)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[9px] font-black border border-emerald-300">
                    AI Verified ✓
                  </span>
                </div>
                <div className="text-xl font-black text-emerald-900">94.3% Pass Rate</div>
                <div className="text-[11px] text-emerald-800 font-bold">Wanafunzi 35 • Wastani: 78.6%</div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-emerald-100">
                  <span>Masomo 6 Yameunganishwa</span>
                  <span className="text-emerald-700 font-bold">{hasApprovedTermResults ? 'Imewekwa Muhuri' : 'Inasubiri Muhuri'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Standard 4 (Grade 4)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[9px] font-black border border-emerald-300">
                    AI Verified ✓
                  </span>
                </div>
                <div className="text-xl font-black text-emerald-900">97.1% Pass Rate</div>
                <div className="text-[11px] text-emerald-800 font-bold">Watahiniwa 35 • Wastani: 83.5%</div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-emerald-100">
                  <span>Masomo 6 Yameunganishwa</span>
                  <span className="text-emerald-700 font-bold">{hasApprovedTermResults ? 'Imewekwa Muhuri' : 'Inasubiri Muhuri'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Link to Classroom Teaching for Headteacher */}
        <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Unataka Kujaza Alama za Darasa Lako?</h4>
              <p className="text-xs text-slate-500">
                Kama Mwalimu Mkuu unafundisha Standard 6 &amp; 7 (Uraia na Maadili &amp; Maarifa ya Jamii). Bofya hapa kwenda moja kwa moja kwenye ukurasa wa kujaza alama zako.
              </p>
            </div>
          </div>
          <Link
            href="/teacher/marks"
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-colors shadow-xs"
          >
            <span>Kujaza Alama Zangu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ===================================================================== */}
        {/* MODAL: WEKA MUHURI & CHAGUA TAREHE YA KUTOA MATOKEO */}
        {/* ===================================================================== */}
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-emerald-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Idhini ya Mkuu wa Shule &amp; Muhuri Rasmi
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Weka muhuri na panga siku rasmi ya kutoa matokeo kwa wazazi
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmApproval} className="space-y-4 text-xs">
                {/* 1. Release Date & Time Selection */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <label className="block text-[10px] font-black text-emerald-950 uppercase tracking-wider">
                    Siku Gani Matokeo Yatatoka Rasmi kwa Wazazi &amp; Wanafunzi?
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Tarehe ya Kutolewa:
                      </span>
                      <input
                        type="date"
                        required
                        value={resultsReleaseDate}
                        onChange={(e) => setResultsReleaseDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Saa ya Kutolewa:
                      </span>
                      <input
                        type="time"
                        required
                        value={resultsReleaseTime}
                        onChange={(e) => setResultsReleaseTime(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Mara baada ya kupiga muhuri, matokeo yatahifadhiwa kiotomatiki kwenye Masijala ya Shule (Records Archive) na kuanza kuonekana kwenye Portal ya Wazazi kulingana na tarehe hii.
                  </p>
                </div>

                {/* 2. Authority Verification */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Mwenye Kutoa Idhini:
                  </span>
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{currentUser?.fullName || 'Mwl. Augustine Mrosso'}</span>
                    <span className="text-emerald-800 text-[11px]">Mkuu wa Shule</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Kitambulisho cha Kazi: {currentUser?.identifier || 'HT-2026-001'}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowApprovalModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20 flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Piga Muhuri Rasmi &amp; Idhinisha</span>
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
