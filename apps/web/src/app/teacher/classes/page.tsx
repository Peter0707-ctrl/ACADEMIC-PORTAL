'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Search,
  Filter,
  User,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  ArrowRight,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Printer,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import {
  getCurrentSession,
  setCurrentSession,
  getStoredAccounts,
  saveStoredAccounts,
  INITIAL_BLUEPRINT_ACCOUNTS,
  UserAccount,
} from '@/lib/auth-session';
import { INITIAL_PUPILS, StudentMark } from '@/lib/teacher-data';
import { notifyUser } from '@/lib/notifications';

const ALL_AVAILABLE_CLASSES = [
  'Standard 7 (Grade 7)',
  'Standard 6 (Grade 6)',
  'Standard 5 (Grade 5)',
  'Standard 4 (Grade 4)',
  'Standard 3 (Grade 3)',
  'Standard 2 (Grade 2)',
  'Standard 1 (Grade 1)',
];

export default function MyClassesPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [teachingClasses, setTeachingClasses] = useState<string[]>([
    'Standard 7 (Grade 7)',
    'Standard 6 (Grade 6)',
  ]);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassToAdd, setNewClassToAdd] = useState('Standard 5 (Grade 5)');

  // Pupil Roster Modal
  const [rosterClassModal, setRosterClassModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [selectedPupil, setSelectedPupil] = useState<StudentMark | null>(null);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      const classes =
        session.assignedClasses && session.assignedClasses.length > 0
          ? session.assignedClasses
          : ['Standard 7 (Grade 7)', 'Standard 6 (Grade 6)'];
      setTeachingClasses(classes);
    }
  }, []);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (teachingClasses.includes(newClassToAdd)) {
      notifyUser('warning', 'Darasa Lipo Tayari', `${newClassToAdd} tayari lipo kwenye orodha ya madarasa unayofundisha.`);
      return;
    }

    const updatedClasses = [...teachingClasses, newClassToAdd];
    const updatedUser: UserAccount = {
      ...currentUser,
      assignedClasses: updatedClasses,
      assignedClass: updatedClasses.join(', '),
    };

    setCurrentUser(updatedUser);
    setTeachingClasses(updatedClasses);
    setCurrentSession(updatedUser);

    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    setShowAddClassModal(false);
    notifyUser('success', 'Darasa Limeongezwa', `${newClassToAdd} limeongezwa kikamilifu.`);
  };

  const handleRemoveClass = (clsToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (teachingClasses.length <= 1) {
      notifyUser('warning', 'Kizuizi', 'Lazima ubakiwe na angalau darasa moja unalofundisha.');
      return;
    }

    const updatedClasses = teachingClasses.filter((c) => c !== clsToRemove);
    const updatedUser: UserAccount = {
      ...currentUser,
      assignedClasses: updatedClasses,
      assignedClass: updatedClasses.join(', '),
    };

    setCurrentUser(updatedUser);
    setTeachingClasses(updatedClasses);
    setCurrentSession(updatedUser);

    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    notifyUser('info', 'Darasa Limeondolewa', `${clsToRemove} limeondolewa kwenye madarasa unayofundisha.`);
  };

  // Pupils for currently opened roster modal
  const rosterPupils: StudentMark[] = rosterClassModal
    ? INITIAL_PUPILS[rosterClassModal] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || []
    : [];

  const filteredRosterPupils = rosterPupils.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.admNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'ALL' || p.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  return (
    <TeacherShell
      pageTitle="Madarasa Yangu (My Classes)"
      pageDescription="Madarasa uliyopangiwa kufundisha na usimamizi wa ufundishaji."
    >
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-800" />
              <span>Madarasa Ninayofundisha ({teachingClasses.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mwalimu: <strong className="text-emerald-950 font-bold">{currentUser?.fullName || 'Mwl. Augustine Mrosso'}</strong> • Madarasa uliyopangiwa kufundisha katika muhula huu
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddClassModal(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ongeza Darasa Lingine</span>
          </button>
        </div>

        {/* Teaching Classes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {teachingClasses.map((cls) => {
            const classPupils = INITIAL_PUPILS[cls] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || [];
            const pupilCount = classPupils.length;
            const boys = classPupils.filter((p) => p.gender === 'M').length;
            const girls = classPupils.filter((p) => p.gender === 'F').length;
            const avg = pupilCount > 0 ? Math.round(classPupils.reduce((s, p) => s + p.mark, 0) / pupilCount) : 0;

            return (
              <div
                key={cls}
                className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase tracking-wider">
                      Darasa Linalofundishwa
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">{cls}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Wanafunzi {pupilCount} (Wavulana {boys} • Wasichana {girls})
                    </p>
                  </div>

                  {teachingClasses.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveClass(cls, e)}
                      title={`Ondoa ${cls} kwenye madarasa unayofundisha`}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Performance & Attendance Indicators */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Wastani wa Darasa</span>
                    <span className="text-lg font-black text-emerald-800 block mt-0.5">{avg}%</span>
                    <span className="text-[10px] font-bold text-emerald-600">
                      {avg >= 81 ? 'Daraja A (Bora)' : avg >= 65 ? 'Daraja B (Nzuri)' : 'Daraja C (Wastani)'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Mahudhurio ya Leo</span>
                    <span className="text-lg font-black text-blue-900 block mt-0.5">96.8%</span>
                    <span className="text-[10px] font-bold text-blue-600">Waliohudhuria: {pupilCount - 1}/{pupilCount}</span>
                  </div>
                </div>

                {/* Action Buttons for each class */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRosterClassModal(cls);
                      setSearchTerm('');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Wanafunzi ({pupilCount})</span>
                  </button>

                  <Link
                    href={`/teacher/attendance?class=${encodeURIComponent(cls)}`}
                    className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mahudhurio</span>
                  </Link>

                  <Link
                    href={`/teacher/marks?class=${encodeURIComponent(cls)}`}
                    className="py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Weka Alama</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Ongeza Darasa Lingine */}
        {showAddClassModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-base font-black text-slate-900">Ongeza Darasa Unalofundisha</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Chagua Darasa la Msingi (Standard 1–7):
                  </label>
                  <select
                    value={newClassToAdd}
                    onChange={(e) => setNewClassToAdd(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-800 bg-white"
                  >
                    {ALL_AVAILABLE_CLASSES.map((cls) => (
                      <option key={cls} value={cls} disabled={teachingClasses.includes(cls)}>
                        {cls} {teachingClasses.includes(cls) ? '(Unalo Tayari)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  Darasa hili litaongezwa kwenye ratiba yako ya ufundishaji na litatokea kwenye orodha yako ya madarasa.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md"
                  >
                    Hifadhi Darasa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Orodha ya Wanafunzi (Roster Viewer) */}
        {rosterClassModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-base font-black text-slate-900">
                    Orodha ya Wanafunzi: {rosterClassModal} ({rosterPupils.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRosterClassModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tafuta jina au namba..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value as any)}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="ALL">Jinsia Zote</option>
                  <option value="M">Wavulana Tu</option>
                  <option value="F">Wasichana Tu</option>
                </select>

                <Link
                  href={`/teacher/marks?class=${encodeURIComponent(rosterClassModal)}`}
                  className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Weka Alama &rarr;</span>
                </Link>
              </div>

              {/* Roster Table */}
              <div className="overflow-y-auto flex-1 border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 sticky top-0 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Namba ya Usajili</th>
                      <th className="py-2.5 px-3">Jina Kamili</th>
                      <th className="py-2.5 px-3">Jinsia</th>
                      <th className="py-2.5 px-3 text-center">Wastani</th>
                      <th className="py-2.5 px-3 text-center">Daraja</th>
                      <th className="py-2.5 px-3 text-right">Kitendo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRosterPupils.map((pupil, idx) => (
                      <tr key={pupil.id} className="hover:bg-emerald-50/50 transition-colors">
                        <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-800">{pupil.admNo}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{pupil.name}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pupil.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {pupil.gender === 'F' ? 'Kike' : 'Kiume'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-800">{pupil.mark}%</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px]">
                            {pupil.grade}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedPupil(pupil)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200"
                          >
                            Wasifu
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Wasifu wa Mwanafunzi */}
        {selectedPupil && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-amber-300 flex items-center justify-center font-black text-lg shadow-md">
                    {selectedPupil.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{selectedPupil.name}</h3>
                    <span className="text-xs font-mono font-bold text-emerald-800">
                      {selectedPupil.admNo} • {rosterClassModal}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPupil(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Jinsia</span>
                  <span className="font-bold text-slate-800">
                    {selectedPupil.gender === 'F' ? 'Kike (Female)' : 'Kiume (Male)'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Wastani</span>
                  <span className="font-bold text-emerald-800 text-sm">
                    {selectedPupil.mark}% (Daraja {selectedPupil.grade})
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPupil(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Funga
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
