'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  GraduationCap,
  School,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Database,
  Lock,
  BarChart3,
  Award,
  Globe2,
  FileSpreadsheet,
  Check,
  ChevronRight,
  Building2,
  FileCheck,
  Cpu,
  BadgeCheck,
} from 'lucide-react';

type InstitutionType = 'SECONDARY' | 'UNIVERSITY' | 'PRIMARY' | 'VOCATIONAL';

interface InstitutionPreset {
  id: InstitutionType;
  title: string;
  badge: string;
  image: string;
  tagline: string;
  academicStructure: string;
  gradingEngine: string;
  rankingRule: string;
  clearancePolicy: string;
  approverWorkflow: string;
  features: string[];
}

const INSTITUTION_PRESETS: Record<InstitutionType, InstitutionPreset> = {
  SECONDARY: {
    id: 'SECONDARY',
    title: 'Secondary & High Schools',
    badge: 'Form 1–4 (O-Level) & Form 5–6 (A-Level)',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Term-based continuous assessment, NECTA grade boundaries, division calculation & class ranking.',
    academicStructure: 'Terms 1 & 2 • Form 1 to Form 4 • Streams (A, B, C)',
    gradingEngine: 'NECTA Standard (A: 75-100, B: 65-74, C: 45-64, D: 30-44, F: 0-29)',
    rankingRule: 'Standard Competition Ranking (1st, 2nd, 2nd, 4th with ties)',
    clearancePolicy: 'Optional Parent Fee Clearance check before SMS result dispatch',
    approverWorkflow: 'Teacher Submit → Academic Master Review → Headmaster Approval → Instant Publish',
    features: [
      'Automatic Division I, II, III, IV, 0 calculation',
      'Class position with tie resolution algorithm',
      'Terminal and Mid-term consolidated reports',
      'Parent portal with verified student linking',
    ],
  },
  UNIVERSITY: {
    id: 'UNIVERSITY',
    title: 'Colleges & Universities',
    badge: 'Faculties, Semesters, Credits & GPA',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Faculty-driven modular structure with Semester GPA/CGPA, credit points, and mandatory bursar clearance.',
    academicStructure: 'Faculties • Departments • Degree/Diploma Programs • Semesters 1 & 2',
    gradingEngine: '5.0 GPA Scale (A: 5.0, B+: 4.0, B: 3.0, C: 2.0, D: 1.0, E: 0.0)',
    rankingRule: 'Class Percentiles & Cum Laude / Distinction Honours',
    clearancePolicy: 'Mandatory 100% Financial Bursar Clearance before Exam Card & Result release',
    approverWorkflow: 'Lecturer Upload → HOD Review → Dean Endorsement → Senate/Registrar Release',
    features: [
      'Credit weightings & cumulative GPA computation',
      'Course prerequisite verification & drop/add periods',
      'Automated financial gate locking un-cleared students',
      'Digital official transcripts with tamper-proof QR code',
    ],
  },
  PRIMARY: {
    id: 'PRIMARY',
    title: 'Primary Schools',
    badge: 'Standard 1 to Standard 7',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Foundational literacy, developmental assessment marks, class teacher remarks and guardian alerts.',
    academicStructure: 'Terms 1 & 2 • Standard 1 to Standard 7 • Single Stream or Multi-Stream',
    gradingEngine: 'Primary Scale (A: 81-100, B: 61-80, C: 41-60, D: 21-40, E: 0-20)',
    rankingRule: 'Overall class position & subject mastery tracking',
    clearancePolicy: 'Term fee reconciliation & automatic parent report card gate',
    approverWorkflow: 'Subject Teacher → Head Teacher Approval → Publish',
    features: [
      'Simplified marks entry for class teachers',
      'Visual performance charts for parents',
      'Daily attendance & automated SMS to guardians',
      'Progressive literacy and numeracy assessment logs',
    ],
  },
  VOCATIONAL: {
    id: 'VOCATIONAL',
    title: 'Vocational & VETA Institutes',
    badge: 'Competency-Based Modules & Levels I–III',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Competency-based education & training (CBET), practical workshop assessments, and apprentice tracking.',
    academicStructure: 'Modules • Level I, II, III • Practical Workshop Hours',
    gradingEngine: 'Competent (C) vs Not Yet Competent (NYC) with modular scores',
    rankingRule: 'Mastery certification & practical evaluation thresholds',
    clearancePolicy: 'Workshop materials fee and tuition clearance verify',
    approverWorkflow: 'Instructor → Department Head → Center Director Approval',
    features: [
      'Modular competency mastery record keeping',
      'Industrial attachment & field logbook tracking',
      'VETA/NACTVET accreditation curriculum alignment',
      'Certificate generation upon modular completion',
    ],
  },
};

export default function HomePage() {
  const [selectedPreset, setSelectedPreset] = useState<InstitutionType>('SECONDARY');
  const activePreset = INSTITUTION_PRESETS[selectedPreset];

  return (
    <div className="min-h-screen bg-[#080c15] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT & COMPLIANCE BAR */}
      <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border-b border-blue-500/20 px-4 py-2 text-center text-xs text-blue-200">
        <span className="font-semibold text-white">✨ Next-Generation Institutional Digital OS:</span> Supporting Primary, Secondary, High Schools, Colleges & Universities across Tanzania, Kenya, Uganda & Rwanda.
      </div>

      {/* 2. MAIN HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080c15]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              U
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block leading-tight">
                UNIVERSAL<span className="text-blue-500">.</span>ED
              </span>
              <span className="text-[11px] text-slate-400 font-mono tracking-wider uppercase">
                Institutional Digital OS
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#architecture" className="hover:text-white transition-colors">
              Dynamic Architecture
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Core Capabilities
            </a>
            <a href="#portals" className="hover:text-white transition-colors">
              Dedicated Portals
            </a>
            <a href="#compliance" className="hover:text-white transition-colors">
              Multi-Country Engine
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-xl border border-slate-700/80 hover:border-slate-500 text-slate-200 hover:text-white text-xs font-semibold transition-all bg-slate-900/60"
            >
              Sign In
            </Link>
            <Link
              href="/register-institution"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02]"
            >
              Register Institution →
            </Link>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION WITH HIGH-IMPACT IMAGERY & STATS */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/80">
        {/* Radiant Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-medium backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Zero Hardcoded Assumptions • Pure Configurable Multi-Tenancy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                The Universal Operating System for{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  Modern Education.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                One unified platform powering <strong className="text-white">Primary Schools</strong>, <strong className="text-white">Secondary Schools</strong>, <strong className="text-white">Colleges</strong>, and <strong className="text-white">Universities</strong>. 
                Configure your academic calendar, grading boundaries, approval workflows, and fee clearance policies without touching a single line of code.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register-institution"
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Onboard Your Institution
                </Link>

                <Link
                  href="/admissions/apply"
                  className="px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  Student Admissions Portal
                </Link>
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-black text-white font-mono">100%</div>
                  <div className="text-xs text-slate-400">Tenant Data Isolation</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">14-Point</div>
                  <div className="text-xs text-slate-400">Excel Exam Validation</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-400 font-mono">NECTA / TCU</div>
                  <div className="text-xs text-slate-400">Grading & GPA Ready</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero High-Res Real Imagery & Live Floating UI */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                {/* Main Hero Image */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0e1424] shadow-2xl">
                  <div className="relative h-80 sm:h-96 w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                      alt="Modern University Students Collaborating Digitally"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/30 to-transparent" />
                  </div>

                  {/* Overlay Badge Bar */}
                  <div className="p-5 bg-[#0e1424]/95 border-t border-slate-800 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Active Multi-Tenant Engine
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                        TZ-REG-2026
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Active Tenants</span>
                        <span className="text-slate-200 font-bold">142 Institutions</span>
                      </div>
                      <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                        <span className="text-slate-500 block text-[10px]">Results Processed</span>
                        <span className="text-emerald-400 font-bold">1,840,920 Marks</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Micro Card 1: Headmaster Approval */}
                <div className="absolute -bottom-6 -left-6 bg-[#0b101d]/95 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Official Results Approved</div>
                    <div className="text-[11px] text-slate-400">Headmaster Baraka Mwamba • Form 4</div>
                  </div>
                </div>

                {/* Floating Micro Card 2: Security Isolation */}
                <div className="absolute -top-4 -right-4 bg-[#0b101d]/95 border border-blue-500/30 rounded-2xl p-3 shadow-2xl backdrop-blur-xl hidden sm:flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-slate-200">Zero Cross-Tenant Leakage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC INSTITUTION ARCHITECTURE PREVIEW (NO HARDCODING) */}
      <section id="architecture" className="py-20 border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 rounded-full">
              Dynamic Configuration Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              One Codebase. Infinite Configurations.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              We never hard-code institution business rules. Switch institution types below to see how the system dynamically morphs its academic rules, grading formulas, and workflows in real time.
            </p>
          </div>

          {/* Institution Type Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
            {(Object.keys(INSTITUTION_PRESETS) as InstitutionType[]).map((key) => {
              const preset = INSTITUTION_PRESETS[key];
              const isSelected = selectedPreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPreset(key)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/40 text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                      : 'border-slate-800 bg-[#0e1424]/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600 flex items-center justify-center rounded-bl-xl text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-xs font-bold text-white mb-1">{preset.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{preset.badge}</div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Configuration Showcase Card */}
          <div className="glass-card rounded-3xl border border-slate-800 bg-[#0e1424]/90 p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Photo representation */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-slate-800 h-72 lg:h-96">
                <Image
                  src={activePreset.image}
                  alt={activePreset.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1424] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-400 bg-[#090d16]/80 px-2.5 py-1 rounded border border-blue-500/30">
                    {activePreset.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{activePreset.title}</h3>
                </div>
              </div>

              {/* Dynamic rule parameters */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">
                    Live Institutional Rule Configuration
                  </h4>
                  <p className="text-xs text-slate-400">
                    {activePreset.tagline}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-500 font-medium block mb-1">Academic Structure</span>
                    <span className="text-slate-200 font-semibold">{activePreset.academicStructure}</span>
                  </div>

                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-500 font-medium block mb-1">Grading & Evaluation Engine</span>
                    <span className="text-emerald-400 font-semibold">{activePreset.gradingEngine}</span>
                  </div>

                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-500 font-medium block mb-1">Class Position / Ranking Policy</span>
                    <span className="text-blue-400 font-semibold">{activePreset.rankingRule}</span>
                  </div>

                  <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-500 font-medium block mb-1">Financial Clearance Gate</span>
                    <span className="text-purple-400 font-semibold">{activePreset.clearancePolicy}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <span className="text-slate-500 font-medium block text-xs mb-2">
                    Multi-Level Approver Workflow:
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 overflow-x-auto py-1">
                    {activePreset.approverWorkflow.split('→').map((step, idx, arr) => (
                      <React.Fragment key={idx}>
                        <span className="px-2.5 py-1 bg-slate-800 rounded border border-slate-700 whitespace-nowrap text-blue-300">
                          {step.trim()}
                        </span>
                        {idx < arr.length - 1 && <span className="text-slate-600">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {activePreset.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEDICATED ISOLATED PORTALS (NO JUMBLED SCREENS) */}
      <section id="portals" className="py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full">
              Composable Role Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Dedicated, Isolated Dashboards
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              Every persona experiences a tailor-made digital workspace with dedicated left sidebars, role-specific metrics, and zero UI clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Principal / Admin */}
            <Link
              href="/admin"
              className="glass-card rounded-2xl border border-slate-800 bg-[#0e1424]/70 p-6 flex flex-col justify-between hover:border-blue-500/60 transition-all group hover:scale-[1.02]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Headmaster / Admin
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Institutional command center. Approve terminal results, inspect AI grade anomalies, and configure school policies.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>Open Command Center</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Teacher Workspace */}
            <Link
              href="/teacher"
              className="glass-card rounded-2xl border border-slate-800 bg-[#0e1424]/70 p-6 flex flex-col justify-between hover:border-emerald-500/60 transition-all group hover:scale-[1.02]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Teacher & Lecturer
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Fast mark recording, 14-point Excel validation engine, syllabus progression, and one-click submission to academic board.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Open Teacher Portal</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Student 360 */}
            <Link
              href="/student"
              className="glass-card rounded-2xl border border-slate-800 bg-[#0e1424]/70 p-6 flex flex-col justify-between hover:border-purple-500/60 transition-all group hover:scale-[1.02]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
                  Student 360° Portal
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Verified report card with division & position, GPA breakdown, attendance percentage, and official PDF certificate download.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-purple-400 font-semibold">
                <span>View Student Workspace</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Parent & Guardian */}
            <Link
              href="/parent"
              className="glass-card rounded-2xl border border-slate-800 bg-[#0e1424]/70 p-6 flex flex-col justify-between hover:border-amber-500/60 transition-all group hover:scale-[1.02]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  Parent & Guardian
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Verified guardian linking. Switch across multiple children, track term reports, fee invoice balances, and teacher comments.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Access Parent Portal</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CORE ARCHITECTURAL CAPABILITIES (PILLARS) */}
      <section id="features" className="py-20 border-b border-slate-800/80 bg-[#090d18]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full">
              Enterprise Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Built for Scale, Security & High Availability
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              From small rural primary schools to massive national universities with 50,000+ enrolled students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#0e1424]/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Tenant Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compound unique constraints (`institutionId + studentNumber`), tenant guards at service and repository layers, ensuring zero cross-institution data bleed.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0e1424]/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">14-Point Excel Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Teachers upload standard spreadsheet files. Our engine checks column hashes, duplicate IDs, out-of-range marks, and decimal precision in milliseconds.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0e1424]/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Ranking & Ties</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Implements standard competition ranking (1, 2, 2, 4) with tie resolutions across overall points, averages, and national grade standard boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="py-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-10 sm:p-14 border border-blue-500/30 bg-gradient-to-br from-blue-950/60 via-[#0e1424] to-indigo-950/60 text-center relative overflow-hidden shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Ready to Upgrade Your Institution?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
              Launch your tenant in under 3 minutes. Configure your academic structure, invite faculty, and experience seamless institutional automation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register-institution"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30"
              >
                Provision New Institution Tenant 🚀
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all"
              >
                Sign In to Existing Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPREHENSIVE ENTERPRISE FOOTER WITH DETAILED COPYRIGHT & REGULATORY INFO */}
      <footer id="compliance" className="border-t border-slate-800 bg-[#060911] text-slate-400 text-xs">
        {/* Top Footer Pillars */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Column 1: Brand & Mission */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-600/30">
                  U
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  UNIVERSAL<span className="text-blue-500">.</span>ED
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                The country-agnostic digital operating system for educational institutions. Designed with strict multi-tenancy, granular composable RBAC, and automated examination governance.
              </p>
              <div className="pt-2 flex items-center gap-3 text-slate-500 text-xs">
                <span>🇹🇿 Tanzania</span>
                <span>•</span>
                <span>🇰🇪 Kenya</span>
                <span>•</span>
                <span>🇺🇬 Uganda</span>
                <span>•</span>
                <span>🇷🇼 Rwanda</span>
                <span>•</span>
                <span>🇿🇲 Zambia</span>
              </div>
            </div>

            {/* Column 2: Supported Institutions */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
                Institutions
              </h4>
              <ul className="space-y-2.5">
                <li><Link href="/register-institution" className="hover:text-blue-400 transition-colors">Primary Schools (Std 1–7)</Link></li>
                <li><Link href="/register-institution" className="hover:text-blue-400 transition-colors">Secondary Schools (Form 1–4)</Link></li>
                <li><Link href="/register-institution" className="hover:text-blue-400 transition-colors">High Schools (Form 5–6 A-Level)</Link></li>
                <li><Link href="/register-institution" className="hover:text-blue-400 transition-colors">Vocational & VETA Centers</Link></li>
                <li><Link href="/register-institution" className="hover:text-blue-400 transition-colors">Colleges & Universities</Link></li>
              </ul>
            </div>

            {/* Column 3: Portals & Workspaces */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
                Dedicated Portals
              </h4>
              <ul className="space-y-2.5">
                <li><Link href="/admin" className="hover:text-blue-400 transition-colors">Principal & Headmaster</Link></li>
                <li><Link href="/teacher" className="hover:text-blue-400 transition-colors">Teacher & Marks Entry</Link></li>
                <li><Link href="/student" className="hover:text-blue-400 transition-colors">Student 360° Portal</Link></li>
                <li><Link href="/parent" className="hover:text-blue-400 transition-colors">Parent & Guardian Hub</Link></li>
                <li><Link href="/admissions/apply" className="hover:text-blue-400 transition-colors">Public Student Admissions</Link></li>
              </ul>
            </div>

            {/* Column 4: Governance & Compliance */}
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
                Regulatory Standards
              </h4>
              <ul className="space-y-2.5">
                <li><span className="text-slate-300">NECTA Examination Standard</span></li>
                <li><span className="text-slate-300">TCU / NACTVET Framework</span></li>
                <li><span className="text-slate-300">East African Curriculum (CBC)</span></li>
                <li><span className="text-slate-300">ISO/IEC 27001 Readiness</span></li>
                <li><span className="text-slate-300">Personal Data Protection (PDPA)</span></li>
              </ul>
            </div>
          </div>

          {/* System Status Banner */}
          <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </span>
              <span>•</span>
              <span>PostgreSQL 16 Multi-Tenant</span>
              <span>•</span>
              <span>Redis BullMQ Queue Active</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
              <Link href="/security" className="hover:text-slate-300 transition-colors">Security Whitepaper</Link>
            </div>
          </div>
        </div>

        {/* Bottom Full Copyright Bar */}
        <div className="border-t border-slate-900 bg-[#04060b] py-5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-500">
            <div>
              <span className="text-slate-400 font-medium">
                © 2026 Universal Education Management Platform Ltd. All rights reserved.
              </span>
              <span className="block sm:inline sm:ml-2 text-slate-600">
                Unauthorized reproduction, copying, or reverse engineering is strictly prohibited.
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Build v2.4.0-production (Commit: {new Date().getFullYear()}.09)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
