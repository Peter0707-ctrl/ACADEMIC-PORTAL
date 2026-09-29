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
  Smartphone,
  CreditCard,
  FileText,
  Laptop,
  BellRing,
  Layers,
  Zap,
} from 'lucide-react';

// Maandishi Yanayojiandika Yenyewe (Typewriter)
const TYPEWRITER_PHRASES = [
  'Shule za Sekondari',
  'Shule za Msingi na Awali',
  'Vyuo vya Kati na Ufundi',
  'Vyuo Vikuu na Vyuo Vishiriki',
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
    <span className="text-blue-700 font-extrabold inline-block min-w-[260px] sm:min-w-[420px] text-left">
      {currentText}
      <span className="text-blue-500 font-light animate-pulse ml-1">|</span>
    </span>
  );
}

// Vipengele Muhimu vya Mfumo
const PLATFORM_FEATURES = [
  {
    icon: Users,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Usajili & Taarifa za Wanafunzi (Student SIS)',
    desc: 'Hifadhi kumbukumbu kamili za wanafunzi, wasifu wao, madarasa, namba za usajili, na taarifa za mawasiliano ya wazazi katika mfumo mmoja salama wa wingu.',
  },
  {
    icon: FileSpreadsheet,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Alama za Mitihani & Kadi za Ripoti (Report Cards)',
    desc: 'Walimu huingiza alama mtandaoni au kwa kupakia faili la Excel. Mfumo huhesabu wastani, madaraja (A, B, C, D, F) na kuzalisha kadi za ripoti za PDF kiotomatiki.',
  },
  {
    icon: CreditCard,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Usimamizi wa Ada & Risiti za Malipo (Fees & Billing)',
    desc: 'Fuatilia makusanyo ya ada, toa stakabadhi za kielektroniki, fuatilia madeni ya ada ya kila mwanafunzi na pata ripoti za kifedha kwa kila muhula au mwaka.',
  },
  {
    icon: Smartphone,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Mawasiliano na Wazazi kwa SMS & Portal',
    desc: 'Tuma matokeo ya mitihani, risiti za malipo, na matangazo ya shule moja kwa moja kwa wazazi kupitia ujumbe mfupi wa SMS au portal yao ya mtandaoni.',
  },
  {
    icon: Calendar,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    title: 'Ufuatiliaji wa Mahudhurio ya Kila Siku',
    desc: 'Rekodi mahudhurio ya wanafunzi na walimu kwa darasa kila siku, tambua utoro mapema na toa takwimu sahihi za mahudhurio ya shule nzima.',
  },
  {
    icon: Globe2,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    title: 'Tovuti Binafsi ya Kila Shule (Dedicated Portal)',
    desc: 'Kila shule ikisajiliwa inapata anwani na ukurasa wake rasmi mtandaoni wenye nembo yake, matangazo, fomu za kujiunga na viingilio vya walimu na wanafunzi.',
  },
];

// Hatua 3 za Kuanza Kutumia
const ONBOARDING_STEPS = [
  {
    step: '01',
    title: 'Sajili Shule Yako',
    desc: 'Jaza jina la shule, ngazi ya masomo (Msingi, Sekondari, Chuo), eneo ilipo na mawasiliano ya utawala. Inachukua dakika 3 pekee.',
  },
  {
    step: '02',
    title: 'Weka Madarasa na Wanafunzi',
    desc: 'Sajili mikondo ya madarasa, walimu wa masomo na pakia majina ya wanafunzi kwa urahisi kupitia faili la Excel au moja kwa moja.',
  },
  {
    step: '03',
    title: 'Anza Kutoa Ripoti na Kusimamia',
    desc: 'Walimu wanaingiza alama, mfumo unatoa ripoti, unafuatilia ada na wazazi wanapokea matokeo kwenye simu zao popote walipo.',
  },
];

// Ngazi za Taasisi Zinazohudumiwa
const SUPPORTED_LEVELS = [
  {
    title: 'Shule za Awali & Msingi (Primary)',
    desc: 'Kadi za ripoti zenye picha ya mtoto, tathmini ya tabia na mwenendo, mahudhurio ya kila siku na ujumbe wa matokeo kwa wazazi.',
    badge: 'Nursery & Primary',
  },
  {
    title: 'Shule za Sekondari (O-Level & A-Level)',
    desc: 'Uwekaji wa alama za majaribio na mitihani ya muhula, uhesabuji wa pointi, madaraja na nafasi darasani, na usimamizi wa ada.',
    badge: 'Form 1 hadi Form 6',
  },
  {
    title: 'Vyuo vya Kati & Ufundi (Colleges)',
    desc: 'Mfumo wa semesta, ufuatiliaji wa mafunzo kwa vitendo (practical workshops), tathmini ya stadi na utoaji wa vyeti vya masomo.',
    badge: 'Diploma & Certificates',
  },
  {
    title: 'Vyuo Vikuu (Higher Learning)',
    desc: 'Usajili wa kozi (course registration), uhesabuji wa GPA za semesta na jumla (cumulative GPA), vitivo na idara za masomo.',
    badge: 'Universities',
  },
];

export default function LandingPage() {
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
            <a href="#vipengele" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Vipengele vya Mfumo
            </a>
            <a href="#jinsi-inavyofanya-kazi" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              Jinsi Inavyofanya Kazi
            </a>
            <a href="#aina-za-shule" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <School className="w-4 h-4 text-purple-600" />
              Aina za Taasisi
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

      {/* 2. HERO SECTION */}
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
                <span>Programu Kamili ya Kidijitali ya Shule na Vyuo</span>
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
                <Link
                  href="/register-institution"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md shadow-blue-700/25 transition-all text-sm"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Sajili Shule Yako Sasa</span>
                  <ArrowRight className="w-4 h-4" />
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
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Kadi za Ripoti za Papo Hapo
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  SMS & WhatsApp kwa Wazazi
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  Tovuti Binafsi ya Kila Shule
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  Usimamizi wa Ada na Risiti
                </span>
              </div>
            </div>

            {/* Right Column: AI Campus Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
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

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-700/90 backdrop-blur-md text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Mfumo wa Kidijitali</span>
                  </div>
                  <h3 className="text-lg font-bold drop-shadow-md">
                    Usimamizi Bora wa Shule Mtandaoni
                  </h3>
                  <p className="text-xs text-slate-200 drop-shadow-sm">
                    Inayotumiwa na shule na vyuo vya kisasa kuendesha shughuli za kila siku
                  </p>
                </div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-extrabold text-slate-800">
                    Mfumo Upo Hewani 24/7
                  </span>
                </div>
              </div>

              {/* Quick Stat Highlights */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xl font-black text-blue-700">Dakika 3</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Usajili Rahisi</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xl font-black text-emerald-600">Salama</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Kuhifadhi Data</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xl font-black text-purple-700">100%</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Wingu (Cloud)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM CORE MODULES / FEATURES */}
      <section id="vipengele" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Vipengele vya Mfumo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Kila Kitu Unachohitaji Kusimamia Shule Yako
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Mfumo mmoja kamili unaounganisha uongozi wa shule, walimu, wanafunzi na wazazi katika mazingira rahisi na ya kisasa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PLATFORM_FEATURES.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl border border-slate-200/90 p-7 shadow-xs hover:shadow-md hover:border-blue-300 hover:bg-white transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform ${item.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (HATUA 3 ZA KUANZA) */}
      <section id="jinsi-inavyofanya-kazi" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Rahisi Kutumia</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Anza Kutumia kwa Hatua 3 Rahisi
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Huna haja ya vifaa vya gharama au seva ofisini. Unachohitaji ni simu au kompyuta iliyounganishwa na mtandao.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ONBOARDING_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between relative group hover:border-blue-400 transition-all"
              >
                <div>
                  <span className="text-4xl font-black text-blue-100 group-hover:text-blue-200 transition-colors block mb-4">
                    {step.step}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/register-institution"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-700/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Sajili Shule Yako Sasa (Bure Kuanza)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. AINA ZA TAASISI (INSTITUTIONS SUPPORTED) */}
      <section id="aina-za-shule" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
              <School className="w-3.5 h-3.5" />
              <span>Inafaa Shule Zote</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Inajirekebisha Kulingana na Ngazi ya Taasisi Yako
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Mfumo una miundo tofauti inayokidhi mahitaji ya shule za awali, msingi, sekondari, vyuo vya kati na vyuo vikuu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {SUPPORTED_LEVELS.map((level, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-md hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold inline-block mb-4">
                    {level.badge}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    {level.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {level.desc}
                  </p>
                </div>

                <Link
                  href="/register-institution"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
                >
                  <span>Anza Usajili wa Ngazi Hii</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-black">
                Je, uko tayari kurahisisha uendeshaji wa shule yako?
              </h3>
              <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
                Jiunge na shule na vyuo vingine vinavyotumia Universal Ed kupunguza gharama za karatasi, kuondoa makosa ya kikokotoo, na kuwapa wazazi huduma bora ya kielektroniki.
              </p>
            </div>
            <Link
              href="/register-institution"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-900 font-extrabold text-sm shadow-md hover:bg-blue-50 transition-all shrink-0 hover:scale-105"
            >
              <span>Sajili Shule Yako Bure Leo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12">
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
                mitihani, alama, kadi za ripoti, ada na mawasiliano ya wazazi.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <p>📍 Dar es Salaam, Tanzania</p>
                <p>📞 Simu: +255 754 000 000 / +255 684 000 000</p>
                <p>✉️ Barua Pepe: info@universaled.co.tz</p>
              </div>
            </div>

            {/* Col 2: Huduma */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Vipengele</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#vipengele" className="hover:text-white transition-colors">Usajili wa Wanafunzi</a></li>
                <li><a href="#vipengele" className="hover:text-white transition-colors">Kadi za Ripoti za Mitihani</a></li>
                <li><a href="#vipengele" className="hover:text-white transition-colors">Usimamizi wa Ada</a></li>
                <li><a href="#vipengele" className="hover:text-white transition-colors">Ufuatiliaji wa Mahudhurio</a></li>
                <li><a href="#vipengele" className="hover:text-white transition-colors">Mawasiliano na Wazazi</a></li>
              </ul>
            </div>

            {/* Col 3: Taasisi */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Aina za Taasisi</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#aina-za-shule" className="hover:text-white transition-colors">Shule za Msingi & Awali</a></li>
                <li><a href="#aina-za-shule" className="hover:text-white transition-colors">Shule za Sekondari</a></li>
                <li><a href="#aina-za-shule" className="hover:text-white transition-colors">Vyuo vya Kati & Ufundi</a></li>
                <li><a href="#aina-za-shule" className="hover:text-white transition-colors">Vyuo Vikuu</a></li>
                <li><Link href="/register-institution" className="text-blue-400 hover:text-blue-300 font-semibold">+ Sajili Taasisi Yako</Link></li>
              </ul>
            </div>

            {/* Col 4: Huduma za Haraka */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Viingilio</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Ingia Kwenye Akaunti</Link></li>
                <li><Link href="/register-institution" className="hover:text-white transition-colors">Sajili Shule Mpya</Link></li>
                <li><Link href="/admissions/apply" className="hover:text-white transition-colors">Fomu ya Udahili Mtandaoni</Link></li>
              </ul>
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
