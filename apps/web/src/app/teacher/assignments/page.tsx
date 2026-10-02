'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Award,
  AlertCircle,
  Eye,
  Check,
  X,
  Sparkles,
  BookOpen,
  Filter,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

interface Assignment {
  id: string;
  title: string;
  className: string;
  subject: string;
  dueDate: string;
  totalPoints: number;
  description: string;
  submittedCount: number;
  totalPupils: number;
  status: 'ACTIVE' | 'DUE_SOON' | 'CLOSED' | 'MARKED';
  submissions: {
    pupilId: string;
    pupilName: string;
    submittedAt: string;
    score?: number;
    feedback?: string;
    isReviewed: boolean;
  }[];
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    title: 'Mazoezi ya Sehemu na Desimali (Fractions & Decimals Exercise)',
    className: 'Standard 6 (Grade 6)',
    subject: 'Mathematics (Hisabati)',
    dueDate: '2026-03-30',
    totalPoints: 20,
    description: 'Kutatua maswali 10 ya kubadili sehemu kuwa desimali na kutafuta viwango vya asilimia kutoka kitabu uk. 42.',
    submittedCount: 32,
    totalPupils: 35,
    status: 'ACTIVE',
    submissions: [
      { pupilId: 'p6-01', pupilName: 'Rashid Hamisi', submittedAt: '2026-03-27 10:15', score: 18, feedback: 'Kazi safi sana!', isReviewed: true },
      { pupilId: 'p6-02', pupilName: 'Amina Salum', submittedAt: '2026-03-27 11:20', score: 20, feedback: 'Majibu yote ni sahihi na hatua zimeeleweka.', isReviewed: true },
      { pupilId: 'p6-03', pupilName: 'Frank Leonard', submittedAt: '2026-03-28 08:45', score: 15, feedback: 'Zingatia kubadili desimali vizuri kwenye swali la 4.', isReviewed: true },
      { pupilId: 'p6-04', pupilName: 'Grace Mlay', submittedAt: '2026-03-28 09:10', isReviewed: false },
      { pupilId: 'p6-05', pupilName: 'Baraka Juma Mshana', submittedAt: '2026-03-28 14:00', isReviewed: false },
    ],
  },
  {
    id: 'asg-02',
    title: 'Ripoti Fupi: Mfumo wa Upumuaji wa Binadamu (Respiratory System)',
    className: 'Standard 6 (Grade 6)',
    subject: 'Science & Technology (Sayansi)',
    dueDate: '2026-04-02',
    totalPoints: 25,
    description: 'Kuchora mchoro wa mfumo wa upumuaji na kueleza kazi ya pafu na mapafu ya hewa kwenye daftari la mazoezi.',
    submittedCount: 28,
    totalPupils: 35,
    status: 'ACTIVE',
    submissions: [
      { pupilId: 'p6-01', pupilName: 'Rashid Hamisi', submittedAt: '2026-03-28 13:00', isReviewed: false },
      { pupilId: 'p6-02', pupilName: 'Amina Salum', submittedAt: '2026-03-28 15:30', isReviewed: false },
    ],
  },
  {
    id: 'asg-03',
    title: 'Insha ya Simulizi: Safari ya Kutembelea Hifadhi ya Taifa',
    className: 'Standard 7 (Grade 7)',
    subject: 'Kiswahili',
    dueDate: '2026-03-25',
    totalPoints: 30,
    description: 'Andika insha ya maneno 200 hadi 250 ukizingatia alama za uandishi, aya sahihi na lugha fasaha ya Kiswahili.',
    submittedCount: 15,
    totalPupils: 15,
    status: 'MARKED',
    submissions: [
      { pupilId: 'p7-01', pupilName: 'Daudi Emanuel', submittedAt: '2026-03-24 11:00', score: 28, feedback: 'Insha ya kuvutia sana.', isReviewed: true },
      { pupilId: 'p7-02', pupilName: 'Agnes Joseph', submittedAt: '2026-03-24 14:20', score: 26, feedback: 'Uandishi mzuri wa mtiririko.', isReviewed: true },
    ],
  },
];

export default function AssignmentsPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(INITIAL_ASSIGNMENTS[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Review Modal State
  const [activeReviewIndex, setActiveReviewIndex] = useState<number | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  // Create Form State
  const [newTitle, setNewTitle] = useState('');
  const [newClass, setNewClass] = useState('Standard 6 (Grade 6)');
  const [newSubject, setNewSubject] = useState('Mathematics (Hisabati)');
  const [newDueDate, setNewDueDate] = useState('2026-04-05');
  const [newPoints, setNewPoints] = useState(20);
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }
  }, []);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      notifyUser('warning', 'Jina Linahitajika', 'Tafadhali jaza jina au mada ya zoezi.');
      return;
    }

    const created: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle.trim(),
      className: newClass,
      subject: newSubject,
      dueDate: newDueDate,
      totalPoints: Number(newPoints),
      description: newDescription.trim() || 'Zoezi la darasani kulingana na muhtasari wa somo.',
      submittedCount: 0,
      totalPupils: newClass.includes('7') ? 15 : 35,
      status: 'ACTIVE',
      submissions: [],
    };

    setAssignments([created, ...assignments]);
    setSelectedAssignment(created);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');

    notifyUser(
      'success',
      'Zoezi Limeundwa Kikamilifu!',
      `Zoezi "${created.title}" kwa darasa la ${created.className} limepangiwa na kuwekwa wazi kwa wanafunzi.`
    );
  };

  const handleSaveReview = () => {
    if (!selectedAssignment || activeReviewIndex === null) return;

    const updatedSubmissions = [...selectedAssignment.submissions];
    updatedSubmissions[activeReviewIndex] = {
      ...updatedSubmissions[activeReviewIndex],
      score: scoreInput,
      feedback: feedbackInput,
      isReviewed: true,
    };

    const updatedAssignment = {
      ...selectedAssignment,
      submissions: updatedSubmissions,
      status: updatedSubmissions.every((s) => s.isReviewed) ? ('MARKED' as const) : selectedAssignment.status,
    };

    setSelectedAssignment(updatedAssignment);
    setAssignments((prev) => prev.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a)));
    setActiveReviewIndex(null);

    notifyUser(
      'success',
      'Alama Zimehifadhiwa!',
      `Kazi ya ${updatedSubmissions[activeReviewIndex].pupilName} imesahihishwa (Alama: ${scoreInput}/${selectedAssignment.totalPoints}).`
    );
  };

  const openReviewModal = (index: number) => {
    if (!selectedAssignment) return;
    const sub = selectedAssignment.submissions[index];
    setActiveReviewIndex(index);
    setScoreInput(sub.score !== undefined ? sub.score : selectedAssignment.totalPoints - 2);
    setFeedbackInput(sub.feedback || 'Kazi nzuri, endelea kufanya bidii darasani.');
  };

  return (
    <TeacherShell
      pageTitle="Mazoezi & Kazi za Darasani (Assignments / Activities)"
      pageDescription="Andaa mazoezi ya darasani, pokea kazi za wanafunzi, sahihisha na weka alama kwenye rekodi za tathmini."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Header / Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Usimamizi wa Kazi za Wanafunzi (Class Activities)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Jumla ya Mazoezi: {assignments.length} • Mazoezi Yasiyokamilika Kusahihishwa:{' '}
              {assignments.filter((a) => a.status === 'ACTIVE').length}
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tunga Zoezi Jipya (Create Activity)</span>
          </button>
        </div>

        {/* Two Column Layout: Assignment List & Submissions View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: List of Assignments */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">
              Orodha ya Mazoezi (Assignments List):
            </h3>

            {assignments.map((asg) => {
              const isSelected = selectedAssignment?.id === asg.id;
              const submissionPct = Math.round((asg.submittedCount / asg.totalPupils) * 100);

              return (
                <div
                  key={asg.id}
                  onClick={() => setSelectedAssignment(asg)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {asg.subject.split(' ')[0]}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        asg.status === 'MARKED'
                          ? 'bg-blue-100 text-blue-800'
                          : asg.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {asg.status === 'MARKED' ? 'Imesahihishwa' : 'Inaendelea'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-snug">{asg.title}</h4>
                    <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                      {asg.className} • Alama {asg.totalPoints}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mwisho: {asg.dueDate}</span>
                    </span>
                    <span className="font-bold text-emerald-800">
                      {asg.submittedCount}/{asg.totalPupils} ({submissionPct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: Selected Assignment Submissions & Review */}
          <div className="lg:col-span-2 space-y-4">
            {selectedAssignment ? (
              <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                        {selectedAssignment.subject}
                      </span>
                      <span className="text-xs font-bold text-slate-500">• {selectedAssignment.className}</span>
                    </div>
                    <h2 className="text-base font-black text-slate-900 mt-1">{selectedAssignment.title}</h2>
                    <p className="text-xs text-slate-600 mt-1">{selectedAssignment.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Alama za Juu</span>
                    <span className="text-xl font-black text-emerald-800">{selectedAssignment.totalPoints} Pts</span>
                  </div>
                </div>

                {/* Submissions Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      Kazi Zilizowasilishwa na Wanafunzi (Submissions):
                    </h3>
                    <span className="text-xs font-bold text-emerald-700">
                      {selectedAssignment.submissions.length} Zimepokelewa
                    </span>
                  </div>

                  {selectedAssignment.submissions.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-500 text-xs">
                      Bado wanafunzi hawajawasilisha kazi ya zoezi hili. Wanafunzi wakituma itaonekana hapa.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Jina la Mwanafunzi</th>
                            <th className="py-2.5 px-3">Muda wa Kutuma</th>
                            <th className="py-2.5 px-3 text-center">Alama</th>
                            <th className="py-2.5 px-3">Maoni (Feedback)</th>
                            <th className="py-2.5 px-3 text-center">Hali</th>
                            <th className="py-2.5 px-3 text-right">Kitendo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {selectedAssignment.submissions.map((sub, idx) => (
                            <tr key={sub.pupilId} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{sub.pupilName}</td>
                              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{sub.submittedAt}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-emerald-800">
                                {sub.score !== undefined ? `${sub.score} / ${selectedAssignment.totalPoints}` : '-'}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-[180px] truncate">
                                {sub.feedback || 'Inasubiri kusahihishwa'}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    sub.isReviewed
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {sub.isReviewed ? 'Imesahihishwa' : 'Bado'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => openReviewModal(idx)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 transition-colors"
                                >
                                  {sub.isReviewed ? 'Rekebisha' : 'Sahihisha &rarr;'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Record Performance to Marks button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Kazi zilizosahihishwa zinaweza kuunganishwa moja kwa moja kwenye alama za mwezi.
                  </span>
                  <Link
                    href={`/teacher/marks?class=${encodeURIComponent(selectedAssignment.className)}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Peleka Kwenye Alama za Mwezi &rarr;</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 text-slate-500">
                Chagua zoezi kutoka orodha upande wa kushoto ili kuona kazi zilizowasilishwa.
              </div>
            )}
          </div>
        </div>

        {/* Modal: Create Activity / Assignment */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-black text-slate-900">Tunga Zoezi Jipya la Darasani</h3>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mada / Jina la Zoezi:</label>
                  <input
                    type="text"
                    required
                    placeholder="Mfano: Mazoezi ya Mfumo wa Upumuaji"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Darasa:</label>
                    <select
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="Standard 6 (Grade 6)">Standard 6 (Grade 6)</option>
                      <option value="Standard 7 (Grade 7)">Standard 7 (Grade 7)</option>
                      <option value="Standard 5 (Grade 5)">Standard 5 (Grade 5)</option>
                      <option value="Standard 4 (Grade 4)">Standard 4 (Grade 4)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Somo:</label>
                    <select
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="Mathematics (Hisabati)">Mathematics (Hisabati)</option>
                      <option value="Science & Technology (Sayansi)">Science & Technology (Sayansi)</option>
                      <option value="English Language">English Language</option>
                      <option value="Kiswahili">Kiswahili</option>
                      <option value="Civic & Moral Education (Uraia)">Civic & Moral Education (Uraia)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tarehe ya Mwisho (Due Date):</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jumla ya Alama (Max Score):</label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={newPoints}
                      onChange={(e) => setNewPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Maelekezo ya Zoezi (Instructions):</label>
                  <textarea
                    rows={3}
                    placeholder="Weka maelekezo ya maswali au kurasa za kitabu..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs"
                  >
                    Hifadhi & Panga Zoezi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Mark / Review Submission */}
        {activeReviewIndex !== null && selectedAssignment && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Sahihisha: {selectedAssignment.submissions[activeReviewIndex].pupilName}
                  </h3>
                  <span className="text-[11px] text-slate-500">{selectedAssignment.title}</span>
                </div>
                <button onClick={() => setActiveReviewIndex(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alama Aliyopata (Kati ya {selectedAssignment.totalPoints}):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={selectedAssignment.totalPoints}
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-base font-black text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Maoni ya Mwalimu (Feedback Comments):</label>
                  <textarea
                    rows={3}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Weka maoni ya kumwelekeza au kumpongeza mwanafunzi..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveReviewIndex(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveReview}
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs"
                  >
                    Hifadhi Usahihishaji
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
