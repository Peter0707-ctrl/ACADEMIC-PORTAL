'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  getStudentFinancialAccounts,
  getAllInvoices,
  StudentFinancialAccount,
  StudentInvoice,
} from '@/lib/accountant-data';
import {
  AlertTriangle,
  Search,
  Download,
  Printer,
  Send,
  Filter,
  CheckCircle,
  Phone,
  User,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import Link from 'next/link';

export default function AccountantOutstandingFeesPage() {
  const [accounts, setAccounts] = useState<StudentFinancialAccount[]>([]);
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [search, setSearch] = useState('');
  const [standardFilter, setStandardFilter] = useState('ALL');
  const [minDebtFilter, setMinDebtFilter] = useState('0');

  // Reminder notification simulation modal
  const [reminderModalStudent, setReminderModalStudent] = useState<StudentFinancialAccount | null>(null);
  const [reminderSentMsg, setReminderSentMsg] = useState<string | null>(null);

  useEffect(() => {
    setAccounts(getStudentFinancialAccounts());
    setInvoices(getAllInvoices());
  }, []);

  // Filter only debtors (balance > 0)
  const debtors = accounts.filter((a) => {
    const hasDebt = a.balance > Number(minDebtFilter || 0);
    const matchesStandard = standardFilter === 'ALL' || a.standard === standardFilter;
    const matchesSearch =
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.studentId.toLowerCase().includes(search.toLowerCase()) ||
      a.parentName.toLowerCase().includes(search.toLowerCase());

    return hasDebt && matchesStandard && matchesSearch;
  });

  const totalDebt = debtors.reduce((sum, a) => sum + a.balance, 0);
  const averageDebt = debtors.length > 0 ? Math.round(totalDebt / debtors.length) : 0;

  // Find class with most debt
  const classDebtMap = debtors.reduce<Record<string, number>>((acc, d) => {
    acc[d.standard] = (acc[d.standard] || 0) + d.balance;
    return acc;
  }, {});
  let highestDebtClass = 'Hakuna';
  let maxDebt = 0;
  for (const [cls, val] of Object.entries(classDebtMap)) {
    if (val > maxDebt) {
      maxDebt = val;
      highestDebtClass = cls;
    }
  }

  const handleSendReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderModalStudent) return;
    setReminderSentMsg(
      `Ujumbe wa ukumbusho wa ada ya TZS ${reminderModalStudent.balance.toLocaleString()} umetumwa kwa mzazi ${reminderModalStudent.parentName} (${reminderModalStudent.parentPhone}) kwa njia ya SMS.`
    );
    setReminderModalStudent(null);
    setTimeout(() => setReminderSentMsg(null), 6000);
  };

  const handleExportCSV = () => {
    const headers = ['Namba ya Udahili,Jina la Mwanafunzi,Darasa,Mzazi,Simu,Jumla ya Ankara,Imelipwa,Deni (TZS)\n'];
    const rows = debtors.map(
      (d) =>
        `"${d.studentId}","${d.fullName}","${d.standard}","${d.parentName}","${d.parentPhone}",${d.totalInvoiced},${d.totalPaid},${d.balance}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ripoti_ya_Wanafunzi_Wenye_Madeni_${new Date().toISOString().slice(0, 10)}.csv`);
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
              <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Usimamizi wa Madeni ya Ada (Outstanding Fees & Debtors)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Orodha kamili ya wanafunzi wanaodaiwa ada, taarifa za wazazi, na utumaji wa jumbe za ukumbusho
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Pakua Orodha (CSV)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Chapisha Ripoti</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {reminderSentMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm text-emerald-800 font-medium">{reminderSentMsg}</span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Jumla ya Madeni Shuleni
            </span>
            <p className="text-2xl font-bold text-rose-700 mt-2">
              TZS {totalDebt.toLocaleString()}
            </p>
            <span className="text-xs text-slate-500 mt-1 block">Kutoka kwa wanafunzi {debtors.length}</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Idadi ya Wanafunzi Wenye Deni
            </span>
            <p className="text-2xl font-bold text-amber-700 mt-2">{debtors.length}</p>
            <span className="text-xs text-amber-600 mt-1 block">
              {accounts.length > 0 ? ((debtors.length / accounts.length) * 100).toFixed(1) : 0}% ya wanafunzi wote
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Wastani wa Deni kwa Mwanafunzi
            </span>
            <p className="text-2xl font-bold text-slate-800 mt-2">
              TZS {averageDebt.toLocaleString()}
            </p>
            <span className="text-xs text-slate-500 mt-1 block">Kulingana na wanafunzi wenye deni</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Darasa Lenye Deni Kubwa Zaidi
            </span>
            <p className="text-base font-bold text-blue-800 mt-2 truncate">{highestDebtClass}</p>
            <span className="text-xs text-blue-600 mt-1 block">
              TZS {maxDebt.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Tafuta jina, namba ya udahili, au mzazi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
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

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Kiwango cha Chini cha Deni:</span>
              <select
                value={minDebtFilter}
                onChange={(e) => setMinDebtFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="0">Madeni Yote (&gt; TZS 0)</option>
                <option value="100000">&gt; TZS 100,000</option>
                <option value="300000">&gt; TZS 300,000</option>
                <option value="500000">&gt; TZS 500,000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Debtors Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">
              Orodha ya Wanafunzi Wanaodaiwa ({debtors.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Udahili</th>
                  <th className="px-4 py-3">Mwanafunzi</th>
                  <th className="px-4 py-3">Darasa</th>
                  <th className="px-4 py-3">Mzazi / Mlezi</th>
                  <th className="px-4 py-3">Mawasiliano</th>
                  <th className="px-4 py-3 text-right">Jumla ya Ada</th>
                  <th className="px-4 py-3 text-right">Imelipwa</th>
                  <th className="px-4 py-3 text-right">Deni Lililobaki (TZS)</th>
                  <th className="px-4 py-3 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {debtors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400">
                      Hongera! Hakuna wanafunzi wenye madeni kulingana na vigezo vilivyowekwa.
                    </td>
                  </tr>
                ) : (
                  debtors.map((d) => (
                    <tr key={d.studentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-slate-700">{d.studentId}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{d.fullName}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {d.standard} ({d.stream})
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{d.parentName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{d.parentPhone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-700">
                        {d.totalInvoiced.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-700">
                        {d.totalPaid.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-rose-700 font-mono">
                        {d.balance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setReminderModalStudent(d)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-semibold transition"
                          >
                            <Send className="w-3 h-3" /> Tuma Kikumbusho
                          </button>
                          <Link
                            href="/accountant/students"
                            title="Tazama Taarifa ya Kifedha ya Mwanafunzi"
                            className="p-1 text-slate-400 hover:text-emerald-700"
                          >
                            <Printer className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: SEND REMINDER */}
        {reminderModalStudent && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Tuma Ujumbe wa Ukumbusho wa Ada</h3>
                <button
                  onClick={() => setReminderModalStudent(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSendReminder} className="mt-4 space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                  <div>
                    <span className="text-slate-400">Mwanafunzi: </span>
                    <strong className="text-slate-800">{reminderModalStudent.fullName}</strong> ({reminderModalStudent.standard})
                  </div>
                  <div>
                    <span className="text-slate-400">Mzazi: </span>
                    <strong className="text-slate-800">{reminderModalStudent.parentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Namba ya Simu: </span>
                    <strong className="text-slate-800">{reminderModalStudent.parentPhone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Kiasi Kinachodaiwa: </span>
                    <strong className="text-rose-700 font-mono font-bold text-sm">
                      TZS {reminderModalStudent.balance.toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ujumbe utakaoenda kwa Mzazi (SMS / WhatsApp)
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={`Mpendwa Mzazi wa ${reminderModalStudent.fullName}, Uongozi wa Shule ya Kukumbuka Primary unakukumbusha kulipa salio la ada la TZS ${reminderModalStudent.balance.toLocaleString()} kabla ya tarehe ya mwisho. Tafadhali lipa kupitia CRDB: 0150244589200 au M-Pesa Lipa Na: 5892110. Ahsante.`}
                    className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReminderModalStudent(null)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Tuma Ujumbe Sasa</span>
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
