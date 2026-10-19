'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SecretaryShell from '@/components/secretary-shell';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Filter,
  FileText,
  Users,
  UserCheck,
  Mail,
  FolderArchive,
  CheckCircle2,
  Award,
  Building2,
  Sparkles,
  Eye,
} from 'lucide-react';
import {
  getAllDocuments,
  getChecklists,
  getAllCorrespondence,
  getAllMeetings,
  SchoolDocumentRecord,
  recordAuditAction,
} from '@/lib/secretary-data';
import { notifyUser } from '@/lib/notifications';

type ReportType =
  | 'MASTER_REGISTRY'
  | 'STUDENT_FILES'
  | 'STAFF_FILES'
  | 'CORRESPONDENCE_LOG'
  | 'MEETINGS_SUMMARY'
  | 'ARCHIVE_INVENTORY';

export default function SecretaryReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('MASTER_REGISTRY');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedTerm, setSelectedTerm] = useState<string>('ALL');

  const [documents, setDocuments] = useState<SchoolDocumentRecord[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [correspondence, setCorrespondence] = useState<any[]>([]);

  useEffect(() => {
    setDocuments(getAllDocuments());
    setMeetings(getAllMeetings());
    setCorrespondence(getAllCorrespondence());
  }, []);

  const reportDetails = useMemo(() => {
    switch (reportType) {
      case 'MASTER_REGISTRY':
        return {
          title: 'Ripoti Kuu ya Masjala ya Nyaraka za Shule (Master Document Registry)',
          desc: 'Orodha kamili ya nyaraka zote za kiutawala, kitaaluma, na kisheria zilizohifadhiwa masjalani.',
          icon: FileText,
        };
      case 'STUDENT_FILES':
        return {
          title: 'Ripoti ya Ukamilifu wa Mafaili ya Wanafunzi (Student File Completeness Report)',
          desc: 'Hali ya uwasilishaji wa vyeti vya kuzaliwa vya RITA, fomu za udahili na taarifa za wazazi.',
          icon: Users,
        };
      case 'STAFF_FILES':
        return {
          title: 'Ripoti ya Nyaraka za Watumishi & Walimu (Staff Records Compliance Report)',
          desc: 'Kumbukumbu za barua za ajira, namba za usajili wa TSC, na vyeti vya kitaaluma vya ualimu.',
          icon: UserCheck,
        };
      case 'CORRESPONDENCE_LOG':
        return {
          title: 'Daftari Rasmi la Barua Zilizoingia na Zilizotoka (Official Correspondence Register)',
          desc: 'Kumbukumbu za mawasiliano rasmi na Wizara, TAMISEMI, Manispaa, na wazazi.',
          icon: Mail,
        };
      case 'MEETINGS_SUMMARY':
        return {
          title: 'Ripoti ya Vikao, Minyute & Maazimio ya Mwaka (Annual Meetings & Minutes Report)',
          desc: 'Kumbukumbu ya vikao vya walimu, PTA ya wazazi, na kamati ya usimamizi wa shule.',
          icon: Calendar,
        };
      case 'ARCHIVE_INVENTORY':
        return {
          title: 'Orodha ya Hati Zilizopo Kwenye Jalada Kuu (Archive Inventory Report)',
          desc: 'Nyaraka za miaka iliyopita zilizowekwa kwenye uhifadhi wa kudumu (Permanent Archives).',
          icon: FolderArchive,
        };
    }
  }, [reportType]);

  const handlePrint = () => {
    recordAuditAction({
      action: 'DOCUMENT_VIEW',
      documentId: `REP-${reportType}`,
      documentTitle: reportDetails.title,
      referenceNumber: `REP-${new Date().getFullYear()}-${reportType}`,
      details: `Ripoti ya masjala imechapishwa (Print/PDF)`,
    });
    window.print();
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === 'MASTER_REGISTRY') {
      headers = ['Doc ID', 'Title', 'Category', 'Ref No', 'Year', 'Term', 'Confidentiality', 'Status'];
      rows = documents.map((d) => [
        `"${d.id}"`,
        `"${d.title.replace(/"/g, '""')}"`,
        `"${d.category}"`,
        `"${d.referenceNumber}"`,
        `"${d.academicYear}"`,
        `"${d.term}"`,
        `"${d.confidentialityLevel}"`,
        `"${d.status}"`,
      ]);
    } else if (reportType === 'CORRESPONDENCE_LOG') {
      headers = ['Ref No', 'Type', 'Sender/Recipient', 'Subject', 'Date', 'Status'];
      rows = correspondence.map((c) => [
        `"${c.referenceNumber}"`,
        `"${c.type}"`,
        `"${c.senderOrRecipient}"`,
        `"${c.subject}"`,
        `"${c.dateReceivedOrSent}"`,
        `"${c.status}"`,
      ]);
    } else {
      headers = ['ID', 'Title', 'Date', 'Category'];
      rows = documents.slice(0, 15).map((d) => [`"${d.id}"`, `"${d.title}"`, `"${d.documentDate}"`, `"${d.category}"`]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ripoti_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser('success', 'Ripoti Imepakuliwa', 'Faili la Excel/CSV limepakuliwa kikamilifu.');
  };

  return (
    <SecretaryShell
      pageTitle="Utoaji wa Ripoti za Masjala (Reports & Analytics)"
      pageDescription="Tengeneza ripoti rasmi za ukaguzi, daftari za barua, ukamilifu wa mafaili ya wanafunzi na watumishi"
    >
      <div className="space-y-6">
        {/* Selector Panel */}
        <div className="bg-white p-5 rounded-2xl border border-teal-200/80 shadow-xs space-y-4 print:hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">Chagua Aina ya Ripoti Unayotaka Kutoa</h2>
              <p className="text-xs text-slate-500">Ripoti zote zimeandaliwa rasmi kwa ajili ya Ukaguzi wa Shule au Bodi ya Shule</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-900/10 transition-colors"
              >
                <Printer className="w-4 h-4 text-teal-200" />
                <span>Chapisha Ripoti (Print / PDF)</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                <Download className="w-4 h-4 text-teal-700" />
                <span>Excel / CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
            {[
              { type: 'MASTER_REGISTRY', label: '1. Masjala Kuu', icon: FileText },
              { type: 'STUDENT_FILES', label: '2. Wanafunzi', icon: Users },
              { type: 'STAFF_FILES', label: '3. Watumishi', icon: UserCheck },
              { type: 'CORRESPONDENCE_LOG', label: '4. Barua & Mawasiliano', icon: Mail },
              { type: 'MEETINGS_SUMMARY', label: '5. Vikao & Minyute', icon: Calendar },
              { type: 'ARCHIVE_INVENTORY', label: '6. Jalada Kuu (Archive)', icon: FolderArchive },
            ].map((btn) => {
              const Icon = btn.icon;
              const isActive = reportType === btn.type;
              return (
                <button
                  key={btn.type}
                  onClick={() => setReportType(btn.type as ReportType)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    isActive
                      ? 'bg-teal-800 text-white border-teal-800 shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-teal-50/50 border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-200' : 'text-teal-700'}`} />
                  <span className="text-[11px] font-bold leading-tight block">{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* REPORT CANVAS (DESIGNED BOTH FOR DISPLAY AND HIGH QUALITY PRINT) */}
        {/* ================================================================= */}
        <div className="bg-white rounded-2xl border border-teal-200/80 shadow-xs p-8 max-w-5xl mx-auto space-y-6 print:p-0 print:border-none print:shadow-none">
          {/* Official Primary School Header */}
          <div className="text-center pb-6 border-b-2 border-slate-800 space-y-1">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Building2 className="w-6 h-6 text-teal-800" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                JAMHURI YA MUUNGANO WA TANZANIA
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-wide uppercase">
              KUKUMBUKA PRIMARY &amp; NURSERY SCHOOL
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Usajili Na: EM.1428/TZ &bull; S.L.P. 1428, DAR ES SALAAM, TANZANIA &bull; Simu: +255 714 556 778
            </p>
            <div className="inline-block mt-2 px-3 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-200">
              OFISI YA KATIBU WA SHULE &bull; MASJALA KUU YA HATI (RECORDS REGISTRY)
            </div>
          </div>

          {/* Report Metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-900">{reportDetails.title}</span>
              <p className="text-[11px] text-slate-500">{reportDetails.desc}</p>
            </div>
            <div className="text-right text-[11px] text-slate-600 font-medium shrink-0">
              <div>Mwaka wa Masomo: <span className="font-bold text-slate-900">{selectedYear}</span></div>
              <div>Tarehe ya Kutolewa: <span className="font-bold text-slate-900">{new Date().toLocaleDateString('sw-TZ')}</span></div>
            </div>
          </div>

          {/* Report Dynamic Content Based on Selection */}
          {reportType === 'MASTER_REGISTRY' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Namba ya Rejea</th>
                    <th className="p-2.5">Jina la Nyaraka</th>
                    <th className="p-2.5">Kategoria</th>
                    <th className="p-2.5">Mwaka &bull; Muhula</th>
                    <th className="p-2.5">Ulinzi</th>
                    <th className="p-2.5">Hali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {documents.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-teal-900">{d.referenceNumber}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{d.title}</td>
                      <td className="p-2.5 text-slate-600">{d.category.replace(/_/g, ' ')}</td>
                      <td className="p-2.5">{d.academicYear} ({d.term})</td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {d.confidentialityLevel}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-emerald-800">
                        {d.isArchived ? 'Jaladani' : d.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'STUDENT_FILES' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">Jumla ya Wanafunzi</span>
                  <span className="text-xl font-black text-emerald-950">486</span>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                  <span className="text-[10px] font-bold uppercase text-teal-800 block">Mafaili Yaliyokamilika</span>
                  <span className="text-xl font-black text-teal-950">472 (97%)</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold uppercase text-amber-800 block">Mafaili Yenye Upungufu</span>
                  <span className="text-xl font-black text-amber-950">14 (3%)</span>
                </div>
              </div>

              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Admission No</th>
                    <th className="p-2.5">Jina la Mwanafunzi</th>
                    <th className="p-2.5">Darasa</th>
                    <th className="p-2.5">Fomu ya Udahili</th>
                    <th className="p-2.5">Cheti cha RITA</th>
                    <th className="p-2.5">NIDA ya Mzazi</th>
                    <th className="p-2.5">% Ukamilifu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { id: 'PS-2026-00124', name: 'John Peter Mwangi', cls: 'Standard 4A', adm: true, rita: true, nida: true, pct: 100 },
                    { id: 'PS-2026-00125', name: 'Baraka Joseph Mollel', cls: 'Standard 4A', adm: true, rita: true, nida: true, pct: 100 },
                    { id: 'PS-2026-00128', name: 'Neema Daniel Lyimo', cls: 'Standard 5B', adm: true, rita: false, nida: true, pct: 83 },
                    { id: 'PS-2026-00130', name: 'Kelvin Richard Shirima', cls: 'Standard 7A', adm: true, rita: true, nida: true, pct: 100 },
                    { id: 'PS-2026-00142', name: 'Amina Shabani Hassan', cls: 'Chekechea B', adm: true, rita: false, nida: false, pct: 60 },
                  ].map((st) => (
                    <tr key={st.id}>
                      <td className="p-2.5 font-mono font-bold text-teal-900">{st.id}</td>
                      <td className="p-2.5 font-bold text-slate-900">{st.name}</td>
                      <td className="p-2.5">{st.cls}</td>
                      <td className="p-2.5">{st.adm ? '✓ Ipo' : '✗ Haimo'}</td>
                      <td className="p-2.5">{st.rita ? '✓ Ipo' : '✗ Haimo (Missing)'}</td>
                      <td className="p-2.5">{st.nida ? '✓ Ipo' : '✗ Haimo'}</td>
                      <td className="p-2.5 font-bold">{st.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === 'CORRESPONDENCE_LOG' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Namba ya Rejea</th>
                    <th className="p-2.5">Aina</th>
                    <th className="p-2.5">Mhusika (Sender/Recipient)</th>
                    <th className="p-2.5">Mada ya Barua</th>
                    <th className="p-2.5">Tarehe</th>
                    <th className="p-2.5">Hali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {correspondence.map((c) => (
                    <tr key={c.id}>
                      <td className="p-2.5 font-mono font-bold text-teal-900">{c.referenceNumber}</td>
                      <td className="p-2.5 font-bold">{c.type === 'INCOMING' ? 'ILIZOINGIA' : 'ZILIZOTOKA'}</td>
                      <td className="p-2.5 text-slate-700">{c.senderOrRecipient}</td>
                      <td className="p-2.5 font-medium">{c.subject}</td>
                      <td className="p-2.5">{c.dateReceivedOrSent}</td>
                      <td className="p-2.5 font-bold">{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signatures and Stamp Section */}
          <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs">
            <div className="space-y-4">
              <div>
                <span className="font-bold text-slate-900 block">Imeandaliwa na:</span>
                <span className="text-slate-700">Bi. Salma Rashid Mwinyi</span>
                <span className="text-[11px] text-slate-500 block">Katibu wa Shule &bull; Masjala Kuu</span>
              </div>
              <div className="pt-4 border-b border-dashed border-slate-400 w-48" />
              <span className="text-[10px] text-slate-400">Sahihi &amp; Tarehe</span>
            </div>

            <div className="space-y-4 text-right">
              <div>
                <span className="font-bold text-slate-900 block">Imethibitishwa na:</span>
                <span className="text-slate-700">Mwalimu Mkuu (Headteacher)</span>
                <span className="text-[11px] text-slate-500 block">Kukumbuka Primary &amp; Nursery School</span>
              </div>
              <div className="pt-4 border-b border-dashed border-slate-400 w-48 ml-auto" />
              <div className="flex items-center justify-end gap-2 text-[10px] text-slate-400">
                <span>Muhuri Rasmi wa Shule (Official Stamp)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SecretaryShell>
  );
}
