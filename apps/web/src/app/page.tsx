'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  School,
  Building2,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  ArrowRight,
  Globe2,
  Calendar,
  Sparkles,
  Smartphone,
  CreditCard,
  Layers,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ── Typewriter phrases ─────────────────────────────────────────────────────────
const TYPEWRITER_PHRASES = [
  'Secondary & High Schools',
  'Primary & Nursery Schools',
  'Colleges & Technical Institutes',
  'Universities & Higher Learning',
  'Educational Institutions',
];

function TypewriterHeading() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = TYPEWRITER_PHRASES[phraseIndex];
    const speed = isDeleting ? 38 : 72;

    const t = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < phrase.length) {
          setCurrentText(phrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2600);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(phrase.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((p) => (p + 1) % TYPEWRITER_PHRASES.length);
        }
      }
    }, speed);

    return () => clearTimeout(t);
  }, [currentText, isDeleting, phraseIndex]);

  return (
    <span className="text-cyan-300 font-black">
      {currentText}
      <span className="text-cyan-400 font-thin animate-pulse ml-0.5">|</span>
    </span>
  );
}

// ── Background slides ──────────────────────────────────────────────────────────
const HERO_SLIDES = [
  { src: '/images/slide-1.jpg', label: 'Collaborative student learning' },
  { src: '/images/slide-2.jpg', label: 'Modern academic campus' },
  { src: '/images/slide-3.jpg', label: 'Interactive classrooms' },
  { src: '/images/slide-4.jpg', label: 'Digital learning labs' },
  { src: '/images/slide-5.jpg', label: 'Research library' },
  { src: '/images/slide-6.jpg', label: 'Science laboratories' },
  { src: '/images/slide-7.jpg', label: 'Graduation ceremony' },
  { src: '/images/slide-8.jpg', label: 'Inspiring educators' },
  { src: '/images/slide-9.jpg', label: 'Student seminars' },
  { src: '/images/slide-10.jpg', label: 'World-class facilities' },
];

// ── Platform features ──────────────────────────────────────────────────────────
const PLATFORM_FEATURES = [
  {
    icon: Users,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Student Information System',
    desc: 'Centralised student records, class enrolments, ID generation, and guardian contacts in one secure cloud database.',
  },
  {
    icon: FileSpreadsheet,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Examinations & Report Cards',
    desc: 'Enter marks online or upload via Excel. Automatic grade and GPA calculations, class rankings, and professional PDF report cards.',
  },
  {
    icon: CreditCard,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Fees, Billing & Receipts',
    desc: 'Track collections, issue digital receipts instantly, monitor individual balances, and produce financial reports per term or semester.',
  },
  {
    icon: Smartphone,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Parent Communication Portal',
    desc: 'Exam results, fee receipts, and school announcements delivered to parents via SMS and a dedicated web portal.',
  },
  {
    icon: Calendar,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    title: 'Attendance Tracking',
    desc: 'Daily class-level attendance for students and staff, early absence alerts, and institution-wide attendance analytics.',
  },
  {
    icon: Globe2,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    title: 'Branded Institution Portal',
    desc: 'Every school gets its own branded web portal with custom logo, news, admission forms, and secure staff and student login.',
  },
];

// ── Onboarding steps ───────────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  {
    step: '01',
    title: 'Register Your Institution',
    desc: 'Provide your institution name, academic tier, location, and admin credentials. Setup takes under 3 minutes.',
  },
  {
    step: '02',
    title: 'Set Up Classes & Enrol Students',
    desc: 'Create classes, assign teachers to subjects, and bulk-import student records via Excel or direct entry.',
  },
  {
    step: '03',
    title: 'Run Assessments & Deliver Results',
    desc: 'Teachers submit marks, the platform computes grades and rankings, and parents receive report cards on their devices.',
  },
];

// ── Institution tiers ──────────────────────────────────────────────────────────
const SUPPORTED_LEVELS = [
  {
    title: 'Primary & Nursery Schools',
    desc: 'Photo-enabled report cards, behavioural assessments, daily attendance, and automated guardian notifications.',
    badge: 'Nursery & Primary',
  },
  {
    title: 'Secondary Schools',
    desc: 'Midterm and terminal exams, automatic grade and division calculations, subject rankings, and fee clearance controls.',
    badge: 'O-Level & A-Level',
  },
  {
    title: 'Vocational & Technical Colleges',
    desc: 'Semester-based grading, practical workshop tracking, competency assessments, and transcript issuance.',
    badge: 'Diploma & Certificates',
  },
  {
    title: 'Universities & Higher Learning',
    desc: 'Course registration, credit unit calculations, semester and cumulative GPA tracking, and multi-faculty approval workflows.',
    badge: 'Higher Education',
  },
];

// ── Page component ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const next = () => setSlide((s) => (s + 1) % HERO_SLIDES.length);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-700/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 tracking-tight leading-none">
                UNIVERSAL<span className="text-blue-700">ED</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">
                Education Management Platform
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Features
            </a>
            <a href="#how-it-works" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" /> How It Works
            </a>
            <a href="#institutions" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-purple-500" /> Institutions
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register-institution"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-md shadow-blue-700/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Register Institution
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[620px] sm:min-h-[700px] lg:min-h-[760px] flex items-center justify-center border-b border-slate-200">

        {/* Slides */}
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <Image src={s.src} alt={s.label} fill className="object-cover object-center" priority={i === 0} />
            </div>
          ))}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/72 via-slate-900/55 to-slate-950/78" />
        </div>

        {/* Arrows */}
        <button onClick={prev} className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95" aria-label="Previous">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next} className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95" aria-label="Next">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center flex flex-col items-center gap-7">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs sm:text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            School &amp; University Management Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-white tracking-tight leading-[1.18] drop-shadow-lg">
            Smart Education Management
            <br />
            <span className="mt-1 block">
              for <TypewriterHeading />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/82 max-w-2xl leading-relaxed">
            Manage students, examinations, report cards, fee billing, and parent
            communication — all from one platform, built for every type of institution.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/register-institution"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-600/35 transition-all text-sm sm:text-base hover:-translate-y-0.5"
            >
              <Building2 className="w-4 h-4" />
              Register Your Institution
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold border border-white/25 transition-all text-sm sm:text-base hover:-translate-y-0.5"
            >
              <Lock className="w-4 h-4" />
              Sign In to Portal
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/78 font-medium">
            {[
              { c: 'text-emerald-400', t: 'PDF Report Cards' },
              { c: 'text-cyan-400', t: 'SMS Parent Alerts' },
              { c: 'text-purple-400', t: 'Branded School Portal' },
              { c: 'text-amber-400', t: 'Fee & Billing Tools' },
            ].map(({ c, t }) => (
              <span key={t} className="flex items-center gap-1.5 bg-white/8 px-3 py-1.5 rounded-full border border-white/12">
                <CheckCircle2 className={`w-3.5 h-3.5 ${c}`} />
                {t}
              </span>
            ))}
          </div>

          {/* Dot nav */}
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'w-6 bg-cyan-400' : 'w-2 bg-white/35 hover:bg-white/65'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Layers className="w-3.5 h-3.5" />
              What It Does
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything your institution needs
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              One platform connecting administrators, teachers, students, and parents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {PLATFORM_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-7 hover:shadow-md hover:border-blue-200 hover:bg-white transition-all group">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform ${f.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-100">
              <Zap className="w-3.5 h-3.5" />
              Getting Started
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Up and running in 3 steps
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              No servers, no hardware, no IT department needed. Just a browser and internet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ONBOARDING_STEPS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-blue-300 hover:shadow-md transition-all group">
                <span className="text-5xl font-black text-blue-100 group-hover:text-blue-200 transition-colors block mb-5 leading-none">
                  {s.step}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/register-institution"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-700/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started — Register Your Institution
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── INSTITUTION TIERS ── */}
      <section id="institutions" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-100">
              <School className="w-3.5 h-3.5" />
              Who It&apos;s For
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Built for every educational level
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Configurable workflows adapt to the exact needs of your institution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {SUPPORTED_LEVELS.map((l, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-7 hover:shadow-md hover:bg-white hover:border-blue-200 transition-all flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 inline-block mb-4">
                    {l.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{l.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{l.desc}</p>
                </div>
                <Link href="/register-institution" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors">
                  Register under this tier <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-black leading-snug">
                Ready to transform how your institution operates?
              </h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                Replace manual registers, printed mark sheets, and spreadsheets with a single modern platform your whole team can use from day one.
              </p>
            </div>
            <Link
              href="/register-institution"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-blue-900 font-extrabold text-sm shadow-md hover:bg-blue-50 transition-all shrink-0 hover:scale-105"
            >
              Register Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-800">

            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-black text-white">UNIVERSAL ED</span>
                  <p className="text-[11px] text-slate-500">Education Management Platform</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                A secure, multi-tenant cloud platform for managing students, examinations,
                report cards, fee billing, and parent engagement across schools, colleges, and universities.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>📍 Dar es Salaam, Tanzania</p>
                <p>📞 +255 779 304 500</p>
                <p>✉️ pj0040280@gmail.com</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Features</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                {['Student Information System', 'Automated Report Cards', 'Fee & Billing', 'Attendance Tracking', 'Parent Portal & SMS'].map((f) => (
                  <li key={f}><a href="#features" className="hover:text-white transition-colors">{f}</a></li>
                ))}
              </ul>
            </div>

            {/* Institutions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Institutions</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                {['Primary & Nursery Schools', 'Secondary Schools', 'Colleges & Vocational', 'Universities'].map((t) => (
                  <li key={t}><a href="#institutions" className="hover:text-white transition-colors">{t}</a></li>
                ))}
                <li>
                  <Link href="/register-institution" className="text-blue-400 hover:text-blue-300 font-semibold">
                    + Register Institution
                  </Link>
                </li>
              </ul>
            </div>

            {/* Portals */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Portals</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register-institution" className="hover:text-white transition-colors">Register Institution</Link></li>
                <li><Link href="/admissions/apply" className="hover:text-white transition-colors">Student Admission Form</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} Universal Ed. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span>Multi-Tenant Cloud Platform</span>
              <span>·</span>
              <span>Built for Education</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
