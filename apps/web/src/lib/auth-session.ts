// =============================================================================
// SHARED AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) BLUEPRINT ENGINE
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

// STRICT USER TESTING: ONLY Headmaster (Mwalimu Mkuu) account active. All other test accounts deleted.
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
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
];

const ACCOUNTS_STORAGE_KEY = 'academic_portal_accounts_v5';
const SESSION_STORAGE_KEY = 'academic_portal_active_session_v5';

// Get Stored Accounts (guarantees strictly Mwalimu Mkuu is returned in this phase)
export function getStoredAccounts(): UserAccount[] {
  if (typeof window === 'undefined') return INITIAL_BLUEPRINT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_BLUEPRINT_ACCOUNTS));
      return INITIAL_BLUEPRINT_ACCOUNTS;
    }
    const parsed: UserAccount[] = JSON.parse(raw);
    const onlyHeadmaster = parsed.filter((a) => a.identifier === 'HT-2026-001');
    if (onlyHeadmaster.length === 0) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_BLUEPRINT_ACCOUNTS));
      return INITIAL_BLUEPRINT_ACCOUNTS;
    }
    if (onlyHeadmaster.length !== parsed.length) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(onlyHeadmaster));
      return onlyHeadmaster;
    }
    return onlyHeadmaster;
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

// Get Current Logged-in Session (guarantees Headmaster as active session)
export function getCurrentSession(): UserAccount | null {
  if (typeof window === 'undefined') return INITIAL_BLUEPRINT_ACCOUNTS[0];
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(INITIAL_BLUEPRINT_ACCOUNTS[0]));
      return INITIAL_BLUEPRINT_ACCOUNTS[0];
    }
    const parsed: UserAccount = JSON.parse(raw);
    if (parsed.identifier !== 'HT-2026-001') {
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
export function clearCurrentSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear session', err);
  }
}

// Strict Role-Based Access Control Validator
export function canAccessPortal(
  user: UserAccount | null,
  targetPortal: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'
): boolean {
  if (!user) return false;

  if (targetPortal === 'ADMIN') {
    return user.role === 'ADMIN';
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
