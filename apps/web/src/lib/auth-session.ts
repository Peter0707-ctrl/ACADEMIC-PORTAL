// =============================================================================
// SHARED AUTHENTICATION & MULTI-TEACHER SESSION ENGINE (ACADEMIC PORTAL)
// Supports all primary school teaching staff: Headmaster, Academic Master,
// Discipline Master, Second Headmaster, and Subject/Class Teachers.
// =============================================================================

export type UserRole =
  | 'ADMIN'
  | 'HEADTEACHER'
  | 'ACADEMIC'
  | 'DISCIPLINE'
  | 'TEACHER'
  | 'STUDENT'
  | 'CANDIDATE'
  | 'PARENT';

export type LeadershipRole = 'HEADTEACHER' | 'ACADEMIC' | 'DISCIPLINE' | 'CLASS_TEACHER';

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
  isHomeroomMaster?: boolean;
  candidateType?: 'PSLE' | 'SFNA';
  examIndexNo?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedDate: string;
}

// Complete Primary School Faculty Roster:
// In Tanzania primary schools, Headmasters, Academic Masters, and Discipline Masters
// also teach classes and have subjects assigned!
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
    assignedClasses: ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)'],
    subjects: ['Civic & Moral Education (Uraia na Maadili)', 'Social Studies (Maarifa ya Jamii)'],
    isHomeroomMaster: false,
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
  {
    id: 'USR-002',
    fullName: 'Mwl. Beatrice Kimaro',
    role: 'ACADEMIC',
    leadershipRole: 'ACADEMIC',
    identifier: 'ACAD-2026-002',
    email: 'academic@primaryschool.ac.tz',
    phone: '+255 784 223 344',
    assignedClass: 'Standard 6 (Grade 6)',
    assignedClasses: ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)'],
    subjects: ['Science & Technology (Sayansi)', 'Mathematics (Hisabati)'],
    isHomeroomMaster: true,
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
  {
    id: 'USR-003',
    fullName: 'Mwl. Emmanuel Lyimo',
    role: 'DISCIPLINE',
    leadershipRole: 'DISCIPLINE',
    identifier: 'DISC-2026-003',
    email: 'discipline@primaryschool.ac.tz',
    phone: '+255 768 334 455',
    assignedClass: 'Standard 5 (Grade 5)',
    assignedClasses: ['Standard 5 (Grade 5)', 'Standard 6 (Grade 6)'],
    subjects: ['Kiswahili', 'Civic & Moral Education (Uraia)'],
    isHomeroomMaster: true,
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
  {
    id: 'USR-004',
    fullName: 'Mwl. Sarah Mollel',
    role: 'TEACHER',
    leadershipRole: 'CLASS_TEACHER',
    identifier: 'TCH-2026-004',
    email: 'sarah.mollel@primaryschool.ac.tz',
    phone: '+255 712 445 566',
    assignedClass: 'Standard 6 (Grade 6)',
    assignedClasses: ['Standard 6 (Grade 6)', 'Standard 4 (Grade 4)'],
    subjects: ['English Language', 'Vocational Skills (Stadi za Kazi)'],
    isHomeroomMaster: true,
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
  {
    id: 'USR-005',
    fullName: 'Mwl. Emmanuel Swai',
    role: 'TEACHER',
    leadershipRole: 'CLASS_TEACHER',
    identifier: 'TCH-2026-005',
    email: 'emmanuel.swai@primaryschool.ac.tz',
    phone: '+255 754 556 677',
    assignedClass: 'Standard 7 (Grade 7)',
    assignedClasses: ['Standard 7 (Grade 7)', 'Standard 5 (Grade 5)'],
    subjects: ['Mathematics (Hisabati)', 'ICT / Computer Studies (Tehama)'],
    isHomeroomMaster: true,
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
  {
    id: 'USR-006',
    fullName: 'Mwl. Godfrey Makere',
    role: 'TEACHER',
    identifier: 'TCH-2026-006',
    email: 'godfrey.makere@primaryschool.ac.tz',
    phone: '+255 765 667 788',
    assignedClass: 'Standard 4 (Grade 4)',
    assignedClasses: ['Standard 4 (Grade 4)', 'Standard 3 (Grade 3)'],
    subjects: ['Social Studies (Maarifa ya Jamii)', 'Science & Technology'],
    isHomeroomMaster: false,
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
];

const ACCOUNTS_STORAGE_KEY = 'academic_portal_faculty_accounts_v8';
const SESSION_STORAGE_KEY = 'academic_portal_active_teacher_v8';

// Get Stored Accounts
export function getStoredAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return INITIAL_BLUEPRINT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_BLUEPRINT_ACCOUNTS));
      return INITIAL_BLUEPRINT_ACCOUNTS;
    }
    const parsed: UserAccount[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_BLUEPRINT_ACCOUNTS));
      return INITIAL_BLUEPRINT_ACCOUNTS;
    }
    return parsed;
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
    if (!parsed || !parsed.id || !parsed.role) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(INITIAL_BLUEPRINT_ACCOUNTS[0]));
      return INITIAL_BLUEPRINT_ACCOUNTS[0];
    }
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

// Clear Active Session (Logout)
export function logoutSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear session', err);
  }
}

export function clearCurrentSession(): void {
  logoutSession();
}

// Strict Role-Based Access Control Validator
export function canAccessPortal(
  user: UserAccount | null,
  targetPortal: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
): boolean {
  if (!user) return false;

  if (targetPortal === 'ADMIN') {
    return user.role === 'ADMIN' || user.role === 'HEADTEACHER';
  }

  if (targetPortal === 'TEACHER') {
    return ['TEACHER', 'ACADEMIC', 'DISCIPLINE', 'HEADTEACHER', 'ADMIN'].includes(user.role);
  }

  if (targetPortal === 'STUDENT') {
    return ['STUDENT', 'CANDIDATE', 'ADMIN'].includes(user.role);
  }

  if (targetPortal === 'PARENT') {
    return ['PARENT', 'ADMIN'].includes(user.role);
  }

  return false;
}

export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}
