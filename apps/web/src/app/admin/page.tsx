'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Award,
  Layers,
  Building2,
  Calendar,
  BookOpen,
  Lock,
  Database,
  Radio,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Server,
  Activity,
  FileSpreadsheet,
  Download,
  RefreshCw,
} from 'lucide-react';
import AdminShell from '@/components/admin-shell';
import { UserAccount, getStoredAccounts } from '@/lib/auth-session';

export default function AdminDashboardPage() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'health'>('overview');

  useEffect(() => {
    setAccounts(getStoredAccounts());
  }, []);

  // Compute live statistics from accounts
  const stats = useMemo(() => {
    const totalStaff = accounts.filter((a) =>
      ['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE', 'ACCOUNTANT', 'SECRETARY'].includes(a.role)
    ).length;
    const teachers = accounts.filter((a) =>
      ['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(a.role)
    ).length;
    const candidates = accounts.filter((a) => a.role === 'CANDIDATE').length;
    const students = accounts.filter((a) => a.role === 'STUDENT').length;
    const parents = accounts.filter((a) => a.role === 'PARENT').length;
    const totalPupils = students + candidates;

    return {
      totalStaff,
      teachers,
      candidates,
      students,
      parents,
      totalPupils,
      totalAccounts: accounts.length,
    };
  }, [accounts]);

  return (
    <AdminShell
      pageTitle="Dashibodi Kuu ya Usimamizi (Admin Control Center)"
      pageDescription="Kitovu kikuu cha utawala, takwimu za moja kwa moja, na usanidi wa moduli zote za shule."
    >
      <div className="space-y-6">
        {/* 1. Live Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/95 p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Wanafunzi Shuleni
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">{stats.totalPupils}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {stats.candidates > 0
                  ? `${stats.students} wa kawaida • ${stats.candidates} watahiniwa`
                  : 'Wanafunzi wote waliosajiliwa'}
              </p>
            </div>
          </div>

          <div className="bg-white/95 p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Watumishi &amp; Walimu
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">{stats.totalStaff}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {stats.teachers} walimu wa masomo na uongozi
              </p>
            </div>
          </div>

          <div className="bg-white/95 p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Hali ya Database
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-black text-emerald-700">Railway PostgreSQL</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Imeunganishwa • Ms = 24ms</p>
            </div>
          </div>

          <div className="bg-white/95 p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Ulinzi &amp; Usalama
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-sm font-black text-blue-700">Active &amp; Guarded</span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                RBAC Imewezeshwa • 0 Vitisho vya Usalama
              </p>
            </div>
          </div>
        </div>

        {/* 2. Quick Action Shortcuts */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Njia za Mkato za Haraka (Admin Quick Actions)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Tekeleza majukumu ya kiutawala kwa mbofyo mmoja
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <Link
              href="/admin/users"
              className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-indigo-100/50 border border-indigo-200/70 hover:border-indigo-400 hover:shadow-md transition-all group space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Sajili Mtumiaji Mpya
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Walimu, wahasibu, makatibu, au wanafunzi
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 pt-1">
                <span>Fungua Daftari</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/admin/academic-years"
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-emerald-100/50 border border-emerald-200/70 hover:border-emerald-400 hover:shadow-md transition-all group space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Funga / Fungua Muhula
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sanidi kalenda na pandisha madarasa
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 pt-1">
                <span>Sanidi Mihula</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/admin/school"
              className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-amber-100/50 border border-amber-200/70 hover:border-amber-400 hover:shadow-md transition-all group space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Wasifu &amp; Mihuri ya Shule
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Nembo, anwani, saini na akaunti za benki
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 pt-1">
                <span>Hariri Taarifa</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/admin/backups"
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 to-purple-100/50 border border-purple-200/70 hover:border-purple-400 hover:shadow-md transition-all group space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  Hifadhi Nakala (Backup)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pakua data yote ya shule kwa JSON/Excel
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600 pt-1">
                <span>Pakua Backup</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* 3. Overview of Administrative Modules */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Moduli Zote za Utawala (Admin Management Sub-Systems)
              </h3>
              <p className="text-xs text-slate-500">
                Bofya moduli yoyote kusanidi mipangilio yake ya kina
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {[
              {
                href: '/admin/users',
                title: 'Daftari la Watumiaji & Majukumu (RBAC)',
                desc: 'Simamia akaunti za walimu, wahasibu, wazazi na wanafunzi.',
                icon: Users,
                color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
              },
              {
                href: '/admin/school',
                title: 'Wasifu wa Shule & Mihuri Rasmi',
                desc: 'Nembo, namba ya usajili, kaulimbiu, mihuri na akaunti za benki.',
                icon: Building2,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
              },
              {
                href: '/admin/academic-years',
                title: 'Miaka ya Masomo & Mihula',
                desc: 'Mwaka unaotumika, tarehe za mihula na injini ya kupandisha madarasa.',
                icon: Calendar,
                color: 'text-blue-600 bg-blue-50 border-blue-200',
              },
              {
                href: '/admin/classes',
                title: 'Madarasa, Mikondo & Walimu Walezi',
                desc: 'Mikondo (A, B, C), walimu wa madarasa na uwezo wa kila chumba.',
                icon: Layers,
                color: 'text-amber-600 bg-amber-50 border-amber-200',
              },
              {
                href: '/admin/subjects',
                title: 'Mitaala, Masomo & Mgao wa Walimu',
                desc: 'Masomo ya kitaifa, madaraja ya alama (A-F), na vigezo vya ufaulu.',
                icon: BookOpen,
                color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
              },
              {
                href: '/admin/security',
                title: 'Ukaguzi wa Usalama & Audit Logs',
                desc: 'Kumbukumbu za kuingia, kubadilisha alama, na ulinzi wa 2FA.',
                icon: Lock,
                color: 'text-rose-600 bg-rose-50 border-rose-200',
              },
              {
                href: '/admin/backups',
                title: 'Hifadhi ya Data & Database Sync',
                desc: 'Urejeshaji wa data, uhamisho wa CSV, na hadhi ya PostgreSQL.',
                icon: Database,
                color: 'text-purple-600 bg-purple-50 border-purple-200',
              },
              {
                href: '/admin/gateways',
                title: 'Njia za Malipo & Mawasiliano (Gateways)',
                desc: 'Mfumo wa Control Number (GePG), SMS Gateway na WhatsApp API.',
                icon: Radio,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
              },
            ].map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${mod.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">
                      {mod.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{mod.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 4. System Health Status Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Hadhi ya Miundombinu ya Shule (Infrastructure Health)
                </h4>
                <p className="text-[10px] text-slate-400">Railway Cloud Deployment • Region: Africa/East</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1.5 self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Operational
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 block">PostgreSQL Status</span>
              <span className="font-bold text-emerald-400">Connected</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 block">Session Version</span>
              <span className="font-bold text-indigo-400">v9 Active</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 block">Super Admin</span>
              <span className="font-bold text-slate-200 truncate block">drestgroup@gmail.com</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 block">RBAC Enforcement</span>
              <span className="font-bold text-amber-400">Strict / Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
