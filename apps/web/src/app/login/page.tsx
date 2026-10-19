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
  const [emailOrId, setEmailOrId] = useState('headteacher@primaryschool.ac.tz');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available demonstration & testing accounts
  const demoAccounts = [
    {
      roleTitle: 'Head Teacher',
      identifier: 'headteacher@primaryschool.ac.tz',
      path: '/teacher',
      icon: School,
      color: 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100',
    },
    {
      roleTitle: 'Academic Master',
      identifier: 'academic@primaryschool.ac.tz',
      path: '/teacher',
      icon: BookOpen,
      color: 'bg-teal-50 text-teal-900 border-teal-300 hover:bg-teal-100',
    },
    {
      roleTitle: 'Discipline Master',
      identifier: 'discipline@primaryschool.ac.tz',
      path: '/teacher',
      icon: Shield,
      color: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100',
    },
    {
      roleTitle: 'Class Teacher',
      identifier: 'sarah.mollel@primaryschool.ac.tz',
      path: '/teacher',
      icon: Users,
      color: 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100',
    },
    {
      roleTitle: 'School Accountant',
      identifier: 'accountant@primaryschool.ac.tz',
      path: '/accountant',
      icon: DollarSign,
      color: 'bg-cyan-50 text-cyan-900 border-cyan-300 hover:bg-cyan-100',
    },
    {
      roleTitle: 'School Secretary',
      identifier: 'secretary@primaryschool.ac.tz',
      path: '/secretary',
      icon: FolderArchive,
      color: 'bg-indigo-50 text-indigo-900 border-indigo-300 hover:bg-indigo-100',
    },
    {
      roleTitle: 'Parent Portal',
      identifier: '+255 755 123 456',
      path: '/parent',
      icon: Heart,
      color: 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100',
    },
  ];

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
        setError('Invalid credentials. Please verify your details or use Quick Demo Access.');
      }
    }, 300);
  };

  const handleDemoClick = (acc: typeof demoAccounts[0]) => {
    const all = getStoredAccounts();
    const cleanId = acc.identifier.replace(/\s+/g, '').toLowerCase();

    const target = all.find(
      (u) =>
        (u.email && u.email.toLowerCase() === cleanId) ||
        u.identifier.replace(/\s+/g, '').toLowerCase() === cleanId ||
        (u.phone && u.phone.replace(/\s+/g, '') === cleanId)
    );

    if (target) {
      setCurrentSession(target);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', `demo_token_${target.id}`);
        localStorage.setItem('tenant_id', 'inst-001');
        localStorage.setItem('user_roles', JSON.stringify([target.role]));
      }
      setLoading(true);
      setTimeout(() => {
        router.push(acc.path);
      }, 250);
    } else {
      router.push(acc.path);
    }
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

          {/* Quick Demo Access Pills */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Demo Access:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {demoAccounts.map((acc, idx) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDemoClick(acc)}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center gap-1.5 ${acc.color}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-bold text-[11px] truncate">{acc.roleTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center pt-1">
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
