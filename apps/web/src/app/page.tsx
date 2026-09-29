'use client';

import React, { useState, useEffect } from 'react';
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
  Search,
  MapPin,
  Calendar,
  Check,
} from 'lucide-react';

// Typewriter Dynamic Words
const TYPEWRITER_PHRASES = [
  'Shule za Sekondari (O-Level & A-Level)',
  'Vyuo Vikuu na Taasisi za Elimu ya Juu',
  'Shule za Msingi (Primary Schools)',
  'Vyuo vya Kati vya Ufundi (NACTVET)',
  'Vituo vya Mafunzo ya Ufundi Stadi (VETA)',
];

function TypewriterHeading() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentPhrase.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex]);

  return (
    <span className="text-gradient-blue inline-block min-w-[280px] sm:min-w-[460px] text-left">
      {currentText}
      <span className="text-cyan-400 font-light animate-pulse ml-1">|</span>
    </span>
  );
}

// Institutional Academic Models for Tanzania
interface InstitutionTierConfig {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  academicDivision: 'Mihula (Terms)' | 'Semesters';
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
    name: 'Shule ya Sekondari (O-Level)',
    category: 'Kidato cha 1 hadi cha 4',
    badge: 'Mfumo wa Mihula • Nafasi Darasani',
    description:
      'Imeandaliwa kulingana na mtaala wa NECTA Tanzania. Inasimamia mihula ya masomo, upandaji wa alama, kupanga nafasi (1, 2, 2, 4 bila kuruka alama zilizolingana), na mgawanyo wa madaraja (Division I hadi IV na 0).',
    academicDivision: 'Mihula (Terms)',
    gradingSystem: 'NECTA Standard (A: 75–100, B: 65–74, C: 45–64, D: 30–44, F: 0–29)',
    rankingEnabled: true,
    financialClearanceGate: false,
    rolesAvailable: ['Headmaster', 'Academic Master', 'Senior Master', 'Walimu wa Masomo', 'Wanafunzi', 'Wazazi'],
    workflowApprovers: ['Mwalimu wa Somo (Draft)', 'Academic Master (Uhakiki)', 'Mkuu wa Shule (Idhini Rasmi na Kutangaza)'],
    keyHighlight: 'Uhesabuji wa pointi za masomo 7 bora kiotomatiki na taarifa za SMS kwa wazazi siku ya matokeo.',
  },
  {
    id: 'advanced',
    name: 'Sekondari ya Juu (A-Level)',
    category: 'Kidato cha 5 na 6 (High School)',
    badge: 'Michepuo (Combinations) • Points',
    description:
      'Inasaidia michepuo yote ya Tanzania (PCM, PCB, CBG, HGL, HKL, HGK, EGM, ECA, na mingineyo). Inapiga hesabu ya pointi za NECTA (A=1 hadi F=7) na madaraja ya kujiunga na Vyuo Vikuu.',
    academicDivision: 'Mihula (Terms)',
    gradingSystem: 'NECTA A-Level Points (A: 1 pt, B: 2 pts, C: 3 pts, D: 4 pts, E: 5 pts, S: 6 pts, F: 7 pts)',
    rankingEnabled: true,
    financialClearanceGate: false,
    rolesAvailable: ['Mkuu wa Shule', 'Academic Master', 'Walimu wa Combinations', 'Wanafunzi', 'Wazazi'],
    workflowApprovers: ['Mwalimu wa Somo', 'Academic Master', 'Mkuu wa Shule'],
    keyHighlight: 'Utabiri wa vigezo vya udahili wa TCU kulingana na alama za tahasusi zilizopatikana.',
  },
  {
    id: 'university',
    name: 'Chuo Kikuu (University)',
    category: 'Shahada ya Kwanza na Uzamili (TCU)',
    badge: 'Mfumo wa Semesta • GPA ya 5.0',
    description:
      'Imejengwa kulingana na miongozo ya Tume ya Vyuo Vikuu Tanzania (TCU). Inasimamia idara, vitivo (Faculties), mikopo ya masomo (Credits), uhesabuji wa GPA/CGPA, idhini ya Seneti, na kizuizi cha ada.',
    academicDivision: 'Semesters',
    gradingSystem: 'TCU Scale ya 5.0 (A: 70–100 / 5.0, B+: 60–69 / 4.0, B: 50–59 / 3.0, C: 40–49 / 2.0, D: 35–39, E: 0–34)',
    rankingEnabled: false,
    financialClearanceGate: true,
    rolesAvailable: ['Makamu Mkuu wa Chuo', 'Dean wa Kitivo', 'Registrar', 'Wakuu wa Idara (HOD)', 'Wahadhiri', 'Wanafunzi', 'Bursar'],
    workflowApprovers: ['Mhadhiri wa Kozi', 'Mkuu wa Idara (Moderation)', 'Dean na Seneti ya Chuo (Kutoa Matokeo)'],
    keyHighlight: 'Kizuizi cha Ada (Financial Clearance Gate): Mwanafunzi asiyekamilisha ada hawezi kupakua cheti cha mtihani au transcript.',
  },
  {
    id: 'vocational',
    name: 'Vyuo vya Kati na Ufundi (NACTVET & VETA)',
    category: 'Astashahada, Stashahada & Mafunzo ya Ufundi',
    badge: 'NTA Level 4–6 • CBET Modules',
    description:
      'Mfumo wa vyuo vya kati vilivyosajiliwa na NACTVET na VETA. Unasimamia mafunzo kwa vitendo (Practical Workshops), moduli za umahiri (Competency-Based Education), na mafunzo kazini (Field Attachment).',
    academicDivision: 'Semesters',
    gradingSystem: 'NACTVET Grading System (Distinction, Upper Credit, Lower Credit, Pass)',
    rankingEnabled: false,
    financialClearanceGate: true,
    rolesAvailable: ['Mkuu wa Chuo', 'Wakufunzi wa Warsha', 'Wanafunzi wa Mafunzo', 'Afisa Mafunzo ya Vitendo'],
    workflowApprovers: ['Mkufunzi wa Warsha', 'Dean wa Taaluma'],
    keyHighlight: 'Kumbukumbu za alama za vitendo na usajili wa mitihani ya NACTVET.',
  },
  {
    id: 'primary',
    name: 'Shule ya Msingi (Primary School)',
    category: 'Darasa la 1 hadi la 7',
    badge: 'Tathmini Endelevu (CA)',
    description:
      'Usimamizi rahisi wa madarasa na mikondo (Streams), alama za tathmini endelevu, ripoti za maendeleo, na mawasiliano ya simu kwa wazazi.',
    academicDivision: 'Mihula (Terms)',
    gradingSystem: 'Tathmini ya Madaraja 5 (A: Bora Sana, B: Nzuri, C: Wastani, D: Dhaifu, E: Hafifu)',
    rankingEnabled: true,
    financialClearanceGate: false,
    rolesAvailable: ['Mwalimu Mkuu', 'Mwalimu wa Darasa', 'Walimu wa Masomo', 'Wazazi / Walezi'],
    workflowApprovers: ['Mwalimu wa Somo', 'Mwalimu Mkuu'],
    keyHighlight: 'Uunganishaji wa namba za simu za wazazi kwa ajili ya taarifa za haraka za maendeleo ya mwanafunzi.',
  },
];

// Sample Live School Portals in Tanzania
const FEATURED_SCHOOL_PORTALS = [
  {
    name: 'Kilimanjaro Secondary School',
    code: 'KSS',
    slug: 'kss',
    type: 'Shule ya Sekondari (Kidato cha 1–4)',
    location: 'Moshi Mjini, Mkoa wa Kilimanjaro',
    motto: 'Elimu Ni Nuru na Uongozi',
    regNumber: 'S.1429 (Wizara ya Elimu)',
    verifiedStudents: 1420,
  },
  {
    name: 'Lake Victoria Institute of Technology',
    code: 'LVIT',
    slug: 'lvit',
    type: 'Chuo cha Elimu ya Juu na Teknolojia',
    location: 'Capripoint, Jiji la Mwanza',
    motto: 'Ubunifu, Teknolojia na Uadilifu',
    regNumber: 'REG/NACTVET/0894',
    verifiedStudents: 3850,
  },
  {
    name: 'St. Augustine International Academy',
    code: 'SAIA',
    slug: 'saia',
    type: 'Shule ya Msingi na Sekondari',
    location: 'Njiro, Jiji la Arusha',
    motto: 'Uongozi kupitia Maarifa na Maadili',
    regNumber: 'S.4891',
    verifiedStudents: 980,
  },
];

// Regulatory Bodies of Tanzania
const TANZANIA_REGULATORS = [
  {
    name: 'NECTA',
    fullName: 'Baraza la Mitihani la Taifa la Tanzania',
    role: 'Mitihani ya Taifa (PSLE, CSEE, ACSEE)',
    standards: 'Division I–IV, Points za Masomo, na Nafasi Darasani',
    badge: 'Mitihani ya Taifa',
  },
  {
    name: 'TCU',
    fullName: 'Tume ya Vyuo Vikuu Tanzania',
    role: 'Udhibiti na Viwango vya Vyuo Vikuu',
    standards: 'Shahada za Kwanza na Uzamili, Mfumo wa GPA ya 5.0',
    badge: 'Elimu ya Juu',
  },
  {
    name: 'NACTVET',
    fullName: 'Baraza la Taifa la Elimu ya Ufundi na Mafunzo ya Ufundi Stadi',
    role: 'Vyuo vya Kati, Ufundi na VETA',
    standards: 'NTA Level 4–6, Moduli za CBET na Alama za Vitendo',
    badge: 'Vyuo vya Ufundi',
  },
  {
    name: 'TAMISEMI & MoEST',
    fullName: 'Wizara ya Elimu, Sayansi na Teknolojia / TAMISEMI',
    role: 'Usimamizi wa Shule za Serikali na Binafsi',
    standards: 'Sajili za Shule, Mahudhurio na Miundombinu ya Kujifunzia',
    badge: 'Wizara ya Elimu',
  },
];

export default function HomePage() {
  const [selectedTierId, setSelectedTierId] = useState<string>('secondary');
  const activeTier = INSTITUTION_TIERS.find((t) => t.id === selectedTierId) || INSTITUTION_TIERS[0];
  const [portalSearch, setPortalSearch] = useState('');

  const filteredPortals = FEATURED_SCHOOL_PORTALS.filter((p) =>
    p.name.toLowerCase().includes(portalSearch.toLowerCase()) ||
    p.code.toLowerCase().includes(portalSearch.toLowerCase()) ||
    p.location.toLowerCase().includes(portalSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT & NAVIGATION */}
      <div>
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b border-blue-500/20 px-4 py-2 text-center text-xs text-blue-200 font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span>Mfumo Rasmi wa Kidijitali wa Taasisi za Elimu Tanzania (NECTA, NACTVET & TCU)</span>
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
                  Tanzania Academic Portal
                </span>
              </div>
            </Link>

            {/* Quick Links */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#portals-finder" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold flex items-center gap-1.5">
                <School className="w-4 h-4" />
                <span>Tovuti za Shule</span>
              </a>
              <a href="#tiers" className="hover:text-white transition-colors">
                Viwango vya Elimu
              </a>
              <a href="#workflow" className="hover:text-white transition-colors">
                Mzunguko wa Mfumo
              </a>
              <a href="#regulators" className="hover:text-white transition-colors">
                NECTA & TCU
              </a>
              <a href="#portals" className="hover:text-white transition-colors">
                Dashibodi za Watumiaji
              </a>
            </nav>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all bg-slate-900/60"
              >
                Ingia Portal
              </Link>
              <Link
                href="/register-institution"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <span>Sajili Shule Yako</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* 2. HERO SECTION WITH CINEMATIC CAMPUS IMAGE BACKGROUND & TYPEWRITER TEXT */}
        <section className="relative overflow-hidden pt-16 pb-24 border-b border-slate-800/80">
          {/* Real Campus Background Image with Deep Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-campus-bg.jpg"
              alt="Mandhari ya Kampasi ya Shule na Chuo Tanzania"
              fill
              className="object-cover object-center opacity-30 filter brightness-[0.7] contrast-125 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#090d16]/95 via-[#090d16]/85 to-[#090d16]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Hero Text */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-medium backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Mfumo Kamili wa Shule za Msingi, Sekondari na Vyuo Tanzania (TZS)</span>
              </div>

              {/* Dynamic Typewriter Headline */}
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Usimamizi wa Kisasa wa Elimu kwa{' '}
                <div className="mt-1 sm:mt-2">
                  <TypewriterHeading />
                </div>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-md">
                Mfumo wa kisasa unaohifadhi kumbukumbu za shule, usajili wa wanafunzi wapya, uwekaji wa alama za masomo, uhesabuji wa madaraja na nafasi darasani, na uthibitisho wa wazazi kupitia simu zao.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href="#portals-finder"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group"
                >
                  <School className="w-4 h-4 text-blue-200" />
                  <span>Fungua Tovuti ya Shule Yako</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <Link
                  href="/register-institution"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800/80 backdrop-blur-md text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Sajili Shule au Chuo Kipya</span>
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-800 hover:bg-slate-900/80 backdrop-blur-md text-slate-300 font-medium text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Kuingia Kwenye Akaunti</span>
                </Link>
              </div>

              {/* Core System Standards */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Usalama wa Data ya Shule Pekee
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  Kumbukumbu za Kudumu (Audit Log)
                </span>
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                  Uhakiki wa Excel wa Pointi 14
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Nafasi Darasani (Competition Ties)
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

        {/* 3. DIRECT INSTITUTION PORTALS FINDER (Tanzanian Schools) */}
        <section id="portals-finder" className="py-16 bg-[#0b101d] border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Tovuti Binafsi za Shule na Vyuo
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight">
                  Fungua Tovuti ya Shule Yako
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  Kila shule au chuo kinachosajiliwa kinapata tovuti yake binafsi yenye nembo, kaulimbiu, matangazo, na viingilio vya wanafunzi na wazazi bila kupitia ukurasa mkuu.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={portalSearch}
                  onChange={(e) => setPortalSearch(e.target.value)}
                  placeholder="Tafuta jina la shule au mkoa..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#090d16] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* School Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPortals.map((school) => (
                <div
                  key={school.code}
                  className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      {/* School Crest Emblem */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-bold text-white shadow-md relative overflow-hidden group-hover:scale-105 transition-transform">
                        <div className="w-8 h-8 rounded-full border border-amber-400/40 flex items-center justify-center bg-blue-950/60">
                          <School className="w-4 h-4 text-amber-300" />
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-md bg-blue-950/50 border border-blue-500/30 text-blue-300 font-mono text-[10px] font-bold">
                        {school.code}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {school.name}
                    </h3>
                    <div className="text-xs text-blue-400 font-medium mt-1">{school.type}</div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{school.location}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 italic mt-3 border-t border-slate-800/80 pt-2">
                      "{school.motto}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Wanafunzi {school.verifiedStudents.toLocaleString()}
                    </span>
                    <Link
                      href={`/portal/${school.slug}`}
                      className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-200 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                    >
                      <span>Fungua Tovuti</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. REAL-WORLD IMPACT (Wanafunzi wa Tanzania Maktabani) */}
        <section className="py-16 border-b border-slate-800/80 bg-[#090d16]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl order-2 lg:order-1">
                <Image
                  src="/images/students-campus.jpg"
                  alt="Wanafunzi wa Tanzania wakitumia kompyuta kujifunzia maktabani"
                  width={1600}
                  height={900}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 p-4 glass-card rounded-2xl border border-white/10">
                  <span className="text-xs font-mono uppercase tracking-widest text-blue-400 block mb-1">
                    Taarifa Kamili za Mwanafunzi (Student 360°)
                  </span>
                  <p className="text-xs text-slate-200">
                    Kuwawezesha wanafunzi, wazazi waliohakikiwa, na walimu nchi nzima ya Tanzania kupata ripoti sahihi za mitihani, mahudhurio, na maendeleo ya kitaaluma.
                  </p>
                </div>
              </div>

              {/* Text Highlights */}
              <div className="space-y-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  <span>Imejengwa kwa Viwango vya Tanzania</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  Kurahisisha Uendeshaji wa Shule na Vyuo Tanzania
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Mfumo huu umetengenezwa mahususi kuondoa usumbufu wa kuhesabu madaraja kwa mkono. Kila shule inajiwekea sheria zake za kimasomo, kalenda ya mihula, na michango ya ada kwa ulinzi thabiti wa taarifa.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="font-bold text-white text-sm">Uthibitisho wa Mzazi</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Mzazi anapata taarifa za watoto wake pekee waliothibitishwa na uongozi wa shule.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="font-bold text-white text-sm">Kurekebisha Alama Kihalali</div>
                    <p className="text-xs text-slate-400 mt-1">
                      Alama ikishatangazwa, marekebisho yanahitaji sababu rasmi na idhini ya Mkuu wa Shule.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE INSTITUTION TIERS (Configurable Architecture Demo) */}
        <section id="tiers" className="py-20 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase font-mono tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Uwezo wa Kubadilika Kulingana na Shule Yako
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                Mfumo Mmoja. Ngazi Zote za Elimu Tanzania.
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Chagua kiwango cha elimu hapa chini uone jinsi mfumo unavyojibadilisha papo hapo kulingana na taratibu za shule au chuo chako.
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
                        Muundo wa Kalenda ya Masomo
                      </span>
                      <span className="text-white font-semibold text-sm">
                        {activeTier.academicDivision}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block mb-1 font-mono uppercase text-[10px]">
                        Upangaji wa Nafasi Darasani
                      </span>
                      <span className={activeTier.rankingEnabled ? 'text-emerald-400 font-semibold text-sm' : 'text-slate-400 font-semibold text-sm'}>
                        {activeTier.rankingEnabled ? '✓ Imewashwa (Standard Competition Ties)' : '✕ Imezimwa (GPA / CGPA)'}
                      </span>
                    </div>

                    <div className="sm:col-span-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block mb-1 font-mono uppercase text-[10px]">
                        Mfumo wa Madaraja na Alama
                      </span>
                      <span className="text-blue-300 font-mono font-medium">{activeTier.gradingSystem}</span>
                    </div>
                  </div>

                  {/* Workflow Approval Sequence */}
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                      Mlolongo wa Idhini ya Kutangaza Matokeo:
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
                      Majukumu ya Watumiaji
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
                      Kipengele Maalumu
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      {activeTier.keyHighlight}
                    </p>
                  </div>

                  <Link
                    href="/register-institution"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition-all shadow-md shadow-blue-600/30 block"
                  >
                    Sanidi Tovuti ya {activeTier.name} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. REGULATORS OF TANZANIA SECTION */}
        <section id="regulators" className="py-16 border-b border-slate-800 bg-[#0e1424]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Ulinganifu wa Mitaala Tanzania
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
                Imejengwa Kuendana na Miongozo ya NECTA, TCU na NACTVET
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              {TANZANIA_REGULATORS.map((reg, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-300 font-mono text-[10px] font-bold mb-3 inline-block">
                      {reg.badge}
                    </span>
                    <h3 className="font-extrabold text-white text-lg mb-1">{reg.name}</h3>
                    <p className="text-[11px] text-slate-400 mb-3">{reg.fullName}</p>
                    <div className="text-xs text-slate-300 border-t border-slate-800 pt-3">
                      <strong className="text-white block mb-0.5">Usimamizi:</strong>
                      {reg.role}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono">
                    ✓ {reg.standards}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. SYSTEM LIFECYCLE (Mzunguko wa Mfumo) */}
        <section id="workflow" className="py-20 border-b border-slate-800/80 bg-[#0b101d]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Mzunguko Kamili wa Mwanafunzi
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                Kuanzia Usajili Hadi Kuhitimu
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Taarifa za mwanafunzi hazifutiki hata akihitimu, zinabaki kwenye kumbukumbu rasmi za shule kwa miaka yote.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-sm mb-4">
                  01
                </div>
                <h3 className="font-bold text-white text-base mb-1">Usajili wa Shule</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kuweka taarifa za shule, muundo wa madarasa, viwango vya alama (Pass marks), na akaunti ya mkuu wa shule.
                </p>
              </div>

              {/* Step 2 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-sm mb-4">
                  02
                </div>
                <h3 className="font-bold text-white text-base mb-1">Maombi ya Wanafunzi Mtandaoni</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Wanafunzi wanaomba nafasi mtandaoni kwa kupakia vyeti na namba ya mtihani ya NECTA. Wakikubaliwa, wanahamishiwa darasani moja kwa moja.
                </p>
              </div>

              {/* Step 3 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold flex items-center justify-center text-sm mb-4">
                  03
                </div>
                <h3 className="font-bold text-white text-base mb-1">Madarasa na Mahudhurio</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kupanga walimu wa masomo, orodha za wanafunzi darasani, na kurekodi mahudhurio ya kila siku.
                </p>
              </div>

              {/* Step 4 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-sm mb-4">
                  04
                </div>
                <h3 className="font-bold text-white text-base mb-1">Uingizaji wa Alama & Excel</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Walimu wanaingiza alama mtandaoni au kupakia Excel. Mfumo unahakiki makosa ya pointi 14 kiotomatiki kabla ya kupokea.
                </p>
              </div>

              {/* Step 5 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-sm mb-4">
                  05
                </div>
                <h3 className="font-bold text-white text-base mb-1">Uhakiki na Idhini ya Mkuu wa Shule</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Academic Master anakagua alama, Mkuu wa Shule anaweka saini na kuidhinisha tarehe ya kutangaza matokeo kwa wote.
                </p>
              </div>

              {/* Step 6 */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 font-bold flex items-center justify-center text-sm mb-4">
                  06
                </div>
                <h3 className="font-bold text-white text-base mb-1">Kupakua Ripoti & Portal ya Wazazi</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Wanafunzi na wazazi wanapokea ujumbe na kupakua ripoti ya maendeleo (Report Card) baada ya kuthibitishwa kutokuwa na deni la ada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. DEDICATED ROLE PORTALS */}
        <section id="portals" className="py-20 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase font-mono tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Dashibodi Zilizotengwa Kipekee
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                Kila Mtumiaji Ana Sehemu Yake Pekee
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Mkuu wa Shule, Mwalimu, Mwanafunzi, na Mzazi kila mmoja ana ukurasa wake wa kazi unaoendana na wajibu wake.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Headmaster / Admin */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-blue-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Mkuu wa Shule / Admin</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Takwimu za shule nzima, idhini ya mwisho ya matokeo, tarehe za kutangaza, na udhibiti wa usalama.
                  </p>
                </div>
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Fungua Dashboard ya Mkuu →
                </Link>
              </div>

              {/* Teacher */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Walimu (Teacher Portal)</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Kuingiza alama za majaribio na mitihani, kupakua template ya Excel, na kuwasilisha matokeo kwa Academic Master.
                  </p>
                </div>
                <Link
                  href="/teacher"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Fungua Portal ya Mwalimu →
                </Link>
              </div>

              {/* Student */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-purple-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Mwanafunzi (Student 360°)</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Kuangalia ripoti ya matokeo ya muhula, nafasi darasani, wastani wa alama, na stakabadhi za ada.
                  </p>
                </div>
                <Link
                  href="/student"
                  className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Fungua Portal ya Mwanafunzi →
                </Link>
              </div>

              {/* Parent */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-amber-500/50 transition-all">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">Mzazi / Mlezi (Parent Portal)</h3>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Kubadilisha watoto waliosajiliwa shuleni, kuangalia maendeleo ya mitihani, mahudhurio, na ankara za ada.
                  </p>
                </div>
                <Link
                  href="/parent"
                  className="px-4 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 text-amber-300 hover:text-white font-semibold text-xs transition-all text-center block"
                >
                  Fungua Portal ya Mzazi →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 9. ENTERPRISE WORLD-CLASS FOOTER (Tanzania Aligned) */}
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
                    UNIVERSAL ED TANZANIA
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider block">
                    Mfumo wa Kidijitali wa Taasisi za Elimu
                  </span>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Mfumo jumuishi wa usimamizi wa shule za msingi, sekondari, vyuo vya ufundi (VETA na NACTVET), na vyuo vikuu (TCU) nchini Tanzania.
              </p>

              {/* Status Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Hali ya Mfumo: <strong>Inafanya Kazi Saa 24 (99.98% Uptime)</strong></span>
              </div>
            </div>

            {/* Col 2: Ngazi za Elimu */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Ngazi za Elimu</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Shule za Msingi (Std 1–7)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Sekondari O-Level (Form 1–4)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Sekondari A-Level (Form 5–6)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Vyuo vya Ufundi Stadi (VETA)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Vyuo vya Kati (NACTVET)</a></li>
                <li><a href="#tiers" className="hover:text-blue-400 transition-colors">Vyuo Vikuu (TCU Degrees)</a></li>
              </ul>
            </div>

            {/* Col 3: Mifumo na Injini */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Vipengele vya Mfumo</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><Link href="/register-institution" className="hover:text-blue-400 transition-colors">Kusajili Shule Mpya</Link></li>
                <li><Link href="/admissions/apply" className="hover:text-blue-400 transition-colors">Maombi ya Wanafunzi Mtandaoni</Link></li>
                <li><a href="#workflow" className="hover:text-blue-400 transition-colors">Upangaji wa Nafasi Darasani</a></li>
                <li><a href="#workflow" className="hover:text-blue-400 transition-colors">Uhakiki wa Excel wa Pointi 14</a></li>
                <li><a href="#workflow" className="hover:text-blue-400 transition-colors">Kizuizi cha Ada (Bursar Gate)</a></li>
                <li><a href="#workflow" className="hover:text-blue-400 transition-colors">Kumbukumbu Rasmi za Usalama</a></li>
              </ul>
            </div>

            {/* Col 4: Dashibodi */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Viingilio vya Watumiaji</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><Link href="/admin" className="hover:text-blue-400 transition-colors">Mkuu wa Shule & Admin</Link></li>
                <li><Link href="/teacher" className="hover:text-blue-400 transition-colors">Mwalimu wa Somo</Link></li>
                <li><Link href="/student" className="hover:text-blue-400 transition-colors">Mwanafunzi (Student 360°)</Link></li>
                <li><Link href="/parent" className="hover:text-blue-400 transition-colors">Mzazi / Mlezi</Link></li>
                <li><Link href="/login" className="hover:text-blue-400 transition-colors">Kuingia Kwenye Akaunti</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Divider & Legal Section */}
          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            {/* Strict Copyright Requirement */}
            <div>
              <p className="text-slate-400 font-medium">
                © 2026 Universal Education Management Platform. Haki zote zimehifadhiwa.
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Jamhuri ya Muungano wa Tanzania • NECTA, TCU na NACTVET Aligned.
              </p>
            </div>

            {/* Compliance & Regulatory Links */}
            <div className="flex flex-wrap items-center gap-6 text-[11px]">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                Ulinzi wa Taarifa Binafsi
              </span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                Vigezo na Masharti
              </span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">
                Usalama wa Kimtandao
              </span>
              <span className="text-emerald-400 font-medium">
                Tanzania (TZS)
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
