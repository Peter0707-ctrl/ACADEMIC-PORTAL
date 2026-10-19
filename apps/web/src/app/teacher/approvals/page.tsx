'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  FolderArchive,
  Sparkles,
  RotateCcw,
  Clock,
  Send,
  X,
  Printer,
  QrCode,
  Lock,
  Unlock,
  Users,
  MessageSquare,
  Globe,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

// =============================================================================
// DATA & TYPES: CLASS TARGETS FOR OFFICIAL SEAL & PUBLIC RELEASE
// =============================================================================

export interface ApprovalClassTarget {
  id: string;
  name: string;
  shortName: string;
  level: string;
  totalStudents: number;
  passRate: string;
  average: string;
  stampLabel: string;
}

export interface ClassSealRecord {
  hasApproved: boolean;
  approvalTimestamp: string | null;
  sealCertNumber: string;
  publishingMode: 'IMMEDIATE' | 'SCHEDULED';
  resultsReleaseDate: string;
  resultsReleaseTime: string;
  isPublishedToUsers: boolean;
  publishedTimestamp?: string;
}

// All 8 Primary & Kindergarten Classes + Whole School Option
const APPROVAL_TARGET_CLASSES: ApprovalClassTarget[] = [
  {
    id: 'ALL',
    name: 'Shule Nzima (Madarasa Yote 8: Chekechea hadi La 7)',
    shortName: 'Shule Nzima',
    level: 'Madarasa Yote 8 • Wanafunzi 275',
    totalStudents: 275,
    passRate: '97.8%',
    average: '84.6%',
    stampLabel: 'SHULE NZIMA • GRADES 1–7 & AWALI',
  },
  {
    id: 'std-7',
    name: 'Standard 7 (Grade 7 - Watahiniwa wa Taifa PSLE)',
    shortName: 'Standard 7',
    level: 'Watahiniwa wa Taifa (PSLE)',
    totalStudents: 35,
    passRate: '100%',
    average: '89.2%',
    stampLabel: 'DARASA LA SABA (GRADE 7)',
  },
  {
    id: 'std-6',
    name: 'Standard 6 (Grade 6)',
    shortName: 'Standard 6',
    level: 'Darasa la Sita',
    totalStudents: 35,
    passRate: '97.1%',
    average: '81.4%',
    stampLabel: 'DARASA LA SITA (GRADE 6)',
  },
  {
    id: 'std-5',
    name: 'Standard 5 (Grade 5)',
    shortName: 'Standard 5',
    level: 'Darasa la Tano',
    totalStudents: 35,
    passRate: '94.3%',
    average: '78.6%',
    stampLabel: 'DARASA LA TANO (GRADE 5)',
  },
  {
    id: 'std-4',
    name: 'Standard 4 (Grade 4 - Watahiniwa wa Taifa SFNA)',
    shortName: 'Standard 4',
    level: 'Watahiniwa wa Taifa (SFNA)',
    totalStudents: 35,
    passRate: '97.1%',
    average: '83.5%',
    stampLabel: 'DARASA LA NNE (GRADE 4)',
  },
  {
    id: 'std-3',
    name: 'Standard 3 (Grade 3)',
    shortName: 'Standard 3',
    level: 'Darasa la Tatu',
    totalStudents: 35,
    passRate: '96.0%',
    average: '82.0%',
    stampLabel: 'DARASA LA TATU (GRADE 3)',
  },
  {
    id: 'std-2',
    name: 'Standard 2 (Grade 2)',
    shortName: 'Standard 2',
    level: 'Darasa la Pili (KKK)',
    totalStudents: 35,
    passRate: '98.2%',
    average: '85.3%',
    stampLabel: 'DARASA LA PILI (GRADE 2)',
  },
  {
    id: 'std-1',
    name: 'Standard 1 (Grade 1)',
    shortName: 'Standard 1',
    level: 'Darasa la Kwanza (KKK)',
    totalStudents: 35,
    passRate: '98.5%',
    average: '87.1%',
    stampLabel: 'DARASA LA KWANZA (GRADE 1)',
  },
  {
    id: 'chekechea',
    name: 'Awali / Chekechea (Kindergarten & Pre-Unit)',
    shortName: 'Awali / Chekechea',
    level: 'Elimu ya Awali (Miaka 4–5)',
    totalStudents: 30,
    passRate: '100%',
    average: '92.4%',
    stampLabel: 'ELIMU YA AWALI (CHEKECHEA)',
  },
];

const STORAGE_APPROVAL_MAP_KEY = 'headteacher_results_approval_map_v2';
const STORAGE_RECORDS_KEY = 'school_records_documents_v1';

export default function HeadteacherApprovalsPage() {
  const currentUser = getCurrentSession();

  // Selected Target Class for inspection/stamping
  const [selectedClassId, setSelectedClassId] = useState<string>('std-7');

  // Approval records map per classId (default seeds)
  const [approvalMap, setApprovalMap] = useState<Record<string, ClassSealRecord>>(() => {
    const initialMap: Record<string, ClassSealRecord> = {};
    APPROVAL_TARGET_CLASSES.forEach((cls) => {
      initialMap[cls.id] = {
        hasApproved: false,
        approvalTimestamp: null,
        sealCertNumber: `VER-2026-HT-${Math.floor(10000 + Math.random() * 90000)}`,
        publishingMode: 'SCHEDULED',
        resultsReleaseDate: '2026-03-27',
        resultsReleaseTime: '08:00',
        isPublishedToUsers: false,
      };
    });
    return initialMap;
  });

  // Modal State
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showWhatsAppBroadcastModal, setShowWhatsAppBroadcastModal] = useState(false);

  // Form states in modal
  const [modalTargetClassId, setModalTargetClassId] = useState<string>('std-7');
  const [modalPublishingMode, setModalPublishingMode] = useState<'IMMEDIATE' | 'SCHEDULED'>('SCHEDULED');
  const [modalReleaseDate, setModalReleaseDate] = useState<string>('2026-03-27');
  const [modalReleaseTime, setModalReleaseTime] = useState<string>('08:00');
  const [isApprovalConfirmChecked, setIsApprovalConfirmChecked] = useState<boolean>(false);

  // Target class object in modal
  const modalTargetClassObj = useMemo(() => {
    return APPROVAL_TARGET_CLASSES.find((c) => c.id === modalTargetClassId) || APPROVAL_TARGET_CLASSES[1];
  }, [modalTargetClassId]);

  // Load from local storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_APPROVAL_MAP_KEY);
      if (stored) {
        setApprovalMap(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Save map to local storage
  const saveApprovalMap = (newMap: Record<string, ClassSealRecord>) => {
    setApprovalMap(newMap);
    try {
      localStorage.setItem(STORAGE_APPROVAL_MAP_KEY, JSON.stringify(newMap));
    } catch {}
  };

  // Active Selected Class Object
  const currentClass = useMemo(() => {
    return APPROVAL_TARGET_CLASSES.find((c) => c.id === selectedClassId) || APPROVAL_TARGET_CLASSES[1];
  }, [selectedClassId]);

  // Active Class Seal Status
  const currentSeal: ClassSealRecord = approvalMap[selectedClassId] || {
    hasApproved: false,
    approvalTimestamp: null,
    sealCertNumber: 'VER-2026-HT-08492',
    publishingMode: 'SCHEDULED',
    resultsReleaseDate: '2026-03-27',
    resultsReleaseTime: '08:00',
    isPublishedToUsers: false,
  };

  // Save Approved Results Document to School Records Archive
  const archiveSealedDocument = (targetClass: ApprovalClassTarget, sealData: ClassSealRecord) => {
    if (typeof window === 'undefined') return;
    try {
      const existingRaw = localStorage.getItem(STORAGE_RECORDS_KEY);
      let list = existingRaw ? JSON.parse(existingRaw) : [];

      const newRecordDoc = {
        id: `doc-sealed-${targetClass.id}-2026`,
        title: `Broadsheet Rasmi ya Matokeo: ${targetClass.name} (Yaliyowekwa Muhuri na Mkuu wa Shule)`,
        category: 'Taaluma & Mitihani',
        fileName: `Matokeo_Rasmi_${targetClass.shortName.replace(/\s+/g, '_')}_SEALED.pdf`,
        fileSize: '3.4 MB',
        version: 'v1.0 (Muhuri Rasmi & Saini ya Mkuu)',
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: currentUser?.fullName || 'Mwl. Augustine Mrosso (Mkuu wa Shule)',
        accessLevel: 'PUBLIC',
        status: 'IMETHIBITISHWA_NA_MUHURI',
        referenceNumber: sealData.sealCertNumber,
        releaseDate: sealData.isPublishedToUsers ? 'Tayari Yamechapishwa' : `${sealData.resultsReleaseDate} saa ${sealData.resultsReleaseTime}`,
      };

      list = [newRecordDoc, ...list.filter((d: any) => d.id !== newRecordDoc.id)];
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save to records archive', err);
    }
  };

  // EXECUTE APPROVAL AND SEAL
  const handleConfirmApprovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isApprovalConfirmChecked) {
      notifyUser(
        'warning',
        'Tafadhali Thibitisha Utayari',
        'Lazima uweke tiki kuthibitisha kuwa upo tayari kuidhinisha matokeo ya darasa hili na kupiga Muhuri Rasmi kabla ya kuendelea.'
      );
      return;
    }

    const stampTime = new Date().toLocaleString('sw-TZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const isImmediate = modalPublishingMode === 'IMMEDIATE';
    const certNo = `VER-2026-HT-${Math.floor(10000 + Math.random() * 90000)}`;

    const targetClassObj =
      APPROVAL_TARGET_CLASSES.find((c) => c.id === modalTargetClassId) || APPROVAL_TARGET_CLASSES[1];

    const newMap = { ...approvalMap };

    // If "ALL" was selected, stamp all classes!
    if (modalTargetClassId === 'ALL') {
      APPROVAL_TARGET_CLASSES.forEach((cls) => {
        newMap[cls.id] = {
          hasApproved: true,
          approvalTimestamp: stampTime,
          sealCertNumber: `VER-2026-HT-${Math.floor(10000 + Math.random() * 90000)}`,
          publishingMode: modalPublishingMode,
          resultsReleaseDate: modalReleaseDate,
          resultsReleaseTime: modalReleaseTime,
          isPublishedToUsers: isImmediate,
          publishedTimestamp: isImmediate ? stampTime : undefined,
        };
        archiveSealedDocument(cls, newMap[cls.id]);
      });
    } else {
      newMap[modalTargetClassId] = {
        hasApproved: true,
        approvalTimestamp: stampTime,
        sealCertNumber: certNo,
        publishingMode: modalPublishingMode,
        resultsReleaseDate: modalReleaseDate,
        resultsReleaseTime: modalReleaseTime,
        isPublishedToUsers: isImmediate,
        publishedTimestamp: isImmediate ? stampTime : undefined,
      };
      archiveSealedDocument(targetClassObj, newMap[modalTargetClassId]);
    }

    saveApprovalMap(newMap);
    setSelectedClassId(modalTargetClassId);
    setShowApprovalModal(false);

    notifyUser(
      'success',
      'Muhuri Umewekwa na Matokeo Yameidhinishwa!',
      `Muhuri rasmi umegongwa kwa: ${targetClassObj.name}. Hali ya Uchapishaji: ${
        isImmediate
          ? 'YAMECHAPISHWA SASA HIVI kwa wazazi na wanafunzi!'
          : `Yataratibiwa kufunguka tarehe ${modalReleaseDate} saa ${modalReleaseTime}.`
      }`
    );
  };

  // Immediate Publish Now Action (If currently locked on schedule)
  const handlePublishToUsersImmediately = (classId: string) => {
    const timeNow = new Date().toLocaleString('sw-TZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMap = { ...approvalMap };
    if (classId === 'ALL') {
      APPROVAL_TARGET_CLASSES.forEach((cls) => {
        if (newMap[cls.id]) {
          newMap[cls.id].isPublishedToUsers = true;
          newMap[cls.id].publishedTimestamp = timeNow;
        }
      });
    } else if (newMap[classId]) {
      newMap[classId].isPublishedToUsers = true;
      newMap[classId].publishedTimestamp = timeNow;
    }

    saveApprovalMap(newMap);

    notifyUser(
      'success',
      'Matokeo Yamefunguliwa kwa Wazazi & Wanafunzi!',
      `Matokeo ya ${currentClass.name} sasa yanaonekana rasmi kwenye Portal ya Wazazi na Wanafunzi.`
    );
  };

  // Reset / Clear Seal for testing
  const handleResetSeal = (classId: string) => {
    const newMap = { ...approvalMap };
    if (classId === 'ALL') {
      APPROVAL_TARGET_CLASSES.forEach((cls) => {
        if (newMap[cls.id]) {
          newMap[cls.id].hasApproved = false;
          newMap[cls.id].approvalTimestamp = null;
          newMap[cls.id].isPublishedToUsers = false;
        }
      });
    } else if (newMap[classId]) {
      newMap[classId].hasApproved = false;
      newMap[classId].approvalTimestamp = null;
      newMap[classId].isPublishedToUsers = false;
    }

    saveApprovalMap(newMap);

    notifyUser('info', 'Muhuri Umewekwa Upya', `Matokeo ya ${currentClass.name} yamerudishwa kwenye hali ya kusubiri muhuri.`);
  };

  const isAcademicMaster = currentUser?.role === 'ACADEMIC' || currentUser?.leadershipRole === 'ACADEMIC';

  return (
    <TeacherShell
      pageTitle="Idhini ya Matokeo & Muhuri Rasmi wa Shule"
      pageDescription="Ofisi ya Mwalimu Mkuu & Taaluma: Chagua darasa linalopigiwa muhuri, gonga Muhuri Rasmi wa Kidigitali wa Shule, na panga lini matokeo yataonekana kwenye Portal ya Wazazi na Wanafunzi."
      requiredRole="HEADTEACHER"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Delegated Authority Notice for Academic Master */}
        {isAcademicMaster && (
          <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 shadow-xs">
            <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">
                Mamlaka ya Kaimu Mkuu wa Shule (Delegated Leadership Authority)
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Uko kwenye mfumo kama <strong>{currentUser?.fullName || 'Mwalimu wa Taaluma'}</strong> mwenye idhini maalum ya Mkuu wa Shule ya kuidhinisha, kupiga muhuri rasmi, na kuchapisha matokeo kwa wazazi na wanafunzi wakati Mkuu wa Shule anapokuwa na majukumu mengine au hayupo.
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 1. CLASS PICKER TABS: SPECIFY EXACTLY WHICH CLASS IS BEING SEALED */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                Chagua Darasa Linalopigiwa Muhuri &amp; Uidhinishaji:
              </span>
              <h3 className="text-sm font-black text-slate-800">
                Darasa Linalotazamwa: <strong className="text-emerald-900">{currentClass.name}</strong>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Ufaulu: <strong>{currentClass.passRate}</strong> • Wastani: <strong>{currentClass.average}</strong></span>
            </div>
          </div>

          {/* Compact Pill Tabs for All 8 Classes + Shule Nzima */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {APPROVAL_TARGET_CLASSES.map((cls) => {
              const isSelected = selectedClassId === cls.id;
              const isSealed = approvalMap[cls.id]?.hasApproved;
              const isLive = approvalMap[cls.id]?.isPublishedToUsers;

              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-md shadow-emerald-950/20 scale-[1.02]'
                      : 'bg-emerald-50/40 hover:bg-emerald-100/70 border-emerald-200/80 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-black truncate">{cls.shortName}</span>
                    {isSealed ? (
                      <span className={`text-[8px] font-bold px-1 rounded ${isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-200 text-emerald-900'}`}>
                        ✓ Muhuri
                      </span>
                    ) : (
                      <span className={`text-[8px] px-1 rounded ${isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-amber-100 text-amber-900'}`}>
                        Bado
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[9px] w-full">
                    <span className={isSelected ? 'text-emerald-200 font-bold' : 'text-emerald-800 font-bold'}>
                      {cls.totalStudents} Wanafunzi
                    </span>
                    <span>
                      {isLive ? '🌐 Hewani' : '🔒 Funga'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. OFFICIAL SEAL DISPLAY: DEDICATED TO THE SELECTED CLASS */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-emerald-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-black border border-emerald-300 uppercase tracking-wider">
                  Darasa: {currentClass.shortName}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Uthibitisho wa Matokeo: {currentClass.name}
                </h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    currentSeal.hasApproved
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      : 'bg-amber-100 text-amber-950 border-amber-300'
                  }`}
                >
                  {currentSeal.hasApproved ? 'Imepigwa Muhuri Rasmi' : 'Inasubiri Muhuri'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Kagua matokeo ya <strong>{currentClass.name}</strong>, gonga Muhuri Rasmi wa Kidigitali wa Mkuu wa Shule, na panga lini matokeo yatafunguliwa kwa wazazi na wanafunzi (Public Release).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!currentSeal.hasApproved ? (
                <button
                  type="button"
                  onClick={() => {
                    setModalTargetClassId(selectedClassId);
                    setIsApprovalConfirmChecked(false);
                    setShowApprovalModal(true);
                  }}
                  className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Weka Muhuri wa {currentClass.shortName}</span>
                </button>
              ) : (
                <>
                  <div className="px-4 py-2 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Muhuri Umewekwa ({currentSeal.approvalTimestamp?.split('saa')[0]})</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowWhatsAppBroadcastModal(true)}
                    className="px-4 py-2 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tangazo la WhatsApp kwa Wazazi</span>
                  </button>

                  <Link
                    href="/teacher/records"
                    className="px-3.5 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                    title="Angalia waraka huu uliowekwa muhuri kwenye masijala ya shule"
                  >
                    <FolderArchive className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Masijala</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleResetSeal(selectedClassId)}
                    className="px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                    title="Ondoa muhuri ili kurudia zoezi"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Rudia</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ================================================================= */}
          {/* VISUAL RUBBER STAMP GRAPHIC: CLEARLY SHOWS TARGET CLASS */}
          {/* ================================================================= */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-200/90 shadow-sm relative overflow-hidden">
            {/* Watermark Security Line */}
            <div className="absolute top-2 right-4 text-[9px] font-mono text-emerald-800/30 uppercase tracking-widest select-none">
              SECURITY WATERMARK • OFFICIAL DIGITAL SEAL • {currentClass.shortName}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* 1. CIRCULAR RUBBER STAMP GRAPHIC */}
              <div className="relative group shrink-0">
                <div
                  className={`w-56 h-56 sm:w-60 sm:h-60 rounded-full border-4 flex flex-col items-center justify-center text-center p-3 transition-all relative select-none ${
                    currentSeal.hasApproved
                      ? 'border-emerald-800 bg-emerald-50/40 text-emerald-950 shadow-lg shadow-emerald-950/10 rotate-[-2deg]'
                      : 'border-dashed border-slate-300 bg-slate-50 text-slate-400'
                  }`}
                >
                  {/* Outer concentric stamp ring */}
                  <div
                    className={`absolute inset-1.5 rounded-full border-2 ${
                      currentSeal.hasApproved ? 'border-emerald-700/80' : 'border-slate-200'
                    }`}
                  />

                  {/* Top Curved Text */}
                  <div className="relative z-10 text-[8px] font-black uppercase tracking-wider text-emerald-900 leading-tight">
                    ★ JAMHURI YA MUUNGANO WA TANZANIA ★
                    <div className="text-[7px] text-emerald-800 font-bold tracking-tight">
                      WIZARA YA ELIMU, SAYANSI NA TEKNOLOJIA
                    </div>
                  </div>

                  {/* Center Stamp Core */}
                  <div className="relative z-10 my-1 py-1 px-2 border-y border-emerald-700/70 w-full">
                    <div className="text-[10px] font-black uppercase text-emerald-950 tracking-tight">
                      PRIMARY &amp; NURSERY
                    </div>
                    <div className="text-[7.5px] font-extrabold uppercase text-emerald-900 tracking-wider">
                      OFISI YA MWALIMU MKUU
                    </div>

                    {/* DYNAMIC TARGET CLASS BANNER */}
                    <div className="text-[8.5px] font-black uppercase bg-emerald-200/90 text-emerald-950 px-1.5 py-0.5 rounded my-0.5 tracking-tight border border-emerald-400">
                      {currentClass.stampLabel}
                    </div>

                    <div
                      className={`text-[8.5px] font-black uppercase px-1 py-0.2 rounded inline-block ${
                        currentSeal.hasApproved
                          ? 'bg-emerald-800 text-white tracking-widest'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {currentSeal.hasApproved ? '★ APPROVED & SEALED ★' : 'PENDING SEAL'}
                    </div>

                    {currentSeal.hasApproved && (
                      <div className="text-[7px] font-mono text-emerald-950 font-bold mt-0.5">
                        {currentSeal.approvalTimestamp?.split('saa')[0] || '2026-03-27'}
                      </div>
                    )}
                  </div>

                  {/* Bottom Curved Text */}
                  <div className="relative z-10 text-[7px] font-black uppercase tracking-wider text-emerald-900 leading-tight">
                    HALMASHAURI YA WILAYA • IDARA YA ELIMU
                    <div className="text-[6.5px] font-mono text-emerald-800 font-bold mt-0.5">
                      REF: {currentSeal.sealCertNumber}
                    </div>
                  </div>
                </div>

                {/* Stamp Active Ribbon */}
                {currentSeal.hasApproved && (
                  <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-800 text-amber-200 text-[10px] font-black shadow-md border border-emerald-600 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>MUHURI RASMI</span>
                  </div>
                )}
              </div>

              {/* 2. OFFICIAL DETAILS & PUBLISHING STATUS TO USERS */}
              <div className="flex-1 space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Uthibitisho wa Shule &amp; Ufunguzi kwa Umma (Public Release)
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    Cheti cha Idhini ya Matokeo: {currentClass.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {currentSeal.hasApproved
                      ? `Matokeo ya ${currentClass.name} yamewekwa muhuri rasmi wa Mkuu wa Shule. Hapa chini ni hadhi ya lini na namna wazazi na wanafunzi wanavyoona ripoti zao.`
                      : `Muhuri haujawekwa bado kwa darasa hili. Bofya "Weka Muhuri wa ${currentClass.shortName}" ili kupiga chapa ya muhuri na kuchagua namna matokeo yatakavyoonekana kwa wazazi.`}
                  </p>
                </div>

                {/* Authority & Publishing Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-emerald-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Darasa Lililoidhinishwa:
                    </span>
                    <strong className="text-slate-900 text-xs block font-black">
                      {currentClass.name}
                    </strong>
                    <span className="text-[10px] text-emerald-800 font-semibold block">
                      Wanafunzi {currentClass.totalStudents} • Wastani: {currentClass.average}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Tarehe ya Kugongwa Muhuri:
                    </span>
                    <strong className="text-slate-800 text-xs block font-bold">
                      {currentSeal.hasApproved ? currentSeal.approvalTimestamp : 'Bado haijaidhinishwa'}
                    </strong>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      Namba: {currentSeal.sealCertNumber}
                    </span>
                  </div>

                  {/* PUBLISHING STATUS TO USERS BANNER */}
                  <div className="sm:col-span-2 pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Matokeo Yataonekana Lini kwa Wazazi &amp; Wanafunzi? (Release to Users Policy):
                    </span>

                    {currentSeal.hasApproved ? (
                      currentSeal.isPublishedToUsers ? (
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                              <Unlock className="w-4 h-4 text-emerald-200" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <strong className="text-emerald-950 font-black text-xs">
                                  ✓ YAMECHAPISHWA SASA HIVI (PUBLISHED TO USERS)
                                </strong>
                              </div>
                              <p className="text-[11px] text-emerald-800 mt-0.5">
                                Wazazi na wanafunzi wa {currentClass.shortName} wanaweza kuona ripoti zao sasa hivi kupitia Portal ya Mzazi (`/parent`).
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowWhatsAppBroadcastModal(true)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold shrink-0 flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Tuma WhatsApp</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                              <Lock className="w-4 h-4 text-amber-100" />
                            </div>
                            <div>
                              <strong className="text-amber-950 font-black text-xs block">
                                🔒 YAMEFUNGWA • YATAFUNGUKA: {currentSeal.resultsReleaseDate} saa {currentSeal.resultsReleaseTime} Asubuhi
                              </strong>
                              <p className="text-[11px] text-amber-900 mt-0.5">
                                Wazazi wakifungua portal sasa wanaona kadi yenye kufuli 🔒 na countdown ya siku na masaa yaliyobaki.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handlePublishToUsersImmediately(selectedClassId)}
                            className="px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-bold shrink-0 flex items-center gap-1 shadow-2xs"
                            title="Bofya kufungua matokeo mara moja bila kusubiri tarehe ya ratiba"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Fungua Matokeo Sasa Hivi</span>
                          </button>
                        </div>
                      )
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">
                        Baada ya kupiga muhuri, unaweza kuchagua kuyafungua papo hapo kwa wazazi au kupanga tarehe na saa maalum ya ufunguzi.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. ALL CLASSES OVERVIEW GRID (ACADEMIC BROADSHEETS STATUS) */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Madarasa Yote 8 ya Shule Yaliyowasilishwa na Mwalimu wa Taaluma
              </h4>
              <p className="text-[11px] text-slate-500">
                Kila darasa limeunganishwa na AI na linasubiri idhini na muhuri wa Mkuu wa Shule kabla ya kutoa matokeo.
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
            {APPROVAL_TARGET_CLASSES.filter((c) => c.id !== 'ALL').map((cls) => {
              const record = approvalMap[cls.id];
              const isSealed = record?.hasApproved;
              const isLive = record?.isPublishedToUsers;
              const isCurrent = selectedClassId === cls.id;

              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isCurrent
                      ? 'border-emerald-800 bg-emerald-50/80 shadow-md ring-2 ring-emerald-700/20'
                      : 'border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">{cls.name.split('(')[0]}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                        isSealed
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                          : 'bg-amber-100 text-amber-950 border-amber-300'
                      }`}
                    >
                      {isSealed ? 'Imewekwa Muhuri ✓' : 'Inasubiri'}
                    </span>
                  </div>

                  <div className="text-xl font-black text-emerald-900">{cls.passRate} Pass Rate</div>
                  <div className="text-[11px] text-emerald-800 font-bold">
                    {cls.totalStudents} Wanafunzi • Wastani: {cls.average}
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1.5 border-t border-emerald-100">
                    <span>Hali kwa Wazazi:</span>
                    <span className={`font-bold ${isLive ? 'text-emerald-700' : 'text-amber-800'}`}>
                      {isLive ? '🌐 Yamechapishwa' : '🔒 Yamefungwa'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MODAL 1: WEKA MUHURI & CHAGUA DARASA NA SIKU YA KUTOA MATOKEO */}
        {/* ===================================================================== */}
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-emerald-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-in">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Idhini ya Mkuu wa Shule &amp; Kupiga Muhuri
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Chagua darasa linalopigiwa muhuri na lini matokeo yataonekana kwa wazazi
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmApprovalSubmit} className="space-y-4 text-xs">
                {/* 1. Target Class Selection */}
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase mb-1">
                    1. Ni Darasa Gani Unalolipigia Muhuri Rasmi Sasa Hivi? *
                  </label>
                  <select
                    value={modalTargetClassId}
                    onChange={(e) => setModalTargetClassId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {APPROVAL_TARGET_CLASSES.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.totalStudents} Wanafunzi • Wastani: {cls.average})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. SWALI LA UTAYARI (READINESS CHECK PROMPT) */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-amber-950 font-black">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>❓ JE, UPO TAYARI KUIDHINISHA MATOKEO YA DARASA HILI?</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Kama Mkuu wa Shule, unathibitisha kuwa walimu wote wa masomo wamekamilisha uwekaji wa alama, broadsheet imehakikiwa na Mwalimu wa Taaluma, na hakuna hitilafu yoyote kabla ya kupiga Muhuri Rasmi:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-bold">
                    <div className="p-2 rounded-xl bg-white border border-amber-200">
                      <span className="text-[9px] uppercase text-slate-500 block">Darasa</span>
                      <span className="text-slate-900 text-xs font-black">{modalTargetClassObj.shortName}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200">
                      <span className="text-[9px] uppercase text-slate-500 block">Wanafunzi</span>
                      <span className="text-slate-900 text-xs font-black">{modalTargetClassObj.totalStudents}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200">
                      <span className="text-[9px] uppercase text-slate-500 block">Wastani</span>
                      <span className="text-emerald-800 text-xs font-black">{modalTargetClassObj.average}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200">
                      <span className="text-[9px] uppercase text-slate-500 block">Masomo</span>
                      <span className="text-slate-900 text-xs font-black">6 / 6 Yamekamilika</span>
                    </div>
                  </div>
                </div>

                {/* 3. Publishing Policy to Users */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <label className="block text-[10px] font-black text-emerald-950 uppercase tracking-wider">
                    3. Matokeo Yataonekana Lini kwa Wazazi &amp; Wanafunzi? (Publishing Policy)
                  </label>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-emerald-200 cursor-pointer">
                      <input
                        type="radio"
                        name="publishingMode"
                        checked={modalPublishingMode === 'IMMEDIATE'}
                        onChange={() => setModalPublishingMode('IMMEDIATE')}
                        className="w-4 h-4 text-emerald-700 focus:ring-emerald-500"
                      />
                      <div>
                        <strong className="text-slate-900 block font-bold">
                          Chapisha Papo Hapo (Publish Immediately to Parents &amp; Students)
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          Mara baada ya kupiga muhuri, wazazi wanaweza kuona ripoti zao portal mara moja.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-emerald-200 cursor-pointer">
                      <input
                        type="radio"
                        name="publishingMode"
                        checked={modalPublishingMode === 'SCHEDULED'}
                        onChange={() => setModalPublishingMode('SCHEDULED')}
                        className="w-4 h-4 text-emerald-700 focus:ring-emerald-500"
                      />
                      <div>
                        <strong className="text-slate-900 block font-bold">
                          Ratibu Siku na Saa Maalum ya Ufunguzi (Scheduled Public Release)
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          Matokeo yatalindwa na kufuli 🔒 hadi tarehe rasmi ya kufungua ifike.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Scheduled Date Pickers if Scheduled mode chosen */}
                  {modalPublishingMode === 'SCHEDULED' && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Tarehe ya Kutoa Matokeo:
                        </span>
                        <input
                          type="date"
                          required
                          value={modalReleaseDate}
                          onChange={(e) => setModalReleaseDate(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white border border-emerald-300 font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Saa ya Kutoa Matokeo:
                        </span>
                        <input
                          type="time"
                          required
                          value={modalReleaseTime}
                          onChange={(e) => setModalReleaseTime(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white border border-emerald-300 font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Headteacher Authority */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Mamlaka ya Idhini:</span>
                    <strong className="text-slate-900 font-bold">{currentUser?.fullName || 'Mwl. Augustine Mrosso'}</strong>
                    <span className="text-[10px] text-emerald-800 block">Mkuu wa Shule (Headteacher)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">HT-2026-001</span>
                </div>

                {/* 5. RIDHAA YA UTAYARI (MANDATORY CONFIRMATION CHECKBOX) */}
                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-300/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isApprovalConfirmChecked}
                    onChange={(e) => setIsApprovalConfirmChecked(e.target.checked)}
                    className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500 mt-0.5"
                  />
                  <span className="text-[11px] text-slate-800 leading-snug">
                    <strong>Ndio, nipo tayari:</strong> Nimethibitisha usahihi wa matokeo ya <strong>{modalTargetClassObj.name}</strong> na niko tayari kuweka Muhuri Rasmi na ratiba ya kutoa matokeo kwa wazazi.
                  </span>
                </label>

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
                    disabled={!isApprovalConfirmChecked}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs shadow-md flex items-center gap-2 transition-all ${
                      isApprovalConfirmChecked
                        ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-950/20 hover:scale-[1.02]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Award className={`w-4 h-4 ${isApprovalConfirmChecked ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span>Ndio, Weka Muhuri &amp; Idhinisha (OK)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 2: WHATSAPP / SMS BROADCAST TO PARENTS ABOUT RESULTS */}
        {/* ===================================================================== */}
        {showWhatsAppBroadcastModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-emerald-200 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Tangazo la Matokeo kwa Wazazi (WhatsApp &amp; SMS)
                    </h3>
                    <p className="text-xs text-slate-500">Mwalimu Mkuu anawajulisha wazazi matokeo yapo tayari</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWhatsAppBroadcastModal(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 font-mono text-[11px] text-slate-800 leading-relaxed space-y-2">
                  <p>
                    <strong>PRIMARY &amp; NURSERY SCHOOL - TAARIFA RASMI YA MATOKEO</strong>
                  </p>
                  <p>
                    Ndugu Wazazi na Walezi wa <strong>{currentClass.name}</strong>,
                  </p>
                  <p>
                    Mwalimu Mkuu anapenda kuwataarifu kuwa matokeo ya mitihani ya Muhula wa 1 yamekamilika na kupigwa Muhuri Rasmi wa Shule (Ref: {currentSeal.sealCertNumber}).
                  </p>
                  <p>
                    {currentSeal.isPublishedToUsers
                      ? 'Ripoti za maendeleo ya mwanao sasa ziko hewani! Unaweza kuingia kwenye Portal ya Mzazi (/parent) na kupakua ripoti ya mwanao.'
                      : `Matokeo yatafunguliwa rasmi tarehe ${currentSeal.resultsReleaseDate} saa ${currentSeal.resultsReleaseTime} Asubuhi.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Funga
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const message = encodeURIComponent(
                      `PRIMARY & NURSERY SCHOOL - TAARIFA RASMI YA MATOKEO\n\nNdugu Wazazi wa ${currentClass.name},\nMatokeo ya Muhula wa 1 yamekaguliwa na kuwekwa Muhuri Rasmi wa Mkuu wa Shule (Ref: ${currentSeal.sealCertNumber}).\n\nRipoti sasa zipo tayari kwenye Portal ya Wazazi. Tafadhali tembelea portal ya shule kuona matokeo ya mwanao.`
                    );
                    window.open(`https://wa.me/?text=${message}`, '_blank');
                    setShowWhatsAppBroadcastModal(false);
                    notifyUser('success', 'Tangazo Limetumwa!', `Ujumbe wa matokeo ya ${currentClass.name} umetumwa kwa wazazi.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tuma Tangazo WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
