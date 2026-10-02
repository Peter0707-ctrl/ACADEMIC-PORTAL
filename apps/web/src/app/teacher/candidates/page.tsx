'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  AlertCircle,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getStoredAccounts } from '@/lib/auth-session';

export default function CandidatesPage() {
  const [examTypeFilter, setExamTypeFilter] = useState<'ALL' | 'PSLE' | 'SFNA'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const allAccounts = getStoredAccounts();

  const candidates = useMemo(() => {
    return allAccounts.filter((a) => a.role === 'CANDIDATE');
  }, [allAccounts]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.examIndexNo && c.examIndexNo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = examTypeFilter === 'ALL' || c.candidateType === examTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [candidates, searchTerm, examTypeFilter]);

  return (
    <TeacherShell
      pageTitle="Watahiniwa wa Taifa (NECTA Candidates: PSLE & SFNA)"
      pageDescription="Ofisi ya Mwalimu wa Taaluma: Usimamizi wa watahiniwa wa Mitihani ya Taifa ya Darasa la Saba (PSLE) na Upimaji wa Kitaifa wa Darasa la Nne (SFNA)."
    >
      <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Jumla ya Watahiniwa</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">{candidates.length} Watahiniwa</span>
            <span className="text-[11px] text-emerald-700 font-bold">Wamesajiliwa NECTA Portal</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Darasa la 7 (PSLE)</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">
              {candidates.filter((c) => c.candidateType === 'PSLE').length} Watahiniwa
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">Mock Exam Target: 100% Pass</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Darasa la 4 (SFNA)</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">
              {candidates.filter((c) => c.candidateType === 'SFNA').length} Watahiniwa
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">Upimaji wa Kitaifa</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Hali ya Utayari (Readiness)</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">98.5%</span>
            <span className="text-[11px] text-emerald-700 font-bold">Kazi za majaribio zimekamilika</span>
          </div>
        </div>

        {/* Candidates Table Card */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-800">
                Orodha Rasmi ya Watahiniwa wa Taifa (NECTA Registered)
              </h3>
              <p className="text-xs text-slate-500">
                Taarifa za usajili, nambari za mtihani (Index Numbers), na ufuatiliaji wa maendeleo ya mitihani ya majaribio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tafuta mtahiniwa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent focus:outline-none text-slate-700 w-32 sm:w-44"
                />
              </div>

              <select
                value={examTypeFilter}
                onChange={(e) => setExamTypeFilter(e.target.value as any)}
                className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Mitihani Yote</option>
                <option value="PSLE">PSLE (Darasa la Saba)</option>
                <option value="SFNA">SFNA (Darasa la Nne)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Jina Kamili la Mtahiniwa</th>
                  <th className="py-3 px-4">Namba ya Usajili Shuleni</th>
                  <th className="py-3 px-4">Namba ya Mtihani (Index No)</th>
                  <th className="py-3 px-4">Aina ya Mtihani</th>
                  <th className="py-3 px-4">Darasa</th>
                  <th className="py-3 px-4">Hali ya Usajili</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredCandidates.map((cand, idx) => (
                  <tr key={cand.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{cand.fullName}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700">{cand.identifier}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {cand.examIndexNo || 'Inasubiri NECTA'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200 font-bold text-[10px]">
                        {cand.candidateType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{cand.assignedClass}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px]">
                        VERIFIED ACTIVE
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
