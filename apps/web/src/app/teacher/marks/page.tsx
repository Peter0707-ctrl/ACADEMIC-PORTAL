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
  CheckSquare,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';
import { INITIAL_PUPILS, StudentMark, calculateGrade, getRemarksForGrade } from '@/lib/teacher-data';

// =============================================================================
// TYPES & DATA STRUCTURES FOR PROGRESSIVE MARKS & ACADEMIC SUBMISSION
// =============================================================================

type AssessmentScope =
  | 'JANUARY_ONLY' // Mtihani wa Januari Pekee (Monthly Test 1)
  | 'MONTHLY_ALL' // Majaribio ya Mwezi (Januari & Februari)
  | 'UP_TO_MIDTERM' // Mpaka Nusu Muhula (Mid-Term)
  | 'FULL_TERM'; // Muhula Mzima (Full Term)

interface ScopeOption {
  id: AssessmentScope;
  title: string;
  shortTitle: string;
  badge: string;
  formula: string;
  description: string;
}

const ASSESSMENT_SCOPES: ScopeOption[] = [
  {
    id: 'JANUARY_ONLY',
    title: 'Januari Pekee (Monthly Test 1)',
    shortTitle: 'Januari Tu',
    badge: 'Mwezi 1',
    formula: 'Wastani = Monthly_Test_1 (Alama ya Mtihani wa Januari)',
    description:
      'Kokotoa wastani, madaraja na nafasi kwa kutumia mtihani wa Januari pekee. Hakuna mwanafunzi atakayepewa sifuri kwa mitihani ambayo haijafanyika bado.',
  },
  {
    id: 'MONTHLY_ALL',
    title: 'Majaribio ya Mwezi (Jan & Feb)',
    shortTitle: 'Jan & Feb',
    badge: 'Majaribio ya Mwezi',
    formula: 'Wastani = (Monthly_1 + Monthly_2) / Majaribio Yaliyofanyika',
    description:
      'Wastani wa majaribio ya kila mwezi yaliyokwishafanyika (Januari na Februari). Huhesabu wastani wa majaribio yaliyopo bila kuharibu rekodi za mwanzo.',
  },
  {
    id: 'UP_TO_MIDTERM',
    title: 'Mpaka Nusu Muhula (Mid-Term)',
    shortTitle: 'Mpaka Mid-Term',
    badge: 'Nusu Muhula',
    formula: 'Wastani = (Majaribio ya Mwezi * 40%) + (Mid-Term * 60%)',
    description:
      'Wastani wa maendeleo ya mwanafunzi kuanzia mwanzo wa muhula hadi mtihani wa nusu muhula (Mid-Term).',
  },
  {
    id: 'FULL_TERM',
    title: 'Muhula Mzima (Full Term)',
    shortTitle: 'Muhula Mzima',
    badge: 'Mwisho wa Muhula',
    formula: 'Wastani = (Majaribio ya Mwezi * 30%) + (Mid-Term * 30%) + (Terminal * 40%)',
    description:
      'Wastani rasmi wa mwisho wa muhula unaojumuisha majaribio yote ya mwezi, mtihani wa kati na mtihani mkuu wa kufunga muhula.',
  },
];

interface SubjectSubmissionRecord {
  className: string;
  subjectName: string;
  teacherName: string;
  teacherStaffId: string;
  studentsCount: number;
  averageMark: string | number;
  scope: AssessmentScope;
  scopeTitle: string;
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

// Dynamic score, grade, remarks and rank calculation according to assessment scope
function computeStudentScore(
  p: { monthlyTest1?: number; monthlyTest2?: number; midtermExam?: number; terminalExam?: number },
  scope: AssessmentScope
) {
  const t1 = Number(p.monthlyTest1) || 0;
  const t2 = Number(p.monthlyTest2) || 0;
  const mid = Number(p.midtermExam) || 0;
  const term = Number(p.terminalExam) || 0;

  let finalMark = 0;

  switch (scope) {
    case 'JANUARY_ONLY':
      finalMark = t1;
      break;

    case 'MONTHLY_ALL':
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

    case 'UP_TO_MIDTERM': {
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

    case 'FULL_TERM':
    default: {
      const validMonthly = [t1, t2].filter((m) => m > 0);
      const mAvg =
        validMonthly.length > 0
          ? validMonthly.reduce((a, b) => a + b, 0) / validMonthly.length
          : 0;

      // Progressive calculation if term exam not yet sat
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

  // Dynamic Assessment Scope state (Januari Pekee, Jan & Feb, Mpaka Mid-Term, Muhula Mzima)
  const [assessmentScope, setAssessmentScope] = useState<AssessmentScope>('FULL_TERM');

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

  // 1. Teacher's Assigned Classes and Subjects (Stable array references)
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

  // Set of students whose marks were adjusted individually
  const [adjustedStudentIds, setAdjustedStudentIds] = useState<Record<string, string>>({});

  // Active key for current selection
  const currentKey = `${selectedClass}_${selectedSubject}`;
  const currentUpload = classUploads[currentKey] || { isUploaded: false };
  const isExcelUploaded = Boolean(currentUpload.isUploaded);
  const uploadedFileName = currentUpload.fileName || null;
  const uploadedAt = currentUpload.uploadedAt || null;

  // Active submission for this class and subject
  const currentSubmission = subjectSubmissions[currentKey] || null;
  const isSubmittedToAcademic = Boolean(currentSubmission && currentSubmission.status === 'SUBMITTED');

  // Active Scope Option
  const currentScopeOption =
    ASSESSMENT_SCOPES.find((s) => s.id === assessmentScope) || ASSESSMENT_SCOPES[3];

  // If a submission already exists for this subject, default to its scope if not yet customized
  useEffect(() => {
    if (currentSubmission?.scope) {
      setAssessmentScope(currentSubmission.scope);
    }
  }, [currentKey]);

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
              `Wanafunzi wote ${registeredList.length} wamesajiliwa kwenye ${selectedClass} na wameingizwa moja kwa moja kwenye jedwali la matokeo!`
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
      `Wanafunzi ${generated.length} wamesajiliwa kwa mafanikio katika ${selectedClass} na kuonekana kwenye orodha ya matokeo.`
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

  // Compute ranks and live list of pupils for selected class dynamically based on assessmentScope
  const classPupils = useMemo(() => {
    const list =
      pupilsData[selectedClass] ||
      INITIAL_PUPILS[selectedClass] ||
      INITIAL_PUPILS['Standard 6 (Grade 6)'] ||
      [];

    const computed = list.map((pupil) => {
      const { monthlyAvg, finalMark, grade, remarks, hasAnyScore } = computeStudentScore(
        pupil,
        assessmentScope
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

    // Sort descending by calculated mark if marks are active
    const sorted = isMarksActive ? [...computed].sort((a, b) => b.mark - a.mark) : [...computed];

    const withRank = sorted.map((pupil, idx) => ({
      ...pupil,
      rank: isMarksActive && pupil.hasAnyScore ? idx + 1 : undefined,
    }));

    // Filter by search query if any
    if (!searchPupil.trim()) return withRank;
    return withRank.filter(
      (p) =>
        p.name.toLowerCase().includes(searchPupil.toLowerCase()) ||
        p.admNo.toLowerCase().includes(searchPupil.toLowerCase())
    );
  }, [pupilsData, selectedClass, searchPupil, isMarksActive, assessmentScope]);

  // 1. Download Excel / CSV Template for Selected Class (Option: Full or January Only)
  const handleDownloadTemplate = (templateType: 'FULL' | 'JAN_ONLY' = 'FULL') => {
    const list =
      pupilsData[selectedClass] ||
      INITIAL_PUPILS[selectedClass] ||
      INITIAL_PUPILS['Standard 6 (Grade 6)'] ||
      [];

    let headers = '';
    let rows = '';

    if (templateType === 'JAN_ONLY') {
      headers = 'Namba_Ya_Usajili,Jina_La_Mwanafunzi,Jinsia,Monthly_Test_1_Januari\n';
      rows = list
        .map(
          (p) =>
            `${p.admNo},"${p.name}",${p.gender},${p.monthlyTest1 > 0 ? p.monthlyTest1 : ''}`
        )
        .join('\n');
    } else {
      headers =
        'Namba_Ya_Usajili,Jina_La_Mwanafunzi,Jinsia,Monthly_Test_1,Monthly_Test_2,Wastani_Monthly,Mid_Term,Terminal_Exam,Wastani_Muhula,Daraja\n';
      rows = list
        .map(
          (p) =>
            `${p.admNo},"${p.name}",${p.gender},${p.monthlyTest1 > 0 ? p.monthlyTest1 : ''},${
              p.monthlyTest2 > 0 ? p.monthlyTest2 : ''
            },${p.monthlyAvg > 0 ? p.monthlyAvg : ''},${p.midtermExam > 0 ? p.midtermExam : ''},${
              p.terminalExam > 0 ? p.terminalExam : ''
            },${p.mark > 0 ? p.mark : ''},${p.mark > 0 ? p.grade : ''}`
        )
        .join('\n');
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute(
      'download',
      templateType === 'JAN_ONLY'
        ? `Kigezo_Januari_${selectedClass.replace(/\s+/g, '_')}_${selectedSubject.replace(/\s+/g, '_')}.csv`
        : `Kigezo_Matokeo_${selectedClass.replace(/\s+/g, '_')}_${selectedSubject.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser(
      'success',
      'Kigezo Kimepakuliwa Kikamilifu!',
      `Kigezo cha Excel cha ${selectedClass} (${
        templateType === 'JAN_ONLY' ? 'Januari Pekee' : 'Mitihani Yote'
      }) kimepakuliwa tayari kwa kujaza alama za somo la ${selectedSubject}.`
    );
  };

  // 2. Intelligent Progressive Excel / CSV Upload with Auto-Merge
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

          // Parse header to identify which columns are present
          const headers = lines[0]
            .toLowerCase()
            .split(',')
            .map((c) => c.replace(/["\r]/g, '').trim());

          let t1Idx = headers.findIndex(
            (h) =>
              h.includes('monthly_1') ||
              h.includes('january') ||
              h.includes('jan') ||
              h.includes('test_1')
          );
          let t2Idx = headers.findIndex(
            (h) =>
              h.includes('monthly_2') ||
              h.includes('february') ||
              h.includes('feb') ||
              h.includes('test_2')
          );
          let midIdx = headers.findIndex((h) => h.includes('mid') || h.includes('nusu'));
          let termIdx = headers.findIndex(
            (h) =>
              h.includes('terminal') ||
              h.includes('term') ||
              h.includes('muhula') ||
              h.includes('mwisho')
          );

          // Positional fallback if full 10-column spreadsheet
          if (t1Idx === -1 && headers.length >= 4) t1Idx = 3;
          if (t2Idx === -1 && headers.length >= 5) t2Idx = 4;
          if (midIdx === -1 && headers.length >= 7) midIdx = 6;
          if (termIdx === -1 && headers.length >= 8) termIdx = 7;

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

                // Auto-merge: update only columns that were provided in this upload
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

          // If upload contains only January marks, intelligently adjust assessment scope
          if (t1Idx !== -1 && t2Idx === -1 && midIdx === -1 && termIdx === -1) {
            setAssessmentScope('JANUARY_ONLY');
          }

          notifyUser(
            'success',
            'Faili la Excel Limepakiwa & Kuunganishwa!',
            `Faili "${file.name}" limepakiwa kikamilifu kwa ${selectedClass}! Alama za wanafunzi ${
              imported || updatedList.length
            } zimehifadhiwa bila kufuta mitihani ya miezi mingine.`
          );
        }
      } catch (err) {
        console.error('Failed to parse uploaded marks file', err);
      }
    };
    reader.readAsText(file);
  };

  // 3. Progressive 1-Click Test Simulation (Allows testing January only, Feb merge, Midterm merge, Full Term)
  const simulateProgressiveUpload = (
    mode: 'JAN_ONLY' | 'FEB_MERGE' | 'MID_MERGE' | 'FULL_TERM'
  ) => {
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

      if (mode === 'JAN_ONLY') {
        return {
          ...p,
          monthlyTest1: genT1,
          monthlyTest2: 0,
          midtermExam: 0,
          terminalExam: 0,
        };
      } else if (mode === 'FEB_MERGE') {
        return {
          ...p,
          monthlyTest1: curT1,
          monthlyTest2: genT2,
        };
      } else if (mode === 'MID_MERGE') {
        return {
          ...p,
          monthlyTest1: curT1,
          monthlyTest2: p.monthlyTest2 > 0 ? p.monthlyTest2 : genT2,
          midtermExam: genMid,
        };
      } else {
        // FULL_TERM
        return {
          ...p,
          monthlyTest1: genT1,
          monthlyTest2: genT2,
          midtermExam: genMid,
          terminalExam: genTerm,
        };
      }
    });

    setPupilsData((prev) => ({ ...prev, [selectedClass]: updated }));

    if (mode === 'JAN_ONLY') {
      setAssessmentScope('JANUARY_ONLY');
    } else if (mode === 'FEB_MERGE') {
      setAssessmentScope('MONTHLY_ALL');
    } else if (mode === 'MID_MERGE') {
      setAssessmentScope('UP_TO_MIDTERM');
    } else {
      setAssessmentScope('FULL_TERM');
    }

    const simName =
      mode === 'JAN_ONLY'
        ? `matokeo_januari_${selectedClass.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`
        : mode === 'FEB_MERGE'
        ? `matokeo_februari_${selectedClass.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`
        : mode === 'MID_MERGE'
        ? `matokeo_midterm_${selectedClass.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`
        : `matokeo_muhula_${selectedClass.toLowerCase().replace(/[^a-z0-9]/g, '_')}.xlsx`;

    setClassUploads((prev) => ({
      ...prev,
      [currentKey]: {
        isUploaded: true,
        fileName: simName,
        uploadedAt: new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }),
      },
    }));

    const modeLabels: Record<string, string> = {
      JAN_ONLY: 'Mtihani wa Januari Pekee (Monthly 1)',
      FEB_MERGE: 'Februari Imeunganishwa na Januari (Auto-merge)',
      MID_MERGE: 'Mpaka Nusu Muhula (Mid-Term Imeunganishwa)',
      FULL_TERM: 'Mitihani Yote ya Muhula Mzima',
    };

    notifyUser(
      'success',
      'Matokeo Yamepakiwa Kikamilifu!',
      `${modeLabels[mode]} kwa ${selectedClass} yamehifadhiwa! Wastani wa sasa na madaraja yamehesabiwa kiotomatiki.`
    );
  };

  // 4. Reset / Clear uploaded results for current class
  const handleClearExcelResults = () => {
    setClassUploads((prev) => ({
      ...prev,
      [currentKey]: {
        isUploaded: false,
      },
    }));
    setAdjustedStudentIds({});

    // Reset student scores to 0 for this class
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
      `Matokeo ya ${selectedClass} kwa somo la ${selectedSubject} yamefutwa. Jedwali sasa liko wazi likisubiri kupakiwa upya.`
    );
  };

  // 5. Open Single Student Adjustment Modal
  const handleOpenStudentEdit = (pupil: StudentMark) => {
    if (!isMarksActive) {
      notifyUser(
        'warning',
        'Pakia Kwanza Maksi za Darasa',
        `Tafadhali pakia faili la Excel la wanafunzi wa ${selectedClass} kwanza kabla ya kurekebisha mwanafunzi mmoja mmoja.`
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

  // 6. Save Single Student Adjustment
  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const t1 = Math.max(0, Math.min(100, Number(editingStudent.monthlyTest1) || 0));
    const t2 = Math.max(0, Math.min(100, Number(editingStudent.monthlyTest2) || 0));
    const mid = Math.max(0, Math.min(100, Number(editingStudent.midtermExam) || 0));
    const term = Math.max(0, Math.min(100, Number(editingStudent.terminalExam) || 0));

    const { monthlyAvg, finalMark, grade, remarks } = computeStudentScore(
      { monthlyTest1: t1, monthlyTest2: t2, midtermExam: mid, terminalExam: term },
      assessmentScope
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
      `Alama za mwanafunzi ${editingStudent.name} (${editingStudent.admNo}) wa ${selectedClass} zimerekebishwa kikamilifu! Wastani: ${finalMark}% (${grade}).`
    );

    setEditingStudent(null);
  };

  // 7. Submit Subject Broadsheet to Academic Master
  const handleSubmitToAcademicMaster = () => {
    if (!isMarksActive) {
      notifyUser(
        'error',
        'Maksi Hazijapakiwa Bado!',
        `Tafadhali pakia au weka alama za wanafunzi wa ${selectedClass} kwa wigo uliochagua kabla ya kuwasilisha kwa Mwalimu wa Taaluma.`
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
        scope: assessmentScope,
        scopeTitle: currentScopeOption.title,
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
        `Alama za somo la ${selectedSubject} (${selectedClass}) za wigo "${currentScopeOption.title}" kwa wanafunzi ${classPupils.length} zimewasilishwa rasmi kwa Mwalimu wa Taaluma (Broadsheet Kuu).`
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
      pageDescription="Pakia matokeo ya mwezi wowote (k.m. Januari pekee, au mpaka Mid-Term), unganisha majaribio bila kufuta mwanzo, na wasilisha moja kwa moja kwa Mwalimu wa Taaluma."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Hidden file input for Excel upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xlsx,.xls,.csv"
          className="hidden"
        />

        {/* ===================================================================== */}
        {/* 0. TEACHER'S ASSIGNED CLASSES & SUBJECT SELECTION BAR */}
        {/* ===================================================================== */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-950/20">
                <GraduationCap className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900">
                    Madarasa Ninayofundisha (My Teaching Classes)
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300">
                    {teacherClasses.length} Madarasa
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bofya darasa unalotaka kuona wanafunzi wake na kupakia faili la Excel la somo husika.
                </p>
              </div>
            </div>

            {/* Subject Selector Dropdown */}
            <div className="flex items-center gap-2.5 shrink-0 bg-emerald-50/70 p-2 rounded-2xl border border-emerald-200">
              <BookOpen className="w-4 h-4 text-emerald-800 shrink-0" />
              <label htmlFor="subject-select" className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Somo Langu:
              </label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-xs font-bold py-1.5 px-3 rounded-xl bg-white border border-emerald-300 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 max-w-[280px] truncate shadow-2xs"
              >
                {teacherSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Class Selector Tabs */}
          <div className="space-y-2.5">
            {/* Hidden Input for Student Registration Roster */}
            <input
              type="file"
              ref={rosterFileInputRef}
              onChange={handleUploadRosterFile}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950">
                  Chagua Darasa Uone Wanafunzi Wake:
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                  Madarasa Ninayofundisha Pekee ({teacherClasses.length})
                </span>
              </div>

              {/* Action Button: Register Students by Excel */}
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Sajili Wanafunzi kwa Excel ({selectedClass})</span>
              </button>
            </div>

            {/* Grid of Teacher Classes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white border-emerald-950 shadow-md shadow-emerald-950/25 ring-2 ring-emerald-500/40'
                        : 'bg-white hover:bg-emerald-50/80 text-slate-800 border-emerald-200/90 hover:border-emerald-400 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span
                          className={`text-xs font-black block leading-snug ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {cls}
                        </span>
                        <span
                          className={`text-[10px] font-semibold block ${
                            isSelected ? 'text-emerald-200' : 'text-slate-500'
                          }`}
                        >
                          {selectedSubject.split('(')[0]}
                        </span>
                      </div>
                      {isSelected ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 mt-0.5 shadow-sm" />
                      ) : (
                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-100/20 text-[10px]">
                      <span className={`font-bold ${isSelected ? 'text-emerald-200' : 'text-slate-600'}`}>
                        {pupilsCount} Wanafunzi
                      </span>
                      <div className="flex items-center gap-1">
                        {isSub && (
                          <span
                            className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] ${
                              isSelected ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-700 text-white'
                            }`}
                            title="Matokeo yamewasilishwa kwa Mwalimu wa Taaluma"
                          >
                            ✓ Taaluma
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full font-black text-[9px] border ${
                            isClsUploaded
                              ? isSelected
                                ? 'bg-emerald-500/30 text-emerald-100 border-emerald-400/40'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : isSelected
                              ? 'bg-amber-400/20 text-amber-200 border-amber-400/30'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {isClsUploaded ? '✓ Excel Imepakiwa' : '⏳ Inasubiri Excel'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 1. EXCEL UPLOAD STATUS & ACTION HERO BANNER (WITH PROGRESSIVE OPTIONS) */}
        {/* ===================================================================== */}
        <div
          className={`p-6 rounded-3xl border shadow-sm transition-all ${
            isMarksActive
              ? 'bg-white/95 border-emerald-300 shadow-emerald-950/5'
              : 'bg-emerald-50/70 border-emerald-200'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Status Information */}
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border ${
                    isMarksActive
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>
                    {isMarksActive
                      ? `Maksi za ${selectedClass} Zipo Amilifu (${currentScopeOption.shortTitle})`
                      : `Maksi Hazijawekwa • Inasubiri Excel ya ${selectedClass}`}
                  </span>
                </span>

                {uploadedAt && (
                  <span className="text-[11px] font-mono text-slate-500">Saa {uploadedAt}</span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isMarksActive
                  ? `Matokeo Yapo Amilifu: ${uploadedFileName || `Somo la ${selectedSubject}`}`
                  : `Pakia Faili la Excel Kuingiza Maksi za ${selectedClass}`}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isMarksActive
                  ? `Alama za wanafunzi ${classPupils.length} wa ${selectedClass} zinapatikana kwa somo la ${selectedSubject}. Unaweza kupakia mwezi unaofuata (k.m. Februari) na zitaunganishwa kiotomatiki bila kufuta mitihani iliyopita!`
                  : `Kulingana na miongozo ya shule, unaweza kupakia matokeo ya mwezi wowote (k.m. Januari pekee). Pakia faili la Excel (.xlsx / .csv) au tumia vitufe vya majaribio ya haraka hapa chini.`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-emerald-200" />
                <span>Pakia Excel / CSV ({selectedClass})</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate('JAN_ONLY')}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  title="Pakua kigezo cha kujaza mtihani wa Januari pekee"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kigezo (Januari Tu)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadTemplate('FULL')}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  title="Pakua kigezo kamili chenye nguzo za mitihani yote"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Kigezo Kamili</span>
                </button>
              </div>

              {isMarksActive && (
                <button
                  type="button"
                  onClick={handleClearExcelResults}
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Weka upya alama za darasa hili"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Weka Upya</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Simulation Bar for Progressive Assessment Testing */}
          <div className="mt-4 pt-3 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Majaribio ya Haraka ya Kupakia (1-Click Test Data):</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => simulateProgressiveUpload('JAN_ONLY')}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold text-[11px] transition-colors cursor-pointer"
                title="Weka alama za Januari pekee (Monthly 1) na uone wastani ukipigwa kwa Januari pekee"
              >
                🗓️ Weka Januari Tu
              </button>

              <button
                type="button"
                onClick={() => simulateProgressiveUpload('FEB_MERGE')}
                className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 font-bold text-[11px] transition-colors cursor-pointer"
                title="Weka alama za Februari zikiunganishwa na Januari bila kuifuta"
              >
                📊 Unganisha Februari (Auto-merge)
              </button>

              <button
                type="button"
                onClick={() => simulateProgressiveUpload('MID_MERGE')}
                className="px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300 font-bold text-[11px] transition-colors cursor-pointer"
                title="Weka alama hadi Mid-Term"
              >
                📝 Unganisha Mid-Term
              </button>

              <button
                type="button"
                onClick={() => simulateProgressiveUpload('FULL_TERM')}
                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-[11px] transition-colors cursor-pointer"
                title="Weka mitihani yote ya muhula mzima"
              >
                🏆 Muhula Mzima
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. DEDICATED SECTION: WASILISHA KWA MWALIMU WA TAALUMA */}
        {/* ===================================================================== */}
        <div
          className={`p-6 rounded-3xl border shadow-sm transition-all space-y-5 ${
            isSubmittedToAcademic
              ? 'bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/20'
              : 'bg-white/95 border-emerald-200/90'
          }`}
        >
          {/* Header & Status Indicator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-950/20">
                <Send className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900">
                    Uwasilishaji wa Matokeo kwa Mwalimu wa Taaluma (Submit to Academic Master)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Unaweza kuwasilisha matokeo ya mtihani wowote (k.m. Januari pekee, au mpaka Mid-Term)
                  bila kulazimika kusubiri muhula wote uishe. Wastani wa darasa utakokotolewa kulingana
                  na wigo utakaochagua hapa chini.
                </p>
              </div>
            </div>

            {/* Current Submission Badge */}
            <div className="shrink-0 self-start md:self-center">
              {isSubmittedToAcademic ? (
                <div className="px-4 py-2 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-950 flex items-center gap-2 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      Hali ya Uwasilishaji
                    </span>
                    <span className="text-xs font-black text-emerald-950">
                      ✓ IMEWASILISHWA KWA TAALUMA
                    </span>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center gap-2 shadow-xs">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div className="text-left">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-amber-800">
                      Hali ya Uwasilishaji
                    </span>
                    <span className="text-xs font-black text-amber-950">
                      ⏳ BADO HAIJAWASILISHWA
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scope Selector: Wigo wa Matokeo Yanayowasilishwa na Kukokotolewa Wastani */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>Chagua Wigo wa Matokeo Unayowasilisha &amp; Kukokotoa Wastani:</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                Wigo Amilifu: {currentScopeOption.title}
              </span>
            </div>

            {/* 4 Segmented Scope Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {ASSESSMENT_SCOPES.map((scope) => {
                const isActive = assessmentScope === scope.id;

                return (
                  <button
                    key={scope.id}
                    type="button"
                    onClick={() => setAssessmentScope(scope.id)}
                    className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-800 text-white border-emerald-950 shadow-md shadow-emerald-950/20 ring-2 ring-emerald-500/30'
                        : 'bg-white hover:bg-emerald-50/70 text-slate-800 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-black ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {scope.title}
                      </span>
                      {isActive && (
                        <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-semibold ${
                        isActive ? 'text-emerald-200' : 'text-slate-500'
                      }`}
                    >
                      {scope.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Scope Formula & Description Helper Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-950 block">
                  {currentScopeOption.description}
                </span>
                <span className="font-mono text-[11px] text-emerald-800 block">
                  Formula: {currentScopeOption.formula}
                </span>
              </div>
              <div className="shrink-0 self-end sm:self-center font-bold text-xs bg-white px-3 py-1.5 rounded-xl border border-emerald-300 text-emerald-950">
                Wastani wa Wigo Huu:{' '}
                <strong className="text-emerald-800 font-black text-sm">
                  {isMarksActive ? `${averageScore}%` : '—'}
                </strong>
              </div>
            </div>
          </div>

          {/* Submission Details & Action Control Area */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              {isSubmittedToAcademic ? (
                <>
                  <div className="flex items-center gap-2 text-emerald-950 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      Matokeo yamewasilishwa rasmi:{' '}
                      <strong className="font-black text-slate-900">
                        {currentSubmission.submittedDate} saa {currentSubmission.submittedAt}
                      </strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Mwalimu: <strong>{currentSubmission.teacherName}</strong> • Somo:{' '}
                    <strong>{selectedSubject}</strong> • Wigo: <strong>{currentSubmission.scopeTitle}</strong> •
                    Wanafunzi: <strong>{currentSubmission.studentsCount}</strong> • Wastani:{' '}
                    <strong>{currentSubmission.averageMark}%</strong>
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-amber-950 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>
                      Matokeo ya somo la "{selectedSubject}" kwa {selectedClass} bado hayajawasilishwa
                      kwa Taaluma.
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Bofya kitufe cha chini kuwasilisha matokeo ya <strong>{currentScopeOption.title}</strong>{' '}
                    (Wastani wa darasa:{' '}
                    <strong>{isMarksActive ? `${averageScore}%` : 'Inasubiri maksi'}</strong>).
                  </p>
                </>
              )}
            </div>

            {/* Submission Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {isSubmittedToAcademic ? (
                <>
                  <button
                    type="button"
                    onClick={handleSubmitToAcademicMaster}
                    className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-300" />
                    <span>Wasilisha Upya Marekebisho ({currentScopeOption.shortTitle})</span>
                  </button>

                  <Link
                    href={`/teacher/broadsheet?class=${encodeURIComponent(selectedClass)}`}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-700" />
                    <span>Tazama Broadsheet ya Taaluma →</span>
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitToAcademicMaster}
                  disabled={!isMarksActive}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                    isMarksActive
                      ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-950/20 hover:scale-[1.02]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                  <span>
                    🚀 Wasilisha Matokeo ya {selectedClass} kwa Mwalimu wa Taaluma (
                    {currentScopeOption.shortTitle})
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. SUMMARY STATS CARDS */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wanafunzi Wote
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalStudents}</p>
            <span className="text-[10px] text-emerald-800 font-semibold">{selectedClass}</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wastani ({currentScopeOption.shortTitle})
            </span>
            <p className="text-2xl font-black text-emerald-800 mt-1">
              {isMarksActive ? `${averageScore}%` : '—'}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {isMarksActive ? 'Kulingana na Wigo Uliochaguliwa' : 'Inasubiri Maksi'}
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wenye Daraja A
            </span>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              {isMarksActive ? gradeACount : '—'}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {isMarksActive ? 'Ufaulu Bora Sana' : 'Inasubiri Maksi'}
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wenye Daraja B
            </span>
            <p className="text-2xl font-black text-blue-700 mt-1">
              {isMarksActive ? gradeBCount : '—'}
            </p>
            <span className="text-[10px] text-blue-700 font-semibold">
              {isMarksActive ? 'Ufaulu Mzuri' : 'Inasubiri Maksi'}
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Daraja C / D / F
            </span>
            <p className="text-2xl font-black text-amber-700 mt-1">
              {isMarksActive ? gradeCCount + gradeDCount : '—'}
            </p>
            <span className="text-[10px] text-amber-700 font-semibold">
              {isMarksActive ? 'Wastani / Wanahitaji Msukumo' : 'Inasubiri Maksi'}
            </span>
          </div>
        </div>

        {/* Formula Bar Banner (Excel Style) */}
        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-emerald-950">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded-md bg-emerald-800 text-white font-bold text-[10px]">
              fx Formula ({currentScopeOption.shortTitle})
            </span>
            <span className="truncate font-semibold">{currentScopeOption.formula}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-sans text-[11px] font-bold text-slate-600">
            <span className="text-emerald-800">A (81-100)</span>
            <span>•</span>
            <span className="text-blue-800">B (65-80)</span>
            <span>•</span>
            <span className="text-amber-800">C (45-64)</span>
            <span>•</span>
            <span className="text-rose-800">D/F (0-44)</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchPupil}
              onChange={(e) => setSearchPupil(e.target.value)}
              placeholder={`Tafuta mwanafunzi wa ${selectedClass}...`}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="text-xs text-slate-600 flex items-center gap-2 self-end sm:self-auto font-semibold">
            <span>
              Darasa Linaloonekana: <strong className="text-emerald-900">{selectedClass}</strong>
            </span>
            <span>•</span>
            <span>
              Somo: <strong className="text-emerald-900">{selectedSubject}</strong>
            </span>
            <span>•</span>
            <span>
              Wigo: <strong className="text-emerald-900">{currentScopeOption.shortTitle}</strong>
            </span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4. EXCEL SPREADSHEET TABLE: STUDENTS OF SELECTED CLASS */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 border-r border-emerald-700 text-center w-10">#</th>
                  <th className="py-3 px-3 border-r border-emerald-700 min-w-[120px]">Namba ya Usajili</th>
                  <th className="py-3 px-3 border-r border-emerald-700 min-w-[200px]">Jina Kamili la Mwanafunzi</th>
                  <th className="py-3 px-2 border-r border-emerald-700 text-center w-12">Jinsia</th>
                  <th className="py-3 px-2 border-r border-emerald-700 text-center bg-emerald-900/60 min-w-[85px]">
                    Monthly 1 (Jan)
                  </th>
                  <th className="py-3 px-2 border-r border-emerald-700 text-center bg-emerald-900/60 min-w-[85px]">
                    Monthly 2 (Feb)
                  </th>
                  <th className="py-3 px-2 border-r border-emerald-700 text-center bg-emerald-950/80 min-w-[85px]">
                    Wastani Monthly
                  </th>
                  <th className="py-3 px-2 border-r border-emerald-700 text-center bg-blue-900/60 min-w-[85px]">
                    Mid-Term
                  </th>
                  <th className="py-3 px-2 border-r border-emerald-700 text-center bg-indigo-900/60 min-w-[85px]">
                    Terminal
                  </th>
                  <th className="py-3 px-2 border-r border-emerald-700 text-center bg-amber-900/80 min-w-[95px]">
                    <div className="leading-tight">
                      <span>Wastani (%)</span>
                      <span className="block text-[8px] font-mono text-amber-200 uppercase font-black tracking-normal">
                        {currentScopeOption.shortTitle}
                      </span>
                    </div>
                  </th>
                  <th className="py-3 px-2 border-r border-emerald-700 text-center w-16">Daraja</th>
                  <th className="py-3 px-2 border-r border-emerald-700 text-center w-14">Nafasi</th>
                  <th className="py-3 px-3 border-r border-emerald-700 min-w-[160px]">Maoni ya Mwalimu</th>
                  <th className="py-3 px-3 text-center min-w-[110px] bg-emerald-900/80">Hatua / Marekebisho</th>
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
                      <td className="py-2.5 px-3 font-mono text-slate-400 text-center border-r border-slate-100">
                        {idx + 1}
                      </td>

                      {/* Admission Number */}
                      <td className="py-2.5 px-3 font-mono text-emerald-900 font-semibold border-r border-slate-100 whitespace-nowrap">
                        {pupil.admNo}
                      </td>

                      {/* Pupil Name + Adjusted Tag */}
                      <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-100 whitespace-nowrap">
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
                      <td className="py-2.5 px-2 text-center text-slate-600 font-bold border-r border-slate-100">
                        {pupil.gender}
                      </td>

                      {/* Monthly Test 1 */}
                      <td className="py-2.5 px-2 text-center font-mono font-semibold border-r border-slate-100">
                        {pupil.monthlyTest1 > 0 ? (
                          <span className="font-bold text-slate-900">{pupil.monthlyTest1}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Monthly Test 2 */}
                      <td className="py-2.5 px-2 text-center font-mono font-semibold border-r border-slate-100">
                        {pupil.monthlyTest2 > 0 ? (
                          <span className="font-bold text-slate-900">{pupil.monthlyTest2}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Monthly Average */}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-emerald-950 bg-emerald-50/40 border-r border-slate-100">
                        {pupil.monthlyAvg > 0 ? (
                          <span>{pupil.monthlyAvg}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Midterm Exam */}
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-blue-900 border-r border-slate-100">
                        {pupil.midtermExam > 0 ? (
                          <span className="font-bold">{pupil.midtermExam}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Terminal Exam */}
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-indigo-900 border-r border-slate-100">
                        {pupil.terminalExam > 0 ? (
                          <span className="font-bold">{pupil.terminalExam}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Final Mark (%) Calculated according to active Assessment Scope */}
                      <td className="py-2.5 px-2 text-center font-mono font-black text-slate-900 bg-amber-50/50 border-r border-slate-100 text-sm">
                        {pupil.hasAnyScore ? (
                          <span className="font-bold text-amber-950">{pupil.mark}%</span>
                        ) : (
                          <span className="text-slate-300 font-normal text-xs">—</span>
                        )}
                      </td>

                      {/* Grade Badge */}
                      <td className="py-2.5 px-2 text-center border-r border-slate-100">
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
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-600 border-r border-slate-100">
                        {pupil.hasAnyScore && pupil.rank ? `#${pupil.rank}` : '—'}
                      </td>

                      {/* Remarks */}
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] font-medium border-r border-slate-100 whitespace-nowrap">
                        {pupil.hasAnyScore ? (
                          pupil.remarks || getRemarksForGrade(pupil.grade)
                        ) : (
                          <span className="text-slate-400 italic">Inasubiri kupakiwa</span>
                        )}
                      </td>

                      {/* Action Button: Edit Single Student */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenStudentEdit(pupil)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] flex items-center gap-1 mx-auto transition-colors cursor-pointer"
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
                      Mid-Term:
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
                      Terminal (Mwisho wa Muhula):
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
                      Wastani ({currentScopeOption.shortTitle}):
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
                          assessmentScope
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
                          assessmentScope
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
        {/* STUDENT ROSTER REGISTRATION MODAL (REGISTER STUDENTS VIA EXCEL) */}
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
                    <span>Muundo wa Faili la Excel / CSV la Kusajili Wanafunzi:</span>
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
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Faili litakapopakiwa, wanafunzi hao wataingizwa mara moja kwenye darasa la{' '}
                  <strong>{selectedClass}</strong> na idadi ya wanafunzi itaonekana kwenye kadi ya
                  darasa na jedwali la matokeo.
                </p>
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
