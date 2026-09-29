export const Permissions = {
  // Institutions & Settings
  INSTITUTIONS_VIEW: 'institutions.view',
  INSTITUTIONS_MANAGE: 'institutions.manage',
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_UPDATE: 'settings.update',

  // Users & Roles
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  ROLES_MANAGE: 'roles.manage',

  // Academic Structure
  ACADEMIC_VIEW: 'academic.view',
  ACADEMIC_MANAGE: 'academic.manage',
  CLASSES_VIEW: 'classes.view',
  CLASSES_MANAGE: 'classes.manage',
  SUBJECTS_VIEW: 'subjects.view',
  SUBJECTS_MANAGE: 'subjects.manage',

  // Students & Parents
  STUDENTS_VIEW: 'students.view',
  STUDENTS_CREATE: 'students.create',
  STUDENTS_UPDATE: 'students.update',
  STUDENTS_ARCHIVE: 'students.archive',
  PARENTS_VIEW: 'parents.view',
  PARENTS_MANAGE: 'parents.manage',

  // Attendance
  ATTENDANCE_VIEW: 'attendance.view',
  ATTENDANCE_CREATE: 'attendance.create',
  ATTENDANCE_UPDATE: 'attendance.update',

  // Examinations & Results
  EXAMS_VIEW: 'exams.view',
  EXAMS_MANAGE: 'exams.manage',
  RESULTS_VIEW: 'results.view',
  RESULTS_CREATE: 'results.create',
  RESULTS_UPDATE: 'results.update',
  RESULTS_SUBMIT: 'results.submit',
  RESULTS_REVIEW: 'results.review',
  RESULTS_APPROVE: 'results.approve',
  RESULTS_PUBLISH: 'results.publish',
  RESULTS_CORRECT: 'results.correct',

  // Finance
  FINANCE_VIEW: 'finance.view',
  FINANCE_CREATE: 'finance.create',
  FINANCE_UPDATE: 'finance.update',
  FINANCE_CLEARANCE: 'finance.clearance',

  // Documents
  DOCUMENTS_UPLOAD: 'documents.upload',
  DOCUMENTS_VIEW: 'documents.view',
  DOCUMENTS_DELETE: 'documents.delete',

  // Audit & System
  AUDIT_VIEW: 'audit.view',
  AI_INSIGHTS_VIEW: 'ai.insights.view',
  TIMETABLE_VIEW: 'timetable.view',
  TIMETABLE_MANAGE: 'timetable.manage'
} as const;

export type PermissionKey = typeof Permissions[keyof typeof Permissions];
