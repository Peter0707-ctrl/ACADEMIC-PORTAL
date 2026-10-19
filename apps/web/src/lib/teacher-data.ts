// =============================================================================
// TEACHER & ACADEMIC DATA BLUEPRINT (SHARED ACROSS ALL TEACHER SUB-PAGES)
// =============================================================================

export interface StudentMark {
  id: string;
  admNo: string;
  name: string;
  gender: 'M' | 'F';
  monthlyTest1: number; // Mtihani wa Kwanza wa Mwezi (0 - 100)
  monthlyTest2: number; // Mtihani wa Pili wa Mwezi (0 - 100)
  monthlyAvg: number;   // Wastani wa Majaribio ya Mwezi
  midtermExam: number;  // Mtihani wa Nusu Muhula (Mid-Term)
  terminalExam: number; // Mtihani wa Muhula (Terminal / Final)
  mark: number;         // Wastani Mkuu wa Muhula (0 - 100)
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  rank?: number;
  remarks?: string;
  attendance: 'PRESENT' | 'ABSENT' | 'PERMISSION';
}

export interface SyllabusItem {
  id: string;
  grade: string;
  subject: string;
  teacher: string;
  completion: number;
  lessonPlansSubmitted: number;
  lessonPlansTotal: number;
  status: 'ON_TRACK' | 'BEHIND' | 'AHEAD';
}

export interface BroadsheetRow {
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
  division: string;
  rank: number;
}

export interface DisciplineIncident {
  id: string;
  date: string;
  pupilName: string;
  class: string;
  issue: string;
  actionTaken: string;
  parentContacted: boolean;
  status: 'PENDING' | 'RESOLVED';
}

export function calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 81) return 'A';
  if (score >= 65) return 'B';
  if (score >= 45) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

export function getRemarksForGrade(grade: 'A' | 'B' | 'C' | 'D' | 'F'): string {
  switch (grade) {
    case 'A': return 'Ufaulu Bora Sana';
    case 'B': return 'Ufaulu Mzuri';
    case 'C': return 'Wastani wa Kuridhisha';
    case 'D': return 'Anahitaji Masomo ya Ziada';
    case 'F': return 'Uangalizi Maalum';
  }
}

// Helper to construct a student with calculated averages
export function createPupil(
  id: string,
  admNo: string,
  name: string,
  gender: 'M' | 'F',
  test1: number,
  test2: number,
  midterm: number,
  terminal: number,
  attendance: 'PRESENT' | 'ABSENT' | 'PERMISSION' = 'PRESENT'
): StudentMark {
  const mAvg = Math.round((test1 + test2) / 2);
  // Composite score: 30% Monthly Avg + 30% Midterm + 40% Terminal
  const finalMark = Math.round(mAvg * 0.3 + midterm * 0.3 + terminal * 0.4);
  const grade = calculateGrade(finalMark);
  return {
    id,
    admNo,
    name,
    gender,
    monthlyTest1: test1,
    monthlyTest2: test2,
    monthlyAvg: mAvg,
    midtermExam: midterm,
    terminalExam: terminal,
    mark: finalMark,
    grade,
    remarks: getRemarksForGrade(grade),
    attendance,
  };
}

// Empty initial rosters: real pupil data will be loaded from DB / uploaded files
export const INITIAL_PUPILS: Record<string, StudentMark[]> = {
  'Standard 7 (Grade 7)': [],
  'Standard 6 (Grade 6)': [],
  'Standard 5 (Grade 5)': [],
  'Standard 4 (Grade 4)': [],
  'Standard 3 (Grade 3)': [],
  'Standard 2 (Grade 2)': [],
  'Standard 1 (Grade 1)': [],
  'Nursery (Awali)': [],
};

export const SYLLABUS_OVERVIEW: SyllabusItem[] = [];

export const INITIAL_BROADSHEET: BroadsheetRow[] = [];

export const INITIAL_INCIDENTS: DisciplineIncident[] = [];

// =============================================================================
// CENTRAL STUDENT ENROLLMENT & ADMISSION REGISTRY (MOEST & TAMISEMI)
// Shared across: Academic Master, Teachers (Classrooms), and Secretary (School Record)
// =============================================================================

export interface EnrolledStudent extends StudentMark {
  assignedClass: string;
  stream?: string;
  admissionType: 'NEW_INTAKE' | 'TRANSFER';
  birthDate?: string;
  ritaNumber?: string;
  parentName: string;
  parentRelationship: string;
  parentPhone: string;
  residence: string;
  previousSchool?: string;
  transferLetterRef?: string;
  specialNeeds?: string;
  enrolledAt: string;
  enrolledBy: string;
}

export const CENTRAL_REGISTRY_KEY = 'academic_portal_registered_pupils_v2';
export const ENROLLED_RECORDS_KEY = 'school_enrolled_records_archive_2026_v1';

export function getStoredPupilsRegistry(): Record<string, StudentMark[]> {
  if (typeof window === 'undefined') return INITIAL_PUPILS;
  try {
    const raw = localStorage.getItem(CENTRAL_REGISTRY_KEY);
    if (!raw) {
      localStorage.setItem(CENTRAL_REGISTRY_KEY, JSON.stringify(INITIAL_PUPILS));
      return INITIAL_PUPILS;
    }
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PUPILS, ...parsed };
  } catch {
    return INITIAL_PUPILS;
  }
}

export function getPupilsForClass(className: string): StudentMark[] {
  const registry = getStoredPupilsRegistry();
  return registry[className] || INITIAL_PUPILS[className] || [];
}

export function savePupilsRegistry(registry: Record<string, StudentMark[]>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CENTRAL_REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {
    console.error('Error saving pupils registry', e);
  }
}

export function getAllEnrolledRecords(): EnrolledStudent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ENROLLED_RECORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function enrollNewPupil(
  data: {
    firstName: string;
    middleName?: string;
    surname: string;
    gender: 'M' | 'F';
    assignedClass: string;
    stream?: string;
    admissionType: 'NEW_INTAKE' | 'TRANSFER';
    birthDate?: string;
    ritaNumber?: string;
    parentName: string;
    parentRelationship: string;
    parentPhone: string;
    residence: string;
    previousSchool?: string;
    transferLetterRef?: string;
    specialNeeds?: string;
    enrolledBy: string;
  }
): EnrolledStudent {
  const registry = getStoredPupilsRegistry();
  const classList = registry[data.assignedClass] || INITIAL_PUPILS[data.assignedClass] || [];

  const fullName = [data.firstName, data.middleName, data.surname].filter(Boolean).join(' ');
  const classShort = data.assignedClass.includes('7')
    ? '07'
    : data.assignedClass.includes('6')
    ? '06'
    : data.assignedClass.includes('5')
    ? '05'
    : data.assignedClass.includes('4')
    ? '04'
    : data.assignedClass.includes('3')
    ? '03'
    : data.assignedClass.includes('2')
    ? '02'
    : data.assignedClass.includes('1')
    ? '01'
    : '00';

  const nextSeq = classList.length + 1;
  const seqPadded = nextSeq < 10 ? `0${nextSeq}` : `${nextSeq}`;
  const admNo = `PUP-2026-${classShort}${seqPadded}`;
  const id = `pup-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const newMark: StudentMark = {
    id,
    admNo,
    name: fullName,
    gender: data.gender,
    monthlyTest1: 0,
    monthlyTest2: 0,
    monthlyAvg: 0,
    midtermExam: 0,
    terminalExam: 0,
    mark: 0,
    grade: 'C',
    remarks: 'Mwanafunzi Mpya — Anaanza Muhula',
    attendance: 'PRESENT',
  };

  const updatedClassList = [...classList, newMark];
  const updatedRegistry = {
    ...registry,
    [data.assignedClass]: updatedClassList,
  };
  savePupilsRegistry(updatedRegistry);

  const fullRecord: EnrolledStudent = {
    ...newMark,
    assignedClass: data.assignedClass,
    stream: data.stream || 'Stream A',
    admissionType: data.admissionType,
    birthDate: data.birthDate || '',
    ritaNumber: data.ritaNumber || '',
    parentName: data.parentName,
    parentRelationship: data.parentRelationship,
    parentPhone: data.parentPhone,
    residence: data.residence,
    previousSchool: data.previousSchool || '',
    transferLetterRef: data.transferLetterRef || '',
    specialNeeds: data.specialNeeds || '',
    enrolledAt: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    enrolledBy: data.enrolledBy,
  };

  if (typeof window !== 'undefined') {
    try {
      const records = getAllEnrolledRecords();
      records.unshift(fullRecord);
      localStorage.setItem(ENROLLED_RECORDS_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Error saving enrolled record', e);
    }
  }

  return fullRecord;
}

