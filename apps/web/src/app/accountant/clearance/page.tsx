'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  getStudentFinancialAccounts,
  updateStudentClearanceStatus,
  StudentFinancialAccount,
  ClearanceStatus,
} from '@/lib/accountant-data';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Award,
  Edit,
  X,
  FileCheck,
  Info,
} from 'lucide-react';

export default function AccountantClearancePage() {
  const [accounts, setAccounts] = useState<StudentFinancialAccount[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [standardFilter, setStandardFilter] = useState('ALL');

  // Edit Clearance modal
  const [editingStudent, setEditingStudent] = useState<StudentFinancialAccount | null>(null);
  const [newStatus, setNewStatus] = useState<ClearanceStatus>('CLEARED');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAccounts(getStudentFinancialAccounts());
  };

  const handleOpenEdit = (student: StudentFinancialAccount) => {
    setEditingStudent(student);
    setNewStatus(student.clearanceStatus);
    setRemarks(student.clearanceRemarks || '');
  };

  const handleSaveClearance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    updateStudentClearanceStatus(
      editingStudent.studentId,
      newStatus,
      remarks,
      'Bw. Ramadhani Tembo (Mhasibu)'
    );

    setEditingStudent(null);
    loadData();
  };

  const filtered = accounts.filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.clearanceStatus === statusFilter;
    const matchesStandard = standardFilter === 'ALL' || a.standard === standardFilter;
    return matchesSearch && matchesStatus && matchesStandard;
  });

  const clearedCount = accounts.filter((a) => a.clearanceStatus === 'CLEARED').length;
  const partialCount = accounts.filter((a) => a.clearanceStatus === 'PARTIALLY_CLEARED').length;
  const notClearedCount = accounts.filter((a) => a.clearanceStatus === 'NOT_CLEARED').length;
  const exemptedCount = accounts.filter((a) => a.clearanceStatus === 'EXEMPTED').length;

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Kibali cha Fedha & Ada (Financial Clearance)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Thibitisha kama mwanafunzi amekamilisha malipo ya ada kuruhusiwa kufanya mitihani (SFNA/NECTA) na kupewa ripoti
            </p>
          </div>
        </div>

        {/* Rule Explanation Banner */}
        <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Kanuni Rasmi ya Kibali cha Fedha (Section 15 Specification):</p>
              <p className="text-slate-300 mt-0.5">
                Mwanafunzi akiwa na Salio = TZS 0 anapata <strong>Kibali Kamili (CLEARED)</strong>. Mwanafunzi akiwa na deni anakuwa <strong>HAJAKAMILISHA (NOT CLEARED)</strong> au anaweza kuwekwa <strong>MSAMAHA (EXEMPTED)</strong> kwa amri ya Bodi ya Shule.
              </p>
            </div>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 uppercase">Waliokamilisha (CLEARED)</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-2">{clearedCount}</p>
            <span className="text-xs text-slate-500 mt-1 block">Wameruhusiwa mitihani na ripoti</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 uppercase">Wamelipa Sehemu (PARTIAL)</span>
              <AlertTriangle className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700 mt-2">{partialCount}</p>
            <span className="text-xs text-slate-500 mt-1 block">Wamelipa &ge; 50% ya ankara</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-600 uppercase">Hawajakamilisha (NOT CLEARED)</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl font-bold text-rose-700 mt-2">{notClearedCount}</p>
            <span className="text-xs text-slate-500 mt-1 block">Wanadaiwa salio kubwa</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-600 uppercase">Msamaha / Ufadhili (EXEMPTED)</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-700 mt-2">{exemptedCount}</p>
            <span className="text-xs text-slate-500 mt-1 block">Wamepewa kibali maalum</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Tafuta jina la mwanafunzi au namba ya udahili..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Hali ya Kibali:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="ALL">Hali Zote</option>
                <option value="CLEARED">CLEARED (Amekamilisha)</option>
                <option value="PARTIALLY_CLEARED">PARTIALLY CLEARED (Sehemu)</option>
                <option value="NOT_CLEARED">NOT CLEARED (Hajakamilisha)</option>
                <option value="EXEMPTED">EXEMPTED (Amesamehewa)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Darasa:</span>
              <select
                value={standardFilter}
                onChange={(e) => setStandardFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="ALL">Madarasa Yote</option>
                <option value="Standard 1 (Grade 1)">Standard 1</option>
                <option value="Standard 2 (Grade 2)">Standard 2</option>
                <option value="Standard 3 (Grade 3)">Standard 3</option>
                <option value="Standard 4 (Grade 4)">Standard 4</option>
                <option value="Standard 5 (Grade 5)">Standard 5</option>
                <option value="Standard 6 (Grade 6)">Standard 6</option>
                <option value="Standard 7 (Grade 7)">Standard 7</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clearance Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Udahili #</th>
                  <th className="px-4 py-3">Mwanafunzi</th>
                  <th className="px-4 py-3">Darasa</th>
                  <th className="px-4 py-3 text-right">Jumla ya Ada</th>
                  <th className="px-4 py-3 text-right">Imelipwa</th>
                  <th className="px-4 py-3 text-right">Salio / Deni</th>
                  <th className="px-4 py-3 text-center">Hali ya Kibali</th>
                  <th className="px-4 py-3">Maelezo / Ruhusa</th>
                  <th className="px-4 py-3 text-right">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((acc) => (
                  <tr key={acc.studentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-slate-700">{acc.studentId}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{acc.fullName}</td>
                    <td className="px-4 py-3 text-slate-600">{acc.standard}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                      {acc.totalInvoiced.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-700">
                      {acc.totalPaid.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold font-mono">
                      <span className={acc.balance === 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        {acc.balance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {acc.clearanceStatus === 'CLEARED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Amekamilisha
                        </span>
                      )}
                      {acc.clearanceStatus === 'PARTIALLY_CLEARED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <AlertTriangle className="w-3 h-3" /> Sehemu
                        </span>
                      )}
                      {acc.clearanceStatus === 'NOT_CLEARED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                          <XCircle className="w-3 h-3" /> Hajakamilisha
                        </span>
                      )}
                      {acc.clearanceStatus === 'EXEMPTED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Award className="w-3 h-3" /> Msamaha / Ufadhili
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {acc.clearanceRemarks || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenEdit(acc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded text-xs font-medium transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Badilisha Kibali</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: EDIT CLEARANCE STATUS */}
        {editingStudent && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Rekebisha Kibali cha Fedha (Clearance)</h3>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveClearance} className="mt-4 space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                  <div>
                    <span className="text-slate-400">Mwanafunzi: </span>
                    <strong className="text-slate-800">{editingStudent.fullName}</strong> ({editingStudent.studentId})
                  </div>
                  <div>
                    <span className="text-slate-400">Darasa: </span>
                    <strong className="text-slate-800">{editingStudent.standard}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Salio Linalodaiwa: </span>
                    <strong className={editingStudent.balance === 0 ? 'text-emerald-700' : 'text-rose-700'}>
                      TZS {editingStudent.balance.toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chagua Hali Mpya ya Kibali *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ClearanceStatus)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="CLEARED">CLEARED - Amekamilisha (Ruhusa Kamili)</option>
                    <option value="PARTIALLY_CLEARED">PARTIALLY CLEARED - Amelipa Sehemu (Ruhusa ya Muda)</option>
                    <option value="NOT_CLEARED">NOT CLEARED - Hajakamilisha (Kuzuia Ripoti/Mtihani)</option>
                    <option value="EXEMPTED">EXEMPTED - Msamaha Maalum / Ufadhili wa Shule</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sababu / Maelezo ya Kibali (Kwa ajili ya Kumbukumbu za Ukaguzi) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Mfano: Mwanafunzi amepewa idhini maalum na Mwalimu Mkuu kufanya mtihani wa SFNA wakati wazazi wanamalizia ada tarehe 15 mwezi ujao."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    Hifadhi Mabadiliko
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AccountantShell>
  );
}
