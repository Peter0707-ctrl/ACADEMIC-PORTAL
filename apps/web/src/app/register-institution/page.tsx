'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { School, Building2, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Globe } from 'lucide-react';
import { InstitutionType, AcademicCycleType, ResultApprovalMode } from '@academic/shared';
import { api } from '@/lib/api';

export default function RegisterInstitutionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [institutionName, setInstitutionName] = useState('');
  const [institutionCode, setInstitutionCode] = useState('');
  const [institutionType, setInstitutionType] = useState<InstitutionType>(InstitutionType.SECONDARY_SCHOOL);
  const [country, setCountry] = useState('TZ');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Admin User
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Rules Configuration
  const [cycleType, setCycleType] = useState<AcademicCycleType>(AcademicCycleType.TERMS);
  const [positionEnabled, setPositionEnabled] = useState(true);
  const [requireClearance, setRequireClearance] = useState(false);

  const handleTypeChange = (type: InstitutionType) => {
    setInstitutionType(type);
    if (type === InstitutionType.UNIVERSITY || type === InstitutionType.COLLEGE) {
      setCycleType(AcademicCycleType.SEMESTERS);
      setPositionEnabled(false);
      setRequireClearance(true);
    } else {
      setCycleType(AcademicCycleType.TERMS);
      setPositionEnabled(true);
      setRequireClearance(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In standalone frontend demo mode:
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block leading-tight">Universal Academic Platform</span>
              <span className="text-xs text-slate-500">Institution Onboarding & Tenant Setup</span>
            </div>
          </div>
          <Link href="/login" className="text-xs font-semibold text-blue-600 hover:underline">
            Already registered? Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12 flex-1 w-full">
        {success ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Institution Registered Successfully!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your institutional tenant <strong>{institutionName}</strong> has been provisioned with its country rules, default grading scale, and administrator credentials.
            </p>
            <div className="pt-4 flex justify-center">
              <Link href="/login" className="btn-primary text-sm">
                Proceed to Institutional Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                <span>Step {step} of 3</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {step === 1 && '1. Institutional Profile & Type'}
                {step === 2 && '2. Academic Operating Rules'}
                {step === 3 && '3. Primary Administrator Credentials'}
              </h2>
              <p className="text-xs text-slate-500">
                Configure your school or university digital operating system with zero hard-coded constraints.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* STEP 1: Institution Info */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mwanza High School or St. Joseph University"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. MWZ-HIGH"
                        value={institutionCode}
                        onChange={(e) => setInstitutionCode(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="TZ">Tanzania (TZ)</option>
                        <option value="KE">Kenya (KE)</option>
                        <option value="UG">Uganda (UG)</option>
                        <option value="RW">Rwanda (RW)</option>
                        <option value="ZM">Zambia (ZM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Type</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { type: InstitutionType.SECONDARY_SCHOOL, label: 'Secondary School (Form 1-4)' },
                        { type: InstitutionType.ADVANCED_SECONDARY_SCHOOL, label: 'Advanced Secondary (Form 5-6)' },
                        { type: InstitutionType.COLLEGE, label: 'College / Institute' },
                        { type: InstitutionType.UNIVERSITY, label: 'University' },
                        { type: InstitutionType.PRIMARY_SCHOOL, label: 'Primary School (Std 1-7)' },
                        { type: InstitutionType.VOCATIONAL_COLLEGE, label: 'Vocational / Training' },
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => handleTypeChange(item.type)}
                          className={`p-3 rounded-lg border text-left font-medium transition-all ${
                            institutionType === item.type
                              ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!institutionName || !institutionCode}
                      onClick={() => setStep(2)}
                      className="btn-primary text-xs flex items-center space-x-1"
                    >
                      <span>Continue to Operating Rules</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </>
              )}

              {/* STEP 2: Academic Operating Rules */}
              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <span className="text-xs font-bold text-slate-800 block">Academic Calendar Cycle</span>
                      <div className="flex gap-4 text-xs">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="cycle"
                            checked={cycleType === AcademicCycleType.TERMS}
                            onChange={() => setCycleType(AcademicCycleType.TERMS)}
                          />
                          <span>Term System (Terms 1, 2, 3)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="cycle"
                            checked={cycleType === AcademicCycleType.SEMESTERS}
                            onChange={() => setCycleType(AcademicCycleType.SEMESTERS)}
                          />
                          <span>Semester System (Semesters 1, 2)</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <span className="text-xs font-bold text-slate-800 block">Class Ranking Policy</span>
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={positionEnabled}
                          onChange={(e) => setPositionEnabled(e.target.checked)}
                        />
                        <span>Enable student ranking / position (e.g. 1st, 2nd, 3rd) on report cards</span>
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Typically enabled for Primary & Secondary schools, disabled for Universities using GPA.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <span className="text-xs font-bold text-slate-800 block">Financial Clearance Policy</span>
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={requireClearance}
                          onChange={(e) => setRequireClearance(e.target.checked)}
                        />
                        <span>Hold examination results until student fees are cleared by Bursar</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary text-xs">
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary text-xs flex items-center">
                      <span>Continue to Admin Setup</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3: Admin Credentials */}
              {step === 3 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={adminFirstName}
                        onChange={(e) => setAdminFirstName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={adminLastName}
                        onChange={(e) => setAdminLastName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Administrator Email</label>
                    <input
                      type="email"
                      required
                      placeholder="principal@institution.edu"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary text-xs">
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !adminEmail || !adminPassword}
                      className="btn-success text-xs flex items-center space-x-1"
                    >
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      <span>{loading ? 'Provisioning Tenant...' : 'Complete Institutional Onboarding'}</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
