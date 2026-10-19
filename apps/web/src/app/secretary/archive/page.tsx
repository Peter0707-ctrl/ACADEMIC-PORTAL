'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SecretaryShell from '@/components/secretary-shell';
import {
  FolderArchive,
  Search,
  Filter,
  RefreshCw,
  ArchiveRestore,
  ShieldAlert,
  FileText,
  Calendar,
  Layers,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';
import {
  SchoolDocumentRecord,
  getAllDocuments,
  restoreArchivedDocument,
  archiveDocument,
  recordAuditAction,
} from '@/lib/secretary-data';
import { notifyUser } from '@/lib/notifications';

export default function SecretaryArchivePage() {
  const [documents, setDocuments] = useState<SchoolDocumentRecord[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<SchoolDocumentRecord | null>(null);

  useEffect(() => {
    setDocuments(getAllDocuments());
  }, []);

  const archivedDocs = useMemo(() => {
    return documents.filter((d) => d.isArchived);
  }, [documents]);

  const activeDocs = useMemo(() => {
    return documents.filter((d) => !d.isArchived);
  }, [documents]);

  // Unique years found across documents
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    documents.forEach((d) => {
      if (d.academicYear) years.add(d.academicYear);
    });
    return Array.from(years).sort().reverse();
  }, [documents]);

  const filteredArchived = useMemo(() => {
    return archivedDocs.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.documentType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === 'ALL' || d.academicYear === selectedYear;
      const matchesCat = categoryFilter === 'ALL' || d.category === categoryFilter;
      return matchesSearch && matchesYear && matchesCat;
    });
  }, [archivedDocs, searchTerm, selectedYear, categoryFilter]);

  const handleRestore = (doc: SchoolDocumentRecord) => {
    if (confirm(`Je, una uhakika unataka kurudisha jalada "${doc.title}" kwenye masjala hai?`)) {
      const success = restoreArchivedDocument(doc.id);
      if (success) {
        setDocuments(getAllDocuments());
        notifyUser('success', 'Jalada Limerudishwa', `Nyaraka ya ${doc.referenceNumber} imerudishwa kwenye masjala hai.`);
      }
    }
  };

  const handleExportArchiveCSV = () => {
    const headers = [
      'Document ID',
      'Title',
      'Reference Number',
      'Category',
      'Academic Year',
      'Term',
      'Document Date',
      'Archived Date',
      'Archived By',
      'Confidentiality',
      'Storage Location',
    ];

    const rows = filteredArchived.map((d) => [
      `"${d.id}"`,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.referenceNumber}"`,
      `"${d.category}"`,
      `"${d.academicYear}"`,
      `"${d.term}"`,
      `"${d.documentDate}"`,
      `"${d.archivedAt || ''}"`,
      `"${d.archivedBy || ''}"`,
      `"${d.confidentialityLevel}"`,
      `"${d.storageLocation}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kumbukumbu_za_Jalada_Kuu_Archive_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    recordAuditAction({
      action: 'DOCUMENT_DOWNLOAD',
      documentId: 'ARCHIVE-EXPORT',
      documentTitle: 'Orodha ya Hati Zilizopo Kwenye Jalada Kuu (Archive Export)',
      referenceNumber: 'CSV-EXPORT-ARCHIVE',
      details: `Kumbukumbu za hati zilizohifadhiwa zimepakuliwa kama faili la Excel/CSV`,
    });
  };

  return (
    <SecretaryShell
      pageTitle="Jalada Kuu la Kumbukumbu (Digital Archives)"
      pageDescription="Hifadhi ya kudumu ya nyaraka zilizopita kwa miaka ya masomo (Retention & Historical Records)"
    >
      <div className="space-y-6">
        {/* Header Banner - Soft, Clean Light Design */}
        <div className="bg-white text-slate-800 p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold uppercase tracking-wider border border-teal-200">
                Sera ya Uhifadhi wa Nyaraka za Msingi
              </span>
              <span className="text-xs text-slate-500 font-medium">Nyaraka Zilizohifadhiwa: <strong className="text-slate-800">{archivedDocs.length}</strong></span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900">Jalada Kuu la Shule (School Archive)</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kulingana na miongozo ya Wizara na TAMISEMI, nyaraka za wanafunzi, matokeo rasmi ya mitihani, na kumbukumbu
              za usajili huhifadhiwa kwa kudumu (Permanent Retention), huku barua za kawaida zikihifadhiwa kwa miaka 7.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportArchiveCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-100" />
              <span>Pakua Orodha (CSV)</span>
            </button>
          </div>
        </div>

        {/* Filter and Stats Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Jumla ya Hati Jaladani</span>
            <div className="text-2xl font-black text-slate-900">{archivedDocs.length}</div>
            <span className="text-[11px] text-teal-700 font-medium">Hati za miaka iliyopita</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Hati Hai (Active)</span>
            <div className="text-2xl font-black text-emerald-800">{activeDocs.length}</div>
            <span className="text-[11px] text-emerald-700 font-medium">Zinazotumika mwaka 2026</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Miaka ya Masomo</span>
            <div className="text-2xl font-black text-slate-800">{availableYears.length}</div>
            <span className="text-[11px] text-slate-500 font-medium">{availableYears.join(', ')}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Hali ya Uhifadhi</span>
            <div className="text-sm font-bold text-teal-900 flex items-center gap-1.5 mt-1">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>Hati zote zimefungwa salama</span>
            </div>
            <span className="text-[11px] text-slate-500">Hazifutiki kiholela</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-teal-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tafuta kumbukumbu ya zamani au namba ya rejea..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-teal-700" />
              <span>Mwaka wa Masomo:</span>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">Miaka Yote</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  Mwaka wa Masomo {yr}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">Kategoria Zote</option>
              <option value="SCHOOL_ADMINISTRATION">Utawala wa Shule</option>
              <option value="STUDENT_RECORDS">Kumbukumbu za Wanafunzi</option>
              <option value="STAFF_RECORDS">Kumbukumbu za Watumishi</option>
              <option value="ACADEMIC_RECORDS">Nyaraka za Taaluma</option>
              <option value="FINANCIAL_DOCUMENTS">Nyaraka za Fedha</option>
              <option value="MEETINGS_AND_CORRESPONDENCE">Vikao &amp; Barua</option>
            </select>
          </div>
        </div>

        {/* Archived Documents Table */}
        <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-teal-800" />
              <h3 className="font-bold text-sm text-slate-900">Nyaraka Zilizopo Jaladani (Archived Files)</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Inaonyesha {filteredArchived.length} kati ya {archivedDocs.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Namba ya Rejea</th>
                  <th className="py-3 px-4">Jina la Nyaraka</th>
                  <th className="py-3 px-4">Kategoria</th>
                  <th className="py-3 px-4">Mwaka &amp; Muhula</th>
                  <th className="py-3 px-4">Tarehe ya Uhifadhi</th>
                  <th className="py-3 px-4">Hifadhi (Location)</th>
                  <th className="py-3 px-4 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredArchived.map((doc) => (
                  <tr key={doc.id} className="hover:bg-teal-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] font-bold text-teal-900">
                      {doc.referenceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 hover:text-teal-800 cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-slate-500">{doc.documentType} &bull; {doc.fileSize}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {doc.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{doc.academicYear}</span>
                      <span className="text-[11px] text-slate-500 block">{doc.term}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{doc.archivedAt ? doc.archivedAt.slice(0, 10) : doc.uploadDate}</div>
                      <div className="text-[10px] text-slate-400">Na: {doc.archivedBy || doc.uploadedBy}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500 truncate max-w-[160px]" title={doc.storageLocation}>
                      {doc.storageLocation}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-teal-800 hover:bg-teal-50 transition-colors"
                          title="Tazama Maelezo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRestore(doc)}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center gap-1 border border-teal-200 transition-colors"
                          title="Rudisha Nyaraka Kwenye Masjala Hai"
                        >
                          <ArchiveRestore className="w-3.5 h-3.5" />
                          <span>Rudisha</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredArchived.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <FolderArchive className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-slate-700 text-sm">Hakuna nyaraka zilizopatikana kwenye jalada kuu kwa vigezo hivi</p>
                      <p className="text-xs text-slate-500 mt-1">Nyaraka zote za sasa zinaendelea kutumika katika masjala hai.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: View Details */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-teal-200 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                    Nyaraka Iliyohifadhiwa Jaladani (Archived)
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{selectedDoc.title}</h3>
                  <span className="text-xs font-mono text-teal-900">{selectedDoc.referenceNumber}</span>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Kategoria:</span>
                    <span className="font-semibold text-slate-800">{selectedDoc.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Aina ya Hati:</span>
                    <span className="font-semibold text-slate-800">{selectedDoc.documentType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Mwaka wa Masomo:</span>
                    <span className="font-semibold text-slate-800">{selectedDoc.academicYear} &bull; {selectedDoc.term}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Ulinzi (Confidentiality):</span>
                    <span className="font-semibold text-slate-800">{selectedDoc.confidentialityLevel}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 font-bold block mb-1">Maelezo Rasmi ya Nyaraka:</span>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                    {selectedDoc.description || 'Hakuna maelezo ya ziada yaliyojazwa.'}
                  </p>
                </div>

                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 font-mono text-[11px] text-teal-950">
                  <span className="font-sans font-bold block mb-0.5 text-teal-900">Mahali Faili Lilipohifadhiwa (Storage Vault):</span>
                  <span>{selectedDoc.storageLocation}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    handleRestore(selectedDoc);
                    setSelectedDoc(null);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-800 hover:bg-teal-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  <ArchiveRestore className="w-3.5 h-3.5" />
                  <span>Rudisha kwenye Masjala Hai</span>
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Funga
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecretaryShell>
  );
}
