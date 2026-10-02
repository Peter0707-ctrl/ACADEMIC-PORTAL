'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Filter,
  CheckCircle2,
  Award,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { INITIAL_BROADSHEET, BroadsheetRow } from '@/lib/teacher-data';

export default function BroadsheetPage() {
  const [broadsheet] = useState<BroadsheetRow[]>(INITIAL_BROADSHEET);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  return (
    <TeacherShell
      pageTitle="Uratibu wa Mitihani & Broadsheets (Academic Records)"
      pageDescription="Ofisi ya Taaluma: Jedwali la alama za mitihani ya shule nzima, uhesabuji wa madaraja, na upangaji wa nafasi za ufaulu (Rankings)."
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

        {/* Broadsheet Overview Card */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-800">
                  Broadsheet ya Darasa la 7 (Term 1 - Continuous Assessment & Mock)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                  Uhesabuji Umekamilika
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Alama zote za masomo 6 zimejumuishwa kiotomatiki kutoka kwa walimu wa masomo.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveNotice('Broadsheet inapakuliwa kama Excel Spreadsheet kwa ajili ya uchambuzi wa kina.')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pakua Broadsheet (Excel)</span>
              </button>
              <Link
                href="/teacher/approvals"
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Peleka kwa Mwalimu Mkuu</span>
              </Link>
            </div>
          </div>

          {/* Broadsheet Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Nafasi</th>
                  <th className="py-3 px-4">Jina la Mwanafunzi</th>
                  <th className="py-3 px-3">Jinsia</th>
                  <th className="py-3 px-3 text-center">Hisabati</th>
                  <th className="py-3 px-3 text-center">English</th>
                  <th className="py-3 px-3 text-center">Kiswahili</th>
                  <th className="py-3 px-3 text-center">Sayansi</th>
                  <th className="py-3 px-3 text-center">Maarifa</th>
                  <th className="py-3 px-3 text-center">Uraia</th>
                  <th className="py-3 px-3 text-center font-bold text-slate-800">Jumla (600)</th>
                  <th className="py-3 px-3 text-center font-bold text-slate-800">Wastani</th>
                  <th className="py-3 px-3 text-center">Daraja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {broadsheet.map((row) => (
                  <tr key={row.admNo} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-black text-emerald-800">#{row.rank}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <div>{row.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{row.admNo}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{row.gender}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.math}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.english}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.kiswahili}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.science}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.social}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.civic}</td>
                    <td className="py-3 px-3 text-center font-mono font-black text-slate-900 bg-slate-50/50">
                      {row.total}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-800">
                      {row.average}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px]">
                        {row.division}
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
