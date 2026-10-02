'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  Filter,
  Check,
  AlertTriangle,
  Plus,
  Download,
  Upload,
  BookOpen,
  Calendar,
  Sparkles,
  Printer,
  Eye,
  Trash2,
  X,
  FileCheck,
  Users,
  Building2,
  Award,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';
import { SYLLABUS_OVERVIEW, SyllabusItem } from '@/lib/teacher-data';

export interface LessonPlanRecord {
  id: string;
  class: string;
  subject: string;
  weekNumber: number;
  periodDates: string;
  mainTopic: string;
  subTopic: string;
  competency: string;
  teachingAids: string;
  introActivity: string;
  mainActivity: string;
  conclusionActivity: string;
  assessmentCriteria: string;
  reflection: string;
  status: 'READY' | 'DRAFT' | 'TAUGHT';
  createdAt: string;
}

const STORAGE_MY_LESSON_PLANS_KEY = 'academic_portal_my_lesson_plans_v1';

// Initial seed lesson plans for the Headmaster as a teacher
const INITIAL_HEADMASTER_LESSON_PLANS: LessonPlanRecord[] = [
  {
    id: 'lp-std7-civ-w01',
    class: 'Standard 7 (Grade 7)',
    subject: 'Civic & Moral Education (Uraia na Maadili)',
    weekNumber: 1,
    periodDates: '12 Jan - 16 Jan 2026',
    mainTopic: 'Utawala wa Kidemokrasia na Katiba ya Nchi',
    subTopic: 'Misingi ya Katiba ya Jamhuri ya Muungano wa Tanzania',
    competency: 'Mwanafunzi aweze kueleza mihimili 3 ya dola na majukumu yake katika kuongoza nchi.',
    teachingAids: 'Nakala ya Katiba ya JMT (Sura ya 1-3), Chati ya Mihimili ya Dola, Picha za Bunge na Mahakama.',
    introActivity: 'Dakika 5: Kuwauliza wanafunzi viongozi wanaowafahamu shuleni na kulinganisha na uongozi wa kitaifa.',
    mainActivity: 'Dakika 25: Majadiliano ya vikundi kuhusu majukumu ya Serikali, Bunge, na Mahakama Kuu kwa kufuata mwongozo wa katiba.',
    conclusionActivity: 'Dakika 10: Maswali ya papo kwa hapo na kutoa kazi ya nyumbani ya kuorodhesha majukumu ya Spika na Jaji Mkuu.',
    assessmentCriteria: 'Uwezo wa mwanafunzi kutaja na kutofautisha mihimili mitatu ya dola bila kutazama kitabu.',
    reflection: 'Wanafunzi 14 kati ya 15 wameelewa vyema; kipindi kijacho tutafanya igizo fupi la Bunge darasani.',
    status: 'READY',
    createdAt: '2026-01-10',
  },
  {
    id: 'lp-std7-civ-w02',
    class: 'Standard 7 (Grade 7)',
    subject: 'Civic & Moral Education (Uraia na Maadili)',
    weekNumber: 2,
    periodDates: '19 Jan - 23 Jan 2026',
    mainTopic: 'Uzalendo, Haki za Binadamu na Ulinzi wa Rasilimali',
    subTopic: 'Ulinzi wa Madini na Misitu ya Taifa letu',
    competency: 'Mwanafunzi aweze kutambua rasilimali kuu za Tanzania na wajibu wake katika kuzuia uharibifu wa mazingira.',
    teachingAids: 'Ramani ya Madini na Mbuga za Wanyama za Tanzania, Video fupi au picha za uchimbaji madini Geita na Mirerani.',
    introActivity: 'Dakika 5: Kuangalia picha za madini ya Tanzanite na dhahabu na kuwauliza yanapatikana wapi.',
    mainActivity: 'Dakika 25: Ufundishaji shirikishi kuhusu sheria za madini, udhibiti wa magendo, na upandaji miti.',
    conclusionActivity: 'Dakika 10: Muhtasari wa somo na wanafunzi kuandika ahadi 3 za kulinda mazingira shuleni.',
    assessmentCriteria: 'Mwanafunzi kueleza umuhimu wa kulinda rasilimali za umma kwa maendeleo ya vizazi vijavyo.',
    reflection: 'Kipindi kilikuwa na msisimko mkubwa; maswali mengi yaliibuka kuhusu madini ya Tanzanite.',
    status: 'READY',
    createdAt: '2026-01-17',
  },
  {
    id: 'lp-std6-soc-w01',
    class: 'Standard 6 (Grade 6)',
    subject: 'Social Studies (Maarifa ya Jamii)',
    weekNumber: 1,
    periodDates: '12 Jan - 16 Jan 2026',
    mainTopic: 'Uchumi na Biashara katika Afrika Mashariki',
    subTopic: 'Jumuiya ya Afrika Mashariki (EAC) na Fursa za Kibiashara',
    competency: 'Mwanafunzi aweze kutaja nchi wanachama wa EAC na bidhaa kuu zinazouzwa na kununuliwa.',
    teachingAids: 'Ramani ya Afrika Mashariki, Bendera za nchi 8 wanachama, Sampuli za fedha mbalimbali.',
    introActivity: 'Dakika 5: Wimbo wa Jumuiya ya Afrika Mashariki na kuuliza majina ya nchi jirani za Tanzania.',
    mainActivity: 'Dakika 25: Kazi ya kutambua nchi wanachama kwenye ramani na kueleza soko la pamoja.',
    conclusionActivity: 'Dakika 10: Zoezi fupi la kulinganisha miji mikuu na nchi zake.',
    assessmentCriteria: 'Usahihi wa kutaja nchi 8 za EAC na faida za kuondoa vikwazo vya ushuru wa forodha.',
    reflection: 'Mada imekamilika kwa wakati; darasa limeonyesha uelewa wa asilimia 92%.',
    status: 'TAUGHT',
    createdAt: '2026-01-11',
  },
];

export default function CurriculumAndLessonPlansPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<'MY_PLANS' | 'SCHOOL_OVERSIGHT'>('MY_PLANS');

  // School oversight syllabus data
  const [syllabusList, setSyllabusList] = useState<SyllabusItem[]>(SYLLABUS_OVERVIEW);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('ALL');

  // Headmaster / Teacher lesson plans state
  const [lessonPlans, setLessonPlans] = useState<LessonPlanRecord[]>(() => {
    if (typeof window === 'undefined') return INITIAL_HEADMASTER_LESSON_PLANS;
    try {
      const stored = localStorage.getItem(STORAGE_MY_LESSON_PLANS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return INITIAL_HEADMASTER_LESSON_PLANS;
  });

  // Filter for teacher's own lesson plans
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');

  // Modal State for New Lesson Plan Builder
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedViewingPlan, setSelectedViewingPlan] = useState<LessonPlanRecord | null>(null);

  // Hidden File input for Uploading Lesson Plan Document
  const planFileInputRef = useRef<HTMLInputElement>(null);

  // Form State for creating a new lesson plan
  const [formData, setFormData] = useState({
    class: 'Standard 7 (Grade 7)',
    subject: 'Civic & Moral Education (Uraia na Maadili)',
    weekNumber: 3,
    periodDates: '26 Jan - 30 Jan 2026',
    mainTopic: '',
    subTopic: '',
    competency: '',
    teachingAids: '',
    introActivity: '',
    mainActivity: '',
    conclusionActivity: '',
    assessmentCriteria: '',
    reflection: '',
  });

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      if (session.assignedClasses && session.assignedClasses.length > 0) {
        setFormData((prev) => ({ ...prev, class: session.assignedClasses![0] }));
      }
    }
  }, []);

  // Save to localStorage whenever lessonPlans updates
  const savePlans = (newPlans: LessonPlanRecord[]) => {
    setLessonPlans(newPlans);
    try {
      localStorage.setItem(STORAGE_MY_LESSON_PLANS_KEY, JSON.stringify(newPlans));
    } catch {}
  };

  // Filtered Lesson Plans for Headmaster
  const myFilteredPlans = useMemo(() => {
    if (selectedClassFilter === 'ALL') return lessonPlans;
    return lessonPlans.filter((lp) => lp.class.includes(selectedClassFilter));
  }, [lessonPlans, selectedClassFilter]);

  // Filtered School Syllabus Oversight
  const filteredSyllabusList = useMemo(() => {
    if (selectedGradeFilter === 'ALL') return syllabusList;
    return syllabusList.filter((item) => item.grade.includes(selectedGradeFilter));
  }, [syllabusList, selectedGradeFilter]);

  // Handle Create Lesson Plan Submission
  const handleCreateLessonPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mainTopic.trim() || !formData.subTopic.trim()) {
      notifyUser('error', 'Taarifa Hazijakamilika', 'Tafadhali jaza mada kuu na mada ndogo.');
      return;
    }

    const newPlan: LessonPlanRecord = {
      id: `lp-${Date.now()}`,
      class: formData.class,
      subject: formData.subject,
      weekNumber: Number(formData.weekNumber) || 1,
      periodDates: formData.periodDates || `Wiki ${formData.weekNumber}`,
      mainTopic: formData.mainTopic,
      subTopic: formData.subTopic,
      competency: formData.competency || 'Kujenga stadi na umahiri kulingana na mtaala wa NECTA.',
      teachingAids: formData.teachingAids || 'Vitabu vya Kiada na Zana za Kielektroniki',
      introActivity: formData.introActivity || 'Utangulizi wa somo na maswali changamshi.',
      mainActivity: formData.mainActivity || 'Kufundisha mada kuu na kazi za vitendo darasani.',
      conclusionActivity: formData.conclusionActivity || 'Kutoa tathmini na kazi za nyumbani.',
      assessmentCriteria: formData.assessmentCriteria || 'Maswali ya mdomo na mazoezi ya vitendo.',
      reflection: formData.reflection || 'Mpango umekamilika na upo tayari kwa kipindi.',
      status: 'READY',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newPlan, ...lessonPlans];
    savePlans(updated);
    setShowCreateModal(false);

    // Reset Form
    setFormData((prev) => ({
      ...prev,
      weekNumber: prev.weekNumber + 1,
      mainTopic: '',
      subTopic: '',
      competency: '',
      teachingAids: '',
      introActivity: '',
      mainActivity: '',
      conclusionActivity: '',
      assessmentCriteria: '',
      reflection: '',
    }));

    notifyUser(
      'success',
      'Lesson Plan Imeandaliwa Kikamilifu!',
      `Andalio la somo la ${newPlan.subject} (${newPlan.class}) kwa Wiki ya ${newPlan.weekNumber} limehifadhiwa na lipo tayari kufundishia.`
    );
  };

  // Delete a lesson plan
  const handleDeletePlan = (id: string, name: string) => {
    if (confirm(`Una uhakika unataka kufuta Lesson Plan ya "${name}"?`)) {
      const updated = lessonPlans.filter((p) => p.id !== id);
      savePlans(updated);
      if (selectedViewingPlan?.id === id) {
        setSelectedViewingPlan(null);
      }
      notifyUser('info', 'Lesson Plan Imefutwa', `Andalio la somo limefutwa.`);
    }
  };

  // Upload external Lesson Plan Document
  const handleUploadPlanFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    const newPlan: LessonPlanRecord = {
      id: `lp-up-${Date.now()}`,
      class: 'Standard 7 (Grade 7)',
      subject: 'Civic & Moral Education (Uraia na Maadili)',
      weekNumber: lessonPlans.length + 1,
      periodDates: 'Faili Lililopakiwa',
      mainTopic: fileName,
      subTopic: 'Maudhui yameingizwa kutoka kwenye faili: ' + file.name,
      competency: 'Kulingana na andalio la somo lililoambatanishwa.',
      teachingAids: 'Faili la Nje: ' + file.name,
      introActivity: 'Kulingana na andalio lililopakiwa.',
      mainActivity: 'Utekelezaji wa shughuli za somo.',
      conclusionActivity: 'Tathmini ya somo.',
      assessmentCriteria: 'Mazoezi ya somo.',
      reflection: 'Faili limethibitishwa na Mwalimu Mkuu.',
      status: 'READY',
      createdAt: new Date().toISOString().split('T')[0],
    };

    savePlans([newPlan, ...lessonPlans]);
    notifyUser('success', 'Faili la Lesson Plan Limepakiwa!', `Andalio "${file.name}" limeongezwa kwenye orodha yako.`);
    e.target.value = '';
  };

  // Download official Lesson Plan template
  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Wiki,Darasa,Somo,Mada Kuu,Mada Ndogo,Umahumu / Malengo,Zana za Kufundishia,Hatua za Utangulizi,Hatua Kuu ya Somo,Hitimisho na Tathmini',
        'Wiki 1,Standard 7,Civic & Moral Education,Utawala Bora,Katiba ya Tanzania,Kuelewa mihimili ya dola,Chati ya Katiba,Maswali ya awali,Kazi za vikundi,Kazi ya nyumbani',
        'Wiki 2,Standard 7,Civic & Moral Education,Uzalendo,Kulinda Rasilimali,Kutambua madini na mbuga,Ramani ya Tanzania,Picha za madini,Ufundishaji shirikishi,Ahadi ya mazingira',
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kiolezo_Rasmi_Lesson_Plan_Tanzania_MoEST.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TeacherShell
      pageTitle="Curriculum & Lesson Plans"
      pageDescription="Andaa na simamia maazimio ya kazi (Lesson Plans) kwa masomo unayofundisha, na ufuatilie ukamilishaji wa mtaala wa shule nzima."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Hidden File Input for External Lesson Plan Upload */}
        <input
          type="file"
          ref={planFileInputRef}
          onChange={handleUploadPlanFile}
          accept=".pdf,.docx,.doc,.xlsx,.xls,.txt"
          className="hidden"
        />

        {/* ===================================================================== */}
        {/* 1. TOP DUAL TAB SWITCHER: MY PLANS vs SCHOOL OVERSIGHT */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-2 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('MY_PLANS')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'MY_PLANS'
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-200/60'
              }`}
            >
              <FileCheck className="w-4 h-4 text-amber-300" />
              <span>Maazimio &amp; Lesson Plans Zangu ({lessonPlans.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SCHOOL_OVERSIGHT')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'SCHOOL_OVERSIGHT'
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-200/60'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Usimamizi wa Shule Nzima (Curriculum Oversight)</span>
            </button>
          </div>

          {activeTab === 'MY_PLANS' && (
            <div className="flex flex-wrap items-center gap-2 pr-2">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Pakua kiolezo rasmi cha andalio la somo la Wizara ya Elimu (MoEST)"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Kiolezo cha Lesson Plan</span>
              </button>

              <button
                type="button"
                onClick={() => planFileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Pakia faili la andalio la somo lililoandaliwa kwenye Word au PDF"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pakia Faili (Word/PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Andaa Lesson Plan Mpya</span>
              </button>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: TEACHER / HEADMASTER LESSON PLANS WORKSPACE */}
        {/* ===================================================================== */}
        {activeTab === 'MY_PLANS' && (
          <div className="space-y-6">
            {/* Quick Filter & Summary Bar */}
            <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">
                    Maazimio ya Kazi na Maandalio ya Masomo (My Lesson Plans)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300">
                    Mwalimu Mkuu kama Mwalimu
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Andaa, hariri, na chapisha lesson plans rasmi kulingana na muundo wa Taasisi ya Elimu Tanzania (TIE / MoEST).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Chuja Darasa:</span>
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="ALL">Madarasa Yote Ninayofundisha</option>
                  <option value="Standard 7">Standard 7 (Grade 7)</option>
                  <option value="Standard 6">Standard 6 (Grade 6)</option>
                </select>
              </div>
            </div>

            {/* Lesson Plans Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myFilteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white/95 rounded-3xl border border-emerald-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-black uppercase">
                        Wiki {plan.weekNumber} • {plan.periodDates}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                          plan.status === 'READY'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : plan.status === 'TAUGHT'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {plan.status === 'READY'
                          ? 'Tayari Kufundishia'
                          : plan.status === 'TAUGHT'
                          ? 'Imeshafundishwa'
                          : 'Andalio la Awali'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 block">{plan.class}</span>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-1">
                        {plan.mainTopic}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-2">
                        {plan.subTopic}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                      <div>
                        <strong className="text-slate-700">Somo:</strong> {plan.subject}
                      </div>
                      <div>
                        <strong className="text-slate-700">Zana:</strong> {plan.teachingAids}
                      </div>
                      <div className="line-clamp-2">
                        <strong className="text-slate-700">Umahumu:</strong> {plan.competency}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedViewingPlan(plan)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Tazama Kamili</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedViewingPlan(plan)}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Chapisha Lesson Plan hii"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePlan(plan.id, plan.mainTopic)}
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Futa Lesson Plan hii"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {myFilteredPlans.length === 0 && (
              <div className="p-10 text-center bg-slate-50 border border-dashed border-slate-300 rounded-3xl space-y-3">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">
                  Hakuna Lesson Plan Iliyopatikana
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Bofya kitufe cha &quot;Andaa Lesson Plan Mpya&quot; au &quot;Pakia Faili&quot; kuanza kuweka maandalio ya masomo yako.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" />
                  <span>Andaa Lesson Plan Sasa</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: SCHOOL OVERSIGHT (WHOLE SCHOOL SYLLABUS & LESSON PLANS) */}
        {/* ===================================================================== */}
        {activeTab === 'SCHOOL_OVERSIGHT' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
                <span className="text-xs text-slate-500 block">Wastani wa Mtaala Shuleni</span>
                <span className="text-2xl font-black text-slate-800 block mt-1">80.6%</span>
                <span className="text-[11px] text-emerald-700 font-bold">Kiwango kinachoridhisha (Term 1)</span>
              </div>
              <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
                <span className="text-xs text-slate-500 block">Maazimio Yaliyowasilishwa</span>
                <span className="text-2xl font-black text-slate-800 block mt-1">65 / 80</span>
                <span className="text-[11px] text-emerald-700 font-bold">81.2% ya walimu wamewasilisha</span>
              </div>
              <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
                <span className="text-xs text-slate-500 block">Masomo Yaliyo Kwenye Ratiba</span>
                <span className="text-2xl font-black text-slate-800 block mt-1">4 / 5</span>
                <span className="text-[11px] text-emerald-700 font-bold">Yanaendelea kwa kasi inayotakiwa</span>
              </div>
              <div className="bg-white/95 rounded-2xl border border-emerald-200/80 p-4 shadow-xs">
                <span className="text-xs text-slate-500 block">Uangalizi wa Karibu</span>
                <span className="text-2xl font-black text-amber-600 block mt-1">1 Somo</span>
                <span className="text-[11px] text-amber-700 font-bold">Standard 5 English inahitaji kasi</span>
              </div>
            </div>

            {/* Syllabus Tracking Table */}
            <div className="bg-white/95 rounded-3xl border border-emerald-200/80 p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    Jedwali la Ukamilishaji wa Mada &amp; Maandalio ya Masomo Shuleni
                  </h3>
                  <p className="text-xs text-slate-500">
                    Uchambuzi wa mada zilizofundishwa kwa kila darasa na somo, pamoja na uwasilishaji wa maazimio ya kazi kutoka kwa walimu wote.
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Chuja:</span>
                  <select
                    value={selectedGradeFilter}
                    onChange={(e) => setSelectedGradeFilter(e.target.value)}
                    className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="ALL">Madarasa Yote</option>
                    <option value="Standard 7">Standard 7</option>
                    <option value="Standard 6">Standard 6</option>
                    <option value="Standard 5">Standard 5</option>
                    <option value="Standard 4">Standard 4</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Darasa</th>
                      <th className="py-3 px-4">Somo</th>
                      <th className="py-3 px-4">Mwalimu Mhusika</th>
                      <th className="py-3 px-4">Maazimio Yaliyowasilishwa</th>
                      <th className="py-3 px-4">Ukamilishaji wa Mada</th>
                      <th className="py-3 px-4">Hali</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredSyllabusList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-slate-800">{item.grade}</td>
                        <td className="py-3 px-4 text-emerald-900 font-semibold">{item.subject}</td>
                        <td className="py-3 px-4 text-slate-700">{item.teacher}</td>
                        <td className="py-3 px-4 font-mono">
                          {item.lessonPlansSubmitted} / {item.lessonPlansTotal} wiki
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.completion >= 80
                                    ? 'bg-emerald-600'
                                    : item.completion >= 60
                                    ? 'bg-blue-600'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${item.completion}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-700 text-xs w-8 text-right">
                              {item.completion}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              item.status === 'ON_TRACK'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {item.status === 'ON_TRACK' ? 'On Track' : 'Behind Schedule'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL: CREATE / PREPARE NEW LESSON PLAN */}
        {/* ===================================================================== */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-emerald-200 space-y-5 my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-700" />
                    <span>Andaa Lesson Plan Mpya (Tanzania MoEST Standard)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Jaza taarifa za andalio la somo kwa ajili ya kufundishia darasani.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLessonPlan} className="space-y-4 text-xs">
                {/* Row 1: Class, Subject, Week */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Darasa:
                    </label>
                    <select
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Standard 7 (Grade 7)">Standard 7 (Grade 7)</option>
                      <option value="Standard 6 (Grade 6)">Standard 6 (Grade 6)</option>
                      <option value="Standard 5 (Grade 5)">Standard 5 (Grade 5)</option>
                      <option value="Standard 4 (Grade 4)">Standard 4 (Grade 4)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Somo:
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Civic & Moral Education (Uraia na Maadili)">Civic &amp; Moral Education</option>
                      <option value="Social Studies (Maarifa ya Jamii)">Social Studies (Maarifa ya Jamii)</option>
                      <option value="Mathematics (Hisabati)">Mathematics (Hisabati)</option>
                      <option value="English Language">English Language</option>
                      <option value="Kiswahili">Kiswahili</option>
                      <option value="Science & Technology (Sayansi)">Science &amp; Technology</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Wiki Na.:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.weekNumber}
                      onChange={(e) => setFormData({ ...formData, weekNumber: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Row 2: Main Topic & Sub Topic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Mada Kuu (Main Topic): *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mfano: Utawala wa Kidemokrasia na Sheria"
                      value={formData.mainTopic}
                      onChange={(e) => setFormData({ ...formData, mainTopic: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Mada Ndogo (Sub Topic): *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mfano: Misingi ya Katiba ya Tanzania"
                      value={formData.subTopic}
                      onChange={(e) => setFormData({ ...formData, subTopic: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Row 3: Competency & Teaching Aids */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Umahumu / Malengo Mahsusi (Competency):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Mwanafunzi aweze kutaja na kufafanua..."
                      value={formData.competency}
                      onChange={(e) => setFormData({ ...formData, competency: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Zana za Kufundishia (Teaching Aids):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Vitabu vya kiada, chati, ramani, video fupi..."
                      value={formData.teachingAids}
                      onChange={(e) => setFormData({ ...formData, teachingAids: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>

                {/* Row 4: Lesson Stages (Utangulizi, Kujifunza, Hitimisho) */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider block">
                    Hatua za Kipindi Darasani (Tanzania Lesson Steps)
                  </span>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      1. Utangulizi (Dakika 5):
                    </label>
                    <input
                      type="text"
                      placeholder="Kuunganisha somo lililopita na kuuliza maswali changamshi..."
                      value={formData.introActivity}
                      onChange={(e) => setFormData({ ...formData, introActivity: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      2. Kujifunza / Shughuli Kuu (Dakika 25):
                    </label>
                    <input
                      type="text"
                      placeholder="Ufafanuzi wa mada, majadiliano ya vikundi, na kazi za vitendo..."
                      value={formData.mainActivity}
                      onChange={(e) => setFormData({ ...formData, mainActivity: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                      3. Hitimisho &amp; Tathmini (Dakika 10):
                    </label>
                    <input
                      type="text"
                      placeholder="Muhtasari wa kipindi, kutoa maswali ya tathmini na kazi ya nyumbani..."
                      value={formData.conclusionActivity}
                      onChange={(e) => setFormData({ ...formData, conclusionActivity: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-medium text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Hifadhi Lesson Plan</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL: VIEW & PRINT FULL LESSON PLAN DETAILS */}
        {/* ===================================================================== */}
        {selectedViewingPlan && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl border border-emerald-200 space-y-6 my-8">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                    JAMHURI YA MUUNGANO WA TANZANIA • WIZARA YA ELIMU, SAYANSI NA TEKNOLOJIA
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    Andalio la Somo (Official Lesson Plan)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mwalimu: <strong>Mwl. Augustine Mrosso (Mwalimu Mkuu)</strong> • {selectedViewingPlan.class}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Chapisha (Print)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedViewingPlan(null)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Lesson Plan Content Sheet */}
              <div className="space-y-4 text-xs text-slate-800">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Darasa</span>
                    <strong className="text-slate-900">{selectedViewingPlan.class}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Somo</span>
                    <strong className="text-emerald-900">{selectedViewingPlan.subject}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Wiki &amp; Tarehe</span>
                    <strong className="text-slate-900">Wiki {selectedViewingPlan.weekNumber} ({selectedViewingPlan.periodDates})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Hali</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[9px]">
                      {selectedViewingPlan.status === 'READY' ? 'Tayari' : 'Imefundishwa'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Mada Kuu (Main Topic)</span>
                    <p className="font-bold text-slate-900 text-sm">{selectedViewingPlan.mainTopic}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Mada Ndogo (Sub Topic)</span>
                    <p className="font-semibold text-slate-800">{selectedViewingPlan.subTopic}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Umahumu Mahsusi (Competency)</span>
                    <p className="text-slate-700">{selectedViewingPlan.competency}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Zana za Kufundishia (Teaching Aids)</span>
                    <p className="text-slate-700">{selectedViewingPlan.teachingAids}</p>
                  </div>
                </div>

                {/* Lesson Plan Steps Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold text-[10px] text-slate-700 uppercase">
                        <th className="py-2.5 px-3 w-28">Hatua / Muda</th>
                        <th className="py-2.5 px-4">Shughuli za Mwalimu na Wanafunzi (Activities)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-950 align-top">
                          1. Utangulizi <br />
                          <span className="text-[10px] font-mono text-slate-500 font-normal">Dakika 5</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{selectedViewingPlan.introActivity}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-950 align-top">
                          2. Kujifunza Kuu <br />
                          <span className="text-[10px] font-mono text-slate-500 font-normal">Dakika 25</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{selectedViewingPlan.mainActivity}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-bold text-emerald-950 align-top">
                          3. Hitimisho &amp; Tathmini <br />
                          <span className="text-[10px] font-mono text-slate-500 font-normal">Dakika 10</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{selectedViewingPlan.conclusionActivity}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {selectedViewingPlan.reflection && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-900 uppercase block">
                      Tafakuri ya Mwalimu Baada ya Kipindi (Teacher&apos;s Reflection)
                    </span>
                    <p className="text-amber-950 mt-0.5">{selectedViewingPlan.reflection}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedViewingPlan(null)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Funga
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
