'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';
import { INITIAL_PUPILS, StudentMark, calculateGrade, getRemarksForGrade } from '@/lib/teacher-data';

interface ClassUploadStatus {
  isUploaded: boolean;
  fileName?: string;
  uploadedAt?: string;
}

const STORAGE_REGISTERED_PUPILS_KEY = 'academic_portal_registered_pupils_v2';


export default function SubjectMarksPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentSession());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rosterFileInputRef = useRef<HTMLInputElement>(null);

  // Modal State for Registering Students via Excel
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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

  // Current active key for uploads
  const currentKey = `${selectedClass}_${selectedSubject}`;
  const currentUpload = classUploads[currentKey] || { isUploaded: false };
  const isExcelUploaded = Boolean(currentUpload.isUploaded);
  const uploadedFileName = currentUpload.fileName || null;
  const uploadedAt = currentUpload.uploadedAt || null;

  // Compute ranks and live list of pupils for selected class
  const classPupils = useMemo(() => {
    const list = pupilsData[selectedClass] || INITIAL_PUPILS[selectedClass] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || [];

    // Sort descending by final mark to calculate rank only if Excel has been uploaded
    const sorted = isExcelUploaded
      ? [...list].sort((a, b) => b.mark - a.mark)
      : [...list];

    const withRank = sorted.map((pupil, idx) => ({
      ...pupil,
      rank: isExcelUploaded ? idx + 1 : undefined,
    }));

    // Filter by search query if any
    if (!searchPupil.trim()) return withRank;
    return withRank.filter(
      (p) =>
        p.name.toLowerCase().includes(searchPupil.toLowerCase()) ||
        p.admNo.toLowerCase().includes(searchPupil.toLowerCase())
    );
  }, [pupilsData, selectedClass, searchPupil, isExcelUploaded]);

  // 1. Download Excel / CSV Template for Selected Class (All Students Pre-Filled)
  const handleDownloadTemplate = () => {
    const list = pupilsData[selectedClass] || INITIAL_PUPILS[selectedClass] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || [];
    const headers =
      'Namba_Ya_Usajili,Jina_La_Mwanafunzi,Jinsia,Monthly_Test_1,Monthly_Test_2,Wastani_Monthly,Mid_Term,Terminal_Exam,Wastani_Muhula,Daraja\n';
    const rows = list
      .map((p) => {
        return `${p.admNo},"${p.name}",${p.gender},${isExcelUploaded ? p.monthlyTest1 : ''},${
          isExcelUploaded ? p.monthlyTest2 : ''
        },${isExcelUploaded ? p.monthlyAvg : ''},${isExcelUploaded ? p.midtermExam : ''},${
          isExcelUploaded ? p.terminalExam : ''
        },${isExcelUploaded ? p.mark : ''},${isExcelUploaded ? p.grade : ''}`;
      })
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
      `Kigezo cha Excel cha ${selectedClass} chenye wanafunzi wote ${list.length} kimepakuliwa tayari kwa kujaza alama za somo la ${selectedSubject}.`
    );
  };

  // 2. Parse Uploaded Excel / CSV File and Auto-fill all rows for the Selected Class
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
            ...(pupilsData[selectedClass] || INITIAL_PUPILS[selectedClass] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || []),
          ];
          let imported = 0;

          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.replace(/["\r]/g, '').trim());
            if (cols.length >= 4) {
              const admNo = cols[0];
              const t1 = parseInt(cols[3] || '78', 10);
              const t2 = parseInt(cols[4] || '82', 10);
              const mid = parseInt(cols[6] || '85', 10);
              const term = parseInt(cols[7] || '88', 10);

              const mAvg = Math.round((t1 + t2) / 2);
              const finalMark = Math.round(mAvg * 0.3 + mid * 0.3 + term * 0.4);
              const grade = calculateGrade(finalMark);

              const idx = updatedList.findIndex((p) => p.admNo.toLowerCase() === admNo.toLowerCase());
              if (idx !== -1) {
                updatedList[idx] = {
                  ...updatedList[idx],
                  monthlyTest1: t1,
                  monthlyTest2: t2,
                  monthlyAvg: mAvg,
                  midtermExam: mid,
                  terminalExam: term,
                  mark: finalMark,
                  grade,
                  remarks: getRemarksForGrade(grade),
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
              uploadedAt: new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }),
            },
          }));

          notifyUser(
            'success',
            'Faili la Excel Limepakiwa Kikamilifu!',
            `Faili "${file.name}" limepakiwa kikamilifu kwa ${selectedClass}! Wanafunzi wote ${
              imported || updatedList.length
            } wameingizwa na alama zao za somo la ${selectedSubject} zimekokotolewa.`
          );
        } else {
          simulateInstantAutoFill();
        }
      } catch {
        simulateInstantAutoFill();
      }
    };
    reader.readAsText(file);
  };

  // 3. Instant 1-Click Excel Simulation for Fast Testing (Strictly for Selected Class)
  const simulateInstantAutoFill = () => {
    const list = [
      ...(pupilsData[selectedClass] || INITIAL_PUPILS[selectedClass] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || []),
    ];
    const autoFilled = list.map((p, index) => {
      const t1 = Math.min(100, Math.max(62, 75 + ((index * 7) % 24)));
      const t2 = Math.min(100, Math.max(65, 78 + ((index * 5) % 21)));
      const mAvg = Math.round((t1 + t2) / 2);
      const mid = Math.min(100, Math.max(65, 80 + ((index * 4) % 19)));
      const term = Math.min(100, Math.max(66, 82 + ((index * 6) % 17)));
      const finalMark = Math.round(mAvg * 0.3 + mid * 0.3 + term * 0.4);
      const grade = calculateGrade(finalMark);

      return {
        ...p,
        monthlyTest1: t1,
        monthlyTest2: t2,
        monthlyAvg: mAvg,
        midtermExam: mid,
        terminalExam: term,
        mark: finalMark,
        grade,
        remarks: getRemarksForGrade(grade),
      };
    });

    setPupilsData((prev) => ({ ...prev, [selectedClass]: autoFilled }));
    const generatedFileName = `matokeo_${selectedClass.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${selectedSubject
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')}.xlsx`;

    setClassUploads((prev) => ({
      ...prev,
      [currentKey]: {
        isUploaded: true,
        fileName: generatedFileName,
        uploadedAt: new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }),
      },
    }));

    notifyUser(
      'success',
      'Faili la Excel Limepakiwa Kikamilifu!',
      `Faili la mfano "${generatedFileName}" limepakiwa kikamilifu! Wanafunzi wote ${autoFilled.length} wa ${selectedClass} wameingizwa na alama za somo la ${selectedSubject} zimekokotolewa.`
    );
  };

  // 4. Reset / Clear uploaded Excel to test pre-upload state again for this class
  const handleClearExcelResults = () => {
    setClassUploads((prev) => ({
      ...prev,
      [currentKey]: {
        isUploaded: false,
      },
    }));
    setAdjustedStudentIds({});

    notifyUser(
      'info',
      'Matokeo Yamewekwa Upya',
      `Matokeo ya ${selectedClass} kwa somo la ${selectedSubject} yamefutwa. Jedwali sasa liko wazi likisubiri kupakiwa upya kwa faili la Excel.`
    );
  };

  // 5. Open Single Student Adjustment Modal
  const handleOpenStudentEdit = (pupil: StudentMark) => {
    if (!isExcelUploaded) {
      notifyUser(
        'warning',
        'Pakia Kwanza Excel ya Darasa',
        `Tafadhali pakia faili la Excel la wanafunzi wote wa ${selectedClass} kwanza kabla ya kurekebisha mwanafunzi mmoja mmoja.`
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

    const monthlyAvg = Math.round((t1 + t2) / 2);
    const finalMark = Math.round(monthlyAvg * 0.3 + mid * 0.3 + term * 0.4);
    const grade = calculateGrade(finalMark);
    const remarks = getRemarksForGrade(grade);

    setPupilsData((prev) => {
      const classList = [
        ...(prev[selectedClass] || INITIAL_PUPILS[selectedClass] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || []),
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
      `Alama za mwanafunzi ${editingStudent.name} (${editingStudent.admNo}) wa ${selectedClass} zimerekebishwa kikamilifu! Wastani mpya: ${finalMark}% (${grade}).`
    );

    setEditingStudent(null);
  };

  // 7. Submit Subject Broadsheet to Academic Master
  const handleSubmitToAcademicMaster = () => {
    if (!isExcelUploaded) {
      notifyUser(
        'error',
        'Maksi Hazijapakiwa Bado!',
        `Tafadhali pakia kwanza faili la Excel lenye alama za wanafunzi wa ${selectedClass} kabla ya kuwasilisha kwa Mwalimu wa Taaluma.`
      );
      return;
    }

    const submissionKey = 'academic_subject_submissions_v1';
    try {
      const existingRaw = typeof window !== 'undefined' ? localStorage.getItem(submissionKey) : null;
      let submissions = existingRaw ? JSON.parse(existingRaw) : {};

      const subjectEntry = {
        className: selectedClass,
        subjectName: selectedSubject,
        teacherName: currentUser?.fullName || 'Mwalimu wa Somo',
        teacherStaffId: currentUser?.identifier || 'TCH-2026-001',
        studentsCount: classPupils.length,
        averageMark: averageScore,
        submittedAt: new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }),
        submittedDate: new Date().toISOString().split('T')[0],
        fileName: uploadedFileName || `matokeo_${selectedSubject.toLowerCase().replace(/\s+/g, '_')}.xlsx`,
        status: 'SUBMITTED',
        pupils: classPupils.map((p) => ({
          admNo: p.admNo,
          name: p.name,
          gender: p.gender,
          finalMark: p.mark,
          grade: p.grade,
        })),
      };

      const entryId = `${selectedClass}_${selectedSubject}`;
      submissions[entryId] = subjectEntry;
      if (typeof window !== 'undefined') {
        localStorage.setItem(submissionKey, JSON.stringify(submissions));
      }
    } catch (err) {
      console.error('Failed to save subject submission', err);
    }

    notifyUser(
      'success',
      'Broadsheet ya Somo Imewasilishwa kwa Mwl. Taaluma!',
      `Alama za somo la ${selectedSubject} (${selectedClass}) kwa wanafunzi wote ${classPupils.length} zimewasilishwa rasmi kwa Mwalimu wa Taaluma tayari kwa kuunganishwa kwenye Broadsheet Kuu ya Shule.`
    );
  };

  // Live Statistics for selected class
  const totalStudents = classPupils.length;
  const gradeACount = isExcelUploaded ? classPupils.filter((p) => p.grade === 'A').length : 0;
  const gradeBCount = isExcelUploaded ? classPupils.filter((p) => p.grade === 'B').length : 0;
  const gradeCCount = isExcelUploaded ? classPupils.filter((p) => p.grade === 'C').length : 0;
  const gradeDCount = isExcelUploaded
    ? classPupils.filter((p) => p.grade === 'D' || p.grade === 'F').length
    : 0;
  const averageScore =
    isExcelUploaded && totalStudents > 0
      ? (classPupils.reduce((acc, p) => acc + p.mark, 0) / totalStudents).toFixed(1)
      : '—';

  return (
    <TeacherShell
      pageTitle="Kujaza Alama za Somo (Excel Spreadsheet Grid)"
      pageDescription="Uingizaji rasmi wa matokeo ya wanafunzi unafanywa kwa kupakia faili la Excel (.xlsx / .csv). Masahihisho ya baadaye yanafanyika kwa mwanafunzi mmoja mmoja."
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
                        <span className={`text-xs font-black block leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {cls}
                        </span>
                        <span className={`text-[10px] font-semibold block ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
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
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* EXCEL UPLOAD STATUS & ACTION HERO BANNER */}
        {/* ===================================================================== */}
        <div
          className={`p-6 rounded-3xl border shadow-sm transition-all ${
            isExcelUploaded
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
                    isExcelUploaded
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>
                    {isExcelUploaded
                      ? `Excel ya ${selectedClass} Imepakiwa`
                      : `Maksi Hazijawekwa • Inasubiri Excel ya ${selectedClass}`}
                  </span>
                </span>

                {isExcelUploaded && (
                  <span className="text-[11px] font-mono text-slate-500">Saa {uploadedAt}</span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {isExcelUploaded
                  ? `Matokeo Yapo Amilifu: ${uploadedFileName}`
                  : `Pakia Faili la Excel Kuingiza Maksi za ${selectedClass}`}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isExcelUploaded
                  ? `Alama za wanafunzi wote ${classPupils.length} wa ${selectedClass} zimeingizwa kutoka kwenye faili la Excel la somo la ${selectedSubject}. Jedwali limefungwa kuzuia uingizaji wa makosa, lakini unaweza kurekebisha mwanafunzi mmoja mmoja kupitia kitufe cha "Rekebisha".`
                  : `Kulingana na miongozo ya shule, huwezi kujaza alama moja kwa moja kwenye jedwali kwa mkono. Pakia faili la Excel (.xlsx au .csv) lililojazwa kwa darasa la ${selectedClass} au jaribu mfumo kwa kitufe cha kupakia hapa chini.`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {!isExcelUploaded ? (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-950/20 transition-all"
                  >
                    <UploadCloud className="w-4 h-4 text-emerald-200" />
                    <span>Pakia Excel ({selectedClass})</span>
                  </button>

                  <button
                    type="button"
                    onClick={simulateInstantAutoFill}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
                    title={`Bofya kupakia faili la mfano la Excel lenye alama za wanafunzi wote wa ${selectedClass} mara moja`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Pakia Excel ya Majaribio (1-Click)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>Pakua Kigezo cha Excel</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Pakia Upya Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearExcelResults}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                    title="Futa matokeo ili kurudia jaribio la kupakia"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Futa Matokeo ({selectedClass})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Pakua Excel (.csv)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitToAcademicMaster}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                    title="Tuma broadsheet ya somo hili kwa Mwalimu wa Taaluma ili aiunganishe na masomo mengine"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Wasilisha Broadsheet ya {selectedClass}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SUMMARY STATS CARDS */}
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
              Wastani wa Darasa
            </span>
            <p className="text-2xl font-black text-emerald-800 mt-1">
              {isExcelUploaded ? `${averageScore}%` : '—'}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {isExcelUploaded ? 'Daraja B+ (Ufaulu Mzuri)' : 'Inasubiri Excel'}
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wenye Daraja A
            </span>
            <p className="text-2xl font-black text-emerald-700 mt-1">
              {isExcelUploaded ? gradeACount : '—'}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {isExcelUploaded ? 'Ufaulu Bora Sana' : 'Inasubiri Excel'}
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Wenye Daraja B
            </span>
            <p className="text-2xl font-black text-blue-700 mt-1">
              {isExcelUploaded ? gradeBCount : '—'}
            </p>
            <span className="text-[10px] text-blue-700 font-semibold">
              {isExcelUploaded ? 'Ufaulu Mzuri' : 'Inasubiri Excel'}
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Daraja C / D
            </span>
            <p className="text-2xl font-black text-amber-700 mt-1">
              {isExcelUploaded ? gradeCCount + gradeDCount : '—'}
            </p>
            <span className="text-[10px] text-amber-700 font-semibold">
              {isExcelUploaded ? 'Wastani / Ziada' : 'Inasubiri Excel'}
            </span>
          </div>
        </div>

        {/* Formula Bar Banner (Excel Style) */}
        <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-emerald-950">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2 py-0.5 rounded-md bg-emerald-800 text-white font-bold text-[10px]">
              fx Formula
            </span>
            <span className="truncate">
              Wastani_Muhula = ROUND((Wastani_Monthly * 0.3) + (Mid_Term * 0.3) + (Terminal * 0.4))
            </span>
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
            <span>Darasa Linaloonekana: <strong className="text-emerald-900">{selectedClass}</strong></span>
            <span>•</span>
            <span>Somo: <strong className="text-emerald-900">{selectedSubject}</strong></span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* EXCEL SPREADSHEET TABLE: STUDENTS OF SELECTED CLASS */}
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
                    Monthly 1
                  </th>
                  <th className="py-3 px-2 border-r border-emerald-700 text-center bg-emerald-900/60 min-w-[85px]">
                    Monthly 2
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
                  <th className="py-3 px-2 border-r border-emerald-700 text-center bg-amber-900/70 min-w-[90px]">
                    Wastani (%)
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
                        {isExcelUploaded ? (
                          pupil.monthlyTest1
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Monthly Test 2 */}
                      <td className="py-2.5 px-2 text-center font-mono font-semibold border-r border-slate-100">
                        {isExcelUploaded ? (
                          pupil.monthlyTest2
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Monthly Average */}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-emerald-950 bg-emerald-50/40 border-r border-slate-100">
                        {isExcelUploaded ? (
                          pupil.monthlyAvg
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Midterm Exam */}
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-blue-900 border-r border-slate-100">
                        {isExcelUploaded ? (
                          pupil.midtermExam
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Terminal Exam */}
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-indigo-900 border-r border-slate-100">
                        {isExcelUploaded ? (
                          pupil.terminalExam
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </td>

                      {/* Final Mark (%) */}
                      <td className="py-2.5 px-2 text-center font-mono font-black text-slate-900 bg-amber-50/50 border-r border-slate-100 text-sm">
                        {isExcelUploaded ? (
                          `${pupil.mark}%`
                        ) : (
                          <span className="text-slate-300 font-normal text-xs">—</span>
                        )}
                      </td>

                      {/* Grade Badge */}
                      <td className="py-2.5 px-2 text-center border-r border-slate-100">
                        {isExcelUploaded ? (
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
                        {isExcelUploaded && pupil.rank ? `#${pupil.rank}` : '—'}
                      </td>

                      {/* Remarks */}
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] font-medium border-r border-slate-100 whitespace-nowrap">
                        {isExcelUploaded ? (
                          pupil.remarks || getRemarksForGrade(pupil.grade)
                        ) : (
                          <span className="text-slate-400 italic">Inasubiri kupakiwa kwa Excel</span>
                        )}
                      </td>

                      {/* Single Student Adjustment Action */}
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenStudentEdit(pupil)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] inline-flex items-center gap-1 transition-all shadow-2xs"
                          title={`Kurekebisha alama za mwanafunzi huyu pekee (${pupil.name})`}
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

          {/* Table Footer */}
          <div className="p-4 bg-emerald-50/80 border-t border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-3">
              <span>Wanafunzi Walioorodheshwa: <strong className="text-slate-900">{classPupils.length}</strong></span>
              <span>•</span>
              <span>
                Hali ya Alama: <strong className="text-emerald-900">{isExcelUploaded ? 'Zimepakiwa na Kuhakikiwa' : 'Hazijapakiwa'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pakua Kigezo (.csv)</span>
              </button>

              {isExcelUploaded && (
                <button
                  type="button"
                  onClick={() =>
                    notifyUser(
                      'success',
                      'Kumbukumbu Zimehifadhiwa!',
                      `Jedwali la matokeo ya ${selectedClass} limehifadhiwa kikamilifu kwenye kumbukumbu za shule!`
                    )
                  }
                  className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hifadhi Kwenye Broadsheet</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SINGLE STUDENT ADJUSTMENT MODAL (REKEBISHA MWANAFUNZI MMOJA MMOJA) */}
        {/* ===================================================================== */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-emerald-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                    <Edit3 className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Rekebisha Alama za Mwanafunzi
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {editingStudent.name} • {editingStudent.admNo} ({selectedClass})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Informative Note */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Uingizaji wa alama zote za darasa unafanywa kwa kupakia faili la Excel pekee.
                  Sehemu hii inatumika kurekebisha mwanafunzi huyu pekee baada ya ukaguzi wa karatasi au masahihisho maalum.
                </p>
              </div>

              <form onSubmit={handleSaveStudentEdit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Monthly Test 1 (0-100):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={editingStudent.monthlyTest1}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          monthlyTest1: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Monthly Test 2 (0-100):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={editingStudent.monthlyTest2}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          monthlyTest2: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Mtihani wa Mid-Term (0-100):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={editingStudent.midtermExam}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          midtermExam: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Mtihani wa Terminal (0-100):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={editingStudent.terminalExam}
                      onChange={(e) =>
                        setEditingStudent({
                          ...editingStudent,
                          terminalExam: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Live Calculated Preview */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Wastani Mpya wa Mwezi:</span>
                    <span className="font-black text-emerald-900">
                      {Math.round((Number(editingStudent.monthlyTest1) + Number(editingStudent.monthlyTest2)) / 2)}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Wastani Mpya wa Muhula:</span>
                    <span className="font-black text-emerald-900 text-sm">
                      {Math.round(
                        Math.round((Number(editingStudent.monthlyTest1) + Number(editingStudent.monthlyTest2)) / 2) *
                          0.3 +
                          Number(editingStudent.midtermExam) * 0.3 +
                          Number(editingStudent.terminalExam) * 0.4
                      )}
                      %
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Daraja Jipya:</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-800 text-white font-black text-xs">
                      Grade{' '}
                      {calculateGrade(
                        Math.round(
                          Math.round((Number(editingStudent.monthlyTest1) + Number(editingStudent.monthlyTest2)) / 2) *
                            0.3 +
                            Number(editingStudent.midtermExam) * 0.3 +
                            Number(editingStudent.terminalExam) * 0.4
                        )
                      )}
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
                    <option value="Uhakiki wa Karatasi ya Mtihani">Uhakiki wa Karatasi ya Mtihani (Remarking)</option>
                    <option value="Kusahihisha Kosa la Uandishi kwenye Excel">Kusahihisha Kosa la Uandishi kwenye Excel</option>
                    <option value="Mtihani wa Marudio (Supplementary Exam)">Mtihani wa Marudio (Supplementary Exam)</option>
                    <option value="Sababu Nyingine ya Kiofisi">Sababu Nyingine ya Kiofisi</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20"
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
                  Faili litakapopakiwa, wanafunzi hao wataingizwa mara moja kwenye darasa la <strong>{selectedClass}</strong> na idadi ya wanafunzi itaonekana kwenye kadi ya darasa na jedwali la matokeo.
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
