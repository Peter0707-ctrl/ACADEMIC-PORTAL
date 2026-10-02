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
function createPupil(
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

// Complete realistic student rosters (35+ students for Standard 6)
export const INITIAL_PUPILS: Record<string, StudentMark[]> = {
  'Standard 6 (Grade 6)': [
    createPupil('p6-01', 'PUP-2026-061', 'Rashid Hamisi', 'M', 84, 88, 86, 90),
    createPupil('p6-02', 'PUP-2026-062', 'Amina Salum', 'F', 89, 92, 90, 94),
    createPupil('p6-03', 'PUP-2026-063', 'Frank Leonard', 'M', 72, 78, 75, 80),
    createPupil('p6-04', 'PUP-2026-064', 'Grace Mlay', 'F', 91, 94, 95, 96),
    createPupil('p6-05', 'PUP-2026-065', 'Baraka Juma Mshana', 'M', 80, 84, 82, 86),
    createPupil('p6-06', 'PUP-2026-066', 'Zuwena Athumani', 'F', 78, 82, 80, 85),
    createPupil('p6-07', 'PUP-2026-067', 'Christopher Mwita', 'M', 85, 87, 88, 89),
    createPupil('p6-08', 'PUP-2026-068', 'Diana Patrick Kavishe', 'F', 92, 90, 93, 95),
    createPupil('p6-09', 'PUP-2026-069', 'Erick John Masanja', 'M', 68, 74, 70, 76),
    createPupil('p6-10', 'PUP-2026-070', 'Fatuma Omari Said', 'F', 86, 88, 85, 90),
    createPupil('p6-11', 'PUP-2026-071', 'Godfrey Peter Temu', 'M', 90, 92, 94, 91),
    createPupil('p6-12', 'PUP-2026-072', 'Hawa Ramadhani Bakari', 'F', 82, 85, 84, 88),
    createPupil('p6-13', 'PUP-2026-073', 'Ismail Ally Seif', 'M', 74, 76, 78, 80),
    createPupil('p6-14', 'PUP-2026-074', 'Jackline Simon Shirima', 'F', 88, 91, 89, 93),
    createPupil('p6-15', 'PUP-2026-075', 'Kelvin Anthony Minja', 'M', 79, 83, 81, 85),
    createPupil('p6-16', 'PUP-2026-076', 'Lilian Daudi Mrema', 'F', 85, 87, 86, 89),
    createPupil('p6-17', 'PUP-2026-077', 'Michael Joseph Mushi', 'M', 66, 72, 68, 75),
    createPupil('p6-18', 'PUP-2026-078', 'Nancy Prosper Lyimo', 'F', 94, 96, 95, 98),
    createPupil('p6-19', 'PUP-2026-079', 'Omari Khalfan Mwinyi', 'M', 77, 81, 79, 83),
    createPupil('p6-20', 'PUP-2026-080', 'Pauline Gabriel Massawe', 'F', 83, 86, 85, 88),
    createPupil('p6-21', 'PUP-2026-081', 'Raymond Charles Swai', 'M', 70, 75, 72, 78),
    createPupil('p6-22', 'PUP-2026-082', 'Sabrina Hashim Nassor', 'F', 87, 90, 88, 92),
    createPupil('p6-23', 'PUP-2026-083', 'Thomas Lucas Tarimo', 'M', 81, 85, 83, 87),
    createPupil('p6-24', 'PUP-2026-084', 'Upendo Wilson Mboya', 'F', 90, 93, 92, 95),
    createPupil('p6-25', 'PUP-2026-085', 'Victor Ernest Moshi', 'M', 75, 80, 77, 82),
    createPupil('p6-26', 'PUP-2026-086', 'Winnie Bernard Maro', 'F', 88, 92, 90, 94),
    createPupil('p6-27', 'PUP-2026-087', 'Yohana Festo Mallya', 'M', 69, 73, 71, 77),
    createPupil('p6-28', 'PUP-2026-088', 'Zainab Jafari Kingazi', 'F', 84, 88, 86, 90),
    createPupil('p6-29', 'PUP-2026-089', 'Abel Richard Macha', 'M', 78, 82, 80, 84),
    createPupil('p6-30', 'PUP-2026-090', 'Brenda Elia Kimaro', 'F', 93, 95, 94, 97),
    createPupil('p6-31', 'PUP-2026-091', 'Denis Francis Mollel', 'M', 73, 77, 75, 80),
    createPupil('p6-32', 'PUP-2026-092', 'Elizabeth George Kweka', 'F', 86, 90, 88, 92),
    createPupil('p6-33', 'PUP-2026-093', 'Faraji Saidi Mkude', 'M', 80, 84, 82, 87),
    createPupil('p6-34', 'PUP-2026-094', 'Gloria Martin Shayo', 'F', 89, 93, 91, 95),
    createPupil('p6-35', 'PUP-2026-095', 'Henry Innocent Lyatuu', 'M', 76, 80, 78, 83),
  ],
  'Standard 7 (Grade 7)': [
    createPupil('p7-01', 'PSLE-2026-0428', 'Kelvin Shirima (Candidate)', 'M', 95, 97, 96, 98),
    createPupil('p7-02', 'PSLE-2026-0429', 'Neema Massawe (Candidate)', 'F', 90, 93, 92, 95),
    createPupil('p7-03', 'PSLE-2026-0430', 'Amani Charles (Candidate)', 'M', 82, 86, 84, 89),
    createPupil('p7-04', 'PSLE-2026-0431', 'Beatrice Samuel (Candidate)', 'F', 88, 91, 90, 93),
    createPupil('p7-05', 'PSLE-2026-0432', 'Daniel Josephat (Candidate)', 'M', 84, 87, 85, 90),
    createPupil('p7-06', 'PSLE-2026-0433', 'Ester Lucas (Candidate)', 'F', 92, 95, 94, 97),
    createPupil('p7-07', 'PSLE-2026-0434', 'Faraja Nelson (Candidate)', 'M', 79, 83, 81, 86),
    createPupil('p7-08', 'PSLE-2026-0435', 'Halima Zuberi (Candidate)', 'F', 86, 89, 88, 92),
    createPupil('p7-09', 'PSLE-2026-0436', 'Ian Geoffrey (Candidate)', 'M', 75, 79, 77, 82),
    createPupil('p7-10', 'PSLE-2026-0437', 'Jesca William (Candidate)', 'F', 91, 94, 93, 96),
    createPupil('p7-11', 'PSLE-2026-0438', 'Kassim Bakari (Candidate)', 'M', 83, 86, 85, 89),
    createPupil('p7-12', 'PSLE-2026-0439', 'Lydia Stephano (Candidate)', 'F', 87, 90, 89, 93),
  ],
  'Standard 5 (Grade 5)': [
    createPupil('p5-01', 'PUP-2026-085', 'Baraka David', 'M', 84, 88, 86, 89),
    createPupil('p5-02', 'PUP-2026-086', 'Zuhura Ally', 'F', 90, 94, 92, 95),
    createPupil('p5-03', 'PUP-2026-087', 'Joshua Peter', 'M', 72, 76, 74, 80),
    createPupil('p5-04', 'PUP-2026-088', 'Dorothy Michael', 'F', 62, 68, 65, 71),
    createPupil('p5-05', 'PUP-2026-089', 'Emanuel Joseph', 'M', 78, 82, 80, 85),
    createPupil('p5-06', 'PUP-2026-090', 'Fiona Patrick', 'F', 86, 89, 88, 91),
    createPupil('p5-07', 'PUP-2026-091', 'Geofrey Francis', 'M', 81, 84, 83, 87),
    createPupil('p5-08', 'PUP-2026-092', 'Hilda Jackson', 'F', 89, 92, 90, 94),
  ],
  'Standard 4 (Grade 4)': [
    createPupil('p4-01', 'SFNA-2026-0112', 'Juma Bakari (Candidate)', 'M', 86, 90, 88, 92),
    createPupil('p4-02', 'SFNA-2026-0113', 'Fatma Hassan (Candidate)', 'F', 92, 95, 94, 97),
    createPupil('p4-03', 'PUP-2026-045', 'Saidi Mohamed', 'M', 68, 72, 70, 76),
    createPupil('p4-04', 'PUP-2026-046', 'Rehema John', 'F', 55, 61, 58, 65),
    createPupil('p4-05', 'PUP-2026-047', 'Albert Faustine', 'M', 83, 87, 85, 89),
    createPupil('p4-06', 'PUP-2026-048', 'Caroline Elias', 'F', 88, 91, 90, 93),
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
