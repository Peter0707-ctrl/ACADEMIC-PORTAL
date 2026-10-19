'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  CheckCircle2,
  Lock,
  Unlock,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  Clock,
  Layers,
  GraduationCap,
  History,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import AdminShell from '@/components/admin-shell';
import { getStoredAccounts, setStoredAccounts, UserAccount } from '@/lib/auth-session';

interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'CLOSED' | 'UPCOMING';
}

interface AcademicYear {
  year: string;
  isCurrent: boolean;
  terms: Term[];
}

const DEFAULT_ACADEMIC_YEARS: AcademicYear[] = [
  {
    year: '2026',
    isCurrent: true,
    terms: [
      { id: 'T1-2026', name: 'Muhula wa Kwanza (Term 1)', startDate: '2026-01-12', endDate: '2026-06-05', status: 'ACTIVE' },
      { id: 'T2-2026', name: 'Muhula wa Pili (Term 2)', startDate: '2026-07-06', endDate: '2026-11-27', status: 'UPCOMING' },
    ],
  },
  {
    year: '2025',
    isCurrent: false,
    terms: [
      { id: 'T1-2025', name: 'Muhula wa Kwanza (Term 1)', startDate: '2025-01-13', endDate: '2025-06-06', status: 'CLOSED' },
      { id: 'T2-2025', name: 'Muhula wa Pili (Term 2)', startDate: '2025-07-07', endDate: '2025-11-28', status: 'CLOSED' },
    ],
  },
];

const STORAGE_KEY = 'academic_portal_years_config_v1';

export default function AdminAcademicYearsPage() {
  const [years, setYears] = useState<AcademicYear[]>(DEFAULT_ACADEMIC_YEARS);
  const [showAddYearModal, setShowAddYearModal] = useState(false);
  const [newYearInput, setNewYearInput] = useState('2027');

  // Promotion Engine Modal
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotionResult, setPromotionResult] = useState<string | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setYears(JSON.parse(raw));
      } catch {
        // default
      }
    }
  }, []);

  const saveYears = (data: AcademicYear[]) => {
    setYears(data);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  };

  const handleSetActiveYear = (targetYear: string) => {
    const updated = years.map((y) => ({
      ...y,
      isCurrent: y.year === targetYear,
    }));
    saveYears(updated);
    setToastMessage(`Mwaka wa masomo ${targetYear} sasa umewekwa kuwa unaotumika rasmi.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleTermStatus = (yearStr: string, termId: string) => {
    const updated = years.map((y) => {
      if (y.year !== yearStr) return y;
      return {
        ...y,
        terms: y.terms.map((t) => {
          if (t.id !== termId) return t;
          const nextStatus: 'ACTIVE' | 'CLOSED' | 'UPCOMING' =
            t.status === 'ACTIVE' ? 'CLOSED' : t.status === 'CLOSED' ? 'UPCOMING' : 'ACTIVE';
          return { ...t, status: nextStatus };
        }),
      };
    });
    saveYears(updated);
    setToastMessage(`Hali ya muhula imebadilishwa kikamilifu.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearInput.trim()) return;

    if (years.some((y) => y.year === newYearInput.trim())) {
      alert('Mwaka huu tayari upo kwenye orodha.');
      return;
    }

    const newYearObj: AcademicYear = {
      year: newYearInput.trim(),
      isCurrent: false,
      terms: [
        { id: `T1-${newYearInput}`, name: 'Muhula wa Kwanza (Term 1)', startDate: `${newYearInput}-01-11`, endDate: `${newYearInput}-06-04`, status: 'UPCOMING' },
        { id: `T2-${newYearInput}`, name: 'Muhula wa Pili (Term 2)', startDate: `${newYearInput}-07-05`, endDate: `${newYearInput}-11-26`, status: 'UPCOMING' },
      ],
    };

    const updated = [newYearObj, ...years];
    saveYears(updated);
    setShowAddYearModal(false);
    setToastMessage(`Mwaka wa masomo ${newYearInput} umeongezwa.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Automated Student Promotion Logic
  const handleExecutePromotion = () => {
    setIsPromoting(true);

    setTimeout(() => {
      const accounts = getStoredAccounts();
      let promotedCount = 0;
      let graduatedCount = 0;

      const promotionMap: Record<string, string> = {
        'Nursery & Day Care': 'Pre-Unit / Kindergarten',
        'Pre-Unit / Kindergarten': 'Standard 1 (Grade 1)',
        'Standard 1 (Grade 1)': 'Standard 2 (Grade 2)',
        'Standard 2 (Grade 2)': 'Standard 3 (Grade 3)',
        'Standard 3 (Grade 3)': 'Standard 4 (Grade 4)',
        'Standard 4 (Grade 4)': 'Standard 5 (Grade 5)',
        'Standard 5 (Grade 5)': 'Standard 6 (Grade 6)',
        'Standard 6 (Grade 6)': 'Standard 7 (Grade 7)',
      };

      const updatedAccounts = accounts.map((acc) => {
        if (acc.role === 'STUDENT' || acc.role === 'CANDIDATE') {
          if (acc.assignedClass && promotionMap[acc.assignedClass]) {
            promotedCount++;
            return {
              ...acc,
              assignedClass: promotionMap[acc.assignedClass],
              role: promotionMap[acc.assignedClass] === 'Standard 7 (Grade 7)' ? ('CANDIDATE' as const) : acc.role,
            };
          } else if (acc.assignedClass?.includes('Standard 7') || acc.role === 'CANDIDATE') {
            graduatedCount++;
            return {
              ...acc,
              assignedClass: 'Wahitimu (Alumni Archive)',
              status: 'SUSPENDED' as const,
            };
          }
        }
        return acc;
      });

      setStoredAccounts(updatedAccounts);
      setIsPromoting(false);
      setShowPromotionModal(false);
      setPromotionResult(
        `Wanafunzi ${promotedCount} wamepandishwa darasa la juu, na wahitimu ${graduatedCount} wamehamishiwa kwenye jalada la Wahitimu (Alumni).`
      );
    }, 1000);
  };

  return (
    <AdminShell
      pageTitle="Miaka ya Masomo, Mihula &amp; Kupandisha Madarasa"
      pageDescription="Sanidi mwaka wa masomo unaoendelea, tarehe za kufunga na kufungua mihula, na endesha injini ya kupandisha madarasa (Automated Student Promotion)."
    >
      <div className="space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
            <div className="bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Promotion Result Alert */}
        {promotionResult && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{promotionResult}</span>
            </div>
            <button
              type="button"
              onClick={() => setPromotionResult(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Add Year Modal */}
        {showAddYearModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Ongeza Mwaka Mpya wa Masomo</h3>
                <button
                  type="button"
                  onClick={() => setShowAddYearModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddYear} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mwaka wa Masomo (Academic Year)</label>
                  <input
                    type="text"
                    required
                    value={newYearInput}
                    onChange={(e) => setNewYearInput(e.target.value)}
                    placeholder="k.m. 2027"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddYearModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    Hifadhi Mwaka
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Promotion Confirmation Modal */}
        {showPromotionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Thibitisha Kupandisha Madarasa</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mfumo utapandisha wanafunzi wote wanaostahili darasa moja juu (mf. Std 1 kwenda Std 2). Wanafunzi wa
                  Std 7 watahamishiwa kwenye orodha ya Wahitimu (Alumni Archive).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 text-left space-y-1 font-medium">
                <div>• Awali/Nursery ➔ Pre-Unit</div>
                <div>• Pre-Unit ➔ Standard 1</div>
                <div>• Standard 1 hadi 6 ➔ Standard 2 hadi 7</div>
                <div>• Standard 7 ➔ Jalada la Wahitimu (Alumni)</div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPromotionModal(false)}
                  disabled={isPromoting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Ghairi
                </button>
                <button
                  type="button"
                  onClick={handleExecutePromotion}
                  disabled={isPromoting}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  {isPromoting ? (
                    <span>Inapandisha...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                      <span>Tekeleza Sasa</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. Header Toolbar: Add Year & Promotion Engine trigger */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Kalenda Rasmi ya Miaka ya Masomo</h3>
            <p className="text-xs text-slate-500 mt-0.5">Dhibiti mihula, tarehe, na mzunguko wa miaka ya shule</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowPromotionModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Injini ya Kupandisha Madarasa</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddYearModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Ongeza Mwaka Mpya</span>
            </button>
          </div>
        </div>

        {/* 2. List of Academic Years Cards */}
        <div className="space-y-4">
          {years.map((ay) => {
            return (
              <div
                key={ay.year}
                className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                  ay.isCurrent
                    ? 'bg-white border-indigo-300 shadow-md ring-2 ring-indigo-500/10'
                    : 'bg-white/80 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        ay.isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-900">Mwaka wa Masomo: {ay.year}</span>
                        {ay.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase border border-emerald-300">
                            Mwaka Unaotumika Sasa
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">Mihula {ay.terms.length} imesanidiwa kwa ajili ya masomo</p>
                    </div>
                  </div>

                  {!ay.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleSetActiveYear(ay.year)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all self-start sm:self-auto border border-slate-200"
                    >
                      Weka Kuwa Mwaka Rasmi (Set as Active)
                    </button>
                  )}
                </div>

                {/* Terms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  {ay.terms.map((term) => {
                    const isActive = term.status === 'ACTIVE';
                    const isClosed = term.status === 'CLOSED';

                    return (
                      <div
                        key={term.id}
                        className={`p-4 rounded-2xl border transition-all space-y-3 ${
                          isActive
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : isClosed
                            ? 'bg-slate-50 border-slate-200 opacity-80'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{term.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : isClosed
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isActive ? 'Inaendelea (Active)' : isClosed ? 'Imefungwa (Closed)' : 'Inatarajiwa (Upcoming)'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-mono">
                          <div className="p-2 rounded-xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-sans">Kuanza:</span>
                            <span className="font-semibold">{term.startDate}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-sans">Kumalizika:</span>
                            <span className="font-semibold">{term.endDate}</span>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Kitambulisho: {term.id}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleTermStatus(ay.year, term.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors"
                          >
                            {isActive ? 'Funga Muhula' : 'Badili Hali'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
