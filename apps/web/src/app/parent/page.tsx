'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  School,
  Sparkles,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';

interface Child {
  id: string;
  name: string;
  studentId: string;
  class: string;
  average: number;
  rank: string;
  attendance: string;
  feeStatus: string;
}

export default function ParentPortal() {
  const children: Child[] = [
    {
      id: 'STU-2026-0001',
      name: 'Kelvin Shirima',
      studentId: 'STU-2026-0001',
      class: 'Form 1A',
      average: 88.0,
      rank: '#2 / 4',
      attendance: '96.4%',
      feeStatus: 'Cleared (TZS 0 Balance)',
    },
    {
      id: 'STU-2026-0002',
      name: 'Neema Shirima',
      studentId: 'STU-2026-0002',
      class: 'Form 3B',
      average: 94.0,
      rank: '#1 / 4',
      attendance: '98.2%',
      feeStatus: 'Cleared (TZS 0 Balance)',
    },
  ];

  const [selectedChild, setSelectedChild] = useState<Child>(children[0]);

  const sidebarItems = [
    { name: 'My Children', href: '/parent', icon: Users, badge: '2 Verified' },
    { name: 'Academic Reports', href: '/parent', icon: Award },
    { name: 'Attendance Register', href: '/parent', icon: Calendar },
    { name: 'Fee Statements', href: '/parent', icon: DollarSign },
  ];

  return (
    <DashboardShell
      roleTitle="Guardian Portal"
      userName="Joseph Shirima"
      userRole="Verified Parent / Guardian"
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        {/* Child Switcher Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800/60 gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Parent & Guardian Dashboard</h1>
            <p className="text-xs text-slate-400">
              Verified monitoring of academic progress, daily attendance, and financial status for your wards.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Switch Child:</span>
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedChild.id === child.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {child.name} ({child.class})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Ward Profile Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {selectedChild.class}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Good Academic Standing
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{selectedChild.name}</h2>
            <p className="text-xs text-slate-400">
              Student ID: <span className="font-mono text-slate-200">{selectedChild.studentId}</span> • Relationship: <span className="text-slate-200 font-semibold">Father (Institution-Verified)</span>
            </p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5 transition-colors self-start sm:self-auto">
            <Download className="w-4 h-4" />
            <span>Download Term Report</span>
          </button>
        </div>

        {/* Ward Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Term Average</span>
            <span className="text-2xl font-black text-blue-400">{selectedChild.average}%</span>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Class Rank</span>
            <span className="text-2xl font-black text-white flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-400 mr-1" />
              {selectedChild.rank}
            </span>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Attendance Rate</span>
            <span className="text-2xl font-black text-emerald-400">{selectedChild.attendance}</span>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Fee Clearance</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full inline-block mt-1">
              Cleared
            </span>
          </div>
        </div>

        {/* Official Term Results */}
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Term 1 Published Results</h3>
            <span className="text-xs text-slate-400">Published by School Administration</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-900/60">
                <tr>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3 text-center">Score</th>
                  <th className="px-6 py-3 text-center">Grade</th>
                  <th className="px-6 py-3 text-center">Position</th>
                  <th className="px-6 py-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>Physics</span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-400 text-sm">{selectedChild.average}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      A
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-white">{selectedChild.rank}</td>
                  <td className="px-6 py-4 text-slate-400">Outstanding commitment and analytical aptitude.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
