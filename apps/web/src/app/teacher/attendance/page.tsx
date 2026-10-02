'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  X,
  BookOpen,
  Calendar,
  Building2,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';
import { INITIAL_PUPILS, StudentMark } from '@/lib/teacher-data';

export default function DailyAttendancePage() {
  const currentUser = getCurrentSession();

  const [pupilsData, setPupilsData] = useState<Record<string, StudentMark[]>>(INITIAL_PUPILS);
  const [selectedClass, setSelectedClass] = useState<string>('Standard 6 (Grade 6)');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  // Sync with current teacher's assignments
  useEffect(() => {
    const session = getCurrentSession();
    if (session?.assignedClasses && session.assignedClasses.length > 0) {
      setSelectedClass(session.assignedClasses[0]);
    } else if (session?.assignedClass && session.assignedClass !== 'Whole School') {
      setSelectedClass(session.assignedClass);
    }
  }, []);

  const currentPupils = useMemo(() => {
    return pupilsData[selectedClass] || pupilsData['Standard 6 (Grade 6)'] || [];
  }, [pupilsData, selectedClass]);

  const handleAttendanceChange = (pupilId: string, status: 'PRESENT' | 'ABSENT' | 'PERMISSION') => {
    setPupilsData((prev) => {
      const classList = [...(prev[selectedClass] || prev['Standard 6 (Grade 6)'] || [])];
      const idx = classList.findIndex((p) => p.id === pupilId);
      if (idx !== -1) {
        classList[idx] = { ...classList[idx], attendance: status };
      }
      return { ...prev, [selectedClass]: classList };
    });
  };

  const presentCount = currentPupils.filter((p) => p.attendance === 'PRESENT').length;
  const absentCount = currentPupils.filter((p) => p.attendance === 'ABSENT').length;
  const permCount = currentPupils.filter((p) => p.attendance === 'PERMISSION').length;
  const attendanceRate = currentPupils.length > 0 ? Math.round((presentCount / currentPupils.length) * 100) : 0;

  const todayDate = new Date().toLocaleDateString('sw-TZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <TeacherShell
      pageTitle="Rejista ya Mahudhurio ya Kila Siku (Daily Roll-Call)"
      pageDescription="Chukua mahudhurio ya wanafunzi wa darasa lako. Taarifa za utoro hutumwa moja kwa moja kwa Mwalimu wa Nidhamu."
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

        {/* Tally Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Jumla ya Wanafunzi</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">{currentPupils.length}</span>
            <span className="text-[11px] text-slate-500">{selectedClass}</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-emerald-700 block">Waliopo (Present)</span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">{presentCount}</span>
            <span className="text-[11px] text-emerald-700 font-bold">{attendanceRate}% Attendance</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-rose-600 block">Hawapo (Absent)</span>
            <span className="text-2xl font-black text-rose-600 block mt-1">{absentCount}</span>
            <span className="text-[11px] text-rose-600 font-bold">Wameripotiwa kwa Nidhamu</span>
          </div>
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-amber-600 block">Wana Ruhusa (Permission)</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">{permCount}</span>
            <span className="text-[11px] text-amber-600 font-bold">Wana barua ya mzazi</span>
          </div>
        </div>

        {/* Attendance Register Card */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-800">
                  Rejista ya Darasa: {selectedClass}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                  {todayDate}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bofya hali ya mwanafunzi (Yupo / Hayupo / Ruhusa) kubadilisha rekodi.
              </p>
            </div>

            {/* Class Switcher & Submit Action */}
            <div className="flex flex-wrap items-center gap-2">
              <div>
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

              <button
                type="button"
                onClick={() => setActiveNotice(`Mahudhurio ya ${selectedClass} ya tarehe ${todayDate} yamewasilishwa na kuhifadhiwa kikamilifu.`)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Wasilisha Mahudhurio</span>
              </button>
            </div>
          </div>

          {/* Roll Call Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Jina la Mwanafunzi</th>
                  <th className="py-3 px-4">Namba ya Usajili</th>
                  <th className="py-3 px-4 text-center">Hali ya Mahudhurio (Bofya Kubadili)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {currentPupils.map((pupil, idx) => (
                  <tr key={pupil.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{pupil.name}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700">{pupil.admNo}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(pupil.id, 'PRESENT')}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            pupil.attendance === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Yupo (Present)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(pupil.id, 'ABSENT')}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            pupil.attendance === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Hayupo (Absent)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAttendanceChange(pupil.id, 'PERMISSION')}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            pupil.attendance === 'PERMISSION'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Ruhusa (Permission)</span>
                        </button>
                      </div>
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
