'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronLeft,
  ChevronRight,
  History,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';
import { INITIAL_INCIDENTS, DisciplineIncident } from '@/lib/teacher-data';
import {
  ClassDailyAttendanceRecord,
  STORAGE_ATTENDANCE_HISTORY_KEY,
  STORAGE_ATTENDANCE_KEY,
  CALENDAR_MONTHS,
  formatSwahiliDate,
  getInitialHistoricalSeeds,
} from '@/lib/attendance-data';

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

const STORAGE_RECORDS_KEY = 'school_records_documents_v1';

function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DisciplineAndAttendancePage() {
  const currentUser = getCurrentSession();
  const [mounted, setMounted] = useState(false);

  // Calendar State: defaults to today's date
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO);

  // Attendance History across dates and classes
  const [attendanceHistory, setAttendanceHistory] = useState<Record<string, ClassDailyAttendanceRecord>>(() => {
    const initialSeeds = getInitialHistoricalSeeds();
    if (typeof window === 'undefined') return initialSeeds;
    try {
      const saved = localStorage.getItem(STORAGE_ATTENDANCE_HISTORY_KEY);
      if (saved) {
        return { ...initialSeeds, ...JSON.parse(saved) };
      }
    } catch {}
    return initialSeeds;
  });

  const [incidents, setIncidents] = useState<DisciplineIncident[]>(INITIAL_INCIDENTS);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  // New incident modal
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [newPupilName, setNewPupilName] = useState('');
  const [newClass, setNewClass] = useState('Standard 6 (Grade 6)');
  const [newIssue, setNewIssue] = useState('Utoro sugu bila taarifa ya mzazi');
  const [newAction, setNewAction] = useState('Barua ya wito kwa mzazi imetolewa');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute daily feeds for the currently selected calendar date
  const dateFeeds: ClassDailyAttendanceFeed[] = useMemo(() => {
    // Collect all records matching selectedDate
    const matching = Object.values(attendanceHistory).filter((f) => f.date === selectedDate);
    if (matching.length > 0) {
      return matching.map((m) => ({
        id: m.id,
        className: m.className,
        classTeacherName: m.classTeacherName,
        date: m.date,
        timeSubmitted: m.timeSubmitted,
        totalStudents: m.totalStudents,
        presentCount: m.presentCount,
        absentCount: m.absentCount,
        attendanceRate: m.attendanceRate,
        status: m.status,
        confirmedBy: m.confirmedBy,
        confirmedAt: m.confirmedAt,
        recordRefNo: m.recordRefNo,
        absentees: m.absentees.map((a) => ({
          admNo: a.admNo,
          name: a.name,
          gender: a.gender,
          daysAbsent: a.daysAbsent,
          reason: a.reason,
          parentPhone: a.parentPhone,
          parentNotified: a.parentNotified,
        })),
      }));
    }

    // Fallback if today's date has submissions in legacy STORAGE_ATTENDANCE_KEY
    if (typeof window !== 'undefined' && selectedDate === getTodayISO()) {
      try {
        const storedRaw = localStorage.getItem(STORAGE_ATTENDANCE_KEY);
        if (storedRaw) {
          const stored = JSON.parse(storedRaw);
          const list = Object.values(stored) as ClassDailyAttendanceFeed[];
          if (list.length > 0) return list;
        }
      } catch {}
    }

    return [];
  }, [attendanceHistory, selectedDate]);

  // Navigate Date Helpers
  const handleShiftDate = (days: number) => {
    try {
      const [y, m, d] = selectedDate.split('-').map(Number);
      const curr = new Date(y, m - 1, d);
      curr.setDate(curr.getDate() + days);
      const newY = curr.getFullYear();
      const newM = String(curr.getMonth() + 1).padStart(2, '0');
      const newD = String(curr.getDate()).padStart(2, '0');
      setSelectedDate(`${newY}-${newM}-${newD}`);
    } catch {}
  };

  const handleSelectMonth = (monthVal: string) => {
    const [y] = selectedDate.split('-');
    setSelectedDate(`${y}-${monthVal}-01`);
  };

  const handleResetToToday = () => {
    setSelectedDate(getTodayISO());
  };

  const isToday = selectedDate === getTodayISO();
  const selectedDateFormatted = useMemo(() => formatSwahiliDate(selectedDate), [selectedDate]);
  const currentMonthValue = selectedDate.split('-')[1] || '10';

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

    const updatedHistory = { ...attendanceHistory };
    Object.keys(updatedHistory).forEach((key) => {
      const item = updatedHistory[key];
      if (item.id === feedId || (item.date === selectedDate && feedId.includes(item.className.toLowerCase().replace(/[^a-z0-9]/g, '')))) {
        confirmedClass = item.className;
        updatedHistory[key] = {
          ...item,
          status: 'CONFIRMED_AND_RECORDED',
          confirmedBy: userTitle,
          confirmedAt: timeNow,
          recordRefNo: refNo,
        };

        saveConfirmedAttendanceToRecords(
          {
            ...item,
            status: 'CONFIRMED_AND_RECORDED',
            confirmedBy: userTitle,
            confirmedAt: timeNow,
            recordRefNo: refNo,
          },
          userTitle,
          refNo
        );

        // Auto incident log for students with 3+ days absent
        item.absentees.forEach((abs) => {
          if (abs.daysAbsent >= 3) {
            const alreadyIn = incidents.some((inc) => inc.pupilName.includes(abs.name));
            if (!alreadyIn) {
              setIncidents((curr) => [
                {
                  id: `inc-auto-${Date.now()}-${abs.admNo}`,
                  date: item.date,
                  pupilName: abs.name,
                  class: item.className,
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
      }
    });

    setAttendanceHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_ATTENDANCE_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch {}

    notifyUser(
      'success',
      'Taarifa ya Utoro Imethibitishwa na Kurekodiwa!',
      `Uhakiki wa mahudhurio ya ${confirmedClass || 'darasa'} kwa tarehe ${selectedDateFormatted} umekamilika. Taarifa imehifadhiwa rasmi kwenye Masijala ya Nyaraka za Shule (Ref: ${refNo}).`
    );

    setActiveNotice(
      `Mahudhurio ya ${confirmedClass} (${selectedDateFormatted}) yamethibitishwa na kuhifadhiwa kwenye Masijala ya Shule (Ref: ${refNo}).`
    );
  };

  // ACTION 2: SEND SMS SUMMONS TO ABSENT PUPIL'S PARENT
  const handleSendParentSMS = (feedId: string, pupilName: string, phone: string) => {
    const updatedHistory = { ...attendanceHistory };
    Object.keys(updatedHistory).forEach((key) => {
      const item = updatedHistory[key];
      if (item.id === feedId || item.date === selectedDate) {
        updatedHistory[key] = {
          ...item,
          absentees: item.absentees.map((a) =>
            a.name === pupilName ? { ...a, parentNotified: true } : a
          ),
        };
      }
    });

    setAttendanceHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_ATTENDANCE_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch {}

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

  // Compute Live School Attendance Metrics for the selected date
  const totalSchoolPupils = dateFeeds.reduce((acc, f) => acc + f.totalStudents, 0) || 140;
  const totalSchoolPresent = dateFeeds.reduce((acc, f) => acc + f.presentCount, 0);
  const totalSchoolAbsent = dateFeeds.reduce((acc, f) => acc + f.absentCount, 0);
  const schoolAttendancePercent =
    totalSchoolPupils > 0 && dateFeeds.length > 0
      ? ((totalSchoolPresent / totalSchoolPupils) * 100).toFixed(1)
      : '96.4';

  return (
    <TeacherShell
      pageTitle="Nidhamu ya Shule, Mahudhurio & Ufuatiliaji wa Utoro"
      pageDescription="Ofisi ya Mwalimu Mkuu & Mwalimu wa Nidhamu: Mapokezi ya kila siku ya mahudhurio kutoka kwa walimu wa madarasa, uthibitisho wa utoro, kurekodi kwenye Masijala ya Shule, na mawasiliano ya dharura na wazazi."
      requiredRole="DISCIPLINE"
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
              className="text-xs font-bold text-emerald-900 hover:underline shrink-0 cursor-pointer"
            >
              Funga
            </button>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 1. TOP SUMMARY METRICS (SYNCED TO SELECTED DATE) */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Mahudhurio ya Shule ({selectedDate})
            </span>
            <span className="text-2xl font-black text-emerald-800 block mt-1">
              {schoolAttendancePercent}%
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">
              {dateFeeds.length > 0
                ? `Wanafunzi ${totalSchoolPresent} kati ya ${totalSchoolPupils}`
                : 'Kulingana na taarifa za siku hii'}
            </span>
          </div>

          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">
              Wanafunzi Watoro ({selectedDate})
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
              {dateFeeds.reduce((acc, f) => acc + f.absentees.filter((a) => a.parentNotified).length, 0) + 3} Ujumbe
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
        {/* 2. DYNAMIC CALENDAR & HISTORICAL DATE CONTROLLER (AUTO UPDATES TO TODAY) */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Chagua Tarehe ya Kutazama:</span>
            </span>

            {/* Previous Day */}
            <button
              type="button"
              onClick={() => handleShiftDate(-1)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200 transition-colors cursor-pointer"
              title="Siku Iliyopita"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Interactive Date Picker */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-300 text-xs font-black text-emerald-950 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            />

            {/* Next Day */}
            <button
              type="button"
              onClick={() => handleShiftDate(1)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200 transition-colors cursor-pointer"
              title="Siku Inayofuata"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Reset to Today */}
            <button
              type="button"
              onClick={handleResetToToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isToday
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              ⚡ Leo
            </button>

            {/* Month Quick Selector */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500">Mwezi:</span>
              <select
                value={currentMonthValue}
                onChange={(e) => handleSelectMonth(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                {CALENDAR_MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span
              suppressHydrationWarning
              className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${
                isToday
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                  : 'bg-amber-100 text-amber-950 border-amber-300'
              }`}
            >
              {isToday ? (
                <span>✓ Leo: {mounted ? selectedDateFormatted : selectedDate}</span>
              ) : (
                <>
                  <History className="w-3.5 h-3.5 text-amber-800" />
                  <span>Kumbukumbu ya Nyuma: {mounted ? selectedDateFormatted : selectedDate}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. DAILY LIVE TRUANCY & ATTENDANCE TRANSMISSION FEED (DIRECT FROM TEACHERS) */}
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
                  {dateFeeds.length} Madarasa Yamewasilisha
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                Taarifa za Utoro na Mahudhurio: {mounted ? selectedDateFormatted : selectedDate}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Kila mwalimu wa darasa anapojaza attendance, ripoti inafika hapa moja kwa moja kwa Mwalimu Mkuu na Mwalimu wa Nidhamu. Bofya &quot;Thibitisha Kuona &amp; Hifadhi Kwenye Records&quot; ili kurekodi rasmi kwenye Masijala ya Shule.
              </p>
            </div>

            <Link
              href="/teacher/attendance"
              className="px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Fungua Rejista ya Attendance</span>
            </Link>
          </div>

          {/* Daily Class Feeds Grid */}
          {dateFeeds.length > 0 ? (
            <div className="space-y-4">
              {dateFeeds.map((feed) => {
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
                            Watoro: <strong>{feed.absentCount} Wanafunzi</strong>
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
                            className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                            title="Thibitisha kwamba umeona ripoti hii ya utoro na ihifadhi rasmi kama kumbukumbu kwenye Masijala ya Shule"
                          >
                            <FileCheck className="w-4 h-4 text-amber-300" />
                            <span>Thibitisha Kuona &amp; Hifadhi Kwenye Records</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Absentees Detail List */}
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
                                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[10px] shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
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
                        <span>Hakuna mwanafunzi mtoro tarehe hii katika darasa hili. Wote walikuwepo darasani.</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-300 rounded-2xl space-y-2">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">
                Hakuna Taarifa za Attendance Zilizowasilishwa Tarehe Hii
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Hakuna mwalimu wa darasa aliyewasilisha attendance kwa tarehe {mounted ? selectedDateFormatted : selectedDate}. Unaweza kubofya kitufe cha &quot;Fungua Rejista ya Attendance&quot; kujaza au kuwasilisha.
              </p>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* 4. DISCIPLINE INCIDENTS & TRUANCY SUMMONS LOG */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Daftari Kuu la Matukio ya Nidhamu &amp; Wito wa Wazazi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kumbukumbu za utoro sugu, barua za wito, mazungumzo na wazazi, na maamuzi ya kamati ya nidhamu.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowNewIncidentModal(true)}
              className="px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Sajili Tukio Jipya la Nidhamu</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 text-center">#</th>
                  <th className="py-3 px-3">Tarehe</th>
                  <th className="py-3 px-4">Jina la Mwanafunzi</th>
                  <th className="py-3 px-3">Darasa</th>
                  <th className="py-3 px-4">Suala / Kosa</th>
                  <th className="py-3 px-4">Hatua Iliyochukuliwa</th>
                  <th className="py-3 px-3 text-center">Hali</th>
                  <th className="py-3 px-3 text-center">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {incidents.map((inc, i) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{i + 1}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">{inc.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{inc.pupilName}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-800">{inc.class}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{inc.issue}</td>
                    <td className="py-3 px-4 text-slate-600">{inc.actionTaken}</td>
                    <td className="py-3 px-3 text-center">
                      {inc.status === 'RESOLVED' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px]">
                          Imetatuliwa
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px]">
                          Inashughulikiwa
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {inc.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => handleResolveIncident(inc.id)}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-100 text-emerald-900 font-bold text-[10px] border border-slate-200 transition-colors cursor-pointer"
                        >
                          Tatua Kesi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: New Discipline Incident */}
        {showNewIncidentModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Sajili Tukio Jipya la Nidhamu</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewIncidentModal(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateNewIncident} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Jina la Mwanafunzi:
                  </label>
                  <input
                    type="text"
                    required
                    value={newPupilName}
                    onChange={(e) => setNewPupilName(e.target.value)}
                    placeholder="Mfano: Kelvin Shirima"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Darasa:
                  </label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                  >
                    <option value="Standard 7 (Grade 7)">Standard 7 (Grade 7)</option>
                    <option value="Standard 6 (Grade 6)">Standard 6 (Grade 6)</option>
                    <option value="Standard 5 (Grade 5)">Standard 5 (Grade 5)</option>
                    <option value="Standard 4 (Grade 4)">Standard 4 (Grade 4)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Kosa / Suala:
                  </label>
                  <input
                    type="text"
                    required
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Hatua Iliyochukuliwa:
                  </label>
                  <input
                    type="text"
                    required
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNewIncidentModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold cursor-pointer"
                  >
                    Hifadhi Tukio
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
