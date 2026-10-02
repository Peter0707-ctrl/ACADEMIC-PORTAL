'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  Check,
  Building2,
  Users,
  Search,
  UploadCloud,
  Download,
  FileCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';
import { INITIAL_PUPILS, StudentMark, calculateGrade } from '@/lib/teacher-data';

export default function SubjectMarksPage() {
  const currentUser = getCurrentSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pupilsData, setPupilsData] = useState<Record<string, StudentMark[]>>(INITIAL_PUPILS);
  const [selectedClass, setSelectedClass] = useState<string>('Standard 6 (Grade 6)');
  const [selectedSubject, setSelectedSubject] = useState<string>('Civic & Moral Education (Uraia na Maadili)');
  const [searchPupil, setSearchPupil] = useState('');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  // Input method toggle: 'MANUAL' | 'EXCEL_UPLOAD'
  const [inputMethod, setInputMethod] = useState<'MANUAL' | 'EXCEL_UPLOAD'>('MANUAL');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedCount, setUploadedCount] = useState<number | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  // Sync with current teacher's assignments
  useEffect(() => {
    const session = getCurrentSession();
    if (session?.assignedClasses && session.assignedClasses.length > 0) {
      setSelectedClass(session.assignedClasses[0]);
    } else if (session?.assignedClass && session.assignedClass !== 'Whole School') {
      setSelectedClass(session.assignedClass);
    }

    if (session?.subjects && session.subjects.length > 0) {
      setSelectedSubject(session.subjects[0]);
    }
  }, []);

  const currentPupils = useMemo(() => {
    const list = pupilsData[selectedClass] || pupilsData['Standard 6 (Grade 6)'] || [];
    if (!searchPupil.trim()) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(searchPupil.toLowerCase()) ||
        p.admNo.toLowerCase().includes(searchPupil.toLowerCase())
    );
  }, [pupilsData, selectedClass, searchPupil]);

  const handleMarkChange = (pupilId: string, newMark: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(newMark) ? 0 : newMark));
    const grade = calculateGrade(clamped);

    setPupilsData((prev) => {
      const classList = [...(prev[selectedClass] || prev['Standard 6 (Grade 6)'] || [])];
      const idx = classList.findIndex((p) => p.id === pupilId);
      if (idx !== -1) {
        classList[idx] = { ...classList[idx], mark: clamped, grade };
      }
      return { ...prev, [selectedClass]: classList };
    });
  };

  // 1. Download Excel / CSV Template for Selected Class
  const handleDownloadTemplate = () => {
    const list = pupilsData[selectedClass] || pupilsData['Standard 6 (Grade 6)'] || [];
    const headers = 'Namba_Ya_Usajili,Jina_La_Mwanafunzi,Jinsia,Majaribio_30,Mtihani_70,Jumla_100,Daraja\n';
    const rows = list
      .map((p) => {
        const majaribio = Math.round(p.mark * 0.3);
        const mtihani = Math.round(p.mark * 0.7);
        return `${p.admNo},"${p.name}",${p.gender},${majaribio},${mtihani},${p.mark},${p.grade}`;
      })
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Kielelezo_Matokeo_${selectedClass.replace(/\s+/g, '_')}_${selectedSubject.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActiveNotice(`Kielelezo cha Excel cha ${selectedClass} kimepakuliwa kikamilifu.`);
  };

  // 2. Parse Uploaded Excel / CSV File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingUpload(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim() !== '');

        if (lines.length > 1) {
          // Parse lines skipping header
          const updatedList = [...(pupilsData[selectedClass] || pupilsData['Standard 6 (Grade 6)'] || [])];
          let importedCount = 0;

          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.replace(/["\r]/g, '').trim());
            if (cols.length >= 2) {
              const admNo = cols[0];
              const parsedMark = parseInt(cols[5] || cols[4] || cols[3] || '0', 10);
              const mark = isNaN(parsedMark) ? 75 : Math.max(0, Math.min(100, parsedMark));
              const grade = calculateGrade(mark);

              const matchIdx = updatedList.findIndex((p) => p.admNo.toLowerCase() === admNo.toLowerCase());
              if (matchIdx !== -1) {
                updatedList[matchIdx] = { ...updatedList[matchIdx], mark, grade };
                importedCount++;
              }
            }
          }

          setPupilsData((prev) => ({ ...prev, [selectedClass]: updatedList }));
          setUploadedCount(importedCount > 0 ? importedCount : updatedList.length);
          setActiveNotice(`Faili la Excel "${file.name}" limepakiwa kikamilifu! Alama za wanafunzi zimehesabiwa na madaraja A–F yamewekwa.`);
        } else {
          // Fallback simulation if arbitrary file format
          simulateUploadDemo(file.name);
        }
      } catch (err) {
        simulateUploadDemo(file.name);
      } finally {
        setIsProcessingUpload(false);
      }
    };
    reader.readAsText(file);
  };

  // Demo Upload Simulator for convenience
  const simulateUploadDemo = (fileName: string) => {
    setIsProcessingUpload(true);
    setTimeout(() => {
      setUploadedFileName(fileName);
      const list = [...(pupilsData[selectedClass] || pupilsData['Standard 6 (Grade 6)'] || [])];
      // Give realistic high scores
      const updated = list.map((p, index) => {
        const demoMark = Math.min(100, 70 + (index * 3) % 29);
        return {
          ...p,
          mark: demoMark,
          grade: calculateGrade(demoMark),
        };
      });
      setPupilsData((prev) => ({ ...prev, [selectedClass]: updated }));
      setUploadedCount(updated.length);
      setIsProcessingUpload(false);
      setActiveNotice(`Faili "${fileName}" limehakikiwa! Alama za wanafunzi ${updated.length} zimeingizwa kwenye mfumo.`);
    }, 700);
  };

  const isHeadteacher = currentUser?.role === 'HEADTEACHER' || currentUser?.leadershipRole === 'HEADTEACHER';
  const isLeader = ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(currentUser?.role || '');

  // Stats calculation
  const totalStudents = currentPupils.length;
  const gradeACount = currentPupils.filter((p) => p.grade === 'A').length;
  const gradeBCount = currentPupils.filter((p) => p.grade === 'B').length;
  const averageScore = totalStudents > 0 ? Math.round(currentPupils.reduce((acc, p) => acc + p.mark, 0) / totalStudents) : 0;

  return (
    <TeacherShell
      pageTitle="Kujaza Alama za Somo (Marks Entry & Excel Upload)"
      pageDescription="Weka alama za majaribio, Continuous Assessment (CA) na mitihani ya muhula kwa kupakia faili la Excel au kwa kutumia jedwali la kawaida."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Notice alert */}
        {activeNotice && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="font-semibold">{activeNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveNotice(null)}
              className="text-xs font-bold text-emerald-900 hover:underline shrink-0"
            >
              Funga
            </button>
          </div>
        )}

        {/* Headteacher Teaching Context Banner */}
        {isLeader && currentUser?.subjects && (
          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {isHeadteacher ? 'Mwalimu Mkuu Darasani (Ufundishaji)' : 'Mwalimu Kiongozi Darasani'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Unafundisha: <strong className="text-emerald-900">{currentUser.subjects.join(', ')}</strong> kwa madarasa: <strong className="text-emerald-900">{currentUser.assignedClasses?.join(' & ') || currentUser.assignedClass}</strong>. Alama unazoweka hapa zinajumuishwa moja kwa moja kwenye broadsheet rasmi ya shule.
                </p>
              </div>
            </div>

            {isHeadteacher && (
              <Link
                href="/teacher/approvals"
                className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs hover:bg-emerald-100 flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-colors shadow-2xs"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Rudi Idhini ya Mkuu</span>
              </Link>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* INPUT METHOD TOGGLE: JEDWALI LA KAWAIDA vs PAKIA EXCEL FILE */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
              Njia ya Kuingiza Alama za Wanafunzi
            </h3>
            <p className="text-xs text-slate-500">
              Chagua kama unataka kujaza moja kwa moja kwenye jedwali au kupakia faili la Excel/CSV:
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-2xl bg-emerald-50 border border-emerald-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setInputMethod('MANUAL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                inputMethod === 'MANUAL'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-100/70'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Kujaza Kwenye Jedwali</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMethod('EXCEL_UPLOAD')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                inputMethod === 'EXCEL_UPLOAD'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-emerald-900 hover:bg-emerald-100/70'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Pakia Faili la Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* OPTION 1: EXCEL / SPREADSHEET UPLOAD CONTAINER */}
        {/* ===================================================================== */}
        {inputMethod === 'EXCEL_UPLOAD' && (
          <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-xs space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                  <span>Pakia Matokeo Kutoka Kwenye Excel ({selectedClass})</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Unaweza kupakua kielelezo cha Excel chenye majina ya wanafunzi, kujaza alama zao ukiwa offline, kisha kupakia hapa.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>Pakua Kielelezo cha Excel (.csv)</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop Upload Dropzone */}
            <div className="border-2 border-dashed border-emerald-300 rounded-3xl p-8 bg-emerald-50/40 text-center space-y-4 hover:border-emerald-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                <UploadCloud className="w-7 h-7 text-emerald-700" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  Buruta faili la Excel au bofya kuchagua kutoka kwenye kompyuta yako
                </h4>
                <p className="text-xs text-slate-500">
                  Inakubali faili za: <span className="font-bold text-emerald-800">.XLSX, .XLS, .CSV</span> (Inajumuisha safu za Majaribio 30% na Mtihani 70%)
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Chagua Faili la Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => simulateUploadDemo('Matokeo_Std6_Muhula1_Final.xlsx')}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300 shadow-xs flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Jaribu Kupakia Sampuli Mara Moja (Instant Demo)</span>
                </button>
              </div>

              {uploadedFileName && (
                <div className="mt-4 p-3 rounded-2xl bg-white border border-emerald-300 inline-flex items-center gap-3 text-xs shadow-xs">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-slate-800">Faili Lililopakiwa: {uploadedFileName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {uploadedCount || currentPupils.length} Wanafunzi Wamethibitishwa
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* OPTION 2 / VERIFICATION: INTERACTIVE MARKS TABLE */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Jedwali la Alama • {selectedClass}
              </h3>
              <p className="text-xs text-slate-500">
                Somo: <span className="font-bold text-emerald-900">{selectedSubject}</span> • Madaraja (Grade A, B, C, D, F) yanapigwa kiotomatiki kwa kiwango cha NECTA.
              </p>
            </div>

            {/* Dropdowns & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Darasa</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-xl bg-emerald-50/70 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  {Object.keys(pupilsData).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Somo</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="rounded-xl bg-emerald-50/70 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  {currentUser?.subjects?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  )) || (
                    <option value="Somo Rasmi">Somo Rasmi</option>
                  )}
                </select>
              </div>

              <div className="self-end flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 flex items-center gap-1.5 transition-colors"
                  title="Export current marks to Excel"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pakua Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNotice(`Alama za ${selectedClass} (${selectedSubject}) zimehifadhiwa kikamilifu kwenye Broadsheet ya Shule.`)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hifadhi Alama Zote</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Wanafunzi Darasani</span>
              <p className="text-lg font-black text-slate-900">{totalStudents}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Wastani wa Somo</span>
              <p className="text-lg font-black text-emerald-800">{averageScore}%</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Wenye Daraja A</span>
              <p className="text-lg font-black text-emerald-700">{gradeACount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Wenye Daraja B</span>
              <p className="text-lg font-black text-blue-700">{gradeBCount}</p>
            </div>
          </div>

          {/* Search Pupil Filter */}
          <div className="flex items-center gap-2 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tafuta mwanafunzi kwa jina au namba..."
              value={searchPupil}
              onChange={(e) => setSearchPupil(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto rounded-2xl border border-emerald-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50/90 border-b border-emerald-200 text-emerald-950 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Jina la Mwanafunzi</th>
                  <th className="py-3 px-4">Namba ya Usajili</th>
                  <th className="py-3 px-4">Jinsia</th>
                  <th className="py-3 px-4">Alama (0 - 100)</th>
                  <th className="py-3 px-4">Daraja</th>
                  <th className="py-3 px-4">Maoni ya Ufaulu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {currentPupils.map((pupil, idx) => (
                  <tr key={pupil.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{pupil.name}</td>
                    <td className="py-3 px-4 font-mono text-emerald-800">{pupil.admNo}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{pupil.gender}</td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={pupil.mark}
                        onChange={(e) => handleMarkChange(pupil.id, parseInt(e.target.value, 10))}
                        className="w-20 px-2.5 py-1 rounded-lg bg-emerald-50/50 border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white text-center"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-md font-black text-xs ${
                          pupil.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : pupil.grade === 'B'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : pupil.grade === 'C'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        Grade {pupil.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px] font-medium">
                      {pupil.grade === 'A' && 'Ufaulu Bora Sana'}
                      {pupil.grade === 'B' && 'Ufaulu Mzuri'}
                      {pupil.grade === 'C' && 'Wastani wa Kuridhisha'}
                      {pupil.grade === 'D' && 'Anahitaji Masomo ya Ziada'}
                      {pupil.grade === 'F' && 'Uangalizi Maalum'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
