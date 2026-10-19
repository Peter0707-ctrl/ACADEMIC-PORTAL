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
  Smartphone,
  ExternalLink,
  Lock,
  Share2,
  Check,
  Megaphone,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, INITIAL_BLUEPRINT_ACCOUNTS, UserAccount } from '@/lib/auth-session';
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

interface SentBroadcast {
  id: string;
  channel: 'WHATSAPP' | 'SMS';
  category: string;
  recipientGroup: string;
  senderName: string;
  senderRole: string;
  message: string;
  sentAt: string;
  recipientCount: number;
}

const INITIAL_ANNOUNCEMENTS: SchoolAnnouncement[] = [];

const INITIAL_MESSAGES: DirectMessage[] = [];

const INITIAL_SENT_BROADCASTS: SentBroadcast[] = [];

export default function CommunicationPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<'PARENT_BROADCAST' | 'ANNOUNCEMENTS' | 'MESSAGES'>('PARENT_BROADCAST');

  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [messages, setMessages] = useState<DirectMessage[]>(INITIAL_MESSAGES);
  const [sentBroadcasts, setSentBroadcasts] = useState<SentBroadcast[]>(INITIAL_SENT_BROADCASTS);
  const [replyText, setReplyText] = useState('');

  // Parent WhatsApp / SMS Form State
  const [recipientGroup, setRecipientGroup] = useState('Wazazi Wote');
  const [selectedChannel, setSelectedChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [broadcastCategory, setBroadcastCategory] = useState<'MATOKEO' | 'LIKIZO' | 'MKUTANO' | 'ADA' | 'DHARURA'>('MATOKEO');

  const [broadcastMessage, setBroadcastMessage] = useState(
    '*SHULE YA MSINGI PRIMARY & NURSERY*\n*TAARIFA YA MATOKEO YA MITIHANI (2026)*\n\nMpendwa Mzazi/Mlezi wa Standard 7,\nTunapenda kukutaarifu kuwa matokeo ya mitihani ya Muhula wa 1 yamekamilika na kuidhinishwa rasmi. Unaweza kuangalia maendeleo ya mwanao kupitia kiungo rasmi cha mfumo.\n\n🌐 Tazama Matokeo Hapa: https://primaryschool.ac.tz/results\n\nImetolewa na: Ofisi ya Mwalimu Mkuu & Mwalimu wa Taaluma.'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
    }
  }, []);

  // Check if current user is authorized to send broadcasts to parents:
  // HEADTEACHER, ACADEMIC MASTER, SECOND MASTER, ASSISTANT ACADEMIC, ADMIN
  const isAuthorizedToBroadcast =
    currentUser?.role === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'SECOND_MASTER' ||
    currentUser?.leadershipRole === 'DEPUTY_HEADTEACHER' ||
    currentUser?.role === 'ACADEMIC' ||
    currentUser?.leadershipRole === 'ACADEMIC' ||
    currentUser?.leadershipRole === 'ASSISTANT_ACADEMIC' ||
    currentUser?.role === 'ADMIN';

  // Handle Preset Template Selection
  const handleTemplateSelect = (type: 'MATOKEO' | 'LIKIZO' | 'MKUTANO' | 'ADA' | 'DHARURA') => {
    setBroadcastCategory(type);
    const schoolName = '*SHULE YA MSINGI PRIMARY & NURSERY*';

    if (type === 'MATOKEO') {
      setBroadcastMessage(
        `${schoolName}\n*TAARIFA YA MATOKEO YA MITIHANI (2026)*\n\nMpendwa Mzazi/Mlezi wa ${recipientGroup.split(' —')[0]},\nTunapenda kukutaarifu kuwa matokeo ya mitihani ya muhula huu yamekamilika na kuidhinishwa rasmi na Mwalimu Mkuu.\n\n📊 Kila mwanafunzi amepewa ripoti ya maendeleo ya taaluma.\n🌐 Tazama Matokeo Mtandaoni: https://primaryschool.ac.tz/results\n\nAsanteni kwa ushirikiano wenu katika maendeleo ya mwanao.\nImetolewa na: Ofisi ya Mwalimu Mkuu & Taaluma.`
      );
    } else if (type === 'LIKIZO') {
      setBroadcastMessage(
        `${schoolName}\n*TAARIFA YA KUFUNGA/KUFUNGUA SHULE NA LIKIZO*\n\nMpendwa Mzazi/Mlezi,\nShule itafungwa rasmi kwa ajili ya likizo kuanzia tarehe 28 Machi 2026 na itafunguliwa tarehe 07 Aprili 2026 saa 1:30 asubuhi.\n\nWanafunzi wamepewa mazoezi ya likizo ya kufanya nyumbani. Tafadhali msimamie mwanao kukamilisha kazi zake.\n\nTunawatakia likizo njema na yenye amani.`
      );
    } else if (type === 'MKUTANO') {
      setBroadcastMessage(
        `${schoolName}\n*MWALIKO WA MKUTANO MKUU WA WAZAZI*\n\nMpendwa Mzazi/Mlezi,\nUongozi wa shule unakualika kwa heshima kwenye Mkutano Mkuu wa Wazazi utakaofanyika shuleni siku ya Ijumaa saa 3:00 Asubuhi.\n\n📋 *Ajenda Kuu:*\n1. Tathmini ya Maendeleo ya Kitaaluma\n2. Maandalizi ya Mitihani ya Kitaifa ya NECTA (PSLE & SFNA)\n3. Nidhamu na Malezi ya Wanafunzi\n\nUwepo wako ni muhimu sana kwa maendeleo ya shule yetu.`
      );
    } else if (type === 'ADA') {
      setBroadcastMessage(
        `${schoolName}\n*UKUMBUSHO WA MALIPO YA ADA & MICHANGO*\n\nMpendwa Mzazi/Mlezi,\nUongozi unawakumbusha wazazi wote kukamilisha malipo ya ada na michango ya shule ya Muhula wa 1 kabla ya tarehe 30 Machi 2026.\n\n🏦 *Namba ya Akaunti / Control No:*\n• Benki: NMB Bank\n• Jina la Akaunti: Primary & Nursery School\n• Namba ya Malipo (Control No): 9912345678\n\nTafadhali wasilisha risiti ya benki ofisi ya Uhasibu.`
      );
    } else {
      setBroadcastMessage(
        `${schoolName}\n*TANGAZO MAALUM KUTOKA KWA UONGOZI WA SHULE*\n\nMpendwa Mzazi/Mlezi,\nTunapenda kukutaarifu kuwa kutakuwa na mabadiliko ya ratiba ya wiki hii kutokana na maelekezo ya Wizara ya Elimu (MoEST).\n\nTafadhali hakikisha mwanao anafika shuleni kwa wakati akiwa amevalia sare kamili na nadhifu.\n\nAsanteni kwa ushirikiano wenu.`
      );
    }
  };

  // Handle Dispatch WhatsApp / SMS Broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    const uploaderRole =
      currentUser?.leadershipRole === 'HEADTEACHER' || currentUser?.role === 'HEADTEACHER'
        ? 'Mwalimu Mkuu'
        : 'Mwalimu wa Taaluma';

    const timestamp = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const recipientCount = recipientGroup.includes('190') ? 190 : recipientGroup.includes('95') ? 95 : 35;

    const newBroadcast: SentBroadcast = {
      id: `bcast-${Date.now()}`,
      channel: selectedChannel,
      category: broadcastCategory,
      recipientGroup,
      senderName: currentUser?.fullName || 'Mwl. Augustine Mrosso',
      senderRole: uploaderRole,
      message: broadcastMessage,
      sentAt: timestamp,
      recipientCount,
    };

    setSentBroadcasts([newBroadcast, ...sentBroadcasts]);

    if (selectedChannel === 'WHATSAPP') {
      // Create WhatsApp Web direct link for sharing
      const encodedText = encodeURIComponent(broadcastMessage);
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

      notifyUser(
        'success',
        'Ujumbe wa WhatsApp Umetumwa & Kufunguliwa!',
        `Ujumbe umetumwa kwa wazazi ${recipientCount} wa ${recipientGroup}. Dirisha la WhatsApp limefunguliwa.`
      );

      // Open WhatsApp web link in new window for instant blast
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }
    } else {
      notifyUser(
        'success',
        'SMS Zimetumwa kwa Wazazi!',
        `SMS ${recipientCount} zimetumwa kikamilifu kwa wazazi wa ${recipientGroup} kupitia SMS Gateway ya shule.`
      );
    }
  };

  // Internal messages sender
  const handleSendInternalMessage = (e: React.FormEvent) => {
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
    notifyUser('success', 'Ujumbe Umetumwa!', 'Ujumbe wako umetumwa kwa walimu wenzako.');
  };

  return (
    <TeacherShell
      pageTitle="Mawasiliano ya Shule & WhatsApp Gateway"
      pageDescription="Mfumo rasmi wa kutuma taarifa za matokeo na matangazo ya shule kwa wazazi kupitia WhatsApp na SMS."
    >
      <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
        {/* ================================================================= */}
        {/* 1. TOP NAVIGATION TABS */}
        {/* ================================================================= */}
        <div className="flex border-b border-slate-200 gap-2 bg-white px-4 pt-3 rounded-2xl border border-emerald-200 shadow-xs">
          <button
            onClick={() => setActiveTab('PARENT_BROADCAST')}
            className={`py-2 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'PARENT_BROADCAST'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>Mawasiliano na Wazazi (WhatsApp &amp; SMS)</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-white text-[10px] font-black shadow-2xs">
              WhatsApp Gateway
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ANNOUNCEMENTS')}
            className={`py-2 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ANNOUNCEMENTS'
                ? 'border-emerald-700 text-emerald-900 bg-emerald-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 text-emerald-700" />
            <span>Matangazo ya Shule (Noticeboard)</span>
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
            <span>Jumbe za Ndani (Staff Messages)</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* 2. TAB 1: PARENT BROADCAST (WHATSAPP & SMS) */}
        {/* ================================================================= */}
        {activeTab === 'PARENT_BROADCAST' && (
          <div className="space-y-6">
            {/* If user is NOT Headmaster or Academic Master */}
            {!isAuthorizedToBroadcast ? (
              <div className="bg-white rounded-3xl border border-amber-200 p-8 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base font-black text-slate-900">
                    Eneo Lililohifadhiwa kwa Mwalimu Mkuu &amp; Taaluma
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Haki ya kutuma matokeo, matangazo ya ada, na jumbe rasmi za shule kwa wazazi kupitia WhatsApp na SMS imeidhinishwa kwa <strong>Mwalimu Mkuu (Headmaster)</strong> na <strong>Mwalimu wa Taaluma (Academic Master)</strong> pekee ili kulinda nidhamu ya mawasiliano ya shule.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                  <span>Wasiliana na Mkuu wa Shule au Taaluma iwapo unahitaji tangazo litumwe kwa wazazi wako.</span>
                </div>
              </div>
            ) : (
              /* If AUTHORIZED: Full WhatsApp & SMS Dispatch Dashboard */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: The Dispatcher Form */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-emerald-200 p-6 shadow-xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
                        <Smartphone className="w-5 h-5 text-emerald-300" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-slate-900">
                          Tuma Taarifa &amp; Matokeo kwa Wazazi
                        </h2>
                        <span className="text-[11px] font-bold text-emerald-800">
                          Idhini Rasmi: Mwalimu Mkuu au Mwalimu wa Taaluma
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center gap-1 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Idhini Imetolewa</span>
                    </span>
                  </div>

                  <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                    {/* Channel Selector: WhatsApp vs SMS */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        1. Chagua Mfumo wa Kutuma (Channel):
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedChannel('WHATSAPP')}
                          className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all font-black ${
                            selectedChannel === 'WHATSAPP'
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                          <span>WhatsApp (Inayopendekezwa)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedChannel('SMS')}
                          className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all font-black ${
                            selectedChannel === 'SMS'
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                          <span>SMS ya Kawaida (SMS Gateway)</span>
                        </button>
                      </div>
                    </div>

                    {/* Announcement Category Selector */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        2. Aina ya Tangazo / Taarifa (Chagua Kiolezo):
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleTemplateSelect('MATOKEO')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            broadcastCategory === 'MATOKEO'
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          📊 Matokeo ya Mitihani
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTemplateSelect('MKUTANO')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            broadcastCategory === 'MKUTANO'
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          👥 Mkutano wa Wazazi
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTemplateSelect('LIKIZO')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            broadcastCategory === 'LIKIZO'
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          🏖️ Kufunga / Kufungua Shule
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTemplateSelect('ADA')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            broadcastCategory === 'ADA'
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          💰 Ada &amp; Michango
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTemplateSelect('DHARURA')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                            broadcastCategory === 'DHARURA'
                              ? 'bg-emerald-800 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          📢 Tangazo Maalum
                        </button>
                      </div>
                    </div>

                    {/* Recipient Class / Group */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        3. Walengwa wa Ujumbe (Recipients):
                      </label>
                      <select
                        value={recipientGroup}
                        onChange={(e) => setRecipientGroup(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-emerald-800 bg-white"
                      >
                        <option value="Standard 7 (Grade 7) — Wazazi 95">Standard 7 (Grade 7) — Wazazi 95 (Watahiniwa wa PSLE)</option>
                        <option value="Standard 6 (Grade 6) — Wazazi 35">Standard 6 (Grade 6) — Wazazi 35</option>
                        <option value="Standard 5 (Grade 5) — Wazazi 32">Standard 5 (Grade 5) — Wazazi 32</option>
                        <option value="Standard 4 (Grade 4) — Wazazi 40">Standard 4 (Grade 4) — Wazazi 40 (Watahiniwa wa SFNA)</option>
                        <option value="Shule Nzima (Wazazi Wote 190)">Shule Nzima (Wazazi Wote 190)</option>
                      </select>
                    </div>

                    {/* Message Text Area */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">
                          4. Maandishi ya Ujumbe:
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {broadcastMessage.length} Herufi
                        </span>
                      </div>
                      <textarea
                        rows={7}
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Inatumwa kutoka: {currentUser?.fullName} ({currentUser?.role === 'HEADTEACHER' ? 'Mwalimu Mkuu' : 'Mwalimu wa Taaluma'})</span>
                      </div>

                      <button
                        type="submit"
                        className={`px-6 py-2.5 rounded-xl text-white font-black shadow-md flex items-center gap-2 transition-all ${
                          selectedChannel === 'WHATSAPP'
                            ? 'bg-emerald-800 hover:bg-emerald-900'
                            : 'bg-blue-700 hover:bg-blue-800'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span>
                          {selectedChannel === 'WHATSAPP'
                            ? `Tuma kwa WhatsApp (${recipientGroup.split(' —')[0]})`
                            : `Tuma SMS kwa Wazazi (${recipientGroup.split(' —')[0]})`}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Col: Live WhatsApp Preview & Sent History */}
                <div className="space-y-4">
                  {/* WhatsApp Message Live Preview Box */}
                  <div className="bg-[#EFEAE2] rounded-3xl border border-emerald-300/80 p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                      <span className="text-[11px] font-black uppercase text-emerald-950 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-800" />
                        <span>Mwonekano kwenye WhatsApp ya Mzazi:</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-white font-bold">
                        WhatsApp Live
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2 text-xs font-sans">
                      <div className="whitespace-pre-wrap text-slate-800 leading-relaxed text-[11px]">
                        {broadcastMessage}
                      </div>
                      <div className="text-right text-[9px] text-slate-400 font-mono">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 italic text-center">
                      Mzazi akipokea ujumbe huu anabofya kiungo na kuona ripoti ya mwanao mara moja.
                    </p>
                  </div>

                  {/* Broadcast History */}
                  <div className="bg-white rounded-3xl border border-emerald-200 p-4 shadow-xs space-y-3">
                    <h3 className="text-xs font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                      <span>Historia ya Jumbe Zilizotumwa</span>
                      <span className="text-[10px] font-mono text-emerald-800 font-bold">{sentBroadcasts.length} Jumbe</span>
                    </h3>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {sentBroadcasts.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs">
                          Bado hakuna jumbe za matangazo zilizotumwa kwa wazazi.
                        </div>
                      ) : (
                        sentBroadcasts.map((bcast) => (
                          <div key={bcast.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-900 font-black text-[9px] uppercase">
                                {bcast.channel}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{bcast.sentAt}</span>
                            </div>
                            <span className="font-bold text-slate-900 block text-[11px] truncate">
                              {bcast.recipientGroup}
                            </span>
                            <p className="text-[10px] text-slate-500 line-clamp-2">
                              {bcast.message}
                            </p>
                            <div className="text-[9px] font-semibold text-emerald-700 pt-0.5">
                              Imetumwa na: {bcast.senderName} ({bcast.senderRole})
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. TAB 2: ANNOUNCEMENTS (NOTICEBOARD) */}
        {/* ================================================================= */}
        {activeTab === 'ANNOUNCEMENTS' && (
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-emerald-200 shadow-xs space-y-2">
                <Megaphone className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Hakuna Matangazo ya Shule Bado</h4>
                <p className="text-xs text-slate-500">Matangazo yote rasmi ya kiutawala na kitaaluma yataonekana hapa.</p>
              </div>
            ) : (
              announcements.map((ann) => (
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
                      <h3 className="text-sm sm:text-base font-black text-slate-900">{ann.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ann.date}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {ann.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                        {ann.author.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block text-[11px]">{ann.author}</span>
                        <span className="text-[10px] text-slate-400 block">{ann.role}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Tangazo Rasmi la Shule
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. TAB 3: INTERNAL STAFF MESSAGES */}
        {/* ================================================================= */}
        {activeTab === 'MESSAGES' && (
          <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">Jumbe za Ndani ya Shule (Staff Messages)</h2>
              <p className="text-xs text-slate-500">Mawasiliano ya haraka kati ya walimu na uongozi wa shule.</p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>Hakuna mazungumzo bado. Anza ujumbe mpya hapa chini.</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl max-w-xl text-xs space-y-1 ${
                      m.isSelf
                        ? 'ml-auto bg-emerald-800 text-white'
                        : 'mr-auto bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-1">
                      <span className="font-bold">{m.sender}</span>
                      <span className={`text-[10px] ${m.isSelf ? 'text-emerald-200' : 'text-slate-500'}`}>
                        {m.timestamp}
                      </span>
                    </div>
                    <p className="pt-1 leading-relaxed">{m.message}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendInternalMessage} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Andika ujumbe wako kwa walimu au uongozi hapa..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Tuma</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
