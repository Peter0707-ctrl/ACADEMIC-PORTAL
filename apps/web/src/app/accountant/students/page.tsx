'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import AccountantShell from '@/components/accountant-shell';
import {
  Users,
  Search,
  Filter,
  Eye,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  X,
  FileText,
  DollarSign,
  Building2,
} from 'lucide-react';
import {
  getStudentFinancialAccounts,
  getAllInvoices,
  getAllPayments,
  getAllReceipts,
  getAllAdjustments,
  StudentFinancialAccount,
  StudentInvoice,
  StudentPayment,
  OfficialReceipt,
  FinancialAdjustment,
} from '@/lib/accountant-data';
import { PRIMARY_CLASSES_LIST } from '@/lib/auth-session';

export default function StudentFeeAccountsPage() {
  const [accounts, setAccounts] = useState<StudentFinancialAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Student Statement Modal
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [payments, setPayments] = useState<StudentPayment[]>([]);
  const [receipts, setReceipts] = useState<OfficialReceipt[]>([]);
  const [adjustments, setAdjustments] = useState<FinancialAdjustment[]>([]);

  useEffect(() => {
    setAccounts(getStudentFinancialAccounts());
    setInvoices(getAllInvoices());
    setPayments(getAllPayments());
    setReceipts(getAllReceipts());
  }, []);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch =
        acc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.parentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = classFilter === 'ALL' || acc.standard === classFilter;
      const matchesStatus = statusFilter === 'ALL' || acc.clearanceStatus === statusFilter;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [accounts, searchTerm, classFilter, statusFilter]);

  const selectedAccount = useMemo(() => {
    if (!selectedStudentId) return null;
    return accounts.find((a) => a.studentId === selectedStudentId) || null;
  }, [accounts, selectedStudentId]);

  const studentInvoices = useMemo(() => {
    if (!selectedStudentId) return [];
    return invoices.filter((i) => i.studentId === selectedStudentId);
  }, [invoices, selectedStudentId]);

  const studentPayments = useMemo(() => {
    if (!selectedStudentId) return [];
    return payments.filter((p) => p.studentId === selectedStudentId);
  }, [payments, selectedStudentId]);

  const formatTZS = (num: number) => `TZS ${num.toLocaleString('en-US')}`;

  const getClearanceBadge = (status: StudentFinancialAccount['clearanceStatus']) => {
    switch (status) {
      case 'CLEARED':
        return { label: 'Ameilipa Yote (Cleared)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'PARTIALLY_CLEARED':
        return { label: 'Amelipa Sehemu (Partially Cleared)', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'EXEMPTED':
        return { label: 'Msamaha wa Ada (Exempted)', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'NOT_CLEARED':
      default:
        return { label: 'Anadaiwa (Not Cleared)', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
  };

  return (
    <AccountantShell
      pageTitle="Akaunti za Ada za Wanafunzi (Student Fee Accounts)"
      pageDescription="Hali ya malipo, salio linalodaiwa, na taarifa za kina za kifedha (Financial Statements) za kila mwanafunzi"
    >
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Jumla ya Akaunti</span>
            <div className="text-xl font-black text-slate-900">{accounts.length} Wanafunzi</div>
            <span className="text-[11px] text-slate-500">Wote wana namba ya usajili</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Wanafunzi Waliomaliza Ada</span>
            <div className="text-xl font-black text-emerald-800">
              {accounts.filter((a) => a.clearanceStatus === 'CLEARED').length}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Salio ni TZS 0 (Cleared)</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Wenye Sehemu ya Ada</span>
            <div className="text-xl font-black text-blue-800">
              {accounts.filter((a) => a.clearanceStatus === 'PARTIALLY_CLEARED').length}
            </div>
            <span className="text-[11px] text-blue-700 font-medium">Wamelipa &gt; 50%</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Wanaodaiwa (Debtors)</span>
            <div className="text-xl font-black text-rose-700">
              {accounts.filter((a) => a.balance > 0).length}
            </div>
            <span className="text-[11px] text-rose-600 font-medium">Wana madeni ya ada</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tafuta jina, namba ya usajili (PS-2026...), mzazi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>Chuja kwa Darasa:</span>
            </div>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="ALL">Madarasa Yote (Standard 1–7)</option>
              {PRIMARY_CLASSES_LIST.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="ALL">Hali Zote za Kibali</option>
              <option value="CLEARED">Waliomaliza Ada (Cleared)</option>
              <option value="PARTIALLY_CLEARED">Waliolipa Sehemu</option>
              <option value="NOT_CLEARED">Wanaodaiwa (Not Cleared)</option>
              <option value="EXEMPTED">Msamaha wa Ada</option>
            </select>
          </div>
        </div>

        {/* Student Accounts Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-800" />
              <h3 className="font-bold text-xs text-slate-900">Daftari la Kifedha la Wanafunzi</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Inaonyesha wanafunzi {filteredAccounts.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Namba ya Usajili (Student ID)</th>
                  <th className="py-3 px-4">Jina Kamili la Mwanafunzi</th>
                  <th className="py-3 px-4">Darasa &bull; Mkondo</th>
                  <th className="py-3 px-4">Jumla ya Ankara (Charges)</th>
                  <th className="py-3 px-4">Kiasi Kilicholipwa</th>
                  <th className="py-3 px-4">Salio Linalodaiwa (Balance)</th>
                  <th className="py-3 px-4">Hali ya Kibali (Clearance)</th>
                  <th className="py-3 px-4 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredAccounts.map((acc) => {
                  const badge = getClearanceBadge(acc.clearanceStatus);
                  return (
                    <tr key={acc.studentId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] font-bold text-emerald-950">
                        {acc.studentId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{acc.fullName}</div>
                        <div className="text-[10px] text-slate-400">Mzazi: {acc.parentName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{acc.standard}</div>
                        <div className="text-[10px] text-slate-500">{acc.stream}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {formatTZS(acc.totalInvoiced)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                        {formatTZS(acc.totalPaid)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        {acc.balance > 0 ? (
                          <span className="text-rose-700">{formatTZS(acc.balance)}</span>
                        ) : (
                          <span className="text-emerald-700">TZS 0</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudentId(acc.studentId)}
                          className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs inline-flex items-center gap-1 border border-emerald-200 transition-colors"
                          title="Fungua Taarifa Rasmi ya Kifedha ya Mwanafunzi"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Statement</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-600">Hakuna akaunti ya ada iliyopatikana</p>
                      <p className="text-xs text-slate-400 mt-1">Jaribu kubadilisha vigezo vya utafutaji au darasa.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MODAL: STUDENT FINANCIAL STATEMENT (SECTION 8 SPECIFICATION) */}
        {/* ===================================================================== */}
        {selectedAccount && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6">
              {/* Modal Header Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-black text-slate-900 text-base">
                    Taarifa Rasmi ya Kifedha ya Mwanafunzi (Student Statement)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Chapisha (Print)</span>
                  </button>
                  <button
                    onClick={() => setSelectedStudentId(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Statement Container */}
              <div className="space-y-6 text-xs">
                {/* School Header */}
                <div className="text-center pb-4 border-b-2 border-slate-800 space-y-1">
                  <div className="flex items-center justify-center gap-2 mb-0.5">
                    <Building2 className="w-5 h-5 text-emerald-800" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      JAMHURI YA MUUNGANO WA TANZANIA
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 uppercase">
                    PRIMARY &amp; NURSERY SCHOOL
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    Usajili Na: EM.1428/TZ &bull; S.L.P. 1428, Dar es Salaam &bull; Simu: 0779304500
                  </p>
                  <span className="inline-block mt-1 px-3 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold uppercase text-[10px]">
                    TAARIFA YA FEDHA NA ADA YA MWANAFUNZI (STUDENT FINANCIAL STATEMENT)
                  </span>
                </div>

                {/* Student Particulars Card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Mwanafunzi:</span>
                    <strong className="text-slate-900 text-sm block">{selectedAccount.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Namba ya Usajili:</span>
                    <strong className="font-mono text-emerald-900 text-sm block">{selectedAccount.studentId}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Darasa:</span>
                    <strong className="text-slate-800 block">{selectedAccount.standard}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Hali ya Kibali:</span>
                    <strong className="text-slate-800 block">
                      {selectedAccount.clearanceStatus === 'CLEARED' ? '✓ Ameilipa Yote' : 'Anadaiwa'}
                    </strong>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Jumla ya Ankara (Charges)</span>
                    <span className="text-lg font-black text-slate-900">{formatTZS(selectedAccount.totalInvoiced)}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">Kiasi Kilicholipwa (Paid)</span>
                    <span className="text-lg font-black text-emerald-900">{formatTZS(selectedAccount.totalPaid)}</span>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                    <span className="text-[10px] font-bold uppercase text-rose-800 block">Salio Linalodaiwa (Outstanding)</span>
                    <span className="text-lg font-black text-rose-800">{formatTZS(selectedAccount.balance)}</span>
                  </div>
                </div>

                {/* Invoices Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    1. Ankara Zilizotolewa (Invoices)
                  </h4>
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-600 font-bold">
                      <tr>
                        <th className="p-2">Namba ya Ankara</th>
                        <th className="p-2">Tarehe</th>
                        <th className="p-2">Muhula</th>
                        <th className="p-2">Kiasi (TZS)</th>
                        <th className="p-2">Zilizoingia</th>
                        <th className="p-2">Salio</th>
                        <th className="p-2">Hali</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {studentInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="p-2 font-mono font-bold text-emerald-950">{inv.invoiceNumber}</td>
                          <td className="p-2">{inv.createdAt}</td>
                          <td className="p-2">{inv.term} {inv.academicYear}</td>
                          <td className="p-2 font-mono font-bold">{inv.totalAmount.toLocaleString()}</td>
                          <td className="p-2 font-mono text-emerald-800">{inv.amountPaid.toLocaleString()}</td>
                          <td className="p-2 font-mono font-bold text-rose-700">{inv.balance.toLocaleString()}</td>
                          <td className="p-2 font-bold">{inv.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Payments History */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    2. Kumbukumbu za Malipo (Payment History)
                  </h4>
                  {studentPayments.length > 0 ? (
                    <table className="w-full text-left text-xs border border-slate-200">
                      <thead className="bg-slate-100 text-slate-600 font-bold">
                        <tr>
                          <th className="p-2">Stakabadhi / Malipo Na</th>
                          <th className="p-2">Tarehe</th>
                          <th className="p-2">Njia ya Malipo</th>
                          <th className="p-2">Namba ya Rejea (Ref)</th>
                          <th className="p-2">Kiasi (TZS)</th>
                          <th className="p-2">Hali</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {studentPayments.map((pay) => (
                          <tr key={pay.id}>
                            <td className="p-2 font-mono font-bold text-emerald-950">{pay.receiptNumber || pay.paymentNumber}</td>
                            <td className="p-2">{pay.paymentDate}</td>
                            <td className="p-2">{pay.paymentMethod}</td>
                            <td className="p-2 font-mono text-slate-500">{pay.referenceNumber}</td>
                            <td className="p-2 font-mono font-bold text-emerald-800">{pay.amount.toLocaleString()}</td>
                            <td className="p-2 font-bold text-emerald-700">{pay.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400">
                      Hakuna rekodi ya malipo yaliyothibitishwa kwa mwanafunzi huyu.
                    </div>
                  )}
                </div>

                {/* Official Signatures and Stamp */}
                <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs">
                  <div className="space-y-3">
                    <div>
                      <span className="font-bold text-slate-900 block">Imeandaliwa na:</span>
                      <span className="text-slate-700">Bw. Ramadhani Athumani Tembo</span>
                      <span className="text-[10px] text-slate-400 block">Mhasibu wa Shule &bull; ACC-2026-001</span>
                    </div>
                    <div className="pt-4 border-b border-dashed border-slate-400 w-48" />
                    <span className="text-[10px] text-slate-400">Sahihi &amp; Tarehe</span>
                  </div>

                  <div className="space-y-3 text-right">
                    <div>
                      <span className="font-bold text-slate-900 block">Imethibitishwa na:</span>
                      <span className="text-slate-700">Mwalimu Mkuu (Headteacher)</span>
                      <span className="text-[10px] text-slate-400 block">Kukumbuka Primary &amp; Nursery School</span>
                    </div>
                    <div className="pt-4 border-b border-dashed border-slate-400 w-48 ml-auto" />
                    <span className="text-[10px] text-slate-400">Muhuri Rasmi wa Shule (Official Stamp)</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-3 border-t border-slate-200 print:hidden">
                <button
                  onClick={() => setSelectedStudentId(null)}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Funga
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccountantShell>
  );
}
