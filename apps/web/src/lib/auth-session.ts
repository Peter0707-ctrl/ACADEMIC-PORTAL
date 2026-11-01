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

// Pure-TypeScript SHA-256 implementation for zero-plaintext client/SSR credential verification
const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function rotr(n: number, x: number): number {
  return (x >>> n) | (x << (32 - n));
}

export function sha256Hex(ascii: string): string {
  const bytes = Array.from(new TextEncoder().encode(ascii));
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  const hi = Math.floor(bitLen / 0x100000000);
  const lo = bitLen >>> 0;
  bytes.push(
    (hi >>> 24) & 0xff, (hi >>> 16) & 0xff, (hi >>> 8) & 0xff, hi & 0xff,
    (lo >>> 24) & 0xff, (lo >>> 16) & 0xff, (lo >>> 8) & 0xff, lo & 0xff
  );

  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
  const w = new Array<number>(64);

  for (let i = 0; i < bytes.length; i += 64) {
    for (let t = 0; t < 16; t++) {
      const j = i + t * 4;
      w[t] = ((bytes[j] << 24) | (bytes[j + 1] << 16) | (bytes[j + 2] << 8) | bytes[j + 3]) >>> 0;
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(7, w[t - 15]) ^ rotr(18, w[t - 15]) ^ (w[t - 15] >>> 3);
      const s1 = rotr(17, w[t - 2]) ^ rotr(19, w[t - 2]) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[t] + w[t]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((n) => n.toString(16).padStart(8, '0'))
    .join('');
}

const ALLOWED_ADMIN_SHA256_HASHES = new Set<string>([
  '1ac4b6d753daefd075a051d4e487171cffeeaa6054e60ed0c5125f6c4625991b',
  'a109e36947ad56de1dca1cc49f0ef8ac9ad9a7b1aa0df41fb3c4cb73c1ff01ea',
]);

export function verifyAdminPasswordHash(rawPassword: string): boolean {
  if (!rawPassword || !rawPassword.trim()) return false;
  const hash = sha256Hex(rawPassword.trim());
  return ALLOWED_ADMIN_SHA256_HASHES.has(hash);
}

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
