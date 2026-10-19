'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  Building2,
  Users,
  UserCheck,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import SecretaryShell from '@/components/secretary-shell';
import {
  uploadNewDocument,
  DocumentCategory,
  ConfidentialityLevel,
} from '@/lib/secretary-data';
import { getAllEnrolledRecords } from '@/lib/teacher-data';
import { getStoredAccounts } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];

function DocumentUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillStudentId = searchParams.get('studentId') || '';

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [docTitle, setDocTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('STUDENT_RECORDS');
  const [documentType, setDocumentType] = useState('Admission Form');
  const [refNumber, setRefNumber] = useState('');
  const [academicYear, setAcademicYear] = useState('2026');
  const [term, setTerm] = useState('Term I');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [confidentiality, setConfidentiality] = useState<ConfidentialityLevel>('INTERNAL');
  const [description, setDescription] = useState('');

  // Associations
  const [relatedStudentId, setRelatedStudentId] = useState(prefillStudentId);
  const [relatedStaffId, setRelatedStaffId] = useState('');
  const [relatedClass, setRelatedClass] = useState('');

  // Selected File
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeFormatted: string;
    extension: string;
  } | null>(null);

  const [pupils, setPupils] = useState<{ identifier: string; fullName: string; class: string }[]>([]);
  const [staffList, setStaffList] = useState<{ identifier: string; fullName: string; role: string }[]>([]);

  useEffect(() => {
    const rawPupils = getAllEnrolledRecords();
    setPupils(rawPupils.map((p) => ({ identifier: p.admNo, fullName: p.name, class: p.assignedClass })));

    const rawAccounts = getStoredAccounts();
    setStaffList(
      rawAccounts
        .filter((a) => ['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE', 'TEACHER', 'SECRETARY'].includes(a.role))
        .map((a) => ({ identifier: a.identifier, fullName: a.fullName, role: a.role }))
    );

    // Auto-generate a clean reference number
    const rand = Math.floor(1000 + Math.random() * 9000);
    setRefNumber(`KPS/REG/2026/${rand}`);
  }, []);

  // Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      notifyUser(
        'error',
        'Aina ya Faili Haikubaliki',
        `Mfumo unakubali faili za PDF, DOC, DOCX, XLS, XLSX, JPG, na PNG pekee. Faili za executable haziruhusiwi kwa sababu za kiusalama.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 25) {
      notifyUser('warning', 'Faili ni Kubwa Mno', 'Ukubwa wa juu wa faili ni 25 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const sizeFormatted = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;

    setSelectedFile({
      name: file.name,
      sizeFormatted,
      extension: ext.toUpperCase(),
    });

    // Auto fill title if empty
    if (!docTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setDocTitle(cleanName);
    }
  };

  // Submit Handler
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!docTitle.trim()) {
      notifyUser('warning', 'Kichwa cha Hati Kinahitajika', 'Tafadhali weka jina au kichwa cha hati hii.');
      return;
    }

    const matchedStudent = pupils.find((p) => p.identifier === relatedStudentId);
    const matchedStaff = staffList.find((s) => s.identifier === relatedStaffId);

    const uploaded = uploadNewDocument({
      title: docTitle.trim(),
      category,
      documentType,
      description: description.trim() || 'Hati rasmi iliyopakiwa na kusajiliwa masjalani.',
      referenceNumber: refNumber.trim() || `KPS/DOC/${Date.now().toString().slice(-4)}`,
      academicYear,
      term,
      documentDate: docDate,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
      relatedStudentId: matchedStudent?.identifier,
      relatedStudentName: matchedStudent?.fullName,
      relatedStaffId: matchedStaff?.identifier,
      relatedStaffName: matchedStaff?.fullName,
      relatedClass: matchedStudent?.class || relatedClass || undefined,
      relatedSchool: 'Kukumbuka Primary & Nursery School',
      institutionId: 'inst-001',
      confidentialityLevel: confidentiality,
      status: 'ACTIVE',
      version: '1.0',
      fileType: (selectedFile?.extension as any) || 'PDF',
      fileSize: selectedFile?.sizeFormatted || '1.2 MB',
      storageLocation: `secure-vault/${category.toLowerCase()}/${selectedFile?.name || 'document.pdf'}`,
      isArchived: false,
    });

    notifyUser(
      'success',
      'Hati Imepakiwa & Kusajiliwa!',
      `Hati "${uploaded.title}" imehifadhiwa kikamilifu kwenye Masjala Kuu chini ya namba ${uploaded.referenceNumber}.`
    );

    router.push(`/secretary/registry?view=${uploaded.id}`);
  };

  return (
    <SecretaryShell
      pageTitle="Pakia Hati Mpya (Upload Document)"
      pageDescription="Ofisi ya Katibu wa Shule: Upakiaji wa hati rasmi za shule (PDF, DOCX, XLSX, Picha). Kila hati inahitaji metadata sahihi, namba ya kumbukumbu, na ngazi ya usiri kabla ya kuhifadhiwa."
    >
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <form onSubmit={handleUploadSubmit} className="space-y-6">
          {/* 1. File Dropzone Box */}
          <div className="bg-white/95 rounded-3xl border-2 border-dashed border-teal-300 p-6 sm:p-8 text-center space-y-3 hover:border-teal-500 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900">
                {selectedFile ? selectedFile.name : 'Chagua au Buruta Faili la Hati Hapa'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inakubali: <strong>PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</strong> (Upeo wa 25 MB)
              </p>
            </div>

            {selectedFile && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Faili Limekaguliwa: {selectedFile.extension} ({selectedFile.sizeFormatted})</span>
              </div>
            )}

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="inline-block py-2.5 px-5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-black text-xs cursor-pointer shadow-md transition-all"
              >
                {selectedFile ? 'Badilisha Faili' : 'Vinjari Faili Kwenye Kompyuta'}
              </label>
            </div>
          </div>

          {/* 2. Structured Metadata Card (Section 9 Requirement) */}
          <div className="bg-white/95 rounded-3xl border border-teal-200/80 p-6 shadow-xs space-y-5">
            <div className="border-b border-teal-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">
                HATUA YA 2: METADATA &amp; TAARIFA ZA USAJILI
              </span>
              <h3 className="text-base font-black text-slate-900 mt-0.5">
                Kumbukumbu Rasmi ya Hati (Official Document Metadata)
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              {/* Document Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kichwa Rasmi cha Hati (Document Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mfano: Cheti cha Kuzaliwa cha RITA — Juma Bakari au Mwongozo wa Mitihani"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-900 font-semibold"
                />
              </div>

              {/* Category & Document Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jamii ya Hati (Document Category) *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
                  >
                    <option value="STUDENT_RECORDS">Kumbukumbu za Wanafunzi (Student Records)</option>
                    <option value="STAFF_RECORDS">Kumbukumbu za Walimu (Staff Records)</option>
                    <option value="SCHOOL_ADMINISTRATION">Utawala wa Shule (School Administration)</option>
                    <option value="ACADEMIC_RECORDS">Nyaraka za Kitaaluma (Academic Records)</option>
                    <option value="FINANCIAL_DOCUMENTS">Hati za Fedha (Financial Storage)</option>
                    <option value="MEETINGS_AND_CORRESPONDENCE">Mikutano &amp; Barua (Meetings &amp; Correspondence)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Aina Maalum ya Hati (Document Type) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Birth Certificate, Admission Form, Appointment Letter"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Reference Number & Confidentiality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Namba ya Kumbukumbu (Reference Number) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: KPS/REG/2026/014"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none text-teal-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ngazi ya Usiri (Confidentiality Level) *
                  </label>
                  <select
                    value={confidentiality}
                    onChange={(e) => setConfidentiality(e.target.value as ConfidentialityLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
                  >
                    <option value="INTERNAL">INTERNAL — Ndani ya Shule</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL — Siri</option>
                    <option value="RESTRICTED">RESTRICTED — Wenye Idhini Maalum</option>
                    <option value="HIGHLY_CONFIDENTIAL">HIGHLY_CONFIDENTIAL — Siri Kubwa</option>
                    <option value="PUBLIC">PUBLIC — Wazi kwa Wote</option>
                  </select>
                </div>
              </div>

              {/* Year & Term & Document Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mwaka wa Masomo *</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Muhula *</label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  >
                    <option value="Term I">Muhula wa 1</option>
                    <option value="Term II">Muhula wa 2</option>
                    <option value="Mwaka Mzima">Mwaka Mzima</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tarehe ya Hati *</label>
                  <input
                    type="date"
                    required
                    value={docDate}
                    onChange={(e) => setDocDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              {/* Associations (Student or Staff) */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-3">
                <span className="font-black text-teal-950 uppercase text-[10px] tracking-wider block">
                  Uhusiano wa Hati (Related Student / Staff)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Mwanafunzi Mhusika (Student ID / Adm No):
                    </label>
                    <select
                      value={relatedStudentId}
                      onChange={(e) => setRelatedStudentId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                    >
                      <option value="">-- Hakuna (Sio ya Mwanafunzi) --</option>
                      {pupils.map((p) => (
                        <option key={p.identifier} value={p.identifier}>
                          {p.identifier} — {p.fullName} ({p.class})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Mwalimu / Mtumishi Mhusika (Staff ID):
                    </label>
                    <select
                      value={relatedStaffId}
                      onChange={(e) => setRelatedStaffId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                    >
                      <option value="">-- Hakuna (Sio ya Mwalimu) --</option>
                      {staffList.map((s) => (
                        <option key={s.identifier} value={s.identifier}>
                          {s.identifier} — {s.fullName} ({s.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Maelezo ya Hati (Description)</label>
                <textarea
                  rows={2}
                  placeholder="Maelezo mafupi kuhusu hati hii na muktadha wake..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-teal-100">
              <Link
                href="/secretary/registry"
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-xs transition-colors"
              >
                Ghairi
              </Link>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-black text-xs shadow-md shadow-teal-950/20 transition-all flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4 text-teal-200" />
                <span>Hifadhi &amp; Sajili Hati Masjalani</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </SecretaryShell>
  );
}

export default function DocumentUploadPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Inapakia fomu...</div>}>
      <DocumentUploadContent />
    </React.Suspense>
  );
}
