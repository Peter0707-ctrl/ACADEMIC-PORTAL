'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Plus,
  Users,
  CheckCircle2,
  UserCheck,
  Edit2,
  Trash2,
  X,
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  GraduationCap,
} from 'lucide-react';
import AdminShell from '@/components/admin-shell';
import { getStoredAccounts, UserAccount, PRIMARY_CLASSES_LIST } from '@/lib/auth-session';

interface ClassStream {
  id: string;
  className: string;
  streamName: string; // e.g., 'Stream A' or 'Blue'
  capacity: number;
  homeroomTeacherId?: string;
  homeroomTeacherName?: string;
}

const DEFAULT_STREAMS: ClassStream[] = [
  { id: 'CLS-STD7-A', className: 'Standard 7 (Grade 7)', streamName: 'Stream A', capacity: 45 },
  { id: 'CLS-STD7-B', className: 'Standard 7 (Grade 7)', streamName: 'Stream B', capacity: 45 },
  { id: 'CLS-STD6-A', className: 'Standard 6 (Grade 6)', streamName: 'Stream A', capacity: 45 },
  { id: 'CLS-STD5-A', className: 'Standard 5 (Grade 5)', streamName: 'Stream A', capacity: 45 },
  { id: 'CLS-STD4-A', className: 'Standard 4 (Grade 4)', streamName: 'Stream A', capacity: 45 },
  { id: 'CLS-STD3-A', className: 'Standard 3 (Grade 3)', streamName: 'Stream A', capacity: 45 },
  { id: 'CLS-STD2-A', className: 'Standard 2 (Grade 2)', streamName: 'Stream A', capacity: 45 },
  { id: 'CLS-STD1-A', className: 'Standard 1 (Grade 1)', streamName: 'Stream A', capacity: 40 },
  { id: 'CLS-PREUNIT', className: 'Pre-Unit / Kindergarten', streamName: 'Pre-School', capacity: 35 },
  { id: 'CLS-NURSERY', className: 'Nursery & Day Care', streamName: 'Day Care', capacity: 30 },
];

const STORAGE_KEY = 'academic_portal_classes_config_v1';

export default function AdminClassesPage() {
  const [streams, setStreams] = useState<ClassStream[]>(DEFAULT_STREAMS);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Stream Form State
  const [selectedClass, setSelectedClass] = useState(PRIMARY_CLASSES_LIST[0]);
  const [streamNameInput, setStreamNameInput] = useState('Stream A');
  const [capacityInput, setCapacityInput] = useState(45);
  const [teacherInput, setTeacherInput] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const accs = getStoredAccounts();
    setAccounts(accs);

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setStreams(JSON.parse(raw));
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

  const saveStreams = (data: ClassStream[]) => {
    setStreams(data);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  };

  const handleAddStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamNameInput.trim()) return;

    const teacher = teachers.find((t) => t.id === teacherInput);

    const newStream: ClassStream = {
      id: `CLS-${Date.now().toString().slice(-4)}`,
      className: selectedClass,
      streamName: streamNameInput.trim(),
      capacity: Number(capacityInput) || 45,
      homeroomTeacherId: teacher?.id,
      homeroomTeacherName: teacher?.fullName,
    };

    const updated = [newStream, ...streams];
    saveStreams(updated);
    setShowAddModal(false);
    setToastMessage(`Mkondo ${newStream.className} (${newStream.streamName}) umeongezwa kikamilifu.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAssignTeacher = (streamId: string, teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    const updated = streams.map((s) => {
      if (s.id !== streamId) return s;
      return {
        ...s,
        homeroomTeacherId: teacher?.id,
        homeroomTeacherName: teacher?.fullName,
      };
    });
    saveStreams(updated);
    setToastMessage(`Mwalimu mlezi ameteuliwa kwa mkondo huu.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteStream = (streamId: string) => {
    const updated = streams.filter((s) => s.id !== streamId);
    saveStreams(updated);
    setToastMessage('Mkondo umefutwa.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AdminShell
      pageTitle="Madarasa, Mikondo &amp; Walimu Walezi"
      pageDescription="Sanidi orodha ya madarasa yote shuleni, gawa mikondo (mf. Stream A, B, C au Blue/Green), na teua walimu walezi (Homeroom Teachers)."
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

        {/* Add Stream Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Ongeza Darasa au Mkondo Mpya</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStream} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chagua Darasa</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {PRIMARY_CLASSES_LIST.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                    <option value="Pre-Unit / Kindergarten">Pre-Unit / Kindergarten</option>
                    <option value="Nursery & Day Care">Nursery & Day Care</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jina la Mkondo (Stream)</label>
                    <input
                      type="text"
                      required
                      value={streamNameInput}
                      onChange={(e) => setStreamNameInput(e.target.value)}
                      placeholder="k.m. Stream A au Blue"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Uwezo wa Darasa (Max Capacity)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={100}
                      value={capacityInput}
                      onChange={(e) => setCapacityInput(Number(e.target.value))}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mwalimu Mlezi wa Darasa (Homeroom Teacher)</label>
                  <select
                    value={teacherInput}
                    onChange={(e) => setTeacherInput(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Chagua Mwalimu Mlezi (Hiari) --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.identifier})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    Hifadhi Mkondo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Orodha ya Madarasa &amp; Mikondo ({streams.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Madarasa yote yanayotambuliwa katika mwaka wa masomo
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Ongeza Mkondo Mpya</span>
          </button>
        </div>

        {/* Streams Table */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Darasa &amp; Mkondo</th>
                  <th className="py-3 px-4">Mwalimu Mlezi (Homeroom Teacher)</th>
                  <th className="py-3 px-4">Uwezo wa Darasa</th>
                  <th className="py-3 px-4">Wanafunzi Waliosajiliwa</th>
                  <th className="py-3 px-4 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {streams.map((stream) => {
                  const studentCount = accounts.filter(
                    (a) => a.assignedClass === stream.className && (a.role === 'STUDENT' || a.role === 'CANDIDATE')
                  ).length;

                  return (
                    <tr key={stream.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{stream.className}</span>
                            <span className="text-[10px] text-indigo-600 font-semibold">{stream.streamName}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={stream.homeroomTeacherId || ''}
                          onChange={(e) => handleAssignTeacher(stream.id, e.target.value)}
                          className="rounded-xl bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 max-w-[220px]"
                        >
                          <option value="">-- Hakuna Mlezi Aliyeteuliwa --</option>
                          {teachers.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.fullName}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        Wanafunzi {stream.capacity} (Max)
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{studentCount}</span>
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, (studentCount / stream.capacity) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteStream(stream.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Futa mkondo huu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
