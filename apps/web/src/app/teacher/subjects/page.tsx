'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  GraduationCap,
  Plus,
  Trash2,
  X,
  FileText,
  Layers,
  Lock,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import {
  getCurrentSession,
  setCurrentSession,
  getStoredAccounts,
  saveStoredAccounts,
  INITIAL_BLUEPRINT_ACCOUNTS,
  PRIMARY_CLASSES_LIST,
  PRIMARY_SUBJECTS_LIST,
  UserAccount,
  TeachingLoad,
} from '@/lib/auth-session';
import {
  checkClassSubjectLock,
  lockClassSubject,
  unlockClassSubject,
  getCurrentAcademicYear,
  getAllAllocationLocks,
} from '@/lib/allocation-progression';
import { notifyUser } from '@/lib/notifications';

export default function MySubjectsPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_BLUEPRINT_ACCOUNTS[0] || null);
  const [teachingAssignments, setTeachingAssignments] = useState<TeachingLoad[]>([
    { class: 'Standard 7 (Grade 7)', subject: 'Civic & Moral Education (Uraia na Maadili)' },
    { class: 'Standard 6 (Grade 6)', subject: 'Social Studies (Maarifa ya Jamii)' },
  ]);

  const [currentAcademicYear, setCurrentAcademicYear] = useState<string>('2026');

  // Modal State for adding another Subject + Class
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState<string>(PRIMARY_CLASSES_LIST[0]);
  const [newSubject, setNewSubject] = useState<string>(PRIMARY_SUBJECTS_LIST[0]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setCurrentAcademicYear(getCurrentAcademicYear());
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

  // Check if current combination in modal is locked
  const lockStatusForSelection = useMemo(() => {
    if (!currentUser) return { isLocked: false };
    return checkClassSubjectLock(newClass, newSubject, currentUser.id);
  }, [newClass, newSubject, currentUser]);

  const handleAddSubjectAndClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // 1. Check if already in user's own list
    const exists = teachingAssignments.some(
      (a) => a.class === newClass && a.subject === newSubject
    );
    if (exists) {
      notifyUser('warning', 'Somo Lipo Tayari', `Somo la ${newSubject} katika ${newClass} tayari lipo kwenye orodha yako.`);
      return;
    }

    // 2. Class-Subject Lock check (Rule: if taken by another teacher, locked!)
    const lockCheck = checkClassSubjectLock(newClass, newSubject, currentUser.id);
    if (lockCheck.isLocked && lockCheck.lockDetails) {
      notifyUser(
        'error',
        'Somo Limefungwa!',
        `Somo la "${newSubject}" katika "${newClass}" tayari limechukuliwa na Mwl. ${lockCheck.lockDetails.teacherName} (${lockCheck.lockDetails.teacherIdentifier}). Somo hili limefungwa kwa mwaka wa masomo ${currentAcademicYear}!`
      );
      return;
    }

    // 3. Lock it to current teacher
    const lockResult = lockClassSubject(newClass, newSubject, currentUser);
    if (!lockResult.success) {
      notifyUser('error', 'Kosa la Ufungaji', lockResult.message);
      return;
    }

    const updatedAssignments: TeachingLoad[] = [
      ...teachingAssignments,
      { class: newClass, subject: newSubject },
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

    setShowAddModal(false);
    notifyUser('success', 'Somo Limefungwa Kwako', `${newSubject} (${newClass}) limefungwa kwako kwa mafanikio kwa mwaka ${currentAcademicYear}. Walimu wengine hawawezi kulichukua.`);
  };

  const handleRemoveAssignment = (indexToRemove: number) => {
    if (!currentUser) return;
    if (teachingAssignments.length <= 1) {
      notifyUser('warning', 'Kizuizi', 'Lazima ubakiwe na angalau somo moja unalofundisha.');
      return;
    }

    const removed = teachingAssignments[indexToRemove];

    // Unlock class-subject so others or teacher can reassign
    unlockClassSubject(removed.class, removed.subject, currentUser.id);

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

    notifyUser('info', 'Somo Limefunguliwa', `${removed.subject} (${removed.class}) limeondolewa na kufunguliwa.`);
  };

  return (
    <TeacherShell
      pageTitle="Masomo Yangu (My Subjects)"
      pageDescription="Orodha rasmi ya masomo unayofundisha katika muhula huu."
    >
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-xl shadow-md">
              <BookOpen className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Mwaka wa Masomo: {currentAcademicYear}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Jumla ya Masomo: {teachingAssignments.length}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">
                {currentUser?.fullName} &bull; Masomo &amp; Madarasa
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-950/20 transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-200" />
            <span>+ Ongeza Somo &amp; Darasa</span>
          </button>
        </div>

        {/* Lock & Annual Reset Policy Banner */}
        <div className="bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 font-bold">Kanuni ya Kufunga Masomo na Kujisasisha Kila Mwaka:</strong>
              <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                Darasa na somo likishachukuliwa na mwalimu linafungwa ili mwalimu mwingine asilichukue. Mwaka wa masomo unapoisha,
                mfumo huondoa madarasa yote kiotomatiki ili kila mwalimu ajaze upya masomo anayofundisha kwa mwaka mpya.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kufungwa Kiotomatiki</span>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teachingAssignments.map((assignment, index) => (
            <div
              key={`${assignment.class}-${assignment.subject}-${index}`}
              className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200">
                      {assignment.class}
                    </span>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-900 border border-teal-200">
                      <Lock className="w-3 h-3 text-teal-700" />
                      <span>Limefungwa Kwako ({currentAcademicYear})</span>
                    </div>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {assignment.subject}
                  </h3>
                </div>

                {teachingAssignments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignment(index)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Ondoa somo hili kwenye orodha yako"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Progress & Quick Stats */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Maendeleo ya Mtaala (Syllabus):</span>
                  <span className="font-black text-emerald-800">80%</span>
                </div>
                <div className="w-full bg-emerald-200/60 rounded-full h-2">
                  <div className="bg-emerald-700 h-2 rounded-full w-4/5"></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Wanafunzi: 25</span>
                  <span>Vipindi: 4 kwa Wiki</span>
                  <span className="text-emerald-700 font-bold">Kwenye Ratiba</span>
                </div>
              </div>

              {/* Action Buttons for this subject */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                <Link
                  href={`/teacher/marks?class=${encodeURIComponent(assignment.class)}&subject=${encodeURIComponent(assignment.subject)}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Weka Alama</span>
                </Link>

                <Link
                  href="/teacher/curriculum"
                  className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lesson Plan</span>
                </Link>

                <Link
                  href="/teacher/assignments"
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Mazoezi</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Ongeza Somo na Darasa */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="text-base font-black text-slate-900">Ongeza Somo Utakalofundisha</h3>
                    <span className="text-[11px] text-teal-800 font-semibold">Mwaka wa Masomo: {currentAcademicYear}</span>
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

              <form onSubmit={handleAddSubjectAndClass} className="space-y-4 text-xs">
                {/* 1. Chagua Somo */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    1. Chagua Somo:
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-emerald-800 bg-white"
                  >
                    {PRIMARY_SUBJECTS_LIST.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Chagua Darasa */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    2. Chagua Darasa Utakalofundisha:
                  </label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-emerald-800 bg-white"
                  >
                    {PRIMARY_CLASSES_LIST.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Live Lock Warning / Notice */}
                {lockStatusForSelection.isLocked ? (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Somo Limeshachukuliwa &amp; Limefungwa!</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-rose-700">
                      Somo hili limechukuliwa na <strong>{lockStatusForSelection.lockDetails?.teacherName}</strong> ({lockStatusForSelection.lockDetails?.teacherIdentifier}) kwa mwaka huu. Hutaweza kulichukua.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Somo Lipo Wazi Kufungwa Kwako</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Ukilihifadhi, litafungwa kwako kwa mwaka mzima wa masomo {currentAcademicYear}. Mwalimu mwingine hataweza kulichukua.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    disabled={lockStatusForSelection.isLocked}
                    className={`px-5 py-2 rounded-xl font-black shadow-md flex items-center gap-1.5 ${
                      lockStatusForSelection.isLocked
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Funga Somo Kwangu</span>
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
