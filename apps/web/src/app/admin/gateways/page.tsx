'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  CreditCard,
  MessageSquare,
  Save,
  CheckCircle2,
  Send,
  Phone,
  ShieldCheck,
  Check,
  AlertCircle,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import AdminShell from '@/components/admin-shell';

interface GatewayConfig {
  // GePG
  gepgEnabled: boolean;
  gepgSpCode: string;
  gepgPrefix: string;
  gepgEnv: 'SANDBOX' | 'PRODUCTION';

  // SMS
  smsEnabled: boolean;
  smsProvider: 'NEXTSMS' | 'BEEM' | 'TWILIO';
  smsSenderId: string;
  smsApiKey: string;
  smsBalance: number;

  // WhatsApp
  whatsappEnabled: boolean;
  whatsappPhoneId: string;
  whatsappToken: string;
}

const DEFAULT_CONFIG: GatewayConfig = {
  gepgEnabled: true,
  gepgSpCode: 'SP10452',
  gepgPrefix: '99104',
  gepgEnv: 'PRODUCTION',

  smsEnabled: true,
  smsProvider: 'NEXTSMS',
  smsSenderId: 'SHULE_TZ',
  smsApiKey: 'nx_live_9a8f27b9c0e44',
  smsBalance: 1450,

  whatsappEnabled: false,
  whatsappPhoneId: 'wa_phone_id_9921',
  whatsappToken: 'EAAO...',
};

const STORAGE_KEY = 'academic_portal_gateways_v1';

export default function AdminGatewaysPage() {
  const [config, setConfig] = useState<GatewayConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'gepg' | 'sms' | 'whatsapp'>('gepg');

  // Test SMS State
  const [testPhone, setTestPhone] = useState('');
  const [testText, setTestText] = useState('Habari Mzazi, huu ni ujumbe wa majaribio kutoka Academic Portal.');
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setConfig(JSON.parse(raw));
      } catch {
        // default
      }
    }
  }, []);

  const saveConfig = (updated: GatewayConfig) => {
    setConfig(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setToastMessage('Mipangilio ya Gateway imehifadhiwa kikamilifu.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateField = (field: keyof GatewayConfig, val: any) => {
    setConfig((prev) => ({ ...prev, [field]: val }));
  };

  const handleSendTestSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim()) {
      alert('Tafadhali weka namba ya simu ya mpokeaji.');
      return;
    }

    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setConfig((prev) => ({ ...prev, smsBalance: Math.max(0, prev.smsBalance - 1) }));
      setToastMessage(`SMS ya majaribio imetumwa kwa ${testPhone}!`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 700);
  };

  return (
    <AdminShell
      pageTitle="Njia za Malipo &amp; Mawasiliano (Gateways Engine)"
      pageDescription="Sanidi Control Numbers za GePG, mfumo wa SMS kwa ajili ya kutuma matokeo ya mitihani kwa wazazi, na WhatsApp Business API."
    >
      <div className="space-y-6">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 animate-fade-in">
            <div className="bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'gepg', label: '1. GePG / Control Number Engine', icon: CreditCard },
            { id: 'sms', label: '2. SMS Gateway (Wazazi)', icon: Radio },
            { id: 'whatsapp', label: '3. WhatsApp Business API', icon: MessageSquare },
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

        {/* Tab 1: GePG Engine */}
        {activeTab === 'gepg' && (
          <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Usanidi wa GePG (Government e-Payment Gateway)
                </h3>
                <p className="text-xs text-slate-500">
                  Huzalisha Namba za Udhibiti (Control Numbers) kwa ajili ya ankara za ada za wanafunzi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Hali ya Gateway:</span>
                <button
                  type="button"
                  onClick={() => updateField('gepgEnabled', !config.gepgEnabled)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    config.gepgEnabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {config.gepgEnabled ? 'Imewezeshwa (Active)' : 'Imezimwa'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mazingira (Environment)</label>
                <select
                  value={config.gepgEnv}
                  onChange={(e) => updateField('gepgEnv', e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="PRODUCTION">Production (Live e-Payments)</option>
                  <option value="SANDBOX">Sandbox (Test Mode)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kodi ya Taasisi (SP Code)</label>
                <input
                  type="text"
                  value={config.gepgSpCode}
                  onChange={(e) => updateField('gepgSpCode', e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Control Number Prefix</label>
                <input
                  type="text"
                  value={config.gepgPrefix}
                  onChange={(e) => updateField('gepgPrefix', e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Mfumo wa Kiotomatiki wa GePG
              </span>
              <p className="text-[11px] leading-relaxed">
                Kila ankara mpya ya ada itakayotengenezwa na mhasibu au mfumo itapatiwa namba ya udhibiti (Control Number)
                inayoanza na <span className="font-mono font-bold">{config.gepgPrefix}</span> inayomruhusu mzazi kulipa kwa
                M-Pesa, Airtel Money, Tigo Pesa, au tawi lolote la benki.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: SMS Gateway */}
        {activeTab === 'sms' && (
          <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Usanidi wa SMS Gateway kwa Wazazi</h3>
                <p className="text-xs text-slate-500">
                  Hutuma matokeo ya mitihani, vikao, na vikumbusho vya ada moja kwa moja kwenye simu za wazazi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Salio Lililopo:</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  SMS {config.smsBalance}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mtoa Huduma (SMS Provider)</label>
                <select
                  value={config.smsProvider}
                  onChange={(e) => updateField('smsProvider', e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="NEXTSMS">NextSMS (Tanzania)</option>
                  <option value="BEEM">Beem Africa</option>
                  <option value="TWILIO">Twilio Global</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sender ID (Jina la Mtumaji)</label>
                <input
                  type="text"
                  value={config.smsSenderId}
                  onChange={(e) => updateField('smsSenderId', e.target.value)}
                  placeholder="k.m. SHULE_TZ"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold uppercase text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">API Key / Token</label>
                <input
                  type="password"
                  value={config.smsApiKey}
                  onChange={(e) => updateField('smsApiKey', e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            {/* Test SMS Box */}
            <form onSubmit={handleSendTestSMS} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-slate-800 block">Jaribu Kutuma SMS ya Majaribio (Test SMS)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="tel"
                  required
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+255 7..."
                  className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800"
                />
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isSendingTest ? 'Inatuma...' : 'Tuma SMS ya Majaribio'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: WhatsApp API */}
        {activeTab === 'whatsapp' && (
          <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">WhatsApp Business Cloud API</h3>
                <p className="text-xs text-slate-500">
                  Tuma kadi za matokeo (PDF Report Cards) na risiti za ada kupitia WhatsApp
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateField('whatsappEnabled', !config.whatsappEnabled)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  config.whatsappEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {config.whatsappEnabled ? 'Imewezeshwa' : 'Imezimwa'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone Number ID</label>
                <input
                  type="text"
                  value={config.whatsappPhoneId}
                  onChange={(e) => updateField('whatsappPhoneId', e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Permanent Access Token</label>
                <input
                  type="password"
                  value={config.whatsappToken}
                  onChange={(e) => updateField('whatsappToken', e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => saveConfig(config)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md shadow-slate-900/15 flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Hifadhi Mipangilio ya Gateways</span>
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
