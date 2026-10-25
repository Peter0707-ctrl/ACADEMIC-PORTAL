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
  | 'SECRETARY'
  | 'PARENT'
  | 'STUDENT'
  | 'CANDIDATE'
  | 'ADMIN';

export type LeadershipRole =
  | 'HEADTEACHER'
  | 'SECOND_MASTER'
  | 'DEPUTY_HEADTEACHER'
  | 'ACADEMIC'
  | 'ASSISTANT_ACADEMIC'
  | 'DISCIPLINE'
  | 'CLASS_TEACHER';

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

// System Accounts Registry: Initial default Administrator account
export const INITIAL_BLUEPRINT_ACCOUNTS: UserAccount[] = [
  {
    id: 'ADMIN-001',
    fullName: 'System Administrator',
    role: 'ADMIN',
    leadershipRole: 'HEADTEACHER',
    identifier: 'drestgroup@gmail.com',
    email: 'drestgroup@gmail.com',
    phone: '+255 700 000 000',
    status: 'ACTIVE',
    joinedDate: '2026-01-01',
  },
];

const ACCOUNTS_STORAGE_KEY = 'academic_portal_accounts_v9';
const SESSION_STORAGE_KEY = 'academic_portal_active_session_v9';

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
  portalRole: 'TEACHER' | 'ADMIN' | 'PARENT' | 'STUDENT' | 'SECRETARY' | 'ACCOUNTANT'
): user is UserAccount {
  if (!user) return false;
  // Super Administrator has universal access to inspect all school portals
  if (user.role === 'ADMIN') return true;
  if (portalRole === 'TEACHER') {
    return ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE', 'TEACHER'].includes(user.role);
  }
  if (portalRole === 'SECRETARY') {
    return user.role === 'SECRETARY' || user.role === 'HEADTEACHER';
  }
  if (portalRole === 'ACCOUNTANT') {
    return user.role === 'ACCOUNTANT' || user.role === 'HEADTEACHER';
  }
  if (portalRole === 'ADMIN') {
    return user.role === 'HEADTEACHER';
  }
  return user.role === portalRole;
}

export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

// =============================================================================
// HARDENED SECURITY UTILITIES (BRUTE FORCE DEFENSE & AUDIT LOGGING)
// =============================================================================

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPTS_PREFIX = 'academic_sec_attempts_';

export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .trim();
}

export function checkBruteForceLockout(identifier: string): { isLocked: boolean; remainingSeconds: number } {
  if (typeof window === 'undefined' || !identifier) return { isLocked: false, remainingSeconds: 0 };
  try {
    const raw = localStorage.getItem(`${ATTEMPTS_PREFIX}${identifier.toLowerCase()}`);
    if (!raw) return { isLocked: false, remainingSeconds: 0 };
    const { count, lastAttempt } = JSON.parse(raw);
    if (count >= MAX_FAILED_ATTEMPTS) {
      const elapsed = Date.now() - lastAttempt;
      if (elapsed < LOCKOUT_DURATION_MS) {
        const remainingSeconds = Math.ceil((LOCKOUT_DURATION_MS - elapsed) / 1000);
        return { isLocked: true, remainingSeconds };
      } else {
        localStorage.removeItem(`${ATTEMPTS_PREFIX}${identifier.toLowerCase()}`);
        return { isLocked: false, remainingSeconds: 0 };
      }
    }
    return { isLocked: false, remainingSeconds: 0 };
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

export function recordFailedLoginAttempt(identifier: string): number {
  if (typeof window === 'undefined' || !identifier) return 1;
  try {
    const key = `${ATTEMPTS_PREFIX}${identifier.toLowerCase()}`;
    const raw = localStorage.getItem(key);
    let count = 1;
    if (raw) {
      const parsed = JSON.parse(raw);
      count = (parsed.count || 0) + 1;
    }
    localStorage.setItem(key, JSON.stringify({ count, lastAttempt: Date.now() }));
    return count;
  } catch {
    return 1;
  }
}

export function resetFailedLoginAttempts(identifier: string): void {
  if (typeof window === 'undefined' || !identifier) return;
  try {
    localStorage.removeItem(`${ATTEMPTS_PREFIX}${identifier.toLowerCase()}`);
  } catch {
    // pass
  }
}

export function recordSecurityAuditLog(
  action: string,
  user: string,
  role: string,
  status: 'SUCCESS' | 'WARNING' | 'BLOCKED'
): void {
  if (typeof window === 'undefined') return;
  try {
    const key = 'academic_portal_audit_logs_v1';
    const raw = localStorage.getItem(key);
    const logs = raw ? JSON.parse(raw) : [];
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: user || 'Anonymous',
      role: role || 'GUEST',
      action,
      device: typeof navigator !== 'undefined' ? `${navigator.userAgent.slice(0, 45)}...` : 'Web Browser',
      ip: '127.0.0.1 (Client-Origin)',
      status,
    };
    logs.unshift(newLog);
    localStorage.setItem(key, JSON.stringify(logs.slice(0, 100)));
  } catch {
    // pass
  }
}
