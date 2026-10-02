'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import type { NotificationPayload } from '@/lib/notifications';

export default function NotificationModal() {
  const [notification, setNotification] = useState<NotificationPayload | null>(null);

  const dismiss = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent<NotificationPayload>;
      if (customEvent.detail) {
        setNotification(customEvent.detail);
      }
    };

    window.addEventListener('academic_portal_notify', handleNotification);
    return () => {
      window.removeEventListener('academic_portal_notify', handleNotification);
    };
  }, []);

  if (!notification) return null;

  const isError = notification.type === 'error';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 text-center transition-all animate-scale-in relative ${
          isError
            ? 'bg-gradient-to-br from-[#FFF5F5] via-[#FFF1F2] to-[#FFE4E6] border-rose-300 text-rose-950 shadow-rose-950/20'
            : 'bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]/40 border-sky-300 text-sky-950 shadow-sky-950/20'
        }`}
      >
        {/* Top Ice / Rose Accent Glow Strip */}
        <div
          className={`h-2.5 w-full ${
            isError
              ? 'bg-gradient-to-r from-rose-500 via-red-500 to-rose-600'
              : 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500'
          }`}
        />

        {/* Close Button at top right */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Funga"
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            isError
              ? 'text-rose-600 hover:bg-rose-200/60'
              : 'text-sky-700 hover:bg-sky-200/60'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7 space-y-4">
          {/* Form Tag Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs">
            {isError ? (
              <span className="bg-rose-200/80 text-rose-900 border-rose-300 px-2 py-0.5 rounded-full">
                Fomu ya Hitilafu (Error Notice)
              </span>
            ) : (
              <span className="bg-sky-200/80 text-sky-950 border-sky-300 px-2 py-0.5 rounded-full">
                Fomu ya Taarifa Rasmi (Notice Form)
              </span>
            )}
          </div>

          {/* Form Icon */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border shadow-sm ${
              isError
                ? 'bg-rose-100 border-rose-300 text-rose-600'
                : 'bg-sky-100 border-sky-300 text-sky-700'
            }`}
          >
            {isError ? (
              <AlertCircle className="w-7 h-7" />
            ) : notification.type === 'info' ? (
              <Info className="w-7 h-7" />
            ) : (
              <CheckCircle2 className="w-7 h-7 text-sky-600" />
            )}
          </div>

          {/* Title & Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-black tracking-tight leading-snug">
              {notification.title}
            </h3>
            <p
              className={`text-xs leading-relaxed px-2 font-medium ${
                isError ? 'text-rose-800' : 'text-sky-900'
              }`}
            >
              {notification.message}
            </p>
          </div>

          {/* Submit / Confirm Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={dismiss}
              className={`w-full py-3 px-5 rounded-2xl font-bold text-xs text-white transition-all shadow-lg active:scale-98 ${
                isError
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/25'
                  : 'bg-sky-700 hover:bg-sky-800 shadow-sky-900/25'
              }`}
            >
              Nimeelewa (Sawa)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
