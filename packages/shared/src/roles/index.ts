import { RoleType } from '../enums';
import { Permissions, PermissionKey } from '../permissions';

export const DefaultRolePermissions: Record<RoleType, PermissionKey[]> = {
  [RoleType.SUPER_ADMIN]: Object.values(Permissions),

  [RoleType.INSTITUTION_ADMIN]: [
    Permissions.INSTITUTIONS_VIEW,
    Permissions.SETTINGS_VIEW,
    Permissions.SETTINGS_UPDATE,
    Permissions.USERS_VIEW,
    Permissions.USERS_CREATE,
    Permissions.USERS_UPDATE,
    Permissions.ROLES_MANAGE,
    Permissions.ACADEMIC_VIEW,
    Permissions.ACADEMIC_MANAGE,
    Permissions.CLASSES_VIEW,
    Permissions.CLASSES_MANAGE,
    Permissions.SUBJECTS_VIEW,
    Permissions.SUBJECTS_MANAGE,
    Permissions.STUDENTS_VIEW,
    Permissions.STUDENTS_CREATE,
    Permissions.STUDENTS_UPDATE,
    Permissions.STUDENTS_ARCHIVE,
    Permissions.PARENTS_VIEW,
    Permissions.PARENTS_MANAGE,
    Permissions.ATTENDANCE_VIEW,
    Permissions.EXAMS_VIEW,
    Permissions.EXAMS_MANAGE,
    Permissions.RESULTS_VIEW,
    Permissions.RESULTS_REVIEW,
    Permissions.RESULTS_APPROVE,
    Permissions.RESULTS_PUBLISH,
    Permissions.RESULTS_CORRECT,
    Permissions.FINANCE_VIEW,
    Permissions.DOCUMENTS_VIEW,
    Permissions.DOCUMENTS_UPLOAD,
    Permissions.AUDIT_VIEW,
    Permissions.AI_INSIGHTS_VIEW,
    Permissions.TIMETABLE_VIEW,
    Permissions.TIMETABLE_MANAGE
  ],

  [RoleType.HEADMASTER_PRINCIPAL]: [
    Permissions.SETTINGS_VIEW,
    Permissions.USERS_VIEW,
    Permissions.ACADEMIC_VIEW,
    Permissions.CLASSES_VIEW,
    Permissions.SUBJECTS_VIEW,
    Permissions.STUDENTS_VIEW,
    Permissions.PARENTS_VIEW,
    Permissions.ATTENDANCE_VIEW,
    Permissions.EXAMS_VIEW,
    Permissions.RESULTS_VIEW,
    Permissions.RESULTS_REVIEW,
    Permissions.RESULTS_APPROVE,
    Permissions.RESULTS_PUBLISH,
    Permissions.RESULTS_CORRECT,
    Permissions.FINANCE_VIEW,
    Permissions.DOCUMENTS_VIEW,
    Permissions.AUDIT_VIEW,
    Permissions.AI_INSIGHTS_VIEW,
    Permissions.TIMETABLE_VIEW
  ],

  [RoleType.ACADEMIC_MASTER]: [
    Permissions.ACADEMIC_VIEW,
    Permissions.ACADEMIC_MANAGE,
    Permissions.CLASSES_VIEW,
    Permissions.SUBJECTS_VIEW,
    Permissions.STUDENTS_VIEW,
    Permissions.ATTENDANCE_VIEW,
    Permissions.EXAMS_VIEW,
    Permissions.EXAMS_MANAGE,
    Permissions.RESULTS_VIEW,
    Permissions.RESULTS_REVIEW,
    Permissions.RESULTS_APPROVE,
    Permissions.RESULTS_PUBLISH,
    Permissions.RESULTS_CORRECT,
    Permissions.DOCUMENTS_VIEW,
    Permissions.AI_INSIGHTS_VIEW,
    Permissions.TIMETABLE_VIEW,
    Permissions.TIMETABLE_MANAGE
  ],

  [RoleType.TEACHER]: [
    Permissions.CLASSES_VIEW,
    Permissions.SUBJECTS_VIEW,
    Permissions.STUDENTS_VIEW,
    Permissions.ATTENDANCE_VIEW,
    Permissions.ATTENDANCE_CREATE,
    Permissions.ATTENDANCE_UPDATE,
    Permissions.EXAMS_VIEW,
    Permissions.RESULTS_VIEW,
    Permissions.RESULTS_CREATE,
    Permissions.RESULTS_UPDATE,
    Permissions.RESULTS_SUBMIT,
    Permissions.DOCUMENTS_VIEW,
    Permissions.DOCUMENTS_UPLOAD,
    Permissions.TIMETABLE_VIEW
  ],

  [RoleType.LECTURER]: [
    Permissions.CLASSES_VIEW,
    Permissions.SUBJECTS_VIEW,
    Permissions.STUDENTS_VIEW,
    Permissions.ATTENDANCE_VIEW,
    Permissions.ATTENDANCE_CREATE,
    Permissions.ATTENDANCE_UPDATE,
    Permissions.EXAMS_VIEW,
    Permissions.RESULTS_VIEW,
    Permissions.RESULTS_CREATE,
    Permissions.RESULTS_UPDATE,
    Permissions.RESULTS_SUBMIT,
    Permissions.DOCUMENTS_VIEW,
    Permissions.DOCUMENTS_UPLOAD,
    Permissions.TIMETABLE_VIEW
  ],

  [RoleType.STUDENT]: [
    Permissions.CLASSES_VIEW,
    Permissions.SUBJECTS_VIEW,
    Permissions.ATTENDANCE_VIEW,
    Permissions.EXAMS_VIEW,
    Permissions.RESULTS_VIEW,
    Permissions.FINANCE_VIEW,
    Permissions.DOCUMENTS_VIEW,
    Permissions.TIMETABLE_VIEW
  ],

  [RoleType.PARENT_GUARDIAN]: [
    Permissions.STUDENTS_VIEW,
    Permissions.ATTENDANCE_VIEW,
    Permissions.RESULTS_VIEW,
    Permissions.FINANCE_VIEW,
    Permissions.DOCUMENTS_VIEW,
    Permissions.TIMETABLE_VIEW
  ],

  [RoleType.ACCOUNTANT]: [
    Permissions.STUDENTS_VIEW,
    Permissions.FINANCE_VIEW,
    Permissions.FINANCE_CREATE,
    Permissions.FINANCE_UPDATE,
    Permissions.FINANCE_CLEARANCE,
    Permissions.DOCUMENTS_VIEW,
    Permissions.DOCUMENTS_UPLOAD
  ],

  [RoleType.EXAMINATION_OFFICER]: [
    Permissions.ACADEMIC_VIEW,
    Permissions.CLASSES_VIEW,
    Permissions.SUBJECTS_VIEW,
    Permissions.STUDENTS_VIEW,
    Permissions.EXAMS_VIEW,
    Permissions.EXAMS_MANAGE,
    Permissions.RESULTS_VIEW,
    Permissions.RESULTS_REVIEW,
    Permissions.RESULTS_APPROVE,
    Permissions.RESULTS_PUBLISH,
    Permissions.RESULTS_CORRECT
  ],

  [RoleType.HOD]: [
    Permissions.ACADEMIC_VIEW,
    Permissions.CLASSES_VIEW,
    Permissions.SUBJECTS_VIEW,
    Permissions.STUDENTS_VIEW,
    Permissions.ATTENDANCE_VIEW,
    Permissions.EXAMS_VIEW,
    Permissions.RESULTS_VIEW,
    Permissions.RESULTS_REVIEW,
    Permissions.TIMETABLE_VIEW
  ],

  [RoleType.DEAN]: [
    Permissions.ACADEMIC_VIEW,
    Permissions.CLASSES_VIEW,
    Permissions.SUBJECTS_VIEW,
    Permissions.STUDENTS_VIEW,
    Permissions.EXAMS_VIEW,
    Permissions.RESULTS_VIEW,
    Permissions.RESULTS_REVIEW,
    Permissions.RESULTS_APPROVE,
    Permissions.AI_INSIGHTS_VIEW
  ],

  [RoleType.REGISTRAR]: [
    Permissions.ACADEMIC_VIEW,
    Permissions.STUDENTS_VIEW,
    Permissions.STUDENTS_CREATE,
    Permissions.STUDENTS_UPDATE,
    Permissions.EXAMS_VIEW,
    Permissions.RESULTS_VIEW,
    Permissions.RESULTS_PUBLISH,
    Permissions.DOCUMENTS_VIEW
  ],

  [RoleType.ADMISSION_OFFICER]: [
    Permissions.STUDENTS_VIEW,
    Permissions.STUDENTS_CREATE,
    Permissions.DOCUMENTS_VIEW,
    Permissions.DOCUMENTS_UPLOAD
  ],

  [RoleType.LIBRARIAN]: [
    Permissions.STUDENTS_VIEW,
    Permissions.DOCUMENTS_VIEW
  ],

  [RoleType.ICT_ADMIN]: [
    Permissions.USERS_VIEW,
    Permissions.USERS_CREATE,
    Permissions.USERS_UPDATE,
    Permissions.ROLES_MANAGE,
    Permissions.SETTINGS_VIEW,
    Permissions.SETTINGS_UPDATE,
    Permissions.AUDIT_VIEW
  ],

  [RoleType.ALUMNI]: [
    Permissions.RESULTS_VIEW,
    Permissions.DOCUMENTS_VIEW
  ]
};
