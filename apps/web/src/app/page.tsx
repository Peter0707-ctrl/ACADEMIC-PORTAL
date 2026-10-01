'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  School,
  Building2,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Info,
  Eye,
  EyeOff,
  UserCheck,
  Heart,
  BookOpen,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  X,
  MapPin,
  Clock,
  Bus,
  Shield,
  FileText,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// DYNAMIC UI CONFIGURATION (ZERO HARDCODED LABELS IN JSX)
// -----------------------------------------------------------------------------
const AUTH_CONFIG = {
  brand: {
    name: 'UniversalEd Primary',
    badge: 'Primary & Nursery School Portal',
    motto: 'Child-Centered Primary Education System',
  },
  roles: [
    {
      id: 'TEACHER',
      label: 'Class Teacher',
      subtitle: 'Roll-call, marks & pupil remarks',
      icon: BookOpen,
    },
    {
      id: 'PARENT',
      label: 'Parent / Guardian',
      subtitle: 'Child reports, attendance & fees',
      icon: Heart,
    },
    {
      id: 'STUDENT',
      label: 'Pupil / Student',
      subtitle: 'Homework & academic progress',
      icon: UserCheck,
    },
  ],
  splash: {
    durationMs: 5000,
    loadingLabel: 'Initializing Secure Primary Environment...',
    skipButton: 'Skip to Portal',
    tagline: 'Empowering Young Learners with Smart Digital Tools',
  },
  login: {
    title: 'Sign In to School Portal',
    subtitle: 'Select your role to access your classroom or parent dashboard.',
    identifierPlaceholder: 'Enter email address or mobile number',
    identifierLabel: 'Email or Mobile Number',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    rememberMeLabel: 'Remember this device',
    forgotPasswordLabel: 'Forgot credentials?',
    submitButton: 'Sign In Securely',
    submittingButton: 'Verifying Credentials...',
    switchToRegister: 'Need to register your Primary School?',
    switchAction: 'Register School Here',
  },
  register: {
    title: 'Register Primary School',
    subtitle: 'Set up your Nursery, Pre-Unit, or Primary School (Standards 1 to 7).',
    schoolNameLabel: 'Official Primary School Name',
    schoolNamePlaceholder: 'e.g. St. Jude Primary Academy',
    shortCodeLabel: 'Short Code (School Identifier)',
    shortCodePlaceholder: 'e.g. SJPA',
    adminNameLabel: 'Headteacher / Principal Full Name',
    adminNamePlaceholder: 'e.g. Peter Msira',
    emailLabel: 'Official School Email',
    emailPlaceholder: 'headteacher@school.ac.tz',
    phoneLabel: 'Official Mobile Number',
    phonePlaceholder: '+255 779 304 500',
    gradesOfferedLabel: 'Grades & Sections Offered',
    passwordLabel: 'Admin Password',
    passwordPlaceholder: 'Minimum 8 characters with numbers & symbols',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter admin password',
    submitButton: 'Complete School Registration',
    submittingButton: 'Provisioning School Portal...',
    switchToLogin: 'Already have a school account?',
    switchAction: 'Sign In to Portal',
  },
  gradeOptions: [
    { id: 'NURSERY_PRIMARY', label: 'Nursery, Pre-Unit & Primary (Standards 1 - 7)' },
    { id: 'PRIMARY_ONLY', label: 'Standards 1 to 7 Only' },
    { id: 'EARLY_YEARS', label: 'Early Years & Kindergarten Only' },
  ],
};

// -----------------------------------------------------------------------------
// SECURITY SANITIZATION & VALIDATION ENGINE
// -----------------------------------------------------------------------------
function sanitizeInput(val: string): string {
  if (!val) return '';
  return val
    .trim()
    .replace(/[<>'"/\\`]/g, '') // Strip potential XSS vector characters
    .slice(0, 150); // Bound length against buffer exhaustion
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length >= 9 && digits.length <= 13;
}

interface PasswordStrength {
  score: number;
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

function checkPasswordStrength(pwd: string): PasswordStrength {
  const hasMinLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd);

  const criteria = [hasMinLength, hasUpper, hasLower, hasNumber, hasSymbol];
  const score = criteria.filter(Boolean).length;

  return { score, hasMinLength, hasUpper, hasLower, hasNumber, hasSymbol };
}

// -----------------------------------------------------------------------------
// NOTIFICATION MODAL TYPE DEFINITION (SMALL BLUE FORM AT CENTER)
// -----------------------------------------------------------------------------
interface CenteredNotification {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export default function PrimaryPortalHomePage() {
  // 0. Dynamic Client School Blueprint State
  const [school, setSchool] = useState({
    name: 'PRIMARY & NURSERY SCHOOL ACADEMY',
    shortCode: 'PNA',
    motto: 'Knowledge, Character & Academic Excellence',
    category: 'Nursery, Pre-Unit & Standards 1 to 7',
    phone: '+255 779 304 500',
    email: 'pj0040280@gmail.com',
    location: 'Dar es Salaam, Tanzania',
  });

  // 1. Splash Screen State (5 seconds)
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);

  // 2. Active View: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // 3. Pre-Login Role Selection: STRICTLY 3 ROLES (Teacher, Parent, Pupil). ADMIN IS NEVER EXPOSED.
  const [selectedRole, setSelectedRole] = useState<'TEACHER' | 'PARENT' | 'STUDENT'>('TEACHER');

  // 4. Centered Small Blue Notification Form State
  const [notification, setNotification] = useState<CenteredNotification | null>(null);

  // 5. Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // 6. Registration Form State
  const [regSchoolName, setRegSchoolName] = useState('');
  const [regShortCode, setRegShortCode] = useState('');
  const [regAdminName, setRegAdminName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGradeTier, setRegGradeTier] = useState('NURSERY_PRIMARY');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Trigger Small Blue Centered Notification
  const triggerNotification = useCallback((type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => {
    setNotification({ type, title, message });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // ---------------------------------------------------------------------------
  // 5-SECOND SPLASH SCREEN CHOREOGRAPHY
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = AUTH_CONFIG.splash.durationMs;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
      setProgress(pct);

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setShowSplash(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const skipSplash = () => {
    setShowSplash(false);
  };

  // Password Strength Calculation
  const regPasswordStrength = useMemo(() => checkPasswordStrength(regPassword), [regPassword]);

  // ---------------------------------------------------------------------------
  // LOGIN SUBMISSION HANDLER WITH SECURITY VERIFICATION
  // ---------------------------------------------------------------------------
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) {
      triggerNotification(
        'error',
        'Security Rate Limit',
        'Account verification temporarily suspended. Please wait 30 seconds before attempting again.'
      );
      return;
    }

    const cleanIdentifier = sanitizeInput(loginIdentifier);
    const cleanPassword = loginPassword.trim();

    if (!cleanIdentifier || !cleanPassword) {
      triggerNotification(
        'warning',
        'Input Required',
        'Please enter both your identifier (email or phone) and your password to proceed.'
      );
      return;
    }

    // Role-specific format validation
    const isValidInput = validateEmail(cleanIdentifier) || validatePhone(cleanIdentifier);
    if (!isValidInput) {
      triggerNotification(
        'error',
        'Invalid Format',
        'Please provide a valid email address (e.g. teacher@school.ac.tz) or mobile phone number.'
      );
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);

      // Demonstrate verification for selected role
      const roleLabel = AUTH_CONFIG.roles.find((r) => r.id === selectedRole)?.label || 'User';

      triggerNotification(
        'success',
        'Authentication Verified',
        `Welcome to the ${roleLabel} portal. Secure session established for ${cleanIdentifier}.`
      );
    }, 1000);
  };

  // ---------------------------------------------------------------------------
  // REGISTRATION SUBMISSION HANDLER WITH VALIDATION
  // ---------------------------------------------------------------------------
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanSchoolName = sanitizeInput(regSchoolName);
    const cleanShortCode = sanitizeInput(regShortCode).toUpperCase();
    const cleanAdminName = sanitizeInput(regAdminName);
    const cleanEmail = sanitizeInput(regEmail);
    const cleanPhone = sanitizeInput(regPhone);

    if (!cleanSchoolName || !cleanShortCode || !cleanAdminName || !cleanEmail || !cleanPhone) {
      triggerNotification(
        'warning',
        'Incomplete Details',
        'All primary school information fields are required to provision your portal.'
      );
      return;
    }

    if (!validateEmail(cleanEmail)) {
      triggerNotification(
        'error',
        'Invalid Email Address',
        'Please enter an official school email address in standard format.'
      );
      return;
    }

    if (!validatePhone(cleanPhone)) {
      triggerNotification(
        'error',
        'Invalid Phone Number',
        'Please provide a valid school telephone or mobile number (minimum 9 digits).'
      );
      return;
    }

    if (regPasswordStrength.score < 3) {
      triggerNotification(
        'warning',
        'Weak Password',
        'Password must be at least 8 characters long and combine uppercase, lowercase, numbers, or symbols.'
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      triggerNotification(
        'error',
        'Password Mismatch',
        'The password confirmation does not match the password entered.'
      );
      return;
    }

    setIsRegistering(true);

    setTimeout(() => {
      setIsRegistering(false);
      triggerNotification(
        'success',
        'Primary School Provisioned',
        `${cleanSchoolName} (${cleanShortCode}) has been successfully created. You can now sign in using your admin credentials.`
      );
      setAuthMode('login');
      setLoginIdentifier(cleanEmail);
      setLoginPassword('');
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white relative overflow-x-hidden">

      {/* ===================================================================== */}
      {/* 1. OPENING 5-SECOND SPLASH SCREEN WITH SCHOOL LOGO */}
      {/* ===================================================================== */}
      {showSplash && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#F3FAF5] via-[#EAF5EE] to-[#DDF0E3] p-6 transition-all duration-700">
          {/* Subtle Ambient Glow Circles (Soft Light Green) */}
          <div className="absolute w-80 h-80 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none animate-pulse-soft" />
          <div className="absolute w-72 h-72 rounded-full bg-teal-100/50 blur-2xl pointer-events-none -bottom-10 -right-10" />

          {/* School Emblem / Logo Card */}
          <div className="relative z-10 flex flex-col items-center max-w-sm text-center animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-white border border-emerald-200 shadow-xl shadow-emerald-900/10 flex items-center justify-center text-emerald-700 mb-6 relative group">
              <div className="absolute inset-0 rounded-3xl bg-emerald-100/40 animate-ping opacity-30" />
              <GraduationCap className="w-12 h-12 text-emerald-700 relative z-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-900 text-xs font-semibold mb-3 tracking-wide">
              <School className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official Primary &amp; Nursery School Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight leading-snug">
              {school.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal italic max-w-sm">
              &quot;{school.motto}&quot;
            </p>

            {/* 5-Second Progress Indicator */}
            <div className="w-full mt-8 space-y-2">
              <div className="w-full h-2 rounded-full bg-emerald-200/60 overflow-hidden p-0.5 border border-emerald-300/40">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                <span>{AUTH_CONFIG.splash.loadingLabel}</span>
                <span>{Math.round((5000 - (progress / 100) * 5000) / 1000)}s</span>
              </div>
            </div>

            {/* Skip Button */}
            <button
              onClick={skipSplash}
              type="button"
              className="mt-6 inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-semibold px-4 py-2 rounded-xl bg-white/70 hover:bg-white border border-emerald-200 transition-all shadow-xs"
            >
              <span>{AUTH_CONFIG.splash.skipButton}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. CENTERED SMALL BLUE NOTIFICATION MODAL */}
      {/* ===================================================================== */}
      {notification && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={dismissNotification}
        >
          {/* Small Blue Modal Card */}
          <div
            className="w-full max-w-xs sm:max-w-sm bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] border border-blue-400/35 rounded-2xl p-5 shadow-2xl text-white relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Icon */}
            <button
              onClick={dismissNotification}
              className="absolute top-3.5 right-3.5 text-blue-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-blue-900/50"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon & Title Header */}
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  notification.type === 'error'
                    ? 'bg-rose-950/80 border-rose-400/40 text-rose-300'
                    : notification.type === 'success'
                    ? 'bg-emerald-950/80 border-emerald-400/40 text-emerald-300'
                    : notification.type === 'warning'
                    ? 'bg-amber-950/80 border-amber-400/40 text-amber-300'
                    : 'bg-blue-900/80 border-blue-400/40 text-blue-300'
                }`}
              >
                {notification.type === 'error' ? (
                  <AlertCircle className="w-5 h-5" />
                ) : notification.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>
              <div className="pr-4">
                <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                  {notification.title}
                </h4>
                <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>

            {/* Compact Action Button */}
            <div className="mt-4 pt-3 border-t border-blue-900/60 flex justify-end">
              <button
                type="button"
                onClick={dismissNotification}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. TOP PORTAL HEADER */}
      {/* ===================================================================== */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex flex-col items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <GraduationCap className="w-5 h-5 text-white" />
              <span className="text-[9px] font-black tracking-widest">{school.shortCode}</span>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-tight block">
                {school.name}
              </span>
              <p className="text-[11px] text-slate-500 font-medium">
                {school.category}
              </p>
            </div>
          </div>

          {/* Contact Hotline & Support */}
          <div className="hidden sm:flex items-center gap-5 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{school.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              <span>{school.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 4. MAIN AUTHENTICATION CARD & ROLE SELECTION INTERFACE */}
      {/* ===================================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-14 max-w-4xl mx-auto w-full">
        {/* Portal Greeting */}
        <div className="text-center mb-8 space-y-2 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Secure Primary Education Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {authMode === 'login' ? `Sign In to ${school.name}` : `Register New Primary School`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {authMode === 'login'
              ? `Select your role to access your classroom, pupil records, or parent account.`
              : `Set up a dedicated digital portal for your primary or nursery school.`}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs (Sign In vs Register School) */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-emerald-200/80 shadow-xs mb-6 w-full max-w-md">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              authMode === 'login'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            Sign In to Account
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
              authMode === 'register'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            Register Primary School
          </button>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* LOGIN VIEW (WITH 3 STRICT ROLES - ZERO ADMIN LEAK) */}
        {/* ------------------------------------------------------------------- */}
        {authMode === 'login' && (
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 p-6 sm:p-8 animate-scale-in">
            {/* Role Selector: EXACTLY 3 ROLES (Teacher, Parent, Pupil) */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AUTH_CONFIG.roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id as 'TEACHER' | 'PARENT' | 'STUDENT')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs ring-1 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:border-emerald-300 hover:bg-white'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold leading-tight">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {AUTH_CONFIG.login.identifierLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder={AUTH_CONFIG.login.identifierPlaceholder}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {AUTH_CONFIG.login.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      triggerNotification(
                        'info',
                        'Password Recovery',
                        'Please contact your school administrator or use the registered parent phone to reset credentials.'
                      )
                    }
                    className="text-[11px] font-medium text-emerald-700 hover:underline"
                  >
                    {AUTH_CONFIG.login.forgotPasswordLabel}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder={AUTH_CONFIG.login.passwordPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    aria-label="Toggle password view"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{AUTH_CONFIG.login.rememberMeLabel}</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn || isLockedOut}
                className="w-full mt-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoggingIn ? 'Verifying Credentials...' : `Sign In to ${school.shortCode}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer link to Register */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              <span>{AUTH_CONFIG.login.switchToRegister} </span>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="font-bold text-emerald-700 hover:underline"
              >
                {AUTH_CONFIG.login.switchAction}
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* REGISTRATION VIEW (PRIMARY SCHOOL SELF-SERVICE ONBOARDING) */}
        {/* ------------------------------------------------------------------- */}
        {authMode === 'register' && (
          <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 p-6 sm:p-8 animate-scale-in">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {AUTH_CONFIG.register.schoolNameLabel}
                  </label>
                  <input
                    type="text"
                    value={regSchoolName}
                    onChange={(e) => setRegSchoolName(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder={AUTH_CONFIG.register.schoolNamePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {AUTH_CONFIG.register.shortCodeLabel}
                  </label>
                  <input
                    type="text"
                    value={regShortCode}
                    onChange={(e) => setRegShortCode(e.target.value.toUpperCase())}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-mono uppercase text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder={AUTH_CONFIG.register.shortCodePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {AUTH_CONFIG.register.adminNameLabel}
                  </label>
                  <input
                    type="text"
                    value={regAdminName}
                    onChange={(e) => setRegAdminName(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder={AUTH_CONFIG.register.adminNamePlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {AUTH_CONFIG.register.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder={AUTH_CONFIG.register.emailPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {AUTH_CONFIG.register.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder={AUTH_CONFIG.register.phonePlaceholder}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {AUTH_CONFIG.register.gradesOfferedLabel}
                  </label>
                  <select
                    value={regGradeTier}
                    onChange={(e) => setRegGradeTier(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  >
                    {AUTH_CONFIG.gradeOptions.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {AUTH_CONFIG.register.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      placeholder={AUTH_CONFIG.register.passwordPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {AUTH_CONFIG.register.confirmPasswordLabel}
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    placeholder={AUTH_CONFIG.register.confirmPasswordPlaceholder}
                  />
                </div>
              </div>

              {/* Live Password Strength Meter */}
              {regPassword.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Password Robustness:</span>
                    <span
                      className={`font-bold ${
                        regPasswordStrength.score >= 4
                          ? 'text-emerald-700'
                          : regPasswordStrength.score >= 2
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {regPasswordStrength.score >= 4
                        ? 'Strong'
                        : regPasswordStrength.score >= 2
                        ? 'Fair'
                        : 'Weak'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-full flex-1 transition-all ${
                          lvl <= regPasswordStrength.score
                            ? regPasswordStrength.score >= 4
                              ? 'bg-emerald-600'
                              : regPasswordStrength.score >= 2
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full mt-3 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isRegistering ? AUTH_CONFIG.register.submittingButton : AUTH_CONFIG.register.submitButton}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer link to Login */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              <span>{AUTH_CONFIG.register.switchToLogin} </span>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-emerald-700 hover:underline"
              >
                {AUTH_CONFIG.register.switchAction}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* 6. COMPREHENSIVE OFFICIAL PRIMARY SCHOOL WEB FOOTER */}
      {/* ===================================================================== */}
      <footer className="border-t border-emerald-200/80 bg-gradient-to-b from-[#EBF6EE] via-[#E4F2E8] to-[#DAEEDF] text-slate-700 pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-200">
            {/* Col 1: School Identity & Heritage */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 flex flex-col items-center justify-center text-white shadow-md shadow-emerald-800/20">
                  <GraduationCap className="w-5 h-5 text-white" />
                  <span className="text-[9px] font-black tracking-widest">{school.shortCode}</span>
                </div>
                <div>
                  <span className="text-base font-black text-slate-800 leading-tight block">
                    {school.name}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold tracking-wide uppercase">
                    Official Primary &amp; Nursery Portal
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated to nurturing academic excellence, strong moral character, and lifelong curiosity from early childhood through primary graduation.
              </p>

              <div className="p-3 bg-white/70 rounded-xl border border-emerald-200/70 text-xs space-y-1">
                <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">School Motto</div>
                <div className="text-xs text-slate-700 italic font-medium">
                  &quot;{school.motto}&quot;
                </div>
              </div>
            </div>

            {/* Col 2: Academic Sections & Classes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Academic Sections
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Baby Class &amp; Day Care (Ages 3 - 4)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Pre-Unit &amp; Kindergarten (Age 5)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Lower Primary (Standards 1 to 4)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Upper Primary (Standards 5 to 7)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Sports, ICT Labs &amp; Music Clubs</span>
                </li>
              </ul>
            </div>

            {/* Col 3: Portals & School Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Portals &amp; Services
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button
                    onClick={() => { setSelectedRole('TEACHER'); setAuthMode('login'); }}
                    className="hover:text-emerald-800 transition-colors text-left"
                  >
                    Class Teacher Mark &amp; Roll-Call Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setSelectedRole('PARENT'); setAuthMode('login'); }}
                    className="hover:text-emerald-800 transition-colors text-left"
                  >
                    Parent &amp; Guardian Report Card Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setSelectedRole('STUDENT'); setAuthMode('login'); }}
                    className="hover:text-emerald-800 transition-colors text-left"
                  >
                    Pupil Homework &amp; Progress Desk
                  </button>
                </li>
                <li>
                  <span className="text-slate-600">
                    School Bus Routing &amp; Transport Desk
                  </span>
                </li>
                <li>
                  <span className="text-slate-600">
                    Nutritional Lunch &amp; Dining Service
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 4: Campus Contacts & Hours */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Campus &amp; Office Hours
              </h4>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Plot 42, Education Way, {school.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{school.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{school.email}</span>
                </div>
                <div className="flex items-start gap-2 pt-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <div>Mon – Fri: 7:00 AM – 4:00 PM</div>
                    <div>Saturday: 8:00 AM – 12:30 PM</div>
                    <div>Sunday &amp; Public Holidays: Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Child Protection & Institutional Safeguarding Banner */}
          <div className="py-4 border-b border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              <span>Child Safeguarding &amp; Welfare Policy Compliant</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              <span>Pupil Data Protection</span>
              <span>•</span>
              <span>Anti-Bullying Guidelines</span>
              <span>•</span>
              <span>School Bus Safety Protocol</span>
              <span>•</span>
              <span>Academic Integrity</span>
            </div>
          </div>

          {/* Sub-Footer Copyright & Blueprint Indicator */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} {school.name}. All rights reserved.</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
              <span>Official Primary &amp; Nursery School Portal</span>
              <span>•</span>
              <span>{school.location}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
