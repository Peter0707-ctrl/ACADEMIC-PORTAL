'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { School, ArrowRight, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export default function AdmissionsApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [appNumber, setAppNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    institution: 'Kilimanjaro Secondary School',
    academicLevel: 'Kidato cha 1 (Form 1 O-Level)',
    academicYear: '2026',
    firstName: 'Neema',
    lastName: 'Kiwelu',
    dateOfBirth: '2012-05-14',
    gender: 'FEMALE',
    primarySchoolCompleted: 'Shule ya Msingi Moshi',
    psleIndexNumber: 'PS1029/042/2025',
    psleAverageGrade: 'A',
    guardianName: 'Dr. Joseph Kiwelu',
    guardianPhone: '+255 784 112 334',
    guardianEmail: 'jkiwelu@hospital.or.tz',
    guardianRelation: 'Mzazi / Baba',
    residence: 'Moshi Mjini, Mkoa wa Kilimanjaro',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generated = 'APP-KSS-2026-' + Math.floor(1000 + Math.random() * 9000);
      setAppNumber(generated);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#0e1424]/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30 text-sm">
              <School className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm tracking-tight leading-none">
                UDAHILI MTANDAONI
              </span>
              <span className="text-[10px] text-blue-400 font-mono">
                Maombi ya Kujiunga na Shule Tanzania
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/login"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Ingia Portal →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 w-full flex-1">
        {submitted ? (
          <div className="glass-card rounded-2xl p-10 text-center border border-emerald-500/30 bg-[#0e1424]/90 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-6">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Maombi Yamewasilishwa Kikamilifu!</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm mb-6 leading-relaxed">
              Maombi yako ya kujiunga na <strong className="text-slate-200">{formData.institution}</strong> ({formData.academicLevel}) yamepokelewa na yanashughulikiwa na Kamati ya Udahili ya Shule.
            </p>

            <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl max-w-md mx-auto mb-8">
              <span className="text-xs text-blue-400 uppercase tracking-widest block font-mono">Namba ya Kumbukumbu ya Maombi</span>
              <span className="text-2xl font-mono font-bold text-white mt-1 block tracking-wider">{appNumber}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Hifadhi namba hii. Ujumbe mfupi wa SMS utatumwa kwenye namba {formData.guardianPhone}.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left mb-8 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Mwanafunzi</span>
                <span className="text-white font-medium">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Darasa</span>
                <span className="text-blue-400 font-medium">{formData.academicLevel}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Hali ya Maombi</span>
                <span className="text-amber-400 font-medium">Inachakatwa</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Mzazi / Mlezi</span>
                <span className="text-slate-300 font-medium">{formData.guardianName}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs transition-all"
              >
                Tuma Maombi Mengine
              </button>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30"
              >
                Kuingia Kwenye Akaunti →
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Idara ya Udahili na Usajili • Tanzania
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
                Fomu ya Maombi ya Mwanafunzi Mpya
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Jaza taarifa sahihi kulingana na vyeti rasmi vya kuzaliwa na matokeo ya mitihani ya NECTA.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-slate-800/80 p-8 bg-[#0e1424]/80 shadow-2xl space-y-8">
              {/* Institution & Program Selection */}
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2 mb-4">
                  1. Shule na Darasa Unaloomba
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Chagua Shule / Chuo
                    </label>
                    <select
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Kilimanjaro Secondary School">Kilimanjaro Secondary School (Moshi)</option>
                      <option value="Lake Victoria Institute of Technology">Lake Victoria Institute of Technology (Mwanza)</option>
                      <option value="St. Augustine International Academy">St. Augustine International Academy (Arusha)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Darasa / Kozi Unayoomba
                    </label>
                    <select
                      value={formData.academicLevel}
                      onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Kidato cha 1 (Form 1 O-Level)">Kidato cha 1 (Form 1 O-Level)</option>
                      <option value="Kidato cha 3 (Hamisho / Transfer)">Kidato cha 3 (Hamisho / Transfer)</option>
                      <option value="Kidato cha 5 (PCM - Physics, Chemistry, Math)">Kidato cha 5 (PCM Combination)</option>
                      <option value="Kidato cha 5 (PCB - Physics, Chemistry, Biology)">Kidato cha 5 (PCB Combination)</option>
                      <option value="Kidato cha 5 (HGL - History, Geo, Language)">Kidato cha 5 (HGL Combination)</option>
                      <option value="Diploma in Computer Science">Diploma in Computer Science (NACTVET)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Applicant Personal Info */}
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2 mb-4">
                  2. Taarifa Binafsi na Shule Aliyotoka
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Jina la Kwanza
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Jina la Ukoo
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Tarehe ya Kuzaliwa
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      required
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Shule Aliyosoma Awali
                    </label>
                    <input
                      type="text"
                      value={formData.primarySchoolCompleted}
                      onChange={(e) => setFormData({ ...formData, primarySchoolCompleted: e.target.value })}
                      required
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Namba ya Mtihani ya NECTA (Index No.)
                    </label>
                    <input
                      type="text"
                      value={formData.psleIndexNumber}
                      onChange={(e) => setFormData({ ...formData, psleIndexNumber: e.target.value })}
                      required
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-blue-500"
                      placeholder="mfano: PS1029/042/2025"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Wastani wa Daraja (Grade)
                    </label>
                    <select
                      value={formData.psleAverageGrade}
                      onChange={(e) => setFormData({ ...formData, psleAverageGrade: e.target.value })}
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="A">Daraja A (Bora Sana)</option>
                      <option value="B">Daraja B (Nzuri)</option>
                      <option value="C">Daraja C (Wastani)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Guardian / Parent Information */}
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2 mb-4">
                  3. Taarifa za Mzazi au Mlezi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Jina Kamili la Mzazi / Mlezi
                    </label>
                    <input
                      type="text"
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      required
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Namba ya Simu ya Mkononi
                    </label>
                    <input
                      type="tel"
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      required
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Barua Pepe ya Mzazi
                    </label>
                    <input
                      type="email"
                      value={formData.guardianEmail}
                      onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                      required
                      className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload Simulation */}
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-2 mb-4">
                  4. Nakala za Vyeti vya Uhakiki
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center bg-slate-900/30 hover:border-blue-500/50 transition-colors">
                    <span className="text-xs font-medium text-slate-300 block mb-1">
                      Cheti cha Kuzaliwa (RITA) / NIDA
                    </span>
                    <span className="text-[11px] text-slate-500 block mb-3">Format ya PDF au JPEG</span>
                    <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-emerald-400 font-mono">
                      ✓ cheti_cha_kuzaliwa_neema.pdf (245 KB) Kimepakiwa
                    </span>
                  </div>

                  <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center bg-slate-900/30 hover:border-blue-500/50 transition-colors">
                    <span className="text-xs font-medium text-slate-300 block mb-1">
                      Cheti cha Kuhitimu / Matokeo ya NECTA
                    </span>
                    <span className="text-[11px] text-slate-500 block mb-3">Chenye muhuri rasmi</span>
                    <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-emerald-400 font-mono">
                      ✓ matokeo_necta_psle.pdf (412 KB) Kimepakiwa
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                >
                  ← Rudi Mwanzo
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  {isSubmitting ? 'Inawasilisha Maombi...' : 'Wasilisha Maombi kwa Shule'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Universal Ed Tanzania • Mfumo wa Udahili Mtandaoni
      </footer>
    </div>
  );
}
