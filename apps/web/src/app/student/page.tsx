'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  QrCode,
  Download,
  BookOpen,
  Users,
  Clock,
  LogOut,
  Bell,
  MessageSquare,
  ShieldCheck,
  FileText,
  CreditCard,
  Receipt,
  FileCheck,
  Send,
  Sparkles,
  School,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Menu,
  X,
} from 'lucide-react';
import { getCurrentSession } from '@/lib/auth-session';

type StudentTab =
  | 'DASHBOARD'
  | 'PROFILE'
  | 'ACADEMICS'
  | 'ATTENDANCE'
  | 'EXAMS_RESULTS'
  | 'FINANCE'
  | 'DOCUMENTS'
  | 'COMMUNICATION'
  | 'DISCIPLINE'
  | 'REQUESTS'
  | 'GRADUATION';

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState<StudentTab>('DASHBOARD');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Student Profile Data
  const student = {
    fullName: 'Kelvin Shirima',
    studentId: 'STU-2026-0001',
    admNo: 'PSLE-2026-0428',
    examIndexNo: 'PSLE-2026-0428/001',
    class: 'Standard 7 (Grade 7)',
    stream: 'Stream A (Watahiniwa wa Taifa)',
    gender: 'Mvulana (Male)',
    dob: '14 Mei 2013',
    bloodGroup: 'O+',
    homeAddress: 'Kibamba, Dar es Salaam',
    parentName: 'Mzee Bakari Juma (Mzazi / Mlezi)',
    parentPhone: '+255 755 123 456',
    homeroomTeacher: 'Mwl. Beatrice Kimaro',
    headteacher: 'Mwl. Augustine Mrosso',
    average: 92.4,
    rank: 'Nafasi ya 1 / 32',
    attendanceRate: 98.2,
    feeBalance: 150000,
    controlNumber: '991234567890',
    conduct: 'Mwenendo Mzuri Sana (Tabia Njema)',
  };

  // Subjects & Marks
  const subjects = [
    { code: 'MATH-01', name: 'Mathematics (Hisabati)', teacher: 'Mwl. Beatrice Kimaro', monthly1: 94, monthly2: 96, midterm: 95, terminal: 98, average: 96, grade: 'A', remarks: 'Bora Sana' },
    { code: 'SCI-02', name: 'Science & Technology (Sayansi)', teacher: 'Mwl. Emmanuel Swai', monthly1: 90, monthly2: 92, midterm: 91, terminal: 95, average: 92, grade: 'A', remarks: 'Bora Sana' },
    { code: 'ENG-03', name: 'English Language', teacher: 'Mwl. Sarah Mollel', monthly1: 88, monthly2: 91, midterm: 90, terminal: 93, average: 91, grade: 'A', remarks: 'Bora Sana' },
    { code: 'KISW-04', name: 'Kiswahili', teacher: 'Mwl. Juma Rashidi', monthly1: 92, monthly2: 94, midterm: 93, terminal: 96, average: 94, grade: 'A', remarks: 'Bora Sana' },
    { code: 'CIV-05', name: 'Civic & Moral Education (Uraia)', teacher: 'Mwl. Augustine Mrosso (Mkuu)', monthly1: 89, monthly2: 93, midterm: 90, terminal: 94, average: 92, grade: 'A', remarks: 'Bora Sana' },
    { code: 'SOC-06', name: 'Social Studies (Maarifa ya Jamii)', teacher: 'Mwl. Augustine Mrosso (Mkuu)', monthly1: 85, monthly2: 89, midterm: 88, terminal: 90, average: 88, grade: 'A', remarks: 'Mzuri' },
  ];

  // Timetable
  const timetable = [
    { day: 'Jumatatu', p1: 'Hisabati', p2: 'Hisabati', p3: 'English', p4: 'Sayansi', p5: 'Uraia', p6: 'Kiswahili', p7: 'Michezo' },
    { day: 'Jumanne', p1: 'Sayansi', p2: 'Sayansi', p3: 'Kiswahili', p4: 'English', p5: 'Maarifa', p6: 'Hisabati', p7: 'Klabu' },
    { day: 'Jumatano', p1: 'English', p2: 'English', p3: 'Hisabati', p4: 'Sayansi', p5: 'Kiswahili', p6: 'Uraia', p7: 'Maktaba' },
    { day: 'Alhamisi', p1: 'Maarifa', p2: 'Maarifa', p3: 'Sayansi', p4: 'Hisabati', p5: 'English', p6: 'Kiswahili', p7: 'Sanaa' },
    { day: 'Ijumaa', p1: 'Hisabati', p2: 'Kiswahili', p3: 'Uraia', p4: 'Sayansi', p5: 'English', p6: 'Maarifa', p7: 'Ibada / Malezi' },
  ];

  // Homework Assignments
  const assignments = [
    { id: 'as-1', subject: 'Mathematics', title: 'Mazoezi ya Algebra & Geometri (Ukurasa 45)', dueDate: 'Kesho saa 2:00 Asubuhi', status: 'IMEKAMILIKA' },
    { id: 'as-2', subject: 'Science', title: 'Mchoro wa Mfumo wa Upumuaji wa Binadamu', dueDate: 'Ijumaa hii', status: 'INASUBIRI' },
    { id: 'as-3', subject: 'Civic & Moral', title: 'Insha: Wajibu wa Raia Mwema Katika Jamii', dueDate: 'Jumatatu ijayo', status: 'INASUBIRI' },
  ];

  // Leave Request Form State
  const [requestReason, setRequestReason] = useState('Matibabu (Hospitali)');
  const [requestDays, setRequestDays] = useState('2');
  const [requestDate, setRequestDate] = useState('');
  const [requestsList, setRequestsList] = useState([
    { id: 'req-01', reason: 'Kuhudhuria Matibabu Muhimbili', dates: '12 Machi 2026 (Siku 2)', status: 'IMEIDHINISHWA NA MKUU WA SHULE' },
  ]);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `req-${Date.now().toString().slice(-4)}`,
      reason: requestReason,
      dates: `${requestDate || 'Kuanzia Kesho'} (Siku ${requestDays})`,
      status: 'INASUBIRI UHAKIKI WA MWALIMU WA DARASA',
    };
    setRequestsList([newReq, ...requestsList]);
    setActiveNotice(`Ombi lako la ruhusa limetumwa kwa Mwalimu wa Darasa na Mwalimu Mkuu.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 font-sans flex flex-col">
      {/* Primary School Clarification Notice */}
      <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-xs z-50">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-black/20 text-white text-[10px] font-black uppercase tracking-wider">
            PRIMARY SCHOOL NOTICE
          </span>
          <span>
            Katika Shule ya Msingi, wanafunzi hawamiliki simu au akaunti binafsi. Taarifa zote za maendeleo zinasimamiwa na Mzazi / Mlezi.
          </span>
        </div>
        <Link
          href="/parent"
          className="px-3 py-1 rounded-lg bg-black text-amber-300 font-black text-xs hover:bg-slate-900 transition-colors flex items-center gap-1"
        >
          <span>Fungua Portal ya Mzazi (/parent)</span>
          <ArrowLeft className="w-3 h-3 rotate-180" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
      {/* ===================================================================== */}
      {/* 1. MOBILE TOP BAR (STICKY ON SMALL SCREENS < LG) */}
      {/* ===================================================================== */}
      <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-emerald-200/90 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors"
            aria-label="Fungua Menyu ya Mwanafunzi"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 leading-tight">PRIMARY &amp; NURSERY</h2>
              <span className="text-[9px] text-emerald-800 font-bold block uppercase tracking-wider">
                Mwanafunzi • {student.fullName.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-black text-xs shadow-xs">
            KS
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ===================================================================== */}
      {/* 2. SIDEBAR: PERSISTENT ON DESKTOP, SLIDE-IN DRAWER ON MOBILE */}
      {/* ===================================================================== */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 w-72 sm:w-80 bg-white/98 backdrop-blur-md border-r border-emerald-200/90 shrink-0 flex flex-col justify-between shadow-2xl lg:shadow-xs transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-5 space-y-4">
          {/* School Brand + Mobile Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-950/20 shrink-0 hover:bg-emerald-900 transition-colors"
                title="Rudi Ukurasa wa Kwanza"
              >
                <GraduationCap className="w-5 h-5 text-emerald-300" />
                <span className="text-[7px] font-black uppercase tracking-wider text-emerald-200">Shule</span>
              </Link>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
                  PRIMARY &amp; NURSERY
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Portal ya Mwanafunzi (360°)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Funga Menyu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Profile Quick Chip */}
          <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-100 flex items-center justify-center font-black text-sm shadow-xs shrink-0">
              KS
            </div>
            <div className="truncate">
              <span className="font-bold text-xs text-slate-900 block truncate">{student.fullName}</span>
              <span className="text-[10px] text-emerald-900 font-mono block truncate">{student.admNo}</span>
              <span className="text-[9px] text-slate-500 block truncate">{student.class}</span>
            </div>
          </div>

          {/* Navigation Items (Canonical Student Tree) */}
          <div className="space-y-1 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('DASHBOARD')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'DASHBOARD'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <School className="w-4 h-4 text-emerald-700" />
                <span>Dashibodi Kuu</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('PROFILE')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'PROFILE'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Wasifu Wangu (My Profile)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ACADEMICS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'ACADEMICS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-800" />
                <span>Taaluma, Ratiba &amp; Kazi</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                Masomo 6
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('EXAMS_RESULTS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'EXAMS_RESULTS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Mitihani &amp; Matokeo</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                {student.average}% (A)
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ATTENDANCE')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'ATTENDANCE'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>Mahudhurio Yangu</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-900 font-bold">
                {student.attendanceRate}%
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('FINANCE')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'FINANCE'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Ada &amp; Malipo (Finance)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DOCUMENTS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'DOCUMENTS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Kitambulisho &amp; Vyeti</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('COMMUNICATION')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'COMMUNICATION'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-purple-600" />
                <span>Matangazo &amp; Ujumbe</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DISCIPLINE')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'DISCIPLINE'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Nidhamu &amp; Malezi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('REQUESTS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'REQUESTS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-emerald-800" />
                <span>Maombi ya Ruhusa (Requests)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('GRADUATION')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'GRADUATION'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Kuhitimu (Graduation 2026)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                Mtahiniwa
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-100 bg-emerald-50/50 space-y-2">
          <Link
            href="/"
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Toka Kwenye Mfumo</span>
          </Link>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 2. RIGHT WORKSPACE */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="text-slate-400 hover:text-emerald-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold text-slate-500">Mwanafunzi</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-xs font-black text-slate-800">{student.fullName}</span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
              Mtahiniwa Rasmi wa NECTA 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-950 border border-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Usajili Hai (Active)</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20">
              KS
            </div>
          </div>
        </header>

        {/* Notice alert */}
        {activeNotice && (
          <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-xs">
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

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* ================================================================= */}
          {/* TAB 1: DASHBOARD */}
          {/* ================================================================= */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6 animate-fade-in">
              {/* Profile Card Banner */}
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-800 text-emerald-100 flex items-center justify-center text-xl font-black shadow-md shadow-emerald-950/20 shrink-0">
                    KS
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-black text-slate-900">{student.fullName}</h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                        {student.class}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Namba ya Mtihani (Index No): <strong className="text-emerald-900 font-mono">{student.examIndexNo}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Mwalimu wa Darasa: <strong className="text-slate-800">{student.homeroomTeacher}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('EXAMS_RESULTS')}
                    className="px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all"
                  >
                    <Award className="w-4 h-4" />
                    <span>Tazama Matokeo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('ACADEMICS')}
                    className="px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-300 shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span>Ratiba ya Masomo</span>
                  </button>
                </div>
              </div>

              {/* 4 KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Wastani wangu</span>
                  <p className="text-3xl font-black text-emerald-800 mt-1">{student.average}%</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-1">
                    Daraja A (Bora Sana)
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nafasi Darasani</span>
                  <p className="text-3xl font-black text-slate-900 mt-1">1st</p>
                  <span className="text-[10px] text-slate-500 font-semibold">{student.rank}</span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mahudhurio Yangu</span>
                  <p className="text-3xl font-black text-blue-800 mt-1">{student.attendanceRate}%</p>
                  <span className="text-[10px] text-emerald-700 font-semibold">Siku 88 / 89</span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kazi za Nyumbani</span>
                  <p className="text-3xl font-black text-purple-800 mt-1">12 / 12</p>
                  <span className="text-[10px] text-purple-700 font-semibold">Zote Zimekamilika</span>
                </div>
              </div>

              {/* Two Column: Assignments & Announcements */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-800" />
                      <span>Kazi za Nyumbani &amp; Mazoezi (Homework)</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {assignments.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">{item.subject}</span>
                          <span className="font-bold text-slate-900">{item.title}</span>
                          <span className="text-slate-500 block text-[11px] mt-0.5">Mwisho wa kuwasilisha: {item.dueDate}</span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] self-start sm:self-auto ${
                            item.status === 'IMEKAMILIKA'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <span>Matangazo ya Wanafunzi</span>
                  </h3>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5 text-xs">
                    <span className="text-[10px] font-black text-emerald-900 uppercase">Kambi ya Mitihani</span>
                    <h4 className="font-bold text-slate-900">Masomo ya Ziada ya Asubuhi (PSLE 2026)</h4>
                    <p className="text-slate-600 leading-tight">Watahiniwa wote wa Darasa la 7 kufika shuleni saa 1:00 Asubuhi kwa ajili ya maswali ya marudio.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: MY PROFILE */}
          {/* ================================================================= */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-emerald-100">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-800 text-white flex items-center justify-center text-xl font-bold">
                    KS
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">{student.fullName}</h2>
                    <span className="text-xs text-slate-500">Student ID: {student.studentId} • Admission: {student.admNo}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Jinsia</span>
                    <span className="font-bold text-slate-800">{student.gender}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Tarehe ya Kuzaliwa</span>
                    <span className="font-bold text-slate-800">{student.dob}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Kundi la Damu</span>
                    <span className="font-bold text-slate-800">{student.bloodGroup}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Anwani ya Nyumbani</span>
                    <span className="font-bold text-slate-800">{student.homeAddress}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Mzazi / Mlezi</span>
                    <span className="font-bold text-slate-800">{student.parentName}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Simu ya Mzazi</span>
                    <span className="font-bold text-slate-800">{student.parentPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: ACADEMICS & TIMETABLE */}
          {/* ================================================================= */}
          {activeTab === 'ACADEMICS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900">Ratiba ya Vipindi vya Darasa (Timetable)</h3>
                <div className="overflow-x-auto rounded-2xl border border-emerald-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-800 text-white font-bold uppercase text-[10px]">
                        <th className="py-2.5 px-3">Siku</th>
                        <th className="py-2.5 px-3">Kipindi 1</th>
                        <th className="py-2.5 px-3">Kipindi 2</th>
                        <th className="py-2.5 px-3">Kipindi 3</th>
                        <th className="py-2.5 px-3">Kipindi 4</th>
                        <th className="py-2.5 px-3">Kipindi 5</th>
                        <th className="py-2.5 px-3">Kipindi 6</th>
                        <th className="py-2.5 px-3">Kipindi 7</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 text-slate-800">
                      {timetable.map((t, idx) => (
                        <tr key={t.day} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/20'}>
                          <td className="py-3 px-3 font-bold text-emerald-950">{t.day}</td>
                          <td className="py-3 px-3">{t.p1}</td>
                          <td className="py-3 px-3">{t.p2}</td>
                          <td className="py-3 px-3">{t.p3}</td>
                          <td className="py-3 px-3">{t.p4}</td>
                          <td className="py-3 px-3">{t.p5}</td>
                          <td className="py-3 px-3">{t.p6}</td>
                          <td className="py-3 px-3 font-semibold text-emerald-800">{t.p7}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: EXAMINATIONS & RESULTS */}
          {/* ================================================================= */}
          {activeTab === 'EXAMS_RESULTS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Ripoti ya Matokeo • Muhula wa 1, 2026
                    </h3>
                    <p className="text-xs text-slate-500">Imeidhinishwa na kugongwa Muhuri wa Kidigitali wa Shule.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNotice('Ripoti rasmi inapakuliwa...')}
                    className="px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Pakua Ripoti ya PDF</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-emerald-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-800 text-white font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Somo</th>
                        <th className="py-3 px-3 text-center">Monthly 1</th>
                        <th className="py-3 px-3 text-center">Monthly 2</th>
                        <th className="py-3 px-3 text-center">Mid-Term</th>
                        <th className="py-3 px-3 text-center">Terminal</th>
                        <th className="py-3 px-3 text-center bg-emerald-900">Wastani (%)</th>
                        <th className="py-3 px-3 text-center">Daraja</th>
                        <th className="py-3 px-4">Maoni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 text-slate-800">
                      {subjects.map((sub, idx) => (
                        <tr key={sub.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/20'}>
                          <td className="py-3 px-4 font-bold text-slate-900">{sub.name}</td>
                          <td className="py-3 px-3 text-center font-mono">{sub.monthly1}</td>
                          <td className="py-3 px-3 text-center font-mono">{sub.monthly2}</td>
                          <td className="py-3 px-3 text-center font-mono">{sub.midterm}</td>
                          <td className="py-3 px-3 text-center font-mono">{sub.terminal}</td>
                          <td className="py-3 px-3 text-center font-mono font-black text-emerald-900 bg-emerald-50">
                            {sub.average}%
                          </td>
                          <td className="py-3 px-3 text-center font-black">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                              {sub.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-[11px]">{sub.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: ATTENDANCE */}
          {/* ================================================================= */}
          {activeTab === 'ATTENDANCE' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900">Muhtasari wa Mahudhurio Yangu</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Siku Nilizohudhuria</span>
                    <span className="text-2xl font-black text-emerald-900">88</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                    <span className="text-[10px] font-bold text-rose-800 uppercase block">Utoro / Kutokuwepo</span>
                    <span className="text-2xl font-black text-rose-900">1</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">Ruhusa Rasmi</span>
                    <span className="text-2xl font-black text-blue-900">1</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: FINANCE */}
          {/* ================================================================= */}
          {activeTab === 'FINANCE' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900">Taarifa ya Ada na Namba ya Malipo</h3>
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white space-y-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-200">Namba ya Malipo ya Serikali (GePG)</span>
                  <div className="text-2xl sm:text-3xl font-mono font-black">{student.controlNumber}</div>
                  <p className="text-xs text-emerald-100">Bao lililosalia: Tsh {student.feeBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: DOCUMENTS */}
          {/* ================================================================= */}
          {activeTab === 'DOCUMENTS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-800" />
                  <span>Kitambulisho cha Mwanafunzi &amp; Vyeti</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Kitambulisho cha Mwanafunzi (Digital ID Card)</h4>
                      <span className="text-[10px] text-slate-500">PDF • Chenye QR Code</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNotice('Kitambulisho kinapakuliwa...')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-bold text-emerald-900"
                    >
                      Pakua
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Cheti cha Usajili wa NECTA (PSLE Slip)</h4>
                      <span className="text-[10px] text-slate-500">PDF • Kimethibitishwa</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNotice('Cheti cha NECTA kinapakuliwa...')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 font-bold text-emerald-900"
                    >
                      Pakua
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: COMMUNICATION */}
          {/* ================================================================= */}
          {activeTab === 'COMMUNICATION' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-900">Matangazo ya Shule</h3>
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1 text-xs">
                  <span className="font-bold text-slate-900">Kazi za Likizo ya Pasaka 2026</span>
                  <p className="text-slate-600">Wanafunzi wote wanapaswa kupakua kazi za likizo kupitia sehemu ya Nyaraka kabla ya shule kufungwa.</p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 9: DISCIPLINE */}
          {/* ================================================================= */}
          {activeTab === 'DISCIPLINE' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-3 text-center">
                <ShieldCheck className="w-12 h-12 text-emerald-700 mx-auto" />
                <h3 className="text-sm font-black text-slate-900">Mwenendo na Tabia Safi Shuleni</h3>
                <p className="text-xs text-slate-500">Mwanafunzi hana kosa lolote lililoripotiwa. Hali: {student.conduct}.</p>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 10: REQUESTS */}
          {/* ================================================================= */}
          {activeTab === 'REQUESTS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900">Omba Ruhusa Shuleni</h3>
                <form onSubmit={handleRequestSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sababu:</label>
                    <select
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                    >
                      <option value="Matibabu (Hospitali)">Matibabu (Hospitali)</option>
                      <option value="Dharura ya Kifamilia">Dharura ya Kifamilia</option>
                      <option value="Sababu Nyingine">Sababu Nyingine</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tarehe ya Kuanza:</label>
                      <input
                        type="date"
                        required
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Idadi ya Siku:</label>
                      <select
                        value={requestDays}
                        onChange={(e) => setRequestDays(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      >
                        <option value="1">Siku 1</option>
                        <option value="2">Siku 2</option>
                        <option value="3">Siku 3</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20"
                  >
                    Tuma Ombi la Ruhusa
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 11: GRADUATION / ALUMNI */}
          {/* ================================================================= */}
          {activeTab === 'GRADUATION' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-8 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4 text-center">
                <GraduationCap className="w-16 h-16 text-emerald-800 mx-auto" />
                <h3 className="text-base font-black text-slate-900">Safari ya Kuhitimu Elimu ya Msingi (Graduation 2026)</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Kelvin Shirima ni mtahiniwa wa Darasa la 7 (PSLE). Hatua zote za masomo na usajili wa NECTA zimekamilika.
                </p>
                <div className="w-full max-w-sm mx-auto bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-emerald-600 rounded-full" />
                </div>
                <span className="text-[11px] font-bold text-emerald-900 block">Utayari wa Mahafali: 85%</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  </div>
);
}
