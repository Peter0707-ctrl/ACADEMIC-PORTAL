'use client';

import React, { useState, useEffect } from 'react';
import SecretaryShell from '@/components/secretary-shell';
import {
  User,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Key,
  Calendar,
  FileCheck,
  Save,
  CheckCircle2,
  Lock,
  Layers,
  Laptop,
} from 'lucide-react';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

export default function SecretaryProfilePage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [fullName, setFullName] = useState('Bi. Salma Rashid Mwinyi');
  const [phone, setPhone] = useState('+255 714 556 778');
  const [email, setEmail] = useState('secretary@primaryschool.ac.tz');
  const [officeLocation, setOfficeLocation] = useState('Ofisi ya Masjala Kuu, Jengo la Utawala');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      if (session.fullName) setFullName(session.fullName);
      if (session.phone) setPhone(session.phone);
      if (session.email) setEmail(session.email);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    notifyUser('success', 'Taarifa Zimehifadhiwa', 'Taarifa zako za wasifu wa Katibu zimehifadhiwa kwa ufanisi.');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <SecretaryShell
      pageTitle="Wasifu wa Mtumishi & Masjala (Secretary Profile)"
      pageDescription="Taarifa za afisa wa masjala, idhini za usalama wa nyaraka, na vituo vya kazi"
    >
      <div className="max-w-4xl space-y-6">
        {/* Profile Card - Soft, Clean Light Design */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center font-bold text-xl shrink-0">
            SR
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold uppercase tracking-wider">
                Digital Records Officer
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                Kikao Kipo Hai (Active)
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{fullName}</h2>
            <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-3">
              <span>Namba ya Utumishi: <strong className="text-slate-700">SEC-2026-001</strong></span>
              <span>&bull;</span>
              <span>PRIMARY &amp; NURSERY SCHOOL</span>
              <span>&bull;</span>
              <span>Mwaka wa Masomo: <strong className="text-teal-700">2026</strong></span>
            </div>
          </div>
        </div>

        {/* Security Permissions Breakdown - Clean, Light & Soft (No Dark Gradient) */}
        <div className="bg-white text-slate-800 p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Kiwango cha Idhini za Masjala (Clearance Level 3)
              </h3>
              <span className="text-[11px] text-slate-500">Udhibiti wa nyaraka rasmi na mafaili ya shule</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            Akaunti hii inaruhusiwa kupokea, kusajili, kuhifadhi, na kutoa nyaraka rasmi za shule, mafaili ya wanafunzi
            na watumishi. Uhariri wa matokeo ya kitaaluma na mihamala ya kifedha haujumuishwi kwenye wajibu huu.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Nyaraka za Utawala</span>
              <span className="font-bold text-teal-900">Idhini Kamili</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Mafaili ya Wanafunzi</span>
              <span className="font-bold text-teal-900">Usajili &amp; Uhifadhi</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Matokeo ya Mitihani</span>
              <span className="font-bold text-amber-700">Kuhifadhi Tu (Read)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Jalada Kuu (Archive)</span>
              <span className="font-bold text-teal-900">Uhifadhi &amp; Urejesho</span>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-teal-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
            Marekebisho ya Mawasiliano &amp; Ofisi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Jina Kamili la Katibu</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Namba ya Simu ya Kazini</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Barua Pepe Rasmi</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Eneo la Ofisi / Kituo cha Kazi</label>
              <input
                type="text"
                value={officeLocation}
                onChange={(e) => setOfficeLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {isSaved && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mabadiliko yamehifadhiwa!</span>
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-teal-100" />
              <span>Hifadhi Mabadiliko</span>
            </button>
          </div>
        </form>
      </div>
    </SecretaryShell>
  );
}
