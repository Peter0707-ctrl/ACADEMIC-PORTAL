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
// TYPES & DATA STRUCTURES: TANZANIA SCHOOL ACADEMIC CALENDAR (ALL 12 MONTHS)
// =============================================================================

interface AcademicMonth {
  id: string; // 'M01', 'M02', ... 'M12'
  monthNumber: number;
  name: string; // 'Januari', 'Februari', 'Machi', etc.
  shortName: string; // 'Jan', 'Feb', 'Machi', etc.
  term: 'Muhula wa 1' | 'Muhula wa 2';
  tag: string;
  defaultType: string;
}

const TANZANIA_SCHOOL_MONTHS: AcademicMonth[] = [
  // MUHULA WA 1 (Januari – Juni)
  {
    id: 'M01',
    monthNumber: 1,
    name: 'Januari',
    shortName: 'Jan',
    term: 'Muhula wa 1',
    tag: 'Mtihani wa Mwezi 1',
    defaultType: 'Monthly Test 1',
  },
  {
    id: 'M02',
    monthNumber: 2,
    name: 'Februari',
    shortName: 'Feb',
    term: 'Muhula wa 1',
    tag: 'Mtihani wa Mwezi 2',
    defaultType: 'Monthly Test 2',
  },
  {
    id: 'M03',
    monthNumber: 3,
    name: 'Machi',
    shortName: 'Machi',
    term: 'Muhula wa 1',
    tag: 'Nusu Muhula (Mid-Term)',
    defaultType: 'Mid-Term Exam',
  },
  {
    id: 'M04',
    monthNumber: 4,
    name: 'Aprili',
    shortName: 'Apr',
    term: 'Muhula wa 1',
    tag: 'Mtihani wa Mwezi 4',
    defaultType: 'Monthly Test 4',
  },
  {
    id: 'M05',
    monthNumber: 5,
    name: 'Mei',
    shortName: 'Mei',
    term: 'Muhula wa 1',
    tag: 'Mtihani wa Mwezi 5',
    defaultType: 'Monthly Test 5',
  },
  {
    id: 'M06',
    monthNumber: 6,
    name: 'Juni',
    shortName: 'Juni',
    term: 'Muhula wa 1',
    tag: 'Mwisho wa Muhula (Terminal)',
    defaultType: 'Terminal Exam',
  },

  // MUHULA WA 2 (Julai – Desemba)
  {
    id: 'M07',
    monthNumber: 7,
    name: 'Julai',
    shortName: 'Jul',
    term: 'Muhula wa 2',
    tag: 'Mtihani wa Mwezi 7',
    defaultType: 'Monthly Test 7',
  },
  {
    id: 'M08',
    monthNumber: 8,
    name: 'Agosti',
    shortName: 'Ago',
    term: 'Muhula wa 2',
    tag: 'Mtihani wa Mwezi 8',
    defaultType: 'Monthly Test 8',
  },
  {
    id: 'M09',
    monthNumber: 9,
    name: 'Septemba',
    shortName: 'Sep',
    term: 'Muhula wa 2',
    tag: 'Nusu Muhula (Mid-Term 2)',
    defaultType: 'Mid-Term Exam 2',
  },
  {
    id: 'M10',
    monthNumber: 10,
    name: 'Oktoba',
    shortName: 'Okt',
    term: 'Muhula wa 2',
    tag: 'Mtihani wa Mwezi 10 (Mock)',
    defaultType: 'Pre-National / Mock',
  },
  {
    id: 'M11',
    monthNumber: 11,
    name: 'Novemba',
    shortName: 'Nov',
    term: 'Muhula wa 2',
    tag: 'Mtihani wa Mwaka (Annual)',
    defaultType: 'Annual Examination',
  },
  {
    id: 'M12',
    monthNumber: 12,
    name: 'Desemba',
    shortName: 'Des',
    term: 'Muhula wa 2',
    tag: 'Tathmini ya Mwisho wa Mwaka',
    defaultType: 'Year-End Review',
  },
];

interface PupilWithMonthlyMarks extends StudentMark {
  monthlyScores?: Record<string, number>;
}

interface SubjectSubmissionRecord {
  className: string;
  subjectName: string;
  teacherName: string;
  teacherStaffId: string;
  studentsCount: number;
  averageMark: string | number;
  monthId: string;
  monthName: string;
  monthNumber: number;
  term: string;
  tag: string;
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

// Helper to retrieve pupil score for a specific month (1 to 12)
function getPupilScoreForMonth(pupil: PupilWithMonthlyMarks, monthId: string): number {
  if (pupil.monthlyScores && typeof pupil.monthlyScores[monthId] === 'number') {
    return pupil.monthlyScores[monthId];
  }
  // Fallbacks to standard fields for initial seeded demo
  if (monthId === 'M01') return pupil.monthlyTest1 || 0;
  if (monthId === 'M02') return pupil.monthlyTest2 || 0;
  if (monthId === 'M03') return pupil.midtermExam || 0;
  if (monthId === 'M06') return pupil.terminalExam || 0;
  if (monthId === 'M07') return pupil.monthlyTest1 || 0;
  if (monthId === 'M08') return pupil.monthlyTest2 || 0;
  if (monthId === 'M09') return pupil.midtermExam || 0;
  if (monthId === 'M11') return pupil.terminalExam || 0;
  return 0;
}

export default function SubjectMarksPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentSession());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rosterFileInputRef = useRef<HTMLInputElement>(null);

  // Modal State for Registering Students via Excel
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Active Month (1 to 12). Default: Januari (M01)
  const [selectedMonthId, setSelectedMonthId] = useState<string>('M01');

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
  const [pupilsData, setPupilsData] = useState<Record<string, PupilWithMonthlyMarks[]>>(() => {
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
    score: number;
    reason: string;
    notes: string;
  } | null>(null);

  const [adjustedStudentIds, setAdjustedStudentIds] = useState<Record<string, string>>({});

  // Active Month details
  const activeMonth = useMemo(() => {
    return (
      TANZANIA_SCHOOL_MONTHS.find((m) => m.id === selectedMonthId) ||
      TANZANIA_SCHOOL_MONTHS[0]
    );
  }, [selectedMonthId]);

  // Submission key for current class, subject and month
  const currentMonthSubmissionKey = `${selectedClass}_${selectedSubject}_${activeMonth.id}`;
  const currentMonthSubmission = subjectSubmissions[currentMonthSubmissionKey] || null;
  const isSubmittedToAcademic = Boolean(
    currentMonthSubmission && currentMonthSubmission.status === 'SUBMITTED'
  );

  // Active key for upload status
  const currentClassSubjectKey = `${selectedClass}_${selectedSubject}`;
  const currentUpload = classUploads[currentClassSubjectKey] || { isUploaded: false };
  const isExcelUploaded = Boolean(currentUpload.isUploaded);

  // Check if any marks exist for the selected month in the selected class
  const classPupilsList = useMemo(() => {
    return (
      pupilsData[selectedClass] ||
      INITIAL_PUPILS[selectedClass] ||
      INITIAL_PUPILS['Standard 6 (Grade 6)'] ||
      []
    );
  }, [pupilsData, selectedClass]);

  const hasMarksForActiveMonth = useMemo(() => {
    return classPupilsList.some((p) => getPupilScoreForMonth(p, activeMonth.id) > 0);
  }, [classPupilsList, activeMonth.id]);

  const isMarksActive = isExcelUploaded || hasMarksForActiveMonth;

  // Live computed list of pupils based specifically on the selected month
  const classPupils = useMemo(() => {
    const computed = classPupilsList.map((pupil) => {
      const monthScore = getPupilScoreForMonth(pupil, activeMonth.id);
      const hasScore = monthScore > 0;
      const grade: StudentMark['grade'] = (hasScore ? calculateGrade(monthScore) : 'F') as StudentMark['grade'];
      const remarks = hasScore ? getRemarksForGrade(grade) : 'Inasubiri Mtihani';

      return {
        ...pupil,
        mark: monthScore,
        grade,
        remarks,
        hasScore,
      };
    });

    // Sort descending by month score if marks are active
    const sorted = isMarksActive ? [...computed].sort((a, b) => b.mark - a.mark) : [...computed];

    const withRank = sorted.map((pupil, idx) => ({
      ...pupil,
      rank: isMarksActive && pupil.hasScore ? idx + 1 : undefined,
    }));

    if (!searchPupil.trim()) return withRank;
    return withRank.filter(
      (p) =>
        p.name.toLowerCase().includes(searchPupil.toLowerCase()) ||
        p.admNo.toLowerCase().includes(searchPupil.toLowerCase())
    );
  }, [classPupilsList, activeMonth.id, isMarksActive, searchPupil]);

  // Statistics for the selected month
  const totalStudents = classPupils.length;
  const pupilsWithScores = classPupils.filter((p) => p.hasScore);
  const gradeACount = isMarksActive
    ? classPupils.filter((p) => p.hasScore && p.grade === 'A').length
    : 0;
  const gradeBCount = isMarksActive
    ? classPupils.filter((p) => p.hasScore && p.grade === 'B').length
    : 0;
  const gradeCCount = isMarksActive
    ? classPupils.filter((p) => p.hasScore && p.grade === 'C').length
    : 0;
  const gradeDCount = isMarksActive
    ? classPupils.filter((p) => p.hasScore && (p.grade === 'D' || p.grade === 'F')).length
    : 0;

  const averageScore =
    isMarksActive && pupilsWithScores.length > 0
      ? (pupilsWithScores.reduce((acc, p) => acc + p.mark, 0) / pupilsWithScores.length).toFixed(1)
      : isMarksActive && totalStudents > 0
      ? (classPupils.reduce((acc, p) => acc + p.mark, 0) / totalStudents).toFixed(1)
      : '—';

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
      `Kigezo cha Excel cha kusajili wanafunzi wa ${selectedClass} kimepakuliwa.`
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
          const registeredList: PupilWithMonthlyMarks[] = [];

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
                monthlyScores: {},
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
              `Wanafunzi wote ${registeredList.length} wamesajiliwa kwenye ${selectedClass} na kuonekana kwenye jedwali la matokeo!`
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

    const generated: PupilWithMonthlyMarks[] = sampleNames.map((item, idx) => ({
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
      monthlyScores: {},
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

  // Download Excel / CSV Template specifically for the selected month
  const handleDownloadTemplate = () => {
    const headers = `Namba_Ya_Usajili,Jina_La_Mwanafunzi,Jinsia,Alama_Mwezi_${activeMonth.name}\n`;
    const rows = classPupilsList
      .map((p) => {
        const curScore = getPupilScoreForMonth(p, activeMonth.id);
        return `${p.admNo},"${p.name}",${p.gender},${curScore > 0 ? curScore : ''}`;
      })
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute(
      'download',
      `Kigezo_Matokeo_${activeMonth.name}_${selectedClass.replace(/\s+/g, '_')}_${selectedSubject.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser(
      'success',
      'Kigezo Kimepakuliwa!',
      `Kigezo cha Excel cha Mwezi wa ${activeMonth.name} (${selectedClass}) kimepakuliwa tayari kwa kujaza alama.`
    );
  };

  // Upload Excel specifically for the selected month (Auto-merges into that month!)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim() !== '');

        if (lines.length > 1) {
          const updatedList = [...classPupilsList];
          let imported = 0;

          // Header can be checked for column 3 (score)
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.replace(/["\r]/g, '').trim());
            if (cols.length >= 2) {
              const admNo = cols[0];
              const scoreVal = parseInt(cols[3] || cols[cols.length - 1] || '75', 10);

              const idx = updatedList.findIndex((p) => p.admNo.toLowerCase() === admNo.toLowerCase());
              if (idx !== -1) {
                const cur = updatedList[idx];
                const validScore = !isNaN(scoreVal) ? Math.max(0, Math.min(100, scoreVal)) : 75;

                updatedList[idx] = {
                  ...cur,
                  monthlyScores: {
                    ...(cur.monthlyScores || {}),
                    [activeMonth.id]: validScore,
                  },
                };
                imported++;
              }
            }
          }

          setPupilsData((prev) => ({ ...prev, [selectedClass]: updatedList }));
          setClassUploads((prev) => ({
            ...prev,
            [currentClassSubjectKey]: {
              isUploaded: true,
              fileName: file.name,
              uploadedAt: new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }),
            },
          }));

          notifyUser(
            'success',
            'Alama Zimehifadhiwa!',
            `Alama za Mwezi wa ${activeMonth.name} kwa wanafunzi ${imported} wa ${selectedClass} zimepakiwa na kuhifadhiwa kikamilifu.`
          );
        }
      } catch (err) {
        console.error('Failed to parse uploaded marks file', err);
      }
    };
    reader.readAsText(file);
  };

  // Instant 1-Click Simulation for the Selected Month
  const handleSimulateMonthScores = () => {
    const updated = classPupilsList.map((p, index) => {
      // Generate realistic score for this specific month
      const offset = activeMonth.monthNumber * 3;
      const score = Math.min(100, Math.max(60, 72 + ((index * 7 + offset) % 26)));

      return {
        ...p,
        monthlyScores: {
          ...(p.monthlyScores || {}),
          [activeMonth.id]: score,
        },
      };
    });

    setPupilsData((prev) => ({ ...prev, [selectedClass]: updated }));
    setClassUploads((prev) => ({
      ...prev,
      [currentClassSubjectKey]: {
        isUploaded: true,
        fileName: `matokeo_${activeMonth.name.toLowerCase()}_${selectedClass.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`,
        uploadedAt: new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }),
      },
    }));

    notifyUser(
      'success',
      'Maksi Zimeingizwa!',
      `Alama za mfano za Mwezi wa ${activeMonth.name} zimeingizwa kwa wanafunzi wote wa ${selectedClass}.`
    );
  };

  // Reset marks for the selected month
  const handleClearMonthScores = () => {
    const cleared = classPupilsList.map((p) => {
      const copyScores = { ...(p.monthlyScores || {}) };
      delete copyScores[activeMonth.id];
      return {
        ...p,
        monthlyScores: copyScores,
      };
    });

    setPupilsData((prev) => ({ ...prev, [selectedClass]: cleared }));

    notifyUser(
      'info',
      'Matokeo Yamewekwa Upya',
      `Alama za Mwezi wa ${activeMonth.name} kwa ${selectedClass} zimefutwa tayari kwa kuanza upya.`
    );
  };

  // Open Single Student Edit
  const handleOpenStudentEdit = (pupil: PupilWithMonthlyMarks) => {
    const curScore = getPupilScoreForMonth(pupil, activeMonth.id);

    setEditingStudent({
      id: pupil.id,
      admNo: pupil.admNo,
      name: pupil.name,
      score: curScore,
      reason: 'Uhakiki wa Karatasi ya Mtihani',
      notes: '',
    });
  };

  // Save Single Student Edit
  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const newScore = Math.max(0, Math.min(100, Number(editingStudent.score) || 0));

    setPupilsData((prev) => {
      const classList = [...(prev[selectedClass] || [])];
      const idx = classList.findIndex((p) => p.id === editingStudent.id);
      if (idx !== -1) {
        classList[idx] = {
          ...classList[idx],
          monthlyScores: {
            ...(classList[idx].monthlyScores || {}),
            [activeMonth.id]: newScore,
          },
        };
      }
      return { ...prev, [selectedClass]: classList };
    });

    setAdjustedStudentIds((prev) => ({
      ...prev,
      [`${editingStudent.id}_${activeMonth.id}`]: editingStudent.reason,
    }));

    notifyUser(
      'success',
      'Alama Zimebadilishwa!',
      `Alama ya Mwezi wa ${activeMonth.name} kwa mwanafunzi ${editingStudent.name} zimerekebishwa kuwa ${newScore}%.`
    );

    setEditingStudent(null);
  };

  // Submit to Academic Master for the Selected Month
  const handleSubmitToAcademicMaster = () => {
    if (!isMarksActive) {
      notifyUser(
        'error',
        'Maksi Hazijapakiwa Bado!',
        `Tafadhali weka kwanza alama za Mwezi wa ${activeMonth.name} kwa wanafunzi wa ${selectedClass} kabla ya kuwasilisha.`
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
        monthId: activeMonth.id,
        monthName: activeMonth.name,
        monthNumber: activeMonth.monthNumber,
        term: activeMonth.term,
        tag: activeMonth.tag,
        submittedAt: timeStr,
        submittedDate: dateStr,
        fileName: `matokeo_${activeMonth.name.toLowerCase()}_${selectedClass.toLowerCase().replace(/[^a-z0-9]/g, '_')}.xlsx`,
        status: 'SUBMITTED',
        pupils: classPupils.map((p) => ({
          admNo: p.admNo,
          name: p.name,
          gender: p.gender,
          finalMark: p.mark,
          grade: p.grade,
          remarks: p.remarks,
        })),
      };

      // Save both by month-specific key and by class-subject key for broadsheet
      submissions[currentMonthSubmissionKey] = record;
      submissions[currentClassSubjectKey] = record;

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_SUBJECT_SUBMISSIONS_KEY, JSON.stringify(submissions));
      }
      setSubjectSubmissions(submissions);

      notifyUser(
        'success',
        'Matokeo Yamewasilishwa kwa Mwalimu wa Taaluma!',
        `Alama za somo la ${selectedSubject} (${selectedClass}) za Mwezi wa ${activeMonth.name} (${activeMonth.term}) zimewasilishwa rasmi kwa Mwalimu wa Taaluma.`
      );
    } catch (err) {
      console.error('Failed to submit subject marks to academic master', err);
    }
  };

  return (
    <TeacherShell
      pageTitle="Kujaza Alama za Somo (Excel Spreadsheet Grid)"
      pageDescription="Matokeo yanapangwa kulingana na Kalenda ya Shule kwa miezi yote 12 ya mwaka. Chagua mwezi wowote kusimamia alama zake na kuwasilisha kwa Mwalimu wa Taaluma."
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
        {/* 0. TEACHER'S ASSIGNED CLASSES & SUBJECT SELECTION BAR */}
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
              const pupilsCount = (pupilsData[cls] || INITIAL_PUPILS[cls] || []).length;
              const hasSub = Boolean(
                subjectSubmissions[`${cls}_${selectedSubject}_${activeMonth.id}`]?.status === 'SUBMITTED' ||
                subjectSubmissions[`${cls}_${selectedSubject}`]?.status === 'SUBMITTED'
              );

              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`p-2.5 rounded-2xl text-left transition-all border flex flex-col justify-between gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-600/30'
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
                      {hasSub && (
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
                          isSelected
                            ? 'bg-emerald-500/30 text-emerald-100 border-emerald-400/40'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        Amilifu
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 1. COMPLETE 12-MONTH TANZANIA SCHOOL ACADEMIC CALENDAR CONTROLLER */}
        {/* ===================================================================== */}
        <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-3">
          {/* Calendar Header with Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="text-xs font-black text-slate-900">
                Kalenda Kamili ya Masomo (Miezi 12 ya Mwaka):
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Tanzania School Calendar 2026
              </span>
            </div>

            {/* Submission Status for Active Month */}
            <div className="flex items-center gap-1.5 shrink-0">
              {isSubmittedToAcademic ? (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center gap-1 text-[11px] font-black">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>✓ Imewasilishwa ({activeMonth.name} Saa {currentMonthSubmission?.submittedAt})</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-1 text-[11px] font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>⏳ Bado Haijawasilishwa ({activeMonth.name})</span>
                </span>
              )}
            </div>
          </div>

          {/* All 12 Months: Side-by-Side Horizontal Selector */}
          <div className="overflow-x-auto pb-1">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 min-w-[700px] lg:min-w-0">
              {TANZANIA_SCHOOL_MONTHS.map((month) => {
                const isSelected = selectedMonthId === month.id;

                return (
                  <button
                    key={month.id}
                    type="button"
                    onClick={() => setSelectedMonthId(month.id)}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col justify-between items-center gap-0.5 ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-950 shadow-sm ring-2 ring-emerald-500/30'
                        : 'bg-emerald-50/40 hover:bg-emerald-100/70 text-slate-800 border-emerald-200/90'
                    }`}
                  >
                    <span
                      className={`text-[9px] font-black uppercase ${
                        isSelected ? 'text-emerald-200' : 'text-emerald-800'
                      }`}
                    >
                      {String(month.monthNumber).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-xs font-black block leading-tight ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {month.shortName}
                    </span>
                    <span
                      className={`text-[8px] font-medium block truncate max-w-full ${
                        isSelected ? 'text-emerald-100' : 'text-slate-500'
                      }`}
                    >
                      {month.monthNumber === 3 || month.monthNumber === 9
                        ? 'Mid-Term'
                        : month.monthNumber === 6
                        ? 'Terminal'
                        : month.monthNumber === 11
                        ? 'Annual'
                        : month.term.replace('Muhula wa ', 'M-')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Month Context & Compact Action Bar */}
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-emerald-950 text-xs">
                  Mwezi Amilifu: <span className="text-emerald-800 underline font-black">{activeMonth.name} ({activeMonth.tag})</span>
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-md bg-white border border-emerald-300 text-emerald-900 font-bold">
                  {activeMonth.term}
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-md bg-white border border-emerald-300 text-emerald-900 font-bold">
                  Wastani wa Mwezi Huu: <strong className="font-black">{isMarksActive ? `${averageScore}%` : '—'}</strong>
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-sans">
                Alama zote unazoweka hapa chini ni maalum kwa ajili ya mwezi mzima wa <strong>{activeMonth.name}</strong>.
              </p>
            </div>

            {/* Compact Tool Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Upload Excel for this Month */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title={`Pakia faili la Excel la alama za mwezi wa ${activeMonth.name}`}
              >
                <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pakia ({activeMonth.shortName})</span>
              </button>

              {/* 1-Click Test Data for this Month */}
              <button
                type="button"
                onClick={handleSimulateMonthScores}
                className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                title={`Weka alama za majaribio za mwezi wa ${activeMonth.name}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Maksi za Mfano</span>
              </button>

              {/* Template Download */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                title={`Pakua kigezo cha Excel cha mwezi wa ${activeMonth.name}`}
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Kigezo</span>
              </button>

              {/* Submit to Academic Master Button */}
              {isSubmittedToAcademic ? (
                <>
                  <button
                    type="button"
                    onClick={handleSubmitToAcademicMaster}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Wasilisha Upya ({activeMonth.shortName})</span>
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
                  <span>Wasilisha kwa Taaluma ({activeMonth.name})</span>
                </button>
              )}

              {/* Reset Month Scores */}
              {isMarksActive && (
                <button
                  type="button"
                  onClick={handleClearMonthScores}
                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                  title={`Futa matokeo ya mwezi wa ${activeMonth.name}`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. SUMMARY STATS CARDS FOR SELECTED MONTH */}
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
              Wastani ({activeMonth.shortName})
            </span>
            <p className="text-xl font-black text-emerald-800 mt-0.5">
              {isMarksActive ? `${averageScore}%` : '—'}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {isMarksActive ? `Mwezi wa ${activeMonth.name}` : 'Inasubiri Maksi'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/95 border border-emerald-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wenye Daraja A ({activeMonth.shortName})
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
              Wenye Daraja B ({activeMonth.shortName})
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
              Daraja C / D / F ({activeMonth.shortName})
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
              Mwezi Amilifu: <strong className="text-emerald-900">{activeMonth.name}</strong>
            </span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. EXCEL SPREADSHEET TABLE: 12-MONTH PERSPECTIVE */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 border-r border-emerald-700 text-center w-10">#</th>
                  <th className="py-2.5 px-3 border-r border-emerald-700 min-w-[120px]">Namba ya Usajili</th>
                  <th className="py-2.5 px-3 border-r border-emerald-700 min-w-[180px]">Jina Kamili la Mwanafunzi</th>
                  <th className="py-2.5 px-2 border-r border-emerald-700 text-center w-12">Jinsia</th>

                  {/* 12 Months Column Headers */}
                  {TANZANIA_SCHOOL_MONTHS.map((m) => {
                    const isColActive = m.id === activeMonth.id;
                    return (
                      <th
                        key={m.id}
                        onClick={() => setSelectedMonthId(m.id)}
                        className={`py-2 px-1.5 border-r border-emerald-700 text-center min-w-[55px] cursor-pointer transition-colors ${
                          isColActive
                            ? 'bg-emerald-950 font-black ring-1 ring-emerald-400'
                            : 'bg-emerald-900/60 hover:bg-emerald-900'
                        }`}
                        title={`Bofya kutazama na kusimamia alama za mwezi wa ${m.name}`}
                      >
                        <div className="leading-tight">
                          <span className="block text-[8px] text-emerald-300 font-mono">
                            {String(m.monthNumber).padStart(2, '0')}
                          </span>
                          <span className={isColActive ? 'text-amber-300 font-black' : ''}>
                            {m.shortName}
                          </span>
                        </div>
                      </th>
                    );
                  })}

                  <th className="py-2.5 px-2 border-r border-emerald-700 text-center bg-amber-900/80 min-w-[85px]">
                    <div className="leading-tight">
                      <span>Alama (%)</span>
                      <span className="block text-[8px] font-mono text-amber-200 uppercase font-black">
                        {activeMonth.shortName}
                      </span>
                    </div>
                  </th>
                  <th className="py-2.5 px-2 border-r border-emerald-700 text-center w-14">Daraja</th>
                  <th className="py-2.5 px-2 border-r border-emerald-700 text-center w-12">Nafasi</th>
                  <th className="py-2.5 px-3 border-r border-emerald-700 min-w-[140px]">Maoni</th>
                  <th className="py-2.5 px-3 text-center min-w-[90px] bg-emerald-900/80">Marekebisho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 text-slate-800">
                {classPupils.map((pupil, idx) => {
                  const isAdjusted = Boolean(adjustedStudentIds[`${pupil.id}_${activeMonth.id}`]);

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
                              title={`Imerekebishwa kwa mikono: ${adjustedStudentIds[`${pupil.id}_${activeMonth.id}`]}`}
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

                      {/* 12 Months Cells */}
                      {TANZANIA_SCHOOL_MONTHS.map((m) => {
                        const mScore = getPupilScoreForMonth(pupil, m.id);
                        const isColActive = m.id === activeMonth.id;

                        return (
                          <td
                            key={m.id}
                            className={`py-2 px-1 text-center font-mono text-xs border-r border-slate-100 ${
                              isColActive
                                ? 'bg-emerald-50 font-black text-emerald-950 ring-1 ring-emerald-300'
                                : 'text-slate-600'
                            }`}
                          >
                            {mScore > 0 ? (
                              <span>{mScore}</span>
                            ) : (
                              <span className="text-slate-300 font-normal">—</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Final Mark (%) for Active Month */}
                      <td className="py-2 px-2 text-center font-mono font-black text-slate-900 bg-amber-50/50 border-r border-slate-100 text-sm">
                        {pupil.hasScore ? (
                          <span className="font-bold text-amber-950">{pupil.mark}%</span>
                        ) : (
                          <span className="text-slate-300 font-normal text-xs">—</span>
                        )}
                      </td>

                      {/* Grade Badge */}
                      <td className="py-2 px-2 text-center border-r border-slate-100">
                        {pupil.hasScore ? (
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
                        {pupil.hasScore && pupil.rank ? `#${pupil.rank}` : '—'}
                      </td>

                      {/* Remarks */}
                      <td className="py-2 px-3 text-slate-600 text-[11px] font-medium border-r border-slate-100 whitespace-nowrap">
                        {pupil.hasScore ? (
                          pupil.remarks || getRemarksForGrade(pupil.grade)
                        ) : (
                          <span className="text-slate-400 italic">Inasubiri mtihani</span>
                        )}
                      </td>

                      {/* Action Button: Edit Single Student for this Month */}
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
        {/* SINGLE STUDENT EDIT MODAL FOR SELECTED MONTH */}
        {/* ===================================================================== */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-emerald-200 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Rekebisha Alama: {activeMonth.name}
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alama ya Mwezi wa {activeMonth.name} (0 - 100):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingStudent.score}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, score: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 text-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Reason for Adjustment */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Sababu ya Marekebisho:
                  </label>
                  <select
                    value={editingStudent.reason}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, reason: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-600 text-xs"
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
                    Hifadhi Alama ya {activeMonth.name}
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
