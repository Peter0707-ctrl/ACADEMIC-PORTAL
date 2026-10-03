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
  const [selectedClass, setSelectedClass] = useState<string>('Standard 7 (Grade 7)');
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassToAdd, setNewClassToAdd] = useState('Standard 5 (Grade 5)');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPupil, setSelectedPupil] = useState<StudentMark | null>(null);
  const [filterGender, setFilterGender] = useState<'ALL' | 'M' | 'F'>('ALL');

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      const classes =
        session.assignedClasses && session.assignedClasses.length > 0
          ? session.assignedClasses
          : ['Standard 7 (Grade 7)', 'Standard 6 (Grade 6)'];
      setTeachingClasses(classes);
      setSelectedClass(classes[0]);
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
    setSelectedClass(newClassToAdd);
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
    if (selectedClass === clsToRemove) {
      setSelectedClass(updatedClasses[0]);
    }
    setCurrentSession(updatedUser);

    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    notifyUser('info', 'Darasa Limeondolewa', `${clsToRemove} limeondolewa kwenye madarasa unayofundisha.`);
  };

  const pupils: StudentMark[] = INITIAL_PUPILS[selectedClass] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || [];

  const filteredPupils = pupils.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.admNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'ALL' || p.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  // Calculate class statistics
  const totalPupils = pupils.length;
  const boysCount = pupils.filter((p) => p.gender === 'M').length;
  const girlsCount = pupils.filter((p) => p.gender === 'F').length;
  const totalScore = pupils.reduce((sum, p) => sum + p.mark, 0);
  const classAverage = totalPupils > 0 ? Math.round(totalScore / totalPupils) : 0;

  const countGrade = (g: string) => pupils.filter((p) => p.grade === g).length;
  const gradeA = countGrade('A');
  const gradeB = countGrade('B');
  const gradeC = countGrade('C');
  const gradeD = countGrade('D');
  const gradeF = countGrade('F');

  const topPupil = pupils.length > 0 ? [...pupils].sort((a, b) => b.mark - a.mark)[0] : null;

  return (
    <TeacherShell
      pageTitle="Madarasa Yangu (My Classes)"
      pageDescription="Usimamizi wa madarasa uliyopangiwa kufundisha, orodha ya wanafunzi, wasifu wa mwanafunzi na tathmini ya darasa."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Class Selection Tabs - ONLY Assigned Classes */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-800" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Madarasa Ninayofundisha ({teachingClasses.length}):
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {currentUser?.fullName || 'Mwl. Augustine Mrosso'}
              </span>
              <button
                type="button"
                onClick={() => setShowAddClassModal(true)}
                className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-500 text-emerald-950 flex items-center gap-1 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ongeza Darasa</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {teachingClasses.map((cls) => {
              const isSelected = selectedClass === cls;
              return (
                <div
                  key={cls}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                      : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 cursor-pointer'
                  }`}
                  onClick={() => setSelectedClass(cls)}
                >
                  <span>{cls}</span>
                  {teachingClasses.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveClass(cls, e)}
                      title={`Ondoa ${cls} kwenye orodha yangu`}
                      className={`ml-1 p-1 rounded-md transition-colors ${
                        isSelected
                          ? 'hover:bg-emerald-700 text-emerald-200 hover:text-white'
                          : 'hover:bg-slate-200 text-slate-400 hover:text-rose-600'
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setShowAddClassModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 border border-dashed border-slate-300 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Ongeza Darasa Lingine</span>
            </button>
          </div>
        </div>

        {/* Class Performance Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Jumla ya Wanafunzi
              </span>
              <span className="text-2xl font-black text-slate-900 block mt-1">{totalPupils}</span>
              <span className="text-[11px] font-semibold text-emerald-700">
                Wavulana {boysCount} • Wasichana {girlsCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Wastani wa Darasa
              </span>
              <span className="text-2xl font-black text-emerald-800 block mt-1">{classAverage}%</span>
              <span className="text-[11px] font-semibold text-emerald-600">
                Daraja: {classAverage >= 81 ? 'A (Bora)' : classAverage >= 65 ? 'B (Nzuri)' : 'C (Wastani)'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Mwanafunzi Bora (Kinara)
              </span>
              <span className="text-sm font-black text-slate-900 block mt-1 truncate max-w-[150px]">
                {topPupil?.name || 'Hamna'}
              </span>
              <span className="text-[11px] font-semibold text-amber-600">
                Alama: {topPupil?.mark || 0}% (Daraja {topPupil?.grade || '-'})
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Mgawanyo wa Madaraja
              </span>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-black">
                  A:{gradeA}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-black">
                  B:{gradeB}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black">
                  C:{gradeC}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 text-[10px] font-black">
                  D/F:{gradeD + gradeF}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Pupils in Selected Class Table */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Wanafunzi wa {selectedClass} (Pupils Roster)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Bofya jina la mwanafunzi yeyote ili kuona Wasifu (Profile) na taarifa za wazazi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tafuta jina au namba..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none w-48 sm:w-56"
                />
              </div>

              {/* Gender Filter */}
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value as any)}
                className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="ALL">Wote (All)</option>
                <option value="M">Wavulana (Boys)</option>
                <option value="F">Wasichana (Girls)</option>
              </select>

              <Link
                href={`/teacher/marks?class=${encodeURIComponent(selectedClass)}`}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Weka Alama &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Namba ya Usajili</th>
                  <th className="py-3 px-3">Jina Kamili la Mwanafunzi</th>
                  <th className="py-3 px-3 text-center">Jinsia</th>
                  <th className="py-3 px-3 text-center">Wastani wa Alama</th>
                  <th className="py-3 px-3 text-center">Daraja</th>
                  <th className="py-3 px-3 text-center">Mahudhurio</th>
                  <th className="py-3 px-3 text-right">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredPupils.map((pupil, idx) => (
                  <tr
                    key={pupil.id}
                    onClick={() => setSelectedPupil(pupil)}
                    className="hover:bg-emerald-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">{pupil.admNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
                        {pupil.name.charAt(0)}
                      </div>
                      <span>{pupil.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pupil.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {pupil.gender === 'F' ? 'Kike (F)' : 'Kiume (M)'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">{pupil.mark}%</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          pupil.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pupil.grade === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : pupil.grade === 'C'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {pupil.grade}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[11px] font-bold text-emerald-700">96.8%</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPupil(pupil);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200"
                      >
                        Wasifu &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pupil Profile Modal / Drawer */}
        {selectedPupil && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-amber-300 flex items-center justify-center font-black text-lg shadow-md">
                    {selectedPupil.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{selectedPupil.name}</h3>
                    <span className="text-xs font-mono font-bold text-emerald-800">
                      {selectedPupil.admNo} • {selectedClass}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPupil(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Jinsia</span>
                  <span className="font-bold text-slate-800">
                    {selectedPupil.gender === 'F' ? 'Kike (Female)' : 'Kiume (Male)'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Hali ya Mahudhurio</span>
                  <span className="font-bold text-emerald-700">96.8% (Mahudhurio Mazuri)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Wastani wa Alama</span>
                  <span className="font-bold text-emerald-800 text-sm">
                    {selectedPupil.mark}% (Daraja {selectedPupil.grade})
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Simu ya Mzazi</span>
                  <span className="font-bold text-blue-800">+255 754 {Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
              </div>

              {/* Assessment Breakdown */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="text-xs font-black text-emerald-900 block">
                  Matokeo ya Majaribio (Continuous Assessment):
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block">Jaribio 1</span>
                    <span className="font-black text-slate-900">{selectedPupil.monthlyTest1}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block">Jaribio 2</span>
                    <span className="font-black text-slate-900">{selectedPupil.monthlyTest2}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block">Midterm</span>
                    <span className="font-black text-slate-900">{selectedPupil.midtermExam}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block">Terminal</span>
                    <span className="font-black text-emerald-800">{selectedPupil.terminalExam}%</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 italic">
                  Maoni ya Mwalimu: {selectedPupil.remarks || 'Anajitahidi sana darasani na nidhamu yake ni ya kiwango cha juu.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    notifyUser('info', 'Ujumbe kwa Mzazi', `Dirisha la ujumbe kwa mzazi wa ${selectedPupil.name} limefunguliwa.`);
                    setSelectedPupil(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                >
                  Tuma Ujumbe kwa Mzazi
                </button>
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
      </div>
    </TeacherShell>
  );
}

