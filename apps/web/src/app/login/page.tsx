'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { School, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, BookOpen, GraduationCap, Users } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'TEACHER' | 'ADMIN' | 'STUDENT' | 'PARENT'>('TEACHER');
  const [email, setEmail] = useState('teacher.physics@kilimanjarosec.edu');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (role: 'TEACHER' | 'ADMIN' | 'STUDENT' | 'PARENT') => {
    setActiveTab(role);
    setError(null);
    if (role === 'TEACHER') {
      setEmail('teacher.physics@kilimanjarosec.edu');
    } else if (role === 'ADMIN') {
      setEmail('headmaster@kilimanjarosec.edu');
    } else if (role === 'STUDENT') {
      setEmail('stu-2026-0001@kilimanjarosec.edu');
    } else if (role === 'PARENT') {
      setEmail('parent.shirima@kilimanjarosec.edu');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'TEACHER') {
        router.push('/teacher');
      } else if (activeTab === 'ADMIN') {
        router.push('/admin');
      } else if (activeTab === 'STUDENT') {
        router.push('/student');
      } else if (activeTab === 'PARENT') {
        router.push('/parent');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] bg-radial-glow flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/25 mb-4">
          <School className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">Institutional Sign In</h2>
        <p className="mt-1 text-xs text-slate-400">
          Universal Academic Digital Operating System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Role Tab Selector */}
        <div className="p-1 rounded-2xl bg-[#0e1424] border border-slate-800 mb-6 flex text-xs font-bold">
          {[
            { id: 'TEACHER', label: 'Teacher', icon: BookOpen },
            { id: 'ADMIN', label: 'Principal', icon: ShieldCheck },
            { id: 'STUDENT', label: 'Student', icon: GraduationCap },
            { id: 'PARENT', label: 'Parent', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id as any)}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Login Form Box */}
        <div className="glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl space-y-6">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {activeTab === 'STUDENT' ? 'Student ID or Email' : 'Institutional Email'}
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>Sign In as {activeTab}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            <span>New educational institution? </span>
            <Link href="/register-institution" className="text-blue-400 font-bold hover:underline">
              Register & Setup School
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
