'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('teacher.physics@kilimanjarosec.edu');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.auth.login({ email, pass: password });
      if (res?.accessToken) {
        localStorage.setItem('auth_token', res.accessToken);
        localStorage.setItem('tenant_id', res.user.tenantId || '');
        localStorage.setItem('user_roles', JSON.stringify(res.user.roles || []));

        // Route to respective portal
        const roles: string[] = res.user.roles || [];
        if (roles.includes('TEACHER')) {
          router.push('/teacher');
        } else if (roles.includes('HEADMASTER_PRINCIPAL') || roles.includes('ACADEMIC_MASTER')) {
          router.push('/academic');
        } else if (roles.includes('STUDENT')) {
          router.push('/student');
        } else if (roles.includes('PARENT_GUARDIAN')) {
          router.push('/parent');
        } else {
          router.push('/teacher');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoRole = (roleEmail: string, redirectPath: string) => {
    setEmail(roleEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-sm">
          <School className="w-7 h-7" />
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          Sign In to Your Institution
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Universal Academic Digital Operating System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Institutional Email
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@institution.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* One-Click Demo Role Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              One-Click Demo Roles
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoRole('teacher.physics@kilimanjarosec.edu', '/teacher')}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold block text-slate-800">Teacher</span>
                <span className="text-slate-500 text-[10px]">Physics Master</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole('headmaster@kilimanjarosec.edu', '/academic')}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold block text-slate-800">Headmaster</span>
                <span className="text-slate-500 text-[10px]">Approver</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole('stu-2026-0001@kilimanjarosec.edu', '/student')}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold block text-slate-800">Student</span>
                <span className="text-slate-500 text-[10px]">Form 1 Student</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole('superadmin@platform.edu', '/teacher')}
                className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold block text-slate-800">Super Admin</span>
                <span className="text-slate-500 text-[10px]">Platform Global</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
