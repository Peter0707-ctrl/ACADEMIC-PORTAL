'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle2,
  Calendar,
  Award,
  Clock,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Search,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle,
  Info,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Sparkles,
  Shield,
  FileText,
  Building2,
  AlertTriangle,
  Download,
  Phone,
  Mail,
  Trash2,
  UserPlus,
} from 'lucide-react';
import {
  UserAccount,
  getStoredAccounts,
  setStoredAccounts,
  getCurrentSession,
  setCurrentSession,
  clearCurrentSession,
} from '@/lib/auth-session';
import {
  INITIAL_PUPILS,
  SYLLABUS_OVERVIEW,
  INITIAL_BROADSHEET,
  INITIAL_INCIDENTS,
  StudentMark,
  SyllabusItem,
  BroadsheetRow,
  DisciplineIncident,
  calculateGrade,
} from '@/lib/teacher-data';

interface CenteredNotification {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export default function UnifiedAcademicERPPortal() {
  const router = useRouter();

  // Active Session & Accounts
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [notification, setNotification] = useState<CenteredNotification | null>(null);

  // Active View on the Right Side
  // 'HT_APPROVALS' | 'HT_CURRICULUM' | 'MARKS' | 'ATTENDANCE' | 'STAFF' | 'CANDIDATES' | 'BROADSHEET' | 'DISCIPLINE' | 'ADMIN_USERS'
  const [activeActivity, setActiveActivity] = useState<string>('HT_APPROVALS');

  // Headteacher Approval State
  const [hasApprovedTermResults, setHasApprovedTermResults] = useState(false);
  const [approvalTimestamp, setApprovalTimestamp] = useState<string | null>(null);

  // Marks Entry State
  const [pupilsData, setPupilsData] = useState<Record<string, StudentMark[]>>(INITIAL_PUPILS);
  const [selectedClass, setSelectedClass] = useState<string>('Standard 6 (Grade 6)');
  const [selectedSubject, setSelectedSubject] = useState<string>('Civic & Moral Education (Uraia na Maadili)');
  const [searchPupil, setSearchPupil] = useState('');

  // Curriculum State
  const [syllabusList] = useState<SyllabusItem[]>(SYLLABUS_OVERVIEW);
  const [curriculumGradeFilter, setCurriculumGradeFilter] = useState('ALL');

  // Broadsheet State
  const [broadsheetData] = useState<BroadsheetRow[]>(INITIAL_BROADSHEET);

  // Discipline State
  const [incidentsList, setIncidentsList] = useState<DisciplineIncident[]>(INITIAL_INCIDENTS);

  // Admin User Management State
  const [adminSearch, setAdminSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState('ALL');
  const [accountToDelete, setAccountToDelete] = useState<UserAccount | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<UserAccount['role']>('TEACHER');
  const [newIdentifier, setNewIdentifier] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAssignedClass, setNewAssignedClass] = useState('Standard 5 (Grade 5)');

  const triggerNotification = useCallback((type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => {
    setNotification({ type, title, message });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Initialize accounts & session
  useEffect(() => {
    const stored = getStoredAccounts();
    setAccounts(stored);

    let session = getCurrentSession();
    if (!session) {
      const headteacher = stored.find((a) => a.role === 'HEADTEACHER') || stored[1];
      setCurrentSession(headteacher);
      session = headteacher;
    }
    setCurrentUser(session);

    // Set default activity based on role
    if (session.role === 'HEADTEACHER') {
      setActiveActivity('HT_APPROVALS');
      setSelectedClass('Standard 6 (Grade 6)');
      setSelectedSubject('Civic & Moral Education (Uraia na Maadili)');
    } else if (session.role === 'ACADEMIC') {
      setActiveActivity('CANDIDATES');
      setSelectedClass('Standard 7 (Grade 7)');
      setSelectedSubject('Mathematics (Hisabati)');
    } else if (session.role === 'DISCIPLINE') {
      setActiveActivity('DISCIPLINE');
      setSelectedClass('Standard 5 (Grade 5)');
      setSelectedSubject('Civic & Moral Education (Uraia na Maadili)');
    } else if (session.role === 'ADMIN') {
      setActiveActivity('ADMIN_USERS');
    } else {
      setActiveActivity('MARKS');
      if (session.assignedClasses && session.assignedClasses.length > 0) {
        setSelectedClass(session.assignedClasses[0]);
      }
      if (session.subjects && session.subjects.length > 0) {
        setSelectedSubject(session.subjects[0]);
      }
    }
  }, []);

  // Switch Role Account from Left Sidebar
  const handleSelectAccount = (acc: UserAccount) => {
    setCurrentSession(acc);
    setCurrentUser(acc);

    if (acc.role === 'HEADTEACHER') {
      setActiveActivity('HT_APPROVALS');
      setSelectedClass('Standard 6 (Grade 6)');
      setSelectedSubject('Civic & Moral Education (Uraia na Maadili)');
    } else if (acc.role === 'ACADEMIC') {
      setActiveActivity('CANDIDATES');
      setSelectedClass('Standard 7 (Grade 7)');
      setSelectedSubject('Mathematics (Hisabati)');
    } else if (acc.role === 'DISCIPLINE') {
      setActiveActivity('DISCIPLINE');
      setSelectedClass('Standard 5 (Grade 5)');
      setSelectedSubject('Civic & Moral Education (Uraia na Maadili)');
    } else if (acc.role === 'ADMIN') {
      setActiveActivity('ADMIN_USERS');
    } else {
      setActiveActivity('MARKS');
      if (acc.assignedClasses && acc.assignedClasses.length > 0) {
        setSelectedClass(acc.assignedClasses[0]);
      }
      if (acc.subjects && acc.subjects.length > 0) {
        setSelectedSubject(acc.subjects[0]);
      }
    }

    triggerNotification(
      'success',
      'Akaunti Imebadilishwa',
      `Sasa unafanya kazi kama ${acc.fullName} (${acc.role.replace('_', ' ')}).`
    );
  };

  // Mark Change
  const handleMarkChange = (pupilId: string, newMark: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(newMark) ? 0 : newMark));
    const grade = calculateGrade(clamped);

    setPupilsData((prev) => {
      const classList = [...(prev[selectedClass] || prev['Standard 6 (Grade 6)'] || [])];
      const idx = classList.findIndex((p) => p.id === pupilId);
      if (idx !== -1) {
        classList[idx] = { ...classList[idx], mark: clamped, grade };
      }
      return { ...prev, [selectedClass]: classList };
    });
  };

  // Attendance Toggle
  const handleAttendanceChange = (pupilId: string, status: 'PRESENT' | 'ABSENT' | 'PERMISSION') => {
    setPupilsData((prev) => {
      const classList = [...(prev[selectedClass] || prev['Standard 6 (Grade 6)'] || [])];
      const idx = classList.findIndex((p) => p.id === pupilId);
      if (idx !== -1) {
        classList[idx] = { ...classList[idx], attendance: status };
      }
      return { ...prev, [selectedClass]: classList };
    });
  };

  // Headteacher Approval Action
  const handleApproveWithSeal = () => {
    const stampTime = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setHasApprovedTermResults(true);
    setApprovalTimestamp(stampTime);
    triggerNotification('success', 'Matokeo Yameidhinishwa', `Mwalimu Mkuu ameidhinisha broadsheet na kuweka Muhuri Rasmi wa Kidigitali (${stampTime}).`);
  };

  // Admin Delete Account
  const confirmDeleteAccount = () => {
    if (!accountToDelete) return;
    const updated = accounts.filter((a) => a.id !== accountToDelete.id);
    setAccounts(updated);
    setStoredAccounts(updated);
    const deletedName = accountToDelete.fullName;
    setAccountToDelete(null);
    triggerNotification('info', 'Akaunti Imefutwa', `${deletedName} ameondolewa moja kwa moja kwenye mfumo wa shule.`);
  };

  // Admin Add Account
  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newIdentifier.trim()) {
      triggerNotification('warning', 'Taarifa Hazijakamilika', 'Tafadhali weka jina kamili na namba ya usajili.');
      return;
    }

    const newAcc: UserAccount = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      fullName: newFullName.trim(),
      role: newRole,
      identifier: newIdentifier.trim(),
      email: newEmail.trim() || undefined,
      phone: newPhone.trim() || undefined,
      assignedClass: newAssignedClass,
      subjects: ['Uraia na Maadili', 'Maarifa ya Jamii'],
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const updated = [newAcc, ...accounts];
    setAccounts(updated);
    setStoredAccounts(updated);
    setShowAddModal(false);
    setNewFullName('');
    setNewIdentifier('');
    setNewEmail('');
    setNewPhone('');

    triggerNotification('success', 'Mtumiaji Amesajiliwa', `${newAcc.fullName} amesajiliwa kikamilifu.`);
  };

  const handleLogout = () => {
    clearCurrentSession();
    router.push('/');
  };

  // Lists
  const teachersList = useMemo(() => {
    return accounts.filter((a) => ['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(a.role));
  }, [accounts]);

  const candidatesList = useMemo(() => {
    return accounts.filter((a) => a.role === 'CANDIDATE');
  }, [accounts]);

  const currentPupils = useMemo(() => {
    const list = pupilsData[selectedClass] || pupilsData['Standard 6 (Grade 6)'] || [];
    if (!searchPupil.trim()) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(searchPupil.toLowerCase()) ||
        p.admNo.toLowerCase().includes(searchPupil.toLowerCase())
    );
  }, [pupilsData, selectedClass, searchPupil]);

  const filteredAdminAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchSearch =
        acc.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
        acc.identifier.toLowerCase().includes(adminSearch.toLowerCase()) ||
        (acc.email && acc.email.toLowerCase().includes(adminSearch.toLowerCase()));

      if (adminFilter === 'ALL') return matchSearch;
      if (adminFilter === 'TEACHERS') return matchSearch && acc.role === 'TEACHER';
      if (adminFilter === 'CANDIDATES') return matchSearch && acc.role === 'CANDIDATE';
      if (adminFilter === 'STUDENTS') return matchSearch && acc.role === 'STUDENT';
      if (adminFilter === 'LEADERSHIP') return matchSearch && ['ADMIN', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(acc.role);
      return matchSearch;
    });
  }, [accounts, adminSearch, adminFilter]);

  const isHeadteacher = currentUser?.role === 'HEADTEACHER';
  const isAcademicMaster = currentUser?.role === 'ACADEMIC';
  const isDisciplineMaster = currentUser?.role === 'DISCIPLINE';
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 font-sans flex flex-col lg:flex-row">
      {/* ===================================================================== */}
      {/* 1. CENTERED SMALL BLUE NOTIFICATION MODAL */}
      {/* ===================================================================== */}
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

      {/* Delete Confirmation Modal */}
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
                className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold"
              >
                Ghairi
              </button>
              <button
                type="button"
                onClick={confirmDeleteAccount}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-900/40"
              >
                Thibitisha Kufuta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. LEFT SIDEBAR: HORIZONTAL BUTTONS GOING DOWN (ROLE-BASED & ACTIVITIES) */}
      {/* ===================================================================== */}
      <aside className="w-full lg:w-80 bg-white/95 backdrop-blur-md border-r border-emerald-200/90 p-4 lg:p-5 shrink-0 flex flex-col justify-between shadow-sm lg:min-h-screen lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="space-y-6">

          {/* School Brand */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Link
              href="/"
              className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-800/20 shrink-0"
              title="Return to School Home"
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-[7px] font-black uppercase tracking-wider">Logo</span>
            </Link>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                PRIMARY &amp; NURSERY SCHOOL
              </h2>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Educational ERP System
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* SECTION A: CHAGUA NAFASI / AKAUNTI (HORIZONTAL BUTTONS GOING DOWN) */}
          {/* ================================================================= */}
          <div className="space-y-2">
            <div className="px-1 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Chagua Akaunti / Nafasi ya Kazi:
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Role-Based
              </span>
            </div>

            <div className="space-y-1.5">
              {/* 1. Mwalimu Mkuu */}
              {accounts.filter((a) => a.role === 'HEADTEACHER').map((acc) => {
                const isSelected = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className={`w-full p-2.5 rounded-2xl transition-all flex items-center justify-between text-left group border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/30'
                        : 'bg-white hover:bg-emerald-50/80 text-slate-800 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-800 text-amber-300' : 'bg-amber-100 text-amber-800'}`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-xs block truncate">{acc.fullName}</span>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                          Mwalimu Mkuu • {acc.identifier}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-emerald-700'}`} />
                  </button>
                );
              })}

              {/* 2. Mwalimu wa Taaluma */}
              {accounts.filter((a) => a.role === 'ACADEMIC').map((acc) => {
                const isSelected = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className={`w-full p-2.5 rounded-2xl transition-all flex items-center justify-between text-left group border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/30'
                        : 'bg-white hover:bg-emerald-50/80 text-slate-800 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-800 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-xs block truncate">{acc.fullName}</span>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                          Mwl. wa Taaluma • {acc.identifier}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-emerald-700'}`} />
                  </button>
                );
              })}

              {/* 3. Mwalimu wa Nidhamu */}
              {accounts.filter((a) => a.role === 'DISCIPLINE').map((acc) => {
                const isSelected = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className={`w-full p-2.5 rounded-2xl transition-all flex items-center justify-between text-left group border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/30'
                        : 'bg-white hover:bg-emerald-50/80 text-slate-800 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-800 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-xs block truncate">{acc.fullName}</span>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                          Mwl. wa Nidhamu • {acc.identifier}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-emerald-700'}`} />
                  </button>
                );
              })}

              {/* 4. Mwalimu wa Darasa (Class Teacher) */}
              {accounts.filter((a) => a.role === 'TEACHER').slice(0, 1).map((acc) => {
                const isSelected = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className={`w-full p-2.5 rounded-2xl transition-all flex items-center justify-between text-left group border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/30'
                        : 'bg-white hover:bg-emerald-50/80 text-slate-800 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-xs block truncate">{acc.fullName}</span>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                          Mwalimu wa Darasa • {acc.identifier}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-emerald-700'}`} />
                  </button>
                );
              })}

              {/* 5. School System Admin */}
              {accounts.filter((a) => a.role === 'ADMIN').map((acc) => {
                const isSelected = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className={`w-full p-2.5 rounded-2xl transition-all flex items-center justify-between text-left group border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-950 shadow-md shadow-slate-900/20'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-800'}`}>
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-xs block truncate">{acc.fullName}</span>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          System Admin (IT) • {acc.identifier}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* SECTION B: SHUGHULI ZA NAFASI HII (ACTIVITIES BUTTONS GOING DOWN) */}
          {/* ================================================================= */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="px-1 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Shughuli za {currentUser?.role.replace('_', ' ')}:
              </span>
              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Activities
              </span>
            </div>

            <div className="space-y-1">
              {/* 1. Mwalimu Mkuu Activities */}
              {isHeadteacher && (
                <>
                  <Link
                    href="/teacher/approvals"
                    className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Idhini ya Matokeo &amp; Muhuri</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">Mkuu</span>
                  </Link>

                  <Link
                    href="/teacher/curriculum"
                    className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>Usimamizi wa Mitaala &amp; Walimu</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </>
              )}

              {/* 2. Academic Master Activities */}
              {isAcademicMaster && (
                <>
                  <Link
                    href="/teacher/candidates"
                    className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>Watahiniwa wa Taifa (NECTA)</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/teacher/broadsheet"
                    className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>Uratibu wa Broadsheet</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">Taaluma</span>
                  </Link>

                  <Link
                    href="/teacher/curriculum"
                    className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Mitaala &amp; Maazimio ya Kazi</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </>
              )}

              {/* 3. Discipline Master Activities */}
              {isDisciplineMaster && (
                <Link
                  href="/teacher/discipline"
                  className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/80"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Nidhamu, Utoro &amp; Wito wa Wazazi</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">Nidhamu</span>
                </Link>
              )}

              {/* 4. Classroom Teaching Activities (Every teacher including Headmaster who teaches) */}
              {!isAdmin && (
                <>
                  <Link
                    href="/teacher/marks"
                    className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Kujaza Alama (Excel &amp; Madarasa)</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-700 text-white font-bold">Excel</span>
                  </Link>

                  <Link
                    href="/teacher/attendance"
                    className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Mahudhurio (Roll-Call Kila Siku)</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-700 text-white font-bold">Kila Siku</span>
                  </Link>

                  <Link
                    href="/teacher/staff"
                    className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Walimu Wangu ({teachersList.length})</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/teacher/settings"
                    className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-left bg-white hover:bg-emerald-50 text-slate-700 border border-slate-200/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Mipangilio &amp; Wasifu Wangu</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </>
              )}

              {/* 5. System Admin Activities */}
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveActivity('ADMIN_USERS')}
                    className={`w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 text-left ${
                      activeActivity === 'ADMIN_USERS'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Watumiaji Wote &amp; Kufuta Akaunti</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 text-left bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                  >
                    <UserPlus className="w-4 h-4 shrink-0" />
                    <span>+ Sajili Mtumiaji Mpya</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Logout */}
        <div className="pt-4 border-t border-slate-200/80 mt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold transition-all border border-slate-200 flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Toka Nje (Logout)</span>
          </button>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 3. RIGHT MAIN WORKSPACE: ACTIVE VIEW PANEL */}
      {/* ===================================================================== */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 min-w-0">

        {/* TOP PROFILE & ACTIVITY HEADER BANNER */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-2xs shrink-0 ${
              isHeadteacher ? 'bg-amber-100 text-amber-900 border border-amber-300' :
              isAcademicMaster ? 'bg-blue-100 text-blue-900 border border-blue-300' :
              isDisciplineMaster ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
              isAdmin ? 'bg-slate-900 text-white border border-slate-800' :
              'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {isHeadteacher ? <Award className="w-6 h-6 text-amber-700" /> : currentUser?.fullName.charAt(0) || 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900">{currentUser?.fullName}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  isHeadteacher ? 'bg-amber-50 text-amber-900 border-amber-200' :
                  isAcademicMaster ? 'bg-blue-50 text-blue-900 border-blue-200' :
                  isDisciplineMaster ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
                  isAdmin ? 'bg-slate-900 text-white border-slate-800' :
                  'bg-emerald-50 text-emerald-900 border-emerald-200'
                }`}>
                  {currentUser?.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kitambulisho: <span className="font-mono font-bold text-emerald-800">{currentUser?.identifier}</span> • Mawasiliano: {currentUser?.email || currentUser?.phone}
              </p>
            </div>
          </div>

          {/* Context teaching pill for Headmaster */}
          {currentUser?.subjects && currentUser.subjects.length > 0 && (
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2 self-start sm:self-auto">
              <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold block">Masomo Unayofundisha:</span>
                <span className="text-[11px] text-slate-600">{currentUser.subjects.join(', ')} ({currentUser.assignedClasses?.join(', ') || currentUser.assignedClass})</span>
              </div>
            </div>
          )}
        </div>

        {/* QUICK ACCESS ACTION CARDS: EXCEL UPLOAD, ATTENDANCE, BROADSHEET & APPROVALS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          {/* Card 1: Marks & Excel Upload */}
          <Link
            href="/teacher/marks"
            className="p-5 rounded-3xl bg-white/95 border-2 border-emerald-300 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 group-hover:text-emerald-900 transition-colors">
                Kujaza Alama &amp; Excel
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Chagua darasa unalofundisha, pakia faili la Excel (.xlsx), na wasilisha kwa Mwl. Taaluma.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Fungua Excel Upload</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Daily Attendance */}
          <Link
            href="/teacher/attendance"
            className="p-5 rounded-3xl bg-white/95 border-2 border-emerald-300 hover:border-emerald-600 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 group-hover:text-emerald-900 transition-colors">
                Mahudhurio (Roll-Call)
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Weka mahudhurio ya kila siku (wanafunzi 35), ripoti utoro moja kwa moja kwa Mkuu na Nidhamu.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Fungua Roll-Call</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Broadsheet */}
          <Link
            href="/teacher/broadsheet"
            className="p-5 rounded-3xl bg-white/95 border border-emerald-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:bg-blue-800 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 group-hover:text-blue-900 transition-colors">
                Broadsheet Kuu ya Shule
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Unganisha alama za masomo yote kwa kila darasa, kagua makosa kupitia AI na tuma kwa Mkuu.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-800">
              <span>Uratibu wa Broadsheet</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Approvals */}
          <Link
            href="/teacher/approvals"
            className="p-5 rounded-3xl bg-white/95 border border-emerald-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:bg-amber-800 group-hover:text-white transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 group-hover:text-amber-900 transition-colors">
                Idhini ya Matokeo &amp; Muhuri
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Kagua alama za madarasa yote, gonga Muhuri Rasmi wa Kidigitali na weka tarehe ya kutangaza.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>Idhini &amp; Muhuri</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* =================================================================== */}
        {/* VIEW 1: HEADTEACHER APPROVALS & OFFICIAL SEAL */}
        {/* =================================================================== */}
        {activeActivity === 'HT_APPROVALS' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-800">
                    Uthibitisho wa Broadsheet ya Muhula wa Kwanza 2026
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                    Idhini ya Mwisho ya Mkuu
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mwalimu wa Taaluma amekamilisha ukusanyaji wa alama zote. Sasa inahitajika saini na muhuri wako kabla ya kutoa ripoti kwa wazazi na NECTA.
                </p>
              </div>

              <div>
                {!hasApprovedTermResults ? (
                  <button
                    type="button"
                    onClick={handleApproveWithSeal}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Weka Muhuri na Idhinisha Matokeo</span>
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Yameidhinishwa ({approvalTimestamp})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Official Digital Seal Visual Display */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200/90 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-600 bg-white flex flex-col items-center justify-center text-center shadow-md shrink-0">
                  <Award className="w-6 h-6 text-emerald-700" />
                  <span className="text-[7px] font-black uppercase text-emerald-800 leading-none">SEAL</span>
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-950">
                    PRIMARY SCHOOL • HEADTEACHER OFFICIAL STAMP
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    {hasApprovedTermResults
                      ? `Muhuri Umepigwa Kidigitali: Tarehe ${approvalTimestamp} na ${currentUser?.fullName}`
                      : 'Hali: Inasubiri idhini na muhuri wa Mwalimu Mkuu'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Nambari ya Cheti cha Uthibitisho: <span className="font-mono font-bold text-emerald-900">VER-2026-HT-08492</span>
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${
                hasApprovedTermResults
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {hasApprovedTermResults ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                <span>{hasApprovedTermResults ? 'STAMPED & VERIFIED' : 'PENDING APPROVAL'}</span>
              </span>
            </div>

            {/* Class pass rates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Darasa la 7 (PSLE)</span>
                <span className="text-xl font-black text-slate-800 block mt-1">100% Pass Rate</span>
                <span className="text-[11px] text-emerald-700 font-bold">Watahiniwa 86 • Wastani: 88.4%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Darasa la 6 (Grade 6)</span>
                <span className="text-xl font-black text-slate-800 block mt-1">94.2% Pass Rate</span>
                <span className="text-[11px] text-emerald-700 font-bold">Wanafunzi 92 • Wastani: 79.1%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Darasa la 5 (Grade 5)</span>
                <span className="text-xl font-black text-slate-800 block mt-1">91.8% Pass Rate</span>
                <span className="text-[11px] text-emerald-700 font-bold">Wanafunzi 98 • Wastani: 76.5%</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Darasa la 4 (SFNA)</span>
                <span className="text-xl font-black text-slate-800 block mt-1">96.5% Pass Rate</span>
                <span className="text-[11px] text-emerald-700 font-bold">Watahiniwa 104 • Wastani: 82.3%</span>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: CURRICULUM & LESSON PLANS OVERSIGHT */}
        {/* =================================================================== */}
        {activeActivity === 'HT_CURRICULUM' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Usimamizi wa Mitaala &amp; Maazimio ya Kazi (Lesson Plans)
                </h3>
                <p className="text-xs text-slate-500">
                  Ufuatiliaji wa maendeleo ya mada za masomo na maandalio ya walimu kulingana na muongozo wa NECTA.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Chuja:</span>
                <select
                  value={curriculumGradeFilter}
                  onChange={(e) => setCurriculumGradeFilter(e.target.value)}
                  className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="ALL">Madarasa Yote</option>
                  <option value="Standard 7">Standard 7</option>
                  <option value="Standard 6">Standard 6</option>
                  <option value="Standard 5">Standard 5</option>
                  <option value="Standard 4">Standard 4</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Darasa</th>
                    <th className="py-3 px-4">Somo</th>
                    <th className="py-3 px-4">Mwalimu Mhusika</th>
                    <th className="py-3 px-4">Maazimio Yaliyowasilishwa</th>
                    <th className="py-3 px-4">Ukamilishaji wa Mada</th>
                    <th className="py-3 px-4">Hali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {syllabusList
                    .filter((item) => curriculumGradeFilter === 'ALL' || item.grade.includes(curriculumGradeFilter))
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-slate-800">{item.grade}</td>
                        <td className="py-3 px-4 text-emerald-900 font-semibold">{item.subject}</td>
                        <td className="py-3 px-4 text-slate-700">{item.teacher}</td>
                        <td className="py-3 px-4 font-mono">{item.lessonPlansSubmitted} / {item.lessonPlansTotal} wiki</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.completion >= 80 ? 'bg-emerald-600' : 'bg-blue-600'}`}
                                style={{ width: `${item.completion}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-700 text-xs w-8 text-right">{item.completion}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                            ON TRACK
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: SUBJECT MARKS ENTRY */}
        {/* =================================================================== */}
        {activeActivity === 'MARKS' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Uwekaji wa Alama za Somo ({currentUser?.fullName})
                </h3>
                <p className="text-xs text-slate-500">
                  Weka alama za majaribio na mitihani kwa madarasa unayofundisha. Madaraja (A, B, C, D, F) yanapigwa kiotomatiki.
                </p>
              </div>

              {/* Class & Subject Dropdowns */}
              <div className="flex flex-wrap items-center gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Chagua Darasa</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800"
                  >
                    {Object.keys(pupilsData).map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Somo Lako</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800"
                  >
                    {currentUser?.subjects?.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    )) || <option value="Somo Rasmi">Somo Rasmi</option>}
                  </select>
                </div>

                <div className="self-end">
                  <button
                    type="button"
                    onClick={() => triggerNotification('success', 'Alama Zimehifadhiwa', `Alama za ${selectedClass} (${selectedSubject}) zimehifadhiwa kikamilifu.`)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hifadhi Alama Zote</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Jina la Mwanafunzi</th>
                    <th className="py-3 px-4">Namba ya Usajili</th>
                    <th className="py-3 px-4">Jinsia</th>
                    <th className="py-3 px-4">Alama (0 - 100)</th>
                    <th className="py-3 px-4">Daraja</th>
                    <th className="py-3 px-4">Maoni ya Ufaulu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {currentPupils.map((pupil, idx) => (
                    <tr key={pupil.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{pupil.name}</td>
                      <td className="py-3 px-4 font-mono text-emerald-700">{pupil.admNo}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{pupil.gender}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={pupil.mark}
                          onChange={(e) => handleMarkChange(pupil.id, parseInt(e.target.value, 10))}
                          className="w-20 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 font-bold text-slate-800 text-center focus:bg-white focus:border-emerald-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-black text-xs ${
                          pupil.grade === 'A' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          pupil.grade === 'B' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                          'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          Grade {pupil.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {pupil.grade === 'A' && 'Ufaulu Bora Sana'}
                        {pupil.grade === 'B' && 'Ufaulu Mzuri'}
                        {pupil.grade === 'C' && 'Wastani wa Kuridhisha'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 4: DAILY ROLL-CALL ATTENDANCE */}
        {/* =================================================================== */}
        {activeActivity === 'ATTENDANCE' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Rejista ya Mahudhurio ya Kila Siku ({selectedClass})
                </h3>
                <p className="text-xs text-slate-500">
                  Weka alama nani yupo (Present), hayupo (Absent), au ana ruhusa (Permission).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800"
                >
                  {Object.keys(pupilsData).map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => triggerNotification('success', 'Mahudhurio Yamewasilishwa', `Roll-call ya ${selectedClass} imethibitishwa kikamilifu.`)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Wasilisha Mahudhurio</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Jina la Mwanafunzi</th>
                    <th className="py-3 px-4">Namba ya Usajili</th>
                    <th className="py-3 px-4 text-center">Hali ya Mahudhurio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {currentPupils.map((pupil, idx) => (
                    <tr key={pupil.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{pupil.name}</td>
                      <td className="py-3 px-4 font-mono text-emerald-700">{pupil.admNo}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(pupil.id, 'PRESENT')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              pupil.attendance === 'PRESENT' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Yupo (Present)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(pupil.id, 'ABSENT')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              pupil.attendance === 'ABSENT' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Hayupo (Absent)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAttendanceChange(pupil.id, 'PERMISSION')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              pupil.attendance === 'PERMISSION' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Ruhusa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 5: TEACHING STAFF DIRECTORY (WALIMU WANGU - TEACHERS ONLY) */}
        {/* =================================================================== */}
        {activeActivity === 'STAFF' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-800">
                    Orodha ya Walimu Wangu ({teachersList.length} Walimu)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                    Walimu Pekee (Teachers Only)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mwalimu Mkuu anaangalia walimu anaowasimamia shuleni, masomo yao na madarasa wanayofundisha bila kuchanganywa na wanafunzi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachersList.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                        {t.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{t.fullName}</h4>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">{t.identifier}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {t.role.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                    <div><strong>Masomo:</strong> {t.subjects?.join(', ') || 'Primary Curriculum'}</div>
                    <div><strong>Madarasa:</strong> {t.assignedClasses?.join(', ') || t.assignedClass}</div>
                    {t.phone && <div className="text-slate-500">{t.phone}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 6: NECTA CANDIDATES */}
        {/* =================================================================== */}
        {activeActivity === 'CANDIDATES' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Watahiniwa wa Taifa (PSLE &amp; SFNA)
                </h3>
                <p className="text-xs text-slate-500">
                  Orodha ya watahiniwa wa mitihani ya taifa ya Darasa la Saba na Nne chini ya Mwalimu wa Taaluma.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Jina Kamili</th>
                    <th className="py-3 px-4">Namba ya Usajili</th>
                    <th className="py-3 px-4">Aina ya Mtihani</th>
                    <th className="py-3 px-4">Hali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {candidatesList.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{c.fullName}</td>
                      <td className="py-3 px-4 font-mono text-emerald-700">{c.identifier}</td>
                      <td className="py-3 px-4 font-bold text-purple-700">{c.candidateType}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px]">
                          VERIFIED CANDIDATE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 7: BROADSHEET */}
        {/* =================================================================== */}
        {activeActivity === 'BROADSHEET' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">Broadsheet ya Darasa la Saba (Mock &amp; Term 1)</h3>
                <p className="text-xs text-slate-500">Alama za masomo yote, jumla, wastani na upangaji wa nafasi.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Nafasi</th>
                    <th className="py-3 px-4">Mwanafunzi</th>
                    <th className="py-3 px-3 text-center">Hisabati</th>
                    <th className="py-3 px-3 text-center">English</th>
                    <th className="py-3 px-3 text-center">Kiswahili</th>
                    <th className="py-3 px-3 text-center">Sayansi</th>
                    <th className="py-3 px-3 text-center">Maarifa</th>
                    <th className="py-3 px-3 text-center">Uraia</th>
                    <th className="py-3 px-3 text-center font-bold">Wastani</th>
                    <th className="py-3 px-3 text-center">Daraja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {broadsheetData.map((row) => (
                    <tr key={row.admNo} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-black text-emerald-800">#{row.rank}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{row.name}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.math}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.english}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.kiswahili}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.science}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.social}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.civic}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-800">{row.average}%</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black text-[10px]">
                          {row.division}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 8: DISCIPLINE */}
        {/* =================================================================== */}
        {activeActivity === 'DISCIPLINE' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">Daftari la Nidhamu, Utoro &amp; Wito wa Wazazi</h3>
                <p className="text-xs text-slate-500">Rekodi zote za utoro sugu na wito wa wazazi chini ya Mwalimu wa Nidhamu.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Tarehe</th>
                    <th className="py-3 px-4">Mwanafunzi</th>
                    <th className="py-3 px-4">Darasa</th>
                    <th className="py-3 px-4">Kosa / Suala</th>
                    <th className="py-3 px-4">Hatua</th>
                    <th className="py-3 px-4">Hali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {incidentsList.map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono text-slate-400">{inc.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{inc.pupilName}</td>
                      <td className="py-3 px-4 text-slate-600">{inc.class}</td>
                      <td className="py-3 px-4 text-rose-700 font-semibold">{inc.issue}</td>
                      <td className="py-3 px-4 text-slate-700">{inc.actionTaken}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {inc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 9: SYSTEM ADMIN USER ACCOUNTS MANAGEMENT (ADMIN PRIVILEGE ONLY) */}
        {/* =================================================================== */}
        {activeActivity === 'ADMIN_USERS' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-800">
                    Usimamizi wa Watumiaji Wote Shuleni ({filteredAdminAccounts.length} Watumiaji)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                    Admin Privilege
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Admin pekee ndiye anayeweza kuona kila mtumiaji, kutafuta kwa jina au namba, na kumfuta kwenye mfumo.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 self-start md:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Sajili Mtumiaji Mpya</span>
              </button>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tafuta mtumiaji yeyote..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto">
                {[
                  { id: 'ALL', label: 'Wote' },
                  { id: 'TEACHERS', label: 'Walimu' },
                  { id: 'CANDIDATES', label: 'Watahiniwa' },
                  { id: 'STUDENTS', label: 'Wanafunzi' },
                  { id: 'LEADERSHIP', label: 'Uongozi' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setAdminFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      adminFilter === f.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Mtumiaji &amp; Kitambulisho</th>
                    <th className="py-3 px-4">Jukumu (Role)</th>
                    <th className="py-3 px-4">Darasa / Mgawo</th>
                    <th className="py-3 px-4">Mawasiliano</th>
                    <th className="py-3 px-4 text-right">Kitendo cha Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredAdminAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div>{acc.fullName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{acc.identifier}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {acc.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{acc.assignedClass || 'Shule Nzima'}</td>
                      <td className="py-3 px-4 text-slate-500">{acc.email || acc.phone || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        {acc.role !== 'ADMIN' ? (
                          <button
                            type="button"
                            onClick={() => setAccountToDelete(acc)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors inline-flex items-center gap-1 font-semibold"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-bold">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Sajili Mtumiaji Mpya</h3>
              <button type="button" onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddAccount} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Jukumu (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                >
                  <option value="TEACHER">Mwalimu wa Darasa</option>
                  <option value="HEADTEACHER">Mwalimu Mkuu</option>
                  <option value="ACADEMIC">Mwalimu wa Taaluma</option>
                  <option value="DISCIPLINE">Mwalimu wa Nidhamu</option>
                  <option value="CANDIDATE">Mtahiniwa wa Taifa</option>
                  <option value="STUDENT">Mwanafunzi wa Kawaida</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Jina Kamili</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Namba ya Kitambulisho / Usajili</label>
                <input
                  type="text"
                  required
                  value={newIdentifier}
                  onChange={(e) => setNewIdentifier(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 bg-slate-100 rounded-xl">Ghairi</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-700 text-white font-bold rounded-xl">Sajili</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
