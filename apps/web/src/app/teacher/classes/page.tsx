'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ShieldCheck,
  Building2,
  FileText,
  UserCheck,
  MapPin,
  HeartHandshake,
  Check,
  FileBadge2,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import {
  getCurrentSession,
  setCurrentSession,
  getStoredAccounts,
  saveStoredAccounts,
  PRIMARY_CLASSES_LIST,
  PRIMARY_SUBJECTS_LIST,
  UserAccount,
  TeachingLoad,
} from '@/lib/auth-session';
import {
  getPupilsForClass,
  StudentMark,
} from '@/lib/teacher-data';
import { notifyUser } from '@/lib/notifications';

export default function MyClassesPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Teaching Assignments
  const [teachingAssignments, setTeachingAssignments] = useState<TeachingLoad[]>([
    { class: 'Standard 7 (Grade 7)', subject: 'Civic & Moral Education (Uraia na Maadili)' },
    { class: 'Standard 6 (Grade 6)', subject: 'Social Studies (Maarifa ya Jamii)' },
  ]);

  // Modal: Add Class & Subject to Teaching Load
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassToAdd, setNewClassToAdd] = useState<string>(PRIMARY_CLASSES_LIST[0]);
  const [newSubjectToAdd, setNewSubjectToAdd] = useState<string>(PRIMARY_SUBJECTS_LIST[0]);

  // Pupil Roster Modal
  const [rosterClassModal, setRosterClassModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [selectedPupil, setSelectedPupil] = useState<StudentMark | null>(null);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      if (session.teachingAssignments && session.teachingAssignments.length > 0) {
        setTeachingAssignments(session.teachingAssignments);
      } else if (session.assignedClasses && session.assignedClasses.length > 0) {
        const built = session.assignedClasses.map((cls, idx) => ({
          class: cls,
          subject: (session.subjects && session.subjects[idx]) || 'Civic & Moral Education (Uraia na Maadili)',
        }));
        setTeachingAssignments(built);
      }
    }
  }, []);

  // Usajili wa Wanafunzi Wapya: Strictly Mwalimu wa Taaluma (Academic) na Mwalimu Mkuu (Headmaster) tu!
  const isAcademicMaster =
    currentUser?.role === 'ACADEMIC' ||
    currentUser?.leadershipRole === 'ACADEMIC' ||
    currentUser?.leadershipRole === 'ASSISTANT_ACADEMIC';

  const isHeadmaster =
    currentUser?.role === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'SECOND_MASTER' ||
    currentUser?.role === 'ADMIN';

  const isAuthorizedToEnroll = isAcademicMaster || isHeadmaster;

  // Handler: Add Class and Subject to Teacher's Load
  const handleAddClassAndSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const exists = teachingAssignments.some(
      (a) => a.class === newClassToAdd && a.subject === newSubjectToAdd
    );
    if (exists) {
      notifyUser('warning', 'Mgawo Upo Tayari', `${newClassToAdd} somo la ${newSubjectToAdd} tayari lipo kwenye ratiba yako.`);
      return;
    }

    const updatedAssignments: TeachingLoad[] = [
      ...teachingAssignments,
      { class: newClassToAdd, subject: newSubjectToAdd },
    ];
    const updatedClasses = Array.from(new Set(updatedAssignments.map((a) => a.class)));
    const updatedSubjects = Array.from(new Set(updatedAssignments.map((a) => a.subject)));

    const updatedUser: UserAccount = {
      ...currentUser,
      teachingAssignments: updatedAssignments,
      assignedClasses: updatedClasses,
      assignedClass: updatedClasses.join(', '),
      subjects: updatedSubjects,
    };

    setCurrentUser(updatedUser);
    setTeachingAssignments(updatedAssignments);
    setCurrentSession(updatedUser);

    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    setShowAddClassModal(false);
    notifyUser('success', 'Darasa na Somo Limeongezwa', `${newClassToAdd} — somo la ${newSubjectToAdd} limeongezwa kikamilifu.`);
  };

  const handleRemoveAssignment = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (teachingAssignments.length <= 1) {
      notifyUser('warning', 'Kizuizi', 'Lazima ubakiwe na angalau darasa na somo moja unalofundisha.');
      return;
    }

    const removed = teachingAssignments[indexToRemove];
    const updatedAssignments = teachingAssignments.filter((_, idx) => idx !== indexToRemove);
    const updatedClasses = Array.from(new Set(updatedAssignments.map((a) => a.class)));
    const updatedSubjects = Array.from(new Set(updatedAssignments.map((a) => a.subject)));

    const updatedUser: UserAccount = {
      ...currentUser,
      teachingAssignments: updatedAssignments,
      assignedClasses: updatedClasses,
      assignedClass: updatedClasses.join(', '),
      subjects: updatedSubjects,
    };

    setCurrentUser(updatedUser);
    setTeachingAssignments(updatedAssignments);
    setCurrentSession(updatedUser);

    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    notifyUser('info', 'Darasa Limeondolewa', `${removed.class} — ${removed.subject} limeondolewa.`);
  };

  // Pupils for currently opened roster modal
  const rosterPupils: StudentMark[] = rosterClassModal
    ? getPupilsForClass(rosterClassModal)
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
      pageTitle="Madarasa Yangu Ninayofundisha (My Teaching Classes)"
      pageDescription="Usimamizi wa madarasa unayofundisha, orodha ya wanafunzi kwenye madarasa yako, na masomo yako ya ufundishaji."
    >
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
        {/* ================================================================= */}
        {/* 1. TOP HEADER & MAIN TAB NAVIGATION */}
        {/* ================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-emerald-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Madarasa Ninayofundisha ({teachingAssignments.length})
              </h2>
              <span className="text-xs text-slate-500">
                Orodha ya wanafunzi, masomo unayofundisha, na mahudhurio ya darasa lako.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* If Leadership, link to Daftari Kuu la Udahili */}
            {isAuthorizedToEnroll && (
              <Link
                href="/teacher/enrollment"
                className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-black text-xs flex items-center gap-1.5 border border-emerald-200 transition-all"
              >
                <Building2 className="w-4 h-4 text-emerald-800" />
                <span>Ofisi ya Taaluma: Daftari Kuu la Udahili &rarr;</span>
              </Link>
            )}

            {/* Add Class/Subject to load */}
            <button
              type="button"
              onClick={() => setShowAddClassModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-200" />
              <span>+ Ongeza Somo na Darasa</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. TEACHER'S ASSIGNED CLASSES */}
        {/* ================================================================= */}
        <div className="space-y-6">
            {/* Automatic Synchronization Banner */}
            <div className="bg-white p-4 rounded-3xl border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">
                    Usawazishaji wa Kiotomatiki (Automatic Teacher Sync):
                  </h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Mwanafunzi anapoandikishwa na Mwalimu wa Taaluma kwenye darasa lako, anatokea mara moja hapa, kwenye Mahudhurio na kwenye kuweka Alama.
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-emerald-900 font-bold bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs inline-block">
                  Mwalimu: {currentUser?.fullName || 'Mwl. Augustine Mrosso'}
                </span>
              </div>
            </div>

            {/* Teaching Classes Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {teachingAssignments.map((assignment, index) => {
                const classPupils = getPupilsForClass(assignment.class);
                const pupilCount = classPupils.length;
                const boys = classPupils.filter((p) => p.gender === 'M').length;
                const girls = classPupils.filter((p) => p.gender === 'F').length;
                const avg = pupilCount > 0 ? Math.round(classPupils.reduce((s, p) => s + p.mark, 0) / pupilCount) : 0;

                return (
                  <div
                    key={`${assignment.class}-${assignment.subject}-${index}`}
                    className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase tracking-wider">
                          Darasa Linalofundishwa
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">{assignment.class}</h3>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-50/80 px-2.5 py-1 rounded-xl border border-emerald-100 mt-1">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Somo: {assignment.subject}</span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          Wanafunzi {pupilCount} (Wavulana {boys} • Wasichana {girls})
                        </p>
                      </div>

                      {teachingAssignments.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveAssignment(index, e)}
                          title={`Ondoa ${assignment.class} - ${assignment.subject}`}
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
                        <span className="text-lg font-black text-blue-900 block mt-0.5">97.2%</span>
                        <span className="text-[10px] font-bold text-blue-600">Waliohudhuria: {pupilCount > 0 ? pupilCount - 1 : 0}/{pupilCount}</span>
                      </div>
                    </div>

                    {/* Action Buttons for each class and subject */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRosterClassModal(assignment.class);
                          setSearchTerm('');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Orodha ({pupilCount})</span>
                      </button>

                      <Link
                        href={`/teacher/attendance?class=${encodeURIComponent(assignment.class)}`}
                        className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mahudhurio</span>
                      </Link>

                      <Link
                        href={`/teacher/marks?class=${encodeURIComponent(assignment.class)}&subject=${encodeURIComponent(assignment.subject)}`}
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
          </div>
        {/* ================================================================= */}
        {/* ================================================================= */}
        {showAddClassModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-base font-black text-slate-900">Ongeza Darasa na Somo</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddClassAndSubject} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    1. Chagua Darasa la Msingi (Standard 1–7):
                  </label>
                  <select
                    value={newClassToAdd}
                    onChange={(e) => setNewClassToAdd(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-800 bg-white"
                  >
                    {PRIMARY_CLASSES_LIST.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    2. Chagua Somo Utakalofundisha:
                  </label>
                  <select
                    value={newSubjectToAdd}
                    onChange={(e) => setNewSubjectToAdd(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-800 bg-white"
                  >
                    {PRIMARY_SUBJECTS_LIST.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  Utaongezewa darasa hili na somo ulilochagua kwenye ratiba yako ya kufundisha na uwekaji wa alama.
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
                    Hifadhi Darasa na Somo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 7. MODAL: ORODHA YA WANAFUNZI WA DARASA HILI (ROSTER VIEWER) */}
        {/* ================================================================= */}
        {rosterClassModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Orodha ya Wanafunzi: {rosterClassModal} ({rosterPupils.length})
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      Inajumuisha wanafunzi wote waliosajiliwa na Ofisi ya Taaluma
                    </span>
                  </div>
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
                    placeholder="Tafuta jina au namba ya usajili..."
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

        {/* ================================================================= */}
        {/* 8. MODAL: WASIFU WA MWANAFUNZI */}
        {/* ================================================================= */}
        {selectedPupil && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    {selectedPupil.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{selectedPupil.name}</h3>
                    <span className="text-xs font-mono font-bold text-emerald-800">
                      {selectedPupil.admNo} &bull; {rosterClassModal}
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
