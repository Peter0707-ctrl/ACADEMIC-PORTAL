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

export const INITIAL_BLUEPRINT_ACCOUNTS: UserAccount[] = [
  // 1. School Admin (Uongozi Mkuu wa Mfumo)
  {
    id: 'USR-001',
    fullName: 'Peter Msira',
    role: 'ADMIN',
    identifier: 'ADM-2026-001',
    email: 'admin@primaryschool.ac.tz',
    phone: '+255 779 304 500',
    status: 'ACTIVE',
    joinedDate: '2026-01-10',
  },
  // 2. Mwalimu Mkuu (Headteacher / Principal - Enters as Teacher Leader)
  {
    id: 'USR-002',
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
  // 3. Mwalimu wa Taaluma (Academic Master - Enters as Teacher Leader)
  {
    id: 'USR-003',
    fullName: 'Mwl. Beatrice Kimaro',
    role: 'ACADEMIC',
    leadershipRole: 'ACADEMIC',
    identifier: 'ACAD-2026-001',
    email: 'academic@primaryschool.ac.tz',
    phone: '+255 765 223 344',
    assignedClass: 'Standard 7 & Standard 4',
    assignedClasses: ['Standard 7 (Grade 7)', 'Standard 4 (Grade 4)'],
    subjects: ['Mathematics (Hisabati)', 'Science & Technology (Sayansi)'],
    status: 'ACTIVE',
    joinedDate: '2026-01-20',
  },
  // 4. Mwalimu wa Nidhamu (Discipline Master - Enters as Teacher Leader)
  {
    id: 'USR-004',
    fullName: 'Mwl. Godfrey Makere',
    role: 'DISCIPLINE',
    leadershipRole: 'DISCIPLINE',
    identifier: 'DISC-2026-001',
    email: 'discipline@primaryschool.ac.tz',
    phone: '+255 784 334 455',
    assignedClass: 'Whole School',
    assignedClasses: ['Standard 5 (Grade 5)', 'Standard 6 (Grade 6)'],
    subjects: ['Civic & Moral Education (Uraia na Maadili)', 'Vocational Skills (Stadi za Kazi)'],
    status: 'ACTIVE',
    joinedDate: '2026-02-01',
  },
  // 5. Class Teacher (Standard 5 Homeroom Master)
  {
    id: 'USR-005',
    fullName: 'Mwl. Sarah Mollel',
    role: 'TEACHER',
    identifier: 'TCH-2026-012',
    email: 'sarah.mollel@primaryschool.ac.tz',
    phone: '+255 712 445 566',
    assignedClass: 'Standard 5 (Grade 5)',
    assignedClasses: ['Standard 5 (Grade 5)', 'Standard 6 (Grade 6)'],
    subjects: ['English Language', 'Kiswahili'],
    isHomeroomMaster: true,
    status: 'ACTIVE',
    joinedDate: '2026-02-15',
  },
  // 6. Subject Teacher (Standard 4 & 3)
  {
    id: 'USR-006',
    fullName: 'Mwl. Emmanuel Swai',
    role: 'TEACHER',
    identifier: 'TCH-2026-015',
    email: 'emmanuel.swai@primaryschool.ac.tz',
    phone: '+255 767 556 677',
    assignedClass: 'Standard 4 (Grade 4)',
    assignedClasses: ['Standard 4 (Grade 4)', 'Standard 3 (Grade 3)'],
    subjects: ['Social Studies (Maarifa ya Jamii)', 'Vocational Skills'],
    isHomeroomMaster: false,
    status: 'ACTIVE',
    joinedDate: '2026-02-20',
  },
  // 7. Subject Teacher (Science & Math)
  {
    id: 'USR-007',
    fullName: 'Mwl. Juma Mwita',
    role: 'TEACHER',
    identifier: 'TCH-2026-018',
    email: 'juma.mwita@primaryschool.ac.tz',
    phone: '+255 789 667 788',
    assignedClass: 'Standard 6 & 7',
    assignedClasses: ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)'],
    subjects: ['Mathematics (Hisabati)', 'Science & Technology'],
    isHomeroomMaster: false,
    status: 'ACTIVE',
    joinedDate: '2026-02-25',
  },
  // 8. Candidates (Standard 7 PSLE & Standard 4 SFNA)
  {
    id: 'USR-008',
    fullName: 'Kelvin Shirima',
    role: 'CANDIDATE',
    identifier: 'PSLE-2026-0428',
    assignedClass: 'Standard 7 (Grade 7)',
    candidateType: 'PSLE',
    examIndexNo: 'PSLE/2026/0428',
    status: 'ACTIVE',
    joinedDate: '2026-01-08',
  },
  {
    id: 'USR-009',
    fullName: 'Neema Massawe',
    role: 'CANDIDATE',
    identifier: 'PSLE-2026-0429',
    assignedClass: 'Standard 7 (Grade 7)',
    candidateType: 'PSLE',
    examIndexNo: 'PSLE/2026/0429',
    status: 'ACTIVE',
    joinedDate: '2026-01-08',
  },
  {
    id: 'USR-010',
    fullName: 'Juma Bakari',
    role: 'CANDIDATE',
    identifier: 'SFNA-2026-0112',
    assignedClass: 'Standard 4 (Grade 4)',
    candidateType: 'SFNA',
    examIndexNo: 'SFNA/2026/0112',
    status: 'ACTIVE',
    joinedDate: '2026-01-10',
  },
  {
    id: 'USR-011',
    fullName: 'Fatma Hassan',
    role: 'CANDIDATE',
    identifier: 'SFNA-2026-0113',
    assignedClass: 'Standard 4 (Grade 4)',
    candidateType: 'SFNA',
    examIndexNo: 'SFNA/2026/0113',
    status: 'ACTIVE',
    joinedDate: '2026-01-10',
  },
  // 9. Regular Pupils
  {
    id: 'USR-012',
    fullName: 'Baraka David',
    role: 'STUDENT',
    identifier: 'PUP-2026-085',
    assignedClass: 'Standard 5 (Grade 5)',
    status: 'ACTIVE',
    joinedDate: '2026-01-12',
  },
  {
    id: 'USR-013',
    fullName: 'Amina Rashid',
    role: 'STUDENT',
    identifier: 'PUP-2026-092',
    assignedClass: 'Standard 3 (Grade 3)',
    status: 'ACTIVE',
    joinedDate: '2026-01-14',
  },
  // 10. Parent Account
  {
    id: 'USR-014',
    fullName: 'Mzee Bakari Juma (Mzazi)',
    role: 'PARENT',
    identifier: '+255755123456',
    phone: '+255 755 123 456',
    email: 'bakari.parent@gmail.com',
    assignedClass: 'Parent of Juma Bakari (Std 4)',
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
];

const ACCOUNTS_STORAGE_KEY = 'academic_portal_accounts_v1';
const SESSION_STORAGE_KEY = 'academic_portal_active_session_v1';

// Get Stored Accounts (or initialize with blueprint)
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

// Get Current Logged-in Session
export function getCurrentSession(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
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
    // ONLY System Admin (Uongozi Mkuu wa Mfumo) enters /admin to manage & delete accounts
    return user.role === 'ADMIN';
  }

  if (targetPortal === 'TEACHER') {
    // All Teaching staff: Headteacher, Academic Master, Discipline Master, and Class Teachers
    return ['TEACHER', 'ACADEMIC', 'DISCIPLINE', 'HEADTEACHER', 'ADMIN'].includes(user.role);
  }

  if (targetPortal === 'STUDENT') {
    // Only Students, Candidates, or Admin
    return ['STUDENT', 'CANDIDATE', 'ADMIN'].includes(user.role);
  }

  if (targetPortal === 'PARENT') {
    return ['PARENT', 'ADMIN'].includes(user.role);
  }

  return false;
}
