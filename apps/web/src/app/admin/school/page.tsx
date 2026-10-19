'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  CheckCircle2,
  UploadCloud,
  FileCheck2,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Award,
  Globe,
  Camera,
  Check,
} from 'lucide-react';
import AdminShell from '@/components/admin-shell';

interface SchoolProfile {
  name: string;
  category: string;
  regNumber: string;
  motto: string;
  address: string;
  district: string;
  region: string;
  phoneMain: string;
  phoneAlt: string;
  email: string;
  website: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankSwift: string;
  hasOfficialStamp: boolean;
  hasHeadmasterSignature: boolean;
}

const DEFAULT_PROFILE: SchoolProfile = {
  name: 'PRIMARY & NURSERY SCHOOL',
  category: 'English Medium Primary & Pre-School',
  regNumber: 'EM.10452',
  motto: 'Strive for Excellence and Moral Integrity',
  address: 'P.O. Box 1024, Educational Complex',
  district: 'Ilala',
  region: 'Dar es Salaam',
  phoneMain: '+255 700 000 000',
  phoneAlt: '+255 711 000 000',
  email: 'info@school.ac.tz',
  website: 'https://school.ac.tz',
  bankName: 'CRDB Bank Plc',
  bankAccountName: 'PRIMARY SCHOOL REVENUE ACC',
  bankAccountNumber: '0150123456789',
  bankSwift: 'CORUTZTZ',
  hasOfficialStamp: true,
  hasHeadmasterSignature: true,
};

const STORAGE_KEY = 'academic_portal_school_profile_v1';

export default function AdminSchoolProfilePage() {
  const [profile, setProfile] = useState<SchoolProfile>(DEFAULT_PROFILE);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contacts' | 'stamps' | 'banking'>('general');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setProfile(JSON.parse(raw));
        }
      } catch {
        // use default
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const updateField = (field: keyof SchoolProfile, val: any) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <AdminShell
      pageTitle="Wasifu wa Shule, Mihuri &amp; Taarifa Rasmi"
      pageDescription="Sanidi taarifa za msingi za shule, namba ya usajili ya wizara, nembo, mihuri ya kidijitali, na akaunti za benki kwa ajili ya ankara za ada."
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'general', label: '1. Taarifa za Msingi & Nembo', icon: Building2 },
            { id: 'contacts', label: '2. Mawasiliano & Mahali', icon: MapPin },
            { id: 'stamps', label: '3. Mihuri & Saini ya Mkuu', icon: FileCheck2 },
            { id: 'banking', label: '4. Akaunti za Benki za Ada', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isSel
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSel ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: General & Logo */}
        {activeTab === 'general' && (
          <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Utambulisho Rasmi wa Shule</h3>
              <p className="text-xs text-slate-500">Taarifa hizi zitaonekana juu ya ripoti zote za mitihani na ankara za ada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jina Kamili la Shule</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Aina ya Shule (School Category)</label>
                <input
                  type="text"
                  required
                  value={profile.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  placeholder="k.m. English Medium Primary & Pre-School"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Namba ya Usajili ya Wizara (Reg No)</label>
                <input
                  type="text"
                  required
                  value={profile.regNumber}
                  onChange={(e) => updateField('regNumber', e.target.value)}
                  placeholder="k.m. EM.10452"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kaulimbiu ya Shule (Motto)</label>
                <input
                  type="text"
                  value={profile.motto}
                  onChange={(e) => updateField('motto', e.target.value)}
                  placeholder="k.m. Strive for Excellence and Moral Integrity"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* School Crest / Logo Upload Box */}
            <div className="pt-2">
              <label className="block font-bold text-slate-700 mb-2">Nembo ya Shule (School Crest)</label>
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Bofya hapa au buruta nembo ya shule</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, au SVG (Inayopendekezwa: 500x500px yenye background transparent)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Contacts & Location */}
        {activeTab === 'contacts' && (
          <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Mawasiliano na Eneo la Shule</h3>
              <p className="text-xs text-slate-500">Taarifa zitakazowezesha wazazi na wadau kuwasiliana na uongozi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Anwani ya Posta (Postal Address)</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="P.O. Box 1024"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mkoa (Region)</label>
                <input
                  type="text"
                  value={profile.region}
                  onChange={(e) => updateField('region', e.target.value)}
                  placeholder="Dar es Salaam"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wilaya (District)</label>
                <input
                  type="text"
                  value={profile.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  placeholder="Ilala"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Barua Pepe Rasmi (Email)</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="info@shule.ac.tz"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Simu Kuu ya Ofisi (Main Phone)</label>
                <input
                  type="tel"
                  value={profile.phoneMain}
                  onChange={(e) => updateField('phoneMain', e.target.value)}
                  placeholder="+255 7..."
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Simu Mbadala (Emergency/Bursar Phone)</label>
                <input
                  type="tel"
                  value={profile.phoneAlt}
                  onChange={(e) => updateField('phoneAlt', e.target.value)}
                  placeholder="+255 7..."
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Digital Stamps & Signatures */}
        {activeTab === 'stamps' && (
          <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Mihuri ya Dijitali &amp; Saini za Idhini</h3>
              <p className="text-xs text-slate-500">Mihuri na saini zitawekwa kiotomatiki kwenye ripoti za maendeleo ya mwanafunzi (Report Cards).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 block">Muhuri Rasmi wa Shule (Official Stamp)</span>
                    <span className="text-[11px] text-slate-500">Huonekana chini ya ripoti za mitihani</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.hasOfficialStamp}
                    onChange={(e) => updateField('hasOfficialStamp', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-center text-center">
                  <span className="text-[11px] text-indigo-700 font-bold uppercase tracking-wider">
                    [ OFFICIAL SCHOOL STAMP EMBEDDED ]
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 block">Saini ya Mkuu wa Shule (Headteacher Signature)</span>
                    <span className="text-[11px] text-slate-500">Uidhinishaji wa matokeo ya wanafunzi</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.hasHeadmasterSignature}
                    onChange={(e) => updateField('hasHeadmasterSignature', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-center text-center">
                  <span className="text-[11px] text-slate-500 italic font-serif">
                    Approved &amp; Certified by Head of School
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Banking Information */}
        {activeTab === 'banking' && (
          <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Akaunti za Benki kwa Malipo ya Ada</h3>
              <p className="text-xs text-slate-500">Taarifa hizi huchapishwa kwenye ankara na risiti za wazazi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jina la Benki</label>
                <input
                  type="text"
                  value={profile.bankName}
                  onChange={(e) => updateField('bankName', e.target.value)}
                  placeholder="CRDB Bank Plc / NMB Bank"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jina la Akaunti (Account Name)</label>
                <input
                  type="text"
                  value={profile.bankAccountName}
                  onChange={(e) => updateField('bankAccountName', e.target.value)}
                  placeholder="PRIMARY SCHOOL REVENUE ACC"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Namba ya Akaunti (Account Number)</label>
                <input
                  type="text"
                  value={profile.bankAccountNumber}
                  onChange={(e) => updateField('bankAccountNumber', e.target.value)}
                  placeholder="0150..."
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">SWIFT Code / Branch</label>
                <input
                  type="text"
                  value={profile.bankSwift}
                  onChange={(e) => updateField('bankSwift', e.target.value)}
                  placeholder="CORUTZTZ"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Taarifa za shule zimehifadhiwa kikamilifu!</span>
              </span>
            )}
            {!isSaved && (
              <span className="text-xs text-slate-400">
                Mabadiliko yatawekwa mara moja kwenye mfumo mzima wa shule.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md shadow-slate-900/15 flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Hifadhi Mabadiliko</span>
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
