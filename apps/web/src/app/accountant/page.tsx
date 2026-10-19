'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AccountantShell from '@/components/accountant-shell';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  Users,
  AlertTriangle,
  Clock,
  Landmark,
  Scale,
  Plus,
  ArrowRight,
  CheckCircle2,
  FileText,
  Calendar,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import {
  getAccountantDashboardStats,
  verifyPayment,
  approveExpense,
} from '@/lib/accountant-data';
import { notifyUser } from '@/lib/notifications';

export default function AccountantDashboardPage() {
  const [stats, setStats] = useState<ReturnType<typeof getAccountantDashboardStats> | null>(null);

  const refreshStats = () => {
    setStats(getAccountantDashboardStats());
  };

  useEffect(() => {
    refreshStats();
  }, []);

  if (!stats) {
    return (
      <AccountantShell>
        <div className="py-20 text-center text-slate-400">
          Inapakia taarifa za fedha na uhasibu...
        </div>
      </AccountantShell>
    );
  }

  const formatTZS = (num: number) => {
    return `TZS ${num.toLocaleString('en-US')}`;
  };

  const handleQuickVerify = (paymentId: string) => {
    const res = verifyPayment(paymentId, 'Bw. Ramadhani Tembo (Mhasibu)');
    if (res.success) {
      notifyUser('success', 'Malipo Yamethibitishwa', `Stakabadhi rasmi Na. ${res.receipt?.receiptNumber} imetolewa kiotomatiki.`);
      refreshStats();
    }
  };

  const handleQuickApproveExpense = (expId: string) => {
    const success = approveExpense(expId, 'Mwl. Augustine Mrosso (Mkuu wa Shule)');
    if (success) {
      notifyUser('success', 'Matumizi Yameidhinishwa', 'Ombi la matumizi limeidhinishwa na Mwalimu Mkuu.');
      refreshStats();
    }
  };

  return (
    <AccountantShell
      pageTitle="Dashibodi ya Uhasibu & Fedha (Finance Dashboard)"
      pageDescription="Muhtasari wa Makusanyo ya Ada, Madeni ya Wanafunzi, Matumizi na Nafasi ya Fedha Benki"
    >
      <div className="space-y-6">
        {/* Welcome & Multi-Tenant School Banner (Soft, Modern & Pleasant) */}
        <div className="bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/80 text-slate-800 p-6 rounded-3xl shadow-xs border border-emerald-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                Primary School Financial OS &bull; 2026
              </span>
              <span className="text-xs text-slate-500 font-medium">Ofisi ya Mhasibu wa Shule</span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-slate-900">
              Hali ya Kifedha &bull; Shule ya Msingi Kukumbuka
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Taarifa zote zimeunganishwa moja kwa moja na akaunti za wanafunzi, miundo ya ada ya madarasa yote (Awali hadi La 7), daftari la fedha taslimu na akaunti za benki za CRDB na NMB.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/accountant/payments"
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-200" />
              <span>+ Pokea Malipo</span>
            </Link>
            <Link
              href="/accountant/expenses"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 transition-colors shadow-2xs"
            >
              <span>+ Ombi la Matumizi</span>
            </Link>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SECTION 2: SPECIFICATION OVERVIEW FINANCIAL CARDS */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Fees Expected */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Ada Zinazotarajiwa (Expected)</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900">{formatTZS(stats.totalFeesExpected)}</div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Jumla ya ankara zilizotolewa muhula I
            </span>
          </div>

          {/* 2. Total Fees Collected */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Zilizokusanywa (Collected)</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-emerald-800">{formatTZS(stats.totalFeesCollected)}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
              <span>{Math.round((stats.totalFeesCollected / Math.max(1, stats.totalFeesExpected)) * 100)}%</span>
              <span className="text-slate-500 font-normal">ya makusanyo yaliyohakikiwa</span>
            </div>
          </div>

          {/* 3. Outstanding Fees */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-rose-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Deni la Ada (Outstanding)</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-rose-700">{formatTZS(stats.outstandingFees)}</div>
            <span className="text-[11px] text-rose-600 font-semibold block">
              Zinazodaiwa kwa wazazi muhula huu
            </span>
          </div>

          {/* 4. Current Cash Position */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-purple-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Nafasi ya Fedha (Cash Position)</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-purple-900">{formatTZS(stats.currentCashPosition)}</div>
            <span className="text-[11px] text-slate-500 font-medium block">
              Benki (CRDB &amp; NMB) + Cashbook
            </span>
          </div>
        </div>

        {/* Secondary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Today's Collection */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Makusanyo ya Leo</span>
            <div className="text-sm font-black text-emerald-800">{formatTZS(stats.todaysCollection)}</div>
            <span className="text-[10px] text-slate-500">Zilizothibitishwa</span>
          </div>

          {/* This Month's Collection */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Makusanyo ya Mwezi</span>
            <div className="text-sm font-black text-emerald-900">{formatTZS(stats.thisMonthsCollection)}</div>
            <span className="text-[10px] text-emerald-700 font-medium">Mwezi huu</span>
          </div>

          {/* This Month's Expenses */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Matumizi ya Mwezi</span>
            <div className="text-sm font-black text-rose-700">{formatTZS(stats.thisMonthsExpenses)}</div>
            <span className="text-[10px] text-slate-500">Yaliyolipwa</span>
          </div>

          {/* Students with Debt */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Wanafunzi Wenye Madeni</span>
            <div className="text-sm font-black text-rose-800">{stats.studentsWithDebt} Wanafunzi</div>
            <Link href="/accountant/outstanding" className="text-[10px] text-rose-600 font-bold hover:underline">
              Tazama Orodha &rarr;
            </Link>
          </div>

          {/* Pending Payments */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Malipo Yasiyohakikiwa</span>
            <div className="text-sm font-black text-amber-800">{stats.pendingPayments} Yanasubiri</div>
            <Link href="/accountant/payments?status=PENDING" className="text-[10px] text-amber-700 font-bold hover:underline">
              Hakiki Benki &rarr;
            </Link>
          </div>

          {/* Reconciliation Differences */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Tofauti ya Benki</span>
            <div className="text-sm font-black text-slate-900">
              {stats.reconciliationDifferences === 0 ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sifuri (Balanced)
                </span>
              ) : (
                <span className="text-rose-600">{stats.reconciliationDifferences} Tofauti</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">Reconciliation</span>
          </div>
        </div>

        {/* Quick Workflow Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/accountant/payments"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Uhakiki wa Malipo (Payment Verification)
                </h4>
                <p className="text-[11px] text-slate-500">
                  {stats.pendingPayments} Malipo yanasubiri uthibitisho wa stakabadhi
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/accountant/clearance"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-800 transition-colors">
                  Kibali cha Fedha &amp; Matokeo (Clearance)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Dhibiti ufungaji wa matokeo kwa wenye madeni
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/accountant/reconciliation"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-purple-800 transition-colors">
                  Upatanisho wa Benki (Reconciliation)
                </h4>
                <p className="text-[11px] text-slate-500">
                  CRDB A/C: 51.2M &bull; NMB A/C: 22.6M TZS
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2-Column Tables: Recent Payments and Pending Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-800" />
                <h3 className="font-bold text-xs text-slate-900">Malipo Yaliyopokelewa Hivi Karibuni</h3>
              </div>
              <Link href="/accountant/payments" className="text-xs font-bold text-emerald-800 hover:underline">
                Tazama Yote &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Mwanafunzi</th>
                    <th className="py-2.5 px-3">Njia &bull; Rejea</th>
                    <th className="py-2.5 px-3">Kiasi (TZS)</th>
                    <th className="py-2.5 px-3">Hali</th>
                    <th className="py-2.5 px-3 text-right">Kitendo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {stats.recentPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{pay.studentName}</div>
                        <div className="text-[10px] font-mono text-emerald-900">{pay.studentId} &bull; {pay.standard}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800">{pay.paymentMethod}</div>
                        <div className="text-[10px] font-mono text-slate-400">{pay.referenceNumber}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                        {pay.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            pay.status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {pay.status === 'VERIFIED' ? 'Imethibitishwa' : 'Inasubiri'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {pay.status === 'PENDING' ? (
                          <button
                            onClick={() => handleQuickVerify(pay.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-xs"
                          >
                            Hakiki
                          </button>
                        ) : (
                          <Link
                            href="/accountant/receipts"
                            className="px-2 py-1 rounded-lg text-emerald-800 hover:bg-emerald-50 text-[10px] font-bold border border-emerald-200"
                          >
                            Stakabadhi
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Expenses Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-700" />
                <h3 className="font-bold text-xs text-slate-900">Matumizi &amp; Maombi ya Malipo</h3>
              </div>
              <Link href="/accountant/expenses" className="text-xs font-bold text-rose-800 hover:underline">
                Tazama Yote &rarr;
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Aina ya Matumizi</th>
                    <th className="py-2.5 px-3">Mlipwaji (Payee)</th>
                    <th className="py-2.5 px-3">Kiasi (TZS)</th>
                    <th className="py-2.5 px-3">Hali</th>
                    <th className="py-2.5 px-3 text-right">Idhini</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {stats.recentExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{exp.categoryLabel}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{exp.description}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{exp.payee}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-rose-700">
                        {exp.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            exp.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : exp.status === 'APPROVED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {exp.status === 'PAID' ? 'Imelipwa' : exp.status === 'APPROVED' ? 'Imeidhinishwa' : 'Inasubiri'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {exp.status === 'PENDING_APPROVAL' ? (
                          <button
                            onClick={() => handleQuickApproveExpense(exp.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-[10px]"
                            title="Idhinisha (Kama Mkuu wa Shule)"
                          >
                            Idhinisha
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">✓ Tayari</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AccountantShell>
  );
}
