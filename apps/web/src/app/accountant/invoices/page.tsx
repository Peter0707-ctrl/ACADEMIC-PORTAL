'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  getAllInvoices,
  createNewInvoice,
  cancelInvoice,
  getAllFeeStructures,
  getStudentFinancialAccounts,
  StudentInvoice,
  FeeStructure,
  StudentFinancialAccount,
} from '@/lib/accountant-data';
import {
  FileText,
  Plus,
  Search,
  Printer,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function AccountantInvoicesPage() {
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [accounts, setAccounts] = useState<StudentFinancialAccount[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [standardFilter, setStandardFilter] = useState('ALL');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<StudentInvoice | null>(null);

  // Form states for creating invoice
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('Term I');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [dueDate, setDueDate] = useState('2026-02-28');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [customItems, setCustomItems] = useState<{ id: string; name: string; amount: number; selected: boolean }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const invs = getAllInvoices();
    setInvoices(invs);
    const accs = getStudentFinancialAccounts();
    setAccounts(accs);
    const fss = getAllFeeStructures();
    setFeeStructures(fss);
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const acc = accounts.find((a) => a.studentId === studentId);
    if (!acc) return;

    // Find matching fee structure for this student's standard
    const matchedFs = feeStructures.find(
      (fs) => fs.standard.toLowerCase().includes(acc.standard.toLowerCase()) || acc.standard.toLowerCase().includes(fs.standard.toLowerCase())
    );

    if (matchedFs) {
      setCustomItems(
        matchedFs.items.map((item) => ({
          id: item.id,
          name: item.name,
          amount: item.amount,
          selected: true,
        }))
      );
    } else {
      // Default fallback items
      setCustomItems([
        { id: '1', name: 'Ada ya Mafunzo (Tuition Fee)', amount: 600000, selected: true },
        { id: '2', name: 'Vitabu na Vifaa vya Kujifunzia', amount: 50000, selected: true },
        { id: '3', name: 'Chakula cha Mchana (Lunch)', amount: 100000, selected: true },
      ]);
    }
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = accounts.find((a) => a.studentId === selectedStudentId);
    if (!acc) {
      alert('Tafadhali chagua mwanafunzi kwanza');
      return;
    }

    const selectedItems = customItems.filter((i) => i.selected);
    if (selectedItems.length === 0) {
      alert('Tafadhali chagua angalau kipengele kimoja cha ada');
      return;
    }

    createNewInvoice({
      studentId: acc.studentId,
      studentName: acc.fullName,
      standard: acc.standard,
      stream: acc.stream,
      academicYear: selectedYear,
      term: selectedTerm,
      items: selectedItems.map((i) => ({ id: i.id, name: i.name, amount: i.amount })),
      discount: Number(discountAmount) || 0,
      dueDate,
      createdBy: 'Bw. Ramadhani Tembo (Mhasibu)',
    });

    setShowCreateModal(false);
    setSelectedStudentId('');
    setDiscountAmount(0);
    loadData();
  };

  const handleCancelInvoice = (invoice: StudentInvoice) => {
    if (invoice.amountPaid > 0) {
      alert('Haiwezekani kufuta ankara iliyo na malipo yaliyothibitishwa tayari.');
      return;
    }
    const reason = prompt(`Weka sababu ya kufuta ankara ${invoice.invoiceNumber}:`);
    if (reason && reason.trim()) {
      cancelInvoice(invoice.id, reason.trim(), 'Bw. Ramadhani Tembo');
      loadData();
    }
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.studentName.toLowerCase().includes(search.toLowerCase()) ||
      inv.studentId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    const matchesStandard = standardFilter === 'ALL' || inv.standard === standardFilter;

    return matchesSearch && matchesStatus && matchesStandard;
  });

  // Calculate metrics
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, i) => sum + i.amountPaid, 0);
  const totalBalance = invoices.reduce((sum, i) => sum + i.balance, 0);
  const overdueCount = invoices.filter((i) => i.status === 'OVERDUE').length;

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <FileText className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Usimamizi wa Ankara za Wanafunzi (Student Invoices)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Tengeneza, fuatilia na kuchapisha ankara rasmi za ada kwa kila mwanafunzi kulingana na darasa na muhula
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tengeneza Ankara Mpya</span>
          </button>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Jumla ya Ankara Zote
            </span>
            <p className="text-2xl font-bold text-slate-800 mt-2">
              TZS {totalInvoiced.toLocaleString()}
            </p>
            <span className="text-xs text-slate-500 mt-1 block">{invoices.length} ankara zimetolewa</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Kiasi Kilicholipwa
            </span>
            <p className="text-2xl font-bold text-emerald-700 mt-2">
              TZS {totalPaid.toLocaleString()}
            </p>
            <span className="text-xs text-emerald-600 mt-1 block">
              {totalInvoiced > 0 ? ((totalPaid / totalInvoiced) * 100).toFixed(1) : 0}% ya ankara
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              Deni Lililobaki (Outstanding)
            </span>
            <p className="text-2xl font-bold text-amber-700 mt-2">
              TZS {totalBalance.toLocaleString()}
            </p>
            <span className="text-xs text-amber-600 mt-1 block">Inasubiri kulipwa na wazazi</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Zilizochelewa (Overdue)
            </span>
            <p className="text-2xl font-bold text-rose-700 mt-2">{overdueCount}</p>
            <span className="text-xs text-rose-600 mt-1 block">Zimepitisha tarehe ya mwisho</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Tafuta jina la mwanafunzi, namba ya udahili, au namba ya ankara..."
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
                <option value="ALL">Hali Zote</option>
                <option value="ISSUED">Zilizotolewa (Issued)</option>
                <option value="PARTIALLY_PAID">Zimelipwa Sehemu</option>
                <option value="PAID">Zimelipwa Kamili</option>
                <option value="OVERDUE">Zilizochelewa</option>
                <option value="CANCELLED">Zilizofutwa</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Orodha ya Ankara ({filteredInvoices.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Ankara #</th>
                  <th className="px-4 py-3">Mwanafunzi</th>
                  <th className="px-4 py-3">Darasa</th>
                  <th className="px-4 py-3">Muhula</th>
                  <th className="px-4 py-3 text-right">Jumla (TZS)</th>
                  <th className="px-4 py-3 text-right">Imelipwa (TZS)</th>
                  <th className="px-4 py-3 text-right">Baki (TZS)</th>
                  <th className="px-4 py-3">Mwisho wa Kulipa</th>
                  <th className="px-4 py-3 text-center">Hali</th>
                  <th className="px-4 py-3 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-slate-400">
                      Hakuna ankara zilizopatikana kulingana na vigezo ulivyoweka.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-emerald-700">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{inv.studentName}</div>
                        <div className="text-xs text-slate-400 font-mono">{inv.studentId}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{inv.standard}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {inv.academicYear} &bull; {inv.term}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800">
                        {inv.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-emerald-700">
                        {inv.amountPaid.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-amber-700">
                        {inv.balance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{inv.dueDate}</td>
                      <td className="px-4 py-3 text-center">
                        {inv.status === 'PAID' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" /> Imelipwa
                          </span>
                        )}
                        {inv.status === 'PARTIALLY_PAID' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3" /> Sehemu
                          </span>
                        )}
                        {inv.status === 'ISSUED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> Imetolewa
                          </span>
                        )}
                        {inv.status === 'OVERDUE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3 h-3" /> Imechelewa
                          </span>
                        )}
                        {inv.status === 'CANCELLED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            <Ban className="w-3 h-3" /> Imefutwa
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoiceForPrint(inv)}
                            title="Tazama na Chapisha Ankara"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          {inv.status !== 'CANCELLED' && inv.amountPaid === 0 && (
                            <button
                              onClick={() => handleCancelInvoice(inv)}
                              title="Futa / Sitisha Ankara"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
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

        {/* MODAL: CREATE INVOICE */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Tengeneza Ankara Mpya ya Mwanafunzi</h3>
                  <p className="text-xs text-slate-500">Chagua mwanafunzi na vipengele vya ada vitakavyoingizwa</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chagua Mwanafunzi (Admission # au Jina) *
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    required
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">-- Chagua Mwanafunzi --</option>
                    {accounts.map((acc) => (
                      <option key={acc.studentId} value={acc.studentId}>
                        {acc.fullName} ({acc.studentId}) &bull; {acc.standard}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mwaka wa Masomo</label>
                    <input
                      type="text"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      required
                      className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Muhula (Term)</label>
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Term I">Muhula wa Kwanza (Term I)</option>
                      <option value="Term II">Muhula wa Pili (Term II)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mwisho wa Kulipa</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                      className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Items selection */}
                {customItems.length > 0 && (
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Vipengele vya Ada (Chagua vile vinavyomhusu)
                    </label>
                    <div className="space-y-2">
                      {customItems.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-sm"
                        >
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={(e) => {
                                const next = [...customItems];
                                next[idx].selected = e.target.checked;
                                setCustomItems(next);
                              }}
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-slate-800 font-medium">{item.name}</span>
                          </label>
                          <span className="font-mono text-slate-700">TZS {item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Punguzo la Ada / Msamaha (Discount in TZS kama upo)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Summary calculation */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex justify-between items-center text-sm font-semibold">
                  <span>Jumla Kuu ya Ankara:</span>
                  <span className="text-base text-emerald-800 font-bold font-mono">
                    TZS{' '}
                    {Math.max(
                      0,
                      customItems.filter((i) => i.selected).reduce((s, i) => s + i.amount, 0) - (Number(discountAmount) || 0)
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Hifadhi na Toa Ankara
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: PRINTABLE OFFICIAL INVOICE */}
        {selectedInvoiceForPrint && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[95vh] overflow-y-auto shadow-2xl relative">
              <div className="no-print flex justify-end gap-2 mb-4">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
                >
                  <Printer className="w-4 h-4" /> Chapisha Ankara
                </button>
                <button
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Invoice Slip Content */}
              <div className="border border-slate-300 p-6 rounded-xl space-y-6">
                {/* Header */}
                <div className="text-center border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-slate-900 tracking-wider">
                    PRIMARY &amp; NURSERY SCHOOL
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">Usajili Na: EM.1428/TZ &bull; Dar es Salaam, Tanzania</p>
                  <p className="text-xs text-slate-500">Simu: 0779304500 | Barua Pepe: pj0040280@gmail.com</p>
                  <div className="mt-3 inline-block bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                    ANKARA YA ADA YA MWANAFUNZI (FEE INVOICE)
                  </div>
                </div>

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Jina la Mwanafunzi:</span>
                    <strong className="text-slate-800 text-sm">{selectedInvoiceForPrint.studentName}</strong>
                    <span className="text-slate-500 block font-mono">Udahili: {selectedInvoiceForPrint.studentId}</span>
                    <span className="text-slate-600 block">{selectedInvoiceForPrint.standard} ({selectedInvoiceForPrint.stream})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Namba ya Ankara:</span>
                    <strong className="text-emerald-700 font-mono text-sm">{selectedInvoiceForPrint.invoiceNumber}</strong>
                    <span className="text-slate-500 block">Tarehe: {selectedInvoiceForPrint.createdAt}</span>
                    <span className="text-rose-600 font-semibold block">Mwisho wa Kulipa: {selectedInvoiceForPrint.dueDate}</span>
                  </div>
                </div>

                {/* Items table */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold uppercase">
                      <tr>
                        <th className="p-2.5">Kipengele cha Ada</th>
                        <th className="p-2.5 text-right">Kiasi (TZS)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedInvoiceForPrint.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 text-slate-700">{item.name}</td>
                          <td className="p-2.5 text-right font-mono text-slate-800">{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200 font-medium">
                      <tr>
                        <td className="p-2 text-slate-600">Jumla Ndogo (Subtotal):</td>
                        <td className="p-2 text-right font-mono">TZS {selectedInvoiceForPrint.subtotal.toLocaleString()}</td>
                      </tr>
                      {selectedInvoiceForPrint.discount > 0 && (
                        <tr>
                          <td className="p-2 text-emerald-700">Punguzo (Discount / Waiver):</td>
                          <td className="p-2 text-right font-mono text-emerald-700">- TZS {selectedInvoiceForPrint.discount.toLocaleString()}</td>
                        </tr>
                      )}
                      <tr className="text-sm font-bold text-slate-900 border-t border-slate-300">
                        <td className="p-2">Jumla Kuu (Total Amount Due):</td>
                        <td className="p-2 text-right font-mono">TZS {selectedInvoiceForPrint.totalAmount.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-emerald-700">Kiasi Kilicholipwa:</td>
                        <td className="p-2 text-right font-mono text-emerald-700">TZS {selectedInvoiceForPrint.amountPaid.toLocaleString()}</td>
                      </tr>
                      <tr className="text-sm font-bold text-rose-700 bg-rose-50/50">
                        <td className="p-2">Baki Inayodaiwa (Balance Due):</td>
                        <td className="p-2 text-right font-mono">TZS {selectedInvoiceForPrint.balance.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Instructions */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
                  <strong>Maelekezo ya Malipo Shuleni:</strong>
                  <p>1. Lipa kupitia Benki ya CRDB: Akaunti Na. 0150244589200 (KUKUMBUKA PRIMARY SCHOOL) au NMB: 20110023489.</p>
                  <p>2. Malipo ya Simu: M-Pesa Lipa Namba 5892110 (KUKUMBUKA PRIMARY).</p>
                  <p>3. Tafadhali wasilisha stakabadhi au namba ya kumbukumbu kwa Ofisi ya Mhasibu ili kupata Stakabadhi Rasmi.</p>
                </div>

                {/* Signatures */}
                <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-center">
                  <div>
                    <div className="border-b border-dashed border-slate-400 pb-8 text-slate-400">Muhuri wa Shule</div>
                    <span className="text-slate-600 mt-1 block">Ofisi Kuu ya Fedha</span>
                  </div>
                  <div>
                    <div className="border-b border-dashed border-slate-400 pb-8 text-slate-800 font-semibold">
                      Bw. Ramadhani A. Tembo
                    </div>
                    <span className="text-slate-600 mt-1 block">Mhasibu wa Shule</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccountantShell>
  );
}
