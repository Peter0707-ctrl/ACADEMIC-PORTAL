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
  status: 'PRESENT' | 'ABSENT' | 'PERMISSION';
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

// Initial historical seed data for past days across core classes
export function getInitialHistoricalSeeds(): Record<string, ClassDailyAttendanceRecord> {
  const seeds: Record<string, ClassDailyAttendanceRecord> = {};

  const dates = [
    { date: '2026-10-02', time: '07:45 Asubuhi' },
    { date: '2026-10-01', time: '07:50 Asubuhi' },
    { date: '2026-09-30', time: '08:00 Asubuhi' },
  ];

  const classConfigs: { name: string; teacher: string; teacherId: string }[] = [
    { name: 'Standard 7 (Grade 7)', teacher: 'Mwl. Beatrice Kimaro', teacherId: 'TCH-2026-001' },
    { name: 'Standard 6 (Grade 6)', teacher: 'Mwl. David Mrema', teacherId: 'TCH-2026-002' },
    { name: 'Standard 5 (Grade 5)', teacher: 'Mwl. Emmanuel Lyimo', teacherId: 'TCH-2026-003' },
    { name: 'Standard 4 (Grade 4)', teacher: 'Mwl. Rehema Mushi', teacherId: 'TCH-2026-004' },
  ];

  dates.forEach(({ date, time }) => {
    classConfigs.forEach((cfg) => {
      const pupilsList: StudentMark[] = INITIAL_PUPILS[cfg.name] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || [];
      const totalStudents = pupilsList.length;

      // Deterministic 1 or 2 absentees on past dates
      const absentIdx = (date.charCodeAt(date.length - 1) + pupilsList.length) % pupilsList.length;
      const permIdx = (absentIdx + 3) % pupilsList.length;

      const pupils: PupilDailyAttendance[] = pupilsList.map((p, idx) => {
        let status: 'PRESENT' | 'ABSENT' | 'PERMISSION' = 'PRESENT';
        let reason: string | undefined = undefined;

        if (idx === absentIdx) {
          status = 'ABSENT';
          reason = 'Bila taarifa (Utoro wa siku)';
        } else if (idx === permIdx) {
          status = 'PERMISSION';
          reason = 'Ruksa ya matibabu (Hospitali)';
        }

        return {
          id: p.id,
          admNo: p.admNo,
          name: p.name,
          gender: p.gender,
          parentPhone: getDeterministicPhone(p.admNo, idx),
          status,
          absentReason: reason,
          daysAbsentCount: status === 'ABSENT' ? 1 : 0,
        };
      });

      const absCount = pupils.filter((p) => p.status === 'ABSENT').length;
      const permCount = pupils.filter((p) => p.status === 'PERMISSION').length;
      const presCount = pupils.filter((p) => p.status === 'PRESENT').length;
      const attRate = Math.round((presCount / totalStudents) * 100);

      const absentees: DailyAbsentee[] = pupils
        .filter((p) => p.status === 'ABSENT')
        .map((p) => ({
          admNo: p.admNo,
          name: p.name,
          gender: p.gender,
          daysAbsent: 1,
          reason: p.absentReason || 'Bila taarifa',
          parentPhone: p.parentPhone,
          parentNotified: date === '2026-10-02',
        }));

      const key = `${cfg.name}__${date}`;
      seeds[key] = {
        id: `att-${cfg.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${date}`,
        date,
        dateFormatted: formatSwahiliDate(date),
        className: cfg.name,
        classTeacherName: cfg.teacher,
        classTeacherId: cfg.teacherId,
        timeSubmitted: time,
        isSubmitted: true,
        totalStudents,
        presentCount: presCount,
        absentCount: absCount,
        permissionCount: permCount,
        attendanceRate: attRate,
        status: date === '2026-10-02' ? 'CONFIRMED_AND_RECORDED' : 'PENDING_CONFIRMATION',
        confirmedBy: date === '2026-10-02' ? 'Mwl. Augustine Mrosso (Mwalimu Mkuu)' : undefined,
        confirmedAt: date === '2026-10-02' ? '08:15 Asubuhi' : undefined,
        recordRefNo: date === '2026-10-02' ? 'REC-ATT-2026-8941' : undefined,
        pupils,
        absentees,
      };
    });
  });

  return seeds;
}
