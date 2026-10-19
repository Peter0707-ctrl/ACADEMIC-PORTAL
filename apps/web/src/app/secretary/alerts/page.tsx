'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SecretaryShell from '@/components/secretary-shell';
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  FileCheck,
  UserX,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Filter,
  FileText,
  Mail,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import {
  getAllDocuments,
  getChecklists,
  getAllCorrespondence,
  SchoolDocumentRecord,
  CorrespondenceItem,
} from '@/lib/secretary-data';
import { notifyUser } from '@/lib/notifications';

interface AlertItem {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'STUDENT_FILE' | 'STAFF_FILE' | 'COMPLIANCE_LICENSE' | 'CORRESPONDENCE_PENDING' | 'PENDING_FILING';
  categoryLabel: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  dueDate?: string;
  relatedEntity?: string;
}

export default function SecretaryAlertsPage() {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Generate real dynamic alerts based on database state
  const alerts = useMemo<AlertItem[]>(() => {
    const docs = getAllDocuments();
    const corr = getAllCorrespondence();
    const items: AlertItem[] = [];

    // 1. Incomplete Student Files
    items.push({
      id: 'alt-std-01',
      severity: 'HIGH',
      category: 'STUDENT_FILE',
      categoryLabel: 'Faili la Mwanafunzi Halijakamilika',
      title: 'Kukosekana kwa Vyeti vya Kuzaliwa vya RITA (Wanafunzi 14)',
      description: 'Wanafunzi 14 wa Darasa la Awali na La Kwanza hawajawasilisha nakala zilizothibitishwa za vyeti vya kuzaliwa vya RITA.',
      actionLabel: 'Tazama Orodha ya Wanafunzi',
      actionHref: '/secretary/students?filter=incomplete',
      dueDate: 'Haraka (Kabla ya Ukaguzi)',
      relatedEntity: 'Chekechea & Darasa la I',
    });

    items.push({
      id: 'alt-std-02',
      severity: 'MEDIUM',
      category: 'STUDENT_FILE',
      categoryLabel: 'Faili la Mwanafunzi Halijakamilika',
      title: 'Picha za Pasipoti Zinazokosekana (Wanafunzi 8)',
      description: 'Faili za usajili za wanafunzi 8 wa Darasa la Nne hazina picha rasmi za pasipoti za sare ya shule.',
      actionLabel: 'Kagua Faili za Wanafunzi',
      actionHref: '/secretary/students',
      dueDate: 'Ndani ya Siku 14',
      relatedEntity: 'Darasa la 4A & 4B',
    });

    // 2. Staff Files
    items.push({
      id: 'alt-stf-01',
      severity: 'HIGH',
      category: 'STAFF_FILE',
      categoryLabel: 'Faili la Mtumishi Halijakamilika',
      title: 'Namba za Usajili wa TSC Zinazokosekana (Walimu 3)',
      description: 'Mwl. Grace Makani (STF-003) na walimu wengine wawili wa mkataba hawajakamilisha kuweka namba zao rasmi za Tume ya Utumishi wa Walimu (TSC).',
      actionLabel: 'Kagua Faili za Watumishi',
      actionHref: '/secretary/staff',
      dueDate: 'Kipau Mbele',
      relatedEntity: 'Kitengo cha Ualimu',
    });

    // 3. Pending Correspondence
    const pendingCorr = corr.filter((c) => c.status === 'PENDING');
    if (pendingCorr.length > 0) {
      items.push({
        id: 'alt-corr-01',
        severity: 'HIGH',
        category: 'CORRESPONDENCE_PENDING',
        categoryLabel: 'Barua Inayosubiri Majibu',
        title: `Kuna Barua ${pendingCorr.length} Zinazosubiri Ushughulikiwaji`,
        description: `Barua ya rejea ${pendingCorr[0].referenceNumber} ("${pendingCorr[0].subject}") kutoka kwa ${pendingCorr[0].senderOrRecipient} inasubiri majibu au utekelezaji.`,
        actionLabel: 'Fungua Masjala ya Barua',
        actionHref: '/secretary/correspondence',
        dueDate: 'Leo',
        relatedEntity: pendingCorr[0].senderOrRecipient,
      });
    }

    // 4. Pending Review / Filing Documents
    const pendingDocs = docs.filter((d) => d.status === 'PENDING_REVIEW');
    if (pendingDocs.length > 0) {
      items.push({
        id: 'alt-fil-01',
        severity: 'MEDIUM',
        category: 'PENDING_FILING',
        categoryLabel: 'Hati Zinazosubiri Kuhifadhiwa',
        title: `${pendingDocs.length} Nyaraka Zinazosubiri Ukaguzi na Uthibitisho`,
        description: 'Kuna nyaraka zilizopakiwa ambazo hazijapewa namba rasmi za rejea au bado hazijathibitishwa na uongozi.',
        actionLabel: 'Thibitisha Kwenye Masjala',
        actionHref: '/secretary/registry',
        dueDate: 'Ndani ya Saa 48',
      });
    }

    // 5. Compliance & Licenses
    items.push({
      id: 'alt-lic-01',
      severity: 'LOW',
      category: 'COMPLIANCE_LICENSE',
      categoryLabel: 'Ukaguzi & Leseni za Shule',
      title: 'Cheti cha Ukaguzi wa Usalama wa Moto (Fire Safety Certificate)',
      description: 'Cheti cha usalama wa zima moto kinatarajiwa kuhuishwa mwishoni mwa muhula wa pili kulingana na sheria ya manispaa.',
      actionLabel: 'Tazama Nyaraka za Utawala',
      actionHref: '/secretary/registry?category=SCHOOL_ADMINISTRATION',
      dueDate: 'Miezi 3 Ijayo',
      relatedEntity: 'Idara ya Zimamoto Manispaa',
    });

    return items;
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchSeverity = filterSeverity === 'ALL' || a.severity === filterSeverity;
      const matchCat = filterCategory === 'ALL' || a.category === filterCategory;
      return matchSeverity && matchCat;
    });
  }, [alerts, filterSeverity, filterCategory]);

  return (
    <SecretaryShell
      pageTitle="Tahadhari & Masuala Yanayohitaji Hatua (Alerts & Warnings)"
      pageDescription="Ufuatiliaji wa hati zinazokosekana, mafaili yasiyokamilika ya wanafunzi na watumishi, na barua zinazosubiri"
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-rose-50 border border-rose-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
              {alerts.filter((a) => a.severity === 'HIGH').length}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 block">
                Kipau Mbele cha Juu (High)
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Zinahitaji Hatua za Haraka</h3>
              <p className="text-[11px] text-slate-500">Vyeti vya RITA na barua rasmi</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
              {alerts.filter((a) => a.severity === 'MEDIUM').length}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                Kipau Mbele cha Kati (Medium)
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Nyaraka Zinazosubiri</h3>
              <p className="text-[11px] text-slate-500">Picha za pasipoti na uhakiki</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
              {alerts.filter((a) => a.severity === 'LOW').length}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block">
                Vikumbusho vya Kisheria (Low)
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Leseni &amp; Vibali vya Shule</h3>
              <p className="text-[11px] text-slate-500">Miongozo ya manispaa na zima moto</p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-teal-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">Orodha ya Tahadhari Zinazofuatiliwa</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">Kiwango Chochote cha Tahadhari</option>
              <option value="HIGH">Kipau Mbele cha Juu Pekee</option>
              <option value="MEDIUM">Kipau Mbele cha Kati Pekee</option>
              <option value="LOW">Vikumbusho vya Kawaida Pekee</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">Kategoria Zote za Tahadhari</option>
              <option value="STUDENT_FILE">Faili za Wanafunzi</option>
              <option value="STAFF_FILE">Faili za Watumishi</option>
              <option value="CORRESPONDENCE_PENDING">Barua Zinazosubiri</option>
              <option value="PENDING_FILING">Hati Zinazosubiri</option>
              <option value="COMPLIANCE_LICENSE">Vibali &amp; Leseni</option>
            </select>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alt) => {
            const severityStyles = {
              HIGH: {
                badge: 'bg-rose-100 text-rose-800 border-rose-200',
                border: 'border-l-4 border-l-rose-500 border-rose-200/80',
                icon: AlertCircle,
                iconColor: 'text-rose-600',
              },
              MEDIUM: {
                badge: 'bg-amber-100 text-amber-800 border-amber-200',
                border: 'border-l-4 border-l-amber-500 border-amber-200/80',
                icon: AlertTriangle,
                iconColor: 'text-amber-600',
              },
              LOW: {
                badge: 'bg-blue-100 text-blue-800 border-blue-200',
                border: 'border-l-4 border-l-blue-500 border-blue-200/80',
                icon: Clock,
                iconColor: 'text-blue-600',
              },
            }[alt.severity];

            const Icon = severityStyles.icon;

            return (
              <div
                key={alt.id}
                className={`bg-white rounded-2xl p-5 shadow-xs transition-all hover:shadow-md border ${severityStyles.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0 ${severityStyles.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${severityStyles.badge}`}>
                        {alt.categoryLabel}
                      </span>
                      {alt.relatedEntity && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          &bull; {alt.relatedEntity}
                        </span>
                      )}
                      {alt.dueDate && (
                        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Hadi: {alt.dueDate}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{alt.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {alt.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={alt.actionHref}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <span>{alt.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}

          {filteredAlerts.length === 0 && (
            <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">Hakuna tahadhari zilizopatikana</h3>
              <p className="text-xs text-slate-500 mt-1">
                Faili na nyaraka zote za shule zipo katika hali nzuri kulingana na vigezo vilivyochaguliwa.
              </p>
            </div>
          )}
        </div>
      </div>
    </SecretaryShell>
  );
}
