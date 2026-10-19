'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Shield,
  Bell,
  Lock,
  Smartphone,
  Mail,
  Building2,
  CheckCircle2,
  Save,
  Globe,
  Palette,
  Laptop,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Sliders,
  Award,
  Sparkles,
  Camera,
  Check,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import {
  UserAccount,
  getCurrentSession,
  setCurrentSession,
  getStoredAccounts,
} from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

type SettingsTab = 'PROFILE' | 'SECURITY' | 'NOTIFICATIONS' | 'PREFERENCES';

export default function TeacherSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('S.L.P 1234, Moshi, Kilimanjaro');

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [approvalPin, setApprovalPin] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notification Preferences State
  const [smsAttendanceAlerts, setSmsAttendanceAlerts] = useState(true);
  const [emailAcademicReports, setEmailAcademicReports] = useState(true);
  const [broadsheetSubmissionAlerts, setBroadsheetSubmissionAlerts] = useState(true);
  const [parentRequestNotifications, setParentRequestNotifications] = useState(true);
  const [systemSound, setSystemSound] = useState(true);

  // System Preferences
  const [language, setLanguage] = useState<'SWA' | 'ENG'>('SWA');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      setFullName(session.fullName || '');
      setEmail(session.email || '');
      setPhone(session.phone || '+255 754 112 233');
      setTitle(
        session.role === 'HEADTEACHER'
          ? 'Mwalimu Mkuu wa Shule'
          : session.role === 'ACADEMIC'
          ? 'Mwalimu Mkuu wa Taaluma'
          : session.role === 'DISCIPLINE'
          ? 'Mwalimu wa Nidhamu na Malezi'
          : 'Mwalimu wa Darasa & Somo'
      );
      setBio(
        session.role === 'HEADTEACHER'
          ? 'Kiongozi mkuu wa taaluma, utawala na mazingira ya shule ya msingi na awali.'
          : session.role === 'ACADEMIC'
          ? 'Mratibu mkuu wa mitaala, mitihani, maazimio na viwango vya ufaulu wa shule.'
          : 'Mwalimu mwenye wito wa kuwajengea wanafunzi misingi imara ya kitaaluma na tabia njema.'
      );
    }
  }, []);

  // Determine user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'ED';
    const parts = name.replace(/^(Mwl\.|Dr\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  // 1. Save Profile Details
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser: UserAccount = {
      ...currentUser,
      fullName: fullName.trim() || currentUser.fullName,
      email: email.trim() || currentUser.email,
      phone: phone.trim() || currentUser.phone,
    };

    // Save to current active session
    setCurrentSession(updatedUser);
    setCurrentUser(updatedUser);

    // Save to stored accounts in localStorage
    try {
      const accounts = getStoredAccounts();
      const updatedAccounts = accounts.map((acc) =>
        acc.id === updatedUser.id ? updatedUser : acc
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('academic_portal_accounts_v1', JSON.stringify(updatedAccounts));
      }
    } catch (err) {
      console.error('Failed to update accounts storage', err);
    }

    notifyUser(
      'success',
      'Wasifu Umehifadhiwa Kikamilifu!',
      `Taarifa zako za wasifu (${updatedUser.fullName}) zimesasishwa na kuhifadhiwa kwenye mfumo.`
    );
  };

  // 2. Save Security Settings
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      notifyUser(
        'error',
        'Hitilafu ya Nenosiri!',
        'Nenosiri jipya na nenosiri la kuthibitisha hayalingani. Tafadhali hakiki tena.'
      );
      return;
    }

    if (newPassword && newPassword.length < 6) {
      notifyUser(
        'error',
        'Nenosiri ni Fupi Mno!',
        'Nenosiri jipya lazima liwe na angalau tarakimu au herufi 6 au zaidi kwa usalama wa akaunti yako.'
      );
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    notifyUser(
      'success',
      'Usalama Umesasishwa!',
      `Nenosiri lako jipya na PIN ya idhini (${approvalPin}) zimehifadhiwa kikamilifu. Akaunti yako ipo salama.`
    );
  };

  // 3. Save Notification Preferences
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    notifyUser(
      'success',
      'Mipangilio ya Arifa Imehifadhiwa!',
      'Mapendeleo yako ya kupokea SMS na barua pepe za shule yamesasishwa kikamilifu.'
    );
  };

  // 4. Save Preferences
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    notifyUser(
      'success',
      'Mapendeleo ya Mfumo Yamehifadhiwa!',
      `Lugha ya mfumo imewekwa kuwa ${
        language === 'SWA' ? 'Kiswahili (Tanzania)' : 'English'
      } na muundo wa tarehe ni ${dateFormat}.`
    );
  };

  return (
    <TeacherShell
      pageTitle="Mipangilio & Wasifu (Settings & Profile)"
      pageDescription="Usimamizi wa wasifu wa mtumiaji, nenosiri, PIN ya kuidhinisha matokeo, arifa za SMS na mapendeleo ya mfumo."
    >
      <div className="space-y-6 animate-fade-in max-w-5xl">
        {/* ===================================================================== */}
        {/* 1. TOP PROFILE HERO CARD */}
        {/* ===================================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* Avatar with Camera badge */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-emerald-800 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md ring-4 ring-emerald-500/20">
                {getInitials(currentUser?.fullName)}
              </div>
              <button
                type="button"
                onClick={() =>
                  notifyUser(
                    'info',
                    'Upakiaji wa Picha',
                    'Sehemu ya kupakia picha mpya ya wasifu (Profile Photo) itafunguliwa kwa ukaguzi wa picha ya kitambulisho.'
                  )
                }
                className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-white text-emerald-900 border border-emerald-300 shadow-md hover:bg-emerald-50 transition-all hover:scale-105"
                title="Badilisha picha ya wasifu"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info Summary */}
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentUser?.fullName}
                  </h1>
                  <p className="text-xs font-semibold text-emerald-800 font-mono mt-0.5">
                    {currentUser?.identifier} • {title}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-bold self-center sm:self-auto shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Akaunti Amilifu (Active)</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {bio}
              </p>

              {/* Tags of assigned classes & subjects */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                  Simu: {currentUser?.phone || '+255 754 112 233'}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                  Email: {currentUser?.email}
                </span>
                {currentUser?.assignedClasses && currentUser.assignedClasses.length > 0 && (
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 text-[11px] font-bold border border-emerald-200">
                    Madarasa: {currentUser.assignedClasses.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. MODERN NAVIGATION TABS */}
        {/* ===================================================================== */}
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-200/90 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'PROFILE'
                ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                : 'bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Wasifu Wangu (Profile)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SECURITY')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'SECURITY'
                ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                : 'bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Ulinzi &amp; Nenosiri (Security)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'NOTIFICATIONS'
                ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                : 'bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Arifa &amp; SMS (Notifications)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PREFERENCES')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'PREFERENCES'
                ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                : 'bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Mfumo &amp; Lugha (Preferences)</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: PROFILE INFORMATION */}
        {/* ===================================================================== */}
        {activeTab === 'PROFILE' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Taarifa Binafsi &amp; Mawasiliano ya Kazi
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Taarifa hizi zinaonekana kwenye ripoti, nyaraka za shule na mawasiliano rasmi.
                  </p>
                </div>
                <User className="w-5 h-5 text-emerald-800" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Jina Kamili la Mwalimu:
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>

                {/* Staff Identifier (Read-Only) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Namba ya Utambulisho wa Mtumishi (Staff ID):
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.identifier || 'TCH-2026-001'}
                    className="w-full p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Namba hii inatolewa na Utawala wa Shule na haibadiliki.
                  </span>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Barua Pepe Rasmi (Email):
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Namba ya Simu (SMS &amp; WhatsApp):
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Anwani ya Kiofisi / Makazi:
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>

                {/* Bio */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Muhtasari wa Majukumu / Wasifu Mfupi:
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-102"
                >
                  <Save className="w-4 h-4" />
                  <span>Hifadhi Mabadiliko ya Wasifu</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: SECURITY & PASSWORDS */}
        {/* ===================================================================== */}
        {activeTab === 'SECURITY' && (
          <form onSubmit={handleSaveSecurity} className="space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Nenosiri &amp; PIN ya Idhini ya Kidigitali
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Weka nenosiri salama na PIN ya kipekee kwa ajili ya kuidhinisha alama na ripoti.
                  </p>
                </div>
                <Lock className="w-5 h-5 text-emerald-800" />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Nenosiri la Sasa (Current Password):
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Weka nenosiri la sasa..."
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Nenosiri Jipya (New Password):
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Angalau herufi au tarakimu 6..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Thibitisha Nenosiri Jipya:
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Rudia nenosiri jipya..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                {/* Digital Signature Approval PIN */}
                <div className="sm:col-span-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">
                      PIN ya Idhini ya Matokeo (Digital Approval PIN):
                    </label>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Tarakimu 4
                    </span>
                  </div>
                  <input
                    type="password"
                    maxLength={4}
                    value={approvalPin}
                    onChange={(e) => setApprovalPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234"
                    className="w-full max-w-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-black text-center tracking-widest text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    PIN hii inahitajika unapotia saini au kuidhinisha matokeo ya somo na broadsheet ya shule.
                  </p>
                </div>
              </div>

              {/* 2FA Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Uthibitishaji wa Hatua Mbili kwa SMS (2FA)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Pokea nambari ya siri ya mara moja kwenye simu yako ya mkononi kila unapoingia kwenye kompyuta mpya.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                    twoFactorEnabled ? 'bg-emerald-700' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-102"
                >
                  <Shield className="w-4 h-4" />
                  <span>Sasisha Nenosiri &amp; Usalama</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: NOTIFICATIONS & ALERTS */}
        {/* ===================================================================== */}
        {activeTab === 'NOTIFICATIONS' && (
          <form onSubmit={handleSaveNotifications} className="space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Mapendeleo ya Arifa &amp; Ujumbe wa Mfumo
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dhibiti jinsi unavyopokea taarifa za mahudhurio, matokeo na maombi ya wazazi.
                  </p>
                </div>
                <Bell className="w-5 h-5 text-emerald-800" />
              </div>

              <div className="space-y-4">
                {/* 1. Attendance Alerts */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Arifa za Papo kwa Hapo za Utoro na Mahudhurio
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pokea ripoti ya utoro wa kila asubuhi darasani moja kwa moja.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmsAttendanceAlerts(!smsAttendanceAlerts)}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                      smsAttendanceAlerts ? 'bg-emerald-700' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        smsAttendanceAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Academic Reports */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Arifa za Kuwasilishwa kwa Broadsheet za Masomo
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Arifa wakati mwalimu wa somo anapowasilisha matokeo kwa Mwalimu wa Taaluma.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBroadsheetSubmissionAlerts(!broadsheetSubmissionAlerts)}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                      broadsheetSubmissionAlerts ? 'bg-emerald-700' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        broadsheetSubmissionAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Parent Requests */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Maombi ya Ruhusa na Miadi ya Wazazi
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Taarifa wakati mzazi anapotuma ombi la ruhusa ya mtoto au kuomba miadi na uongozi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setParentRequestNotifications(!parentRequestNotifications)}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                      parentRequestNotifications ? 'bg-emerald-700' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        parentRequestNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* 4. System Sounds */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Sauti ya Uthibitisho wa Mfumo
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Sauti nyepesi wakati fomu ya taarifa inapojitokeza kwenye skrini.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemSound(!systemSound)}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                      systemSound ? 'bg-emerald-700' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        systemSound ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-102"
                >
                  <Bell className="w-4 h-4" />
                  <span>Hifadhi Mapendeleo ya Arifa</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: SYSTEM & PREFERENCES */}
        {/* ===================================================================== */}
        {activeTab === 'PREFERENCES' && (
          <form onSubmit={handleSavePreferences} className="space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Muonekano, Lugha &amp; Ukanda wa Saa
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Badilisha lugha ya matumizi na muundo wa kumbukumbu za kalenda ya shule.
                  </p>
                </div>
                <Sliders className="w-5 h-5 text-emerald-800" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Language Select */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Lugha ya Mfumo:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'SWA' | 'ENG')}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="SWA">Kiswahili (Sanifu - Tanzania)</option>
                    <option value="ENG">English (International)</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                    Muundo wa Tarehe (Date Format):
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (Mfano: 02/10/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (Muundo wa ISO)</option>
                    <option value="D MMMM YYYY">2 Oktoba 2026 (Maandishi Kamili)</option>
                  </select>
                </div>
              </div>

              {/* Active Session & Device Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                    <Laptop className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Kifaa Kilichounganishwa Sasa (Active Session)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Windows PC • Google Chrome • Kuingia: Saa 09:15 Asubuhi
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Kifaa Kikuu</span>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-102"
                >
                  <Globe className="w-4 h-4" />
                  <span>Hifadhi Mapendeleo ya Mfumo</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </TeacherShell>
  );
}
