'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  QrCode,
  Download,
  BookOpen,
} from 'lucide-react';

export default function StudentPortal() {
  const [isFinanciallyHeld, setIsFinanciallyHeld] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block leading-tight">Student 360° Portal</span>
              <span className="text-xs text-slate-500">Official Academic Records & Results</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFinanciallyHeld(!isFinanciallyHeld)}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              Toggle Demo: {isFinanciallyHeld ? 'Clear Financial Hold' : 'Simulate Fee Hold'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Student Profile Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold border-2 border-purple-200">
            KS
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900">Kelvin Shirima</h2>
              <span className="badge-approved">Active Student</span>
            </div>
            <div className="text-xs text-slate-500 space-y-0.5">
              <p>Student ID: <span className="font-mono font-semibold text-slate-800">STU-2026-0001</span> • Admission No: <span className="font-mono font-semibold text-slate-800">ADM-26-01</span></p>
              <p>Institution: <span className="font-semibold text-slate-800">Kilimanjaro Secondary School</span></p>
              <p>Class: <span className="font-semibold text-slate-800">Form 1 Stream A</span> • Academic Year: <span className="font-semibold text-slate-800">2026</span></p>
            </div>
          </div>
        </div>

        {/* Financial Clearance Hold Alert Banner */}
        {isFinanciallyHeld ? (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-amber-900 font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>Results Held — Financial Clearance Required</span>
            </div>
            <p className="text-sm text-amber-800">
              Your official examination results for Term 1 Mid-Term have been approved by the Headmaster, but are currently held in accordance with the institution&apos;s financial policy.
            </p>
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900 font-medium">
              <span>Outstanding Balance: <strong>TZS 180,000</strong></span>
              <span className="text-blue-600 font-semibold underline cursor-pointer">Contact Bursar Office</span>
            </div>
          </div>
        ) : (
          /* Official Report Card */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-1">
                  Official Academic Report
                </span>
                <h3 className="text-lg font-bold text-slate-900">Term 1 Mid-Term Examination 2026</h3>
                <p className="text-xs text-slate-500">Verified and Published: 2026-09-29 by Headmaster Amina Mollel</p>
              </div>

              <div className="flex items-center space-x-2">
                <button className="btn-secondary text-xs flex items-center space-x-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Report</span>
                </button>
              </div>
            </div>

            {/* Performance Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 border-b border-slate-100 text-center">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">Overall Average</span>
                <span className="text-2xl font-extrabold text-blue-600">88.0%</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">Class Rank / Position</span>
                <span className="text-2xl font-extrabold text-slate-900 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-500 mr-1" />
                  #2 / 4
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">Grade Point Average</span>
                <span className="text-2xl font-extrabold text-green-600">5.0 / 5.0</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">Academic Status</span>
                <span className="text-sm font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full inline-block mt-1">
                  Distinction
                </span>
              </div>
            </div>

            {/* Subject Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-white text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Subject</th>
                    <th className="px-6 py-3 text-center">Raw Mark</th>
                    <th className="px-6 py-3 text-center">Max Mark</th>
                    <th className="px-6 py-3 text-center">Grade</th>
                    <th className="px-6 py-3 text-center">Points</th>
                    <th className="px-6 py-3 text-center">Position</th>
                    <th className="px-6 py-3 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>Physics (PHY)</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">88</td>
                    <td className="px-6 py-4 text-center text-slate-500">100</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        A
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-700">5.0</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">#2</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Excellent grasp of principles</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Security Verification & QR Code Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-slate-600" />
                <span>Digitally Verified Document • Token: <span className="font-mono text-slate-700">DOC-TZ-2026-991A</span></span>
              </div>
              <div className="flex items-center space-x-1 text-green-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Audited & Signed</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
