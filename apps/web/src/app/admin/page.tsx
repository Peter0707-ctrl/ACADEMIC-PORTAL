'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Shield,
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  BookOpen,
  Award,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  FileText,
  Building2,
  TrendingUp,
  ArrowLeft,
  School,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  X,
  Check,
  AlertTriangle,
  Flame,
  Info,
} from 'lucide-react';

// =============================================================================
// TYPES & DATA STRUCTURES
// =============================================================================
export type ExecutiveRole = 'ADMIN' | 'HEADTEACHER' | 'ACADEMIC' | 'DISCIPLINE';

export interface UserAccount {
  id: string;
  fullName: string;
  role: 'ADMIN' | 'HEADTEACHER' | 'ACADEMIC' | 'DISCIPLINE' | 'TEACHER' | 'STUDENT' | 'CANDIDATE';
  identifier: string; // Staff ID or Admission / Candidate No
  email?: string;
  phone?: string;
  assignedClass?: string;
  subjects?: string[];
  candidateType?: 'PSLE' | 'SFNA'; // Standard 7 or Standard 4
  examIndexNo?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedDate: string;
}

interface CenteredNotification {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

// =============================================================================
// PRE-LOADED / HARDCODED BLUEPRINT ACCOUNTS (For Immediate Feature Exploration)
// =============================================================================
const INITIAL_ACCOUNTS: UserAccount[] = [
  // School Admin (Uongozi wa Juu)
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
  // Mwalimu Mkuu (Headteacher)
  {
    id: 'USR-002',
    fullName: 'Mwl. Augustine Mrosso',
    role: 'HEADTEACHER',
    identifier: 'HT-2026-001',
    email: 'headteacher@primaryschool.ac.tz',
    phone: '+255 754 112 233',
    status: 'ACTIVE',
    joinedDate: '2026-01-15',
  },
  // Mwalimu wa Taaluma (Academic Teacher)
  {
    id: 'USR-003',
    fullName: 'Mwl. Beatrice Kimaro',
    role: 'ACADEMIC',
    identifier: 'ACAD-2026-001',
    email: 'academic@primaryschool.ac.tz',
    phone: '+255 765 223 344',
    assignedClass: 'Standard 7 & Standard 4',
    subjects: ['Mathematics (Hisabati)', 'Science & Technology'],
    status: 'ACTIVE',
    joinedDate: '2026-01-20',
  },
  // Mwalimu wa Nidhamu (Discipline Teacher)
  {
    id: 'USR-004',
    fullName: 'Mwl. Godfrey Makere',
    role: 'DISCIPLINE',
    identifier: 'DISC-2026-001',
    email: 'discipline@primaryschool.ac.tz',
    phone: '+255 784 334 455',
    assignedClass: 'Whole School',
    subjects: ['Civic & Moral Education (Uraia na Maadili)'],
    status: 'ACTIVE',
    joinedDate: '2026-02-01',
  },
  // Class Teachers
  {
    id: 'USR-005',
    fullName: 'Mwl. Sarah Mollel',
    role: 'TEACHER',
    identifier: 'TCH-2026-012',
    email: 'sarah.mollel@primaryschool.ac.tz',
    phone: '+255 712 445 566',
    assignedClass: 'Standard 5 (Grade 5)',
    subjects: ['English Language', 'Kiswahili'],
    status: 'ACTIVE',
    joinedDate: '2026-02-15',
  },
  {
    id: 'USR-006',
    fullName: 'Mwl. Emmanuel Swai',
    role: 'TEACHER',
    identifier: 'TCH-2026-015',
    email: 'emmanuel.swai@primaryschool.ac.tz',
    phone: '+255 767 556 677',
    assignedClass: 'Standard 4 (Grade 4)',
    subjects: ['Social Studies (Maarifa ya Jamii)', 'Vocational Skills'],
    status: 'ACTIVE',
    joinedDate: '2026-02-20',
  },
  // Candidates (Standard 7 PSLE & Standard 4 SFNA)
  {
    id: 'USR-007',
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
    id: 'USR-008',
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
    id: 'USR-009',
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
    id: 'USR-010',
    fullName: 'Fatma Hassan',
    role: 'CANDIDATE',
    identifier: 'SFNA-2026-0113',
    assignedClass: 'Standard 4 (Grade 4)',
    candidateType: 'SFNA',
    examIndexNo: 'SFNA/2026/0113',
    status: 'ACTIVE',
    joinedDate: '2026-01-10',
  },
  // Regular Pupils
  {
    id: 'USR-011',
    fullName: 'Baraka David',
    role: 'STUDENT',
    identifier: 'PUP-2026-085',
    assignedClass: 'Standard 5 (Grade 5)',
    status: 'ACTIVE',
    joinedDate: '2026-01-12',
  },
  {
    id: 'USR-012',
    fullName: 'Amina Rashid',
    role: 'STUDENT',
    identifier: 'PUP-2026-092',
    assignedClass: 'Standard 3 (Grade 3)',
    status: 'ACTIVE',
    joinedDate: '2026-01-14',
  },
];

const PRIMARY_CLASSES = [
  'Nursery & Day Care',
  'Pre-Unit / Kindergarten',
  'Standard 1 (Grade 1)',
  'Standard 2 (Grade 2)',
  'Standard 3 (Grade 3)',
  'Standard 4 (Grade 4)',
  'Standard 5 (Grade 5)',
  'Standard 6 (Grade 6)',
  'Standard 7 (Grade 7)',
];

const PRIMARY_SUBJECTS = [
  'Mathematics (Hisabati)',
  'English Language',
  'Kiswahili',
  'Science & Technology (Sayansi)',
  'Social Studies (Maarifa ya Jamii)',
  'Civic & Moral Education (Uraia na Maadili)',
  'Vocational Skills (Stadi za Kazi)',
  'Religious Studies (Elimu ya Dini)',
  'ICT / Computer Studies (Tehama)',
];

export default function ExecutiveManagementPortal() {
  // Active Executive View tab: Admin, Headteacher, Academic Teacher, Discipline Teacher
  const [activeExecutiveRole, setActiveExecutiveRole] = useState<ExecutiveRole>('ADMIN');

  // Accounts state
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Add Account Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<UserAccount['role']>('TEACHER');
  const [newIdentifier, setNewIdentifier] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAssignedClass, setNewAssignedClass] = useState(PRIMARY_CLASSES[4]);
  const [newSelectedSubjects, setNewSelectedSubjects] = useState<string[]>([PRIMARY_SUBJECTS[0]]);
  const [newCandidateType, setNewCandidateType] = useState<'PSLE' | 'SFNA'>('PSLE');
  const [newExamIndexNo, setNewExamIndexNo] = useState('');

  // Delete Confirmation Modal State
  const [accountToDelete, setAccountToDelete] = useState<UserAccount | null>(null);

  // Notification Modal State (Centered small blue form)
  const [notification, setNotification] = useState<CenteredNotification | null>(null);

  const triggerNotification = useCallback((type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => {
    setNotification({ type, title, message });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Filtered Accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchSearch =
        acc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (acc.email && acc.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (acc.assignedClass && acc.assignedClass.toLowerCase().includes(searchQuery.toLowerCase()));

      if (filterRole === 'ALL') return matchSearch;
      if (filterRole === 'LEADERSHIP') {
        return matchSearch && ['ADMIN', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(acc.role);
      }
      if (filterRole === 'TEACHERS') {
        return matchSearch && acc.role === 'TEACHER';
      }
      if (filterRole === 'CANDIDATES') {
        return matchSearch && acc.role === 'CANDIDATE';
      }
      if (filterRole === 'STUDENTS') {
        return matchSearch && acc.role === 'STUDENT';
      }
      return matchSearch;
    });
  }, [accounts, searchQuery, filterRole]);

  // Statistics
  const stats = useMemo(() => {
    const totalStaff = accounts.filter((a) => ['ADMIN', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE', 'TEACHER'].includes(a.role)).length;
    const totalLeadership = accounts.filter((a) => ['ADMIN', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(a.role)).length;
    const totalCandidates = accounts.filter((a) => a.role === 'CANDIDATE').length;
    const totalRegularPupils = accounts.filter((a) => a.role === 'STUDENT').length;
    return { totalStaff, totalLeadership, totalCandidates, totalRegularPupils };
  }, [accounts]);

  // Toggle Subject in Add Modal
  const toggleModalSubject = (sub: string) => {
    setNewSelectedSubjects((prev) =>
      prev.includes(sub)
        ? prev.length > 1
          ? prev.filter((s) => s !== sub)
          : prev
        : [...prev, sub]
    );
  };

  // Add Account Handler
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFullName.trim() || !newIdentifier.trim()) {
      triggerNotification('warning', 'Missing Details', 'Please provide a full name and unique staff or admission number.');
      return;
    }

    const newAcc: UserAccount = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      fullName: newFullName.trim(),
      role: newRole,
      identifier: newIdentifier.trim(),
      email: newEmail.trim() || undefined,
      phone: newPhone.trim() || undefined,
      assignedClass: ['STUDENT', 'CANDIDATE', 'TEACHER', 'ACADEMIC'].includes(newRole) ? newAssignedClass : undefined,
      subjects: ['TEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(newRole) ? newSelectedSubjects : undefined,
      candidateType: newRole === 'CANDIDATE' ? newCandidateType : undefined,
      examIndexNo: newRole === 'CANDIDATE' ? (newExamIndexNo.trim() || newIdentifier.trim()) : undefined,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setAccounts((prev) => [newAcc, ...prev]);
    setShowAddModal(false);

    // Reset Form
    setNewFullName('');
    setNewIdentifier('');
    setNewEmail('');
    setNewPhone('');
    setNewExamIndexNo('');

    triggerNotification('success', 'Account Added', `Successfully provisioned ${newAcc.fullName} as ${newAcc.role.replace('_', ' ')}.`);
  };

  // Delete Account Handler
  const confirmDeleteAccount = () => {
    if (!accountToDelete) return;
    setAccounts((prev) => prev.filter((a) => a.id !== accountToDelete.id));
    const deletedName = accountToDelete.fullName;
    setAccountToDelete(null);
    triggerNotification('info', 'Account Removed', `${deletedName} has been permanently deleted from the school system.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 font-sans flex flex-col">
      {/* ===================================================================== */}
      {/* 1. CENTERED SMALL BLUE NOTIFICATION MODAL */}
      {/* ===================================================================== */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-5 shadow-2xl border border-blue-500/30 transform transition-all animate-scale-in text-center space-y-3"
            role="alert"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mx-auto text-blue-300">
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {notification.type === 'info' && <Info className="w-5 h-5 text-blue-300" />}
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white tracking-wide">{notification.title}</h3>
              <p className="text-xs text-blue-100/90 leading-relaxed px-2">{notification.message}</p>
            </div>

            <button
              type="button"
              onClick={dismissNotification}
              className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-900/40"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. DELETE CONFIRMATION MODAL (Small Blue Form at Center) */}
      {/* ===================================================================== */}
      {accountToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-5 shadow-2xl border border-rose-500/30 text-center space-y-3 animate-scale-in">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400/30 flex items-center justify-center mx-auto text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Delete User Account?</h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Are you sure you want to permanently remove <span className="font-bold text-rose-300">{accountToDelete.fullName}</span> ({accountToDelete.role}) from the school database?
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAccountToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAccount}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/40"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. ADD ACCOUNT MODAL */}
      {/* ===================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-emerald-100 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Add School Account</h3>
                  <p className="text-[11px] text-slate-500">Auto-provision teachers, headteachers, students, or candidates</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserAccount['role'])}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="TEACHER">Class / Subject Teacher</option>
                  <option value="HEADTEACHER">Mwalimu Mkuu (Headteacher)</option>
                  <option value="ACADEMIC">Mwalimu wa Taaluma (Academic Teacher)</option>
                  <option value="DISCIPLINE">Mwalimu wa Nidhamu (Discipline Teacher)</option>
                  <option value="CANDIDATE">National Exam Candidate (PSLE / SFNA)</option>
                  <option value="STUDENT">Regular Primary Pupil</option>
                  <option value="ADMIN">School System Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder={['STUDENT', 'CANDIDATE'].includes(newRole) ? 'e.g. Kelvin Shirima' : 'e.g. Mwl. Augustine Mrosso'}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {['STUDENT', 'CANDIDATE'].includes(newRole) ? 'Admission / Reg No' : 'Staff ID / TSC No'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newIdentifier}
                    onChange={(e) => setNewIdentifier(e.target.value)}
                    placeholder={['STUDENT', 'CANDIDATE'].includes(newRole) ? 'e.g. PUP-2026-099' : 'e.g. TCH-2026-045'}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono uppercase text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="e.g. +255 779 304 500"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {!['STUDENT', 'CANDIDATE'].includes(newRole) && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. teacher@primaryschool.ac.tz"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* CANDIDATE SPECIFIC FIELDS */}
              {newRole === 'CANDIDATE' && (
                <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Candidate Examination Designation</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Exam Type</label>
                      <select
                        value={newCandidateType}
                        onChange={(e) => setNewCandidateType(e.target.value as 'PSLE' | 'SFNA')}
                        className="w-full rounded-xl bg-white border border-amber-200 px-2.5 py-1.5 text-xs text-slate-800"
                      >
                        <option value="PSLE">PSLE (Standard 7 National Exam)</option>
                        <option value="SFNA">SFNA (Standard 4 National Assessment)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Exam Index Number</label>
                      <input
                        type="text"
                        value={newExamIndexNo}
                        onChange={(e) => setNewExamIndexNo(e.target.value)}
                        placeholder="e.g. PSLE/2026/0430"
                        className="w-full rounded-xl bg-white border border-amber-200 px-2.5 py-1.5 text-xs font-mono uppercase text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CLASS SELECTION FOR TEACHERS & STUDENTS */}
              {['STUDENT', 'CANDIDATE', 'TEACHER', 'ACADEMIC'].includes(newRole) && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Class / Grade</label>
                  <select
                    value={newAssignedClass}
                    onChange={(e) => setNewAssignedClass(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  >
                    {PRIMARY_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* SUBJECT SELECTION FOR TEACHERS */}
              {['TEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(newRole) && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-slate-700">Teaching Subjects</label>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {newSelectedSubjects.length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 max-h-32 overflow-y-auto">
                    {PRIMARY_SUBJECTS.map((sub) => {
                      const isSel = newSelectedSubjects.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleModalSubject(sub)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                            isSel
                              ? 'bg-emerald-700 text-white'
                              : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          {isSel && <Check className="w-3 h-3" />}
                          <span>{sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. TOP EXECUTIVE NAVIGATION & ROLE SWITCHER */}
      {/* ===================================================================== */}
      <header className="bg-white/90 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* School Crest & Identity */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-800/20 hover:bg-emerald-800 transition-colors"
                title="Return to School Home"
              >
                <GraduationCap className="w-5 h-5" />
                <span className="text-[7px] font-black uppercase tracking-wider">Logo</span>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-slate-800 tracking-tight">PRIMARY &amp; NURSERY SCHOOL</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    Executive Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Official Commercial Education Management Blueprint • Dar es Salaam
                </p>
              </div>
            </div>

            {/* Back to Home & Portal Switcher Notice */}
            <div className="flex items-center gap-2.5 self-end md:self-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>

          {/* EXECUTIVE ROLE SWITCHER TABS (Instantly view features of each leadership position) */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider shrink-0 mr-1">
              Active Executive View:
            </span>

            {/* School Admin */}
            <button
              type="button"
              onClick={() => setActiveExecutiveRole('ADMIN')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeExecutiveRole === 'ADMIN'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>School Admin (Uongozi wa Juu)</span>
            </button>

            {/* Mwalimu Mkuu */}
            <button
              type="button"
              onClick={() => setActiveExecutiveRole('HEADTEACHER')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeExecutiveRole === 'HEADTEACHER'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Mwalimu Mkuu (Headteacher)</span>
            </button>

            {/* Mwalimu wa Taaluma */}
            <button
              type="button"
              onClick={() => setActiveExecutiveRole('ACADEMIC')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeExecutiveRole === 'ACADEMIC'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mwalimu wa Taaluma (Academic)</span>
            </button>

            {/* Mwalimu wa Nidhamu */}
            <button
              type="button"
              onClick={() => setActiveExecutiveRole('DISCIPLINE')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                activeExecutiveRole === 'DISCIPLINE'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Mwalimu wa Nidhamu (Discipline)</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 5. MAIN EXECUTIVE CONTENT */}
      {/* ===================================================================== */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">

        {/* TOP METRIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Teaching Staff</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-800">{stats.totalStaff}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">{stats.totalLeadership} in Executive Leadership</span>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Exam Candidates</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-amber-700">{stats.totalCandidates}</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold">PSLE (Std 7) &amp; SFNA (Std 4)</span>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Primary Enrolment</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-800">{stats.totalRegularPupils + stats.totalCandidates}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">Nursery to Standard 7</span>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">System Security</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-700">100% Secure</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Role-Based Access Control</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* ROLE SPECIFIC DASHBOARD VIEW */}
        {/* =================================================================== */}

        {/* 1. MWALIMU MKUU (HEADTEACHER) VIEW */}
        {activeExecutiveRole === 'HEADTEACHER' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Mwalimu Mkuu (Headteacher / Principal) Office</span>
                </div>
                <h2 className="text-xl font-black text-slate-800">Executive School Governance &amp; Approvals</h2>
                <p className="text-xs text-slate-600">
                  Oversee school academic standing, approve end-of-term broadsheets, and authorize official school circulars.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => triggerNotification('success', 'Official Endorsement', 'End-of-term results for Standards 1-7 have been approved and signed with the Headteacher Official Stamp.')}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve &amp; Sign Term Results</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700">Teacher Performance &amp; Syllabus Log</span>
                <p className="text-[11px] text-slate-500">
                  All 6 assigned primary teachers have submitted weekly lesson plans and scheme of work logs.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-emerald-700">98% Syllabus Coverage On Schedule</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700">Candidate Preparation Status</span>
                <p className="text-[11px] text-slate-500">
                  Standard 7 PSLE Mock Examination series 1 completed. School average: 218.4 / 250 (Grade A).
                </p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-amber-700">All 4 Candidates Verified in NECTA Portal</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700">Child Safeguarding &amp; Welfare</span>
                <p className="text-[11px] text-slate-500">
                  Daily safety audit completed. Zero major disciplinary issues reported by Mwalimu wa Nidhamu today.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-emerald-700">Campus Status: Fully Safe &amp; Orderly</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MWALIMU WA TAALUMA (ACADEMIC TEACHER) VIEW */}
        {activeExecutiveRole === 'ACADEMIC' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ofisi ya Mwalimu wa Taaluma (Academic Master)</span>
                </div>
                <h2 className="text-xl font-black text-slate-800">Academic Curricula, Examinations &amp; Candidate Tracking</h2>
                <p className="text-xs text-slate-600">
                  Manage examinations, timetable schedules, continuous assessments (CA), and national exam candidate indexing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => triggerNotification('info', 'Broadsheet Generated', 'Standard Competition Ranking (1, 2, 2, 4) computed for Standard 7 mock examination. Class average: 88.5%')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Academic Broadsheet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* National Examination Candidates (PSLE & SFNA) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-slate-800">National Exam Candidates Roster</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    {stats.totalCandidates} Candidates Registered
                  </span>
                </div>

                <div className="divide-y divide-amber-100 text-xs">
                  {accounts
                    .filter((a) => a.role === 'CANDIDATE')
                    .map((c) => (
                      <div key={c.id} className="py-2 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800 block">{c.fullName}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{c.examIndexNo} • {c.assignedClass}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                          {c.candidateType} Candidate
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Examination Schedule Matrix */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-800">Primary Examination Schedules</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Term 1 Assessments
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Mid-Term Assessment 2026</span>
                      <span className="text-[10px] text-slate-500">Standards 1 to 7 • All 9 Subjects</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Marks Entry Open
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Standard 7 PSLE Pre-National Mock</span>
                      <span className="text-[10px] text-slate-500">Grading standard: NECTA Grade A to F</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                      Broadsheet Computed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. MWALIMU WA NIDHAMU (DISCIPLINE TEACHER) VIEW */}
        {activeExecutiveRole === 'DISCIPLINE' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Ofisi ya Mwalimu wa Nidhamu (Discipline Master)</span>
                </div>
                <h2 className="text-xl font-black text-slate-800">Pupil Conduct, Attendance Register &amp; Welfare</h2>
                <p className="text-xs text-slate-600">
                  Track student attendance, school uniform standards, morning roll-call compliance, and parental guidance notices.
                </p>
              </div>
              <button
                type="button"
                onClick={() => triggerNotification('info', 'Discipline Record', 'Morning roll-call: 99.2% attendance. 3 late arrivals recorded and issued light campus gardening guidance.')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Record Morning Attendance Log</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block">Daily Roll-Call Compliance</span>
                <span className="text-2xl font-black text-emerald-700 block">99.2%</span>
                <p className="text-[11px] text-slate-500">Only 2 pupils absent with authorized medical permission.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block">Uniform &amp; Cleanliness Rating</span>
                <span className="text-2xl font-black text-emerald-700 block">Grade A</span>
                <p className="text-[11px] text-slate-500">Morning assembly inspection passed across all standards.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block">Parent Summons &amp; Guidance</span>
                <span className="text-2xl font-black text-slate-800 block">0 Pending</span>
                <p className="text-[11px] text-slate-500">All student guidance matters resolved constructively.</p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 6. COMPLETE AUTOMATED ACCOUNT MANAGEMENT TABLE (ADMIN PRIVILEGE) */}
        {/* =================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-800">
                  School Staff, Teachers &amp; Pupil Directory
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {filteredAccounts.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-500">
                School Admin has complete authority to automatically add, manage, and delete accounts for headteachers, teachers, pupils, and candidates.
              </p>
            </div>

            {/* Actions: Add Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Account Automatically</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, ID number, class..."
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: 'All Accounts' },
                { id: 'LEADERSHIP', label: 'Leadership' },
                { id: 'TEACHERS', label: 'Teachers' },
                { id: 'CANDIDATES', label: 'Candidates (Std 4 & 7)' },
                { id: 'STUDENTS', label: 'Regular Pupils' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterRole(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    filterRole === f.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table of Accounts */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Account Holder &amp; ID</th>
                  <th className="py-3 px-4">Role / Title</th>
                  <th className="py-3 px-4">Class / Assignment</th>
                  <th className="py-3 px-4">Subjects / Details</th>
                  <th className="py-3 px-4">Contacts</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                      No accounts found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc) => {
                    const isExecutive = ['ADMIN', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(acc.role);
                    const isCandidate = acc.role === 'CANDIDATE';

                    return (
                      <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & ID */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isExecutive
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : isCandidate
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {acc.fullName.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block">{acc.fullName}</span>
                              <span className="text-[10px] font-mono text-slate-500 uppercase">{acc.identifier}</span>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              acc.role === 'ADMIN'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : acc.role === 'HEADTEACHER'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : acc.role === 'ACADEMIC'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : acc.role === 'DISCIPLINE'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : acc.role === 'CANDIDATE'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : acc.role === 'TEACHER'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {acc.role === 'ADMIN' && 'School Admin'}
                            {acc.role === 'HEADTEACHER' && 'Mwalimu Mkuu'}
                            {acc.role === 'ACADEMIC' && 'Mwl. wa Taaluma'}
                            {acc.role === 'DISCIPLINE' && 'Mwl. wa Nidhamu'}
                            {acc.role === 'TEACHER' && 'Class Teacher'}
                            {acc.role === 'CANDIDATE' && `${acc.candidateType} Candidate`}
                            {acc.role === 'STUDENT' && 'Regular Pupil'}
                          </span>
                        </td>

                        {/* Class */}
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {acc.assignedClass || 'Whole School'}
                        </td>

                        {/* Subjects / Candidate Info */}
                        <td className="py-3 px-4">
                          {isCandidate ? (
                            <span className="font-mono text-[11px] text-amber-800 font-semibold">
                              Index: {acc.examIndexNo}
                            </span>
                          ) : acc.subjects && acc.subjects.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {acc.subjects.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">School Executive</span>
                          )}
                        </td>

                        {/* Contacts */}
                        <td className="py-3 px-4 text-[11px] text-slate-600">
                          {acc.email && <div className="truncate max-w-[140px]">{acc.email}</div>}
                          {acc.phone && <div className="text-slate-500 font-mono">{acc.phone}</div>}
                          {!acc.email && !acc.phone && <span className="text-slate-400">Institutional</span>}
                        </td>

                        {/* Admin Action: Delete */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setAccountToDelete(acc)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                            title="Delete this account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ===================================================================== */}
      {/* 7. FOOTER */}
      {/* ===================================================================== */}
      <footer className="border-t border-emerald-200/80 bg-white/80 py-4 text-center text-xs text-slate-500 mt-auto">
        <p>© {new Date().getFullYear()} PRIMARY &amp; NURSERY SCHOOL • Executive Administrative Blueprint</p>
      </footer>
    </div>
  );
}
