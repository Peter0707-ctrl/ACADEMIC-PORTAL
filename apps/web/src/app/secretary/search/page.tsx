'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Building2,
  Users,
  UserCheck,
  Eye,
  Download,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import SecretaryShell from '@/components/secretary-shell';
import {
  getAllDocuments,
  SchoolDocumentRecord,
  DocumentCategory,
  ConfidentialityLevel,
} from '@/lib/secretary-data';

export default function DocumentSearchPage() {
  const [documents, setDocuments] = useState<SchoolDocumentRecord[]>([]);

  // Search Fields
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | DocumentCategory>('ALL');
  const [studentQuery, setStudentQuery] = useState('');
  const [staffQuery, setStaffQuery] = useState('');
  const [refQuery, setRefQuery] = useState('');
  const [yearQuery, setYearQuery] = useState('ALL');
  const [confidentialityQuery, setConfidentialityQuery] = useState<'ALL' | ConfidentialityLevel>('ALL');

  useEffect(() => {
    setDocuments(getAllDocuments());
  }, []);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('ALL');
    setStudentQuery('');
    setStaffQuery('');
    setRefQuery('');
    setYearQuery('ALL');
    setConfidentialityQuery('ALL');
  };

  // Search Algorithm
  const searchResults = useMemo(() => {
    return documents.filter((doc) => {
      // General Keyword
      if (keyword.trim()) {
        const k = keyword.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(k);
        const matchesDesc = doc.description.toLowerCase().includes(k);
        const matchesRef = doc.referenceNumber.toLowerCase().includes(k);
        const matchesType = doc.documentType.toLowerCase().includes(k);
        if (!matchesTitle && !matchesDesc && !matchesRef && !matchesType) return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;

      // Student Query
      if (studentQuery.trim()) {
        const sq = studentQuery.toLowerCase();
        const matchId = doc.relatedStudentId?.toLowerCase().includes(sq);
        const matchName = doc.relatedStudentName?.toLowerCase().includes(sq);
        if (!matchId && !matchName) return false;
      }

      // Staff Query
      if (staffQuery.trim()) {
        const stq = staffQuery.toLowerCase();
        const matchId = doc.relatedStaffId?.toLowerCase().includes(stq);
        const matchName = doc.relatedStaffName?.toLowerCase().includes(stq);
        if (!matchId && !matchName) return false;
      }

      // Ref No
      if (refQuery.trim() && !doc.referenceNumber.toLowerCase().includes(refQuery.toLowerCase())) {
        return false;
      }

      // Year
      if (yearQuery !== 'ALL' && doc.academicYear !== yearQuery) return false;

      // Confidentiality
      if (confidentialityQuery !== 'ALL' && doc.confidentialityLevel !== confidentialityQuery) {
        return false;
      }

      return true;
    });
  }, [documents, keyword, selectedCategory, studentQuery, staffQuery, refQuery, yearQuery, confidentialityQuery]);

  return (
    <SecretaryShell
      pageTitle="Utafutaji wa Hati (Document Search Engine)"
      pageDescription="Ofisi ya Katibu wa Shule: Injini yenye nguvu ya kutafuta nyaraka zote za shule kwa kutumia namba ya kumbukumbu, Student ID, Staff ID, jamii ya hati, mwaka wa masomo au ngazi ya usiri."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Search Control Panel */}
        <div className="bg-white/95 rounded-3xl border border-teal-200/80 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">
                INJINI YA UTAFUTAJI WA MASJALA
              </span>
              <h3 className="text-base font-black text-slate-900 mt-0.5">
                Vigezo vya Kina vya Utafutaji (Advanced Search Filters)
              </h3>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Weka Upya Vichujio</span>
            </button>
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Keyword */}
            <div className="lg:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Neno Kuu (Keyword / Kichwa cha Hati):</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tafuta jina la hati, aina, au maneno yaliyomo kwenye maelezo..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Student ID / Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Student ID au Jina la Mwanafunzi:</label>
              <input
                type="text"
                placeholder="Mfano: SFNA-2026-0112 au Juma Bakari"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            {/* Staff ID / Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Staff ID au Jina la Mwalimu:</label>
              <input
                type="text"
                placeholder="Mfano: HT-2026-001 au Augustine"
                value={staffQuery}
                onChange={(e) => setStaffQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium"
              />
            </div>

            {/* Reference Number */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Namba ya Kumbukumbu (Ref No):</label>
              <input
                type="text"
                placeholder="Mfano: KPS/REG/2026 au RITA"
                value={refQuery}
                onChange={(e) => setRefQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Jamii ya Hati (Category):</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-800"
              >
                <option value="ALL">Jamii Zote za Hati</option>
                <option value="STUDENT_RECORDS">Kumbukumbu za Wanafunzi</option>
                <option value="STAFF_RECORDS">Kumbukumbu za Walimu</option>
                <option value="SCHOOL_ADMINISTRATION">Utawala wa Shule</option>
                <option value="ACADEMIC_RECORDS">Nyaraka za Kitaaluma</option>
                <option value="FINANCIAL_DOCUMENTS">Hati za Fedha</option>
                <option value="MEETINGS_AND_CORRESPONDENCE">Mikutano &amp; Barua</option>
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mwaka wa Masomo:</label>
              <select
                value={yearQuery}
                onChange={(e) => setYearQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-800"
              >
                <option value="ALL">Miaka Yote</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            {/* Confidentiality */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngazi ya Usiri:</label>
              <select
                value={confidentialityQuery}
                onChange={(e) => setConfidentialityQuery(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-800"
              >
                <option value="ALL">Ngazi Zote</option>
                <option value="PUBLIC">PUBLIC</option>
                <option value="INTERNAL">INTERNAL</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="HIGHLY_CONFIDENTIAL">HIGHLY_CONFIDENTIAL</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="bg-white/95 rounded-3xl border border-teal-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-teal-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Matokeo ya Utafutaji ({searchResults.length} hati zimepatikana)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.length === 0 ? (
              <div className="col-span-2 p-10 text-center text-slate-400 space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-300" />
                <p>Hakuna hati inayofanana na vigezo ulivyoweka. Jaribu kubadilisha vigezo vya utafutaji.</p>
              </div>
            ) : (
              searchResults.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all bg-white space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-teal-100/70 border border-teal-200 font-mono font-bold text-[10px] text-teal-950">
                        {doc.referenceNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {doc.documentType}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 leading-snug">{doc.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{doc.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono">
                      {doc.academicYear} &bull; {doc.fileType} ({doc.fileSize})
                    </span>

                    <Link
                      href={`/secretary/registry?view=${doc.id}`}
                      className="px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-black flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-700" />
                      <span>Fungua Hati</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </SecretaryShell>
  );
}
