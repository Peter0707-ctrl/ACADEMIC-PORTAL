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

  // Form State - Focused on Primary & Nursery School
  const [formData, setFormData] = useState({
    name: 'St. Jude Primary & Nursery Academy',
    code: 'SJPA',
    type: 'INTEGRATED_PRIMARY_ACADEMY',
    country: 'Tanzania',
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    email: 'admissions@stjudeprimary.ac.tz',
    phone: '+255 779 304 500',
    motto: 'Knowledge, Character & Excellence',
    academicSystem: 'TERMS',
    enableRanking: true,
    requireFinancialClearanceForResults: false,
    gradingScale: 'PRIMARY_STANDARD_A_F',
    adminFullName: 'Peter Msira',
    adminEmail: 'pj0040280@gmail.com',
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
                Primary School Registration
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Already registered?</span>
            <Link
              href="/auth/login"
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-200 transition-colors"
            >
              Sign In to Portal
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
            <h2 className="text-2xl font-bold text-white mb-2">Primary School Portal Successfully Created!</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm mb-6 leading-relaxed">
              <strong className="text-slate-200">{formData.name}</strong> ({formData.code}) has been provisioned.
              Your dedicated primary school portal with pupil management, report card generator, and parent access is ready.
            </p>

            <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-xl max-w-md mx-auto mb-8 text-center">
              <span className="text-xs text-blue-400 uppercase tracking-widest block font-mono">Dedicated Primary School URL</span>
              <span className="text-lg font-mono font-bold text-white mt-1 block">
                localhost:3000/portal/{formData.code.toLowerCase()}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Share this link with your class teachers, pupils, and parents to access your school directly.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto text-left mb-8 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Institution Type</span>
                <span className="text-blue-400 font-semibold">{formData.type.replace(/_/g, ' ')}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Region & District</span>
                <span className="text-emerald-400 font-semibold">{formData.region}, {formData.district}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Headteacher Email</span>
                <span className="text-purple-400 font-semibold">{formData.adminEmail}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/portal/${formData.code.toLowerCase()}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Launch School Portal Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-sm transition-all"
              >
                Sign In to Admin Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-8">
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Primary &amp; Nursery School Onboarding
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
                Register Primary School
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Enter your school details to set up pupil registers, classroom streams, terminal report cards, and parent SMS.
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
                  <div className="text-xs font-semibold leading-none">School Profile</div>
                  <div className="text-[10px] text-slate-500 mt-1">Name, tier & contact</div>
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
                  <div className="text-xs font-semibold leading-none">Academic Calendar</div>
                  <div className="text-[10px] text-slate-500 mt-1">Terms & grading scale</div>
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
                  <div className="text-xs font-semibold leading-none">Headteacher Admin</div>
                  <div className="text-[10px] text-slate-500 mt-1">Credentials & launch</div>
                </div>
              </button>
            </div>

            {/* Stepper Form */}
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-slate-800 bg-[#0e1424]/80 p-8 shadow-xl">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white">1. Primary School Profile & Identity</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Provide official school information. This will appear on all pupil report cards and receipts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        School Type / Category
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="INTEGRATED_PRIMARY_ACADEMY">Nursery, Pre-Unit &amp; Primary Academy</option>
                        <option value="PRIMARY_DAY_BOARDING">English Medium Primary (Day &amp; Boarding)</option>
                        <option value="NURSERY_PRE_PRIMARY">Early Childhood &amp; Nursery School Only</option>
                        <option value="UPPER_PRIMARY">Standards 1 to 7 Primary School</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Country
                      </label>
                      <div className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-semibold flex items-center justify-between">
                        <span>Tanzania (TZS)</span>
                        <span className="text-[10px] text-slate-500 font-mono">Currency: TZS</span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Official Primary School Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g. St. Jude Primary & Nursery Academy"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        School Short Code (Portal URL: /portal/code)
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase text-blue-400 focus:outline-none focus:border-blue-500"
                        placeholder="e.g. SJPA"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        School Motto
                      </label>
                      <input
                        type="text"
                        value={formData.motto}
                        onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Knowledge, Character & Excellence"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Official School Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="admissions@school.sc.tz"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Official Phone Number
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
                        Region
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
                        District / Municipality
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Kinondoni"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
                    >
                      Next Step: Academic Terms &amp; Grading →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white">2. Academic Terms &amp; Assessment Setup</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure term divisions, classroom rankings, and primary grading scales.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Academic Calendar Division
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
                          <span className="font-bold text-xs">Standard Terms (Term 1 &amp; Term 2)</span>
                          <span className="text-[11px] text-slate-500 mt-1">Default for Primary &amp; Nursery Schools</span>
                        </label>

                        <label
                          className={`p-3.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                            formData.academicSystem === 'THREE_TERMS'
                              ? 'border-blue-500 bg-blue-950/30 text-white'
                              : 'border-slate-800 bg-slate-900/40 text-slate-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="academicSystem"
                            checked={formData.academicSystem === 'THREE_TERMS'}
                            onChange={() => setFormData({ ...formData, academicSystem: 'THREE_TERMS' })}
                            className="hidden"
                          />
                          <span className="font-bold text-xs">3-Term Calendar (Term 1, 2 &amp; 3)</span>
                          <span className="text-[11px] text-slate-500 mt-1">Used by some British / Cambridge Primary curricula</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-slate-200">Classroom Performance Ranking</div>
                          <div className="text-[11px] text-slate-500">
                            Automatically calculate position in class &amp; stream (e.g. 1st, 2nd, 3rd)
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
                          <div className="text-xs font-semibold text-slate-200">Fee Clearance Gate for Results</div>
                          <div className="text-[11px] text-slate-500">
                            Hold terminal report cards if tuition or transport fee has an outstanding balance
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
                        Primary School Grading Scale
                      </label>
                      <select
                        value={formData.gradingScale}
                        onChange={(e) => setFormData({ ...formData, gradingScale: e.target.value })}
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="PRIMARY_STANDARD_A_F">Primary Standard (A: 81-100, B: 61-80, C: 41-60, D: 21-40, F: 0-20)</option>
                        <option value="PRIMARY_OUT_OF_50">Continuous Assessment Scale (Marked out of 50)</option>
                        <option value="EARLY_YEARS_EMERGENT">Early Years Mastery (Exceeding, Meeting, Approaching, Emerging)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
                    >
                      Step 3: Headteacher Account →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white">3. Headteacher / Administrator Account</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      This will be the root administrator account to manage teachers, classes, subjects, and report cards.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Headteacher Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.adminFullName}
                        onChange={(e) => setFormData({ ...formData, adminFullName: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Peter Msira"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Administrator Login Email
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
                        Secure Password
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
                    <div className="font-semibold text-blue-400">Onboarding Summary:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      <li>Your school website will be live immediately at <code>/portal/{formData.code.toLowerCase()}</code>.</li>
                      <li>Standard 1 to 7 classes and Nursery streams will be pre-configured.</li>
                      <li>All teacher, pupil, and parent logins remain isolated to this school.</li>
                    </ul>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Creating School Portal...' : 'Complete Primary School Setup 🚀'}
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
        UniversalEd Primary • Dedicated Primary &amp; Nursery School Management Platform
      </footer>
    </div>
  );
}
