'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Trash2,
  Check,
  X,
  AlertCircle,
  Filter,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount, TeachingLoad } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

const STORAGE_KEY = 'teacher_taught_parts_and_assignments_v2';

interface TaughtLessonAndAssignment {
  id: string;
  className: string;
  subject: string;
  topicCovered: string; // Sehemu / Mada aliyofundisha
  assignmentGiven: string; // Kazi / Zoezi alilotoa
  dateTaught: string; // Tarehe aliyofundisha
  dueDate: string; // Tarehe ya kukusanya
  maxPoints?: number;
  status: 'PENDING' | 'MARKED';
}

const DEFAULT_RECORDS: TaughtLessonAndAssignment[] = [
  {
    id: 'rec-01',
    className: 'Standard 7 (Grade 7)',
    subject: 'Civic & Moral Education (Uraia na Maadili)',
    topicCovered: 'Utawala Bora: Haki na Wajibu wa Raia wa Tanzania (Kitabu Uk. 24–28)',
    assignmentGiven: 'Kazi ya Nyumbani: Kutaja mifano 5 ya haki za kikatiba na wajibu 3 wa raia uk. 29.',
    dateTaught: '2026-03-27',
    dueDate: '2026-03-30',
    maxPoints: 10,
    status: 'MARKED',
  },
  {
    id: 'rec-02',
    className: 'Standard 6 (Grade 6)',
    subject: 'Social Studies (Maarifa ya Jamii)',
    topicCovered: 'Rasilimali za Tanzania: Madini na Misitu ya Asili (Kitabu Uk. 45–50)',
    assignmentGiven: 'Zoezi la Darasani: Ramani ya maeneo ya uchimbaji madini Tanzania na faida zake kiuchumi.',
    dateTaught: '2026-03-28',
    dueDate: '2026-03-31',
    maxPoints: 15,
    status: 'PENDING',
  },
  {
    id: 'rec-03',
    className: 'Standard 7 (Grade 7)',
    subject: 'Civic & Moral Education (Uraia na Maadili)',
    topicCovered: 'Uzalendo na Alama za Taifa: Wimbo wa Taifa na Nembo (Kitabu Uk. 32–36)',
    assignmentGiven: 'Kazi ya Kundi: Kueleza maana ya rangi nne za bendera ya Taifa na nembo ya nchi.',
    dateTaught: '2026-03-29',
    dueDate: '2026-04-02',
    maxPoints: 20,
    status: 'PENDING',
  },
];

export default function AssignmentsPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [teachingLoads, setTeachingLoads] = useState<TeachingLoad[]>([
    { class: 'Standard 7 (Grade 7)', subject: 'Civic & Moral Education (Uraia na Maadili)' },
    { class: 'Standard 6 (Grade 6)', subject: 'Social Studies (Maarifa ya Jamii)' },
  ]);

  const [records, setRecords] = useState<TaughtLessonAndAssignment[]>(DEFAULT_RECORDS);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formLoadIndex, setFormLoadIndex] = useState<number>(0);
  const [formTopicCovered, setFormTopicCovered] = useState('');
  const [formAssignmentGiven, setFormAssignmentGiven] = useState('');
  const [formDateTaught, setFormDateTaught] = useState(new Date().toISOString().split('T')[0]);
  const [formDueDate, setFormDueDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [formMaxPoints, setFormMaxPoints] = useState<number>(10);

  // Load from session and localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      if (session.teachingAssignments && session.teachingAssignments.length > 0) {
        setTeachingLoads(session.teachingAssignments);
      } else if (session.assignedClasses && session.assignedClasses.length > 0) {
        const built = session.assignedClasses.map((cls, idx) => ({
          class: cls,
          subject: (session.subjects && session.subjects[idx]) || 'Civic & Moral Education (Uraia na Maadili)',
        }));
        setTeachingLoads(built);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const saveRecordsToStorage = (updated: TaughtLessonAndAssignment[]) => {
    setRecords(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  };

  // Submit new Taught Part & Assignment
  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopicCovered.trim() || !formAssignmentGiven.trim()) {
      notifyUser('warning', 'Taarifa Zinahitajika', 'Tafadhali jaza sehemu uliyofundisha na zoezi ulilotoa.');
      return;
    }

    const selectedLoad = teachingLoads[formLoadIndex] || teachingLoads[0];
    const newRecord: TaughtLessonAndAssignment = {
      id: `rec-${Date.now()}`,
      className: selectedLoad.class,
      subject: selectedLoad.subject,
      topicCovered: formTopicCovered.trim(),
      assignmentGiven: formAssignmentGiven.trim(),
      dateTaught: formDateTaught,
      dueDate: formDueDate,
      maxPoints: Number(formMaxPoints) || 10,
      status: 'PENDING',
    };

    const updated = [newRecord, ...records];
    saveRecordsToStorage(updated);

    // Reset Form
    setFormTopicCovered('');
    setFormAssignmentGiven('');
    setShowAddModal(false);

    notifyUser(
      'success',
      'Rekodi Imehifadhiwa',
      `Umerekodi sehemu uliyofundisha na zoezi ulilotoa kwa ${selectedLoad.subject} (${selectedLoad.class}).`
    );
  };

  // Toggle Status (Marked / Pending)
  const handleToggleStatus = (id: string) => {
    const updated = records.map((r) => {
      if (r.id === id) {
        const nextStatus: 'PENDING' | 'MARKED' = r.status === 'PENDING' ? 'MARKED' : 'PENDING';
        return { ...r, status: nextStatus };
      }
      return r;
    });
    saveRecordsToStorage(updated);
    notifyUser('info', 'Hali ya Zoezi Imebadilishwa', 'Hali ya masahihisho imesasishwa kikamilifu.');
  };

  // Delete Record
  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    saveRecordsToStorage(updated);
    notifyUser('info', 'Rekodi Imeondolewa', 'Zoezi na sehemu iliyofundishwa vimeondolewa kwenye orodha.');
  };

  // Filter records by subject
  const filteredRecords = records.filter((r) => {
    if (selectedSubjectFilter === 'ALL') return true;
    return `${r.className} - ${r.subject}` === selectedSubjectFilter;
  });

  return (
    <TeacherShell
      pageTitle="Sehemu Zilizofundishwa & Mazoezi (Taught Topics & Assignments)"
      pageDescription="Rekodi rasmi ya sehemu uliyofundisha na kazi/zoezi ulilotoa kwa kila somo unalofundisha."
    >
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-800" />
              <h2 className="text-lg font-black text-slate-900">
                Sehemu Nilizofundisha na Mazoezi Niliyotoa
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mwalimu: <strong className="text-emerald-950 font-bold">{currentUser?.fullName || 'Mwl. Augustine Mrosso'}</strong> • Andika sehemu uliyofundisha na zoezi ulilotoa kwa kila somo lako
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>+ Rekodi Somo & Zoezi Ulilotoa</span>
          </button>
        </div>

        {/* Filter by Teacher's Assigned Subjects */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold px-2">
            <Filter className="w-3.5 h-3.5 text-emerald-800" />
            <span>Chuja kwa Somo:</span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedSubjectFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              selectedSubjectFilter === 'ALL'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Masomo Yote ({records.length})
          </button>

          {teachingLoads.map((load) => {
            const key = `${load.class} - ${load.subject}`;
            const count = records.filter(
              (r) => r.className === load.class && r.subject === load.subject
            ).length;
            const isSelected = selectedSubjectFilter === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedSubjectFilter(key)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{load.subject}</span>
                <span className="text-[10px] opacity-80 font-mono">({load.class})</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* List of Taught Lessons & Assignments */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-800">Hamna Rekodi Iliyowekwa Bado</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Bofya kitufe cha <strong>"+ Rekodi Somo & Zoezi Ulilotoa"</strong> hapo juu kuandika sehemu uliyofundisha na zoezi ulilowapa wanafunzi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRecords.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header: Class & Subject */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-800 text-white font-bold text-xs shadow-xs">
                      {item.subject}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs border border-slate-200">
                      {item.className}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        item.status === 'MARKED'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      }`}
                    >
                      {item.status === 'MARKED' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Imesahihishwa</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Inasubiri Sahihisho</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(item.id)}
                      title="Ondoa rekodi hii"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2 Main Columns: Part Taught & Assignment Given */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sehemu Iliyofundishwa */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                    <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>Sehemu / Mada Niliyofundisha:</span>
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      {item.topicCovered}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Ilifundishwa: {item.dateTaught}</span>
                    </div>
                  </div>

                  {/* Kazi / Zoezi Lililotolewa */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                    <span className="text-[11px] font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-700" />
                      <span>Kazi / Zoezi Nililotoa:</span>
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      {item.assignmentGiven}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1">
                      <span className="flex items-center gap-1 text-amber-900">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Mwisho wa Kuwasilisha: {item.dueDate}</span>
                      </span>
                      {item.maxPoints && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 font-black text-[10px]">
                          Alama: {item.maxPoints} Pts
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Rekodi Sehemu Iliyofundishwa na Zoezi */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-800" />
                  <h3 className="text-base font-black text-slate-900">
                    Rekodi Sehemu Uliyofundisha na Zoezi Ulilotoa
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddRecord} className="space-y-4">
                {/* 1. Chagua Somo na Darasa */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    1. Chagua Somo na Darasa Unalofundisha:
                  </label>
                  <select
                    value={formLoadIndex}
                    onChange={(e) => setFormLoadIndex(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-emerald-800 bg-white"
                  >
                    {teachingLoads.map((load, idx) => (
                      <option key={`${load.class}-${load.subject}-${idx}`} value={idx}>
                        {load.subject} — {load.class}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Sehemu / Mada Uliyofundisha */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    2. Sehemu / Mada Uliyofundisha (Topic/Part Covered):
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Mfano: Mfumo wa Upumuaji wa Binadamu: Kazi ya Mapafu na Pua (Kitabu Uk. 42-45)..."
                    value={formTopicCovered}
                    onChange={(e) => setFormTopicCovered(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* 3. Kazi / Zoezi Ulilotoa */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    3. Kazi / Zoezi Ulilotoa (Assignment/Activity Given):
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Mfano: Maswali 5 ya kitabu ukurasa 46, kuchora mchoro wa mfumo wa hewa kwenye daftari..."
                    value={formAssignmentGiven}
                    onChange={(e) => setFormAssignmentGiven(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* 4. Tarehe za Kufundisha na Kukusanya */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Tarehe Uliyofundisha:
                    </label>
                    <input
                      type="date"
                      value={formDateTaught}
                      onChange={(e) => setFormDateTaught(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Mwisho wa Kuwasilisha:
                    </label>
                    <input
                      type="date"
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Alama za Juu (Pts):
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formMaxPoints}
                      onChange={(e) => setFormMaxPoints(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md"
                  >
                    Hifadhi Rekodi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
