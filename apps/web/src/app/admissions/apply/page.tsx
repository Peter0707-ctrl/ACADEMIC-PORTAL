'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, GraduationCap, School, Upload } from 'lucide-react';

export default function AdmissionsApplicationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: 'Form 1 Secondary',
    previousSchool: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block leading-tight">Admissions Portal</span>
              <span className="text-xs text-slate-500">Online Student Application & Document Submission</span>
            </div>
          </div>
          <Link href="/login" className="text-xs font-semibold text-blue-600 hover:underline">
            Track Status / Sign In
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12 flex-1 w-full">
        {submitted ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Application Submitted!</h2>
            <p className="text-sm text-slate-600">
              Your application has been received by the Admissions Officer. Your tracking ID is{' '}
              <strong className="font-mono text-slate-900">APP-2026-0891</strong>.
            </p>
            <div className="pt-4 flex justify-center space-x-3">
              <Link href="/" className="btn-secondary text-xs">
                Back to Home
              </Link>
              <Link href="/login" className="btn-primary text-xs">
                Login with Applicant Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Student Admission Application</h2>
            <p className="text-xs text-slate-500 mb-6">Fill in personal details and upload required academic certificates.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+255 7..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program / Class Applying For</label>
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Form 1 Secondary">Form 1 (Ordinary Secondary)</option>
                  <option value="Form 5 PCB">Form 5 (Physics, Chemistry, Biology)</option>
                  <option value="Form 5 PCM">Form 5 (Physics, Chemistry, Mathematics)</option>
                  <option value="Diploma in Computer Science">Diploma in Computer Science</option>
                  <option value="BSc in Software Engineering">BSc in Software Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Supporting Certificates (PDF/Images)</label>
                <label className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-600">Select certificate / result slip</span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</span>
                  <input type="file" className="hidden" />
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="btn-primary text-xs">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
