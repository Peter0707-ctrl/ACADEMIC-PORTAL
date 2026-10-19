'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import { getAllReceipts, OfficialReceipt } from '@/lib/accountant-data';
import {
  FileCheck,
  Search,
  Printer,
  X,
  CreditCard,
  Building,
  Smartphone,
  Banknote,
  QrCode,
  Calendar,
} from 'lucide-react';

export default function AccountantReceiptsPage() {
  const [receipts, setReceipts] = useState<OfficialReceipt[]>([]);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState<OfficialReceipt | null>(null);

  useEffect(() => {
    setReceipts(getAllReceipts());
  }, []);

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId.toLowerCase().includes(search.toLowerCase()) ||
      r.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.referenceNumber.toLowerCase().includes(search.toLowerCase());

    const matchesMethod = methodFilter === 'ALL' || r.paymentMethod === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const totalReceiptsAmount = receipts.reduce((sum, r) => sum + r.amountPaid, 0);

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <FileCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Stakabadhi Rasmi za Malipo (Official Receipts)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Kumbukumbu ya stakabadhi zote rasmi zilizotolewa baada ya kuhakiki malipo ya ada ya wanafunzi
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-right">
            <span className="text-xs text-emerald-700 font-semibold block uppercase">
              Jumla ya Stakabadhi
            </span>
            <span className="text-lg font-bold text-emerald-900 font-mono">
              TZS {totalReceiptsAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Tafuta namba ya stakabadhi, mwanafunzi au rejea..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-medium">Njia ya Malipo:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">Njia Zote</option>
              <option value="BANK">Benki (CRDB / NMB)</option>
              <option value="MOBILE_MONEY">Simu (M-Pesa / Tigo)</option>
              <option value="CASH">Fedha Taslimu (Cash)</option>
            </select>
          </div>
        </div>

        {/* Receipts Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">
              Orodha ya Stakabadhi Zilizotolewa ({filteredReceipts.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Stakabadhi #</th>
                  <th className="px-4 py-3">Mwanafunzi</th>
                  <th className="px-4 py-3">Darasa</th>
                  <th className="px-4 py-3">Ankara Husika</th>
                  <th className="px-4 py-3 text-right">Kiasi Kilicholipwa (TZS)</th>
                  <th className="px-4 py-3">Njia & Kumbukumbu</th>
                  <th className="px-4 py-3">Tarehe & Saa</th>
                  <th className="px-4 py-3 text-right">Salio Lililobaki</th>
                  <th className="px-4 py-3 text-right">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400">
                      Hakuna stakabadhi zilizopatikana.
                    </td>
                  </tr>
                ) : (
                  filteredReceipts.map((r) => (
                    <tr key={r.receiptNumber} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                        {r.receiptNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{r.studentName}</div>
                        <div className="text-xs text-slate-400 font-mono">{r.studentId}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{r.standard}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{r.invoiceNumber}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700">
                        {r.amountPaid.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-medium text-slate-700 block">{r.paymentMethod}</span>
                        <span className="font-mono text-slate-400">{r.referenceNumber}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{r.issuedAt || r.paymentDate}</td>
                      <td className="px-4 py-3 text-right font-mono text-xs">
                        <span className={r.remainingBalance === 0 ? 'text-emerald-600 font-bold' : 'text-amber-700'}>
                          TZS {r.remainingBalance.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedReceipt(r)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Tazama / Chapisha</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: PRINTABLE OFFICIAL PRIMARY SCHOOL RECEIPT */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[95vh] overflow-y-auto shadow-2xl relative">
              <div className="no-print flex justify-end gap-2 mb-4">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Chapisha Stakabadhi
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Official Receipt Body */}
              <div className="border-2 border-emerald-800 p-6 rounded-xl space-y-4 bg-emerald-50/10">
                {/* Header */}
                <div className="text-center border-b-2 border-emerald-800 pb-3">
                  <h2 className="text-lg font-black text-slate-900 tracking-wider">
                    {selectedReceipt.schoolDetails.name}
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    Namba ya Usajili: {selectedReceipt.schoolDetails.regNo} &bull; {selectedReceipt.schoolDetails.address}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Simu: {selectedReceipt.schoolDetails.phone} | Barua Pepe: {selectedReceipt.schoolDetails.email}
                  </p>
                  <div className="mt-2 inline-block bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded">
                    STAKABADHI RASMI YA MALIPO YA ADA (OFFICIAL FEE RECEIPT)
                  </div>
                </div>

                {/* Receipt Number & Date */}
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500">Stakabadhi Na: </span>
                    <strong className="text-emerald-800 font-mono text-sm">{selectedReceipt.receiptNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Tarehe ya Kutolewa: </span>
                    <strong className="text-slate-800">{selectedReceipt.issuedAt || selectedReceipt.paymentDate}</strong>
                  </div>
                </div>

                {/* Student Info Box */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mwanafunzi:</span>
                    <strong className="text-slate-900 font-semibold">{selectedReceipt.studentName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Namba ya Udahili (Admission #):</span>
                    <span className="font-mono text-slate-800">{selectedReceipt.studentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Darasa:</span>
                    <span className="text-slate-800">{selectedReceipt.standard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ankara Husika:</span>
                    <span className="font-mono text-slate-800">{selectedReceipt.invoiceNumber}</span>
                  </div>
                </div>

                {/* Payment Amount & Breakdown */}
                <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                  <table className="w-full">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2 text-left">Maelezo</th>
                        <th className="p-2 text-right">Kiasi (TZS)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-2 text-slate-600">Salio Lililokuwepo Kabla ya Malipo (Previous Balance)</td>
                        <td className="p-2 text-right font-mono">TZS {selectedReceipt.previousBalance.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-emerald-50/50 font-bold text-emerald-900">
                        <td className="p-2">Kiasi Kilicholipwa Sasa (Amount Paid)</td>
                        <td className="p-2 text-right font-mono text-sm">
                          TZS {selectedReceipt.amountPaid.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="font-bold text-slate-900 bg-slate-50">
                        <td className="p-2">Salio Lililobaki (Remaining Balance Due)</td>
                        <td className="p-2 text-right font-mono">
                          TZS {selectedReceipt.remainingBalance.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Payment method details */}
                <div className="text-[11px] text-slate-600 space-y-0.5 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div>
                    <strong>Njia ya Malipo:</strong> {selectedReceipt.paymentMethod} &bull;{' '}
                    <strong>Namba ya Rejea (Ref / Slip):</strong> {selectedReceipt.referenceNumber}
                  </div>
                  <div>
                    <strong>Mpokeaji:</strong> {selectedReceipt.receivedBy}
                  </div>
                </div>

                {/* Signatures and Stamp */}
                <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-6 text-[11px] text-center">
                  <div>
                    <div className="border border-dashed border-slate-400 rounded h-14 flex items-center justify-center text-slate-400 text-[10px]">
                      [ MUHURI WA SHULE ]
                    </div>
                    <span className="text-slate-500 mt-1 block">Muhuri Rasmi wa Fedha</span>
                  </div>
                  <div>
                    <div className="border-b border-dashed border-slate-400 pb-8 text-slate-800 font-semibold">
                      Bw. Ramadhani A. Tembo
                    </div>
                    <span className="text-slate-600 mt-1 block">Mhasibu wa Shule</span>
                  </div>
                </div>

                <div className="text-center text-[9px] text-slate-400 pt-1">
                  Stakabadhi hii imetolewa kielektroniki kupitia Mfumo Mkuu wa Kukumbuka Primary & Nursery School.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccountantShell>
  );
}
