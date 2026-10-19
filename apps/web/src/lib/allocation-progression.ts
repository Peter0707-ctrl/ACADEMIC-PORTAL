// =============================================================================
// TEACHING LOAD ALLOCATION LOCK & ANNUAL PROGRESSION ENGINE
// Tanzanian Primary School Educational ERP Engine
// =============================================================================

import {
  UserAccount,
  getStoredAccounts,
  saveStoredAccounts,
  getCurrentSession,
  setCurrentSession,
} from './auth-session';
import {
  getStoredPupilsRegistry,
  savePupilsRegistry,
  getAllEnrolledRecords,
  EnrolledStudent,
  StudentMark,
  ENROLLED_RECORDS_KEY,
} from './teacher-data';
import { notifyUser } from './notifications';

// -----------------------------------------------------------------------------
// 1. GLOBAL CLASS-SUBJECT LOCK REGISTRY
// Prevents two teachers from taking the same subject in the same class
// -----------------------------------------------------------------------------

export interface SubjectAllocationLock {
  id: string; // e.g. "Standard 5 (Grade 5)::Mathematics (Hisabati)"
  class: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  teacherIdentifier: string;
  academicYear: string;
  allocatedAt: string;
}

const STORAGE_ALLOCATION_LOCKS_KEY = 'academic_portal_allocation_locks_v1';
const STORAGE_ACADEMIC_YEAR_KEY = 'academic_portal_current_academic_year_v1';
const CURRENT_DEFAULT_YEAR = '2026';

export function getCurrentAcademicYear(): string {
  if (typeof window === 'undefined') return CURRENT_DEFAULT_YEAR;
  try {
    return localStorage.getItem(STORAGE_ACADEMIC_YEAR_KEY) || CURRENT_DEFAULT_YEAR;
  } catch {
    return CURRENT_DEFAULT_YEAR;
  }
}

export function setCurrentAcademicYear(year: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_ACADEMIC_YEAR_KEY, year);
  } catch (e) {
    console.error(e);
  }
}

export function getAllAllocationLocks(): SubjectAllocationLock[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_ALLOCATION_LOCKS_KEY);
    if (!raw) {
      // Auto-seed locks from current teacher blueprint accounts
      const accounts = getStoredAccounts();
      const initialLocks: SubjectAllocationLock[] = [];
      const currentYear = getCurrentAcademicYear();

      accounts.forEach((acc) => {
        if (acc.teachingAssignments && acc.teachingAssignments.length > 0) {
          acc.teachingAssignments.forEach((assign) => {
            initialLocks.push({
              id: `${assign.class}::${assign.subject}`,
              class: assign.class,
              subject: assign.subject,
              teacherId: acc.id,
              teacherName: acc.fullName,
              teacherIdentifier: acc.identifier,
              academicYear: currentYear,
              allocatedAt: acc.joinedDate || '2026-01-15',
            });
          });
        }
      });

      localStorage.setItem(STORAGE_ALLOCATION_LOCKS_KEY, JSON.stringify(initialLocks));
      return initialLocks;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAllocationLocks(locks: SubjectAllocationLock[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_ALLOCATION_LOCKS_KEY, JSON.stringify(locks));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Check if a specific class & subject is already locked by another teacher
 */
export function checkClassSubjectLock(
  targetClass: string,
  subject: string,
  requestingTeacherId: string
): { isLocked: boolean; lockDetails?: SubjectAllocationLock } {
  const locks = getAllAllocationLocks();
  const currentYear = getCurrentAcademicYear();

  const existing = locks.find(
    (l) => l.class === targetClass && l.subject === subject && l.academicYear === currentYear
  );

  if (!existing) {
    return { isLocked: false };
  }

  if (existing.teacherId === requestingTeacherId) {
    // Current teacher owns it
    return { isLocked: false, lockDetails: existing };
  }

  // Taken by another teacher
  return { isLocked: true, lockDetails: existing };
}

/**
 * Lock an allocation to a teacher
 */
export function lockClassSubject(
  targetClass: string,
  subject: string,
  teacher: UserAccount
): { success: boolean; message: string } {
  const check = checkClassSubjectLock(targetClass, subject, teacher.id);
  if (check.isLocked && check.lockDetails) {
    return {
      success: false,
      message: `Somo la "${subject}" katika "${targetClass}" tayari limechukuliwa na ${check.lockDetails.teacherName} (${check.lockDetails.teacherIdentifier}). Somo hili limefungwa.`,
    };
  }

  const locks = getAllAllocationLocks();
  const currentYear = getCurrentAcademicYear();
  const lockId = `${targetClass}::${subject}`;

  const filtered = locks.filter((l) => !(l.class === targetClass && l.subject === subject && l.academicYear === currentYear));
  const newLock: SubjectAllocationLock = {
    id: lockId,
    class: targetClass,
    subject: subject,
    teacherId: teacher.id,
    teacherName: teacher.fullName,
    teacherIdentifier: teacher.identifier,
    academicYear: currentYear,
    allocatedAt: new Date().toISOString().split('T')[0],
  };

  saveAllocationLocks([...filtered, newLock]);
  return { success: true, message: `Somo limefungwa kwako kwa mafanikio kwa mwaka ${currentYear}.` };
}

/**
 * Release / Unlock an allocation
 */
export function unlockClassSubject(targetClass: string, subject: string, teacherId: string): void {
  const locks = getAllAllocationLocks();
  const currentYear = getCurrentAcademicYear();
  const updated = locks.filter(
    (l) => !(l.class === targetClass && l.subject === subject && l.teacherId === teacherId && l.academicYear === currentYear)
  );
  saveAllocationLocks(updated);
}

// -----------------------------------------------------------------------------
// 2. ANNUAL ALLOCATION RESET
// When the academic year ends, all teacher teaching allocations reset automatically
// -----------------------------------------------------------------------------

export function resetAnnualAllocationsForNewYear(newYear: string): {
  previousYear: string;
  newYear: string;
  clearedTeachersCount: number;
} {
  const previousYear = getCurrentAcademicYear();
  setCurrentAcademicYear(newYear);

  // Clear global locks for the previous year
  saveAllocationLocks([]);

  // Reset all teacher accounts' teaching assignments for the new year
  const accounts = getStoredAccounts();
  let count = 0;

  const updatedAccounts = accounts.map((acc) => {
    if (['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(acc.role)) {
      count++;
      return {
        ...acc,
        teachingAssignments: [],
        assignedClasses: [],
        assignedClass: undefined,
        subjects: [],
      };
    }
    return acc;
  });

  saveStoredAccounts(updatedAccounts);

  // If current session is a teacher, reset local session as well
  const session = getCurrentSession();
  if (session && ['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(session.role)) {
    const updatedSession = updatedAccounts.find((a) => a.id === session.id) || session;
    setCurrentSession(updatedSession);
  }

  notifyUser(
    'info',
    `Mwaka Mpya wa Masomo ${newYear} Umeanza!`,
    `Madarasa na masomo ya mwaka uliopita (${previousYear}) yamefunguliwa. Walimu wote wanatakiwa kujaza upya madarasa na masomo wanayofundisha kwa mwaka huu mpya.`
  );

  return {
    previousYear,
    newYear,
    clearedTeachersCount: count,
  };
}

// -----------------------------------------------------------------------------
// 3. STUDENT AUTOMATIC PROGRESSION / PROMOTION ENGINE
// Promotes pupils to next class if overall score >= Academic Master's Benchmark
// -----------------------------------------------------------------------------

export interface ProgressionReportItem {
  admNo: string;
  name: string;
  previousClass: string;
  promotedClass: string;
  averageScore: number;
  passingBenchmark: number;
  status: 'PROMOTED' | 'RETAINED' | 'GRADUATED_ALUMNI';
  statusLabelSwahili: string;
  parentPhone: string;
  notificationSent: boolean;
}

const CLASS_PROGRESSION_LADDER: Record<string, string> = {
  'Nursery (Awali)': 'Standard 1 (Grade 1)',
  'Standard 1 (Grade 1)': 'Standard 2 (Grade 2)',
  'Standard 2 (Grade 2)': 'Standard 3 (Grade 3)',
  'Standard 3 (Grade 3)': 'Standard 4 (Grade 4)',
  'Standard 4 (Grade 4)': 'Standard 5 (Grade 5)',
  'Standard 5 (Grade 5)': 'Standard 6 (Grade 6)',
  'Standard 6 (Grade 6)': 'Standard 7 (Grade 7)',
  'Standard 7 (Grade 7)': 'GRADUATED_ALUMNI',
};

const STORAGE_PROGRESSION_LOGS_KEY = 'academic_portal_progression_history_v1';

export function runStudentProgressionCycle(
  passingBenchmarkPercent: number, // e.g. 50%
  newAcademicYear: string
): {
  promotedCount: number;
  retainedCount: number;
  graduatedCount: number;
  report: ProgressionReportItem[];
} {
  const enrolledRecords = getAllEnrolledRecords();
  const transferred = getAllTransferredStudents();
  const transferredAdmNos = new Set(transferred.map((t) => t.admNo));

  const report: ProgressionReportItem[] = [];
  let promotedCount = 0;
  let retainedCount = 0;
  let graduatedCount = 0;

  // Process each pupil
  const updatedEnrolled = enrolledRecords.map((p) => {
    // If student has already transferred out, skip promotion
    if (transferredAdmNos.has(p.admNo)) {
      return p;
    }

    const currentClass = p.assignedClass;
    const avg = typeof p.mark === 'number' ? p.mark : 75;

    const hasPassed = avg >= passingBenchmarkPercent;
    const nextClass = CLASS_PROGRESSION_LADDER[currentClass] || currentClass;

    let finalClass = currentClass;
    let status: 'PROMOTED' | 'RETAINED' | 'GRADUATED_ALUMNI' = 'RETAINED';
    let statusLabel = 'Anarudia Darasa (Hakufikisha Wastani)';

    if (hasPassed) {
      if (nextClass === 'GRADUATED_ALUMNI') {
        finalClass = 'Alumni / Wahitimu wa Darasa la 7';
        status = 'GRADUATED_ALUMNI';
        statusLabel = 'Amehitimu Darasa la Saba (Alumnus)';
        graduatedCount++;
      } else {
        finalClass = nextClass;
        status = 'PROMOTED';
        statusLabel = `Amefaulu & Kupanda kwenda ${nextClass}`;
        promotedCount++;
      }
    } else {
      retainedCount++;
    }

    report.push({
      admNo: p.admNo,
      name: p.name,
      previousClass: currentClass,
      promotedClass: finalClass,
      averageScore: avg,
      passingBenchmark: passingBenchmarkPercent,
      status,
      statusLabelSwahili: statusLabel,
      parentPhone: p.parentPhone || '07XX XXX XXX',
      notificationSent: true,
    });

    return {
      ...p,
      assignedClass: finalClass,
    };
  });

  // Save updated enrolled records
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ENROLLED_RECORDS_KEY, JSON.stringify(updatedEnrolled));
    } catch (e) {
      console.error(e);
    }
  }

  // Update class-based pupils registry
  const newRegistry: Record<string, StudentMark[]> = {};
  updatedEnrolled.forEach((student) => {
    if (!newRegistry[student.assignedClass]) {
      newRegistry[student.assignedClass] = [];
    }
    newRegistry[student.assignedClass].push({
      id: student.id,
      admNo: student.admNo,
      name: student.name,
      gender: student.gender,
      monthlyTest1: student.monthlyTest1 || 70,
      monthlyTest2: student.monthlyTest2 || 75,
      monthlyAvg: student.monthlyAvg || 72,
      midtermExam: student.midtermExam || 74,
      terminalExam: student.terminalExam || 76,
      mark: student.mark || 75,
      grade: student.grade || 'B',
      remarks: student.remarks || 'Anaendelea vizuri',
      attendance: student.attendance || 'PRESENT',
    });
  });
  savePupilsRegistry(newRegistry);

  // Store progression report history
  try {
    const raw = localStorage.getItem(STORAGE_PROGRESSION_LOGS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    existing.unshift({
      timestamp: new Date().toISOString(),
      year: newAcademicYear,
      benchmark: passingBenchmarkPercent,
      promotedCount,
      retainedCount,
      graduatedCount,
      report,
    });
    localStorage.setItem(STORAGE_PROGRESSION_LOGS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error(e);
  }

  // Also trigger annual allocations reset so teachers can pick subjects for new year
  resetAnnualAllocationsForNewYear(newAcademicYear);

  return {
    promotedCount,
    retainedCount,
    graduatedCount,
    report,
  };
}

// -----------------------------------------------------------------------------
// 4. STUDENT TRANSFER OUT (KUHAMA SHULE)
// Removes student from active teacher classes & parent portal
// BUT PRESERVES COMPLETE PERMANENT RECORD IN SCHOOL SECRETARY REGISTRY!
// -----------------------------------------------------------------------------

const STORAGE_TRANSFERRED_STUDENTS_KEY = 'academic_portal_transferred_students_registry_v1';

export interface TransferredStudentRecord {
  id: string;
  admNo: string;
  fullName: string;
  gender: 'M' | 'F';
  lastClass: string;
  destinationSchool: string;
  reasonForTransfer: string;
  transferDate: string;
  authorizedBy: string; // Academic Master / Headteacher
  transferCertificateNo: string;
  parentName: string;
  parentPhone: string;
  academicAverage: number;
  digitalStudentFileArchived: boolean;
  notes: string;
}

export function getAllTransferredStudents(): TransferredStudentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_TRANSFERRED_STUDENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function transferStudentOut(params: {
  pupilId: string; // admNo or ID
  destinationSchool: string;
  reason: string;
  authorizedBy: string;
  notes?: string;
}): { success: boolean; record?: TransferredStudentRecord; message: string } {
  const enrolled = getAllEnrolledRecords();
  const pupil = enrolled.find((p) => p.id === params.pupilId || p.admNo === params.pupilId);

  if (!pupil) {
    return { success: false, message: 'Mwanafunzi hakupatikana kwenye sajili ya shule.' };
  }

  const certNumber = `TRF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const transferRecord: TransferredStudentRecord = {
    id: `trf-${Date.now()}`,
    admNo: pupil.admNo,
    fullName: pupil.name,
    gender: pupil.gender || 'M',
    lastClass: pupil.assignedClass,
    destinationSchool: params.destinationSchool,
    reasonForTransfer: params.reason,
    transferDate: new Date().toISOString().split('T')[0],
    authorizedBy: params.authorizedBy,
    transferCertificateNo: certNumber,
    parentName: pupil.parentName || 'Mzazi Mzazi',
    parentPhone: pupil.parentPhone || '07XX XXX XXX',
    academicAverage: pupil.mark || 80,
    digitalStudentFileArchived: true,
    notes: params.notes || 'Amehamishiwa shule nyingine. Faili lake la kidigitali limehifadhiwa kwa Katibu wa Shule.',
  };

  // 1. Filter out from active enrolled records
  const updatedEnrolled = enrolled.filter((p) => p.admNo !== pupil.admNo && p.id !== pupil.id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ENROLLED_RECORDS_KEY, JSON.stringify(updatedEnrolled));
    } catch (e) {
      console.error(e);
    }
  }

  // 2. Also filter out from pupils registry so teachers no longer see them in classes
  const registry = getStoredPupilsRegistry();
  if (registry[pupil.assignedClass]) {
    registry[pupil.assignedClass] = registry[pupil.assignedClass].filter(
      (p) => p.admNo !== pupil.admNo && p.id !== pupil.id
    );
    savePupilsRegistry(registry);
  }

  // 3. Save into transferred students permanent archive
  const existing = getAllTransferredStudents();
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_TRANSFERRED_STUDENTS_KEY, JSON.stringify([transferRecord, ...existing]));
    } catch (e) {
      console.error(e);
    }
  }

  // 4. Register a transfer document in the Secretary Document Registry (IBAKI TU RECORD YAKE KWA SECRETARY)
  try {
    const docKey = 'academic_portal_school_documents_v1';
    const rawDocs = localStorage.getItem(docKey);
    const docs = rawDocs ? JSON.parse(rawDocs) : [];
    docs.unshift({
      id: `doc-${Date.now()}`,
      title: `Hati ya Uhamisho wa Mwanafunzi — ${pupil.name} (${pupil.admNo})`,
      category: 'STUDENT_RECORDS',
      documentType: 'Transfer Document',
      description: `Mwanafunzi amehamia ${params.destinationSchool}. Sababu: ${params.reason}. Hati imetolewa na ${params.authorizedBy}.`,
      referenceNumber: certNumber,
      academicYear: getCurrentAcademicYear(),
      term: 'Term I',
      documentDate: new Date().toISOString().split('T')[0],
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: params.authorizedBy,
      relatedStudentId: pupil.admNo,
      relatedStudentName: pupil.name,
      relatedClass: pupil.assignedClass,
      relatedSchool: 'Kukumbuka Primary & Nursery School',
      institutionId: 'inst-001',
      confidentialityLevel: 'CONFIDENTIAL',
      status: 'ACTIVE',
      version: '1.0',
      fileType: 'PDF',
      fileSize: '412 KB',
      storageLocation: `secure-archive/students/${pupil.admNo}/transfer_cert.pdf`,
      isArchived: false,
      tags: ['Uhamisho', pupil.assignedClass],
      versionHistory: [
        {
          versionNumber: '1.0',
          uploadedBy: params.authorizedBy,
          uploadDate: new Date().toISOString().split('T')[0],
          changeDescription: `Uhamisho rasmi kwenda ${params.destinationSchool}`,
          fileType: 'PDF',
          fileSize: '412 KB',
          storageLocation: `secure-archive/students/${pupil.admNo}/transfer_cert.pdf`,
          isCurrent: true,
        },
      ],
      createdTimestamp: new Date().toISOString(),
      updatedTimestamp: new Date().toISOString(),
    });
    localStorage.setItem(docKey, JSON.stringify(docs));
  } catch (e) {
    console.error(e);
  }

  notifyUser(
    'success',
    'Mwanafunzi Amehamishwa Shuleni!',
    `${pupil.name} ameondolewa kwenye madarasa ya walimu na portal ya mzazi. Faili lake kamili limehifadhiwa salama kwenye Masjala ya Katibu wa Shule (Secretary Registry).`
  );

  return {
    success: true,
    record: transferRecord,
    message: `${pupil.name} amehamishwa kikamilifu na kumbukumbu yake imehifadhiwa kwa Katibu wa Shule.`,
  };
}
