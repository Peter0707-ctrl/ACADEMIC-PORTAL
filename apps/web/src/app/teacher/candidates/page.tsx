'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  AlertCircle,
  UploadCloud,
  Plus,
  RefreshCw,
  X,
  Check,
  GraduationCap,
  Users,
  ShieldCheck,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getStoredAccounts, UserAccount } from '@/lib/auth-session';
import { INITIAL_PUPILS, getStoredPupilsRegistry } from '@/lib/teacher-data';
import { notifyUser } from '@/lib/notifications';

export interface NectaCandidate {
  id: string;
  fullName: string;
  identifier: string; // School Adm No
  examIndexNo: string; // NECTA Index No
  candidateType: 'PSLE' | 'SFNA';
  gender: 'M' | 'F';
  assignedClass: string;
  status: 'VERIFIED ACTIVE' | 'PROVISIONAL';
  registrationDate: string;
  centerCode: string;
}

const STORAGE_CANDIDATES_KEY = 'academic_portal_necta_candidates_v2';

export default function CandidatesPage() {
  const [examTypeFilter, setExamTypeFilter] = useState<'ALL' | 'PSLE' | 'SFNA'>('ALL');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState<NectaCandidate[]>([]);

  // Modals
  const [showManualModal, setShowManualModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Manual Form
  const [manualForm, setManualForm] = useState({
    fullName: '',
    identifier: '',
    examIndexNo: '',
    candidateType: 'PSLE' as 'PSLE' | 'SFNA',
    gender: 'M' as 'M' | 'F',
    assignedClass: 'Standard 7 (Grade 7)',
  });

  // Bulk Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedCandidates, setParsedCandidates] = useState<NectaCandidate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial candidate seed generator from Standard 7 and Standard 4
  const generateInitialCandidates = (): NectaCandidate[] => {
    const list: NectaCandidate[] = [];

    // 1. Standard 7 - PSLE (Primary School Leaving Examination)
    const std7Pupils = INITIAL_PUPILS['Standard 7 (Grade 7)'] || [];
    std7Pupils.forEach((p, idx) => {
      const seq = idx + 1 < 10 ? `000${idx + 1}` : `00${idx + 1}`;
      list.push({
        id: `cand-psle-${p.id || idx}`,
        fullName: p.name.replace(/\s*\(Candidate\)/i, '').trim(),
        identifier: p.admNo || `PSLE-2026-0428/${seq}`,
        examIndexNo: `PSLE-2026-0428/${seq}`,
        candidateType: 'PSLE',
        gender: p.gender,
        assignedClass: 'Standard 7 (Grade 7)',
        status: 'VERIFIED ACTIVE',
        registrationDate: '15 Jan 2026',
        centerCode: '0204128 - KUKUMBUKA PRIMARY',
      });
    });

    // 2. Standard 4 - SFNA (Standard Four National Assessment)
    const std4Pupils = INITIAL_PUPILS['Standard 4 (Grade 4)'] || [];
    std4Pupils.forEach((p, idx) => {
      const seq = idx + 1 < 10 ? `000${idx + 1}` : `00${idx + 1}`;
      list.push({
        id: `cand-sfna-${p.id || idx}`,
        fullName: p.name.replace(/\s*\(Candidate\)/i, '').trim(),
        identifier: p.admNo || `SFNA-2026-0112/${seq}`,
        examIndexNo: `SFNA-2026-0112/${seq}`,
        candidateType: 'SFNA',
        gender: p.gender,
        assignedClass: 'Standard 4 (Grade 4)',
        status: 'VERIFIED ACTIVE',
        registrationDate: '18 Jan 2026',
        centerCode: '0204128 - KUKUMBUKA PRIMARY',
      });
    });

    return list;
  };

  // Load candidates on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_CANDIDATES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCandidates(parsed);
          return;
        }
      }
      // If empty, generate and store
      const initial = generateInitialCandidates();
      localStorage.setItem(STORAGE_CANDIDATES_KEY, JSON.stringify(initial));
      setCandidates(initial);
    } catch {
      const initial = generateInitialCandidates();
      setCandidates(initial);
    }
  }, []);

  const saveCandidates = (newList: NectaCandidate[]) => {
    setCandidates(newList);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_CANDIDATES_KEY, JSON.stringify(newList));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Auto-sync candidates directly from Class 7 and Class 4 registers
  const handleAutoSyncFromClasses = () => {
    const registry = getStoredPupilsRegistry();
    const std7 = registry['Standard 7 (Grade 7)'] || INITIAL_PUPILS['Standard 7 (Grade 7)'] || [];
    const std4 = registry['Standard 4 (Grade 4)'] || INITIAL_PUPILS['Standard 4 (Grade 4)'] || [];

    const synced: NectaCandidate[] = [];

    std7.forEach((p, idx) => {
      const seq = idx + 1 < 10 ? `000${idx + 1}` : `00${idx + 1}`;
      synced.push({
        id: `cand-psle-${p.id || idx}`,
        fullName: p.name.replace(/\s*\(Candidate\)/i, '').trim(),
        identifier: p.admNo,
        examIndexNo: `PSLE-2026-0428/${seq}`,
        candidateType: 'PSLE',
        gender: p.gender,
        assignedClass: 'Standard 7 (Grade 7)',
        status: 'VERIFIED ACTIVE',
        registrationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        centerCode: '0204128 - KUKUMBUKA PRIMARY',
      });
    });

    std4.forEach((p, idx) => {
      const seq = idx + 1 < 10 ? `000${idx + 1}` : `00${idx + 1}`;
      synced.push({
        id: `cand-sfna-${p.id || idx}`,
        fullName: p.name.replace(/\s*\(Candidate\)/i, '').trim(),
        identifier: p.admNo,
        examIndexNo: `SFNA-2026-0112/${seq}`,
        candidateType: 'SFNA',
        gender: p.gender,
        assignedClass: 'Standard 4 (Grade 4)',
        status: 'VERIFIED ACTIVE',
        registrationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        centerCode: '0204128 - KUKUMBUKA PRIMARY',
      });
    });

    saveCandidates(synced);
    notifyUser(
      'success',
      'Watahiniwa Wamesawazishwa!',
      `Watahiniwa ${synced.length} (PSLE: ${std7.length}, SFNA: ${std4.length}) wamevutwa moja kwa moja kutoka kwenye daftari la madarasa ya La Saba na La Nne.`
    );
  };

  // Submit Manual Candidate Form
  const handleManualCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName.trim()) {
      notifyUser('warning', 'Jina Linahitajika', 'Tafadhali jaza jina kamili la mtahiniwa.');
      return;
    }

    const nextIdx = candidates.length + 1;
    const seq = nextIdx < 10 ? `000${nextIdx}` : `00${nextIdx}`;
    const prefix = manualForm.candidateType === 'PSLE' ? 'PSLE-2026-0428' : 'SFNA-2026-0112';

    const newCand: NectaCandidate = {
      id: `cand-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: manualForm.fullName.trim(),
      identifier: manualForm.identifier.trim() || `PUP-2026-0${manualForm.candidateType === 'PSLE' ? '7' : '4'}${seq.slice(-2)}`,
      examIndexNo: manualForm.examIndexNo.trim() || `${prefix}/${seq}`,
      candidateType: manualForm.candidateType,
      gender: manualForm.gender,
      assignedClass: manualForm.assignedClass,
      status: 'VERIFIED ACTIVE',
      registrationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      centerCode: '0204128 - KUKUMBUKA PRIMARY',
    };

    const updated = [newCand, ...candidates];
    saveCandidates(updated);
    setShowManualModal(false);

    setManualForm({
      fullName: '',
      identifier: '',
      examIndexNo: '',
      candidateType: 'PSLE',
      gender: 'M',
      assignedClass: 'Standard 7 (Grade 7)',
    });

    notifyUser(
      'success',
      'Mtahiniwa Amesajiliwa!',
      `${newCand.fullName} amesajiliwa kama mtahiniwa wa ${newCand.candidateType} (Namba ya Mtihani: ${newCand.examIndexNo}).`
    );
  };

  // Download Sample NECTA CSV Template
  const handleDownloadNectaTemplate = () => {
    const csv =
      'Jina Kamili la Mtahiniwa,Namba ya Usajili Shuleni,Namba ya Mtihani (Index No),Aina ya Mtihani (PSLE/SFNA),Jinsia (M/F),Darasa\n' +
      'Kelvin Shirima,PSLE-2026-0428/0001,PSLE-2026-0428/0001,PSLE,M,Standard 7 (Grade 7)\n' +
      'Neema Massawe,PSLE-2026-0428/0002,PSLE-2026-0428/0002,PSLE,F,Standard 7 (Grade 7)\n' +
      'Juma Bakari,SFNA-2026-0112/0001,SFNA-2026-0112/0001,SFNA,M,Standard 4 (Grade 4)\n' +
      'Fatma Hassan,SFNA-2026-0112/0002,SFNA-2026-0112/0002,SFNA,F,Standard 4 (Grade 4)';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Sampuli_ya_Watahiniwa_NECTA_PSLE_SFNA.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser('success', 'Sampuli Imepakuliwa', 'Faili la sampuli ya NECTA watahiniwa limepakuliwa.');
  };

  // Upload and Parse CSV File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);

        if (lines.length <= 1) {
          notifyUser('warning', 'Faili Halina Data', 'Faili halina mistari ya watahiniwa.');
          setIsProcessing(false);
          return;
        }

        const dataRows = lines.slice(1);
        const parsed: NectaCandidate[] = dataRows.map((line, idx) => {
          const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          const name = cols[0] || 'Mtahiniwa';
          const admNo = cols[1] || `ADM-2026-${idx + 100}`;
          const indexNo = cols[2] || `PSLE-2026-0428/${idx + 100}`;
          const typeStr = (cols[3] || 'PSLE').toUpperCase();
          const candType: 'PSLE' | 'SFNA' = typeStr.includes('4') || typeStr.includes('SFNA') ? 'SFNA' : 'PSLE';
          const rawGen = (cols[4] || 'M').toUpperCase();
          const gender: 'M' | 'F' = rawGen.startsWith('F') || rawGen.startsWith('K') ? 'F' : 'M';
          const cls = cols[5] || (candType === 'PSLE' ? 'Standard 7 (Grade 7)' : 'Standard 4 (Grade 4)');

          return {
            id: `cand-upload-${Date.now()}-${idx}`,
            fullName: name,
            identifier: admNo,
            examIndexNo: indexNo,
            candidateType: candType,
            gender,
            assignedClass: cls,
            status: 'VERIFIED ACTIVE',
            registrationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            centerCode: '0204128 - KUKUMBUKA PRIMARY',
          };
        });

        setParsedCandidates(parsed);
        setIsProcessing(false);
        notifyUser('info', 'Faili Limechambuliwa', `Watahiniwa ${parsed.length} wamepatikana kwenye faili.`);
      } catch (err) {
        console.error(err);
        notifyUser('error', 'Hitilafu ya Faili', 'Haikuweza kusoma faili la CSV. Hakikisha limepangwa vizuri.');
        setIsProcessing(false);
      }
    };

    reader.readAsText(file);
  };

  // Bulk Commit Uploaded Candidates
  const handleConfirmUpload = () => {
    if (parsedCandidates.length === 0) return;

    const merged = [...parsedCandidates, ...candidates];
    // Deduplicate by index number or name
    const seen = new Set<string>();
    const deduplicated = merged.filter((c) => {
      const key = `${c.examIndexNo}-${c.fullName.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    saveCandidates(deduplicated);
    setShowUploadModal(false);
    setParsedCandidates([]);
    if (fileInputRef.current) fileInputRef.current.value = '';

    notifyUser(
      'success',
      'Watahiniwa Wameingizwa!',
      `Jumla ya watahiniwa ${parsedCandidates.length} wameongezwa kwenye sajili rasmi ya NECTA.`
    );
  };

  // Export Filtered Candidates to CSV
  const handleExportCSV = () => {
    if (filteredCandidates.length === 0) {
      notifyUser('warning', 'Hakuna Data', 'Hakuna watahiniwa wa kupakua.');
      return;
    }

    const headers = [
      'Namba ya Mtihani (Index No)',
      'Jina Kamili la Mtahiniwa',
      'Jinsia',
      'Aina ya Mtihani',
      'Namba ya Shule',
      'Darasa',
      'Hali ya Usajili',
      'Kituo cha Mtihani',
    ];

    const rows = filteredCandidates.map((c) => [
      `"${c.examIndexNo}"`,
      `"${c.fullName}"`,
      `"${c.gender}"`,
      `"${c.candidateType}"`,
      `"${c.identifier}"`,
      `"${c.assignedClass}"`,
      `"${c.status}"`,
      `"${c.centerCode}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Orodha_Watahiniwa_NECTA_${examTypeFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser('success', 'Orodha Imepakuliwa', `Watahiniwa ${filteredCandidates.length} wamehamishwa kwenye faili la Excel/CSV.`);
  };

  // Filtered List
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.examIndexNo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = examTypeFilter === 'ALL' || c.candidateType === examTypeFilter;
      const matchesGender = genderFilter === 'ALL' || c.gender === genderFilter;

      return matchesSearch && matchesType && matchesGender;
    });
  }, [candidates, searchTerm, examTypeFilter, genderFilter]);

  const psleCount = candidates.filter((c) => c.candidateType === 'PSLE').length;
  const sfnaCount = candidates.filter((c) => c.candidateType === 'SFNA').length;

  return (
    <TeacherShell
      pageTitle="Watahiniwa wa Taifa (NECTA Candidates: PSLE & SFNA)"
      pageDescription="Ofisi ya Mwalimu wa Taaluma na Mkuu wa Shule: Usimamizi, usajili, na upakiaji wa watahiniwa wa Mitihani ya Taifa ya Darasa la Saba (PSLE) na Upimaji wa Kitaifa wa Darasa la Nne (SFNA)."
      requiredRole="ACADEMIC"
    >
      <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Jumla ya Watahiniwa</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">{candidates.length} Watahiniwa</span>
            <span className="text-[11px] text-emerald-700 font-bold">Wamesajiliwa NECTA Portal</span>
          </div>

          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Darasa la 7 (PSLE)</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">{psleCount} Watahiniwa</span>
            <span className="text-[11px] text-purple-700 font-bold">Mitihani ya Kuhitimu Elimu ya Msingi</span>
          </div>

          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Darasa la 4 (SFNA)</span>
            <span className="text-2xl font-black text-slate-800 block mt-1">{sfnaCount} Watahiniwa</span>
            <span className="text-[11px] text-blue-700 font-bold">Upimaji wa Kitaifa wa Darasa la Nne</span>
          </div>

          <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
            <span className="text-xs text-slate-500 block">Kituo cha Mtihani (Center)</span>
            <span className="text-base font-black text-emerald-800 block mt-1">PS0204128</span>
            <span className="text-[11px] text-slate-500 font-semibold truncate block">Kukumbuka Primary Center</span>
          </div>
        </div>

        {/* Candidates Table Card */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 font-black text-[10px] border border-purple-300">
                  NECTA PORTAL &bull; OFISI YA TAALUMA
                </span>
                <span className="text-xs text-slate-500">Msimu wa Mitihani 2026</span>
              </div>
              <h3 className="text-base font-black text-slate-800 mt-1">
                Orodha Rasmi ya Watahiniwa wa Taifa (NECTA Registered Candidates)
              </h3>
            </div>

            {/* Action Buttons: Auto-Sync, Excel Upload, Manual Add, Export */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleAutoSyncFromClasses}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs"
                title="Vuta watahiniwa wote wa Darasa la 7 na la 4 moja kwa moja kutoka madarasani"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                <span>Vuta Kutoka Madarasani</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5 text-blue-200" />
                <span>Pakia Excel / CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setShowManualModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-200" />
                <span>+ Sajili Mtahiniwa</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Pakua orodha rasmi ya NECTA kwa ajili ya kutuma au kuchapisha"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Pakua Orodha</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tafuta jina, namba ya shule au mtihani..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
              <select
                value={examTypeFilter}
                onChange={(e) => setExamTypeFilter(e.target.value as any)}
                className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Mitihani Yote (PSLE &amp; SFNA)</option>
                <option value="PSLE">PSLE (Darasa la Saba tu)</option>
                <option value="SFNA">SFNA (Darasa la Nne tu)</option>
              </select>

              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Jinsia Zote</option>
                <option value="M">Wavulana (M)</option>
                <option value="F">Wasichana (F)</option>
              </select>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Jina Kamili la Mtahiniwa</th>
                  <th className="py-3 px-4">Jinsia</th>
                  <th className="py-3 px-4">Namba ya Usajili Shuleni</th>
                  <th className="py-3 px-4">Namba ya Mtihani (Index No)</th>
                  <th className="py-3 px-4">Aina ya Mtihani</th>
                  <th className="py-3 px-4">Darasa</th>
                  <th className="py-3 px-4">Kituo cha NECTA</th>
                  <th className="py-3 px-4">Hali ya Usajili</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <GraduationCap className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-600">Hakuna watahiniwa waliopatikana</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Bofya kitufe cha <strong>"Vuta Kutoka Madarasani"</strong> au <strong>"Pakia Excel / CSV"</strong> hapo juu kupata watahiniwa mara moja.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((cand, idx) => (
                    <tr key={cand.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{cand.fullName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            cand.gender === 'F' ? 'bg-pink-100 text-pink-900' : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {cand.gender === 'F' ? 'Kike' : 'Kiume'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{cand.identifier}</td>
                      <td className="py-3 px-4 font-mono font-black text-slate-800">
                        {cand.examIndexNo}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md border font-black text-[10px] ${
                            cand.candidateType === 'PSLE'
                              ? 'bg-purple-100 text-purple-900 border-purple-300'
                              : 'bg-blue-100 text-blue-900 border-blue-300'
                          }`}
                        >
                          {cand.candidateType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{cand.assignedClass}</td>
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                        {cand.centerCode || 'PS0204128'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px]">
                          VERIFIED ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL 1: MANUAL ADD CANDIDATE */}
        {showManualModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-black text-slate-900 text-base">Sajili Mtahiniwa Mmoja Mmoja</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleManualCandidateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Jina Kamili la Mtahiniwa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="k.m. Kelvin Anthony Shirima"
                    value={manualForm.fullName}
                    onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Aina ya Mtihani</label>
                    <select
                      value={manualForm.candidateType}
                      onChange={(e) => {
                        const val = e.target.value as 'PSLE' | 'SFNA';
                        setManualForm({
                          ...manualForm,
                          candidateType: val,
                          assignedClass: val === 'PSLE' ? 'Standard 7 (Grade 7)' : 'Standard 4 (Grade 4)',
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="PSLE">PSLE (Darasa la Saba)</option>
                      <option value="SFNA">SFNA (Darasa la Nne)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jinsia</label>
                    <select
                      value={manualForm.gender}
                      onChange={(e) => setManualForm({ ...manualForm, gender: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="M">Kiume (Male)</option>
                      <option value="F">Kike (Female)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Namba ya Usajili Shuleni</label>
                    <input
                      type="text"
                      placeholder="k.m. PUP-2026-0701"
                      value={manualForm.identifier}
                      onChange={(e) => setManualForm({ ...manualForm, identifier: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Namba ya Mtihani (Index No)</label>
                    <input
                      type="text"
                      placeholder="k.m. PSLE-2026-0428/0036"
                      value={manualForm.examIndexNo}
                      onChange={(e) => setManualForm({ ...manualForm, examIndexNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Hifadhi Mtahiniwa</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: UPLOAD NECTA CSV/EXCEL */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-blue-700" />
                  <h3 className="font-black text-slate-900 text-base">Pakia Watahiniwa kwa Excel / CSV</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setParsedCandidates([]);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instructions and Download Template */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-blue-950 block">Muundo wa Faili la NECTA:</span>
                  <span className="text-blue-900">
                    Safu: Jina Kamili, Namba ya Shule, Index No, Aina (PSLE/SFNA), Jinsia, Darasa.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadNectaTemplate}
                  className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pakua Sampuli (.csv)</span>
                </button>
              </div>

              {/* Dropzone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-6 text-center space-y-2 bg-slate-50/50 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="necta-csv-upload-input"
                />
                <label
                  htmlFor="necta-csv-upload-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs sm:text-sm">
                      Bofya hapa kuchagua faili la watahiniwa (Excel / CSV)
                    </span>
                    <span className="text-[11px] text-slate-500">Inasaidia faili za .csv, .xlsx</span>
                  </div>
                </label>
              </div>

              {/* Parsed Preview */}
              {parsedCandidates.length > 0 && (
                <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Watahiniwa Waliopatikana ({parsedCandidates.length}):</span>
                    <span className="text-emerald-700">Tayari kuingizwa ✓</span>
                  </div>

                  <div className="border rounded-2xl overflow-y-auto max-h-40 text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 sticky top-0 font-bold text-slate-600">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Jina</th>
                          <th className="p-2">Index No</th>
                          <th className="p-2">Aina</th>
                          <th className="p-2">Jinsia</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedCandidates.map((c, i) => (
                          <tr key={c.id}>
                            <td className="p-2 text-slate-400 font-mono">{i + 1}</td>
                            <td className="p-2 font-bold text-slate-800">{c.fullName}</td>
                            <td className="p-2 font-mono text-emerald-800">{c.examIndexNo}</td>
                            <td className="p-2">{c.candidateType}</td>
                            <td className="p-2">{c.gender}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setParsedCandidates([]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Ghairi
                </button>
                <button
                  type="button"
                  disabled={parsedCandidates.length === 0}
                  onClick={handleConfirmUpload}
                  className={`px-6 py-2 rounded-xl text-white font-black text-xs shadow-md flex items-center gap-1.5 ${
                    parsedCandidates.length > 0
                      ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Sajili Watahiniwa Wote {parsedCandidates.length > 0 && `(${parsedCandidates.length})`}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
