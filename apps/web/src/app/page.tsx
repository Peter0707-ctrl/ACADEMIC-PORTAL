'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Sliders,
  Check,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// DYNAMIC WHITE-LABEL SCHOOL BLUEPRINT ENGINE
// Enables the platform to represent ANY specific client primary school instantly
// -----------------------------------------------------------------------------
interface ClientSchoolProfile {
  name: string;
  shortCode: string;
  motto: string;
  category: string;
  phone: string;
  email: string;
  location: string;
}

const DEFAULT_SCHOOL_BLUEPRINT: ClientSchoolProfile = {
  name: 'PRIMARY & NURSERY SCHOOL ACADEMY',
  shortCode: 'PNA',
  motto: 'Knowledge, Character & Academic Excellence',
  category: 'Nursery, Pre-Unit & Standards 1 to 7',
  phone: '+255 779 304 500',
  email: 'pj0040280@gmail.com',
  location: 'Dar es Salaam, Tanzania',
};

// Public pre-login roles: STRICTLY 3 ROLES (Admin is completely hidden)
const PRE_LOGIN_ROLES = [
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
];

// Grade tier options
const GRADE_TIER_OPTIONS = [
  { id: 'NURSERY_PRIMARY', label: 'Nursery, Pre-Unit & Standards 1 to 7' },
  { id: 'STANDARDS_1_7', label: 'Primary Standards 1 to 7 Only' },
  { id: 'EARLY_YEARS', label: 'Early Years & Kindergarten Only' },
];

// -----------------------------------------------------------------------------
// SECURITY SANITIZATION & VALIDATION ENGINE
// -----------------------------------------------------------------------------
function sanitizeInput(val: string): string {
  if (!val) return '';
  return val
    .trim()
    .replace(/[<>'"/\\`]/g, '')
    .slice(0, 150);
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
  const score = [hasMinLength, hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  return { score, hasMinLength, hasUpper, hasLower, hasNumber, hasSymbol };
}

// -----------------------------------------------------------------------------
// CENTERED SMALL BLUE NOTIFICATION MODAL TYPE
// -----------------------------------------------------------------------------
interface CenteredNotification {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export default function PrimaryPortalHomePage() {
  // 1. Dynamic Client School Blueprint State
  const [school, setSchool] = useState<ClientSchoolProfile>(DEFAULT_SCHOOL_BLUEPRINT);
  const [showBlueprintDrawer, setShowBlueprintDrawer] = useState(false);
  const [editSchoolName, setEditSchoolName] = useState(DEFAULT_SCHOOL_BLUEPRINT.name);
  const [editShortCode, setEditShortCode] = useState(DEFAULT_SCHOOL_BLUEPRINT.shortCode);
  const [editMotto, setEditMotto] = useState(DEFAULT_SCHOOL_BLUEPRINT.motto);

  // 2. 5-Second Opening Splash Screen State
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0);

  // 3. Active Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // 4. Pre-Login Role: STRICTLY 3 ROLES (Teacher, Parent, Pupil) - ZERO ADMIN LEAK
  const [selectedRole, setSelectedRole] = useState<'TEACHER' | 'PARENT' | 'STUDENT'>('TEACHER');

  // 5. Centered Small Blue Notification Form State
  const [notification, setNotification] = useState<CenteredNotification | null>(null);

  // 6. Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // 7. Registration Form State
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

  // Trigger Small Blue Centered Notification Modal
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
    const duration = 5000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(timer);
        setShowSplash(false);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const skipSplash = () => {
    setShowSplash(false);
  };

  // Password strength check
  const regPasswordStrength = useMemo(() => checkPasswordStrength(regPassword), [regPassword]);

  // Live Blueprint Customizer Apply
  const applyCustomBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeInput(editSchoolName);
    const cleanCode = sanitizeInput(editShortCode).toUpperCase();
    const cleanMotto = sanitizeInput(editMotto);

    if (!cleanName || !cleanCode) {
      triggerNotification('warning', 'Blueprint Notice', 'School name and short code cannot be empty.');
      return;
    }

    setSchool((prev) => ({
      ...prev,
      name: cleanName,
      shortCode: cleanCode,
      motto: cleanMotto || prev.motto,
    }));
    setShowBlueprintDrawer(false);
    triggerNotification('success', 'School Branding Applied', `Portal successfully rebranded for ${cleanName}.`);
  };

  // ---------------------------------------------------------------------------
  // LOGIN SUBMISSION HANDLER
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

    const isValid = validateEmail(cleanIdentifier) || validatePhone(cleanIdentifier);
    if (!isValid) {
      triggerNotification(
        'error',
        'Invalid Format',
        'Please provide a valid email address (e.g. staff@school.ac.tz) or mobile phone number.'
      );
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);
      const roleObj = PRE_LOGIN_ROLES.find((r) => r.id === selectedRole);
      triggerNotification(
        'success',
        'Authentication Verified',
        `Welcome to the ${school.name} ${roleObj?.label} portal. Secure session established.`
      );
    }, 1000);
  };

  // ---------------------------------------------------------------------------
  // REGISTRATION SUBMISSION HANDLER
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
        'All primary school onboarding fields are required.'
      );
      return;
    }

    if (!validateEmail(cleanEmail)) {
      triggerNotification('error', 'Invalid Email', 'Please enter an official school email address.');
      return;
    }

    if (!validatePhone(cleanPhone)) {
      triggerNotification('error', 'Invalid Phone', 'Please provide a valid mobile number (minimum 9 digits).');
      return;
    }

    if (regPasswordStrength.score < 3) {
      triggerNotification(
        'warning',
        'Weak Password',
        'Password must be at least 8 characters long with uppercase, lowercase, and numbers or symbols.'
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      triggerNotification('error', 'Password Mismatch', 'The confirmed password does not match.');
      return;
    }

    setIsRegistering(true);

    setTimeout(() => {
      setIsRegistering(false);
      // Auto-update active school to the newly registered school
      setSchool((prev) => ({
        ...prev,
        name: cleanSchoolName,
        shortCode: cleanShortCode,
      }));
      setAuthMode('login');
      setLoginIdentifier(cleanEmail);
      setLoginPassword('');
      triggerNotification(
        'success',
        'School Portal Provisioned',
        `${cleanSchoolName} (${cleanShortCode}) is now live. Sign in using your registered credentials.`
      );
    }, 1300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FAF6] via-[#EDF7F0] to-[#E3F2E8] text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white relative overflow-x-hidden">

      {/* ===================================================================== */}
      {/* 1. OPENING 5-SECOND SPLASH SCREEN WITH THE SCHOOL'S OWN EMBLEM & MOTTO */}
      {/* ===================================================================== */}
      {showSplash && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#F3FAF5] via-[#EAF5EE] to-[#DDF0E3] p-6 transition-all duration-700">
          <div className="absolute w-80 h-80 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none animate-pulse-soft" />
          <div className="absolute w-72 h-72 rounded-full bg-teal-100/50 blur-2xl pointer-events-none -bottom-10 -right-10" />

          <div className="relative z-10 flex flex-col items-center max-w-md text-center animate-fade-in">
            {/* The School's Own Emblem Card */}
            <div className="w-24 h-24 rounded-3xl bg-white border border-emerald-200 shadow-xl shadow-emerald-900/10 flex flex-col items-center justify-center text-emerald-800 mb-6 relative group">
              <GraduationCap className="w-10 h-10 text-emerald-700" />
              <span className="text-[10px] font-black tracking-widest text-emerald-900 uppercase mt-0.5">
                {school.shortCode}
              </span>
            </div>

            {/* School Category Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-900 text-xs font-semibold mb-3 tracking-wide">
              <School className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official School Digital Portal</span>
            </div>

            {/* The School's Own Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight leading-snug">
              {school.name}
            </h1>

            {/* The School's Own Motto */}
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal italic max-w-sm">
              &quot;{school.motto}&quot;
            </p>

            {/* 5-Second Progress Bar with Countdown */}
            <div className="w-full max-w-xs mt-8 space-y-2">
              <div className="w-full h-2 rounded-full bg-emerald-200/60 overflow-hidden p-0.5 border border-emerald-300/40">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                <span>Loading School Portal...</span>
                <span>{Math.round((5000 - (progress / 100) * 5000) / 1000)}s</span>
              </div>
            </div>

            {/* Skip to Portal Button */}
            <button
              onClick={skipSplash}
              type="button"
              className="mt-6 inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-semibold px-4 py-2 rounded-xl bg-white/70 hover:bg-white border border-emerald-200 transition-all shadow-xs"
            >
              <span>Skip to School Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. CENTERED SMALL BLUE NOTIFICATION MODAL (NO HARD COLORS, NO EMOJIS) */}
      {/* ===================================================================== */}
      {notification && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={dismissNotification}
        >
          <div
            className="w-full max-w-xs sm:max-w-sm bg-gradient-to-b from-[#0F2942] to-[#0A1B2D] border border-blue-400/35 rounded-2xl p-5 shadow-2xl text-white relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismissNotification}
              className="absolute top-3.5 right-3.5 text-blue-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-blue-900/50"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>

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
      {/* 3. DISCRETE LIVE CLIENT BRANDING SWITCHER (FOR PITCHING TO CLIENTS) */}
      {/* ===================================================================== */}
      {showBlueprintDrawer && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs"
          onClick={() => setShowBlueprintDrawer(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-emerald-200 shadow-xl p-6 text-slate-800 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Sliders className="w-4 h-4 text-emerald-700" />
                <span>Client School Blueprint Customizer</span>
              </div>
              <button
                onClick={() => setShowBlueprintDrawer(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-4">
              Enter any school name to instantly demo this portal under that school&apos;s brand.
            </p>

            <form onSubmit={applyCustomBlueprint} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  value={editSchoolName}
                  onChange={(e) => setEditSchoolName(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Eagle Nursery & Primary Academy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School Short Code
                </label>
                <input
                  type="text"
                  value={editShortCode}
                  onChange={(e) => setEditShortCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. ENPA"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School Motto
                </label>
                <input
                  type="text"
                  value={editMotto}
                  onChange={(e) => setEditMotto(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Discipline, Integrity & Knowledge"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBlueprintDrawer(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Apply School Branding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. THE SCHOOL'S OWN OFFICIAL HEADER */}
      {/* ===================================================================== */}
      <header className="border-b border-emerald-100 bg-white/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Official School Identity */}
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

          {/* Right Header: School Contacts & Blueprint Trigger */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-4 text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{school.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>{school.email}</span>
              </div>
            </div>

            {/* Quick Demo Switcher Button for Commercial Demonstrations */}
            <button
              onClick={() => setShowBlueprintDrawer(true)}
              title="Rebrand this portal for any specific school"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-all"
            >
              <Sliders className="w-3 h-3 text-emerald-700" />
              <span className="hidden sm:inline">Demo Switcher</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 5. MAIN AUTHENTICATION & PORTAL INTERFACE */}
      {/* ===================================================================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-14 max-w-4xl mx-auto w-full">
        {/* School Greeting */}
        <div className="text-center mb-7 space-y-1.5 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Official School Management System</span>
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

        {/* Tab Toggle (Sign In vs Register School) */}
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
            Sign In to School
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
            Register School
          </button>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* SIGN IN: EXACTLY 3 ROLES (TEACHER, PARENT, PUPIL) - ADMIN HIDDEN */}
        {/* ------------------------------------------------------------------- */}
        {authMode === 'login' && (
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 p-6 sm:p-8 animate-scale-in">
            {/* 3 Pre-Login Roles */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRE_LOGIN_ROLES.map((r) => {
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

            {/* Login Inputs */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address or Mobile Number
                </label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  placeholder="e.g. teacher@school.ac.tz or 0779304500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      triggerNotification(
                        'info',
                        'Password Recovery',
                        `Please reach out to the ${school.name} administration office or class teacher to reset your password.`
                      )
                    }
                    className="text-[11px] font-medium text-emerald-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder="Enter your account password"
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

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn || isLockedOut}
                className="w-full mt-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoggingIn ? 'Verifying Credentials...' : `Sign In to ${school.shortCode}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              <span>Looking to register your school? </span>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Register Here
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* REGISTRATION: ONBOARDING FOR A NEW PRIMARY SCHOOL */}
        {/* ------------------------------------------------------------------- */}
        {authMode === 'register' && (
          <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 p-6 sm:p-8 animate-scale-in">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Primary School Name
                  </label>
                  <input
                    type="text"
                    value={regSchoolName}
                    onChange={(e) => setRegSchoolName(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder="e.g. Mlimani Nursery & Primary School"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    School Short Code
                  </label>
                  <input
                    type="text"
                    value={regShortCode}
                    onChange={(e) => setRegShortCode(e.target.value.toUpperCase())}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-mono uppercase text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder="e.g. MNPS"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Headteacher Full Name
                  </label>
                  <input
                    type="text"
                    value={regAdminName}
                    onChange={(e) => setRegAdminName(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder="e.g. Peter Msira"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official School Email
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder="headteacher@school.ac.tz"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    placeholder="+255 779 304 500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Grades &amp; Sections Offered
                  </label>
                  <select
                    value={regGradeTier}
                    onChange={(e) => setRegGradeTier(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  >
                    {GRADE_TIER_OPTIONS.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      placeholder="Minimum 8 characters"
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
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    placeholder="Confirm admin password"
                  />
                </div>
              </div>

              {regPassword.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Password Strength:</span>
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

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full mt-3 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isRegistering ? 'Creating School Portal...' : 'Provision School Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              <span>Already registered? </span>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign In to Portal
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ===================================================================== */}
      {/* 6. MINIMALIST FOOTER */}
      {/* ===================================================================== */}
      <footer className="border-t border-emerald-100/80 bg-white/60 py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {school.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Official Primary School Portal</span>
            <span>•</span>
            <span>{school.location}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
