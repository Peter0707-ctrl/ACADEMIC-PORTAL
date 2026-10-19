'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  Download,
  Search,
  Filter,
  Clock,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Save,
  Check,
  RefreshCw,
} from 'lucide-react';
import AdminShell from '@/components/admin-shell';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  device: string;
  ip: string;
  status: 'SUCCESS' | 'WARNING' | 'BLOCKED';
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-10-19 23:15:20',
    user: 'drestgroup@gmail.com',
    role: 'ADMIN',
    action: 'Msimamizi Mkuu ameingia kwenye mfumo (Admin Login)',
    device: 'Desktop Chrome / Windows 11',
    ip: '197.250.198.42',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-10-19 22:40:11',
    user: 'headteacher@primaryschool.ac.tz',
    role: 'HEADTEACHER',
    action: 'Ukaguzi wa idhini ya alama za mitihani ya Muhula wa 1',
    device: 'Desktop Safari / macOS',
    ip: '197.250.201.12',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-003',
    timestamp: '2026-10-19 21:12:04',
    user: 'accountant@primaryschool.ac.tz',
    role: 'ACCOUNTANT',
    action: 'Uthibitisho wa risiti ya malipo ya benki (REC-2026-089)',
    device: 'Mobile Safari / iOS',
    ip: '197.250.195.88',
    status: 'SUCCESS',
  },
  {
    id: 'LOG-004',
    timestamp: '2026-10-19 19:05:43',
    user: 'unknown_attempt',
    role: 'GUEST',
    action: 'Jaribio la kuingia lisilo na idhini limezuiwa (Failed attempt)',
    device: 'Linux / Automated Agent',
    ip: '45.142.120.9',
    status: 'BLOCKED',
  },
];

const STORAGE_KEY = 'academic_portal_audit_logs_v1';
const SECURITY_CONFIG_KEY = 'academic_portal_sec_config_v1';

export default function AdminSecurityPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Security settings
  const [lockoutAfter5, setLockoutAfter5] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60'); // 60 minutes
  const [require2FA, setRequire2FA] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setLogs(JSON.parse(raw));

        const rawSec = localStorage.getItem(SECURITY_CONFIG_KEY);
        if (rawSec) {
          const cfg = JSON.parse(rawSec);
          if (cfg.lockoutAfter5 !== undefined) setLockoutAfter5(cfg.lockoutAfter5);
          if (cfg.sessionTimeout) setSessionTimeout(cfg.sessionTimeout);
          if (cfg.require2FA !== undefined) setRequire2FA(cfg.require2FA);
        }
      } catch {
        // default
      }
    }
  }, []);

  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        SECURITY_CONFIG_KEY,
        JSON.stringify({ lockoutAfter5, sessionTimeout, require2FA })
      );
    }
    setToastMessage('Mipangilio ya usalama imehifadhiwa kikamilifu.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Device', 'IP', 'Status'];
    const rows = logs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.user}"`,
      l.role,
      `"${l.action}"`,
      `"${l.device}"`,
      `"${l.ip}"`,
      l.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shule_usalama_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch =
        l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.ip.includes(searchQuery);

      if (!matchSearch) return false;
      if (filterStatus === 'ALL') return true;
      return l.status === filterStatus;
    });
  }, [logs, searchQuery, filterStatus]);

  return (
    <AdminShell
      pageTitle="Ukaguzi wa Usalama &amp; Kumbukumbu (Security &amp; Audit Logs)"
      pageDescription="Fuatilia mienendo yote ya mfumo: nani kaingia, mabadiliko ya alama, miamala ya fedha, na uimarishe ulinzi wa mfumo."
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

        {/* 1. Security Guard Policies Configuration */}
        <form
          onSubmit={handleSaveSecuritySettings}
          className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>Sera za Ulinzi &amp; Uzuiaji wa Mashambulizi (Brute Force Defense)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dhibiti usalama wa akaunti za watumishi na muda wa vikao
              </p>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Save className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hifadhi Sera za Ulinzi</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Kufunga Akaunti (Auto Lockout)</span>
                <input
                  type="checkbox"
                  checked={lockoutAfter5}
                  onChange={(e) => setLockoutAfter5(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Funga akaunti kiotomatiki kwa dakika 30 baada ya majaribio 5 yasiyo sahihi ya nenosiri.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Muda wa Kikao Kumalizika (Session Timeout)</span>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-800 font-semibold"
              >
                <option value="15">Dakika 15 (Ukaguzi wa Juu)</option>
                <option value="30">Dakika 30</option>
                <option value="60">Saa 1 (Inayopendekezwa)</option>
                <option value="1440">Masaa 24 (Siku Nzima)</option>
              </select>
              <p className="text-[11px] text-slate-500">Mtumiaji atalazimika kuingia upya baada ya muda huu kupita.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Uthibitishaji wa Hatua 2 (2FA)</span>
                <input
                  type="checkbox"
                  checked={require2FA}
                  onChange={(e) => setRequire2FA(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Lazimisha watumishi wote na walimu kuthibitisha kupitia OTP ya SMS au Barua pepe.
              </p>
            </div>
          </div>
        </form>

        {/* 2. Audit Trail Table */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Kumbukumbu za Mfumo (Audit Trail)</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {filteredLogs.length} Kumbukumbu
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kila kitendo kinarekodiwa na muhuri wa wakati (Timestamp), anwani ya IP na maelezo ya kifaa
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 border border-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit Logs</span>
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tafuta kwa barua pepe, kitendo au anwani ya IP..."
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {['ALL', 'SUCCESS', 'BLOCKED', 'WARNING'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterStatus === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Wakati (Timestamp)</th>
                  <th className="py-3 px-4">Mtumiaji &amp; Jukumu</th>
                  <th className="py-3 px-4">Kitendo Kilichofanyika</th>
                  <th className="py-3 px-4">Kifaa &amp; IP Address</th>
                  <th className="py-3 px-4 text-right">Hadhi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{log.user}</span>
                      <span className="text-[10px] font-mono text-slate-500">{log.role}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-700">{log.action}</td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      <div>{log.device}</div>
                      <div className="font-mono text-slate-400">{log.ip}</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'BLOCKED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
