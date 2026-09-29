'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  School,
  Building2,
  BookOpen,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  ArrowRight,
  BarChart3,
  Layers,
  Globe2,
  Sliders,
  DollarSign,
  UserCheck,
  Award,
  ChevronRight,
  ExternalLink,
  Calendar,
  ClipboardCheck,
} from 'lucide-react';

// Institutional Academic Models
interface InstitutionTierConfig {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  academicDivision: 'Terms' | 'Semesters';
  gradingSystem: string;
  rankingEnabled: boolean;
  financialClearanceGate: boolean;
  rolesAvailable: string[];
  workflowApprovers: string[];
  keyHighlight: string;
}

const INSTITUTION_TIERS: InstitutionTierConfig[] = [
  {
    id: 'secondary',
    name: 'Secondary School',
    category: 'Ordinary Level (Form 1–4)',
    badge: 'Term System • Class Merit Ranking',
    description:
      'Engineered for national secondary curricula. Manages term schedules, automated student position calculation with competition tie handling, and comprehensive subject mark entry.',
    academicDivision: 'Terms',
    gradingSystem: 'NECTA Standards (A: 75–100, B: 65–74, C: 45–64, D: 30–44, F: 0–29)',
    rankingEnabled: true,
    financialClearanceGate: false,
    rolesAvailable: ['Headmaster', 'Academic Master', 'Teacher', 'Student', 'Parent', 'Bursar'],
    workflowApprovers: ['Subject Teacher (Draft)', 'Academic Master (Review)', 'Headmaster (Final Approval & Release)'],
    keyHighlight: 'Automated division assignment and verified parent SMS alerts upon official release date.',
  },
  {
    id: 'university',
    name: 'University & Higher Learning',
    category: 'Tertiary Degree & Post-Graduate Programs',
    badge: 'Semester Credits • GPA / CGPA',
    description:
      'Built for complex multi-faculty academic structures. Supports modular course credits, GPA/CGPA computation, departmental moderation, Senate approvals, and student fee clearance enforcement.',
    academicDivision: 'Semesters',
    gradingSystem: 'University 5.0 Scale (A: 5.0, B+: 4.0, B: 3.0, C: 2.0, D: 1.0, E: 0.0)',
    rankingEnabled: false,
    financialClearanceGate: true,
    rolesAvailable: ['Vice Chancellor', 'Dean', 'Registrar', 'Head of Department', 'Lecturer', 'Student', 'Bursar'],
    workflowApprovers: ['Lecturer (Course Marks)', 'Head of Department (Moderation)', 'Dean & Senate (Formal Release)'],
    keyHighlight: 'Financial clearance lock: Students with outstanding balances cannot download exam permits or official transcripts.',
  },
  {
    id: 'primary',
    name: 'Primary School',
    category: 'Standard 1–7 Foundation Education',
    badge: 'Continuous Assessment',
    description:
      'Streamlined class stream administration, continuous assessment tracking, foundational literacy/numeracy metrics, and direct parent communication.',
    academicDivision: 'Terms',
    gradingSystem: 'Primary Standard 5-Tier (A: Bora Sana, B: Nzuri, C: Wastani, D: Dhaifu, E: Hafifu)',
    rankingEnabled: true,
    financialClearanceGate: false,
    rolesAvailable: ['Headteacher', 'Class Teacher', 'Subject Teacher', 'Parent / Guardian'],
    workflowApprovers: ['Class Teacher (Entry)', 'Headteacher (Publish)'],
    keyHighlight: 'Direct guardian mobile integration for continuous student performance monitoring.',
  },
  {
    id: 'advanced',
    name: 'Advanced Secondary (High School)',
    category: 'Form 5 & 6 (A-Level)',
    badge: 'Combinations & Points',
    description:
      'Configured for specialized subject combinations (e.g. PCM, PCB, HGL, ECA, EGM). Features principal point calculations and university entry eligibility tracking.',
    academicDivision: 'Terms',
    gradingSystem: 'Advanced Level Points (A: 1 pt, B: 2 pts, C: 3 pts, D: 4 pts, E: 5 pts, S: 6 pts, F: 7 pts)',
    rankingEnabled: true,
    financialClearanceGate: false,
    rolesAvailable: ['Headmaster', 'Academic Master', 'Senior Master', 'Teacher', 'Student', 'Parent'],
    workflowApprovers: ['Teacher', 'Academic Master', 'Headmaster'],
    keyHighlight: 'Division and points forecasting aligned with national university admission requirements.',
  },
  {
    id: 'vocational',
    name: 'Vocational & Technical Institutes',
    category: 'VETA & Technical Training',
    badge: 'Competency-Based Modules',
    description:
      'Tailored for vocational trades, workshop practical assessments, competency-based education and training (CBET), and apprenticeship tracking.',
    academicDivision: 'Semesters',
    gradingSystem: 'Competency Based (Competent / Not Yet Competent / Modular Credits)',
    rankingEnabled: false,
    financialClearanceGate: true,
    rolesAvailable: ['Principal', 'Workshop Instructor', 'Apprentice / Student', 'Industry Liaison Officer'],
    workflowApprovers: ['Instructor (Workshop Evaluation)', 'Academic Dean (Certification)'],
    keyHighlight: 'Practical workshop logs and industry apprenticeship verification records.',
  },
];

// Regional Localization Specifications
const REGIONAL_FRAMEWORKS = [
  {
    country: 'Tanzania',
    framework: 'NECTA • TCU • NACTVET',
    currency: 'TZS',
    examTypes: 'PSLE, CSEE, ACSEE, TCU Degree',
  },
  {
    country: 'Kenya',
    framework: 'KNEC • CBC • CUE',
    currency: 'KES',
    examTypes: 'KPSEA, KCSE, CBC Assessment',
  },
  {
    country: 'Uganda',
    framework: 'UNEB • NCHE',
    currency: 'UGX',
    examTypes: 'PLE, UCE, UACE',
  },
  {
    country: 'Rwanda',
    framework: 'NESA • HEC',
    currency: 'RWF',
    examTypes: 'National Examinations, Advanced Level',
  },
  {
    country: 'Zambia',
    framework: 'ECZ • HEA',
    currency: 'ZMW',
    examTypes: 'Grade 7, Grade 9, Grade 12 ECZ',
  },
];

export default function HomePage() {
  const [selectedTierId, setSelectedTierId] = useState<string>('secondary');
  const activeTier = INSTITUTION_TIERS.find((t) => t.id === selectedTierId) || INSTITUTION_TIERS[0];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT & NAVIGATION */}
      <div>
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b border-blue-500/20 px-4 py-2 text-center text-xs text-blue-200 font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span>Unified Academic Management Platform — Supporting Primary, Secondary, Colleges & Universities across East Africa</span>
        </div>

        <header className="glass-nav sticky top-0 z-50 transition-all">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <School className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                  UNIVERSAL ED
                </span>
                <span className="text-[11px] text-blue-400 font-mono tracking-wider uppercase mt-1">
                  Academic Platform
                </span>
              </div>
            </Link>

            {/* Quick Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#features" className="hover:text-white transition-colors">
                Key Features
              </a>
              <a href="#tiers" className="hover:text-white transition-colors">
                Academic Levels
              </a>
              <a href="#workflow" className="hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#portals" className="hover:text-white transition-colors">
                Portals
              </a>
              <a href="#regions" className="hover:text-white transition-colors">
                Regional Coverage
              </a>
            </nav>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all bg-slate-900/60"
              >
                Sign In
              </Link>
              <Link
                href="/register-institution"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Register Institution</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* 2. HERO SECTION WITH IMAGE SHOWCASE */}
        <section className="relative overflow-hidden pt-12 pb-20">
          {/* Subtle Background Radial Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Hero Text */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Enterprise Multi-Tenant Educational Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Complete Academic Management for{' '}
                <span className="text-gradient-blue">Modern Institutions</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
                A centralized, multi-tenant academic system designed to manage admissions, continuous assessments, examination grading, position rankings, and verified parent communication.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/register-institution"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group"
                >
                  <Building2 className="w-4 h-4 text-blue-200" />
                  <span>Onboard Your Institution</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/admissions/apply"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800/60 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Student Online Application</span>
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-800 hover:bg-slate-900/60 text-slate-300 font-medium text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Portal Sign In</span>
                </Link>
              </div>

              {/* Core System Standards */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Strict Tenant Isolation
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Immutable Audit Records
                </span>
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                  14-Point Spreadsheet Validation
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Standard Competition Ranking
                </span>
              </div>
            </div>

            {/* 3. HERO IMAGE SHOWCASE (Production Dashboard UI) */}
            <div className="mt-14 relative rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-blue-500/20 via-slate-800/40 to-transparent border border-white/10 shadow-2xl glow-blue">
              <div className="relative rounded-2xl overflow-hidden bg-[#0e1424] border border-white/5">
                <Image
                  src="/images/hero-dashboard.jpg"
                  alt="Academic Analytics Dashboard and Student Performance Tracking Interface"
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-700"
                  priority
                />

                {/* Overlaid Institutional Status Badges */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 glass-card rounded-xl p-3 border border-white/15 hidden sm:flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div>
                    <div className="text-[11px] font-bold text-white leading-none">Class Ranking Engine</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Tie Handling: 1st, 2nd, 2nd, 4th (Standard Competition)</div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 glass-card rounded-xl p-3 border border-white/15 hidden sm:flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-[11px] font-bold text-white leading-none">Financial Clearance Gate</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Enforces Bursar fee clearance before report card generation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REAL-WORLD IMPACT (Modern Campus Environment) */}
        <section id="features" className="py-16 border-t border-slate-800/80 bg-[#0b101d]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl order-2 lg:order-1">
                <Image
                  src="/images/students-campus.jpg"
                  alt="Secondary school and university students learning with digital academic tools"
                  width={1600}
                  height={900}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 glass-card rounded-2xl border border-white/10">
                  <span className="text-xs font-mono uppercase tracking-widest text-blue-400 block mb-1">
                    Student 360° Academic Records
                  </span>
                  <p className="text-xs text-slate-200">
                    Equipping students, verified guardians, and school administrators across Tanzania, Kenya, Uganda, Rwanda, and Zambia with reliable, tamper-free academic records.
                  </p>
                </div>
              </div>

              {/* Text Highlights */}
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  <span>Engineered for Reliability & Data Security</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  Streamlined Academic Administration for Modern Institutions
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Different institutions operate under distinct national policies, grading standards, and calendar structures. Universal Ed provides an agile, multi-tenant framework where every school configures its own academic rules without custom coding.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-bold text-white text-sm">Verified Parent Linking</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Guardians access only verified children profiles. No cross-student data leakage.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="font-bold text-white text-sm">Audited Grade Adjustments</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Post-publication grade corrections follow a strictly logged review and authorization trail.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE INSTITUTION TIERS (Configurable Architecture Demo) */}
        <section id="tiers" className="py-20 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase font-mono tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Institutional Customization
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                One Platform. Any Educational Level.
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Select an institution type below to preview how grading schemes, academic terms, and approval workflows adapt dynamically.
              </p>
            </div>

            {/* Tier Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {INSTITUTION_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    selectedTierId === tier.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <span>{tier.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      selectedTierId === tier.id ? 'bg-blue-800 text-blue-200' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tier.academicDivision}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Tier Dynamic Card */}
            <div className="glass-card rounded-3xl p-8 border border-blue-500/30 bg-[#0e1424]/90 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Cols: Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-white">{activeTier.name}</h3>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-medium border border-blue-500/30">
                      {activeTier.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/30">
                      {activeTier.badge}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">{activeTier.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block mb-1 font-mono uppercase text-[10px]">
                        Academic Calendar Structure
                      </span>
                      <span className="text-white font-semibold text-sm">
                        {activeTier.academicDivision}-Based System
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block mb-1 font-mono uppercase text-[10px]">
                        Position & Merit Calculation
                      </span>
                      <span className={activeTier.rankingEnabled ? 'text-emerald-400 font-semibold text-sm' : 'text-slate-400 font-semibold text-sm'}>
                        {activeTier.rankingEnabled ? '✓ Enabled (Standard Competition Ties)' : '✕ Disabled (Cumulative GPA)'}
                      </span>
                    </div>

                    <div className="sm:col-span-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block mb-1 font-mono uppercase text-[10px]">
                        Grading Framework
                      </span>
                      <span className="text-blue-300 font-mono font-medium">{activeTier.gradingSystem}</span>
                    </div>
                  </div>

                  {/* Workflow Approval Sequence */}
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                      Formal Examination Release Workflow:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {activeTier.workflowApprovers.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-medium">
                            {step}
                          </span>
                          {idx < activeTier.workflowApprovers.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col: Configuration Summary */}
                <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">
                      Configured Stakeholder Roles
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {activeTier.rolesAvailable.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-blue-950/40 text-blue-300 border border-blue-500/20 text-[11px] font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">
                      Academic Operational Highlight
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      {activeTier.keyHighlight}
                    </p>
                  </div>

                  <Link
                    href="/register-institution"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition-all shadow-md shadow-blue-600/30 block"
                  >
                    Setup {activeTier.name} Portal →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. SYSTEM LIFECYCLE (Steps 1 to 6) */}
        <section id="workflow" className="py-20 border-t border-slate-800/80 bg-[#0b101d]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                End-to-End Operational Lifecycle
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                From Admission to Graduation
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                A connected lifecycle where student data remains intact across academic years and permanent historical records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-sm mb-4">
                  01
                </div>
                <h3 className="font-bold text-white text-base mb-1">Institution Onboarding</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Setup institution profile, academic structure, grade boundaries, fee policies, and administration accounts.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-sm mb-4">
                  02
                </div>
                <h3 className="font-bold text-white text-base mb-1">Online Admissions</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Prospective students submit online applications with document attachments. Accepted applicants transition automatically to active student records.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold flex items-center justify-center text-sm mb-4">
                  03
                </div>
                <h3 className="font-bold text-white text-base mb-1">Academic Structure & Attendance</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Assign subjects, teachers, and class streams. Record daily or period attendance and track syllabus milestones.
                </p>
              </div>

              {/* Step 4 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-sm mb-4">
                  04
                </div>
                <h3 className="font-bold text-white text-base mb-1">14-Point Marks Validation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Teachers enter marks online or upload standardized spreadsheets. Automated validation blocks invalid scores, empty required rows, and formula discrepancies.
                </p>
              </div>

              {/* Step 5 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-sm mb-4">
                  05
                </div>
                <h3 className="font-bold text-white text-base mb-1">Verification & Scheduled Release</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Academic officers review department marks, the Headmaster or Dean approves, and results are scheduled for unified publication.
                </p>
              </div>

              {/* Step 6 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 font-bold flex items-center justify-center text-sm mb-4">
                  06
                </div>
                <h3 className="font-bold text-white text-base mb-1">Student & Guardian Access</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Students and parents access term report cards, division summaries, and fee clearance receipts via dedicated secure portals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. DEDICATED ROLE PORTALS */}
        <section id="portals" className="py-20 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-mono tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Role-Based Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                Dedicated Workspaces for Every Stakeholder
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Clear separation of concerns: Administrators, teachers, students, and parents access customized dashboards matching their responsibilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Headmaster / Admin */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-blue-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Administration Command</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Institutional KPI metrics, examination publication controls, staff assignments, and audit trails.
                  </p>
                </div>
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Open Admin Center →
                </Link>
              </div>

              {/* Teacher */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Faculty & Teachers</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Continuous assessment entries, standardized mark sheet downloads, spreadsheet validation, and submission.
                  </p>
                </div>
                <Link
                  href="/teacher"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Open Teacher Portal →
                </Link>
              </div>

              {/* Student */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-purple-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Student 360° Portal</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Term report cards, subject ranking positions, cumulative averages, and financial clearance receipts.
                  </p>
                </div>
                <Link
                  href="/student"
                  className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Open Student Portal →
                </Link>
              </div>

              {/* Parent */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-amber-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Guardian Portal</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Multi-child switcher, terminal exam reports, attendance tracking, and school fee payment records.
                  </p>
                </div>
                <Link
                  href="/parent"
                  className="px-4 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 text-amber-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Open Parent Portal →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 8. REGIONAL COUNTRY COVERAGE */}
        <section id="regions" className="py-16 border-t border-slate-800/80 bg-[#0e1424]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                East Africa Region
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
                Designed for National Curricula Standards
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              {REGIONAL_FRAMEWORKS.map((loc, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                    <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{loc.country}</span>
                  </div>
                  <div className="text-blue-400 font-mono text-[11px] mb-2">{loc.framework}</div>
                  <div className="text-slate-400 text-[11px]">
                    <span className="text-slate-500 block">Currency:</span>
                    <span className="text-slate-300 font-mono">{loc.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 9. ENTERPRISE WORLD-CLASS FOOTER */}
      <footer className="border-t border-slate-800 bg-[#060a12] text-slate-400 text-xs pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Col 1: Brand & Identity */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
                  <School className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-black text-white text-base tracking-tight block">
                    UNIVERSAL ED
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider block">
                    Academic Management System
                  </span>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                A unified, secure academic management platform designed for Primary Schools, Secondary Schools, High Schools, Vocational Institutes, Colleges, and Universities across East Africa.
              </p>

              {/* Status Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>System Status: <strong>Operational (99.98% Service Uptime)</strong></span>
              </div>
            </div>

            {/* Col 2: Solutions by Level */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Institution Types</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Primary Schools (Std 1–7)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Secondary Schools (Form 1–4)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Advanced High Schools (Form 5–6)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Vocational & Technical Training</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Colleges & Polytechnics</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Universities & Degree Programs</a></li>
              </ul>
            </div>

            {/* Col 3: Core Platform Engines */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Platform Features</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><Link href="/register-institution" className="hover:text-blue-400 transition-colors">Institution Onboarding</Link></li>
                <li><Link href="/admissions/apply" className="hover:text-blue-400 transition-colors">Student Online Admissions</Link></li>
                <li><a href="#workflow" className="hover:text-blue-400 transition-colors">Standard Competition Ranking</a></li>
                <li><a href="#workflow" className="hover:text-blue-400 transition-colors">Spreadsheet Validation Engine</a></li>
                <li><a href="#workflow" className="hover:text-blue-400 transition-colors">Financial Clearance Controls</a></li>
                <li><a href="#workflow" className="hover:text-blue-400 transition-colors">Security Audit Logging</a></li>
              </ul>
            </div>

            {/* Col 4: Ecosystem & Roles */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Stakeholder Portals</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><Link href="/admin" className="hover:text-blue-400 transition-colors">Headmaster & Administration</Link></li>
                <li><Link href="/teacher" className="hover:text-blue-400 transition-colors">Teacher & Marks Entry</Link></li>
                <li><Link href="/student" className="hover:text-blue-400 transition-colors">Student 360° Portal</Link></li>
                <li><Link href="/parent" className="hover:text-blue-400 transition-colors">Parent & Guardian Portal</Link></li>
                <li><Link href="/login" className="hover:text-blue-400 transition-colors">Sign In Portal</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Divider & Legal Section */}
          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            {/* Strict Copyright Requirement */}
            <div>
              <p className="text-slate-400 font-medium">
                © 2026 Universal Education Management Platform. All rights reserved.
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Built for High-Security Educational Institutions across East Africa.
              </p>
            </div>

            {/* Compliance & Regulatory Links */}
            <div className="flex flex-wrap items-center gap-6 text-[11px]">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                Data Protection & Privacy
              </span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                Terms of Service
              </span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                Security Architecture
              </span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                Tanzania • Kenya • Uganda • Rwanda • Zambia
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
