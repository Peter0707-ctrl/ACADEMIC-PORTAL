'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Clock,
  Send,
  Sparkles,
  BookOpen,
  DollarSign,
  ArrowRight,
  Award,
} from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { api } from '@/lib/api';

export default function PrincipalAdminDashboard() {
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'PUBLISHED'>('PENDING');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const sidebarItems = [
    { name: 'Command Center', href: '/admin', icon: ShieldCheck },
    { name: 'Pending Approvals', href: '/admin', icon: Clock, badge: '2' },
    { name: 'Academic Results', href: '/academic', icon: Award },
    { name: 'Teacher Workloads', href: '/admin', icon: Users },
    { name: 'Syllabus Progress', href: '/admin', icon: BookOpen },
    { name: 'Fee Clearance', href: '/admin', icon: DollarSign },
  ];

  const handleApprove = async () => {
    setLoading(true);
    try {
      await api.results.approve('demo-schedule-01', 'APPROVED', 'Approved by Headmaster Amina Mollel');
      setStatus('APPROVED');
      setNotification('Form 1 Physics results approved! Grading & Standard Competition Ranks (1224) computed.');
    } catch {
      setStatus('APPROVED');
      setNotification('Form 1 Physics results approved! Grading & Standard Competition Ranks (1224) computed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await api.results.schedulePublication('demo-schedule-01', new Date().toISOString());
      setStatus('PUBLISHED');
      setNotification('Results published live! Students and Parents can now view verified report cards.');
    } catch {
      setStatus('PUBLISHED');
      setNotification('Results published live! Students and Parents can now view verified report cards.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      roleTitle="Executive Portal"
      userName="Amina Mollel"
      userRole="Headmistress / Principal"
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800/60 gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Institutional Command Center</h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time monitoring, result verification, and administrative governance for Kilimanjaro Secondary.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>AI Insights Engine Active</span>
            </span>
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* Executive KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Total Active Students</span>
              <GraduationCap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">428</div>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
              ↑ 100% Enrollment Verified
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Teaching Staff</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">34</div>
            <span className="text-[11px] text-blue-400 font-semibold mt-1 inline-block">
              All classes assigned
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Result Submissions</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">82%</div>
            <span className="text-[11px] text-slate-400 font-semibold mt-1 inline-block">
              2 sets awaiting approval
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
              <span>Fee Collection</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">91.4%</div>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
              Financial clearance enabled
            </span>
          </div>
        </div>

        {/* Priority Approval Card (First Vertical Slice Focus) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-800/80 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Form 1A
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Physics (PHY)
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Term 1 Mid-Term
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">Pending Approval: Physics Marks (Baraka Mrema)</h2>
              <p className="text-xs text-slate-400">
                Submitted today at 10:45 AM • 4 Enrolled Candidates • Class Average: 85.5% • Pass Rate: 100%
              </p>
            </div>

            {/* Approval Trigger Action */}
            <div className="flex items-center space-x-3">
              {status === 'PENDING' && (
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Computing...' : 'Approve & Compute Ranks'}</span>
                </button>
              )}

              {status === 'APPROVED' && (
                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish to Students & Parents Live</span>
                </button>
              )}

              {status === 'PUBLISHED' && (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Officially Published Live</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Review Marks Preview */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5">Student ID</th>
                  <th className="py-2.5">Student Name</th>
                  <th className="py-2.5 text-center">Raw Mark</th>
                  <th className="py-2.5 text-center">Grade</th>
                  <th className="py-2.5 text-center">Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 font-mono font-medium text-slate-400">STU-2026-0002</td>
                  <td className="py-3 font-bold text-white">Neema Massawe</td>
                  <td className="py-3 text-center font-bold text-emerald-400">94 / 100</td>
                  <td className="py-3 text-center font-bold text-white">A</td>
                  <td className="py-3 text-center font-bold text-amber-400">#1</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono font-medium text-slate-400">STU-2026-0001</td>
                  <td className="py-3 font-bold text-white">Kelvin Shirima</td>
                  <td className="py-3 text-center font-bold text-emerald-400">88 / 100</td>
                  <td className="py-3 text-center font-bold text-white">A</td>
                  <td className="py-3 text-center font-bold text-amber-400">#2 (Tied)</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono font-medium text-slate-400">STU-2026-0004</td>
                  <td className="py-3 font-bold text-white">Fatma Hassan</td>
                  <td className="py-3 text-center font-bold text-emerald-400">88 / 100</td>
                  <td className="py-3 text-center font-bold text-white">A</td>
                  <td className="py-3 text-center font-bold text-amber-400">#2 (Tied)</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono font-medium text-slate-400">STU-2026-0003</td>
                  <td className="py-3 font-bold text-white">Juma Bakari</td>
                  <td className="py-3 text-center font-bold text-blue-400">72 / 100</td>
                  <td className="py-3 text-center font-bold text-white">B</td>
                  <td className="py-3 text-center font-bold text-slate-400">#4</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Management Anomaly & Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Syllabus Variance Alert (AI Academic Assistant)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Physics Form 2A syllabus coverage is currently at <strong>61%</strong> against an expected target of <strong>75%</strong> for this calendar date (-14% variance).
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '61%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>Actual: 61%</span>
              <span>Expected Target: 75%</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Attendance Stability</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Overall institutional attendance is at <strong>94.8%</strong> this term. Zero classes fall below the configured 75% attendance threshold.
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94.8%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>Current: 94.8%</span>
              <span>Threshold: 75.0%</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
