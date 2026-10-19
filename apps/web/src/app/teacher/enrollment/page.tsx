'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  UserCheck,
  FileSpreadsheet,
  UploadCloud,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileBadge2,
  Printer,
  X,
  Plus,
  ShieldCheck,
  Phone,
  Calendar,
  MapPin,
  HeartHandshake,
  Check,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  LogOut,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, PRIMARY_CLASSES_LIST, UserAccount } from '@/lib/auth-session';
import {
  getAllEnrolledRecords,
  enrollNewPupil,
  EnrolledStudent,
  CENTRAL_REGISTRY_KEY,
  ENROLLED_RECORDS_KEY,
  getStoredPupilsRegistry,
  savePupilsRegistry,
  INITIAL_PUPILS,
  StudentMark,
} from '@/lib/teacher-data';
import {
  transferStudentOut,
  runStudentProgressionCycle,
  getAllTransferredStudents,
  ProgressionReportItem,
} from '@/lib/allocation-progression';
import { notifyUser } from '@/lib/notifications';

export default function StudentEnrollmentMasterPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [enrolledRecords, setEnrolledRecords] = useState<EnrolledStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [intakeFilter, setIntakeFilter] = useState<'ALL' | 'NEW_INTAKE' | 'TRANSFER'>('ALL');

  // Modals
  const [showManualModal, setShowManualModal] = useState(false);
  const [showExcelUploadModal, setShowExcelUploadModal] = useState(false);
  const [selectedAdmissionSlip, setSelectedAdmissionSlip] = useState<EnrolledStudent | null>(null);

  // Transfer Out State (Kuhama Shule - Preserves record for Secretary)
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [pupilToTransfer, setPupilToTransfer] = useState<EnrolledStudent | null>(null);
  const [destinationSchool, setDestinationSchool] = useState('');
  const [transferReason, setTransferReason] = useState('Uhamisho wa Kikazi wa Wazazi');
  const [transferNotes, setTransferNotes] = useState('');

  // Annual Progression State (Upandishaji wa Madarasa wa Mwaka Mpya)
  const [showProgressionModal, setShowProgressionModal] = useState(false);
  const [progressionBenchmark, setProgressionBenchmark] = useState(50);
  const [newAcademicYear, setNewAcademicYear] = useState('2027');
  const [progressionReport, setProgressionReport] = useState<{
    promotedCount: number;
    retainedCount: number;
    graduatedCount: number;
    report: ProgressionReportItem[];
  } | null>(null);

  // Manual Form
  const [admissionForm, setAdmissionForm] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    gender: 'M' as 'M' | 'F',
    assignedClass: 'Standard 1 (Grade 1)',
    stream: 'Stream A',
    admissionType: 'NEW_INTAKE' as 'NEW_INTAKE' | 'TRANSFER',
    birthDate: '',
    ritaNumber: '',
    parentName: '',
    parentRelationship: 'Mzazi (Baba/Mama)',
    parentPhone: '',
    residence: '',
    previousSchool: '',
    transferLetterRef: '',
    specialNeeds: '',
  });

  // Bulk Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedRows, setParsedRows] = useState<{
    id: string;
    firstName: string;
    middleName: string;
    surname: string;
    gender: 'M' | 'F';
    assignedClass: string;
    stream: string;
    parentName: string;
    parentPhone: string;
    residence: string;
    ritaNumber: string;
    status: 'VALID' | 'WARNING';
    warningMsg?: string;
  }[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Load records on mount
  const refreshRecords = () => {
    let records = getAllEnrolledRecords();

    // If records are empty in localStorage, seed initial records from INITIAL_PUPILS
    if (records.length === 0 && typeof window !== 'undefined') {
      const seeded: EnrolledStudent[] = [];
      Object.entries(INITIAL_PUPILS).forEach(([className, pupils]) => {
        pupils.forEach((p, idx) => {
          const names = p.name.split(' ');
          const fName = names[0] || 'Mwanafunzi';
          const mName = names.length > 2 ? names[1] : '';
          const sName = names.length > 2 ? names.slice(2).join(' ') : names[1] || 'Tanzania';

          seeded.push({
            id: p.id,
            admNo: p.admNo,
            name: p.name,
            gender: p.gender,
            monthlyTest1: p.monthlyTest1,
            monthlyTest2: p.monthlyTest2,
            monthlyAvg: p.monthlyAvg,
            midtermExam: p.midtermExam,
            terminalExam: p.terminalExam,
            mark: p.mark,
            grade: p.grade,
            remarks: p.remarks,
            attendance: p.attendance,
            assignedClass: className,
            stream: idx % 2 === 0 ? 'Stream A' : 'Stream B',
            admissionType: idx < 5 ? 'TRANSFER' : 'NEW_INTAKE',
            birthDate: '2016-04-12',
            ritaNumber: `RITA-TZ-2026-${Math.floor(100000 + Math.random() * 900000)}`,
            parentName: `Mzee ${sName}`,
            parentRelationship: 'Mzazi (Baba)',
            parentPhone: `+255 7${Math.floor(10000000 + Math.random() * 90000000)}`,
            residence: 'Mtaa wa Shule, Kata ya Kati',
            previousSchool: idx < 5 ? 'Shule ya Msingi Uhuru' : '',
            transferLetterRef: idx < 5 ? `TR-2026-${idx + 100}` : '',
            specialNeeds: '',
            enrolledAt: '12 Jan 2026',
            enrolledBy: 'Mwl. Beatrice Kimaro (Ofisi ya Taaluma)',
          });
        });
      });

      try {
        localStorage.setItem(ENROLLED_RECORDS_KEY, JSON.stringify(seeded));
        records = seeded;
      } catch (e) {
        console.error(e);
      }
    }

    setEnrolledRecords(records);
  };

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }
    refreshRecords();
  }, []);

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pupilToTransfer) return;
    if (!destinationSchool.trim()) {
      notifyUser('error', 'Kosa', 'Tafadhali ingiza jina la shule anayohamia mwanafunzi.');
      return;
    }

    const result = transferStudentOut({
      pupilId: pupilToTransfer.admNo,
      destinationSchool: destinationSchool.trim(),
      reason: transferReason,
      authorizedBy: currentUser?.fullName || 'Mwalimu wa Taaluma / Mkuu wa Shule',
      notes: transferNotes,
    });

    if (result.success) {
      notifyUser(
        'success',
        'Mwanafunzi Amehamishwa Shule',
        `Mwanafunzi ${pupilToTransfer.name} amehamishiwa ${destinationSchool}. Rekodi yake ya kihistoria imehifadhiwa salama kwa Katibu wa Shule (School Secretary).`
      );
      setShowTransferModal(false);
      setPupilToTransfer(null);
      refreshRecords();
    } else {
      notifyUser('error', 'Kosa', result.message);
    }
  };

  const handleExecuteProgression = () => {
    const result = runStudentProgressionCycle(progressionBenchmark, newAcademicYear);
    setProgressionReport(result);
    refreshRecords();
    notifyUser(
      'success',
      `Mwaka Mpya wa Masomo ${newAcademicYear}: Upandishaji Umekamilika!`,
      `${result.promotedCount} Wanafunzi wamefaulu na kupanda, ${result.retainedCount} wanarudia darasa, na ${result.graduatedCount} wamehitimu Darasa la Saba (Alumni). Madarasa na masomo ya walimu yamefunguliwa wajaze upya kwa mwaka huu mpya.`
    );
  };

  // Stats calculation
  const totalEnrolled = enrolledRecords.length;
  const totalBoys = enrolledRecords.filter((r) => r.gender === 'M').length;
  const totalGirls = enrolledRecords.filter((r) => r.gender === 'F').length;
  const totalNewIntake = enrolledRecords.filter((r) => r.admissionType === 'NEW_INTAKE').length;
  const totalTransfers = enrolledRecords.filter((r) => r.admissionType === 'TRANSFER').length;

  // Filtered rows
  const filteredRecords = useMemo(() => {
    return enrolledRecords.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.admNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.parentPhone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchClass = classFilter === 'ALL' || r.assignedClass === classFilter;
      const matchGender = genderFilter === 'ALL' || r.gender === genderFilter;
      const matchIntake = intakeFilter === 'ALL' || r.admissionType === intakeFilter;

      return matchSearch && matchClass && matchGender && matchIntake;
    });
  }, [enrolledRecords, searchTerm, classFilter, genderFilter, intakeFilter]);

  // Submit Manual Form
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionForm.firstName || !admissionForm.surname || !admissionForm.parentName || !admissionForm.parentPhone) {
      notifyUser('warning', 'Taarifa Hazijakamilika', 'Tafadhali jaza Jina la Kwanza, Ukoo, Jina la Mzazi na Namba ya Simu.');
      return;
    }

    const enrolledBy = currentUser?.fullName
      ? `${currentUser.fullName} (${currentUser.role === 'ACADEMIC' ? 'Mwl. Taaluma' : currentUser.role === 'HEADTEACHER' ? 'Mkuu wa Shule' : 'Ofisi ya Taaluma'})`
      : 'Ofisi ya Taaluma';

    const newRec = enrollNewPupil({
      firstName: admissionForm.firstName.trim(),
      middleName: admissionForm.middleName.trim(),
      surname: admissionForm.surname.trim(),
      gender: admissionForm.gender,
      assignedClass: admissionForm.assignedClass,
      stream: admissionForm.stream,
      admissionType: admissionForm.admissionType,
      birthDate: admissionForm.birthDate,
      ritaNumber: admissionForm.ritaNumber,
      parentName: admissionForm.parentName.trim(),
      parentRelationship: admissionForm.parentRelationship,
      parentPhone: admissionForm.parentPhone.trim(),
      residence: admissionForm.residence.trim(),
      previousSchool: admissionForm.previousSchool.trim(),
      transferLetterRef: admissionForm.transferLetterRef.trim(),
      specialNeeds: admissionForm.specialNeeds.trim(),
      enrolledBy,
    });

    refreshRecords();
    setShowManualModal(false);
    setSelectedAdmissionSlip(newRec);

    // Reset form
    setAdmissionForm({
      firstName: '',
      middleName: '',
      surname: '',
      gender: 'M',
      assignedClass: 'Standard 1 (Grade 1)',
      stream: 'Stream A',
      admissionType: 'NEW_INTAKE',
      birthDate: '',
      ritaNumber: '',
      parentName: '',
      parentRelationship: 'Mzazi (Baba/Mama)',
      parentPhone: '',
      residence: '',
      previousSchool: '',
      transferLetterRef: '',
      specialNeeds: '',
    });

    notifyUser(
      'success',
      'Mwanafunzi Amesajiliwa Kikamilifu!',
      `${newRec.name} ameingizwa kwenye Daftari Kuu la Udahili (${newRec.admNo}) na atatokea kwenye orodha ya darasa lake.`
    );
  };

  // Download Sample Excel Template
  const handleDownloadExcelTemplate = () => {
    const csvContent =
      'Jina la Kwanza,Jina la Kati,Jina la Ukoo,Jinsia(M/F),Darasa,Mkondo(Stream),Tarehe ya Kuzaliwa(YYYY-MM-DD),Namba ya RITA,Jina la Mzazi/Mlezi,Simu ya Mzazi,Makazi/Mtaa\n' +
      'Emmanuel,Lucas,Mbise,M,Standard 1 (Grade 1),Stream A,2018-05-14,RITA-TZ-2026-904123,Lucas Mbise,+255 754 112 233,Mtaa wa Kati\n' +
      'Zawadi,Peter,Kweka,F,Standard 1 (Grade 1),Stream A,2018-08-20,RITA-TZ-2026-904124,Peter Kweka,+255 768 445 566,Mbuyuni\n' +
      'Baraka,Hamisi,Massawe,M,Standard 7 (Grade 7),Stream B,2012-02-10,RITA-TZ-2026-881201,Hamisi Massawe,+255 712 998 877,Mlimani\n' +
      'Farida,Said,Salum,F,Nursery (Awali),Stream A,2020-11-04,RITA-TZ-2026-773199,Said Salum,+255 784 332 211,Kariakoo';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Sampuli_ya_Excel_Udahili_wa_Wanafunzi_MoEST.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notifyUser('success', 'Sampuli Imepakuliwa', 'Faili la Excel/CSV la mfano limepakuliwa tayari kujazwa.');
  };

  // Handle File Upload & Parse
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);

        if (lines.length <= 1) {
          notifyUser('warning', 'Faili Halina Data', 'Faili lililopakiwa halina mistari ya wanafunzi.');
          setIsProcessingFile(false);
          return;
        }

        const dataRows = lines.slice(1);
        const parsed = dataRows.map((line, idx) => {
          const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          const fName = cols[0] || 'Mwanafunzi';
          const mName = cols[1] || '';
          const sName = cols[2] || 'Tanzania';
          const rawGender = (cols[3] || 'M').toUpperCase();
          const gender: 'M' | 'F' = rawGender.startsWith('F') || rawGender.startsWith('K') ? 'F' : 'M';
          let cls = cols[4] || 'Standard 1 (Grade 1)';

          // Map abbreviations if needed
          if (cls === 'Std 7' || cls === '7' || cls === 'Darasa la 7') cls = 'Standard 7 (Grade 7)';
          else if (cls === 'Std 6' || cls === '6' || cls === 'Darasa la 6') cls = 'Standard 6 (Grade 6)';
          else if (cls === 'Std 5' || cls === '5' || cls === 'Darasa la 5') cls = 'Standard 5 (Grade 5)';
          else if (cls === 'Std 4' || cls === '4' || cls === 'Darasa la 4') cls = 'Standard 4 (Grade 4)';
          else if (cls === 'Std 3' || cls === '3' || cls === 'Darasa la 3') cls = 'Standard 3 (Grade 3)';
          else if (cls === 'Std 2' || cls === '2' || cls === 'Darasa la 2') cls = 'Standard 2 (Grade 2)';
          else if (cls === 'Std 1' || cls === '1' || cls === 'Darasa la 1') cls = 'Standard 1 (Grade 1)';
          else if (cls.toLowerCase().includes('awali') || cls.toLowerCase().includes('nursery')) cls = 'Nursery (Awali)';

          const stream = cols[5] || 'Stream A';
          const rita = cols[7] || `RITA-${Math.floor(100000 + Math.random() * 900000)}`;
          const pName = cols[8] || `Mzazi wa ${fName}`;
          const pPhone = cols[9] || '+255 700 000 000';
          const residence = cols[10] || 'Tanzania';

          const hasValidName = fName.length > 1 && sName.length > 1;
          const status = hasValidName ? 'VALID' : 'WARNING';
          const warningMsg = !hasValidName ? 'Jina limepungua herufi' : undefined;

          return {
            id: `row-${idx}-${Date.now()}`,
            firstName: fName,
            middleName: mName,
            surname: sName,
            gender,
            assignedClass: cls,
            stream,
            parentName: pName,
            parentPhone: pPhone,
            residence,
            ritaNumber: rita,
            status: status as 'VALID' | 'WARNING',
            warningMsg,
          };
        });

        setParsedRows(parsed);
        setIsProcessingFile(false);
        notifyUser('info', 'Faili Limechambuliwa', `Wanafunzi ${parsed.length} wamepatikana kwenye faili.`);
      } catch (err) {
        console.error(err);
        notifyUser('error', 'Hitilafu ya Faili', 'Haikuweza kusoma faili la Excel/CSV. Hakikisha limepangwa kwa koma.');
        setIsProcessingFile(false);
      }
    };

    reader.readAsText(file);
  };

  // Bulk Save Parsed Rows
  const handleConfirmBulkEnrollment = () => {
    if (parsedRows.length === 0) return;

    const enrolledBy = currentUser?.fullName
      ? `${currentUser.fullName} (${currentUser.role === 'ACADEMIC' ? 'Mwl. Taaluma' : currentUser.role === 'HEADTEACHER' ? 'Mkuu wa Shule' : 'Ofisi ya Taaluma'})`
      : 'Ofisi ya Taaluma';

    let count = 0;
    parsedRows.forEach((row) => {
      enrollNewPupil({
        firstName: row.firstName,
        middleName: row.middleName,
        surname: row.surname,
        gender: row.gender,
        assignedClass: row.assignedClass,
        stream: row.stream,
        admissionType: 'NEW_INTAKE',
        birthDate: '2017-06-15',
        ritaNumber: row.ritaNumber,
        parentName: row.parentName,
        parentRelationship: 'Mzazi / Mlezi',
        parentPhone: row.parentPhone,
        residence: row.residence,
        enrolledBy,
      });
      count++;
    });

    refreshRecords();
    setShowExcelUploadModal(false);
    setParsedRows([]);
    if (fileInputRef.current) fileInputRef.current.value = '';

    notifyUser(
      'success',
      'Udahili wa Wengi Umekamilika!',
      `Jumla ya wanafunzi ${count} wameandikishwa rasmi kwenye Daftari Kuu na kuwekwa kwenye madarasa husika.`
    );
  };

  // Export Filtered Table to CSV
  const handleExportToCSV = () => {
    if (filteredRecords.length === 0) {
      notifyUser('warning', 'Hakuna Data', 'Hakuna rekodi zilizopatikana za kuhamisha.');
      return;
    }

    const headers = [
      'Namba ya Usajili',
      'Jina Kamili',
      'Jinsia',
      'Darasa',
      'Mkondo',
      'Aina ya Udahili',
      'Cheti cha RITA',
      'Jina la Mzazi',
      'Simu ya Mzazi',
      'Makazi',
      'Tarehe ya Usajili',
      'Imesajiliwa Na',
    ];

    const rows = filteredRecords.map((r) => [
      `"${r.admNo}"`,
      `"${r.name}"`,
      `"${r.gender}"`,
      `"${r.assignedClass}"`,
      `"${r.stream || 'Stream A'}"`,
      `"${r.admissionType === 'NEW_INTAKE' ? 'Mpya' : 'Uhamisho'}"`,
      `"${r.ritaNumber || '-'}"`,
      `"${r.parentName}"`,
      `"${r.parentPhone}"`,
      `"${r.residence || '-'}"`,
      `"${r.enrolledAt || '-'}"`,
      `"${r.enrolledBy || '-'}"`,
    ]);

    const csvData = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Daftari_Kuu_la_Udahili_Shule_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser('success', 'Daftari Limehamishwa', `Wanafunzi ${filteredRecords.length} wamehamishwa kwenye faili la Excel/CSV.`);
  };

  return (
    <TeacherShell
      pageTitle="Daftari Kuu la Udahili wa Wanafunzi (Student Admission Master)"
      pageDescription="Ofisi za Uongozi wa Shule (Mkuu wa Shule, Mwl. Taaluma, na Mwl. Nidhamu): Usajili na udahili wa wanafunzi wa shule nzima (Chekechea hadi Darasa la 7) kwa mkono (manually) au kwa kupakia faili la Excel/CSV. Data hizi huingia kiotomatiki kwenye madarasa ya walimu."
      requiredRole="LEADERSHIP"
    >
      <div className="space-y-6 animate-fade-in">
        {/* ===================================================================== */}
        {/* 1. TOP STATS CARDS */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase block">Jumla ya Wanafunzi</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{totalEnrolled}</span>
            <span className="text-[11px] text-emerald-800 font-bold">Wamesajiliwa Shuleni</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase block">Wavulana</span>
            <span className="text-2xl font-black text-blue-900 block mt-1">{totalBoys}</span>
            <span className="text-[11px] text-blue-700 font-semibold">{totalEnrolled > 0 ? Math.round((totalBoys / totalEnrolled) * 100) : 0}% ya Wote</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase block">Wasichana</span>
            <span className="text-2xl font-black text-purple-900 block mt-1">{totalGirls}</span>
            <span className="text-[11px] text-purple-700 font-semibold">{totalEnrolled > 0 ? Math.round((totalGirls / totalEnrolled) * 100) : 0}% ya Wote</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase block">Wapya (New Intake)</span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">{totalNewIntake}</span>
            <span className="text-[11px] text-emerald-800 font-semibold">Awali &amp; Darasa la 1</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-slate-500 uppercase block">Uhamisho (Transfers)</span>
            <span className="text-2xl font-black text-amber-900 block mt-1">{totalTransfers}</span>
            <span className="text-[11px] text-amber-700 font-semibold">Kutoka Shule Nyingine</span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. ADMISSION ACTIONS & SEARCH BAR */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-black text-[10px] border border-emerald-300">
                  OFISI ZA UONGOZI (MKUU, TAALUMA &amp; NIDHAMU) &bull; DAFTARI KUU
                </span>
                <span className="text-xs text-slate-500">TAMISEMI / MoEST Standard</span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Daftari Kuu la Udahili wa Wanafunzi (School Admission Registry)
              </h3>
            </div>

            {/* Action Buttons: Manual + Bulk Excel */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadExcelTemplate}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Pakua fomu ya Excel iliyotayarishwa kwa ajili ya kujaza wanafunzi"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Sampuli ya Excel</span>
              </button>

              <button
                type="button"
                onClick={() => setShowExcelUploadModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all"
              >
                <UploadCloud className="w-4 h-4 text-blue-200" />
                <span>Pakia Excel / CSV</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProgressionReport(null);
                  setShowProgressionModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all"
                title="Upandishaji wa madarasa wa wanafunzi kwa mwaka mpya kulingana na ufaulu"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Upandishaji wa Mwaka Mpya</span>
              </button>

              <button
                type="button"
                onClick={() => setShowManualModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-200" />
                <span>+ Sajili Mwanafunzi (Manual)</span>
              </button>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tafuta jina, namba ya usajili, au mzazi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
              {/* Class Filter */}
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Madarasa Yote (Chekechea - La 7)</option>
                <option value="Nursery (Awali)">Awali / Chekechea</option>
                <option value="Standard 1 (Grade 1)">Darasa la 1</option>
                <option value="Standard 2 (Grade 2)">Darasa la 2</option>
                <option value="Standard 3 (Grade 3)">Darasa la 3</option>
                <option value="Standard 4 (Grade 4)">Darasa la 4 (SFNA)</option>
                <option value="Standard 5 (Grade 5)">Darasa la 5</option>
                <option value="Standard 6 (Grade 6)">Darasa la 6</option>
                <option value="Standard 7 (Grade 7)">Darasa la 7 (PSLE)</option>
              </select>

              {/* Gender Filter */}
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Jinsia Zote</option>
                <option value="M">Wavulana (M)</option>
                <option value="F">Wasichana (F)</option>
              </select>

              {/* Intake Filter */}
              <select
                value={intakeFilter}
                onChange={(e) => setIntakeFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Udahili Wote</option>
                <option value="NEW_INTAKE">Wapya (New Intake)</option>
                <option value="TRANSFER">Uhamisho (Transfer)</option>
              </select>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportToCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold flex items-center gap-1.5 transition-colors"
                title="Pakua orodha hii kwenye Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
                <span>Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. MASTER REGISTRY DATA TABLE */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50/70 border-b border-emerald-200 text-emerald-950 font-black uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Namba ya Usajili</th>
                  <th className="py-3 px-4">Jina Kamili la Mwanafunzi</th>
                  <th className="py-3 px-4">Jinsia</th>
                  <th className="py-3 px-4">Darasa &amp; Mkondo</th>
                  <th className="py-3 px-4">Aina ya Udahili</th>
                  <th className="py-3 px-4">Mzazi / Mlezi</th>
                  <th className="py-3 px-4">Simu ya Mzazi</th>
                  <th className="py-3 px-4">Tarehe ya Usajili</th>
                  <th className="py-3 px-4 text-center">Hati ya Udahili</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-slate-600">Hakuna mwanafunzi aliyepatikana</p>
                      <p className="text-xs text-slate-400">Jaribu kubadilisha vigezo vya utafutaji au sajili mwanafunzi mpya.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((pupil, idx) => (
                    <tr key={pupil.id || idx} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-900">{pupil.admNo}</td>
                      <td className="py-3 px-4">
                        <span className="font-black text-slate-900 block">{pupil.name}</span>
                        {pupil.ritaNumber && (
                          <span className="text-[10px] font-mono text-slate-400 block">{pupil.ritaNumber}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            pupil.gender === 'F' ? 'bg-pink-100 text-pink-900' : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {pupil.gender === 'F' ? 'Kike' : 'Kiume'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block">{pupil.assignedClass}</span>
                        <span className="text-[10px] text-emerald-800 font-semibold">{pupil.stream || 'Stream A'}</span>
                      </td>
                      <td className="py-3 px-4">
                        {pupil.admissionType === 'TRANSFER' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px]">
                            Uhamisho
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px]">
                            Mpya
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        <div>{pupil.parentName}</div>
                        <div className="text-[10px] text-slate-400">{pupil.residence || 'Makazi ya Shule'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-900 font-semibold">{pupil.parentPhone}</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{pupil.enrolledAt || '12 Jan 2026'}</td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedAdmissionSlip(pupil)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                            title="Fungua na uchapishe hati rasmi ya udahili"
                          >
                            <FileBadge2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Hati</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPupilToTransfer(pupil);
                              setDestinationSchool('');
                              setTransferReason('Uhamisho wa Kikazi wa Wazazi');
                              setTransferNotes('');
                              setShowTransferModal(true);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                            title="Hamisha mwanafunzi kwenda shule nyingine (Rekodi itabaki kwa Katibu)"
                          >
                            <LogOut className="w-3.5 h-3.5 text-rose-600" />
                            <span>Hama Shule</span>
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
        {/* MODAL 1: SAJILI MWANAFUNZI MMOJA MMOJA (MANUAL ENTRY) */}
        {/* ===================================================================== */}
        {showManualModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5 max-h-[92vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-emerald-200" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Fomu Rasmi ya Usajili na Udahili wa Mwanafunzi
                    </h3>
                    <p className="text-xs text-emerald-800 font-semibold">
                      Ofisi ya Taaluma &bull; TAMISEMI / Wizara ya Elimu (MoEST)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informative Workflow Banner */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Mtiririko wa Kiotomatiki Shuleni:</strong>
                  <span>
                    Mwanafunzi anaposajiliwa hapa, ataingia moja kwa moja kwenye <strong>Daftari Kuu la Shule</strong> na atatokea papo hapo kwenye <strong>orodha ya darasa lake</strong> (Mahudhurio na Kuingiza Alama za Walimu).
                  </span>
                </div>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4 overflow-y-auto pr-1 text-xs">
                {/* Section A: Student Details */}
                <div className="space-y-3">
                  <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] block border-b pb-1">
                    A. Taarifa za Mwanafunzi (Student Personal Particulars)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Jina la Kwanza <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="mf. Emmanuel"
                        value={admissionForm.firstName}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, firstName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Jina la Kati</label>
                      <input
                        type="text"
                        placeholder="mf. Lucas"
                        value={admissionForm.middleName}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, middleName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Jina la Ukoo (Surname) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="mf. Mbise"
                        value={admissionForm.surname}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, surname: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Jinsia</label>
                      <select
                        value={admissionForm.gender}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, gender: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="M">Kiume (Male)</option>
                        <option value="F">Kike (Female)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Tarehe ya Kuzaliwa</label>
                      <input
                        type="date"
                        value={admissionForm.birthDate}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, birthDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Namba ya Cheti cha RITA</label>
                      <input
                        type="text"
                        placeholder="RITA-TZ-XXXXXX"
                        value={admissionForm.ritaNumber}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, ritaNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Class & Admission */}
                <div className="space-y-3 pt-2">
                  <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] block border-b pb-1">
                    B. Darasa &amp; Aina ya Udahili (Class Placement &amp; Intake)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Darasa Analoingia</label>
                      <select
                        value={admissionForm.assignedClass}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, assignedClass: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Nursery (Awali)">Nursery (Awali)</option>
                        <option value="Standard 1 (Grade 1)">Standard 1 (Grade 1)</option>
                        <option value="Standard 2 (Grade 2)">Standard 2 (Grade 2)</option>
                        <option value="Standard 3 (Grade 3)">Standard 3 (Grade 3)</option>
                        <option value="Standard 4 (Grade 4)">Standard 4 (Grade 4 - SFNA)</option>
                        <option value="Standard 5 (Grade 5)">Standard 5 (Grade 5)</option>
                        <option value="Standard 6 (Grade 6)">Standard 6 (Grade 6)</option>
                        <option value="Standard 7 (Grade 7)">Standard 7 (Grade 7 - PSLE)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mkondo (Stream)</label>
                      <select
                        value={admissionForm.stream}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, stream: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Stream A">Stream A</option>
                        <option value="Stream B">Stream B</option>
                        <option value="Stream C">Stream C</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Aina ya Udahili</label>
                      <select
                        value={admissionForm.admissionType}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, admissionType: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="NEW_INTAKE">Mpya (New Intake - Awali / Darasa 1)</option>
                        <option value="TRANSFER">Uhamisho (Transfer kutoka Shule Nyingine)</option>
                      </select>
                    </div>
                  </div>

                  {admissionForm.admissionType === 'TRANSFER' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <div>
                        <label className="font-bold text-amber-900 block mb-1">Shule Aliyotoka (Previous School)</label>
                        <input
                          type="text"
                          placeholder="mf. Shule ya Msingi Uhuru"
                          value={admissionForm.previousSchool}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, previousSchool: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-amber-900 block mb-1">Namba ya Barua ya Uhamisho</label>
                        <input
                          type="text"
                          placeholder="mf. TR-2026/089"
                          value={admissionForm.transferLetterRef}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, transferLetterRef: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section C: Parent / Guardian Details */}
                <div className="space-y-3 pt-2">
                  <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] block border-b pb-1">
                    C. Taarifa za Mzazi / Mlezi (Parent &amp; Guardian Info)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Jina Kamili la Mzazi/Mlezi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="mf. Lucas Mbise"
                        value={admissionForm.parentName}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, parentName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Namba ya Simu ya Mzazi (WhatsApp / SMS) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+255 7XX XXX XXX"
                        value={admissionForm.parentPhone}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, parentPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Uhusiano na Mwanafunzi</label>
                      <select
                        value={admissionForm.parentRelationship}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, parentRelationship: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Mzazi (Baba)">Mzazi (Baba)</option>
                        <option value="Mzazi (Mama)">Mzazi (Mama)</option>
                        <option value="Mlezi / Ndugu">Mlezi / Ndugu</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Makazi / Mtaa / Kijiji</label>
                      <input
                        type="text"
                        placeholder="mf. Mtaa wa Mbuyuni, Nyumba Na. 45"
                        value={admissionForm.residence}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, residence: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
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
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Thibitisha na Weka Kwenye Mfumo</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 2: BULK EXCEL / CSV UPLOAD */}
        {/* ===================================================================== */}
        {showExcelUploadModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5 max-h-[92vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center">
                    <UploadCloud className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Pakia Wanafunzi wa Shule Nzima kwa Excel / CSV
                    </h3>
                    <p className="text-xs text-slate-500">
                      Weka faili la wanafunzi (Chekechea hadi Darasa la 7) ili kusajili wengi kwa wakati mmoja.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowExcelUploadModal(false);
                    setParsedRows([]);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instructions & Template Download */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-blue-950 block">Hatua za Kupakia:</span>
                  <span className="text-blue-900">
                    1. Pakua sampuli &bull; 2. Jaza majina ya wanafunzi &bull; 3. Chagua faili lako &bull; 4. Thibitisha.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadExcelTemplate}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pakua Sampuli (.csv)</span>
                </button>
              </div>

              {/* File Dropzone */}
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-6 text-center space-y-2 bg-slate-50/50 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-file-upload-input"
                />
                <label
                  htmlFor="excel-file-upload-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-xs sm:text-sm">
                      Bofya hapa kuchagua faili la Excel/CSV au buruta hapa
                    </span>
                    <span className="text-[11px] text-slate-500">Inasaidia faili za .csv, .xlsx</span>
                  </div>
                </label>
              </div>

              {/* Parsed Preview Table */}
              {parsedRows.length > 0 && (
                <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Muhtasari wa Wanafunzi Waliopatikana ({parsedRows.length}):</span>
                    <span className="text-emerald-800">Wote tayari kusajiliwa ✓</span>
                  </div>

                  <div className="border rounded-2xl overflow-y-auto max-h-48 text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 sticky top-0 font-bold text-slate-600">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Jina Kamili</th>
                          <th className="p-2">Jinsia</th>
                          <th className="p-2">Darasa</th>
                          <th className="p-2">Mkondo</th>
                          <th className="p-2">Mzazi</th>
                          <th className="p-2">Simu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedRows.map((row, i) => (
                          <tr key={row.id}>
                            <td className="p-2 text-slate-400 font-mono">{i + 1}</td>
                            <td className="p-2 font-bold text-slate-800">
                              {row.firstName} {row.middleName} {row.surname}
                            </td>
                            <td className="p-2">{row.gender}</td>
                            <td className="p-2">{row.assignedClass}</td>
                            <td className="p-2">{row.stream}</td>
                            <td className="p-2 text-slate-600">{row.parentName}</td>
                            <td className="p-2 font-mono text-emerald-800">{row.parentPhone}</td>
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
                    setShowExcelUploadModal(false);
                    setParsedRows([]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Ghairi
                </button>
                <button
                  type="button"
                  disabled={parsedRows.length === 0}
                  onClick={handleConfirmBulkEnrollment}
                  className={`px-6 py-2.5 rounded-xl text-white font-black text-xs shadow-md flex items-center gap-1.5 ${
                    parsedRows.length > 0
                      ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Sajili Wanafunzi Wote {parsedRows.length > 0 && `(${parsedRows.length})`}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 3: HATI RASMI YA UDAHILI WA MWANAFUNZI (PRINTABLE SLIP) */}
        {/* ===================================================================== */}
        {selectedAdmissionSlip && (
          <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileBadge2 className="w-6 h-6 text-emerald-800" />
                  <h3 className="font-black text-slate-900 text-base">Hati Rasmi ya Udahili Shuleni</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAdmissionSlip(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Document Body */}
              <div className="p-5 border-2 border-emerald-800/40 rounded-2xl bg-emerald-50/20 space-y-4 text-xs font-serif leading-relaxed">
                <div className="text-center space-y-0.5 border-b border-emerald-800/20 pb-3 font-sans">
                  <h4 className="font-black text-slate-900 text-sm tracking-wide">
                    JAMHURI YA MUUNGANO WA TANZANIA
                  </h4>
                  <p className="font-bold text-slate-700 text-xs">
                    OFISI YA RAIS - TAMISEMI &bull; WIZARA YA ELIMU
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-900">
                    SHULE YA MSINGI NA AWALI YA MFANO &bull; CHETI CHA UDAHILI
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 font-sans">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Namba ya Usajili:</span>
                    <span className="font-mono font-black text-emerald-900 text-sm">{selectedAdmissionSlip.admNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Tarehe ya Usajili:</span>
                    <span className="font-bold text-slate-800">{selectedAdmissionSlip.enrolledAt}</span>
                  </div>
                </div>

                <div className="space-y-1 font-sans">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Jina Kamili la Mwanafunzi:</span>
                  <span className="text-base font-black text-slate-900 block">{selectedAdmissionSlip.name}</span>
                  <span className="text-[11px] text-slate-600">
                    Jinsia: <strong>{selectedAdmissionSlip.gender === 'F' ? 'Kike' : 'Kiume'}</strong> &bull; Darasa: <strong>{selectedAdmissionSlip.assignedClass} ({selectedAdmissionSlip.stream || 'Stream A'})</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 font-sans">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Mzazi / Mlezi:</span>
                    <span className="font-bold text-slate-800 block">{selectedAdmissionSlip.parentName}</span>
                    <span className="font-mono text-emerald-800 text-[11px]">{selectedAdmissionSlip.parentPhone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Makazi:</span>
                    <span className="font-semibold text-slate-700 block">{selectedAdmissionSlip.residence || 'Hajajaza'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-dashed border-emerald-300 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                  <div>
                    <span>Imethibitishwa na: <strong>{selectedAdmissionSlip.enrolledBy}</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Muhuri Rasmi wa Shule
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAdmissionSlip(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Funga
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4 text-emerald-200" />
                  <span>Chapisha Hati (Print)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 4: KUHAMA SHULE (TRANSFER OUT) */}
        {/* ===================================================================== */}
        {showTransferModal && pupilToTransfer && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 animate-scale-up space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Uhamisho wa Mwanafunzi (Transfer Out)</h3>
                    <p className="text-xs text-slate-500">Mwanafunzi anapohamia shule nyingine</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informative Rule Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  Kanuni ya Uhifadhi wa Kumbukumbu:
                </span>
                <p className="text-[11px] leading-relaxed text-amber-900/90">
                  Mwanafunzi huyu ataondolewa kwenye madarasa ya walimu na kwenye portal ya wazazi ili asisumbue mahudhurio na uwekaji alama. <strong>Hati na rekodi yake yote ya kihistoria itabaki salama kwa Katibu wa Shule (Secretary Registry)</strong> kwa ajili ya uthibitisho wa baadaye.
                </p>
              </div>

              <form onSubmit={handleConfirmTransfer} className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Mwanafunzi Anayehama:</span>
                  <div className="text-sm font-black text-slate-900">{pupilToTransfer.name}</div>
                  <div className="text-[11px] text-emerald-800 font-medium font-mono">
                    {pupilToTransfer.admNo} &bull; {pupilToTransfer.assignedClass}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Shule Anayokwenda / Anayohamia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Shule ya Msingi Mlimani, Dar es Salaam"
                    value={destinationSchool}
                    onChange={(e) => setDestinationSchool(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Sababu ya Kuhama *
                  </label>
                  <select
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:outline-emerald-800 bg-white"
                  >
                    <option value="Uhamisho wa Kikazi wa Wazazi">Uhamisho wa Kikazi wa Wazazi</option>
                    <option value="Kubadilisha Makazi ya Familia">Kubadilisha Makazi ya Familia</option>
                    <option value="Sababu za Kiafya za Mwanafunzi">Sababu za Kiafya za Mwanafunzi</option>
                    <option value="Kujiunga na Shule ya Bweni">Kujiunga na Shule ya Bweni</option>
                    <option value="Sababu Nyingine za Kifamilia">Sababu Nyingine za Kifamilia</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Maelezo ya Ziada / Namba ya Barua ya Uhamisho</label>
                  <textarea
                    rows={2}
                    placeholder="Namba ya kibali cha afisa elimu au maelezo ya jalada..."
                    value={transferNotes}
                    onChange={(e) => setTransferNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-800"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-black shadow-md flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Thibitisha Uhamisho (Hamisha)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 5: UPANDISHAJI WA MADARASA WA MWAKA MPYA (ANNUAL PROGRESSION) */}
        {/* ===================================================================== */}
        {showProgressionModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-purple-200 animate-scale-up space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Upandishaji wa Madarasa wa Mwaka Mpya (Annual Student Progression)
                    </h3>
                    <p className="text-xs text-purple-800 font-semibold">
                      Mwalimu Mkuu &bull; Mwalimu wa Taaluma &bull; TAMISEMI
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProgressionModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!progressionReport ? (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-2">
                    <span className="font-bold flex items-center gap-1.5 text-purple-900 text-sm">
                      <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                      Kanuni ya Kiotomatiki ya Upandishaji wa Madarasa:
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-[11px] text-purple-900/90 leading-relaxed">
                      <li>Wanafunzi wenye wastani uliofikia au kuvuka kiwango cha ufaulu watapandishwa kwenda darasa linalofuata (mf. La 1 &rarr; La 2 &rarr; La 3 ... La 7 &rarr; Alumni).</li>
                      <li>Wanafunzi wasiofikisha wastani <strong>hawapandi darasa (wanarudia)</strong> na wazazi wao wanapewa taarifa rasmi.</li>
                      <li>Madarasa na masomo ya walimu <strong>yatafunguliwa na kufutwa kiotomatiki</strong> ili kila mwalimu ajaze upya masomo anayofundisha kwa mwaka huu mpya.</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Kiwango cha Kufaulu (Passing Benchmark %) *
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={30}
                          max={75}
                          value={progressionBenchmark}
                          onChange={(e) => setProgressionBenchmark(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-sm text-purple-950 focus:outline-purple-800"
                        />
                        <span className="font-bold text-slate-500">%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Wastani wa chini wa kupanda darasa (Chaguomsingi: 50%)
                      </span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Mwaka Mpya wa Masomo *
                      </label>
                      <input
                        type="text"
                        value={newAcademicYear}
                        onChange={(e) => setNewAcademicYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-black text-sm text-purple-950 focus:outline-purple-800"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Mwaka unaofuata wa masomo (mfano: 2027)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowProgressionModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >
                      Ghairi
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteProgression}
                      className="px-6 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-black shadow-md flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-purple-200" />
                      <span>Tekeleza Upandishaji Sasa</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Report View */
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 block">Wamepanda Darasa</span>
                      <span className="text-2xl font-black text-emerald-950">{progressionReport.promotedCount}</span>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-rose-800 block">Wanarudia Darasa</span>
                      <span className="text-2xl font-black text-rose-950">{progressionReport.retainedCount}</span>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase text-purple-800 block">Wamehitimu (Alumni)</span>
                      <span className="text-2xl font-black text-purple-950">{progressionReport.graduatedCount}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 text-[11px]">
                    <strong>Mabadiliko Yamekamilika:</strong> Wanafunzi wote wamepata madarasa yao mapya ya mwaka {newAcademicYear}. Madarasa na masomo ya walimu yamefunguliwa ili wajaze upya.
                  </div>

                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 font-bold sticky top-0">
                        <tr>
                          <th className="p-2">Jina la Mwanafunzi</th>
                          <th className="p-2">Darasa la Awali</th>
                          <th className="p-2">Darasa Jipya</th>
                          <th className="p-2">Wastani</th>
                          <th className="p-2">Hali</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {progressionReport.report.slice(0, 20).map((r, i) => (
                          <tr key={i}>
                            <td className="p-2 font-bold text-slate-800">{r.name}</td>
                            <td className="p-2 text-slate-500">{r.previousClass}</td>
                            <td className="p-2 font-bold text-purple-900">{r.promotedClass}</td>
                            <td className="p-2 font-mono font-bold">{r.averageScore}%</td>
                            <td className="p-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                r.status === 'PROMOTED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : r.status === 'GRADUATED_ALUMNI'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {r.status === 'PROMOTED' ? 'Amepanda' : r.status === 'GRADUATED_ALUMNI' ? 'Amehitimu' : 'Anarudia'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowProgressionModal(false)}
                      className="px-5 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold"
                    >
                      Kamilisha na Funga
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
