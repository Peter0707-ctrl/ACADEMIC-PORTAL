'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  X,
  BookOpen,
  Calendar,
  Building2,
  Send,
  Users,
  AlertTriangle,
  ShieldCheck,
  CheckCheck,
  Search,
  Upload,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';
import { INITIAL_PUPILS, StudentMark } from '@/lib/teacher-data';

interface PupilAttendanceRow {
  id: string;
  admNo: string;
  name: string;
  gender: 'M' | 'F';
  parentPhone: string;
  status: 'PRESENT' | 'ABSENT' | 'PERMISSION';
  absentReason?: string;
  daysAbsentCount: number;
}

const STORAGE_ATTENDANCE_KEY = 'daily_attendance_submissions_v1';
const STORAGE_REGISTERED_PUPILS_KEY = 'academic_portal_registered_pupils_v2';

// Realistic parent phones deterministic helper
function getDeterministicPhone(admNo: string, index: number): string {
  const digits = admNo.replace(/\D/g, '');
  const suffix = digits.slice(-3).padStart(3, '0') || (index + 1).toString().padStart(3, '0');
  const middle = (220 + (index % 600)).toString().padStart(3, '0');
  return `+255 754 ${middle} ${suffix}`;
}

export default function AttendancePage() {
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const rosterFileInputRef = useRef<HTMLInputElement>(null);

  // Sync auth session and mounted state on load
  useEffect(() => {
    setMounted(true);
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }
  }, []);

  // Teacher's Assigned Classes strictly based on what this teacher teaches
  const teacherClasses: string[] = useMemo(() => {
    if (currentUser?.assignedClasses && currentUser.assignedClasses.length > 0) {
      return currentUser.assignedClasses;
    }
    if (currentUser?.assignedClass && currentUser.assignedClass !== 'Whole School') {
      return [currentUser.assignedClass];
    }
    return ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)'];
  }, [currentUser?.assignedClasses, currentUser?.assignedClass]);

  const [selectedClass, setSelectedClass] = useState<string>('Standard 6 (Grade 6)');

  // Auto-align selectedClass when teacherClasses load
  useEffect(() => {
    if (teacherClasses.length > 0 && !teacherClasses.includes(selectedClass)) {
      setSelectedClass(teacherClasses[0]);
    }
  }, [teacherClasses, selectedClass]);

  // Master registered pupils across classes (shared with Marks page via localStorage)
  const [registeredPupils, setRegisteredPupils] = useState<Record<string, StudentMark[]>>(() => {
    if (typeof window === 'undefined') return INITIAL_PUPILS;
    try {
      const stored = localStorage.getItem(STORAGE_REGISTERED_PUPILS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...INITIAL_PUPILS, ...parsed };
      }
    } catch {}
    return INITIAL_PUPILS;
  });

  // Attendance status mapping per class & pupil
  const [attendanceState, setAttendanceState] = useState<
    Record<string, Record<string, { status: 'PRESENT' | 'ABSENT' | 'PERMISSION'; reason?: string }>>
  >({});

  const [searchFilter, setSearchFilter] = useState('');
  const [isSubmittedToday, setIsSubmittedToday] = useState(false);
  const [submittedTime, setSubmittedTime] = useState<string | null>(null);

  // Check if class was already submitted today in localStorage
  useEffect(() => {
    try {
      const storedRaw = localStorage.getItem(STORAGE_ATTENDANCE_KEY);
      if (storedRaw) {
        const stored = JSON.parse(storedRaw);
        if (stored[selectedClass]) {
          setIsSubmittedToday(true);
          setSubmittedTime(stored[selectedClass].timeSubmitted);
        } else {
          setIsSubmittedToday(false);
          setSubmittedTime(null);
        }
      }
    } catch {}
  }, [selectedClass]);

  // Build the complete pupil attendance roster for the selected class
  const currentPupils: PupilAttendanceRow[] = useMemo(() => {
    const rawList =
      registeredPupils[selectedClass] ||
      INITIAL_PUPILS[selectedClass] ||
      INITIAL_PUPILS['Standard 6 (Grade 6)'] ||
      [];

    const classAttendance = attendanceState[selectedClass] || {};

    return rawList.map((p, idx) => {
      const record = classAttendance[p.id];
      const defaultStatus = p.attendance || (idx === 8 && rawList.length > 5 ? 'ABSENT' : 'PRESENT');
      const defaultReason = defaultStatus === 'ABSENT' ? 'Bila taarifa (Utoro)' : undefined;

      return {
        id: p.id,
        admNo: p.admNo,
        name: p.name,
        gender: p.gender,
        parentPhone: getDeterministicPhone(p.admNo, idx),
        status: record ? record.status : defaultStatus,
        absentReason: record?.reason !== undefined ? record.reason : defaultReason,
        daysAbsentCount: defaultStatus === 'ABSENT' ? 1 : 0,
      };
    });
  }, [registeredPupils, selectedClass, attendanceState]);

  // Handle single attendance toggle
  const handleAttendanceChange = (
    pupilId: string,
    status: 'PRESENT' | 'ABSENT' | 'PERMISSION',
    reason?: string
  ) => {
    setAttendanceState((prev) => {
      const classMap = { ...(prev[selectedClass] || {}) };
      classMap[pupilId] = {
        status,
        reason: reason !== undefined ? reason : classMap[pupilId]?.reason,
      };
      return { ...prev, [selectedClass]: classMap };
    });
  };

  // 1-Click: Mark All Present
  const handleMarkAllPresent = () => {
    const updatedMap: Record<string, { status: 'PRESENT'; reason: undefined }> = {};
    currentPupils.forEach((p) => {
      updatedMap[p.id] = { status: 'PRESENT', reason: undefined };
    });

    setAttendanceState((prev) => ({
      ...prev,
      [selectedClass]: updatedMap,
    }));

    notifyUser(
      'info',
      'Wote Wamewekwa Wapo',
      `Wanafunzi wote ${currentPupils.length} wa ${selectedClass} wamewekwa kama Waliopo (Present). Unaweza sasa kubofya waliokosekana tu.`
    );
  };

  const presentCount = currentPupils.filter((p) => p.status === 'PRESENT').length;
  const absentCount = currentPupils.filter((p) => p.status === 'ABSENT').length;
  const permCount = currentPupils.filter((p) => p.status === 'PERMISSION').length;
  const totalCount = currentPupils.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const todayDateFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('sw-TZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  // SUBMIT ATTENDANCE DIRECTLY TO HEADMASTER AND DISCIPLINE TEACHER
  const handleSubmitAttendanceToLeadership = () => {
    const timeNow = new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });
    const dateNow = new Date().toISOString().split('T')[0];

    const absenteesList = currentPupils
      .filter((p) => p.status === 'ABSENT')
      .map((p) => ({
        admNo: p.admNo,
        name: p.name,
        gender: p.gender,
        daysAbsent: p.daysAbsentCount || 1,
        reason: p.absentReason || 'Bila taarifa (Utoro)',
        parentNotified: false,
        parentPhone: p.parentPhone,
      }));

    const submissionPayload = {
      id: `att-${selectedClass.toLowerCase().replace(/[^a-z0-9]/g, '')}-${dateNow}`,
      date: dateNow,
      dateFormatted: todayDateFormatted,
      timeSubmitted: timeNow,
      className: selectedClass,
      classTeacherName: currentUser?.fullName || 'Mwalimu wa Darasa',
      classTeacherId: currentUser?.identifier || 'TCH-2026-001',
      totalStudents: totalCount,
      presentCount,
      absentCount,
      permissionCount: permCount,
      attendanceRate,
      status: 'PENDING_CONFIRMATION',
      absentees: absenteesList,
    };

    try {
      const existingRaw = localStorage.getItem(STORAGE_ATTENDANCE_KEY);
      let submissions = existingRaw ? JSON.parse(existingRaw) : {};
      submissions[selectedClass] = submissionPayload;
      localStorage.setItem(STORAGE_ATTENDANCE_KEY, JSON.stringify(submissions));
    } catch (err) {
      console.error('Failed to store attendance submission', err);
    }

    setIsSubmittedToday(true);
    setSubmittedTime(timeNow);

    notifyUser(
      'success',
      'Attendance Imewasilishwa Kikamilifu!',
      `Attendance ya wanafunzi ${totalCount} wa ${selectedClass} imewasilishwa kwa Mwalimu Mkuu na Mwalimu wa Nidhamu. Wanafunzi watoro: ${absentCount}.`
    );
  };

  // Upload Excel / CSV roster to update student list
  const handleUploadRosterFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;

      const lines = content.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        notifyUser('error', 'Faili Halina Data', 'Tafadhali pakia faili lenye orodha ya wanafunzi.');
        return;
      }

      const newPupils: StudentMark[] = [];
      const dataRows = lines.slice(1);

      dataRows.forEach((row, i) => {
        const parts = row.split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2) {
          const name = parts[0] || `Mwanafunzi ${i + 1}`;
          const admNo = parts[1] || `PUP-${selectedClass.slice(0, 3)}-${String(i + 1).padStart(3, '0')}`;
          const gender = (parts[2]?.toUpperCase() === 'F' ? 'F' : 'M') as 'M' | 'F';

          newPupils.push({
            id: `p-${selectedClass.replace(/[^a-zA-Z0-9]/g, '')}-${i + 1}`,
            admNo,
            name,
            gender,
            monthlyTest1: 75,
            monthlyTest2: 78,
            monthlyAvg: 77,
            midtermExam: 80,
            terminalExam: 82,
            mark: 80,
            grade: 'B',
            attendance: 'PRESENT',
          });
        }
      });

      if (newPupils.length > 0) {
        setRegisteredPupils((prev) => {
          const updated = { ...prev, [selectedClass]: newPupils };
          try {
            localStorage.setItem(STORAGE_REGISTERED_PUPILS_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        notifyUser(
          'success',
          'Wanafunzi Wamerekodiwa!',
          `Wanafunzi ${newPupils.length} wa ${selectedClass} wameingizwa kwenye mfumo kikamilifu kutoka kwenye faili.`
        );
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Download Attendance CSV
  const handleDownloadCSV = () => {
    const headers = ['Namba', 'Jina la Mwanafunzi', 'Namba ya Usajili', 'Jinsia', 'Simu ya Mzazi', 'Hali ya Attendance', 'Sababu'];
    const rows = currentPupils.map((p, i) => [
      i + 1,
      `"${p.name}"`,
      p.admNo,
      p.gender,
      p.parentPhone,
      p.status,
      `"${p.absentReason || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${selectedClass.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered pupils list for table search
  const displayedPupils = useMemo(() => {
    if (!searchFilter.trim()) return currentPupils;
    const q = searchFilter.toLowerCase();
    return currentPupils.filter((p) => p.name.toLowerCase().includes(q) || p.admNo.toLowerCase().includes(q));
  }, [currentPupils, searchFilter]);

  return (
    <TeacherShell
      pageTitle="Attendance"
      pageDescription="Rejista ya attendance ya kila siku kwa madarasa unayofundisha. Chukua attendance na wasilisha kwa Mwalimu Mkuu na Mwalimu wa Nidhamu."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Hidden File Input for Excel/CSV Student Roster Upload */}
        <input
          type="file"
          ref={rosterFileInputRef}
          onChange={handleUploadRosterFile}
          accept=".csv,.xlsx,.xls,.txt"
          className="hidden"
        />

        {/* ===================================================================== */}
        {/* 1. TOP STATS CARDS */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Jumla ya Wanafunzi
            </span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{totalCount}</span>
            <span className="text-[11px] text-emerald-800 font-bold">{selectedClass}</span>
          </div>

          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
              Waliopo (Present)
            </span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">{presentCount}</span>
            <span className="text-[11px] text-emerald-800 font-bold">{attendanceRate}% Attendance Rate</span>
          </div>

          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">
              Watoro Leo (Absent)
            </span>
            <span className="text-2xl font-black text-rose-600 block mt-1">{absentCount}</span>
            <span className="text-[11px] text-rose-700 font-semibold">Zinafika kwa Mkuu &amp; Nidhamu</span>
          </div>

          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">
              Wenye Ruhusa (Permission)
            </span>
            <span className="text-2xl font-black text-amber-600 block mt-1">{permCount}</span>
            <span className="text-[11px] text-amber-700 font-semibold">Wana sababu maalum</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. ATTENDANCE REGISTER CONTROLS & ACTIONS BAR */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Attendance: {selectedClass}
                </h3>
                <span
                  suppressHydrationWarning
                  className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-black border border-emerald-300"
                >
                  {mounted ? todayDateFormatted : 'Attendance ya Leo'}
                </span>
                {isSubmittedToday && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 text-[10px] font-black border border-blue-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-700" />
                    <span>Imewasilishwa kwa Mkuu &amp; Nidhamu (Saa {submittedTime})</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Chagua darasa unalofundisha. Bofya Yupo/Hayupo/Ruksa kurekodi, kisha wasilisha ili taarifa ifike kwa Mwalimu Mkuu na Nidhamu.
              </p>
            </div>

            {/* Class Selector strictly for classes this teacher teaches */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 px-2 py-1 rounded-xl">
                <span className="text-[11px] font-bold text-slate-500">Darasa Langu:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {teacherClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Bofya kuweka wanafunzi wote kuwa wapo kwanza kisha ubadilishe waliokosekana"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Weka Wote Wapo</span>
              </button>

              <button
                type="button"
                onClick={() => rosterFileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Pakia Excel ya wanafunzi wa darasa hili"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pakia Wanafunzi (Excel)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCSV}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Pakua ripoti ya Attendance ya darasa hili (CSV)"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Pakua CSV</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitAttendanceToLeadership}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                title="Tuma taarifa za attendance ya leo moja kwa moja kwa Mwalimu Mkuu na Mwalimu wa Nidhamu"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Wasilisha Attendance</span>
              </button>
            </div>
          </div>

          {/* Search Filter Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Tafuta mwanafunzi au namba ya usajili..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="text-[11px] font-bold text-slate-500">
              Wanafunzi {displayedPupils.length} kati ya {totalCount} wa {selectedClass}
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 text-center">#</th>
                  <th className="py-3 px-4">Jina la Mwanafunzi</th>
                  <th className="py-3 px-3">Namba ya Usajili</th>
                  <th className="py-3 px-2 text-center">Jinsia</th>
                  <th className="py-3 px-3 text-center">Simu ya Mzazi</th>
                  <th className="py-3 px-4 text-center">Hali ya Attendance</th>
                  <th className="py-3 px-4">Sababu / Maelezo ya Utoro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {displayedPupils.map((pupil, idx) => (
                  <tr
                    key={pupil.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      pupil.status === 'ABSENT' ? 'bg-rose-50/40' : pupil.status === 'PERMISSION' ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <div>{pupil.name}</div>
                      {pupil.status === 'ABSENT' && (
                        <span className="text-[10px] text-rose-600 font-bold">
                          ⚠️ Hayupo darasani leo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-800 font-semibold">{pupil.admNo}</td>
                    <td className="py-3 px-2 text-center text-slate-600 font-medium">{pupil.gender}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600 text-[11px]">
                      {pupil.parentPhone}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(pupil.id, 'PRESENT')}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            pupil.status === 'PRESENT'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>Yupo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(pupil.id, 'ABSENT')}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            pupil.status === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <X className="w-3 h-3" />
                          <span>Hayupo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(pupil.id, 'PERMISSION')}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            pupil.status === 'PERMISSION'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>Ruksa</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {pupil.status === 'ABSENT' ? (
                        <input
                          type="text"
                          defaultValue={pupil.absentReason || 'Bila taarifa (Utoro)'}
                          onBlur={(e) => handleAttendanceChange(pupil.id, 'ABSENT', e.target.value)}
                          placeholder="Sababu ya utoro..."
                          className="w-full px-2 py-1 rounded-lg border border-rose-200 bg-white text-rose-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
                        />
                      ) : pupil.status === 'PERMISSION' ? (
                        <input
                          type="text"
                          defaultValue={pupil.absentReason || 'Sababu ya ruhusa...'}
                          onBlur={(e) => handleAttendanceChange(pupil.id, 'PERMISSION', e.target.value)}
                          placeholder="Sababu ya ruhusa..."
                          className="w-full px-2 py-1 rounded-lg border border-amber-200 bg-white text-amber-800 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                        />
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">Darasani</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
