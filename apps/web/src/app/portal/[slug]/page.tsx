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
  ExternalLink,
} from 'lucide-react';

// Registry of Registered School Tenants
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
  academicSystem: 'TERMS' | 'SEMESTERS';
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
    regNumber: 'REG NO: S.1429',
    type: 'Co-Educational Secondary School (Form 1–4)',
    location: 'Moshi Urban, Kilimanjaro, Tanzania',
    phone: '+255 27 275 4321',
    email: 'info@kilimanjarosec.sc.tz',
    established: '1984',
    principal: 'Dr. Baraka Mwamba, M.Ed.',
    academicSystem: 'TERMS',
    gradingSummary: 'NECTA National Examination Standards (Standard Competition Ranking)',
    studentCount: 1420,
    programs: [
      {
        title: 'Ordinary Level (Form 1 – 4)',
        desc: 'Comprehensive national secondary curriculum covering Sciences, Commercial, and Arts streams with modern laboratories.',
        badge: 'Term System',
      },
      {
        title: 'Science & ICT Specialization',
        desc: 'Advanced Physics, Chemistry, Biology, and Computer Studies with hands-on coding and science experiments.',
        badge: 'Practical Labs',
      },
      {
        title: 'Extracurricular & Sports Academy',
        desc: 'Debate society, athletics, football, Scouting, and environmental conservation clubs.',
        badge: 'Holistic Growth',
      },
    ],
    announcements: [
      {
        date: '28 Sep 2026',
        title: 'Term 1 Official Examination Results & Rankings Published',
        category: 'Examinations',
      },
      {
        date: '15 Sep 2026',
        title: 'Form 1 Online Application Window 2026/2027 Now Open',
        category: 'Admissions',
      },
      {
        date: '02 Sep 2026',
        title: 'Annual Parent-Teacher Association (PTA) Conference Schedule',
        category: 'Notice',
      },
    ],
  },
  lvit: {
    code: 'LVIT',
    name: 'Lake Victoria Institute of Technology',
    motto: 'Innovation, Research & Professional Integrity',
    regNumber: 'REG NO: REG/NACTVET/0894',
    type: 'Higher Learning Institute & College',
    location: 'Capripoint, Mwanza City, Tanzania',
    phone: '+255 28 250 8899',
    email: 'admissions@lvit.ac.tz',
    established: '2004',
    principal: 'Prof. Maryam Juma, Ph.D.',
    academicSystem: 'SEMESTERS',
    gradingSummary: 'Semester Credits & Cumulative GPA (5.0 Scale) with Bursar Clearance Gate',
    studentCount: 3850,
    programs: [
      {
        title: 'Faculty of Computing & Information Systems',
        desc: 'Diploma and Degree programs in Software Engineering, Network Infrastructure, and Cyber Security.',
        badge: 'Semester Credits',
      },
      {
        title: 'Faculty of Business & Accounting',
        desc: 'Professional accounting, procurement, logistics, and digital entrepreneurship qualifications.',
        badge: 'NBAA Accredited',
      },
      {
        title: 'Institute of Applied Sciences',
        desc: 'Laboratory technology, water resource engineering, and industrial biotechnology modules.',
        badge: 'Practical Research',
      },
    ],
    announcements: [
      {
        date: '25 Sep 2026',
        title: 'Semester II Examination Registration & Financial Clearance Deadline',
        category: 'Bursar & Exams',
      },
      {
        date: '10 Sep 2026',
        title: 'Degree & Diploma Supplementary Examination Timetable Released',
        category: 'Senate Notice',
      },
      {
        date: '01 Sep 2026',
        title: 'Call for Applications: September/October Academic Intake 2026',
        category: 'Admissions',
      },
    ],
  },
  saia: {
    code: 'SAIA',
    name: 'St. Augustine International Academy',
    motto: 'Fostering Global Leaders of Character & Intellect',
    regNumber: 'REG NO: INT/9821/TZ',
    type: 'Primary & Secondary International Academy',
    location: 'Njiro Hills, Arusha, Tanzania',
    phone: '+255 27 254 9900',
    email: 'info@staugustine.ac.tz',
    established: '2012',
    principal: 'Mr. Josephat Ngalawa, B.Ed.',
    academicSystem: 'TERMS',
    gradingSummary: 'Holistic 5-Tier Competency Assessment & Term Examination Merit Ranking',
    studentCount: 980,
    programs: [
      {
        title: 'Primary School (Standard 1–7)',
        desc: 'Foundational literacy, mathematics, science exploration, and French/Swahili bilingual studies.',
        badge: 'Foundation Years',
      },
      {
        title: 'Secondary School (Form 1–4)',
        desc: 'Rigorous academic preparation with smart classrooms, robotics lab, and international exchange programs.',
        badge: 'Secondary O-Level',
      },
    ],
    announcements: [
      {
        date: '20 Sep 2026',
        title: 'Mid-Term Progress Reports Dispatched to Verified Parent Portals',
        category: 'Academic',
      },
      {
        date: '05 Sep 2026',
        title: 'Inter-School Sports Gala & Science Fair Invitations',
        category: 'Events',
      },
    ],
  },
};

export default function SchoolBrandedPortalPage() {
  const params = useParams();
  const slug = (typeof params?.slug === 'string' ? params.slug.toLowerCase() : 'kss');

  // Fallback if tenant slug is not in standard seed, construct dynamic school record
  const school: SchoolProfile = REGISTERED_SCHOOLS[slug] || {
    code: slug.toUpperCase(),
    name: `${slug.toUpperCase()} Educational Academy`,
    motto: 'Excellence in Knowledge & Character',
    regNumber: `REG NO: ED/${slug.toUpperCase()}/2026`,
    type: 'Registered Educational Institution',
    location: 'East Africa Region',
    phone: '+255 700 000 000',
    email: `contact@${slug.toLowerCase()}.ac.tz`,
    established: '2026',
    principal: 'Institutional Administrator',
    academicSystem: 'TERMS',
    gradingSummary: 'Configured Academic Grading & Assessment Framework',
    studentCount: 500,
    programs: [
      {
        title: 'Standard Academic Program',
        desc: 'Full-time curriculum structured according to ministry education standards.',
        badge: 'Active Curriculum',
      },
    ],
    announcements: [
      {
        date: 'Today',
        title: 'School Online Portal Successfully Active',
        category: 'General',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. OFFICIAL INSTITUTION TOP BAR */}
      <div>
        <div className="bg-[#060a12] border-b border-slate-800 text-[11px] text-slate-400 py-2 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-emerald-400">{school.regNumber}</span>
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
              <span className="italic text-slate-400">"{school.motto}"</span>
              <Link
                href="/"
                className="text-[10px] text-blue-400 hover:text-blue-300 font-mono transition-colors border-l border-slate-800 pl-3"
              >
                Universal Platform ↗
              </Link>
            </div>
          </div>
        </div>

        {/* 2. SCHOOL BRANDED HEADER & NAVIGATION */}
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
                About School
              </a>
              <a href="#programs" className="hover:text-white transition-colors">
                Academics
              </a>
              <a href="#announcements" className="hover:text-white transition-colors">
                Announcements
              </a>
              <Link
                href="/admissions/apply"
                className="hover:text-emerald-400 transition-colors text-emerald-300"
              >
                Online Admissions
              </Link>
            </nav>

            {/* Direct Login Actions for this School */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Portal Sign In</span>
              </Link>
            </div>
          </div>
        </header>

        {/* 3. SCHOOL HERO SHOWCASE */}
        <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800">
          {/* Real Campus Image as Background for this specific School */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-campus-bg.jpg"
              alt={`${school.name} Campus`}
              fill
              className="object-cover object-center opacity-25 filter brightness-[0.7] contrast-125"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#090d16]/95 via-[#090d16]/80 to-[#090d16]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: School Headline & Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Official Institutional Portal • Est. {school.established}</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                  Welcome to <br />
                  <span className="text-gradient-blue">{school.name}</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  {school.motto}. Dedicated to academic achievement, character development, and holistic leadership for our {school.studentCount.toLocaleString()} enrolled learners.
                </p>

                {/* Direct Action Hub */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/admissions/apply"
                    className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <span>Apply for 2026/2027 Admission</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/student"
                    className="px-5 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span>Student Report Cards</span>
                  </Link>

                  <Link
                    href="/parent"
                    className="px-5 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-xs transition-all flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Parent Portal</span>
                  </Link>
                </div>

                {/* Quick Info Badges */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{school.academicSystem}-Based Calendar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Verified Ministry Registration</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>Online Fee Clearance Gate</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Portal Access Hub Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-[#0e1424]/90 shadow-2xl">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider text-blue-400 mb-4 flex items-center justify-between">
                    <span>Direct School Workspaces</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-normal">Active Session</span>
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
                            Student 360° Portal
                          </div>
                          <div className="text-[10px] text-slate-400">View marks, ranking & download report card</div>
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
                            Verified Guardian Portal
                          </div>
                          <div className="text-[10px] text-slate-400">Monitor child progress & fee invoices</div>
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
                            Teacher Assessment Center
                          </div>
                          <div className="text-[10px] text-slate-400">Enter marks, upload Excel & submit grades</div>
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
                            Administration & Principal
                          </div>
                          <div className="text-[10px] text-slate-400">Approve results, publication & audit log</div>
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

        {/* 4. ACADEMIC PROGRAMS OFFERED */}
        <section id="programs" className="py-16 border-b border-slate-800 bg-[#0b101d]/60">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-mono uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Academic Curriculum
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-3 tracking-tight">
                Programs Offered at {school.name}
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
                      <span>Enroll in Program</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. OFFICIAL ANNOUNCEMENTS NOTICE BOARD */}
        <section id="announcements" className="py-16 border-b border-slate-800 bg-[#090d16]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Official Notice Board
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                  Recent School Announcements
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
                    <span>Read Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. PRINCIPAL'S WELCOME STATEMENT */}
        <section id="about" className="py-16 bg-[#0b101d]/60">
          <div className="max-w-5xl mx-auto px-6">
            <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 bg-[#0e1424]/80 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl shadow-xl shrink-0">
                  {school.principal.charAt(0)}
                </div>
                <div className="space-y-3 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-blue-300 text-xs font-semibold">
                    <span>Message from the Administration</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    "Fostering Academic Excellence with Integrity"
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    At {school.name}, we are committed to providing an exceptional learning environment where every student is challenged, nurtured, and supported. Our digital portal ensures complete transparency between teachers, students, and parents, providing real-time access to continuous assessment scores, examination results, and attendance records.
                  </p>
                  <div className="pt-2">
                    <div className="font-bold text-white text-sm">{school.principal}</div>
                    <div className="text-xs text-blue-400">Head of Institution • {school.name}</div>
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
                Official institutional web portal. Powered by Universal Education Management Platform for multi-tenant security, examinations ranking, and student 360° lifecycle.
              </p>
              <div className="text-[11px] font-mono text-emerald-400">
                Official Reg: {school.regNumber}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Quick Portals</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><Link href="/student" className="hover:text-white transition-colors">Student Report Cards</Link></li>
                <li><Link href="/parent" className="hover:text-white transition-colors">Guardian Verification</Link></li>
                <li><Link href="/teacher" className="hover:text-white transition-colors">Teacher Assessment</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Administration Console</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Institution Contact</h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>{school.location}</li>
                <li>Phone: {school.phone}</li>
                <li>Email: {school.email}</li>
                <li>Academic Year: 2026/2027</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 {school.name}. All rights reserved.
            </div>
            <div>
              Powered by <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold">Universal Education Management Platform</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
