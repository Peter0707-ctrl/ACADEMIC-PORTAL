'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  Users,
  Search,
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  FileSpreadsheet,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { INITIAL_PUPILS, StudentMark } from '@/lib/teacher-data';
import { notifyUser } from '@/lib/notifications';

const PRIMARY_CLASSES = [
  'Standard 7 (Grade 7)',
  'Standard 6 (Grade 6)',
  'Standard 5 (Grade 5)',
  'Standard 4 (Grade 4)',
  'Standard 3 (Grade 3)',
  'Standard 2 (Grade 2)',
  'Standard 1 (Grade 1)',
];

export default function PupilPerformancePage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('Standard 6 (Grade 6)');
  const [searchTerm, setSearchTerm] = useState('');
  const [performanceTab, setPerformanceTab] = useState<'OVERVIEW' | 'ATTENTION' | 'INDIVIDUAL'>('OVERVIEW');
  const [selectedPupil, setSelectedPupil] = useState<StudentMark | null>(null);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      if (session.assignedClasses && session.assignedClasses.length > 0) {
        setSelectedClass(session.assignedClasses[0]);
      }
    }
  }, []);

  const pupils: StudentMark[] = INITIAL_PUPILS[selectedClass] || INITIAL_PUPILS['Standard 6 (Grade 6)'] || [];

  const totalPupils = pupils.length;
  const totalScore = pupils.reduce((sum, p) => sum + p.mark, 0);
  const classAverage = totalPupils > 0 ? Math.round(totalScore / totalPupils) : 0;

  // Pupils needing academic attention (Grade D or F, or score < 50)
  const attentionPupils = pupils.filter((p) => p.grade === 'D' || p.grade === 'F' || p.mark < 50);

  // Top performers (Grade A, score >= 85)
  const topPerformers = pupils.filter((p) => p.mark >= 85).sort((a, b) => b.mark - a.mark);

  const filteredPupils = pupils.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.admNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TeacherShell
      pageTitle="Ufaulu wa Wanafunzi (Pupil Performance)"
      pageDescription="Tathmini ya kina ya ufaulu wa mtu mmoja mmoja, wastani wa darasa na somo, na orodha ya wanafunzi wanaohitaji uangalizi maalum."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Class Selection & Top Metrics */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Uchambuzi wa Ufaulu: {selectedClass}
              </h2>
              <span className="text-xs text-slate-500">
                Wanafunzi {totalPupils} • Wastani wa Darasa: {classAverage}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Badili Darasa:</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedPupil(null);
              }}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              {PRIMARY_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Wastani wa Darasa (Class Avg)
              </span>
              <span className="text-2xl font-black text-emerald-800 block mt-1">{classAverage}%</span>
              <span className="text-[11px] font-semibold text-emerald-600">Kiwango cha Jumla: B (Nzuri)</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Kinara wa Darasa (Top Pupil)
              </span>
              <span className="text-sm font-black text-slate-900 block mt-1 truncate max-w-[150px]">
                {topPerformers[0]?.name || 'N/A'}
              </span>
              <span className="text-[11px] font-semibold text-amber-600">
                Alama: {topPerformers[0]?.mark || 0}% (Daraja A)
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Wanafunzi wa Daraja A
              </span>
              <span className="text-2xl font-black text-blue-900 block mt-1">{topPerformers.length}</span>
              <span className="text-[11px] font-semibold text-blue-700">
                {Math.round((topPerformers.length / totalPupils) * 100)}% ya darasa wapo kiwango cha juu
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                Wanaohitaji Uangalizi
              </span>
              <span className="text-2xl font-black text-rose-700 block mt-1">{attentionPupils.length}</span>
              <span className="text-[11px] font-semibold text-rose-600">
                Wanahitaji masomo ya ziada na kambi ya jioni
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setPerformanceTab('OVERVIEW')}
            className={`py-2 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              performanceTab === 'OVERVIEW'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Muhtasari wa Somo & Darasa (Overview)
          </button>
          <button
            onClick={() => setPerformanceTab('ATTENTION')}
            className={`py-2 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              performanceTab === 'ATTENTION'
                ? 'border-rose-600 text-rose-900 bg-rose-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Wanaohitaji Uangalizi Maalum (Academic Attention)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
              {attentionPupils.length}
            </span>
          </button>
          <button
            onClick={() => setPerformanceTab('INDIVIDUAL')}
            className={`py-2 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer ${
              performanceTab === 'INDIVIDUAL'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Ufaulu wa Kila Mwanafunzi (Individual Performance)
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {performanceTab === 'OVERVIEW' && (
          <div className="space-y-5">
            {/* Subject Performance Breakdown Bar Grid */}
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900">
                Ufaulu wa Masomo ya {selectedClass} (Subject Performance Breakdown)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Mathematics (Hisabati)', avg: 82, teacher: 'Mwl. Augustine Mrosso', grade: 'A' },
                  { name: 'Science & Technology (Sayansi)', avg: 86, teacher: 'Mwl. Beatrice Kimaro', grade: 'A' },
                  { name: 'English Language', avg: 79, teacher: 'Mwl. Sarah Mollel', grade: 'B' },
                  { name: 'Kiswahili', avg: 88, teacher: 'Mwl. Emmanuel Lyimo', grade: 'A' },
                  { name: 'Social Studies (Maarifa ya Jamii)', avg: 74, teacher: 'Mwl. Emmanuel Swai', grade: 'B' },
                  { name: 'Civic & Moral Education (Uraia)', avg: 85, teacher: 'Mwl. Godfrey Makere', grade: 'A' },
                ].map((s) => (
                  <div key={s.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 truncate max-w-[170px]">{s.name}</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          s.grade === 'A' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        Daraja {s.grade}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold">{s.teacher}</span>
                      <span className="font-black text-slate-900">{s.avg}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.avg >= 80 ? 'bg-emerald-600' : 'bg-blue-600'}`}
                        style={{ width: `${s.avg}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENTION (PUPILS NEEDING INTERVENTION) */}
        {performanceTab === 'ATTENTION' && (
          <div className="bg-white rounded-3xl border border-rose-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-base font-black text-slate-900">
                    Wanafunzi Wanaohitaji Msaada wa Kitaaluma (Remedial Attention)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Orodha ya wanafunzi wenye alama chini ya 50% au daraja D/F. Mipango ya masomo ya ziada na mawasiliano ya wazazi inapendekezwa.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  notifyUser(
                    'info',
                    'Mpango wa Masomo ya Ziada',
                    'Mpango wa masomo ya jioni (Remedial Schedule) umetumwa kwa wazazi wa wanafunzi hawa.'
                  )
                }
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs shrink-0 self-start sm:self-auto"
              >
                + Panga Masomo ya Ziada (Remedial)
              </button>
            </div>

            {attentionPupils.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                Hongera sana! Hakuna mwanafunzi aliye chini ya wastani (D au F) kwenye darasa hili.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-rose-50/60 text-slate-700 font-bold border-b border-rose-100 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Namba ya Usajili</th>
                      <th className="py-3 px-3">Jina la Mwanafunzi</th>
                      <th className="py-3 px-3 text-center">Wastani</th>
                      <th className="py-3 px-3 text-center">Daraja</th>
                      <th className="py-3 px-3">Somo Linalohitaji Msaada</th>
                      <th className="py-3 px-3">Hatua Inayopendekezwa</th>
                      <th className="py-3 px-3 text-right">Mawasiliano</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {attentionPupils.map((pupil, idx) => (
                      <tr key={pupil.id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{pupil.admNo}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{pupil.name}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-rose-700">{pupil.mark}%</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                            {pupil.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">Mathematics &amp; Science</td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                          Kipindi cha ziada saa 10:00 - 11:00 jioni
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              notifyUser(
                                'info',
                                'Ujumbe kwa Mzazi',
                                `Ujumbe wa mwaliko wa kikao cha kitaaluma umetumwa kwa mzazi wa ${pupil.name}.`
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200"
                          >
                            Tuma SMS &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INDIVIDUAL PERFORMANCE */}
        {performanceTab === 'INDIVIDUAL' && (
          <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Ufaulu wa Kila Mwanafunzi (Individual Records)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tazama maendeleo ya mtihani wa mwezi, nusu muhula (midterm) na muhula mzima.
                </p>
              </div>

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
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Namba</th>
                    <th className="py-3 px-3">Jina la Mwanafunzi</th>
                    <th className="py-3 px-3 text-center">Jaribio 1</th>
                    <th className="py-3 px-3 text-center">Jaribio 2</th>
                    <th className="py-3 px-3 text-center">Mid-Term</th>
                    <th className="py-3 px-3 text-center">Terminal</th>
                    <th className="py-3 px-3 text-center">Wastani</th>
                    <th className="py-3 px-3 text-center">Daraja</th>
                    <th className="py-3 px-3">Maoni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredPupils.map((pupil, idx) => (
                    <tr key={pupil.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{pupil.admNo}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{pupil.name}</td>
                      <td className="py-2.5 px-3 text-center">{pupil.monthlyTest1}%</td>
                      <td className="py-2.5 px-3 text-center">{pupil.monthlyTest2}%</td>
                      <td className="py-2.5 px-3 text-center">{pupil.midtermExam}%</td>
                      <td className="py-2.5 px-3 text-center">{pupil.terminalExam}%</td>
                      <td className="py-2.5 px-3 text-center font-black text-emerald-800">{pupil.mark}%</td>
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
                      <td className="py-2.5 px-3 text-slate-600 text-[11px] italic">
                        {pupil.remarks || 'Ufaulu mzuri'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}

