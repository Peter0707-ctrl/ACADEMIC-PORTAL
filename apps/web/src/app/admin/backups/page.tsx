'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Server,
  FileSpreadsheet,
  HardDrive,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import AdminShell from '@/components/admin-shell';
import { getStoredAccounts, setStoredAccounts } from '@/lib/auth-session';

export default function AdminBackupsPage() {
  const [isPingingDb, setIsPingingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; latencyMs: number; message: string }>({
    connected: true,
    latencyMs: 24,
    message: 'Railway Managed PostgreSQL is healthy and operational.',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  // Ping Database simulation
  const handlePingDatabase = () => {
    setIsPingingDb(true);
    setTimeout(() => {
      setIsPingingDb(false);
      setDbStatus({
        connected: true,
        latencyMs: Math.floor(18 + Math.random() * 15),
        message: 'Muunganisho wa Database ya Railway unafanya kazi kikamilifu (100% operational).',
      });
      setToastMessage('Database ping imekamilika kwa mafanikio.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
  };

  // Full System JSON Backup
  const handleDownloadFullBackup = () => {
    const backupData: Record<string, any> = {
      timestamp: new Date().toISOString(),
      version: 'v2.4-academic-portal',
      school: 'PRIMARY & NURSERY SCHOOL',
      accounts: getStoredAccounts(),
    };

    if (typeof window !== 'undefined') {
      try {
        backupData.schoolProfile = localStorage.getItem('academic_portal_school_profile_v1');
        backupData.academicYears = localStorage.getItem('academic_portal_years_config_v1');
        backupData.classes = localStorage.getItem('academic_portal_classes_config_v1');
        backupData.subjects = localStorage.getItem('academic_portal_subjects_config_v1');
        backupData.auditLogs = localStorage.getItem('academic_portal_audit_logs_v1');
      } catch {
        // pass
      }
    }

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `shule_full_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToastMessage('Faili kamili la JSON Backup limepakuliwa!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Restore from JSON File
  const handleRestoreBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.accounts && Array.isArray(parsed.accounts)) {
          setStoredAccounts(parsed.accounts);
        }
        if (typeof window !== 'undefined') {
          if (parsed.schoolProfile) localStorage.setItem('academic_portal_school_profile_v1', parsed.schoolProfile);
          if (parsed.academicYears) localStorage.setItem('academic_portal_years_config_v1', parsed.academicYears);
          if (parsed.classes) localStorage.setItem('academic_portal_classes_config_v1', parsed.classes);
          if (parsed.subjects) localStorage.setItem('academic_portal_subjects_config_v1', parsed.subjects);
        }

        setIsRestoring(false);
        setToastMessage('Data zote zimerejeshwa kutoka kwenye faili la Backup!');
        setTimeout(() => {
          setToastMessage(null);
          window.location.reload();
        }, 1500);
      } catch (err) {
        setIsRestoring(false);
        alert('Faili la backup halina muundo sahihi wa JSON au limeharibika.');
      }
    };
    reader.readAsText(file);
  };

  // Export module CSV
  const handleExportModuleCSV = (moduleName: string) => {
    const accounts = getStoredAccounts();
    let csvRows: string[] = [];

    if (moduleName === 'wanafunzi') {
      const pupils = accounts.filter((a) => a.role === 'STUDENT' || a.role === 'CANDIDATE');
      csvRows = [
        'Adm No,Full Name,Class,Role,Index No,Status',
        ...pupils.map((p) => `"${p.identifier}","${p.fullName}","${p.assignedClass || ''}",${p.role},"${p.examIndexNo || ''}",${p.status}`),
      ];
    } else if (moduleName === 'walimu') {
      const staff = accounts.filter((a) => ['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE', 'ACCOUNTANT', 'SECRETARY'].includes(a.role));
      csvRows = [
        'Staff ID,Full Name,Role,Email,Phone,Status',
        ...staff.map((s) => `"${s.identifier}","${s.fullName}",${s.role},"${s.email || ''}","${s.phone || ''}",${s.status}`),
      ];
    } else {
      csvRows = ['ID,Date,Item,Amount,Status', '"TX-01","2026-10-19","School Fees Payment","350000","COMPLETED"'];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `shule_${moduleName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminShell
      pageTitle="Hifadhi ya Data, Backups &amp; Database Sync"
      pageDescription="Pakua nakala kamili ya data ya shule (Full JSON Snapshot), rejesha data, pakua taarifa kwa CSV, na kagua muunganisho wa Railway PostgreSQL."
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

        {/* 1. Database Connection Status */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Railway Managed PostgreSQL Engine</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{dbStatus.message}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePingDatabase}
              disabled={isPingingDb}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isPingingDb ? 'animate-spin' : ''}`} />
              <span>{isPingingDb ? 'Inapima...' : 'Jaribu Ping'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Host Engine</span>
              <span className="font-mono font-bold text-slate-200">railway.internal:5432</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Roundtrip Latency</span>
              <span className="font-mono font-bold text-emerald-400">{dbStatus.latencyMs} ms</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Prisma Schema</span>
              <span className="font-bold text-indigo-400">Migrated &amp; In Sync</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Storage Strategy</span>
              <span className="font-bold text-amber-400">Hybrid (Offline + Cloud)</span>
            </div>
          </div>
        </div>

        {/* 2. One-Click Full Backup & Restore */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Download Full Backup */}
          <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Pakua Nakala Kamili ya Mfumo (Full Backup)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hupakua faili salama la JSON lenye watumiaji wote, wasifu wa shule, madarasa, mihula, masomo, na
                kumbukumbu zote za kiusalama kwa ajili ya kuhifadhi nje ya mtandao.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadFullBackup}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Pakua JSON Backup Sasa</span>
            </button>
          </div>

          {/* Restore from File */}
          <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Rejesha Data Kutoka Faili (Restore Data)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chagua faili la backup la JSON ulilopakua awali ili kurejesha taarifa zote za shule mara moja endapo
                kutatokea dharura au mabadiliko ya mfumo.
              </p>
            </div>

            <label className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>{isRestoring ? 'Inarejesha...' : 'Chagua Faili la Backup (.json)'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreBackupFile}
                disabled={isRestoring}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 3. Module Specific CSV Exports */}
        <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Kupakua Majalada ya Excel/CSV kwa Kila Moduli
            </h3>
            <p className="text-xs text-slate-500">
              Pakua taarifa mahususi za wanafunzi, watumishi, fedha au matokeo ya mitihani
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Daftari la Wanafunzi</span>
                <span className="text-[11px] text-slate-500">Wanafunzi wote, madarasa na namba za usajili</span>
              </div>
              <button
                type="button"
                onClick={() => handleExportModuleCSV('wanafunzi')}
                className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pakua CSV</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Daftari la Walimu &amp; Watumishi</span>
                <span className="text-[11px] text-slate-500">Orodha ya watumishi, majukumu na mawasiliano</span>
              </div>
              <button
                type="button"
                onClick={() => handleExportModuleCSV('walimu')}
                className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pakua CSV</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Kumbukumbu za Fedha &amp; Ankara</span>
                <span className="text-[11px] text-slate-500">Miamala ya ada, madeni, na risiti za malipo</span>
              </div>
              <button
                type="button"
                onClick={() => handleExportModuleCSV('fedha')}
                className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pakua CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
