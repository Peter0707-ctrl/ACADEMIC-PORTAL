'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Search,
  Filter,
  User,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  ArrowRight,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  X,
  Printer,
  ChevronRight,
  Plus,
  Trash2,
  ShieldCheck,
  Building2,
  FileText,
  UserCheck,
  MapPin,
  HeartHandshake,
  Check,
  FileBadge2,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import {
  getCurrentSession,
  setCurrentSession,
  getStoredAccounts,
  saveStoredAccounts,
  PRIMARY_CLASSES_LIST,
  PRIMARY_SUBJECTS_LIST,
  UserAccount,
  TeachingLoad,
} from '@/lib/auth-session';
import {
  getPupilsForClass,
  getAllEnrolledRecords,
  enrollNewPupil,
  EnrolledStudent,
  StudentMark,
  CENTRAL_REGISTRY_KEY,
} from '@/lib/teacher-data';
import { notifyUser } from '@/lib/notifications';

export default function MyClassesPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<'MY_CLASSES' | 'CENTRAL_REGISTRY'>('MY_CLASSES');

  // Teaching Assignments
  const [teachingAssignments, setTeachingAssignments] = useState<TeachingLoad[]>([
    { class: 'Standard 7 (Grade 7)', subject: 'Civic & Moral Education (Uraia na Maadili)' },
    { class: 'Standard 6 (Grade 6)', subject: 'Social Studies (Maarifa ya Jamii)' },
  ]);

  // Modal: Add Class & Subject to Teaching Load
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassToAdd, setNewClassToAdd] = useState<string>(PRIMARY_CLASSES_LIST[0]);
  const [newSubjectToAdd, setNewSubjectToAdd] = useState<string>(PRIMARY_SUBJECTS_LIST[0]);

  // Pupil Roster Modal
  const [rosterClassModal, setRosterClassModal] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [selectedPupil, setSelectedPupil] = useState<StudentMark | null>(null);

  // Student Admission & Enrollment State
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [enrolledRecords, setEnrolledRecords] = useState<EnrolledStudent[]>([]);
  const [registrySearchTerm, setRegistrySearchTerm] = useState('');
  const [registryClassFilter, setRegistryClassFilter] = useState('ALL');
  const [registryGenderFilter, setRegistryGenderFilter] = useState('ALL');
  const [selectedAdmissionSlip, setSelectedAdmissionSlip] = useState<EnrolledStudent | null>(null);

  // Admission Form Fields (MoEST & TAMISEMI Standards)
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

  // Load Session and Enrolled Records
  const refreshRecords = () => {
    const records = getAllEnrolledRecords();
    setEnrolledRecords(records);
  };

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      if (session.teachingAssignments && session.teachingAssignments.length > 0) {
        setTeachingAssignments(session.teachingAssignments);
      } else if (session.assignedClasses && session.assignedClasses.length > 0) {
        const built = session.assignedClasses.map((cls, idx) => ({
          class: cls,
          subject: (session.subjects && session.subjects[idx]) || 'Civic & Moral Education (Uraia na Maadili)',
        }));
        setTeachingAssignments(built);
      }
    }
    refreshRecords();
  }, []);

  // Usajili wa Wanafunzi Wapya: Strictly Mwalimu wa Taaluma (Academic) na Mwalimu Mkuu (Headmaster) tu!
  const isAcademicMaster =
    currentUser?.role === 'ACADEMIC' ||
    currentUser?.leadershipRole === 'ACADEMIC' ||
    currentUser?.leadershipRole === 'ASSISTANT_ACADEMIC';

  const isHeadmaster =
    currentUser?.role === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'SECOND_MASTER' ||
    currentUser?.role === 'ADMIN';

  const isAuthorizedToEnroll = isAcademicMaster || isHeadmaster;

  // Handler: Add Class and Subject to Teacher's Load
  const handleAddClassAndSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const exists = teachingAssignments.some(
      (a) => a.class === newClassToAdd && a.subject === newSubjectToAdd
    );
    if (exists) {
      notifyUser('warning', 'Mgawo Upo Tayari', `${newClassToAdd} somo la ${newSubjectToAdd} tayari lipo kwenye ratiba yako.`);
      return;
    }

    const updatedAssignments: TeachingLoad[] = [
      ...teachingAssignments,
      { class: newClassToAdd, subject: newSubjectToAdd },
    ];
    const updatedClasses = Array.from(new Set(updatedAssignments.map((a) => a.class)));
    const updatedSubjects = Array.from(new Set(updatedAssignments.map((a) => a.subject)));

    const updatedUser: UserAccount = {
      ...currentUser,
      teachingAssignments: updatedAssignments,
      assignedClasses: updatedClasses,
      assignedClass: updatedClasses.join(', '),
      subjects: updatedSubjects,
    };

    setCurrentUser(updatedUser);
    setTeachingAssignments(updatedAssignments);
    setCurrentSession(updatedUser);

    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    setShowAddClassModal(false);
    notifyUser('success', 'Darasa na Somo Limeongezwa', `${newClassToAdd} — somo la ${newSubjectToAdd} limeongezwa kikamilifu.`);
  };

  const handleRemoveAssignment = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (teachingAssignments.length <= 1) {
      notifyUser('warning', 'Kizuizi', 'Lazima ubakiwe na angalau darasa na somo moja unalofundisha.');
      return;
    }

    const removed = teachingAssignments[indexToRemove];
    const updatedAssignments = teachingAssignments.filter((_, idx) => idx !== indexToRemove);
    const updatedClasses = Array.from(new Set(updatedAssignments.map((a) => a.class)));
    const updatedSubjects = Array.from(new Set(updatedAssignments.map((a) => a.subject)));

    const updatedUser: UserAccount = {
      ...currentUser,
      teachingAssignments: updatedAssignments,
      assignedClasses: updatedClasses,
      assignedClass: updatedClasses.join(', '),
      subjects: updatedSubjects,
    };

    setCurrentUser(updatedUser);
    setTeachingAssignments(updatedAssignments);
    setCurrentSession(updatedUser);

    const allAccounts = getStoredAccounts();
    const updatedAccounts = allAccounts.map((a) => (a.id === updatedUser.id ? updatedUser : a));
    saveStoredAccounts(updatedAccounts);

    notifyUser('info', 'Darasa Limeondolewa', `${removed.class} — ${removed.subject} limeondolewa.`);
  };

  // Handler: Enroll Student (MoEST / TAMISEMI Process)
  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorizedToEnroll) {
      notifyUser('warning', 'Kizuizi cha Mamlaka', 'Usajili wa wanafunzi wapya unaruhusiwa kwa Mwalimu wa Taaluma na Mwalimu Mkuu pekee.');
      return;
    }

    if (!admissionForm.firstName || !admissionForm.surname || !admissionForm.parentName || !admissionForm.parentPhone) {
      notifyUser('warning', 'Taarifa Hazijakamilika', 'Tafadhali jaza Majina ya mwanafunzi, Jina la Mzazi na Nambari ya Simu.');
      return;
    }

    const enrolledBy = currentUser?.fullName
      ? `${currentUser.fullName} (${currentUser.role === 'ACADEMIC' ? 'Mwalimu wa Taaluma' : currentUser.role === 'HEADTEACHER' ? 'Mwalimu Mkuu' : 'Ofisi ya Taaluma'})`
      : 'Ofisi ya Taaluma';

    const newRecord = enrollNewPupil({
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
    setShowAdmissionModal(false);

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
      `${newRecord.name} ameingizwa ${newRecord.assignedClass} (${newRecord.admNo}). Mwalimu wa darasa na Katibu wanampata mara moja.`
    );
  };

  // Pupils for currently opened roster modal
  const rosterPupils: StudentMark[] = rosterClassModal
    ? getPupilsForClass(rosterClassModal)
    : [];

  const filteredRosterPupils = rosterPupils.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.admNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'ALL' || p.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  // Filtered Central Registry Records
  const filteredCentralRecords = enrolledRecords.filter((rec) => {
    const matchesSearch =
      rec.name.toLowerCase().includes(registrySearchTerm.toLowerCase()) ||
      rec.admNo.toLowerCase().includes(registrySearchTerm.toLowerCase()) ||
      rec.parentName.toLowerCase().includes(registrySearchTerm.toLowerCase()) ||
      rec.parentPhone.includes(registrySearchTerm);
    const matchesClass = registryClassFilter === 'ALL' || rec.assignedClass === registryClassFilter;
    const matchesGender = registryGenderFilter === 'ALL' || rec.gender === registryGenderFilter;
    return matchesSearch && matchesClass && matchesGender;
  });

  const totalBoysEnrolled = enrolledRecords.filter((r) => r.gender === 'M').length;
  const totalGirlsEnrolled = enrolledRecords.filter((r) => r.gender === 'F').length;
  const totalNewIntake = enrolledRecords.filter((r) => r.admissionType === 'NEW_INTAKE').length;
  const totalTransfers = enrolledRecords.filter((r) => r.admissionType === 'TRANSFER').length;

  return (
    <TeacherShell
      pageTitle="Madarasa Yangu & Usajili wa Wanafunzi (My Classes & Student Admission)"
      pageDescription="Usimamizi wa madarasa unayofundisha, orodha ya wanafunzi, na Daftari Kuu la Udahili wa Shule (MoEST & TAMISEMI Compliant)."
    >
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
        {/* ================================================================= */}
        {/* 1. TOP HEADER & MAIN TAB NAVIGATION */}
        {/* ================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-emerald-200 shadow-xs">
          <div className="flex items-center gap-2 bg-emerald-50/80 p-1.5 rounded-2xl border border-emerald-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('MY_CLASSES')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
                activeTab === 'MY_CLASSES'
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                  : 'text-emerald-950 hover:bg-emerald-100/70'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>Madarasa Ninayofundisha ({teachingAssignments.length})</span>
            </button>

            {/* Daftari Kuu: Strictly for ACADEMIC MASTER and HEADMASTER */}
            {isAuthorizedToEnroll && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('CENTRAL_REGISTRY');
                  refreshRecords();
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
                  activeTab === 'CENTRAL_REGISTRY'
                    ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                    : 'text-emerald-950 hover:bg-emerald-100/70'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-300" />
                <span>Daftari Kuu la Udahili (School Record &amp; Katibu)</span>
                {enrolledRecords.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-mono text-[10px] font-bold">
                    {enrolledRecords.length}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Student Admission Button: Strictly for ACADEMIC MASTER and HEADMASTER ONLY (Hidden for other teachers) */}
            {isAuthorizedToEnroll && (
              <button
                type="button"
                onClick={() => setShowAdmissionModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <UserCheck className="w-4 h-4 text-emerald-200" />
                <span>+ Sajili Mwanafunzi (Taaluma)</span>
              </button>
            )}

            {/* Add Class/Subject to load */}
            <button
              type="button"
              onClick={() => setShowAddClassModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ongeza Somo na Darasa</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. TAB 1: TEACHER'S ASSIGNED CLASSES */}
        {/* ================================================================= */}
        {activeTab === 'MY_CLASSES' && (
          <div className="space-y-6">
            {/* Automatic Synchronization Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-4 rounded-3xl border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">
                    Usawazishaji wa Kiotomatiki (Automatic Teacher Sync):
                  </h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Mwanafunzi anapoandikishwa na Mwalimu wa Taaluma kwenye darasa lako, anatokea mara moja hapa, kwenye Mahudhurio na kwenye kuweka Alama.
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-emerald-900 font-bold bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs inline-block">
                  Mwalimu: {currentUser?.fullName || 'Mwl. Augustine Mrosso'}
                </span>
              </div>
            </div>

            {/* Teaching Classes Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {teachingAssignments.map((assignment, index) => {
                const classPupils = getPupilsForClass(assignment.class);
                const pupilCount = classPupils.length;
                const boys = classPupils.filter((p) => p.gender === 'M').length;
                const girls = classPupils.filter((p) => p.gender === 'F').length;
                const avg = pupilCount > 0 ? Math.round(classPupils.reduce((s, p) => s + p.mark, 0) / pupilCount) : 0;

                return (
                  <div
                    key={`${assignment.class}-${assignment.subject}-${index}`}
                    className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase tracking-wider">
                          Darasa Linalofundishwa
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">{assignment.class}</h3>

                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-50/80 px-2.5 py-1 rounded-xl border border-emerald-100 mt-1">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Somo: {assignment.subject}</span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1">
                          Wanafunzi {pupilCount} (Wavulana {boys} • Wasichana {girls})
                        </p>
                      </div>

                      {teachingAssignments.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveAssignment(index, e)}
                          title={`Ondoa ${assignment.class} - ${assignment.subject}`}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Quick Performance & Attendance Indicators */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Wastani wa Darasa</span>
                        <span className="text-lg font-black text-emerald-800 block mt-0.5">{avg}%</span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {avg >= 81 ? 'Daraja A (Bora)' : avg >= 65 ? 'Daraja B (Nzuri)' : 'Daraja C (Wastani)'}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Mahudhurio ya Leo</span>
                        <span className="text-lg font-black text-blue-900 block mt-0.5">97.2%</span>
                        <span className="text-[10px] font-bold text-blue-600">Waliohudhuria: {pupilCount > 0 ? pupilCount - 1 : 0}/{pupilCount}</span>
                      </div>
                    </div>

                    {/* Action Buttons for each class and subject */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRosterClassModal(assignment.class);
                          setSearchTerm('');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Orodha ({pupilCount})</span>
                      </button>

                      <Link
                        href={`/teacher/attendance?class=${encodeURIComponent(assignment.class)}`}
                        className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mahudhurio</span>
                      </Link>

                      <Link
                        href={`/teacher/marks?class=${encodeURIComponent(assignment.class)}&subject=${encodeURIComponent(assignment.subject)}`}
                        className="py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Weka Alama</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. TAB 2: DAFTARI KUU LA UDAHILI WA SHULE (SCHOOL RECORD & SECRETARY) */}
        {/* ================================================================= */}
        {activeTab === 'CENTRAL_REGISTRY' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-3xl bg-white border border-emerald-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase block">Jumla Waliosajiliwa</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">{enrolledRecords.length}</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Daftari la Shule 2026</span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-blue-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase block">Wavulana / Wasichana</span>
                <span className="text-2xl font-black text-blue-900 block mt-1">
                  {totalBoysEnrolled} <span className="text-sm font-normal text-slate-400">/</span> {totalGirlsEnrolled}
                </span>
                <span className="text-[11px] text-blue-600 font-semibold">Uwiano wa Jinsia</span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-amber-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase block">Wapya (New Intake)</span>
                <span className="text-2xl font-black text-amber-900 block mt-1">{totalNewIntake}</span>
                <span className="text-[11px] text-amber-700 font-semibold">Awali &amp; Darasa la 1 (RITA)</span>
              </div>

              <div className="p-4 rounded-3xl bg-white border border-teal-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase block">Uhamisho (Transfers)</span>
                <span className="text-2xl font-black text-teal-900 block mt-1">{totalTransfers}</span>
                <span className="text-[11px] text-teal-700 font-semibold">Kutoka Shule Nyingine</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tafuta mwanafunzi, namba ya usajili, au mzazi..."
                  value={registrySearchTerm}
                  onChange={(e) => setRegistrySearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={registryClassFilter}
                  onChange={(e) => setRegistryClassFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white text-slate-700"
                >
                  <option value="ALL">Madarasa Yote (All Classes)</option>
                  {PRIMARY_CLASSES_LIST.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>

                <select
                  value={registryGenderFilter}
                  onChange={(e) => setRegistryGenderFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white text-slate-700"
                >
                  <option value="ALL">Jinsia Zote</option>
                  <option value="M">Wavulana Tu (Male)</option>
                  <option value="F">Wasichana Tu (Female)</option>
                </select>
              </div>
            </div>

            {/* School Registry Table */}
            <div className="bg-white rounded-3xl border border-emerald-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileBadge2 className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-black text-slate-900 text-sm">
                    DAFTARI KUU LA UDAHILI WA SHULE 2026 (CENTRAL ADMISSION REGISTER)
                  </h3>
                </div>
                <span className="text-xs text-emerald-800 font-bold">
                  Walioorodheshwa: {filteredCentralRecords.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Namba ya Usajili</th>
                      <th className="py-3 px-4">Jina Kamili la Mwanafunzi</th>
                      <th className="py-3 px-4">Darasa &amp; Mkondo</th>
                      <th className="py-3 px-4">Aina ya Udahili</th>
                      <th className="py-3 px-4">Mzazi / Mlezi &amp; Simu</th>
                      <th className="py-3 px-4">RITA / Uhamisho</th>
                      <th className="py-3 px-4">Tarehe &amp; Aliyesajili</th>
                      <th className="py-3 px-4 text-right">Hati ya Udahili</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCentralRecords.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400">
                          <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="font-bold text-slate-600">Hakuna kumbukumbu za wanafunzi zilizopatikana.</p>
                          <p className="text-[11px] mt-1">Bofya kitufe cha <strong>+ Sajili Mwanafunzi (Taaluma)</strong> hapo juu kuanza kuandikisha.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredCentralRecords.map((rec, idx) => (
                        <tr key={rec.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                            {rec.admNo}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{rec.name}</span>
                            <span className="text-[10px] text-slate-500">
                              {rec.gender === 'F' ? 'Kike (Female)' : 'Kiume (Male)'}
                              {rec.birthDate ? ` • DOBS: ${rec.birthDate}` : ''}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-bold text-slate-800 block">{rec.assignedClass}</span>
                            <span className="text-[10px] text-emerald-700 font-mono">{rec.stream || 'Stream A'}</span>
                          </td>
                          <td className="py-3 px-4">
                            {rec.admissionType === 'NEW_INTAKE' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                                Mpya (New)
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px]">
                                Uhamisho (Transfer)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{rec.parentName}</span>
                            <span className="text-[11px] font-mono text-emerald-800 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{rec.parentPhone}</span>
                            </span>
                            {rec.residence && (
                              <span className="text-[10px] text-slate-400 block">{rec.residence}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            {rec.ritaNumber ? (
                              <span className="block text-emerald-800 font-semibold">RITA: {rec.ritaNumber}</span>
                            ) : rec.transferLetterRef ? (
                              <span className="block text-amber-800 font-semibold">Barua: {rec.transferLetterRef}</span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-800 font-semibold block">{rec.enrolledAt}</span>
                            <span className="text-[10px] text-slate-400 block">{rec.enrolledBy}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedAdmissionSlip(rec)}
                              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-900 font-bold text-xs flex items-center gap-1 ml-auto transition-colors"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Hati</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. MODAL: SAJILI MWANAFUNZI MPYA (MOEST & TAMISEMI ADMISSION FORM) */}
        {/* ================================================================= */}
        {showAdmissionModal && isAuthorizedToEnroll && (
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
                      Ofisi ya Mwalimu wa Taaluma • Wizara ya Elimu (MoEST &amp; TAMISEMI)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(false)}
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
                    Mwanafunzi anaposajiliwa hapa, ataingia mara moja kwenye <strong>Daftari Kuu la Shule la Katibu</strong>, na atatokea moja kwa moja kwenye <strong>Dashboard ya Mwalimu anayefundisha darasa hilo</strong> (Mahudhurio na Kuingiza Alama).
                  </span>
                </div>
              </div>

              <form onSubmit={handleAdmissionSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
                {/* SEHEMU YA 1: TAARIFA BINAFSI */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs uppercase tracking-wide">
                    <User className="w-4 h-4 text-emerald-800" />
                    <span>1. Taarifa Binafsi za Mwanafunzi (Student Particulars)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Jina la Kwanza (First Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="k.m. Rashid"
                        value={admissionForm.firstName}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, firstName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Jina la Kati (Middle Name)
                      </label>
                      <input
                        type="text"
                        placeholder="k.m. Hamisi"
                        value={admissionForm.middleName}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, middleName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Jina la Ukoo (Surname) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="k.m. Bakari"
                        value={admissionForm.surname}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, surname: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-emerald-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Jinsia *</label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold cursor-pointer flex-1 justify-center">
                          <input
                            type="radio"
                            name="gender"
                            value="M"
                            checked={admissionForm.gender === 'M'}
                            onChange={() => setAdmissionForm({ ...admissionForm, gender: 'M' })}
                          />
                          <span>Kiume (Male)</span>
                        </label>
                        <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold cursor-pointer flex-1 justify-center">
                          <input
                            type="radio"
                            name="gender"
                            value="F"
                            checked={admissionForm.gender === 'F'}
                            onChange={() => setAdmissionForm({ ...admissionForm, gender: 'F' })}
                          />
                          <span>Kike (Female)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Tarehe ya Kuzaliwa</label>
                      <input
                        type="date"
                        value={admissionForm.birthDate}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, birthDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-emerald-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Nambari ya Cheti cha RITA</label>
                      <input
                        type="text"
                        placeholder="k.m. RITA-2019-94821"
                        value={admissionForm.ritaNumber}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, ritaNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-emerald-800"
                      />
                    </div>
                  </div>
                </div>

                {/* SEHEMU YA 2: DARASA & UDAHILI */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs uppercase tracking-wide">
                    <GraduationCap className="w-4 h-4 text-emerald-800" />
                    <span>2. Darasa &amp; Aina ya Udahili (Academic Placement)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Darasa Analoandikishwa *
                      </label>
                      <select
                        value={admissionForm.assignedClass}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, assignedClass: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                      >
                        {PRIMARY_CLASSES_LIST.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mkondo (Stream)</label>
                      <select
                        value={admissionForm.stream}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, stream: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                      >
                        <option value="Stream A">Stream A (Mkondo A)</option>
                        <option value="Stream B">Stream B (Mkondo B)</option>
                        <option value="Stream C">Stream C (Mkondo C)</option>
                        <option value="Hakuna Mkondo">Hakuna Mkondo</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Aina ya Udahili *</label>
                      <select
                        value={admissionForm.admissionType}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, admissionType: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                      >
                        <option value="NEW_INTAKE">Mwanafunzi Mpya (Direct New Admission)</option>
                        <option value="TRANSFER">Uhamisho Kutoka Shule Nyingine (Transfer)</option>
                      </select>
                    </div>
                  </div>

                  {admissionForm.admissionType === 'TRANSFER' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Shule Anayotoka (Previous School):</label>
                        <input
                          type="text"
                          placeholder="k.m. Shule ya Msingi Uhuru, Arusha"
                          value={admissionForm.previousSchool}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, previousSchool: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Nambari ya Barua ya Uhamisho:</label>
                        <input
                          type="text"
                          placeholder="k.m. TR-2026-AR-883"
                          value={admissionForm.transferLetterRef}
                          onChange={(e) => setAdmissionForm({ ...admissionForm, transferLetterRef: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* SEHEMU YA 3: MZAZI AU MLEZI */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs uppercase tracking-wide">
                    <HeartHandshake className="w-4 h-4 text-emerald-800" />
                    <span>3. Taarifa za Mzazi au Mlezi (Parent / Guardian)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Jina Kamili la Mzazi / Mlezi *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="k.m. Hamisi Bakari Mwinyi"
                        value={admissionForm.parentName}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, parentName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Uhusiano na Mwanafunzi</label>
                      <select
                        value={admissionForm.parentRelationship}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, parentRelationship: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                      >
                        <option value="Baba">Baba (Father)</option>
                        <option value="Mama">Mama (Mother)</option>
                        <option value="Mlezi Rasmi">Mlezi Rasmi (Guardian)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Nambari ya Simu (WhatsApp / SMS) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="k.m. 0754 889 900"
                        value={admissionForm.parentPhone}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, parentPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Makazi / Mtaa / Kijiji (Residential Address)
                    </label>
                    <input
                      type="text"
                      placeholder="k.m. Kijitonyama, Mtaa wa Kisiwani, Dar es Salaam"
                      value={admissionForm.residence}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, residence: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                    />
                  </div>
                </div>

                {/* SEHEMU YA 4: MAELEZO YA AFYA & MAHITAJI MAALUM */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2">
                  <label className="font-bold text-slate-700 block">
                    4. Afya &amp; Mahitaji Maalum ya Kujifunzia (Hiari):
                  </label>
                  <input
                    type="text"
                    placeholder="k.m. Uoni hafifu (anahitaji kukaa mbele), au mzio wa chakula fulani..."
                    value={admissionForm.specialNeeds}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, specialNeeds: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAdmissionModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Kamilisha Usajili wa Mwanafunzi</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 5. MODAL: HATI YA UDAHILI WA MWANAFUNZI (PRINTABLE ADMISSION SLIP) */}
        {/* ================================================================= */}
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

              {/* Printable Body */}
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

        {/* ================================================================= */}
        {/* 6. MODAL: ONGEZA DARASA NA SOMO KWA MWALIMU */}
        {/* ================================================================= */}
        {showAddClassModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-base font-black text-slate-900">Ongeza Darasa na Somo</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddClassAndSubject} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    1. Chagua Darasa la Msingi (Standard 1–7):
                  </label>
                  <select
                    value={newClassToAdd}
                    onChange={(e) => setNewClassToAdd(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-800 bg-white"
                  >
                    {PRIMARY_CLASSES_LIST.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    2. Chagua Somo Utakalofundisha:
                  </label>
                  <select
                    value={newSubjectToAdd}
                    onChange={(e) => setNewSubjectToAdd(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-800 bg-white"
                  >
                    {PRIMARY_SUBJECTS_LIST.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  Utaongezewa darasa hili na somo ulilochagua kwenye ratiba yako ya kufundisha na uwekaji wa alama.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddClassModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md"
                  >
                    Hifadhi Darasa na Somo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 7. MODAL: ORODHA YA WANAFUNZI WA DARASA HILI (ROSTER VIEWER) */}
        {/* ================================================================= */}
        {rosterClassModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-800" />
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Orodha ya Wanafunzi: {rosterClassModal} ({rosterPupils.length})
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      Inajumuisha wanafunzi wote waliosajiliwa na Ofisi ya Taaluma
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRosterClassModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tafuta jina au namba ya usajili..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value as any)}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="ALL">Jinsia Zote</option>
                  <option value="M">Wavulana Tu</option>
                  <option value="F">Wasichana Tu</option>
                </select>

                <Link
                  href={`/teacher/marks?class=${encodeURIComponent(rosterClassModal)}`}
                  className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Weka Alama &rarr;</span>
                </Link>
              </div>

              {/* Roster Table */}
              <div className="overflow-y-auto flex-1 border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 sticky top-0 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Namba ya Usajili</th>
                      <th className="py-2.5 px-3">Jina Kamili</th>
                      <th className="py-2.5 px-3">Jinsia</th>
                      <th className="py-2.5 px-3 text-center">Wastani</th>
                      <th className="py-2.5 px-3 text-center">Daraja</th>
                      <th className="py-2.5 px-3 text-right">Kitendo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRosterPupils.map((pupil, idx) => (
                      <tr key={pupil.id} className="hover:bg-emerald-50/50 transition-colors">
                        <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-800">{pupil.admNo}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{pupil.name}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pupil.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {pupil.gender === 'F' ? 'Kike' : 'Kiume'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-800">{pupil.mark}%</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px]">
                            {pupil.grade}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedPupil(pupil)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200"
                          >
                            Wasifu
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 8. MODAL: WASIFU WA MWANAFUNZI */}
        {/* ================================================================= */}
        {selectedPupil && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-amber-300 flex items-center justify-center font-black text-lg shadow-md">
                    {selectedPupil.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{selectedPupil.name}</h3>
                    <span className="text-xs font-mono font-bold text-emerald-800">
                      {selectedPupil.admNo} &bull; {rosterClassModal}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPupil(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Jinsia</span>
                  <span className="font-bold text-slate-800">
                    {selectedPupil.gender === 'F' ? 'Kike (Female)' : 'Kiume (Male)'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Wastani</span>
                  <span className="font-bold text-emerald-800 text-sm">
                    {selectedPupil.mark}% (Daraja {selectedPupil.grade})
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPupil(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Funga
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
