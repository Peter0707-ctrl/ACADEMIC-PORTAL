'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  getAllPayments,
  recordNewPayment,
  verifyPayment,
  getAllInvoices,
  getStudentFinancialAccounts,
  getBankAccounts,
  StudentPayment,
  StudentInvoice,
  StudentFinancialAccount,
  SchoolBankAccount,
  PaymentMethod,
} from '@/lib/accountant-data';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  Check,
  Printer,
  X,
  FileCheck,
  AlertCircle,
  Building,
  Smartphone,
  Banknote,
} from 'lucide-react';
import Link from 'next/link';

export default function AccountantPaymentsPage() {
  const [payments, setPayments] = useState<StudentPayment[]>([]);
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [accounts, setAccounts] = useState<StudentFinancialAccount[]>([]);
  const [bankAccounts, setBankAccounts] = useState<SchoolBankAccount[]>([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');

  // New Payment Form Modal
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK');
  const [bankAccountId, setBankAccountId] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  // Verification alert modal / feedback
  const [verifiedSuccessReceipt, setVerifiedSuccessReceipt] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPayments(getAllPayments());
    setInvoices(getAllInvoices());
    setAccounts(getStudentFinancialAccounts());
    setBankAccounts(getBankAccounts());
  };

  const handleStudentSelect = (sId: string) => {
    setStudentId(sId);
    const studentInvoices = invoices.filter(
      (inv) => inv.studentId === sId && (inv.status === 'ISSUED' || inv.status === 'PARTIALLY_PAID' || inv.status === 'OVERDUE')
    );
    if (studentInvoices.length > 0) {
      setSelectedInvoiceId(studentInvoices[0].id);
      setAmount(studentInvoices[0].balance);
    } else {
      setSelectedInvoiceId('');
      setAmount('');
    }
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = accounts.find((a) => a.studentId === studentId);
    const inv = invoices.find((i) => i.id === selectedInvoiceId);

    if (!acc || !inv) {
      alert('Tafadhali chagua mwanafunzi na ankara inayodaiwa');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert('Weka kiasi halali cha malipo');
      return;
    }

    const selectedBank = bankAccounts.find((b) => b.id === bankAccountId);

    recordNewPayment({
      studentId: acc.studentId,
      studentName: acc.fullName,
      standard: acc.standard,
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      amount: Number(amount),
      paymentMethod,
      bankAccountId: paymentMethod === 'BANK' ? bankAccountId : undefined,
      bankAccountName: paymentMethod === 'BANK' && selectedBank ? `${selectedBank.bankName} - ${selectedBank.accountNumber}` : undefined,
      referenceNumber: referenceNumber.trim() || `REF-${Date.now().toString().slice(-6)}`,
      paymentDate,
      receivedBy: 'Bw. Ramadhani Tembo',
      notes,
    });

    setShowRecordModal(false);
    // Reset form
    setStudentId('');
    setSelectedInvoiceId('');
    setAmount('');
    setReferenceNumber('');
    setNotes('');
    loadData();
  };

  const handleVerifyPayment = (payment: StudentPayment) => {
    const confirmVerify = window.confirm(
      `Thibitisha malipo ya TZS ${payment.amount.toLocaleString()} ya ${payment.studentName} (Rejea: ${payment.referenceNumber})?\n\nHii itapunguza deni la ankara na kutoa Stakabadhi Rasmi (Official Receipt).`
    );
    if (!confirmVerify) return;

    const res = verifyPayment(payment.id, 'Bw. Ramadhani Tembo (Mhasibu)');
    if (res.success && res.receipt) {
      setVerifiedSuccessReceipt(res.receipt.receiptNumber);
      loadData();
    }
  };

  // Filtered payments
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.paymentNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.studentId.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'ALL' || p.paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalCollectedVerified = payments
    .filter((p) => p.status === 'VERIFIED')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === 'PENDING');
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Ukusanyaji & Uhakiki wa Malipo (Student Payments & Verification)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Rekodi malipo ya ada ya benki, simu na fedha taslimu. Hakiki malipo ili kutoa stakabadhi na kupunguza madeni.
            </p>
          </div>
          <button
            onClick={() => setShowRecordModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Rekodi Malipo Mapya</span>
          </button>
        </div>

        {/* Verification Alert Banner if any pending */}
        {pendingPayments.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-semibold text-amber-900 text-sm">
                  Kuna malipo {pendingPayments.length} (TZS {pendingAmount.toLocaleString()}) yanayosubiri uhakiki!
                </h4>
                <p className="text-xs text-amber-700">
                  Malipo yanayoingizwa yanahitaji kubonyezwa &quot;Hakiki Malipo&quot; baada ya kuthibitisha na taarifa ya benki.
                </p>
              </div>
            </div>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className="text-xs font-semibold px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Tazama Yanayosubiri
            </button>
          </div>
        )}

        {/* Success Modal for Verification */}
        {verifiedSuccessReceipt && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">Malipo Yamethibitishwa Kikamilifu!</h4>
                <p className="text-xs text-emerald-700">
                  Stakabadhi Rasmi Na. <strong>{verifiedSuccessReceipt}</strong> imetolewa na deni la mwanafunzi limepunguzwa.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/accountant/receipts"
                className="text-xs px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700"
              >
                Tazama Stakabadhi
              </Link>
              <button
                onClick={() => setVerifiedSuccessReceipt(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Jumla ya Malipo Yaliyohakikiwa
            </span>
            <p className="text-2xl font-bold text-emerald-700 mt-2">
              TZS {totalCollectedVerified.toLocaleString()}
            </p>
            <span className="text-xs text-slate-500 mt-1 block">Yameingizwa rasmi katika hesabu za shule</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Malipo Yanayosubiri Uhakiki
            </span>
            <p className="text-2xl font-bold text-amber-700 mt-2">
              TZS {pendingAmount.toLocaleString()}
            </p>
            <span className="text-xs text-amber-600 mt-1 block">
              {pendingPayments.length} miamala inasubiri kuthibitishwa
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Jumla ya Miamala Yote
            </span>
            <p className="text-2xl font-bold text-slate-800 mt-2">{payments.length}</p>
            <span className="text-xs text-slate-500 mt-1 block">Benki, Simu ya Mkononi na Fedha Taslimu</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Tafuta jina la mwanafunzi, namba ya malipo au kumbukumbu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Hali:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="ALL">Zote</option>
                <option value="VERIFIED">Yaliyohakikiwa (Verified)</option>
                <option value="PENDING">Yanayosubiri (Pending)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Njia:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="ALL">Njia Zote</option>
                <option value="BANK">Benki (CRDB/NMB)</option>
                <option value="MOBILE_MONEY">Simu (M-Pesa/Tigo)</option>
                <option value="CASH">Fedha Taslimu (Cash)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Miamala ya Malipo ({filteredPayments.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Malipo #</th>
                  <th className="px-4 py-3">Mwanafunzi</th>
                  <th className="px-4 py-3">Ankara Husika</th>
                  <th className="px-4 py-3 text-right">Kiasi (TZS)</th>
                  <th className="px-4 py-3">Njia ya Malipo</th>
                  <th className="px-4 py-3">Kumbukumbu (Ref)</th>
                  <th className="px-4 py-3">Tarehe</th>
                  <th className="px-4 py-3 text-center">Hali</th>
                  <th className="px-4 py-3 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400">
                      Hakuna malipo yaliyopatikana.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-emerald-700">{p.paymentNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{p.studentName}</div>
                        <div className="text-xs text-slate-400 font-mono">
                          {p.studentId} &bull; {p.standard}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.invoiceNumber}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">
                        {p.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          {p.paymentMethod === 'BANK' && <Building className="w-3.5 h-3.5 text-blue-600" />}
                          {p.paymentMethod === 'MOBILE_MONEY' && <Smartphone className="w-3.5 h-3.5 text-amber-600" />}
                          {p.paymentMethod === 'CASH' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                          <span>
                            {p.paymentMethod === 'BANK'
                              ? 'Benki'
                              : p.paymentMethod === 'MOBILE_MONEY'
                              ? 'Simu ya Mkononi'
                              : 'Taslimu'}
                          </span>
                        </div>
                        {p.bankAccountName && (
                          <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                            {p.bankAccountName}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.referenceNumber}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{p.paymentDate}</td>
                      <td className="px-4 py-3 text-center">
                        {p.status === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Imethibitishwa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> Inasubiri
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.status === 'PENDING' ? (
                          <button
                            onClick={() => handleVerifyPayment(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium shadow-sm transition"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Hakiki Malipo</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {p.receiptNumber}
                            </span>
                            <Link
                              href="/accountant/receipts"
                              title="Tazama Stakabadhi Rasmi"
                              className="p-1 text-slate-400 hover:text-emerald-700"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: RECORD PAYMENT */}
        {showRecordModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Rekodi Malipo Mapya ya Ada</h3>
                  <p className="text-xs text-slate-500">
                    Ingiza stakabadhi au malipo yaliyofanywa na mzazi/mlezi
                  </p>
                </div>
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chagua Mwanafunzi *
                  </label>
                  <select
                    value={studentId}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    required
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Chagua Mwanafunzi --</option>
                    {accounts.map((acc) => (
                      <option key={acc.studentId} value={acc.studentId}>
                        {acc.fullName} ({acc.studentId}) &bull; Deni: TZS {acc.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {studentId && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ankara Inayodaiwa *
                    </label>
                    <select
                      value={selectedInvoiceId}
                      onChange={(e) => {
                        setSelectedInvoiceId(e.target.value);
                        const matched = invoices.find((i) => i.id === e.target.value);
                        if (matched) setAmount(matched.balance);
                      }}
                      required
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">-- Chagua Ankara --</option>
                      {invoices
                        .filter((inv) => inv.studentId === studentId)
                        .map((inv) => (
                          <option key={inv.id} value={inv.id}>
                            {inv.invoiceNumber} ({inv.term}) &bull; Baki: TZS {inv.balance.toLocaleString()}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kiasi Kinacholipwa (TZS) *
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
                      Tarehe ya Malipo *
                    </label>
                    <input
                      type="date"
                      required
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Njia ya Malipo *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('BANK')}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition ${
                        paymentMethod === 'BANK'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building className="w-4 h-4" /> Benki (Bank)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('MOBILE_MONEY')}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition ${
                        paymentMethod === 'MOBILE_MONEY'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" /> Simu ya Mkononi
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition ${
                        paymentMethod === 'CASH'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Banknote className="w-4 h-4" /> Taslimu (Cash)
                    </button>
                  </div>
                </div>

                {paymentMethod === 'BANK' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Akaunti ya Benki ya Shule
                    </label>
                    <select
                      value={bankAccountId}
                      onChange={(e) => setBankAccountId(e.target.value)}
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
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Namba ya Kumbukumbu / Rejea (Slip No. au M-Pesa Code) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: CRDB-994821 au MPESA-QA817290"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maelezo ya Ziada (Hiari)
                  </label>
                  <input
                    type="text"
                    placeholder="Mfano: Malipo yamepokelewa na Mwalimu Mkuu/Mhasibu"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>
                    Malipo haya yataingia kama <strong>&quot;Inasubiri Uhakiki&quot;</strong>. Unaweza kuyahakiki mara moja kwenye orodha ili kupunguza deni na kutoa stakabadhi.
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowRecordModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Hifadhi Malipo
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
