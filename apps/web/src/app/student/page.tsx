'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  QrCode,
  Download,
  DollarSign,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';

export default function StudentPortal() {
  const [isFinanciallyHeld, setIsFinanciallyHeld] = useState(false);

  const sidebarItems = [
    { name: 'My Academic Profile', href: '/student', icon: GraduationCap },
    { name: 'Official Report Cards', href: '/student', icon: Award, badge: 'Live' },
    { name: 'Class Timetable', href: '/student', icon: Calendar },
    { name: 'Attendance Records', href: '/student', icon: BookOpen },
    { name: 'Fee Statements', href: '/student', icon: DollarSign },
  ];

  return (
    <DashboardShell
      roleTitle="Student Portal"
      userName="Kelvin Shirima"
      userRole="Form 1A (STU-2026-0001)"
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        {/* Header with Demo Clearance Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800/60 gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Student 360° Academic Record</h1>
            <p className="text-xs text-slate-400">
              Verified examination marks, cumulative grade points, and institutional clearance.
            </p>
          </div>
          <button
            onClick={() => setIsFinanciallyHeld(!isFinanciallyHeld)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
          >
            Demo Policy Test: {isFinanciallyHeld ? 'Release Financial Hold' : 'Simulate Unpaid Balance'}
          </button>
        </div>

        {/* Student Profile Overview Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-purple-500/20">
            KS
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h2 className="text-xl font-bold text-white">Kelvin Shirima</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active Student
              </span>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Student ID: <span className="font-mono text-slate-200">STU-2026-0001</span> • Admission No: <span className="font-mono text-slate-200">ADM-26-01</span></p>
              <p>Class: <span className="text-slate-200 font-semibold">Form 1 Stream A</span> • Academic Year: <span className="text-slate-200 font-semibold">2026</span></p>
              <p>Guardian: <span className="text-slate-200 font-semibold">Joseph Shirima (Father — Verified)</span></p>
            </div>
          </div>
        </div>

        {/* Financial Clearance Hold Banner */}
        {isFinanciallyHeld ? (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 shadow-lg space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>Results Held — Institutional Financial Clearance Required</span>
            </div>
            <p className="text-xs text-amber-300/90 leading-relaxed">
              Your official examination results for Term 1 Mid-Term have been officially approved by the Headmaster, but are held in accordance with the institution&apos;s financial policy.
            </p>
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs">
              <span>Outstanding Term Balance: <strong className="text-amber-400 font-mono">TZS 180,000</strong></span>
              <span className="text-blue-400 font-semibold">Please settle with Bursar</span>
            </div>
          </div>
        ) : (
          /* Official Verified Report Card */
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  Official Academic Report
                </span>
                <h3 className="text-lg font-bold text-white">Term 1 Mid-Term Examination 2026</h3>
                <p className="text-xs text-slate-400">Approved and Published by Headmaster Amina Mollel</p>
              </div>
              <button className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5 transition-colors self-start sm:self-auto">
                <Download className="w-3.5 h-3.5" />
                <span>Download Verified PDF</span>
              </button>
            </div>

            {/* Performance KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-900/40 border-b border-slate-800/80 text-center">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Overall Average</span>
                <span className="text-2xl font-black text-blue-400">88.0%</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Class Rank / Position</span>
                <span className="text-2xl font-black text-white flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-400 mr-1" />
                  #2 / 4
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Grade Point (GPA)</span>
                <span className="text-2xl font-black text-emerald-400">5.0 / 5.0</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Academic Status</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full inline-block mt-1">
                  Distinction
                </span>
              </div>
            </div>

            {/* Subject Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-900/60">
                  <tr>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3 text-center">Raw Mark</th>
                    <th className="px-6 py-3 text-center">Max</th>
                    <th className="px-6 py-3 text-center">Grade</th>
                    <th className="px-6 py-3 text-center">Points</th>
                    <th className="px-6 py-3 text-center">Position</th>
                    <th className="px-6 py-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span>Physics (PHY)</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-400 text-sm">88</td>
                    <td className="px-6 py-4 text-center text-slate-500">100</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        A
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-200">5.0</td>
                    <td className="px-6 py-4 text-center font-bold text-white">#2</td>
                    <td className="px-6 py-4 text-slate-400">Excellent grasp of fundamental principles.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Digital Verification Bar */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-blue-400" />
                <span>Verified Official Document • Token: <span className="font-mono text-slate-300">TZ-DOC-2026-991A</span></span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Audited & Signed</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
