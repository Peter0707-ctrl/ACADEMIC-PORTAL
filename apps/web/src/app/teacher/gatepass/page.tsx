'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  Filter,
  Download,
  Plus,
  X,
  Phone,
  Calendar,
  AlertTriangle,
  QrCode,
  ArrowRight,
  UserCheck,
  Building2,
  FileText,
  BadgeAlert,
  Hospital,
  HeartPulse,
  Home,
  Check,
  Users,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, PRIMARY_CLASSES_LIST, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

// =============================================================================
// TYPES & DATA: STUDENT GATE PASS & PERMISSIONS REGISTER
// =============================================================================

export type GatePassReason =
  | 'UGONJWA_HOSPITALI'
  | 'MSIBA_DHARURA_FAMILIA'
  | 'KUITWA_NA_MZAZI'
  | 'MAJUKUMU_YA_SHULE'
  | 'MATIBABU_SICKBAY'
  | 'NYINGINE';

export type GatePassStatus = 'ACTIVE_AWAY' | 'RETURNED' | 'OVERDUE';

export interface GatePassRecord {
  id: string;
  passNo: string;
  date: string;
  pupilName: string;
  admNo: string;
  assignedClass: string;
  reasonCategory: GatePassReason;
  reasonLabel: string;
  detailedReason: string;
  timeOut: string;
  expectedReturnTime: string;
  actualReturnTime?: string;
  status: GatePassStatus;
  authorizedBy: string; // e.g. "Mwl. Godfroy Makore (Mwl. Nidhamu)"
  pickupPersonName: string;
  pickupPersonRelationship: string;
  pickupPersonPhone: string;
  securityGuardCheckIn?: string;
  notes?: string;
}

const REASON_LABELS: Record<GatePassReason, { label: string; icon: string; badgeColor: string }> = {
  UGONJWA_HOSPITALI: {
    label: 'Matibabu / Hospitali',
    icon: 'Hospital',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  MATIBABU_SICKBAY: {
    label: 'Sick Bay / Mapumziko',
    icon: 'HeartPulse',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  MSIBA_DHARURA_FAMILIA: {
    label: 'Dharura ya Familia / Msiba',
    icon: 'Home',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  KUITWA_NA_MZAZI: {
    label: 'Kuchukuliwa na Mzazi',
    icon: 'Users',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  MAJUKUMU_YA_SHULE: {
    label: 'Wito / Majukumu Rasmi ya Shule',
    icon: 'Building2',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  NYINGINE: {
    label: 'Sababu Nyingine Maalum',
    icon: 'FileText',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
  },
};

// Clean state: Gate passes are dynamically recorded
const INITIAL_GATE_PASSES: GatePassRecord[] = [];

const STORAGE_GATE_PASS_KEY = 'academic_portal_gate_passes_v1';

export default function StudentGatePassPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [passes, setPasses] = useState<GatePassRecord[]>(() => {
    if (typeof window === 'undefined') return INITIAL_GATE_PASSES;
    try {
      const saved = localStorage.getItem(STORAGE_GATE_PASS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_GATE_PASSES;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | GatePassStatus>('ALL');
  const [reasonFilter, setReasonFilter] = useState<'ALL' | GatePassReason>('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  // Modals
  const [showNewPassModal, setShowNewPassModal] = useState(false);
  const [selectedPassForPrint, setSelectedPassForPrint] = useState<GatePassRecord | null>(null);

  // Form State
  const [formPupilName, setFormPupilName] = useState('');
  const [formAdmNo, setFormAdmNo] = useState('');
  const [formClass, setFormClass] = useState('Standard 4 (Grade 4)');
  const [formReasonCategory, setFormReasonCategory] = useState<GatePassReason>('UGONJWA_HOSPITALI');
  const [formDetailedReason, setFormDetailedReason] = useState('');
  const [formTimeOut, setFormTimeOut] = useState('Saa 10:00 Asubuhi');
  const [formExpectedReturn, setFormExpectedReturn] = useState('Kesho Asubuhi');
  const [formPickupName, setFormPickupName] = useState('');
  const [formPickupRelation, setFormPickupRelation] = useState('Mzazi (Baba/Mama)');
  const [formPickupPhone, setFormPickupPhone] = useState('');
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    const session = getCurrentSession();
    setCurrentUser(session);
  }, []);

  const savePasses = (newPasses: GatePassRecord[]) => {
    setPasses(newPasses);
    try {
      localStorage.setItem(STORAGE_GATE_PASS_KEY, JSON.stringify(newPasses));
    } catch (e) {
      console.error(e);
    }
  };

  // Submit New Pass
  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPupilName.trim()) {
      notifyUser('warning', 'Jina Linahitajika', 'Tafadhali jaza jina la mwanafunzi anayepewa ruhusa.');
      return;
    }

    const officerName = currentUser?.fullName
      ? `${currentUser.fullName} (${currentUser.role === 'DISCIPLINE' ? 'Mwl. Nidhamu' : currentUser.role === 'HEADTEACHER' ? 'Mkuu wa Shule' : 'Ofisi ya Nidhamu'})`
      : 'Mwl. Godfroy Makore (Mwl. Nidhamu)';

    const passNumber = `GP-2026-${String(100 + passes.length + 1).padStart(4, '0')}`;

    const newRecord: GatePassRecord = {
      id: `gp-${Date.now()}`,
      passNo: passNumber,
      date: new Date().toISOString().split('T')[0],
      pupilName: formPupilName.trim(),
      admNo: formAdmNo.trim() || `PUP-${Math.floor(1000 + Math.random() * 9000)}`,
      assignedClass: formClass,
      reasonCategory: formReasonCategory,
      reasonLabel: REASON_LABELS[formReasonCategory].label,
      detailedReason: formDetailedReason.trim() || 'Ruhusa maalum iliyotolewa na ofisi ya nidhamu.',
      timeOut: formTimeOut,
      expectedReturnTime: formExpectedReturn,
      status: 'ACTIVE_AWAY',
      authorizedBy: officerName,
      pickupPersonName: formPickupName.trim() || 'Mzazi Mwenyewe',
      pickupPersonRelationship: formPickupRelation,
      pickupPersonPhone: formPickupPhone.trim(),
      notes: formNotes.trim(),
    };

    const updated = [newRecord, ...passes];
    savePasses(updated);
    setShowNewPassModal(false);

    // Reset Form
    setFormPupilName('');
    setFormAdmNo('');
    setFormDetailedReason('');
    setFormPickupName('');
    setFormPickupPhone('');
    setFormNotes('');

    notifyUser(
      'success',
      'Kibali cha Ruhusa Kimeidhinishwa!',
      `Mwanafunzi ${newRecord.pupilName} amepewa kibali namba ${newRecord.passNo}. Hati ya getini ipo tayari kuchapwa.`
    );

    // Auto-open print preview
    setSelectedPassForPrint(newRecord);
  };

  // Mark Returned
  const handleMarkReturned = (passId: string) => {
    const updated = passes.map((p) => {
      if (p.id === passId) {
        const timeNow = new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });
        return {
          ...p,
          status: 'RETURNED' as GatePassStatus,
          actualReturnTime: `Ameingia saa ${timeNow}`,
        };
      }
      return p;
    });
    savePasses(updated);
    notifyUser('success', 'Mwanafunzi Amerejea Shuleni', 'Kumbukumbu imesasishwa kuwa mwanafunzi ameingia salama getini.');
  };

  // Filtered Passes
  const filteredPasses = useMemo(() => {
    return passes.filter((p) => {
      const matchSearch =
        p.pupilName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.passNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.admNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pickupPersonName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchReason = reasonFilter === 'ALL' || p.reasonCategory === reasonFilter;
      const matchClass = classFilter === 'ALL' || p.assignedClass === classFilter;

      return matchSearch && matchStatus && matchReason && matchClass;
    });
  }, [passes, searchTerm, statusFilter, reasonFilter, classFilter]);

  // KPIs
  const activeAwayCount = passes.filter((p) => p.status === 'ACTIVE_AWAY').length;
  const returnedCount = passes.filter((p) => p.status === 'RETURNED').length;
  const medicalCount = passes.filter((p) => p.reasonCategory === 'UGONJWA_HOSPITALI' || p.reasonCategory === 'MATIBABU_SICKBAY').length;
  const emergencyCount = passes.filter((p) => p.reasonCategory === 'MSIBA_DHARURA_FAMILIA').length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Namba ya Kibali',
      'Tarehe',
      'Jina la Mwanafunzi',
      'Namba ya Shule',
      'Darasa',
      'Sababu ya Ruhusa',
      'Muda wa Kutoka',
      'Muda wa Kurejea',
      'Hali ya Kibali',
      'Msimamizi Aliyeidhinisha',
      'Mtu Aliyemchukua',
      'Uhusiano',
      'Simu ya Mzazi',
    ];

    const rows = filteredPasses.map((p) => [
      `"${p.passNo}"`,
      `"${p.date}"`,
      `"${p.pupilName}"`,
      `"${p.admNo}"`,
      `"${p.assignedClass}"`,
      `"${p.reasonLabel}"`,
      `"${p.timeOut}"`,
      `"${p.expectedReturnTime}"`,
      `"${p.status === 'ACTIVE_AWAY' ? 'Yuko Nje' : 'Amerejea'}"`,
      `"${p.authorizedBy}"`,
      `"${p.pickupPersonName}"`,
      `"${p.pickupPersonRelationship}"`,
      `"${p.pickupPersonPhone}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Daftari_la_Vibali_vya_Ruhusa_Shuleni_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser('success', 'Daftari Limepakuliwa', `Vibali ${filteredPasses.length} vimehamishwa kwenye faili la Excel/CSV.`);
  };

  return (
    <TeacherShell
      pageTitle="Daftari la Vibali vya Ruhusa & Getini (Student Gate Pass Master)"
      pageDescription="Ofisi ya Mwalimu wa Nidhamu: Usimamizi, utoaji, na ukaguzi wa vibali rasmi vya wanafunzi kutoka nje ya shule (matibabu hospitalini, sick bay, dharura za familia, au kuitwa na wazazi)."
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
            href="/teacher/prefects"
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Baraza la Viranja wa Shule</span>
          </Link>

          <Link
            href="/teacher/enrollment"
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Daftari Kuu la Udahili</span>
          </Link>
        </div>

        {/* 1. TOP KPI CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase block">Jumla ya Vibali</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{passes.length}</span>
            <span className="text-[11px] text-emerald-800 font-bold">Muhula wa 1, 2026</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-amber-200/90 shadow-xs">
            <span className="text-xs font-bold text-amber-700 uppercase block">Waliopo Nje Hivi Sasa</span>
            <span className="text-2xl font-black text-amber-900 block mt-1">{activeAwayCount}</span>
            <span className="text-[11px] text-amber-700 font-semibold">Bado Hawajarejea Getini</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
            <span className="text-xs font-bold text-emerald-700 uppercase block">Wamerejea Salama</span>
            <span className="text-2xl font-black text-emerald-800 block mt-1">{returnedCount}</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Wamethibitishwa Getini</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-rose-200/90 shadow-xs">
            <span className="text-xs font-bold text-rose-700 uppercase block">Matibabu &amp; Hospitali</span>
            <span className="text-2xl font-black text-rose-900 block mt-1">{medicalCount}</span>
            <span className="text-[11px] text-rose-700 font-semibold">Kituo cha Afya / Sick Bay</span>
          </div>

          <div className="p-4 rounded-3xl bg-white/95 border border-purple-200/90 shadow-xs col-span-2 lg:col-span-1">
            <span className="text-xs font-bold text-purple-700 uppercase block">Dharura za Familia</span>
            <span className="text-2xl font-black text-purple-900 block mt-1">{emergencyCount}</span>
            <span className="text-[11px] text-purple-700 font-semibold">Wito wa Mzazi / Msiba</span>
          </div>
        </div>

        {/* 2. ACTIONS & SEARCH BAR */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-black text-[10px] border border-emerald-300">
                  OFISI YA NIDHAMU &bull; USALAMA WA WANAFUNZI
                </span>
                <span className="text-xs text-slate-500">Udhibiti wa Geti Kuu la Shule</span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Daftari Kuu la Vibali vya Ruhusa za Wanafunzi (Student Gate Passes)
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Pakua daftari la vibali vya ruhusa kwenye faili la Excel/CSV"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Pakua Excel</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNewPassModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-200" />
                <span>+ Toa Kibali cha Ruhusa</span>
              </button>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tafuta jina, namba ya kibali, au mzazi..."
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
                <option value="Nursery (Awali)">Nursery (Awali)</option>
                {PRIMARY_CLASSES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Hali Zote (Waliopo Nje &amp; Wamerejea)</option>
                <option value="ACTIVE_AWAY">Yuko Nje Hivi Sasa ⏳</option>
                <option value="RETURNED">Amerejea Shuleni ✓</option>
              </select>

              {/* Reason Filter */}
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">Sababu Zote za Ruhusa</option>
                <option value="UGONJWA_HOSPITALI">Matibabu / Hospitali</option>
                <option value="MATIBABU_SICKBAY">Sick Bay / Mapumziko</option>
                <option value="MSIBA_DHARURA_FAMILIA">Dharura ya Familia / Msiba</option>
                <option value="KUITWA_NA_MZAZI">Kuchukuliwa na Mzazi</option>
                <option value="MAJUKUMU_YA_SHULE">Majukumu Rasmi ya Shule</option>
              </select>
            </div>
          </div>

          {/* 3. TABLE OF GATE PASSES */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                  <th className="p-3">Namba ya Kibali</th>
                  <th className="p-3">Mwanafunzi</th>
                  <th className="p-3">Darasa</th>
                  <th className="p-3">Sababu ya Ruhusa</th>
                  <th className="p-3">Muda wa Kutoka &bull; Kurudi</th>
                  <th className="p-3">Aliyemchukua / Mzazi</th>
                  <th className="p-3 text-center">Hali</th>
                  <th className="p-3 text-right">Vitendo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPasses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      Hakuna vibali vya ruhusa vilivyopatikana kwa vigezo hivi.
                    </td>
                  </tr>
                ) : (
                  filteredPasses.map((p) => {
                    const badge = REASON_LABELS[p.reasonCategory];
                    const isAway = p.status === 'ACTIVE_AWAY';

                    return (
                      <tr key={p.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-emerald-950">
                          <span className="px-2 py-0.5 rounded bg-emerald-100/70 border border-emerald-200">
                            {p.passNo}
                          </span>
                          <span className="block text-[10px] text-slate-500 font-normal mt-0.5">{p.date}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          <span>{p.pupilName}</span>
                          <span className="block text-[10px] font-mono text-slate-500 font-normal">{p.admNo}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">{p.assignedClass}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${badge.badgeColor}`}>
                            {p.reasonLabel}
                          </span>
                          <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 max-w-xs">{p.detailedReason}</p>
                        </td>
                        <td className="p-3 text-slate-700">
                          <span className="font-semibold block">Kutoka: {p.timeOut}</span>
                          <span className="text-[10px] text-slate-500 block">
                            {isAway ? `Kurudi: ${p.expectedReturnTime}` : `${p.actualReturnTime || 'Amerejea'}`}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700">
                          <span className="font-bold text-slate-800 block">{p.pickupPersonName}</span>
                          <span className="text-[10px] text-slate-500 block">
                            {p.pickupPersonRelationship} &bull; {p.pickupPersonPhone}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {isAway ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] border border-amber-300">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>Yuko Nje</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-[10px] border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>Amerejea</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isAway && (
                              <button
                                type="button"
                                onClick={() => handleMarkReturned(p.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shadow-xs transition-colors"
                                title="Thibitisha kuwa mwanafunzi amerejea shuleni"
                              >
                                Thibitisha Kurudi
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedPassForPrint(p)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                              title="Tazama na Chapisha Hati Rasmi ya Kibali cha Getini"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600" />
                              <span>Hati</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. MODAL: ISSUE NEW GATE PASS */}
        {showNewPassModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-emerald-200 max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Toa Kibali Kipya cha Ruhusa (Gate Pass)</h3>
                    <p className="text-[11px] text-slate-500">Ofisi ya Mwalimu wa Nidhamu &bull; Ruhusa Rasmi ya Getini</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPassModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePass} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jina Kamili la Mwanafunzi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Mfano: Baraka David"
                      value={formPupilName}
                      onChange={(e) => setFormPupilName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Namba ya Usajili / Shule</label>
                    <input
                      type="text"
                      placeholder="Mfano: PUP-2026-001"
                      value={formAdmNo}
                      onChange={(e) => setFormAdmNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Darasa la Mwanafunzi *</label>
                    <select
                      value={formClass}
                      onChange={(e) => setFormClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="Nursery (Awali)">Nursery (Awali)</option>
                      {PRIMARY_CLASSES_LIST.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Aina ya Ruhusa *</label>
                    <select
                      value={formReasonCategory}
                      onChange={(e) => setFormReasonCategory(e.target.value as GatePassReason)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="UGONJWA_HOSPITALI">Matibabu / Hospitali</option>
                      <option value="MATIBABU_SICKBAY">Sick Bay / Mapumziko</option>
                      <option value="MSIBA_DHARURA_FAMILIA">Dharura ya Familia / Msiba</option>
                      <option value="KUITWA_NA_MZAZI">Kuchukuliwa na Mzazi</option>
                      <option value="MAJUKUMU_YA_SHULE">Majukumu Rasmi ya Shule</option>
                      <option value="NYINGINE">Sababu Nyingine</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Maelezo Kamili ya Sababu ya Ruhusa *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Eleza kwa nini mwanafunzi anapewa ruhusa ya kutoka nje ya lango la shule..."
                    value={formDetailedReason}
                    onChange={(e) => setFormDetailedReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Muda wa Kuondoka Shuleni *</label>
                    <input
                      type="text"
                      required
                      placeholder="Mfano: Saa 10:30 Asubuhi"
                      value={formTimeOut}
                      onChange={(e) => setFormTimeOut(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Muda wa Kurejea Shuleni *</label>
                    <input
                      type="text"
                      required
                      placeholder="Mfano: Kesho Asubuhi au Saa 03:00 Alasiri"
                      value={formExpectedReturn}
                      onChange={(e) => setFormExpectedReturn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-800 uppercase text-[11px] tracking-wider">
                    Taarifa za Mtu Anayemchukua Mwanafunzi (Mzazi / Mlezi)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Jina la Mchukuaji *</label>
                      <input
                        type="text"
                        required
                        placeholder="Jina Kamili"
                        value={formPickupName}
                        onChange={(e) => setFormPickupName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Uhusiano *</label>
                      <select
                        value={formPickupRelation}
                        onChange={(e) => setFormPickupRelation(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                      >
                        <option value="Mzazi (Baba)">Mzazi (Baba)</option>
                        <option value="Mzazi (Mama)">Mzazi (Mama)</option>
                        <option value="Mlezi / Ndugu">Mlezi / Ndugu</option>
                        <option value="Dereva wa Shule">Dereva wa Shule</option>
                        <option value="Mwalimu Msimamizi">Mwalimu Msimamizi</option>
                        <option value="Mwenyewe (Anajitegemea)">Mwenyewe (Anajitegemea)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Namba ya Simu *</label>
                      <input
                        type="tel"
                        required
                        placeholder="07XX XXX XXX"
                        value={formPickupPhone}
                        onChange={(e) => setFormPickupPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNewPassModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black shadow-md shadow-emerald-950/20 transition-all"
                  >
                    Idhinisha &amp; Toa Kibali
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. MODAL: OFFICIAL PRINTABLE GATE PASS SLIP (HATI YA GETINI) */}
        {selectedPassForPrint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl border border-emerald-300 max-w-xl w-full p-6 shadow-2xl space-y-5 my-8">
              {/* Slip Header */}
              <div className="text-center border-b-2 border-slate-800 pb-3 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-800" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                    JAMHURI YA MUUNGANO WA TANZANIA
                  </span>
                </div>
                <h2 className="text-base font-black text-emerald-950 uppercase tracking-tight">
                  PRIMARY &amp; NURSERY SCHOOL
                </h2>
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-900 text-white text-[10px] font-black uppercase tracking-wider">
                  HATI RASMI YA KIBALI CHA KUTOKA NJE YA SHULE (OFFICIAL GATE PASS)
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  NAMBA YA KIBALI: <strong>{selectedPassForPrint.passNo}</strong> &bull; TAREHE: {selectedPassForPrint.date}
                </div>
              </div>

              {/* Slip Details Grid */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Jina la Mwanafunzi:</span>
                    <strong className="text-sm text-slate-900 block">{selectedPassForPrint.pupilName}</strong>
                    <span className="text-[10px] font-mono text-slate-500">{selectedPassForPrint.admNo}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Darasa:</span>
                    <strong className="text-sm text-slate-900 block">{selectedPassForPrint.assignedClass}</strong>
                  </div>
                </div>

                <div className="border-t border-emerald-100 pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Sababu ya Ruhusa:</span>
                  <span className="font-black text-emerald-900 block">{selectedPassForPrint.reasonLabel}</span>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{selectedPassForPrint.detailedReason}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-emerald-100 pt-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Muda wa Kuondoka:</span>
                    <strong className="text-slate-800">{selectedPassForPrint.timeOut}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Muda wa Kurejea:</span>
                    <strong className="text-slate-800">{selectedPassForPrint.expectedReturnTime}</strong>
                  </div>
                </div>

                <div className="border-t border-emerald-100 pt-2 bg-white/70 p-2.5 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Aliyepewa Mwanafunzi:</span>
                  <div className="flex items-center justify-between text-xs mt-0.5">
                    <strong>{selectedPassForPrint.pickupPersonName} ({selectedPassForPrint.pickupPersonRelationship})</strong>
                    <span className="font-mono text-slate-600">{selectedPassForPrint.pickupPersonPhone}</span>
                  </div>
                </div>
              </div>

              {/* Official Seal and Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-center text-xs">
                {/* Discipline Teacher Signature */}
                <div className="space-y-1">
                  <div className="h-12 flex items-center justify-center">
                    <div className="w-16 h-12 rounded border border-emerald-700/60 bg-emerald-50 text-emerald-950 font-serif italic text-[11px] flex items-center justify-center select-none rotate-[-4deg]">
                      G. Makore
                    </div>
                  </div>
                  <div className="border-t border-slate-400 pt-1">
                    <strong className="text-slate-800 block text-[11px]">{selectedPassForPrint.authorizedBy}</strong>
                    <span className="text-[9px] text-slate-500 uppercase font-bold">OFISI YA NIDHAMU (MUHURI)</span>
                  </div>
                </div>

                {/* Gate Security Signature */}
                <div className="space-y-1">
                  <div className="h-12 flex items-center justify-center text-slate-400 italic text-[10px]">
                    Saini ya Mlinzi wa Getini
                  </div>
                  <div className="border-t border-slate-400 pt-1">
                    <strong className="text-slate-800 block text-[11px]">Mlinzi wa Zamu (Geti Kuu)</strong>
                    <span className="text-[9px] text-slate-500 uppercase font-bold">WAKATI WA KUONDOKA / KURUDI</span>
                  </div>
                </div>
              </div>

              {/* Notice to Guard */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-900 text-center font-medium">
                ★ ILANI KWA MLINZI WA GETINI: Mwanafunzi huyu asiruhusiwe kutoka nje ya lango bila hati hii kuwa na saini halali ya Mwalimu wa Nidhamu na mtu aliyemchukua kuwepo.
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedPassForPrint(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-xs transition-colors"
                >
                  Funga
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-emerald-200" />
                  <span>Chapisha Hati ya Getini</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
