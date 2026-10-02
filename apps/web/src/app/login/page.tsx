'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import {
  INITIAL_BLUEPRINT_ACCOUNTS,
  UserAccount,
  setCurrentSession,
  getStoredAccounts,
} from '@/lib/auth-session';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrId, setEmailOrId] = useState('headteacher@primaryschool.ac.tz');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [activeAccountLabel, setActiveAccountLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Available demonstration & testing accounts
  const demoAccounts: {
    title: string;
    roleLabel: string;
    user: UserAccount;
    path: string;
    badgeColor: string;
    description: string;
  }[] = [
    {
      title: 'Mkuu wa Shule',
      roleLabel: 'Headteacher / Principal',
      user: {
        id: 'USR-002',
        fullName: 'Mwl. Augustine Mrosso',
        role: 'HEADTEACHER',
        leadershipRole: 'HEADTEACHER',
        identifier: 'HT-2026-001',
        email: 'headteacher@primaryschool.ac.tz',
        phone: '+255 754 112 233',
        assignedClass: 'Senior Standards (Std 6 & 7)',
        assignedClasses: ['Standard 6 (Grade 6)', 'Standard 7 (Grade 7)'],
        subjects: ['Civic & Moral Education (Uraia na Maadili)', 'Social Studies (Maarifa ya Jamii)'],
        status: 'ACTIVE',
        joinedDate: '2026-01-15',
      },
      path: '/teacher',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Usimamizi Mkuu, Idhini ya Matokeo, Broadsheet & Ualimu',
    },
    {
      title: 'Makamu Mkuu wa Shule',
      roleLabel: 'Second Master / Deputy',
      user: {
        id: 'USR-002B',
        fullName: 'Mwl. Frank Msaki',
        role: 'HEADTEACHER',
        leadershipRole: 'HEADTEACHER',
        identifier: 'HT-2026-002',
        email: 'secondmaster@primaryschool.ac.tz',
        phone: '+255 754 112 234',
        assignedClass: 'Senior Standards (Std 5 & 6)',
        assignedClasses: ['Standard 5 (Grade 5)', 'Standard 6 (Grade 6)'],
        subjects: ['English Language', 'Social Studies (Maarifa ya Jamii)'],
        status: 'ACTIVE',
        joinedDate: '2026-01-16',
      },
      path: '/teacher',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Format ya HT, Msaidizi Mkuu, Idhini ya Matokeo & Uongozi',
    },
    {
      title: 'Mwl. Taaluma',
      roleLabel: 'Academic Master',
      user: {
        id: 'USR-003',
        fullName: 'Mwl. Beatrice Kimaro',
        role: 'ACADEMIC',
        leadershipRole: 'ACADEMIC',
        identifier: 'ACAD-2026-001',
        email: 'academic@primaryschool.ac.tz',
        phone: '+255 765 223 344',
        assignedClass: 'Standard 7 & Standard 4',
        assignedClasses: ['Standard 7 (Grade 7)', 'Standard 4 (Grade 4)'],
        subjects: ['Mathematics (Hisabati)', 'Science & Technology (Sayansi)'],
        status: 'ACTIVE',
        joinedDate: '2026-01-20',
      },
      path: '/teacher',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      description: 'Mitaala, Mitihani ya NECTA, Maazimio & Broadsheet',
    },
    {
      title: 'Msaidizi wa Taaluma',
      roleLabel: 'Assistant Academic Master',
      user: {
        id: 'USR-003B',
        fullName: 'Mwl. Emmanuel Lyimo',
        role: 'ACADEMIC',
        leadershipRole: 'ACADEMIC',
        identifier: 'ACAD-2026-002',
        email: 'asst.academic@primaryschool.ac.tz',
        phone: '+255 765 223 345',
        assignedClass: 'Standard 6 & Standard 5',
        assignedClasses: ['Standard 6 (Grade 6)', 'Standard 5 (Grade 5)'],
        subjects: ['English Language', 'Mathematics (Hisabati)'],
        status: 'ACTIVE',
        joinedDate: '2026-01-22',
      },
      path: '/teacher',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      description: 'Format ya ACAD, Kuunganisha Broadsheet, AI Review & Mitaala',
    },
    {
      title: 'Mwl. Nidhamu',
      roleLabel: 'Discipline Master',
      user: {
        id: 'USR-004',
        fullName: 'Mwl. Godfrey Makere',
        role: 'DISCIPLINE',
        leadershipRole: 'DISCIPLINE',
        identifier: 'DISC-2026-001',
        email: 'discipline@primaryschool.ac.tz',
        phone: '+255 784 334 455',
        assignedClass: 'Whole School',
        assignedClasses: ['Standard 5 (Grade 5)', 'Standard 6 (Grade 6)'],
        subjects: ['Civic & Moral Education (Uraia na Maadili)', 'Vocational Skills (Stadi za Kazi)'],
        status: 'ACTIVE',
        joinedDate: '2026-02-01',
      },
      path: '/teacher',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Kesi za Wanafunzi, Adhabu, Mahudhurio & Wazazi',
    },
    {
      title: 'Class Teacher (Std 6)',
      roleLabel: 'Mwalimu wa Darasa la 6',
      user: {
        id: 'USR-005',
        fullName: 'Mwl. Sarah Mollel',
        role: 'TEACHER',
        identifier: 'TCH-2026-012',
        email: 'sarah.mollel@primaryschool.ac.tz',
        phone: '+255 712 445 566',
        assignedClass: 'Standard 6 (Grade 6)',
        assignedClasses: ['Standard 6 (Grade 6)', 'Standard 5 (Grade 5)'],
        subjects: ['English Language', 'Kiswahili'],
        isHomeroomMaster: true,
        status: 'ACTIVE',
        joinedDate: '2026-02-15',
      },
      path: '/teacher/marks',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      description: 'Kujaza Alama (Excel Grid), Mahudhurio & Mazoezi',
    },
    {
      title: 'Class Teacher (Std 4)',
      roleLabel: 'Mwalimu wa Darasa la 4',
      user: {
        id: 'USR-006',
        fullName: 'Mwl. Emmanuel Swai',
        role: 'TEACHER',
        identifier: 'TCH-2026-015',
        email: 'emmanuel.swai@primaryschool.ac.tz',
        phone: '+255 767 556 677',
        assignedClass: 'Standard 4 (Grade 4)',
        assignedClasses: ['Standard 4 (Grade 4)', 'Standard 3 (Grade 3)'],
        subjects: ['Social Studies (Maarifa ya Jamii)', 'Vocational Skills'],
        isHomeroomMaster: false,
        status: 'ACTIVE',
        joinedDate: '2026-02-20',
      },
      path: '/teacher',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      description: 'Masomo ya Jamii, Stadi za Kazi & Kazi za Darasani',
    },
    {
      title: 'Mzazi / Mlezi',
      roleLabel: 'Parent / Guardian Portal',
      user: {
        id: 'USR-014',
        fullName: 'Mzee Bakari Juma (Mzazi)',
        role: 'PARENT',
        identifier: '+255755123456',
        phone: '+255 755 123 456',
        email: 'bakari.parent@gmail.com',
        assignedClass: 'Parent of Kelvin, Amina & Baraka',
        status: 'ACTIVE',
        joinedDate: '2026-01-15',
      },
      path: '/parent',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      description: 'Watoto 3 (Std 7, 6, 4), Matokeo, Ada (GePG) & Ruhusa',
    },
    {
      title: 'Mwanafunzi (Std 7)',
      roleLabel: 'Student 360° Portal',
      user: {
        id: 'USR-008',
        fullName: 'Kelvin Shirima',
        role: 'STUDENT',
        identifier: 'PSLE-2026-0428',
        email: 'kelvin.shirima@student.ac.tz',
        assignedClass: 'Standard 7 (Grade 7)',
        candidateType: 'PSLE',
        examIndexNo: 'PSLE/2026/0428',
        status: 'ACTIVE',
        joinedDate: '2026-01-08',
      },
      path: '/student',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      description: 'Matokeo, Ratiba, Kitambulisho cha QR & Mahafali 2026',
    },
  ];

  const handleSelectDemoAccount = (demo: (typeof demoAccounts)[0]) => {
    setActiveAccountLabel(demo.title);
    setEmailOrId(demo.user.email || demo.user.identifier);
    setPassword('Password123!');
    setError(null);

    // Save active session in local storage
    setCurrentSession(demo.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', `demo_token_${demo.user.id}`);
      localStorage.setItem('tenant_id', 'KUKUMBUKA-PS-2026');
      localStorage.setItem('user_roles', JSON.stringify([demo.user.role]));
    }

    setLoading(true);
    setTimeout(() => {
      router.push(demo.path);
    }, 400);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Check in local stored blueprint accounts first
      const allAccounts = getStoredAccounts();
      const matched = allAccounts.find(
        (a) =>
          a.email?.toLowerCase() === emailOrId.trim().toLowerCase() ||
          a.identifier?.toLowerCase() === emailOrId.trim().toLowerCase()
      );

      if (matched) {
        setCurrentSession(matched);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', `token_${matched.id}`);
          localStorage.setItem('tenant_id', 'KUKUMBUKA-PS-2026');
          localStorage.setItem('user_roles', JSON.stringify([matched.role]));
        }

        if (['HEADTEACHER', 'ACADEMIC', 'DISCIPLINE', 'TEACHER'].includes(matched.role)) {
          router.push('/teacher');
        } else if (matched.role === 'PARENT') {
          router.push('/parent');
        } else if (['STUDENT', 'CANDIDATE'].includes(matched.role)) {
          router.push('/student');
        } else {
          router.push('/teacher');
        }
        return;
      }

      // 2. Try online API login if server endpoint is running
      try {
        const res = await api.auth.login({ email: emailOrId, pass: password });
        if (res?.accessToken) {
          localStorage.setItem('auth_token', res.accessToken);
          localStorage.setItem('tenant_id', res.user?.tenantId || '');
          localStorage.setItem('user_roles', JSON.stringify(res.user?.roles || []));

          const roles: string[] = res.user?.roles || [];
          if (roles.includes('TEACHER') || roles.includes('HEADMASTER_PRINCIPAL')) {
            router.push('/teacher');
          } else if (roles.includes('STUDENT')) {
            router.push('/student');
          } else if (roles.includes('PARENT_GUARDIAN')) {
            router.push('/parent');
          } else {
            router.push('/teacher');
          }
          return;
        }
      } catch {
        // Fallback: If not matched and API fails
        setError('Taarifa za kuingia hazijathibitishwa. Tafadhali chagua akaunti moja ya majaribio hapa chini.');
      }
    } catch (err: any) {
      setError(err.message || 'Hitilafu ya kuingia kwenye mfumo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-950/20 border border-emerald-600/40">
          <School className="w-8 h-8 text-emerald-100" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Kukumbuka Academic Portal
        </h1>
        <p className="text-xs sm:text-sm text-emerald-900/80 font-medium">
          Mfumo Jumuishi wa Usimamizi wa Shule • Jamhuri ya Muungano wa Tanzania
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-3xl space-y-6">
        {/* Sign In Form Container */}
        <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-emerald-200/90 shadow-lg shadow-emerald-950/5 space-y-6">
          <div className="border-b border-emerald-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Ingia Kwenye Akaunti Yako
              </h2>
              <p className="text-xs text-slate-500">
                Weka barua pepe yako rasmi au namba ya kitambulisho cha shule
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Mfumo Salama</span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1.5">
                  Barua Pepe / Namba ya Utambulisho
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-800">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                    placeholder="mfano: headteacher@primaryschool.ac.tz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1.5">
                  Nenosiri (Password)
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-800">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl shadow-md shadow-emerald-950/15 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Inathibitisha na kuingia...</span>
              ) : (
                <>
                  <span>Ingia Kwenye Mfumo (Sign In)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* ================================================================= */}
          {/* DEDICATED TESTING & DEMONSTRATION ACCOUNTS SELECTOR */}
          {/* ================================================================= */}
          <div className="pt-6 border-t border-emerald-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Akaunti za Majaribio &amp; Uthibitishaji (Testing Demo Roles)
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">
                Bofya akaunti yoyote kuanza majaribio halisi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {demoAccounts.map((demo) => {
                const isSelected = activeAccountLabel === demo.title;
                return (
                  <button
                    key={demo.title}
                    type="button"
                    onClick={() => handleSelectDemoAccount(demo)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-950 shadow-md ring-2 ring-emerald-600'
                        : 'bg-emerald-50/40 hover:bg-emerald-100/60 border-emerald-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[11px] font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {demo.title}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                          isSelected ? 'bg-emerald-800 text-emerald-100 border-emerald-700' : demo.badgeColor
                        }`}
                      >
                        {demo.user.role}
                      </span>
                    </div>

                    <div className={`text-[10px] font-semibold truncate ${isSelected ? 'text-emerald-200' : 'text-emerald-900'}`}>
                      {demo.user.fullName}
                    </div>

                    <p className={`text-[9px] mt-1 line-clamp-1 ${isSelected ? 'text-emerald-100/80' : 'text-slate-500'}`}>
                      {demo.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>
            Kukumbuka Academic Portal • Imetengenezwa mahsusi kwa Uendeshaji wa Shule za Awali, Msingi na Sekondari
          </p>
          <p className="text-[10px] text-emerald-800 font-bold">
            Usalama wa Taarifa • Uthibitishaji wa NECTA &amp; GePG • Lugha: Kiswahili (TZ)
          </p>
        </div>
      </div>
    </div>
  );
}
