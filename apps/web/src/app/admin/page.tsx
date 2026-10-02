'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Info,
  LogOut,
} from 'lucide-react';
import {
  UserAccount,
  getStoredAccounts,
  setStoredAccounts,
  getCurrentSession,
  clearCurrentSession,
} from '@/lib/auth-session';

interface CenteredNotification {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

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

export default function SystemAdminPortal() {
  const router = useRouter();

  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Accounts state
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
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

  // 1. Strict Security Guard: ONLY role === 'ADMIN' enters this page!
  useEffect(() => {
    const session = getCurrentSession();
    if (!session || session.role !== 'ADMIN') {
      setIsAuthorized(false);
      triggerNotification(
        'error',
        'Ufikiaji Umezuiwa (Access Restricted)',
        'Eneo hili la Usimamizi Mkuu wa Mfumo ni la Admin pekee. Mwalimu Mkuu anasimamia walimu wake pekee kupitia Portal ya Mwalimu.'
      );
      return;
    }

    setIsAuthorized(true);
    setCurrentUser(session);
    setAccounts(getStoredAccounts());
  }, [triggerNotification]);

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
      triggerNotification('warning', 'Taarifa Hazijakamilika', 'Tafadhali weka jina kamili na namba ya kitambulisho au usajili.');
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
      subjects: ['TEACHER', 'ACADEMIC', 'DISCIPLINE', 'HEADTEACHER'].includes(newRole) ? newSelectedSubjects : undefined,
      candidateType: newRole === 'CANDIDATE' ? newCandidateType : undefined,
      examIndexNo: newRole === 'CANDIDATE' ? (newExamIndexNo.trim() || newIdentifier.trim()) : undefined,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const updated = [newAcc, ...accounts];
    setAccounts(updated);
    setStoredAccounts(updated);
    setShowAddModal(false);

    // Reset Form
    setNewFullName('');
    setNewIdentifier('');
    setNewEmail('');
    setNewPhone('');
    setNewExamIndexNo('');

    triggerNotification('success', 'Akaunti Imesajiliwa', `Mtumiaji ${newAcc.fullName} amesajiliwa kikamilifu kama ${newAcc.role.replace('_', ' ')}.`);
  };

  // Delete Account Handler
  const confirmDeleteAccount = () => {
    if (!accountToDelete) return;
    const updated = accounts.filter((a) => a.id !== accountToDelete.id);
    setAccounts(updated);
    setStoredAccounts(updated);
    const deletedName = accountToDelete.fullName;
    setAccountToDelete(null);
    triggerNotification('info', 'Akaunti Imefutwa', `${deletedName} ameondolewa moja kwa moja kwenye mfumo wa shule.`);
  };

  const handleLogout = () => {
    clearCurrentSession();
    router.push('/');
  };

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
    const totalStaff = accounts.filter((a) => ['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(a.role)).length;
    const totalLeadership = accounts.filter((a) => ['ADMIN', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(a.role)).length;
    const totalCandidates = accounts.filter((a) => a.role === 'CANDIDATE').length;
    const totalRegularPupils = accounts.filter((a) => a.role === 'STUDENT').length;
    return { totalStaff, totalLeadership, totalCandidates, totalRegularPupils };
  }, [accounts]);

  // If unauthorized, block view with centered small blue modal
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        {notification && (
          <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-6 shadow-2xl text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold">{notification.title}</h3>
            <p className="text-xs text-blue-100/90 leading-relaxed">{notification.message}</p>
            <Link
              href="/teacher"
              className="block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs transition-colors"
            >
              Rudi kwenye Portal ya Walimu
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 font-sans flex flex-col">
      {/* 1. Centered Small Blue Notification Modal */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-5 shadow-2xl border border-blue-500/30 text-center space-y-3 animate-scale-in"
            role="alert"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mx-auto text-blue-300">
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {notification.type === 'info' && <Info className="w-5 h-5 text-blue-300" />}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold tracking-wide">{notification.title}</h3>
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

      {/* 2. Delete Confirmation Modal (Small Blue Form at Center) */}
      {accountToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] text-white p-5 shadow-2xl border border-rose-500/30 text-center space-y-3 animate-scale-in">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400/30 flex items-center justify-center mx-auto text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Thibitisha Kufuta Akaunti?</h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Je, una uhakika unataka kumfuta kabisa <span className="font-bold text-rose-300">{accountToDelete.fullName}</span> ({accountToDelete.role}) kutoka kwenye mfumo wa shule?
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAccountToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-all"
              >
                Ghairi (Cancel)
              </button>
              <button
                type="button"
                onClick={confirmDeleteAccount}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/40"
              >
                Thibitisha Kufuta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-emerald-100 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Sajili Mtumiaji Mpya (Add Account)</h3>
                  <p className="text-[11px] text-slate-500">Admin husajili walimu, wakuu wa shule, wanafunzi, au watahiniwa</p>
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
                <label className="block font-semibold text-slate-700 mb-1">Chagua Jukumu (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserAccount['role'])}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="TEACHER">Mwalimu wa Darasa (Class Teacher)</option>
                  <option value="HEADTEACHER">Mwalimu Mkuu (Headteacher / Principal)</option>
                  <option value="ACADEMIC">Mwalimu wa Taaluma (Academic Teacher)</option>
                  <option value="DISCIPLINE">Mwalimu wa Nidhamu (Discipline Teacher)</option>
                  <option value="CANDIDATE">Mtahiniwa wa Taifa (PSLE / SFNA Candidate)</option>
                  <option value="STUDENT">Mwanafunzi wa Kawaida (Regular Pupil)</option>
                  <option value="ADMIN">Msimamizi wa Mfumo (School System Admin)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jina Kamili</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder={['STUDENT', 'CANDIDATE'].includes(newRole) ? 'k.m. Kelvin Shirima' : 'k.m. Mwl. Augustine Mrosso'}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {['STUDENT', 'CANDIDATE'].includes(newRole) ? 'Namba ya Usajili (Adm No)' : 'Staff ID / TSC No'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newIdentifier}
                    onChange={(e) => setNewIdentifier(e.target.value)}
                    placeholder={['STUDENT', 'CANDIDATE'].includes(newRole) ? 'PUP-2026-095' : 'TCH-2026-020'}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Namba ya Simu</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+255 7..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Barua Pepe (Email)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="mfano@primaryschool.ac.tz"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* CANDIDATE SPECIFIC */}
              {newRole === 'CANDIDATE' && (
                <div className="grid grid-cols-2 gap-3 bg-purple-50/50 p-3 rounded-2xl border border-purple-100">
                  <div>
                    <label className="block font-semibold text-purple-900 mb-1">Aina ya Mtihani</label>
                    <select
                      value={newCandidateType}
                      onChange={(e) => setNewCandidateType(e.target.value as 'PSLE' | 'SFNA')}
                      className="w-full rounded-xl bg-white border border-purple-200 px-3 py-2 text-xs text-slate-800"
                    >
                      <option value="PSLE">PSLE (Standard 7)</option>
                      <option value="SFNA">SFNA (Standard 4)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-purple-900 mb-1">Index Number (NECTA)</label>
                    <input
                      type="text"
                      value={newExamIndexNo}
                      onChange={(e) => setNewExamIndexNo(e.target.value)}
                      placeholder="PSLE-2026-0435"
                      className="w-full rounded-xl bg-white border border-purple-200 px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* CLASS ASSIGNMENT */}
              {['STUDENT', 'CANDIDATE', 'TEACHER', 'ACADEMIC'].includes(newRole) && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Darasa Analohusika</label>
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
              {['TEACHER', 'ACADEMIC', 'DISCIPLINE', 'HEADTEACHER'].includes(newRole) && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-slate-700">Masomo ya Kufundisha</label>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {newSelectedSubjects.length} yamechaguliwa
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
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sajili Akaunti</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
                    School System Admin Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Usimamizi Mkuu wa Akaunti za Watumiaji Wote (Users Provisioning &amp; Deletion)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block">{currentUser?.fullName}</span>
                <span className="text-[10px] font-mono text-emerald-700 font-semibold">{currentUser?.identifier} (SYSTEM ADMIN)</span>
              </div>

              <Link
                href="/teacher"
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/80 transition-all flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Portal ya Mwalimu</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-all border border-slate-200 hover:border-rose-200"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Walimu Shuleni</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-800">{stats.totalStaff}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">Chini ya Mwalimu Mkuu</span>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Watahiniwa wa Taifa</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-amber-700">{stats.totalCandidates}</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold">PSLE (Std 7) &amp; SFNA (Std 4)</span>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Wanafunzi wa Kawaida</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-800">{stats.totalRegularPupils}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">Nursery hadi Standard 6</span>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Jumla ya Akaunti</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-800">{accounts.length}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Zinasimamiwa na Admin</span>
          </div>
        </div>

        {/* COMPLETE AUTOMATED ACCOUNT MANAGEMENT TABLE (ADMIN PRIVILEGE ONLY) */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-800">
                  Daftari Kuu la Watumiaji Wote wa Shule
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {filteredAccounts.length} Zimepatikana
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin pekee ndiye anayeweza kuona kila mtumiaji, kutafuta, kusajili, na kumfuta moja kwa moja.
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
                <span>Ongeza Mtumiaji Mpya (+ Add)</span>
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
                placeholder="Tafuta mtumiaji kwa jina, kitambulisho, darasa, email..."
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: 'Watumiaji Wote' },
                { id: 'TEACHERS', label: 'Walimu Pekee' },
                { id: 'CANDIDATES', label: 'Watahiniwa (PSLE & SFNA)' },
                { id: 'STUDENTS', label: 'Wanafunzi wa Kawaida' },
                { id: 'LEADERSHIP', label: 'Uongozi wa Shule' },
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
                  <th className="py-3 px-4">Mtumiaji &amp; Kitambulisho</th>
                  <th className="py-3 px-4">Jukumu (Role)</th>
                  <th className="py-3 px-4">Darasa / Mgawo</th>
                  <th className="py-3 px-4">Masomo / Maelezo</th>
                  <th className="py-3 px-4">Mawasiliano</th>
                  <th className="py-3 px-4 text-right">Vitendo vya Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                      Hakuna akaunti iliyopatikana kulingana na utafutaji wako.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc) => {
                    const isExecutive = ['ADMIN', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(acc.role);
                    const isCandidate = acc.role === 'CANDIDATE';
                    const isTeacher = acc.role === 'TEACHER';

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

                        {/* Role Badge */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              acc.role === 'ADMIN'
                                ? 'bg-slate-900 text-white'
                                : acc.role === 'HEADTEACHER'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : acc.role === 'ACADEMIC'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : acc.role === 'DISCIPLINE'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : acc.role === 'TEACHER'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : acc.role === 'CANDIDATE'
                                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {acc.role.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Class */}
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {acc.assignedClass || (acc.assignedClasses && acc.assignedClasses.join(', ')) || 'Shule Nzima'}
                        </td>

                        {/* Subjects / Candidate Info */}
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {acc.subjects && acc.subjects.length > 0 ? (
                            <span className="truncate max-w-[200px] block" title={acc.subjects.join(', ')}>
                              {acc.subjects.join(', ')}
                            </span>
                          ) : acc.candidateType ? (
                            <span className="text-purple-700 font-bold">
                              {acc.candidateType} • Index: {acc.examIndexNo || acc.identifier}
                            </span>
                          ) : (
                            <span>Usajili wa Kawaida</span>
                          )}
                        </td>

                        {/* Contacts */}
                        <td className="py-3 px-4 text-[11px] text-slate-500">
                          {acc.phone && <div className="font-mono">{acc.phone}</div>}
                          {acc.email && <div className="text-slate-400 truncate max-w-[150px]">{acc.email}</div>}
                          {!acc.phone && !acc.email && <span className="text-slate-300">—</span>}
                        </td>

                        {/* Admin Delete Action */}
                        <td className="py-3 px-4 text-right">
                          {acc.role !== 'ADMIN' ? (
                            <button
                              type="button"
                              onClick={() => setAccountToDelete(acc)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                              title={`Delete ${acc.fullName}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-300 font-semibold uppercase pr-2">Protected</span>
                          )}
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
    </div>
  );
}
