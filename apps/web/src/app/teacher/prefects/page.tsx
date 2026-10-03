'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  Download,
  Plus,
  X,
  Search,
  Filter,
  Check,
  Building2,
  UserCheck,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
  ClipboardList,
  Flame,
  Star,
  Layers,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, PRIMARY_CLASSES_LIST, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

// =============================================================================
// TYPES & DATA: SCHOOL PREFECTS & STUDENT COUNCIL (BARAZA LA VIRANJA)
// =============================================================================

export type PrefectRoleType =
  | 'KIRANJA_MKUU'
  | 'KIRANJA_MKUU_MSAIDIZI'
  | 'TAALUMA'
  | 'USAFI_NA_MAZINGIRA'
  | 'MUDA_NA_KENGELE'
  | 'AFYA_NA_HUDUMA_YA_KWANZA'
  | 'MICHEZO_NA_UTAMADUNI'
  | 'CHAKULA_NA_LISHE'
  | 'MAKTABA'
  | 'MONITA_WA_DARASA';

export interface PrefectMember {
  id: string;
  fullName: string;
  gender: 'M' | 'F';
  assignedClass: string;
  roleType: PrefectRoleType;
  roleTitleSwahili: string;
  badgeNumber: string;
  tenureYear: string;
  responsibilities: string[];
  performanceScore: number; // 0 - 100
  appointedDate: string;
  appointedBy: string;
  status: 'ACTIVE' | 'ON_PROBATION' | 'ALUMNUS';
  avatarInitials: string;
}

export interface DailyDutyInspectionRecord {
  id: string;
  date: string;
  dutyArea: string; // e.g. "Ukaguzi wa Usafi wa Vyoo na Viwanja", "Mstari wa Mkutano wa Asubuhi", "Wanaochelewa Lango Kuu"
  reportingPrefect: string;
  verifiedByTeacher: string;
  observations: string;
  rating: 'BORA' | 'WASTANI' | 'INAHITAJI_MAREKEBISHO';
}

const INITIAL_PREFECTS: PrefectMember[] = [
  {
    id: 'pref-001',
    fullName: 'Faraji Saidi Mkude',
    gender: 'M',
    assignedClass: 'Standard 7 (Grade 7)',
    roleType: 'KIRANJA_MKUU',
    roleTitleSwahili: 'Kiranja Mkuu wa Shule (Head Boy)',
    badgeNumber: 'PREF-2026-001',
    tenureYear: '2026',
    responsibilities: [
      'Uongozi mkuu wa baraza la viranja wote wa shule',
      'Kusimamia gwaride na mikutano ya asubuhi (morning assembly)',
      'Daraja kuu la mawasiliano kati ya wanafunzi na Mwalimu wa Nidhamu',
    ],
    performanceScore: 96,
    appointedDate: '2026-01-12',
    appointedBy: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    status: 'ACTIVE',
    avatarInitials: 'FM',
  },
  {
    id: 'pref-002',
    fullName: 'Amina Salum Rashid',
    gender: 'F',
    assignedClass: 'Standard 7 (Grade 7)',
    roleType: 'KIRANJA_MKUU_MSAIDIZI',
    roleTitleSwahili: 'Kiranja Mkuu Msaidizi (Head Girl)',
    badgeNumber: 'PREF-2026-002',
    tenureYear: '2026',
    responsibilities: [
      'Mratibu mkuu wa nidhamu na ustawi wa wasichana shuleni',
      'Kusimamia ratiba ya ukaguzi wa sare za shule na usafi wa mabweni/vyoo',
      'Msaidizi mkuu wa Head Boy kwenye majukumu yote ya kiserikali ya wanafunzi',
    ],
    performanceScore: 98,
    appointedDate: '2026-01-12',
    appointedBy: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    status: 'ACTIVE',
    avatarInitials: 'AS',
  },
  {
    id: 'pref-003',
    fullName: 'Baraka David Massawe',
    gender: 'M',
    assignedClass: 'Standard 6 (Grade 6)',
    roleType: 'USAFI_NA_MAZINGIRA',
    roleTitleSwahili: 'Kiranja wa Usafi na Mazingira',
    badgeNumber: 'PREF-2026-003',
    tenureYear: '2026',
    responsibilities: [
      'Kugawia maeneo ya usafi wa shule kila asubuhi',
      'Ukaguzi wa vyoo, madarasa, bustani na viwanja vya michezo',
      'Kutoa ripoti ya darasa safi la wiki kwa Mwalimu wa Nidhamu',
    ],
    performanceScore: 92,
    appointedDate: '2026-01-15',
    appointedBy: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    status: 'ACTIVE',
    avatarInitials: 'BD',
  },
  {
    id: 'pref-004',
    fullName: 'Neema Josephat',
    gender: 'F',
    assignedClass: 'Standard 6 (Grade 6)',
    roleType: 'MUDA_NA_KENGELE',
    roleTitleSwahili: 'Kiranja wa Muda na Kengele (Timekeeper)',
    badgeNumber: 'PREF-2026-004',
    tenureYear: '2026',
    responsibilities: [
      'Kupiga kengele ya kuanza na kumaliza vipindi kwa usahihi wa sekunde',
      'Kurekodi wanafunzi wanaochelewa kufika shuleni asubuhi langoni',
      'Kusimamia utulivu wa vipindi wakati wa mabadilishano ya walimu',
    ],
    performanceScore: 95,
    appointedDate: '2026-01-15',
    appointedBy: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    status: 'ACTIVE',
    avatarInitials: 'NJ',
  },
  {
    id: 'pref-005',
    fullName: 'Juma Bakari Mrope',
    gender: 'M',
    assignedClass: 'Standard 5 (Grade 5)',
    roleType: 'AFYA_NA_HUDUMA_YA_KWANZA',
    roleTitleSwahili: 'Kiranja wa Afya na Huduma ya Kwanza',
    badgeNumber: 'PREF-2026-005',
    tenureYear: '2026',
    responsibilities: [
      'Kusimamia chumba cha huduma ya kwanza (Sick Bay)',
      'Kutoa msaada wa kwanza kwa wanafunzi wanaoumia michezoni au kuugua ghafla',
      'Kutoa taarifa ya haraka kwa Mwalimu wa Zamu na Mwalimu wa Nidhamu',
    ],
    performanceScore: 90,
    appointedDate: '2026-01-18',
    appointedBy: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    status: 'ACTIVE',
    avatarInitials: 'JB',
  },
  {
    id: 'pref-006',
    fullName: 'Kelvin Shayo',
    gender: 'M',
    assignedClass: 'Standard 7 (Grade 7)',
    roleType: 'TAALUMA',
    roleTitleSwahili: 'Kiranja wa Taaluma na Maktaba',
    badgeNumber: 'PREF-2026-006',
    tenureYear: '2026',
    responsibilities: [
      'Kusimamia utulivu wa maktaba ya shule na vipindi vya kujisomea jioni',
      'Kuratibu mijadala ya kitaaluma (academic clubs & quizzes)',
      'Kushirikiana na Mwalimu wa Taaluma kwenye ratiba za mitihani',
    ],
    performanceScore: 97,
    appointedDate: '2026-01-12',
    appointedBy: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    status: 'ACTIVE',
    avatarInitials: 'KS',
  },
  {
    id: 'pref-007',
    fullName: 'Rehema Hamisi',
    gender: 'F',
    assignedClass: 'Standard 4 (Grade 4)',
    roleType: 'MONITA_WA_DARASA',
    roleTitleSwahili: 'Monita wa Darasa la Nne (Class Monitor)',
    badgeNumber: 'PREF-2026-007',
    tenureYear: '2026',
    responsibilities: [
      'Kusimamia utulivu na amani darasani mwalimu asipokuwepo',
      'Kutunza chaki, daftari la mahudhurio, na vifaa vya darasa',
      'Kutoa ripoti ya wanafunzi wasiofanya mazoezi ya darasani',
    ],
    performanceScore: 91,
    appointedDate: '2026-01-20',
    appointedBy: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    status: 'ACTIVE',
    avatarInitials: 'RH',
  },
];

const INITIAL_INSPECTIONS: DailyDutyInspectionRecord[] = [
  {
    id: 'insp-001',
    date: '2026-10-03',
    dutyArea: 'Ukaguzi wa Usafi wa Maeneo ya Shule & Vyoo',
    reportingPrefect: 'Baraka David Massawe (Kiranja wa Mazingira)',
    verifiedByTeacher: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    observations: 'Madarasa yote kuanzia la 1 hadi la 7 yalisafishwa vizuri kabla ya saa 07:30 asubuhi. Vyoo vya wasichana na wavulana vimenyunyiziwa dawa.',
    rating: 'BORA',
  },
  {
    id: 'insp-002',
    date: '2026-10-03',
    dutyArea: 'Wanaochelewa Asubuhi Getini (Latecomers Log)',
    reportingPrefect: 'Neema Josephat (Kiranja wa Muda)',
    verifiedByTeacher: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    observations: 'Wanafunzi 4 wa Darasa la 5 na 6 walichelewa kufika baada ya kengele ya saa 07:30. Sababu kuu ni mvua ya asubuhi. Wameandikwa kwenye kitabu cha nidhamu.',
    rating: 'WASTANI',
  },
  {
    id: 'insp-003',
    date: '2026-10-02',
    dutyArea: 'Utulivu na Nidhamu ya Gwaride la Asubuhi',
    reportingPrefect: 'Faraji Saidi Mkude (Head Boy)',
    verifiedByTeacher: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    observations: 'Wanafunzi wote 275 walipanga mistari kulingana na urefu. Wimbo wa Taifa na Wimbo wa Shule uliimbwa kwa heshima na uchangamfu mkubwa.',
    rating: 'BORA',
  },
];

const STORAGE_PREFECTS_KEY = 'academic_portal_prefects_registry_v1';
const STORAGE_INSPECTIONS_KEY = 'academic_portal_duty_inspections_v1';

export default function SchoolPrefectsCouncilPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [prefects, setPrefects] = useState<PrefectMember[]>(() => {
    if (typeof window === 'undefined') return INITIAL_PREFECTS;
    try {
      const saved = localStorage.getItem(STORAGE_PREFECTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PREFECTS;
  });

  const [inspections, setInspections] = useState<DailyDutyInspectionRecord[]>(() => {
    if (typeof window === 'undefined') return INITIAL_INSPECTIONS;
    try {
      const saved = localStorage.getItem(STORAGE_INSPECTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_INSPECTIONS;
  });

  const [activeTab, setActiveTab] = useState<'PREFECTS_LIST' | 'DUTY_LOGS'>('PREFECTS_LIST');
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  // Modals
  const [showAddPrefectModal, setShowAddPrefectModal] = useState(false);
  const [showAddInspectionModal, setShowAddInspectionModal] = useState(false);
  const [selectedPrefectCertificate, setSelectedPrefectCertificate] = useState<PrefectMember | null>(null);

  // Form State: Add Prefect
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'M' | 'F'>('M');
  const [formClass, setFormClass] = useState('Standard 7 (Grade 7)');
  const [formRoleType, setFormRoleType] = useState<PrefectRoleType>('USAFI_NA_MAZINGIRA');
  const [formRoleTitle, setFormRoleTitle] = useState('Kiranja wa Usafi na Mazingira');
  const [formResp1, setFormResp1] = useState('');
  const [formResp2, setFormResp2] = useState('');

  // Form State: Inspection
  const [formDutyArea, setFormDutyArea] = useState('Ukaguzi wa Usafi wa Maeneo ya Shule');
  const [formReportingPrefect, setFormReportingPrefect] = useState(INITIAL_PREFECTS[0].fullName);
  const [formObservations, setFormObservations] = useState('');
  const [formRating, setFormRating] = useState<'BORA' | 'WASTANI' | 'INAHITAJI_MAREKEBISHO'>('BORA');

  useEffect(() => {
    const session = getCurrentSession();
    setCurrentUser(session);
  }, []);

  const savePrefects = (list: PrefectMember[]) => {
    setPrefects(list);
    try {
      localStorage.setItem(STORAGE_PREFECTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const saveInspections = (list: DailyDutyInspectionRecord[]) => {
    setInspections(list);
    try {
      localStorage.setItem(STORAGE_INSPECTIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  // Add New Prefect Submit
  const handleAddPrefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      notifyUser('warning', 'Jina Linahitajika', 'Tafadhali andika jina la mwanafunzi anayeteuliwa kuwa kiranja.');
      return;
    }

    const parts = formName.trim().split(' ');
    const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : formName.slice(0, 2).toUpperCase();
    const badge = `PREF-2026-${String(prefects.length + 1).padStart(3, '0')}`;

    const newPrefect: PrefectMember = {
      id: `pref-${Date.now()}`,
      fullName: formName.trim(),
      gender: formGender,
      assignedClass: formClass,
      roleType: formRoleType,
      roleTitleSwahili: formRoleTitle,
      badgeNumber: badge,
      tenureYear: '2026',
      responsibilities: [
        formResp1.trim() || 'Kusimamia nidhamu na taratibu za shule kwa uaminifu',
        formResp2.trim() || 'Kutoa mfano bora wa tabia, usafi na masomo kwa wanafunzi wengine',
      ],
      performanceScore: 95,
      appointedDate: new Date().toISOString().split('T')[0],
      appointedBy: currentUser?.fullName ? `${currentUser.fullName} (Mwl. Nidhamu)` : 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
      status: 'ACTIVE',
      avatarInitials: initials,
    };

    const updated = [newPrefect, ...prefects];
    savePrefects(updated);
    setShowAddPrefectModal(false);

    // Reset Form
    setFormName('');
    setFormResp1('');
    setFormResp2('');

    notifyUser(
      'success',
      'Kiranja Ameteuliwa Rasmi!',
      `${newPrefect.fullName} ameteuliwa rasmi kuwa ${newPrefect.roleTitleSwahili}. Hati yake ya uteuzi imetengenezwa.`
    );

    // Open certificate preview
    setSelectedPrefectCertificate(newPrefect);
  };

  // Add Duty Inspection
  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formObservations.trim()) {
      notifyUser('warning', 'Maelezo Yanahitajika', 'Tafadhali andika ripoti ya ukaguzi wa doria.');
      return;
    }

    const newRec: DailyDutyInspectionRecord = {
      id: `insp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dutyArea: formDutyArea,
      reportingPrefect: formReportingPrefect,
      verifiedByTeacher: currentUser?.fullName ? `${currentUser.fullName} (Mwl. Nidhamu)` : 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
      observations: formObservations.trim(),
      rating: formRating,
    };

    const updated = [newRec, ...inspections];
    saveInspections(updated);
    setShowAddInspectionModal(false);
    setFormObservations('');

    notifyUser('success', 'Ripoti ya Doria Imehifadhiwa!', 'Taarifa za ukaguzi wa kila siku wa viranja zimewekwa kwenye daftari.');
  };

  // Filtered Prefects
  const filteredPrefects = useMemo(() => {
    return prefects.filter((p) => {
      const matchSearch =
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.roleTitleSwahili.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchGender = genderFilter === 'ALL' || p.gender === genderFilter;
      const matchClass = classFilter === 'ALL' || p.assignedClass === classFilter;

      return matchSearch && matchGender && matchClass;
    });
  }, [prefects, searchTerm, genderFilter, classFilter]);

  // KPIs
  const totalBoys = prefects.filter((p) => p.gender === 'M').length;
  const totalGirls = prefects.filter((p) => p.gender === 'F').length;
  const avgPerformance = prefects.length > 0 ? Math.round(prefects.reduce((acc, p) => acc + p.performanceScore, 0) / prefects.length) : 0;

  // Export Prefects to CSV
  const handleExportCSV = () => {
    const headers = [
      'Namba ya Kiranja (Badge)',
      'Jina Kamili',
      'Jinsia',
      'Darasa',
      'Nafasi / Cheo',
      'Mwaka wa Uongozi',
      'Alama ya Utendaji',
      'Tarehe ya Kuteuliwa',
      'Mteuzi',
    ];

    const rows = filteredPrefects.map((p) => [
      `"${p.badgeNumber}"`,
      `"${p.fullName}"`,
      `"${p.gender}"`,
      `"${p.assignedClass}"`,
      `"${p.roleTitleSwahili}"`,
      `"${p.tenureYear}"`,
      `"${p.performanceScore}%"`,
      `"${p.appointedDate}"`,
      `"${p.appointedBy}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Baraza_la_Viranja_Shule_Msingi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser('success', 'Orodha Imepakuliwa', `Viranja ${filteredPrefects.length} wamehamishwa kwenye faili la Excel/CSV.`);
  };

  return (
    <TeacherShell
      pageTitle="Baraza la Viranja wa Shule & Uongozi wa Wanafunzi (School Prefects Council)"
      pageDescription="Ofisi ya Mwalimu wa Nidhamu: Usimamizi, uteuzi, majukumu ya kila siku, na ukaguzi wa doria wa Baraza la Viranja wa Shule (Head Boy, Head Girl, Viranja wa Mazingira, Muda, Afya, Taaluma, na Monita wa Madarasa)."
      requiredRole="LEADERSHIP"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Quick Links Nav for Discipline Office */}
        <div className="flex items-center gap-2 flex-wrap pb-1">
          <Link
            href="/teacher/discipline"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Kesi za Nidhamu &amp; Makosa</span>
          </Link>

          <Link
            href="/teacher/gatepass"
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Daftari la Vibali vya Ruhusa</span>
          </Link>

          <Link
            href="/teacher/enrollment"
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Daftari Kuu la Udahili</span>
          </Link>
        </div>

        {/* 1. TOP KPI SUMMARY */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-3xl bg-white/95 border border-purple-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase block">Jumla ya Viranja</span>
            <span className="text-2xl font-black text-purple-950 block mt-1">{prefects.length} Viranja</span>
            <span className="text-[11px] text-purple-700 font-bold">Baraza Kuu la Wanafunzi</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-blue-200/90 shadow-xs">
            <span className="text-xs font-bold text-blue-700 uppercase block">Wavulana &bull; Wasichana</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">
              {totalBoys} W &bull; {totalGirls} K
            </span>
            <span className="text-[11px] text-blue-700 font-semibold">Uwiano Sawa wa Kijinsia</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-xs font-bold text-emerald-700 uppercase block">Alama ya Utendaji</span>
            <span className="text-2xl font-black text-emerald-800 block mt-1">{avgPerformance}%</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Kiwango cha Juu cha Uadilifu</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-amber-200/90 shadow-xs">
            <span className="text-xs font-bold text-amber-700 uppercase block">Ripoti za Doria za Kila Siku</span>
            <span className="text-2xl font-black text-amber-900 block mt-1">{inspections.length} Ripoti</span>
            <span className="text-[11px] text-amber-700 font-semibold">Ukaguzi wa Mazingira &amp; Muda</span>
          </div>
        </div>

        {/* 2. MAIN TABS & ACTION BUTTONS */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
            {/* Tab Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('PREFECTS_LIST')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  activeTab === 'PREFECTS_LIST'
                    ? 'bg-purple-900 text-white shadow-md shadow-purple-950/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Orodha ya Viranja ({prefects.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('DUTY_LOGS')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  activeTab === 'DUTY_LOGS'
                    ? 'bg-purple-900 text-white shadow-md shadow-purple-950/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Ripoti za Doria za Kila Siku ({inspections.length})</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Pakua Excel</span>
              </button>

              {activeTab === 'PREFECTS_LIST' ? (
                <button
                  type="button"
                  onClick={() => setShowAddPrefectModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-black shadow-md shadow-purple-950/20 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4 text-purple-200" />
                  <span>+ Teua Kiranja Mpya</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddInspectionModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4 text-emerald-200" />
                  <span>+ Rekodi Doria ya Leo</span>
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: PREFECTS ROSTER */}
          {activeTab === 'PREFECTS_LIST' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tafuta jina la kiranja au cheo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ALL">Madarasa Yote (La 1 - La 7)</option>
                    {PRIMARY_CLASSES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ALL">Jinsia Zote (Wavulana &amp; Wasichana)</option>
                    <option value="M">Wavulana Pekee</option>
                    <option value="F">Wasichana Pekee</option>
                  </select>
                </div>
              </div>

              {/* Prefect Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrefects.map((p) => {
                  const isHead = p.roleType === 'KIRANJA_MKUU' || p.roleType === 'KIRANJA_MKUU_MSAIDIZI';

                  return (
                    <div
                      key={p.id}
                      className={`p-5 rounded-3xl border transition-all space-y-3 relative overflow-hidden ${
                        isHead
                          ? 'bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/50 border-purple-300 shadow-sm'
                          : 'bg-white/95 border-slate-200 shadow-xs hover:border-purple-200'
                      }`}
                    >
                      {/* Top Header Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-sm ${
                              isHead ? 'bg-purple-900 ring-4 ring-purple-200' : 'bg-slate-700'
                            }`}
                          >
                            {p.avatarInitials}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 leading-tight">{p.fullName}</h4>
                            <span className="text-[11px] font-bold text-purple-900 block mt-0.5">
                              {p.roleTitleSwahili}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {p.assignedClass} &bull; {p.gender === 'M' ? 'Mvulana' : 'Msichana'}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-200">
                          {p.badgeNumber}
                        </span>
                      </div>

                      {/* Performance Bar */}
                      <div className="space-y-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-600">Alama ya Utendaji:</span>
                          <span className="text-purple-900 font-black">{p.performanceScore}% (Bora)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-700 rounded-full"
                            style={{ width: `${p.performanceScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Responsibilities list */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Majukumu ya Kazi:
                        </span>
                        <ul className="text-[11px] text-slate-700 space-y-1 pl-3.5 list-disc leading-relaxed">
                          {p.responsibilities.slice(0, 2).map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-[10px] text-slate-500 font-medium">Uteuzi: {p.appointedDate}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedPrefectCertificate(p)}
                          className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold flex items-center gap-1 transition-colors"
                          title="Tazama na Chapisha Hati Rasmi ya Uteuzi"
                        >
                          <Printer className="w-3 h-3 text-purple-700" />
                          <span>Hati ya Uteuzi</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DAILY DUTY INSPECTIONS */}
          {activeTab === 'DUTY_LOGS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">Daftari la Ukaguzi wa Doria za Viranja</h4>
                  <p className="text-xs text-slate-500">Ripoti za kila siku za usafi wa mazingira, ukaguzi wa sare, na utunzaji wa muda.</p>
                </div>
              </div>

              <div className="space-y-3">
                {inspections.map((insp) => {
                  const isTop = insp.rating === 'BORA';

                  return (
                    <div
                      key={insp.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-950 font-bold text-[10px] border border-purple-300">
                            {insp.date}
                          </span>
                          <span className="font-black text-xs text-slate-900">{insp.dutyArea}</span>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed">{insp.observations}</p>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                          <span>Ripoti kutoka: <strong>{insp.reportingPrefect}</strong></span>
                          <span>&bull;</span>
                          <span>Uhakiki: <strong>{insp.verifiedByTeacher}</strong></span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {isTop ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-[10px] border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Kiwango Bora</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-[10px] border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Wastani</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. MODAL: APPOINT NEW PREFECT */}
        {showAddPrefectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-purple-200 max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Teua Kiranja Mpya wa Shule</h3>
                    <p className="text-[11px] text-slate-500">Ofisi ya Mwalimu wa Nidhamu &bull; Baraza la Viranja 2026</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddPrefectModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPrefect} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jina Kamili la Mwanafunzi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Mfano: Daudi Emanuel"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jinsia *</label>
                    <select
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value as 'M' | 'F')}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="M">Mvulana</option>
                      <option value="F">Msichana</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Darasa *</label>
                    <select
                      value={formClass}
                      onChange={(e) => setFormClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      {PRIMARY_CLASSES_LIST.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nafasi ya Kiranja *</label>
                    <select
                      value={formRoleType}
                      onChange={(e) => {
                        const val = e.target.value as PrefectRoleType;
                        setFormRoleType(val);
                        if (val === 'KIRANJA_MKUU') setFormRoleTitle('Kiranja Mkuu wa Shule (Head Boy)');
                        else if (val === 'KIRANJA_MKUU_MSAIDIZI') setFormRoleTitle('Kiranja Mkuu Msaidizi (Head Girl)');
                        else if (val === 'TAALUMA') setFormRoleTitle('Kiranja wa Taaluma na Masomo');
                        else if (val === 'USAFI_NA_MAZINGIRA') setFormRoleTitle('Kiranja wa Usafi na Mazingira');
                        else if (val === 'MUDA_NA_KENGELE') setFormRoleTitle('Kiranja wa Muda na Kengele');
                        else if (val === 'AFYA_NA_HUDUMA_YA_KWANZA') setFormRoleTitle('Kiranja wa Afya na Huduma ya Kwanza');
                        else if (val === 'MICHEZO_NA_UTAMADUNI') setFormRoleTitle('Kiranja wa Michezo na Sanaa');
                        else if (val === 'CHAKULA_NA_LISHE') setFormRoleTitle('Kiranja wa Chakula na Lishe');
                        else if (val === 'MONITA_WA_DARASA') setFormRoleTitle(`Monita wa Darasa (${formClass})`);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="USAFI_NA_MAZINGIRA">Kiranja wa Usafi na Mazingira</option>
                      <option value="MUDA_NA_KENGELE">Kiranja wa Muda na Kengele</option>
                      <option value="AFYA_NA_HUDUMA_YA_KWANZA">Kiranja wa Afya &amp; First Aid</option>
                      <option value="TAALUMA">Kiranja wa Taaluma</option>
                      <option value="MICHEZO_NA_UTAMADUNI">Kiranja wa Michezo</option>
                      <option value="CHAKULA_NA_LISHE">Kiranja wa Chakula</option>
                      <option value="MONITA_WA_DARASA">Monita wa Darasa</option>
                      <option value="KIRANJA_MKUU">Kiranja Mkuu (Head Boy)</option>
                      <option value="KIRANJA_MKUU_MSAIDIZI">Kiranja Mkuu Msaidizi (Head Girl)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jukumu Kuu la Kwanza *</label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Kusimamia usafi wa maeneo ya shule kila asubuhi"
                    value={formResp1}
                    onChange={(e) => setFormResp1(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jukumu Kuu la Pili</label>
                  <input
                    type="text"
                    placeholder="Mfano: Kutoa ripoti ya kila wiki kwa Mwalimu wa Nidhamu"
                    value={formResp2}
                    onChange={(e) => setFormResp2(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddPrefectModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-black shadow-md shadow-purple-950/20 transition-all"
                  >
                    Thibitisha Uteuzi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. MODAL: ADD DAILY DUTY RECORD */}
        {showAddInspectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-emerald-200 max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Rekodi Ripoti ya Doria ya Viranja</h3>
                    <p className="text-[11px] text-slate-500">Uhakiki wa Utendaji Kazi wa Kila Siku</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddInspectionModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddInspection} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Eneo / Aina ya Ukaguzi *</label>
                  <select
                    value={formDutyArea}
                    onChange={(e) => setFormDutyArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Ukaguzi wa Usafi wa Maeneo ya Shule & Vyoo">Ukaguzi wa Usafi wa Maeneo ya Shule &amp; Vyoo</option>
                    <option value="Wanaochelewa Asubuhi Getini (Latecomers Log)">Wanaochelewa Asubuhi Getini (Latecomers Log)</option>
                    <option value="Utulivu na Nidhamu ya Gwaride la Asubuhi">Utulivu na Nidhamu ya Gwaride la Asubuhi</option>
                    <option value="Ukaguzi wa Sare Rasmi za Shule na Viatu">Ukaguzi wa Sare Rasmi za Shule na Viatu</option>
                    <option value="Usafi wa Vyumba vya Madarasa na Meza">Usafi wa Vyumba vya Madarasa na Meza</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kiranja Aliyetoa Ripoti *</label>
                  <select
                    value={formReportingPrefect}
                    onChange={(e) => setFormReportingPrefect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {prefects.map((p) => (
                      <option key={p.id} value={`${p.fullName} (${p.roleTitleSwahili})`}>
                        {p.fullName} — {p.roleTitleSwahili}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matokeo ya Ukaguzi na Maelezo *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Eleza jinsi shughuli ilivyofanyika na matokeo yaliyobainika..."
                    value={formObservations}
                    onChange={(e) => setFormObservations(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kiwango cha Utekelezaji (Tathmini) *</label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="BORA">Kiwango Bora (Imetekelezwa Kikamilifu)</option>
                    <option value="WASTANI">Wastani (Inahitaji Maboresho Madogo)</option>
                    <option value="INAHITAJI_MAREKEBISHO">Inahitaji Marekebisho / Uangalizi Maalum</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddInspectionModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black shadow-md transition-all"
                  >
                    Hifadhi Ripoti
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. MODAL: OFFICIAL APPOINTMENT CERTIFICATE (HATI YA UTEUZI) */}
        {selectedPrefectCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-purple-300 max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8 text-center">
              {/* Certificate Border Frame */}
              <div className="border-4 border-double border-purple-900 p-6 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-900" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                      JAMHURI YA MUUNGANO WA TANZANIA
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-purple-950 uppercase tracking-tight">
                    SHULE YA MSINGI KUKUMBUKA PRIMARY
                  </h2>
                  <div className="inline-block px-4 py-1 rounded-full bg-purple-900 text-white text-[11px] font-black uppercase tracking-widest">
                    HATI RASMI YA UTEUZI WA KIRANJA WA SHULE
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  <p className="text-xs text-slate-600 italic">Hati hii inathibitisha rasmi kuwa mwanafunzi:</p>
                  <h3 className="text-xl font-black text-purple-950 underline decoration-purple-400 underline-offset-4">
                    {selectedPrefectCertificate.fullName}
                  </h3>
                  <p className="text-xs text-slate-700 font-semibold">
                    Darasa: <strong>{selectedPrefectCertificate.assignedClass}</strong> &bull; Namba: <strong>{selectedPrefectCertificate.badgeNumber}</strong>
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    Amekidhi vigezo vyote vya nidhamu, uchapakazi na uadilifu, na kwa mamlaka aliyopewa Mwalimu wa Nidhamu chini ya Sheria ya Elimu, anateuliwa rasmi kuwa:
                  </p>
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 inline-block font-black text-sm text-purple-950 tracking-wide mt-2">
                    ★ {selectedPrefectCertificate.roleTitleSwahili} ★
                  </div>
                </div>

                {/* Signatures Grid */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-xs text-center">
                  <div className="space-y-1">
                    <div className="h-10 flex items-center justify-center font-serif italic text-purple-900">
                      G. Makore
                    </div>
                    <div className="border-t border-slate-400 pt-1">
                      <strong className="block text-slate-900">Mwl. Godfroy Makore</strong>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">MWALIMU WA NIDHAMU</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-10 flex items-center justify-center font-serif italic text-purple-900">
                      A. Mkwawa
                    </div>
                    <div className="border-t border-slate-400 pt-1">
                      <strong className="block text-slate-900">Mwl. Augustino Mkwawa</strong>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">MKUU WA SHULE (MUHURI)</span>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 font-mono pt-2">
                  Hati hii ni kielelezo cha uongozi na mfano bora wa tabia njema shuleni.
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPrefectCertificate(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-xs transition-colors"
                >
                  Funga
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-purple-200" />
                  <span>Chapisha Hati ya Uteuzi</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
