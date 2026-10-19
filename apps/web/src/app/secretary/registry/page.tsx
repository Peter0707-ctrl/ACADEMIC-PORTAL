'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Search,
  Filter,
  Download,
  UploadCloud,
  FolderArchive,
  Eye,
  X,
  Printer,
  History,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Users,
  UserCheck,
  DollarSign,
  Layers,
  ArrowRight,
  Sparkles,
  Lock,
  Unlock,
  RefreshCw,
  Award,
} from 'lucide-react';
import SecretaryShell from '@/components/secretary-shell';
import {
  getAllDocuments,
  SchoolDocumentRecord,
  DocumentCategory,
  ConfidentialityLevel,
  archiveDocument,
  restoreArchivedDocument,
  createNewDocumentVersion,
  syncExternalOfficesDocuments,
} from '@/lib/secretary-data';
import { notifyUser } from '@/lib/notifications';

const CATEGORY_TABS: { id: 'ALL' | DocumentCategory; label: string; icon: string }[] = [
  { id: 'ALL', label: 'Hati Zote (All Documents)', icon: 'FileText' },
  { id: 'SCHOOL_ADMINISTRATION', label: 'Utawala wa Shule', icon: 'Building2' },
  { id: 'STUDENT_RECORDS', label: 'Kumbukumbu za Wanafunzi', icon: 'Users' },
  { id: 'STAFF_RECORDS', label: 'Kumbukumbu za Walimu & Wafanyakazi', icon: 'UserCheck' },
  { id: 'ACADEMIC_RECORDS', label: 'Nyaraka za Kitaaluma', icon: 'Layers' },
  { id: 'FINANCIAL_DOCUMENTS', label: 'Hati za Fedha (Storage)', icon: 'DollarSign' },
  { id: 'MEETINGS_AND_CORRESPONDENCE', label: 'Mikutano & Barua', icon: 'Calendar' },
];

function DocumentRegistryContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') as DocumentCategory | null;
  const urlViewId = searchParams.get('view');

  const [documents, setDocuments] = useState<SchoolDocumentRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | DocumentCategory>(urlCategory || 'ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [confidentialityFilter, setConfidentialityFilter] = useState<'ALL' | ConfidentialityLevel>('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL');
  const [isSyncing, setIsSyncing] = useState(false);

  // Preview Modal
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<SchoolDocumentRecord | null>(null);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [newVersionNum, setNewVersionNum] = useState('');
  const [newVersionDesc, setNewVersionDesc] = useState('');

  // Initial load: Pull real-time external files from headteacher, discipline, finance
  useEffect(() => {
    syncExternalOfficesDocuments();
    const docs = getAllDocuments();
    setDocuments(docs);

    if (urlViewId) {
      const match = docs.find((d) => d.id === urlViewId);
      if (match) setSelectedDocForPreview(match);
    }
  }, [urlViewId]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory('ALL');
    }
  }, [urlCategory]);

  // Tab counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: documents.filter((d) => !d.isArchived).length,
    };
    CATEGORY_TABS.forEach((t) => {
      if (t.id !== 'ALL') {
        counts[t.id] = documents.filter((d) => d.category === t.id && !d.isArchived).length;
      }
    });
    return counts;
  }, [documents]);

  const handleSelectTab = (tabId: 'ALL' | DocumentCategory) => {
    setSelectedCategory(tabId);
    if (typeof window !== 'undefined') {
      const newUrl = tabId === 'ALL' ? '/secretary/registry' : `/secretary/registry?category=${tabId}`;
      window.history.pushState(null, '', newUrl);
    }
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const res = syncExternalOfficesDocuments();
      const updated = getAllDocuments();
      setDocuments(updated);
      setIsSyncing(false);
      if (res.newlySynced > 0) {
        notifyUser('success', 'Ulinganisho Umekamilika!', `Hati ${res.newlySynced} mpya zimeingizwa kiotomatiki kutoka ofisi za shule.`);
      } else {
        notifyUser('info', 'Hati Zote Zimeshasawazishwa!', `Hati zote kutoka Ofisi ya Mkuu wa Shule, Taaluma, Nidhamu na Fedha zipo sawa (${updated.length} jumla).`);
      }
    }, 600);
  };

  // Filtered Documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.relatedStudentId && doc.relatedStudentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.relatedStudentName && doc.relatedStudentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.relatedStaffId && doc.relatedStaffId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.relatedStaffName && doc.relatedStaffName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesConf = confidentialityFilter === 'ALL' || doc.confidentialityLevel === confidentialityFilter;
      const matchesYear = yearFilter === 'ALL' || doc.academicYear === yearFilter;
      const matchesStatus =
        statusFilter === 'ALL'
          ? !doc.isArchived
          : statusFilter === 'ARCHIVED'
          ? doc.isArchived
          : !doc.isArchived;

      return matchesCategory && matchesSearch && matchesConf && matchesYear && matchesStatus;
    });
  }, [documents, selectedCategory, searchTerm, confidentialityFilter, yearFilter, statusFilter]);

  // Handle Archive
  const handleArchive = (doc: SchoolDocumentRecord) => {
    archiveDocument(doc.id, 'Bi. Salma Rashid (Katibu wa Shule)');
    setDocuments(getAllDocuments());
    if (selectedDocForPreview?.id === doc.id) {
      setSelectedDocForPreview(null);
    }
    notifyUser('info', 'Hati Imehamishiwa Kwenye Archive', `Hati "${doc.title}" imehamishiwa kwenye jalada kuu la kumbukumbu.`);
  };

  // Handle Restore
  const handleRestore = (doc: SchoolDocumentRecord) => {
    restoreArchivedDocument(doc.id, 'Bi. Salma Rashid (Katibu wa Shule)');
    setDocuments(getAllDocuments());
    if (selectedDocForPreview?.id === doc.id) {
      setSelectedDocForPreview(null);
    }
    notifyUser('success', 'Hati Imetolewa Kwenye Archive', `Hati "${doc.title}" imerejeshwa kwenye orodha hai ya masjala.`);
  };

  // Handle Create New Version
  const handleSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocForPreview || !newVersionNum.trim() || !newVersionDesc.trim()) return;

    const updated = createNewDocumentVersion(
      selectedDocForPreview.id,
      newVersionNum.trim(),
      newVersionDesc.trim(),
      'Bi. Salma Rashid (Katibu wa Shule)',
      selectedDocForPreview.fileType,
      selectedDocForPreview.fileSize,
      selectedDocForPreview.storageLocation
    );

    if (updated) {
      setDocuments(getAllDocuments());
      setSelectedDocForPreview(updated);
      setShowVersionModal(false);
      setNewVersionNum('');
      setNewVersionDesc('');
      notifyUser('success', 'Toleo Jipya Limetengenezwa!', `Toleo ${updated.version} la "${updated.title}" limerekodiwa.`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Document ID',
      'Reference Number',
      'Title',
      'Category',
      'Document Type',
      'Academic Year',
      'Term',
      'Document Date',
      'Upload Date',
      'Uploaded By',
      'Related Student/Staff',
      'Confidentiality',
      'Version',
      'File Type',
      'File Size',
      'Storage Location',
    ];

    const rows = filteredDocuments.map((d) => [
      `"${d.id}"`,
      `"${d.referenceNumber}"`,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.category}"`,
      `"${d.documentType}"`,
      `"${d.academicYear}"`,
      `"${d.term}"`,
      `"${d.documentDate}"`,
      `"${d.uploadDate}"`,
      `"${d.uploadedBy}"`,
      `"${d.relatedStudentName || d.relatedStaffName || 'Utawala wa Shule'}"`,
      `"${d.confidentialityLevel}"`,
      `"${d.version}"`,
      `"${d.fileType}"`,
      `"${d.fileSize}"`,
      `"${d.storageLocation}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Masjala_Kuu_ya_Hati_Shule_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser('success', 'Daftari Limepakuliwa', `Hati ${filteredDocuments.length} zimehamishwa kwenye faili la CSV/Excel.`);
  };

  return (
    <SecretaryShell
      pageTitle="Masjala Kuu ya Hati (Document Registry)"
      pageDescription="Hifadhidata Kuu ya Hati Rasmi za Shule: Taarifa za kina za metadata, udhibiti wa usiri, matoleo ya hati (versioning), na utafutaji wa haraka."
    >
      <div className="space-y-6 animate-fade-in">
        {/* ===================================================================== */}
        {/* AUTOMATIC DOCUMENT INGESTION PIPELINE (CLEAN, SOFT & LIGHT) */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-teal-200/80 space-y-4 text-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                  <span>Mfumo wa Kupokea Hati Kiotomatiki (Automatic Ingestion Pipeline)</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold">
                    Ushirikiano wa Ofisi Zote
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Faili na nyaraka rasmi zinaingia moja kwa moja kwenye Masjala ya Katibu kutoka ofisi zote za shule:
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold shadow-xs flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-teal-700 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Inavuta Hati...' : '🔄 Vuta Hati Mpya za Ofisi Zote Sasa'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Box 1: Headteacher & Academic */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>1. Mkuu wa Shule &amp; Taaluma</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Matokeo yakipitishwa na kupigwa Muhuri Rasmi na Mkuu wa Shule, Broadsheet ya PDF inaingia hapa moja kwa moja kwenye <strong>Nyaraka za Kitaaluma</strong>.
              </p>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                Std 1–7 &amp; Chekechea Broadsheets
              </span>
            </div>

            {/* Box 2: Discipline */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2. Ofisi ya Mwalimu wa Nidhamu</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Wito wa mzazi, makubaliano ya nidhamu au ripoti ya shauri vinapoundwa, faili linaingia kwenye <strong>Kumbukumbu za Wanafunzi</strong> chini ya namba ya mwanafunzi (Admission No).
              </p>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium">
                Parent Summons &amp; Case Files
              </span>
            </div>

            {/* Box 3: Finance */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <DollarSign className="w-4 h-4 text-blue-600 shrink-0" />
                <span>3. Ofisi ya Mhasibu (Finance)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Stakabadhi za ada ya masomo, muundo wa ada uliothibitishwa, na miamala ya benki/cashbook vinasawazishwa hapa kwenye <strong>Hati za Fedha</strong>.
              </p>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-medium">
                Fee Ledgers &amp; EFD Receipts
              </span>
            </div>

            {/* Box 4: Secretary Registry */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>4. Masjala ya Katibu (Manual)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Nyaraka za kimwili (vyeti vya kuzaliwa vya RITA, leseni za MoEST, barua za posta) zinapakiwa na Katibu kupitia kitufe cha <strong>+ Pakia Hati Mpya</strong>.
              </p>
              <span className="inline-block text-[9px] px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200 font-medium">
                RITA, Barua &amp; Miongozo
              </span>
            </div>
          </div>
        </div>

        {/* Category Pills Header with Counts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            const count = categoryCounts[tab.id] || 0;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Bar & Action Bar */}
        <div className="bg-white/95 rounded-3xl border border-teal-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Sajili ya Hati Rasmi ({filteredDocuments.length} zimepatikana)
              </h3>
              <p className="text-xs text-slate-500">
                Orodha ya hati zote zilizosajiliwa kwenye kumbukumbu za shule.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Pakua CSV</span>
              </button>

              <Link
                href="/secretary/upload"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <UploadCloud className="w-4 h-4 text-teal-100" />
                <span>+ Pakia Hati Mpya</span>
              </Link>
            </div>
          </div>

          {/* Search Inputs & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tafuta namba ya hati, jina, au mwanafunzi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Confidentiality */}
            <select
              value={confidentialityFilter}
              onChange={(e) => setConfidentialityFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">Ngazi Zote za Usiri (Confidentiality)</option>
              <option value="PUBLIC">PUBLIC — Wazi kwa Wote</option>
              <option value="INTERNAL">INTERNAL — Ndani ya Shule</option>
              <option value="RESTRICTED">RESTRICTED — Wenye Idhini</option>
              <option value="CONFIDENTIAL">CONFIDENTIAL — Siri</option>
              <option value="HIGHLY_CONFIDENTIAL">HIGHLY_CONFIDENTIAL — Siri Kubwa</option>
            </select>

            {/* Academic Year */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">Miaka Yote ya Masomo</option>
              <option value="2026">Mwaka wa Masomo 2026</option>
              <option value="2025">Mwaka wa Masomo 2025</option>
              <option value="2024">Mwaka wa Masomo 2024</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">Hati Hai (Active Records)</option>
              <option value="ARCHIVED">Hati za Kumbukumbu (Archived Records)</option>
            </select>
          </div>

          {/* Documents Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                  <th className="p-3">Reference No</th>
                  <th className="p-3">Kichwa cha Hati</th>
                  <th className="p-3">Jamii / Aina</th>
                  <th className="p-3">Mhusika Rasmi</th>
                  <th className="p-3">Mwaka &bull; Tarehe</th>
                  <th className="p-3">Usiri</th>
                  <th className="p-3 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Hakuna hati zilizopatikana kwa vigezo hivi kwenye masjala.
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-teal-50/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-teal-950">
                        <span className="px-2 py-0.5 rounded bg-teal-100/70 border border-teal-200">
                          {doc.referenceNumber}
                        </span>
                        <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                          Toleo {doc.version}
                        </span>
                      </td>

                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex flex-col items-start gap-1">
                          <span>{doc.title}</span>
                          {doc.autoSyncedOffice && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border ${
                                doc.autoSyncedOffice === 'HEADTEACHER'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : doc.autoSyncedOffice === 'ACADEMIC_MASTER'
                                  ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                                  : doc.autoSyncedOffice === 'DISCIPLINE_MASTER'
                                  ? 'bg-rose-50 text-rose-900 border-rose-300'
                                  : doc.autoSyncedOffice === 'ACCOUNTANT'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : 'bg-slate-50 text-slate-800 border-slate-200'
                              }`}
                            >
                              ⚡ Kiotomatiki: {
                                doc.autoSyncedOffice === 'HEADTEACHER' ? 'Mkuu wa Shule' :
                                doc.autoSyncedOffice === 'ACADEMIC_MASTER' ? 'Taaluma' :
                                doc.autoSyncedOffice === 'DISCIPLINE_MASTER' ? 'Nidhamu' :
                                doc.autoSyncedOffice === 'ACCOUNTANT' ? 'Mhasibu' : 'Masjala'
                              }
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-normal">
                            {doc.fileType} &bull; {doc.fileSize} &bull; Mtoa Hati: {doc.uploadedBy}
                          </span>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {doc.documentType}
                        </span>
                      </td>

                      <td className="p-3 text-slate-700">
                        {doc.relatedStudentName ? (
                          <div>
                            <strong className="block">{doc.relatedStudentName}</strong>
                            <span className="text-[10px] font-mono text-slate-500">
                              {doc.relatedStudentId} {doc.relatedClass ? `(${doc.relatedClass})` : ''}
                            </span>
                          </div>
                        ) : doc.relatedStaffName ? (
                          <div>
                            <strong className="block">{doc.relatedStaffName}</strong>
                            <span className="text-[10px] font-mono text-slate-500">{doc.relatedStaffId}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium">Utawala wa Shule</span>
                        )}
                      </td>

                      <td className="p-3 text-slate-700">
                        <span className="font-semibold block">{doc.academicYear} &bull; {doc.term}</span>
                        <span className="text-[10px] text-slate-500 block">{doc.documentDate}</span>
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedDocForPreview(doc)}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-teal-700" />
                            <span>Tazama</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* DOCUMENT PREVIEW & METADATA MODAL */}
        {/* ===================================================================== */}
        {selectedDocForPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-teal-300 max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-teal-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-teal-100 text-teal-950 font-mono font-bold text-xs">
                      {selectedDocForPreview.referenceNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border">
                      Toleo {selectedDocForPreview.version}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {selectedDocForPreview.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedDocForPreview.documentType}</p>

                  {selectedDocForPreview.autoSyncedOffice && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold mt-2">
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>
                        Hati hii imeingizwa kiotomatiki kutoka <strong>
                          {selectedDocForPreview.autoSyncedOffice === 'HEADTEACHER' ? 'Ofisi ya Mkuu wa Shule' :
                           selectedDocForPreview.autoSyncedOffice === 'ACADEMIC_MASTER' ? 'Ofisi ya Taaluma' :
                           selectedDocForPreview.autoSyncedOffice === 'DISCIPLINE_MASTER' ? 'Ofisi ya Mwalimu wa Nidhamu' :
                           selectedDocForPreview.autoSyncedOffice === 'ACCOUNTANT' ? 'Ofisi ya Mhasibu wa Shule' : 'Masjala'}
                        </strong> bila kuhitaji kupakiwa kwa mkono.
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDocForPreview(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Document Metadata Grid (Section 3 Requirement) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Jamii ya Hati:</span>
                  <strong className="text-slate-900">{selectedDocForPreview.category}</strong>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Ngazi ya Usiri:</span>
                  <strong className="text-teal-900">{selectedDocForPreview.confidentialityLevel}</strong>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Mwaka / Muhula:</span>
                  <strong className="text-slate-900">{selectedDocForPreview.academicYear} &bull; {selectedDocForPreview.term}</strong>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Faili:</span>
                  <strong className="text-slate-900">{selectedDocForPreview.fileType} ({selectedDocForPreview.fileSize})</strong>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Tarehe ya Hati:</span>
                  <span className="text-slate-800">{selectedDocForPreview.documentDate}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Tarehe ya Kupakiwa:</span>
                  <span className="text-slate-800">{selectedDocForPreview.uploadDate}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Mhusika:</span>
                  <span className="text-slate-800">
                    {selectedDocForPreview.relatedStudentName || selectedDocForPreview.relatedStaffName || 'Utawala wa Shule'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Mpakiaji:</span>
                  <span className="text-slate-800">{selectedDocForPreview.uploadedBy}</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Maelezo ya Hati:</span>
                <p className="text-slate-700 leading-relaxed">{selectedDocForPreview.description}</p>
                <div className="text-[10px] font-mono text-slate-400 pt-1">
                  Storage Path: {selectedDocForPreview.storageLocation}
                </div>
              </div>

              {/* Version History Box */}
              {selectedDocForPreview.versionHistory && selectedDocForPreview.versionHistory.length > 0 && (
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Historia ya Matoleo ya Hati Hii (Version History):
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {selectedDocForPreview.versionHistory.map((v, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          v.isCurrent
                            ? 'bg-teal-50 border-teal-300 font-bold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div>
                          <span>Toleo {v.versionNumber} &bull; {v.uploadDate} na {v.uploadedBy}</span>
                          <p className="text-[11px] text-slate-500 font-normal">{v.changeDescription}</p>
                        </div>
                        {v.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-200 text-teal-950 text-[10px] font-black">
                            Toleo Hai
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  {!selectedDocForPreview.isArchived ? (
                    <button
                      type="button"
                      onClick={() => handleArchive(selectedDocForPreview)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <FolderArchive className="w-3.5 h-3.5 text-slate-600" />
                      <span>Peleka Archive</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRestore(selectedDocForPreview)}
                      className="px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Rejesha Kutoka Archive</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowVersionModal(true)}
                    className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <History className="w-3.5 h-3.5 text-purple-700" />
                    <span>+ Toleo Jipya (Version)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDocForPreview(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-xs transition-colors"
                  >
                    Funga
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-teal-100" />
                    <span>Chapisha Hati</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* NEW VERSION SUBMISSION MODAL */}
        {/* ===================================================================== */}
        {showVersionModal && selectedDocForPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl border border-purple-300 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <History className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Unda Toleo Jipya la Hati</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVersionModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVersion} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Namba ya Toleo Jipya *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: 2.0 au 3.0"
                    value={newVersionNum}
                    onChange={(e) => setNewVersionNum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Maelezo ya Mabadiliko (Changelog) *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Eleza nini kimebadilika au kurekebishwa kwenye toleo hili jipya..."
                    value={newVersionDesc}
                    onChange={(e) => setNewVersionDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowVersionModal(false)}
                    className="px-3.5 py-2 rounded-xl border font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-900 text-white font-black hover:bg-purple-950"
                  >
                    Hifadhi Toleo Jipya
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SecretaryShell>
  );
}

export default function DocumentRegistryPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Inapakia jalada...</div>}>
      <DocumentRegistryContent />
    </React.Suspense>
  );
}
