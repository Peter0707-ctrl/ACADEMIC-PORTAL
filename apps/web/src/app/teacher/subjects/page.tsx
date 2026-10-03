'use client';

import React, { useState, useEffect } from 'react';
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
import { notifyUser } from '@/lib/notifications';

export default function MySubjectsPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(INITIAL_BLUEPRINT_ACCOUNTS[0] || null);
  const [teachingAssignments, setTeachingAssignments] = useState<TeachingLoad[]>([
    { class: 'Standard 7 (Grade 7)', subject: 'Civic & Moral Education (Uraia na Maadili)' },
    { class: 'Standard 6 (Grade 6)', subject: 'Social Studies (Maarifa ya Jamii)' },
  ]);

  // Modal State for adding another Subject + Class
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClass, setNewClass] = useState<string>(PRIMARY_CLASSES_LIST[0]);
  const [newSubject, setNewSubject] = useState<string>(PRIMARY_SUBJECTS_LIST[0]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
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

  const handleAddSubjectAndClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const exists = teachingAssignments.some(
      (a) => a.class === newClass && a.subject === newSubject
    );
    if (exists) {
      notifyUser('warning', 'Somo Lipo Tayari', `Somo la ${newSubject} katika ${newClass} tayari lipo kwenye orodha yako.`);
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
    notifyUser('success', 'Somo Limeongezwa', `${newSubject} (${newClass}) limeongezwa kikamilifu kwenye masomo yako.`);
  };

  const handleRemoveAssignment = (indexToRemove: number) => {
    if (!currentUser) return;
    if (teachingAssignments.length <= 1) {
      notifyUser('warning', 'Kizuizi', 'Lazima ubakiwe na angalau somo moja unalofundisha.');
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

    notifyUser('info', 'Somo Limeondolewa', `${removed.subject} (${removed.class}) limeondolewa.`);
  };

  return (
    <TeacherShell
      pageTitle="Masomo Yangu (My Subjects)"
      pageDescription="Orodha rasmi ya masomo unayofundisha katika muhula huu."
    >
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-800" />
              <h2 className="text-lg font-black text-slate-900">
                Masomo Ninayofundisha ({teachingAssignments.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mwalimu: <strong className="text-emerald-950 font-bold">{currentUser?.fullName || 'Mwl. Augustine Mrosso'}</strong> • Masomo uliyopangiwa kufundisha muhula huu
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ongeza Somo na Darasa</span>
          </button>
        </div>

        {/* Subjects Grid - ONLY the subjects taught by this teacher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {teachingAssignments.map((assignment, index) => (
            <div
              key={`${assignment.class}-${assignment.subject}-${index}`}
              className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase tracking-wider">
                      Somo Langu
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-[10px]">
                      Kwenye Ratiba
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 pt-1">
                    {assignment.subject}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <span>Darasa: {assignment.class}</span>
                  </div>
                </div>

                {teachingAssignments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignment(index)}
                    title={`Ondoa somo hili`}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-base font-black text-slate-900">Ongeza Somo Utakalofundisha</h3>
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

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  Somo hili litaongezwa kwenye ratiba yako ya ufundishaji, uwekaji alama na maandalio ya somo (lesson plans).
                </div>

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
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black shadow-md"
                  >
                    Hifadhi Somo
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
