'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Users,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  ClipboardList,
  Sparkles,
  BarChart3,
  Search,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { INITIAL_PUPILS, StudentMark } from '@/lib/teacher-data';

interface SubjectOffering {
  id: string;
  name: string;
  code: string;
  classes: string[];
  periodsPerWeek: number;
  topicsTotal: number;
  topicsCovered: number;
  syllabusProgress: number;
  averageScore: number;
  status: 'ON_TRACK' | 'BEHIND' | 'AHEAD';
}

const PRIMARY_SUBJECT_OFFERINGS: SubjectOffering[] = [
  {
    id: 'subj-01',
    name: 'Mathematics (Hisabati)',
    code: 'MATH-P',
    classes: ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)'],
    periodsPerWeek: 6,
    topicsTotal: 14,
    topicsCovered: 11,
    syllabusProgress: 78,
    averageScore: 82,
    status: 'ON_TRACK',
  },
  {
    id: 'subj-02',
    name: 'Science & Technology (Sayansi na Teknolojia)',
    code: 'SCI-P',
    classes: ['Standard 6 (Grade 6)'],
    periodsPerWeek: 5,
    topicsTotal: 12,
    topicsCovered: 10,
    syllabusProgress: 83,
    averageScore: 86,
    status: 'AHEAD',
  },
  {
    id: 'subj-03',
    name: 'Civic & Moral Education (Uraia na Maadili)',
    code: 'CIVIC-P',
    classes: ['Standard 7 (Grade 7)'],
    periodsPerWeek: 4,
    topicsTotal: 10,
    topicsCovered: 8,
    syllabusProgress: 80,
    averageScore: 88,
    status: 'ON_TRACK',
  },
  {
    id: 'subj-04',
    name: 'Social Studies (Maarifa ya Jamii)',
    code: 'SOC-P',
    classes: ['Standard 5 (Grade 5)'],
    periodsPerWeek: 5,
    topicsTotal: 12,
    topicsCovered: 7,
    syllabusProgress: 58,
    averageScore: 74,
    status: 'BEHIND',
  },
];

export default function MySubjectsPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectOffering>(PRIMARY_SUBJECT_OFFERINGS[0]);
  const [selectedClass, setSelectedClass] = useState<string>(PRIMARY_SUBJECT_OFFERINGS[0].classes[0]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }
  }, []);

  const pupils: StudentMark[] = INITIAL_PUPILS[selectedClass] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || [];

  const filteredPupils = pupils.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.admNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TeacherShell
      pageTitle="Masomo Yangu (My Subjects)"
      pageDescription="Usimamizi wa masomo uliyopangiwa kufundisha, wanafunzi wa kila somo na maendeleo ya mtaala (Syllabus Progress)."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Subject Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRIMARY_SUBJECT_OFFERINGS.map((subj) => {
            const isSelected = selectedSubject.id === subj.id;
            return (
              <div
                key={subj.id}
                onClick={() => {
                  setSelectedSubject(subj);
                  setSelectedClass(subj.classes[0]);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-800 to-teal-900 text-white border-emerald-700 shadow-md shadow-emerald-950/20'
                    : 'bg-white hover:bg-emerald-50/50 border-emerald-200 text-slate-800 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isSelected ? 'bg-white/20 text-amber-300' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {subj.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        subj.status === 'AHEAD'
                          ? isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                          : subj.status === 'ON_TRACK'
                          ? isSelected ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-800'
                          : isSelected ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {subj.status === 'AHEAD' ? 'Mbele ya Ratiba' : subj.status === 'ON_TRACK' ? 'Kwenye Ratiba' : 'Inahitaji Kasi'}
                    </span>
                  </div>

                  <h3 className="text-sm font-black mt-2 leading-snug">{subj.name}</h3>
                  <p
                    className={`text-xs mt-1 font-semibold ${
                      isSelected ? 'text-emerald-100/90' : 'text-slate-500'
                    }`}
                  >
                    {subj.classes.join(', ')} • {subj.periodsPerWeek} Vipindi / Wiki
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={isSelected ? 'text-emerald-200' : 'text-slate-500'}>Mtaala (Progress):</span>
                    <span className="font-bold">{subj.syllabusProgress}%</span>
                  </div>
                  <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isSelected ? 'bg-amber-400' : 'bg-emerald-600'}`}
                      style={{ width: `${subj.syllabusProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Subject Details & Class Pupils */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-black text-slate-900">
                  {selectedSubject.name} — Wanafunzi wa Somo
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Mada zilizofundishwa: {selectedSubject.topicsCovered} kati ya {selectedSubject.topicsTotal} ({selectedSubject.syllabusProgress}% ya Muhula)
              </p>
            </div>

            {/* Class Selector for the selected subject */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Darasa:</span>
              <div className="flex gap-1.5">
                {selectedSubject.classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedClass === cls
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cls.split(' ')[0] + ' ' + cls.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Key Subject Progress Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Wastani wa Somo Darasani</span>
              <span className="text-2xl font-black text-emerald-800 block mt-1">
                {selectedSubject.averageScore}%
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">Daraja: A (Bora Sana)</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Vipindi Vilivyokamilika</span>
              <span className="text-2xl font-black text-blue-900 block mt-1">
                {selectedSubject.topicsCovered * 4} Vipindi
              </span>
              <span className="text-[11px] font-semibold text-blue-700">Mada {selectedSubject.topicsCovered} zimekamilika</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
              <span className="text-xs font-bold text-slate-500 uppercase">Mada Zilizobaki</span>
              <span className="text-2xl font-black text-amber-900 block mt-1">
                {selectedSubject.topicsTotal - selectedSubject.topicsCovered} Mada
              </span>
              <span className="text-[11px] font-semibold text-amber-700">Zitakamilika kabla ya mitihani ya mwisho</span>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tafuta mwanafunzi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none w-56"
              />
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/teacher/curriculum"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Andaa Andiko la Somo (Lesson Plan)</span>
              </Link>
              <Link
                href={`/teacher/marks?class=${encodeURIComponent(selectedClass)}`}
                className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Jaza Alama za Somo &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Subject Pupils Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Namba ya Usajili</th>
                  <th className="py-3 px-3">Jina la Mwanafunzi</th>
                  <th className="py-3 px-3 text-center">Jinsia</th>
                  <th className="py-3 px-3 text-center">Majaribio ya Mwezi</th>
                  <th className="py-3 px-3 text-center">Mid-Term</th>
                  <th className="py-3 px-3 text-center">Terminal</th>
                  <th className="py-3 px-3 text-center">Wastani wa Somo</th>
                  <th className="py-3 px-3 text-center">Daraja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredPupils.map((pupil, idx) => (
                  <tr key={pupil.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">{pupil.admNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{pupil.name}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pupil.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {pupil.gender === 'F' ? 'Kike' : 'Kiume'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">{pupil.monthlyAvg}%</td>
                    <td className="py-2.5 px-3 text-center">{pupil.midtermExam}%</td>
                    <td className="py-2.5 px-3 text-center">{pupil.terminalExam}%</td>
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
