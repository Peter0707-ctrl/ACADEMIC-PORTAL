'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  FolderArchive,
  UploadCloud,
  Search,
  CheckSquare,
  Users,
  UserCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  FileSpreadsheet,
  Plus,
  Eye,
  Download,
  AlertCircle,
  FileCheck,
  History,
  CheckCircle2,
} from 'lucide-react';
import SecretaryShell from '@/components/secretary-shell';
import {
  getSecretaryDashboardStats,
  getAllDocuments,
  SchoolDocumentRecord,
} from '@/lib/secretary-data';

export default function SecretaryDashboardPage() {
  const [stats, setStats] = useState(getSecretaryDashboardStats());
  const [recentDocs, setRecentDocs] = useState<SchoolDocumentRecord[]>([]);

  useEffect(() => {
    const s = getSecretaryDashboardStats();
    setStats(s);
    setRecentDocs(getAllDocuments().slice(0, 6));
  }, []);

  return (
    <SecretaryShell
      pageTitle="Dashboard — Masjala Kuu ya Shule & Hati za Kidigitali"
      pageDescription="Ofisi ya Katibu wa Shule (Digital Records Manager): Usimamizi, uhifadhi, utafutaji, na ufuatiliaji wa hati na majalada rasmi ya wanafunzi, wafanyakazi, utawala, mikutano, na fedha."
    >
      <div className="space-y-6 animate-fade-in">
        {/* ===================================================================== */}
        {/* 1. OVERVIEW CARDS (SECTION 2 SPECIFICATION) */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Documents */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/95 border border-teal-200/90 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Documents
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
              {stats.totalDocuments}
            </span>
            <span className="text-[11px] text-teal-700 font-bold block">
              Hati Zote Masjalani
            </span>
          </div>

          {/* Card 2: Added This Month */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Added This Month
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <UploadCloud className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-900 block">
              {stats.addedThisMonth}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold block">
              Zilizopakiwa Mwezi Huu
            </span>
          </div>

          {/* Card 3: Pending Filing */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/95 border border-amber-200/90 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Pending Filing
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-amber-900 block">
              {stats.pendingFiling}
            </span>
            <span className="text-[11px] text-amber-700 font-semibold block">
              Zinazosubiri Kuwekwa Jaladani
            </span>
          </div>

          {/* Card 4: Incomplete Student Files */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/95 border border-rose-200/90 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Incomplete Student Files
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-rose-900 block">
              {stats.incompleteStudentFiles}
            </span>
            <span className="text-[11px] text-rose-700 font-semibold block">
              Wanafunzi Wenye Hati Pungufu
            </span>
          </div>

          {/* Card 5: Incomplete Staff Files */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/95 border border-amber-200/90 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Incomplete Staff Files
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-amber-900 block">
              {stats.incompleteStaffFiles}
            </span>
            <span className="text-[11px] text-amber-700 font-semibold block">
              Walimu Wenye Hati Pungufu
            </span>
          </div>

          {/* Card 6: Archived Documents */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/95 border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Archived Documents
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <FolderArchive className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-800 block">
              {stats.archivedDocuments}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold block">
              Jalada la Miaka Iliyopita
            </span>
          </div>

          {/* Card 7: Documents Requiring Attention */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white/95 border border-purple-200/90 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Requiring Attention
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-purple-900 block">
              {stats.documentsRequiringAttention}
            </span>
            <span className="text-[11px] text-purple-700 font-semibold block">
              Uangalizi Maalum / Siri
            </span>
          </div>

          {/* Card 8: Quick Action Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Kitendo cha Haraka
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Pakia Hati Mpya</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Sajili hati ya mwanafunzi, mwalimu au utawala.
              </p>
            </div>
            <Link
              href="/secretary/upload"
              className="mt-3 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pakia Sasa</span>
            </Link>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. QUICK ACTION LAUNCHPAD */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-teal-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">Njia za Mkato za Masjala (Quick Actions)</h3>
              <p className="text-xs text-slate-500">Vitendo vikuu vya usimamizi wa kumbukumbu na majalada ya shule.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/secretary/upload"
              className="p-3.5 rounded-2xl bg-teal-50/70 hover:bg-teal-100/80 border border-teal-200 text-center space-y-1.5 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                <UploadCloud className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-800 block">Upload Document</span>
              <span className="text-[10px] text-slate-500 block">Pakia Hati</span>
            </Link>

            <Link
              href="/secretary/search"
              className="p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 text-center space-y-1.5 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-800 block">Search</span>
              <span className="text-[10px] text-slate-500 block">Tafuta Hati</span>
            </Link>

            <Link
              href="/secretary/students"
              className="p-3.5 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200 text-center space-y-1.5 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-800 block">Open Student File</span>
              <span className="text-[10px] text-slate-500 block">Jalada la Mwanafunzi</span>
            </Link>

            <Link
              href="/secretary/staff"
              className="p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 text-center space-y-1.5 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-800 block">Open Staff File</span>
              <span className="text-[10px] text-slate-500 block">Jalada la Mwalimu</span>
            </Link>

            <Link
              href="/secretary/archive"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center space-y-1.5 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                <FolderArchive className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-800 block">Archive</span>
              <span className="text-[10px] text-slate-500 block">Kumbukumbu Kuu</span>
            </Link>

            <Link
              href="/secretary/reports"
              className="p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 text-center space-y-1.5 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-slate-800 block">Generate Report</span>
              <span className="text-[10px] text-slate-500 block">Ripoti za Masjala</span>
            </Link>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. INCOMPLETE STUDENT & STAFF FILES ALERT WIDGET */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Incomplete Student Files Box */}
          <div className="p-5 rounded-3xl bg-white/95 border border-rose-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Majalada ya Wanafunzi Yasiyokamilika (Incomplete)</h4>
                  <span className="text-[10px] text-rose-700 font-bold">Wanafunzi 14 wana upungufu wa nyaraka rasmi</span>
                </div>
              </div>
              <Link
                href="/secretary/students"
                className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
              >
                <span>Tazama Yote</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-4 text-center rounded-2xl bg-emerald-50/60 border border-emerald-200 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="font-bold text-[11px] text-slate-800 block">Majalada Yote Yapo Kamili</span>
                <span className="text-[10px] text-slate-500">Hakuna upungufu wa nyaraka za wanafunzi kwa sasa.</span>
              </div>
            </div>
          </div>

          {/* Incomplete Staff Files Box */}
          <div className="p-5 rounded-3xl bg-white/95 border border-amber-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Majalada ya Walimu Yasiyokamilika (Staff Files)</h4>
                  <span className="text-[10px] text-amber-800 font-bold">Walimu 5 wanahitaji kuhuisha vyeti au leseni</span>
                </div>
              </div>
              <Link
                href="/secretary/staff"
                className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>Tazama Yote</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-4 text-center rounded-2xl bg-emerald-50/60 border border-emerald-200 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="font-bold text-[11px] text-slate-800 block">Majalada ya Watumishi Yapo Kamili</span>
                <span className="text-[10px] text-slate-500">Hakuna upungufu wa nyaraka za kiutumishi kwa sasa.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4. RECENT DOCUMENTS REGISTRY TABLE */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-teal-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-teal-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Hati za Hivi Karibuni Masjalani (Recent Documents)</h3>
              <p className="text-xs text-slate-500">Hati zilizopakiwa na kuhakikiwa na mfumo wa kidigitali.</p>
            </div>

            <Link
              href="/secretary/registry"
              className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <span>Fungua Masjala Kamili</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                  <th className="p-3">Reference No</th>
                  <th className="p-3">Kichwa cha Hati (Title)</th>
                  <th className="p-3">Aina / Jamii</th>
                  <th className="p-3">Mhusika (Student / Staff)</th>
                  <th className="p-3">Mwaka / Muhula</th>
                  <th className="p-3">Siri</th>
                  <th className="p-3 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-teal-50/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-teal-950">
                      <span className="px-2 py-0.5 rounded bg-teal-100/70 border border-teal-200">
                        {doc.referenceNumber}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-normal mt-0.5">{doc.uploadDate}</span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      <span>{doc.title}</span>
                      <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                        {doc.fileType} &bull; {doc.fileSize} &bull; Toleo {doc.version}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">
                      {doc.relatedStudentName ? (
                        <div>
                          <strong>{doc.relatedStudentName}</strong>
                          <span className="block text-[10px] text-slate-500 font-mono">{doc.relatedStudentId}</span>
                        </div>
                      ) : doc.relatedStaffName ? (
                        <div>
                          <strong>{doc.relatedStaffName}</strong>
                          <span className="block text-[10px] text-slate-500 font-mono">{doc.relatedStaffId}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Ofisi ya Shule</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-700 font-medium">
                      <span>{doc.academicYear}</span>
                      <span className="block text-[10px] text-slate-500">{doc.term}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          doc.confidentialityLevel === 'PUBLIC'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : doc.confidentialityLevel === 'INTERNAL'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : doc.confidentialityLevel === 'CONFIDENTIAL'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {doc.confidentialityLevel}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/secretary/registry?view=${doc.id}`}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-700" />
                        <span>Tazama</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SecretaryShell>
  );
}
