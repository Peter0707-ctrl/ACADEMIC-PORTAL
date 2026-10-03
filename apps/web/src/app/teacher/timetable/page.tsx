'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Download,
  Printer,
  UploadCloud,
  CheckCircle2,
  Award,
  Users,
  GraduationCap,
  BookOpen,
  Filter,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  X,
  Sparkles,
  Search,
  ShieldCheck,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, INITIAL_BLUEPRINT_ACCOUNTS, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

const TIMETABLE_STORAGE_KEY = 'school_master_timetable_2026_v1';

interface TimetableSlot {
  subject: string;
  teacher: string;
  room?: string;
  color?: string;
}

// 5 Working days
const DAYS_OF_WEEK = [
  { key: 'MON', label: 'Jumatatu (Monday)' },
  { key: 'TUE', label: 'Jumanne (Tuesday)' },
  { key: 'WED', label: 'Jumatano (Wednesday)' },
  { key: 'THU', label: 'Alhamisi (Thursday)' },
  { key: 'FRI', label: 'Ijumaa (Friday)' },
];

// Periods schedule
const PERIOD_TIMES = [
  { id: 'P1', time: '08:00 - 08:40', label: 'Kipindi cha 1' },
  { id: 'P2', time: '08:40 - 09:20', label: 'Kipindi cha 2' },
  { id: 'P3', time: '09:20 - 10:00', label: 'Kipindi cha 3' },
  { id: 'BREAK', time: '10:00 - 10:20', label: 'Chai / Mapumziko', isBreak: true },
  { id: 'P4', time: '10:20 - 11:00', label: 'Kipindi cha 4' },
  { id: 'P5', time: '11:00 - 11:40', label: 'Kipindi cha 5' },
  { id: 'P6', time: '11:40 - 12:20', label: 'Kipindi cha 6' },
  { id: 'LUNCH', time: '12:20 - 13:00', label: 'Chakula cha Mchana', isBreak: true },
  { id: 'P7', time: '13:00 - 13:40', label: 'Kipindi cha 7' },
  { id: 'P8', time: '13:40 - 14:20', label: 'Kipindi cha 8' },
];

const PRIMARY_CLASSES = [
  'Standard 7 (Grade 7)',
  'Standard 6 (Grade 6)',
  'Standard 5 (Grade 5)',
  'Standard 4 (Grade 4)',
  'Standard 3 (Grade 3)',
  'Standard 2 (Grade 2)',
  'Standard 1 (Grade 1)',
  'Pre-Unit / Kindergarten',
];

// Sample default curriculum slots for Standard 7
const DEFAULT_STD7_TIMETABLE: Record<string, Record<string, TimetableSlot>> = {
  MON: {
    P1: { subject: 'Mathematics (Hisabati)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P2: { subject: 'Mathematics (Hisabati)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P3: { subject: 'Science & Technology (Sayansi)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P4: { subject: 'Civic & Moral (Uraia na Maadili)', teacher: 'Mwl. Augustine Mrosso', room: 'Darasa 7A' },
    P5: { subject: 'English Language', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P6: { subject: 'Kiswahili', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P7: { subject: 'Social Studies (Maarifa ya Jamii)', teacher: 'Mwl. Augustine Mrosso', room: 'Darasa 7A' },
    P8: { subject: 'Vocational Skills (Stadi za Kazi)', teacher: 'Mwl. Godfrey Makere', room: 'Darasa 7A' },
  },
  TUE: {
    P1: { subject: 'English Language', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P2: { subject: 'English Language', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P3: { subject: 'Mathematics (Hisabati)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P4: { subject: 'Social Studies (Maarifa ya Jamii)', teacher: 'Mwl. Augustine Mrosso', room: 'Darasa 7A' },
    P5: { subject: 'Science & Technology (Sayansi)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P6: { subject: 'Kiswahili', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P7: { subject: 'Civic & Moral (Uraia na Maadili)', teacher: 'Mwl. Augustine Mrosso', room: 'Darasa 7A' },
    P8: { subject: 'ICT / Computer Studies (Tehama)', teacher: 'Mwl. Emmanuel Lyimo', room: 'Lab ya Kompyuta' },
  },
  WED: {
    P1: { subject: 'Science & Technology (Sayansi)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P2: { subject: 'Science & Technology (Sayansi)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P3: { subject: 'Mathematics (Hisabati)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P4: { subject: 'Kiswahili', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P5: { subject: 'Civic & Moral (Uraia na Maadili)', teacher: 'Mwl. Augustine Mrosso', room: 'Darasa 7A' },
    P6: { subject: 'English Language', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P7: { subject: 'Social Studies (Maarifa ya Jamii)', teacher: 'Mwl. Augustine Mrosso', room: 'Darasa 7A' },
    P8: { subject: 'Religious Studies (Elimu ya Dini)', teacher: 'Mwl. Emmanuel Swai', room: 'Darasa 7A' },
  },
  THU: {
    P1: { subject: 'Mathematics (Hisabati)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P2: { subject: 'Mathematics (Hisabati)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P3: { subject: 'Kiswahili', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P4: { subject: 'English Language', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P5: { subject: 'Science & Technology (Sayansi)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P6: { subject: 'Social Studies (Maarifa ya Jamii)', teacher: 'Mwl. Augustine Mrosso', room: 'Darasa 7A' },
    P7: { subject: 'Civic & Moral (Uraia na Maadili)', teacher: 'Mwl. Augustine Mrosso', room: 'Darasa 7A' },
    P8: { subject: 'Michezo na Mazoezi ya Viungo', teacher: 'Mwl. Godfrey Makere', room: 'Uwanja wa Shule' },
  },
  FRI: {
    P1: { subject: 'Kiswahili', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P2: { subject: 'English Language', teacher: 'Mwl. Sarah Mollel', room: 'Darasa 7A' },
    P3: { subject: 'Social Studies (Maarifa ya Jamii)', teacher: 'Mwl. Augustine Mrosso', room: 'Darasa 7A' },
    P4: { subject: 'Science & Technology (Sayansi)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P5: { subject: 'Mathematics (Hisabati)', teacher: 'Mwl. Beatrice Kimaro', room: 'Darasa 7A' },
    P6: { subject: 'Civic & Moral (Uraia na Maadili)', teacher: 'Mwl. Augustine Mrosso', room: 'Darasa 7A' },
    P7: { subject: 'Klabu za Masomo & Majaribio', teacher: 'Walimu Wote', room: 'Ukumbi / Madarasa' },
    P8: { subject: 'Usafi na Mkutano wa Shule', teacher: 'Mwl. Mkuu & Makamu', room: 'Mkusanyiko' },
  },
};

export default function TimetablePage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_BLUEPRINT_ACCOUNTS[0] || null);
  const [selectedTerm, setSelectedTerm] = useState<'TERM_1' | 'TERM_2'>('TERM_1');
  const [selectedClass, setSelectedClass] = useState<string>('Standard 7 (Grade 7)');
  const [viewMode, setViewMode] = useState<'CLASS' | 'TEACHER' | 'FULL_SCHOOL'>('CLASS');
  const [teacherFilter, setTeacherFilter] = useState<string>('ALL');

  // Official Upload Metadata
  const [uploadInfo, setUploadInfo] = useState({
    academicYear: '2026',
    title: 'RATIBA KUU YA MASOMO YA MWAKA MZIMA 2026',
    uploadedBy: 'Mwl. Augustine Mrosso (Mwalimu Mkuu) & Mwl. Beatrice Kimaro (Taaluma)',
    lastUpdated: '15 Januari 2026',
    referenceNumber: 'SCH-TIMETABLE-2026-VER-01',
    status: 'OFFICIAL_APPROVED',
  });

  // Upload Modal State (for Headmaster, Second Master, Academic, Assistant Academic)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadAcademicYear, setUploadAcademicYear] = useState('2026');
  const [uploadTerm, setUploadTerm] = useState('Muhula wa 1 & 2 (Mwaka Mzima)');
  const [uploadFileNote, setUploadFileNote] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }

    try {
      const stored = localStorage.getItem(TIMETABLE_STORAGE_KEY);
      if (stored) {
        setUploadInfo(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Check if current user is authorized to upload and edit timetable:
  // Headmaster, Second Master, Academic Master, Assistant Academic, Admin
  const isAuthorizedToUpload =
    currentUser?.role === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'SECOND_MASTER' ||
    currentUser?.leadershipRole === 'DEPUTY_HEADTEACHER' ||
    currentUser?.role === 'ACADEMIC' ||
    currentUser?.leadershipRole === 'ACADEMIC' ||
    currentUser?.leadershipRole === 'ASSISTANT_ACADEMIC' ||
    currentUser?.role === 'ADMIN';

  // Handle Timetable Upload Form
  const handleUploadTimetable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const uploaderRole =
      currentUser.leadershipRole === 'HEADTEACHER' || currentUser.role === 'HEADTEACHER'
        ? 'Mwalimu Mkuu'
        : currentUser.leadershipRole === 'SECOND_MASTER' || currentUser.leadershipRole === 'DEPUTY_HEADTEACHER'
        ? 'Makamu Mkuu wa Shule'
        : currentUser.leadershipRole === 'ASSISTANT_ACADEMIC'
        ? 'Msaidizi wa Taaluma'
        : currentUser.role === 'ACADEMIC' || currentUser.leadershipRole === 'ACADEMIC'
        ? 'Mwalimu wa Taaluma'
        : 'Uongozi wa Shule';

    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const updated = {
      academicYear: uploadAcademicYear,
      title: `RATIBA KUU YA MASOMO YA SHULE — ${uploadTerm.toUpperCase()}`,
      uploadedBy: `${currentUser.fullName} (${uploaderRole})`,
      lastUpdated: timestamp,
      referenceNumber: `SCH-TIMETABLE-${uploadAcademicYear}-REV-${Math.floor(100 + Math.random() * 900)}`,
      status: 'OFFICIAL_APPROVED',
    };

    setUploadInfo(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }

    setShowUploadModal(false);
    notifyUser(
      'success',
      'Ratiba ya Mwaka Mzima Imepakiwa & Kuidhinishwa!',
      `Ratiba mpya imepakiwa na kutangazwa rasmi na ${uploaderRole} (${currentUser.fullName}). Kila mtumiaji sasa ataiona.`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <TeacherShell
      pageTitle="Ratiba ya Shule ya Mwaka Mzima (School Master Timetable)"
      pageDescription="Ratiba rasmi ya masomo ya mwaka mzima kwa madarasa yote (Standard 1–7), wazi kwa kila mwalimu, uongozi na watumiaji wote."
    >
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
        {/* ================================================================= */}
        {/* 1. OFFICIAL TIMETABLE BANNER & STATUS */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-black text-xs uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Ratiba Rasmi ya Mwaka Mzima</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-xs border border-amber-200">
                Mwaka {uploadInfo.academicYear} • Muhula wa 1 &amp; 2
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
              {uploadInfo.title}
            </h1>

            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2 pt-0.5">
              <span>Imepakiwa &amp; Kuidhinishwa na: <strong className="text-emerald-950 font-bold">{uploadInfo.uploadedBy}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Tarehe: {uploadInfo.lastUpdated}</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-600">Cheti: {uploadInfo.referenceNumber}</span>
            </p>
          </div>

          {/* Action buttons: Print & Upload if authorized */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Chapisha (Print)</span>
            </button>

            {/* AUTHORIZED UPLOAD BUTTON FOR: Headmaster, Second Master, Academic, Assistant Academic */}
            {isAuthorizedToUpload && (
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-emerald-950" />
                <span>Pakia / Badilisha Ratiba</span>
              </button>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. TIMETABLE CONTROLS & FILTERS */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Class Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-emerald-800" />
              <span>Darasa:</span>
            </span>
            {PRIMARY_CLASSES.map((cls) => {
              const isSelected = selectedClass === cls;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
                  }`}
                >
                  {cls.split(' (')[0]}
                </button>
              );
            })}
          </div>

          {/* Term Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedTerm('TERM_1')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedTerm === 'TERM_1' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600'
              }`}
            >
              Muhula wa 1
            </button>
            <button
              onClick={() => setSelectedTerm('TERM_2')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedTerm === 'TERM_2' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600'
              }`}
            >
              Muhula wa 2
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. TIMETABLE GRID TABLE (MONDAY TO FRIDAY, P1 TO P8) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl border border-emerald-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-800" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Ratiba ya Vipindi: {selectedClass} • {selectedTerm === 'TERM_1' ? 'Muhula wa 1 (Jan - Mei)' : 'Muhula wa 2 (Jul - Des)'}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                <span>Vipindi vya Masomo (40 mins)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span>Mapumziko / Chakula</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-4 w-32 border-r border-slate-200 uppercase text-[11px]">Siku (Day)</th>
                  {PERIOD_TIMES.map((period) => (
                    <th
                      key={period.id}
                      className={`py-2 px-2 text-center border-r border-slate-200 ${
                        period.isBreak ? 'bg-amber-50/80 text-amber-950 w-24' : 'min-w-[130px]'
                      }`}
                    >
                      <span className="block font-black text-slate-900">{period.id}</span>
                      <span className="block text-[10px] text-slate-500 font-medium">{period.time}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {DAYS_OF_WEEK.map((day) => (
                  <tr key={day.key} className="hover:bg-slate-50/60 transition-colors">
                    {/* Day Column */}
                    <td className="py-4 px-4 font-black text-slate-900 bg-slate-50/70 border-r border-slate-200">
                      <span>{day.label}</span>
                    </td>

                    {/* Periods */}
                    {PERIOD_TIMES.map((period) => {
                      if (period.isBreak) {
                        return (
                          <td
                            key={period.id}
                            className="py-2 px-2 text-center bg-amber-50/40 text-amber-900 border-r border-slate-200 text-[10px] font-bold"
                          >
                            <span className="rotate-0 inline-block">{period.label}</span>
                          </td>
                        );
                      }

                      const slot = DEFAULT_STD7_TIMETABLE[day.key]?.[period.id];

                      return (
                        <td
                          key={period.id}
                          className="py-3 px-2 border-r border-slate-200 align-top"
                        >
                          {slot ? (
                            <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition-all space-y-1">
                              <span className="font-bold text-slate-900 block leading-tight text-[11px]">
                                {slot.subject}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-800 block">
                                {slot.teacher}
                              </span>
                              {slot.room && (
                                <span className="text-[9px] font-mono text-slate-400 block">
                                  {slot.room}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="p-2 rounded-xl bg-slate-50 text-slate-400 text-center text-[10px]">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer of Table */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Ratiba hii inafuatwa na walimu wote wa shule kwa mujibu wa muhtasari wa Wizara ya Elimu (MoEST).</span>
            </div>
            <div className="font-mono text-slate-500">
              Vipindi 40 kwa Wiki • Dakika 40 kila Kipindi
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. MODAL: UPLOAD / UPDATE TIMETABLE (HEADMASTER, SECOND MASTER, ACADEMIC) */}
        {/* ================================================================= */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Pakia / Idhinisha Ratiba Mpya ya Mwaka
                    </h3>
                    <span className="text-xs text-emerald-700 font-bold">
                      Idhini: Mwalimu Mkuu, Makamu au Taaluma
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadTimetable} className="space-y-4 text-xs">
                {/* Academic Year & Term */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Mwaka wa Masomo:
                    </label>
                    <input
                      type="text"
                      value={uploadAcademicYear}
                      onChange={(e) => setUploadAcademicYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Muhula (Term):
                    </label>
                    <select
                      value={uploadTerm}
                      onChange={(e) => setUploadTerm(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                    >
                      <option value="Muhula wa 1 & 2 (Mwaka Mzima)">Muhula wa 1 &amp; 2 (Mwaka Mzima)</option>
                      <option value="Muhula wa 1 Tu">Muhula wa 1 Tu</option>
                      <option value="Muhula wa 2 Tu">Muhula wa 2 Tu</option>
                    </select>
                  </div>
                </div>

                {/* Upload File Input (Excel / PDF) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Chagua Faili la Ratiba (Excel au PDF):
                  </label>
                  <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 text-center hover:bg-emerald-50/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="timetable-file"
                      accept=".xlsx,.xls,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedFileName(file.name);
                      }}
                      className="hidden"
                    />
                    <label htmlFor="timetable-file" className="cursor-pointer block space-y-1">
                      <FileSpreadsheet className="w-8 h-8 text-emerald-800 mx-auto" />
                      <span className="font-bold text-emerald-950 block">
                        {selectedFileName || 'Bofya hapa kupakia faili la Ratiba (Excel/PDF)'}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Faili linalokubalika: .xlsx, .xls au .pdf
                      </span>
                    </label>
                  </div>
                </div>

                {/* Notes from Leadership */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Maelezo ya Ziada / Muongozo wa Uongozi:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mfano: Ratiba hii imezingatia maelekezo ya Wizara ya Elimu kuhusu vipindi vya Sayansi na TEHAMA..."
                    value={uploadFileNote}
                    onChange={(e) => setUploadFileNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                {/* Verification Notice */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <p className="font-bold">Uthibitisho wa Kiuongozi:</p>
                  <p className="text-[11px] text-emerald-900 mt-0.5">
                    Unapoidhinisha ratiba hii, itasambazwa na kuonekana moja kwa moja kwa walimu wote, wanafunzi, na kwenye portal nzima ya shule.
                  </p>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Idhinisha &amp; Tangaza Ratiba</span>
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
