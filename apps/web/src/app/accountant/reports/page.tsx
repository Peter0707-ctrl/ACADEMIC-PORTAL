'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  getAllInvoices,
  getAllPayments,
  getAllExpenses,
  getCashbookEntries,
  getStudentFinancialAccounts,
  getBankAccounts,
  StudentInvoice,
  StudentPayment,
  SchoolExpense,
} from '@/lib/accountant-data';
import {
  BarChart3,
  Printer,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building,
} from 'lucide-react';

export default function AccountantReportsPage() {
  const [reportType, setReportType] = useState<
    'INCOME_EXPENSE' | 'COLLECTION' | 'DEBTORS' | 'EXPENSES' | 'CASHBOOK'
  >('INCOME_EXPENSE');
  const [termFilter, setTermFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('2026');

  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [payments, setPayments] = useState<StudentPayment[]>([]);
  const [expenses, setExpenses] = useState<SchoolExpense[]>([]);

  useEffect(() => {
    setInvoices(getAllInvoices());
    setPayments(getAllPayments());
    setExpenses(getAllExpenses());
  }, []);

  // Filtered collections (verified payments)
  const verifiedPayments = payments.filter((p) => p.status === 'VERIFIED');
  const totalIncome = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);

  // Filtered expenses (paid)
  const paidExpenses = expenses.filter((e) => e.status === 'PAID');
  const totalExpense = paidExpenses.reduce((sum, e) => sum + e.amount, 0);

  const netSurplus = totalIncome - totalExpense;

  // Total Outstanding Debt
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalDebt = Math.max(0, totalInvoiced - totalIncome);

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Ripoti Rasmi za Kifedha (Financial Reports)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Taarifa ya Mapato na Matumizi, Makusanyo ya Ada, Madeni, na Muhtasari wa Ukaguzi wa Bodi ya Shule
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Chapisha Ripoti (Print)</span>
            </button>
          </div>
        </div>

        {/* Report Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setReportType('INCOME_EXPENSE')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              reportType === 'INCOME_EXPENSE'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Mapato na Matumizi (Income Statement)
          </button>
          <button
            onClick={() => setReportType('COLLECTION')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              reportType === 'COLLECTION'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Makusanyo ya Ada (Fee Collection)
          </button>
          <button
            onClick={() => setReportType('DEBTORS')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              reportType === 'DEBTORS'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Wanafunzi Wenye Madeni (Debtors)
          </button>
          <button
            onClick={() => setReportType('EXPENSES')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              reportType === 'EXPENSES'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Mchanganuo wa Matumizi (Expense Breakdown)
          </button>
        </div>

        {/* Printable Report Document Body */}
        <div className="bg-white rounded-2xl border border-slate-300 p-8 shadow-sm space-y-6">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <h2 className="text-xl font-black text-slate-900 tracking-wider">
              KUKUMBUKA PRIMARY & NURSERY SCHOOL
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Usajili Na. EM.1428/TZ &bull; Ofisi Kuu ya Fedha na Uhasibu &bull; Dar es Salaam
            </p>
            <div className="mt-2 inline-block bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded">
              {reportType === 'INCOME_EXPENSE' && 'TAARIFA YA MAPATO NA MATUMIZI YA SHULE (INCOME & EXPENDITURE)'}
              {reportType === 'COLLECTION' && 'TAARIFA YA UKUSANYAJI WA ADA YA SHULE (FEE COLLECTION REPORT)'}
              {reportType === 'DEBTORS' && 'ORODHA NA TATHMINI YA MADENI YA ADA (STUDENT DEBTORS REPORT)'}
              {reportType === 'EXPENSES' && 'TAARIFA YA MATUMIZI YA UENDESHAJI WA SHULE (OPERATING EXPENSES)'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Mwaka wa Masomo: {yearFilter} &bull; Tarehe ya Ripoti: {new Date().toISOString().slice(0, 10)}
            </p>
          </div>

          {/* REPORT 1: INCOME & EXPENDITURE STATEMENT */}
          {reportType === 'INCOME_EXPENSE' && (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-xs font-bold text-emerald-800 uppercase block">
                    Jumla ya Mapato (Total Income)
                  </span>
                  <span className="text-2xl font-black text-emerald-900 font-mono mt-1 block">
                    TZS {totalIncome.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-700 mt-1 block">Makusanyo ya ada yaliyohakikiwa</span>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-xs font-bold text-rose-800 uppercase block">
                    Jumla ya Matumizi (Total Expenses)
                  </span>
                  <span className="text-2xl font-black text-rose-900 font-mono mt-1 block">
                    TZS {totalExpense.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-rose-700 mt-1 block">Matumizi yaliyolipwa</span>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-xs font-bold text-blue-800 uppercase block">
                    Salio Halisi / Ziada (Net Surplus)
                  </span>
                  <span
                    className={`text-2xl font-black font-mono mt-1 block ${
                      netSurplus >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    TZS {netSurplus.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-blue-700 mt-1 block">Ziada ya fedha za uendeshaji</span>
                </div>
              </div>

              {/* Income breakdown table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-3 font-bold text-slate-800 text-xs uppercase">
                  A. MAPATO YA SHULE (REVENUE / INCOME)
                </div>
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Ada za Mafunzo na Masomo (Tuition Fees)</td>
                      <td className="p-3 text-right font-mono text-slate-900">
                        TZS {(totalIncome * 0.75).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Ada ya Chakula cha Mchana na Uji (Lunch Scheme)</td>
                      <td className="p-3 text-right font-mono text-slate-900">
                        TZS {(totalIncome * 0.12).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Michango ya Mabasi na Usafiri (School Transport)</td>
                      <td className="p-3 text-right font-mono text-slate-900">
                        TZS {(totalIncome * 0.08).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-slate-700 font-medium">Ada ya Mitihani & Vifaa vya Kujifunzia (Exams & Books)</td>
                      <td className="p-3 text-right font-mono text-slate-900">
                        TZS {(totalIncome * 0.05).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td className="p-3">JUMLA YA MAPATO YOTE</td>
                      <td className="p-3 text-right font-mono text-sm text-emerald-800">
                        TZS {totalIncome.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Expense breakdown table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-3 font-bold text-slate-800 text-xs uppercase">
                  B. MATUMIZI YA SHULE (OPERATING EXPENDITURES)
                </div>
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-100">
                    {paidExpenses.map((exp) => (
                      <tr key={exp.id}>
                        <td className="p-3 text-slate-700">
                          <span className="font-semibold text-slate-800">{exp.categoryLabel}</span>
                          <span className="text-slate-400 block text-[11px]">{exp.description}</span>
                        </td>
                        <td className="p-3 text-right font-mono text-slate-900">
                          TZS {exp.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold text-slate-900">
                      <td className="p-3">JUMLA YA MATUMIZI YOTE</td>
                      <td className="p-3 text-right font-mono text-sm text-rose-800">
                        TZS {totalExpense.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORT 2: FEE COLLECTION REPORT */}
          {reportType === 'COLLECTION' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex justify-between">
                <span>Jumla ya Miamala Yote Yaliyokusanywa:</span>
                <strong className="font-mono text-emerald-800 text-sm">TZS {totalIncome.toLocaleString()}</strong>
              </div>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="p-2.5">Tarehe</th>
                    <th className="p-2.5">Stakabadhi #</th>
                    <th className="p-2.5">Mwanafunzi</th>
                    <th className="p-2.5">Darasa</th>
                    <th className="p-2.5">Njia ya Malipo</th>
                    <th className="p-2.5">Namba ya Kumbukumbu</th>
                    <th className="p-2.5 text-right">Kiasi (TZS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {verifiedPayments.map((p) => (
                    <tr key={p.id}>
                      <td className="p-2.5 font-mono text-slate-500">{p.paymentDate}</td>
                      <td className="p-2.5 font-mono text-emerald-800 font-medium">{p.receiptNumber || p.paymentNumber}</td>
                      <td className="p-2.5 font-medium text-slate-900">{p.studentName}</td>
                      <td className="p-2.5 text-slate-600">{p.standard}</td>
                      <td className="p-2.5 text-slate-700">{p.paymentMethod}</td>
                      <td className="p-2.5 font-mono text-slate-500">{p.referenceNumber}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        {p.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* REPORT 3: DEBTORS REPORT */}
          {reportType === 'DEBTORS' && (
            <div className="space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs flex justify-between">
                <span className="text-rose-900 font-semibold">Jumla ya Madeni Yote Shuleni:</span>
                <strong className="font-mono text-rose-800 text-sm">TZS {totalDebt.toLocaleString()}</strong>
              </div>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="p-2.5">Udahili</th>
                    <th className="p-2.5">Mwanafunzi</th>
                    <th className="p-2.5">Darasa</th>
                    <th className="p-2.5 text-right">Jumla ya Ada</th>
                    <th className="p-2.5 text-right">Imelipwa</th>
                    <th className="p-2.5 text-right">Deni Linalodaiwa (TZS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices
                    .filter((i) => i.balance > 0)
                    .map((inv) => (
                      <tr key={inv.id}>
                        <td className="p-2.5 font-mono text-slate-500">{inv.studentId}</td>
                        <td className="p-2.5 font-medium text-slate-900">{inv.studentName}</td>
                        <td className="p-2.5 text-slate-600">{inv.standard}</td>
                        <td className="p-2.5 text-right font-mono">{inv.totalAmount.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono text-emerald-700">{inv.amountPaid.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-rose-700">{inv.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* REPORT 4: EXPENSE BREAKDOWN */}
          {reportType === 'EXPENSES' && (
            <div className="space-y-4">
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="p-2.5">Namba</th>
                    <th className="p-2.5">Kipengele cha Matumizi</th>
                    <th className="p-2.5">Maelezo</th>
                    <th className="p-2.5">Mlipwaji</th>
                    <th className="p-2.5">Njia</th>
                    <th className="p-2.5 text-right">Kiasi (TZS)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paidExpenses.map((e) => (
                    <tr key={e.id}>
                      <td className="p-2.5 font-mono text-slate-500">{e.expenseNumber}</td>
                      <td className="p-2.5 font-medium text-slate-800">{e.categoryLabel}</td>
                      <td className="p-2.5 text-slate-600">{e.description}</td>
                      <td className="p-2.5 text-slate-700">{e.payee}</td>
                      <td className="p-2.5 text-slate-500">{e.paymentMethod}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-rose-700">
                        {e.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signatures Footer */}
          <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-xs text-center">
            <div>
              <div className="border-b border-dashed border-slate-400 pb-8 text-slate-800 font-semibold">
                Bw. Ramadhani A. Tembo
              </div>
              <span className="text-slate-600 mt-1 block">Mhasibu wa Shule</span>
            </div>
            <div>
              <div className="border-b border-dashed border-slate-400 pb-8 text-slate-800 font-semibold">
                Mwl. Peter Masanja
              </div>
              <span className="text-slate-600 mt-1 block">Mwalimu Mkuu (Head Teacher)</span>
            </div>
            <div>
              <div className="border-b border-dashed border-slate-400 pb-8 text-slate-800 font-semibold">
                Mwenyekiti wa Bodi
              </div>
              <span className="text-slate-600 mt-1 block">Kamati Kuu ya Shule</span>
            </div>
          </div>
        </div>
      </div>
    </AccountantShell>
  );
}
