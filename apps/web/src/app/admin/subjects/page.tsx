'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Trash2,
  Edit2,
  Award,
  Layers,
  Users,
  Save,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import AdminShell from '@/components/admin-shell';
import { getStoredAccounts, UserAccount, PRIMARY_CLASSES_LIST, PRIMARY_SUBJECTS_LIST } from '@/lib/auth-session';

interface SubjectConfig {
  id: string;
  name: string;
  code: string;
  isCore: boolean;
}

interface GradeBoundary {
  grade: string;
  min: number;
  max: number;
  remark: string;
  color: string;
}

const DEFAULT_SUBJECTS: SubjectConfig[] = [
  { id: 'SUB-MATH', name: 'Mathematics (Hisabati)', code: 'MATH', isCore: true },
  { id: 'SUB-SCI', name: 'Science & Technology (Sayansi)', code: 'SCI', isCore: true },
  { id: 'SUB-ENG', name: 'English Language', code: 'ENG', isCore: true },
  { id: 'SUB-KISW', name: 'Kiswahili', code: 'KISW', isCore: true },
  { id: 'SUB-CIV', name: 'Civic & Moral Education (Uraia na Maadili)', code: 'CIV', isCore: true },
  { id: 'SUB-SOC', name: 'Social Studies (Maarifa ya Jamii)', code: 'SOC', isCore: true },
  { id: 'SUB-VOC', name: 'Vocational Skills (Stadi za Kazi)', code: 'VOC', isCore: false },
  { id: 'SUB-REL', name: 'Religious Studies (Elimu ya Dini)', code: 'REL', isCore: false },
  { id: 'SUB-ICT', name: 'ICT / Computer Studies (Tehama)', code: 'ICT', isCore: false },
];

const DEFAULT_GRADES: GradeBoundary[] = [
  { grade: 'A', min: 81, max: 100, remark: 'Bora Sana (Excellent)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
  { grade: 'B', min: 61, max: 80, remark: 'Vizuri Sana (Very Good)', color: 'text-blue-700 bg-blue-50 border-blue-300' },
  { grade: 'C', min: 41, max: 60, remark: 'Wastani (Average)', color: 'text-amber-700 bg-amber-50 border-amber-300' },
  { grade: 'D', min: 21, max: 40, remark: 'Dhaifu (Poor)', color: 'text-orange-700 bg-orange-50 border-orange-300' },
  { grade: 'F', min: 0, max: 20, remark: 'Feli (Fail)', color: 'text-rose-700 bg-rose-50 border-rose-300' },
];

const STORAGE_KEY = 'academic_portal_subjects_config_v1';

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectConfig[]>(DEFAULT_SUBJECTS);
  const [grades, setGrades] = useState<GradeBoundary[]>(DEFAULT_GRADES);
  const [passThreshold, setPassThreshold] = useState<number>(40);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);

  // Mapping Form
  const [selectedClass, setSelectedClass] = useState(PRIMARY_CLASSES_LIST[0]);
  const [selectedSubject, setSelectedSubject] = useState(DEFAULT_SUBJECTS[0].name);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  // Add Subject Modal
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setAccounts(getStoredAccounts());
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.subjects) setSubjects(parsed.subjects);
          if (parsed.grades) setGrades(parsed.grades);
          if (parsed.passThreshold) setPassThreshold(parsed.passThreshold);
        }
      } catch {
        // default
      }
    }
  }, []);

  const teachers = useMemo(() => {
    return accounts.filter((a) =>
      ['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(a.role)
    );
  }, [accounts]);

  const saveConfig = (data: { subjects: SubjectConfig[]; grades: GradeBoundary[]; passThreshold: number }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    setToastMessage('Mipangilio ya mitaala na madaraja imehifadhiwa.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newSub: SubjectConfig = {
      id: `SUB-${Date.now().toString().slice(-4)}`,
      name: newSubjectName.trim(),
      code: newSubjectCode.trim().toUpperCase() || 'SUB',
      isCore: true,
    };

    const updated = [...subjects, newSub];
    setSubjects(updated);
    saveConfig({ subjects: updated, grades, passThreshold });
    setShowAddSubjectModal(false);
    setNewSubjectName('');
    setNewSubjectCode('');
  };

  const handleDeleteSubject = (id: string) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    saveConfig({ subjects: updated, grades, passThreshold });
  };

  const handleSaveGrades = () => {
    saveConfig({ subjects, grades, passThreshold });
  };

  return (
    <AdminShell
      pageTitle="Mitaala, Masomo &amp; Madaraja ya Ufaulu"
      pageDescription="Sanidi orodha ya masomo ya kitaifa, mgao wa walimu, vigezo vya ufaulu (Passing Threshold), na madaraja ya NECTA (A hadi F)."
    >
      <div className="space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
            <div className="bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Add Subject Modal */}
        {showAddSubjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Ongeza Somo Jipya</h3>
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubject} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jina la Somo</label>
                  <input
                    type="text"
                    required
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="k.m. Kifaransa (French)"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kifupi / Code</label>
                  <input
                    type="text"
                    required
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                    placeholder="k.m. FRN"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono uppercase text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSubjectModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    Hifadhi Somo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 1. Subjects Registry */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Daftari la Masomo ya Kitaifa ({subjects.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Masomo yote yanayotahiniwa na kufundishwa shuleni
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddSubjectModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Ongeza Somo Jipya</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{sub.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">Code: {sub.code}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSubject(sub.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Ondoa somo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Grade Boundaries & Passing Threshold */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Madaraja ya Ufaulu (National Grade Boundaries)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Alama na madaraja yanayotumika kupima matokeo ya mitihani
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold text-slate-700">Kiwango cha Chini cha Ufaulu:</span>
              <input
                type="number"
                min={0}
                max={100}
                value={passThreshold}
                onChange={(e) => setPassThreshold(Number(e.target.value))}
                className="w-16 rounded-xl bg-slate-50 border border-slate-200 px-2 py-1 text-xs font-bold text-slate-800 text-center"
              />
              <span className="text-xs font-bold text-slate-500">%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            {grades.map((g, idx) => (
              <div key={g.grade} className={`p-4 rounded-2xl border ${g.color} space-y-2 text-center`}>
                <span className="text-2xl font-black block">{g.grade}</span>
                <span className="text-xs font-bold block">{g.min}% - {g.max}%</span>
                <span className="text-[10px] block opacity-90">{g.remark}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveGrades}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Hifadhi Madaraja &amp; Ufaulu</span>
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
