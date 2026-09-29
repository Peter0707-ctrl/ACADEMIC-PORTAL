'use client';

import Link from 'next/link';
import {
  GraduationCap,
  School,
  BookOpen,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  Calendar,
  DollarSign,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {
  const portals = [
    {
      title: 'Teacher & Lecturer Portal',
      description: 'Record marks, download templates, upload Excel spreadsheets, and submit results.',
      href: '/teacher',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Academic Master & Approver',
      description: 'Review submissions, approve grades, compute class rankings, and schedule publication.',
      href: '/academic',
      icon: ShieldCheck,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Student 360° Portal',
      description: 'View verified examination report cards, track grades, position, and academic history.',
      href: '/student',
      icon: GraduationCap,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Parent & Guardian Portal',
      description: 'Access verified children profiles, academic performance, report cards, and notices.',
      href: '/parent',
      icon: Users,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 block leading-tight">Universal Academic Portal</span>
              <span className="text-xs text-slate-500 font-medium">Digital Institutional Operating System</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Tenant • Country-Agnostic • Auditable</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Unified Digital Operating System for Education
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            One engine powering Primary, Secondary, Colleges, and Universities with zero hard-coded rules.
            Select a portal to explore the Reference Vertical Slice.
          </p>
        </div>

        {/* Portal Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Link
                key={portal.title}
                href={portal.href}
                className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all rounded-2xl p-6 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${portal.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{portal.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{portal.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                  <span>Open Portal</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Vertical Slice Feature Checklist */}
        <div className="mt-16 bg-white border border-slate-200 rounded-2xl p-8 max-w-4xl mx-auto shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span>First Production Vertical Slice — Active Modules</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Institution Setup & Tenant Configuration</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Dynamic Excel Marks Template Generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>14-Point Server-Side Row Validation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Academic Master / Headmaster Approval</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Standard Competition Ranking (1224) & Grading</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Scheduled Publication Engine</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Student & Verified Parent Result Portals</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Financial Clearance Guard & Audit Logging</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>Universal Education Management Platform • Enterprise Modular Monolith Architecture</p>
      </footer>
    </div>
  );
}
