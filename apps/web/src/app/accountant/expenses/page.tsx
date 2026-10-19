'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  getAllExpenses,
  createExpenseRequest,
  approveExpense,
  payExpense,
  getBankAccounts,
  SchoolExpense,
  SchoolBankAccount,
  PaymentMethod,
} from '@/lib/accountant-data';
import {
  TrendingDown,
  Plus,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Building,
  Banknote,
  Filter,
  Check,
  DollarSign,
  AlertCircle,
  X,
} from 'lucide-react';

const EXPENSE_CATEGORIES: { key: SchoolExpense['category']; label: string }[] = [
  { key: 'TEACHER_SALARIES', label: 'Mishahara & Posho za Waalimu na Wafanyakazi' },
  { key: 'ELECTRICITY', label: 'Umeme wa Shule (LUKU)' },
  { key: 'WATER', label: 'Maji ya Shule (DAWASA)' },
  { key: 'INTERNET', label: 'Intaneti & Mawasiliano' },
  { key: 'TEACHING_MATERIALS', label: 'Vifaa vya Kufundishia & Karatasi za Mitihani' },
  { key: 'SCHOOL_SUPPLIES', label: 'Vifaa vya Ofisi na Usafi' },
  { key: 'FOOD_MEALS', label: 'Chakula cha Wanafunzi (Uji & Chakula cha Mchana)' },
  { key: 'TRANSPORT_FUEL', label: 'Mafuta ya Mabasi ya Shule & Matengenezo' },
  { key: 'MAINTENANCE_REPAIRS', label: 'Ukarabati wa Madarasa & Miundombinu' },
  { key: 'OFFICE_EXPENSES', label: 'Gharama za Utawala & Mikutano' },
  { key: 'PROCUREMENT', label: 'Manunuzi Maalum ya Shule' },
];

export default function AccountantExpensesPage() {
  const [expenses, setExpenses] = useState<SchoolExpense[]>([]);
  const [bankAccounts, setBankAccounts] = useState<SchoolBankAccount[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'PAID'>('ALL');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [category, setCategory] = useState<SchoolExpense['category']>('TEACHING_MATERIALS');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [payee, setPayee] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK');
  const [bankAccountId, setBankAccountId] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [docName, setDocName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setExpenses(getAllExpenses());
    setBankAccounts(getBankAccounts());
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert('Weka kiasi sahihi cha fedha');
      return;
    }

    const catObj = EXPENSE_CATEGORIES.find((c) => c.key === category);

    createExpenseRequest({
      category,
      categoryLabel: catObj ? catObj.label : 'Matumizi ya Shule',
      description,
      amount: Number(amount),
      date,
      payee,
      paymentMethod,
      referenceNumber: referenceNumber.trim() || `PV-${Date.now().toString().slice(-5)}`,
      bankAccountId: paymentMethod === 'BANK' ? bankAccountId : undefined,
      supportingDocumentName: docName.trim() || undefined,
      requestedBy: 'Bw. Ramadhani Tembo (Mhasibu)',
    });

    setShowCreateModal(false);
    setDescription('');
    setAmount('');
    setPayee('');
    setReferenceNumber('');
    setDocName('');
    loadData();
  };

  const handleApprove = (expense: SchoolExpense) => {
    const ok = window.confirm(
      `Uidhinishe matumizi ya TZS ${expense.amount.toLocaleString()} ya ${expense.description} kama Mwalimu Mkuu?`
    );
    if (!ok) return;

    approveExpense(expense.id, 'Mwl. Peter Masanja (Mwalimu Mkuu)');
    loadData();
  };

  const handlePay = (expense: SchoolExpense) => {
    const ok = window.confirm(
      `Fanya malipo ya TZS ${expense.amount.toLocaleString()} kwa ${expense.payee}?\n\nHii itapunguza salio kwenye ${
        expense.paymentMethod === 'CASH' ? 'Fedha Taslimu (Cashbook)' : 'Akaunti ya Benki'
      }.`
    );
    if (!ok) return;

    payExpense(expense.id, 'Bw. Ramadhani Tembo (Mhasibu)');
    loadData();
  };

  // Filtered
  const filteredExpenses = expenses.filter((e) => {
    const matchesTab =
      activeTab === 'ALL'
        ? true
        : activeTab === 'PENDING'
        ? e.status === 'PENDING_APPROVAL' || e.status === 'PENDING_REVIEW'
        : activeTab === 'APPROVED'
        ? e.status === 'APPROVED'
        : e.status === 'PAID';

    const matchesSearch =
      e.expenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.payee.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;

    return matchesTab && matchesSearch && matchesCategory;
  });

  const totalSpentPaid = expenses
    .filter((e) => e.status === 'PAID')
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingApprovalAmount = expenses
    .filter((e) => e.status === 'PENDING_APPROVAL')
    .reduce((sum, e) => sum + e.amount, 0);

  const approvedReadyToPayAmount = expenses
    .filter((e) => e.status === 'APPROVED')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-rose-100 text-rose-800 rounded-lg">
                <TrendingDown className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Usimamizi wa Matumizi ya Shule (School Expenses & Approvals)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Rekodi gharama za shule (chakula, umeme, mishahara, vitabu), fanya maombi na kuidhinisha kabla ya kulipa
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ombi Jipya la Matumizi</span>
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Jumla ya Matumizi Yaliyolipwa
            </span>
            <p className="text-2xl font-bold text-rose-700 mt-2">
              TZS {totalSpentPaid.toLocaleString()}
            </p>
            <span className="text-xs text-slate-500 mt-1 block">Yamelipwa na kurekodiwa kwenye vitabu</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Yanasubiri Idhini ya Mwalimu Mkuu
            </span>
            <p className="text-2xl font-bold text-amber-700 mt-2">
              TZS {pendingApprovalAmount.toLocaleString()}
            </p>
            <span className="text-xs text-amber-600 mt-1 block">
              {expenses.filter((e) => e.status === 'PENDING_APPROVAL').length} maombi yanahitaji saini
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Yameidhinishwa (Tayari Kulipwa)
            </span>
            <p className="text-2xl font-bold text-emerald-700 mt-2">
              TZS {approvedReadyToPayAmount.toLocaleString()}
            </p>
            <span className="text-xs text-emerald-600 mt-1 block">
              {expenses.filter((e) => e.status === 'APPROVED').length} maombi yamepewa idhini
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`pb-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'ALL'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Matumizi Yote ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Yanasubiri Idhini ({expenses.filter((e) => e.status === 'PENDING_APPROVAL').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'APPROVED'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Tayari Kulipwa ({expenses.filter((e) => e.status === 'APPROVED').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('PAID')}
            className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'PAID'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Yaliyolipwa ({expenses.filter((e) => e.status === 'PAID').length})</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Tafuta maelezo, mlipwaji, au namba..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Aina ya Matumizi:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">Aina Zote</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Namba #</th>
                  <th className="px-4 py-3">Aina & Maelezo</th>
                  <th className="px-4 py-3">Mlipwaji (Payee)</th>
                  <th className="px-4 py-3 text-right">Kiasi (TZS)</th>
                  <th className="px-4 py-3">Njia</th>
                  <th className="px-4 py-3">Tarehe</th>
                  <th className="px-4 py-3 text-center">Hali</th>
                  <th className="px-4 py-3 text-right">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      Hakuna matumizi yaliyopatikana.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-slate-700">{exp.expenseNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{exp.description}</div>
                        <div className="text-xs text-slate-400">{exp.categoryLabel}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{exp.payee}</td>
                      <td className="px-4 py-3 text-right font-bold text-rose-700">
                        {exp.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {exp.paymentMethod === 'BANK' ? 'Benki' : 'Taslimu (Cash)'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{exp.date}</td>
                      <td className="px-4 py-3 text-center">
                        {exp.status === 'PENDING_APPROVAL' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> Inasubiri Idhini
                          </span>
                        )}
                        {exp.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Check className="w-3 h-3" /> Imeidhinishwa
                          </span>
                        )}
                        {exp.status === 'PAID' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" /> Imelipwa
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {exp.status === 'PENDING_APPROVAL' && (
                            <button
                              onClick={() => handleApprove(exp)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-sm transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Idhinisha (Mkuu)</span>
                            </button>
                          )}
                          {exp.status === 'APPROVED' && (
                            <button
                              onClick={() => handlePay(exp)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Lipa Matumizi</span>
                            </button>
                          )}
                          {exp.status === 'PAID' && (
                            <span className="text-xs text-slate-400 font-mono">Imekamilika</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: CREATE EXPENSE REQUEST */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Wasilisha Ombi Jipya la Matumizi</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateExpense} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kipengele / Aina ya Matumizi *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SchoolExpense['category'])}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Maelezo ya Kina ya Matumizi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Kununua katoni 20 za karatasi za mitihani ya Mock la Nne"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kiasi Kinachoombwa (TZS) *
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
                      Mlipwaji (Supplier / Mfanyakazi) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mfano: Duka Kuu la Vitabu Dar"
                      value={payee}
                      onChange={(e) => setPayee(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Njia ya Kulipa *
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="BANK">Benki (Bank Transfer/Cheque)</option>
                      <option value="CASH">Fedha Taslimu (Petty Cash)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tarehe ya Matumizi
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {paymentMethod === 'BANK' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Akaunti ya Benki ya Shule Itakayotoa Fedha
                    </label>
                    <select
                      value={bankAccountId}
                      onChange={(e) => setBankAccountId(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">-- Chagua Akaunti --</option>
                      {bankAccounts.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.bankName} - {b.accountNumber} ({b.accountName}) &bull; Salio: TZS {b.currentBalance.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jina la Hati ya Malipo / Vocha / Invoice ya Muuzaji (Hiari)
                  </label>
                  <input
                    type="text"
                    placeholder="Mfano: Invoice Na. 2026-Stationery.pdf"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                  Ombi hili litatumwa kwa <strong>Mwalimu Mkuu (Head Teacher)</strong> kwa ajili ya idhini kabla ya fedha kutolewa.
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    Wasilisha Ombi la Idhini
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
