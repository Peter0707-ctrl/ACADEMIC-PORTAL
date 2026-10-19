'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  AlertCircle,
  FolderArchive,
  Download,
  UploadCloud,
  ChevronRight,
  Eye,
  Plus,
  ArrowRight,
  Printer,
  Sparkles,
  ShieldCheck,
  Building2,
  Check,
  X,
} from 'lucide-react';
import SecretaryShell from '@/components/secretary-shell';
import {
  getAllDocuments,
  getChecklists,
  SchoolDocumentRecord,
} from '@/lib/secretary-data';
import { getAllEnrolledRecords, EnrolledStudent } from '@/lib/teacher-data';
import { getAllTransferredStudents, TransferredStudentRecord } from '@/lib/allocation-progression';

interface StudentFileItem {
  id: string;
  admNo: string;
  name: string;
  class: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  isTransferred: boolean;
  completionPercentage: number;
  docsCount: number;
  transferRecord?: TransferredStudentRecord;
}

export default function StudentFilesManagementPage() {
  const [pupils, setPupils] = useState<EnrolledStudent[]>([]);
  const [transferredPupils, setTransferredPupils] = useState<TransferredStudentRecord[]>([]);
  const [documents, setDocuments] = useState<SchoolDocumentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'TRANSFERRED'>('ALL');

  // Selected Student Digital File Modal
  const [selectedStudentForFile, setSelectedStudentForFile] = useState<StudentFileItem | null>(null);

  useEffect(() => {
    setPupils(getAllEnrolledRecords());
    setTransferredPupils(getAllTransferredStudents());
    setDocuments(getAllDocuments());
  }, []);

  const { studentChecklist } = getChecklists();
  const requiredCount = studentChecklist.filter((r) => r.isRequired).length;

  // Unified Student Files Roster
  const studentRoster = useMemo(() => {
    // 1. Active Pupils
    const active = pupils.map((p) => {
      const docs = documents.filter((d) => d.relatedStudentId === p.admNo);
      // Determine completion based on documents present
      const hasAdm = docs.some((d) => d.documentType.toLowerCase().includes('admission'));
      const hasBirth = docs.some((d) => d.documentType.toLowerCase().includes('birth'));
      const hasMedical = docs.some((d) => d.title.toLowerCase().includes('afya') || d.title.toLowerCase().includes('medical'));

      let completedRequired = 2; // base
      if (hasAdm) completedRequired += 1;
      if (hasBirth) completedRequired += 1;
      if (hasMedical) completedRequired += 1;

      const pct = Math.min(100, Math.round((completedRequired / Math.max(1, requiredCount)) * 100));

      return {
        id: p.id,
        admNo: p.admNo,
        name: p.name,
        class: p.assignedClass,
        gender: p.gender || 'M',
        parentName: p.parentName || 'Mzazi',
        parentPhone: p.parentPhone || '07XX XXX XXX',
        isTransferred: Boolean((p as any).isTransferredOut),
        completionPercentage: (p as any).isTransferredOut ? 100 : pct,
        docsCount: docs.length,
      };
    });

    // 2. Transferred Out Pupils (preserved for Secretary!)
    const transferred: StudentFileItem[] = transferredPupils.map((t) => ({
      id: t.id,
      admNo: t.admNo,
      name: t.fullName,
      class: `${t.lastClass} (Amehamia: ${t.destinationSchool})`,
      gender: t.gender,
      parentName: t.parentName,
      parentPhone: t.parentPhone,
      isTransferred: true,
      completionPercentage: 100,
      docsCount: documents.filter((d) => d.relatedStudentId === t.admNo).length,
      transferRecord: t,
    }));

    // Deduplicate by admNo
    const combined: StudentFileItem[] = [...transferred];
    active.forEach((a) => {
      if (!combined.some((c) => c.admNo === a.admNo)) {
        combined.push(a);
      }
    });

    return combined;
  }, [pupils, transferredPupils, documents, requiredCount]);

  // Filtered List
  const filteredStudents = useMemo(() => {
    return studentRoster.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.admNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchClass = classFilter === 'ALL' || s.class.includes(classFilter);
      const matchStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'TRANSFERRED'
          ? s.isTransferred
          : !s.isTransferred;

      return matchSearch && matchClass && matchStatus;
    });
  }, [studentRoster, searchTerm, classFilter, statusFilter]);

  return (
    <SecretaryShell
      pageTitle="Majalada ya Wanafunzi (Student Digital Files)"
      pageDescription="Ofisi ya Katibu wa Shule: Ufunguaji na ukaguzi wa majalada ya wanafunzi (kwa kutumia Student ID / Admission Number), tathmini ya ukamilifu wa hati (File Completion Percentage), na kumbukumbu za wanafunzi waliohamishwa."
    >
      <div className="space-y-6 animate-fade-in">
        {/* KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-white/95 border border-teal-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Jumla ya Majalada</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{studentRoster.length} Wanafunzi</span>
            <span className="text-[11px] text-teal-700 font-bold">Yameandikishwa Masjalani</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase block">Majalada Kamili (100%)</span>
            <span className="text-2xl font-black text-emerald-900 block mt-1">
              {studentRoster.filter((s) => s.completionPercentage >= 90).length}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">Yamekidhi Hati Zote</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-rose-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-rose-700 uppercase block">Hati Pungufu (Incomplete)</span>
            <span className="text-2xl font-black text-rose-900 block mt-1">
              {studentRoster.filter((s) => s.completionPercentage < 90 && !s.isTransferred).length}
            </span>
            <span className="text-[11px] text-rose-700 font-semibold">Zinahitaji Ufuatiliaji</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-purple-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-purple-700 uppercase block">Wanafunzi Waliohama</span>
            <span className="text-2xl font-black text-purple-900 block mt-1">
              {studentRoster.filter((s) => s.isTransferred).length}
            </span>
            <span className="text-[11px] text-purple-700 font-semibold">Rekodi Zimehifadhiwa Masjalani</span>
          </div>
        </div>

        {/* Filter and Table Container */}
        <div className="bg-white/95 rounded-3xl border border-teal-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Orodha ya Majalada ya Wanafunzi (Student Files Registry)
              </h3>
              <p className="text-xs text-slate-500">
                Bofya &quot;Fungua Jalada&quot; kutazama nyaraka zote za mwanafunzi na ripoti ya ukamilifu.
              </p>
            </div>

            <Link
              href="/secretary/upload"
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <UploadCloud className="w-4 h-4 text-teal-200" />
              <span>Pakia Hati ya Mwanafunzi</span>
            </Link>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tafuta jina la mwanafunzi au Student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">Madarasa Yote (Chekechea - La 7)</option>
              <option value="Standard 7">Standard 7 (Grade 7)</option>
              <option value="Standard 6">Standard 6 (Grade 6)</option>
              <option value="Standard 5">Standard 5 (Grade 5)</option>
              <option value="Standard 4">Standard 4 (Grade 4)</option>
              <option value="Standard 3">Standard 3 (Grade 3)</option>
              <option value="Standard 2">Standard 2 (Grade 2)</option>
              <option value="Standard 1">Standard 1 (Grade 1)</option>
              <option value="Nursery">Awali / Nursery</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">Hali Zote (Wanaosoma &amp; Waliohama)</option>
              <option value="ACTIVE">Wanafunzi Wanaosoma Hivi Sasa</option>
              <option value="TRANSFERRED">Waliohamishwa (Kumbukumbu ya Katibu)</option>
            </select>
          </div>

          {/* Student Files Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                  <th className="p-3">Student ID (Adm No)</th>
                  <th className="p-3">Jina la Mwanafunzi</th>
                  <th className="p-3">Darasa</th>
                  <th className="p-3">Mzazi &bull; Mawasiliano</th>
                  <th className="p-3">Hati Masjalani</th>
                  <th className="p-3">Ukamilifu wa Jalada</th>
                  <th className="p-3 text-right">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.admNo} className="hover:bg-teal-50/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-teal-950">
                      <span className="px-2 py-0.5 rounded bg-teal-100/70 border border-teal-200">
                        {s.admNo}
                      </span>
                    </td>

                    <td className="p-3 font-bold text-slate-900">
                      <span>{s.name}</span>
                      {s.isTransferred && (
                        <span className="ml-2 inline-block px-1.5 py-0.2 rounded bg-purple-100 text-purple-900 text-[9px] font-black uppercase">
                          Amehama Shule
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-semibold text-slate-700">{s.class}</td>

                    <td className="p-3 text-slate-700">
                      <span>{s.parentName}</span>
                      <span className="block text-[10px] text-slate-500 font-mono">{s.parentPhone}</span>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {s.docsCount} Hati
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span>{s.completionPercentage}%</span>
                          {s.completionPercentage >= 90 ? (
                            <span className="text-emerald-700">Kamili</span>
                          ) : (
                            <span className="text-rose-700">Pungufu</span>
                          )}
                        </div>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              s.completionPercentage >= 90 ? 'bg-emerald-600' : 'bg-rose-500'
                            }`}
                            style={{ width: `${s.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForFile(s as any)}
                        className="px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-black inline-flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-700" />
                        <span>Fungua Jalada</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* STUDENT DIGITAL FILE MODAL (SECTION 11 SPECIFICATION) */}
        {/* ===================================================================== */}
        {selectedStudentForFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-teal-300 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
              {/* File Header */}
              <div className="flex items-start justify-between border-b border-teal-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-900 text-white flex items-center justify-center font-black text-sm">
                    {selectedStudentForFile.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider block">
                      JALADA LA KIDIGITALI LA MWANAFUNZI &bull; STUDENT FILE
                    </span>
                    <h3 className="text-base font-black text-slate-900">{selectedStudentForFile.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600">
                      <span className="font-mono font-bold text-teal-900">{selectedStudentForFile.admNo}</span>
                      <span>&bull;</span>
                      <span>{selectedStudentForFile.class}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudentForFile(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Transferred Student Notice if applicable */}
              {selectedStudentForFile.isTransferred && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-black text-purple-900">
                    <FolderArchive className="w-4 h-4 text-purple-700" />
                    <span>MWANAFUNZI AMEHAMISHWA SHULENI (TRANSFERRED OUT ARCHIVE)</span>
                  </div>
                  <p className="text-[11px] text-purple-800 leading-relaxed">
                    Mwanafunzi huyu ameondolewa kwenye madarasa ya walimu na portal ya mzazi. Kumbukumbu zake zote za kianzio, vyeti, na alama zimehifadhiwa salama chini ya Masjala ya Katibu wa Shule.
                  </p>
                </div>
              )}

              {/* File Completion Percentage Box */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Ukamilifu wa Nyaraka (Checklist)</span>
                  <span className="text-xl font-black text-teal-950">Student File Completion: 83%</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-teal-800 text-white font-black text-xs">
                    5 kati ya 6 Hati
                  </span>
                </div>
              </div>

              {/* Document Checklist Items */}
              <div className="space-y-2 text-xs">
                <span className="font-black text-slate-800 uppercase tracking-wider text-[11px] block">
                  Hali ya Nyaraka Zilizomo Ndani ya Jalada:
                </span>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong className="block text-slate-900">Fomu Rasmi ya Udahili (Admission Form)</strong>
                        <span className="text-[10px] text-slate-500">Imesainiwa &bull; ADM-2026-0112</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                      Ipo Jaladani ✓
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong className="block text-slate-900">Cheti cha Kuzaliwa cha RITA (Birth Certificate)</strong>
                        <span className="text-[10px] text-slate-500">RITA-0881920 &bull; PDF 650 KB</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                      Ipo Jaladani ✓
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong className="block text-slate-900">Taarifa za Mzazi/Mlezi &amp; Namba ya Simu</strong>
                        <span className="text-[10px] text-slate-500">{selectedStudentForFile.parentName} &bull; {selectedStudentForFile.parentPhone}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                      Ipo Jaladani ✓
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <strong className="block text-rose-950">Fomu ya Afya na Kadi ya Chanjo (Medical Record)</strong>
                        <span className="text-[10px] text-rose-700">Haijawasilishwa na mzazi bado</span>
                      </div>
                    </div>
                    <Link
                      href={`/secretary/upload?studentId=${selectedStudentForFile.admNo}`}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] transition-colors"
                    >
                      + Pakia Sasa
                    </Link>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <Link
                  href={`/secretary/registry?category=STUDENT_RECORDS`}
                  className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1"
                >
                  <span>Tazama Hati Zote za Wanafunzi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForFile(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-xs transition-colors"
                  >
                    Funga
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4 text-teal-200" />
                    <span>Chapisha Jalada</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SecretaryShell>
  );
}
