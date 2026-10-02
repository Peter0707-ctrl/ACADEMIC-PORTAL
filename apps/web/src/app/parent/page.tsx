'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  School,
  Clock,
  ArrowLeft,
  LogOut,
  Bell,
  MessageSquare,
  ShieldAlert,
  FileText,
  Send,
  FileCheck,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Info,
  CreditCard,
  Receipt,
  UserCheck,
  UserX,
  Plus,
  Building2,
  Phone,
  Mail,
  QrCode,
  Menu,
  X,
} from 'lucide-react';
import { getCurrentSession, clearCurrentSession } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

interface ChildProfile {
  id: string;
  name: string;
  admNo: string;
  class: string;
  stream: string;
  homeroomTeacher: string;
  gender: 'M' | 'F';
  dob: string;
  photoInitial: string;
  termAverage: number;
  rank: string;
  attendanceRate: number;
  feePaid: number;
  feeTotal: number;
  controlNumber: string;
  conduct: string;
  subjects: {
    name: string;
    code: string;
    teacher: string;
    monthly1: number;
    monthly2: number;
    midterm: number;
    terminal: number;
    average: number;
    grade: string;
    remarks: string;
  }[];
  attendanceHistory: {
    month: string;
    present: number;
    absent: number;
    permission: number;
    rate: string;
  }[];
  feeHistory: {
    receiptNo: string;
    date: string;
    description: string;
    amount: number;
    method: string;
    status: 'CONFIRMED' | 'PENDING';
  }[];
  disciplineRecords: {
    date: string;
    issue: string;
    status: 'RESOLVED' | 'UNDER_REVIEW';
    action: string;
  }[];
}

const CHILDREN_DATA: ChildProfile[] = [
  {
    id: 'child-01',
    name: 'Kelvin Shirima',
    admNo: 'PSLE-2026-0428',
    class: 'Standard 7 (Grade 7)',
    stream: 'Stream A (Watahiniwa)',
    homeroomTeacher: 'Mwl. Beatrice Kimaro',
    gender: 'M',
    dob: '14 Mei 2013',
    photoInitial: 'KS',
    termAverage: 92.4,
    rank: 'Nafasi ya 1 / 32',
    attendanceRate: 98.2,
    feePaid: 450000,
    feeTotal: 600000,
    controlNumber: '991234567890',
    conduct: 'Mwenendo Mzuri Sana (Tabia Njema)',
    subjects: [
      { name: 'Mathematics (Hisabati)', code: 'MATH-01', teacher: 'Mwl. Beatrice Kimaro', monthly1: 94, monthly2: 96, midterm: 95, terminal: 98, average: 96, grade: 'A', remarks: 'Bora Sana' },
      { name: 'Science & Technology (Sayansi)', code: 'SCI-02', teacher: 'Mwl. Emmanuel Swai', monthly1: 90, monthly2: 92, midterm: 91, terminal: 95, average: 92, grade: 'A', remarks: 'Bora Sana' },
      { name: 'English Language', code: 'ENG-03', teacher: 'Mwl. Sarah Mollel', monthly1: 88, monthly2: 91, midterm: 90, terminal: 93, average: 91, grade: 'A', remarks: 'Bora Sana' },
      { name: 'Kiswahili', code: 'KISW-04', teacher: 'Mwl. Juma Rashidi', monthly1: 92, monthly2: 94, midterm: 93, terminal: 96, average: 94, grade: 'A', remarks: 'Bora Sana' },
      { name: 'Civic & Moral Education (Uraia)', code: 'CIV-05', teacher: 'Mwl. Augustine Mrosso (Mkuu)', monthly1: 89, monthly2: 93, midterm: 90, terminal: 94, average: 92, grade: 'A', remarks: 'Bora Sana' },
      { name: 'Social Studies (Maarifa ya Jamii)', code: 'SOC-06', teacher: 'Mwl. Augustine Mrosso (Mkuu)', monthly1: 85, monthly2: 89, midterm: 88, terminal: 90, average: 88, grade: 'A', remarks: 'Mzuri' },
    ],
    attendanceHistory: [
      { month: 'Januari 2026', present: 22, absent: 0, permission: 0, rate: '100%' },
      { month: 'Februari 2026', present: 20, absent: 1, permission: 0, rate: '95.2%' },
      { month: 'Machi 2026', present: 21, absent: 0, permission: 1, rate: '95.5%' },
    ],
    feeHistory: [
      { receiptNo: 'RCP-2026-0891', date: '2026-01-10', description: 'Ada ya Muhula wa 1 (Awamu ya 1)', amount: 300000, method: 'GePG Control No / NMB', status: 'CONFIRMED' },
      { receiptNo: 'RCP-2026-1142', date: '2026-02-15', description: 'Ada ya Maabara & Mitihani ya Majaribio NECTA', amount: 150000, method: 'M-Pesa Paybill', status: 'CONFIRMED' },
    ],
    disciplineRecords: [
      { date: '2026-02-10', issue: 'Kusahau daftari la zoezi la hisabati nyumbani', status: 'RESOLVED', action: 'Alikamilisha zoezi siku iliyofuata chini ya mwalimu wa somo' },
    ],
  },
  {
    id: 'child-02',
    name: 'Amina Bakari',
    admNo: 'PUP-2026-062',
    class: 'Standard 6 (Grade 6)',
    stream: 'Stream B',
    homeroomTeacher: 'Mwl. Grace Minja',
    gender: 'F',
    dob: '22 Agosti 2014',
    photoInitial: 'AB',
    termAverage: 88.6,
    rank: 'Nafasi ya 2 / 35',
    attendanceRate: 96.5,
    feePaid: 500000,
    feeTotal: 550000,
    controlNumber: '991234567891',
    conduct: 'Mwenendo Bora Sana',
    subjects: [
      { name: 'Mathematics (Hisabati)', code: 'MATH-01', teacher: 'Mwl. Beatrice Kimaro', monthly1: 85, monthly2: 88, midterm: 86, terminal: 90, average: 87, grade: 'A', remarks: 'Bora Sana' },
      { name: 'Science & Technology (Sayansi)', code: 'SCI-02', teacher: 'Mwl. Emmanuel Swai', monthly1: 86, monthly2: 90, midterm: 88, terminal: 92, average: 89, grade: 'A', remarks: 'Bora Sana' },
      { name: 'English Language', code: 'ENG-03', teacher: 'Mwl. Sarah Mollel', monthly1: 84, monthly2: 87, midterm: 85, terminal: 89, average: 86, grade: 'A', remarks: 'Bora Sana' },
      { name: 'Kiswahili', code: 'KISW-04', teacher: 'Mwl. Juma Rashidi', monthly1: 90, monthly2: 93, midterm: 92, terminal: 95, average: 93, grade: 'A', remarks: 'Bora Sana' },
      { name: 'Civic & Moral Education (Uraia)', code: 'CIV-05', teacher: 'Mwl. Augustine Mrosso (Mkuu)', monthly1: 87, monthly2: 90, midterm: 89, terminal: 91, average: 89, grade: 'A', remarks: 'Bora Sana' },
      { name: 'Social Studies (Maarifa ya Jamii)', code: 'SOC-06', teacher: 'Mwl. Augustine Mrosso (Mkuu)', monthly1: 82, monthly2: 86, midterm: 84, terminal: 88, average: 85, grade: 'A', remarks: 'Bora Sana' },
    ],
    attendanceHistory: [
      { month: 'Januari 2026', present: 22, absent: 0, permission: 0, rate: '100%' },
      { month: 'Februari 2026', present: 21, absent: 0, permission: 1, rate: '95.5%' },
      { month: 'Machi 2026', present: 21, absent: 1, permission: 0, rate: '95.5%' },
    ],
    feeHistory: [
      { receiptNo: 'RCP-2026-0740', date: '2026-01-08', description: 'Ada ya Masomo Muhula wa 1', amount: 350000, method: 'GePG Control No / CRDB', status: 'CONFIRMED' },
      { receiptNo: 'RCP-2026-1055', date: '2026-02-12', description: 'Vifaa vya Kujifunzia & Michezo', amount: 150000, method: 'Tigo Pesa', status: 'CONFIRMED' },
    ],
    disciplineRecords: [],
  },
  {
    id: 'child-03',
    name: 'Baraka Bakari',
    admNo: 'SFNA-2026-0112',
    class: 'Standard 4 (Grade 4)',
    stream: 'Stream A (Watahiniwa SFNA)',
    homeroomTeacher: 'Mwl. Juma Rashidi',
    gender: 'M',
    dob: '05 Machi 2016',
    photoInitial: 'BB',
    termAverage: 86.2,
    rank: 'Nafasi ya 4 / 38',
    attendanceRate: 95.0,
    feePaid: 400000,
    feeTotal: 500000,
    controlNumber: '991234567892',
    conduct: 'Mwenendo Mzuri',
    subjects: [
      { name: 'Mathematics (Hisabati)', code: 'MATH-01', teacher: 'Mwl. Beatrice Kimaro', monthly1: 82, monthly2: 86, midterm: 84, terminal: 88, average: 85, grade: 'A', remarks: 'Bora Sana' },
      { name: 'Science & Technology (Sayansi)', code: 'SCI-02', teacher: 'Mwl. Emmanuel Swai', monthly1: 85, monthly2: 88, midterm: 86, terminal: 90, average: 87, grade: 'A', remarks: 'Bora Sana' },
      { name: 'English Language', code: 'ENG-03', teacher: 'Mwl. Sarah Mollel', monthly1: 80, monthly2: 84, midterm: 82, terminal: 86, average: 83, grade: 'A', remarks: 'Bora Sana' },
      { name: 'Kiswahili', code: 'KISW-04', teacher: 'Mwl. Juma Rashidi', monthly1: 88, monthly2: 90, midterm: 89, terminal: 92, average: 90, grade: 'A', remarks: 'Bora Sana' },
    ],
    attendanceHistory: [
      { month: 'Januari 2026', present: 21, absent: 1, permission: 0, rate: '95.5%' },
      { month: 'Februari 2026', present: 20, absent: 0, permission: 1, rate: '95.2%' },
      { month: 'Machi 2026', present: 20, absent: 1, permission: 1, rate: '90.9%' },
    ],
    feeHistory: [
      { receiptNo: 'RCP-2026-0612', date: '2026-01-05', description: 'Ada ya Muhula wa Kwanza', amount: 400000, method: 'GePG NMB Bank', status: 'CONFIRMED' },
    ],
    disciplineRecords: [],
  },
];

type ParentTab =
  | 'DASHBOARD'
  | 'ACADEMIC'
  | 'FINANCE'
  | 'COMMUNICATION'
  | 'MEETINGS'
  | 'DOCUMENTS'
  | 'DISCIPLINE'
  | 'REQUESTS';

export default function ParentGuardianPortal() {
  const [children, setChildren] = useState<ChildProfile[]>(CHILDREN_DATA);
  const [selectedChildId, setSelectedChildId] = useState<string>(CHILDREN_DATA[0].id);
  const [activeTab, setActiveTab] = useState<ParentTab>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Link Child State
  const [showLinkChildModal, setShowLinkChildModal] = useState(false);
  const [linkAdmNo, setLinkAdmNo] = useState('');
  const [linkSecurityPin, setLinkSecurityPin] = useState('');

  // Handle Linking a New Child
  const handleLinkNewChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkAdmNo.trim()) return;

    const newChild: ChildProfile = {
      id: `child-${Date.now()}`,
      name: linkAdmNo.toUpperCase().includes('061') ? 'Rashid Hamisi' : 'Faraja Nelson (Candidate)',
      admNo: linkAdmNo.trim().toUpperCase(),
      class: 'Standard 4 (Grade 4)',
      stream: 'Stream A',
      homeroomTeacher: 'Mwl. Rehema Mushi',
      gender: 'M',
      dob: '14 Julai 2015',
      photoInitial: 'FN',
      termAverage: 84.2,
      rank: 'Nafasi ya 4 / 35',
      attendanceRate: 98.0,
      feePaid: 450000,
      feeTotal: 500000,
      controlNumber: '991234567895',
      conduct: 'Nidhamu Nzuri Sana',
      subjects: [
        { name: 'Mathematics (Hisabati)', code: 'MATH-01', teacher: 'Mwl. Beatrice Kimaro', monthly1: 82, monthly2: 86, midterm: 84, terminal: 88, average: 85, grade: 'A', remarks: 'Bora Sana' },
        { name: 'English Language', code: 'ENG-03', teacher: 'Mwl. Grace Shayo', monthly1: 80, monthly2: 85, midterm: 83, terminal: 87, average: 84, grade: 'A', remarks: 'Bora Sana' },
        { name: 'Kiswahili', code: 'KISW-04', teacher: 'Mwl. Juma Athumani', monthly1: 88, monthly2: 90, midterm: 89, terminal: 92, average: 90, grade: 'A', remarks: 'Bora Sana' },
        { name: 'Science & Technology', code: 'SCI-02', teacher: 'Mwl. Emmanuel Lyimo', monthly1: 84, monthly2: 87, midterm: 85, terminal: 88, average: 86, grade: 'A', remarks: 'Bora Sana' },
        { name: 'Social Studies', code: 'SOC-06', teacher: 'Mwl. Rehema Mushi', monthly1: 81, monthly2: 84, midterm: 82, terminal: 86, average: 83, grade: 'A', remarks: 'Bora Sana' },
        { name: 'Civic & Moral Education', code: 'CIV-05', teacher: 'Mwl. Frank Msaki', monthly1: 85, monthly2: 88, midterm: 86, terminal: 90, average: 87, grade: 'A', remarks: 'Bora Sana' },
      ],
      attendanceHistory: [
        { month: 'Januari 2026', present: 22, absent: 0, permission: 0, rate: '100%' },
        { month: 'Februari 2026', present: 21, absent: 0, permission: 0, rate: '95.5%' },
        { month: 'Machi 2026', present: 22, absent: 0, permission: 0, rate: '100%' },
      ],
      feeHistory: [
        { receiptNo: 'RCP-2026-1188', date: '2026-01-12', description: 'Ada ya Muhula wa Kwanza', amount: 450000, method: 'GePG NMB Bank', status: 'CONFIRMED' },
      ],
      disciplineRecords: [],
    };

    setChildren((prev) => [...prev, newChild]);
    setSelectedChildId(newChild.id);
    setShowLinkChildModal(false);
    setLinkAdmNo('');
    setLinkSecurityPin('');

    notifyUser(
      'success',
      'Mtoto Ameunganishwa Kikamilifu!',
      `Mwanafunzi ${newChild.name} (${newChild.admNo}) ameunganishwa kwenye akaunti yako ya mzazi. Sasa unaweza kuangalia matokeo, ada na mahudhurio yake.`
    );
  };

  // Leave Request Form State
  const [leaveReason, setLeaveReason] = useState('Matibabu (Hospitali)');
  const [leaveDays, setLeaveDays] = useState('2');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveNotes, setLeaveNotes] = useState('');
  const [submittedRequests, setSubmittedRequests] = useState([
    {
      id: 'req-01',
      childName: 'Kelvin Shirima',
      reason: 'Matibabu ya Meno (Muhimbili)',
      dates: '12 Machi 2026 - 13 Machi 2026 (Siku 2)',
      status: 'IMEIDHINISHWA NA MKUU WA SHULE',
      dateSubmitted: '2026-03-10',
    },
  ]);

  // Appointment Request State
  const [appointmentTeacher, setAppointmentTeacher] = useState('Mwl. Augustine Mrosso (Mwalimu Mkuu)');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTopic, setAppointmentTopic] = useState('Maandalizi ya Mitihani ya Taifa (PSLE)');

  const selectedChild = useMemo(() => {
    return children.find((c) => c.id === selectedChildId) || children[0];
  }, [children, selectedChildId]);

  const outstandingBalance = selectedChild.feeTotal - selectedChild.feePaid;

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `req-${Date.now().toString().slice(-4)}`,
      childName: selectedChild.name,
      reason: leaveReason,
      dates: `${leaveStartDate || 'Kuanzia Kesho'} (Siku ${leaveDays})`,
      status: 'INASUBIRI IDHINI YA MWALIMU MKUU',
      dateSubmitted: new Date().toISOString().split('T')[0],
    };
    setSubmittedRequests([newReq, ...submittedRequests]);
    notifyUser(
      'success',
      'Ombi la Ruhusa Limetumwa!',
      `Ombi la ruhusa ya ${selectedChild.name} limetumwa kwa Mwalimu Mkuu kwa uhakiki na idhini.`
    );
    setLeaveNotes('');
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    notifyUser(
      'success',
      'Ombi la Miadi Limetumwa!',
      `Ombi lako la miadi na ${appointmentTeacher} limetumwa kwa Katibu wa Shule.`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 font-sans flex flex-col lg:flex-row">
      {/* ===================================================================== */}
      {/* 1. MOBILE TOP BAR (STICKY ON SMALL SCREENS < LG) */}
      {/* ===================================================================== */}
      <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-emerald-200/90 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors"
            aria-label="Fungua Menyu ya Mzazi"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <School className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 leading-tight">PRIMARY &amp; NURSERY</h2>
              <span className="text-[9px] text-emerald-800 font-bold block uppercase tracking-wider">
                Portal ya Mzazi
              </span>
            </div>
          </div>
        </div>

        {/* Active Child Chip */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-950 font-bold text-xs"
          title="Badili mtoto"
        >
          <div className="w-5 h-5 rounded-md bg-emerald-800 text-emerald-100 flex items-center justify-center text-[10px] font-black">
            {selectedChild.photoInitial}
          </div>
          <span className="text-[11px] truncate max-w-[80px]">{selectedChild.name.split(' ')[0]}</span>
        </button>
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
                <School className="w-5 h-5 text-emerald-300" />
                <span className="text-[7px] font-black uppercase tracking-wider text-emerald-200">Shule</span>
              </Link>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
                  PRIMARY &amp; NURSERY
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Portal ya Mzazi / Mlezi
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

          {/* ================================================================= */}
          {/* CHILD SELECTOR: INSTANT SWITCHING BETWEEN CHILDREN */}
          {/* ================================================================= */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <label className="text-[10px] font-black text-emerald-950 uppercase tracking-wider block">
              Chagua Mtoto wa Kuangalia:
            </label>
            <div className="space-y-1">
              {children.map((child) => {
                const isSelected = selectedChildId === child.id;
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => setSelectedChildId(child.id)}
                    className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'bg-white hover:bg-emerald-100/70 text-slate-700 border border-emerald-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {child.photoInitial}
                      </div>
                      <div className="truncate">
                        <span className="block truncate font-bold">{child.name}</span>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                          {child.class}
                        </span>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Link another child button */}
            <button
              type="button"
              onClick={() => setShowLinkChildModal(true)}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-dashed border-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Unganisha Mtoto Mwingine</span>
            </button>
          </div>

          {/* ================================================================= */}
          {/* PARENT NAVIGATION BUTTONS (CANONICAL SPECIFICATION) */}
          {/* ================================================================= */}
          <div className="space-y-1 pt-1">
            {/* 1. Dashboard */}
            <button
              type="button"
              onClick={() => setActiveTab('DASHBOARD')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'DASHBOARD'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Dashibodi ya Mtoto</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* 2. Academic */}
            <button
              type="button"
              onClick={() => setActiveTab('ACADEMIC')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'ACADEMIC'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Taaluma &amp; Matokeo</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                {selectedChild.termAverage}%
              </span>
            </button>

            {/* 3. Finance */}
            <button
              type="button"
              onClick={() => setActiveTab('FINANCE')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'FINANCE'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>Ada &amp; Malipo (Finance)</span>
              </div>
              {outstandingBalance > 0 ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold">
                  Bao: {outstandingBalance.toLocaleString()}
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                  Imelipwa
                </span>
              )}
            </button>

            {/* 4. Communication */}
            <button
              type="button"
              onClick={() => setActiveTab('COMMUNICATION')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'COMMUNICATION'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-purple-600" />
                <span>Mawasiliano &amp; Matangazo</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            {/* 5. Meetings */}
            <button
              type="button"
              onClick={() => setActiveTab('MEETINGS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'MEETINGS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Mikutano &amp; Miadi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* 6. Documents */}
            <button
              type="button"
              onClick={() => setActiveTab('DOCUMENTS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'DOCUMENTS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <span>Nyaraka &amp; Vyeti vya Mtoto</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* 7. Discipline */}
            <button
              type="button"
              onClick={() => setActiveTab('DISCIPLINE')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'DISCIPLINE'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                <span>Nidhamu &amp; Malezi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* 8. Requests */}
            <button
              type="button"
              onClick={() => setActiveTab('REQUESTS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left ${
                activeTab === 'REQUESTS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-emerald-800" />
                <span>Maombi ya Ruhusa (Requests)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                {submittedRequests.length}
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-100 bg-emerald-50/50 space-y-2">
          <div className="text-[11px] text-slate-600 font-medium">
            <span className="font-bold text-slate-800 block">Mzee Bakari Juma</span>
            <span className="text-[10px] text-emerald-800">Mzazi / Mlezi Aliyethibitishwa</span>
          </div>

          <Link
            href="/"
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Rudi Mwanzo (Logout)</span>
          </Link>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 2. RIGHT WORKSPACE: DYNAMIC RENDERING FOR SELECTED TAB & CHILD */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="text-slate-400 hover:text-emerald-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold text-slate-500">Portal ya Mzazi</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-xs font-black text-slate-800">{selectedChild.name}</span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
              {selectedChild.class}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-950 border border-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Utambulisho wa Mzazi Umeridhiwa</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20">
              BJ
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* ================================================================= */}
          {/* TAB 1: DASHBOARD VIEW */}
          {/* ================================================================= */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6 animate-fade-in">
              {/* Child Profile Highlight Banner */}
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-800 text-emerald-100 flex items-center justify-center text-xl font-black shadow-md shadow-emerald-950/20 shrink-0">
                    {selectedChild.photoInitial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-black text-slate-900">{selectedChild.name}</h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                        {selectedChild.gender === 'M' ? 'Mvulana' : 'Msichana'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Namba ya Usajili: <strong className="text-emerald-900 font-mono">{selectedChild.admNo}</strong> • {selectedChild.class} ({selectedChild.stream})
                    </p>
                    <p className="text-xs text-slate-500">
                      Mwalimu wa Darasa: <strong className="text-slate-800">{selectedChild.homeroomTeacher}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('ACADEMIC')}
                    className="px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all"
                  >
                    <Award className="w-4 h-4" />
                    <span>Ripoti ya Matokeo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('FINANCE')}
                    className="px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-300 shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>Lipa Ada / GePG</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Wastani wa Muhula</span>
                  <p className="text-3xl font-black text-emerald-800 mt-1">{selectedChild.termAverage}%</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-1">
                    Daraja A (Bora Sana)
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nafasi Darasani</span>
                  <p className="text-3xl font-black text-slate-900 mt-1">{selectedChild.rank.split(' ')[2] || '1'}</p>
                  <span className="text-[10px] text-slate-500 font-semibold">{selectedChild.rank}</span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mahudhurio ya Shule</span>
                  <p className="text-3xl font-black text-blue-800 mt-1">{selectedChild.attendanceRate}%</p>
                  <span className="text-[10px] text-emerald-700 font-semibold">Mahudhurio Mazuri</span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Hali ya Ada</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    Tsh {selectedChild.feePaid.toLocaleString()}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    outstandingBalance > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {outstandingBalance > 0 ? `Bao: Tsh ${outstandingBalance.toLocaleString()}` : 'Ada Imekamilika'}
                  </span>
                </div>
              </div>

              {/* Two Column Section: Quick Academic Glance & Recent School Announcements */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-800" />
                      <span>Ufaulu wa Masomo ya Mtoto (Continuous Assessment)</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ACADEMIC')}
                      className="text-xs font-bold text-emerald-800 hover:underline"
                    >
                      Tazama Ripoti Kamili →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedChild.subjects.map((sub) => (
                      <div
                        key={sub.code}
                        className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{sub.name}</span>
                          <span className="text-[10px] text-slate-500">{sub.teacher}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-700">{sub.average}%</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black text-xs">
                            {sub.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-purple-600" />
                      <span>Matangazo ya Shule</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                      <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block">Kikao Kikuu</span>
                      <h4 className="text-xs font-bold text-slate-900">Kikao cha Wazazi na Uongozi wa Shule (AGM)</h4>
                      <p className="text-[11px] text-slate-500 leading-tight">Jumamosi saa 3:00 Asubuhi ukumbini.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[9px] font-black text-blue-800 uppercase tracking-wider block">Likizo</span>
                      <h4 className="text-xs font-bold text-slate-900">Kazi za Likizo ya Pasaka 2026</h4>
                      <p className="text-[11px] text-slate-500 leading-tight">Pakua vifurushi vya maswali kupitia sehemu ya Nyaraka.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: ACADEMIC (RESULTS, ATTENDANCE & TIMETABLE) */}
          {/* ================================================================= */}
          {activeTab === 'ACADEMIC' && (
            <div className="space-y-6 animate-fade-in">
              {/* Official Result Slip Card with Seal */}
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-black text-slate-900">
                        Ripoti Rasmi ya Maendeleo ya Mwanafunzi • Muhula wa 1, 2026
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                        Imethibitishwa na Mkuu wa Shule
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Matokeo yamekaguliwa na Mwalimu wa Taaluma na kugongwa Muhuri Rasmi wa Kidigitali.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      notifyUser(
                        'success',
                        'Upakuaji wa Ripoti ya Matokeo',
                        `Ripoti ya maendeleo ya ${selectedChild.name} inapakuliwa ikiwa na muhuri wa kidigitali wa Mwalimu Mkuu.`
                      )
                    }
                    className="px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 self-start sm:self-auto transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Pakua Ripoti ya PDF</span>
                  </button>
                </div>

                {/* Results Table */}
                <div className="overflow-x-auto rounded-2xl border border-emerald-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-800 text-white font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Somo</th>
                        <th className="py-3 px-3 text-center">Monthly 1</th>
                        <th className="py-3 px-3 text-center">Monthly 2</th>
                        <th className="py-3 px-3 text-center">Mid-Term</th>
                        <th className="py-3 px-3 text-center">Terminal</th>
                        <th className="py-3 px-3 text-center bg-emerald-900">Wastani (%)</th>
                        <th className="py-3 px-3 text-center">Daraja</th>
                        <th className="py-3 px-4">Maoni ya Mwalimu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 text-slate-800">
                      {selectedChild.subjects.map((sub, idx) => (
                        <tr key={sub.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/20'}>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div>{sub.name}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{sub.code}</span>
                          </td>
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

                {/* Headteacher Endorsement Footer */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Maoni ya Mwalimu Mkuu:</span>
                    <p className="text-slate-600 mt-0.5">
                      "Ufaulu mzuri sana. Kelvin anaonyesha nidhamu ya juu na utayari mkubwa kwa mitihani ya kitaifa ya PSLE."
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-3 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-mono font-bold text-[10px] inline-flex items-center gap-1 shadow-2xs">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Muhuri Rasmi: HT-VERIFIED-2026</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: FINANCE (FEES, OUTSTANDING BALANCE, GEPG & RECEIPTS) */}
          {/* ================================================================= */}
          {activeTab === 'FINANCE' && (
            <div className="space-y-6 animate-fade-in">
              {/* Payment Summary & GePG Control Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Muundo wa Ada &amp; Bao Lililosalia</h3>
                      <p className="text-xs text-slate-500">Ada ya Masomo ya Mwaka 2026 • {selectedChild.name}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                      Muhula wa 1
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-1">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Ada Kamili</span>
                      <p className="text-lg font-black text-slate-900">Tsh {selectedChild.feeTotal.toLocaleString()}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 font-bold uppercase">Kiasi Kilicholipwa</span>
                      <p className="text-lg font-black text-emerald-800">Tsh {selectedChild.feePaid.toLocaleString()}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] text-amber-800 font-bold uppercase">Bao Lililosalia</span>
                      <p className="text-lg font-black text-amber-800">Tsh {outstandingBalance.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* GePG Control Number Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white space-y-2 shadow-md shadow-emerald-950/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                        Namba ya Malipo ya Serikali (GePG Control No)
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                        Inatumika (Active)
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest">
                        {selectedChild.controlNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          notifyUser(
                            'success',
                            'Namba ya Malipo Imenakiliwa!',
                            `Namba ya udhibiti ya GePG/Malipo "${selectedChild.controlNumber}" imenakiliwa tayari kwa kulipia.`
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-white text-emerald-900 text-xs font-bold shadow-xs hover:bg-emerald-50 transition-colors"
                      >
                        Nakili
                      </button>
                    </div>

                    <p className="text-[11px] text-emerald-100">
                      Unaweza kulipia kupitia M-Pesa, Tigo Pesa, Airtel Money, Halopesa au Benki ya NMB / CRDB kwa kutumia namba hii.
                    </p>
                  </div>
                </div>

                {/* Payment Instructions Card */}
                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900">Jinsi ya Kulipa kwa Simu</h3>
                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                      <p>Piga <strong>*150*00#</strong> (M-Pesa) au <strong>*150*01#</strong> (Tigo Pesa).</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                      <p>Chagua <strong>Lipa Bili</strong> kisha <strong>Malipo ya Serikali</strong>.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                      <p>Weka Control Number: <strong>{selectedChild.controlNumber}</strong>.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                      <p>Thibitisha jina la mwanafunzi na weka PIN yako.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History & Receipts Table */}
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-800" />
                  <span>Historia ya Risiti na Malipo Yaliyofanyika</span>
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-emerald-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-800 text-white font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Namba ya Risiti</th>
                        <th className="py-3 px-4">Tarehe</th>
                        <th className="py-3 px-4">Maelezo</th>
                        <th className="py-3 px-4">Njia ya Malipo</th>
                        <th className="py-3 px-4">Kiasi (Tsh)</th>
                        <th className="py-3 px-3 text-center">Hali</th>
                        <th className="py-3 px-4 text-center">Stakabadhi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 text-slate-800">
                      {selectedChild.feeHistory.map((rec) => (
                        <tr key={rec.receiptNo} className="hover:bg-emerald-50/50">
                          <td className="py-3 px-4 font-mono font-bold text-emerald-900">{rec.receiptNo}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{rec.date}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{rec.description}</td>
                          <td className="py-3 px-4 text-slate-600">{rec.method}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {rec.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                notifyUser(
                                  'success',
                                  'Upakuaji wa Risiti',
                                  `Risiti ya malipo "${rec.receiptNo}" inapakuliwa kwa muundo rasmi wa PDF.`
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>Pakua</span>
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
          {/* TAB 4: COMMUNICATION (ANNOUNCEMENTS, MESSAGES & NOTIFICATIONS) */}
          {/* ================================================================= */}
          {activeTab === 'COMMUNICATION' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-black text-slate-900">Matangazo Rasmi ya Shule kwa Wazazi</h3>
                  <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold text-[10px]">
                        Muhimu Sana
                      </span>
                      <span>01 Machi 2026</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">Kikao cha Wazazi na Uongozi wa Shule (AGM)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tunapenda kuwataarifu wazazi wote kuwa kikao cha wazazi kitafanyika ukumbini saa 3:00 Asubuhi. Agenda kuu zitakuwa ni ufaulu wa mitihani ya majaribio na ujenzi wa maabara ya sayansi.
                    </p>
                    <span className="text-[11px] font-bold text-emerald-900 block pt-1">
                      Kutoka: Mwl. Augustine Mrosso (Mwalimu Mkuu)
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-800" />
                    <span>Mawasiliano na Walimu</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="font-bold text-slate-900 block">{selectedChild.homeroomTeacher}</span>
                      <span className="text-[10px] text-slate-500">Mwalimu wa Darasa</span>
                      <p className="text-slate-600 mt-1">"Kelvin anaendelea vizuri sana hasa kwenye somo la hisabati."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: MEETINGS & APPOINTMENT REQUESTS */}
          {/* ================================================================= */}
          {activeTab === 'MEETINGS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-800" />
                    <span>Omba Miadi ya Kuonana na Mwalimu / Mkuu wa Shule</span>
                  </h3>

                  <form onSubmit={handleAppointmentSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Chagua Mwalimu / Uongozi:
                      </label>
                      <select
                        value={appointmentTeacher}
                        onChange={(e) => setAppointmentTeacher(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 font-bold"
                      >
                        <option value="Mwl. Augustine Mrosso (Mwalimu Mkuu)">Mwl. Augustine Mrosso (Mwalimu Mkuu)</option>
                        <option value="Mwl. Beatrice Kimaro (Mwl. Taaluma)">Mwl. Beatrice Kimaro (Mwl. Taaluma)</option>
                        <option value="Mwl. Godfrey Makere (Mwl. Nidhamu)">Mwl. Godfrey Makere (Mwl. Nidhamu)</option>
                        <option value={selectedChild.homeroomTeacher}>{selectedChild.homeroomTeacher} (Mwalimu wa Darasa)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Sababu / Mada ya Kikao:
                      </label>
                      <input
                        type="text"
                        required
                        value={appointmentTopic}
                        onChange={(e) => setAppointmentTopic(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Tarehe Unayoomba:
                      </label>
                      <input
                        type="date"
                        required
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20"
                    >
                      Wasilisha Ombi la Miadi
                    </button>
                  </form>
                </div>

                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900">Ratiba ya Mikutano ya Shule</h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="font-bold text-emerald-950 block">Mkutano Mkuu wa Mwaka wa Wazazi (AGM)</span>
                      <span className="text-slate-500 block text-[11px] mt-0.5">Jumamosi, 28 Machi 2026 • Saa 3:00 Asubuhi</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-bold text-[10px] inline-block mt-2">
                        Wazazi Wote
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: DOCUMENTS (AUTHORIZED CHILD DOCUMENTS) */}
          {/* ================================================================= */}
          {activeTab === 'DOCUMENTS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-800" />
                  <span>Nyaraka Rasmi za Mwanafunzi ({selectedChild.name})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Cheti cha Usajili wa NECTA (Candidate Verification)</h4>
                      <span className="text-[10px] text-slate-500">PDF • 1.2 MB • Kimethibitishwa</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        notifyUser(
                          'success',
                          'Upakuaji wa Cheti',
                          'Cheti cha uthibitisho wa usajili kinapakuliwa rasmi kwa muundo wa PDF...'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs"
                    >
                      Pakua
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Kifurushi cha Mazoezi ya Likizo (Holiday Package)</h4>
                      <span className="text-[10px] text-slate-500">PDF • 3.5 MB • Masomo Yote</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        notifyUser(
                          'success',
                          'Upakuaji wa Kifurushi cha Likizo',
                          'Kifurushi cha mazoezi ya likizo ya muhula kinapakuliwa kikamilifu...'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs"
                    >
                      Pakua
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: DISCIPLINE */}
          {/* ================================================================= */}
          {activeTab === 'DISCIPLINE' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-emerald-800" />
                      <span>Kumbukumbu za Nidhamu na Malezi ({selectedChild.name})</span>
                    </h3>
                    <p className="text-xs text-slate-500">Tathmini rasmi kutoka kwa Mwalimu wa Nidhamu na Mwalimu Mkuu.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                    {selectedChild.conduct}
                  </span>
                </div>

                {selectedChild.disciplineRecords.length > 0 ? (
                  <div className="space-y-3">
                    {selectedChild.disciplineRecords.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="font-mono">{item.date}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                            {item.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900">{item.issue}</h4>
                        <p className="text-slate-600">Hatua iliyochukuliwa: {item.action}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-900">Hakuna Rekodi Yoyote ya Kinidhamu</h4>
                    <p className="text-[11px] text-slate-500">Mwanafunzi ana mwenendo na tabia safi kabisa shuleni.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: REQUESTS (LEAVE REQUEST & PARENT CONFIRMATION) */}
          {/* ================================================================= */}
          {activeTab === 'REQUESTS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form to submit leave request */}
                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-800" />
                    <span>Wasilisha Ombi la Ruhusa ya Mtoto (Leave Request)</span>
                  </h3>

                  <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Sababu ya Ruhusa:
                      </label>
                      <select
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 font-bold"
                      >
                        <option value="Matibabu (Hospitali)">Matibabu (Hospitali / Ushauri wa Daktari)</option>
                        <option value="Dharura ya Kifamilia">Dharura ya Kifamilia / Msiba</option>
                        <option value="Safari Maalum ya Kielimu">Safari Maalum ya Familia</option>
                        <option value="Sababu Nyingine">Sababu Nyingine</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Tarehe ya Kuanza:
                        </label>
                        <input
                          type="date"
                          required
                          value={leaveStartDate}
                          onChange={(e) => setLeaveStartDate(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Idadi ya Siku:
                        </label>
                        <select
                          value={leaveDays}
                          onChange={(e) => setLeaveDays(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                        >
                          <option value="1">Siku 1</option>
                          <option value="2">Siku 2</option>
                          <option value="3">Siku 3</option>
                          <option value="4">Siku 4</option>
                          <option value="5">Siku 5 au Zaidi</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Maelezo ya Ziada kwa Mwalimu Mkuu:
                      </label>
                      <textarea
                        rows={3}
                        value={leaveNotes}
                        onChange={(e) => setLeaveNotes(e.target.value)}
                        placeholder="Andika ufafanuzi mfupi..."
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20"
                    >
                      Tuma Ombi kwa Mwalimu Mkuu
                    </button>
                  </form>
                </div>

                {/* Submitted requests tracker */}
                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900">Hali ya Maombi Yaliyotumwa</h3>

                  <div className="space-y-3">
                    {submittedRequests.map((req) => (
                      <div key={req.id} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{req.childName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{req.dateSubmitted}</span>
                        </div>
                        <div className="text-slate-600">{req.reason} ({req.dates})</div>
                        <div className="pt-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-bold text-[10px]">
                            {req.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* MODAL: UNGANISHA MTOTO MWINGINE (LINK STUDENT ACCOUNT) */}
      {/* ===================================================================== */}
      {showLinkChildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-emerald-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-black text-slate-900">Unganisha Mtoto Mwingine</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkChildModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Kama una mtoto mwingine anayesoma shuleni hapa, weka Namba yake ya Usajili (Admission Number) na PIN ya siri iliyopo kwenye barua ya kujiunga au risiti ya ada ili kumuunganisha kwenye akaunti yako.
            </p>

            <form onSubmit={handleLinkNewChild} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Namba ya Usajili ya Mtoto (Admission / Reg No.)
                </label>
                <input
                  type="text"
                  required
                  value={linkAdmNo}
                  onChange={(e) => setLinkAdmNo(e.target.value)}
                  placeholder="Mfn. PUP-2026-061 au SFNA-2026-0112"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold uppercase"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Jaribu kuweka: <code className="text-emerald-700 font-bold">PUP-2026-061</code>
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  PIN ya Siri ya Mzazi / Namba ya Simu Iliyosajiliwa
                </label>
                <input
                  type="password"
                  required
                  value={linkSecurityPin}
                  onChange={(e) => setLinkSecurityPin(e.target.value)}
                  placeholder="Weka PIN (Mfn. 8492 au namba ya simu)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Ukishaunganisha, utaweza kuangalia matokeo, ada, na mahudhurio ya watoto wako wote kwa kubadili jina tu kwenye kona ya juu kushoto.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkChildModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20"
                >
                  Thibitisha &amp; Unganisha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
