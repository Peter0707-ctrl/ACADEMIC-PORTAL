'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  GraduationCap,
  School,
  Building2,
  BookOpen,
  Users,
  ShieldCheck,
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  FileText,
  Clock,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

interface SchoolProfile {
  code: string;
  name: string;
  motto: string;
  regNumber: string;
  type: string;
  location: string;
  phone: string;
  email: string;
  established: string;
  principal: string;
  academicSystem: 'Mihula (Terms)' | 'Semesters';
  gradingSummary: string;
  studentCount: number;
  programs: { title: string; desc: string; badge: string }[];
  announcements: { date: string; title: string; category: string }[];
}

const REGISTERED_SCHOOLS: Record<string, SchoolProfile> = {
  kss: {
    code: 'KSS',
    name: 'Kilimanjaro Secondary School',
    motto: 'Elimu Ni Nuru na Uongozi • Strive for Excellence',
    regNumber: 'Namba ya Usajili: S.1429 (Wizara ya Elimu)',
    type: 'Shule ya Sekondari ya Bweni na Kutwa (Kidato cha 1–4)',
    location: 'Moshi Mjini, Mkoa wa Kilimanjaro, Tanzania',
    phone: '+255 27 275 4321',
    email: 'info@kilimanjarosec.sc.tz',
    established: '1984',
    principal: 'Dr. Baraka Mwamba, M.Ed.',
    academicSystem: 'Mihula (Terms)',
    gradingSummary: 'Viwango vya NECTA (Nafasi Darasani & Division I-IV)',
    studentCount: 1420,
    programs: [
      {
        title: 'Kidato cha 1 hadi cha 4 (O-Level)',
        desc: 'Mtaala kamili wa Taifa wa masomo ya Sayansi, Biashara, na Sanaa wenye maabara za kisasa za fizikia na kemia.',
        badge: 'Mihula 2',
      },
      {
        title: 'Kambi ya Sayansi na TEHAMA',
        desc: 'Mafunzo maalum ya kompyuta, maabara ya lugha, na majaribio ya kisayansi kujiandaa na mitihani ya NECTA.',
        badge: 'Sayansi & TEHAMA',
      },
      {
        title: 'Vilabu vya Michezo na Taaluma',
        desc: 'Umoja wa wajenzi wa taifa, mijadala ya Kiingereza na Kiswahili, mpira wa miguu, na uhifadhi wa mazingira.',
        badge: 'Ukuaji Kamili',
      },
    ],
    announcements: [
      {
        date: '28 Sep 2026',
        title: 'Matokeo Rasmi ya Mitihani ya Muhula wa Pili Yametangazwa',
        category: 'Mitihani',
      },
      {
        date: '15 Sep 2026',
        title: 'Fomu za Kujiunga na Kidato cha Kwanza 2026/2027 Zipo Wazi Mtandaoni',
        category: 'Udahili',
      },
      {
        date: '02 Sep 2026',
        title: 'Mkutano Mkuu wa Wazazi na Walimu (PTA) Tarehe 10 Oktoba',
        category: 'Tangazo Rasmi',
      },
    ],
  },
  lvit: {
    code: 'LVIT',
    name: 'Lake Victoria Institute of Technology',
    motto: 'Ubunifu, Teknolojia na Uadilifu wa Kitaaluma',
    regNumber: 'Namba ya Usajili: REG/NACTVET/0894',
    type: 'Chuo cha Kati cha Ufundi na Elimu ya Juu',
    location: 'Capripoint, Jiji la Mwanza, Tanzania',
    phone: '+255 28 250 8899',
    email: 'admissions@lvit.ac.tz',
    established: '2004',
    principal: 'Prof. Maryam Juma, Ph.D.',
    academicSystem: 'Semesters',
    gradingSummary: 'Mikopo ya Masomo (Credits) na GPA ya 5.0 (TCU & NACTVET)',
    studentCount: 3850,
    programs: [
      {
        title: 'Kitivo cha Sayansi ya Kompyuta na TEHAMA',
        desc: 'Stashahada na Shahada za Uhandisi wa Programu (Software Engineering), Mtandao na Usalama wa Kimtandao.',
        badge: 'Credits za Semesta',
      },
      {
        title: 'Idara ya Uhasibu na Biashara',
        desc: 'Astashahada na Stashahada zinazotambulika na Bodi ya Wahasibu (NBAA).',
        badge: 'NBAA Accredited',
      },
      {
        title: 'Uhandisi wa Mazingira na Maji',
        desc: 'Mafunzo ya vitendo ya rasilimali za maji ya Ziwa Victoria na teknolojia ya mazingira.',
        badge: 'Mafunzo ya Vitendo',
      },
    ],
    announcements: [
      {
        date: '25 Sep 2026',
        title: 'Mwisho wa Kufanya Usajili wa Mitihani ya Semesta ya Pili na Kukamilisha Ada',
        category: 'Bursar & Mitihani',
      },
      {
        date: '10 Sep 2026',
        title: 'Ratiba ya Mitihani ya Marudio (Supplementary Exams) Imetoka',
        category: 'Seneti ya Chuo',
      },
      {
        date: '01 Sep 2026',
        title: 'Nafasi za Masomo Muhula wa Septemba/Oktoba 2026 Zinaendelea Kupokelewa',
        category: 'Udahili',
      },
    ],
  },
  saia: {
    code: 'SAIA',
    name: 'St. Augustine International Academy',
    motto: 'Uongozi kupitia Maarifa na Maadili Mema',
    regNumber: 'Namba ya Usajili: S.4891',
    type: 'Shule ya Msingi na Sekondari (Arusha)',
    location: 'Njiro, Jiji la Arusha, Tanzania',
    phone: '+255 27 254 9900',
    email: 'info@staugustine.ac.tz',
    established: '2012',
    principal: 'Mr. Josephat Ngalawa, B.Ed.',
    academicSystem: 'Mihula (Terms)',
    gradingSummary: 'Tathmini Endelevu (CA) & Madaraja ya NECTA',
    studentCount: 980,
    programs: [
      {
        title: 'Shule ya Msingi (Standard 1–7)',
        desc: 'Misingi imara ya Kiingereza, Hisabati, Sayansi, na masomo ya kompyuta kwa vitendo.',
        badge: 'Madarasa ya Msingi',
      },
      {
        title: 'Shule ya Sekondari (Form 1–4)',
        desc: 'Maandalizi thabiti ya mitihani ya Kidato cha 4 yenye matokeo ya Division One ya juu.',
        badge: 'Sekondari O-Level',
      },
    ],
    announcements: [
      {
        date: '20 Sep 2026',
        title: 'Ripoti za Maendeleo ya Masomo Zimetumwa kwenye Akaunti za Wazazi',
        category: 'Taaluma',
      },
      {
        date: '05 Sep 2026',
        title: 'Mashindano ya Michezo na Maonesho ya Sayansi ya Shule za Arusha',
        category: 'Michezo & Sanaa',
      },
    ],
  },
};

export default function SchoolBrandedPortalPage() {
  const params = useParams();
  const slug = (typeof params?.slug === 'string' ? params.slug.toLowerCase() : 'kss');

  const school: SchoolProfile = REGISTERED_SCHOOLS[slug] || {
    code: slug.toUpperCase(),
    name: `Shule ya ${slug.toUpperCase()}`,
    motto: 'Elimu Ni Ufunguo wa Maisha',
    regNumber: `S.${slug.toUpperCase()}/2026`,
    type: 'Taasisi ya Elimu Iliyosajiliwa Tanzania',
    location: 'Mkoa, Tanzania',
    phone: '+255 700 000 000',
    email: `info@${slug.toLowerCase()}.sc.tz`,
    established: '2026',
    principal: 'Mkuu wa Shule',
    academicSystem: 'Mihula (Terms)',
    gradingSummary: 'Viwango Rasmi vya NECTA Tanzania',
    studentCount: 500,
    programs: [
      {
        title: 'Mtaala Rasmi wa Masomo',
        desc: 'Masomo yote kulingana na muongozo wa Wizara ya Elimu Tanzania.',
        badge: 'Mtaala wa Taifa',
      },
    ],
    announcements: [
      {
        date: 'Leo',
        title: 'Tovuti Rasmi ya Shule Imewashwa Mtandaoni',
        category: 'Taarifa',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. TOP OFFICIAL BAR */}
      <div>
        <div className="bg-[#060a12] border-b border-slate-800 text-[11px] text-slate-400 py-2 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-emerald-400 font-bold">{school.regNumber}</span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                {school.location}
              </span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" />
                {school.phone}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="italic text-slate-300">"{school.motto}"</span>
              <Link
                href="/"
                className="text-[10px] text-blue-400 hover:text-blue-300 font-mono transition-colors border-l border-slate-800 pl-3"
              >
                Universal Ed Tanzania ↗
              </Link>
            </div>
          </div>
        </div>

        {/* 2. SCHOOL HEADER */}
        <header className="glass-nav sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* School Crest & Identity */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-cyan-600 border border-white/10 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                <div className="w-8 h-8 rounded-full border border-amber-300/40 bg-slate-900/60 flex items-center justify-center">
                  <School className="w-5 h-5 text-amber-300" />
                </div>
              </div>
              <div>
                <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-tight">
                  {school.name}
                </h1>
                <div className="text-[11px] text-blue-400 font-medium">{school.type}</div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <a href="#about" className="hover:text-white transition-colors">
                Kuhusu Shule
              </a>
              <a href="#programs" className="hover:text-white transition-colors">
                Masomo & Michepuo
              </a>
              <a href="#announcements" className="hover:text-white transition-colors">
                Matangazo
              </a>
              <Link
                href="/admissions/apply"
                className="hover:text-emerald-400 transition-colors text-emerald-300 font-bold"
              >
                Udahili Mtandaoni
              </Link>
            </nav>

            {/* Direct Login Actions for this School */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Ingia Portal ya Shule</span>
              </Link>
            </div>
          </div>
        </header>

        {/* 3. SCHOOL HERO SHOWCASE */}
        <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800 min-h-[500px] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-campus-bg.jpg"
              alt={`${school.name} Kampasi`}
              fill
              className="object-cover object-center scale-105 filter brightness-95 contrast-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/75 via-[#070b14]/50 to-[#070b14]/90" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: School Headline & Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Tovuti Rasmi ya Shule • Ilianzishwa Mwaka {school.established}</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                  Karibu <br />
                  <span className="text-gradient-blue">{school.name}</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  {school.motto}. Taasisi inayojenga maadili, ufaulu wa juu wa mitihani ya Taifa, na uongozi kwa wanafunzi wetu {school.studentCount.toLocaleString()} waliosajiliwa.
                </p>

                {/* Direct Action Hub */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/admissions/apply"
                    className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <span>Omba Kujiunga 2026/2027</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/student"
                    className="px-5 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span>Report Card za Wanafunzi</span>
                  </Link>

                  <Link
                    href="/parent"
                    className="px-5 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Portal ya Wazazi</span>
                  </Link>
                </div>

                {/* Quick Info Badges */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Mfumo wa {school.academicSystem}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Usajili Rasmi Tanzania</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Kuzuia Report kwa Wenye Deni la Ada</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Portal Access Hub Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-[#0e1424]/90 shadow-2xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-blue-400 mb-4 flex items-center justify-between">
                    <span>Viingilio Rasmi vya Shule Hii</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-normal">Mfumo Upo Hewani</span>
                  </h3>

                  <div className="space-y-3">
                    <Link
                      href="/student"
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                            Portal ya Mwanafunzi (Student 360°)
                          </div>
                          <div className="text-[10px] text-slate-400">Angalia alama, nafasi darasani & pakua report card</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </Link>

                    <Link
                      href="/parent"
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                            Portal ya Mzazi / Mlezi
                          </div>
                          <div className="text-[10px] text-slate-400">Fuatilia maendeleo ya mtoto & stakabadhi za ada</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </Link>

                    <Link
                      href="/teacher"
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                            Portal ya Walimu (Teacher Portal)
                          </div>
                          <div className="text-[10px] text-slate-400">Weka alama za mitihani na pakia Excel ya darasa</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </Link>

                    <Link
                      href="/admin"
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                            Mkuu wa Shule & Utawala
                          </div>
                          <div className="text-[10px] text-slate-400">Thibitisha matokeo ya muhula & tangaza rasmi</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ACADEMIC PROGRAMS */}
        <section id="programs" className="py-16 border-b border-slate-800 bg-[#0b101d]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Mitaala ya Masomo
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight">
                Ngazi za Masomo Zinazofundishwa {school.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {school.programs.map((prog, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[10px] font-mono font-bold mb-3 inline-block">
                      {prog.badge}
                    </span>
                    <h3 className="text-base font-bold text-white mb-2">{prog.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{prog.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <Link
                      href="/admissions/apply"
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <span>Omba Nafasi ya Masomo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ANNOUNCEMENTS */}
        <section id="announcements" className="py-16 border-b border-slate-800 bg-[#090d16]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Ubao wa Matangazo Rasmi
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                  Matangazo ya Hivi Karibuni
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {school.announcements.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 shrink-0">
                      {item.date}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] text-blue-400 font-mono">{item.category}</span>
                    </div>
                  </div>

                  <Link
                    href="/login"
                    className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1 shrink-0"
                  >
                    <span>Soma Zaidi</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. PRINCIPAL'S WELCOME */}
        <section id="about" className="py-16 bg-[#0b101d]/60">
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 bg-[#0e1424]/80 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl shadow-xl shrink-0">
                  {school.principal.charAt(0)}
                </div>
                <div className="space-y-3 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-300 text-xs font-semibold">
                    <span>Neno Kutoka kwa Mkuu wa Shule</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    "Kujenga Taaluma na Maadili Mema ya Kitanzania"
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Hapa {school.name}, tunazingatia malezi bora, nidhamu, na ufaulu wa kiwango cha juu katika mitihani ya NECTA. Kupitia mfumo wetu huu wa kidijitali, mzazi anaweza kuona maendeleo ya mwanaye popote alipo bila kulazimika kusubiri mwisho wa mwaka.
                  </p>
                  <div className="pt-2">
                    <div className="font-bold text-white text-sm">{school.principal}</div>
                    <div className="text-xs text-blue-400">Mkuu wa Shule • {school.name}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 7. DEDICATED INSTITUTION FOOTER */}
      <footer className="border-t border-slate-800 bg-[#060a12] text-slate-400 text-xs py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">
                  <School className="w-4 h-4" />
                </div>
                <span className="font-bold text-white text-sm tracking-tight">{school.name}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Tovuti rasmi ya {school.name}. Mfumo uliounganishwa moja kwa moja na viwango vya mitihani ya NECTA Tanzania.
              </p>
              <div className="text-[11px] font-mono text-emerald-400">
                {school.regNumber}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Viingilio vya Haraka</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><Link href="/student" className="hover:text-white transition-colors">Report Card za Wanafunzi</Link></li>
                <li><Link href="/parent" className="hover:text-white transition-colors">Akaunti ya Wazazi</Link></li>
                <li><Link href="/teacher" className="hover:text-white transition-colors">Akaunti ya Walimu</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Utawala wa Shule</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Mawasiliano ya Shule</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>{school.location}</li>
                <li>Simu: {school.phone}</li>
                <li>Barua Pepe: {school.email}</li>
                <li>Mwaka wa Masomo: 2026/2027</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 {school.name}. Haki zote zimehifadhiwa.
            </div>
            <div>
              Inaendeshwa na <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold">Universal Education Management Platform (Tanzania)</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
