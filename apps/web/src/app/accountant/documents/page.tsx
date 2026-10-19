'use client';

import React, { useState } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import {
  FolderArchive,
  UploadCloud,
  Search,
  FileText,
  Download,
  Filter,
  Eye,
  CheckCircle,
  X,
  FileSpreadsheet,
  FileCheck,
  Building,
} from 'lucide-react';

interface FinanceDoc {
  id: string;
  title: string;
  category: 'BANK_STATEMENT' | 'PAYMENT_VOUCHER' | 'RECEIPT_COPY' | 'AUDIT_REPORT' | 'SUPPLIER_INVOICE' | 'FEE_CIRCULAR';
  categoryLabel: string;
  referenceNo: string;
  academicYear: string;
  uploadDate: string;
  fileSize: string;
  uploadedBy: string;
}

const INITIAL_DOCS: FinanceDoc[] = [
  {
    id: 'fdoc-1',
    title: 'Taarifa ya Benki ya CRDB Mwezi Januari 2026',
    category: 'BANK_STATEMENT',
    categoryLabel: 'Taarifa ya Benki (Bank Statement)',
    referenceNo: 'CRDB-STM-JAN-2026',
    academicYear: '2026',
    uploadDate: '2026-02-01',
    fileSize: '1.8 MB PDF',
    uploadedBy: 'Bw. Ramadhani Tembo',
  },
  {
    id: 'fdoc-2',
    title: 'Vocha za Malipo ya Vyakula na Mboga za Shule - Muhula wa I',
    category: 'PAYMENT_VOUCHER',
    categoryLabel: 'Vocha za Malipo (Payment Vouchers)',
    referenceNo: 'PV-BATCH-2026-01',
    academicYear: '2026',
    uploadDate: '2026-02-05',
    fileSize: '3.4 MB PDF',
    uploadedBy: 'Bw. Ramadhani Tembo',
  },
  {
    id: 'fdoc-3',
    title: 'Ripoti ya Ukaguzi wa Ndani wa Fedha za Shule 2025/2026',
    category: 'AUDIT_REPORT',
    categoryLabel: 'Ripoti ya Ukaguzi (Audit Report)',
    referenceNo: 'AUD-KPS-2025-V2',
    academicYear: '2025/2026',
    uploadDate: '2026-01-15',
    fileSize: '4.2 MB PDF',
    uploadedBy: 'Mkaguzi wa Nje / Peter',
  },
  {
    id: 'fdoc-4',
    title: 'Ankara ya Duka Kuu la Vitabu vya Kiada & Karatasi za SFNA',
    category: 'SUPPLIER_INVOICE',
    categoryLabel: 'Ankara ya Muuzaji (Supplier Invoice)',
    referenceNo: 'INV-STATIONERY-8891',
    academicYear: '2026',
    uploadDate: '2026-02-10',
    fileSize: '950 KB PDF',
    uploadedBy: 'Bw. Ramadhani Tembo',
  },
  {
    id: 'fdoc-5',
    title: 'Waraka Rasmi wa Ada na Michango ya Shule 2026 (Circular)',
    category: 'FEE_CIRCULAR',
    categoryLabel: 'Waraka wa Ada (Fee Circular)',
    referenceNo: 'CIRC-FEE-2026/01',
    academicYear: '2026',
    uploadDate: '2026-01-08',
    fileSize: '620 KB PDF',
    uploadedBy: 'Mwl. Peter Masanja',
  },
];

export default function AccountantDocumentsPage() {
  const [docs, setDocs] = useState<FinanceDoc[]>(INITIAL_DOCS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FinanceDoc['category']>('BANK_STATEMENT');
  const [refNo, setRefNo] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const labelMap: Record<FinanceDoc['category'], string> = {
      BANK_STATEMENT: 'Taarifa ya Benki (Bank Statement)',
      PAYMENT_VOUCHER: 'Vocha za Malipo (Payment Vouchers)',
      RECEIPT_COPY: 'Nakala ya Stakabadhi',
      AUDIT_REPORT: 'Ripoti ya Ukaguzi',
      SUPPLIER_INVOICE: 'Ankara ya Muuzaji',
      FEE_CIRCULAR: 'Waraka wa Ada',
    };

    const newDoc: FinanceDoc = {
      id: `fdoc-${Date.now()}`,
      title,
      category,
      categoryLabel: labelMap[category],
      referenceNo: refNo.trim() || `DOC-${Date.now().toString().slice(-4)}`,
      academicYear: '2026',
      uploadDate: new Date().toISOString().slice(0, 10),
      fileSize: '1.2 MB PDF',
      uploadedBy: 'Bw. Ramadhani Tembo (Mhasibu)',
    };

    setDocs([newDoc, ...docs]);
    setShowUploadModal(false);
    setTitle('');
    setRefNo('');
  };

  const filtered = docs.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.referenceNo.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || d.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <FolderArchive className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-slate-800">
                Hifadhi ya Hati za Kifedha (Financial Documents & Records)
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Hifadhi salama ya taarifa za benki, vocha za malipo (PV), ankara za wauzaji, na ripoti za ukaguzi wa fedha
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Pakia Nyaraka Mpya</span>
          </button>
        </div>

        {/* Filter and Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Tafuta jina la nyaraka au namba ya rejea..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Aina ya Hati:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">Nyaraka Zote</option>
              <option value="BANK_STATEMENT">Taarifa za Benki (Bank Statements)</option>
              <option value="PAYMENT_VOUCHER">Vocha za Malipo (PVs)</option>
              <option value="AUDIT_REPORT">Ripoti za Ukaguzi</option>
              <option value="SUPPLIER_INVOICE">Ankara za Wauzaji</option>
              <option value="FEE_CIRCULAR">Nyaraka za Ada</option>
            </select>
          </div>
        </div>

        {/* Documents Grid / Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Nyaraka Zilizohifadhiwa ({filtered.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Jina la Nyaraka</th>
                  <th className="px-4 py-3">Aina ya Hati</th>
                  <th className="px-4 py-3">Namba ya Rejea</th>
                  <th className="px-4 py-3">Mwaka</th>
                  <th className="px-4 py-3">Tarehe ya Kupakia</th>
                  <th className="px-4 py-3">Ukubwa wa Faili</th>
                  <th className="px-4 py-3 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                          <FileText className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900">{doc.title}</div>
                          <div className="text-[11px] text-slate-400">Imepakiwa na: {doc.uploadedBy}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                        {doc.categoryLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{doc.referenceNo}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{doc.academicYear}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{doc.uploadDate}</td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">{doc.fileSize}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => alert(`Inapakua: ${doc.title}`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-semibold transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Pakua</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: UPLOAD FINANCIAL DOCUMENT */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Pakia Nyaraka ya Kifedha</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jina la Nyaraka *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Taarifa ya Benki ya NMB Mwezi Februari 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aina ya Hati *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FinanceDoc['category'])}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="BANK_STATEMENT">Taarifa ya Benki (Bank Statement)</option>
                    <option value="PAYMENT_VOUCHER">Vocha ya Malipo (Payment Voucher - PV)</option>
                    <option value="AUDIT_REPORT">Ripoti ya Ukaguzi wa Ndani / Nje</option>
                    <option value="SUPPLIER_INVOICE">Ankara ya Muuzaji / Supplier</option>
                    <option value="FEE_CIRCULAR">Waraka wa Ada wa Shule</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Namba ya Rejea (Reference Number)
                  </label>
                  <input
                    type="text"
                    placeholder="Mfano: NMB-STM-FEB-2026"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500 hover:border-emerald-500 transition cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="font-semibold text-slate-700 block">Buruta au bofya kuchagua faili</span>
                  <span>Inasaidia PDF, Excel au Picha za Hati (Hadi MB 15)</span>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    Hifadhi Nyaraka
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
