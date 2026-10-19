'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  getAllPayments,
  getAllExpenses,
  getAllInvoices,
  getReconciliations,
  getStudentFinancialAccounts,
} from '@/lib/accountant-data';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  CreditCard,
  Building,
  TrendingDown,
} from 'lucide-react';
import Link from 'next/link';

interface FinanceAlert {
  id: string;
  title: string;
  message: string;
  type: 'PAYMENT_VERIFICATION' | 'OVERDUE_FEES' | 'EXPENSE_APPROVAL' | 'RECONCILIATION_DISCREPANCY';
  severity: 'HIGH' | 'MEDIUM' | 'INFO';
  actionUrl: string;
  actionText: string;
  count: number;
}

export default function AccountantAlertsPage() {
  const [alerts, setAlerts] = useState<FinanceAlert[]>([]);

  useEffect(() => {
    const payments = getAllPayments();
    const expenses = getAllExpenses();
    const invoices = getAllInvoices();
    const reconciliations = getReconciliations();

    const pendingPayments = payments.filter((p) => p.status === 'PENDING');
    const pendingExpenses = expenses.filter((e) => e.status === 'PENDING_APPROVAL');
    const overdueInvoices = invoices.filter((i) => i.status === 'OVERDUE');
    const discrepancies = reconciliations.filter((r) => r.status === 'DISCREPANCY');

    const list: FinanceAlert[] = [];

    if (pendingPayments.length > 0) {
      list.push({
        id: 'alt-pay',
        title: 'Malipo ya Ada Yanasubiri Uhakiki wa Mhasibu',
        message: `Kuna malipo ${pendingPayments.length} ya benki na simu yaliyoingizwa lakini bado hayajahakikiwa ili kutoa stakabadhi na kupunguza madeni.`,
        type: 'PAYMENT_VERIFICATION',
        severity: 'HIGH',
        actionUrl: '/accountant/payments',
        actionText: 'Hakiki Malipo Sasa',
        count: pendingPayments.length,
      });
    }

    if (pendingExpenses.length > 0) {
      list.push({
        id: 'alt-exp',
        title: 'Maombi ya Matumizi Yanasubiri Idhini ya Mwalimu Mkuu',
        message: `Maombi ${pendingExpenses.length} ya matumizi ya shule (vyakula, umeme, vifaa) yanasubiri saini ya idhini kutoka kwa Mwalimu Mkuu.`,
        type: 'EXPENSE_APPROVAL',
        severity: 'MEDIUM',
        actionUrl: '/accountant/expenses',
        actionText: 'Tazama Maombi',
        count: pendingExpenses.length,
      });
    }

    if (overdueInvoices.length > 0) {
      list.push({
        id: 'alt-due',
        title: 'Ankara za Ada Zilizopitisha Tarehe ya Mwisho (Overdue)',
        message: `Ankara ${overdueInvoices.length} za wanafunzi zimepitisha tarehe ya mwisho ya kulipa bila malipo kamili. Inashauriwa kutuma ukumbusho kwa wazazi.`,
        type: 'OVERDUE_FEES',
        severity: 'HIGH',
        actionUrl: '/accountant/outstanding',
        actionText: 'Tazama Wanafunzi Wenye Deni',
        count: overdueInvoices.length,
      });
    }

    if (discrepancies.length > 0) {
      list.push({
        id: 'alt-rec',
        title: 'Tofauti Katika Upatanisho wa Benki (Bank Discrepancy)',
        message: `Kuna rekodi ${discrepancies.length} za upatanisho wa benki zinazoonyesha tofauti kati ya salio la mfumo na salio halisi la benki.`,
        type: 'RECONCILIATION_DISCREPANCY',
        severity: 'HIGH',
        actionUrl: '/accountant/reconciliation',
        actionText: 'Kagua Upatanisho',
        count: discrepancies.length,
      });
    }

    setAlerts(list);
  }, []);

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <Bell className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Tahadhari & Taarifa za Kifedha (Financial Alerts)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Mambo ya kiuhasibu yanayohitaji utatuzi wa haraka: uhakiki wa malipo, idhini ya matumizi, na madeni
            </p>
          </div>
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
            Jumla ya Tahadhari Hai: {alerts.length}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">Mambo Yote Yapo Shwari!</h3>
              <p className="text-sm text-slate-500 mt-1">
                Hakuna tahadhari yoyote ya kifedha inayohitaji ufuatiliaji wa dharura kwa sasa.
              </p>
            </div>
          ) : (
            alerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-6 rounded-2xl border transition shadow-sm bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  alt.severity === 'HIGH'
                    ? 'border-l-4 border-l-rose-500'
                    : 'border-l-4 border-l-amber-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`p-3 rounded-xl mt-0.5 ${
                      alt.severity === 'HIGH'
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {alt.type === 'PAYMENT_VERIFICATION' && <CreditCard className="w-6 h-6" />}
                    {alt.type === 'EXPENSE_APPROVAL' && <TrendingDown className="w-6 h-6" />}
                    {alt.type === 'OVERDUE_FEES' && <Clock className="w-6 h-6" />}
                    {alt.type === 'RECONCILIATION_DISCREPANCY' && <ShieldAlert className="w-6 h-6" />}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{alt.title}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          alt.severity === 'HIGH'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {alt.severity === 'HIGH' ? 'Muhimu Sana' : 'Wastani'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 max-w-2xl">{alt.message}</p>
                  </div>
                </div>

                <Link
                  href={alt.actionUrl}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition whitespace-nowrap self-end md:self-center"
                >
                  <span>{alt.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </AccountantShell>
  );
}
