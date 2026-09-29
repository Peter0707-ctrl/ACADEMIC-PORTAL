'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  School,
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  ChevronRight,
  ClipboardCheck,
  Award,
  Lock,
  Layers,
  BarChart3,
} from 'lucide-react';

export default function HomePage() {
  const [activeInstitution, setActiveInstitution] = useState<'SECONDARY' | 'COLLEGE'>('SECONDARY');

  const lifecycle = [
    {
      step: '01',
      title: 'School Onboarding & Rules Setup',
      badge: 'Starting Point',
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: Building2,
      role: 'Principal / Institution Admin',
      description: 'Setup your school, select country rules (Tanzania, Kenya, etc.), choose Terms vs. Semesters, and enable/disable ranking.',
      href: '/register-institution',
      ctaText: 'Setup New School',
    },
    {
      step: '02',
      title: 'Online Admissions & Enrollment',
      badge: 'Admissions Gate',
      badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: GraduationCap,
      role: 'Applicant / Admission Officer',
      description: 'Prospective students apply online, upload certificates, receive verification, and get enrolled into classes.',
      href: '/admissions/apply',
      ctaText: 'Apply for Admission',
    },
    {
      step: '03',
      title: 'Faculty Marks & Excel Entry',
      badge: 'Core Teaching',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: FileSpreadsheet,
      role: 'Teacher / Lecturer',
      description: 'Download dynamic Excel template with enrolled students, upload marks, and get 14-point row validation before locking.',
      href: '/teacher',
      ctaText: 'Open Teacher Workspace',
    },
    {
      step: '04',
      title: 'Review, Grading & Sign-off',
      badge: 'Executive Approval',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: ShieldCheck,
      role: 'Headmaster / Academic Master',
      description: 'Review submissions, approve grades, trigger Standard Competition Ranking (1224), and publish results live.',
      href: '/admin',
      ctaText: 'Open Principal Command Center',
    },
    {
      step: '05',
      title: 'Student 360° Portal',
      badge: 'Student View',
      badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      icon: Award,
      role: 'Student',
      description: 'Students view official verified report card with grades, rank, and financial clearance fee-hold policy checks.',
      href: '/student',
      ctaText: 'Open Student Portal',
    },
    {
      step: '06',
      title: 'Parent & Guardian Portal',
      badge: 'Ending Point',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      icon: Users,
      role: 'Parent / Guardian',
      description: 'Verified parents switch between children, monitor real-time marks, attendance records, and fee balances.',
      href: '/parent',
      ctaText: 'Open Parent Portal',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] bg-radial-glow text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0e1424]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-white text-base sm:text-lg block leading-tight tracking-tight">
                Universal Academic OS
              </span>
              <span className="text-[11px] text-blue-400 font-semibold hidden sm:block">
                Digital Operating System for Education
              </span>
            </div>
          </div>

          {/* Model Switcher & Auth */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center bg-slate-900/80 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveInstitution('SECONDARY')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeInstitution === 'SECONDARY'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Secondary School Model
              </button>
              <button
                onClick={() => setActiveInstitution('COLLEGE')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeInstitution === 'COLLEGE'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                College / University Model
              </button>
            </div>

            <Link
              href="/register-institution"
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors hidden sm:inline-flex items-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Register School</span>
            </Link>

            <Link
              href="/login"
              className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-6 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Multi-Tenant • Country-Agnostic • Auditable Education Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            The Digital Operating System for <span className="text-gradient-primary">Education</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            One engine serving <strong>Primary, Secondary, Colleges, and Universities</strong> with zero hard-coded rules.
            Explore the complete end-to-end operational pipeline below.
          </p>

          {/* Quick Role Gateway */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center space-x-2 transition-all shadow"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Principal / Headmaster</span>
            </Link>
            <Link
              href="/teacher"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center space-x-2 transition-all shadow"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              <span>Teacher Workspace</span>
            </Link>
            <Link
              href="/student"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center space-x-2 transition-all shadow"
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span>Student Portal</span>
            </Link>
            <Link
              href="/parent"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center space-x-2 transition-all shadow"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Parent Portal</span>
            </Link>
          </div>
        </div>

        {/* The End-to-End Operational Lifecycle Grid */}
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800/80 gap-2">
            <div>
              <h2 className="text-xl font-black text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <span>The Complete System Lifecycle (Steps 1 → 6)</span>
              </h2>
              <p className="text-xs text-slate-400">From initial school registration to verified report cards</p>
            </div>
            <span className="text-xs text-blue-400 font-mono">End-to-End Flow</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lifecycle.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-slate-600 font-mono">{item.step}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-blue-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm leading-tight">{item.title}</h3>
                        <span className="text-[11px] text-slate-400 block font-medium mt-0.5">{item.role}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-2">{item.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/60">
                    <Link
                      href={item.href}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-blue-600/80 hover:text-white text-blue-400 font-bold text-xs flex items-center justify-between transition-all"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configurable Multi-Tenancy Preview Banner */}
        <div className="glass-card rounded-2xl p-6 max-w-6xl mx-auto border border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Currently Active Country & Tenant Profile</span>
          </div>

          {activeInstitution === 'SECONDARY' ? (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="font-bold text-sm text-white block">Kilimanjaro Secondary School (Moshi, Tanzania)</span>
                <span className="text-slate-300 text-xs">
                  Model: Secondary School • Forms 1 to 4 • Terms (2 per year) • Position Ranking: Enabled • Fee Hold: Disabled
                </span>
              </div>
              <span className="px-3 py-1 bg-blue-600/30 border border-blue-400/40 rounded-lg text-blue-300 font-bold self-start sm:self-auto">
                Tanzania Secondary Configuration
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="font-bold text-sm text-white block">Lake Victoria Institute of Technology (Mwanza, Tanzania)</span>
                <span className="text-slate-300 text-xs">
                  Model: University / College • Semesters • Credits & GPA • Position Ranking: Disabled • Fee Hold: Required
                </span>
              </div>
              <span className="px-3 py-1 bg-purple-600/30 border border-purple-400/40 rounded-lg text-purple-300 font-bold self-start sm:self-auto">
                Higher Education Configuration
              </span>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0e1424] py-8 text-center text-xs text-slate-500">
        <p>Universal Education Management Platform • Enterprise Modular Monolith Architecture</p>
      </footer>
    </div>
  );
}
