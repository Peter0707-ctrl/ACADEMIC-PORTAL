// =============================================================================
// SHARED ATTENDANCE & CALENDAR HISTORY ENGINE
// Supports automatic real-time calendar tracking and historical lookup
// =============================================================================

import { INITIAL_PUPILS, StudentMark } from './teacher-data';

export interface DailyAbsentee {
  admNo: string;
  name: string;
  gender: 'M' | 'F';
  daysAbsent: number;
  reason: string;
  parentPhone: string;
  parentNotified: boolean;
}

export interface PupilDailyAttendance {
  id: string;
  admNo: string;
  name: string;
  gender: 'M' | 'F';
  parentPhone: string;
  status: 'PRESENT' | 'ABSENT' | 'PERMISSION' | 'LATE';
  absentReason?: string;
  daysAbsentCount: number;
}

export interface ClassDailyAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  dateFormatted: string;
  className: string;
  classTeacherName: string;
  classTeacherId: string;
  timeSubmitted: string;
  isSubmitted: boolean;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  permissionCount: number;
  attendanceRate: number;
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED_AND_RECORDED';
  confirmedBy?: string;
  confirmedAt?: string;
  recordRefNo?: string;
  pupils: PupilDailyAttendance[];
  absentees: DailyAbsentee[];
}

export const STORAGE_ATTENDANCE_HISTORY_KEY = 'academic_portal_attendance_history_v1';
export const STORAGE_ATTENDANCE_KEY = 'daily_attendance_submissions_v1';

export const CALENDAR_MONTHS = [
  { value: '01', name: 'Januari' },
  { value: '02', name: 'Februari' },
  { value: '03', name: 'Machi' },
  { value: '04', name: 'Aprili' },
  { value: '05', name: 'Mei' },
  { value: '06', name: 'Juni' },
  { value: '07', name: 'Julai' },
  { value: '08', name: 'Agosti' },
  { value: '09', name: 'Septemba' },
  { value: '10', name: 'Oktoba' },
  { value: '11', name: 'Novemba' },
  { value: '12', name: 'Desemba' },
];

export function formatSwahiliDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const d = new Date(year, month - 1, day);
    const dayNames = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'];
    const monthNames = [
      'Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni',
      'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'
    ];
    return `${dayNames[d.getDay()]}, ${day} ${monthNames[month - 1]} ${year}`;
  } catch {
    return dateStr;
  }
}

export function getDeterministicPhone(admNo: string, index: number): string {
  const digits = admNo.replace(/\D/g, '');
  const suffix = digits.slice(-3).padStart(3, '0') || (index + 1).toString().padStart(3, '0');
  const middle = (220 + (index % 600)).toString().padStart(3, '0');
  return `+255 754 ${middle} ${suffix}`;
}

// Initial historical seed data (starts empty; populated as teachers submit daily attendance)
export function getInitialHistoricalSeeds(): Record<string, ClassDailyAttendanceRecord> {
  return {};
}
