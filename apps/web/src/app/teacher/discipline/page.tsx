'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  UserCheck,
  Check,
  Mail,
  AlertCircle,
  FileCheck,
  Send,
  Eye,
  MessageSquare,
  Users,
  FolderArchive,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  History,
  FileText,
  Printer,
  Download,
  Search,
  Filter,
  ShieldAlert,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';
import {
  ClassDailyAttendanceRecord,
  STORAGE_ATTENDANCE_HISTORY_KEY,
  STORAGE_ATTENDANCE_KEY,
  CALENDAR_MONTHS,
  formatSwahiliDate,
  getInitialHistoricalSeeds,
} from '@/lib/attendance-data';

// =============================================================================
// TYPES & DATA STRUCTURES: DISCIPLINE INFRACTIONS & BEHAVIORAL CONDUCT
// =============================================================================

export type IncidentCategory =
  | 'UGOMVI_NA_KUPIGANA'
  | 'UTOVI_WA_NIDHAMU'
  | 'UHARIBIFU_WA_MALI'
  | 'WIZI'
  | 'SARE_NA_MUONEKANO'
  | 'UTORO_SUGU'
  | 'LUGHA_CHAFU'
  | 'VITU_VILIVYOPIGWA_MARUFUKU';

export type IncidentSeverity = 'KAWAIDA' | 'WASTANI' | 'NZITO';

export interface ComprehensiveDisciplineIncident {
  id: string;
  refNo: string;
  date: string;
  pupilName: string;
  admNo: string;
  class: string;
  category: IncidentCategory;
  categoryLabel: string;
  severity: IncidentSeverity;
  issueDescription: string;
  actionTaken: string;
  recordedBy: string; // e.g. "Mwl. Emmanuel Lyimo (Mwalimu wa Nidhamu)"
  status: 'PENDING' | 'PARENT_SUMMONED' | 'HEADTEACHER_REVIEW' | 'RESOLVED';
  parentName: string;
  parentPhone: string;
  parentNotified: boolean;
  parentNotifiedAt?: string;
  parentNotifiedVia?: 'SMS' | 'WHATSAPP' | 'BARUA_RASMI';
  headteacherApproved: boolean;
  headteacherDecision?: string;
  headteacherNotes?: string;
  resolvedAt?: string;
}

export interface AbsentPupilDetail {
  admNo: string;
  name: string;
  gender: 'M' | 'F';
  daysAbsent: number;
  reason: string;
  parentPhone: string;
  parentNotified: boolean;
}

export interface ClassDailyAttendanceFeed {
  id: string;
  className: string;
  classTeacherName: string;
  date: string;
  timeSubmitted: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED_AND_RECORDED';
  confirmedBy?: string;
  confirmedAt?: string;
  recordRefNo?: string;
  absentees: AbsentPupilDetail[];
}

const STORAGE_DISCIPLINE_KEY = 'school_discipline_registry_v2';
const STORAGE_RECORDS_KEY = 'school_records_documents_v1';

const CATEGORY_MAP: Record<IncidentCategory, { label: string; defaultSeverity: IncidentSeverity; defaultAction: string }> = {
  UGOMVI_NA_KUPIGANA: {
    label: 'Ugomvi / Kupigana Uwanjani au Darasani',
    defaultSeverity: 'WASTANI',
    defaultAction: 'Ushauri nasaha, kuandika maelezo ya tukio, na kazi ya kurekebisha tabia (usafi wa mazingira).',
  },
  UTOVI_WA_NIDHAMU: {
    label: 'Utovu wa Nidhamu / Kukaidi Maelekezo ya Walimu',
    defaultSeverity: 'WASTANI',
    defaultAction: 'Onyo kali kwa maandishi na kuwasilisha maelezo mbele ya Kamati ya Nidhamu.',
  },
  UHARIBIFU_WA_MALI: {
    label: 'Uharibifu wa Mali ya Shule (Madirisha, Viti, Vitabu)',
    defaultSeverity: 'NZITO',
    defaultAction: 'Wito rasmi kwa mzazi kufika shuleni na kufidia thamani ya mali iliyoharibiwa.',
  },
  WIZI: {
    label: 'Wizi au Kujipatia Vifaa vya Wenzao Bila Ruhusa',
    defaultSeverity: 'NZITO',
    defaultAction: 'Kesi imepelekwa kwa Mwalimu Mkuu, kurudisha vifaa, na kumwita mzazi.',
  },
  SARE_NA_MUONEKANO: {
    label: 'Kutovaa Sare Rasmi / Muonekano Usiofaa',
    defaultSeverity: 'KAWAIDA',
    defaultAction: 'Onyo la mdomo na mzazi ametumiwa SMS ya kumbukumbu ya sare sahihi.',
  },
  UTORO_SUGU: {
    label: 'Utoro wa Zaidi ya Siku 3 Mfululizo Bila Taarifa',
    defaultSeverity: 'WASTANI',
    defaultAction: 'Barua ya wito kwa mzazi kupitia Ofisi ya Mtendaji wa Kijiji/Mtaa.',
  },
  LUGHA_CHAFU: {
    label: 'Lugha Chafu / Matusi / Vitisho kwa Wenzake',
    defaultSeverity: 'WASTANI',
    defaultAction: 'Ushauri nasaha kutoka kwa Mwalimu Mlezi na kuomba msamaha mbele ya darasa.',
  },
  VITU_VILIVYOPIGWA_MARUFUKU: {
    label: 'Vitu Vilivyopigwa Marufuku (Simu ya Mkononi, Vitu Hatari)',
    defaultSeverity: 'NZITO',
    defaultAction: 'Kifaa kimekamatwa na kuhifadhiwa ofisi ya Mwalimu Mkuu. Mzazi anapaswa kukichukua mwenyewe.',
  },
};

// Initial Seed Data for Tanzanian Primary School Incidents
const INITIAL_DISCIPLINE_INCIDENTS: ComprehensiveDisciplineIncident[] = [
  {
    id: 'inc-001',
    refNo: 'DISC-2026-081',
    date: '2026-10-02',
    pupilName: 'Kelvin Shirima',
    admNo: 'PSLE-2026-0428',
    class: 'Standard 7 (Grade 7)',
    category: 'UGOMVI_NA_KUPIGANA',
    categoryLabel: 'Ugomvi / Kupigana Uwanjani au Darasani',
    severity: 'WASTANI',
    issueDescription: 'Kupigana na mwanafunzi mwenzake wakati wa mapumziko ya saa saba uwanjani kwa ajili ya mpira wa miguu.',
    actionTaken: 'Walipatanishwa na Mwalimu wa Nidhamu, wamefanya usafi wa bustani ya shule kwa saa 1, na kusaini ahadi ya kutopigana tena.',
    recordedBy: 'Mwl. Emmanuel Lyimo (Mwalimu wa Nidhamu)',
    status: 'RESOLVED',
    parentName: 'David Shirima',
    parentPhone: '0754 112 233',
    parentNotified: true,
    parentNotifiedAt: '2026-10-02 saa 13:40',
    parentNotifiedVia: 'SMS',
    headteacherApproved: true,
    headteacherDecision: 'Uamuzi Umeridhiwa: Kesi imetatuliwa vizuri kwa ushauri nasaha na suluhu ya amani.',
    resolvedAt: '2026-10-02',
  },
  {
    id: 'inc-002',
    refNo: 'DISC-2026-082',
    date: '2026-10-03',
    pupilName: 'Faraji Saidi Mkude',
    admNo: 'PUP-2026-093',
    class: 'Standard 6 (Grade 6)',
    category: 'VITU_VILIVYOPIGWA_MARUFUKU',
    categoryLabel: 'Vitu Vilivyopigwa Marufuku (Simu ya Mkononi)',
    severity: 'NZITO',
    issueDescription: 'Kupatikana na simu ya mkononi (smartphone) darasani wakati wa kipindi cha Hisabati, kinyume na kanuni ya 8 ya shule.',
    actionTaken: 'Simu imekamatwa na kuwekwa salama katika kabati la Ofisi ya Mkuu wa Shule. Mzazi anaitwa shuleni kufafanua na kuchukua simu.',
    recordedBy: 'Mwl. Emmanuel Lyimo (Mwalimu wa Nidhamu)',
    status: 'HEADTEACHER_REVIEW',
    parentName: 'Saidi Mkude',
    parentPhone: '0713 445 566',
    parentNotified: true,
    parentNotifiedAt: '2026-10-03 saa 09:15',
    parentNotifiedVia: 'WHATSAPP',
    headteacherApproved: false,
    headteacherNotes: 'Inasubiri kikao kifupi cha Mwalimu Mkuu na Mzazi siku ya Jumatatu asubuhi kabla ya kukabidhi simu.',
  },
  {
    id: 'inc-003',
    refNo: 'DISC-2026-083',
    date: '2026-10-01',
    pupilName: 'Baraka David',
    admNo: 'PUP-2026-001',
    class: 'Standard 5 (Grade 5)',
    category: 'UHARIBIFU_WA_MALI',
    categoryLabel: 'Uharibifu wa Mali ya Shule (Kioo cha Dirisha)',
    severity: 'NZITO',
    issueDescription: 'Kuvunja kioo cha dirisha la darasa la tano kwa kurusha jiwe akigombana na mwenzake nje ya darasa.',
    actionTaken: 'Wito rasmi wa mzazi umetolewa. Mzazi amekubali kugharamia ukarabati na kioo kipya kimewekwa.',
    recordedBy: 'Mwl. Emmanuel Lyimo (Mwalimu wa Nidhamu)',
    status: 'RESOLVED',
    parentName: 'David Massawe',
    parentPhone: '0784 556 677',
    parentNotified: true,
    parentNotifiedAt: '2026-10-01 saa 11:30',
    parentNotifiedVia: 'BARUA_RASMI',
    headteacherApproved: true,
    headteacherDecision: 'Mali imefidiwa na fundi ameweka kioo kipya. Mwanafunzi amepewa onyo kali la mwisho.',
    resolvedAt: '2026-10-02',
  },
  {
    id: 'inc-004',
    refNo: 'DISC-2026-084',
    date: '2026-10-03',
    pupilName: 'Juma Bakari',
    admNo: 'SFNA-2026-0112',
    class: 'Standard 4 (Grade 4)',
    category: 'UTORO_SUGU',
    categoryLabel: 'Utoro wa Zaidi ya Siku 3 Mfululizo Bila Taarifa',
    severity: 'WASTANI',
    issueDescription: 'Hajahudhuria shule tangu Jumanne (siku 4 mfululizo) bila taarifa rasmi ya ugonjwa wala dharura kutoka kwa wazazi.',
    actionTaken: 'Barua ya wito kwa mzazi imetumwa kupitia jirani anayeishi mtaa mmoja na mwanafunzi pamoja na SMS kwa simu ya mzazi.',
    recordedBy: 'Mwl. Emmanuel Lyimo (Mwalimu wa Nidhamu)',
    status: 'PARENT_SUMMONED',
    parentName: 'Bakari Juma',
    parentPhone: '0767 889 900',
    parentNotified: true,
    parentNotifiedAt: '2026-10-03 saa 08:30',
    parentNotifiedVia: 'SMS',
    headteacherApproved: true,
    headteacherDecision: 'Ufuatiliaji ufanyike kwa mzazi. Ikiwa hatofika ndani ya siku 2, Ofisi ya Mtendaji wa Kata itahusishwa.',
  },
  {
    id: 'inc-005',
    refNo: 'DISC-2026-085',
    date: '2026-09-30',
    pupilName: 'Amina Salum',
    admNo: 'PUP-2026-062',
    class: 'Standard 6 (Grade 6)',
    category: 'SARE_NA_MUONEKANO',
    categoryLabel: 'Kutovaa Sare Rasmi / Muonekano Usiofaa',
    severity: 'KAWAIDA',
    issueDescription: 'Kuingia shuleni na viatu vya rangi ya njano (sneakers) badala ya viatu vyeusi rasmi vya ngozi vya sare ya shule.',
    actionTaken: 'Ameelezwa kanuni ya sare ya shule, alipewa viatu vya dharura vya shule kwa siku hiyo, na mzazi alitumwa ujumbe.',
    recordedBy: 'Mwl. Emmanuel Lyimo (Mwalimu wa Nidhamu)',
    status: 'RESOLVED',
    parentName: 'Salum Rashid',
    parentPhone: '0655 123 456',
    parentNotified: true,
    parentNotifiedAt: '2026-09-30 saa 08:15',
    parentNotifiedVia: 'SMS',
    headteacherApproved: true,
    resolvedAt: '2026-09-30',
  },
];

function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DisciplineAndAttendancePage() {
  const currentUser = getCurrentSession();
  const [mounted, setMounted] = useState(false);

  // Role Checks
  const isHeadteacher =
    currentUser?.role === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'HEADTEACHER' ||
    currentUser?.identifier === 'HT-2026-001';

  const isDisciplineMaster =
    currentUser?.role === 'DISCIPLINE' ||
    currentUser?.leadershipRole === 'DISCIPLINE' ||
    currentUser?.role === 'ADMIN';

  // Main Tabs: 1. Disciplinary Incidents Registry, 2. Headteacher Executive Review, 3. Daily Attendance/Truancy Feed
  const [activeTab, setActiveTab] = useState<'INCIDENTS' | 'HEADTEACHER_REVIEW' | 'ATTENDANCE_FEED'>('INCIDENTS');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Persistent Incidents State
  const [incidents, setIncidents] = useState<ComprehensiveDisciplineIncident[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DISCIPLINE_INCIDENTS;
    try {
      const saved = localStorage.getItem(STORAGE_DISCIPLINE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DISCIPLINE_INCIDENTS;
  });

  // Calendar State for Attendance Feeds
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO);

  const [attendanceHistory, setAttendanceHistory] = useState<Record<string, ClassDailyAttendanceRecord>>(() => {
    const initialSeeds = getInitialHistoricalSeeds();
    if (typeof window === 'undefined') return initialSeeds;
    try {
      const saved = localStorage.getItem(STORAGE_ATTENDANCE_HISTORY_KEY);
      if (saved) {
        return { ...initialSeeds, ...JSON.parse(saved) };
      }
    } catch {}
    return initialSeeds;
  });

  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  // Modals
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [viewingSummonsModal, setViewingSummonsModal] = useState<ComprehensiveDisciplineIncident | null>(null);
  const [viewingWhatsAppModal, setViewingWhatsAppModal] = useState<ComprehensiveDisciplineIncident | null>(null);
  const [viewingHeadteacherModal, setViewingHeadteacherModal] = useState<ComprehensiveDisciplineIncident | null>(null);

  // Form State for Recording New Incident (Mwalimu wa Nidhamu)
  const [formPupilName, setFormPupilName] = useState('');
  const [formAdmNo, setFormAdmNo] = useState('');
  const [formClass, setFormClass] = useState('Standard 6 (Grade 6)');
  const [formCategory, setFormCategory] = useState<IncidentCategory>('UGOMVI_NA_KUPIGANA');
  const [formSeverity, setFormSeverity] = useState<IncidentSeverity>('WASTANI');
  const [formDescription, setFormDescription] = useState('');
  const [formAction, setFormAction] = useState(CATEGORY_MAP.UGOMVI_NA_KUPIGANA.defaultAction);
  const [formParentName, setFormParentName] = useState('');
  const [formParentPhone, setFormParentPhone] = useState('');
  const [formNotifyParentDirectly, setFormNotifyParentDirectly] = useState(true);

  // Headteacher Decision form state
  const [htDecisionText, setHtDecisionText] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Save incidents to localStorage
  const saveIncidentsState = (updated: ComprehensiveDisciplineIncident[]) => {
    setIncidents(updated);
    try {
      localStorage.setItem(STORAGE_DISCIPLINE_KEY, JSON.stringify(updated));
    } catch {}
  };

  // When category changes in form, update default action & severity
  const handleCategoryChange = (cat: IncidentCategory) => {
    setFormCategory(cat);
    setFormSeverity(CATEGORY_MAP[cat].defaultSeverity);
    setFormAction(CATEGORY_MAP[cat].defaultAction);
  };

  // Submit New Disciplinary Incident (Mwalimu wa Nidhamu)
  const handleCreateIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPupilName.trim()) return;

    const refNo = `DISC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const timeNow = new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });

    const newIncident: ComprehensiveDisciplineIncident = {
      id: `inc-${Date.now()}`,
      refNo,
      date: getTodayISO(),
      pupilName: formPupilName.trim(),
      admNo: formAdmNo.trim() || `PUP-2026-${Math.floor(100 + Math.random() * 800)}`,
      class: formClass,
      category: formCategory,
      categoryLabel: CATEGORY_MAP[formCategory].label,
      severity: formSeverity,
      issueDescription: formDescription.trim(),
      actionTaken: formAction.trim(),
      recordedBy: `${currentUser?.fullName || 'Mwl. Emmanuel Lyimo'} (Mwalimu wa Nidhamu)`,
      status: formSeverity === 'NZITO' ? 'HEADTEACHER_REVIEW' : 'PENDING',
      parentName: formParentName.trim() || `Mzazi wa ${formPupilName}`,
      parentPhone: formParentPhone.trim() || '0754 000 000',
      parentNotified: formNotifyParentDirectly,
      parentNotifiedAt: formNotifyParentDirectly ? `${getTodayISO()} saa ${timeNow}` : undefined,
      parentNotifiedVia: formNotifyParentDirectly ? 'WHATSAPP' : undefined,
      headteacherApproved: formSeverity !== 'NZITO',
    };

    const updated = [newIncident, ...incidents];
    saveIncidentsState(updated);
    setShowNewIncidentModal(false);

    // Reset Form
    setFormPupilName('');
    setFormAdmNo('');
    setFormDescription('');
    setFormParentName('');
    setFormParentPhone('');

    notifyUser(
      'success',
      'Tukio la Nidhamu Limesajiliwa!',
      `Tukio la mwanafunzi ${newIncident.pupilName} (${newIncident.class}) limesajiliwa rasmi kwenye Daftari Kuu (Ref: ${refNo}). ${
        formNotifyParentDirectly ? 'Ujumbe wa taarifa umetumwa kwa mzazi.' : ''
      }`
    );

    setActiveNotice(
      `Tukio jipya la nidhamu la ${newIncident.pupilName} limesajiliwa (Ref: ${refNo}). Mzazi: ${newIncident.parentName} (${newIncident.parentPhone}).`
    );
  };

  // Headteacher Approving / Deciding on Severe Incident
  const handleHeadteacherApprove = (incidentId: string) => {
    const timeNow = new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          headteacherApproved: true,
          headteacherDecision: htDecisionText.trim() || 'Uamuzi Umeidhinishwa na Mkuu wa Shule.',
          status: 'RESOLVED' as const,
          resolvedAt: getTodayISO(),
        };
      }
      return inc;
    });

    saveIncidentsState(updated);
    setViewingHeadteacherModal(null);
    setHtDecisionText('');

    notifyUser(
      'success',
      'Uamuzi wa Mwalimu Mkuu Umeidhinishwa!',
      'Kesi ya nidhamu imehitimishwa rasmi na kuhifadhiwa kwenye Masijala ya Shule.'
    );
  };

  // Mark Incident as Resolved
  const handleResolveIncident = (incidentId: string) => {
    const updated = incidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'RESOLVED' as const,
          resolvedAt: getTodayISO(),
        };
      }
      return inc;
    });

    saveIncidentsState(updated);
    notifyUser('success', 'Kesi ya Nidhamu Imetatuliwa!', 'Suala hili limetatuliwa kikamilifu baada ya hatua zote stahiki kuchukuliwa.');
  };

  // Attendance Feeds computation
  const dateFeeds: ClassDailyAttendanceFeed[] = useMemo(() => {
    const matching = Object.values(attendanceHistory).filter((f) => f.date === selectedDate);
    if (matching.length > 0) {
      return matching.map((m) => ({
        id: m.id,
        className: m.className,
        classTeacherName: m.classTeacherName,
        date: m.date,
        timeSubmitted: m.timeSubmitted,
        totalStudents: m.totalStudents,
        presentCount: m.presentCount,
        absentCount: m.absentCount,
        attendanceRate: m.attendanceRate,
        status: m.status,
        confirmedBy: m.confirmedBy,
        confirmedAt: m.confirmedAt,
        recordRefNo: m.recordRefNo,
        absentees: m.absentees.map((a) => ({
          admNo: a.admNo,
          name: a.name,
          gender: a.gender,
          daysAbsent: a.daysAbsent,
          reason: a.reason,
          parentPhone: a.parentPhone,
          parentNotified: a.parentNotified,
        })),
      }));
    }
    return [];
  }, [attendanceHistory, selectedDate]);

  // Filtered Incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch =
        inc.pupilName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.issueDescription.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
      if (filterStatus !== 'ALL' && inc.status !== filterStatus) return false;

      return true;
    });
  }, [incidents, searchQuery, filterSeverity, filterStatus]);

  // Severe Cases awaiting Headteacher Review
  const pendingHeadteacherCases = useMemo(() => {
    return incidents.filter((inc) => inc.status === 'HEADTEACHER_REVIEW' || (inc.severity === 'NZITO' && !inc.headteacherApproved));
  }, [incidents]);

  return (
    <TeacherShell
      pageTitle="Nidhamu ya Shule & Usimamizi wa Maadili"
      pageDescription="Daftari Rasmi la Makosa ya Kinidhamu, Ushauri Nasaha, Wito wa Wazazi (SMS/WhatsApp), Uthibitisho wa Utoro, na Maamuzi Makuu ya Mkuu wa Shule."
      requiredRole="DISCIPLINE"
    >
      <div className="space-y-5 animate-fade-in">
        {/* Flash Alert */}
        {activeNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
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

        {/* ===================================================================== */}
        {/* 1. TOP SUMMARY METRICS (DISCIPLINE OVERVIEW) */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Matukio Yote Yaliyosajiliwa</span>
              <div className="text-xl font-black text-slate-900">{incidents.length} Kesi</div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                Zimetatuliwa: {incidents.filter((i) => i.status === 'RESOLVED').length}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Kesi Nzito (Kwa Mkuu)</span>
              <div className="text-xl font-black text-rose-700">{pendingHeadteacherCases.length} Kesi</div>
              <span className="text-[10px] text-rose-600 font-medium">Zinahitaji Uamuzi wa Mkuu</span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Wito wa Wazazi &amp; Taarifa</span>
              <div className="text-xl font-black text-amber-800">
                {incidents.filter((i) => i.parentNotified).length} Zimetumwa
              </div>
              <span className="text-[10px] text-amber-700 font-medium">WhatsApp &amp; Barua Rasmi</span>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase block">Ushauri Nasaha &amp; Suluhu</span>
              <div className="text-xl font-black text-teal-900">
                {incidents.filter((i) => i.status === 'RESOLVED').length} Kesi
              </div>
              <span className="text-[10px] text-teal-700 font-semibold">Tabia Imeboreshwa ✓</span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. MAIN TABS & ACTION BAR */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100/90 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('INCIDENTS')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'INCIDENTS'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>1. Daftari Kuu la Makosa ya Nidhamu ({incidents.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('HEADTEACHER_REVIEW')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'HEADTEACHER_REVIEW'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>2. Kesi Nzito za Mkuu wa Shule ({pendingHeadteacherCases.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ATTENDANCE_FEED')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'ATTENDANCE_FEED'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>3. Ufuatiliaji wa Utoro &amp; Mahudhurio</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNewIncidentModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>+ Sajili Kosa Jipya la Kinidhamu</span>
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* TAB 1: DAFTARI KUU LA MAKOSA YA KINIDHAMU */}
          {/* =================================================================== */}
          {activeTab === 'INCIDENTS' && (
            <div className="space-y-4">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tafuta mwanafunzi, kosa, au namba ya kumbukumbu..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Uzito:</span>
                  {['ALL', 'KAWAIDA', 'WASTANI', 'NZITO'].map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setFilterSeverity(sev)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        filterSeverity === sev
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {sev === 'ALL' ? 'Zote' : sev === 'KAWAIDA' ? 'Kawaida' : sev === 'WASTANI' ? 'Wastani' : 'Nzito'}
                    </button>
                  ))}

                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-2">Hali:</span>
                  {['ALL', 'PENDING', 'HEADTEACHER_REVIEW', 'RESOLVED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFilterStatus(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        filterStatus === st
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st === 'ALL'
                        ? 'Zote'
                        : st === 'PENDING'
                        ? 'Inashughulikiwa'
                        : st === 'HEADTEACHER_REVIEW'
                        ? 'Kwa Mkuu'
                        : 'Imetatuliwa'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incidents Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Ref &amp; Tarehe</th>
                      <th className="py-3 px-4">Jina la Mwanafunzi</th>
                      <th className="py-3 px-3">Darasa</th>
                      <th className="py-3 px-4">Kosa &amp; Uzito</th>
                      <th className="py-3 px-4">Hatua Iliyochukuliwa</th>
                      <th className="py-3 px-3 text-center">Mzazi &amp; Taarifa</th>
                      <th className="py-3 px-3 text-center">Hali</th>
                      <th className="py-3 px-3 text-center">Vitendo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredIncidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-slate-800 block">{inc.refNo}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{inc.date}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div>{inc.pupilName}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{inc.admNo}</span>
                        </td>
                        <td className="py-3 px-3 text-emerald-800 font-semibold">{inc.class}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className={`px-2 py-0.2 rounded text-[9px] font-black uppercase ${
                                inc.severity === 'NZITO'
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                  : inc.severity === 'WASTANI'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-blue-100 text-blue-900 border border-blue-300'
                              }`}
                            >
                              {inc.severity}
                            </span>
                            <span className="font-bold text-slate-900 text-xs">{inc.categoryLabel.split('(')[0]}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1">{inc.issueDescription}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-700 text-xs">
                          <div className="line-clamp-2">{inc.actionTaken}</div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Mwandikishaji: {inc.recordedBy}</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-slate-800">{inc.parentName}</span>
                            <span className="text-[10px] font-mono text-slate-500">{inc.parentPhone}</span>
                            {inc.parentNotified ? (
                              <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[9px] flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5 text-emerald-700" />
                                <span>{inc.parentNotifiedVia || 'SMS'} ✓</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[9px]">Bado</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {inc.status === 'RESOLVED' ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-[10px]">
                              Imetatuliwa ✓
                            </span>
                          ) : inc.status === 'HEADTEACHER_REVIEW' ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-bold text-[10px]">
                              Kwa Mkuu wa Shule
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 font-bold text-[10px]">
                              Inashughulikiwa
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* WhatsApp / SMS Button */}
                            <button
                              type="button"
                              onClick={() => setViewingWhatsAppModal(inc)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
                              title="Tuma Taarifa WhatsApp / SMS kwa Mzazi"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                            </button>

                            {/* Barua ya Wito wa Mzazi */}
                            <button
                              type="button"
                              onClick={() => setViewingSummonsModal(inc)}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors"
                              title="Tazama & Chapisha Barua ya Wito wa Mzazi"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-600" />
                            </button>

                            {/* Resolve button */}
                            {inc.status !== 'RESOLVED' && (
                              <button
                                type="button"
                                onClick={() => handleResolveIncident(inc.id)}
                                className="px-2 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[10px] transition-colors"
                                title="Kamilisha na funga tukio hili"
                              >
                                Tatua
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: KESI NZITO ZA MKUU WA SHULE (HEADTEACHER EXECUTIVE REVIEW) */}
          {/* =================================================================== */}
          {activeTab === 'HEADTEACHER_REVIEW' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                  <ShieldAlert className="w-5 h-5 text-rose-700" />
                  <span>Mamlaka ya Mkuu wa Shule: Uidhinishaji wa Kesi Nzito za Nidhamu</span>
                </div>
                <p className="text-rose-800">
                  Kulingana na Miongozo ya Wizara ya Elimu (MoEST &amp; TAMISEMI), Mwalimu wa Nidhamu anachunguza na kurekodi matukio, lakini maamuzi mazito kama vile kusimamishwa masomo (*suspension*), kutoa onyo kali la mwisho, au kuwasilisha kwa Kamati ya Shule yanalindwa na saini ya <strong>Mwalimu Mkuu</strong>.
                </p>
              </div>

              {pendingHeadteacherCases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingHeadteacherCases.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-5 rounded-3xl bg-white border-2 border-rose-200 shadow-sm space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-950 font-black text-[10px] border border-rose-300">
                            Kesi Nzito: {inc.categoryLabel.split('(')[0]}
                          </span>
                          <span className="font-mono text-xs text-slate-500 font-bold">{inc.refNo}</span>
                        </div>

                        <div>
                          <h4 className="text-base font-black text-slate-900">{inc.pupilName}</h4>
                          <span className="text-xs text-emerald-800 font-bold">{inc.class} • Adm: {inc.admNo}</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <strong className="text-slate-800 block text-[10px] uppercase">Maelezo ya Kosa:</strong>
                          <p className="text-slate-700">{inc.issueDescription}</p>
                        </div>

                        <div className="text-xs text-slate-600">
                          <strong>Hatua Iliyochukuliwa na Nidhamu:</strong> {inc.actionTaken}
                        </div>

                        <div className="text-[11px] text-slate-500">
                          Mzazi: <strong>{inc.parentName}</strong> ({inc.parentPhone}) • Mwandikishaji: {inc.recordedBy}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingSummonsModal(inc)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Barua ya Mzazi</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setViewingHeadteacherModal(inc);
                            setHtDecisionText(`Mkuu wa Shule ameidhinisha hatua ya adhabu na ushauri nasaha kwa mwanafunzi ${inc.pupilName}.`);
                          }}
                          className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Uamuzi wa Mwalimu Mkuu</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-300 rounded-3xl space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">Hakuna Kesi Nzito Zinazosubiri Uamuzi</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Kesi zote nzito zimekaguliwa na kuidhinishwa na Mwalimu Mkuu. Daftari la nidhamu lipo salama.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 3: UFUATILIAJI WA UTORO & MAHUDHURIO YA KILA SIKU */}
          {/* =================================================================== */}
          {activeTab === 'ATTENDANCE_FEED' && (
            <div className="space-y-4">
              {/* Date Controller */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-black text-slate-900">Mapokezi ya Mahudhurio Kutoka kwa Walimu wa Madarasa</h4>
                  <p className="text-slate-600 mt-0.5">
                    Kila mwalimu wa darasa anapopiga roll-call asubuhi, wanafunzi watoro wanatokea hapa moja kwa moja.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Tarehe:</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {dateFeeds.length > 0 ? (
                <div className="space-y-3">
                  {dateFeeds.map((feed) => (
                    <div
                      key={feed.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{feed.className}</h4>
                          <span className="text-xs text-slate-500">Mwalimu wa Darasa: {feed.classTeacherName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-emerald-800 font-bold">Waliopo: {feed.presentCount}/{feed.totalStudents}</span>
                          <span className="text-rose-700 font-black">Watoro: {feed.absentCount}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold text-[10px]">
                            {feed.attendanceRate}%
                          </span>
                        </div>
                      </div>

                      {feed.absentees.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {feed.absentees.map((pupil) => (
                            <div key={pupil.admNo} className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-900 block">{pupil.name} ({pupil.admNo})</span>
                                <span className="text-[11px] text-rose-800">Sababu: {pupil.reason}</span>
                                <span className="text-[10px] text-slate-500 block">Mzazi: {pupil.parentPhone}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  // Open new incident prefilled with this absentee
                                  setFormPupilName(pupil.name);
                                  setFormAdmNo(pupil.admNo);
                                  setFormClass(feed.className);
                                  setFormCategory('UTORO_SUGU');
                                  setFormSeverity('WASTANI');
                                  setFormDescription(`Mwanafunzi amekuwa mtoro kwa siku ${pupil.daysAbsent} mfululizo bila taarifa rasmi.`);
                                  setFormAction('Barua ya wito kwa mzazi imetolewa na ujumbe wa SMS/WhatsApp.');
                                  setFormParentPhone(pupil.parentPhone);
                                  setShowNewIncidentModal(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[10px] transition-colors"
                              >
                                Sajili Kosa &amp; Wito
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-800 font-semibold">Wanafunzi wote walihudhuria darasani leo ✓</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50/70 border border-dashed border-slate-300 rounded-3xl space-y-2">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">Hakuna Ripoti ya Roll-Call kwa Tarehe Hii</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Walimu wa madarasa hawajawasilisha mahudhurio kwa tarehe {selectedDate}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* MODAL 1: FORM - RECORD NEW DISCIPLINARY INCIDENT (MWALIMU WA NIDHAMU) */}
        {/* ===================================================================== */}
        {showNewIncidentModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-xl shadow-2xl border border-emerald-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Sajili Kosa Jipya la Kinidhamu</h3>
                    <p className="text-xs text-slate-500">Inajazwa na Mwalimu wa Nidhamu • Hurekodiwa kwenye Masijala Kuu</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewIncidentModal(false)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateIncidentSubmit} className="space-y-3.5 text-xs">
                {/* Pupil Name & Adm No */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Jina Kamili la Mwanafunzi: *
                    </label>
                    <input
                      type="text"
                      required
                      value={formPupilName}
                      onChange={(e) => setFormPupilName(e.target.value)}
                      placeholder="k.m. Faraji Saidi Mkude"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Namba ya Usajili (Admission No):
                    </label>
                    <input
                      type="text"
                      value={formAdmNo}
                      onChange={(e) => setFormAdmNo(e.target.value)}
                      placeholder="k.m. PUP-2026-093"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* Class & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Darasa la Mwanafunzi: *
                    </label>
                    <select
                      value={formClass}
                      onChange={(e) => setFormClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    >
                      <option value="Awali / Chekechea (Kindergarten)">Awali / Chekechea (Kindergarten)</option>
                      <option value="Standard 1 (Grade 1)">Standard 1 (Grade 1)</option>
                      <option value="Standard 2 (Grade 2)">Standard 2 (Grade 2)</option>
                      <option value="Standard 3 (Grade 3)">Standard 3 (Grade 3)</option>
                      <option value="Standard 4 (Grade 4)">Standard 4 (Grade 4)</option>
                      <option value="Standard 5 (Grade 5)">Standard 5 (Grade 5)</option>
                      <option value="Standard 6 (Grade 6)">Standard 6 (Grade 6)</option>
                      <option value="Standard 7 (Grade 7)">Standard 7 (Grade 7)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Aina ya Kosa la Kinidhamu: *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => handleCategoryChange(e.target.value as IncidentCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    >
                      {Object.keys(CATEGORY_MAP).map((k) => (
                        <option key={k} value={k}>
                          {CATEGORY_MAP[k as IncidentCategory].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Severity Level */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Kiwango cha Kosa (Severity):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['KAWAIDA', 'WASTANI', 'NZITO'] as IncidentSeverity[]).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setFormSeverity(sev)}
                        className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-all ${
                          formSeverity === sev
                            ? sev === 'NZITO'
                              ? 'bg-rose-700 text-white border-rose-800 shadow-xs'
                              : sev === 'WASTANI'
                              ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                              : 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {sev === 'KAWAIDA' ? 'Kawaida (Onyo)' : sev === 'WASTANI' ? 'Wastani (Kamati)' : 'Nzito (Kwa Mkuu)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Incident Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Maelezo ya Tukio / Kosa Lililotokea: *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Eleza kilichotokea, muda, eneo, na mashahidi kama wapo..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Action Taken */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Hatua Zilizochukuliwa na Mwalimu wa Nidhamu: *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAction}
                    onChange={(e) => setFormAction(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {/* Parent Contact Details */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                  <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">
                    Mawasiliano ya Mzazi / Mlezi:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold mb-1">Jina la Mzazi:</label>
                      <input
                        type="text"
                        value={formParentName}
                        onChange={(e) => setFormParentName(e.target.value)}
                        placeholder="k.m. Saidi Mkude"
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold mb-1">Nambari ya Simu:</label>
                      <input
                        type="text"
                        value={formParentPhone}
                        onChange={(e) => setFormParentPhone(e.target.value)}
                        placeholder="k.m. 0713 445 566"
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={formNotifyParentDirectly}
                      onChange={(e) => setFormNotifyParentDirectly(e.target.checked)}
                      className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Tuma Taarifa Rasmi kwa Mzazi Papo Hapo (SMS &amp; WhatsApp Notification)
                    </span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNewIncidentModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Hifadhi &amp; Tuma kwa Mzazi</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 2: OFFICIAL PARENT SUMMONS LETTER (BARUA YA WITO WA MZAZI) */}
        {/* ===================================================================== */}
        {viewingSummonsModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Barua Rasmi ya Wito wa Mzazi
                </span>
                <button
                  type="button"
                  onClick={() => setViewingSummonsModal(null)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Official Letterhead */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 text-xs text-slate-800 font-serif leading-relaxed">
                <div className="text-center space-y-1 border-b border-slate-200 pb-3 font-sans">
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    JAMHURI YA MUUNGANO WA TANZANIA
                  </div>
                  <div className="text-xs font-black text-slate-900 uppercase">
                    HALMASHAURI YA WILAYA • IDARA YA ELIMU YA MSINGI
                  </div>
                  <div className="text-sm font-black text-emerald-900 uppercase">
                    SHULE YA MSINGI KUKUMBUKA
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    Kumb. Na: {viewingSummonsModal.refNo} • Tarehe: {viewingSummonsModal.date}
                  </div>
                </div>

                <div className="space-y-1">
                  <div><strong>Kwa Mzazi/Mlezi wa:</strong> {viewingSummonsModal.pupilName}</div>
                  <div><strong>Darasa:</strong> {viewingSummonsModal.class} (Namba: {viewingSummonsModal.admNo})</div>
                  <div><strong>Simu:</strong> {viewingSummonsModal.parentPhone}</div>
                </div>

                <div className="font-bold text-slate-900 uppercase underline text-center font-sans text-xs">
                  YAH: WITO WA MZAZI KUHUSU KOSA LA KINIDHAMU YA MWANAFUNZI
                </div>

                <p>
                  Tafadhali rejea kichwa cha habari hapo juu.
                </p>

                <p>
                  Uongozi wa Shule ya Msingi Kukumbuka kupitia Ofisi ya Mwalimu wa Nidhamu unakuarifu kuwa mwanafunzi <strong>{viewingSummonsModal.pupilName}</strong> anayesoma darasa la <strong>{viewingSummonsModal.class}</strong> amehusika katika kosa la <strong>{viewingSummonsModal.categoryLabel}</strong> tarehe {viewingSummonsModal.date}.
                </p>

                <p className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 italic font-sans text-[11px]">
                  &quot;{viewingSummonsModal.issueDescription}&quot;
                </p>

                <p>
                  Kutokana na uzito wa suala hili, unaombwa kufika katika Ofisi ya Mkuu wa Shule / Mwalimu wa Nidhamu siku ya <strong>kesho saa 03:00 Asubuhi</strong> kwa ajili ya mazungumzo ya pamoja juu ya mwenendo na maendeleo ya mwanao.
                </p>

                <div className="pt-4 flex items-center justify-between font-sans text-xs">
                  <div>
                    <div className="font-bold">{viewingSummonsModal.recordedBy}</div>
                    <div className="text-[10px] text-slate-500">Mwalimu wa Nidhamu</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Mwl. Augustine Mrosso</div>
                    <div className="text-[10px] text-emerald-800 font-bold">Mkuu wa Shule (Headteacher)</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-slate-500 font-mono">
                  Imehifadhiwa kwenye Masijala Kuu ya Shule
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Chapisha (Print)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      notifyUser('success', 'Barua Imepakuliwa!', `Barua ya wito ya ${viewingSummonsModal.pupilName} imehifadhiwa kama PDF.`);
                      setViewingSummonsModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Pakua PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 3: INSTANT WHATSAPP / SMS SENDER TO PARENT */}
        {/* ===================================================================== */}
        {viewingWhatsAppModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Tuma Ujumbe wa Moja kwa Moja kwa Mzazi</h3>
                    <p className="text-xs text-slate-500">WhatsApp &amp; SMS Gateway ya Shule</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingWhatsAppModal(null)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Mpokeaji: {viewingWhatsAppModal.parentName}</span>
                    <span className="font-mono text-emerald-800 font-bold">{viewingWhatsAppModal.parentPhone}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Mwanafunzi: <strong>{viewingWhatsAppModal.pupilName}</strong> ({viewingWhatsAppModal.class})
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Muhtasari wa Ujumbe Unaotumwa:
                  </label>
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-300 font-mono text-[11px] text-slate-800 leading-relaxed space-y-2">
                    <p>
                      <strong>SHULE YA MSINGI KUKUMBUKA - TAARIFA YA NIDHAMU</strong>
                    </p>
                    <p>
                      Habari Ndugu {viewingWhatsAppModal.parentName}, mwanafunzi {viewingWhatsAppModal.pupilName} ({viewingWhatsAppModal.class}) amerekodiwa kosa la: <strong>{viewingWhatsAppModal.categoryLabel}</strong> tarehe {viewingWhatsAppModal.date}.
                    </p>
                    <p>
                      Hatua iliyochukuliwa: {viewingWhatsAppModal.actionTaken}.
                    </p>
                    <p>
                      Tafadhali wasiliana na shule au kagua Portal ya Mzazi kwa maelezo zaidi. Simu ya Ofisi: 0754 000 111.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewingWhatsAppModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Funga
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const cleanPhone = viewingWhatsAppModal.parentPhone.replace(/[^0-9]/g, '');
                    const message = encodeURIComponent(
                      `SHULE YA MSINGI KUKUMBUKA - TAARIFA YA NIDHAMU\n\nHabari Ndugu ${viewingWhatsAppModal.parentName}, mwanao ${viewingWhatsAppModal.pupilName} (${viewingWhatsAppModal.class}) amerekodiwa kosa la: ${viewingWhatsAppModal.categoryLabel}.\n\nHatua: ${viewingWhatsAppModal.actionTaken}.\n\nTafadhali wasiliana na shule kwa ufafanuzi zaidi.`
                    );
                    const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '255' + cleanPhone.slice(1) : cleanPhone}?text=${message}`;
                    window.open(whatsappUrl, '_blank');

                    // Mark as notified in state
                    const updated = incidents.map((i) =>
                      i.id === viewingWhatsAppModal.id
                        ? { ...i, parentNotified: true, parentNotifiedVia: 'WHATSAPP' as const }
                        : i
                    );
                    saveIncidentsState(updated);
                    setViewingWhatsAppModal(null);
                    notifyUser('success', 'Ujumbe Umetumwa WhatsApp!', `Taarifa ya nidhamu imetumwa kwa mzazi ${viewingWhatsAppModal.parentName}.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tuma WhatsApp Papo Hapo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL 4: HEADTEACHER EXECUTIVE DECISION MODAL */}
        {/* ===================================================================== */}
        {viewingHeadteacherModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-rose-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-rose-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Uamuzi Rasmi wa Mwalimu Mkuu</h3>
                    <p className="text-xs text-slate-500">Ofisi ya Mkuu wa Shule • Uamuzi wa Mwisho wa Kinidhamu</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingHeadteacherModal(null)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1">
                  <span className="font-bold text-rose-950 block">
                    Mwanafunzi: {viewingHeadteacherModal.pupilName} ({viewingHeadteacherModal.class})
                  </span>
                  <p className="text-rose-800">
                    Kosa: <strong>{viewingHeadteacherModal.categoryLabel}</strong>
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Maelezo: {viewingHeadteacherModal.issueDescription}
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Uamuzi na Maagizo ya Mkuu wa Shule (Headteacher Sanction / Resolution):
                  </label>
                  <textarea
                    rows={3}
                    value={htDecisionText}
                    onChange={(e) => setHtDecisionText(e.target.value)}
                    placeholder="Andika uamuzi rasmi wa kiutawala (k.m. Kusimamishwa masomo siku 7, onyo kali la maandishi, au ushauri nasaha mbele ya mzazi)..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewingHeadteacherModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Ghairi
                </button>

                <button
                  type="button"
                  onClick={() => handleHeadteacherApprove(viewingHeadteacherModal.id)}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Thibitisha na Weka Muhuri wa Uamuzi</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
