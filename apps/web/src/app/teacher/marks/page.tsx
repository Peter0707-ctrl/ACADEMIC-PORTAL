'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  Check,
  Building2,
  Users,
  Search,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';
import { INITIAL_PUPILS, StudentMark, calculateGrade } from '@/lib/teacher-data';

export default function SubjectMarksPage() {
  const currentUser = getCurrentSession();

  const [pupilsData, setPupilsData] = useState<Record<string, StudentMark[]>>(INITIAL_PUPILS);
  const [selectedClass, setSelectedClass] = useState<string>('Standard 6 (Grade 6)');
  const [selectedSubject, setSelectedSubject] = useState<string>('Civic & Moral Education (Uraia na Maadili)');
  const [searchPupil, setSearchPupil] = useState('');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  // Sync with current teacher's assignments
  useEffect(() => {
    const session = getCurrentSession();
    if (session?.assignedClasses && session.assignedClasses.length > 0) {
      setSelectedClass(session.assignedClasses[0]);
    } else if (session?.assignedClass && session.assignedClass !== 'Whole School') {
      setSelectedClass(session.assignedClass);
    }

    if (session?.subjects && session.subjects.length > 0) {
      setSelectedSubject(session.subjects[0]);
    }
  }, []);

  const currentPupils = useMemo(() => {
    const list = pupilsData[selectedClass] || pupilsData['Standard 6 (Grade 6)'] || [];
    if (!searchPupil.trim()) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(searchPupil.toLowerCase()) ||
        p.admNo.toLowerCase().includes(searchPupil.toLowerCase())
    );
  }, [pupilsData, selectedClass, searchPupil]);

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

  const isHeadteacher = currentUser?.role === 'HEADTEACHER' || currentUser?.leadershipRole === 'HEADTEACHER';
  const isLeader = ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(currentUser?.role || '');

  return (
    <TeacherShell
      pageTitle="Kujaza Alama za Somo (Subject Marks Entry)"
      pageDescription="Weka alama za majaribio, Continuous Assessment (CA) na mitihani ya muhula kwa madarasa unayofundisha."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Notice alert */}
        {activeNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{activeNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveNotice(null)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0"
            >
              Funga
            </button>
          </div>
        )}

        {/* Headteacher Teaching Context Banner */}
        {isLeader && currentUser?.subjects && (
          <div className="p-4 rounded-3xl bg-emerald-50/90 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isHeadteacher ? 'Dashboard ya Mwalimu Mkuu Darasani' : 'Dashboard ya Mwalimu Kiongozi Darasani'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Unafundisha: <strong className="text-emerald-900">{currentUser.subjects.join(', ')}</strong> kwa madarasa: <strong className="text-emerald-900">{currentUser.assignedClasses?.join(' & ') || currentUser.assignedClass}</strong>. Alama unazoweka hapa zinajumuishwa moja kwa moja kwenye broadsheet rasmi.
                </p>
              </div>
            </div>

            {isHeadteacher && (
              <Link
                href="/teacher/approvals"
                className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-colors shadow-2xs"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Rudi Ofisi ya Mkuu</span>
              </Link>
            )}
          </div>
        )}

        {/* Marks Entry Workspace Card */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-800">
                Uwekaji wa Alama • {selectedClass}
              </h3>
              <p className="text-xs text-slate-500">
                Somo Lililochaguliwa: <span className="font-bold text-emerald-800">{selectedSubject}</span> • Madaraja (Grade A, B, C, D, F) yanapigwa kiotomatiki.
              </p>
            </div>

            {/* Dropdowns & Save Action */}
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Chagua Darasa</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {Object.keys(pupilsData).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Somo Lako</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {currentUser?.subjects?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  )) || (
                    <option value="Somo Rasmi">Somo Rasmi</option>
                  )}
                </select>
              </div>

              <div className="self-end">
                <button
                  type="button"
                  onClick={() => setActiveNotice(`Alama za ${selectedClass} (${selectedSubject}) zimehifadhiwa kikamilifu na kupelekwa kwa Mwalimu wa Taaluma.`)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hifadhi Alama Zote</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Pupil Filter */}
          <div className="flex items-center gap-2 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tafuta mwanafunzi kwa jina au namba..."
              value={searchPupil}
              onChange={(e) => setSearchPupil(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Marks Table */}
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
                        className="w-20 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white text-center"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-black text-xs ${
                          pupil.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : pupil.grade === 'B'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : pupil.grade === 'C'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        Grade {pupil.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {pupil.grade === 'A' && 'Ufaulu Bora Sana'}
                      {pupil.grade === 'B' && 'Ufaulu Mzuri'}
                      {pupil.grade === 'C' && 'Wastani wa Kuridhisha'}
                      {pupil.grade === 'D' && 'Anahitaji Masomo ya Ziada'}
                      {pupil.grade === 'F' && 'Uangalizi Maalum'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
