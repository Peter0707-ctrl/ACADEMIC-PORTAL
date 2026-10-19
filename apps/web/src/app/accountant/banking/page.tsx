'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  getBankAccounts,
  adjustBankAccountBalance,
  recordFinanceAuditAction,
  SchoolBankAccount,
} from '@/lib/accountant-data';
import {
  Building2,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  ShieldCheck,
  X,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';
import Link from 'next/link';

export default function AccountantBankingPage() {
  const [bankAccounts, setBankAccounts] = useState<SchoolBankAccount[]>([]);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [direction, setDirection] = useState<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT');
  const [amount, setAmount] = useState<number | ''>('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBankAccounts(getBankAccounts());
  };

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId || !amount || Number(amount) <= 0) {
      alert('Jaza taarifa zote kwa usahihi');
      return;
    }

    const acc = bankAccounts.find((b) => b.id === selectedAccountId);
    if (!acc) return;

    adjustBankAccountBalance(selectedAccountId, Number(amount), direction);

    recordFinanceAuditAction({
      action: 'RECONCILIATION_PERFORMED',
      recordId: acc.accountNumber,
      details: `Salio la benki (${acc.bankName} - ${acc.accountNumber}) limerekebishwa: ${direction} ya TZS ${Number(
        amount
      ).toLocaleString()}. Sababu: ${reason}.`,
    });

    setShowAdjustModal(false);
    setSelectedAccountId('');
    setAmount('');
    setReason('');
    loadData();
  };

  const totalBankBalance = bankAccounts.reduce((sum, b) => sum + b.currentBalance, 0);

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                <Building2 className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Akaunti za Benki za Shule (School Bank Accounts)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Dhibiti akaunti rasmi za benki za shule (CRDB, NMB), fuatilia amana za ada na fanya upatanisho wa kibenki
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/accountant/reconciliation"
              className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Upatanisho wa Benki</span>
            </Link>
            <button
              onClick={() => setShowAdjustModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Marekebisho / Amana ya Benki</span>
            </button>
          </div>
        </div>

        {/* Total Bank Balance Card - Soft, Clean Light Design */}
        <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
              Jumla ya Fedha Katika Benki Zote za Shule
            </span>
            <h2 className="text-3xl font-extrabold mt-1 text-teal-800 font-mono">
              TZS {totalBankBalance.toLocaleString()}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Akaunti {bankAccounts.length} za Benki (CRDB Bank &amp; NMB Bank)
            </p>
          </div>
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-900 px-4 py-2 rounded-xl text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Miamala yote inathibitishwa na Mhasibu wa Shule</span>
          </div>
        </div>

        {/* Bank Account Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bankAccounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {acc.bankName}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{acc.accountName}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Tawi: {acc.branch}</p>
                </div>
                <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              <div className="py-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Namba ya Akaunti:</span>
                  <span className="font-mono font-bold text-slate-800 text-sm tracking-wide">
                    {acc.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Salio la Kuanzia:</span>
                  <span className="font-mono text-slate-600">TZS {acc.openingBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">Salio la Sasa (Current Balance):</span>
                  <span className="font-mono font-extrabold text-lg text-emerald-700">
                    TZS {acc.currentBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Akaunti Inafanya Kazi (Active)
                </span>
                <Link
                  href="/accountant/reconciliation"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Fanya Upatanisho &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL: ADJUST BANK BALANCE */}
        {showAdjustModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Rekebisha / Weka Amana ya Benki</h3>
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdjustBalance} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chagua Akaunti ya Benki *
                  </label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    required
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Chagua Akaunti --</option>
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bankName} - {b.accountNumber} ({b.accountName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aina ya Marekebisho *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDirection('DEPOSIT')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        direction === 'DEPOSIT'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowDownLeft className="w-4 h-4" /> Amana (Kuweka Pesa)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirection('WITHDRAWAL')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        direction === 'WITHDRAWAL'
                          ? 'border-rose-600 bg-rose-50 text-rose-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" /> Kutoa / Makato ya Benki
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kiasi (TZS) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sababu ya Marekebisho *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Kuingiza fedha taslimu benki au riba/makato ya benki"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAdjustModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    Hifadhi Marekebisho
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
