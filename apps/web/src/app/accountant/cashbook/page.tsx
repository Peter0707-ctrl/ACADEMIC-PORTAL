'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  getCashbookEntries,
  recordCashbookMovement,
  CashbookEntry,
} from '@/lib/accountant-data';
import {
  BookOpen,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Printer,
  Download,
  Filter,
  X,
  Wallet,
} from 'lucide-react';

export default function AccountantCashbookPage() {
  const [entries, setEntries] = useState<CashbookEntry[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'CASH_IN' | 'CASH_OUT'>('ALL');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [movementType, setMovementType] = useState<'CASH_IN' | 'CASH_OUT'>('CASH_OUT');
  const [sourceOrPayee, setSourceOrPayee] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [reference, setReference] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEntries(getCashbookEntries());
  };

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Weka kiasi sahihi cha fedha');
      return;
    }

    recordCashbookMovement({
      type: movementType,
      sourceOrPayee,
      description,
      amount: Number(amount),
      paymentMethod: 'CASH',
      reference: reference.trim() || `CB-${Date.now().toString().slice(-5)}`,
    });

    setShowModal(false);
    setSourceOrPayee('');
    setDescription('');
    setAmount('');
    setReference('');
    loadData();
  };

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.sourceOrPayee.toLowerCase().includes(search.toLowerCase()) ||
      e.reference.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === 'ALL' || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalCashIn = entries
    .filter((e) => e.type === 'CASH_IN')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalCashOut = entries
    .filter((e) => e.type === 'CASH_OUT')
    .reduce((sum, e) => sum + e.amount, 0);

  const currentBalance = entries.length > 0 ? entries[entries.length - 1].runningBalance : 0;

  const handleExportCSV = () => {
    const headers = ['Tarehe,Aina,Chanzo / Mlipwaji,Maelezo,Rejea,Kiasi (TZS),Salio Lililobaki (TZS)\n'];
    const rows = entries.map(
      (e) =>
        `"${e.date}","${e.type}","${e.sourceOrPayee}","${e.description}","${e.reference}",${e.amount},${e.runningBalance}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Cashbook_Kukumbuka_Primary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Kitabu cha Fedha Taslimu (School Cashbook)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Fuatilia mzunguko wa fedha taslimu mikononi (Cash In, Cash Out, Petty Cash) na salio linalobaki
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Pakua (CSV)</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Ingiza Muamala wa Fedha</span>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 uppercase">Jumla ya Fedha Zilizoingia (Cash In)</span>
              <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-2">
              TZS {totalCashIn.toLocaleString()}
            </p>
            <span className="text-xs text-slate-500 mt-1 block">Mapokezi ya ada na michango taslimu</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-600 uppercase">Jumla ya Fedha Zilizotoka (Cash Out)</span>
              <ArrowUpRight className="w-5 h-5 text-rose-600" />
            </div>
            <p className="text-2xl font-bold text-rose-700 mt-2">
              TZS {totalCashOut.toLocaleString()}
            </p>
            <span className="text-xs text-slate-500 mt-1 block">Matumizi madogo madogo ya shule taslimu</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 uppercase">Salio Lililopo Mikononi (Cash in Hand)</span>
              <Wallet className="w-5 h-5 text-emerald-700" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              TZS {currentBalance.toLocaleString()}
            </p>
            <span className="text-xs text-emerald-600 mt-1 block font-medium">
              Salio halisi lililopo kwenye sefu ya shule
            </span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Tafuta chanzo, maelezo au namba ya kumbukumbu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Aina ya Muamala:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'ALL' | 'CASH_IN' | 'CASH_OUT')}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">Miamala Yote</option>
              <option value="CASH_IN">Kuingia (Cash In)</option>
              <option value="CASH_OUT">Kutoka (Cash Out)</option>
            </select>
          </div>
        </div>

        {/* Cashbook Ledger Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Kitabu Kikuu cha Fedha Taslimu (Ledger)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Tarehe</th>
                  <th className="px-4 py-3 text-center">Aina</th>
                  <th className="px-4 py-3">Chanzo / Mlipwaji</th>
                  <th className="px-4 py-3">Maelezo</th>
                  <th className="px-4 py-3">Namba ya Kumbukumbu</th>
                  <th className="px-4 py-3 text-right">Kuingia (TZS)</th>
                  <th className="px-4 py-3 text-right">Kutoka (TZS)</th>
                  <th className="px-4 py-3 text-right">Salio Linalobaki (TZS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{item.date}</td>
                    <td className="px-4 py-3 text-center">
                      {item.type === 'CASH_IN' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <ArrowDownLeft className="w-3 h-3" /> Pesa Kuingia
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                          <ArrowUpRight className="w-3 h-3" /> Pesa Kutoka
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.sourceOrPayee}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{item.description}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.reference}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700 font-mono">
                      {item.type === 'CASH_IN' ? item.amount.toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-rose-700 font-mono">
                      {item.type === 'CASH_OUT' ? item.amount.toLocaleString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 font-mono">
                      {item.runningBalance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: RECORD CASH MOVEMENT */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Rekodi Muamala wa Fedha Taslimu</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecord} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aina ya Muamala *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMovementType('CASH_IN')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        movementType === 'CASH_IN'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowDownLeft className="w-4 h-4" /> Pesa Kuingia (Cash In)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMovementType('CASH_OUT')}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        movementType === 'CASH_OUT'
                          ? 'border-rose-600 bg-rose-50 text-rose-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" /> Pesa Kutoka (Cash Out)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chanzo / Mpokeaji (Source / Payee) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Mlinzi wa Shule au Muuzaji wa Vifaa"
                    value={sourceOrPayee}
                    onChange={(e) => setSourceOrPayee(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maelezo ya Muamala *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Nauli ya dharura ya Mwalimu au ununuzi wa sabuni"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                      Namba ya Kumbukumbu / Vocha (PV)
                    </label>
                    <input
                      type="text"
                      placeholder="Mfano: PV-2026-081"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 font-mono focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
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
                    Hifadhi Muamala
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
