'use client';

import React, { useState, useEffect } from 'react';
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
  BookOpen,
  Calendar,
  Printer,
  Download,
  Users,
  Award,
  Sparkles,
  Search,
  X,
  FileSpreadsheet,
  CheckSquare,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { getCurrentSession, UserAccount } from '@/lib/auth-session';
import { SYLLABUS_OVERVIEW, SyllabusItem } from '@/lib/teacher-data';
import { notifyUser } from '@/lib/notifications';

interface PersonalLessonPlan {
  id: string;
  className: string;
  subject: string;
  topic: string;
  subtopic: string;
  period: string;
  date: string;
  objectives: string;
  teachingAids: string;
  teacherActivities: string;
  pupilActivities: string;
  evaluation: string;
  status: 'READY' | 'COMPLETED' | 'DRAFT';
  isInspectedByLeader: boolean;
  inspectorRemarks?: string;
  inspectorName?: string;
}

interface StaffSubmittedLessonPlan {
  id: string;
  teacherName: string;
  teacherRole: string;
  className: string;
  subject: string;
  topic: string;
  subtopic: string;
  weekNumber: number;
  dateSubmitted: string;
  status: 'APPROVED' | 'PENDING_REVIEW' | 'NEEDS_REVISION';
  inspectorComments?: string;
  inspectedAt?: string;
  inspectedBy?: string;
  objectives: string;
  teachingAids: string;
  methodology: string;
}

const INITIAL_PERSONAL_PLANS: PersonalLessonPlan[] = [
  {
    id: 'my-plan-01',
    className: 'Standard 7 (Grade 7)',
    subject: 'Civic & Moral Education (Uraia na Maadili)',
    topic: 'Utawala Bora na Demokrasia',
    subtopic: 'Haki na Wajibu wa Raia katika Jamii',
    period: 'Kipindi cha 4 (10:20 - 11:00)',
    date: '2026-03-30',
    objectives: 'Kufikia mwisho wa somo, kila mwanafunzi aweze kueleza maana ya utawala bora na kutaja misingi 4 ya demokrasia nchini Tanzania.',
    teachingAids: 'Katiba ya Jamhuri ya Muungano, chati ya haki za binadamu, kadi za maswali.',
    teacherActivities: 'Kuelekeza wanafunzi katika majadiliano ya vikundi na kufafanua dhana ya uwazi na uwajibikaji.',
    pupilActivities: 'Kujadili mifano ya haki za msingi za raia na kuandika muhtasari kwenye madaftari yao.',
    evaluation: 'Maswali ya mdomo na zoezi la uandishi la maswali 3.',
    status: 'READY',
    isInspectedByLeader: true,
    inspectorRemarks: 'Mpango umeratibiwa vizuri sana, mbinu shirikishi zimezingatiwa ipasavyo.',
    inspectorName: 'Mwl. Beatrice Kimaro (Mwl. Taaluma)',
  },
  {
    id: 'my-plan-02',
    className: 'Standard 6 (Grade 6)',
    subject: 'Social Studies (Maarifa ya Jamii)',
    topic: 'Mazingira Yetu na Rasilimali',
    subtopic: 'Utunzaji wa Vyanzo vya Maji na Misitu',
    period: 'Kipindi cha 2 (08:40 - 09:20)',
    date: '2026-03-31',
    objectives: 'Kufikia mwisho wa somo, mwanafunzi aweze kubainisha vyanzo vya maji na njia 3 za kuzuia ukataji ovyo wa miti.',
    teachingAids: 'Picha za misitu ya asili, ramani ya vyanzo vya mito ya Tanzania.',
    teacherActivities: 'Kuonyesha picha na kueleza madhara ya uharibifu wa mazingira na mmomonyoko wa ardhi.',
    pupilActivities: 'Kuchora mchoro unaoonyesha upandaji miti na utunzaji wa vyanzo vya maji.',
    evaluation: 'Kusahihisha michoro ya wanafunzi na kutoa tathmini ya madaftari.',
    status: 'READY',
    isInspectedByLeader: false,
  },
];

const INITIAL_STAFF_SUBMISSIONS: StaffSubmittedLessonPlan[] = [
  {
    id: 'sub-01',
    teacherName: 'Mwl. Sarah Mollel',
    teacherRole: 'Class Teacher Std 6',
    className: 'Standard 6 (Grade 6)',
    subject: 'English Language',
    topic: 'Tenses and Grammar Structure',
    subtopic: 'Active and Passive Voice in Simple Past',
    weekNumber: 11,
    dateSubmitted: '2026-03-27',
    status: 'APPROVED',
    inspectedBy: 'Mwl. Augustine Mrosso (Mkuu)',
    inspectedAt: '2026-03-27 14:30',
    inspectorComments: 'Maandalio mazuri. Hakikisha wanafunzi wote wanashirikishwa kwenye mifano ya ubaoni.',
    objectives: 'Pupils will be able to convert active sentences into passive voice accurately.',
    teachingAids: 'Flashcards, Grammar sentence charts, Oxford Primary English Book 6.',
    methodology: 'Participatory role play, pair sentence transformation exercises.',
  },
  {
    id: 'sub-02',
    teacherName: 'Mwl. Emmanuel Swai',
    teacherRole: 'Class Teacher Std 7',
    className: 'Standard 7 (Grade 7)',
    subject: 'Mathematics (Hisabati)',
    topic: 'Maumbo ya Jiometria na Mzingo',
    subtopic: 'Kutafuta Mzingo na Eneo la Duara',
    weekNumber: 11,
    dateSubmitted: '2026-03-28',
    status: 'PENDING_REVIEW',
    objectives: 'Kukokotoa eneo na mzingo wa duara kwa kutumia fomula sahihi ya Pi (22/7 au 3.14).',
    teachingAids: 'Vifaa vya duara, rula, dira ya ubaoni, maumbo halisi ya kijiometria.',
    methodology: 'Ufafanuzi wa kihesabu ubaoni, mazoezi ya kibinafsi na maswali ya utatuzi.',
  },
  {
    id: 'sub-03',
    teacherName: 'Mwl. Godfrey Makere',
    teacherRole: 'Subject Teacher',
    className: 'Standard 4 (Grade 4)',
    subject: 'Social Studies (Maarifa ya Jamii)',
    topic: 'Hali ya Hewa na Misimu ya Mwaka',
    subtopic: 'Athari za Mvua za Masika kwenye Kilimo',
    weekNumber: 11,
    dateSubmitted: '2026-03-26',
    status: 'APPROVED',
    inspectedBy: 'Mwl. Beatrice Kimaro (Taaluma)',
    inspectedAt: '2026-03-26 11:15',
    inspectorComments: 'Maudhui yamekidhi kiwango cha SFNA. Mwalimu endelea na ratiba hii.',
    objectives: 'Kutaja misimu minne ya mwaka Tanzania na kueleza umuhimu wa msimu wa kilimo.',
    teachingAids: 'Kalenda ya misimu, picha za mavuno na mazingira ya shamba.',
    methodology: 'Masimulizi, maswali na majibu, majadiliano ya pamoja darasani.',
  },
  {
    id: 'sub-04',
    teacherName: 'Mwl. Emmanuel Lyimo',
    teacherRole: 'Discipline Master & Teacher',
    className: 'Standard 5 (Grade 5)',
    subject: 'Kiswahili',
    topic: 'Uandishi wa Insha na Barua Rasmi',
    subtopic: 'Muundo wa Barua ya Kikazi ya Kuomba Ruhusa',
    weekNumber: 11,
    dateSubmitted: '2026-03-28',
    status: 'PENDING_REVIEW',
    objectives: 'Mwanafunzi aweze kuandika anwani mbili na kichwa cha habari cha barua rasmi.',
    teachingAids: 'Mifano ya barua rasmi zilizochapishwa, ubao wa maelekezo.',
    methodology: 'Uchambuzi wa kielelezo cha barua, zoezi la uandishi darasani.',
  },
  {
    id: 'sub-05',
    teacherName: 'Mwl. Beatrice Kimaro',
    teacherRole: 'Academic Master & Teacher',
    className: 'Standard 6 (Grade 6)',
    subject: 'Science & Technology (Sayansi)',
    topic: 'Mwili wa Binadamu na Afya',
    subtopic: 'Mfumo wa Upumuaji na Kinga ya Mwili',
    weekNumber: 11,
    dateSubmitted: '2026-03-25',
    status: 'APPROVED',
    inspectedBy: 'Mwl. Augustine Mrosso (Mkuu)',
    inspectedAt: '2026-03-25 16:00',
    inspectorComments: 'Somo limeandaliwa kiufasaha, maabara ndogo itumike kwa mifano ya hewa.',
    objectives: 'Kutambua viungo vya mfumo wa upumuaji na kueleza njia za kuzuia magonjwa ya kifua.',
    teachingAids: 'Mchoro wa mapafu, puto na mrija wa kuonyesha upanukaji wa pafu.',
    methodology: 'Uonyeshaji wa zana halisi, maswali elekezi na muhtasari wa maelezo.',
  },
];

export default function CurriculumOversightPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // MAIN TOP TAB STATE:
  // Tab 1: 'MY_PLANS' (Maandalio Yangu ya Somo kama Mwalimu)
  // Tab 2: 'STAFF_INSPECTION' (Ukaguzi wa Maandalio ya Walimu kwa ajili ya Mkuu wa Shule & Taaluma)
  const [activeMainTab, setActiveMainTab] = useState<'MY_PLANS' | 'STAFF_INSPECTION'>('MY_PLANS');

  // Sub-tab under Personal Plans
  const [personalTab, setPersonalTab] = useState<'TODAY' | 'UPCOMING' | 'COMPLETED'>('TODAY');

  // Personal Plans State
  const [personalPlans, setPersonalPlans] = useState<PersonalLessonPlan[]>(INITIAL_PERSONAL_PLANS);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [selectedPlanForPrint, setSelectedPlanForPrint] = useState<PersonalLessonPlan | null>(null);

  // Staff Inspection State
  const [staffSubmissions, setStaffSubmissions] = useState<StaffSubmittedLessonPlan[]>(INITIAL_STAFF_SUBMISSIONS);
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<StaffSubmittedLessonPlan | null>(null);
  const [reviewVerdict, setReviewVerdict] = useState<'APPROVED' | 'NEEDS_REVISION'>('APPROVED');
  const [reviewCommentInput, setReviewCommentInput] = useState('');
  const [staffGradeFilter, setStaffGradeFilter] = useState('ALL');

  // Syllabus Overview Data
  const [syllabusList] = useState<SyllabusItem[]>(SYLLABUS_OVERVIEW);

  // Form State for creating personal plan
  const [formClass, setFormClass] = useState('Standard 7 (Grade 7)');
  const [formSubject, setFormSubject] = useState('Civic & Moral Education (Uraia na Maadili)');
  const [formTopic, setFormTopic] = useState('');
  const [formSubtopic, setFormSubtopic] = useState('');
  const [formPeriod, setFormPeriod] = useState('Kipindi cha 3 (09:50 - 10:30)');
  const [formDate, setFormDate] = useState('2026-04-01');
  const [formObjectives, setFormObjectives] = useState('');
  const [formAids, setFormAids] = useState('');
  const [formTeacherAct, setFormTeacherAct] = useState('');
  const [formPupilAct, setFormPupilAct] = useState('');
  const [formEval, setFormEval] = useState('');

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      // If user is Headteacher, Academic Master, or Second Headmaster, default to Staff Inspection if desired, or keep My Plans
      if (session.assignedClasses && session.assignedClasses.length > 0) {
        setFormClass(session.assignedClasses[0]);
      }
    }
  }, []);

  const isLeadershipUser =
    currentUser?.role === 'HEADTEACHER' ||
    currentUser?.role === 'ACADEMIC' ||
    currentUser?.role === 'DISCIPLINE' ||
    currentUser?.leadershipRole === 'HEADTEACHER' ||
    currentUser?.leadershipRole === 'ACADEMIC' ||
    currentUser?.role === 'ADMIN';

  // Handler: Create Personal Lesson Plan
  const handleCreatePersonalPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim() || !formObjectives.trim()) {
      notifyUser('warning', 'Taarifa Zinahitajika', 'Tafadhali jaza mada na malengo ya somo.');
      return;
    }

    const newPlan: PersonalLessonPlan = {
      id: `my-plan-${Date.now()}`,
      className: formClass,
      subject: formSubject,
      topic: formTopic.trim(),
      subtopic: formSubtopic.trim() || 'Utangulizi wa Mada',
      period: formPeriod,
      date: formDate,
      objectives: formObjectives.trim(),
      teachingAids: formAids.trim() || 'Vitabu vya kiada, chati na ubao',
      teacherActivities: formTeacherAct.trim() || 'Kufafanua na kuelekeza wanafunzi',
      pupilActivities: formPupilAct.trim() || 'Kufanya mazoezi na kutoa mifano',
      evaluation: formEval.trim() || 'Maswali ya mdomo na tathmini ya daftari',
      status: 'READY',
      isInspectedByLeader: false,
    };

    setPersonalPlans([newPlan, ...personalPlans]);
    setShowCreatePlanModal(false);
    setFormTopic('');
    setFormSubtopic('');
    setFormObjectives('');

    notifyUser(
      'success',
      'Andiko la Somo Limeundwa!',
      `Andiko la somo la ${newPlan.subject} (${newPlan.className}) limehifadhiwa tayari kwa kufundishia.`
    );
  };

  // Handler: Review & Sign Off on Staff Lesson Plan (For Headmaster / Academic)
  const handleSaveStaffReview = () => {
    if (!selectedSubmissionForReview || !currentUser) return;

    const stampTime = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const reviewerTitle =
      currentUser.role === 'HEADTEACHER'
        ? `${currentUser.fullName} (Mkuu wa Shule)`
        : currentUser.role === 'ACADEMIC'
        ? `${currentUser.fullName} (Mwl. Taaluma)`
        : `${currentUser.fullName} (Uongozi wa Shule)`;

    const updatedSubmissions = staffSubmissions.map((sub) => {
      if (sub.id === selectedSubmissionForReview.id) {
        return {
          ...sub,
          status: reviewVerdict,
          inspectorComments: reviewCommentInput.trim() || (reviewVerdict === 'APPROVED' ? 'Imekaguliwa na kusainiwa rasmi.' : 'Tafadhali rekebisha zana za ufundishaji na malengo.'),
          inspectedAt: stampTime,
          inspectedBy: reviewerTitle,
        };
      }
      return sub;
    });

    setStaffSubmissions(updatedSubmissions);
    setSelectedSubmissionForReview(null);

    notifyUser(
      'success',
      'Ukaguzi Umekamilika & Kusainiwa!',
      `Andiko la somo la ${selectedSubmissionForReview.teacherName} limekaguliwa rasmi na kuwekwa saini (${reviewVerdict === 'APPROVED' ? 'Limeidhinishwa' : 'Linahitaji Marekebisho'}).`
    );
  };

  // Open Inspection Review Modal
  const openReviewModal = (plan: StaffSubmittedLessonPlan) => {
    setSelectedSubmissionForReview(plan);
    setReviewVerdict(plan.status === 'NEEDS_REVISION' ? 'NEEDS_REVISION' : 'APPROVED');
    setReviewCommentInput(plan.inspectorComments || 'Mpango umekamilika vizuri sana, mbinu shirikishi zimezingatiwa ipasavyo.');
  };

  const filteredStaffSubmissions = staffSubmissions.filter((sub) => {
    if (staffGradeFilter === 'ALL') return true;
    return sub.className.includes(staffGradeFilter);
  });

  return (
    <TeacherShell
      pageTitle="Maandalio ya Somo & Ukaguzi wa Mitaala (Lesson Plans)"
      pageDescription="Andaa maandalio yako ya masomo unayofundisha, na kagua maandalio ya kazi yaliyowasilishwa na walimu wote wa shule."
    >
      <div className="space-y-6 animate-fade-in">
        {/* ================================================================= */}
        {/* 1. TOP DUAL TAB SELECTOR (MY LESSON PLANS vs STAFF INSPECTION)     */}
        {/* ================================================================= */}
        <div className="bg-white rounded-3xl border border-emerald-200 p-2 shadow-xs flex flex-col sm:flex-row gap-2">
          {/* TAB 1: MAANDALIO YANGU YA SOMO (FOR THE TEACHER / HEADMASTER HIMSELF) */}
          <button
            type="button"
            onClick={() => setActiveMainTab('MY_PLANS')}
            className={`flex-1 py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              activeMainTab === 'MY_PLANS'
                ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeMainTab === 'MY_PLANS' ? 'text-amber-300' : 'text-emerald-700'}`} />
            <span>1. Maandalio Yangu ya Somo (My Lesson Plans)</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeMainTab === 'MY_PLANS' ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              Ufundishaji Wangu
            </span>
          </button>

          {/* TAB 2: UKAGUZI WA MAANDALIO YA WALIMU (FOR HEADMASTER, SECOND HEAD, ACADEMIC & ASSISTANTS) */}
          <button
            type="button"
            onClick={() => setActiveMainTab('STAFF_INSPECTION')}
            className={`flex-1 py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              activeMainTab === 'STAFF_INSPECTION'
                ? 'bg-emerald-800 text-white shadow-md shadow-emerald-950/20'
                : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-950'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeMainTab === 'STAFF_INSPECTION' ? 'text-amber-300' : 'text-emerald-700'}`} />
            <span>2. Ukaguzi wa Maandalio ya Walimu (Staff Lesson Plan Review)</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeMainTab === 'STAFF_INSPECTION'
                  ? 'bg-amber-400 text-emerald-950'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              Ofisi ya Mkuu &amp; Taaluma
            </span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* MODE 1: MY LESSON PLANS (MAANDALIO YANGU YA SOMO)                 */}
        {/* ================================================================= */}
        {activeMainTab === 'MY_PLANS' && (
          <div className="space-y-6">
            {/* Header Box: Actions & Class Context */}
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-base font-black text-slate-900">
                    Maandalio ya Masomo Ninayofundisha ({currentUser?.fullName})
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Madarasa unayofundisha: <span className="font-bold text-slate-700">{currentUser?.assignedClasses?.join(', ') || 'Standard 6 & 7'}</span> • Masomo: <span className="font-bold text-slate-700">{currentUser?.subjects?.join(', ') || 'Hisabati, Sayansi, Uraia'}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePlanModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Andaa Lesson Plan Mpya</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const csvContent = 'data:text/csv;charset=utf-8,Darasa,Somo,Mada,Mada Ndogo,Kipindi,Malengo,Zana,Tathmini\nStandard 7,Civic & Moral,Utawala Bora,Demokrasia,Kipindi 4,Malengo ya Somo,Katiba,Maswali';
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'MoEST_Lesson_Plan_Template_2026.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    notifyUser('success', 'Kiolezo Kimepakuliwa', 'Kiolezo rasmi cha Lesson Plan (CSV) kimepakuliwa.');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pakua Template</span>
                </button>
              </div>
            </div>

            {/* List of Personal Lesson Plans */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Orodha ya Maandalio Yako ya Kazi (Your Prepared Lesson Plans):
                </h3>
                <span className="text-xs font-bold text-emerald-800">
                  {personalPlans.length} Maandalio Yapo Tayari
                </span>
              </div>

              {personalPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4 hover:border-emerald-400 transition-all"
                >
                  {/* Top Bar of Plan */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">
                        {plan.className}
                      </span>
                      <span className="text-xs font-bold text-slate-700">• {plan.subject}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{plan.period}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">• {plan.date}</span>
                    </div>
                  </div>

                  {/* Topic & Subtopic */}
                  <div>
                    <h4 className="text-base font-black text-slate-900 leading-snug">
                      Mada Kuu: {plan.topic}
                    </h4>
                    <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                      Mada Ndogo: {plan.subtopic}
                    </p>
                  </div>

                  {/* MoEST Standard Structure Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Malengo ya Somo</span>
                      <p className="text-slate-800 text-[11px] leading-relaxed">{plan.objectives}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Zana za Ufundishaji</span>
                      <p className="text-slate-800 text-[11px] leading-relaxed">{plan.teachingAids}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Vitendo vya Mwalimu na Wanafunzi</span>
                      <p className="text-slate-800 text-[11px] leading-relaxed">{plan.teacherActivities}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Tathmini ya Somo</span>
                      <p className="text-slate-800 text-[11px] leading-relaxed">{plan.evaluation}</p>
                    </div>
                  </div>

                  {/* Leadership Inspection Feedback on this plan */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      {plan.isInspectedByLeader ? (
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Imekaguliwa &amp; Kusainiwa na: {plan.inspectorName}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span>Ipo Tayari Kufundishia (Tayari kwa Ukaguzi)</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlanForPrint(plan);
                        setTimeout(() => window.print(), 300);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Chapisha (Print Lesson Plan)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODE 2: STAFF LESSON PLAN REVIEW & INSPECTION                      */}
        {/* (UKAGUZI WA MAANDALIO YA WALIMU WOTE SHULENI)                      */}
        {/* ================================================================= */}
        {activeMainTab === 'STAFF_INSPECTION' && (
          <div className="space-y-6">
            {/* Leadership Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs">
                <span className="text-xs text-slate-500 block">Wastani wa Mtaala Shuleni</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">80.6%</span>
                <span className="text-[11px] text-emerald-700 font-bold">Kiwango kinachoridhisha (Term 1)</span>
              </div>
              <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs">
                <span className="text-xs text-slate-500 block">Maazimio Yaliyowasilishwa</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">
                  {staffSubmissions.length} / 12 Walimu
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">85% ya walimu wamewasilisha</span>
              </div>
              <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs">
                <span className="text-xs text-slate-500 block">Yaliyokaguliwa &amp; Kusainiwa</span>
                <span className="text-2xl font-black text-emerald-800 block mt-1">
                  {staffSubmissions.filter((s) => s.status === 'APPROVED').length}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">Yameidhinishwa rasmi</span>
              </div>
              <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-xs">
                <span className="text-xs text-slate-500 block">Yanasubiri Ukaguzi</span>
                <span className="text-2xl font-black text-amber-600 block mt-1">
                  {staffSubmissions.filter((s) => s.status === 'PENDING_REVIEW').length}
                </span>
                <span className="text-[11px] text-amber-700 font-bold">Yanahitaji saini ya Mkuu/Taaluma</span>
              </div>
            </div>

            {/* Staff Submissions Inspection Table */}
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-800" />
                    <h3 className="text-base font-black text-slate-900">
                      Ukaguzi wa Maandalio ya Walimu (Staff Inspection &amp; Sign-Off)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kama Mkuu wa Shule au Mwalimu wa Taaluma, bofya &quot;Kagua &amp; Saini&quot; kuangalia andiko la mwalimu na kuweka saini rasmi.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Chuja Darasa:</span>
                  <select
                    value={staffGradeFilter}
                    onChange={(e) => setStaffGradeFilter(e.target.value)}
                    className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="ALL">Madarasa Yote</option>
                    <option value="Standard 7">Standard 7</option>
                    <option value="Standard 6">Standard 6</option>
                    <option value="Standard 5">Standard 5</option>
                    <option value="Standard 4">Standard 4</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Mwalimu Mhusika</th>
                      <th className="py-3 px-3">Darasa &amp; Somo</th>
                      <th className="py-3 px-3">Mada &amp; Mada Ndogo</th>
                      <th className="py-3 px-3 text-center">Wiki / Tarehe</th>
                      <th className="py-3 px-3 text-center">Hali ya Ukaguzi</th>
                      <th className="py-3 px-3">Maoni ya Uongozi</th>
                      <th className="py-3 px-3 text-right">Kitendo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredStaffSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">
                          <div>
                            <span>{sub.teacherName}</span>
                            <span className="text-[10px] text-slate-400 block font-normal">{sub.teacherRole}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-emerald-900 block">{sub.className}</span>
                          <span className="text-[11px] text-slate-600 block">{sub.subject}</span>
                        </td>
                        <td className="py-3 px-3 max-w-[200px]">
                          <span className="font-bold text-slate-800 block truncate">{sub.topic}</span>
                          <span className="text-[11px] text-slate-500 block truncate">{sub.subtopic}</span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-[11px]">
                          <span className="font-bold block">Wiki ya {sub.weekNumber}</span>
                          <span className="text-slate-400 text-[10px]">{sub.dateSubmitted}</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              sub.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : sub.status === 'NEEDS_REVISION'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {sub.status === 'APPROVED'
                              ? 'Imekaguliwa & Kusainiwa'
                              : sub.status === 'NEEDS_REVISION'
                              ? 'Inahitaji Marekebisho'
                              : 'Inasubiri Ukaguzi'}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-[180px] text-[11px] text-slate-600">
                          {sub.inspectorComments ? (
                            <div>
                              <p className="truncate italic">&quot;{sub.inspectorComments}&quot;</p>
                              <span className="text-[10px] font-semibold text-emerald-800 block mt-0.5">
                                {sub.inspectedBy}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Bado haijakaguliwa</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => openReviewModal(sub)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                          >
                            Kagua &amp; Saini &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Curriculum Progress & Syllabus Oversight Table */}
            <div className="bg-white rounded-3xl border border-emerald-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  Ufuatiliaji wa Mtaala wa Shule Nzima (Syllabus Completion Oversight)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ulinganisho wa mada zilizofundishwa kwa kila darasa na somo dhidi ya muhtasari wa NECTA/MoEST.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Darasa</th>
                      <th className="py-3 px-4">Somo</th>
                      <th className="py-3 px-4">Mwalimu Mhusika</th>
                      <th className="py-3 px-4 text-center">Maazimio Yaliyowasilishwa</th>
                      <th className="py-3 px-4">Ukamilishaji wa Mada</th>
                      <th className="py-3 px-4 text-center">Hali</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-medium">
                    {syllabusList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{item.grade}</td>
                        <td className="py-3 px-4 font-bold text-emerald-800">{item.subject}</td>
                        <td className="py-3 px-4 text-slate-700">{item.teacher}</td>
                        <td className="py-3 px-4 text-center font-mono">
                          {item.lessonPlansSubmitted} / {item.lessonPlansTotal} wiki
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-28 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.completion >= 80 ? 'bg-emerald-600' : 'bg-blue-600'
                                }`}
                                style={{ width: `${item.completion}%` }}
                              />
                            </div>
                            <span className="font-bold text-[11px]">{item.completion}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'ON_TRACK'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status === 'ON_TRACK' ? 'On Track' : 'Inahitaji Kasi'}
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

        {/* ================================================================= */}
        {/* MODAL: CREATE PERSONAL LESSON PLAN                                */}
        {/* ================================================================= */}
        {showCreatePlanModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-black text-slate-900">
                    Andaa Andiko Jipya la Somo (New Lesson Plan)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreatePlanModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePersonalPlan} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Darasa (Class):</label>
                    <select
                      value={formClass}
                      onChange={(e) => setFormClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="Standard 7 (Grade 7)">Standard 7 (Grade 7)</option>
                      <option value="Standard 6 (Grade 6)">Standard 6 (Grade 6)</option>
                      <option value="Standard 5 (Grade 5)">Standard 5 (Grade 5)</option>
                      <option value="Standard 4 (Grade 4)">Standard 4 (Grade 4)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Somo (Subject):</label>
                    <select
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="Civic & Moral Education (Uraia na Maadili)">Civic &amp; Moral Education (Uraia na Maadili)</option>
                      <option value="Social Studies (Maarifa ya Jamii)">Social Studies (Maarifa ya Jamii)</option>
                      <option value="Mathematics (Hisabati)">Mathematics (Hisabati)</option>
                      <option value="Science & Technology (Sayansi)">Science &amp; Technology (Sayansi)</option>
                      <option value="English Language">English Language</option>
                      <option value="Kiswahili">Kiswahili</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mada Kuu (Main Topic):</label>
                    <input
                      type="text"
                      required
                      placeholder="Mfano: Utawala Bora na Demokrasia"
                      value={formTopic}
                      onChange={(e) => setFormTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mada Ndogo (Subtopic):</label>
                    <input
                      type="text"
                      placeholder="Mfano: Haki na Wajibu wa Raia"
                      value={formSubtopic}
                      onChange={(e) => setFormSubtopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kipindi &amp; Muda (Period &amp; Time):</label>
                    <input
                      type="text"
                      value={formPeriod}
                      onChange={(e) => setFormPeriod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tarehe ya Kufundisha:</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Malengo Mahususi ya Somo (Specific Objectives):</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Mwisho wa somo mwanafunzi ataweza..."
                    value={formObjectives}
                    onChange={(e) => setFormObjectives(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Zana za Kujifunzia (Teaching Aids):</label>
                    <input
                      type="text"
                      placeholder="Chati, Katiba, picha n.k."
                      value={formAids}
                      onChange={(e) => setFormAids(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tathmini / Upimaji (Evaluation):</label>
                    <input
                      type="text"
                      placeholder="Maswali ya mdomo, zoezi la uandishi"
                      value={formEval}
                      onChange={(e) => setFormEval(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowCreatePlanModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs"
                  >
                    Hifadhi Lesson Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* MODAL: LEADERSHIP INSPECT & SIGN-OFF (FOR HEADMASTER / ACADEMIC)  */}
        {/* ================================================================= */}
        {selectedSubmissionForReview && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-emerald-200 animate-scale-up space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Ukaguzi wa Lesson Plan ya Mwalimu
                    </h3>
                    <span className="text-xs text-slate-500">
                      Mwalimu: <strong className="text-emerald-800">{selectedSubmissionForReview.teacherName}</strong> • {selectedSubmissionForReview.className}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSubmissionForReview(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lesson Plan Details Being Inspected */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-700">Somo: {selectedSubmissionForReview.subject}</span>
                  <span className="font-mono text-slate-500">Iliwasilishwa: {selectedSubmissionForReview.dateSubmitted}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Mada Kuu &amp; Mada Ndogo:</span>
                  <span className="font-black text-slate-900 block">{selectedSubmissionForReview.topic}</span>
                  <span className="text-emerald-800 font-semibold">{selectedSubmissionForReview.subtopic}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Malengo ya Somo:</span>
                  <p className="text-slate-700">{selectedSubmissionForReview.objectives}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Zana na Mbinu:</span>
                  <p className="text-slate-700">{selectedSubmissionForReview.teachingAids} • {selectedSubmissionForReview.methodology}</p>
                </div>
              </div>

              {/* Reviewer Sign-Off Form */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Uamuzi wa Ukaguzi (Leadership Verdict):
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewVerdict('APPROVED')}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                        reviewVerdict === 'APPROVED'
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Idhinisha &amp; Saini (Approve)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewVerdict('NEEDS_REVISION')}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                        reviewVerdict === 'NEEDS_REVISION'
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-300" />
                      <span>Inahitaji Marekebisho</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Maoni &amp; Maelekezo ya Kiongozi (Inspector Comments &amp; Recommendations):
                  </label>
                  <textarea
                    rows={3}
                    value={reviewCommentInput}
                    onChange={(e) => setReviewCommentInput(e.target.value)}
                    placeholder="Weka maoni ya kitaaluma kwa mwalimu..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Ukaguzi huu utawekwa saini rasmi kwa jina lako: <strong>{currentUser?.fullName}</strong> ({currentUser?.role === 'HEADTEACHER' ? 'Mwalimu Mkuu' : 'Mwalimu wa Taaluma'}).
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmissionForReview(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Ghairi
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveStaffReview}
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Weka Saini &amp; Kamilisha Ukaguzi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherShell>
  );
}
