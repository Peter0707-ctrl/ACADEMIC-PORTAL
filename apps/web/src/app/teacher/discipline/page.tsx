'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  UserCheck,
  Check,
  Mail,
  AlertCircle,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { INITIAL_INCIDENTS, DisciplineIncident } from '@/lib/teacher-data';

export default function DisciplinePage() {
  const [incidents, setIncidents] = useState<DisciplineIncident[]>(INITIAL_INCIDENTS);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  const handleResolveIncident = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'RESOLVED' as const } : inc))
    );
    setActiveNotice('Suala la nidhamu limetatuliwa na kurekodiwa rasmi.');
  };

  return (
    <TeacherShell
      pageTitle="Nidhamu ya Shule, Mahudhurio & Wito wa Wazazi"
      pageDescription="Ofisi ya Mwalimu wa Nidhamu: Ufuatiliaji wa utoro, mwenendo na sare za wanafunzi, na utoaji wa barua za wito kwa wazazi."
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

        {/* Discipline & Attendance Summary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Mahudhurio ya Shule Nzima</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">96.4% Leo</span>
            <span className="text-[11px] text-emerald-700 font-bold">Wanafunzi 380 kati ya 394</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-rose-600 block">Wanafunzi Watoro Leo</span>
            <span className="text-2xl font-black text-rose-600 block mt-1">8 Wanafunzi</span>
            <span className="text-[11px] text-rose-600 font-bold">2 bila taarifa kabisa</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-amber-600 block">Wito wa Wazazi Uliotolewa</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">3 Barua</span>
            <span className="text-[11px] text-amber-700 font-bold">Zimetumwa kwa njia ya SMS & Barua</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-emerald-700 block">Masuala Yaliyotatuliwa</span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">12 Muhula Huu</span>
            <span className="text-[11px] text-emerald-700 font-bold">Ushauri nasaha umefanyika</span>
          </div>
        </div>

        {/* Incidents & Summons Register */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-800">
                Daftari la Makosa ya Nidhamu &amp; Hatua Zilizochukuliwa
              </h3>
              <p className="text-xs text-slate-500">
                Rekodi zote za utoro sugu, ukiukwaji wa sare na miiko ya shule huandikwa hapa kwa hatua za kisheria.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveNotice('Fomu mpya ya kurekodi kosa la nidhamu imefunguliwa.')}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Sajili Tukio Jipya la Nidhamu</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Tarehe</th>
                  <th className="py-3 px-4">Jina la Mwanafunzi</th>
                  <th className="py-3 px-4">Darasa</th>
                  <th className="py-3 px-4">Kosa / Suala Lililoripotiwa</th>
                  <th className="py-3 px-4">Hatua Iliyochukuliwa</th>
                  <th className="py-3 px-4">Mzazi Amejulishwa?</th>
                  <th className="py-3 px-4">Hali</th>
                  <th className="py-3 px-4">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-500">{inc.date}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{inc.pupilName}</td>
                    <td className="py-3 px-4 text-slate-600">{inc.class}</td>
                    <td className="py-3 px-4 text-rose-700 font-semibold">{inc.issue}</td>
                    <td className="py-3 px-4 text-slate-700">{inc.actionTaken}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inc.parentContacted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {inc.parentContacted ? 'Ndio (SMS)' : 'Bado'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        inc.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {inc.status === 'RESOLVED' ? 'YAMETATULIWA' : 'INASHUGHULIKIWA'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {inc.status !== 'RESOLVED' ? (
                        <button
                          type="button"
                          onClick={() => handleResolveIncident(inc.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors"
                        >
                          Funga Suala
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">—</span>
                      )}
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
