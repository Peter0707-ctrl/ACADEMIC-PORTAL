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
  ChevronLeft,
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

// Typewriter Heading Phrases
const TYPEWRITER_PHRASES = [
  'Secondary & High Schools',
  'Primary & Nursery Schools',
  'Colleges & Technical Institutes',
  'Universities & Higher Learning',
  'Educational Institutions Worldwide',
];

function TypewriterHeading({ className = 'text-cyan-300 font-extrabold inline-block min-w-[260px] sm:min-w-[420px] text-center' }: { className?: string }) {
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
    <span className={className}>
      {currentText}
      <span className="text-cyan-400 font-light animate-pulse ml-1">|</span>
    </span>
  );
}

// 10 Curated Generic Educational Background Slides
const HERO_SLIDES = [
  { src: '/images/slide-1.jpg', label: 'Collaborative Student Learning & Group Study' },
  { src: '/images/slide-2.jpg', label: 'Modern Academic Campus Architecture' },
  { src: '/images/slide-3.jpg', label: 'Interactive Classrooms & Modern Lectures' },
  { src: '/images/slide-4.jpg', label: 'Digital Learning & Computer Laboratories' },
  { src: '/images/slide-5.jpg', label: 'Comprehensive Library & Research Facilities' },
  { src: '/images/slide-6.jpg', label: 'Science Laboratories & Practical Experiments' },
  { src: '/images/slide-7.jpg', label: 'Graduation Ceremony & Academic Excellence' },
  { src: '/images/slide-8.jpg', label: 'Dedicated Educators & Inspiring Teaching' },
  { src: '/images/slide-9.jpg', label: 'Student Seminars & Innovation Projects' },
  { src: '/images/slide-10.jpg', label: 'World-Class Educational Infrastructure' },
];

// Core Platform Features
const PLATFORM_FEATURES = [
  {
    icon: Users,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Student Information System (SIS)',
    desc: 'Manage complete student records, bios, enrollments, student ID generation, classes, and guardian contact details in one secure multi-tenant cloud database.',
  },
  {
    icon: FileSpreadsheet,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Examinations & Automated Report Cards',
    desc: 'Teachers enter scores online or bulk upload via Excel. The system automatically computes averages, ranks, grade scales (A-F / GPA), and produces verifiable PDF report cards.',
  },
  {
    icon: CreditCard,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Fees, Billing & Electronic Receipts',
    desc: 'Track fee collections, issue instant digital receipts, monitor student balances, and generate real-time institutional financial audits per term, semester, or year.',
  },
  {
    icon: Smartphone,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Parent Engagement via SMS & Web Portal',
    desc: 'Deliver exam results, payment receipts, attendance notifications, and emergency announcements straight to parents via automated SMS and a dedicated mobile portal.',
  },
  {
    icon: Calendar,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    title: 'Daily Attendance & Absence Tracking',
    desc: 'Record daily attendance per classroom for students and staff, spot chronic absenteeism early, and generate institution-wide attendance analytics.',
  },
  {
    icon: Globe2,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    title: 'Dedicated White-Label Institution Portal',
    desc: 'Every registered institution receives its own branded web presence featuring custom logos, notices, admission application forms, and authenticated staff/student access.',
  },
];

// 3 Onboarding Steps
const ONBOARDING_STEPS = [
  {
    step: '01',
    title: 'Register Your Institution',
    desc: 'Provide your institution name, academic tier (Primary, Secondary, College, University), location, and administrator credentials. Takes under 3 minutes.',
  },
  {
    step: '02',
    title: 'Configure Classes & Enroll Students',
    desc: 'Create class streams, assign faculty to subjects, and effortlessly bulk-import student records via standard Excel spreadsheets or direct entry.',
  },
  {
    step: '03',
    title: 'Assess, Manage & Publish Results',
    desc: 'Teachers enter assessment scores, the platform computes grades and class ranks, tracks fee compliance, and parents receive live report cards on their devices.',
  },
];

// Multi-Tier Institution Support
const SUPPORTED_LEVELS = [
  {
    title: 'Primary & Nursery Schools',
    desc: 'Photo-enabled report cards, conduct & behavioral evaluations, daily attendance monitoring, and instant SMS alerts to guardians.',
    badge: 'Nursery & Primary',
  },
  {
    title: 'Secondary Schools (O-Level & A-Level)',
    desc: 'Midterm and final examinations, automated grade point calculations, subject rankings, division calculations, and fee clearance tracking.',
    badge: 'Form 1 to Form 6 / High School',
  },
  {
    title: 'Vocational & Technical Colleges',
    desc: 'Semester-based modular grading, practical workshop tracking, skill competency assessments, and accredited transcript issuance.',
    badge: 'Diploma & Certificates',
  },
  {
    title: 'Universities & Higher Learning',
    desc: 'Course registration, credit unit calculations, semester and cumulative GPA tracking, faculties, departments, and multi-tier approval workflows.',
    badge: 'Higher Education & Universities',
  },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slideshow transition every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

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
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Next-Generation Education Management Platform
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#features" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Features
            </a>
            <a href="#how-it-works" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              How It Works
            </a>
            <a href="#institutions" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <School className="w-4 h-4 text-purple-600" />
              Institutions
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register-institution"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-md shadow-blue-700/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Register Institution</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH 10 FULL-BACKGROUND EDUCATIONAL SLIDES */}
      <section className="relative overflow-hidden min-h-[640px] sm:min-h-[720px] flex items-center justify-center border-b border-slate-200">
        {/* Full-width Background Slides (10 Images) */}
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
                className="object-cover object-center scale-100 motion-safe:transition-transform motion-safe:duration-[7000ms]"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Balanced Educational Overlay: Keeps pictures clearly visible while ensuring text is 100% readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-900/60 to-slate-950/80" />
          <div className="absolute inset-0 bg-blue-950/20 mix-blend-multiply" />
        </div>

        {/* Previous / Next Slide Chevron Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Foreground Hero Content (Centered, behind text is the full background image) */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 lg:py-28 text-center flex flex-col items-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold shadow-lg">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Complete Cloud Operating System for Education</span>
          </div>

          {/* Dynamic Typewriter Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.18] drop-shadow-lg max-w-4xl">
            Modern Education Management for{' '}
            <div className="mt-2 text-cyan-300 drop-shadow-md">
              <TypewriterHeading />
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-100 max-w-3xl font-normal leading-relaxed drop-shadow-md">
            Streamline your school, college, or university operations with one unified platform: student enrollment,
            examination marks, automated report cards, fee billing and electronic receipts, daily attendance,
            and custom white-label portals for every institution.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full sm:w-auto">
            <Link
              href="/register-institution"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-600/40 transition-all text-base hover:-translate-y-0.5"
            >
              <Building2 className="w-5 h-5" />
              <span>Register Your Institution</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold border border-white/30 shadow-lg transition-all text-base hover:-translate-y-0.5"
            >
              <Lock className="w-5 h-5 text-white/90" />
              <span>Sign In to Portal</span>
            </Link>
          </div>

          {/* Value Highlights Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-slate-100 font-medium">
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Instant PDF Report Cards
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              SMS & Portal Alerts for Parents
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              Dedicated Portal for Every School
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Complete Fee & Billing Management
            </span>
          </div>

          {/* Slideshow Controls (10 Dots & Slide Indicator) */}
          <div className="pt-4 flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-8 bg-cyan-400' : 'w-2.5 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Show slide ${idx + 1}`}
                />
              ))}
            </div>
            <div className="text-xs text-white/80 font-medium drop-shadow">
              Background Slide <span className="font-bold text-cyan-300">{currentSlide + 1} of {HERO_SLIDES.length}</span>: {HERO_SLIDES[currentSlide].label}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM CORE MODULES / FEATURES */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Core Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything You Need to Power Your Institution
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              A robust, enterprise-grade software suite uniting institution leadership, faculty, students, and parents in one seamless cloud environment.
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

      {/* 4. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Effortless Onboarding</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Launch in 3 Simple Steps
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              No expensive on-premise hardware or servers required. All you need is an internet connection on any computer, tablet, or smartphone.
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
              <span>Register Your Institution (Get Started Free)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. INSTITUTIONS SUPPORTED */}
      <section id="institutions" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
              <School className="w-3.5 h-3.5" />
              <span>Multi-Tier Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Engineered to Adapt to Any Educational Level
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Configurable workflows tailor-made for primary schools, secondary academies, technical institutes, and higher education universities.
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
                  <span>Register Under This Tier</span>
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
                Ready to Modernize Your Institution&apos;s Operations?
              </h3>
              <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
                Join leading schools, colleges, and educational academies utilizing Universal Ed to eliminate manual paperwork, prevent calculation errors, and deliver world-class digital services to students and parents.
              </p>
            </div>
            <Link
              href="/register-institution"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-900 font-extrabold text-sm shadow-md hover:bg-blue-50 transition-all shrink-0 hover:scale-105"
            >
              <span>Register Your Institution Today</span>
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
                  <p className="text-[11px] text-slate-400">Education Operating System</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                An all-in-one multi-tenant cloud platform empowering schools and universities to manage students,
                examinations, automated report cards, fee billing, and real-time parent engagement.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <p>📍 Dar es Salaam, Tanzania • Global Cloud</p>
                <p>📞 Phone: +255 754 000 000 / +255 684 000 000</p>
                <p>✉️ Email: sales@universaled.co.tz</p>
              </div>
            </div>

            {/* Col 2: Features */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Features</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Student Information System</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Automated Report Cards</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Fee & Billing Management</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Attendance Tracking</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Parent SMS & Portal</a></li>
              </ul>
            </div>

            {/* Col 3: Institutions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Institutions</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#institutions" className="hover:text-white transition-colors">Primary & Nursery Schools</a></li>
                <li><a href="#institutions" className="hover:text-white transition-colors">Secondary Schools</a></li>
                <li><a href="#institutions" className="hover:text-white transition-colors">Colleges & Vocational Centers</a></li>
                <li><a href="#institutions" className="hover:text-white transition-colors">Universities & Higher Learning</a></li>
                <li><Link href="/register-institution" className="text-blue-400 hover:text-blue-300 font-semibold">+ Register Your Institution</Link></li>
              </ul>
            </div>

            {/* Col 4: Quick Portals */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Access Portals</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In to Account</Link></li>
                <li><Link href="/register-institution" className="hover:text-white transition-colors">Register New School</Link></li>
                <li><Link href="/admissions/apply" className="hover:text-white transition-colors">Online Admission Form</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} Universal Ed. All rights reserved. Commercial Multi-Tenant Education Platform.
            </p>
            <div className="flex items-center gap-4">
              <span>Cloud Education Platform</span>
              <span>•</span>
              <span>Enterprise Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
