'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Award,
  BookOpen,
  Shield,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getStoredAccounts, UserAccount } from '@/lib/auth-session';

export default function TeachingStaffPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const allAccounts = getStoredAccounts();

  const teachers = useMemo(() => {
    return allAccounts.filter((a) => ['TEACHER', 'HEADTEACHER', 'ACADEMIC', 'DISCIPLINE'].includes(a.role));
  }, [allAccounts]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch =
        t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.email && t.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = roleFilter === 'ALL' || t.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [teachers, searchTerm, roleFilter]);

  return (
    <TeacherShell
      pageTitle="Orodha ya Walimu & Idara (Teaching Staff Directory)"
      pageDescription="Orodha kamili ya walimu wote wa shule ya msingi, masomo na madarasa wanayofundisha, na mawasiliano yao ya kikazi."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header and Filter */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-800">
                Wafanyakazi wa Taaluma na Uongozi ({filteredTeachers.length} Walimu)
              </h3>
              <p className="text-xs text-slate-500">
                Walimu wote wamesajiliwa kwenye mfumo na wana ratiba za ufundishaji zilizoidhinishwa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tafuta mwalimu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent focus:outline-none text-slate-700 w-32 sm:w-44"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Vyeo Vyote</option>
                <option value="HEADTEACHER">Mwalimu Mkuu</option>
                <option value="ACADEMIC">Mwalimu wa Taaluma</option>
                <option value="DISCIPLINE">Mwalimu wa Nidhamu</option>
                <option value="TEACHER">Walimu wa Kawaida</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredTeachers.map((t) => {
              const isHead = t.role === 'HEADTEACHER';
              const isAcad = t.role === 'ACADEMIC';
              const isDisc = t.role === 'DISCIPLINE';

              return (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all hover:shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base border border-emerald-200 shrink-0">
                        {isHead ? <Award className="w-5 h-5 text-amber-600" /> : isAcad ? <BookOpen className="w-5 h-5 text-blue-600" /> : isDisc ? <Shield className="w-5 h-5 text-emerald-700" /> : t.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{t.fullName}</h4>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">{t.identifier}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      isHead
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : isAcad
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : isDisc
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {isHead ? 'Mkuu wa Shule' : isAcad ? 'Taaluma' : isDisc ? 'Nidhamu' : 'Class Teacher'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        <strong>Masomo:</strong> {t.subjects?.join(', ') || 'Primary Curriculum'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        <strong>Madarasa:</strong> {t.assignedClasses?.join(', ') || t.assignedClass || 'Whole School'}
                      </span>
                    </div>

                    {t.phone && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t.phone}</span>
                      </div>
                    )}

                    {t.email && (
                      <div className="flex items-center gap-2 text-slate-500 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{t.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}
