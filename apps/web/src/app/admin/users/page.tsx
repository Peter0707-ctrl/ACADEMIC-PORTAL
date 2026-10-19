'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Trash2,
  Key,
  ShieldAlert,
  UserCheck,
  UserX,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Copy,
  Building2,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Phone,
  Mail,
  RefreshCw,
} from 'lucide-react';
import AdminShell from '@/components/admin-shell';
import {
  UserAccount,
  UserRole,
  getStoredAccounts,
  setStoredAccounts,
  PRIMARY_CLASSES_LIST,
  PRIMARY_SUBJECTS_LIST,
} from '@/lib/auth-session';

export default function AdminUsersPage() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Add Account Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('TEACHER');
  const [newIdentifier, setNewIdentifier] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAssignedClass, setNewAssignedClass] = useState(PRIMARY_CLASSES_LIST[0]);
  const [newSelectedSubjects, setNewSelectedSubjects] = useState<string[]>([PRIMARY_SUBJECTS_LIST[0]]);
  const [newCandidateType, setNewCandidateType] = useState<'PSLE' | 'SFNA'>('PSLE');
  const [newExamIndexNo, setNewExamIndexNo] = useState('');

  // Delete Modal
  const [accountToDelete, setAccountToDelete] = useState<UserAccount | null>(null);

  // Temp PIN Modal
  const [pinModalData, setPinModalData] = useState<{ user: UserAccount; tempPin: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    setAccounts(getStoredAccounts());
  }, []);

  const saveAccountsList = (updated: UserAccount[]) => {
    setAccounts(updated);
    setStoredAccounts(updated);
  };

  // Toggle Subject in Add Modal
  const toggleSubject = (sub: string) => {
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
      showToast('error', 'Tafadhali jaza Jina Kamili na Namba ya Utambulisho/Usajili.');
      return;
    }

    // Check identifier uniqueness
    const exists = accounts.some(
      (a) => a.identifier.toLowerCase() === newIdentifier.trim().toLowerCase()
    );
    if (exists) {
      showToast('error', `Kitambulisho ${newIdentifier} tayari kimesajiliwa kwa mtumiaji mwingine.`);
      return;
    }

    const newAcc: UserAccount = {
      id: `USR-${Date.now().toString().slice(-5)}`,
      fullName: newFullName.trim(),
      role: newRole,
      identifier: newIdentifier.trim(),
      email: newEmail.trim() || undefined,
      phone: newPhone.trim() || undefined,
      assignedClass: ['STUDENT', 'CANDIDATE', 'TEACHER', 'ACADEMIC'].includes(newRole)
        ? newAssignedClass
        : undefined,
      subjects: ['TEACHER', 'ACADEMIC', 'DISCIPLINE', 'HEADTEACHER'].includes(newRole)
        ? newSelectedSubjects
        : undefined,
      candidateType: newRole === 'CANDIDATE' ? newCandidateType : undefined,
      examIndexNo: newRole === 'CANDIDATE' ? newExamIndexNo.trim() || newIdentifier.trim() : undefined,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const updated = [newAcc, ...accounts];
    saveAccountsList(updated);
    setShowAddModal(false);

    // Reset fields
    setNewFullName('');
    setNewIdentifier('');
    setNewEmail('');
    setNewPhone('');
    setNewExamIndexNo('');

    showToast('success', `Akaunti ya ${newAcc.fullName} (${newAcc.role}) imesajiliwa kikamilifu.`);
  };

  // Delete Account
  const confirmDelete = () => {
    if (!accountToDelete) return;
    if (accountToDelete.role === 'ADMIN' && accountToDelete.identifier === 'drestgroup@gmail.com') {
      showToast('error', 'Akaunti kuu ya Super Admin haiwezi kufutwa kwa sababu za kiusalama.');
      setAccountToDelete(null);
      return;
    }
    const updated = accounts.filter((a) => a.id !== accountToDelete.id);
    saveAccountsList(updated);
    const deletedName = accountToDelete.fullName;
    setAccountToDelete(null);
    showToast('info', `Akaunti ya ${deletedName} imefutwa kwenye mfumo.`);
  };

  // Toggle Suspend / Activate
  const toggleAccountStatus = (acc: UserAccount) => {
    if (acc.role === 'ADMIN') {
      showToast('error', 'Huwezi kusitisha akaunti ya Super Admin.');
      return;
    }
    const newStatus = acc.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = accounts.map((a) => (a.id === acc.id ? { ...a, status: newStatus as 'ACTIVE' | 'SUSPENDED' } : a));
    saveAccountsList(updated);
    showToast(
      'info',
      `Akaunti ya ${acc.fullName} sasa imewekwa hadhi ya ${newStatus === 'ACTIVE' ? 'Amilifu (ACTIVE)' : 'Imesitishwa (SUSPENDED)'}.`
    );
  };

  // Generate Temp PIN
  const handleGenerateTempPin = (acc: UserAccount) => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setPinModalData({ user: acc, tempPin: randomPin });
    setIsCopied(false);
  };

  const copyPinToClipboard = () => {
    if (!pinModalData) return;
    navigator.clipboard.writeText(pinModalData.tempPin);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
    showToast('success', 'PIN ya muda imenakiliwa kwenye clipboard.');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (accounts.length === 0) {
      showToast('error', 'Hakuna akaunti za kupakua.');
      return;
    }
    const headers = ['ID', 'Full Name', 'Role', 'Identifier', 'Email', 'Phone', 'Class', 'Status', 'Joined Date'];
    const rows = accounts.map((a) => [
      a.id,
      `"${a.fullName}"`,
      a.role,
      `"${a.identifier}"`,
      `"${a.email || ''}"`,
      `"${a.phone || ''}"`,
      `"${a.assignedClass || ''}"`,
      a.status,
      a.joinedDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shule_watumiaji_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Faili la watumiaji (CSV) limepakuliwa kikamilifu.');
  };

  // Filtered Accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchSearch =
        acc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (acc.email && acc.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (acc.phone && acc.phone.includes(searchQuery)) ||
        (acc.assignedClass && acc.assignedClass.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (filterRole === 'ALL') return true;
      if (filterRole === 'LEADERSHIP') {
        return ['ADMIN', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(acc.role);
      }
      if (filterRole === 'TEACHERS') {
        return acc.role === 'TEACHER';
      }
      if (filterRole === 'FINANCE_ADMIN') {
        return ['ACCOUNTANT', 'SECRETARY'].includes(acc.role);
      }
      if (filterRole === 'PARENTS') {
        return acc.role === 'PARENT';
      }
      if (filterRole === 'STUDENTS') {
        return acc.role === 'STUDENT';
      }
      if (filterRole === 'CANDIDATES') {
        return acc.role === 'CANDIDATE';
      }
      return true;
    });
  }, [accounts, searchQuery, filterRole]);

  return (
    <AdminShell
      pageTitle="Usimamizi wa Watumiaji & Majukumu (RBAC)"
      pageDescription="Daftari kuu la watumiaji wote wa mfumo wa shule: kusajili, kuhariri, kurejesha nenosiri, na kusitisha akaunti."
    >
      <div className="space-y-5">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold border ${
                toast.type === 'success'
                  ? 'bg-emerald-900 text-white border-emerald-700'
                  : toast.type === 'error'
                  ? 'bg-rose-900 text-white border-rose-700'
                  : 'bg-slate-900 text-white border-slate-700'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {toast.type === 'info' && <Check className="w-4 h-4 text-indigo-400" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* 1. Temp PIN Modal */}
        {pinModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-scale-in">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
                <Key className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">PIN ya Muda ya Kuingilia</h3>
                <p className="text-xs text-slate-500">
                  Mtumiaji <span className="font-bold text-slate-800">{pinModalData.user.fullName}</span> ataingia kwa
                  kitambulisho chake na PIN hii:
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-black text-indigo-900 tracking-widest">
                  {pinModalData.tempPin}
                </span>
                <button
                  type="button"
                  onClick={copyPinToClipboard}
                  className="p-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 shadow-xs border border-slate-200 transition-all"
                  title="Nakili PIN"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                PIN hii ni ya matumizi ya mara moja na itamlazimu kubadilisha nenosiri jipya.
              </p>

              <button
                type="button"
                onClick={() => setPinModalData(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Imekamilika (Funga)
              </button>
            </div>
          </div>
        )}

        {/* 2. Delete Confirmation Modal */}
        {accountToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-rose-200 text-center space-y-4 animate-scale-in">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Thibitisha Kufuta Akaunti</h3>
                <p className="text-xs text-slate-500">
                  Je, una uhakika unataka kumfuta kabisa{' '}
                  <span className="font-bold text-rose-600">{accountToDelete.fullName}</span> ({accountToDelete.role})?
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAccountToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Ghairi
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
                >
                  Ndio, Futa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Add Account Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Sajili Mtumiaji Mpya</h3>
                    <p className="text-[11px] text-slate-500">Gawa jukumu na ruhusa za mtumiaji</p>
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
                  <label className="block font-bold text-slate-700 mb-1">Jukumu la Mtumiaji (Role)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="TEACHER">Mwalimu wa Darasa (Class Teacher)</option>
                    <option value="HEADTEACHER">Mkuu wa Shule (Headteacher / Principal)</option>
                    <option value="ACADEMIC">Mwalimu wa Taaluma (Academic Master)</option>
                    <option value="DISCIPLINE">Mwalimu wa Nidhamu (Discipline Master)</option>
                    <option value="ACCOUNTANT">Mhasibu wa Shule (Bursar / Accountant)</option>
                    <option value="SECRETARY">Katibu wa Shule (Secretary / Registrar)</option>
                    <option value="PARENT">Mzazi au Mlezi (Parent / Guardian)</option>
                    <option value="STUDENT">Mwanafunzi wa Kawaida (Regular Pupil)</option>
                    <option value="CANDIDATE">Mtahiniwa wa Taifa (PSLE / SFNA Candidate)</option>
                    <option value="ADMIN">Msimamizi Mkuu wa Mfumo (Super Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jina Kamili</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="k.m. Mwl. Juma Rashidi au Rehema Said"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {['STUDENT', 'CANDIDATE'].includes(newRole)
                        ? 'Namba ya Usajili (Adm No)'
                        : newRole === 'PARENT'
                        ? 'Namba ya Simu au ID'
                        : 'Staff ID / TSC No'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newIdentifier}
                      onChange={(e) => setNewIdentifier(e.target.value)}
                      placeholder={
                        ['STUDENT', 'CANDIDATE'].includes(newRole)
                          ? 'ADM-2026-001'
                          : newRole === 'PARENT'
                          ? '+255 7...'
                          : 'TCH-2026-01'
                      }
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Namba ya Simu</label>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+255 7..."
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barua Pepe (Email)</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="mtumiaji@shule.ac.tz"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Candidate Specific Fields */}
                {newRole === 'CANDIDATE' && (
                  <div className="grid grid-cols-2 gap-3 bg-purple-50/70 p-3 rounded-2xl border border-purple-200">
                    <div>
                      <label className="block font-bold text-purple-900 mb-1">Aina ya Mtihani</label>
                      <select
                        value={newCandidateType}
                        onChange={(e) => setNewCandidateType(e.target.value as 'PSLE' | 'SFNA')}
                        className="w-full rounded-xl bg-white border border-purple-300 px-3 py-2 text-xs text-slate-800"
                      >
                        <option value="PSLE">PSLE (Standard 7)</option>
                        <option value="SFNA">SFNA (Standard 4)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-purple-900 mb-1">Index Number (NECTA)</label>
                      <input
                        type="text"
                        value={newExamIndexNo}
                        onChange={(e) => setNewExamIndexNo(e.target.value)}
                        placeholder="PSLE-2026-001"
                        className="w-full rounded-xl bg-white border border-purple-300 px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {/* Class Assignment */}
                {['STUDENT', 'CANDIDATE', 'TEACHER', 'ACADEMIC'].includes(newRole) && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Darasa Analohusika</label>
                    <select
                      value={newAssignedClass}
                      onChange={(e) => setNewAssignedClass(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800"
                    >
                      {PRIMARY_CLASSES_LIST.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Subject Selection for Teachers */}
                {['TEACHER', 'ACADEMIC', 'DISCIPLINE', 'HEADTEACHER'].includes(newRole) && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-700">Masomo ya Kufundisha</label>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        {newSelectedSubjects.length} yamechaguliwa
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 p-2 rounded-xl bg-slate-50 border border-slate-200 max-h-32 overflow-y-auto">
                      {PRIMARY_SUBJECTS_LIST.map((sub) => {
                        const isSel = newSelectedSubjects.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => toggleSubject(sub)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                              isSel
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
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
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hifadhi Mtumiaji</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. Top Toolbar: Search, Filters, and Action Buttons */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">Orodha ya Watumiaji</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                  {filteredAccounts.length} Zimepatikana
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Simamia haki za ufikiaji, gawa majukumu, na simamia nenosiri za watumishi wote.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 border border-slate-200"
                title="Pakua faili la Excel/CSV la watumiaji wote"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Ongeza Mtumiaji Mpya</span>
              </button>
            </div>
          </div>

          {/* Search Bar & Role Pill Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tafuta mtumiaji kwa jina, kitambulisho, namba ya simu au barua pepe..."
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: 'Wote' },
                { id: 'LEADERSHIP', label: 'Uongozi (Admin/HM)' },
                { id: 'TEACHERS', label: 'Walimu' },
                { id: 'FINANCE_ADMIN', label: 'Uhasibu & Masijala' },
                { id: 'PARENTS', label: 'Wazazi' },
                { id: 'STUDENTS', label: 'Wanafunzi' },
                { id: 'CANDIDATES', label: 'Watahiniwa' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterRole(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    filterRole === f.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Accounts Data Table */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Mtumiaji &amp; Kitambulisho</th>
                  <th className="py-3 px-4">Jukumu (Role)</th>
                  <th className="py-3 px-4">Darasa &amp; Masomo</th>
                  <th className="py-3 px-4">Mawasiliano</th>
                  <th className="py-3 px-4">Hadhi (Status)</th>
                  <th className="py-3 px-4 text-right">Vitendo vya Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium space-y-2">
                      <Users className="w-8 h-8 mx-auto text-slate-300" />
                      <p>Hakuna mtumiaji aliyepatikana kulingana na vigezo ulivyochagua.</p>
                      <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors inline-block"
                      >
                        + Bonyeza hapa kuongeza mtumiaji
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc) => {
                    const isSuperAdmin = acc.role === 'ADMIN' && acc.identifier === 'drestgroup@gmail.com';
                    const isSuspended = acc.status === 'SUSPENDED';

                    return (
                      <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & Identifier */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                acc.role === 'ADMIN'
                                  ? 'bg-slate-900 text-white'
                                  : ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(acc.role)
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : acc.role === 'CANDIDATE'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {acc.fullName.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{acc.fullName}</span>
                              <span className="text-[10px] font-mono text-slate-500 uppercase">{acc.identifier}</span>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              acc.role === 'ADMIN'
                                ? 'bg-slate-900 text-white border-slate-900'
                                : acc.role === 'HEADTEACHER'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : acc.role === 'ACADEMIC'
                                ? 'bg-blue-50 text-blue-900 border-blue-300'
                                : acc.role === 'DISCIPLINE'
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                : acc.role === 'ACCOUNTANT'
                                ? 'bg-teal-50 text-teal-900 border-teal-300'
                                : acc.role === 'SECRETARY'
                                ? 'bg-orange-50 text-orange-900 border-orange-300'
                                : acc.role === 'CANDIDATE'
                                ? 'bg-purple-50 text-purple-900 border-purple-300'
                                : acc.role === 'PARENT'
                                ? 'bg-pink-50 text-pink-900 border-pink-300'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {acc.role.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Class & Subjects */}
                        <td className="py-3 px-4 text-slate-600 text-[11px]">
                          {acc.assignedClass && <div className="font-semibold text-slate-800">{acc.assignedClass}</div>}
                          {acc.subjects && acc.subjects.length > 0 && (
                            <div className="text-slate-400 truncate max-w-[180px]" title={acc.subjects.join(', ')}>
                              {acc.subjects.join(', ')}
                            </div>
                          )}
                          {!acc.assignedClass && (!acc.subjects || acc.subjects.length === 0) && (
                            <span className="text-slate-400">Shule Nzima</span>
                          )}
                        </td>

                        {/* Contacts */}
                        <td className="py-3 px-4 text-[11px] text-slate-600">
                          {acc.phone && <div className="font-mono text-slate-700">{acc.phone}</div>}
                          {acc.email && <div className="text-slate-400 truncate max-w-[150px]">{acc.email}</div>}
                          {!acc.phone && !acc.email && <span className="text-slate-300">—</span>}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isSuspended ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            />
                            {isSuspended ? 'Imesitishwa' : 'Amilifu'}
                          </span>
                        </td>

                        {/* Admin Action Buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Reset Temp PIN */}
                            <button
                              type="button"
                              onClick={() => handleGenerateTempPin(acc)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="Tengeneza PIN ya muda ya kuingilia"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>

                            {/* Suspend / Activate Toggle */}
                            {!isSuperAdmin && (
                              <button
                                type="button"
                                onClick={() => toggleAccountStatus(acc)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isSuspended
                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                    : 'text-amber-600 hover:bg-amber-50'
                                }`}
                                title={isSuspended ? 'Rejesha mtumiaji huyu' : 'Sitisha akaunti ya mtumiaji huyu'}
                              >
                                {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                              </button>
                            )}

                            {/* Delete Button */}
                            {!isSuperAdmin ? (
                              <button
                                type="button"
                                onClick={() => setAccountToDelete(acc)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title={`Futa ${acc.fullName}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-300 uppercase px-1">Protected</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
