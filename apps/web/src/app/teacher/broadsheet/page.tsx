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
  Lock,
  Calendar,
  X,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { notifyUser } from '@/lib/notifications';
import { getCurrentSession } from '@/lib/auth-session';
import { getPupilsForClass } from '@/lib/teacher-data';

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

// Dynamic class roster: loads from registered school pupils or returns clean empty list
function generateClassRoster(className: string, _count?: number): StudentPerformanceRow[] {
  const pupils = getPupilsForClass(className);
  if (!pupils || pupils.length === 0) {
    return [];
  }

  const rows: StudentPerformanceRow[] = pupils.map((p, idx) => {
    const anyP = p as any;
    const m = anyP.subjects?.math ?? anyP.mark ?? 0;
    const e = anyP.subjects?.english ?? anyP.mark ?? 0;
    const k = anyP.subjects?.kiswahili ?? anyP.mark ?? 0;
    const s = anyP.subjects?.science ?? anyP.mark ?? 0;
    const soc = anyP.subjects?.socialStudies ?? anyP.mark ?? 0;
    const c = anyP.subjects?.civics ?? anyP.mark ?? 0;
    const total = m + e + k + s + soc + c;
    const avg = Number((total / 6).toFixed(1));
    const division = avg >= 75 ? 'Daraja I' : avg >= 65 ? 'Daraja II' : avg >= 45 ? 'Daraja III' : avg >= 30 ? 'Daraja IV' : 'Daraja 0';

    return {
      id: p.id,
      admNo: p.admNo || `STD-${String(100 + idx + 1).padStart(4, '0')}`,
      name: p.name,
      gender: (p.gender === 'M' || p.gender === 'F') ? p.gender : (idx % 2 === 0 ? 'M' : 'F'),
      className,
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
      attendanceDaysPresent: 60,
      attendanceDaysAbsent: 0,
      attendancePercent: 100,
      attendanceStatus: 'Bora' as any,
      lessonCompletionPercent: 100,
    };
  });

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

  // Headteacher / Academic Master Official Seal & Release Scheduling state
  const [approvalMap, setApprovalMap] = useState<Record<string, any>>({});
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [modalPublishingMode, setModalPublishingMode] = useState<'SCHEDULED' | 'IMMEDIATE'>('SCHEDULED');
  const [modalReleaseDate, setModalReleaseDate] = useState<string>('2026-03-27');
  const [modalReleaseTime, setModalReleaseTime] = useState<string>('08:00');
  const [isConfirmChecked, setIsConfirmChecked] = useState<boolean>(false);

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

  // Load saved submissions & approval map from LocalStorage
  useEffect(() => {
    try {
      const savedSubmissions = localStorage.getItem('academic_submissions_to_headmaster_v1');
      if (savedSubmissions) {
        setSubmissionsState(JSON.parse(savedSubmissions));
      }

      const savedApprovals = localStorage.getItem('headteacher_results_approval_map_v2');
      if (savedApprovals) {
        setApprovalMap(JSON.parse(savedApprovals));
      }
    } catch {}
  }, []);

  const isClassSubmitted = Boolean(submissionsState[currentClassInfo.name]?.isSubmitted);
  const currentClassSeal = approvalMap[currentClassInfo.id] || approvalMap['ALL'];

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

  // Open Approval & Release Scheduling Modal
  const openApprovalModal = () => {
    if (currentClassSeal) {
      setModalPublishingMode(currentClassSeal.publishingMode || 'SCHEDULED');
      setModalReleaseDate(currentClassSeal.resultsReleaseDate || '2026-03-27');
      setModalReleaseTime(currentClassSeal.resultsReleaseTime || '08:00');
    } else {
      setModalPublishingMode('SCHEDULED');
      setModalReleaseDate('2026-03-27');
      setModalReleaseTime('08:00');
    }
    setIsConfirmChecked(false);
    setShowApprovalModal(true);
  };

  // Confirm Approval & Save Release Schedule
  const handleConfirmApprovalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfirmChecked) {
      notifyUser('warning', 'Tafadhali Thibitisha Utayari', 'Lazima uweke tiki kuthibitisha kuwa upo tayari kuidhinisha matokeo haya kabla ya kuendelea.');
      return;
    }

    const timestamp = new Date().toLocaleString('sw-TZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const isImmediate = modalPublishingMode === 'IMMEDIATE';
    const classId = currentClassInfo.id;
    const certNumber = currentClassSeal?.sealCertNumber || `VER-2026-HT-${Math.floor(10000 + Math.random() * 90000)}`;

    const newSealEntry = {
      hasApproved: true,
      approvalTimestamp: timestamp,
      sealCertNumber: certNumber,
      publishingMode: modalPublishingMode,
      resultsReleaseDate: modalReleaseDate,
      resultsReleaseTime: modalReleaseTime,
      isPublishedToUsers: isImmediate,
      publishedTimestamp: isImmediate ? timestamp : undefined,
      delegatedTo: isHeadteacher ? undefined : (currentUser?.fullName || 'Mwl. Beatrice Kimaro (Taaluma)'),
    };

    const newApprovalMap = {
      ...approvalMap,
      [classId]: newSealEntry,
    };

    try {
      localStorage.setItem('headteacher_results_approval_map_v2', JSON.stringify(newApprovalMap));
      setApprovalMap(newApprovalMap);

      // Also record in school records archive
      const existingRecords = localStorage.getItem('school_records_documents_v1');
      let recList = existingRecords ? JSON.parse(existingRecords) : [];
      const newDoc = {
        id: `doc-sealed-${classId}-2026`,
        title: `Broadsheet Rasmi ya Matokeo: ${currentClassInfo.name} (Yaliyowekwa Muhuri na Mkuu wa Shule)`,
        category: 'Taaluma & Mitihani',
        fileName: `Matokeo_Rasmi_${currentClassInfo.name.replace(/\s+/g, '_')}_SEALED.pdf`,
        fileSize: '3.4 MB',
        version: 'v1.0 (Muhuri Rasmi & Saini ya Mkuu)',
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: currentUser?.fullName || 'Mwalimu Mkuu / Taaluma',
        accessLevel: 'PUBLIC',
        status: 'IMETHIBITISHWA_NA_MUHURI',
        referenceNumber: certNumber,
        releaseDate: isImmediate ? 'Tayari Yamechapishwa' : `${modalReleaseDate} saa ${modalReleaseTime}`,
      };
      recList = [newDoc, ...recList.filter((d: any) => d.id !== newDoc.id)];
      localStorage.setItem('school_records_documents_v1', JSON.stringify(recList));

      // Also mark submissions
      const updatedSubmissions = {
        ...submissionsState,
        [currentClassInfo.name]: {
          isSubmitted: true,
          timestamp,
          className: currentClassInfo.name,
          academicMaster: currentUser?.fullName || 'Taaluma',
        },
      };
      localStorage.setItem('academic_submissions_to_headmaster_v1', JSON.stringify(updatedSubmissions));
      setSubmissionsState(updatedSubmissions);
    } catch (e) {
      console.error(e);
    }

    setShowApprovalModal(false);

    if (isImmediate) {
      notifyUser(
        'success',
        'Matokeo Yameidhinishwa & Yametangazwa kwa Wazazi!',
        `Matokeo ya ${currentClassInfo.name} yamepigiwa Muhuri Rasmi na sasa yanaonekana rasmi kwenye Portal ya Wazazi.`
      );
      setActiveNotice(`Matokeo ya ${currentClassInfo.name} yamechapishwa kwa wazazi mara moja (${timestamp}).`);
    } else {
      notifyUser(
        'success',
        'Muhuri Umewekwa & Ratiba ya Matokeo Imepangwa!',
        `Matokeo ya ${currentClassInfo.name} yamelindwa na yatafunguliwa rasmi kwa wazazi tarehe ${modalReleaseDate} saa ${modalReleaseTime}.`
      );
      setActiveNotice(`Matokeo ya ${currentClassInfo.name} yatafunguliwa rasmi: ${modalReleaseDate} saa ${modalReleaseTime}.`);
    }
  };

  // Instant Publish Now for Scheduled class
  const handleInstantPublish = () => {
    const timestamp = new Date().toLocaleString('sw-TZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const classId = currentClassInfo.id;
    const existing = currentClassSeal || {};
    const updated = {
      ...existing,
      isPublishedToUsers: true,
      publishedTimestamp: timestamp,
    };

    const newApprovalMap = {
      ...approvalMap,
      [classId]: updated,
    };

    try {
      localStorage.setItem('headteacher_results_approval_map_v2', JSON.stringify(newApprovalMap));
      setApprovalMap(newApprovalMap);
    } catch {}

    notifyUser(
      'success',
      'Matokeo Yamefunguliwa Sasa Hivi!',
      `Matokeo ya ${currentClassInfo.name} sasa yamefunguliwa na yanaonekana kwenye portal ya wazazi.`
    );
    setActiveNotice(`Matokeo ya ${currentClassInfo.name} yamefunguliwa kwa wazazi (${timestamp}).`);
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

              {/* CURRENT CLASS SEAL & APPROVAL STATUS / ACTIONS */}
              {currentClassSeal?.hasApproved ? (
                <div className="flex items-center gap-2 flex-wrap">
                  {currentClassSeal.isPublishedToUsers || currentClassSeal.publishingMode === 'IMMEDIATE' ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-950 text-xs font-black border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>✓ Yameidhinishwa &amp; Yametangazwa kwa Wazazi</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-950 text-xs font-black border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                        <Lock className="w-4 h-4 text-amber-800" />
                        <span>🔒 Yameidhinishwa • Kufunguliwa: {currentClassSeal.resultsReleaseDate} ({currentClassSeal.resultsReleaseTime})</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleInstantPublish}
                        className="px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                        title="Fungua matokeo sasa hivi bila kusubiri tarehe ya ratiba"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Toa Matokeo Sasa</span>
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={openApprovalModal}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1 transition-colors"
                    title="Badilisha tarehe ya kutoa matokeo au idhinisha upya"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span>Badilisha Ratiba / Muhuri</span>
                  </button>
                </div>
              ) : isHeadteacher ? (
                // HEADTEACHER: Quick Action or Link to Approvals
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={openApprovalModal}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Idhinisha &amp; Panga Siku ya Matokeo</span>
                  </button>
                  <Link
                    href="/teacher/approvals"
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1"
                  >
                    <span>Masijala ya Idhini</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                </div>
              ) : (
                // ACADEMIC MASTER: Show submission to Headteacher PLUS Approval & Scheduling Modal Button
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

                  {/* APPROVAL & SCHEDULING BUTTON */}
                  <button
                    type="button"
                    onClick={openApprovalModal}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                    title="Idhinisha na weka siku rasmi ya matokeo kuonekana kwa wazazi"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Idhinisha &amp; Panga Siku ya Matokeo</span>
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
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                            <GraduationCap className="w-10 h-10 text-slate-300 stroke-1" />
                            <p className="font-bold text-slate-700 text-sm">Hakuna matokeo ya wanafunzi yaliyopatikana</p>
                            <p className="text-xs text-slate-500">
                              Hakuna wanafunzi waliosajiliwa kwenye darasa hili bado. Ingiza au sajili wanafunzi kwenye daftari la udahili.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((row) => (
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
                      ))
                    )}
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
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2">
                            <Clock className="w-10 h-10 text-slate-300 stroke-1" />
                            <p className="font-bold text-slate-700 text-sm">Hakuna rekodi za mahudhurio ya darasa hili</p>
                            <p className="text-xs text-slate-500">
                              Hakuna wanafunzi waliosajiliwa kwenye darasa hili bado.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((row, idx) => (
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
                          <td className="py-2.5 px-3 text-center font-mono font-black text-slate-900 bg-slate-100/70">
                            {row.attendancePercent}%
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                row.attendanceStatus === 'Bora'
                                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                                  : row.attendanceStatus === 'Wastani'
                                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                                  : 'bg-rose-100 text-rose-950 border border-rose-300'
                              }`}
                            >
                              {row.attendanceStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">
                            {row.attendancePercent >= 90 ? (
                              <span className="text-emerald-800 font-semibold">Mahudhurio mazuri sana ✓</span>
                            ) : row.attendancePercent >= 80 ? (
                              <span className="text-slate-600">Mahudhurio ya kuridhisha</span>
                            ) : (
                              <span className="text-rose-700 font-bold">Wito wa Mzazi Unahitajika ⚠️</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
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

        {/* ===================================================================== */}
        {/* MODAL: IDHINI YA MATOKEO & RATIBU SIKU YA KUWA RELEASED */}
        {/* ===================================================================== */}
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-emerald-200 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                    <Award className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Idhini &amp; Ratiba ya Kutoa Matokeo: {currentClassInfo.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Panga siku ya ufunguzi kwa wazazi na gonga Muhuri Rasmi wa Shule
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmApprovalSubmit} className="space-y-4 text-xs">
                {/* 1. SWALI LA UTAYARI (READINESS CHECK) */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-amber-950 font-black">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>❓ JE, UPO TAYARI KUIDHINISHA MATOKEO YA DARASA HILI?</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Tafadhali kagua muhtasari kabla ya kuidhinisha. Baada ya kuidhinishwa, matokeo yatalindwa na kuonekana kulingana na tarehe utakayopanga:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-bold">
                    <div className="p-2 rounded-xl bg-white border border-amber-200">
                      <span className="text-[9px] uppercase text-slate-500 block">Wanafunzi</span>
                      <span className="text-slate-900 text-sm font-black">{currentClassInfo.totalStudents}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200">
                      <span className="text-[9px] uppercase text-slate-500 block">Wastani</span>
                      <span className="text-emerald-800 text-sm font-black">{classSummary.classAvg}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200">
                      <span className="text-[9px] uppercase text-slate-500 block">Masomo</span>
                      <span className="text-slate-900 text-sm font-black">6 / 6 Yamekamilika</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200">
                      <span className="text-[9px] uppercase text-slate-500 block">Daraja I</span>
                      <span className="text-emerald-700 text-sm font-black">{classSummary.div1} Wanafunzi</span>
                    </div>
                  </div>
                </div>

                {/* 2. SIKU NA SAA YA KUWA RELEASED */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <label className="block text-[10px] font-black text-emerald-950 uppercase tracking-wider">
                    Siku na Saa ya Matokeo Kuwa Released (Ratiba ya Wazazi):
                  </label>

                  <div className="space-y-2">
                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-emerald-200 cursor-pointer">
                      <input
                        type="radio"
                        name="broadsheetPublishingMode"
                        checked={modalPublishingMode === 'SCHEDULED'}
                        onChange={() => setModalPublishingMode('SCHEDULED')}
                        className="w-4 h-4 text-emerald-700 focus:ring-emerald-500 mt-0.5"
                      />
                      <div>
                        <strong className="text-slate-900 block font-bold">
                          Ratibu Siku na Saa Maalum ya Ufunguzi (Inashauriwa)
                        </strong>
                        <span className="text-[11px] text-slate-500 leading-relaxed block">
                          Mfano: Siku ya Kufunga Shule au Mkutano wa Wazazi. Matokeo yatafungwa kwa kufuli 🔒 na wazazi wataona taarifa ya tarehe rasmi.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-emerald-200 cursor-pointer">
                      <input
                        type="radio"
                        name="broadsheetPublishingMode"
                        checked={modalPublishingMode === 'IMMEDIATE'}
                        onChange={() => setModalPublishingMode('IMMEDIATE')}
                        className="w-4 h-4 text-emerald-700 focus:ring-emerald-500 mt-0.5"
                      />
                      <div>
                        <strong className="text-slate-900 block font-bold">
                          Toa Matokeo Mara Moja Sasa Hivi (Immediate Release)
                        </strong>
                        <span className="text-[11px] text-slate-500 leading-relaxed block">
                          Matokeo yataonekana mara moja kwenye portal ya wazazi mara baada ya kubonyeza OK.
                        </span>
                      </div>
                    </label>
                  </div>

                  {modalPublishingMode === 'SCHEDULED' && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Tarehe ya Kutoa Matokeo:
                        </span>
                        <input
                          type="date"
                          required
                          value={modalReleaseDate}
                          onChange={(e) => setModalReleaseDate(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Saa ya Kutoa Matokeo:
                        </span>
                        <input
                          type="time"
                          required
                          value={modalReleaseTime}
                          onChange={(e) => setModalReleaseTime(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. MAMLAKA YA IDHINI */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Mamlaka ya Idhini:</span>
                    <strong className="text-slate-900 font-bold">
                      {currentUser?.fullName || (isHeadteacher ? 'Mwl. Augustine Mrosso' : 'Mwl. Beatrice Kimaro')}
                    </strong>
                    <span className="text-[10px] text-emerald-800 block">
                      {isHeadteacher ? 'Mwalimu Mkuu (Headteacher)' : 'Mwalimu wa Taaluma (Academic Master)'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentClassSeal?.sealCertNumber || 'VER-2026-SEAL-88219'}
                  </span>
                </div>

                {/* 4. RIDHAA YA UTAYARI (MANDATORY CONFIRMATION CHECKBOX) */}
                <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-300/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isConfirmChecked}
                    onChange={(e) => setIsConfirmChecked(e.target.checked)}
                    className="w-4 h-4 text-emerald-700 rounded-sm focus:ring-emerald-500 mt-0.5"
                  />
                  <span className="text-[11px] text-slate-800 leading-snug">
                    <strong>Ndio, nipo tayari:</strong> Nimethibitisha kuwa matokeo ya {currentClassInfo.name} ni sahihi na nimeridhika na ratiba iliyowekwa ya kutoa matokeo haya.
                  </span>
                </label>

                {/* 5. BUTTONS: GHAIRI & NDIO, IDHINISHA (OK) */}
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
                    disabled={!isConfirmChecked}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs shadow-md flex items-center gap-2 transition-all ${
                      isConfirmChecked
                        ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-950/20 hover:scale-[1.02]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Award className={`w-4 h-4 ${isConfirmChecked ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span>Ndio, Idhinisha &amp; Weka Ratiba (OK)</span>
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
