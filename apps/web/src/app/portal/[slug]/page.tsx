'use client';

import React, { useState } from 'react';
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
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Award,
  ArrowRight,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Download,
} from 'lucide-react';

interface SchoolData {
  slug: string;
  name: string;
  motto: string;
  established: string;
  type: string;
  academicSystem: string;
  regNumber: string;
  location: string;
  phone: string;
  email: string;
  principal: string;
  studentCount: number;
  programs: { title: string; desc: string; badge: string }[];
  announcements: { date: string; title: string; category: string }[];
}

const SCHOOLS_REGISTRY: Record<string, SchoolData> = {
  kss: {
    slug: 'kss',
    name: 'Kilimanjaro Secondary School',
    motto: 'Elimu ni Mwanga na Msingi wa Maisha Bora',
    established: '1984',
    type: 'Shule ya Sekondari ya Kutwa na Bweni (Kidato cha 1 - 4)',
    academicSystem: 'Mihula (Terms) • Mfumo wa NECTA',
    regNumber: 'NECTA Reg: S.0108',
    location: 'Moshi Mjini, Mkoa wa Kilimanjaro',
    phone: '+255 27 275 4321',
    email: 'info@kilimanjarosec.sc.tz',
    principal: 'Mwl. Daudi Makongoro',
    studentCount: 920,
    programs: [
      {
        title: 'Kidato cha Kwanza hadi cha Nne (O-Level)',
        desc: 'Mtaala kamili wa Taifa wa NECTA wenye masomo ya Sayansi (PCM, PCB), Sanaa na Biashara.',
        badge: 'NECTA CSEE',
      },
      {
        title: 'Maabara za Sayansi za Kisasa',
        desc: 'Maabara tatu zilizokaguliwa na kuthibitishwa za Fizikia, Kemia na Baiolojia kwa ajili ya vitendo (Practicals).',
        badge: 'Sayansi Vitendo',
      },
      {
        title: 'Mafunzo ya Tehama (ICT & Computer Lab)',
        desc: 'Wanafunzi wote wanafundishwa misingi ya kompyuta, usalama mtandaoni na matumizi ya teknolojia darasani.',
        badge: 'ICT Digital',
      },
    ],
    announcements: [
      {
        date: '24 Sept 2026',
        title: 'Matokeo ya Mitihani ya Mock ya Kidato cha Nne Yametangazwa kwenye Portal',
        category: 'Taaluma',
      },
      {
        date: '18 Sept 2026',
        title: 'Mkutano Mkuu wa Wazazi na Walimu (PTA) Kupitia Mtandao na Shuleni',
        category: 'Wazazi',
      },
      {
        date: '10 Sept 2026',
        title: 'Fomu za Kujiunga na Kidato cha Kwanza 2027 Zinaanza Kupatikana Mtandaoni',
        category: 'Udahili',
      },
    ],
  },
  lvit: {
    slug: 'lvit',
    name: 'Lake Victoria Institute of Technology',
    motto: 'Innovating Practical Engineering Skills',
    established: '2008',
    type: 'Chuo cha Kati cha Elimu ya Ufundi (NACTVET)',
    academicSystem: 'Semesta (Semesters) • NTA Level 4 - 6',
    regNumber: 'NACTVET Reg: REG/NACTVET/042',
    location: 'Ilemela, Mwanza',
    phone: '+255 28 250 1190',
    email: 'admissions@lvit.ac.tz',
    principal: 'Eng. Emmanuel Mwakasege',
    studentCount: 1480,
    programs: [
      {
        title: 'Stashahada ya Uhandisi wa Tehama na Mitandao (Diploma in IT)',
        desc: 'Mafunzo ya vitendo ya miaka mitatu yanayowiana na soko la ajira la viwanda na taasisi za umma.',
        badge: 'NTA Level 6',
      },
      {
        title: 'Uhandisi wa Umeme na Nishati Mbadala',
        desc: 'Kufunga na kukarabati mifumo ya umeme wa viwandani na umeme wa jua (Solar Power Systems).',
        badge: 'NACTVET Diploma',
      },
    ],
    announcements: [
      {
        date: '20 Sept 2026',
        title: 'Ratiba ya Mitihani ya Mwisho wa Semesta ya Pili (End of Semester II) Imetoka',
        category: 'Mitihani',
      },
    ],
  },
  saia: {
    slug: 'saia',
    name: 'St. Augustine International Academy',
    motto: 'Knowledge, Integrity and Discipline',
    established: '2014',
    type: 'Shule ya Msingi na Awali (English Medium)',
    academicSystem: 'Mihula (Terms) • Baraza la Mitihani la Taifa',
    regNumber: 'TAMISEMI Reg: EM-1042',
    location: 'Oysterbay, Dar es Salaam',
    phone: '+255 22 260 0987',
    email: 'info@staugustine.ac.tz',
    principal: 'Sr. Beatrice Mmari',
    studentCount: 650,
    programs: [
      {
        title: 'Elimu ya Awali (Nursery & Pre-School)',
        desc: 'Mazingira salama na rafiki ya kumjengea mtoto msingi imara wa lugha, hisabati na ubunifu.',
        badge: 'Early Childhood',
      },
      {
        title: 'Darasa la Kwanza hadi la Saba (Primary Standard 1-7)',
        desc: 'Mtaala wa Taifa kwa lugha ya Kiingereza, michezo, kompyuta na maadili ya Kitanzania.',
        badge: 'PSLE Excellence',
      },
    ],
    announcements: [
      {
        date: '15 Sept 2026',
        title: 'Kufungua Shule kwa Muhula wa Tatu na Ukaguzi wa Vifaa vya Wanafunzi',
        category: 'Utawala',
      },
    ],
  },
};

export default function SchoolPortalPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'kss';
  const school = SCHOOLS_REGISTRY[slug] || {
    slug,
    name: `${slug.toUpperCase()} Secondary School`,
    motto: 'Elimu ni Msingi wa Maendeleo',
    established: '2010',
    type: 'Shule ya Sekondari Tanzania',
    academicSystem: 'Mihula • NECTA Standard',
    regNumber: `NECTA Center S.${slug.toUpperCase()}`,
    location: 'Tanzania',
    phone: '+255 22 000 0000',
    email: `info@${slug}.sc.tz`,
    principal: 'Mkuu wa Shule',
    studentCount: 600,
    programs: [
      {
        title: 'Kidato cha 1 hadi 4 (O-Level)',
        desc: 'Mtaala rasmi wa Tanzania wenye masomo ya Sayansi na Sanaa.',
        badge: 'NECTA CSEE',
      },
    ],
    announcements: [
      {
        date: 'Leo',
        title: 'Mfumo wa Tovuti ya Shule Umewashwa Rasmi',
        category: 'Taarifa',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NATIONAL / REGULATORY BAR */}
      <div>
        <div className="bg-slate-900 border-b border-slate-800 text-[11px] text-slate-300 py-2 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-emerald-400 font-bold">{school.regNumber}</span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {school.location}
              </span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {school.phone}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="italic text-slate-300">"{school.motto}"</span>
              <Link
                href="/"
                className="text-[10px] text-blue-400 hover:text-blue-300 font-bold transition-colors border-l border-slate-800 pl-3"
              >
                ← Mfumo Mkuu Tanzania
              </Link>
            </div>
          </div>
        </div>

        {/* 2. SCHOOL HEADER */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            {/* School Crest & Identity */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-700/20">
                <School className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                  {school.name}
                </h1>
                <div className="text-xs text-blue-700 font-semibold">{school.type}</div>
              </div>
            </div>

            {/* School Quick Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
              <a href="#about" className="hover:text-blue-700 transition-colors">
                Kuhusu Shule
              </a>
              <a href="#programs" className="hover:text-blue-700 transition-colors">
                Masomo & Michepuo
              </a>
              <a href="#announcements" className="hover:text-blue-700 transition-colors">
                Matangazo
              </a>
              <Link
                href="/admissions/apply"
                className="hover:text-emerald-700 transition-colors text-emerald-600 font-extrabold"
              >
                Udahili Mtandaoni
              </Link>
            </nav>

            {/* Direct Login Actions for this School */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-700/20 transition-all flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Ingia Portal ya Shule</span>
              </Link>
            </div>
          </div>
        </header>

        {/* 3. SCHOOL HERO SHOWCASE */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: School Headline & Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 text-blue-900 text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Tovuti Rasmi ya Shule • Ilianzishwa Mwaka {school.established}</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  Karibu <br />
                  <span className="text-blue-700">{school.name}</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  {school.motto}. Taasisi inayojenga maadili, ufaulu wa juu wa mitihani ya Taifa, na uongozi kwa wanafunzi wetu {school.studentCount.toLocaleString()} waliosajiliwa.
                </p>

                {/* Direct Action Hub */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/admissions/apply"
                    className="px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-all shadow-md shadow-blue-700/25 flex items-center gap-2"
                  >
                    <span>Omba Kujiunga 2026/2027</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/student"
                    className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs transition-all shadow-xs flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span>Report Card za Wanafunzi</span>
                  </Link>

                  <Link
                    href="/parent"
                    className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs transition-all shadow-xs flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Portal ya Wazazi</span>
                  </Link>
                </div>

                {/* Quick Info Badges */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mfumo wa {school.academicSystem}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Usajili Rasmi Tanzania</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>Kuzuia Report kwa Wenye Deni la Ada</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Portal Access Hub Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span className="text-blue-700 font-black">Viingilio Rasmi vya Shule Hii</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Mfumo Upo Hewani</span>
                  </h3>

                  <div className="space-y-3">
                    <Link
                      href="/student"
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-400 hover:bg-purple-50/30 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                            Portal ya Mwanafunzi (Student 360°)
                          </div>
                          <div className="text-[10px] text-slate-500">Angalia alama, nafasi darasani & pakua report card</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition-colors" />
                    </Link>

                    <Link
                      href="/parent"
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                            Portal ya Mzazi / Mlezi
                          </div>
                          <div className="text-[10px] text-slate-500">Fuatilia maendeleo ya mtoto & stakabadhi za ada</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
                    </Link>

                    <Link
                      href="/teacher"
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            Portal ya Walimu (Teacher Portal)
                          </div>
                          <div className="text-[10px] text-slate-500">Weka alama za mitihani na pakia Excel ya darasa</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                    </Link>

                    <Link
                      href="/admin"
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            Mkuu wa Shule & Utawala
                          </div>
                          <div className="text-[10px] text-slate-500">Thibitisha matokeo ya muhula & tangaza rasmi</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-colors" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ACADEMIC PROGRAMS */}
        <section id="programs" className="py-16 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Mitaala ya Masomo
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
                Ngazi za Masomo Zinazofundishwa {school.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {school.programs.map((prog, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:border-blue-300 hover:bg-white transition-all shadow-xs"
                >
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold mb-3 inline-block">
                      {prog.badge}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{prog.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{prog.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <Link
                      href="/admissions/apply"
                      className="text-xs text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1"
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
        <section id="announcements" className="py-16 border-b border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Ubao wa Matangazo Rasmi
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                  Matangazo ya Hivi Karibuni
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {school.announcements.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-400 shadow-xs transition-all"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono font-bold text-slate-700 shrink-0">
                      {item.date}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <span className="text-[10px] text-blue-700 font-semibold">{item.category}</span>
                    </div>
                  </div>

                  <Link
                    href="/login"
                    className="text-xs text-slate-600 hover:text-blue-700 font-bold flex items-center gap-1 shrink-0"
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
        <section id="about" className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-blue-700 flex items-center justify-center font-bold text-white text-2xl shadow-md shrink-0">
                  {school.principal.charAt(0)}
                </div>
                <div className="space-y-3 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                    <span>Neno Kutoka kwa Mkuu wa Shule</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    "Kujenga Taaluma na Maadili Mema ya Kitanzania"
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Hapa {school.name}, tunazingatia malezi bora, nidhamu, na ufaulu wa kiwango cha juu katika mitihani ya NECTA. Kupitia mfumo wetu huu wa kidijitali, mzazi anaweza kuona maendeleo ya mwanaye popote alipo bila kulazimika kusubiri mwisho wa mwaka.
                  </p>
                  <div className="pt-2">
                    <div className="font-bold text-slate-900 text-sm">{school.principal}</div>
                    <div className="text-xs text-blue-700 font-semibold">Mkuu wa Shule • {school.name}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 7. DEDICATED INSTITUTION FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-900 text-slate-400 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
              <div className="text-[11px] font-mono text-emerald-400 font-semibold">
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
