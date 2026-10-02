'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  Filter,
  Check,
  AlertTriangle,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { SYLLABUS_OVERVIEW, SyllabusItem } from '@/lib/teacher-data';

export default function CurriculumOversightPage() {
  const [syllabusList, setSyllabusList] = useState<SyllabusItem[]>(SYLLABUS_OVERVIEW);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('ALL');

  const filteredList = syllabusList.filter((item) => {
    if (selectedGradeFilter === 'ALL') return true;
    return item.grade.includes(selectedGradeFilter);
  });

  return (
    <TeacherShell
      pageTitle="Usimamizi wa Mitaala & Maazimio ya Kazi (Curriculum Oversight)"
      pageDescription="Ofisi ya Mkuu wa Shule & Taaluma: Ufuatiliaji wa ufundishaji, ukamilishaji wa maazimio ya kazi (Lesson Plans) na mtaala wa NECTA."
    >
      <div className="space-y-6 animate-fade-in">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Wastani wa Mtaala Shuleni</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">80.6%</span>
            <span className="text-[11px] text-emerald-700 font-bold">Kiwango kinachoridhisha (Term 1)</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Maazimio Yaliyowasilishwa</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">65 / 80</span>
            <span className="text-[11px] text-emerald-700 font-bold">81.2% ya walimu wamewasilisha</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Masomo Yaliyo Kwenye Ratiba</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">4 / 5</span>
            <span className="text-[11px] text-emerald-700 font-bold">Yanaendelea kwa kasi inayotakiwa</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Uangalizi wa Karibu</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">1 Somo</span>
            <span className="text-[11px] text-amber-700 font-bold">Standard 5 English inahitaji kasi</span>
          </div>
        </div>

        {/* Syllabus Tracking Table */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-800">
                Jedwali la Ukamilishaji wa Mada &amp; Maandalio ya Masomo
              </h3>
              <p className="text-xs text-slate-500">
                Uchambuzi wa mada zilizofundishwa kwa kila darasa na somo, pamoja na uwasilishaji wa maazimio ya kazi.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Chuja:</span>
              <select
                value={selectedGradeFilter}
                onChange={(e) => setSelectedGradeFilter(e.target.value)}
                className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Madarasa Yote</option>
                <option value="Standard 7">Standard 7</option>
                <option value="Standard 6">Standard 6</option>
                <option value="Standard 5">Standard 5</option>
                <option value="Standard 4">Standard 4</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Darasa</th>
                  <th className="py-3 px-4">Somo</th>
                  <th className="py-3 px-4">Mwalimu Mhusika</th>
                  <th className="py-3 px-4">Maazimio Yaliyowasilishwa</th>
                  <th className="py-3 px-4">Ukamilishaji wa Mada</th>
                  <th className="py-3 px-4">Hali</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-800">{item.grade}</td>
                    <td className="py-3 px-4 text-emerald-900 font-semibold">{item.subject}</td>
                    <td className="py-3 px-4 text-slate-700">{item.teacher}</td>
                    <td className="py-3 px-4 font-mono">
                      {item.lessonPlansSubmitted} / {item.lessonPlansTotal} wiki
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.completion >= 80
                                ? 'bg-emerald-600'
                                : item.completion >= 60
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.completion}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700 text-xs w-8 text-right">
                          {item.completion}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          item.status === 'ON_TRACK'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {item.status === 'ON_TRACK' ? 'On Track' : 'Behind Schedule'}
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
