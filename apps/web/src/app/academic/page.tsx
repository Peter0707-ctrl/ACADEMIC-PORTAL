'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  ArrowLeft,
  Calendar,
  School,
  TrendingUp,
  Award,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';

interface StudentResultReview {
  id: string;
  studentNumber: string;
  name: string;
  rawMark: number;
  grade?: string;
  gradePoints?: number;
  position?: number;
}

export default function AcademicApproverPortal() {
  const [scheduleId, setScheduleId] = useState('demo-schedule-01');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'PENDING_REVIEW' | 'APPROVED' | 'RETURNED' | 'PUBLISHED'>('PENDING_REVIEW');
  const [approvalMessage, setApprovalMessage] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [publishDate, setPublishDate] = useState('');

  const [students, setStudents] = useState<StudentResultReview[]>([
    { id: '1', studentNumber: 'STU-2026-0002', name: 'Massawe, Neema', rawMark: 94 },
    { id: '2', studentNumber: 'STU-2026-0001', name: 'Shirima, Kelvin', rawMark: 88 },
    { id: '3', studentNumber: 'STU-2026-0004', name: 'Hassan, Fatma', rawMark: 88 },
    { id: '4', studentNumber: 'STU-2026-0003', name: 'Bakari, Juma', rawMark: 72 },
  ]);

  const handleApprove = async () => {
    setLoading(true);
    setApprovalMessage(null);

    try {
      await api.results.approve(scheduleId, 'APPROVED', 'Approved by Headmaster / Academic Master');

      // Simulate client-side calculation engine response for interactive view
      setStudents([
        { id: '1', studentNumber: 'STU-2026-0002', name: 'Massawe, Neema', rawMark: 94, grade: 'A', gradePoints: 5.0, position: 1 },
        { id: '2', studentNumber: 'STU-2026-0001', name: 'Shirima, Kelvin', rawMark: 88, grade: 'A', gradePoints: 5.0, position: 2 },
        { id: '3', studentNumber: 'STU-2026-0004', name: 'Hassan, Fatma', rawMark: 88, grade: 'A', gradePoints: 5.0, position: 2 },
        { id: '4', studentNumber: 'STU-2026-0003', name: 'Bakari, Juma', rawMark: 72, grade: 'B', gradePoints: 4.0, position: 4 },
      ]);

      setStatus('APPROVED');
      setApprovalMessage('Results approved! Grading and Standard Competition Ranking (1, 2, 2, 4) computed.');
    } catch (err: any) {
      setApprovalMessage(err.message || 'Approval processed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!returnReason.trim()) {
      alert('Please enter a reason for returning the results');
      return;
    }
    setLoading(true);
    try {
      await api.results.approve(scheduleId, 'RETURNED_FOR_CORRECTION', returnReason);
      setStatus('RETURNED');
      setShowReturnModal(false);
      setApprovalMessage(`Results returned to teacher with note: "${returnReason}"`);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNow = async () => {
    setLoading(true);
    try {
      await api.results.schedulePublication(scheduleId, new Date().toISOString());
      setStatus('PUBLISHED');
      setApprovalMessage('Results have been published and are now visible in the Student and Parent portals!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block leading-tight">Academic Approver Dashboard</span>
              <span className="text-xs text-slate-500">Academic Master & Headmaster Review Panel</span>
            </div>
          </div>
          <div>
            {status === 'PUBLISHED' && <span className="badge-approved">Published Live</span>}
            {status === 'APPROVED' && <span className="badge-approved">Approved (Ready to Publish)</span>}
            {status === 'PENDING_REVIEW' && <span className="badge-pending">Pending Review</span>}
            {status === 'RETURNED' && <span className="badge-held">Returned to Teacher</span>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Notification Banner */}
        {approvalMessage && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span>{approvalMessage}</span>
          </div>
        )}

        {/* Submission Overview Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">Form 1</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Physics (PHY)</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700">Term 1 Mid-Term 2026</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Submitted by: Baraka Mrema (Physics Master)</h2>
              <p className="text-xs text-slate-500">Submission Timestamp: 2026-09-29 10:45 AM • 4 Enrolled Candidates</p>
            </div>

            {/* Approver Actions */}
            <div className="flex items-center space-x-3">
              {status === 'PENDING_REVIEW' && (
                <>
                  <button
                    onClick={() => setShowReturnModal(true)}
                    disabled={loading}
                    className="btn-secondary text-red-600 hover:bg-red-50 flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Return for Correction</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={loading}
                    className="btn-success flex items-center space-x-1"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Approve & Compute Ranks</span>
                  </button>
                </>
              )}

              {status === 'APPROVED' && (
                <button
                  onClick={handlePublishNow}
                  disabled={loading}
                  className="btn-primary flex items-center space-x-1"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish to Students & Parents Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Class Average</span>
              <span className="text-2xl font-bold text-slate-900">85.5%</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Highest Mark</span>
              <span className="text-2xl font-bold text-green-600">94 / 100</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Pass Rate</span>
              <span className="text-2xl font-bold text-blue-600">100%</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Pass Mark Threshold</span>
              <span className="text-2xl font-bold text-slate-900">40.0</span>
            </div>
          </div>
        </div>

        {/* Results Review & Grading Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Official Candidate Marks & Computed Ranks</h3>
            <span className="text-xs text-slate-500">Ranking Rule: Standard Competition (1, 2, 2, 4)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Student ID</th>
                  <th className="px-6 py-3 text-left">Full Name</th>
                  <th className="px-6 py-3 text-left">Raw Mark</th>
                  <th className="px-6 py-3 text-left">Computed Grade</th>
                  <th className="px-6 py-3 text-left">Grade Points</th>
                  <th className="px-6 py-3 text-left">Rank / Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {students.map((s) => (
                  <tr key={s.studentNumber} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-mono font-medium text-slate-900">{s.studentNumber}</td>
                    <td className="px-6 py-3 text-slate-800">{s.name}</td>
                    <td className="px-6 py-3 font-bold text-slate-900">{s.rawMark}</td>
                    <td className="px-6 py-3">
                      {s.grade ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${s.grade === 'A' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {s.grade}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Pending Approval</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-600 font-semibold">{s.gradePoints ? s.gradePoints.toFixed(1) : '—'}</td>
                    <td className="px-6 py-3">
                      {s.position ? (
                        <span className="font-bold text-slate-900 flex items-center">
                          {s.position === 1 && <Award className="w-4 h-4 text-amber-500 mr-1" />}
                          #{s.position} / 4
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Return Reason Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Return Results to Teacher</h3>
            <p className="text-xs text-slate-600">
              Specify the reason for returning this result set. The teacher will be notified to make corrections and resubmit.
            </p>
            <textarea
              rows={3}
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="e.g. Please verify Fatma Hassan's mark against practical sheet..."
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowReturnModal(false)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button onClick={handleReturn} className="btn-primary bg-red-600 hover:bg-red-700 text-xs">
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
