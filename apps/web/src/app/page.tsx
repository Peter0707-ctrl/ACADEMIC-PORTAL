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
  Phone,
  Mail,
  Clock,
  Sparkles,
  HelpCircle,
  Smartphone,
  CreditCard,
  FileText
} from 'lucide-react';

// Maandishi Yanayojiandika Yenyewe (Typewriter)
const TYPEWRITER_PHRASES = [
  'Shule za Sekondari (High Schools)',
  'Vyuo na Taasisi za Elimu ya Juu',
  'Shule za Msingi na Awali (Academies)',
  'Vyuo vya Kati na Mafunzo ya Ufundi',
  'Taasisi Zote za Elimu Tanzania',
];

function TypewriterHeading() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 35 : 75;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2400);
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
    <span className="text-blue-700 font-extrabold inline-block min-w-[280px] sm:min-w-[480px] text-left">
      {currentText}
      <span className="text-emerald-600 font-light animate-pulse ml-1">|</span>
    </span>
  );
}

// Ngazi za Taasisi
interface InstitutionTierConfig {
  id: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  academicDivision: 'Mihula (Terms)' | 'Semesta (Semesters)';
  gradingSystem: string;
  rankingEnabled: boolean;
  financialClearanceGate: boolean;
  rolesAvailable: string[];
  keyHighlight: string;
}

const INSTITUTION_TIERS: InstitutionTierConfig[] = [
  {
    id: 'secondary',
    name: 'Shule za Sekondari',
    category: 'Kidato cha 1 hadi cha 6',
    badge: 'Mihula • Nafasi Darasani & Pointi',
    description:
      'Mfumo maalum kwa shule za sekondari unaorahisisha uwekaji wa alama za majaribio na mitihani, ufuatiliaji wa mahudhurio, utoaji wa kadi za ripoti, na kuhesabu nafasi darasani kiotomatiki.',
    academicDivision: 'Mihula (Terms)',
    gradingSystem: 'Madaraja: A (75-100), B (65-74), C (45-64), D (30-44), F (0-29)',
    rankingEnabled: true,
    financialClearanceGate: true,
    rolesAvailable: ['Mkuu wa Shule', 'Mwalimu wa Taaluma', 'Mwalimu wa Somo', 'Mhasibu', 'Mzazi', 'Mwanafunzi'],
    keyHighlight: 'Uhesabuji wa pointi, madaraja na nafasi ya kila mwanafunzi darasani kiotomatiki bila makosa ya kikokotoo.',
  },
  {
    id: 'university',
    name: 'Vyuo Vikuu na Vyuo vya Kati',
    category: 'Shahada na Stashahada',
    badge: 'Semesta • GPA na Usajili wa Kozi',
    description:
      'Mfumo mpana wa vyuo unaowezesha usajili wa kozi (Module Registration), uhesabuji wa GPA (Semester na Cumulative GPA), usimamizi wa ada, na kutoa matokeo mtandaoni.',
    academicDivision: 'Semesta (Semesters)',
    gradingSystem: 'Madaraja ya GPA: A (70-100), B+ (60-69), B (50-59), C (40-49), D (35-39), E (0-34)',
    rankingEnabled: false,
    financialClearanceGate: true,
    rolesAvailable: ['Mkuu wa Chuo', 'Mkuu wa Idara', 'Mkufunzi/Mhadhiri', 'Mhasibu', 'Mwanafunzi'],
    keyHighlight: 'Uhesabuji wa GPA ya semesta na jumla (Cumulative GPA) pamoja na matokeo ya marudio (Supplementary).',
  },
  {
    id: 'primary',
    name: 'Shule za Msingi na Awali',
    category: 'Nursery & Primary School',
    badge: 'Mihula • Ripoti za Watoto & SMS kwa Wazazi',
    description:
      'Mfumo rafiki kwa shule za msingi na awali za English Medium na Kiswahili unaowezesha kutoa ripoti safi za maendeleo ya mtoto, tabia, mahudhurio na kutuma alama kwa wazazi.',
    academicDivision: 'Mihula (Terms)',
    gradingSystem: 'Madaraja ya Msingi: A (81-100), B (61-80), C (41-60), D (21-40), E (0-20)',
    rankingEnabled: true,
    financialClearanceGate: true,
    rolesAvailable: ['Mwalimu Mkuu', 'Mwalimu wa Darasa', 'Mhasibu', 'Mzazi'],
    keyHighlight: 'Ripoti ya rangi yenye picha ya mtoto, nafasi yake darasani na maoni ya mwalimu inayotumwa kwa wazazi.',
  },
  {
    id: 'veta',
    name: 'Vyuo vya Mafunzo ya Ufundi Stadi',
    category: 'Kozi za Vitendo na Ufundi',
    badge: 'Competency-Based • Mafunzo kwa Vitendo',
    description:
      'Mfumo wa vyuo vya ufundi unaofuatilia mafunzo ya vitendo (Practical Workshops), tathmini ya stadi za kazi, na kutoa vyeti vya kuhitimu.',
    academicDivision: 'Semesta (Semesters)',
    gradingSystem: 'Vipimo vya Ufundi: Competent (A, B, C) / Not Yet Competent',
    rankingEnabled: false,
    financialClearanceGate: true,
    rolesAvailable: ['Principal', 'Mkufunzi wa Karakana', 'Mhasibu', 'Mwanafunzi'],
    keyHighlight: 'Ufuatiliaji wa vifaa vya karakana, miradi ya wanafunzi na mafunzo kwa vitendo viwandani (Fieldwork).',
  },
];

// Orodha ya Tovuti za Shule (Portals)
interface SchoolPortal {
  slug: string;
  name: string;
  category: string;
  region: string;
  motto: string;
  studentsCount: number;
  centerNumber: string;
}

const FEATURED_SCHOOLS: SchoolPortal[] = [
  {
    slug: 'kss',
    name: 'Kilimanjaro Secondary School',
    category: 'Sekondari (Kidato cha 1 - 4)',
    region: 'Moshi, Kilimanjaro',
    motto: 'Elimu ni Mwanga na Msingi wa Maisha Bora',
    studentsCount: 920,
    centerNumber: 'KSS-TZ',
  },
  {
    slug: 'saia',
    name: 'St. Augustine International Academy',
    category: 'Msingi na Awali (Nursery & Primary)',
    region: 'Oysterbay, Dar es Salaam',
    motto: 'Knowledge, Integrity and Discipline',
    studentsCount: 650,
    centerNumber: 'SAIA-TZ',
  },
  {
    slug: 'lvit',
    name: 'Lake Victoria Institute of Technology',
    category: 'Chuo cha Ufundi na Teknolojia',
    region: 'Ilemela, Mwanza',
    motto: 'Innovating Practical Engineering Skills',
    studentsCount: 1480,
    centerNumber: 'LVIT-TZ',
  },
  {
    slug: 'apex-college',
    name: 'Apex Institute of Business & Technology',
    category: 'Chuo cha Kati & Stashahada',
    region: 'Dodoma Mjini',
    motto: 'Embracing Knowledge and Innovation',
    studentsCount: 1850,
    centerNumber: 'APEX-TZ',
  },
  {
    slug: 'horizon-high',
    name: "Horizon Academy High School",
    category: 'Sekondari (Kidato cha 1 - 6)',
    region: 'Kinondoni, Dar es Salaam',
    motto: 'In Pursuit of Academic Excellence',
    studentsCount: 780,
    centerNumber: 'HAH-TZ',
  },
  {
    slug: 'highland-girls',
    name: "Highland Girls Secondary School",
    category: 'Sekondari (Kidato cha 1 - 4)',
    region: 'Mbeya Mjini',
    motto: 'Ora et Labora • Sali na Utende',
    studentsCount: 540,
    centerNumber: 'HGS-TZ',
  },
];

// Mfano wa Marksheet ya Matokeo
interface MarksheetRecord {
  rank: number;
  indexNo: string;
  name: string;
  kisw: { score: number; grade: string };
  eng: { score: number; grade: string };
  math: { score: number; grade: string };
  phy: { score: number; grade: string };
  chem: { score: number; grade: string };
  bio: { score: number; grade: string };
  hist: { score: number; grade: string };
  points: number;
  division: string;
}

const SAMPLE_MARKSHEET: MarksheetRecord[] = [
  {
    rank: 1,
    indexNo: 'KSS/2026/024',
    name: 'BARAKA JOHN MSUYA',
    kisw: { score: 91, grade: 'A' },
    eng: { score: 88, grade: 'A' },
    math: { score: 94, grade: 'A' },
    phy: { score: 89, grade: 'A' },
    chem: { score: 92, grade: 'A' },
    bio: { score: 85, grade: 'A' },
    hist: { score: 87, grade: 'A' },
    points: 7,
    division: 'Division I',
  },
  {
    rank: 2,
    indexNo: 'KSS/2026/089',
    name: 'REHEMA ALLY KILUA',
    kisw: { score: 86, grade: 'A' },
    eng: { score: 90, grade: 'A' },
    math: { score: 79, grade: 'B' },
    phy: { score: 82, grade: 'A' },
    chem: { score: 84, grade: 'A' },
    bio: { score: 88, grade: 'A' },
    hist: { score: 80, grade: 'A' },
    points: 8,
    division: 'Division I',
  },
  {
    rank: 3,
    indexNo: 'KSS/2026/012',
    name: 'KELVIN ERASTO SHIRIMA',
    kisw: { score: 78, grade: 'B' },
    eng: { score: 82, grade: 'A' },
    math: { score: 74, grade: 'B' },
    phy: { score: 71, grade: 'B' },
    chem: { score: 75, grade: 'B' },
    bio: { score: 79, grade: 'B' },
    hist: { score: 77, grade: 'B' },
    points: 13,
    division: 'Division I',
  },
  {
    rank: 4,
    indexNo: 'KSS/2026/104',
    name: 'NEEMA GODFREY MWANGI',
    kisw: { score: 72, grade: 'B' },
    eng: { score: 76, grade: 'B' },
    math: { score: 58, grade: 'C' },
    phy: { score: 64, grade: 'C' },
    chem: { score: 68, grade: 'B' },
    bio: { score: 70, grade: 'B' },
    hist: { score: 65, grade: 'B' },
    points: 18,
    division: 'Division II',
  },
];

export default function LandingPage() {
  const [activeTier, setActiveTier] = useState<string>('secondary');
  const [searchPortal, setSearchPortal] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('All');

  const currentTierData =
    INSTITUTION_TIERS.find((t) => t.id === activeTier) || INSTITUTION_TIERS[0];

  const filteredSchools = FEATURED_SCHOOLS.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchPortal.toLowerCase()) ||
      school.region.toLowerCase().includes(searchPortal.toLowerCase()) ||
      school.centerNumber.toLowerCase().includes(searchPortal.toLowerCase());
    const matchesRegion =
      selectedRegionFilter === 'All' || school.region.includes(selectedRegionFilter);
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-700/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  UNIVERSAL<span className="text-blue-700">ED</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                  Tanzania
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Mfumo wa Kisasa wa Usimamizi wa Shule na Vyuo
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#tovuti-za-shule" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <School className="w-4 h-4 text-blue-600" />
              Tovuti za Shule
            </a>
            <a href="#matokeo-ya-mitihani" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Kadi za Ripoti
            </a>
            <a href="#ngazi-za-elimu" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              Ngazi za Taasisi
            </a>
            <a href="#huduma-na-ada" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Gharama (TZS)
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Ingia Mfumo
            </Link>
            <Link
              href="/register-institution"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-md shadow-blue-700/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Sajili Shule Yako</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. ACADEMIC HERO SECTION WITH DAYLIGHT CAMPUS PHOTOGRAPHY */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200 py-16 lg:py-24">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Action CTA */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Programu Kamili ya Uendeshaji wa Shule na Vyuo</span>
              </div>

              {/* Dynamic Typewriter Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Usimamizi wa Kisasa wa Elimu kwa{' '}
                <div className="mt-1 sm:mt-2">
                  <TypewriterHeading />
                </div>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
                Rahisisha uendeshaji wa shule au chuo chako kwa mfumo mmoja jumuishi: usajili wa wanafunzi,
                uwekaji wa alama na kadi za ripoti, makusanyo ya ada na risiti, ufuatiliaji wa mahudhurio,
                na kutoa tovuti (portal) binafsi kwa kila shule.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href="#tovuti-za-shule"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md shadow-blue-700/25 transition-all text-sm"
                >
                  <School className="w-4 h-4" />
                  <span>Tazama Tovuti za Shule (Portals)</span>
                </a>

                <Link
                  href="/register-institution"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition-all text-sm"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Sajili Shule Yako Sasa</span>
                </Link>

                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 shadow-sm transition-all text-sm"
                >
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Ingia Kwenye Akaunti</span>
                </Link>
              </div>

              {/* Value Highlights */}
              <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Kadi za Ripoti za Papo Hapo
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  SMS & WhatsApp kwa Wazazi
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  Tovuti Binafsi ya Kila Shule
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  Usimamizi wa Ada kwa TZS
                </span>
              </div>
            </div>

            {/* Right Column: Campus Picture Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                {/* Photo of Campus Building */}
                <div className="relative h-80 sm:h-96 w-full">
                  <Image
                    src="/images/ai-campus-hero.jpg"
                    alt="Mandhari ya Kisasa ya Kampasi ya Kidijitali ya Elimu"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                </div>

                {/* Campus Information Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-700/90 backdrop-blur-md text-xs font-bold mb-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Taasisi za Elimu Tanzania</span>
                  </div>
                  <h3 className="text-lg font-bold drop-shadow-md">
                    Kampasi ya Kisasa ya Kidijitali
                  </h3>
                  <p className="text-xs text-slate-200 drop-shadow-sm">
                    Inayotumiwa na shule na vyuo vya kisasa kusimamia taaluma mtandaoni
                  </p>
                </div>

                {/* Floating Tag */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-extrabold text-slate-800">
                    Mfumo Upo Hewani 24/7
                  </span>
                </div>
              </div>

              {/* Quick Stat Highlights */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xl font-black text-blue-700">Dakika 3</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Kuanza Kutumia</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xl font-black text-emerald-600">TZS</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Malipo Rahisi</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xl font-black text-amber-600">100%</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Mtandaoni</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SCHOOL PORTALS (TOVUTI RASMI ZA SHULE NA VYUO) */}
      <section id="tovuti-za-shule" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <School className="w-3.5 h-3.5" />
              <span>Tovuti za Kila Shule (Dedicated Portals)</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Kila Shule na Chuo Hupata Tovuti Yake Rasmi
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Shule yako ikisajiliwa inapata tovuti yake binafsi yenye nembo, kaulimbiu, matangazo na viingilio
              vya walimu, wanafunzi, wazazi na utawala.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tafuta shule au chuo kwa jina au mkoa (mfano: Kilimanjaro, Moshi, Mwanza)..."
                value={searchPortal}
                onChange={(e) => setSearchPortal(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 placeholder-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Mkoa:</span>
              <select
                value={selectedRegionFilter}
                onChange={(e) => setSelectedRegionFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="All">Mikoa Yote</option>
                <option value="Kilimanjaro">Kilimanjaro</option>
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Mwanza">Mwanza</option>
                <option value="Dodoma">Dodoma</option>
                <option value="Mbeya">Mbeya</option>
              </select>
            </div>
          </div>

          {/* Portals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div
                key={school.slug}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-black text-base shadow-xs group-hover:scale-105 transition-transform">
                      {school.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {school.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {school.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{school.region}</span>
                  </div>

                  <p className="text-xs italic text-slate-600 border-l-2 border-blue-500 pl-2.5 py-0.5 mb-4">
                    "{school.motto}"
                  </p>

                  <div className="py-2 px-3 bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 mb-4">
                    👥 Wanafunzi Waliosajiliwa: <strong className="text-emerald-700">{school.studentsCount}</strong>
                  </div>
                </div>

                <Link
                  href={`/portal/${school.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition-colors"
                >
                  <span>Fungua Tovuti ya Shule</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Banner for New Registration */}
          <div className="mt-12 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-black">Je, unataka kusajili shule au chuo chako?</h3>
              <p className="text-blue-100 text-sm max-w-xl">
                Usajili huchukua dakika 3 pekee. Utapokea portal rasmi ya shule yako papo hapo pamoja na
                akaunti za Utawala, Walimu, Mhasibu, Wazazi na Wanafunzi.
              </p>
            </div>
            <Link
              href="/register-institution"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-900 font-extrabold text-sm shadow-md hover:bg-blue-50 transition-all shrink-0"
            >
              <span>Sajili Shule Sasa (Bure Kuanza)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. MARKSHEET & REPORT CARD DEMO */}
      <section id="matokeo-ya-mitihani" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Usimamizi wa Alama & Kadi za Ripoti</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Tathmini ya Alama, Madaraja na Nafasi Darasani
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Mfumo huhesabu alama, pointi, madaraja (A, B, C, D, F au GPA) na kutoa nafasi ya kila mwanafunzi
              darasani mara moja bila hesabu ndefu za kikokotoo.
            </p>
          </div>

          {/* Marksheet Container - White Paper Style */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            {/* School Marksheet Header */}
            <div className="bg-slate-100/90 border-b border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
                  KILIMANJARO SECONDARY SCHOOL
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Ripoti ya Matokeo ya Mitihani: Kidato cha Nne A
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Msimu wa Masomo: Muhula wa Pili • Masomo 7 Bora Yametumika Kuhesabu Pointi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                  ✓ Matokeo Yaliyoidhinishwa
                </span>
                <button
                  type="button"
                  onClick={() => alert('Ripoti ya PDF inatayarishwa kupakuliwa...')}
                  className="px-3 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs"
                >
                  Pakua PDF
                </button>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 text-center">Nafasi</th>
                    <th className="py-3.5 px-4">Namba ya Usajili</th>
                    <th className="py-3.5 px-4">Jina Kamili la Mwanafunzi</th>
                    <th className="py-3.5 px-3 text-center">KISW</th>
                    <th className="py-3.5 px-3 text-center">KIING</th>
                    <th className="py-3.5 px-3 text-center">HISAB</th>
                    <th className="py-3.5 px-3 text-center">FIZ</th>
                    <th className="py-3.5 px-3 text-center">KEM</th>
                    <th className="py-3.5 px-3 text-center">BIO</th>
                    <th className="py-3.5 px-3 text-center">HIST</th>
                    <th className="py-3.5 px-3 text-center font-black">POINTI</th>
                    <th className="py-3.5 px-4 text-center font-black">DARAJA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SAMPLE_MARKSHEET.map((row) => (
                    <tr key={row.indexNo} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 text-center font-black text-slate-900">
                        #{row.rank}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                        {row.indexNo}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {row.name}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold">{row.kisw.score}</span>{' '}
                        <span className="font-bold text-emerald-600">({row.kisw.grade})</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold">{row.eng.score}</span>{' '}
                        <span className="font-bold text-emerald-600">({row.eng.grade})</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold">{row.math.score}</span>{' '}
                        <span className="font-bold text-emerald-600">({row.math.grade})</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold">{row.phy.score}</span>{' '}
                        <span className="font-bold text-emerald-600">({row.phy.grade})</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold">{row.chem.score}</span>{' '}
                        <span className="font-bold text-emerald-600">({row.chem.grade})</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold">{row.bio.score}</span>{' '}
                        <span className="font-bold text-emerald-600">({row.bio.grade})</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold">{row.hist.score}</span>{' '}
                        <span className="font-bold text-emerald-600">({row.hist.grade})</span>
                      </td>
                      <td className="py-3 px-3 text-center font-black text-slate-900 bg-slate-50">
                        {row.points}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {row.division}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Summary Bar */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span><strong>Wastani wa Darasa:</strong> 79.4% (B+)</span>
                <span><strong>Division I:</strong> 3 Wanafunzi</span>
                <span><strong>Division II:</strong> 1 Mwanafunzi</span>
              </div>
              <div className="text-slate-500">
                Ripoti hutumwa moja kwa moja kwa wazazi kupitia SMS na kupakuliwa kwenye portal.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NGAZI ZA TAASISI (INTERACTIVE TIER SWITCHER) */}
      <section id="ngazi-za-elimu" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Inafaa Taasisi Yoyote</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Inabadilika Kulingana na Aina ya Shule Yako
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Iwe ni shule ya sekondari, chuo kikuu, shule ya msingi, au chuo cha ufundi, mfumo unajirekebisha kiotomatiki kulingana na muundo wako wa masomo.
            </p>
          </div>

          {/* Tier Switcher Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {INSTITUTION_TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setActiveTier(tier.id)}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  activeTier === tier.id
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-700/25 scale-102'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{tier.name}</span>
              </button>
            ))}
          </div>

          {/* Selected Tier Detail Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  {currentTierData.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {currentTierData.name}
                </h3>
              </div>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                {currentTierData.badge}
              </span>
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-8">
              {currentTierData.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Mfumo wa Madaraja (Grading Scale)
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {currentTierData.gradingSystem}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Faida Kuu kwa Taasisi
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {currentTierData.keyHighlight}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Akaunti Zinazopatikana (Roles):
              </span>
              <div className="flex flex-wrap gap-2">
                {currentTierData.rolesAvailable.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL-WORLD STUDENT & PARENT IMPACT */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <Image
                  src="/images/students-campus.jpg"
                  alt="Wanafunzi wakisoma na kutumia kompyuta maktabani"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                />
                <div className="p-4 bg-white border-t border-slate-100">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                    Uzoefu wa Wanafunzi na Wazazi
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Wanafunzi na wazazi wanapata ripoti za mitihani, madaraja, na mahudhurio papo hapo kupitia simu zao.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Mawasiliano na Wazazi</span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Taarifa za Maendeleo ya Mtoto Moja kwa Moja kwa Mzazi
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Wazazi hawahitaji kusubiri mwisho wa mwaka kupata ripoti ya mtoto.
                Kila mtihani ukisahihishwa, mzazi anapokea ujumbe wa SMS au anaweza kuingia kwenye portal ya shule kuona maendeleo ya mwanaye.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Ujumbe wa SMS & WhatsApp</h4>
                    <p className="text-xs text-slate-600">Tuma matokeo ya mitihani na matangazo ya shule moja kwa moja kwenye simu za wazazi.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Usimamizi wa Malipo ya Ada</h4>
                    <p className="text-xs text-slate-600">Utoaji wa risiti za kielektroniki, kumbukumbu za madeni ya ada na ripoti za benki.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Mahudhurio ya Kila Siku</h4>
                    <p className="text-xs text-slate-600">Rekodi mahudhurio ya wanafunzi darasani na tambua wanafunzi waliokosa vipindi.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GHARAMA KWA SHILINGI YA TANZANIA (TZS PRICING) */}
      <section id="huduma-na-ada" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Gharama za Kifurushi (TZS)</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Gharama Nafuu Zenye Uwazi Kamili
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Hakuna ada za siri wala gharama za kigeni. Chagua kifurushi kinachofaa ukubwa wa shule yako.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Primary School Plan */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Shule za Msingi & Awali
                </span>
                <h3 className="text-xl font-black text-slate-900 mb-3">Msingi Starter</h3>
                <div className="mb-4">
                  <span className="text-3xl font-black text-slate-900">TZS 150,000</span>
                  <span className="text-xs text-slate-500 block mt-0.5">kwa Muhula</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">✓ Tovuti Binafsi ya Shule (Portal)</li>
                  <li className="flex items-center gap-2">✓ Ripoti za Maendeleo ya Masomo</li>
                  <li className="flex items-center gap-2">✓ SMS za Matokeo kwa Wazazi</li>
                  <li className="flex items-center gap-2">✓ Mfumo wa Mahudhurio</li>
                </ul>
              </div>
              <Link
                href="/register-institution"
                className="w-full py-3 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-xs text-center transition-colors shadow-xs"
              >
                Chagua Kifurushi Hiki
              </Link>
            </div>

            {/* Secondary School Plan (Featured) */}
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-8 flex flex-col justify-between shadow-xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-700 text-white text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-md">
                Inayopendekezwa Zaidi
              </div>
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  Sekondari (Kidato 1 - 6)
                </span>
                <h3 className="text-xl font-black text-slate-900 mb-3">Sekondari Pro</h3>
                <div className="mb-4">
                  <span className="text-3xl font-black text-slate-900">TZS 280,000</span>
                  <span className="text-xs text-slate-500 block mt-0.5">kwa Muhula (Wanafunzi hadi 1,200)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2 font-bold text-slate-800">✓ Kila Kitu Kwenye Kifurushi cha Msingi</li>
                  <li className="flex items-center gap-2">✓ Uhesabuji wa Pointi na Madaraja kiotomatiki</li>
                  <li className="flex items-center gap-2">✓ Marksheets za Mitihani ya Muhula</li>
                  <li className="flex items-center gap-2">✓ Malipo ya Ada na Stakabadhi</li>
                  <li className="flex items-center gap-2">✓ Akaunti za Walimu na Utawala</li>
                </ul>
              </div>
              <Link
                href="/register-institution"
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs text-center transition-colors shadow-md shadow-blue-700/25"
              >
                Sajili Shule ya Sekondari
              </Link>
            </div>

            {/* College & University Plan */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Vyuo vya Kati & Vyuo Vikuu
                </span>
                <h3 className="text-xl font-black text-slate-900 mb-3">Chuo Enterprise</h3>
                <div className="mb-4">
                  <span className="text-3xl font-black text-slate-900">TZS 650,000</span>
                  <span className="text-xs text-slate-500 block mt-0.5">kwa Semesta</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                  <li className="flex items-center gap-2">✓ Uhesabuji wa GPA za Semesta</li>
                  <li className="flex items-center gap-2">✓ Usajili wa Kozi na Moduli</li>
                  <li className="flex items-center gap-2">✓ Idara na Vitivo (Faculties)</li>
                  <li className="flex items-center gap-2">✓ Usimamizi wa Malipo na Ankara</li>
                </ul>
              </div>
              <Link
                href="/register-institution"
                className="w-full py-3 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-xs text-center transition-colors shadow-xs"
              >
                Wasiliana Nasi kwa Chuo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Col 1: System Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-lg font-black text-white">UNIVERSAL ED</span>
                  <p className="text-[11px] text-slate-400">Mfumo wa Kisasa wa Elimu</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Programu jumuishi ya kidijitali inayosaidia shule na vyuo kusimamia wanafunzi,
                mitihani, alama, kadi za ripoti, ada na mawasiliano na wazazi.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <p>📍 Dar es Salaam, Tanzania</p>
                <p>📞 Simu: +255 754 000 000 / +255 684 000 000</p>
                <p>✉️ Barua Pepe: info@universaled.co.tz</p>
              </div>
            </div>

            {/* Col 2: Huduma */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Huduma Zetu</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#tovuti-za-shule" className="hover:text-white transition-colors">Tovuti za Shule (Portals)</a></li>
                <li><a href="#matokeo-ya-mitihani" className="hover:text-white transition-colors">Kadi za Ripoti za Mitihani</a></li>
                <li><a href="#huduma-na-ada" className="hover:text-white transition-colors">Usimamizi wa Ada</a></li>
                <li><a href="#ngazi-za-elimu" className="hover:text-white transition-colors">Ufuatiliaji wa Mahudhurio</a></li>
                <li><Link href="/admissions/apply" className="hover:text-white transition-colors">Fomu za Udahili Mtandaoni</Link></li>
              </ul>
            </div>

            {/* Col 3: Tovuti za Shule */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Mifano ya Tovuti</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/portal/kss" className="hover:text-white transition-colors">Kilimanjaro Secondary School</Link></li>
                <li><Link href="/portal/lvit" className="hover:text-white transition-colors">Lake Victoria Inst. of Tech</Link></li>
                <li><Link href="/portal/saia" className="hover:text-white transition-colors">St. Augustine Academy</Link></li>
                <li><Link href="/register-institution" className="hover:text-emerald-400 transition-colors font-semibold">+ Sajili Shule Yako Sasa</Link></li>
              </ul>
            </div>

            {/* Col 4: Mikoa Inayohudumiwa */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Mikoa Tunayohudumia</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tunahudumia shule za serikali na binafsi katika mikoa yote ya Tanzania Bara na Zanzibar ikiwemo Dar es Salaam, Arusha, Mwanza, Dodoma, Kilimanjaro, Mbeya, Morogoro, Tanga na mingineyo.
              </p>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} Universal Ed Tanzania. Haki zote zimehifadhiwa.
            </p>
            <div className="flex items-center gap-4">
              <span>Programu ya Kidijitali ya Elimu</span>
              <span>•</span>
              <span>Inayotumika Tanzania</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
