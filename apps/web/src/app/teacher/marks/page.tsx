'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Search,
  UploadCloud,
  Download,
  Sparkles,
  RotateCcw,
  Edit3,
  X,
  FileCheck,
  Check,
  ShieldCheck,
  Info,
  GraduationCap,
  BookOpen,
  Users,
  ChevronDown,
  UserPlus,
  Plus,
  FileUp,
  Send,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  Layers,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';
import { INITIAL_PUPILS, StudentMark, calculateGrade, getRemarksForGrade } from '@/lib/teacher-data';

// =============================================================================
// TYPES & DATA STRUCTURES: COMPLETE SCHOOL ACADEMIC CALENDAR & SUBMISSIONS
// =============================================================================

type SchoolTerm = 'TERM_1' | 'TERM_2';

interface CalendarPeriod {
  id: string;
  term: SchoolTerm;
  month: string;
  name: string;
  shortName: string;
  badge: string;
  formula: string;
  targetField: 'monthlyTest1' | 'monthlyTest2' | 'midtermExam' | 'terminalExam';
}

const SCHOOL_CALENDAR_PERIODS: CalendarPeriod[] = [
  // MUHULA WA 1 (Januari – Juni)
  {
    id: 'JANUARY',
    term: 'TERM_1',
    month: 'Januari',
    name: 'Mtihani wa Mwezi wa 1 (Januari)',
    shortName: 'Januari',
    badge: 'Mwezi 1',
    formula: 'Wastani = Alama ya Mtihani wa Januari Pekee (Monthly 1)',
    targetField: 'monthlyTest1',
  },
  {
    id: 'FEBRUARY',
    term: 'TERM_1',
    month: 'Februari',
    name: 'Mtihani wa Mwezi wa 2 (Februari)',
    shortName: 'Februari',
    badge: 'Mwezi 2',
    formula: 'Wastani = (Januari + Februari) / 2',
    targetField: 'monthlyTest2',
  },
  {
    id: 'MARCH_MIDTERM',
    term: 'TERM_1',
    month: 'Machi',
    name: 'Mtihani wa Nusu Muhula (Mid-Term)',
    shortName: 'Machi (Mid-Term)',
    badge: 'Nusu Muhula',
    formula: 'Wastani = (Majaribio ya Mwezi * 40%) + (Mid-Term * 60%)',
    targetField: 'midtermExam',
  },
  {
    id: 'APRIL',
    term: 'TERM_1',
    month: 'Aprili',
    name: 'Majaribio ya Mwezi wa 4 (Aprili)',
    shortName: 'Aprili',
    badge: 'Mwezi 4',
    formula: 'Wastani = Maendeleo ya Majaribio hadi Aprili',
    targetField: 'monthlyTest2',
  },
  {
    id: 'MAY',
    term: 'TERM_1',
    month: 'Mei',
    name: 'Majaribio ya Mwezi wa 5 (Mei)',
    shortName: 'Mei',
    badge: 'Mwezi 5',
    formula: 'Wastani = Maendeleo ya Majaribio hadi Mei',
    targetField: 'monthlyTest2',
  },
  {
    id: 'JUNE_TERMINAL',
    term: 'TERM_1',
    month: 'Juni',
    name: 'Mtihani wa Mwisho wa Muhula wa 1 (Terminal)',
    shortName: 'Juni (Terminal)',
    badge: 'Muhula Mzima',
    formula: 'Wastani = (Majaribio * 30%) + (Mid-Term * 30%) + (Terminal * 40%)',
    targetField: 'terminalExam',
  },

  // MUHULA WA 2 (Julai – Desemba)
  {
    id: 'JULY',
    term: 'TERM_2',
    month: 'Julai',
    name: 'Mtihani wa Mwezi wa 1 wa Muhula wa 2 (Julai)',
    shortName: 'Julai',
    badge: 'Mwezi 7',
    formula: 'Wastani = Alama ya Julai Pekee',
    targetField: 'monthlyTest1',
  },
  {
    id: 'AUGUST',
    term: 'TERM_2',
    month: 'Agosti',
    name: 'Mtihani wa Mwezi wa 2 wa Muhula wa 2 (Agosti)',
    shortName: 'Agosti',
    badge: 'Mwezi 8',
    formula: 'Wastani = (Julai + Agosti) / 2',
    targetField: 'monthlyTest2',
  },
  {
    id: 'SEPTEMBER_MIDTERM',
    term: 'TERM_2',
    month: 'Septemba',
    name: 'Mtihani wa Nusu Muhula wa 2 (Mid-Term)',
    shortName: 'Septemba (Mid-Term)',
    badge: 'Nusu Muhula 2',
    formula: 'Wastani = (Majaribio * 40%) + (Mid-Term * 60%)',
    targetField: 'midtermExam',
  },
  {
    id: 'OCTOBER',
    term: 'TERM_2',
    month: 'Oktoba',
    name: 'Majaribio ya Pre-National (Oktoba)',
    shortName: 'Oktoba',
    badge: 'Mwezi 10',
    formula: 'Wastani = Maendeleo ya Oktoba',
    targetField: 'monthlyTest2',
  },
  {
    id: 'NOVEMBER_ANNUAL',
    term: 'TERM_2',
    month: 'Novemba',
    name: 'Mtihani wa Mwisho wa Mwaka (Annual Exam)',
    shortName: 'Novemba (Annual)',
    badge: 'Mwisho wa Mwaka',
    formula: 'Wastani = (Majaribio * 30%) + (Mid-Term * 30%) + (Annual * 40%)',
    targetField: 'terminalExam',
  },
];

interface SubjectSubmissionRecord {
  className: string;
  subjectName: string;
  teacherName: string;
  teacherStaffId: string;
  studentsCount: number;
  averageMark: string | number;
  periodId: string;
  periodTitle: string;
  submittedAt: string;
  submittedDate: string;
  fileName?: string;
  status: 'SUBMITTED';
  pupils: {
    admNo: string;
    name: string;
    gender: 'M' | 'F';
    finalMark: number;
    grade: string;
    remarks: string;
  }[];
}

interface ClassUploadStatus {
  isUploaded: boolean;
  fileName?: string;
  uploadedAt?: string;
}

const STORAGE_REGISTERED_PUPILS_KEY = 'academic_portal_registered_pupils_v2';
const STORAGE_SUBJECT_SUBMISSIONS_KEY = 'academic_subject_submissions_v1';

// Dynamic score calculation engine based on selected month / calendar milestone
function computeStudentScore(
  p: { monthlyTest1?: number; monthlyTest2?: number; midtermExam?: number; terminalExam?: number },
  periodId: string
) {
  const t1 = Number(p.monthlyTest1) || 0;
  const t2 = Number(p.monthlyTest2) || 0;
  const mid = Number(p.midtermExam) || 0;
  const term = Number(p.terminalExam) || 0;

  let finalMark = 0;

  switch (periodId) {
    case 'JANUARY':
    case 'JULY':
      finalMark = t1;
      break;

    case 'FEBRUARY':
    case 'AUGUST':
      if (t1 > 0 && t2 > 0) {
        finalMark = Math.round((t1 + t2) / 2);
      } else if (t1 > 0) {
        finalMark = t1;
      } else if (t2 > 0) {
        finalMark = t2;
      } else {
        finalMark = 0;
      }
      break;

    case 'MARCH_MIDTERM':
    case 'SEPTEMBER_MIDTERM': {
      const mAvg = t1 > 0 && t2 > 0 ? (t1 + t2) / 2 : t1 > 0 ? t1 : t2;
      if (mid > 0 && mAvg > 0) {
        finalMark = Math.round(mAvg * 0.4 + mid * 0.6);
      } else if (mid > 0) {
        finalMark = mid;
      } else if (mAvg > 0) {
        finalMark = Math.round(mAvg);
      } else {
        finalMark = 0;
      }
      break;
    }

    case 'APRIL':
    case 'MAY':
    case 'OCTOBER': {
      const mAvg = t1 > 0 && t2 > 0 ? (t1 + t2) / 2 : t1 > 0 ? t1 : t2;
      if (mid > 0 && mAvg > 0) {
        finalMark = Math.round(mAvg * 0.4 + mid * 0.6);
      } else if (mAvg > 0) {
        finalMark = Math.round(mAvg);
      } else {
        finalMark = mid || t1 || t2 || 0;
      }
      break;
    }

    case 'JUNE_TERMINAL':
    case 'NOVEMBER_ANNUAL':
    default: {
      const validMonthly = [t1, t2].filter((m) => m > 0);
      const mAvg =
        validMonthly.length > 0
          ? validMonthly.reduce((a, b) => a + b, 0) / validMonthly.length
          : 0;

      if (term === 0 && mid > 0) {
        finalMark = Math.round(mAvg * 0.4 + mid * 0.6);
      } else if (term === 0 && mid === 0 && mAvg > 0) {
        finalMark = Math.round(mAvg);
      } else {
        finalMark = Math.round(mAvg * 0.3 + mid * 0.3 + term * 0.4);
      }
      break;
    }
  }

  const hasAnyScore = t1 > 0 || t2 > 0 || mid > 0 || term > 0;
  const grade: StudentMark['grade'] = (hasAnyScore ? calculateGrade(finalMark) : 'F') as StudentMark['grade'];
  const remarks = hasAnyScore ? getRemarksForGrade(grade) : 'Inasubiri Mtihani';
  const monthlyAvg = Math.round((t1 + t2) / (t1 > 0 && t2 > 0 ? 2 : 1));

  return {
    monthlyAvg,
    finalMark,
    grade,
    remarks,
    hasAnyScore,
  };
}

export default function SubjectMarksPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentSession());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rosterFileInputRef = useRef<HTMLInputElement>(null);

  // Modal State for Registering Students via Excel
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Active School Term ('TERM_1' or 'TERM_2')
  const [activeTerm, setActiveTerm] = useState<SchoolTerm>('TERM_1');

  // Active Selected Calendar Period ID (default: 'JANUARY')
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('JANUARY');

  // Submissions state to Academic Master (stored in localStorage)
  const [subjectSubmissions, setSubjectSubmissions] = useState<Record<string, SubjectSubmissionRecord>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(STORAGE_SUBJECT_SUBMISSIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // Master pupils dictionary across all classes (persisted in localStorage)
  const [pupilsData, setPupilsData] = useState<Record<string, StudentMark[]>>(() => {
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

  // Sync pupilsData to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_REGISTERED_PUPILS_KEY, JSON.stringify(pupilsData));
    } catch {}
  }, [pupilsData]);

  // Load active session and URL class param once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }

    const params = new URLSearchParams(window.location.search);
    const classParam = params.get('class');
    if (classParam) {
      setSelectedClass(classParam);
    }
  }, []);

  // Teacher's Assigned Classes and Subjects
  const teacherClasses: string[] = useMemo(() => {
    if (currentUser?.assignedClasses && currentUser.assignedClasses.length > 0) {
      return currentUser.assignedClasses;
    }
    if (currentUser?.assignedClass && currentUser.assignedClass !== 'Whole School') {
      return [currentUser.assignedClass];
    }
    return ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)'];
  }, [currentUser?.assignedClasses, currentUser?.assignedClass]);

  const teacherSubjects: string[] = useMemo(() => {
    if (currentUser?.subjects && currentUser.subjects.length > 0) {
      return currentUser.subjects;
    }
    return [
      'Civic & Moral Education (Uraia na Maadili)',
      'Social Studies (Maarifa ya Jamii)',
      'Mathematics (Hisabati)',
      'English Language',
      'Kiswahili',
      'Science & Technology (Sayansi)',
    ];
  }, [currentUser?.subjects]);

  const [selectedClass, setSelectedClass] = useState<string>(() => {
    const session = getCurrentSession();
    return session?.assignedClasses?.[0] || 'Standard 6 (Grade 6)';
  });
  const [selectedSubject, setSelectedSubject] = useState<string>(() => {
    const session = getCurrentSession();
    return session?.subjects?.[0] || 'Civic & Moral Education (Uraia na Maadili)';
  });
  const [searchPupil, setSearchPupil] = useState('');

  // Per-Class, Per-Subject Excel Upload Tracker
  const [classUploads, setClassUploads] = useState<Record<string, ClassUploadStatus>>({});

  // Single Student Adjustment Modal State
  const [editingStudent, setEditingStudent] = useState<{
    id: string;
    admNo: string;
    name: string;
    monthlyTest1: number;
    monthlyTest2: number;
    midtermExam: number;
    terminalExam: number;
    reason: string;
    notes: string;
  } | null>(null);

  const [adjustedStudentIds, setAdjustedStudentIds] = useState<Record<string, string>>({});

  // Active key for current selection
  const currentKey = `${selectedClass}_${selectedSubject}`;
  const currentUpload = classUploads[currentKey] || { isUploaded: false };
  const isExcelUploaded = Boolean(currentUpload.isUploaded);
  const uploadedFileName = currentUpload.fileName || null;

  // Active submission for this class and subject
  const currentSubmission = subjectSubmissions[currentKey] || null;
  const isSubmittedToAcademic = Boolean(currentSubmission && currentSubmission.status === 'SUBMITTED');

  // Filter available periods by the active term
  const termPeriods = useMemo(() => {
    return SCHOOL_CALENDAR_PERIODS.filter((p) => p.term === activeTerm);
  }, [activeTerm]);

  // Current active calendar period
  const activePeriod = useMemo(() => {
    const found = termPeriods.find((p) => p.id === selectedPeriodId);
    return found || termPeriods[0] || SCHOOL_CALENDAR_PERIODS[0];
  }, [termPeriods, selectedPeriodId]);

  // Handler: Download Student Registration Template
  const handleDownloadRosterTemplate = () => {
    const headers = 'Namba_Ya_Usajili,Jina_La_Mwanafunzi,Jinsia,Darasa\n';
    const sampleRows = [
      `PUP-2026-001,John Peter Massawe,M,${selectedClass}`,
      `PUP-2026-002,Amina Salum Juma,F,${selectedClass}`,
      `PUP-2026-003,Emmanuel David Lyimo,M,${selectedClass}`,
      `PUP-2026-004,Zawadi Faraja Temu,F,${selectedClass}`,
    ].join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + sampleRows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Kigezo_Kusajili_Wanafunzi_${selectedClass.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser(
      'success',
      'Kigezo cha Usajili Kimepakuliwa',
      `Kigezo cha Excel cha kusajili wanafunzi wa ${selectedClass} kimepakuliwa kikamilifu.`
    );
  };

  // Handler: Upload Student Roster Excel / CSV
  const handleUploadRosterFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim() !== '');

        if (lines.length > 1) {
          const registeredList: StudentMark[] = [];

          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.replace(/["\r]/g, '').trim());
            if (cols.length >= 2 && cols[0] && cols[1]) {
              const admNo = cols[0];
              const name = cols[1];
              const gender = (cols[2]?.toUpperCase() === 'F' ? 'F' : 'M') as 'M' | 'F';

              registeredList.push({
                id: `pup-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
                admNo,
                name,
                gender,
                monthlyTest1: 0,
                monthlyTest2: 0,
                monthlyAvg: 0,
                midtermExam: 0,
                terminalExam: 0,
                mark: 0,
                grade: 'F',
                remarks: 'Inasubiri Mtihani',
                attendance: 'PRESENT',
              });
            }
          }

          if (registeredList.length > 0) {
            setPupilsData((prev) => ({
              ...prev,
              [selectedClass]: registeredList,
            }));

            setShowRegisterModal(false);
            if (rosterFileInputRef.current) rosterFileInputRef.current.value = '';

            notifyUser(
              'success',
              'Wanafunzi Wamesajiliwa Kikamilifu!',
              `Wanafunzi wote ${registeredList.length} wamesajiliwa kwenye ${selectedClass} na wameingizwa kwenye jedwali la matokeo!`
            );
            return;
          }
        }
      } catch (err) {
        console.error('Failed to parse roster file', err);
      }
    };
    reader.readAsText(file);
  };

  // Handler: 1-Click Sample Student Roster
  const handleRegisterSampleRoster = () => {
    const sampleNames = [
      { name: 'Barakael Frank Minja', gender: 'M' as const },
      { name: 'Catherine Joseph Shirima', gender: 'F' as const },
      { name: 'Denis Innocent Mushi', gender: 'M' as const },
      { name: 'Ester Martin Massawe', gender: 'F' as const },
      { name: 'Geoffrey Ally Mkude', gender: 'M' as const },
      { name: 'Happy Richard Kweka', gender: 'F' as const },
      { name: 'Ibrahim Saidi Swai', gender: 'M' as const },
      { name: 'Jackline Michael Temu', gender: 'F' as const },
      { name: 'Kelvin David Kimaro', gender: 'M' as const },
      { name: 'Lilian Peter Lyimo', gender: 'F' as const },
      { name: 'Moses Gabriel Mlay', gender: 'M' as const },
      { name: 'Nuru Charles Moshi', gender: 'F' as const },
      { name: 'Oscar Lucas Tarimo', gender: 'M' as const },
      { name: 'Patricia Anthony Shayo', gender: 'F' as const },
      { name: 'Rashidi Juma Hassan', gender: 'M' as const },
      { name: 'Salma Kassim Bakari', gender: 'F' as const },
      { name: 'Tumaini Nelson Mallya', gender: 'M' as const },
      { name: 'Upendo Wilson Maro', gender: 'F' as const },
      { name: 'Victor Godson Lyatuu', gender: 'M' as const },
      { name: 'Zainabu Zuberi Mkazi', gender: 'F' as const },
    ];

    const prefix = selectedClass.includes('7') ? 'PSLE-2026' : selectedClass.includes('4') ? 'SFNA-2026' : 'PUP-2026';
    const startNum = 501;

    const generated: StudentMark[] = sampleNames.map((item, idx) => ({
      id: `reg-${Date.now()}-${idx}`,
      admNo: `${prefix}-${String(startNum + idx).padStart(4, '0')}`,
      name: item.name,
      gender: item.gender,
      monthlyTest1: 0,
      monthlyTest2: 0,
      monthlyAvg: 0,
      midtermExam: 0,
      terminalExam: 0,
      mark: 0,
      grade: 'F',
      remarks: 'Inasubiri Mtihani',
      attendance: 'PRESENT',
    }));

    setPupilsData((prev) => ({
      ...prev,
      [selectedClass]: generated,
    }));

    setShowRegisterModal(false);

    notifyUser(
      'success',
      'Wanafunzi wa Majaribio Wamesajiliwa!',
      `Wanafunzi ${generated.length} wamesajiliwa kwa mafanikio katika ${selectedClass}.`
    );
  };

  // Check if any student in selected class has recorded scores
  const hasMarksInSelectedClass = useMemo(() => {
    const list = pupilsData[selectedClass] || [];
    return list.some(
      (p) =>
        (p.monthlyTest1 || 0) > 0 ||
        (p.monthlyTest2 || 0) > 0 ||
        (p.midtermExam || 0) > 0 ||
        (p.terminalExam || 0) > 0
    );
  }, [pupilsData, selectedClass]);

  const isMarksActive = isExcelUploaded || hasMarksInSelectedClass;

  // Live computed list of pupils based dynamically on active period
  const classPupils = useMemo(() => {
    const list =
      pupilsData[selectedClass] ||
      INITIAL_PUPILS[selectedClass] ||
      INITIAL_PUPILS['Standard 6 (Grade 6)'] ||
      [];

    const computed = list.map((pupil) => {
      const { monthlyAvg, finalMark, grade, remarks, hasAnyScore } = computeStudentScore(
        pupil,
        activePeriod.id
      );
      return {
        ...pupil,
        monthlyAvg,
        mark: finalMark,
        grade,
        remarks,
        hasAnyScore,
      };
    });

    const sorted = isMarksActive ? [...computed].sort((a, b) => b.mark - a.mark) : [...computed];

    const withRank = sorted.map((pupil, idx) => ({
      ...pupil,
      rank: isMarksActive && pupil.hasAnyScore ? idx + 1 : undefined,
    }));

    if (!searchPupil.trim()) return withRank;
    return withRank.filter(
      (p) =>
        p.name.toLowerCase().includes(searchPupil.toLowerCase()) ||
        p.admNo.toLowerCase().includes(searchPupil.toLowerCase())
    );
  }, [pupilsData, selectedClass, searchPupil, isMarksActive, activePeriod.id]);

  // Download Excel / CSV Template
  const handleDownloadTemplate = () => {
    const list =
      pupilsData[selectedClass] ||
      INITIAL_PUPILS[selectedClass] ||
      INITIAL_PUPILS['Standard 6 (Grade 6)'] ||
      [];

    const headers =
      'Namba_Ya_Usajili,Jina_La_Mwanafunzi,Jinsia,Monthly_Test_1_Jan,Monthly_Test_2_Feb,Mid_Term_Machi,Terminal_Exam_Juni\n';
    const rows = list
      .map(
        (p) =>
          `${p.admNo},"${p.name}",${p.gender},${p.monthlyTest1 > 0 ? p.monthlyTest1 : ''},${
            p.monthlyTest2 > 0 ? p.monthlyTest2 : ''
          },${p.midtermExam > 0 ? p.midtermExam : ''},${p.terminalExam > 0 ? p.terminalExam : ''}`
      )
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute(
      'download',
      `Kigezo_Matokeo_${selectedClass.replace(/\s+/g, '_')}_${selectedSubject.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser(
      'success',
      'Kigezo Kimepakuliwa Kikamilifu!',
      `Kigezo cha Excel cha ${selectedClass} kwa somo la ${selectedSubject} kimepakuliwa.`
    );
  };

  // Progressive Excel / CSV Upload with Auto-Merge
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim() !== '');

        if (lines.length > 1) {
          const updatedList = [
            ...(pupilsData[selectedClass] ||
              INITIAL_PUPILS[selectedClass] ||
              INITIAL_PUPILS['Standard 6 (Grade 6)'] ||
              []),
          ];

          const headers = lines[0]
            .toLowerCase()
            .split(',')
            .map((c) => c.replace(/["\r]/g, '').trim());

          let t1Idx = headers.findIndex(
            (h) => h.includes('monthly_1') || h.includes('january') || h.includes('jan') || h.includes('jul')
          );
          let t2Idx = headers.findIndex(
            (h) => h.includes('monthly_2') || h.includes('february') || h.includes('feb') || h.includes('aug')
          );
          let midIdx = headers.findIndex((h) => h.includes('mid') || h.includes('nusu') || h.includes('machi'));
          let termIdx = headers.findIndex(
            (h) => h.includes('terminal') || h.includes('term') || h.includes('muhula') || h.includes('juni')
          );

          if (t1Idx === -1 && headers.length >= 4) t1Idx = 3;
          if (t2Idx === -1 && headers.length >= 5) t2Idx = 4;
          if (midIdx === -1 && headers.length >= 6) midIdx = 5;
          if (termIdx === -1 && headers.length >= 7) termIdx = 6;

          let imported = 0;
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.replace(/["\r]/g, '').trim());
            if (cols.length >= 2) {
              const admNo = cols[0];
              const idx = updatedList.findIndex(
                (p) => p.admNo.toLowerCase() === admNo.toLowerCase()
              );
              if (idx !== -1) {
                const cur = updatedList[idx];

                const newT1 =
                  t1Idx !== -1 && cols[t1Idx] !== undefined && cols[t1Idx] !== ''
                    ? parseInt(cols[t1Idx], 10)
                    : cur.monthlyTest1;
                const newT2 =
                  t2Idx !== -1 && cols[t2Idx] !== undefined && cols[t2Idx] !== ''
                    ? parseInt(cols[t2Idx], 10)
                    : cur.monthlyTest2;
                const newMid =
                  midIdx !== -1 && cols[midIdx] !== undefined && cols[midIdx] !== ''
                    ? parseInt(cols[midIdx], 10)
                    : cur.midtermExam;
                const newTerm =
                  termIdx !== -1 && cols[termIdx] !== undefined && cols[termIdx] !== ''
                    ? parseInt(cols[termIdx], 10)
                    : cur.terminalExam;

                updatedList[idx] = {
                  ...cur,
                  monthlyTest1: !isNaN(newT1) ? newT1 : cur.monthlyTest1,
                  monthlyTest2: !isNaN(newT2) ? newT2 : cur.monthlyTest2,
                  midtermExam: !isNaN(newMid) ? newMid : cur.midtermExam,
                  terminalExam: !isNaN(newTerm) ? newTerm : cur.terminalExam,
                };
                imported++;
              }
            }
          }

          setPupilsData((prev) => ({ ...prev, [selectedClass]: updatedList }));
          setClassUploads((prev) => ({
            ...prev,
            [currentKey]: {
              isUploaded: true,
              fileName: file.name,
              uploadedAt: new Date().toLocaleTimeString('sw-TZ', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          }));

          notifyUser(
            'success',
            'Faili Limepakiwa & Kuunganishwa!',
            `Alama za wanafunzi ${imported} zimehifadhiwa bila kufuta mitihani ya miezi mingine.`
          );
        }
      } catch (err) {
        console.error('Failed to parse uploaded marks file', err);
      }
    };
    reader.readAsText(file);
  };

  // Instant simulation based on active calendar period
  const simulateActivePeriodUpload = () => {
    const list = [
      ...(pupilsData[selectedClass] ||
        INITIAL_PUPILS[selectedClass] ||
        INITIAL_PUPILS['Standard 6 (Grade 6)'] ||
        []),
    ];

    const updated = list.map((p, index) => {
      const curT1 = p.monthlyTest1 > 0 ? p.monthlyTest1 : Math.min(100, Math.max(62, 75 + ((index * 7) % 24)));
      const genT1 = Math.min(100, Math.max(62, 75 + ((index * 7) % 24)));
      const genT2 = Math.min(100, Math.max(65, 78 + ((index * 5) % 21)));
      const genMid = Math.min(100, Math.max(65, 80 + ((index * 4) % 19)));
      const genTerm = Math.min(100, Math.max(66, 82 + ((index * 6) % 17)));

      if (activePeriod.id === 'JANUARY' || activePeriod.id === 'JULY') {
        return { ...p, monthlyTest1: genT1 };
      } else if (activePeriod.id === 'FEBRUARY' || activePeriod.id === 'AUGUST') {
        return { ...p, monthlyTest1: curT1, monthlyTest2: genT2 };
      } else if (activePeriod.id.includes('MIDTERM')) {
        return { ...p, monthlyTest1: curT1, monthlyTest2: p.monthlyTest2 > 0 ? p.monthlyTest2 : genT2, midtermExam: genMid };
      } else {
        return { ...p, monthlyTest1: genT1, monthlyTest2: genT2, midtermExam: genMid, terminalExam: genTerm };
      }
    });

    setPupilsData((prev) => ({ ...prev, [selectedClass]: updated }));

    setClassUploads((prev) => ({
      ...prev,
      [currentKey]: {
        isUploaded: true,
        fileName: `matokeo_${activePeriod.month.toLowerCase()}_${selectedClass.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`,
        uploadedAt: new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }),
      },
    }));

    notifyUser(
      'success',
      'Matokeo Yamepakiwa!',
      `Alama za ${activePeriod.name} zimehifadhiwa na wastani umekokotolewa kiotomatiki.`
    );
  };

  // Reset / Clear uploaded results for current class
  const handleClearExcelResults = () => {
    setClassUploads((prev) => ({
      ...prev,
      [currentKey]: {
        isUploaded: false,
      },
    }));
    setAdjustedStudentIds({});

    setPupilsData((prev) => {
      const list = prev[selectedClass] || [];
      const cleared: StudentMark[] = list.map((p) => ({
        ...p,
        monthlyTest1: 0,
        monthlyTest2: 0,
        monthlyAvg: 0,
        midtermExam: 0,
        terminalExam: 0,
        mark: 0,
        grade: 'F' as const,
        remarks: 'Inasubiri Mtihani',
      }));
      return { ...prev, [selectedClass]: cleared };
    });

    notifyUser(
      'info',
      'Matokeo Yamewekwa Upya',
      `Matokeo ya ${selectedClass} kwa somo la ${selectedSubject} yamefutwa.`
    );
  };

  // Open Single Student Adjustment Modal
  const handleOpenStudentEdit = (pupil: StudentMark) => {
    if (!isMarksActive) {
      notifyUser(
        'warning',
        'Weka Kwanza Alama za Darasa',
        `Tafadhali pakia au weka alama za ${selectedClass} kwanza kabla ya kurekebisha mwanafunzi mmoja mmoja.`
      );
      return;
    }

    setEditingStudent({
      id: pupil.id,
      admNo: pupil.admNo,
      name: pupil.name,
      monthlyTest1: pupil.monthlyTest1,
      monthlyTest2: pupil.monthlyTest2,
      midtermExam: pupil.midtermExam,
      terminalExam: pupil.terminalExam,
      reason: 'Uhakiki wa Karatasi ya Mtihani',
      notes: '',
    });
  };

  // Save Single Student Adjustment
  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const t1 = Math.max(0, Math.min(100, Number(editingStudent.monthlyTest1) || 0));
    const t2 = Math.max(0, Math.min(100, Number(editingStudent.monthlyTest2) || 0));
    const mid = Math.max(0, Math.min(100, Number(editingStudent.midtermExam) || 0));
    const term = Math.max(0, Math.min(100, Number(editingStudent.terminalExam) || 0));

    const { monthlyAvg, finalMark, grade, remarks } = computeStudentScore(
      { monthlyTest1: t1, monthlyTest2: t2, midtermExam: mid, terminalExam: term },
      activePeriod.id
    );

    setPupilsData((prev) => {
      const classList = [
        ...(prev[selectedClass] ||
          INITIAL_PUPILS[selectedClass] ||
          INITIAL_PUPILS['Standard 6 (Grade 6)'] ||
          []),
      ];
      const idx = classList.findIndex((p) => p.id === editingStudent.id);
      if (idx !== -1) {
        classList[idx] = {
          ...classList[idx],
          monthlyTest1: t1,
          monthlyTest2: t2,
          monthlyAvg,
          midtermExam: mid,
          terminalExam: term,
          mark: finalMark,
          grade,
          remarks,
        };
      }
      return { ...prev, [selectedClass]: classList };
    });

    setAdjustedStudentIds((prev) => ({
      ...prev,
      [editingStudent.id]: editingStudent.reason,
    }));

    notifyUser(
      'success',
      'Alama Zimebadilishwa Kikamilifu!',
      `Alama za mwanafunzi ${editingStudent.name} (${editingStudent.admNo}) zimerekebishwa! Wastani: ${finalMark}% (${grade}).`
    );

    setEditingStudent(null);
  };

  // Submit to Academic Master
  const handleSubmitToAcademicMaster = () => {
    if (!isMarksActive) {
      notifyUser(
        'error',
        'Maksi Hazijapakiwa Bado!',
        `Tafadhali pakia au weka alama za ${selectedClass} kabla ya kuwasilisha kwa Mwalimu wa Taaluma.`
      );
      return;
    }

    try {
      const existingRaw =
        typeof window !== 'undefined'
          ? localStorage.getItem(STORAGE_SUBJECT_SUBMISSIONS_KEY)
          : null;
      let submissions = existingRaw ? JSON.parse(existingRaw) : {};

      const now = new Date();
      const timeStr = now.toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toISOString().split('T')[0];

      const record: SubjectSubmissionRecord = {
        className: selectedClass,
        subjectName: selectedSubject,
        teacherName: currentUser?.fullName || 'Mwalimu wa Somo',
        teacherStaffId: currentUser?.identifier || 'TCH-2026-001',
        studentsCount: classPupils.length,
        averageMark: averageScore,
        periodId: activePeriod.id,
        periodTitle: activePeriod.name,
        submittedAt: timeStr,
        submittedDate: dateStr,
        fileName:
          uploadedFileName ||
          `matokeo_${selectedSubject.toLowerCase().replace(/\s+/g, '_')}.xlsx`,
        status: 'SUBMITTED',
        pupils: classPupils.map((p) => ({
          admNo: p.admNo,
          name: p.name,
          gender: p.gender,
          finalMark: p.mark,
          grade: p.grade,
          remarks: p.remarks || getRemarksForGrade(p.grade),
        })),
      };

      submissions[currentKey] = record;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_SUBJECT_SUBMISSIONS_KEY, JSON.stringify(submissions));
      }
      setSubjectSubmissions(submissions);

      notifyUser(
        'success',
        'Matokeo Yamewasilishwa kwa Mwalimu wa Taaluma!',
        `Alama za somo la ${selectedSubject} (${selectedClass}) za ${activePeriod.name} zimewasilishwa rasmi ofisi ya taaluma.`
      );
    } catch (err) {
      console.error('Failed to submit subject marks to academic master', err);
    }
  };

  // Live Statistics for selected class based on dynamic scope
  const totalStudents = classPupils.length;
  const pupilsWithScores = classPupils.filter((p) => p.hasAnyScore || p.mark > 0);
  const gradeACount = isMarksActive
    ? classPupils.filter((p) => p.hasAnyScore && p.grade === 'A').length
    : 0;
  const gradeBCount = isMarksActive
    ? classPupils.filter((p) => p.hasAnyScore && p.grade === 'B').length
    : 0;
  const gradeCCount = isMarksActive
    ? classPupils.filter((p) => p.hasAnyScore && p.grade === 'C').length
    : 0;
  const gradeDCount = isMarksActive
    ? classPupils.filter((p) => p.hasAnyScore && (p.grade === 'D' || p.grade === 'F')).length
    : 0;

  const averageScore =
    isMarksActive && pupilsWithScores.length > 0
      ? (pupilsWithScores.reduce((acc, p) => acc + p.mark, 0) / pupilsWithScores.length).toFixed(1)
      : isMarksActive && totalStudents > 0
      ? (classPupils.reduce((acc, p) => acc + p.mark, 0) / totalStudents).toFixed(1)
      : '—';

  return (
    <TeacherShell
      pageTitle="Kujaza Alama za Somo (Excel Spreadsheet Grid)"
      pageDescription="Matokeo yanapangwa kulingana na Kalenda Kamili ya Shule. Chagua mwezi wowote, wastani na madaraja huhesabiwa kiotomatiki na kuwasilishwa kwa Mwalimu wa Taaluma."
    >
      <div className="space-y-4 animate-fade-in">
        {/* Hidden file input for Excel upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xlsx,.xls,.csv"
          className="hidden"
        />

        {/* ===================================================================== */}
        {/* 0. TEACHER'S ASSIGNED CLASSES & SUBJECT BAR */}
        {/* ===================================================================== */}
        <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-emerald-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <GraduationCap className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900">
                  Madarasa Ninayofundisha ({teacherClasses.length})
                </h2>
                <p className="text-[10px] text-slate-500">
                  Bofya darasa unalotaka kusimamia matokeo yake:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Subject Selector */}
              <div className="flex items-center gap-1.5 bg-emerald-50/70 p-1 px-2.5 rounded-xl border border-emerald-200">
                <BookOpen className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                <label htmlFor="subject-select" className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                  Somo:
                </label>
                <select
                  id="subject-select"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="text-xs font-bold py-1 px-2 rounded-lg bg-white border border-emerald-300 text-emerald-950 focus:outline-none max-w-[260px] truncate shadow-2xs"
                >
                  {teacherSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Register Students Button */}
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Sajili Wanafunzi ({selectedClass})</span>
              </button>
            </div>
          </div>

          {/* Grid of Teacher Classes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {teacherClasses.map((cls) => {
              const isSelected = selectedClass === cls;
              const clsKey = `${cls}_${selectedSubject}`;
              const clsStatus = classUploads[clsKey];
              const isClsUploaded = Boolean(clsStatus?.isUploaded);
              const pupilsCount = (pupilsData[cls] || INITIAL_PUPILS[cls] || []).length;
              const isSub = Boolean(subjectSubmissions[clsKey]?.status === 'SUBMITTED');

              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`p-2.5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white border-emerald-950 shadow-md shadow-emerald-950/20 ring-2 ring-emerald-500/30'
                      : 'bg-white hover:bg-emerald-50/80 text-slate-800 border-emerald-200/90 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-black block truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {cls}
                    </span>
                    {isSelected ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    ) : (
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <span className={`font-bold ${isSelected ? 'text-emerald-200' : 'text-slate-600'}`}>
                      {pupilsCount} Wanafunzi
                    </span>
                    <div className="flex items-center gap-1">
                      {isSub && (
                        <span
                          className={`px-1 py-0.2 rounded font-black text-[9px] ${
                            isSelected ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-700 text-white'
                          }`}
                        >
                          ✓ Taaluma
                        </span>
                      )}
                      <span
                        className={`px-1.5 py-0.2 rounded-full font-bold text-[9px] border ${
                          isClsUploaded
                            ? isSelected
                              ? 'bg-emerald-500/30 text-emerald-100 border-emerald-400/40'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : isSelected
                            ? 'bg-amber-400/20 text-amber-200 border-amber-400/30'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {isClsUploaded ? 'Maksi Zipopo' : 'Inasubiri'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 1. COMPACT, CLEAN & PROFESSIONAL SCHOOL CALENDAR ASSESSMENT CONTROL */}
        {/* (Eliminates all repetitive cards, integrates calendar & submission) */}
        {/* ===================================================================== */}
        <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-3">
          {/* Top Bar: Term Switcher & Live Academic Submission Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-xs font-black text-slate-900">
                Kalenda ya Mitihani ya Shule (Mwezi kwa Mwezi):
              </span>

              {/* Term Switcher */}
              <div className="flex items-center gap-1 bg-emerald-50 p-0.5 rounded-lg border border-emerald-200 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTerm('TERM_1');
                    setSelectedPeriodId('JANUARY');
                  }}
                  className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                    activeTerm === 'TERM_1'
                      ? 'bg-emerald-800 text-white shadow-2xs font-black'
                      : 'text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  Muhula wa 1 (Jan – Jun)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTerm('TERM_2');
                    setSelectedPeriodId('JULY');
                  }}
                  className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
                    activeTerm === 'TERM_2'
                      ? 'bg-emerald-800 text-white shadow-2xs font-black'
                      : 'text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  Muhula wa 2 (Jul – Des)
                </button>
              </div>
            </div>

            {/* Submission Status Badge */}
            <div className="flex items-center gap-1.5 shrink-0">
              {isSubmittedToAcademic ? (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center gap-1 text-[11px] font-black">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>✓ Imewasilishwa kwa Taaluma ({currentSubmission.submittedAt})</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-1 text-[11px] font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>⏳ Bado Haijawasilishwa</span>
                </span>
              )}
            </div>
          </div>

          {/* Stepper / Timeline: Complete Months of the Selected Term */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {termPeriods.map((period) => {
              const isSelected = selectedPeriodId === period.id;

              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriodId(period.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-950 shadow-sm ring-2 ring-emerald-500/30'
                      : 'bg-emerald-50/40 hover:bg-emerald-100/70 text-slate-800 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-emerald-200' : 'text-emerald-800'}`}>
                      {period.badge}
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-emerald-300 shrink-0" />}
                  </div>
                  <span className={`text-xs font-black block leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {period.shortName}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Toolbar & Context Info (All essential tools in ONE clean row) */}
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-emerald-950 text-xs">
                  Mtihani Amilifu: <span className="text-emerald-800 underline font-black">{activePeriod.name}</span>
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-md bg-white border border-emerald-300 text-emerald-900 font-bold">
                  Wastani wa Sasa: <strong className="font-black">{isMarksActive ? `${averageScore}%` : '—'}</strong>
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-mono">
                {activePeriod.formula}
              </p>
            </div>

            {/* Compact Tool Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Upload Excel */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title="Pakia faili la Excel au CSV la matokeo"
              >
                <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pakia Excel</span>
              </button>

              {/* 1-Click Test Data */}
              <button
                type="button"
                onClick={simulateActivePeriodUpload}
                className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                title="Weka alama za majaribio za mwezi huu"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Maksi za Mfano</span>
              </button>

              {/* Template Download */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                title="Pakua kigezo cha Excel"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Kigezo</span>
              </button>

              {/* Primary Submit to Academic Master Button */}
              {isSubmittedToAcademic ? (
                <>
                  <button
                    type="button"
                    onClick={handleSubmitToAcademicMaster}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Wasilisha Upya ({activePeriod.month})</span>
                  </button>

                  <Link
                    href={`/teacher/broadsheet?class=${encodeURIComponent(selectedClass)}`}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1 shadow-2xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Broadsheet →</span>
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitToAcademicMaster}
                  disabled={!isMarksActive}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMarksActive
                      ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-950/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Wasilisha kwa Taaluma ({activePeriod.month})</span>
                </button>
              )}

              {/* Reset if marks are active */}
              {isMarksActive && (
                <button
                  type="button"
                  onClick={handleClearExcelResults}
                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                  title="Futa matokeo ili kuanza upya"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. SUMMARY STATS CARDS */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-white/95 border border-emerald-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wanafunzi Wote
            </span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{totalStudents}</p>
            <span className="text-[10px] text-emerald-800 font-semibold">{selectedClass}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/95 border border-emerald-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wastani ({activePeriod.shortName})
            </span>
            <p className="text-xl font-black text-emerald-800 mt-0.5">
              {isMarksActive ? `${averageScore}%` : '—'}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {isMarksActive ? 'Kulingana na Mtihani Uliochaguliwa' : 'Inasubiri Maksi'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/95 border border-emerald-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wenye Daraja A
            </span>
            <p className="text-xl font-black text-emerald-700 mt-0.5">
              {isMarksActive ? gradeACount : '—'}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {isMarksActive ? 'Ufaulu Bora Sana' : 'Inasubiri Maksi'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/95 border border-emerald-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wenye Daraja B
            </span>
            <p className="text-xl font-black text-blue-700 mt-0.5">
              {isMarksActive ? gradeBCount : '—'}
            </p>
            <span className="text-[10px] text-blue-700 font-semibold">
              {isMarksActive ? 'Ufaulu Mzuri' : 'Inasubiri Maksi'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/95 border border-emerald-200/90 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Daraja C / D / F
            </span>
            <p className="text-xl font-black text-amber-700 mt-0.5">
              {isMarksActive ? gradeCCount + gradeDCount : '—'}
            </p>
            <span className="text-[10px] text-amber-700 font-semibold">
              {isMarksActive ? 'Wastani / Wanahitaji Msukumo' : 'Inasubiri Maksi'}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchPupil}
              onChange={(e) => setSearchPupil(e.target.value)}
              placeholder={`Tafuta mwanafunzi wa ${selectedClass}...`}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-2 self-end sm:self-auto font-semibold">
            <span>
              Darasa: <strong className="text-emerald-900">{selectedClass}</strong>
            </span>
            <span>•</span>
            <span>
              Somo: <strong className="text-emerald-900">{selectedSubject}</strong>
            </span>
            <span>•</span>
            <span>
              Mtihani: <strong className="text-emerald-900">{activePeriod.shortName}</strong>
            </span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. EXCEL SPREADSHEET TABLE: STUDENTS OF SELECTED CLASS */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 border-r border-emerald-700 text-center w-10">#</th>
                  <th className="py-2.5 px-3 border-r border-emerald-700 min-w-[120px]">Namba ya Usajili</th>
                  <th className="py-2.5 px-3 border-r border-emerald-700 min-w-[190px]">Jina Kamili la Mwanafunzi</th>
                  <th className="py-2.5 px-2 border-r border-emerald-700 text-center w-12">Jinsia</th>
                  <th
                    className={`py-2.5 px-2 border-r border-emerald-700 text-center min-w-[85px] ${
                      activePeriod.id === 'JANUARY' || activePeriod.id === 'JULY'
                        ? 'bg-emerald-950 font-black ring-1 ring-emerald-400 inset-0'
                        : 'bg-emerald-900/60'
                    }`}
                  >
                    Monthly 1 (Jan)
                  </th>
                  <th
                    className={`py-2.5 px-2 border-r border-emerald-700 text-center min-w-[85px] ${
                      activePeriod.id === 'FEBRUARY' || activePeriod.id === 'AUGUST'
                        ? 'bg-emerald-950 font-black ring-1 ring-emerald-400'
                        : 'bg-emerald-900/60'
                    }`}
                  >
                    Monthly 2 (Feb)
                  </th>
                  <th className="py-2.5 px-2 border-r border-emerald-700 text-center bg-emerald-950/80 min-w-[85px]">
                    Wastani Monthly
                  </th>
                  <th
                    className={`py-2.5 px-2 border-r border-emerald-700 text-center min-w-[85px] ${
                      activePeriod.id.includes('MIDTERM')
                        ? 'bg-blue-950 font-black ring-1 ring-blue-400'
                        : 'bg-blue-900/60'
                    }`}
                  >
                    Mid-Term (Machi)
                  </th>
                  <th
                    className={`py-2.5 px-2 border-r border-emerald-700 text-center min-w-[85px] ${
                      activePeriod.id.includes('TERMINAL') || activePeriod.id.includes('ANNUAL')
                        ? 'bg-indigo-950 font-black ring-1 ring-indigo-400'
                        : 'bg-indigo-900/60'
                    }`}
                  >
                    Terminal (Juni)
                  </th>
                  <th className="py-2.5 px-2 border-r border-emerald-700 text-center bg-amber-900/80 min-w-[95px]">
                    <div className="leading-tight">
                      <span>Wastani (%)</span>
                      <span className="block text-[8px] font-mono text-amber-200 uppercase font-black">
                        {activePeriod.shortName}
                      </span>
                    </div>
                  </th>
                  <th className="py-2.5 px-2 border-r border-emerald-700 text-center w-16">Daraja</th>
                  <th className="py-2.5 px-2 border-r border-emerald-700 text-center w-14">Nafasi</th>
                  <th className="py-2.5 px-3 border-r border-emerald-700 min-w-[150px]">Maoni ya Mwalimu</th>
                  <th className="py-2.5 px-3 text-center min-w-[100px] bg-emerald-900/80">Marekebisho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 text-slate-800">
                {classPupils.map((pupil, idx) => {
                  const isAdjusted = Boolean(adjustedStudentIds[pupil.id]);

                  return (
                    <tr
                      key={pupil.id}
                      className={`hover:bg-emerald-50/70 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/20'
                      }`}
                    >
                      {/* Row Index */}
                      <td className="py-2 px-3 font-mono text-slate-400 text-center border-r border-slate-100">
                        {idx + 1}
                      </td>

                      {/* Admission Number */}
                      <td className="py-2 px-3 font-mono text-emerald-900 font-semibold border-r border-slate-100 whitespace-nowrap">
                        {pupil.admNo}
                      </td>

                      {/* Pupil Name */}
                      <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-100 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{pupil.name}</span>
                          {isAdjusted && (
                            <span
                              className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold text-[9px] border border-blue-200"
                              title={`Imerekebishwa kwa mikono: ${adjustedStudentIds[pupil.id]}`}
                            >
                              Imerekebishwa
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Gender */}
                      <td className="py-2 px-2 text-center text-slate-600 font-bold border-r border-slate-100">
                        {pupil.gender}
                      </td>

                      {/* Monthly Test 1 (Jan) */}
                      <td
                        className={`py-2 px-2 text-center font-mono font-semibold border-r border-slate-100 ${
                          activePeriod.id === 'JANUARY' || activePeriod.id === 'JULY'
                            ? 'bg-emerald-50/60 font-bold'
                            : ''
                        }`}
                      >
                        {pupil.monthlyTest1 > 0 ? (
                          <span className="text-slate-900">{pupil.monthlyTest1}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Monthly Test 2 (Feb) */}
                      <td
                        className={`py-2 px-2 text-center font-mono font-semibold border-r border-slate-100 ${
                          activePeriod.id === 'FEBRUARY' || activePeriod.id === 'AUGUST'
                            ? 'bg-emerald-50/60 font-bold'
                            : ''
                        }`}
                      >
                        {pupil.monthlyTest2 > 0 ? (
                          <span className="text-slate-900">{pupil.monthlyTest2}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Monthly Average */}
                      <td className="py-2 px-2 text-center font-mono font-bold text-emerald-950 bg-emerald-50/40 border-r border-slate-100">
                        {pupil.monthlyAvg > 0 ? (
                          <span>{pupil.monthlyAvg}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Midterm Exam */}
                      <td
                        className={`py-2 px-2 text-center font-mono font-semibold text-blue-900 border-r border-slate-100 ${
                          activePeriod.id.includes('MIDTERM') ? 'bg-blue-50/60 font-bold' : ''
                        }`}
                      >
                        {pupil.midtermExam > 0 ? (
                          <span className="font-bold">{pupil.midtermExam}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Terminal Exam */}
                      <td
                        className={`py-2 px-2 text-center font-mono font-semibold text-indigo-900 border-r border-slate-100 ${
                          activePeriod.id.includes('TERMINAL') || activePeriod.id.includes('ANNUAL')
                            ? 'bg-indigo-50/60 font-bold'
                            : ''
                        }`}
                      >
                        {pupil.terminalExam > 0 ? (
                          <span className="font-bold">{pupil.terminalExam}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Final Mark (%) */}
                      <td className="py-2 px-2 text-center font-mono font-black text-slate-900 bg-amber-50/50 border-r border-slate-100 text-sm">
                        {pupil.hasAnyScore ? (
                          <span className="font-bold text-amber-950">{pupil.mark}%</span>
                        ) : (
                          <span className="text-slate-300 font-normal text-xs">—</span>
                        )}
                      </td>

                      {/* Grade Badge */}
                      <td className="py-2 px-2 text-center border-r border-slate-100">
                        {pupil.hasAnyScore ? (
                          <span
                            className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                              pupil.grade === 'A'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : pupil.grade === 'B'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : pupil.grade === 'C'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {pupil.grade}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Rank */}
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-600 border-r border-slate-100">
                        {pupil.hasAnyScore && pupil.rank ? `#${pupil.rank}` : '—'}
                      </td>

                      {/* Remarks */}
                      <td className="py-2 px-3 text-slate-600 text-[11px] font-medium border-r border-slate-100 whitespace-nowrap">
                        {pupil.hasAnyScore ? (
                          pupil.remarks || getRemarksForGrade(pupil.grade)
                        ) : (
                          <span className="text-slate-400 italic">Inasubiri mtihani</span>
                        )}
                      </td>

                      {/* Action Button: Edit Single Student */}
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenStudentEdit(pupil)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-emerald-700" />
                          <span>Rekebisha</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SINGLE STUDENT EDIT MODAL */}
        {/* ===================================================================== */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-emerald-200 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Rekebisha Alama za Mwanafunzi
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingStudent.name} • {editingStudent.admNo} ({selectedClass})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveStudentEdit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Monthly 1 (Januari):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingStudent.monthlyTest1}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, monthlyTest1: Number(e.target.value) })
                      }
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Monthly 2 (Februari):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingStudent.monthlyTest2}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, monthlyTest2: Number(e.target.value) })
                      }
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Mid-Term (Machi):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingStudent.midtermExam}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, midtermExam: Number(e.target.value) })
                      }
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Terminal (Juni / Mwisho):
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingStudent.terminalExam}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, terminalExam: Number(e.target.value) })
                      }
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Live Calculated Preview */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">
                      Wastani ({activePeriod.shortName}):
                    </span>
                    <span className="font-black text-emerald-900 text-sm">
                      {
                        computeStudentScore(
                          {
                            monthlyTest1: editingStudent.monthlyTest1,
                            monthlyTest2: editingStudent.monthlyTest2,
                            midtermExam: editingStudent.midtermExam,
                            terminalExam: editingStudent.terminalExam,
                          },
                          activePeriod.id
                        ).finalMark
                      }
                      %
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Daraja:</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-800 text-white font-black text-xs">
                      Grade{' '}
                      {
                        computeStudentScore(
                          {
                            monthlyTest1: editingStudent.monthlyTest1,
                            monthlyTest2: editingStudent.monthlyTest2,
                            midtermExam: editingStudent.midtermExam,
                            terminalExam: editingStudent.terminalExam,
                          },
                          activePeriod.id
                        ).grade
                      }
                    </span>
                  </div>
                </div>

                {/* Reason for Adjustment */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Sababu ya Marekebisho (Audit Reason):
                  </label>
                  <select
                    value={editingStudent.reason}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, reason: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Uhakiki wa Karatasi ya Mtihani">
                      Uhakiki wa Karatasi ya Mtihani (Remarking)
                    </option>
                    <option value="Kusahihisha Kosa la Uandishi kwenye Excel">
                      Kusahihisha Kosa la Uandishi kwenye Excel
                    </option>
                    <option value="Mtihani wa Marudio (Supplementary Exam)">
                      Mtihani wa Marudio (Supplementary Exam)
                    </option>
                    <option value="Sababu Nyingine ya Kiofisi">Sababu Nyingine ya Kiofisi</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Ghairi
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 cursor-pointer"
                  >
                    Hifadhi Marekebisho
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* STUDENT ROSTER REGISTRATION MODAL */}
        {/* ===================================================================== */}
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-emerald-200 space-y-5 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Sajili Wanafunzi kwa Excel ({selectedClass})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Weka orodha ya wanafunzi wa darasa hili ili waonekane kwenye jedwali la matokeo
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Instructions & Template Format */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    <span>Muundo wa Faili la Excel / CSV:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleDownloadRosterTemplate}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Pakua Kigezo</span>
                  </button>
                </div>
                <div className="overflow-x-auto rounded-xl bg-white border border-emerald-100 p-2 text-[10px] font-mono text-slate-700">
                  <div className="font-bold text-emerald-900 pb-1 border-b border-slate-100 grid grid-cols-4 gap-2">
                    <span>Namba_Ya_Usajili</span>
                    <span>Jina_La_Mwanafunzi</span>
                    <span>Jinsia</span>
                    <span>Darasa</span>
                  </div>
                  <div className="pt-1 space-y-0.5 text-slate-600">
                    <div className="grid grid-cols-4 gap-2">
                      <span>PUP-2026-001</span>
                      <span className="truncate">John Peter Massawe</span>
                      <span>M</span>
                      <span className="truncate">{selectedClass}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <span>PUP-2026-002</span>
                      <span className="truncate">Amina Salum Juma</span>
                      <span>F</span>
                      <span className="truncate">{selectedClass}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => rosterFileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 text-emerald-200" />
                  <span>Chagua &amp; Pakia Faili la Wanafunzi (.xlsx au .csv)</span>
                </button>

                <button
                  type="button"
                  onClick={handleRegisterSampleRoster}
                  className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Sajili Wanafunzi 20 wa Majaribio (1-Click Test Roster)</span>
                </button>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Funga
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
