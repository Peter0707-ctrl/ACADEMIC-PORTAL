'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Users,
  Send,
  Plus,
  Tag,
  Clock,
  MessageSquare,
  ShieldCheck,
  Megaphone,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';

interface Announcement {
  id: string;
  title: string;
  targetAudience: 'Wote (Shule Nzima)' | 'Walimu Pekee' | 'Wazazi Pekee' | 'Watahiniwa NECTA';
  content: string;
  publishDate: string;
  author: string;
  status: 'PUBLISHED' | 'DRAFT';
  priority: 'HIGH' | 'NORMAL';
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Kikao cha Wazazi na Uongozi wa Shule (AGM) Muhula wa Kwanza',
    targetAudience: 'Wazazi Pekee',
    content: 'Tunapenda kuwataarifu wazazi na walezi wote kuwa kikao kikuu cha mwaka kitafanyika siku ya Jumamosi saa 3:00 Asubuhi ukumbini kwa ajili ya kujadili maendeleo ya taaluma na miundombinu ya shule.',
    publishDate: '2026-03-01',
    author: 'Mwl. Augustine Mrosso (Mkuu wa Shule)',
    status: 'PUBLISHED',
    priority: 'HIGH',
  },
  {
    id: 'ann-2',
    title: 'Utoaji wa Kazi za Likizo ya Pasaka (Easter Holiday Packages)',
    targetAudience: 'Wote (Shule Nzima)',
    content: 'Walimu wote wa masomo wanakumbushwa kuandaa na kupakia vifurushi vya maswali ya marudio kwa wanafunzi wote kabla ya shule kufungwa tarehe 28 Machi.',
    publishDate: '2026-03-05',
    author: 'Mwl. Beatrice Kimaro (Taaluma)',
    status: 'PUBLISHED',
    priority: 'NORMAL',
  },
  {
    id: 'ann-3',
    title: 'Kambi Maalum ya Kujisomea kwa Watahiniwa wa Darasa la 7 (PSLE)',
    targetAudience: 'Watahiniwa NECTA',
    content: 'Wazazi wa wanafunzi 32 wa Darasa la 7 wanataarifiwa kuwa kambi ya masomo ya asubuhi na jioni itaanza rasmi jumatatu ijayo chini ya uratibu wa walimu wa taaluma.',
    publishDate: '2026-03-10',
    author: 'Mwl. Augustine Mrosso (Mkuu wa Shule)',
    status: 'PUBLISHED',
    priority: 'HIGH',
  },
];

export default function SchoolAnnouncementsPage() {
  const currentUser = getCurrentSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState<Announcement['targetAudience']>('Wote (Shule Nzima)');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<'HIGH' | 'NORMAL'>('NORMAL');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: Announcement = {
      id: `ann-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      targetAudience: newTarget,
      content: newContent.trim(),
      publishDate: new Date().toISOString().split('T')[0],
      author: currentUser?.fullName || 'Mwalimu Mkuu',
      status: 'PUBLISHED',
      priority: newPriority,
    };

    setAnnouncements([created, ...announcements]);
    setShowAddModal(false);
    setNewTitle('');
    setNewContent('');
    setActiveNotice(`Tangazo "${created.title}" limeidhinishwa na kutangazwa rasmi kwa ${created.targetAudience}.`);
  };

  return (
    <TeacherShell
      pageTitle="Matangazo ya Shule (School Announcements & Notices)"
      pageDescription="Ofisi ya Mwalimu Mkuu: Kuandaa, kuidhinisha na kusambaza matangazo rasmi kwa walimu, wazazi na watahiniwa wa shule."
      requiredRole="HEADTEACHER"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Notice alert */}
        {activeNotice && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="font-bold">{activeNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveNotice(null)}
              className="text-xs font-bold text-emerald-900 hover:underline shrink-0"
            >
              Funga
            </button>
          </div>
        )}

        {/* Header Action Banner */}
        <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-950/20">
              <Megaphone className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Usimamizi wa Matangazo ya Shule
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mwalimu Mkuu ana mamlaka ya kuthibitisha na kuchapisha matangazo rasmi kwa shule nzima.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tangazo Jipya</span>
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-3 hover:border-emerald-400 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ann.priority === 'HIGH'
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {ann.priority === 'HIGH' ? 'Muhimu Sana' : 'Taarifa Rasmi'}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                    Walengwa: {ann.targetAudience}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ann.publishDate}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50">
                <span className="font-semibold text-emerald-900">Mwandishi: {ann.author}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                  Imetangazwa Rasmi
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <h3 className="text-sm font-black text-slate-900">Tunga Tangazo Jipya la Shule</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Kichwa cha Tangazo:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Mfano: Tarehe ya Kufunga Shule na Mahafali..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-600 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Walengwa:
                    </label>
                    <select
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                    >
                      <option value="Wote (Shule Nzima)">Wote (Shule Nzima)</option>
                      <option value="Walimu Pekee">Walimu Pekee</option>
                      <option value="Wazazi Pekee">Wazazi Pekee</option>
                      <option value="Watahiniwa NECTA">Watahiniwa NECTA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Kipaumbele:
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                    >
                      <option value="NORMAL">Kawaida</option>
                      <option value="HIGH">Muhimu Sana (High Alert)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Ujumbe wa Tangazo:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Andika ujumbe kamili hapa..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20"
                  >
                    Tangaza Sasa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
