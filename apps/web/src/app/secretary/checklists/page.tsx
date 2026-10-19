'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  Users,
  UserCheck,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import SecretaryShell from '@/components/secretary-shell';
import {
  getChecklists,
  saveChecklists,
  ChecklistRequirement,
} from '@/lib/secretary-data';
import { notifyUser } from '@/lib/notifications';

export default function DocumentChecklistsPage() {
  const [studentList, setStudentList] = useState<ChecklistRequirement[]>([]);
  const [staffList, setStaffList] = useState<ChecklistRequirement[]>([]);
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'STAFF'>('STUDENT');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Udahili');
  const [newIsRequired, setNewIsRequired] = useState(true);
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    const { studentChecklist, staffChecklist } = getChecklists();
    setStudentList(studentChecklist);
    setStaffList(staffChecklist);
  }, []);

  const handleToggleRequired = (id: string, type: 'STUDENT' | 'STAFF') => {
    if (type === 'STUDENT') {
      const updated = studentList.map((item) =>
        item.id === id ? { ...item, isRequired: !item.isRequired } : item
      );
      setStudentList(updated);
      saveChecklists({ studentChecklist: updated, staffChecklist: staffList });
    } else {
      const updated = staffList.map((item) =>
        item.id === id ? { ...item, isRequired: !item.isRequired } : item
      );
      setStaffList(updated);
      saveChecklists({ studentChecklist: studentList, staffChecklist: updated });
    }
    notifyUser('success', 'Orodha Imesasishwa', 'Vigezo vya nyaraka za lazima vimehifadhiwa.');
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ChecklistRequirement = {
      id: `req-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory.trim() || 'Nyaraka',
      isRequired: newIsRequired,
      description: newDesc.trim() || 'Nyaraka rasmi inayohitajika kuwepo kwenye jalada.',
    };

    if (activeTab === 'STUDENT') {
      const updated = [...studentList, newItem];
      setStudentList(updated);
      saveChecklists({ studentChecklist: updated, staffChecklist: staffList });
    } else {
      const updated = [...staffList, newItem];
      setStaffList(updated);
      saveChecklists({ studentChecklist: studentList, staffChecklist: updated });
    }

    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    notifyUser('success', 'Kipengele Kimeongezwa!', `"${newItem.title}" kimeongezwa kwenye orodha ya ukaguzi wa majalada.`);
  };

  return (
    <SecretaryShell
      pageTitle="Mipangilio ya Orodha ya Nyaraka (Document Checklists)"
      pageDescription="Ofisi ya Katibu wa Shule: Sanidi nyaraka zinazotakiwa kwa lazima kwenye majalada ya wanafunzi na walimu. Mfumo hutumia orodha hii kuhesabu asilimia ya ukamilifu (File Completion Percentage)."
    >
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        {/* Tab Switcher & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 rounded-3xl border border-teal-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('STUDENT')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'STUDENT'
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Orodha ya Wanafunzi ({studentList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('STAFF')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'STAFF'
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Orodha ya Walimu ({staffList.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-teal-200" />
            <span>+ Ongeza Hati Inayohitajika</span>
          </button>
        </div>

        {/* Checklist Items Display */}
        <div className="bg-white/95 rounded-3xl border border-teal-200/80 p-6 shadow-xs space-y-4">
          <div className="border-b border-teal-100 pb-3">
            <h3 className="text-base font-black text-slate-900">
              {activeTab === 'STUDENT' ? 'Student Admission Document Checklist' : 'Staff Onboarding Document Checklist'}
            </h3>
            <p className="text-xs text-slate-500">
              Hati zilizowekwa &quot;Lazima&quot; zitaathiri asilimia ya ukamilifu wa jalada zikikosekana.
            </p>
          </div>

          <div className="space-y-3">
            {(activeTab === 'STUDENT' ? studentList : staffList).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {item.category}
                    </span>
                    <strong className="text-slate-900 text-sm">{item.title}</strong>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{item.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleRequired(item.id, activeTab)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors flex items-center gap-1.5 ${
                      item.isRequired
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {item.isRequired ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>LAZIMA (Required)</span>
                      </>
                    ) : (
                      <>
                        <span>HIARI (Optional)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Add Requirement */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl border border-teal-300 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    Ongeza Nyaraka Kwenye Orodha ({activeTab === 'STUDENT' ? 'Wanafunzi' : 'Walimu'})
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddRequirement} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jina la Nyaraka *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Cheti cha Ubatizo au Barua ya Serikali ya Mtaa"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kundi / Jamii *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Utambulisho, Afya, Taaluma, Makazi"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Maelezo Mafupi</label>
                  <textarea
                    rows={2}
                    placeholder="Eleza kwanini hati hii inahitajika shuleni..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="is-req-checkbox"
                    checked={newIsRequired}
                    onChange={(e) => setNewIsRequired(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <label htmlFor="is-req-checkbox" className="font-bold text-slate-800">
                    Weka kama Nyaraka ya Lazima (Required)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-2 rounded-xl border font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-800 text-white font-black hover:bg-teal-900"
                  >
                    Ongeza Nyaraka
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SecretaryShell>
  );
}
