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

// Typewriter Phrases
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
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 38 : 72;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2600);
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
    <span className="text-cyan-300 font-black">
      {currentText}
      <span className="text-cyan-400 font-light animate-pulse ml-0.5">|</span>
    </span>
  );
}

// 10 Background Educational Slides
const HERO_SLIDES = [
  { src: '/images/slide-1.jpg', label: 'Collaborative student learning & group study' },
  { src: '/images/slide-2.jpg', label: 'Modern academic campus architecture' },
  { src: '/images/slide-3.jpg', label: 'Interactive classrooms & modern lectures' },
  { src: '/images/slide-4.jpg', label: 'Digital learning & computer laboratories' },
  { src: '/images/slide-5.jpg', label: 'Research library & academic resources' },
  { src: '/images/slide-6.jpg', label: 'Science laboratories & practical experiments' },
  { src: '/images/slide-7.jpg', label: 'Graduation ceremony & academic achievement' },
  { src: '/images/slide-8.jpg', label: 'Dedicated educators & inspiring teaching' },
  { src: '/images/slide-9.jpg', label: 'Student seminars & innovation projects' },
  { src: '/images/slide-10.jpg', label: 'World-class educational infrastructure' },
];

// Core Platform Features
const PLATFORM_FEATURES = [
  {
    icon: Users,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Student Information System',
    desc: 'Centralised student profiles, class enrolments, student ID generation, and guardian contact management — all in one secure, searchable database.',
  },
  {
    icon: FileSpreadsheet,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Examinations & Report Cards',
    desc: 'Enter marks online or upload via Excel. The system automatically computes grades (A–F / GPA), class positions, and generates professionally formatted PDF report cards.',
  },
  {
    icon: CreditCard,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Fees, Billing & Receipts',
    desc: 'Track fee collections, issue instant digital receipts, monitor individual student balances, and produce detailed financial reports per term, semester, or year.',
  },
  {
    icon: Smartphone,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Parent Communication Portal',
    desc: 'Deliver exam results, fee receipts, attendance alerts, and school announcements directly to parents via SMS and a dedicated web portal.',
  },
  {
    icon: Calendar,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    title: 'Attendance Tracking',
    desc: 'Record daily class-level attendance for students and staff, flag repeated absences early, and produce attendance analytics at institution level.',
  },
  {
    icon: Globe2,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    title: 'Branded Institution Portal',
    desc: 'Every registered institution gets its own branded web portal with custom logo, news feeds, online admission forms, and secure staff and student login.',
  },
];

// 3-Step Onboarding
const ONBOARDING_STEPS = [
  {
    step: '01',
    title: 'Register Your Institution',
    desc: 'Provide your institution name, academic tier, location, and admin credentials. Setup takes under 3 minutes.',
  },
  {
    step: '02',
    title: 'Set Up Classes & Enrol Students',
    desc: 'Create academic classes, assign teachers to subjects, and bulk-import student records via Excel or direct entry.',
  },
  {
    step: '03',
    title: 'Run Assessments & Deliver Results',
    desc: 'Teachers submit marks, the platform computes grades and rankings, and parents receive report cards and fee statements on their devices.',
  },
];

// Supported Institution Tiers
const SUPPORTED_LEVELS = [
  {
    title: 'Primary & Nursery Schools',
    desc: 'Photo-enabled report cards, behavioural assessments, daily attendance, and automated guardian notifications.',
    badge: 'Nursery & Primary',
  },
  {
    title: 'Secondary Schools',
    desc: 'Midterm and terminal exams, automatic grade point and division calculations, subject rankings, and fee clearance controls.',
    badge: 'O-Level & A-Level',
  },
  {
    title: 'Vocational & Technical Colleges',
    desc: 'Semester-based modular grading, practical workshop tracking, competency assessments, and transcript issuance.',
    badge: 'Diploma & Certificates',
  },
  {
    title: 'Universities & Higher Learning',
    desc: 'Course registration, credit unit calculations, semester and cumulative GPA tracking, multi-faculty workflows, and approval chains.',
    badge: 'Higher Education',
  },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">

      {/* ─── NAVIGATION ─── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-700/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  UNIVERSAL<span className="text-blue-700">ED</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Education Management Platform
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />Features
            </a>
            <a href="#how-it-works" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />How It Works
            </a>
            <a href="#institutions" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-purple-500" />Institutions
            </a>
          </nav>

          {/* CTA buttons */}
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

      {/* ─── HERO: 10-IMAGE FULL-BACKGROUND SLIDESHOW ─── */}
      <section className="relative overflow-hidden min-h-[600px] sm:min-h-[700px] lg:min-h-[760px] flex items-center justify-center border-b border-slate-200">

        {/* Background slides */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.label}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          ))}
          {/* Overlay: keeps images visible but text legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/55 to-slate-950/75" />
        </div>

        {/* Slide nav arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-black/55 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center flex flex-col items-center gap-6 sm:gap-8">

          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs sm:text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            School & University Management Platform
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-white tracking-tight leading-[1.15] drop-shadow-lg">
            Smart Education Management
            <br className="hidden sm:block" />
            <span className="sm:block"> for </span>
            <TypewriterHeading />
          </h1>

          {/* Subtitle — clear, no hype */}
          <p className="text-base sm:text-lg text-white/85 max-w-2xl font-normal leading-relaxed">
            Manage students, examinations, report cards, fee billing, and parent
            communication — all from one platform, built for every type of institution.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href="/register-institution"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-600/35 transition-all text-sm sm:text-base hover:-translate-y-0.5"
            >
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Register Your Institution
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold border border-white/25 transition-all text-sm sm:text-base hover:-translate-y-0.5"
            >
              <Lock className="w-4 h-4" />
              Sign In to Portal
            </Link>
          </div>

          {/* Feature highlights — concrete, not hype */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-white/80 font-medium">
            {[
              { icon: CheckCircle2, color: 'text-emerald-400', label: 'PDF Report Cards' },
              { icon: CheckCircle2, color: 'text-cyan-400', label: 'SMS Parent Alerts' },
              { icon: CheckCircle2, color: 'text-purple-400', label: 'Branded School Portal' },
              { icon: CheckCircle2, color: 'text-amber-400', label: 'Fee & Billing Tools' },
            ].map(({ icon: Icon, color, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 bg-white/8 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/12"
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                {label}
              </span>
            ))}
          </div>

          {/* Dot navigation */}
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-6 bg-cyan-400'
                    : 'w-2 bg-white/35 hover:bg-white/65'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
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
              One platform connecting institution administrators, teachers, students, and parents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {PLATFORM_FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-7 hover:shadow-md hover:border-blue-200 hover:bg-white transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
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
              No hardware, no servers, no IT department needed. Just a browser and an internet connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ONBOARDING_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-8 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <span className="text-5xl font-black text-blue-100 group-hover:text-blue-200 transition-colors block mb-5 leading-none">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
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

      {/* ─── INSTITUTION TIERS ─── */}
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
              Configurable workflows adapt to the exact needs of your institution — from nursery schools to research universities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {SUPPORTED_LEVELS.map((level, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-7 hover:shadow-md hover:bg-white hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 inline-block mb-4">
                    {level.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {level.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">
                    {level.desc}
                  </p>
                </div>
                <Link
                  href="/register-institution"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
                >
                  Register under this tier <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <h3 className="text-2xl sm:text-3xl font-black leading-snug">
                Ready to transform how your institution operates?
              </h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                Replace manual registers, printed mark sheets, and spreadsheets with a single modern platform your whole team can use.
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

      {/* ─── FOOTER ─── */}
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
                <p>📞 +255 754 000 000</p>
                <p>✉️ info@universaled.co.tz</p>
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
