'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Bell,
  Send,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  FileText,
  Search,
  Plus,
  Shield,
  Sparkles,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';

interface SchoolAnnouncement {
  id: string;
  title: string;
  author: string;
  role: string;
  date: string;
  priority: 'HIGH' | 'NORMAL' | 'URGENT';
  category: 'ACADEMIC' | 'GENERAL' | 'STAFF' | 'MINISTRY';
  content: string;
  read: boolean;
}

interface DirectMessage {
  id: string;
  sender: string;
  senderRole: string;
  receiver: string;
  timestamp: string;
  message: string;
  isSelf: boolean;
}

const INITIAL_ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: 'ann-01',
    title: 'Mwisho wa Kuwasilisha Alama za Majaribio ya Mwezi wa Machi',
    author: 'Mwl. Beatrice Kimaro',
    role: 'Mwalimu wa Taaluma (Academic Master)',
    date: '2026-03-27',
    priority: 'HIGH',
    category: 'ACADEMIC',
    content: 'Walimu wote wa masomo ya Standard 1 hadi 7 mnakumbushwa kuwa tarehe ya mwisho ya kuwasilisha alama za mwezi wa Machi ni Ijumaa saa 10:00 jioni kupitia mfumo. Broadsheet itatolewa mara baada ya idhini ya Mwalimu Mkuu.',
    read: true,
  },
  {
    id: 'ann-02',
    title: 'Kikao cha Wafanyakazi Wote (Staff Meeting)',
    author: 'Mwl. Augustine Mrosso',
    role: 'Mwalimu Mkuu (Head Teacher)',
    date: '2026-03-26',
    priority: 'URGENT',
    category: 'STAFF',
    content: 'Kutakuwa na kikao cha wafanyakazi wote siku ya Jumatatu saa 8:00 mchana katika ukumbi wa mikutano wa shule kujadili maandalizi ya mitihani ya Nusu Muhula na ufuatiliaji wa maazimio ya kazi.',
    read: true,
  },
  {
    id: 'ann-03',
    title: 'Mwongozo Mpya wa Mtaala wa Elimu ya Awali na Msingi (MoEST)',
    author: 'Wizara ya Elimu (MoEST)',
    role: 'Afisa Elimu Wilaya',
    date: '2026-03-20',
    priority: 'NORMAL',
    category: 'MINISTRY',
    content: 'Walimu wote wanahimizwa kupitia muhtasari wa stadi za TEHAMA na Sayansi kulingana na mtaala ulioboreshwa wa mwaka 2024/2026.',
    read: false,
  },
];

const INITIAL_MESSAGES: DirectMessage[] = [
  {
    id: 'msg-01',
    sender: 'Mwl. Beatrice Kimaro (Academic)',
    senderRole: 'Academic Master',
    receiver: 'Me',
    timestamp: 'Leo, 09:30 AM',
    message: 'Habari Mwalimu, nimepokea alama za Hisabati za Std 6. Kazi nzuri sana kwa wastani wa 82%.',
    isSelf: false,
  },
  {
    id: 'msg-02',
    sender: 'Me',
    senderRole: 'Teacher',
    receiver: 'Mwl. Beatrice Kimaro (Academic)',
    timestamp: 'Leo, 09:35 AM',
    message: 'Asante sana Mwl. Taaluma. Nimeshaanza pia maandalizi ya masomo ya ziada kwa wanafunzi 4 wanaohitaji uangalizi.',
    isSelf: true,
  },
  {
    id: 'msg-03',
    sender: 'Mwl. Augustine Mrosso (Mkuu)',
    senderRole: 'Head Teacher',
    receiver: 'Me',
    timestamp: 'Jana, 04:15 PM',
    message: 'Mwalimu hakikisha umechapisha nakala ya Lesson Plan ya wiki ijayo kwa ajili ya ukaguzi wa ufundishaji.',
    isSelf: false,
  },
];

export default function CommunicationPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<'ANNOUNCEMENTS' | 'MESSAGES' | 'PARENT_SMS'>('ANNOUNCEMENTS');
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [messages, setMessages] = useState<DirectMessage[]>(INITIAL_MESSAGES);
  const [replyText, setReplyText] = useState('');

  // Parent SMS State
  const [smsRecipientClass, setSmsRecipientClass] = useState('Standard 6 (Grade 6)');
  const [smsCategory, setSmsCategory] = useState<'ATTENDANCE' | 'ACADEMIC' | 'GENERAL'>('ACADEMIC');
  const [smsMessage, setSmsMessage] = useState(
    'Mpendwa Mzazi/Mlezi, Matokeo ya majaribio ya mwezi wa Machi yameshatolewa. Unaweza kuangalia maendeleo ya mwanao shuleni. Asanteni.'
  );

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Me',
      senderRole: currentUser?.role || 'Teacher',
      receiver: 'Mwl. Beatrice Kimaro (Academic)',
      timestamp: 'Sasa hivi',
      message: replyText.trim(),
      isSelf: true,
    };

    setMessages([...messages, newMsg]);
    setReplyText('');
    notifyUser('success', 'Ujumbe Umetumwa!', 'Ujumbe wako umetumwa kwa mafanikio.');
  };

  const handleSendParentSms = (e: React.FormEvent) => {
    e.preventDefault();
    notifyUser(
      'success',
      'SMS Imetumwa kwa Wazazi!',
      `Ujumbe umetumwa kwa wazazi 35 wa wanafunzi wa ${smsRecipientClass} kupitia mfumo wa SMS wa Shule.`
    );
  };

  const handlePresetSelect = (type: 'ATTENDANCE' | 'ACADEMIC' | 'GENERAL') => {
    setSmsCategory(type);
    if (type === 'ATTENDANCE') {
      setSmsMessage(
        'Mpendwa Mzazi, tunakukumbusha kufuatilia mahudhurio ya mwanao shuleni. Mwanafunzi anapaswa kuwepo darasani kabla ya saa 1:30 asubuhi.'
      );
    } else if (type === 'ACADEMIC') {
      setSmsMessage(
        'Mpendwa Mzazi/Mlezi, Matokeo ya majaribio ya mwezi wa Machi yameshatolewa. Unaweza kuangalia maendeleo ya mwanao shuleni. Asanteni.'
      );
    } else {
      setSmsMessage(
        'Mpendwa Mzazi, Uongozi wa shule unakualika kwenye kikao cha wazazi kitakachofanyika siku ya Ijumaa kuanzia saa 3:00 asubuhi.'
      );
    }
  };

  return (
    <TeacherShell
      pageTitle="Mawasiliano ya Shule (School Communication)"
      pageDescription="Matangazo ya shule, jumbe za ndani na mawasiliano yaliyoidhinishwa na wazazi kupitia SMS."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 bg-white px-4 pt-3 rounded-2xl border border-emerald-200 shadow-xs">
          <button
            onClick={() => setActiveTab('ANNOUNCEMENTS')}
            className={`py-2 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ANNOUNCEMENTS'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 text-emerald-700" />
            <span>Matangazo ya Shule (Announcements)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              {announcements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('MESSAGES')}
            className={`py-2 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'MESSAGES'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span>Jumbe za Ndani (Messages)</span>
          </button>

          <button
            onClick={() => setActiveTab('PARENT_SMS')}
            className={`py-2 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'PARENT_SMS'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>Mawasiliano na Wazazi (Authorized Parent SMS)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
              SMS Gateway
            </span>
          </button>
        </div>

        {/* TAB 1: ANNOUNCEMENTS */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-3 hover:border-emerald-400 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        ann.priority === 'URGENT'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : ann.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {ann.priority === 'URGENT' ? 'Dharura' : ann.priority === 'HIGH' ? 'Muhimu' : 'Kawaida'}
                    </span>
                    <span className="text-xs font-bold text-slate-500">• {ann.category}</span>
                  </div>

                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tarehe: {ann.date}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">{ann.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed mt-2">{ann.content}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800">
                    Kutoka: {ann.author} ({ann.role})
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Imethibitishwa na Uongozi</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: MESSAGES */}
        {activeTab === 'MESSAGES' && (
          <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">
                Mazungumzo ya Kitaaluma na Uongozi wa Shule
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mawasiliano ya haraka kati ya Walimu, Mwalimu wa Taaluma na Mwalimu Mkuu.
              </p>
            </div>

            {/* Chat Box */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto p-3 rounded-2xl bg-slate-50 border border-slate-200">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.isSelf ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 font-semibold mb-0.5 px-1">
                    {m.sender} • {m.timestamp}
                  </span>
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                      m.isSelf
                        ? 'bg-emerald-800 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Andika ujumbe wako hapa..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tuma</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: AUTHORIZED PARENT SMS */}
        {activeTab === 'PARENT_SMS' && (
          <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-black text-slate-900">
                  Kutuma SMS Iliyoidhinishwa kwa Wazazi wa Darasa Lako
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kama mwalimu wa darasa, una idhini ya kutuma taarifa rasmi za mahudhurio, matokeo, au vikao kwa wazazi wote wa darasa lako mara moja.
              </p>
            </div>

            <form onSubmit={handleSendParentSms} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Darasa Lengwa (Recipient Class):</label>
                  <select
                    value={smsRecipientClass}
                    onChange={(e) => setSmsRecipientClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Standard 6 (Grade 6)">Standard 6 (Grade 6) — Wazazi 35</option>
                    <option value="Standard 7 (Grade 7)">Standard 7 (Grade 7) — Wazazi 15</option>
                    <option value="Standard 5 (Grade 5)">Standard 5 (Grade 5) — Wazazi 32</option>
                    <option value="Standard 4 (Grade 4)">Standard 4 (Grade 4) — Wazazi 40</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Aina ya Ujumbe (Pre-filled Templates):</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('ACADEMIC')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex-1 ${
                        smsCategory === 'ACADEMIC'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Matokeo
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('ATTENDANCE')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex-1 ${
                        smsCategory === 'ATTENDANCE'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Mahudhurio
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('GENERAL')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex-1 ${
                        smsCategory === 'GENERAL'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Kikao / Mkutano
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Maandishi ya Ujumbe wa SMS:</label>
                <textarea
                  rows={4}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Wahusika: {smsMessage.length} / 160 (SMS 1)</span>
                  <span className="text-emerald-700 font-semibold">Gharama: Imefadhiliwa na Shule</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Tuma SMS kwa Wazazi Wote ({smsRecipientClass})</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
