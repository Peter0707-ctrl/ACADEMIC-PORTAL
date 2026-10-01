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
  BookOpen,
  Bus,
  Clock,
  HeartHandshake,
  Award,
} from 'lucide-react';

// Typewriter Heading specifically for Primary & Nursery Schools
const TYPEWRITER_PHRASES = [
  'Nursery & Kindergarten Schools',
  'Pre-Unit & Early Childhood Centers',
  'Lower Primary (Standard 1 - 4)',
  'Upper Primary (Standard 5 - 7)',
  'Primary & Preparatory Academies',
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
    <span className="text-cyan-300 font-black inline-block min-w-[280px] sm:min-w-[460px] text-center">
      {currentText}
      <span className="text-cyan-400 font-light animate-pulse ml-1">|</span>
    </span>
  );
}

// 10 Educational Background Slides
const HERO_SLIDES = [
  { src: '/images/slide-1.jpg', label: 'Interactive Primary Classroom Learning & Reading' },
  { src: '/images/slide-2.jpg', label: 'Modern Primary School Campus & Safe Environment' },
  { src: '/images/slide-3.jpg', label: 'Dedicated Primary School Teachers & Pupils' },
  { src: '/images/slide-4.jpg', label: 'Early Childhood Education & Digital Literacy' },
  { src: '/images/slide-5.jpg', label: 'Primary School Reading Corner & Library Books' },
  { src: '/images/slide-6.jpg', label: 'Pupils Science Experiments & Practical Learning' },
  { src: '/images/slide-7.jpg', label: 'Annual Graduation Day for Pre-Unit & Standard 7' },
  { src: '/images/slide-8.jpg', label: 'Caring Educators & Creative Classroom Teaching' },
  { src: '/images/slide-9.jpg', label: 'Student Collaborative Projects & Discovery' },
  { src: '/images/slide-10.jpg', label: 'Safe, Joyful & Supportive School Infrastructure' },
];

// Core Primary School Features
const PRIMARY_FEATURES = [
  {
    icon: Users,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Pupil Records & Admissions (SIS)',
    desc: 'Manage complete pupil profiles from Baby Class to Standard 7, passport photos, parent contact details, emergency guardians, and student ID generation in one secure cloud portal.',
  },
  {
    icon: FileSpreadsheet,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: 'Assessment & Term Report Cards',
    desc: 'Teachers enter monthly test and terminal scores online or upload via Excel. The system calculates totals, averages, grades (A-F), class ranks, and generates photo-enabled PDF report cards.',
  },
  {
    icon: CreditCard,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'School Fees, Transport & Meal Billing',
    desc: 'Track tuition payments, school bus transport routes, morning snacks, and lunch billing. Issue instant digital receipts and send real-time SMS balance reminders to parents.',
  },
  {
    icon: Calendar,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    title: 'Daily Attendance & Roll-Call',
    desc: 'Class teachers take morning roll-call in under 30 seconds per stream. Spot absenteeism early and trigger instant alerts to parents when a child is absent from school.',
  },
  {
    icon: Smartphone,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Direct Parent SMS & Notifications',
    desc: 'Deliver terminal examination results, fee payment confirmations, closing day announcements, and emergency notices straight to parents via SMS and their dedicated parent portal.',
  },
  {
    icon: Globe2,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    title: 'Dedicated Primary School Website',
    desc: 'Every registered primary school receives its own branded website portal with school logo, announcements, online admission application forms, and teacher/parent access.',
  },
];

// 3 Simple Steps to Start
const ONBOARDING_STEPS = [
  {
    step: '01',
    title: 'Register Your Primary School',
    desc: 'Enter your school name, grades offered (Nursery, Pre-Unit, Standards 1 to 7), location, and administration credentials. Takes under 3 minutes.',
  },
  {
    step: '02',
    title: 'Set Up Classes & Enroll Pupils',
    desc: 'Create class streams (e.g. Standard 1 Blue, Standard 1 Red), assign class teachers to subjects, and bulk-import pupil rosters via Excel.',
  },
  {
    step: '03',
    title: 'Enter Marks & Issue Report Cards',
    desc: 'Teachers record assessment scores, the system calculates ranks and averages, and printable PDF report cards with headteacher remarks are ready instantly.',
  },
];

// Primary School Grade Levels
const PRIMARY_LEVELS = [
  {
    title: 'Nursery & Pre-School',
    desc: 'Baby Class, Middle Class, and Pre-Unit. Developmental milestones, phonics, basic arithmetic, and playful learning evaluation with photo report cards.',
    badge: 'Ages 3 - 5 Years',
  },
  {
    title: 'Lower Primary (Standard 1 - 4)',
    desc: 'Strong foundation in reading, writing, arithmetic (3Rs), English, Kiswahili, basic science, and positive conduct and behavioral assessments.',
    badge: 'Standards 1 to 4',
  },
  {
    title: 'Upper Primary (Standard 5 - 7)',
    desc: 'Subject mastery, continuous assessment tracking, monthly mock tests, terminal examination rankings, and preparation for national exit examinations.',
    badge: 'Standards 5 to 7',
  },
  {
    title: 'Primary & Preparatory Academies',
    desc: 'Integrated curriculum tracking, extracurricular activities, clubs, school bus routing, meal management, and comprehensive parent communication.',
    badge: 'Academy Edition',
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
      {/* 1. NAVIGATION HEADER */}
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
                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  Primary School Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Primary & Nursery School Management Portal
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#features" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Primary Features
            </a>
            <a href="#how-it-works" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              How It Works
            </a>
            <a href="#classes" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
              <School className="w-4 h-4 text-purple-600" />
              Classes & Levels
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
              <span>Register Primary School</span>
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
            <span>Dedicated Cloud Software for Primary & Nursery Schools</span>
          </div>

          {/* Dynamic Typewriter Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.18] drop-shadow-lg max-w-4xl">
            Smart School Management for{' '}
            <div className="mt-2 text-cyan-300 drop-shadow-md">
              <TypewriterHeading />
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-100 max-w-3xl font-normal leading-relaxed drop-shadow-md">
            Built specifically for primary schools and kindergartens. Simplify pupil admissions, classroom roll-call attendance,
            subject marks entry, photo-enabled report cards, fee & bus tracking, and instant SMS alerts to parents.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full sm:w-auto">
            <Link
              href="/register-institution"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-600/40 transition-all text-base hover:-translate-y-0.5"
            >
              <Building2 className="w-5 h-5" />
              <span>Register Your Primary School</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold border border-white/30 shadow-lg transition-all text-base hover:-translate-y-0.5"
            >
              <Lock className="w-5 h-5 text-white/90" />
              <span>Sign In to School Portal</span>
            </Link>
          </div>

          {/* Value Highlights Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-slate-100 font-medium">
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Terminal Report Cards with Photos
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Instant SMS Alerts to Parents
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              30-Second Classroom Attendance
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 drop-shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Tuition, Bus & Meal Billing
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
              Primary School Spotlight <span className="font-bold text-cyan-300">{currentSlide + 1} of {HERO_SLIDES.length}</span>: {HERO_SLIDES[currentSlide].label}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRIMARY SCHOOL CORE MODULES / FEATURES */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Tailored for Primary Schools</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything Your Primary School Needs Every Day
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Designed specifically for headteachers, class teachers, pupils, and parents — without the unnecessary complexity of college or university systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRIMARY_FEATURES.map((item, idx) => {
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
              <span>Quick Onboarding</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Get Your Primary School Running in 3 Steps
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              No complex installations or IT staff required. Start managing your classes directly from your phone, laptop, or office computer.
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
              <span>Register Your Primary School Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PRIMARY SCHOOL CLASSES & LEVELS */}
      <section id="classes" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
              <School className="w-3.5 h-3.5" />
              <span>Nursery to Standard 7</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Pre-Configured for Every Primary Grade
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              From early childhood development in Nursery to competitive terminal rankings in Standard 7, each stage has custom workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {PRIMARY_LEVELS.map((level, idx) => (
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
                  <span>Set Up This Level</span>
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
                Ready to Upgrade Your Primary School Management?
              </h3>
              <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
                Join forward-thinking primary and nursery schools eliminating manual paperwork, saving days of report card calculations, and keeping parents delighted.
              </p>
            </div>
            <Link
              href="/register-institution"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-900 font-extrabold text-sm shadow-md hover:bg-blue-50 transition-all shrink-0 hover:scale-105"
            >
              <span>Register Primary School</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Col 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-lg font-black text-white">UNIVERSAL ED PRIMARY</span>
                  <p className="text-[11px] text-slate-400">Primary & Nursery School Management Portal</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                A dedicated cloud management platform designed specifically for primary, nursery, and kindergarten schools.
                Pupil records, marks, terminal report cards, school fees, bus routes, and direct parent SMS.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <p>📍 Dar es Salaam, Tanzania</p>
                <p>📞 Phone: +255 779 304 500</p>
                <p>✉️ Email: pj0040280@gmail.com</p>
              </div>
            </div>

            {/* Col 2: Features */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Primary Modules</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Pupil Records (Baby - Std 7)</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Terminal Report Cards with Photos</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Tuition, Bus & Meal Fees</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Daily Roll-Call Attendance</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Parent SMS Notifications</a></li>
              </ul>
            </div>

            {/* Col 3: Classes */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Classes & Grades</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#classes" className="hover:text-white transition-colors">Nursery & Baby Class</a></li>
                <li><a href="#classes" className="hover:text-white transition-colors">Pre-Unit & Kindergarten</a></li>
                <li><a href="#classes" className="hover:text-white transition-colors">Lower Primary (Std 1 - 4)</a></li>
                <li><a href="#classes" className="hover:text-white transition-colors">Upper Primary (Std 5 - 7)</a></li>
                <li><Link href="/register-institution" className="text-blue-400 hover:text-blue-300 font-semibold">+ Register Primary School</Link></li>
              </ul>
            </div>

            {/* Col 4: Quick Portals */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Portals</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Teacher & Staff Sign In</Link></li>
                <li><Link href="/register-institution" className="hover:text-white transition-colors">Register New Primary School</Link></li>
                <li><Link href="/admissions/apply" className="hover:text-white transition-colors">Pupil Admission Application</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} UniversalEd Primary. All rights reserved. Commercial Primary Education Platform.
            </p>
            <div className="flex items-center gap-4">
              <span>Primary School Edition</span>
              <span>•</span>
              <span>Modern Cloud Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
