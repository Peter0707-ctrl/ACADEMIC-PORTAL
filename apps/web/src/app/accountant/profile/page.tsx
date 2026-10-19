'use client';

import React, { useState, useEffect } from 'react';
import { AccountantShell } from '@/components/accountant-shell';
import { getAllFinanceAuditLogs, FinanceAuditEntry } from '@/lib/accountant-data';
import {
  User,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Key,
  History,
  CheckCircle,
  Clock,
  Lock,
} from 'lucide-react';

export default function AccountantProfilePage() {
  const [logs, setLogs] = useState<FinanceAuditEntry[]>([]);

  useEffect(() => {
    setLogs(getAllFinanceAuditLogs());
  }, []);

  return (
    <AccountantShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
              <User className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Wasifu wa Mhasibu wa Shule (Accountant Profile)
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Taarifa za mtumiaji, idhini za kiuhasibu, na kumbukumbu ya ukaguzi wa matendo yote (Audit Trail)
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card & Permissions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
                RT
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-4">Bw. Ramadhani A. Tembo</h2>
              <span className="inline-block mt-1 text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                Mhasibu Mkuu wa Shule (School Accountant)
              </span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Namba ya Utambulisho:</span>
                <strong className="font-mono text-slate-800">ACC-2026-001</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Shule Husika:</span>
                <span className="text-slate-800 font-medium">Kukumbuka Primary & Nursery</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Barua Pepe:</span>
                <span className="text-slate-800 font-mono">accountant@primaryschool.ac.tz</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Simu:</span>
                <span className="text-slate-800 font-mono">+255 754 112 233</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hali ya Akaunti:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Inatumika (Active)
                </span>
              </div>
            </div>
          </div>

          {/* Role & Authorized Permissions */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Idhini za Kiuhasibu (Role & Permissions)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Kama ilivyoelekezwa katika Mwongozo wa Mfumo, majukumu ya Mhasibu yametenganishwa kikamilifu na majukumu ya Ualimu, Taaluma, na Nidhamu:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Usimamizi wa Ada & Ankara</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Kutengeneza miundo ya ada, kutoa ankara, kurekodi malipo na kutoa stakabadhi rasmi.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Matumizi & Vocha za Shule</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Kuwasilisha maombi ya matumizi, kulipa matumizi yaliyoidhinishwa na Mwalimu Mkuu.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cashbook & Hesabu za Benki</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Kusimamia kitabu cha fedha taslimu (Petty Cash) na kufanya upatanisho wa benki (CRDB/NMB).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kibali cha Fedha (Clearance)</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Kutoa au kuzuia kibali cha kufanya mitihani na kupewa ripoti ya maendeleo kulingana na ada.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-slate-700 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                <strong>Kikomo cha Usalama:</strong> Mhasibu haruhusiwi kurekebisha au kupitisha matokeo ya mitihani ya kitaaluma.
              </span>
            </div>
          </div>
        </div>

        {/* Audit Trail of Accountant Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-slate-800 text-base">
                Kumbukumbu ya Ukaguzi wa Matendo (Financial Audit Trail)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Miamala yote inarekodiwa na haifutiki</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3">Muda & Tarehe</th>
                  <th className="px-4 py-3">Mtendaji</th>
                  <th className="px-4 py-3">Aina ya Kitendo</th>
                  <th className="px-4 py-3">Rejea #</th>
                  <th className="px-4 py-3">Maelezo ya Kina</th>
                  <th className="px-4 py-3">Anwani ya Kifaa (IP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800 whitespace-nowrap">{log.user}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 font-mono text-[10px] rounded text-slate-800 font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-emerald-800 font-medium whitespace-nowrap">
                      {log.recordId}
                    </td>
                    <td className="px-4 py-2.5 text-slate-700">{log.details}</td>
                    <td className="px-4 py-2.5 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AccountantShell>
  );
}
