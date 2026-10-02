// =============================================================================
// TEACHER & ACADEMIC DATA BLUEPRINT (SHARED ACROSS ALL TEACHER SUB-PAGES)
// =============================================================================

export interface StudentMark {
  id: string;
  admNo: string;
  name: string;
  gender: 'M' | 'F';
  mark: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
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

export const INITIAL_PUPILS: Record<string, StudentMark[]> = {
  'Standard 6 (Grade 6)': [
    { id: 'p13', admNo: 'PUP-2026-061', name: 'Rashid Hamisi', gender: 'M', mark: 85, grade: 'A', attendance: 'PRESENT' },
    { id: 'p14', admNo: 'PUP-2026-062', name: 'Amina Salum', gender: 'F', mark: 89, grade: 'A', attendance: 'PRESENT' },
    { id: 'p15', admNo: 'PUP-2026-063', name: 'Frank Leonard', gender: 'M', mark: 76, grade: 'B', attendance: 'PRESENT' },
    { id: 'p16', admNo: 'PUP-2026-064', name: 'Grace Mlay', gender: 'F', mark: 92, grade: 'A', attendance: 'PRESENT' },
  ],
  'Standard 7 (Grade 7)': [
    { id: 'p10', admNo: 'PSLE-2026-0428', name: 'Kelvin Shirima (Candidate)', gender: 'M', mark: 96, grade: 'A', attendance: 'PRESENT' },
    { id: 'p11', admNo: 'PSLE-2026-0429', name: 'Neema Massawe (Candidate)', gender: 'F', mark: 91, grade: 'A', attendance: 'PRESENT' },
    { id: 'p12', admNo: 'PSLE-2026-0430', name: 'Amani Charles (Candidate)', gender: 'M', mark: 84, grade: 'A', attendance: 'PRESENT' },
  ],
  'Standard 5 (Grade 5)': [
    { id: 'p1', admNo: 'PUP-2026-085', name: 'Baraka David', gender: 'M', mark: 86, grade: 'A', attendance: 'PRESENT' },
    { id: 'p2', admNo: 'PUP-2026-086', name: 'Zuhura Ally', gender: 'F', mark: 92, grade: 'A', attendance: 'PRESENT' },
    { id: 'p3', admNo: 'PUP-2026-087', name: 'Joshua Peter', gender: 'M', mark: 74, grade: 'B', attendance: 'PRESENT' },
    { id: 'p4', admNo: 'PUP-2026-088', name: 'Dorothy Michael', gender: 'F', mark: 65, grade: 'C', attendance: 'PRESENT' },
    { id: 'p5', admNo: 'PUP-2026-089', name: 'Emanuel Joseph', gender: 'M', mark: 80, grade: 'A', attendance: 'PERMISSION' },
  ],
  'Standard 4 (Grade 4)': [
    { id: 'p6', admNo: 'SFNA-2026-0112', name: 'Juma Bakari (Candidate)', gender: 'M', mark: 88, grade: 'A', attendance: 'PRESENT' },
    { id: 'p7', admNo: 'SFNA-2026-0113', name: 'Fatma Hassan (Candidate)', gender: 'F', mark: 94, grade: 'A', attendance: 'PRESENT' },
    { id: 'p8', admNo: 'PUP-2026-045', name: 'Saidi Mohamed', gender: 'M', mark: 70, grade: 'B', attendance: 'PRESENT' },
    { id: 'p9', admNo: 'PUP-2026-046', name: 'Rehema John', gender: 'F', mark: 58, grade: 'C', attendance: 'ABSENT' },
  ],
};

export const SYLLABUS_OVERVIEW: SyllabusItem[] = [
  {
    id: 'syl-1',
    grade: 'Standard 7 (Grade 7)',
    subject: 'Civic & Moral Education (Uraia na Maadili)',
    teacher: 'Mwl. Augustine Mrosso (Headteacher)',
    completion: 88,
    lessonPlansSubmitted: 14,
    lessonPlansTotal: 16,
    status: 'ON_TRACK',
  },
  {
    id: 'syl-2',
    grade: 'Standard 6 (Grade 6)',
    subject: 'Social Studies (Maarifa ya Jamii)',
    teacher: 'Mwl. Augustine Mrosso (Headteacher)',
    completion: 78,
    lessonPlansSubmitted: 12,
    lessonPlansTotal: 16,
    status: 'ON_TRACK',
  },
  {
    id: 'syl-3',
    grade: 'Standard 7 (Grade 7)',
    subject: 'Mathematics (Hisabati)',
    teacher: 'Mwl. Beatrice Kimaro (Academic)',
    completion: 82,
    lessonPlansSubmitted: 15,
    lessonPlansTotal: 16,
    status: 'ON_TRACK',
  },
  {
    id: 'syl-4',
    grade: 'Standard 5 (Grade 5)',
    subject: 'English Language',
    teacher: 'Mwl. Sarah Mollel',
    completion: 70,
    lessonPlansSubmitted: 10,
    lessonPlansTotal: 16,
    status: 'BEHIND',
  },
  {
    id: 'syl-5',
    grade: 'Standard 4 (Grade 4)',
    subject: 'Science & Technology (Sayansi)',
    teacher: 'Mwl. Emmanuel Swai',
    completion: 85,
    lessonPlansSubmitted: 14,
    lessonPlansTotal: 16,
    status: 'ON_TRACK',
  },
];

export const INITIAL_BROADSHEET: BroadsheetRow[] = [
  {
    admNo: 'PSLE-2026-0428',
    name: 'Kelvin Shirima',
    gender: 'M',
    math: 98,
    english: 95,
    kiswahili: 92,
    science: 94,
    social: 96,
    civic: 99,
    total: 574,
    average: 95.6,
    division: 'Daraja I',
    rank: 1,
  },
  {
    admNo: 'PSLE-2026-0429',
    name: 'Neema Massawe',
    gender: 'F',
    math: 92,
    english: 94,
    kiswahili: 96,
    science: 90,
    social: 93,
    civic: 95,
    total: 560,
    average: 93.3,
    division: 'Daraja I',
    rank: 2,
  },
  {
    admNo: 'PSLE-2026-0430',
    name: 'Amani Charles',
    gender: 'M',
    math: 88,
    english: 86,
    kiswahili: 90,
    science: 84,
    social: 89,
    civic: 88,
    total: 525,
    average: 87.5,
    division: 'Daraja I',
    rank: 3,
  },
];

export const INITIAL_INCIDENTS: DisciplineIncident[] = [
  {
    id: 'inc-1',
    date: '2026-09-30',
    pupilName: 'Saidi Mohamed',
    class: 'Standard 4 (Grade 4)',
    issue: 'Utoro wa siku 3 mfululizo bila taarifa',
    actionTaken: 'Barua ya wito kwa mzazi imetolewa',
    parentContacted: true,
    status: 'PENDING',
  },
  {
    id: 'inc-2',
    date: '2026-10-01',
    pupilName: 'Dorothy Michael',
    class: 'Standard 5 (Grade 5)',
    issue: 'Kuchelewa kufika shuleni mara kwa mara',
    actionTaken: 'Ushauri nasaha na onyo la maandishi',
    parentContacted: false,
    status: 'RESOLVED',
  },
];
