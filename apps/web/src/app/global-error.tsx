'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  RotateCcw,
  Home,
  Phone,
  Mail,
  School,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    console.error('Global Error Boundary Captured:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F3FAF5] flex items-center justify-center p-4 text-slate-800 font-sans antialiased">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-rose-200 shadow-xl overflow-hidden animate-fade-in">
          {/* Top Header Bar */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <School className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xs font-black tracking-wider uppercase">PRIMARY &amp; NURSERY SCHOOL</h2>
                <p className="text-[10px] text-emerald-200">Mfumo Rasmi wa Shule</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 text-[10px] font-black uppercase tracking-wider border border-rose-400/30">
              Taarifa ya Hitilafu
            </span>
          </div>

          {/* Form Notification Body */}
          <div className="p-6 sm:p-7 space-y-5">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-900">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-700 shadow-2xs">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-rose-950">
                  Hitilafu ya Muda kwenye Mfumo (System Notification)
                </h3>
                <p className="text-xs text-rose-800 leading-relaxed">
                  Mfumo umekumbana na tatizo la muda wakati wa kupakia ukurasa. Data zako zote zipo salama.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="font-bold text-slate-900 text-xs">
                Taratibu za kufuata:
              </p>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Bofya kitufe cha <strong>Jaribu Tena</strong> hapa chini kupakia upya ukurasa.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ukiona inajirudia, bofya <strong>Rudi Mwanzo</strong> au wasiliana na ofisi ya shule.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => reset()}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Jaribu Tena (Try Again)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') window.location.href = '/';
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 text-slate-600" />
                <span>Rudi Mwanzo (Home)</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Simu: <strong>0779304500</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>Barua Pepe: <strong>pj0040280@gmail.com</strong></span>
              </div>
            </div>

            {/* Collapsible Technical Details */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="w-full py-1 text-[11px] text-slate-400 hover:text-slate-600 flex items-center justify-between font-medium cursor-pointer"
              >
                <span>Maelezo ya kiufundi (Technical Details)</span>
                {showTechnicalDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showTechnicalDetails && (
                <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 text-[10px] font-mono overflow-x-auto space-y-1">
                  <p className="text-rose-400 font-bold">
                    {error?.message || 'Global exception occurred.'}
                  </p>
                  {error?.digest && (
                    <p className="text-slate-400">Digest: {error.digest}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
