'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  School,
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  ChevronRight,
  ClipboardCheck,
  Award,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  const [activeInstitution, setActiveInstitution] = useState<'SECONDARY' | 'COLLEGE'>('SECONDARY');

  const lifecycleSteps = [
    {
      step: '01',
      title: 'School Onboarding & Setup',
      actor: 'Institution Admin',
      description: 'Register the institution, choose Secondary vs. College, configure terms or semesters, grading scale, and rules.',
      href: '/register-institution',
      cta: 'Register New School',
      icon: Building2,
      badge: 'Starting Point',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      step: '02',
      title: 'Admissions & Enrollment',
      actor: 'Applicant / Admission Officer',
      description: 'Prospective students apply online, upload certificates, receive decision, and enroll into Form 1 or Year 1.',
      href: '/admissions/apply',
      cta: 'Apply for Admission',
      icon: GraduationCap,
      badge: 'Admissions',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      step: '03',
      title: 'Teacher Marks & Excel Entry',
      actor: 'Teacher / Lecturer',
      description: 'Download dynamic Excel template pre-filled with enrolled students, upload marks, and get 14-point row validation.',
      href: '/teacher',
      cta: 'Enter Marks (Teacher)',
      icon: FileSpreadsheet,
      badge: 'Vertical Slice',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      step: '04',
      title: 'Review, Grading & Approval',
      actor: 'Academic Master / Headmaster',
      description: 'Review marks distribution, return for correction if needed, approve, and compute Standard Competition Ranking (1224).',
      href: '/academic',
      cta: 'Review & Approve',
      icon: ShieldCheck,
      badge: 'Administrative Sign-off',
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      step: '05',
      title: 'Student 360° Portal',
      actor: 'Student',
      description: 'View official verified report card with letter grades, points, rank, and financial clearance fee-hold policy protection.',
      href: '/student',
      cta: 'View Student Report Card',
      icon: Award,
      badge: 'Student View',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      step: '06',
      title: 'Parent & Guardian Portal',
      actor: 'Parent / Guardian',
      description: 'Verified guardians switch between linked children, monitor real-time marks, attendance records, and announcements.',
      href: '/parent',
      cta: 'Open Parent Portal',
      icon: Users,
      badge: 'Guardian View',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base sm:text-lg block leading-tight">
                Universal Academic Portal
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                Digital Operating System for Educational Institutions
              </span>
            </div>
          </div>

          {/* Institution Switcher & Quick Navigation */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveInstitution('SECONDARY')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeInstitution === 'SECONDARY'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Secondary School Model
              </button>
              <button
                onClick={() => setActiveInstitution('COLLEGE')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeInstitution === 'COLLEGE'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                University / College Model
              </button>
            </div>

            <Link
              href="/register-institution"
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-400 bg-white transition-colors hidden sm:inline-flex items-center space-x-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Register School</span>
            </Link>

            <Link
              href="/login"
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Institutional Lifecycle • From Onboarding to Graduation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How The Universal Platform Operates
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Below is the full <strong>Starting Place to Ending Place</strong> lifecycle. Walk through each sequential phase or jump into any role directly.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/register-institution" className="btn-primary text-xs flex items-center space-x-1.5 shadow-sm">
              <Building2 className="w-4 h-4" />
              <span>1. Register School (Start Here)</span>
            </Link>
            <Link href="/teacher" className="btn-secondary text-xs flex items-center space-x-1.5">
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
              <span>2. Enter Marks (Teacher)</span>
            </Link>
            <Link href="/academic" className="btn-secondary text-xs flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>3. Approve & Publish (Headmaster)</span>
            </Link>
            <Link href="/student" className="btn-secondary text-xs flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              <span>4. View Report Card (Student)</span>
            </Link>
          </div>
        </div>

        {/* The End-to-End Lifecycle Roadmap */}
        <div className="space-y-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
              <span>The Complete Operational Pipeline (Steps 1 → 6)</span>
            </h2>
            <span className="text-xs text-slate-500">Configurable for any country</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lifecycleSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-black text-slate-300 font-mono group-hover:text-blue-600 transition-colors">
                        {step.step}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{step.title}</h3>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Actor: <span className="text-slate-700">{step.actor}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <Link
                      href={step.href}
                      className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      <span>{step.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Tenant Configuration Demonstration Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-5xl mx-auto shadow-sm">
          <div className="flex items-center space-x-2 font-bold text-sm text-slate-900 mb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Currently Active Institutional Demonstration Profile:</span>
          </div>

          {activeInstitution === 'SECONDARY' ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-blue-900 gap-3">
              <div>
                <span className="font-bold block text-sm">Kilimanjaro Secondary School (Moshi, Tanzania)</span>
                <span className="text-blue-700">Model: Secondary School • Forms 1 to 4 • Terms (2 per year) • Position Ranking: Enabled • Clearance Hold: Disabled</span>
              </div>
              <span className="px-2.5 py-1 bg-white border border-blue-300 rounded-md font-semibold text-blue-800 self-start sm:self-auto">
                Tanzania Secondary Pack
              </span>
            </div>
          ) : (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-purple-900 gap-3">
              <div>
                <span className="font-bold block text-sm">Lake Victoria Institute of Technology (Mwanza, Tanzania)</span>
                <span className="text-purple-700">Model: College / University • Semesters • Credits & GPA • Position Ranking: Disabled • Clearance Hold: Required</span>
              </div>
              <span className="px-2.5 py-1 bg-white border border-purple-300 rounded-md font-semibold text-purple-800 self-start sm:self-auto">
                Higher Education Pack
              </span>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>Universal Education Management Platform • Enterprise Multi-Tenant Digital Operating System</p>
      </footer>
    </div>
  );
}
