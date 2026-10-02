'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderArchive,
  FileText,
  UploadCloud,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Calendar,
  Lock,
  FileCheck,
  Tag,
  Clock,
  Trash2,
  Plus,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';

interface SchoolDocument {
  id: string;
  title: string;
  category: 'Taaluma & Mitihani' | 'Wizara & Serikali' | 'Mikutano ya Wazazi' | 'Miongozo ya Shule' | 'Nyaraka za Utumishi';
  fileName: string;
  fileSize: string;
  version: string;
  uploadDate: string;
  uploadedBy: string;
  accessLevel: 'PUBLIC' | 'CONFIDENTIAL_STAFF' | 'HEADTEACHER_ONLY';
  downloadUrl?: string;
}

const INITIAL_DOCUMENTS: SchoolDocument[] = [
  {
    id: 'doc-01',
    title: 'Mwongozo Mpya wa Mtaala wa Elimu ya Awali na Msingi 2026',
    category: 'Wizara & Serikali',
    fileName: 'Mwongozo_Mtaala_TET_2026.pdf',
    fileSize: '3.4 MB',
    version: 'v2.1',
    uploadDate: '2026-01-12',
    uploadedBy: 'Mwl. Augustine Mrosso (Mkuu)',
    accessLevel: 'CONFIDENTIAL_STAFF',
  },
  {
    id: 'doc-02',
    title: 'Mkataba wa Utendaji Kazi wa Walimu (Teaching Staff KPI)',
    category: 'Nyaraka za Utumishi',
    fileName: 'Mkataba_Utendaji_Walimu_2026.docx',
    fileSize: '850 KB',
    version: 'v1.0',
    uploadDate: '2026-01-15',
    uploadedBy: 'School Secretary',
    accessLevel: 'HEADTEACHER_ONLY',
  },
  {
    id: 'doc-03',
    title: 'Muhtasari wa Kikao cha Wazazi na Uongozi wa Shule (AGM)',
    category: 'Mikutano ya Wazazi',
    fileName: 'Muhtasari_Kikao_Wazazi_Feb2026.pdf',
    fileSize: '1.2 MB',
    version: 'v1.2',
    uploadDate: '2026-02-18',
    uploadedBy: 'School Secretary',
    accessLevel: 'PUBLIC',
  },
  {
    id: 'doc-04',
    title: 'Ratiba Rasmi ya Mitihani ya Taifa (NECTA PSLE & SFNA 2026)',
    category: 'Taaluma & Mitihani',
    fileName: 'Ratiba_NECTA_PSLE_2026.pdf',
    fileSize: '2.1 MB',
    version: 'v3.0',
    uploadDate: '2026-02-25',
    uploadedBy: 'Mwl. Beatrice Kimaro (Taaluma)',
    accessLevel: 'PUBLIC',
  },
  {
    id: 'doc-05',
    title: 'Kanuni za Nidhamu na Malezi ya Wanafunzi Shuleni',
    category: 'Miongozo ya Shule',
    fileName: 'Kanuni_Nidhamu_Shule_2026.pdf',
    fileSize: '920 KB',
    version: 'v1.0',
    uploadDate: '2026-01-20',
    uploadedBy: 'Mwl. Godfrey Makere (Nidhamu)',
    accessLevel: 'PUBLIC',
  },
];

export default function SchoolSecretaryRecordsPage() {
  const currentUser = getCurrentSession();
  const [documents, setDocuments] = useState<SchoolDocument[]>(INITIAL_DOCUMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Document Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SchoolDocument['category']>('Taaluma & Mitihani');
  const [newVersion, setNewVersion] = useState('v1.0');
  const [newAccess, setNewAccess] = useState<SchoolDocument['accessLevel']>('CONFIDENTIAL_STAFF');

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('school_records_documents_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initial documents
          const merged = [...parsed];
          INITIAL_DOCUMENTS.forEach((init) => {
            if (!merged.some((m) => m.id === init.id)) {
              merged.push(init);
            }
          });
          setDocuments(merged);
        }
      } else {
        localStorage.setItem('school_records_documents_v1', JSON.stringify(INITIAL_DOCUMENTS));
      }
    } catch {}
  }, []);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: SchoolDocument = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      category: newCategory,
      fileName: `${newTitle.trim().replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.8 MB',
      version: newVersion || 'v1.0',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: currentUser?.fullName || 'Mwalimu Mkuu',
      accessLevel: newAccess,
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('school_records_documents_v1', JSON.stringify(updated));
    }
    setShowUploadModal(false);
    setNewTitle('');
    setActiveNotice(`Waraka "${newDoc.title}" (${newDoc.version}) umehifadhiwa kikamilifu kwenye Masijala ya Shule.`);
  };

  return (
    <TeacherShell
      pageTitle="Masijala & Nyaraka za Shule (School Secretary & Records)"
      pageDescription="Hifadhi, kategoria, toleo (versioning), utafutaji na uhifadhi wa kudumu wa nyaraka rasmi za shule, miongozo ya serikali na kumbukumbu."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Notice alert */}
        {activeNotice && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="font-bold">{activeNotice}</span>
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

        {/* Header Action Banner */}
        <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-950/20">
              <FolderArchive className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                Masijala Kuu ya Shule (Document Archive &amp; Records)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Nyaraka {documents.length} zimehifadhiwa kulingana na miongozo ya usalama na toleo rasmi (Versioning).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>+ Pakia Waraka / Faili Mpya</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tafuta waraka kwa kichwa, jina au mwandishi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Kategoria:
            </span>
            {['ALL', 'Taaluma & Mitihani', 'Wizara & Serikali', 'Mikutano ya Wazazi', 'Miongozo ya Shule', 'Nyaraka za Utumishi'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {cat === 'ALL' ? 'Nyaraka Zote' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Kichwa cha Waraka / Faili</th>
                  <th className="py-3 px-4">Kategoria</th>
                  <th className="py-3 px-3 text-center">Toleo (Ver)</th>
                  <th className="py-3 px-4">Ukubwa</th>
                  <th className="py-3 px-4">Tarehe &amp; Mwandishi</th>
                  <th className="py-3 px-3 text-center">Ufikiaji</th>
                  <th className="py-3 px-4 text-center">Kitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 text-slate-800">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-emerald-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 leading-tight">{doc.title}</span>
                            {(doc.id.includes('sealed') || doc.title.includes('Muhuri')) && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-amber-200 text-[9px] font-black border border-emerald-700">
                                ★ Muhuri Rasmi wa Mkuu wa Shule
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{doc.fileName}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-black text-emerald-800">
                      {doc.version}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                      {doc.fileSize}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      <div>{doc.uploadDate}</div>
                      <div className="text-[10px] text-slate-400">{doc.uploadedBy}</div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black ${
                          doc.accessLevel === 'PUBLIC'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : doc.accessLevel === 'CONFIDENTIAL_STAFF'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {doc.accessLevel === 'PUBLIC'
                          ? 'Wote'
                          : doc.accessLevel === 'CONFIDENTIAL_STAFF'
                          ? 'Walimu Tu'
                          : 'Mkuu wa Shule'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setActiveNotice(`Faili "${doc.fileName}" linapakuliwa kutoka Masijala...`)}
                        className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                        title="Pakua waraka huu"
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

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-sm font-black text-slate-900">Pakia Waraka Kwenye Masijala</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Kichwa cha Waraka:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Mfano: Mkataba wa Lishe ya Wanafunzi 2026..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Kategoria:
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                    >
                      <option value="Taaluma & Mitihani">Taaluma &amp; Mitihani</option>
                      <option value="Wizara & Serikali">Wizara &amp; Serikali</option>
                      <option value="Mikutano ya Wazazi">Mikutano ya Wazazi</option>
                      <option value="Miongozo ya Shule">Miongozo ya Shule</option>
                      <option value="Nyaraka za Utumishi">Nyaraka za Utumishi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Toleo (Version):
                    </label>
                    <input
                      type="text"
                      value={newVersion}
                      onChange={(e) => setNewVersion(e.target.value)}
                      placeholder="v1.0"
                      className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Ngazi ya Ufikiaji (Access Level):
                  </label>
                  <select
                    value={newAccess}
                    onChange={(e) => setNewAccess(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  >
                    <option value="PUBLIC">Umma / Wazazi na Walimu (Public)</option>
                    <option value="CONFIDENTIAL_STAFF">Walimu Pekee (Staff Only)</option>
                    <option value="HEADTEACHER_ONLY">Mwalimu Mkuu Pekee (Confidential)</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-emerald-300 p-4 rounded-2xl bg-emerald-50/50 text-center">
                  <UploadCloud className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-700 block">Chagua Faili (.PDF, .DOCX, .XLSX)</span>
                  <span className="text-[10px] text-slate-400">Ukubwa usiozidi 15 MB</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20"
                  >
                    Hifadhi Waraka
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
