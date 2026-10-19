'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SecretaryShell from '@/components/secretary-shell';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Clock,
  User,
  Shield,
  FileText,
  Eye,
  CheckCircle2,
  AlertCircle,
  Laptop,
} from 'lucide-react';
import {
  DocumentAuditEntry,
  getAllAuditLogs,
  recordAuditAction,
} from '@/lib/secretary-data';
import { notifyUser } from '@/lib/notifications';

export default function SecretaryAuditPage() {
  const [logs, setLogs] = useState<DocumentAuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [selectedEntry, setSelectedEntry] = useState<DocumentAuditEntry | null>(null);

  useEffect(() => {
    setLogs(getAllAuditLogs());
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [logs, searchTerm, actionFilter]);

  const handleExportAuditCSV = () => {
    const headers = [
      'Log ID',
      'Timestamp',
      'User',
      'User Role',
      'Action',
      'Document ID',
      'Document Title',
      'Reference Number',
      'Details',
      'IP Address',
    ];

    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.documentId}"`,
      `"${l.documentTitle.replace(/"/g, '""')}"`,
      `"${l.referenceNumber}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Trail_Nyaraka_Shule_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser('success', 'Kumbukumbu Zimepakuliwa', 'Faili la ukaguzi wa mfumo (Audit Trail CSV) limehifadhiwa.');
  };

  const getActionBadge = (action: DocumentAuditEntry['action']) => {
    switch (action) {
      case 'DOCUMENT_UPLOAD':
        return { label: 'Upakiaji wa Hati', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'DOCUMENT_VIEW':
        return { label: 'Kutazama Hati', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'DOCUMENT_DOWNLOAD':
        return { label: 'Kupakua Hati', bg: 'bg-cyan-50 text-cyan-800 border-cyan-200' };
      case 'METADATA_EDIT':
        return { label: 'Marekebisho ya Data', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'VERSION_CREATION':
        return { label: 'Toleo Jipya (Version)', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'DOCUMENT_ARCHIVE':
        return { label: 'Kuhifadhi Jaladani', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
      case 'DOCUMENT_RESTORE':
        return { label: 'Kurejesha Hati', bg: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'DELETE_REQUEST':
        return { label: 'Ombi la Kufuta', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: action, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <SecretaryShell
      pageTitle="Daftari la Ukaguzi wa Mfumo (Audit Trail)"
      pageDescription="Rekodi isiyobadilika ya matukio yote ya kufungua, kupakia, kupakua na kuhifadhi nyaraka za shule"
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-white p-5 rounded-2xl border border-teal-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
              <ShieldCheck className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-900">
                  Ulinzi &amp; Uwajibikaji (Tamper-evident)
                </span>
                <span className="text-xs text-slate-500 font-medium">Jumla ya Matukio: {logs.length}</span>
              </div>
              <h2 className="text-base font-black text-slate-900 mt-1">
                Kumbukumbu Zote za Ufikiaji na Mabadiliko ya Hati
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Kila tendo linalofanywa na Katibu, Mwalimu Mkuu au Afisa linarekodiwa kiotomatiki kwa mujibu wa viwango vya usalama.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportAuditCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-900/10 transition-colors shrink-0"
          >
            <Download className="w-4 h-4 text-teal-200" />
            <span>Pakua Kumbukumbu (CSV)</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-teal-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tafuta mtumiaji, hati, namba ya rejea..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5 text-teal-700" />
              <span>Chuja kwa Tendo:</span>
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">Matendo Yote</option>
              <option value="DOCUMENT_UPLOAD">Upakiaji wa Hati (Upload)</option>
              <option value="DOCUMENT_VIEW">Kutazama Hati (View)</option>
              <option value="DOCUMENT_DOWNLOAD">Kupakua Hati (Download)</option>
              <option value="METADATA_EDIT">Mabadiliko ya Data (Edit)</option>
              <option value="VERSION_CREATION">Toleo Jipya (Version)</option>
              <option value="DOCUMENT_ARCHIVE">Kuhifadhi Jaladani (Archive)</option>
              <option value="DOCUMENT_RESTORE">Kurejesha Hati (Restore)</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Wakati (Timestamp)</th>
                  <th className="py-3 px-4">Mtumiaji &amp; Wadhifa</th>
                  <th className="py-3 px-4">Tendo Lililofanywa</th>
                  <th className="py-3 px-4">Hati / Namba ya Rejea</th>
                  <th className="py-3 px-4">Maelezo ya Tukio</th>
                  <th className="py-3 px-4">Anwani (IP / Kituo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredLogs.map((entry) => {
                  const badge = getActionBadge(entry.action);
                  return (
                    <tr
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="hover:bg-teal-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{entry.timestamp}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{entry.user}</div>
                        <div className="text-[10px] text-teal-800">{entry.userRole}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 truncate max-w-xs">{entry.documentTitle}</div>
                        <span className="font-mono text-[10px] text-teal-900">{entry.referenceNumber}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs truncate" title={entry.details}>
                        {entry.details}
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Laptop className="w-3 h-3 text-slate-400" />
                          <span>{entry.ipAddress}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <History className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-slate-700 text-sm">Hakuna rekodi za ukaguzi zilizopatikana</p>
                      <p className="text-xs text-slate-500 mt-1">Jaribu kubadilisha neno la utafutaji au kichungi cha tendo.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: View Full Audit Entry */}
        {selectedEntry && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-teal-200 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                    Taarifa ya Ukaguzi wa Mfumo
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">Kumbukumbu Na: {selectedEntry.id}</h3>
                  <span className="text-xs text-slate-500">{selectedEntry.timestamp}</span>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Mtumiaji:</span>
                    <span className="font-bold text-slate-900">{selectedEntry.user}</span>
                    <span className="text-[10px] text-teal-800 block">{selectedEntry.userRole}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">Tendo:</span>
                    <span className="font-bold text-slate-900">{selectedEntry.action}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Hati Iliyoathirika:</span>
                  <div className="font-bold text-slate-900">{selectedEntry.documentTitle}</div>
                  <div className="font-mono text-teal-800 text-[11px]">{selectedEntry.referenceNumber}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Maelezo Kamili ya Tukio:</span>
                  <p className="text-slate-700 leading-relaxed">{selectedEntry.details}</p>
                </div>

                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 font-mono text-[11px] text-teal-950">
                  <span className="font-sans font-bold block mb-0.5 text-teal-900">Kituo cha Kazi &amp; Anwani ya Mtandao:</span>
                  <span>{selectedEntry.ipAddress}</span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-200">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-800 hover:bg-teal-700 text-white"
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
