'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Step = 1 | 2 | 3;

export default function RegisterInstitutionPage() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Identity & Location
    name: 'St. Augustine International Academy',
    code: 'SAIA',
    type: 'SECONDARY_SCHOOL',
    country: 'Tanzania',
    region: 'Arusha',
    district: 'Arusha City',
    email: 'admissions@staugustine.ac.tz',
    phone: '+255 754 000 111',
    // Step 2: Academic System Configuration
    academicSystem: 'TERMS', // TERMS vs SEMESTERS
    enableRanking: true,
    requireFinancialClearanceForResults: false,
    gradingScale: 'NECTA_STANDARD', // NECTA vs GPA
    levels: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    // Step 3: Initial Super Admin
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
              U
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-base tracking-tight leading-none">
                UNIVERSAL ED
              </span>
              <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider">
                Digital Operating System
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Already have a tenant?</span>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-200 transition-colors"
            >
              Sign In
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
            <h2 className="text-2xl font-bold text-white mb-2">Tenant Provisioned Successfully!</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm mb-8 leading-relaxed">
              <strong className="text-slate-200">{formData.name}</strong> ({formData.code}) has been initialized on isolated schema.
              Your institution configuration, grade scales, and super admin account are active.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto text-left mb-8 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">System Type</span>
                <span className="text-blue-400 font-semibold">{formData.type.replace('_', ' ')}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Grading System</span>
                <span className="text-emerald-400 font-semibold">{formData.academicSystem} • {formData.enableRanking ? 'Ranking Enabled' : 'GPA'}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-500 block mb-1">Admin Portal</span>
                <span className="text-purple-400 font-semibold">{formData.adminEmail}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/admin"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30"
              >
                Access Principal / Admin Command Center →
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-sm transition-all"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-8">
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Step 1 of Architecture • Institution Onboarding
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
                Register Educational Institution
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Configure your school or university tenant. Business rules, grading, and approval flows are fully configurable.
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
                  <div className="text-xs font-semibold leading-none">Institution Identity</div>
                  <div className="text-[10px] text-slate-500 mt-1">Name, country & type</div>
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
                  <div className="text-xs font-semibold leading-none">Academic Engine</div>
                  <div className="text-[10px] text-slate-500 mt-1">Terms vs Semesters, Rules</div>
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
                  <div className="text-xs font-semibold leading-none">Super Administrator</div>
                  <div className="text-[10px] text-slate-500 mt-1">Credentials & Launch</div>
                </div>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-slate-800/80 p-8 bg-[#0e1424]/80 shadow-2xl">
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white">1. Institution Profile & Jurisdiction</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Country-agnostic tenant configuration.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Institution Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="PRIMARY_SCHOOL">Primary School (Std 1–7)</option>
                        <option value="SECONDARY_SCHOOL">Secondary School (Form 1–4 O-Level)</option>
                        <option value="ADVANCED_SECONDARY">Advanced Secondary (Form 5–6 A-Level)</option>
                        <option value="VOCATIONAL_INSTITUTE">Vocational / VETA Training</option>
                        <option value="COLLEGE">Diploma College / Institute</option>
                        <option value="UNIVERSITY">University (Semesters / Credits / GPA)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Country
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="Tanzania">Tanzania (TZS, NECTA / TCU)</option>
                        <option value="Kenya">Kenya (KES, CBC / KNEC)</option>
                        <option value="Uganda">Uganda (UGX, UNEB)</option>
                        <option value="Rwanda">Rwanda (RWF, REB / HEC)</option>
                        <option value="Zambia">Zambia (ZMW, ECZ)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Official Legal Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g. St. Augustine International Academy"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Tenant Code / Subdomain Prefix
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase text-blue-400 focus:outline-none focus:border-blue-500"
                        placeholder="e.g. SAIA"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Official Contact Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="admissions@domain.ac.tz"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Region / State
                      </label>
                      <input
                        type="text"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        District / City
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30"
                    >
                      Next: Academic Engine Settings →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white">2. Configurable Academic & Examination Rules</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      No hardcoded assumptions. Change rules dynamically according to institutional policy.
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
                          <span className="font-bold text-xs">Term-Based (Term 1, Term 2, Term 3)</span>
                          <span className="text-[11px] text-slate-500 mt-1">Standard for Primary and Secondary Schools</span>
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
                          <span className="font-bold text-xs">Semester-Based (Semester 1 & 2)</span>
                          <span className="text-[11px] text-slate-500 mt-1">Standard for Colleges, Universities & Institutes</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-slate-200">Position / Class Ranking Engine</div>
                          <div className="text-[11px] text-slate-500">
                            Calculate rank (1st, 2nd, 2nd, 4th with Standard Competition Ranking ties)
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
                          <div className="text-xs font-semibold text-slate-200">Financial Clearance Gate</div>
                          <div className="text-[11px] text-slate-500">
                            Block student report card viewing until bursar verifies 100% fee clearance
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
                        Grading Model
                      </label>
                      <select
                        value={formData.gradingScale}
                        onChange={(e) => setFormData({ ...formData, gradingScale: e.target.value })}
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="NECTA_STANDARD">NECTA Standard (A: 75-100, B: 65-74, C: 45-64, D: 30-44, F: 0-29)</option>
                        <option value="UNIVERSITY_GPA_5">University 5.0 Scale (A: 70-100 / 5.0, B+: 60-69 / 4.0, B: 50-59 / 3.0, C: 40-49 / 2.0, D: 35-39, E: 0-34)</option>
                        <option value="UNIVERSITY_GPA_4">Standard 4.0 GPA Scale (A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0)</option>
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
                      Next: Super Admin Credentials →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white">3. Primary Super Administrator Account</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      This user is granted full composable roles: Institution Admin + Headmaster.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Administrator Full Name & Title
                      </label>
                      <input
                        type="text"
                        value={formData.adminFullName}
                        onChange={(e) => setFormData({ ...formData, adminFullName: e.target.value })}
                        required
                        className="w-full bg-[#090d16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Dr. Baraka Mwamba"
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
                        Secure Master Password
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
                    <div className="font-semibold text-blue-400">Tenant Provisioning Checklist:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      <li>Multi-tenant isolation barrier will lock all queries to <code>institutionId</code>.</li>
                      <li>Standard roles (Headmaster, Teacher, Student, Parent, Accountant) will be seeded.</li>
                      <li>Tamper-resistant audit log records tenant initialization.</li>
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
                      {isSubmitting ? 'Provisioning Tenant...' : 'Initialize Institution Tenant 🚀'}
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
        Universal Education Management Platform • Architecture Engine
      </footer>
    </div>
  );
}
