'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { School, Building2, CheckCircle2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

type Step = 1 | 2 | 3;

const TANZANIA_REGIONS = [
  'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera', 'Katavi',
  'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara', 'Mbeya', 'Morogoro',
  'Mtwara', 'Mwanza', 'Njombe', 'Pemba Kaskazini', 'Pemba Kusini', 'Pwani',
  'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu', 'Singida', 'Songwe', 'Tabora',
  'Tanga', 'Unguja Kaskazini', 'Unguja Kusini', 'Mjini Magharibi'
];

export default function RegisterInstitutionPage() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State - Strictly for Tanzania
  const [formData, setFormData] = useState({
    name: 'St. Augustine International Academy',
    code: 'SAIA',
    type: 'SECONDARY_SCHOOL',
    country: 'Tanzania',
    region: 'Arusha',
    district: 'Arusha Mjini',
    email: 'admissions@staugustine.ac.tz',
    phone: '+255 754 000 111',
    motto: 'Uongozi kupitia Maarifa na Maadili',
    academicSystem: 'TERMS',
    enableRanking: true,
    requireFinancialClearanceForResults: false,
    gradingScale: 'NECTA_STANDARD',
    adminFullName: 'Dr. Baraka Mwamba',
    adminEmail: 'principal@staugustine.ac.tz',
    adminPassword: 'Password@2026',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0e1424]/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
              <School className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base tracking-tight leading-none">
                UNIVERSAL ED
              </span>
              <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider">
                Usajili wa Shule Tanzania
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Umeshajisajili?</span>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-200 transition-colors"
            >
              Ingia Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 w-full flex-1">
        {isSuccess ? (
          <div className="glass-card rounded-2xl p-10 text-center border border-emerald-500/30 bg-[#0e1424]/90 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-6">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Tovuti ya Shule Yako Imekamilika!</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm mb-6 leading-relaxed">
              <strong className="text-slate-200">{formData.name}</strong> ({formData.code}) imesajiliwa kikamilifu.
              Tovuti yenu rasmi yenye nembo, kaulimbiu, na viingilio vya wanafunzi na wazazi ipo tayari.
            </p>

            <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-xl max-w-md mx-auto mb-8 text-center">
              <span className="text-xs text-blue-400 uppercase tracking-widest block font-mono">Anwani ya Tovuti ya Shule Yenu</span>
              <span className="text-lg font-mono font-bold text-white mt-1 block">
                localhost:3000/portal/{formData.code.toLowerCase()}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Wape wanafunzi, wazazi na walimu link hii kuingia moja kwa moja kwenye shule yenu.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto text-left mb-8 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Aina ya Taasisi</span>
                <span className="text-blue-400 font-semibold">{formData.type.replace('_', ' ')}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Mkoa & Mji</span>
                <span className="text-emerald-400 font-semibold">{formData.region}, Tanzania</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Barua Pepe ya Mkuu</span>
                <span className="text-purple-400 font-semibold">{formData.adminEmail}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/portal/${formData.code.toLowerCase()}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Fungua Tovuti ya Shule Yako Sasa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-sm transition-all"
              >
                Kuingia Kwenye Akaunti
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-8">
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Usajili wa Shule Mpya • Tanzania
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
                Sajili Taasisi ya Elimu
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Weka taarifa za shule au chuo chako kuanza kutumia mfumo rasmi wa alama, nafasi darasani, na tovuti binafsi.
              </p>
            </div>

            {/* Stepper Tabs */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all ${
                  step === 1
                    ? 'border-blue-500/60 bg-blue-900/20 text-blue-300'
                    : 'border-slate-800 bg-[#0e1424]/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  1
                </div>
                <div>
                  <div className="text-xs font-semibold leading-none">Utambulisho wa Shule</div>
                  <div className="text-[10px] text-slate-500 mt-1">Jina, mkoa & kaulimbiu</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all ${
                  step === 2
                    ? 'border-blue-500/60 bg-blue-900/20 text-blue-300'
                    : 'border-slate-800 bg-[#0e1424]/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  2
                </div>
                <div>
                  <div className="text-xs font-semibold leading-none">Kalenda ya Masomo</div>
                  <div className="text-[10px] text-slate-500 mt-1">Mihula vs Semesters</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left border transition-all ${
                  step === 3
                    ? 'border-blue-500/60 bg-blue-900/20 text-blue-300'
                    : 'border-slate-800 bg-[#0e1424]/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  3
                </div>
                <div>
                  <div className="text-xs font-semibold leading-none">Mkuu wa Shule</div>
                  <div className="text-[10px] text-slate-500 mt-1">Nenosiri na akaunti</div>
                </div>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-slate-800/80 p-8 bg-[#0e1424]/80 shadow-2xl">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white">1. Wasifu wa Shule na Mahali Ilipo Tanzania</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Taarifa hizi zitaonekana kwenye ripoti za mitihani na tovuti ya shule.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Aina ya Shule / Chuo
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="PRIMARY_SCHOOL">Shule ya Msingi (Darasa la 1–7)</option>
                        <option value="SECONDARY_SCHOOL">Shule ya Sekondari O-Level (Kidato cha 1–4)</option>
                        <option value="ADVANCED_SECONDARY">Sekondari ya Juu A-Level (Kidato cha 5–6)</option>
                        <option value="VOCATIONAL_INSTITUTE">Kituo cha Mafunzo ya Ufundi Stadi (VETA)</option>
                        <option value="COLLEGE">Chuo cha Kati cha Ufundi (NACTVET)</option>
                        <option value="UNIVERSITY">Chuo Kikuu (TCU Accredited University)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Nchi
                      </label>
                      <div className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-semibold flex items-center justify-between">
                        <span>Tanzania (TZS)</span>
                        <span className="text-[10px] text-slate-500 font-mono">NECTA / TCU</span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Jina Kamili la Shule / Chuo
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="mfano: Kilimanjaro Secondary School"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Kifupi cha Shule (URL: /portal/kifupi)
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase text-blue-400 focus:outline-none focus:border-blue-500"
                        placeholder="mfano: KSS"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Kaulimbiu ya Shule (Motto)
                      </label>
                      <input
                        type="text"
                        value={formData.motto}
                        onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="mfano: Elimu Ni Nuru na Uongozi"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Barua Pepe Rasmi
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="info@shule.sc.tz"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Namba ya Simu
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="+255 7..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Mkoa
                      </label>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {TANZANIA_REGIONS.map((reg) => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Wilaya / Manispaa
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="mfano: Moshi Mjini"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
                    >
                      Hatua Inayofuata: Muundo wa Mihula →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white">2. Muundo wa Mihula na Uhesabuji wa Alama</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Weka sheria za masomo kulingana na muongozo wa shule au chuo chako.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Mgawanyo wa Kalenda ya Masomo
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                            formData.academicSystem === 'TERMS'
                              ? 'border-blue-500 bg-blue-950/30 text-white'
                              : 'border-slate-800 bg-slate-900/40 text-slate-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="academicSystem"
                            checked={formData.academicSystem === 'TERMS'}
                            onChange={() => setFormData({ ...formData, academicSystem: 'TERMS' })}
                            className="hidden"
                          />
                          <span className="font-bold text-xs">Mihula (Term 1, Term 2)</span>
                          <span className="text-[11px] text-slate-500 mt-1">Kawaida kwa Shule za Msingi na Sekondari</span>
                        </label>

                        <label
                          className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                            formData.academicSystem === 'SEMESTERS'
                              ? 'border-blue-500 bg-blue-950/30 text-white'
                              : 'border-slate-800 bg-slate-900/40 text-slate-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="academicSystem"
                            checked={formData.academicSystem === 'SEMESTERS'}
                            onChange={() => setFormData({ ...formData, academicSystem: 'SEMESTERS' })}
                            className="hidden"
                          />
                          <span className="font-bold text-xs">Semesta (Semester 1 & 2)</span>
                          <span className="text-[11px] text-slate-500 mt-1">Kawaida kwa Vyuo vya Kati na Vyuo Vikuu</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-slate-200">Kupanga Nafasi Darasani (Ranking)</div>
                          <div className="text-[11px] text-slate-500">
                            Piga hesabu ya nafasi (1, 2, 2, 4 kwa waliolingana alama)
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.enableRanking}
                          onChange={(e) => setFormData({ ...formData, enableRanking: e.target.checked })}
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                        <div>
                          <div className="text-xs font-semibold text-slate-200">Kizuizi cha Ada (Financial Clearance Gate)</div>
                          <div className="text-[11px] text-slate-500">
                            Mwanafunzi mwenye deni la ada azuiwe kupakua report card mtandaoni
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.requireFinancialClearanceForResults}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              requireFinancialClearanceForResults: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Kipimo cha Alama (Grading Scale)
                      </label>
                      <select
                        value={formData.gradingScale}
                        onChange={(e) => setFormData({ ...formData, gradingScale: e.target.value })}
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="NECTA_STANDARD">NECTA Standard (A: 75-100, B: 65-74, C: 45-64, D: 30-44, F: 0-29)</option>
                        <option value="UNIVERSITY_GPA_5">TCU University 5.0 GPA Scale (A: 5.0, B+: 4.0, B: 3.0, C: 2.0, D: 1.0, E: 0.0)</option>
                        <option value="NACTVET_SCALE">NACTVET Competency Scale (Distinction, Upper Credit, Credit, Pass)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                    >
                      ← Nyuma
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
                    >
                      Hatua ya 3: Akaunti ya Mkuu →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white">3. Akaunti ya Mkuu wa Shule / Msimamizi</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Hii itakuwa akaunti kuu ya kuingia na kusanidi walimu, masomo, na kutangaza matokeo.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Jina Kamili la Mkuu wa Shule
                      </label>
                      <input
                        type="text"
                        value={formData.adminFullName}
                        onChange={(e) => setFormData({ ...formData, adminFullName: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="mfano: Dr. Baraka Mwamba"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Barua Pepe ya Kuingilia
                      </label>
                      <input
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Nenosiri Imara
                      </label>
                      <input
                        type="password"
                        value={formData.adminPassword}
                        onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 space-y-2">
                    <div className="font-semibold text-blue-400">Muhtasari wa Usajili:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      <li>Tovuti binafsi ya shule itafunguliwa papo hapo kwenye <code>/portal/${formData.code.toLowerCase()}</code>.</li>
                      <li>Akaunti zote za walimu, wanafunzi, na wazazi zitafunguliwa ndani ya shule hii pekee.</li>
                      <li>Sarafu ya mfumo: Shilingi ya Tanzania (TZS).</li>
                    </ul>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                    >
                      ← Nyuma
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Inatengeneza Tovuti ya Shule...' : 'Kamilisha Usajili wa Shule 🚀'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Universal Education Management Platform • Jamhuri ya Muungano wa Tanzania
      </footer>
    </div>
  );
}
