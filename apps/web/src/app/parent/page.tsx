'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Award,
  BookOpen,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  School,
} from 'lucide-react';

interface Child {
  id: string;
  name: string;
  studentId: string;
  admissionNo: string;
  class: string;
  institution: string;
  average: number;
  rank: string;
  gpa: number;
}

export default function ParentPortal() {
  const children: Child[] = [
    {
      id: 'STU-2026-0001',
      name: 'Kelvin Shirima',
      studentId: 'STU-2026-0001',
      admissionNo: 'ADM-26-01',
      class: 'Form 1A',
      institution: 'Kilimanjaro Secondary School',
      average: 88.0,
      rank: '#2 / 4',
      gpa: 5.0,
    },
    {
      id: 'STU-2026-0002',
      name: 'Neema Shirima',
      studentId: 'STU-2026-0002',
      admissionNo: 'ADM-26-02',
      class: 'Form 3B',
      institution: 'Kilimanjaro Secondary School',
      average: 94.0,
      rank: '#1 / 4',
      gpa: 5.0,
    },
  ];

  const [selectedChild, setSelectedChild] = useState<Child>(children[0]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block leading-tight">Parent & Guardian Portal</span>
              <span className="text-xs text-slate-500">Verified Ward Monitoring & Academic Reports</span>
            </div>
          </div>
          <div>
            <span className="badge-approved text-xs">Guardian Identity Verified</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Child Switcher Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Your Children:</span>
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedChild.id === child.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {child.name} ({child.class})
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">Institution: {selectedChild.institution}</span>
        </div>

        {/* Selected Child Academic Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="badge-draft text-xs">{selectedChild.class}</span>
                <span className="badge-approved text-xs">Good Standing</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedChild.name}</h2>
              <p className="text-xs text-slate-500">
                Student ID: <span className="font-mono text-slate-800">{selectedChild.studentId}</span> • Admission: <span className="font-mono text-slate-800">{selectedChild.admissionNo}</span>
              </p>
            </div>
            <button className="btn-secondary text-xs flex items-center space-x-1.5 self-start sm:self-auto">
              <Download className="w-4 h-4" />
              <span>Download Official Report</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Average Score</span>
              <span className="text-2xl font-bold text-blue-600">{selectedChild.average}%</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Class Position</span>
              <span className="text-2xl font-bold text-slate-900 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-500 mr-1" />
                {selectedChild.rank}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Attendance</span>
              <span className="text-2xl font-bold text-green-600">96.4%</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Fee Clearance</span>
              <span className="text-sm font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full inline-block mt-1">
                Cleared (TZS 0)
              </span>
            </div>
          </div>
        </div>

        {/* Recent Examination Results */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Term 1 Official Results</h3>
            <span className="text-xs text-slate-500">Released by Institution</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Subject</th>
                  <th className="px-6 py-3 text-center">Score</th>
                  <th className="px-6 py-3 text-center">Grade</th>
                  <th className="px-6 py-3 text-center">Position</th>
                  <th className="px-6 py-3 text-left">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Physics</span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-900">{selectedChild.average}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">A</span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-900">{selectedChild.rank}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">Outstanding commitment and analytical aptitude.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
