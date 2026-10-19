'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SecretaryShell from '@/components/secretary-shell';
import {
  Calendar,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  X,
  FileCheck,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import {
  SchoolMeetingRecord,
  getAllMeetings,
  saveMeetings,
  recordAuditAction,
} from '@/lib/secretary-data';
import { notifyUser } from '@/lib/notifications';

export default function SecretaryMeetingsPage() {
  const [meetings, setMeetings] = useState<SchoolMeetingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedMeeting, setSelectedMeeting] = useState<SchoolMeetingRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Meeting Form
  const [newTitle, setNewTitle] = useState('');
  const [newMeetingType, setNewMeetingType] = useState<SchoolMeetingRecord['meetingType']>('STAFF_MEETING');
  const [newMeetingDate, setNewMeetingDate] = useState(new Date().toISOString().slice(0, 10));
  const [newParticipantsCount, setNewParticipantsCount] = useState(15);
  const [newParticipantsSummary, setNewParticipantsSummary] = useState('');
  const [newAgendaText, setNewAgendaText] = useState('');
  const [newMinutesSummary, setNewMinutesSummary] = useState('');
  const [newDecisionsText, setNewDecisionsText] = useState('');
  const [newFollowUpStatus, setNewFollowUpStatus] = useState<SchoolMeetingRecord['followUpStatus']>('PENDING');
  const [newSecretaryNotes, setNewSecretaryNotes] = useState('');

  useEffect(() => {
    setMeetings(getAllMeetings());
  }, []);

  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.minutesSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.participantsSummary.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'ALL' || m.meetingType === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || m.followUpStatus === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [meetings, searchTerm, typeFilter, statusFilter]);

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      notifyUser('error', 'Kosa', 'Tafadhali ingiza jina au mada kuu ya kikao.');
      return;
    }

    const typeLabels: Record<SchoolMeetingRecord['meetingType'], string> = {
      STAFF_MEETING: 'Kikao cha Walimu Wote (Staff Meeting)',
      PARENT_TEACHER: 'Kikao cha Wazazi na Walimu (PTA Meeting)',
      SCHOOL_MANAGEMENT: 'Kamati ya Usimamizi wa Shule (School Management)',
      DISCIPLINARY_COMMITTEE: 'Kamati ya Nidhamu ya Shule (Disciplinary Committee)',
    };

    const agendaItems = newAgendaText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const decisions = newDecisionsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newMeeting: SchoolMeetingRecord = {
      id: `mtg-${Date.now()}`,
      title: newTitle.trim(),
      meetingDate: newMeetingDate,
      meetingType: newMeetingType,
      meetingTypeLabel: typeLabels[newMeetingType],
      participantsCount: Number(newParticipantsCount) || 1,
      participantsSummary: newParticipantsSummary.trim() || 'Walimu wote wa darasa na uongozi mkuu',
      agendaItems: agendaItems.length > 0 ? agendaItems : ['Ajenda ya Ufunguzi na Taarifa ya Utekelezaji'],
      minutesSummary: newMinutesSummary.trim() || 'Muhtasari wa majadiliano na mapendekezo yaliyopitishwa.',
      decisionsAndActions: decisions.length > 0 ? decisions : ['Kukamilisha mpango kazi kabla ya tarehe 30.'],
      followUpStatus: newFollowUpStatus,
      secretaryNotes: newSecretaryNotes.trim(),
    };

    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    saveMeetings(updated);

    recordAuditAction({
      action: 'DOCUMENT_UPLOAD',
      documentId: newMeeting.id,
      documentTitle: `Muhtasari wa Kikao: ${newMeeting.title}`,
      referenceNumber: `MTG-${newMeetingDate.replace(/-/g, '')}`,
      details: `Kikao kipya cha ${newMeeting.meetingTypeLabel} kimehifadhiwa kwenye masjala ya Katibu`,
    });

    notifyUser('success', 'Kikao Kimehifadhiwa', 'Rekodi na muhtasari wa kikao vimehifadhiwa kikamilifu.');
    setShowAddModal(false);

    // Reset Form
    setNewTitle('');
    setNewAgendaText('');
    setNewMinutesSummary('');
    setNewDecisionsText('');
    setNewSecretaryNotes('');
  };

  const handleUpdateStatus = (id: string, newStatus: SchoolMeetingRecord['followUpStatus']) => {
    const updated = meetings.map((m) => (m.id === id ? { ...m, followUpStatus: newStatus } : m));
    setMeetings(updated);
    saveMeetings(updated);
    if (selectedMeeting && selectedMeeting.id === id) {
      setSelectedMeeting({ ...selectedMeeting, followUpStatus: newStatus });
    }
    notifyUser('info', 'Utekelezaji Umehuishwa', `Hali ya utekelezaji imewekwa: ${newStatus}`);
  };

  return (
    <SecretaryShell
      pageTitle="Kumbukumbu za Vikao & Minyute (Meeting Records)"
      pageDescription="Hifadhi rasmi ya ajenda, minyute, maazimio, na hatua za ufuatiliaji za mikutano yote ya shule ya msingi"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-teal-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
                Masjala ya Vikao Rasmi
              </span>
              <span className="text-xs text-slate-500 font-medium">Jumla: {meetings.length}</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 mt-1">Kumbukumbu na Minyute za Shule</h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Vikao vya Walimu, Kamati za Wazazi (PTA), Kamati ya Usimamizi wa Shule, na Kamati ya Nidhamu.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-900/10 transition-colors"
          >
            <Plus className="w-4 h-4 text-teal-200" />
            <span>+ Rekodi Kikao Kipya</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-teal-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tafuta jina la kikao, ajenda, au maazimio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-teal-700" />
              <span>Aina ya Kikao:</span>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">Vikao Vyote</option>
              <option value="STAFF_MEETING">Walimu Wote (Staff)</option>
              <option value="PARENT_TEACHER">Wazazi &amp; Walimu (PTA)</option>
              <option value="SCHOOL_MANAGEMENT">Kamati ya Usimamizi</option>
              <option value="DISCIPLINARY_COMMITTEE">Kamati ya Nidhamu</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">Hali Zote za Ufuatiliaji</option>
              <option value="COMPLETED">Imekamilika (Completed)</option>
              <option value="IN_PROGRESS">Inatekelezwa (In Progress)</option>
              <option value="PENDING">Inasubiri (Pending)</option>
            </select>
          </div>
        </div>

        {/* Meetings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeetings.map((mtg) => {
            const statusConfig = {
              COMPLETED: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Imekamilika' },
              IN_PROGRESS: { bg: 'bg-blue-50 text-blue-800 border-blue-200', label: 'Inatekelezwa' },
              PENDING: { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Inasubiri' },
            }[mtg.followUpStatus];

            return (
              <div
                key={mtg.id}
                className="bg-white rounded-2xl border border-teal-100 hover:border-teal-300 transition-all p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200/60">
                      {mtg.meetingTypeLabel.split('(')[0]}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusConfig.bg}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-2">
                      {mtg.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1.5 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-teal-600" />
                        {mtg.meetingDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        {mtg.participantsCount} Wahudhuriaji
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {mtg.minutesSummary}
                  </p>

                  {/* Agendas preview */}
                  {mtg.agendaItems && mtg.agendaItems.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Ajenda Zilizojadiliwa:
                      </span>
                      <ul className="space-y-1">
                        {mtg.agendaItems.slice(0, 2).map((ag, i) => (
                          <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                            <span className="truncate">{ag}</span>
                          </li>
                        ))}
                        {mtg.agendaItems.length > 2 && (
                          <span className="text-[10px] text-teal-700 font-bold block">
                            +{mtg.agendaItems.length - 2} ajenda zingine...
                          </span>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedMeeting(mtg)}
                    className="flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-600" />
                    <span>Tazama Minyute Kamili</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedMeeting(mtg);
                      setTimeout(() => window.print(), 300);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Chapisha Minyute (Print)"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredMeetings.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-700 text-sm">Hakuna rekodi ya kikao iliyopatikana</h3>
              <p className="text-xs text-slate-500 mt-1">
                Jaribu kurekebisha vichungi au rekodi kikao kipya kwa kubonyeza kitufe cha hapo juu.
              </p>
            </div>
          )}
        </div>

        {/* Modal: View Full Minutes & Decisions */}
        {selectedMeeting && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-teal-200 max-h-[90vh] overflow-y-auto space-y-5">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                    {selectedMeeting.meetingTypeLabel}
                  </span>
                  <h2 className="text-base font-black text-slate-900 mt-1">{selectedMeeting.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                    <span>Tarehe ya Kikao: {selectedMeeting.meetingDate}</span>
                    <span>&bull;</span>
                    <span>Wahudhuriaji: {selectedMeeting.participantsCount}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Participants */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Washiriki &amp; Wajumbe:</span>
                <p className="text-slate-600">{selectedMeeting.participantsSummary}</p>
              </div>

              {/* Agenda List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ajenda Kuu Zilizojadiliwa
                </h4>
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1.5">
                  {selectedMeeting.agendaItems.map((ag, i) => (
                    <div key={i} className="text-xs text-slate-800 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{ag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Minutes Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Muhtasari wa Minyute &amp; Majadiliano
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                  {selectedMeeting.minutesSummary}
                </div>
              </div>

              {/* Decisions & Action Points */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Maazimio &amp; Hatua za Utekelezaji (Actions)
                </h4>
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 space-y-2">
                  {selectedMeeting.decisionsAndActions.map((act, i) => (
                    <div key={i} className="text-xs text-emerald-950 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up Status Controller */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-teal-50 border border-teal-200">
                <div>
                  <span className="text-xs font-bold text-teal-900 block">Hali ya Utekelezaji wa Maazimio:</span>
                  <span className="text-[11px] text-teal-700">Sasisha maendeleo ya utekelezaji wa maagizo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedMeeting.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedMeeting.followUpStatus === st
                          ? 'bg-teal-800 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-teal-100 border border-teal-200'
                      }`}
                    >
                      {st === 'COMPLETED' ? 'Imekamilika' : st === 'IN_PROGRESS' ? 'Inatekelezwa' : 'Inasubiri'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Chapisha Minyute</span>
                </button>
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-800 text-white hover:bg-teal-700"
                >
                  Funga
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Record New Meeting */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-teal-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-black text-slate-900">Rekodi Kikao Kipya cha Shule</h3>
                  <p className="text-xs text-slate-500">Ingiza taarifa rasmi za kikao, ajenda, na maamuzi</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMeeting} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mada / Jina la Kikao *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Kikao cha Kwanza cha Kamati ya Shule — Muhula wa I 2026"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Aina ya Kikao *</label>
                    <select
                      value={newMeetingType}
                      onChange={(e) => setNewMeetingType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600 font-medium"
                    >
                      <option value="STAFF_MEETING">Walimu Wote (Staff Meeting)</option>
                      <option value="PARENT_TEACHER">Wazazi &amp; Walimu (PTA Meeting)</option>
                      <option value="SCHOOL_MANAGEMENT">Kamati ya Usimamizi wa Shule</option>
                      <option value="DISCIPLINARY_COMMITTEE">Kamati ya Nidhamu</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tarehe ya Kikao *</label>
                    <input
                      type="date"
                      required
                      value={newMeetingDate}
                      onChange={(e) => setNewMeetingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Idadi ya Washiriki</label>
                    <input
                      type="number"
                      min={1}
                      value={newParticipantsCount}
                      onChange={(e) => setNewParticipantsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Muhtasari wa Washiriki</label>
                    <input
                      type="text"
                      placeholder="Mfano: Mwalimu Mkuu, Walimu wote 18, na Katibu"
                      value={newParticipantsSummary}
                      onChange={(e) => setNewParticipantsSummary(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Ajenda za Kikao (Weka kila ajenda kwenye mstari wake)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="1. Ufunguzi wa Mkutano na Mwl. Mkuu&#10;2. Mapitio ya Maendeleo ya Masomo Muhula I&#10;3. Ujenzi wa Madarasa Mapya ya Chekechea"
                    value={newAgendaText}
                    onChange={(e) => setNewAgendaText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Minyute &amp; Majadiliano Makuu *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Eleza kwa ufupi hoja zilizojadiliwa, mawazo ya wajumbe, na maelekezo ya Mwalimu Mkuu..."
                    value={newMinutesSummary}
                    onChange={(e) => setNewMinutesSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Maazimio &amp; Hatua za Kuchukuliwa (Kila azimio kwenye mstari wake)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="1. Mwalimu wa Taaluma akamilishe ratiba ya mitihani kabla ya Ijumaa&#10;2. Wazazi wote wa darasa la saba kuitwa kikao maalum tarehe 15"
                    value={newDecisionsText}
                    onChange={(e) => setNewDecisionsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600 font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-900/10"
                  >
                    Hifadhi Kikao
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
