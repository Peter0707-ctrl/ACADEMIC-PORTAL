'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  getReconciliations,
  recordNewReconciliation,
  getBankAccounts,
  BankReconciliationRecord,
  SchoolBankAccount,
} from '@/lib/accountant-data';
import {
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Building,
  Search,
  Printer,
  X,
  Scale,
  Calendar,
} from 'lucide-react';

export default function AccountantReconciliationPage() {
  const [reconciliations, setReconciliations] = useState<BankReconciliationRecord[]>([]);
  const [bankAccounts, setBankAccounts] = useState<SchoolBankAccount[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [bankAccountId, setBankAccountId] = useState('');
  const [bankStatementBalance, setBankStatementBalance] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setReconciliations(getReconciliations());
    const accounts = getBankAccounts();
    setBankAccounts(accounts);
    if (accounts.length > 0 && !bankAccountId) {
      setBankAccountId(accounts[0].id);
    }
  };

  const selectedAccount = bankAccounts.find((b) => b.id === bankAccountId);
  const systemBalance = selectedAccount ? selectedAccount.currentBalance : 0;
  const currentDiff = bankStatementBalance !== '' ? Number(bankStatementBalance) - systemBalance : 0;

  const handleRecordReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || bankStatementBalance === '') {
      alert('Tafadhali ingiza salio la taarifa ya benki (Bank Statement)');
      return;
    }

    recordNewReconciliation({
      bankAccountId: selectedAccount.id,
      bankAccountName: `${selectedAccount.bankName} - ${selectedAccount.accountNumber}`,
      systemBalance,
      bankStatementBalance: Number(bankStatementBalance),
      notes: notes.trim() || 'Upatanisho wa kawaida wa mwisho wa mwezi',
      reconciledBy: 'Bw. Ramadhani Tembo (Mhasibu)',
    });

    setShowModal(false);
    setBankStatementBalance('');
    setNotes('');
    loadData();
  };

  const balancedCount = reconciliations.filter((r) => r.status === 'BALANCED').length;
  const discrepancyCount = reconciliations.filter((r) => r.status === 'DISCREPANCY').length;

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <Scale className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Upatanisho wa Hesabu za Benki (Bank Reconciliation)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Linganisha salio lililopo kwenye mfumo na salio halisi la benki (Bank Statement) ili kugundua mapungufu au amana zilizochelewa
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Fanya Upatanisho Mpya</span>
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Jumla ya Upatanisho Uliofanywa
            </span>
            <p className="text-2xl font-bold text-slate-800 mt-2">{reconciliations.length}</p>
            <span className="text-xs text-slate-500 mt-1 block">Kumbukumbu rasmi za kihasibu</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Hesabu Zilizolingana (Balanced)
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-2">{balancedCount}</p>
            <span className="text-xs text-emerald-600 mt-1 block">Hakuna tofauti ya senti hata moja</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                Zenye Tofauti (Discrepancy)
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <p className="text-2xl font-bold text-rose-700 mt-2">{discrepancyCount}</p>
            <span className="text-xs text-rose-600 mt-1 block">Zinahitaji kufuatiliwa mara moja</span>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Kumbukumbu za Upatanisho (Reconciliation Logs)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Tarehe</th>
                  <th className="px-4 py-3">Akaunti ya Benki</th>
                  <th className="px-4 py-3 text-right">Salio la Mfumo (TZS)</th>
                  <th className="px-4 py-3 text-right">Salio la Benki (Statement)</th>
                  <th className="px-4 py-3 text-right">Tofauti (Difference)</th>
                  <th className="px-4 py-3 text-center">Hali</th>
                  <th className="px-4 py-3">Mhasibu / Maelezo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reconciliations.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">{rec.reconciliationDate}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{rec.bankAccountName}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-slate-700">
                      {rec.systemBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {rec.bankStatementBalance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold">
                      <span className={rec.difference === 0 ? 'text-emerald-700' : 'text-rose-700'}>
                        {rec.difference > 0 ? `+${rec.difference.toLocaleString()}` : rec.difference.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {rec.status === 'BALANCED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sawia (Balanced)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3.5 h-3.5" /> Tofauti (Discrepancy)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      <div>{rec.notes}</div>
                      <div className="text-[10px] text-slate-400">Imefanywa na: {rec.reconciledBy}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: NEW RECONCILIATION */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Fanya Upatanisho wa Hesabu za Benki</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordReconciliation} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chagua Akaunti ya Benki *
                  </label>
                  <select
                    value={bankAccountId}
                    onChange={(e) => setBankAccountId(e.target.value)}
                    required
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bankName} - {b.accountNumber} ({b.accountName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Current System Balance */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Salio Lililopo Kwenye Mfumo (System Balance):</span>
                    <strong className="text-slate-900 font-mono text-sm">
                      TZS {systemBalance.toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Salio Lililo Kwenye Taarifa ya Benki (Bank Statement Balance) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Weka salio halisi linaloonekana kwenye benki"
                    value={bankStatementBalance}
                    onChange={(e) => setBankStatementBalance(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 font-bold font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Live difference preview */}
                {bankStatementBalance !== '' && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex justify-between items-center ${
                      Math.abs(currentDiff) < 0.01
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <span className="font-semibold">Tofauti ya Hesabu (Difference):</span>
                    <span className="font-bold font-mono text-sm">
                      TZS {currentDiff.toLocaleString()}{' '}
                      {Math.abs(currentDiff) < 0.01 ? '(Zinalingana Sawa!)' : '(Kuna Tofauti)'}
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maelezo ya Upatanisho (Sababu ya Tofauti kama ipo)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mfano: Malipo ya ada ya M-Pesa TZS 150,000 bado hayajaakisiwa kwenye bank statement ya tarehe 30."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    Hifadhi Upatanisho
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
