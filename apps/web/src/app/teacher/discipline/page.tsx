'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  UserCheck,
  Check,
  Mail,
  AlertCircle,
  FileCheck,
  Send,
  Eye,
  MessageSquare,
  Users,
  FolderArchive,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  X,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';
import { INITIAL_INCIDENTS, DisciplineIncident } from '@/lib/teacher-data';

// =============================================================================
// INTERFACES FOR DAILY ATTENDANCE & TRUANCY TRANSMISSION
// =============================================================================

export interface AbsentPupilDetail {
  admNo: string;
  name: string;
  gender: 'M' | 'F';
  daysAbsent: number;
  reason: string;
  parentPhone: string;
  parentNotified: boolean;
}

export interface ClassDailyAttendanceFeed {
  id: string;
  className: string;
  classTeacherName: string;
  date: string;
  timeSubmitted: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED_AND_RECORDED';
  confirmedBy?: string;
  confirmedAt?: string;
  recordRefNo?: string;
  absentees: AbsentPupilDetail[];
}

const STORAGE_ATTENDANCE_KEY = 'daily_attendance_submissions_v1';
const STORAGE_RECORDS_KEY = 'school_records_documents_v1';

// Default initial feeds for the 4 core classes
const INITIAL_DAILY_FEEDS: ClassDailyAttendanceFeed[] = [
  {
    id: 'att-std6-2026-10-02',
    className: 'Standard 6 (Grade 6)',
    classTeacherName: 'Mwl. David Mrema (Mwalimu wa Darasa)',
    date: '2026-10-02',
    timeSubmitted: '07:45 Asubuhi',
    totalStudents: 35,
    presentCount: 33,
    absentCount: 2,
    attendanceRate: 94.3,
    status: 'PENDING_CONFIRMATION',
    absentees: [
      {
        admNo: 'PUP-2026-066',
        name: 'Zuwena Athumani',
        gender: 'F',
        daysAbsent: 1,
        reason: 'Bila taarifa (Hakuna taarifa kutoka kwa mzazi)',
        parentPhone: '+255 754 112 006',
        parentNotified: false,
      },
      {
        admNo: 'PUP-2026-073',
        name: 'Ismail Ally Seif',
        gender: 'M',
        daysAbsent: 2,
        reason: 'Hakuna taarifa (Utoro wa siku ya pili)',
        parentPhone: '+255 754 112 013',
        parentNotified: false,
      },
    ],
  },
  {
    id: 'att-std4-2026-10-02',
    className: 'Standard 4 (Grade 4)',
    classTeacherName: 'Mwl. Rehema Mushi (Mwalimu wa Darasa)',
    date: '2026-10-02',
    timeSubmitted: '07:50 Asubuhi',
    totalStudents: 35,
    presentCount: 34,
    absentCount: 1,
    attendanceRate: 97.1,
    status: 'PENDING_CONFIRMATION',
    absentees: [
      {
        admNo: 'SFNA-2026-0114',
        name: 'Saidi Mohamed (Candidate)',
        gender: 'M',
        daysAbsent: 3,
        reason: 'Utoro sugu wa siku 3 mfululizo bila taarifa',
        parentPhone: '+255 754 441 003',
        parentNotified: true,
      },
    ],
  },
  {
    id: 'att-std5-2026-10-02',
    className: 'Standard 5 (Grade 5)',
    classTeacherName: 'Mwl. Emmanuel Lyimo (Mwalimu wa Darasa)',
    date: '2026-10-02',
    timeSubmitted: '08:00 Asubuhi',
    totalStudents: 35,
    presentCount: 34,
    absentCount: 1,
    attendanceRate: 97.1,
    status: 'PENDING_CONFIRMATION',
    absentees: [
      {
        admNo: 'PUP-2026-004',
        name: 'Dorothy Michael',
        gender: 'F',
        daysAbsent: 2,
        reason: 'Kuchelewa na kutofika darasani bila taarifa',
        parentPhone: '+255 754 331 004',
        parentNotified: false,
      },
    ],
  },
  {
    id: 'att-std7-2026-10-02',
    className: 'Standard 7 (Grade 7)',
    classTeacherName: 'Mwl. Beatrice Kimaro (Academic Master)',
    date: '2026-10-02',
    timeSubmitted: '07:40 Asubuhi',
    totalStudents: 35,
    presentCount: 34,
    absentCount: 1,
    attendanceRate: 97.1,
    status: 'PENDING_CONFIRMATION',
    absentees: [
      {
        admNo: 'PSLE-2026-0436',
        name: 'Ian Geoffrey (Candidate)',
        gender: 'M',
        daysAbsent: 1,
        reason: 'Hakuna taarifa (Mtoro asubuhi ya leo)',
        parentPhone: '+255 754 221 009',
        parentNotified: false,
      },
    ],
  },
];

export default function DisciplineAndAttendancePage() {
  const currentUser = getCurrentSession();

  // Daily Feeds State
  const [dailyFeeds, setDailyFeeds] = useState<ClassDailyAttendanceFeed[]>(INITIAL_DAILY_FEEDS);
  const [incidents, setIncidents] = useState<DisciplineIncident[]>(INITIAL_INCIDENTS);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  // New incident modal
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [newPupilName, setNewPupilName] = useState('');
  const [newClass, setNewClass] = useState('Standard 6 (Grade 6)');
  const [newIssue, setNewIssue] = useState('Utoro sugu bila taarifa ya mzazi');
  const [newAction, setNewAction] = useState('Barua ya wito kwa mzazi imetolewa');

  // Load submissions from localStorage if available
  useEffect(() => {
    try {
      const storedRaw = localStorage.getItem(STORAGE_ATTENDANCE_KEY);
      if (storedRaw) {
        const stored = JSON.parse(storedRaw);
        setDailyFeeds((prev) => {
          const updated = [...prev];
          Object.values(stored).forEach((sub: any) => {
            const idx = updated.findIndex((f) => f.className === sub.className);
            if (idx !== -1) {
              updated[idx] = {
                ...updated[idx],
                presentCount: sub.presentCount,
                absentCount: sub.absentCount,
                attendanceRate: sub.attendanceRate,
                timeSubmitted: sub.timeSubmitted,
                absentees: sub.absentees || updated[idx].absentees,
              };
            }
          });
          return updated;
        });
      }
    } catch {}
  }, []);

  // Save confirmed attendance document to School Records Archive
  const saveConfirmedAttendanceToRecords = (feed: ClassDailyAttendanceFeed, confirmedByStr: string, refNo: string) => {
    try {
      const existingRaw = localStorage.getItem(STORAGE_RECORDS_KEY);
      let list = existingRaw ? JSON.parse(existingRaw) : [];

      const newRecordDoc = {
        id: `doc-attendance-${feed.className.toLowerCase().replace(/[^a-z0-9]/g, '')}-${feed.date}`,
        title: `Ripoti Rasmi ya Mahudhurio & Utoro - ${feed.className} (${feed.date})`,
        category: 'Nidhamu & Mahudhurio',
        fileName: `Mahudhurio_${feed.className.replace(/\s+/g, '_')}_${feed.date}_CONFIRMED.pdf`,
        fileSize: '1.2 MB',
        version: 'v1.0 (Imethibitishwa na Mkuu / Nidhamu)',
        uploadDate: feed.date,
        uploadedBy: confirmedByStr,
        accessLevel: 'STAFF_ONLY',
        status: 'IMETHIBITISHWA_KAMA_KUMBUKUMBU',
        referenceNumber: refNo,
      };

      list = [newRecordDoc, ...list.filter((d: any) => d.id !== newRecordDoc.id)];
      localStorage.setItem(STORAGE_RECORDS_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save attendance record to archive', err);
    }
  };

  // ACTION 1: CONFIRM DAILY CLASS ATTENDANCE & ARCHIVE AS PERMANENT RECORD
  const handleConfirmAndArchiveAttendance = (feedId: string) => {
    const timeNow = new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });
    const userTitle =
      currentUser?.role === 'HEADTEACHER'
        ? `${currentUser.fullName} (Mkuu wa Shule)`
        : currentUser?.role === 'DISCIPLINE'
        ? `${currentUser.fullName} (Mwalimu wa Nidhamu)`
        : `${currentUser?.fullName || 'Uongozi wa Shule'}`;

    const refNo = `REC-ATT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let confirmedClass = '';

    setDailyFeeds((prev) =>
      prev.map((f) => {
        if (f.id === feedId) {
          confirmedClass = f.className;
          // Archive to School Records
          saveConfirmedAttendanceToRecords(f, userTitle, refNo);

          // If there is any student with 3+ days absent, auto add to Incident register
          f.absentees.forEach((abs) => {
            if (abs.daysAbsent >= 3) {
              const alreadyIn = incidents.some((inc) => inc.pupilName.includes(abs.name));
              if (!alreadyIn) {
                setIncidents((curr) => [
                  {
                    id: `inc-auto-${Date.now()}-${abs.admNo}`,
                    date: f.date,
                    pupilName: abs.name,
                    class: f.className,
                    issue: `Utoro sugu (${abs.daysAbsent} siku mfululizo bila taarifa)`,
                    actionTaken: 'Wito wa dharura kwa mzazi kupitia SMS & Barua',
                    parentContacted: true,
                    status: 'PENDING',
                  },
                  ...curr,
                ]);
              }
            }
          });

          return {
            ...f,
            status: 'CONFIRMED_AND_RECORDED' as const,
            confirmedBy: userTitle,
            confirmedAt: timeNow,
            recordRefNo: refNo,
          };
        }
        return f;
      })
    );

    // Centered Light Blue Notification for PASS
    notifyUser(
      'success',
      'Taarifa ya Utoro Imethibitishwa na Kurekodiwa!',
      `Uhakiki wa mahudhurio ya ${confirmedClass} umekamilika. Taarifa imehifadhiwa rasmi kwenye Masijala ya Nyaraka za Shule (Records Archive) na kurekodiwa katika Daftari Kuu.`
    );

    setActiveNotice(
      `Mahudhurio ya ${confirmedClass} yamethibitishwa na kuhifadhiwa kwenye Masijala ya Shule (Ref: ${refNo}).`
    );
  };

  // ACTION 2: SEND SMS SUMMONS TO ABSENT PUPIL'S PARENT
  const handleSendParentSMS = (feedId: string, pupilName: string, phone: string) => {
    setDailyFeeds((prev) =>
      prev.map((f) => {
        if (f.id === feedId) {
          return {
            ...f,
            absentees: f.absentees.map((p) =>
              p.name === pupilName ? { ...p, parentNotified: true } : p
            ),
          };
        }
        return f;
      })
    );

    // Centered Light Blue Notification for PASS
    notifyUser(
      'success',
      'Ujumbe wa SMS Umetumwa kwa Mzazi!',
      `SMS rasmi ya taarifa ya utoro wa mwanafunzi ${pupilName} imetumwa moja kwa moja kwa mzazi wake kwenye namba ${phone}.`
    );
  };

  // ACTION 3: RESOLVE DISCIPLINE CASE
  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'RESOLVED' as const } : inc))
    );
    notifyUser(
      'success',
      'Kesi ya Nidhamu Imetatuliwa!',
      'Suala la nidhamu limetatuliwa kikamilifu baada ya mazungumzo na mzazi na mwanafunzi.'
    );
  };

  // ACTION 4: CREATE NEW INCIDENT
  const handleCreateNewIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPupilName.trim()) return;

    const newInc: DisciplineIncident = {
      id: `inc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      pupilName: newPupilName,
      class: newClass,
      issue: newIssue,
      actionTaken: newAction,
      parentContacted: true,
      status: 'PENDING',
    };

    setIncidents((prev) => [newInc, ...prev]);
    setShowNewIncidentModal(false);
    setNewPupilName('');

    notifyUser(
      'success',
      'Tukio la Nidhamu Limesajiliwa!',
      `Tukio la mwanafunzi ${newPupilName} (${newClass}) limesajiliwa kwenye Daftari Kuu la Nidhamu.`
    );
  };

  // Compute Overall Live School Attendance Metrics
  const totalSchoolPupils = dailyFeeds.reduce((acc, f) => acc + f.totalStudents, 0);
  const totalSchoolPresent = dailyFeeds.reduce((acc, f) => acc + f.presentCount, 0);
  const totalSchoolAbsent = dailyFeeds.reduce((acc, f) => acc + f.absentCount, 0);
  const schoolAttendancePercent =
    totalSchoolPupils > 0 ? ((totalSchoolPresent / totalSchoolPupils) * 100).toFixed(1) : '96.4';

  return (
    <TeacherShell
      pageTitle="Nidhamu ya Shule, Mahudhurio & Ufuatiliaji wa Utoro"
      pageDescription="Ofisi ya Mwalimu Mkuu & Mwalimu wa Nidhamu: Mapokezi ya kila siku ya mahudhurio kutoka kwa walimu wa madarasa, uthibitisho wa utoro, kurekodi kwenye Masijala ya Shule, na mawasiliano ya dharura na wazazi."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Notice alert */}
        {activeNotice && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="font-bold">{activeNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveNotice(null)}
              className="text-xs font-bold text-emerald-900 hover:underline shrink-0"
            >
              Funga
            </button>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 1. TOP SUMMARY METRICS (SCHOOL-WIDE LIVE ATTENDANCE & TRUANCY) */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Mahudhurio ya Shule Nzima Leo
            </span>
            <span className="text-2xl font-black text-emerald-800 block mt-1">
              {schoolAttendancePercent}% Leo
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">
              Wanafunzi {totalSchoolPresent} kati ya {totalSchoolPupils}
            </span>
          </div>

          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">
              Wanafunzi Watoro Leo
            </span>
            <span className="text-2xl font-black text-rose-600 block mt-1">
              {totalSchoolAbsent} Wanafunzi
            </span>
            <span className="text-[11px] text-rose-700 font-semibold">
              Wameripotiwa na Walimu wa Madarasa
            </span>
          </div>

          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">
              Wito wa Wazazi &amp; SMS
            </span>
            <span className="text-2xl font-black text-amber-600 block mt-1">
              {dailyFeeds.reduce((acc, f) => acc + f.absentees.filter((a) => a.parentNotified).length, 0) + 3} Ujumbe
            </span>
            <span className="text-[11px] text-amber-700 font-semibold">
              Zimetumwa kwa njia ya SMS &amp; Barua
            </span>
          </div>

          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
              Masuala Yaliyotatuliwa
            </span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">
              {incidents.filter((i) => i.status === 'RESOLVED').length + 11} Muhula Huu
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Ushauri nasaha umefanyika
            </span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. DAILY LIVE TRUANCY & ATTENDANCE TRANSMISSION FEED (DIRECT FROM TEACHERS) */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-[10px] border border-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Mapokezi ya Kila Siku (Daily Attendance Feed)</span>
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Madarasa Yote 4 Yamewasilisha
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                Taarifa za Utoro Zilizowasilishwa na Walimu wa Madarasa Leo
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Kila mwalimu wa darasa anapojaza mahudhurio, ripoti inafika hapa moja kwa moja kwa Mwalimu Mkuu na Mwalimu wa Nidhamu. Bofya "Thibitisha Kuona &amp; Hifadhi Kwenye Records" ili kurekodi rasmi kwenye Masijala ya Shule.
              </p>
            </div>

            <Link
              href="/teacher/attendance"
              className="px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Fungua Rejista ya Darasa</span>
            </Link>
          </div>

          {/* Daily Class Feeds Grid */}
          <div className="space-y-4">
            {dailyFeeds.map((feed) => {
              const isConfirmed = feed.status === 'CONFIRMED_AND_RECORDED';
              return (
                <div
                  key={feed.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isConfirmed
                      ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                      : 'bg-white border-slate-200 shadow-xs hover:border-emerald-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Class Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900">{feed.className}</h3>
                        <span className="text-xs text-slate-500 font-medium">• {feed.classTeacherName}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          Saa {feed.timeSubmitted}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-emerald-800 font-bold">
                          Waliopo: <strong>{feed.presentCount}/{feed.totalStudents}</strong> ({feed.attendanceRate}%)
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-rose-700 font-bold">
                          Watoro Leo: <strong>{feed.absentCount} Wanafunzi</strong>
                        </span>
                      </div>
                    </div>

                    {/* Status & Confirmation Actions */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {isConfirmed ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-700" />
                            <span>Imethibitishwa &amp; Kuhifadhiwa Records</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {feed.confirmedBy?.split('(')[0]} ({feed.confirmedAt})
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConfirmAndArchiveAttendance(feed.id)}
                          className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                          title="Thibitisha kwamba umeona ripoti hii ya utoro na ihifadhi rasmi kama kumbukumbu kwenye Masijala ya Shule"
                        >
                          <FileCheck className="w-4 h-4 text-amber-300" />
                          <span>Thibitisha Kuona &amp; Hifadhi Kwenye Records</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Absentees Detail List (Wanafunzi Watoro wa Darasa Hili) */}
                  {feed.absentees.length > 0 ? (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Orodha ya Wanafunzi Watoro na Hatua za Dharura:
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {feed.absentees.map((pupil) => (
                          <div
                            key={pupil.admNo}
                            className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <strong className="text-slate-900 font-black">{pupil.name}</strong>
                                <span className="text-[10px] font-mono text-slate-500">({pupil.admNo})</span>
                                <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-900 font-bold text-[9px]">
                                  Siku {pupil.daysAbsent}
                                </span>
                              </div>
                              <p className="text-[11px] text-rose-800 font-medium mt-0.5">
                                Sababu: {pupil.reason}
                              </p>
                              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                                Simu ya Mzazi: {pupil.parentPhone}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {pupil.parentNotified ? (
                                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span>SMS Imetumwa</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSendParentSMS(feed.id, pupil.name, pupil.parentPhone)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[10px] shadow-xs flex items-center gap-1 transition-colors"
                                  title="Tuma ujumbe wa SMS kwa mzazi wa mwanafunzi huyu kutoa taarifa ya utoro"
                                >
                                  <Send className="w-3 h-3 text-emerald-200" />
                                  <span>Tuma SMS ya Utoro</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Hakuna mwanafunzi mtoro leo katika darasa hili. Wote wapo darasani.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. OFFICIAL DISCIPLINARY INCIDENTS & SUMMONS REGISTER */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Daftari Rasmi la Makosa ya Nidhamu &amp; Hatua Zilizochukuliwa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rekodi zote za utoro sugu, ukiukwaji wa miiko ya shule, na wito rasmi wa wazazi huandikwa hapa kwa hatua za kinidhamu.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowNewIncidentModal(true)}
              className="px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all self-start sm:self-auto hover:scale-[1.02]"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Sajili Tukio Jipya la Nidhamu</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Tarehe</th>
                  <th className="py-3 px-4">Jina la Mwanafunzi</th>
                  <th className="py-3 px-3">Darasa</th>
                  <th className="py-3 px-4">Kosa / Suala Lililoripotiwa</th>
                  <th className="py-3 px-4">Hatua Iliyochukuliwa</th>
                  <th className="py-3 px-3 text-center">Mzazi Amejulishwa?</th>
                  <th className="py-3 px-3 text-center">Hali</th>
                  <th className="py-3 px-3 text-center">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{inc.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{inc.pupilName}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{inc.class}</td>
                    <td className="py-3 px-4 text-rose-700 font-semibold">{inc.issue}</td>
                    <td className="py-3 px-4 text-slate-700">{inc.actionTaken}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inc.parentContacted
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {inc.parentContacted ? 'Ndio (SMS)' : 'Bado'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          inc.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}
                      >
                        {inc.status === 'RESOLVED' ? 'YAMETATULIWA' : 'INASHUGHULIKIWA'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {inc.status !== 'RESOLVED' ? (
                        <button
                          type="button"
                          onClick={() => handleResolveIncident(inc.id)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] transition-colors shadow-2xs"
                        >
                          Funga Suala
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MODAL: SAJILI TUKIO JIPYA LA NIDHAMU */}
        {/* ===================================================================== */}
        {showNewIncidentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-emerald-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-black text-slate-900">Sajili Kosa la Nidhamu</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewIncidentModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateNewIncident} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jina la Mwanafunzi</label>
                  <input
                    type="text"
                    required
                    value={newPupilName}
                    onChange={(e) => setNewPupilName(e.target.value)}
                    placeholder="Mfn. Baraka Juma Mshana"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Darasa</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="Standard 7 (Grade 7)">Standard 7 (Grade 7)</option>
                    <option value="Standard 6 (Grade 6)">Standard 6 (Grade 6)</option>
                    <option value="Standard 5 (Grade 5)">Standard 5 (Grade 5)</option>
                    <option value="Standard 4 (Grade 4)">Standard 4 (Grade 4)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kosa / Suala Lililotokea</label>
                  <textarea
                    rows={2}
                    required
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hatua Iliyochukuliwa / Inayopendekezwa</label>
                  <input
                    type="text"
                    required
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewIncidentModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md"
                  >
                    Hifadhi Kwenye Daftari
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
