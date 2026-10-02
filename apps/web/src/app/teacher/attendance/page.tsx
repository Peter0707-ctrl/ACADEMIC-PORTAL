'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

// 4 Core Classes with realistic 35-student rosters
const CLASS_TEACHERS: Record<string, string> = {
  'Standard 7 (Grade 7)': 'Mwl. Beatrice Kimaro (Academic Master)',
  'Standard 6 (Grade 6)': 'Mwl. David Mrema (Mwalimu wa Darasa)',
  'Standard 5 (Grade 5)': 'Mwl. Emmanuel Lyimo (Mwalimu wa Darasa)',
  'Standard 4 (Grade 4)': 'Mwl. Rehema Mushi (Mwalimu wa Darasa)',
};

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

// Student rosters for classes
const INITIAL_CLASS_ROSTERS: Record<string, PupilAttendanceRow[]> = {
  'Standard 6 (Grade 6)': [
    { id: 'p6-01', admNo: 'PUP-2026-061', name: 'Rashid Hamisi', gender: 'M', parentPhone: '+255 754 112 001', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-02', admNo: 'PUP-2026-062', name: 'Amina Salum', gender: 'F', parentPhone: '+255 754 112 002', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-03', admNo: 'PUP-2026-063', name: 'Frank Leonard', gender: 'M', parentPhone: '+255 754 112 003', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-04', admNo: 'PUP-2026-064', name: 'Grace Mlay', gender: 'F', parentPhone: '+255 754 112 004', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-05', admNo: 'PUP-2026-065', name: 'Baraka Juma Mshana', gender: 'M', parentPhone: '+255 754 112 005', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-06', admNo: 'PUP-2026-066', name: 'Zuwena Athumani', gender: 'F', parentPhone: '+255 754 112 006', status: 'ABSENT', absentReason: 'Bila taarifa (Siku ya 1)', daysAbsentCount: 1 },
    { id: 'p6-07', admNo: 'PUP-2026-067', name: 'Christopher Mwita', gender: 'M', parentPhone: '+255 754 112 007', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-08', admNo: 'PUP-2026-068', name: 'Diana Patrick Kavishe', gender: 'F', parentPhone: '+255 754 112 008', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-09', admNo: 'PUP-2026-069', name: 'Erick John Masanja', gender: 'M', parentPhone: '+255 754 112 009', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-10', admNo: 'PUP-2026-070', name: 'Fatuma Omari Said', gender: 'F', parentPhone: '+255 754 112 010', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-11', admNo: 'PUP-2026-071', name: 'Godfrey Peter Temu', gender: 'M', parentPhone: '+255 754 112 011', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-12', admNo: 'PUP-2026-072', name: 'Hawa Ramadhani Bakari', gender: 'F', parentPhone: '+255 754 112 012', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-13', admNo: 'PUP-2026-073', name: 'Ismail Ally Seif', gender: 'M', parentPhone: '+255 754 112 013', status: 'ABSENT', absentReason: 'Hakuna taarifa (Siku ya 2)', daysAbsentCount: 2 },
    { id: 'p6-14', admNo: 'PUP-2026-074', name: 'Jackline Simon Shirima', gender: 'F', parentPhone: '+255 754 112 014', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-15', admNo: 'PUP-2026-075', name: 'Kelvin Anthony Minja', gender: 'M', parentPhone: '+255 754 112 015', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-16', admNo: 'PUP-2026-076', name: 'Lilian Daudi Mrema', gender: 'F', parentPhone: '+255 754 112 016', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-17', admNo: 'PUP-2026-077', name: 'Michael Joseph Mushi', gender: 'M', parentPhone: '+255 754 112 017', status: 'PERMISSION', absentReason: 'Kufiwa na bibi (Ruksa rasmi)', daysAbsentCount: 1 },
    { id: 'p6-18', admNo: 'PUP-2026-078', name: 'Nancy Prosper Lyimo', gender: 'F', parentPhone: '+255 754 112 018', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-19', admNo: 'PUP-2026-079', name: 'Omari Khalfan Mwinyi', gender: 'M', parentPhone: '+255 754 112 019', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-20', admNo: 'PUP-2026-080', name: 'Pauline Gabriel Massawe', gender: 'F', parentPhone: '+255 754 112 020', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-21', admNo: 'PUP-2026-081', name: 'Raymond Charles Swai', gender: 'M', parentPhone: '+255 754 112 021', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-22', admNo: 'PUP-2026-082', name: 'Sabrina Hashim Nassor', gender: 'F', parentPhone: '+255 754 112 022', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-23', admNo: 'PUP-2026-083', name: 'Thomas Lucas Tarimo', gender: 'M', parentPhone: '+255 754 112 023', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-24', admNo: 'PUP-2026-084', name: 'Upendo Wilson Mboya', gender: 'F', parentPhone: '+255 754 112 024', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-25', admNo: 'PUP-2026-085', name: 'Victor Ernest Moshi', gender: 'M', parentPhone: '+255 754 112 025', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-26', admNo: 'PUP-2026-086', name: 'Winnie Bernard Maro', gender: 'F', parentPhone: '+255 754 112 026', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-27', admNo: 'PUP-2026-087', name: 'Yohana Festo Mallya', gender: 'M', parentPhone: '+255 754 112 027', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-28', admNo: 'PUP-2026-088', name: 'Zainab Jafari Kingazi', gender: 'F', parentPhone: '+255 754 112 028', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-29', admNo: 'PUP-2026-089', name: 'Abel Richard Macha', gender: 'M', parentPhone: '+255 754 112 029', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-30', admNo: 'PUP-2026-090', name: 'Brenda Elia Kimaro', gender: 'F', parentPhone: '+255 754 112 030', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-31', admNo: 'PUP-2026-091', name: 'Denis Francis Mollel', gender: 'M', parentPhone: '+255 754 112 031', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-32', admNo: 'PUP-2026-092', name: 'Elizabeth George Kweka', gender: 'F', parentPhone: '+255 754 112 032', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-33', admNo: 'PUP-2026-093', name: 'Faraji Saidi Mkude', gender: 'M', parentPhone: '+255 754 112 033', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-34', admNo: 'PUP-2026-094', name: 'Gloria Martin Shayo', gender: 'F', parentPhone: '+255 754 112 034', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p6-35', admNo: 'PUP-2026-095', name: 'Henry Innocent Lyatuu', gender: 'M', parentPhone: '+255 754 112 035', status: 'PRESENT', daysAbsentCount: 0 },
  ],
  'Standard 7 (Grade 7)': [
    { id: 'p7-01', admNo: 'PSLE-2026-0428', name: 'Kelvin Shirima (Candidate)', gender: 'M', parentPhone: '+255 754 221 001', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p7-02', admNo: 'PSLE-2026-0429', name: 'Neema Massawe (Candidate)', gender: 'F', parentPhone: '+255 754 221 002', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p7-03', admNo: 'PSLE-2026-0430', name: 'Amani Charles (Candidate)', gender: 'M', parentPhone: '+255 754 221 003', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p7-04', admNo: 'PSLE-2026-0431', name: 'Beatrice Samuel (Candidate)', gender: 'F', parentPhone: '+255 754 221 004', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p7-05', admNo: 'PSLE-2026-0432', name: 'Daniel Josephat (Candidate)', gender: 'M', parentPhone: '+255 754 221 005', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p7-06', admNo: 'PSLE-2026-0433', name: 'Ester Lucas (Candidate)', gender: 'F', parentPhone: '+255 754 221 006', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p7-07', admNo: 'PSLE-2026-0434', name: 'Faraja Nelson (Candidate)', gender: 'M', parentPhone: '+255 754 221 007', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p7-08', admNo: 'PSLE-2026-0435', name: 'Halima Zuberi (Candidate)', gender: 'F', parentPhone: '+255 754 221 008', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p7-09', admNo: 'PSLE-2026-0436', name: 'Ian Geoffrey (Candidate)', gender: 'M', parentPhone: '+255 754 221 009', status: 'ABSENT', absentReason: 'Bila taarifa (Mtoro)', daysAbsentCount: 1 },
    { id: 'p7-10', admNo: 'PSLE-2026-0437', name: 'Jesca William (Candidate)', gender: 'F', parentPhone: '+255 754 221 010', status: 'PRESENT', daysAbsentCount: 0 },
  ],
  'Standard 5 (Grade 5)': [
    { id: 'p5-01', admNo: 'PUP-2026-001', name: 'Baraka David', gender: 'M', parentPhone: '+255 754 331 001', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p5-02', admNo: 'PUP-2026-002', name: 'Zuhura Ally', gender: 'F', parentPhone: '+255 754 331 002', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p5-03', admNo: 'PUP-2026-003', name: 'Joshua Peter', gender: 'M', parentPhone: '+255 754 331 003', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p5-04', admNo: 'PUP-2026-004', name: 'Dorothy Michael', gender: 'F', parentPhone: '+255 754 331 004', status: 'ABSENT', absentReason: 'Utoro wa siku 2 bila taarifa', daysAbsentCount: 2 },
    { id: 'p5-05', admNo: 'PUP-2026-005', name: 'Emanuel Joseph', gender: 'M', parentPhone: '+255 754 331 005', status: 'PRESENT', daysAbsentCount: 0 },
  ],
  'Standard 4 (Grade 4)': [
    { id: 'p4-01', admNo: 'SFNA-2026-0112', name: 'Juma Bakari (Candidate)', gender: 'M', parentPhone: '+255 754 441 001', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p4-02', admNo: 'SFNA-2026-0113', name: 'Fatma Hassan (Candidate)', gender: 'F', parentPhone: '+255 754 441 002', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p4-03', admNo: 'SFNA-2026-0114', name: 'Saidi Mohamed (Candidate)', gender: 'M', parentPhone: '+255 754 441 003', status: 'ABSENT', absentReason: 'Utoro wa siku 3 mfululizo', daysAbsentCount: 3 },
    { id: 'p4-04', admNo: 'SFNA-2026-0115', name: 'Rehema John (Candidate)', gender: 'F', parentPhone: '+255 754 441 004', status: 'PRESENT', daysAbsentCount: 0 },
    { id: 'p4-05', admNo: 'SFNA-2026-0116', name: 'Albert Faustine (Candidate)', gender: 'M', parentPhone: '+255 754 441 005', status: 'PRESENT', daysAbsentCount: 0 },
  ],
};

const STORAGE_ATTENDANCE_KEY = 'daily_attendance_submissions_v1';

export default function DailyAttendancePage() {
  const currentUser = getCurrentSession();

  const [selectedClass, setSelectedClass] = useState<string>('Standard 6 (Grade 6)');
  const [pupilsByClass, setPupilsByClass] = useState<Record<string, PupilAttendanceRow[]>>(INITIAL_CLASS_ROSTERS);
  const [searchFilter, setSearchFilter] = useState('');
  const [isSubmittedToday, setIsSubmittedToday] = useState(false);
  const [submittedTime, setSubmittedTime] = useState<string | null>(null);

  // Sync with current teacher's assignments
  useEffect(() => {
    const session = getCurrentSession();
    if (session?.assignedClasses && session.assignedClasses.length > 0) {
      setSelectedClass(session.assignedClasses[0]);
    } else if (session?.assignedClass && session.assignedClass !== 'Whole School') {
      setSelectedClass(session.assignedClass);
    }
  }, []);

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

  const currentPupils = useMemo(() => {
    return pupilsByClass[selectedClass] || pupilsByClass['Standard 6 (Grade 6)'] || [];
  }, [pupilsByClass, selectedClass]);

  // Handle single attendance toggle
  const handleAttendanceChange = (
    pupilId: string,
    status: 'PRESENT' | 'ABSENT' | 'PERMISSION',
    reason?: string
  ) => {
    setPupilsByClass((prev) => {
      const list = [...(prev[selectedClass] || [])];
      const idx = list.findIndex((p) => p.id === pupilId);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          status,
          absentReason: reason !== undefined ? reason : list[idx].absentReason,
        };
      }
      return { ...prev, [selectedClass]: list };
    });
  };

  // 1-Click: Mark All Present
  const handleMarkAllPresent = () => {
    setPupilsByClass((prev) => {
      const list = (prev[selectedClass] || []).map((p) => ({
        ...p,
        status: 'PRESENT' as const,
        absentReason: undefined,
      }));
      return { ...prev, [selectedClass]: list };
    });

    notifyUser(
      'info',
      'Wote Wamewekwa Wapo',
      `Wanafunzi wote wa ${selectedClass} wamewekwa kama Waliopo (Present). Unaweza sasa kubofya waliokosekana tu.`
    );
  };

  const presentCount = currentPupils.filter((p) => p.status === 'PRESENT').length;
  const absentCount = currentPupils.filter((p) => p.status === 'ABSENT').length;
  const permCount = currentPupils.filter((p) => p.status === 'PERMISSION').length;
  const totalCount = currentPupils.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const todayDateFormatted = new Date().toLocaleDateString('sw-TZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
      classTeacherName: currentUser?.fullName || CLASS_TEACHERS[selectedClass] || 'Mwalimu wa Darasa',
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

    // Centered Light Blue Notification for PASS
    notifyUser(
      'success',
      'Mahudhurio Yamewasilishwa Kikamilifu!',
      `Taarifa za mahudhurio ya wanafunzi ${totalCount} wa ${selectedClass} kwa siku ya leo zimewasilishwa moja kwa moja kwa Mwalimu Mkuu na Mwalimu wa Nidhamu. Wanafunzi watoro: ${absentCount}.`
    );
  };

  // Filtered pupils list for table search
  const displayedPupils = useMemo(() => {
    if (!searchFilter.trim()) return currentPupils;
    const q = searchFilter.toLowerCase();
    return currentPupils.filter((p) => p.name.toLowerCase().includes(q) || p.admNo.toLowerCase().includes(q));
  }, [currentPupils, searchFilter]);

  return (
    <TeacherShell
      pageTitle="Rejista ya Mahudhurio ya Kila Siku (Daily Roll-Call)"
      pageDescription="Mwalimu wa Darasa: Chukua mahudhurio ya kila siku. Unapowasilisha, taarifa za utoro hufika moja kwa moja kwa Mwalimu Mkuu na Mwalimu wa Nidhamu kwa uthibitisho na kurekodiwa."
    >
      <div className="space-y-6 animate-fade-in">
        {/* ===================================================================== */}
        {/* 1. TOP STATS CARDS & LIVE STATUS BANNER */}
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
              Waliopo Darasani (Present)
            </span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">{presentCount}</span>
            <span className="text-[11px] text-emerald-800 font-bold">{attendanceRate}% Mahudhurio</span>
          </div>

          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs">
            <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">
              Watoro Leo (Absent)
            </span>
            <span className="text-2xl font-black text-rose-600 block mt-1">{absentCount}</span>
            <span className="text-[11px] text-rose-700 font-semibold">Zinafika kwa Mkuu & Nidhamu</span>
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
        {/* 2. CLASS REGISTER CONTROLS & SUBMISSION BAR */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Rejista ya Mahudhurio: {selectedClass}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-black border border-emerald-300">
                  {todayDateFormatted}
                </span>
                {isSubmittedToday && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 text-[10px] font-black border border-blue-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-700" />
                    <span>Imetumwa kwa Mkuu &amp; Nidhamu (Saa {submittedTime})</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mwalimu wa Darasa: <strong>{CLASS_TEACHERS[selectedClass]}</strong>. Bofya Yupo/Hayupo/Ruksa kurekodi, kisha wasilisha ili taarifa ifike moja kwa moja ofisi ya Mkuu na Nidhamu.
              </p>
            </div>

            {/* Class Switcher & Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.keys(pupilsByClass).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors"
                title="Bofya kuweka wanafunzi wote kuwa wapo kwanza kisha ubadilishe waliokosekana"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Weka Wote Wapo</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitAttendanceToLeadership}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                title="Tuma taarifa za mahudhurio ya leo moja kwa moja kwa Mwalimu Mkuu na Mwalimu wa Nidhamu"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Wasilisha kwa Mkuu &amp; Nidhamu</span>
              </button>
            </div>
          </div>

          {/* Quick Search in Roster */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Tafuta mwanafunzi..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="text-[11px] font-bold text-slate-500">
              Wanafunzi {displayedPupils.length} wanaonyeshwa
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 text-center">#</th>
                  <th className="py-3 px-4">Jina la Mwanafunzi</th>
                  <th className="py-3 px-3">Namba ya Usajili</th>
                  <th className="py-3 px-2 text-center">Jinsia</th>
                  <th className="py-3 px-3 text-center">Simu ya Mzazi</th>
                  <th className="py-3 px-4 text-center">Hali ya Mahudhurio (Roll Call)</th>
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
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
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
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
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
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
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
