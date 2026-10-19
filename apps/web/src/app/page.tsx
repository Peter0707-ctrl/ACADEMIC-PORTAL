'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getStoredAccounts,
  saveStoredAccounts,
  setStoredAccounts,
  setCurrentSession,
  UserAccount,
  UserRole,
  PRIMARY_CLASSES_LIST,
  PRIMARY_SUBJECTS_LIST,
} from '@/lib/auth-session';
import {
  School,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  BookOpen,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Heart,
  Shield,
  DollarSign,
  FolderArchive,
  GraduationCap,
  Sparkles,
  Check,
  UserPlus,
} from 'lucide-react';

export default function PrimaryPortalHomePage() {
  const router = useRouter();

  // 1. 5-Second Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // School Information
  const school = {
    name: 'PRIMARY & NURSERY SCHOOL',
    shortCode: 'PRIMARY-PORTAL',
    motto: 'Excellence, Integrity and Character',
    category: 'Official Primary School Academic Management Portal',
    phone: '0779304500',
    email: 'pj0040280@gmail.com',
    location: 'Dar es Salaam, Tanzania',
  };

  // Portal View State: 'ROLE_SELECT' | 'PARENT' | 'TEACHER'
  const [portalView, setPortalView] = useState<'ROLE_SELECT' | 'PARENT' | 'TEACHER'>('ROLE_SELECT');

  // Parent Mode: 'LOGIN' | 'REGISTER'
  const [parentMode, setParentMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Staff Mode: 'LOGIN' | 'REGISTER'
  const [staffMode, setStaffMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Staff Login Form States
  const [staffIdentifier, setStaffIdentifier] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [isStaffLoggingIn, setIsStaffLoggingIn] = useState(false);
  const [staffError, setStaffError] = useState<string | null>(null);

  // Staff Registration Form States
  const [staffFullName, setStaffFullName] = useState('');
  const [staffRole, setStaffRole] = useState<UserRole>('TEACHER');
  const [staffRegId, setStaffRegId] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffAssignedClass, setStaffAssignedClass] = useState(PRIMARY_CLASSES_LIST[3]);
  const [staffSubjects, setStaffSubjects] = useState<string[]>([PRIMARY_SUBJECTS_LIST[0]]);
  const [staffRegPassword, setStaffRegPassword] = useState('');
  const [staffConfirmPassword, setStaffConfirmPassword] = useState('');
  const [showStaffRegPassword, setShowStaffRegPassword] = useState(false);
  const [isStaffRegistering, setIsStaffRegistering] = useState(false);
  const [staffRegisterSuccess, setStaffRegisterSuccess] = useState<string | null>(null);
  const [staffRegisterError, setStaffRegisterError] = useState<string | null>(null);

  // Parent Login Form States
  const [parentLoginPhone, setParentLoginPhone] = useState('');
  const [parentLoginPassword, setParentLoginPassword] = useState('');
  const [showParentLoginPassword, setShowParentLoginPassword] = useState(false);
  const [isParentLoggingIn, setIsParentLoggingIn] = useState(false);
  const [parentLoginError, setParentLoginError] = useState<string | null>(null);

  // Parent Registration Form States
  const [parentFullName, setParentFullName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [childAdmNumber, setChildAdmNumber] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [parentRegisterPassword, setParentRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showParentRegPassword, setShowParentRegPassword] = useState(false);
  const [isParentRegistering, setIsParentRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // 1. Staff Login Handler
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);

    const cleanInput = staffIdentifier.trim().toLowerCase();
    if (!cleanInput) {
      setStaffError('Please enter your Staff ID or Email.');
      return;
    }

    setIsStaffLoggingIn(true);

    setTimeout(() => {
      setIsStaffLoggingIn(false);
      const accounts = getStoredAccounts();

      const matched = accounts.find((a) => {
        const emailMatch = a.email && a.email.toLowerCase() === cleanInput;
        const idMatch = a.identifier.toLowerCase() === cleanInput;
        return emailMatch || idMatch;
      });

      if (matched && matched.role !== 'PARENT') {
        // If logging in as admin, check password if provided
        if (matched.role === 'ADMIN' && staffPassword.trim() && staffPassword !== 'password' && staffPassword !== 'Password123!') {
          setStaffError('Nenosiri si sahihi. Tafadhali hakiki nenosiri lako.');
          return;
        }

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
        } else if (matched.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/teacher');
        }
      } else {
        setStaffError('Staff account not found. Please verify your Staff ID or Email.');
      }
    }, 350);
  };

  // 2. Staff Registration Handler
  const handleStaffRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffRegisterError(null);
    setStaffRegisterSuccess(null);

    if (!staffFullName.trim() || !staffRegId.trim()) {
      setStaffRegisterError('Please enter your Full Name and Staff ID / TSC Number.');
      return;
    }

    if (staffRegPassword.length < 6) {
      setStaffRegisterError('Password must contain at least 6 characters.');
      return;
    }

    if (staffRegPassword !== staffConfirmPassword) {
      setStaffRegisterError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsStaffRegistering(true);

    setTimeout(() => {
      setIsStaffRegistering(false);
      const accounts = getStoredAccounts();

      const exists = accounts.some(
        (a) =>
          a.identifier.toLowerCase() === staffRegId.trim().toLowerCase() ||
          (a.email && staffEmail.trim() && a.email.toLowerCase() === staffEmail.trim().toLowerCase())
      );
      if (exists) {
        setStaffRegisterError('An account with this Staff ID or Email already exists.');
        return;
      }

      const newAccount: UserAccount = {
        id: `STF-${Date.now().toString().slice(-4)}`,
        fullName: staffFullName.trim(),
        role: staffRole,
        identifier: staffRegId.trim(),
        email: staffEmail.trim() || undefined,
        phone: staffPhone.trim() || undefined,
        assignedClass: ['TEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(staffRole)
          ? staffAssignedClass
          : undefined,
        subjects: ['TEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(staffRole)
          ? staffSubjects
          : undefined,
        status: 'ACTIVE',
        joinedDate: new Date().toISOString().split('T')[0],
      };

      const updated = [newAccount, ...accounts];
      setStoredAccounts(updated);

      // Auto login & establish session
      setCurrentSession(newAccount);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', `token_${newAccount.id}`);
        localStorage.setItem('tenant_id', 'inst-001');
        localStorage.setItem('user_roles', JSON.stringify([newAccount.role]));
      }

      setStaffRegisterSuccess('Staff account created successfully! Redirecting to workspace...');

      setTimeout(() => {
        if (newAccount.role === 'ACCOUNTANT') {
          router.push('/accountant');
        } else if (newAccount.role === 'SECRETARY') {
          router.push('/secretary');
        } else {
          router.push('/teacher');
        }
      }, 700);
    }, 400);
  };

  // 3. Parent Login Handler
  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setParentLoginError(null);

    const cleanInput = parentLoginPhone.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanInput) {
      setParentLoginError('Please enter your phone number.');
      return;
    }

    setIsParentLoggingIn(true);

    setTimeout(() => {
      setIsParentLoggingIn(false);
      const accounts = getStoredAccounts();

      // Check if admin is logging in through the parent tab
      if (cleanInput === 'drestgroup@gmail.com') {
        const adminAcc = accounts.find((a) => a.role === 'ADMIN');
        if (adminAcc) {
          if (parentLoginPassword.trim() && parentLoginPassword !== 'password' && parentLoginPassword !== 'Password123!') {
            setParentLoginError('Nenosiri si sahihi. Tafadhali hakiki nenosiri lako.');
            return;
          }
          setCurrentSession(adminAcc);
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', `token_${adminAcc.id}`);
            localStorage.setItem('tenant_id', 'inst-001');
            localStorage.setItem('user_roles', JSON.stringify(['ADMIN']));
          }
          router.push('/parent');
          return;
        }
      }

      const matched = accounts.find((a) => {
        if (a.role !== 'PARENT') return false;
        const phoneMatch = a.phone && a.phone.replace(/\s+/g, '') === cleanInput;
        const idMatch = a.identifier.replace(/\s+/g, '').toLowerCase() === cleanInput;
        const emailMatch = a.email && a.email.toLowerCase() === cleanInput;
        return phoneMatch || idMatch || emailMatch;
      });

      if (matched) {
        setCurrentSession(matched);
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', `token_${matched.id}`);
          localStorage.setItem('tenant_id', 'inst-001');
          localStorage.setItem('user_roles', JSON.stringify([matched.role]));
        }
        router.push('/parent');
      } else {
        setParentLoginError('Parent account not found. Please verify your phone number or register a new account.');
      }
    }, 350);
  };

  // 4. Parent Registration Handler
  const handleParentRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    setRegisterSuccess(null);

    if (!parentFullName.trim() || !parentPhone.trim() || !childAdmNumber.trim()) {
      setRegisterError('Please enter your Name, Phone Number, and Child Admission Number.');
      return;
    }

    if (parentRegisterPassword.length < 6) {
      setRegisterError('Password must contain at least 6 characters.');
      return;
    }

    if (parentRegisterPassword !== confirmPassword) {
      setRegisterError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsParentRegistering(true);

    setTimeout(() => {
      setIsParentRegistering(false);
      const accounts = getStoredAccounts();

      const newParent: UserAccount = {
        id: `USR-PAR-${Date.now().toString().slice(-4)}`,
        fullName: `${parentFullName.trim()} (Parent)`,
        role: 'PARENT',
        identifier: parentPhone.trim().replace(/\s+/g, ''),
        phone: parentPhone.trim(),
        email: parentEmail.trim() || undefined,
        assignedClass: `Pupil Parent (${childAdmNumber.trim().toUpperCase()})`,
        status: 'ACTIVE',
        joinedDate: new Date().toISOString().slice(0, 10),
      };

      saveStoredAccounts([newParent, ...accounts]);
      setCurrentSession(newParent);

      setRegisterSuccess('Account registered successfully! Redirecting to Parent Portal...');
      setTimeout(() => {
        router.push('/parent');
      }, 1000);
    }, 450);
  };

  // =====================================================================
  // 1. FIRST SCREEN: STANDALONE WELCOME / SPLASH SCREEN
  // Starts alone; NOTHING else is rendered until this completes or user clicks proceed!
  // =====================================================================
  if (showSplash) {
    return (
      <div
        className="min-h-screen text-slate-800 flex flex-col justify-between items-center p-6 bg-cover bg-center bg-no-repeat font-sans relative"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(240, 253, 244, 0.30) 0%, rgba(209, 250, 229, 0.40) 100%), url('/images/primary_school_pupils.jpg')`,
        }}
      >
        {/* Top spacer */}
        <div />

        {/* Center Welcome Card - Floating Animated */}
        <div className="relative z-10 flex flex-col items-center max-w-sm sm:max-w-md w-full text-center space-y-4 bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-emerald-200 shadow-2xl text-slate-800 animate-float">
          {/* School Logo Symbol with Concentric Spreading Waves */}
          <div className="relative flex items-center justify-center my-2">
            {/* Concentric circular spreading wave rings */}
            <span className="absolute w-16 h-16 rounded-full bg-emerald-400/35 border-2 border-emerald-500/50 animate-ripple-1 pointer-events-none" />
            <span className="absolute w-16 h-16 rounded-full bg-emerald-400/25 border-2 border-emerald-500/40 animate-ripple-2 pointer-events-none" />
            <span className="absolute w-16 h-16 rounded-full bg-emerald-300/20 border-2 border-emerald-400/30 animate-ripple-3 pointer-events-none" />

            {/* Central Symbol Badge */}
            <div className="relative z-10 w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 text-emerald-800 flex items-center justify-center shadow-lg animate-pulse-soft">
              <GraduationCap className="w-8 h-8 text-emerald-700" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <School className="w-3.5 h-3.5 text-emerald-700" />
            <span>Primary School Digital Portal</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {school.name}
            </h1>
            <p className="text-xs text-slate-500 italic font-medium">
              &quot;{school.motto}&quot;
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2 w-full">
            <button
              type="button"
              onClick={() => setShowSplash(false)}
              className="w-full inline-flex items-center justify-center gap-2 text-xs text-white bg-emerald-700 hover:bg-emerald-800 font-bold py-3 px-6 rounded-xl transition-all shadow-xs group cursor-pointer"
            >
              <span>Endelea kwenye Mfumo (Proceed to Portal)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Contact summary */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between w-full text-[11px] text-slate-500">
            <span>Simu: {school.phone}</span>
            <span>{school.email}</span>
          </div>
        </div>

        {/* Footer for first page */}
        <footer className="text-center text-xs text-slate-900 font-bold py-3 drop-shadow-xs">
          &copy; {new Date().getFullYear()} {school.name}. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-slate-800 flex flex-col font-sans relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(240, 253, 244, 0.35) 0%, rgba(220, 252, 231, 0.40) 50%, rgba(209, 250, 229, 0.50) 100%), url('/images/primary_school_pupils.jpg')`,
      }}
    >
      {/* ===================================================================== */}
      {/* HEADER NAVBAR */}
      {/* ===================================================================== */}
      <header className="bg-white/85 backdrop-blur-md border-b border-emerald-200/60 py-3 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                {school.name}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Official Primary Education Portal
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              {school.phone}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              {school.email}
            </span>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN AUTHENTICATION CONTAINER (CLEAN, COMPACT, ENGLISH) */}
      {/* ===================================================================== */}
      {/* ===================================================================== */}
      {/* MAIN PORTAL AREA: ROLE SELECTOR & DEDICATED AUTH FORMS */}
      {/* ===================================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto w-full">
        {/* ----------------------------------------------------------------- */}
        {/* 1. ROLE SELECTOR (PARENT vs TEACHER & STAFF) */}
        {/* ----------------------------------------------------------------- */}
        {portalView === 'ROLE_SELECT' && (
          <div className="w-full max-w-xl space-y-6 animate-scale-in">
            <div className="text-center space-y-1.5">
              <span className="text-xs font-semibold text-emerald-800 bg-white/90 px-3 py-1 rounded-full border border-emerald-200 inline-block shadow-2xs">
                Primary School Academic Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Select Your Portal
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Please select your role to proceed to your dedicated portal
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 animate-float">
              {/* Option 1: PARENT / GUARDIAN */}
              <div
                onClick={() => {
                  setPortalView('PARENT');
                  setParentMode('LOGIN');
                  setParentLoginError(null);
                }}
                className="group p-6 rounded-3xl bg-white/95 border-2 border-emerald-200/90 hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-950/10 transition-all cursor-pointer flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-800 group-hover:text-white transition-all shadow-xs">
                    <Heart className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                      Parent / Guardian
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Check your child&apos;s results, attendance, fee balance, and teacher messages.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform border-t border-slate-100">
                  <span>Sign In as Parent</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Option 2: TEACHER & STAFF */}
              <div
                onClick={() => {
                  setPortalView('TEACHER');
                  setStaffMode('LOGIN');
                  setStaffError(null);
                  setStaffRegisterError(null);
                }}
                className="group p-6 rounded-3xl bg-white/95 border-2 border-emerald-200/90 hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-950/10 transition-all cursor-pointer flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 group-hover:bg-teal-800 group-hover:text-white transition-all shadow-xs">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-800 transition-colors">
                      Teacher &amp; Staff
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Manage broadsheets, grade entries, official approvals, fee accounts, and school records.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-teal-800 group-hover:translate-x-1 transition-transform border-t border-slate-100">
                  <span>Sign In as Staff</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* 2. DEDICATED PARENT PORTAL (PURE PARENT ONLY) */}
        {/* ----------------------------------------------------------------- */}
        {portalView === 'PARENT' && (
          <div className="w-full max-w-md space-y-4 animate-float">
            {/* Top Back Nav & Role Badge */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPortalView('ROLE_SELECT')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-700" />
                <span>Change Role</span>
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                <Heart className="w-3.5 h-3.5 text-emerald-700" />
                <span>Parent Portal</span>
              </span>
            </div>

            {/* Parent Mode Switcher */}
            <div className="flex items-center bg-emerald-100/70 border border-emerald-200/70 p-1 rounded-xl w-full">
              <button
                type="button"
                onClick={() => setParentMode('LOGIN')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                  parentMode === 'LOGIN'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setParentMode('REGISTER')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center ${
                  parentMode === 'REGISTER'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register Account
              </button>
            </div>

            {/* Form A: Parent Sign In */}
            {parentMode === 'LOGIN' && (
              <div className="w-full bg-white/95 rounded-2xl border border-emerald-200/80 shadow-lg shadow-emerald-950/5 p-6 space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-black text-slate-900">Parent Sign In</h2>
                  <p className="text-xs text-slate-500">
                    Enter your registered phone number to view your child&apos;s records
                  </p>
                </div>

                {parentLoginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{parentLoginError}</span>
                  </div>
                )}

                <form onSubmit={handleParentLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0755 123 456"
                      value={parentLoginPhone}
                      onChange={(e) => setParentLoginPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowParentLoginPassword(!showParentLoginPassword)}
                        className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        {showParentLoginPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showParentLoginPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showParentLoginPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your account password"
                        value={parentLoginPassword}
                        onChange={(e) => setParentLoginPassword(e.target.value)}
                        className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isParentLoggingIn}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 transition-all flex items-center justify-center gap-2"
                  >
                    {isParentLoggingIn ? (
                      <span>Signing In...</span>
                    ) : (
                      <>
                        <span>Sign In as Parent</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setParentMode('REGISTER')}
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    New Parent? Register Account Here
                  </button>
                </div>
              </div>
            )}

            {/* Form B: Parent Registration */}
            {parentMode === 'REGISTER' && (
              <div className="w-full bg-white/95 rounded-2xl border border-emerald-200/80 shadow-lg shadow-emerald-950/5 p-6 space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-black text-slate-900">Parent Registration</h2>
                  <p className="text-xs text-slate-500">
                    Link your phone to your child&apos;s admission number
                  </p>
                </div>

                {registerError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{registerError}</span>
                  </div>
                )}

                {registerSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>{registerSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleParentRegisterSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David M. Shirima"
                      value={parentFullName}
                      onChange={(e) => setParentFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0754 000 000"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Child Admission # *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PS-2026-001"
                        value={childAdmNumber}
                        onChange={(e) => setChildAdmNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Relationship *
                      </label>
                      <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      >
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Legal Guardian">Guardian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="parent@gmail.com"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password *
                      </label>
                      <input
                        type={showParentRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Min. 6 chars"
                        value={parentRegisterPassword}
                        onChange={(e) => setParentRegisterPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type={showParentRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isParentRegistering}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isParentRegistering ? (
                      <span>Registering...</span>
                    ) : (
                      <>
                        <span>Create Parent Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setParentMode('LOGIN')}
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Already registered? Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* 3. DEDICATED TEACHER & STAFF PORTAL (PURE STAFF ONLY) */}
        {/* ----------------------------------------------------------------- */}
        {portalView === 'TEACHER' && (
          <div className="w-full max-w-md space-y-4 animate-float">
            {/* Top Back Nav & Role Badge */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPortalView('ROLE_SELECT')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-teal-700" />
                <span>Change Role</span>
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 font-bold text-xs">
                <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
                <span>Teacher &amp; Staff Portal</span>
              </span>
            </div>

            {/* Form A: Teacher & Staff Login */}
            {staffMode === 'LOGIN' && (
              <div className="w-full bg-white/95 rounded-2xl border border-emerald-200/80 shadow-lg shadow-emerald-950/5 p-6 space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-black text-slate-900">Teacher &amp; Staff Sign In</h2>
                  <p className="text-xs text-slate-500">
                    Enter your Staff ID or school email to access your workspace
                  </p>
                </div>

                {staffError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{staffError}</span>
                  </div>
                )}

                <form onSubmit={handleStaffLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Staff ID or School Email
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HT-2026-001 or teacher@primaryschool.ac.tz"
                      value={staffIdentifier}
                      onChange={(e) => setStaffIdentifier(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowStaffPassword(!showStaffPassword)}
                        className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        {showStaffPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showStaffPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showStaffPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your account password"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isStaffLoggingIn}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 transition-all flex items-center justify-center gap-2"
                  >
                    {isStaffLoggingIn ? (
                      <span>Signing In...</span>
                    ) : (
                      <>
                        <span>Sign In to Staff Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setStaffMode('REGISTER');
                      setStaffRegisterError(null);
                      setStaffRegisterSuccess(null);
                    }}
                    className="text-xs font-semibold text-teal-800 hover:underline"
                  >
                    New Staff or Teacher? Register Account Here
                  </button>
                </div>
              </div>
            )}

            {/* Form B: Teacher & Staff Registration */}
            {staffMode === 'REGISTER' && (
              <div className="w-full bg-white/95 rounded-2xl border border-emerald-200/80 shadow-lg shadow-emerald-950/5 p-6 space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-black text-slate-900">Staff &amp; Teacher Registration</h2>
                  <p className="text-xs text-slate-500">
                    Create your teacher or administrative staff account
                  </p>
                </div>

                {staffRegisterError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{staffRegisterError}</span>
                  </div>
                )}

                {staffRegisterSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>{staffRegisterSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleStaffRegisterSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Staff Role / Title *
                    </label>
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-semibold"
                    >
                      <option value="TEACHER">Mwalimu wa Darasa (Class Teacher)</option>
                      <option value="HEADTEACHER">Mkuu wa Shule (Headteacher)</option>
                      <option value="ACADEMIC">Mwalimu wa Taaluma (Academic Master)</option>
                      <option value="DISCIPLINE">Mwalimu wa Nidhamu (Discipline Master)</option>
                      <option value="ACCOUNTANT">Mhasibu wa Shule (Bursar / Accountant)</option>
                      <option value="SECRETARY">Katibu wa Shule (Secretary / Registrar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name (Jina Kamili) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mwl. Kelvin Mrosso"
                      value={staffFullName}
                      onChange={(e) => setStaffFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Staff ID / TSC No *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TCH-2026-001"
                        value={staffRegId}
                        onChange={(e) => setStaffRegId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+255 7..."
                        value={staffPhone}
                        onChange={(e) => setStaffPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official School Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="teacher@primaryschool.ac.tz"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                    />
                  </div>

                  {/* Assigned Class for teachers */}
                  {['TEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(staffRole) && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Assigned Class (Darasa Analohusika)
                      </label>
                      <select
                        value={staffAssignedClass}
                        onChange={(e) => setStaffAssignedClass(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      >
                        {PRIMARY_CLASSES_LIST.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-slate-700">
                          Password *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowStaffRegPassword(!showStaffRegPassword)}
                          className="text-[10px] text-emerald-700 hover:underline"
                        >
                          {showStaffRegPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      <input
                        type={showStaffRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Min. 6 chars"
                        value={staffRegPassword}
                        onChange={(e) => setStaffRegPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type={showStaffRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={staffConfirmPassword}
                        onChange={(e) => setStaffConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isStaffRegistering}
                    className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-950/10 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isStaffRegistering ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Staff Account</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setStaffMode('LOGIN');
                      setStaffError(null);
                    }}
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Already have a staff account? Sign In Here
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* COMPREHENSIVE TRANSPARENT FOOTER - PICTURE 100% VISIBLE */}
      {/* ===================================================================== */}
      <footer className="mt-auto bg-transparent pt-10 pb-6 px-4 sm:px-8 text-slate-900">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-slate-900/15">
            {/* Column 1: School / Portal Brand */}
            <div className="space-y-2.5 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                </div>
                <span className="font-black text-slate-900 text-xs tracking-tight">
                  {school.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-800 font-semibold leading-relaxed">
                Universal Primary School Academic Management System — digital records, financial clearance, teacher broadsheets, and parent portal.
              </p>
              <div className="inline-flex items-center gap-1.5 text-emerald-900 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>System Online • All Portals Active</span>
              </div>
            </div>

            {/* Column 2: Portal Roles */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                School Portals
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-800 font-semibold">
                <li><button type="button" onClick={() => { setPortalView('TEACHER'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-900 hover:underline">Head Teacher &amp; Leadership</button></li>
                <li><button type="button" onClick={() => { setPortalView('TEACHER'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-900 hover:underline">Academic &amp; Subject Teachers</button></li>
                <li><button type="button" onClick={() => { setPortalView('TEACHER'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-900 hover:underline">School Accountant &amp; Finance</button></li>
                <li><button type="button" onClick={() => { setPortalView('TEACHER'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-900 hover:underline">School Registry &amp; Secretary</button></li>
                <li><button type="button" onClick={() => { setPortalView('PARENT'); setParentMode('LOGIN'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-900 hover:underline">Parent / Guardian Portal</button></li>
              </ul>
            </div>

            {/* Column 3: Academic Standards & Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Academic Modules
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-800 font-semibold">
                <li>Standard 1–7 Results Broadsheets</li>
                <li>School Fee Accounts &amp; Receipts</li>
                <li>Digital Student Records &amp; Archives</li>
                <li>Pupil Attendance &amp; Discipline</li>
                <li>Official Term Reports &amp; Seals</li>
              </ul>
            </div>

            {/* Column 4: Contact & Verification */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Support &amp; Verification
              </h4>
              <div className="space-y-1.5 text-xs text-slate-800 font-bold">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <span>{school.phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <span>{school.email}</span>
                </p>
                <p className="text-[11px] text-slate-700 font-medium pt-1">
                  Primary Education Management Platform • Version 2.6.4
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Rights Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-800 font-bold">
            <p>
              &copy; {new Date().getFullYear()} PRIMARY &amp; NURSERY SCHOOL. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-700 font-semibold">
              <span className="hover:text-slate-900 cursor-pointer">Privacy &amp; Pupil Data Policy</span>
              <span>•</span>
              <span className="hover:text-slate-900 cursor-pointer">Security Standards</span>
              <span>•</span>
              <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
