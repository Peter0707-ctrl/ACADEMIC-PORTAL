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
  ChevronRight,
  Bookmark,
  Bell,
  Check,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, INITIAL_BLUEPRINT_ACCOUNTS, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

const TIMETABLE_STORAGE_KEY = 'school_master_timetable_2026_v2';
const ALMANAC_STORAGE_KEY = 'school_master_almanac_2026_v2';

interface TimetableSlot {
  subject: string;
  teacher: string;
  room?: string;
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

// Official School Almanac 2026 Events (Tanzania Primary Calendar)
interface AlmanacEvent {
  id: string;
  term: 'TERM_1' | 'TERM_2';
  month: string;
  dateRange: string;
  title: string;
  category: 'EXAM' | 'HOLIDAY' | 'TERM_DATES' | 'NATIONAL_EXAM' | 'PARENTS_EVENT' | 'SPORTS';
  description: string;
}

const DEFAULT_ALMANAC_EVENTS: AlmanacEvent[] = [
  // Term 1
  {
    id: 'alm-01',
    term: 'TERM_1',
    month: 'Januari 2026',
    dateRange: '12 Januari 2026',
    title: 'Kufungua Shule Muhula wa Kwanza (School Opening)',
    category: 'TERM_DATES',
    description: 'Wanafunzi wote kuripoti shuleni. Usajili wa wanafunzi wapya wa Elimu ya Awali na Darasa la Kwanza.',
  },
  {
    id: 'alm-02',
    term: 'TERM_1',
    month: 'Januari 2026',
    dateRange: '30 Januari 2026',
    title: 'Jaribio la Kwanza la Mwezi (Monthly Test 1)',
    category: 'EXAM',
    description: 'Majaribio ya mwezi kwa madarasa yote (Standard 1–7) kwa masomo yote ya msingi.',
  },
  {
    id: 'alm-03',
    term: 'TERM_1',
    month: 'Februari 2026',
    dateRange: '27 Februari 2026',
    title: 'Jaribio la Pili la Mwezi (Monthly Test 2)',
    category: 'EXAM',
    description: 'Tathmini ya pili ya mwezi na ukaguzi wa maendeleo ya mtaala (syllabus coverage check).',
  },
  {
    id: 'alm-04',
    term: 'TERM_1',
    month: 'Machi 2026',
    dateRange: '23 – 27 Machi 2026',
    title: 'Mitihani ya Nusu Muhula wa Kwanza (Mid-Term Exams)',
    category: 'EXAM',
    description: 'Mitihani rasmi ya nusu muhula kwa madarasa yote. Uwasilishaji wa alama na tathmini ya ufaulu.',
  },
  {
    id: 'alm-05',
    term: 'TERM_1',
    month: 'Machi – Aprili 2026',
    dateRange: '28 Machi – 06 Aprili 2026',
    title: 'Likizo Fupi ya Nusu Muhula wa Kwanza (Mid-Term Break)',
    category: 'HOLIDAY',
    description: 'Wanafunzi kwenda likizo fupi ya nusu muhula. Shule inafunguliwa Jumanne, 07 Aprili 2026.',
  },
  {
    id: 'alm-06',
    term: 'TERM_1',
    month: 'Aprili 2026',
    dateRange: '26 Aprili 2026',
    title: 'Sikukuu ya Muungano wa Tanzania (Union Day)',
    category: 'HOLIDAY',
    description: 'Sikukuu ya Kitaifa ya Jamhuri ya Muungano wa Tanzania.',
  },
  {
    id: 'alm-07',
    term: 'TERM_1',
    month: 'Mei 2026',
    dateRange: '25 – 29 Mei 2026',
    title: 'Mitihani ya Mwisho wa Muhula wa Kwanza (Terminal Exams)',
    category: 'EXAM',
    description: 'Mitihani ya kufunga muhula wa 1, utayarishaji wa ripoti za matokeo na broadsheet ya shule.',
  },
  {
    id: 'alm-08',
    term: 'TERM_1',
    month: 'Juni 2026',
    dateRange: '05 Juni – 05 Julai 2026',
    title: 'Likizo ya Mwisho wa Muhula wa Kwanza (Term 1 Vacation)',
    category: 'HOLIDAY',
    description: 'Likizo ya mwezi mmoja kwa wanafunzi na walimu. Shule inafungua Muhula wa 2 tarehe 06 Julai 2026.',
  },
  // Term 2
  {
    id: 'alm-09',
    term: 'TERM_2',
    month: 'Julai 2026',
    dateRange: '06 Julai 2026',
    title: 'Kufungua Shule Muhula wa Pili (Term 2 Opening)',
    category: 'TERM_DATES',
    description: 'Kuanza rasmi masomo ya muhula wa pili. Kambi maalum ya kujiandaa na NECTA PSLE kwa Darasa la Saba.',
  },
  {
    id: 'alm-10',
    term: 'TERM_2',
    month: 'Agosti 2026',
    dateRange: '17 – 21 Agosti 2026',
    title: 'Mtihani wa Utayari wa Mkoa / MOCK Std 7 (PSLE Mock Exam)',
    category: 'EXAM',
    description: 'Mtihani wa majaribio ya Mkoa kwa watahiniwa wote 95 wa Darasa la Saba kabla ya NECTA ya Taifa.',
  },
  {
    id: 'alm-11',
    term: 'TERM_2',
    month: 'Septemba 2026',
    dateRange: '09 – 10 Septemba 2026',
    title: 'MTIHANI WA TAIFA WA DARASA LA SABA (NECTA PSLE 2026)',
    category: 'NATIONAL_EXAM',
    description: 'Mtihani rasmi wa Taifa wa Kumaliza Elimu ya Msingi (Primary School Leaving Examination - PSLE).',
  },
  {
    id: 'alm-12',
    term: 'TERM_2',
    month: 'Septemba 2026',
    dateRange: '25 Septemba 2026',
    title: 'Mahafali ya Darasa la Saba (Class 7 Graduation Day)',
    category: 'PARENTS_EVENT',
    description: 'Sherehe rasmi ya kuwaaga wahitimu wa Darasa la Saba, utoaji vyeti vya nidhamu na tuzo za kitaaluma.',
  },
  {
    id: 'alm-13',
    term: 'TERM_2',
    month: 'Oktoba 2026',
    dateRange: '21 – 22 Oktoba 2026',
    title: 'MTIHANI WA TAIFA WA DARASA LA NNE (NECTA SFNA 2026)',
    category: 'NATIONAL_EXAM',
    description: 'Upimaji wa Kitaifa wa Darasa la Nne (Standard Four National Assessment - SFNA) nchi nzima.',
  },
  {
    id: 'alm-14',
    term: 'TERM_2',
    month: 'Novemba 2026',
    dateRange: '23 – 27 Novemba 2026',
    title: 'Mitihani ya Kufunga Mwaka (Annual Examinations Std 1–6)',
    category: 'EXAM',
    description: 'Mitihani ya mwisho wa mwaka ya kupandisha madarasa (Promotion Exams) kwa Standard 1 hadi 6.',
  },
  {
    id: 'alm-15',
    term: 'TERM_2',
    month: 'Desemba 2026',
    dateRange: '04 Desemba 2026',
    title: 'Kufunga Shule Likizo ya Mwisho wa Mwaka (Annual Vacation)',
    category: 'TERM_DATES',
    description: 'Kutoa ripoti za mwisho wa mwaka na kuanza likizo ndefu ya mwisho wa mwaka.',
  },
];

export default function TimetablePage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_BLUEPRINT_ACCOUNTS[0] || null);

  // Active Main Tab: TIMETABLE vs ALMANAC
  const [activeMainTab, setActiveMainTab] = useState<'TIMETABLE' | 'ALMANAC'>('TIMETABLE');

  // Timetable State
  const [selectedTerm, setSelectedTerm] = useState<'TERM_1' | 'TERM_2'>('TERM_1');
  const [selectedClass, setSelectedClass] = useState<string>('Standard 7 (Grade 7)');

  // Almanac State
  const [almanacTermFilter, setAlmanacTermFilter] = useState<'ALL' | 'TERM_1' | 'TERM_2'>('ALL');
  const [almanacCategoryFilter, setAlmanacCategoryFilter] = useState<string>('ALL');

  // Metadata for Timetable (Managed by Academic Master)
  const [uploadInfo, setUploadInfo] = useState({
    academicYear: '2026',
    title: 'RATIBA KUU YA MASOMO YA MWAKA MZIMA 2026',
    uploadedBy: 'Mwl. Beatrice Kimaro (Mwalimu wa Taaluma)',
    lastUpdated: '15 Januari 2026',
    referenceNumber: 'SCH-ACAD-TIMETABLE-2026',
    status: 'OFFICIAL_APPROVED',
  });

  // Metadata for School Almanac (Managed by Academic Master)
  const [almanacInfo, setAlmanacInfo] = useState({
    academicYear: '2026',
    title: 'ALMANAC & KALENDA KUU YA MATUKIO YA SHULE 2026',
    uploadedBy: 'Mwl. Beatrice Kimaro (Mwalimu wa Taaluma) & Mwl. Augustine Mrosso (Mkuu wa Shule)',
    lastUpdated: '10 Januari 2026',
    referenceNumber: 'SCH-ALMANAC-2026-MOEST',
  });

  // Modal State for Uploading Timetable / Almanac
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'TIMETABLE' | 'ALMANAC'>('TIMETABLE');
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
      if (stored) setUploadInfo(JSON.parse(stored));
      const storedAlm = localStorage.getItem(ALMANAC_STORAGE_KEY);
      if (storedAlm) setAlmanacInfo(JSON.parse(storedAlm));
    } catch {}
  }, []);

  // Check if current user has permission to upload/manage Timetable & Almanac:
  // ACADEMIC MASTER (Primary Responsible), ASSISTANT ACADEMIC, HEADTEACHER, SECOND MASTER, ADMIN
  const isAcademicOffice =
    currentUser?.role === 'ACADEMIC' ||
    currentUser?.leadershipRole === 'ACADEMIC' ||
    currentUser?.leadershipRole === 'ASSISTANT_ACADEMIC';

  const isSchoolLeadership =
    currentUser?.role === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'SECOND_MASTER' ||
    currentUser?.leadershipRole === 'DEPUTY_HEADTEACHER' ||
    currentUser?.role === 'ADMIN';

  const isAuthorizedToUpload = isAcademicOffice || isSchoolLeadership;

  // Handle Upload
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const uploaderRole = isAcademicOffice
      ? 'Mwalimu wa Taaluma (Academic Master)'
      : currentUser.leadershipRole === 'HEADTEACHER' || currentUser.role === 'HEADTEACHER'
      ? 'Mwalimu Mkuu (Headmaster)'
      : 'Uongozi wa Shule';

    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (uploadTarget === 'TIMETABLE') {
      const updated = {
        academicYear: uploadAcademicYear,
        title: `RATIBA KUU YA MASOMO YA SHULE — ${uploadTerm.toUpperCase()}`,
        uploadedBy: `${currentUser.fullName} (${uploaderRole})`,
        lastUpdated: timestamp,
        referenceNumber: `SCH-ACAD-TIMETABLE-${uploadAcademicYear}-REV${Math.floor(10 + Math.random() * 90)}`,
        status: 'OFFICIAL_APPROVED',
      };
      setUploadInfo(updated);
      try {
        localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      notifyUser(
        'success',
        'Ratiba ya Mwaka Mzima Imepakiwa!',
        `Ratiba imepakiwa na kutangazwa rasmi na ${uploaderRole} (${currentUser.fullName}).`
      );
    } else {
      const updated = {
        academicYear: uploadAcademicYear,
        title: `ALMANAC YA SHULE YA MWAKA ${uploadAcademicYear} (MOEST COMPLIANT)`,
        uploadedBy: `${currentUser.fullName} (${uploaderRole})`,
        lastUpdated: timestamp,
        referenceNumber: `SCH-ALMANAC-${uploadAcademicYear}-VER${Math.floor(10 + Math.random() * 90)}`,
      };
      setAlmanacInfo(updated);
      try {
        localStorage.setItem(ALMANAC_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      notifyUser(
        'success',
        'School Almanac Imepakiwa & Kusasishwa!',
        `Almanac ya shule ya mwaka ${uploadAcademicYear} imepakiwa rasmi na ${uploaderRole}.`
      );
    }

    setShowUploadModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered Almanac Events
  const filteredAlmanac = DEFAULT_ALMANAC_EVENTS.filter((ev) => {
    const matchesTerm = almanacTermFilter === 'ALL' || ev.term === almanacTermFilter;
    const matchesCat = almanacCategoryFilter === 'ALL' || ev.category === almanacCategoryFilter;
    return matchesTerm && matchesCat;
  });

  return (
    <TeacherShell
      pageTitle="Ratiba ya Shule & School Almanac (Timetable & Academic Calendar)"
      pageDescription="Ratiba kuu ya vipindi na kalenda ya shule ya mwaka mzima (School Almanac) inayosimamiwa na Mwalimu wa Taaluma (Academic Master)."
    >
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
        {/* ================================================================= */}
        {/* 1. TOP DUAL TAB NAVIGATION: TIMETABLE vs SCHOOL ALMANAC */}
        {/* ================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-3xl border border-emerald-200 shadow-xs">
          <div className="flex items-center gap-2 bg-emerald-50/80 p-1.5 rounded-2xl border border-emerald-200/80">
            <button
              type="button"
              onClick={() => setActiveMainTab('TIMETABLE')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
                activeMainTab === 'TIMETABLE'
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                  : 'text-emerald-950 hover:bg-emerald-100/70'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>Ratiba ya Vipindi (Weekly Timetable)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('ALMANAC')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
                activeMainTab === 'ALMANAC'
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                  : 'text-emerald-950 hover:bg-emerald-100/70'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-300" />
              <span>School Almanac (Kalenda ya Mwaka 2026)</span>
            </button>
          </div>

          {/* Action buttons (Print & Upload for Academic/Leadership) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Chapisha (Print)</span>
            </button>

            {isAuthorizedToUpload && (
              <button
                type="button"
                onClick={() => {
                  setUploadTarget(activeMainTab);
                  setShowUploadModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-emerald-950" />
                <span>
                  {activeMainTab === 'TIMETABLE' ? 'Pakia Ratiba (Taaluma)' : 'Pakia Almanac (Taaluma)'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. TAB 1: RATIBA YA VIPINDI (TIMETABLE VIEW) */}
        {/* ================================================================= */}
        {activeMainTab === 'TIMETABLE' && (
          <div className="space-y-6">
            {/* Timetable Header Card */}
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-emerald-800 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    <span>Inasimamiwa na Ofisi ya Taaluma (Academic Master)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-[10px] border border-amber-200">
                    Mwaka {uploadInfo.academicYear}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
                  {uploadInfo.title}
                </h1>

                <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2 pt-0.5">
                  <span>Imepakiwa na: <strong className="text-emerald-950 font-bold">{uploadInfo.uploadedBy}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>Tarehe: {uploadInfo.lastUpdated}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-600">Rejea: {uploadInfo.referenceNumber}</span>
                </p>
              </div>

              {/* Notice for teachers */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs max-w-xs text-emerald-950">
                <span className="font-black block">Wazi kwa Walimu Wote:</span>
                <span className="text-[11px] text-emerald-900">
                  Ratiba hii inatumika kwa madarasa yote kuanzia Awali hadi Darasa la Saba kwa muhula wote.
                </span>
              </div>
            </div>

            {/* Timetable Filters (Class Tabs & Term Switcher) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
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

            {/* Timetable Grid Table */}
            <div className="bg-white rounded-3xl border border-emerald-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-800" />
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Ratiba ya Vipindi: {selectedClass} • {selectedTerm === 'TERM_1' ? 'Muhula wa 1 (Jan - Mei)' : 'Muhula wa 2 (Jul - Des)'}
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
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
                        <td className="py-4 px-4 font-black text-slate-900 bg-slate-50/70 border-r border-slate-200">
                          <span>{day.label}</span>
                        </td>

                        {PERIOD_TIMES.map((period) => {
                          if (period.isBreak) {
                            return (
                              <td
                                key={period.id}
                                className="py-2 px-2 text-center bg-amber-50/40 text-amber-900 border-r border-slate-200 text-[10px] font-bold"
                              >
                                <span>{period.label}</span>
                              </td>
                            );
                          }

                          const slot = DEFAULT_STD7_TIMETABLE[day.key]?.[period.id];

                          return (
                            <td key={period.id} className="py-3 px-2 border-r border-slate-200 align-top">
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

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Imeidhinishwa na Mwalimu wa Taaluma &amp; Mwalimu Mkuu kwa mujibu wa muhtasari wa Wizara ya Elimu (MoEST).</span>
                </div>
                <div className="font-mono text-slate-500">
                  Vipindi 40 kwa Wiki • Dakika 40 kila Kipindi
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. TAB 2: SCHOOL ALMANAC (ACADEMIC YEAR 2026 CALENDAR) */}
        {/* ================================================================= */}
        {activeMainTab === 'ALMANAC' && (
          <div className="space-y-6">
            {/* Almanac Banner Card */}
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-emerald-800 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Bookmark className="w-3 h-3 text-amber-300" />
                    <span>Kalenda Kuu ya Shule (School Almanac)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono font-bold text-[10px] border border-emerald-200">
                    Mwaka wa Masomo 2026
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
                  {almanacInfo.title}
                </h1>

                <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2 pt-0.5">
                  <span>Imetolewa na: <strong className="text-emerald-950 font-bold">{almanacInfo.uploadedBy}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>Tarehe: {almanacInfo.lastUpdated}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-slate-600">Rejea: {almanacInfo.referenceNumber}</span>
                </p>
              </div>

              {/* Term Summary Pill */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900 block">Muhula wa 1:</span>
                  <span className="font-mono text-[11px] text-slate-700">12 Jan – 05 Jun 2026</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-900 block">Muhula wa 2:</span>
                  <span className="font-mono text-[11px] text-slate-700">06 Jul – 04 Des 2026</span>
                </div>
              </div>
            </div>

            {/* National Exam Highlights (SFNA & PSLE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-amber-100 font-black text-[10px] uppercase">
                    Mtihani wa Taifa (NECTA)
                  </span>
                  <Award className="w-5 h-5 text-amber-200" />
                </div>
                <h3 className="text-lg font-black tracking-tight">PSLE 2026 — Darasa la Saba</h3>
                <p className="text-xs text-amber-100 leading-relaxed">
                  Tarehe ya Mtihani wa Taifa: <strong>09 – 10 Septemba 2026</strong>. Watahiniwa 95 wameandikishwa.
                </p>
              </div>

              <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-emerald-100 font-black text-[10px] uppercase">
                    Upimaji wa Taifa (NECTA)
                  </span>
                  <Award className="w-5 h-5 text-emerald-200" />
                </div>
                <h3 className="text-lg font-black tracking-tight">SFNA 2026 — Darasa la Nne</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Tarehe ya Upimaji wa Kitaifa: <strong>21 – 22 Oktoba 2026</strong>. Wanafunzi wote wa Darasa la 4.
                </p>
              </div>
            </div>

            {/* Almanac Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  <Filter className="w-4 h-4 text-emerald-800" />
                  <span>Chuja kwa Muhula:</span>
                </span>
                <button
                  onClick={() => setAlmanacTermFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    almanacTermFilter === 'ALL'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Mwaka Mzima ({DEFAULT_ALMANAC_EVENTS.length})
                </button>
                <button
                  onClick={() => setAlmanacTermFilter('TERM_1')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    almanacTermFilter === 'TERM_1'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Muhula wa 1 (Jan – Juni)
                </button>
                <button
                  onClick={() => setAlmanacTermFilter('TERM_2')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    almanacTermFilter === 'TERM_2'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Muhula wa 2 (Julai – Des)
                </button>
              </div>

              {/* Category Filter */}
              <select
                value={almanacCategoryFilter}
                onChange={(e) => setAlmanacCategoryFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-slate-200 font-bold text-slate-700 bg-white"
              >
                <option value="ALL">Aina Zote za Matukio</option>
                <option value="EXAM">Mitihani ya Ndani ya Shule</option>
                <option value="NATIONAL_EXAM">Mitihani ya Taifa (NECTA)</option>
                <option value="HOLIDAY">Likizo &amp; Sikukuu</option>
                <option value="TERM_DATES">Tarehe za Kufungua/Kufunga</option>
                <option value="PARENTS_EVENT">Siku za Wazazi &amp; Mahafali</option>
              </select>
            </div>

            {/* Almanac Timeline / Events List */}
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Ratiba Kamili ya Matukio ya Shule ({filteredAlmanac.length})</span>
                <span className="text-xs font-normal text-slate-500">Miongozo ya MoEST &amp; TAMISEMI 2026</span>
              </h2>

              <div className="space-y-3">
                {filteredAlmanac.map((ev) => {
                  const isNational = ev.category === 'NATIONAL_EXAM';
                  const isHoliday = ev.category === 'HOLIDAY';
                  const isExam = ev.category === 'EXAM';

                  return (
                    <div
                      key={ev.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isNational
                          ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                          : isHoliday
                          ? 'bg-rose-50/50 border-rose-200'
                          : isExam
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                              isNational
                                ? 'bg-amber-400 text-emerald-950 font-black'
                                : isHoliday
                                ? 'bg-rose-100 text-rose-800'
                                : isExam
                                ? 'bg-emerald-800 text-white'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {isNational
                              ? 'Mtihani wa Taifa (NECTA)'
                              : isHoliday
                              ? 'Likizo / Sikukuu'
                              : isExam
                              ? 'Mtihani wa Shule'
                              : 'Tukio la Shule'}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {ev.month}
                          </span>
                        </div>

                        <h3 className="text-sm font-black text-slate-900 pt-0.5">{ev.title}</h3>
                        <p className="text-xs text-slate-600">{ev.description}</p>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">
                        <span className="inline-block px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-mono font-bold text-xs text-slate-800 shadow-2xs">
                          {ev.dateRange}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. MODAL: UPLOAD TIMETABLE AU SCHOOL ALMANAC (ACADEMIC MASTER) */}
        {/* ================================================================= */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      {uploadTarget === 'TIMETABLE'
                        ? 'Pakia / Idhinisha Ratiba Mpya (Academic Office)'
                        : 'Pakia / Sasisha School Almanac 2026 (Academic Office)'}
                    </h3>
                    <span className="text-xs text-emerald-700 font-bold">
                      Msimamizi Mkuu: Mwalimu wa Taaluma (Academic Master)
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

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                {/* Year & Target */}
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
                      Inahusu Muhula:
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

                {/* File Upload Box */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Chagua Faili la {uploadTarget === 'TIMETABLE' ? 'Ratiba' : 'Almanac'} (Excel au PDF):
                  </label>
                  <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 text-center hover:bg-emerald-50/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="upload-master-file"
                      accept=".xlsx,.xls,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedFileName(file.name);
                      }}
                      className="hidden"
                    />
                    <label htmlFor="upload-master-file" className="cursor-pointer block space-y-1">
                      <FileSpreadsheet className="w-8 h-8 text-emerald-800 mx-auto" />
                      <span className="font-bold text-emerald-950 block">
                        {selectedFileName || `Bofya hapa kupakia faili la ${uploadTarget === 'TIMETABLE' ? 'Ratiba' : 'Almanac'} (.xlsx au .pdf)`}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Faili linalokubalika: Microsoft Excel au PDF rasmi ya shule
                      </span>
                    </label>
                  </div>
                </div>

                {/* Note from Academic Office */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Maelekezo ya Ofisi ya Taaluma:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mfano: Ratiba hii imezingatia muongozo wa Wizara ya Elimu (MoEST) na mapumziko yote ya kisheria..."
                    value={uploadFileNote}
                    onChange={(e) => setUploadFileNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                {/* Official Stamp Notice */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <p className="font-bold">Idhini Rasmi ya Taaluma &amp; Uongozi:</p>
                  <p className="text-[11px] text-emerald-900 mt-0.5">
                    Unapoidhinisha, faili hili litajumuishwa kwenye mfumo na kila mwalimu na mtumiaji ataweza kuiona na kuipakua mara moja.
                  </p>
                </div>

                {/* Actions */}
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
                    <span>Idhinisha &amp; Tangaza</span>
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
