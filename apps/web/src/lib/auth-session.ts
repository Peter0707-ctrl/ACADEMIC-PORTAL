// =============================================================================
// AUTHENTICATION & SESSION MANAGEMENT BLUEPRINT (ACADEMIC PORTAL)
// Supports multi-teacher accounts with role-based permissions and teaching loads
// =============================================================================

export type UserRole =
  | 'HEADTEACHER'
  | 'ACADEMIC'
  | 'DISCIPLINE'
  | 'TEACHER'
  | 'ACCOUNTANT'
  | 'PARENT'
  | 'STUDENT'
  | 'CANDIDATE'
  | 'ADMIN';

export type LeadershipRole = 'HEADTEACHER' | 'ACADEMIC' | 'DISCIPLINE' | 'CLASS_TEACHER';

export interface TeachingLoad {
  class: string;
  subject: string;
}

export const PRIMARY_CLASSES_LIST = [
  'Standard 7 (Grade 7)',
  'Standard 6 (Grade 6)',
  'Standard 5 (Grade 5)',
  'Standard 4 (Grade 4)',
  'Standard 3 (Grade 3)',
  'Standard 2 (Grade 2)',
  'Standard 1 (Grade 1)',
];

export const PRIMARY_SUBJECTS_LIST = [
  'Mathematics (Hisabati)',
  'Science & Technology (Sayansi)',
  'English Language',
  'Kiswahili',
  'Civic & Moral Education (Uraia na Maadili)',
  'Social Studies (Maarifa ya Jamii)',
  'Vocational Skills (Stadi za Kazi)',
  'Religious Studies (Elimu ya Dini)',
  'ICT / Computer Studies (Tehama)',
];

export interface UserAccount {
  id: string;
  fullName: string;
  role: UserRole;
  leadershipRole?: LeadershipRole;
  identifier: string; // Staff ID, TSC No, or Admission / Candidate No
  email?: string;
  phone?: string;
  assignedClass?: string;
  assignedClasses?: string[];
  subjects?: string[];
  teachingAssignments?: TeachingLoad[];
  isHomeroomMaster?: boolean;
  candidateType?: 'PSLE' | 'SFNA';
  examIndexNo?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedDate: string;
}

// Complete Faculty Roster: Every teacher has their assigned classes and subjects
export const INITIAL_BLUEPRINT_ACCOUNTS: UserAccount[] = [
  {
    id: 'USR-001',
    fullName: 'Mwl. Augustine Mrosso',
    role: 'HEADTEACHER',
    leadershipRole: 'HEADTEACHER',
    identifier: 'HT-2026-001',
    email: 'headteacher@primaryschool.ac.tz',
    phone: '+255 754 112 233',
    assignedClass: 'Senior Standards (Std 6 & 7)',
    assignedClasses: ['Standard 7 (Grade 7)', 'Standard 6 (Grade 6)'],
    subjects: ['Civic & Moral Education (Uraia na Maadili)', 'Social Studies (Maarifa ya Jamii)'],
    teachingAssignments: [
      { class: 'Standard 7 (Grade 7)', subject: 'Civic & Moral Education (Uraia na Maadili)' },
      { class: 'Standard 6 (Grade 6)', subject: 'Social Studies (Maarifa ya Jamii)' },
    ],
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
  {
    id: 'USR-002',
    fullName: 'Mwl. Beatrice Kimaro',
    role: 'ACADEMIC',
    leadershipRole: 'ACADEMIC',
    identifier: 'ACAD-2026-001',
    email: 'academic@primaryschool.ac.tz',
    phone: '+255 765 223 344',
    assignedClass: 'Standard 7 (Grade 7)',
    assignedClasses: ['Standard 7 (Grade 7)', 'Standard 4 (Grade 4)'],
    subjects: ['Mathematics (Hisabati)', 'Science & Technology (Sayansi)'],
    isHomeroomMaster: true,
    status: 'ACTIVE',
    joinedDate: '2026-01-20',
  },
  {
    id: 'USR-003',
    fullName: 'Mwl. Sarah Mollel',
    role: 'TEACHER',
    leadershipRole: 'CLASS_TEACHER',
    identifier: 'TCH-2026-012',
    email: 'sarah.mollel@primaryschool.ac.tz',
    phone: '+255 712 445 566',
    assignedClass: 'Standard 6 (Grade 6)',
    assignedClasses: ['Standard 6 (Grade 6)'],
    subjects: ['English Language', 'Kiswahili'],
    isHomeroomMaster: true,
    status: 'ACTIVE',
    joinedDate: '2026-02-15',
  },
  {
    id: 'USR-004',
    fullName: 'Mwl. Emmanuel Lyimo',
    role: 'TEACHER',
    leadershipRole: 'CLASS_TEACHER',
    identifier: 'TCH-2026-014',
    email: 'emmanuel.lyimo@primaryschool.ac.tz',
    phone: '+255 765 223 345',
    assignedClass: 'Standard 5 (Grade 5)',
    assignedClasses: ['Standard 5 (Grade 5)', 'Standard 6 (Grade 6)'],
    subjects: ['Mathematics (Hisabati)', 'Science & Technology (Sayansi)'],
    isHomeroomMaster: true,
    status: 'ACTIVE',
    joinedDate: '2026-01-22',
  },
  {
    id: 'USR-005',
    fullName: 'Mwl. Emmanuel Swai',
    role: 'TEACHER',
    leadershipRole: 'CLASS_TEACHER',
    identifier: 'TCH-2026-015',
    email: 'emmanuel.swai@primaryschool.ac.tz',
    phone: '+255 767 556 677',
    assignedClass: 'Standard 4 (Grade 4)',
    assignedClasses: ['Standard 4 (Grade 4)', 'Standard 3 (Grade 3)'],
    subjects: ['Social Studies (Maarifa ya Jamii)', 'Vocational Skills'],
    isHomeroomMaster: true,
    status: 'ACTIVE',
    joinedDate: '2026-02-20',
  },
  {
    id: 'USR-006',
    fullName: 'Mwl. Godfrey Makere',
    role: 'DISCIPLINE',
    leadershipRole: 'DISCIPLINE',
    identifier: 'DISC-2026-001',
    email: 'discipline@primaryschool.ac.tz',
    phone: '+255 784 334 455',
    assignedClass: 'Standard 5 (Grade 5)',
    assignedClasses: ['Standard 5 (Grade 5)', 'Standard 6 (Grade 6)'],
    subjects: ['Civic & Moral Education (Uraia na Maadili)', 'Vocational Skills'],
    status: 'ACTIVE',
    joinedDate: '2026-02-01',
  },
];

const ACCOUNTS_STORAGE_KEY = 'academic_portal_accounts_v6';
const SESSION_STORAGE_KEY = 'academic_portal_active_session_v6';

// Get Stored Accounts
export function getStoredAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return INITIAL_BLUEPRINT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_BLUEPRINT_ACCOUNTS));
      return INITIAL_BLUEPRINT_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BLUEPRINT_ACCOUNTS;
  }
}

// Save Stored Accounts
export function saveStoredAccounts(accounts: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts to localStorage', err);
  }
}

export const setStoredAccounts = saveStoredAccounts;

// Get Current Logged-in Session
export function getCurrentSession(): UserAccount | null {
  if (typeof window === 'undefined') return INITIAL_BLUEPRINT_ACCOUNTS[0];
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(INITIAL_BLUEPRINT_ACCOUNTS[0]));
      return INITIAL_BLUEPRINT_ACCOUNTS[0];
    }
    const parsed: UserAccount = JSON.parse(raw);
    return parsed;
  } catch {
    return INITIAL_BLUEPRINT_ACCOUNTS[0];
  }
}

// Set Active Session
export function setCurrentSession(user: UserAccount): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to set session', err);
  }
}

export function logoutSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to logout session', err);
  }
}

export function clearCurrentSession(): void {
  logoutSession();
}

export function canAccessPortal(
  user: UserAccount | null,
  portalRole: 'TEACHER' | 'ADMIN' | 'PARENT' | 'STUDENT'
): boolean {
  if (!user) return false;
  if (portalRole === 'TEACHER') {
    return ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE', 'TEACHER', 'ADMIN'].includes(user.role);
  }
  if (portalRole === 'ADMIN') {
    return user.role === 'ADMIN' || user.role === 'HEADTEACHER';
  }
  return user.role === portalRole;
}

export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}
