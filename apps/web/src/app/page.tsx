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
  Sparkles,
  BarChart3,
  Layers,
  Globe2,
  Sliders,
  DollarSign,
  UserCheck,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

// Dynamic Tier Configurations
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
    badge: 'Term Based • Ranking',
    description:
      'Configured for national secondary curriculums. Enforces term cycles, automatic position ranking (1st, 2nd, 2nd, 4th ties), and teacher mark-entry verification.',
    academicDivision: 'Terms',
    gradingSystem: 'NECTA Standard (A: 75-100, B: 65-74, C: 45-64, D: 30-44, F: 0-29)',
    rankingEnabled: true,
    financialClearanceGate: false,
    rolesAvailable: ['Headmaster', 'Academic Master', 'Teacher', 'Student', 'Parent', 'Accountant'],
    workflowApprovers: ['Subject Teacher (Draft)', 'Academic Master (Review)', 'Headmaster (Final Approval & Publish)'],
    keyHighlight: 'Automated division calculation and parent SMS notifications on published date.',
  },
  {
    id: 'university',
    name: 'University & Higher Learning',
    category: 'Tertiary Degree Programs',
    badge: 'Semester • GPA / CGPA',
    description:
      'Designed for multi-faculty academic structures. Uses course credit hours, GPA/CGPA grading rules, Senate publication workflows, and mandatory bursar financial clearance.',
    academicDivision: 'Semesters',
    gradingSystem: 'University 5.0 Scale (A: 5.0, B+: 4.0, B: 3.0, C: 2.0, D: 1.0, E: 0.0)',
    rankingEnabled: false,
    financialClearanceGate: true,
    rolesAvailable: ['Vice Chancellor', 'Dean', 'Registrar', 'HOD', 'Lecturer', 'Student', 'Bursar'],
    workflowApprovers: ['Lecturer (Course Marks)', 'HOD (Moderation)', 'Dean / Senate (Clearance & Release)'],
    keyHighlight: 'Financial clearance lock: Students with outstanding tuition fees cannot download exam slips or transcripts.',
  },
  {
    id: 'primary',
    name: 'Primary School',
    category: 'Standard 1–7 Basic Education',
    badge: 'Standard Competencies',
    description:
      'Simplified class stream management, continuous assessment tracking, foundational numeracy/literacy metrics, and direct guardian mobile access.',
    academicDivision: 'Terms',
    gradingSystem: 'Primary Standard 5-Tier (A: Bora Sana, B: Nzuri, C: Wastani, D: Dhaifu, E: Hafifu)',
    rankingEnabled: true,
    financialClearanceGate: false,
    rolesAvailable: ['Headteacher', 'Class Teacher', 'Subject Teacher', 'Parent / Guardian'],
    workflowApprovers: ['Class Teacher (Entry)', 'Headteacher (Publish)'],
    keyHighlight: 'Guardian phone integration for direct student progress updates.',
  },
  {
    id: 'advanced',
    name: 'Advanced Secondary (High School)',
    category: 'Form 5 & 6 (A-Level)',
    badge: 'Combinations & Points',
    description:
      'Specialized subject combinations (e.g. PCM, PCB, HGL, ECA, EGM). Principal points calculation and national exam readiness analytics.',
    academicDivision: 'Terms',
    gradingSystem: 'Advanced Level Points (A: 1 pt, B: 2 pts, C: 3 pts, D: 4 pts, E: 5 pts, S: 6 pts, F: 7 pts)',
    rankingEnabled: true,
    financialClearanceGate: false,
    rolesAvailable: ['Headmaster', 'Academic Master', 'Senior Master', 'Teacher', 'Student', 'Parent'],
    workflowApprovers: ['Teacher', 'Academic Master', 'Headmaster'],
    keyHighlight: 'Points & division forecasting for university admissions eligibility.',
  },
  {
    id: 'vocational',
    name: 'Vocational & Training Institutes',
    category: 'VETA / Technical Colleges',
    badge: 'Competency Modules',
    description:
      'Modular semester assessment for vocational trades, practical workshop assessments, competency-based education and training (CBET), and internship tracking.',
    academicDivision: 'Semesters',
    gradingSystem: 'Competency Based (Competent / Not Yet Competent / Modular Credits)',
    rankingEnabled: false,
    financialClearanceGate: true,
    rolesAvailable: ['Principal', 'Workshop Instructor', 'Apprentice / Student', 'Industry Liaison'],
    workflowApprovers: ['Instructor (Workshop Practical)', 'Academic Dean (Certification)'],
    keyHighlight: 'Practical skills assessment logs and apprenticeship evaluation tracking.',
  },
];

// Country Adaptation Registry
const COUNTRY_LOCALIZATIONS = [
  {
    country: 'Tanzania',
    regulators: 'NECTA • TCU • NACTVET',
    currency: 'TZS',
    sampleExam: 'PSLE, CSEE, ACSEE, TCU Degree',
  },
  {
    country: 'Kenya',
    regulators: 'KNEC • CBC • CUE',
    currency: 'KES',
    sampleExam: 'KCPE, KCSE, CBC Assessment',
  },
  {
    country: 'Uganda',
    regulators: 'UNEB • NCHE',
    currency: 'UGX',
    sampleExam: 'PLE, UCE, UACE',
  },
  {
    country: 'Rwanda',
    regulators: 'NESA • HEC',
    currency: 'RWF',
    sampleExam: 'National Exam, Advanced Level',
  },
  {
    country: 'Zambia',
    regulators: 'ECZ • HEA',
    currency: 'ZMW',
    sampleExam: 'Grade 7, Grade 9, Grade 12 ECZ',
  },
];

export default function HomePage() {
  const [selectedTierId, setSelectedTierId] = useState<string>('secondary');
  const activeTier = INSTITUTION_TIERS.find((t) => t.id === selectedTierId) || INSTITUTION_TIERS[0];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT & NAVIGATION */}
      <div>
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-blue-900/40 border-b border-blue-500/20 px-4 py-2 text-center text-xs text-blue-300 font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Universal Digital OS: Country-Agnostic, Multi-Tenant Architecture for Schools & Universities across East Africa</span>
          <span className="hidden md:inline-block bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-mono border border-blue-500/30">
            v1.0 Production Ready
          </span>
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
                  Academic Platform OS
                </span>
              </div>
            </Link>

            {/* Quick Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#architecture" className="hover:text-white transition-colors">
                Architecture
              </a>
              <a href="#tiers" className="hover:text-white transition-colors">
                Institution Types
              </a>
              <a href="#lifecycle" className="hover:text-white transition-colors">
                System Lifecycle
              </a>
              <a href="#portals" className="hover:text-white transition-colors">
                Role Portals
              </a>
              <a href="#countries" className="hover:text-white transition-colors">
                Countries
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
                <span>Register School</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* 2. HERO SECTION WITH IMAGE MOCKUP */}
        <section className="relative overflow-hidden pt-12 pb-20">
          {/* Subtle Background Radial Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Hero Text */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Zero Hardcoded Business Rules • 100% Configurable Engine</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
                One Digital Operating System for{' '}
                <span className="text-gradient-blue">Every Educational Institution</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
                Whether you manage a Primary School, a 4-year Secondary School, or a multi-faculty University with semesters and GPA, Universal Ed adapts dynamically to your grading, approvals, and fees.
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
                  <span>Role Portals Demo</span>
                </Link>
              </div>

              {/* Verified Platform Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Strict Multi-Tenant Isolation
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Tamper-Resistant Audit Log
                </span>
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                  14-Point Excel Marks Validation
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Standard Competition Ranking
                </span>
              </div>
            </div>

            {/* 3. LIVE SYSTEM DEMO INTERFACE (Real Code, No Fake Mockup Image) */}
            <div className="mt-12 glass-card rounded-3xl border border-slate-800/90 bg-[#0e1424]/90 p-5 sm:p-7 shadow-2xl text-left">
              {/* Window Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="h-4 w-px bg-slate-800 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs sm:text-sm">Kilimanjaro Secondary School</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-mono border border-blue-500/20">
                      Kidato cha 4A • Mtihani wa Muhula (NECTA CSEE)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Imeidhinishwa na Mkuu wa Shule</span>
                  </span>
                </div>
              </div>

              {/* Metrics Summary Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono mb-1">Wastani wa Darasa</span>
                  <span className="text-white text-base font-bold">68.4%</span>
                  <span className="text-emerald-400 text-[10px] ml-1.5 font-medium">(Daraja B - Nzuri)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono mb-1">Waliofaulu (Pass Rate)</span>
                  <span className="text-emerald-400 text-base font-bold">96.8%</span>
                  <span className="text-slate-400 text-[10px] ml-1.5">Wanafunzi 91 / 94</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono mb-1">Division I & II</span>
                  <span className="text-blue-400 text-base font-bold">78 Wanafunzi</span>
                  <span className="text-slate-400 text-[10px] ml-1.5">(82.9%)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono mb-1">Kanuni ya Nafasi</span>
                  <span className="text-amber-400 text-sm font-bold font-mono">1, 2, 2, 4 (Ties)</span>
                  <span className="text-slate-400 text-[10px] block mt-0.5">Olympic Standard</span>
                </div>
              </div>

              {/* Live Real Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090d16]/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 text-[11px] font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Nafasi</th>
                      <th className="py-2.5 px-3">Mwanafunzi</th>
                      <th className="py-2.5 px-3">Namba ya Mtihani</th>
                      <th className="py-2.5 px-2 text-center">CIV</th>
                      <th className="py-2.5 px-2 text-center">HIST</th>
                      <th className="py-2.5 px-2 text-center">GEO</th>
                      <th className="py-2.5 px-2 text-center">KISW</th>
                      <th className="py-2.5 px-2 text-center">ENG</th>
                      <th className="py-2.5 px-2 text-center">PHY</th>
                      <th className="py-2.5 px-2 text-center">CHEM</th>
                      <th className="py-2.5 px-2 text-center">BIO</th>
                      <th className="py-2.5 px-2 text-center">BAM</th>
                      <th className="py-2.5 px-3 font-semibold text-white">Pointi</th>
                      <th className="py-2.5 px-3 font-semibold text-white">Division</th>
                      <th className="py-2.5 px-3 text-right">Ada (Clearance)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-amber-400">1</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-white">Baraka Juma Mrema</td>
                      <td className="py-2.5 px-3 text-slate-400">S0108/0001/2026</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-3 font-bold text-white">8 pts</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">Division I</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400">✓ Imelipwa</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors bg-blue-950/10">
                      <td className="py-2.5 px-3 font-bold text-slate-300">2</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-white">Asha Ramadhani Bakari</td>
                      <td className="py-2.5 px-3 text-slate-400">S0108/0002/2026</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-3 font-bold text-white">9 pts</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">Division I</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400">✓ Imelipwa</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors bg-blue-950/10">
                      <td className="py-2.5 px-3 font-bold text-slate-300">2</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-white">David Emmanuel Lyimo</td>
                      <td className="py-2.5 px-3 text-slate-400">S0108/0003/2026</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-3 font-bold text-white">9 pts</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">Division I</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400">✓ Imelipwa</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-400">4</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-white">Neema Joseph Kiwelu</td>
                      <td className="py-2.5 px-3 text-slate-400">S0108/0004/2026</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-2 text-center text-emerald-400 font-bold">A</td>
                      <td className="py-2.5 px-2 text-center text-blue-400 font-bold">B</td>
                      <td className="py-2.5 px-3 font-bold text-white">11 pts</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">Division I</td>
                      <td className="py-2.5 px-3 text-right text-amber-400 font-sans text-[10px]">Deni (Imesitishwa)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REAL-WORLD IMPACT (Modern African Campus & Students Image) */}
        <section className="py-16 border-t border-slate-800/80 bg-[#0b101d]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl order-2 lg:order-1">
                <Image
                  src="/images/students-campus.jpg"
                  alt="Students and Teachers collaborating with digital education technology"
                  width={1600}
                  height={900}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 glass-card rounded-2xl border border-white/10">
                  <span className="text-xs font-mono uppercase tracking-widest text-blue-400 block mb-1">
                    Student 360° Empowerment
                  </span>
                  <p className="text-xs text-slate-200">
                    Empowering students, verified parents, and educators across Tanzania, Kenya, Uganda, Rwanda, and Zambia with instant digital report cards and transparent academic history.
                  </p>
                </div>
              </div>

              {/* Text Highlights */}
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  <span>Built for Scale & Integrity</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  Transforming School Operations with Unbreakable Security
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Traditional school software hardcodes fixed assumptions that break when applied to different institutions. Universal Ed isolates every school into its own tenant while enabling complete customization of grading schemes, terms, roles, and fee rules.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-bold text-white text-sm">Parent Verification</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Parents access only verified children. No unauthorized student attachment.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="font-bold text-white text-sm">Audited Corrections</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Post-publication grade corrections require audited workflow reasons and approval.
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
                Rule 2 of Architecture: Never Hard-Code Rules
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                One Platform. Any Educational Level.
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Click any institution type below to inspect how the underlying academic engine, grading scales, approval chains, and fee gates reconfigure in real-time.
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
                        Academic Calendar Division
                      </span>
                      <span className="text-white font-semibold text-sm">
                        {activeTier.academicDivision}-Based System
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block mb-1 font-mono uppercase text-[10px]">
                        Ranking & Position Engine
                      </span>
                      <span className={activeTier.rankingEnabled ? 'text-emerald-400 font-semibold text-sm' : 'text-slate-400 font-semibold text-sm'}>
                        {activeTier.rankingEnabled ? '✓ Enabled (Standard Competition Ties)' : '✕ Disabled (Cumulative GPA)'}
                      </span>
                    </div>

                    <div className="sm:col-span-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block mb-1 font-mono uppercase text-[10px]">
                        Grading Model & Boundaries
                      </span>
                      <span className="text-blue-300 font-mono font-medium">{activeTier.gradingSystem}</span>
                    </div>
                  </div>

                  {/* Workflow Approval Sequence */}
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                      Approval & Publication Pipeline:
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
                      Available Composable Roles
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
                      Institutional Highlight
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      {activeTier.keyHighlight}
                    </p>
                  </div>

                  <Link
                    href="/register-institution"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition-all shadow-md shadow-blue-600/30 block"
                  >
                    Configure {activeTier.name} Tenant →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. END-TO-END LIFECYCLE (Steps 1 to 6) */}
        <section id="lifecycle" className="py-20 border-t border-slate-800/80 bg-[#0b101d]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                End-to-End Operational Lifecycle
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                From Registration to Alumni
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                A seamless flow where data is never duplicated and official records are permanently preserved.
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
                  Select institution level (Primary to University). Set grading scales, term/semester structure, and ranking rules.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-sm mb-4">
                  02
                </div>
                <h3 className="font-bold text-white text-base mb-1">Public Admissions</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Applicants submit documents and tracking numbers. Upon board review and acceptance, an active student record is created without duplicate entries.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold flex items-center justify-center text-sm mb-4">
                  03
                </div>
                <h3 className="font-bold text-white text-base mb-1">Academic Structure & CA</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Assign subjects, teachers, and student class rosters. Track daily attendance and configure Continuous Assessment weightings.
                </p>
              </div>

              {/* Step 4 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-sm mb-4">
                  04
                </div>
                <h3 className="font-bold text-white text-base mb-1">Excel 14-Point Validation</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Teachers enter marks or upload structured Excel sheets. 14 critical validation checks catch missing candidates, negative marks, and formula errors.
                </p>
              </div>

              {/* Step 5 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-sm mb-4">
                  05
                </div>
                <h3 className="font-bold text-white text-base mb-1">Approval & Scheduled Publish</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Academic Master reviews, Headmaster/Dean approves. Results calculate ranks and publish on a designated scheduled release date.
                </p>
              </div>

              {/* Step 6 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 font-bold flex items-center justify-center text-sm mb-4">
                  06
                </div>
                <h3 className="font-bold text-white text-base mb-1">360° Student & Parent Portals</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Students and verified guardians view report cards, subject rankings, and payment receipts. Enforced financial clearance protects tuition revenue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. DEDICATED ROLE PORTALS DIRECT ACCESS */}
        <section id="portals" className="py-20 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-mono tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Isolated Role Environments
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                Specialized Portals. Zero Role Clutter.
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Every stakeholder works within a dedicated, distraction-free dashboard tailored with distinct permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Headmaster / Admin */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-blue-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Principal / Admin</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Whole-school KPI analytics, final exam approval, publication schedules, and AI performance alerts.
                  </p>
                </div>
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Enter Principal Center →
                </Link>
              </div>

              {/* Teacher */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Teacher Workspace</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Continuous assessment recording, Excel mark-sheets download, drag-and-drop validation, and submission.
                  </p>
                </div>
                <Link
                  href="/teacher"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Enter Teacher Portal →
                </Link>
              </div>

              {/* Student */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-purple-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Student 360°</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Official term report cards, division metrics, attendance history, and fee clearance receipts.
                  </p>
                </div>
                <Link
                  href="/student"
                  className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Enter Student Portal →
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
                    Verified parent-child linking, multi-child switcher, tuition payment invoices, and performance graphs.
                  </p>
                </div>
                <Link
                  href="/parent"
                  className="px-4 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 text-amber-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Enter Parent Portal →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 8. REGIONAL COUNTRY AGNOSTIC COVERAGE */}
        <section id="countries" className="py-16 border-t border-slate-800/80 bg-[#0e1424]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Country-Agnostic Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
                East Africa Ready • Globally Adaptable
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              {COUNTRY_LOCALIZATIONS.map((loc, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-white text-sm flex items-center gap-1.5 mb-1">
                    <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{loc.country}</span>
                  </div>
                  <div className="text-blue-400 font-mono text-[11px] mb-2">{loc.regulators}</div>
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
                    UNIVERSAL ED PLATFORM
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider block">
                    Digital Institutional Operating System
                  </span>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                A unified, multi-tenant digital operating system designed for Primary Schools, Secondary Schools, Advanced High Schools, Vocational Institutes, Colleges, and Universities across East Africa.
              </p>

              {/* Status Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>System Status: <strong>All Clusters Operational (99.98%)</strong></span>
              </div>
            </div>

            {/* Col 2: Solutions by Level */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Institution Solutions</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Primary Schools (Std 1–7)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Secondary Schools (Form 1–4)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Advanced Level (Form 5–6)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Vocational & VETA Institutes</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Diploma Colleges</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Universities & Faculties</a></li>
              </ul>
            </div>

            {/* Col 3: Core Platform Engines */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Platform Engines</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><Link href="/register-institution" className="hover:text-blue-400 transition-colors">Multi-Tenant Onboarding</Link></li>
                <li><Link href="/admissions/apply" className="hover:text-blue-400 transition-colors">Student Online Admissions</Link></li>
                <li><a href="#lifecycle" className="hover:text-blue-400 transition-colors">Standard Competition Ranking</a></li>
                <li><a href="#lifecycle" className="hover:text-blue-400 transition-colors">Excel 14-Point Validation</a></li>
                <li><a href="#lifecycle" className="hover:text-blue-400 transition-colors">Financial Clearance Gate</a></li>
                <li><a href="#lifecycle" className="hover:text-blue-400 transition-colors">Tamper-Resistant Audit Log</a></li>
              </ul>
            </div>

            {/* Col 4: Ecosystem & Roles */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Portals & Workspaces</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><Link href="/admin" className="hover:text-blue-400 transition-colors">Principal Command Center</Link></li>
                <li><Link href="/teacher" className="hover:text-blue-400 transition-colors">Teacher Assessment Workspace</Link></li>
                <li><Link href="/student" className="hover:text-blue-400 transition-colors">Student 360° Portal</Link></li>
                <li><Link href="/parent" className="hover:text-blue-400 transition-colors">Verified Guardian Portal</Link></li>
                <li><Link href="/login" className="hover:text-blue-400 transition-colors">Role Selector Sign In</Link></li>
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
                Designed & Engineered for High-Security Educational Multi-Tenancy across Africa.
              </p>
            </div>

            {/* Compliance & Regulatory Links */}
            <div className="flex flex-wrap items-center gap-6 text-[11px]">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                Data Privacy & Sovereignty
              </span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                Terms of Service
              </span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                Security Architecture
              </span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                East Africa Region (TZ, KE, UG, RW, ZM)
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
