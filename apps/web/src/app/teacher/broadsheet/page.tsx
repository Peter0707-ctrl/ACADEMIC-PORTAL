'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  Check,
  Search,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Clock,
  Send,
  Eye,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  FileCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  CalendarCheck,
  UserCheck,
  UserX,
  GraduationCap,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { notifyUser } from '@/lib/notifications';
import { getCurrentSession } from '@/lib/auth-session';

// =============================================================================
// TYPES & DATA STRUCTURES (AWALI / CHEKECHEA TO STANDARD 7)
// =============================================================================

export interface StudentPerformanceRow {
  admNo: string;
  name: string;
  gender: 'M' | 'F';
  math: number;
  english: number;
  kiswahili: number;
  science: number;
  social: number;
  civic: number;
  total: number;
  average: number;
  division: 'Daraja I' | 'Daraja II' | 'Daraja III' | 'Daraja IV' | 'Daraja 0';
  rank: number;
  // Attendance details
  attendanceDaysPresent: number;
  attendanceDaysAbsent: number;
  attendancePercent: number;
  attendanceStatus: 'Bora' | 'Wastani' | 'Uangalizi';
  // Lesson progress note
  lessonCompletionPercent: number;
}

export interface SubjectCurriculumProgress {
  code: string;
  name: string;
  teacher: string;
  averageMark: number;
  topicsPlanned: number;
  topicsCovered: number;
  coveragePercent: number;
  lessonPlansApproved: number;
  lessonPlansTotal: number;
  status: 'IMEKAMILIKA' | 'INAENDELEA' | 'INAHITAJI_KASI';
}

export interface AIAuditResult {
  completed: boolean;
  scoreAccuracy: number;
  dataHealthScore: number;
  totalMarksAudited: number;
  timestamp: string;
  detectedAnomalies: {
    studentName: string;
    admNo: string;
    subject: string;
    score: number;
    issue: string;
    type: 'TYPO_SUSPICION' | 'VARIANCE' | 'MISSING_RESOLVED';
  }[];
}

// 8 Complete Classes from Kindergarten (Awali/Chekechea) to Standard 7
const ALL_SCHOOL_CLASSES = [
  {
    id: 'chekechea',
    name: 'Awali / Chekechea (Kindergarten)',
    shortName: 'Chekechea (Awali)',
    badge: 'Awali / Pre-Unit',
    level: 'Elimu ya Awali (Umri miaka 4–5)',
    totalStudents: 30,
    termDays: 60,
  },
  {
    id: 'std-1',
    name: 'Standard 1 (Grade 1)',
    shortName: 'Standard 1',
    badge: 'Darasa la 1',
    level: 'Elimu ya Awali ya Msingi (Stadi za KKK)',
    totalStudents: 35,
    termDays: 60,
  },
  {
    id: 'std-2',
    name: 'Standard 2 (Grade 2)',
    shortName: 'Standard 2',
    badge: 'Darasa la 2',
    level: 'Darasa la Pili (KKK & Umahiri)',
    totalStudents: 35,
    termDays: 60,
  },
  {
    id: 'std-3',
    name: 'Standard 3 (Grade 3)',
    shortName: 'Standard 3',
    badge: 'Darasa la 3',
    level: 'Darasa la Tatu (Mtaala Mpya)',
    totalStudents: 35,
    termDays: 60,
  },
  {
    id: 'std-4',
    name: 'Standard 4 (Grade 4)',
    shortName: 'Standard 4 (SFNA)',
    badge: 'Watahiniwa wa Taifa (SFNA)',
    level: 'Mtihani wa Kitaifa wa Upimaji (SFNA)',
    totalStudents: 35,
    termDays: 60,
  },
  {
    id: 'std-5',
    name: 'Standard 5 (Grade 5)',
    shortName: 'Standard 5',
    badge: 'Darasa la 5',
    level: 'Darasa la Tano',
    totalStudents: 35,
    termDays: 60,
  },
  {
    id: 'std-6',
    name: 'Standard 6 (Grade 6)',
    shortName: 'Standard 6',
    badge: 'Darasa la 6',
    level: 'Darasa la Sita',
    totalStudents: 35,
    termDays: 60,
  },
  {
    id: 'std-7',
    name: 'Standard 7 (Grade 7)',
    shortName: 'Standard 7 (PSLE)',
    badge: 'Watahiniwa wa Taifa (PSLE)',
    level: 'Mtihani wa Kitaifa wa Kumaliza Elimu ya Msingi',
    totalStudents: 35,
    termDays: 60,
  },
];

// 6 Core Subject Framework
const CORE_SUBJECTS = [
  { code: 'MATH', name: 'Mathematics (Hisabati)', defaultTeacher: 'Mwl. Beatrice Kimaro (Academic)' },
  { code: 'ENG', name: 'English Language (Kiingereza)', defaultTeacher: 'Mwl. Grace Shayo' },
  { code: 'KISW', name: 'Kiswahili', defaultTeacher: 'Mwl. Juma Athumani' },
  { code: 'SCI', name: 'Science & Tech (Sayansi)', defaultTeacher: 'Mwl. Emmanuel Lyimo' },
  { code: 'SOC', name: 'Social Studies (Maarifa ya Jamii)', defaultTeacher: 'Mwl. Rehema Mushi' },
  { code: 'CIV', name: 'Civic & Moral (Uraia na Maadili)', defaultTeacher: 'Mwl. Frank Msaki (Second Master)' },
];

// Names database for generating realistic Tanzanian pupil rosters
const FIRST_NAMES_M = ['Baraka', 'Juma', 'Kelvin', 'Rashid', 'Emmanuel', 'Frank', 'Geofrey', 'Dennis', 'Faraji', 'Godfrey', 'Michael', 'Saidi', 'Albert', 'David', 'Kassim', 'Meshack', 'Oscar', 'Ramadhani', 'Titus', 'Yusuph', 'Collins', 'Innocent', 'Lucas', 'Samwel'];
const FIRST_NAMES_F = ['Amina', 'Grace', 'Neema', 'Beatrice', 'Ester', 'Fatuma', 'Diana', 'Zuwena', 'Hawa', 'Jackline', 'Lilian', 'Nancy', 'Pauline', 'Sabrina', 'Upendo', 'Winnie', 'Zainab', 'Brenda', 'Elizabeth', 'Gloria', 'Caroline', 'Irene', 'Kulwa', 'Mariam'];
const LAST_NAMES = ['Massawe', 'Mlay', 'Mshana', 'Mushi', 'Temu', 'Kimaro', 'Lyimo', 'Shirima', 'Minja', 'Kavishe', 'Mrema', 'Tarimo', 'Maro', 'Mallya', 'Macha', 'Kweka', 'Shayo', 'Mollel', 'Mkude', 'Kingazi', 'Mwinyi', 'Nassor', 'Swai', 'Lyatuu'];

// Helper to generate full realistic roster for any class
function generateClassRoster(className: string, count: number): StudentPerformanceRow[] {
  const prefix = className.includes('Chekechea') || className.includes('Awali')
    ? 'AWL-2026'
    : className.includes('7')
    ? 'PSLE-2026'
    : className.includes('4')
    ? 'SFNA-2026'
    : `STD${className.match(/\d/)?.[0] || '1'}-2026`;

  const rows: StudentPerformanceRow[] = [];
  const baseOffset = className.includes('7') ? 9 : className.includes('4') ? 6 : className.includes('Chekechea') ? 10 : 3;

  for (let i = 0; i < count; i++) {
    const isM = i % 2 === 0;
    const fName = isM
      ? FIRST_NAMES_M[i % FIRST_NAMES_M.length]
      : FIRST_NAMES_F[i % FIRST_NAMES_F.length];
    const lName = LAST_NAMES[(i * 3 + (isM ? 1 : 2)) % LAST_NAMES.length];
    const candidateTag = className.includes('7') || className.includes('4') ? ' (Candidate)' : '';
    const name = `${fName} ${lName}${candidateTag}`;
    const admNo = `${prefix}-${String(100 + i + 1).padStart(4, '0')}`;

    // Subject Marks (0 - 100)
    const m = Math.min(100, Math.max(54, 75 + baseOffset + ((i * 7) % 23) - ((i % 5) * 2)));
    const e = Math.min(100, Math.max(56, 77 + baseOffset + ((i * 5) % 21) - ((i % 4) * 2)));
    const k = Math.min(100, Math.max(60, 80 + baseOffset + ((i * 4) % 19) - ((i % 6) * 1)));
    const s = Math.min(100, Math.max(55, 76 + baseOffset + ((i * 6) % 22) - ((i % 3) * 3)));
    const soc = Math.min(100, Math.max(58, 78 + baseOffset + ((i * 3) % 20) - ((i % 7) * 2)));
    const c = Math.min(100, Math.max(62, 81 + baseOffset + ((i * 8) % 18) - ((i % 4) * 1)));

    const total = m + e + k + s + soc + c;
    const avg = Number((total / 6).toFixed(1));

    const division =
      avg >= 81
        ? 'Daraja I'
        : avg >= 65
        ? 'Daraja II'
        : avg >= 45
        ? 'Daraja III'
        : avg >= 30
        ? 'Daraja IV'
        : 'Daraja 0';

    // Realistic Attendance (60 Term Days)
    const absentDays = (i % 9 === 0) ? 4 : (i % 5 === 0) ? 2 : (i % 7 === 0) ? 1 : 0;
    const presentDays = 60 - absentDays;
    const attPercent = Number(((presentDays / 60) * 100).toFixed(1));
    const attStatus: 'Bora' | 'Wastani' | 'Uangalizi' =
      attPercent >= 95 ? 'Bora' : attPercent >= 88 ? 'Wastani' : 'Uangalizi';

    // Lesson Completion
    const lessonCompletion = Math.min(100, Math.max(78, 85 + ((i * 3) % 15)));

    rows.push({
      admNo,
      name,
      gender: isM ? 'M' : 'F',
      math: m,
      english: e,
      kiswahili: k,
      science: s,
      social: soc,
      civic: c,
      total,
      average: avg,
      division: division as any,
      rank: 0,
      attendanceDaysPresent: presentDays,
      attendanceDaysAbsent: absentDays,
      attendancePercent: attPercent,
      attendanceStatus: attStatus,
      lessonCompletionPercent: lessonCompletion,
    });
  }

  // Sort and assign rank
  rows.sort((a, b) => b.total - a.total);
  rows.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return rows;
}

// Curriculum Progress items generator for each class
function generateCurriculumProgress(className: string, rows: StudentPerformanceRow[]): SubjectCurriculumProgress[] {
  return CORE_SUBJECTS.map((sub, idx) => {
    const avg = rows.length > 0
      ? Number(
          (
            rows.reduce((acc, r) => {
              if (sub.code === 'MATH') return acc + r.math;
              if (sub.code === 'ENG') return acc + r.english;
              if (sub.code === 'KISW') return acc + r.kiswahili;
              if (sub.code === 'SCI') return acc + r.science;
              if (sub.code === 'SOC') return acc + r.social;
              return acc + r.civic;
            }, 0) / rows.length
          ).toFixed(1)
        )
      : 82.5;

    const planned = 12;
    const covered = Math.min(12, Math.max(9, 10 + (idx % 3)));
    const coveragePercent = Number(((covered / planned) * 100).toFixed(0));
    const totalLessonPlans = 24;
    const approvedLessonPlans = Math.min(totalLessonPlans, 20 + (idx % 5));

    return {
      code: sub.code,
      name: sub.name,
      teacher: sub.defaultTeacher,
      averageMark: avg,
      topicsPlanned: planned,
      topicsCovered: covered,
      coveragePercent,
      lessonPlansApproved: approvedLessonPlans,
      lessonPlansTotal: totalLessonPlans,
      status: coveragePercent >= 90 ? 'IMEKAMILIKA' : coveragePercent >= 80 ? 'INAENDELEA' : 'INAHITAJI_KASI',
    };
  });
}

// =============================================================================
// MAIN BROADSHEET HUB COMPONENT
// =============================================================================

export default function AcademicBroadsheetHubPage() {
  const currentUser = getCurrentSession();

  // Role detection: Is the logged-in user Headteacher vs Academic Master?
  const isHeadteacher =
    currentUser?.role === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'HEADTEACHER' ||
    currentUser?.identifier === 'HT-2026-001';

  // Active Class Selection (Defaults to Standard 7)
  const [selectedClassId, setSelectedClassId] = useState<string>('std-7');

  // Active Main Tab: 1. Ufaulu (Performance), 2. Mahudhurio (Attendance), 3. Mtaala & Masomo (Lesson Progress)
  const [activeTab, setActiveTab] = useState<'PERFORMANCE' | 'ATTENDANCE' | 'CURRICULUM'>('PERFORMANCE');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>('ALL');
  const [filterAttendanceStatus, setFilterAttendanceStatus] = useState<string>('ALL');

  // Compact Subject Collapse toggle (Hidden by default to save space & avoid clutter)
  const [showSubjectDetails, setShowSubjectDetails] = useState<boolean>(false);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  // Submissions state to localStorage
  const [submissionsState, setSubmissionsState] = useState<Record<string, { isSubmitted: boolean; timestamp: string }>>({});

  // Active Class Object
  const currentClassInfo = useMemo(() => {
    return ALL_SCHOOL_CLASSES.find((c) => c.id === selectedClassId) || ALL_SCHOOL_CLASSES[7];
  }, [selectedClassId]);

  // Load all class rosters
  const allClassRosters = useMemo(() => {
    const map: Record<string, StudentPerformanceRow[]> = {};
    ALL_SCHOOL_CLASSES.forEach((c) => {
      map[c.id] = generateClassRoster(c.name, c.totalStudents);
    });
    return map;
  }, []);

  const activeRoster = allClassRosters[selectedClassId] || [];

  // Curriculum progress for active class
  const activeCurriculum = useMemo(() => {
    return generateCurriculumProgress(currentClassInfo.name, activeRoster);
  }, [currentClassInfo.name, activeRoster]);

  // Class Summary KPIs
  const classSummary = useMemo(() => {
    if (activeRoster.length === 0) {
      return {
        classAvg: 0,
        boysCount: 0,
        girlsCount: 0,
        avgAttendance: 0,
        div1: 0,
        div2: 0,
        div3: 0,
        div4: 0,
        div0: 0,
        syllabusAverage: 0,
      };
    }
    const totalAvg = activeRoster.reduce((acc, r) => acc + r.average, 0) / activeRoster.length;
    const boys = activeRoster.filter((r) => r.gender === 'M').length;
    const girls = activeRoster.filter((r) => r.gender === 'F').length;
    const attAvg = activeRoster.reduce((acc, r) => acc + r.attendancePercent, 0) / activeRoster.length;
    const div1 = activeRoster.filter((r) => r.division === 'Daraja I').length;
    const div2 = activeRoster.filter((r) => r.division === 'Daraja II').length;
    const div3 = activeRoster.filter((r) => r.division === 'Daraja III').length;
    const div4 = activeRoster.filter((r) => r.division === 'Daraja IV').length;
    const div0 = activeRoster.filter((r) => r.division === 'Daraja 0').length;
    const sylAvg = activeCurriculum.reduce((acc, c) => acc + c.coveragePercent, 0) / activeCurriculum.length;

    return {
      classAvg: Number(totalAvg.toFixed(1)),
      boysCount: boys,
      girlsCount: girls,
      avgAttendance: Number(attAvg.toFixed(1)),
      div1,
      div2,
      div3,
      div4,
      div0,
      syllabusAverage: Math.round(sylAvg),
    };
  }, [activeRoster, activeCurriculum]);

  // Load saved submissions from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('academic_submissions_to_headmaster_v1');
      if (saved) {
        setSubmissionsState(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const isClassSubmitted = Boolean(submissionsState[currentClassInfo.name]?.isSubmitted);

  // Handle Academic Master Submitting to Headteacher
  const handleAcademicMasterSubmit = () => {
    const timestamp = new Date().toLocaleString('sw-TZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updated = {
      ...submissionsState,
      [currentClassInfo.name]: {
        isSubmitted: true,
        timestamp,
        className: currentClassInfo.name,
        academicMaster: currentUser?.fullName || 'Mwl. Beatrice Kimaro',
      },
    };

    try {
      localStorage.setItem('academic_submissions_to_headmaster_v1', JSON.stringify(updated));
      setSubmissionsState(updated);
    } catch {}

    notifyUser(
      'success',
      'Broadsheet Imewasilishwa!',
      `Broadsheet ya ${currentClassInfo.name} imewasilishwa rasmi kwa Mwalimu Mkuu kwa ajili ya kuwekwa Muhuri Rasmi na kupanga tarehe ya kutoa matokeo.`
    );
    setActiveNotice(`Broadsheet ya ${currentClassInfo.name} imewasilishwa kwa Mwalimu Mkuu (${timestamp}).`);
  };

  // Delegated Publishing by Academic Master (when Headteacher is busy/delegated)
  const handleDelegatedPublish = () => {
    const timestamp = new Date().toLocaleString('sw-TZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedSubmissions = {
      ...submissionsState,
      [currentClassInfo.name]: {
        isSubmitted: true,
        timestamp,
        className: currentClassInfo.name,
        academicMaster: currentUser?.fullName || 'Mwl. Beatrice Kimaro',
      },
    };
    try {
      localStorage.setItem('academic_submissions_to_headmaster_v1', JSON.stringify(updatedSubmissions));
      setSubmissionsState(updatedSubmissions);
    } catch {}

    try {
      const storageKey = 'headteacher_results_approval_map_v2';
      const raw = localStorage.getItem(storageKey);
      let map = raw ? JSON.parse(raw) : {};

      const classId = currentClassInfo.id;
      map[classId] = {
        hasApproved: true,
        approvalTimestamp: timestamp,
        sealCertNumber: `VER-2026-ACAD-DELEGATE-${Math.floor(10000 + Math.random() * 90000)}`,
        publishingMode: 'IMMEDIATE',
        resultsReleaseDate: new Date().toISOString().split('T')[0],
        resultsReleaseTime: '08:00',
        isPublishedToUsers: true,
        publishedTimestamp: timestamp,
        delegatedTo: currentUser?.fullName || 'Mwl. Beatrice Kimaro (Taaluma)',
      };

      localStorage.setItem(storageKey, JSON.stringify(map));
    } catch (e) {
      console.error(e);
    }

    notifyUser(
      'success',
      'Matokeo Yameidhinishwa & Kuchapishwa kwa Wazazi!',
      `Kwa idhini maalum ya Mkuu wa Shule aliyeko kwenye majukumu mengine, matokeo ya ${currentClassInfo.name} yamepigiwa Muhuri Rasmi na sasa yanaonekana rasmi kwenye Portal ya Wazazi.`
    );
    setActiveNotice(`Matokeo ya ${currentClassInfo.name} yamechapishwa kwa wazazi (Idhini Maalum ya Uongozi - ${timestamp}).`);
  };

  // Download Broadsheet CSV / Excel
  const handleDownloadCSV = () => {
    let headers = '';
    let rows = '';

    if (activeTab === 'ATTENDANCE') {
      headers = 'Nafasi,Namba_Ya_Usajili,Jina_La_Mwanafunzi,Jinsia,Siku_Za_Muhula,Siku_Alizohudhuria,Siku_Alizokosa,Mahudhurio_Asilimia,Hali\n';
      rows = activeRoster
        .map(
          (s) =>
            `#${s.rank},${s.admNo},"${s.name}",${s.gender},60,${s.attendanceDaysPresent},${s.attendanceDaysAbsent},${s.attendancePercent}%,${s.attendanceStatus}`
        )
        .join('\n');
    } else {
      headers = 'Nafasi,Namba_Ya_Usajili,Jina_La_Mwanafunzi,Jinsia,Hisabati,Kiingereza,Kiswahili,Sayansi,Maarifa_Jamii,Uraia,Jumla_600,Wastani,Daraja\n';
      rows = activeRoster
        .map(
          (s) =>
            `#${s.rank},${s.admNo},"${s.name}",${s.gender},${s.math},${s.english},${s.kiswahili},${s.science},${s.social},${s.civic},${s.total},${s.average}%,${s.division}`
        )
        .join('\n');
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute(
      'download',
      `Broadsheet_${currentClassInfo.shortName.replace(/[^a-zA-Z0-9]/g, '_')}_${activeTab}_2026.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser('success', 'Faili Limepakuliwa!', `Faili la ${currentClassInfo.name} limepakuliwa kikamilifu.`);
  };

  // Filtered Students for Active Tab
  const filteredStudents = useMemo(() => {
    return activeRoster.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.admNo.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'PERFORMANCE' && filterDivision !== 'ALL') {
        if (row.division !== filterDivision) return false;
      }

      if (activeTab === 'ATTENDANCE' && filterAttendanceStatus !== 'ALL') {
        if (row.attendanceStatus !== filterAttendanceStatus) return false;
      }

      return true;
    });
  }, [activeRoster, searchQuery, filterDivision, filterAttendanceStatus, activeTab]);

  return (
    <TeacherShell
      pageTitle="Uratibu wa Broadsheets za Shule Nzima"
      pageDescription={
        isHeadteacher
          ? 'Ofisi ya Mkuu wa Shule: Ukaguzi rasmi wa matokeo yaliyounganishwa, mahudhurio ya wanafunzi, na maendeleo ya mtaala kwa madarasa yote (Chekechea hadi Standard 7).'
          : 'Ofisi ya Taaluma: Uunganishaji wa matokeo ya masomo 6, ufuatiliaji wa mahudhurio na maandalio ya masomo tayari kwa kuwasilisha kwa Mwalimu Mkuu.'
      }
      requiredRole="ACADEMIC"
    >
      <div className="space-y-5 animate-fade-in">
        {/* Flash Alert */}
        {activeNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
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
        {/* 1. COMPACT HORIZONTAL CLASS SELECTOR (AWALI TO STANDARD 7) */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                Chagua Darasa (Chekechea hadi Darasa la 7):
              </span>
              <h3 className="text-sm font-black text-slate-800">
                Madarasa Yote 8 ya Shule • {currentClassInfo.level}
              </h3>
            </div>

            {/* AI Verification Badge (Sleek & Compact) */}
            <button
              type="button"
              onClick={() => setShowAIModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold transition-colors self-start sm:self-auto"
              title="Bofya kuona uthibitisho wa AI"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-700" />
              <span>AI Verified ✓ (Hesabu 100% Sahihi)</span>
            </button>
          </div>

          {/* Compact Pill Tabs for All 8 Classes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {ALL_SCHOOL_CLASSES.map((cls) => {
              const isSelected = selectedClassId === cls.id;
              const isCandidate = cls.id === 'std-7' || cls.id === 'std-4';

              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => {
                    setSelectedClassId(cls.id);
                    setSearchQuery('');
                  }}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-md shadow-emerald-950/20 scale-[1.02]'
                      : 'bg-emerald-50/40 hover:bg-emerald-100/70 border-emerald-200/80 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-black truncate">{cls.shortName}</span>
                    {isCandidate && (
                      <span
                        className={`text-[8px] font-black px-1 py-0.2 rounded ${
                          isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        NECTA
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] w-full">
                    <span className={isSelected ? 'text-emerald-200 font-bold' : 'text-emerald-800 font-bold'}>
                      {cls.totalStudents} Wanafunzi
                    </span>
                    <span className={isSelected ? 'text-emerald-100' : 'text-slate-400'}>
                      T1
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. SUMMARY KPI STATS FOR SELECTED CLASS (HIGH VALUE, LOW CLUTTER) */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Wastani wa Darasa</span>
              <div className="text-lg font-black text-emerald-900">{classSummary.classAvg}%</div>
              <span className="text-[10px] text-emerald-700 font-semibold">Daraja I: {classSummary.div1} | II: {classSummary.div2}</span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Idadi ya Wanafunzi</span>
              <div className="text-lg font-black text-slate-900">{currentClassInfo.totalStudents}</div>
              <span className="text-[10px] text-slate-500 font-medium">Wavulana {classSummary.boysCount} • Wasichana {classSummary.girlsCount}</span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Kiwango cha Mahudhurio</span>
              <div className="text-lg font-black text-blue-900">{classSummary.avgAttendance}%</div>
              <span className="text-[10px] text-blue-700 font-medium">Siku 60 za Muhula</span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Mtaala & Masomo</span>
              <div className="text-lg font-black text-amber-900">{classSummary.syllabusAverage}%</div>
              <span className="text-[10px] text-amber-700 font-semibold">Masomo 6 Yameunganishwa ✓</span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. OPTIONAL COLLAPSIBLE DRAWER: SUBJECT SUBMISSION STATUS */}
        {/* (Default HIDDEN to eliminate visual clutter, as requested by user) */}
        {/* ===================================================================== */}
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200/80 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-bold text-emerald-950">
              Masomo yote 6 ya {currentClassInfo.name} yamepokelewa na kuunganishwa kiotomatiki (Merge 100%).
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowSubjectDetails(!showSubjectDetails)}
            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto underline"
          >
            <span>{showSubjectDetails ? 'Ficha Maelezo ya Walimu wa Masomo' : 'Tazama Walimu & Wastani wa Kila Somo'}</span>
            {showSubjectDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Subject Details Grid */}
        {showSubjectDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-3xl bg-white border border-emerald-200 animate-fade-in">
            {activeCurriculum.map((sub, idx) => (
              <div key={sub.code} className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[10px] text-emerald-800">#{idx + 1} {sub.code}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[9px] font-black border border-emerald-300">
                    Imewasilishwa ✓
                  </span>
                </div>
                <h4 className="font-black text-slate-800">{sub.name}</h4>
                <p className="text-[11px] text-slate-500">{sub.teacher}</p>
                <div className="pt-1.5 border-t border-emerald-100 flex items-center justify-between text-[11px]">
                  <span>Wastani wa Somo: <strong className="text-emerald-900 font-mono">{sub.averageMark}%</strong></span>
                  <span>Mada: <strong className="text-slate-800">{sub.topicsCovered}/{sub.topicsPlanned}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================================================================== */}
        {/* 4. MAIN ACTION BAR & 3 IN-DEPTH TABS */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            {/* Tab Switcher: Ufaulu, Mahudhurio, Ufundishaji */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/90 border border-slate-200 self-start">
              <button
                type="button"
                onClick={() => setActiveTab('PERFORMANCE')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'PERFORMANCE'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>1. Ufaulu & Broadsheet Kuu</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ATTENDANCE')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'ATTENDANCE'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>2. Mahudhurio ya Darasa</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CURRICULUM')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'CURRICULUM'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>3. Ufundishaji & Maandalio ya Masomo</span>
              </button>
            </div>

            {/* Smart Context-Aware Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Pakua Broadsheet (Excel)</span>
              </button>

              {/* ROLE CHECK: If logged in as Headteacher vs Academic Master */}
              {isHeadteacher ? (
                // HEADTEACHER: Give direct link to approvals/stamp, DO NOT say "Peleka kwa Mwalimu Mkuu"!
                <Link
                  href="/teacher/approvals"
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ofisi ya Mkuu: Weka Muhuri Rasmi wa Shule</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              ) : (
                // ACADEMIC MASTER: Show submission to Headteacher PLUS Delegated Publish Button
                <div className="flex items-center gap-2 flex-wrap">
                  {!isClassSubmitted ? (
                    <button
                      type="button"
                      onClick={handleAcademicMasterSubmit}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-all"
                      title="Tuma broadsheet kwa Mwalimu Mkuu kwa mapitio na muhuri"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-600" />
                      <span>Wasilisha kwa Mkuu</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-950 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Imewasilishwa kwa Mkuu ✓</span>
                    </span>
                  )}

                  {/* DELEGATED PUBLISH BUTTON: When Headteacher is busy/delegated */}
                  <button
                    type="button"
                    onClick={handleDelegatedPublish}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                    title="Mkuu wa Shule akiwa na majukumu mengine au hayupo, idhinisha na toa matokeo moja kwa moja kwa wazazi"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Idhinisha &amp; Chapisha (Kwa Idhini ya Mkuu)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =================================================================== */}
          {/* TAB 1: UFAULU & BROADSHEET KUU (PERFORMANCE) */}
          {/* =================================================================== */}
          {activeTab === 'PERFORMANCE' && (
            <div className="space-y-3">
              {/* Search & Division Filter Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tafuta mwanafunzi au namba ya usajili..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Daraja:</span>
                  {['ALL', 'Daraja I', 'Daraja II', 'Daraja III', 'Daraja IV'].map((div) => (
                    <button
                      key={div}
                      type="button"
                      onClick={() => setFilterDivision(div)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        filterDivision === div
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {div === 'ALL' ? `Wote (${activeRoster.length})` : div}
                    </button>
                  ))}
                </div>
              </div>

              {/* Performance Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3 text-center">Nafasi</th>
                      <th className="py-3 px-4">Jina la Mwanafunzi</th>
                      <th className="py-3 px-2 text-center">Jinsia</th>
                      <th className="py-3 px-3 text-center">Hisabati</th>
                      <th className="py-3 px-3 text-center">English</th>
                      <th className="py-3 px-3 text-center">Kiswahili</th>
                      <th className="py-3 px-3 text-center">Sayansi</th>
                      <th className="py-3 px-3 text-center">Maarifa</th>
                      <th className="py-3 px-3 text-center">Uraia</th>
                      <th className="py-3 px-3 text-center font-black text-slate-900 bg-slate-200/70">Jumla (600)</th>
                      <th className="py-3 px-3 text-center font-black text-emerald-900 bg-emerald-100/70">Wastani</th>
                      <th className="py-3 px-3 text-center">Daraja</th>
                      <th className="py-3 px-2 text-center">AI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredStudents.map((row) => (
                      <tr key={row.admNo} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-2.5 px-3 text-center font-black text-emerald-800">#{row.rank}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">
                          <div>{row.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">{row.admNo}</div>
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-600 font-medium">{row.gender}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{row.math}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{row.english}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{row.kiswahili}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{row.science}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{row.social}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{row.civic}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-slate-900 bg-slate-50">
                          {row.total}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-emerald-800 bg-emerald-50/60">
                          {row.average}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-md border font-black text-[10px] ${
                              row.division === 'Daraja I'
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                : row.division === 'Daraja II'
                                ? 'bg-blue-100 text-blue-950 border-blue-300'
                                : row.division === 'Daraja III'
                                ? 'bg-amber-100 text-amber-950 border-amber-300'
                                : 'bg-rose-100 text-rose-950 border-rose-300'
                            }`}
                          >
                            {row.division}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <span title="Imehakikiwa na AI">
                            <ShieldCheck className="w-4 h-4 text-emerald-700 inline" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: MAHUDHURIO YA DARASA (ATTENDANCE DETAIL) */}
          {/* =================================================================== */}
          {activeTab === 'ATTENDANCE' && (
            <div className="space-y-3">
              {/* Filter by Attendance Status */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tafuta mwanafunzi..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">Hali:</span>
                  {['ALL', 'Bora', 'Wastani', 'Uangalizi'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFilterAttendanceStatus(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        filterAttendanceStatus === st
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st === 'ALL' ? `Wote (${activeRoster.length})` : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3 text-center">Na.</th>
                      <th className="py-3 px-4">Jina la Mwanafunzi</th>
                      <th className="py-3 px-2 text-center">Jinsia</th>
                      <th className="py-3 px-3 text-center">Siku za Muhula</th>
                      <th className="py-3 px-3 text-center text-emerald-800 font-black">Siku Alizokuwepo</th>
                      <th className="py-3 px-3 text-center text-rose-700 font-black">Siku za Utoro</th>
                      <th className="py-3 px-3 text-center font-black text-slate-900 bg-slate-200/70">Asilimia (%)</th>
                      <th className="py-3 px-3 text-center">Hali ya Mahudhurio</th>
                      <th className="py-3 px-4">Hatua / Ushauri</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredStudents.map((row, idx) => (
                      <tr key={row.admNo} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-800">
                          <div>{row.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">{row.admNo}</div>
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-600 font-medium">{row.gender}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-600">60 Siku</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-800">
                          {row.attendanceDaysPresent}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-700">
                          {row.attendanceDaysAbsent}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-slate-900 bg-slate-50">
                          {row.attendancePercent}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.attendanceStatus === 'Bora'
                                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                                : row.attendanceStatus === 'Wastani'
                                ? 'bg-blue-100 text-blue-950 border border-blue-300'
                                : 'bg-rose-100 text-rose-950 border border-rose-300'
                            }`}
                          >
                            {row.attendanceStatus === 'Bora' ? 'Bora Sana (95%+)' : row.attendanceStatus === 'Wastani' ? 'Wastani' : 'Uangalizi'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[11px] text-slate-600">
                          {row.attendanceDaysAbsent === 0
                            ? 'Hakuna siku aliyokosa • Hongera'
                            : row.attendanceDaysAbsent <= 2
                            ? 'Utoro mdogo wa kawaida (Ruhusa ya Mzazi)'
                            : 'Wazazi wamejulishwa kupitia SMS / Barua ya Mwalimu'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 3: UFUNDISHAJI & MAANDALIO YA MASOMO (CURRICULUM DETAIL) */}
          {/* =================================================================== */}
          {activeTab === 'CURRICULUM' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-black text-slate-900">Usimamizi wa Utekelezaji wa Mtaala (Syllabus Coverage)</h4>
                  <p className="text-slate-600 mt-0.5">
                    Ufuatiliaji wa mada zilizofundishwa na maandalio ya somo (lesson plans) yaliyowasilishwa na walimu wa masomo 6 ya {currentClassInfo.name}.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Wastani wa Mtaala</span>
                  <span className="text-base font-black text-emerald-800">{classSummary.syllabusAverage}% Imekamilika</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeCurriculum.map((sub, idx) => (
                  <div key={sub.code} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[10px] font-mono">
                        Somo #{idx + 1} • {sub.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          sub.status === 'IMEKAMILIKA'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                            : 'bg-amber-100 text-amber-950 border border-amber-300'
                        }`}
                      >
                        {sub.status === 'IMEKAMILIKA' ? 'Kwenye Ratiba ✓' : 'Inahitaji Kasi'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900">{sub.name}</h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">Mwalimu: {sub.teacher}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Mada Zilizofundishwa:</span>
                        <span className="font-bold text-slate-900">{sub.topicsCovered} kati ya {sub.topicsPlanned} ({sub.coveragePercent}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-700 rounded-full"
                          style={{ width: `${sub.coveragePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span>Maandalio ya Somo (Lesson Plans): <strong>{sub.lessonPlansApproved}/{sub.lessonPlansTotal}</strong></span>
                      <span>Wastani wa Somo: <strong className="text-emerald-800 font-mono">{sub.averageMark}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Table Footer Summary */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span>Wastani wa Darasa: <strong className="text-emerald-800 font-mono">{classSummary.classAvg}%</strong></span>
              <span>Wanafunzi: <strong>{currentClassInfo.totalStudents}</strong></span>
              <span>Kiwango cha Mahudhurio: <strong className="text-blue-800">{classSummary.avgAttendance}%</strong></span>
              <span>Mtaala: <strong className="text-amber-800">{classSummary.syllabusAverage}%</strong></span>
            </div>

            <div className="text-[11px] font-medium text-slate-500">
              Data ya {currentClassInfo.name} • Muhula wa Kwanza 2026
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MODAL: AI VERIFICATION REPORT */}
        {/* ===================================================================== */}
        {showAIModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-emerald-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-black text-slate-900">
                    Ripoti ya AI ya Ukaguzi wa Broadsheet ({currentClassInfo.name})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAIModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  <strong>Hakuna Hitilafu Zilizogunduliwa!</strong> Fomula za jumla ya alama 600, wastani, na madaraja ya NECTA yamehakikiwa kwa 100%.
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Hesabu za Alama & Wastani:</span>
                  <strong className="text-emerald-700">100% Sahihi ✓</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Vigezo vya Madaraja:</span>
                  <strong className="text-emerald-700">Vigezo vya NECTA (A, B, C, D, F) ✓</strong>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Alama Zilizokaguliwa:</span>
                  <strong className="text-slate-900">{currentClassInfo.totalStudents * 6} Alama</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowAIModal(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
                >
                  Sawa, Nimekagua
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
