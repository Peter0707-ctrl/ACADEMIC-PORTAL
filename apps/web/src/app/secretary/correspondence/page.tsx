'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Mail,
  Send,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  X,
  Printer,
  Sparkles,
} from 'lucide-react';
import SecretaryShell from '@/components/secretary-shell';
import {
  getAllCorrespondence,
  saveCorrespondence,
  CorrespondenceItem,
} from '@/lib/secretary-data';
import { notifyUser } from '@/lib/notifications';

function CorrespondenceContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'OUTGOING' ? 'OUTGOING' : 'INCOMING';

  const [activeTab, setActiveTab] = useState<'INCOMING' | 'OUTGOING'>(initialTab);
  const [correspondenceList, setCorrespondenceList] = useState<CorrespondenceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formRefNo, setFormRefNo] = useState('');
  const [formSenderOrRecipient, setFormSenderOrRecipient] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState('Serikali / TAMISEMI');
  const [formAssignedOrApproved, setFormAssignedOrApproved] = useState('Mwl. Augustine Mrosso (Mkuu wa Shule)');
  const [formStatus, setFormStatus] = useState<CorrespondenceItem['status']>('IN_PROGRESS');
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    setCorrespondenceList(getAllCorrespondence());
    const rand = Math.floor(100 + Math.random() * 900);
    setFormRefNo(`KPS/CORR/2026/${rand}`);
  }, []);

  const filteredItems = useMemo(() => {
    return correspondenceList.filter((item) => {
      const matchType = item.type === activeTab;
      const matchSearch =
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.senderOrRecipient.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      return matchType && matchSearch && matchStatus;
    });
  }, [correspondenceList, activeTab, searchTerm, statusFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formSenderOrRecipient.trim()) return;

    const newItem: CorrespondenceItem = {
      id: `corr-${Date.now()}`,
      type: activeTab,
      referenceNumber: formRefNo.trim() || `KPS/CORR/${Date.now().toString().slice(-4)}`,
      senderOrRecipient: formSenderOrRecipient.trim(),
      subject: formSubject.trim(),
      dateReceivedOrSent: formDate,
      receivedOrPreparedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
      assignedPersonOrApprovedBy: formAssignedOrApproved,
      category: formCategory,
      status: formStatus,
      notes: formNotes.trim(),
      documentTitle: `${formSubject.slice(0, 30)}.pdf`,
    };

    const updated = [newItem, ...correspondenceList];
    setCorrespondenceList(updated);
    saveCorrespondence(updated);

    setShowAddModal(false);
    setFormSenderOrRecipient('');
    setFormSubject('');
    setFormNotes('');

    notifyUser(
      'success',
      activeTab === 'INCOMING' ? 'Barua Iliyoingia Imerekodiwa!' : 'Barua Iliyotoka Imerekodiwa!',
      `Barua namba ${newItem.referenceNumber} imesajiliwa kwenye daftari la masjala.`
    );
  };

  return (
    <SecretaryShell
      pageTitle="Daftari la Barua & Mawasiliano Rasmi (Correspondence)"
      pageDescription="Ofisi ya Katibu wa Shule: Usimamizi wa barua zote zilizoingia (Incoming) kutoka Serikalini/Wizarani/Wazazi, na barua zote zilizotoka (Outgoing) kwenda kwa wadau mbalimbali."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Switcher & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/95 rounded-3xl border border-teal-200/80 p-4 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('INCOMING')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'INCOMING'
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Barua Zilizoingia (Incoming)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('OUTGOING')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'OUTGOING'
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Barua Zilizotoka (Outgoing)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-teal-200" />
            <span>+ Rekodi Barua Mpya</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white/95 rounded-3xl border border-teal-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {activeTab === 'INCOMING' ? 'Daftari la Barua Zilizoingia (Incoming Mail Register)' : 'Daftari la Barua Zilizotoka (Outgoing Mail Register)'}
              </h3>
              <p className="text-xs text-slate-500">
                Kila barua inafuatiliwa kwa namba ya kumbukumbu, mhusika na hatua za kiutawala.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tafuta mada, mtumaji/mpokeaji, au namba ya barua..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">Hali Zote (Status)</option>
              <option value="PENDING">Inasubiri (Pending)</option>
              <option value="IN_PROGRESS">Inashughulikiwa (In Progress)</option>
              <option value="DISPATCHED">Imetumwa (Dispatched)</option>
              <option value="FILED">Imewekwa Jaladani (Filed)</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                  <th className="p-3">Reference No</th>
                  <th className="p-3">{activeTab === 'INCOMING' ? 'Mtumaji (Sender)' : 'Mpokeaji (Recipient)'}</th>
                  <th className="p-3">Mada ya Barua (Subject)</th>
                  <th className="p-3">Tarehe</th>
                  <th className="p-3">{activeTab === 'INCOMING' ? 'Mkabidhiwa' : 'Muidhinishaji'}</th>
                  <th className="p-3 text-center">Hali</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-teal-50/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-teal-950">
                      <span className="px-2 py-0.5 rounded bg-teal-100/70 border border-teal-200">
                        {item.referenceNumber}
                      </span>
                    </td>

                    <td className="p-3 font-bold text-slate-900">{item.senderOrRecipient}</td>

                    <td className="p-3 text-slate-800">
                      <strong className="block leading-snug">{item.subject}</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{item.notes}</span>
                    </td>

                    <td className="p-3 text-slate-600 font-medium">{item.dateReceivedOrSent}</td>

                    <td className="p-3 text-slate-700">{item.assignedPersonOrApprovedBy}</td>

                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.status === 'FILED' || item.status === 'DISPATCHED'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Correspondence */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl border border-teal-300 max-w-xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    {activeTab === 'INCOMING' ? <Mail className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    {activeTab === 'INCOMING' ? 'Rekodi Barua Iliyoingia (Incoming)' : 'Rekodi Barua Iliyotoka (Outgoing)'}
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

              <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Namba ya Kumbukumbu (Ref No) *</label>
                  <input
                    type="text"
                    required
                    value={formRefNo}
                    onChange={(e) => setFormRefNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {activeTab === 'INCOMING' ? 'Mtumaji wa Barua (Sender) *' : 'Mpokeaji wa Barua (Recipient) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Ofisi ya Elimu Wilaya (DEO) au Jina la Mzazi"
                    value={formSenderOrRecipient}
                    onChange={(e) => setFormSenderOrRecipient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mada Kuu ya Barua (Subject) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Eleza kwa ufupi mada ya barua hii..."
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tarehe ya Barua *</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jamii / Idara</label>
                    <input
                      type="text"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {activeTab === 'INCOMING' ? 'Mkabidhiwa kwa Utendaji (Assigned Person)' : 'Muidhinishaji (Approved By)'}
                  </label>
                  <input
                    type="text"
                    value={formAssignedOrApproved}
                    onChange={(e) => setFormAssignedOrApproved(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Maelezo ya Ziada (Notes)</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
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
                    Hifadhi Barua
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

export default function CorrespondencePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Inapakia...</div>}>
      <CorrespondenceContent />
    </React.Suspense>
  );
}
