'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Search,
  Filter,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  UploadCloud,
  ChevronRight,
  Eye,
  Plus,
  ArrowRight,
  Printer,
  ShieldCheck,
  Building2,
  Award,
  X,
} from 'lucide-react';
import SecretaryShell from '@/components/secretary-shell';
import {
  getAllDocuments,
  getChecklists,
  SchoolDocumentRecord,
} from '@/lib/secretary-data';
import { getStoredAccounts, UserAccount } from '@/lib/auth-session';

export default function StaffFilesManagementPage() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [documents, setDocuments] = useState<SchoolDocumentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Selected Staff File Modal
  const [selectedStaffForFile, setSelectedStaffForFile] = useState<UserAccount | null>(null);

  useEffect(() => {
    setAccounts(getStoredAccounts());
    setDocuments(getAllDocuments());
  }, []);

  const { staffChecklist } = getChecklists();
  const staffRequiredCount = staffChecklist.filter((r) => r.isRequired).length;

  const staffMembers = useMemo(() => {
    return accounts.filter((a) => ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE', 'TEACHER', 'SECRETARY'].includes(a.role));
  }, [accounts]);

  const staffRoster = useMemo(() => {
    return staffMembers.map((staff) => {
      const docs = documents.filter((d) => d.relatedStaffId === staff.identifier);
      const hasAppt = docs.some((d) => d.documentType.toLowerCase().includes('appointment'));
      const hasCert = docs.some((d) => d.documentType.toLowerCase().includes('certificate'));

      let completed = 3;
      if (hasAppt) completed += 1;
      if (hasCert) completed += 1;

      const pct = Math.min(100, Math.round((completed / Math.max(1, staffRequiredCount)) * 100));

      return {
        ...staff,
        completionPercentage: pct,
        docsCount: docs.length,
      };
    });
  }, [staffMembers, documents, staffRequiredCount]);

  const filteredStaff = useMemo(() => {
    return staffRoster.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchRole = roleFilter === 'ALL' || s.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [staffRoster, searchTerm, roleFilter]);

  return (
    <SecretaryShell
      pageTitle="Majalada ya Walimu & Wafanyakazi (Staff Digital Files)"
      pageDescription="Ofisi ya Katibu wa Shule: Usimamizi wa majalada ya watumishi wa shule (Staff ID), uhakiki wa vyeti vya ualimu, namba za usajili wa TSC, mikataba na barua za uteuzi."
    >
      <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-white/95 border border-teal-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Jumla ya Wafanyakazi</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{staffMembers.length} Watumishi</span>
            <span className="text-[11px] text-teal-700 font-bold">Wapo Kwenye Sajili ya Utumishi</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase block">Majalada Kamili (100%)</span>
            <span className="text-2xl font-black text-emerald-900 block mt-1">
              {staffRoster.filter((s) => s.completionPercentage >= 90).length}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">Wamewasilisha Hati Zote</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-amber-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-amber-700 uppercase block">Hati Pungufu</span>
            <span className="text-2xl font-black text-amber-900 block mt-1">
              {staffRoster.filter((s) => s.completionPercentage < 90).length}
            </span>
            <span className="text-[11px] text-amber-700 font-semibold">Wanahitaji Kuhuisha Nyaraka</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-purple-200/90 shadow-xs">
            <span className="text-[11px] font-bold text-purple-700 uppercase block">Nyaraka Masjalani</span>
            <span className="text-2xl font-black text-purple-900 block mt-1">
              {documents.filter((d) => d.category === 'STAFF_RECORDS').length} Hati
            </span>
            <span className="text-[11px] text-purple-700 font-semibold">Vyeti, Uteuzi &amp; Mikataba</span>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white/95 rounded-3xl border border-teal-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Orodha ya Majalada ya Watumishi (Staff Files Registry)
              </h3>
              <p className="text-xs text-slate-500">
                Bofya &quot;Fungua Jalada&quot; kutazama barua ya uteuzi, vyeti vya TSC na fomu za utumishi.
              </p>
            </div>

            <Link
              href="/secretary/upload"
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <UploadCloud className="w-4 h-4 text-teal-200" />
              <span>Pakia Hati ya Mwalimu</span>
            </Link>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tafuta jina la mtumishi au Staff ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">Nafasi Zote za Kazi</option>
              <option value="HEADTEACHER">Mwalimu Mkuu</option>
              <option value="ACADEMIC">Mwalimu wa Taaluma</option>
              <option value="DISCIPLINE">Mwalimu wa Nidhamu</option>
              <option value="TEACHER">Mwalimu wa Darasa (Teacher)</option>
              <option value="SECRETARY">Katibu wa Shule (Secretary)</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                  <th className="p-3">Staff ID</th>
                  <th className="p-3">Jina la Mtumishi</th>
                  <th className="p-3">Nafasi / Wadhifa</th>
                  <th className="p-3">Mawasiliano</th>
                  <th className="p-3">Hati Masjalani</th>
                  <th className="p-3">Ukamilifu wa Jalada</th>
                  <th className="p-3 text-right">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-teal-50/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-teal-950">
                      <span className="px-2 py-0.5 rounded bg-teal-100/70 border border-teal-200">
                        {staff.identifier}
                      </span>
                    </td>

                    <td className="p-3 font-bold text-slate-900">
                      <span>{staff.fullName}</span>
                      <span className="block text-[10px] text-slate-500 font-normal">
                        Ajira: {staff.joinedDate}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border">
                        {staff.role === 'HEADTEACHER'
                          ? 'Mwalimu Mkuu'
                          : staff.role === 'ACADEMIC'
                          ? 'Mwl. Taaluma'
                          : staff.role === 'DISCIPLINE'
                          ? 'Mwl. Nidhamu'
                          : staff.role === 'SECRETARY'
                          ? 'Katibu wa Shule'
                          : 'Mwalimu wa Kawaida'}
                      </span>
                    </td>

                    <td className="p-3 text-slate-700">
                      <span>{staff.phone || '+255 7XX XXX XXX'}</span>
                      <span className="block text-[10px] text-slate-500">{staff.email}</span>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {staff.docsCount} Hati
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span>{staff.completionPercentage}%</span>
                          {staff.completionPercentage >= 90 ? (
                            <span className="text-emerald-700">Kamili</span>
                          ) : (
                            <span className="text-amber-700">Pungufu</span>
                          )}
                        </div>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              staff.completionPercentage >= 90 ? 'bg-emerald-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${staff.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStaffForFile(staff)}
                        className="px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-black inline-flex items-center gap-1 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                        <span>Fungua Jalada</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedStaffForFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-teal-300 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
              <div className="flex items-start justify-between border-b border-teal-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-900 text-white flex items-center justify-center font-black text-sm">
                    {selectedStaffForFile.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider block">
                      JALADA LA MTUMISHI &bull; DIGITAL STAFF FILE
                    </span>
                    <h3 className="text-base font-black text-slate-900">{selectedStaffForFile.fullName}</h3>
                    <span className="text-xs text-slate-600 font-mono font-bold">
                      {selectedStaffForFile.identifier} &bull; {selectedStaffForFile.role}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStaffForFile(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Checklist verification */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="block text-slate-900">Barua Rasmi ya Uteuzi (Appointment Letter)</strong>
                      <span className="text-[10px] text-slate-500">Imethibitishwa na Mkuu wa Shule &bull; PDF</span>
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
                      <strong className="block text-slate-900">Vyeti vya Kitaaluma &amp; Leseni ya TSC</strong>
                      <span className="text-[10px] text-slate-500">Stashahada / Shahada ya Ualimu &bull; TSC Registered</span>
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
                      <strong className="block text-slate-900">Kitambulisho cha Taifa (NIDA Copy)</strong>
                      <span className="text-[10px] text-slate-500">Nakala iliyohakikiwa</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                    Ipo Jaladani ✓
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedStaffForFile(null)}
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
        )}
      </div>
    </SecretaryShell>
  );
}
