'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  School,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Users,
  Sparkles,
  BookOpen,
  DollarSign,
  FolderArchive,
  Heart,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  INITIAL_BLUEPRINT_ACCOUNTS,
  UserAccount,
  setCurrentSession,
  getStoredAccounts,
} from '@/lib/auth-session';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const accounts = getStoredAccounts();
      const cleanInput = emailOrId.trim().toLowerCase();

      const matched = accounts.find((a) => {
        const emailMatch = a.email && a.email.toLowerCase() === cleanInput;
        const idMatch = a.identifier.toLowerCase() === cleanInput;
        const phoneMatch = a.phone && a.phone.replace(/\s+/g, '') === cleanInput.replace(/\s+/g, '');
        return emailMatch || idMatch || phoneMatch;
      });

      if (matched) {
        setCurrentSession(matched);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', `token_${matched.id}`);
          localStorage.setItem('tenant_id', 'inst-001');
          localStorage.setItem('user_roles', JSON.stringify([matched.role]));
        }

        if (matched.role === 'ACCOUNTANT') {
          router.push('/accountant');
        } else if (matched.role === 'SECRETARY') {
          router.push('/secretary');
        } else if (['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(matched.role)) {
          router.push('/teacher');
        } else if (matched.role === 'PARENT') {
          router.push('/parent');
        } else if (matched.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/teacher');
        }
      } else {
        setError('Invalid credentials. Please verify your email or Staff ID and password.');
      }
    }, 300);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-8 px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(240, 253, 244, 0.92) 0%, rgba(236, 253, 245, 0.94) 50%, rgba(209, 250, 229, 0.94) 100%), url('/images/primary_school_pupils.jpg')`,
      }}
    >
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-6 h-6 text-amber-300" />
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          PRIMARY &amp; NURSERY SCHOOL
        </h1>
        <p className="text-xs text-slate-600 font-medium">
          Official Primary Education Portal
        </p>
      </div>

      {/* Compact Sign In Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/95 p-6 rounded-2xl border border-emerald-200/80 shadow-lg shadow-emerald-950/5 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-base font-black text-slate-900">Sign In</h2>
            <p className="text-xs text-slate-500">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Staff ID / Email / Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  placeholder="e.g. HT-2026-001 or parent phone"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  placeholder="Enter your password"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-800 hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-100">
            <Link href="/" className="text-xs font-semibold text-emerald-800 hover:underline">
              Go to Home &bull; Parent Registration
            </Link>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="mt-8 text-center text-xs text-slate-500 space-y-1 pb-4">
        <p className="font-medium">&copy; {new Date().getFullYear()} PRIMARY &amp; NURSERY SCHOOL. All rights reserved.</p>
        <p className="text-[11px] text-slate-400">Universal Primary Education Management System • Version 2.6.4</p>
      </footer>
    </div>
  );
}
