'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  School,
  Clock,
  ArrowLeft,
  LogOut,
  Bell,
  MessageSquare,
  ShieldAlert,
  FileText,
  Send,
  FileCheck,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  Printer,
  TrendingUp,
  AlertCircle,
  Info,
  CreditCard,
  Receipt,
  UserCheck,
  UserX,
  Plus,
  Building2,
  Phone,
  Mail,
  QrCode,
  Menu,
  X,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Brain,
  Bot,
  RefreshCw,
  Check,
} from 'lucide-react';
import { getCurrentSession, clearCurrentSession, getStoredAccounts } from '@/lib/auth-session';
import { notifyUser } from '@/lib/notifications';
import { PARENT_TRANSLATIONS, Language } from '@/lib/parent-translations';
import { INITIAL_PUPILS, StudentMark } from '@/lib/teacher-data';

interface ChildProfile {
  id: string;
  name: string;
  admNo: string;
  class: string;
  stream: string;
  homeroomTeacher: string;
  gender: 'M' | 'F';
  dob: string;
  photoInitial: string;
  termAverage: number;
  rank: string;
  attendanceRate: number;
  feePaid: number;
  feeTotal: number;
  controlNumber: string;
  conduct: string;
  subjects: {
    name: string;
    code: string;
    teacher: string;
    monthly1: number;
    monthly2: number;
    midterm: number;
    terminal: number;
    average: number;
    grade: string;
    remarks: string;
  }[];
  attendanceHistory: {
    month: string;
    present: number;
    absent: number;
    permission: number;
    rate: string;
  }[];
  feeHistory: {
    receiptNo: string;
    date: string;
    description: string;
    amount: number;
    method: string;
    status: 'CONFIRMED' | 'PENDING';
  }[];
  disciplineRecords: {
    date: string;
    issue: string;
    status: 'RESOLVED' | 'UNDER_REVIEW';
    action: string;
  }[];
}

export interface ControlNumberBill {
  controlNumber: string; // 12-digit GePG/bank format e.g. "992841092834"
  billReference: string; // e.g. "BILL-2026-0428-1092"
  childId: string;
  childName: string;
  admNo: string;
  purpose: string;
  amount: number;
  generatedAt: string;
  expiresAt: string;
  channel: string;
  status: 'ACTIVE' | 'PAID' | 'EXPIRED';
  paidAt?: string;
  paidReceiptNo?: string;
}

// Luhn algorithm check digit calculation
function computeLuhnCheckDigit(digitsStr: string): number {
  let sum = 0;
  let alternate = true;
  for (let i = digitsStr.length - 1; i >= 0; i--) {
    let n = parseInt(digitsStr.charAt(i), 10);
    if (isNaN(n)) continue;
    if (alternate) {
      n *= 2;
      if (n > 9) n = (n % 10) + 1;
    }
    sum += n;
    alternate = !alternate;
  }
  return (10 - (sum % 10)) % 10;
}

// Generates real 12-digit GePG / Bank Control Number with 9928 education prefix and valid Luhn check digit
function generateRealControlNumber(): string {
  const prefix = '9928';
  const seed = Math.floor(1000000 + Math.random() * 9000000).toString(); // 7 random digits
  const first11 = prefix + seed;
  const checkDigit = computeLuhnCheckDigit(first11);
  return first11 + checkDigit.toString();
}

function formatControlNumber(cn: string): string {
  if (!cn) return '';
  const clean = cn.replace(/\s+/g, '');
  if (clean.length === 12) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)}`;
  }
  return clean;
}

const STORAGE_REGISTERED_PUPILS_KEY = 'academic_portal_registered_pupils_v2';
const STORAGE_PARENT_CHILDREN_KEY = 'parent_linked_children_v3';
const STORAGE_VISIT_APPOINTMENTS_KEY = 'parent_visit_appointments_v3';
const STORAGE_LEAVE_REQUESTS_KEY = 'parent_leave_requests_v3';

// Dynamically create a complete ChildProfile from registered pupil mark record
function buildChildProfileFromPupil(
  pupil: StudentMark,
  className: string,
  homeroomTeacher: string
): ChildProfile {
  const variance = (offset: number) => Math.min(100, Math.max(35, pupil.mark + offset));
  const calcGrade = (m: number) => (m >= 81 ? 'A' : m >= 65 ? 'B' : m >= 45 ? 'C' : m >= 30 ? 'D' : 'F');
  const calcRem = (g: string) =>
    g === 'A' ? 'Bora Sana' : g === 'B' ? 'Vizuri Sana' : g === 'C' ? 'Wastani' : 'Inahitaji Bidii';

  const m1 = pupil.monthlyTest1;
  const m2 = pupil.monthlyTest2;
  const mid = pupil.midtermExam;
  const term = pupil.terminalExam;

  const subjects = [
    {
      name: 'Mathematics (Hisabati)',
      code: 'MATH-01',
      teacher: 'Mwl. Beatrice Kimaro',
      monthly1: m1,
      monthly2: m2,
      midterm: mid,
      terminal: term,
      average: pupil.mark,
      grade: pupil.grade,
      remarks: pupil.remarks || 'Bora Sana',
    },
    {
      name: 'Science & Technology (Sayansi)',
      code: 'SCI-02',
      teacher: 'Mwl. Emmanuel Swai',
      monthly1: variance(-2),
      monthly2: variance(1),
      midterm: variance(-1),
      terminal: variance(2),
      average: variance(0),
      grade: calcGrade(variance(0)),
      remarks: calcRem(calcGrade(variance(0))),
    },
    {
      name: 'English Language',
      code: 'ENG-03',
      teacher: 'Mwl. Sarah Mollel',
      monthly1: variance(-3),
      monthly2: variance(-1),
      midterm: variance(0),
      terminal: variance(1),
      average: variance(-1),
      grade: calcGrade(variance(-1)),
      remarks: calcRem(calcGrade(variance(-1))),
    },
    {
      name: 'Kiswahili',
      code: 'KISW-04',
      teacher: 'Mwl. Juma Rashidi',
      monthly1: variance(1),
      monthly2: variance(2),
      midterm: variance(1),
      terminal: variance(3),
      average: variance(2),
      grade: calcGrade(variance(2)),
      remarks: calcRem(calcGrade(variance(2))),
    },
    {
      name: 'Civic & Moral Education (Uraia)',
      code: 'CIV-05',
      teacher: 'Mwl. Augustine Mrosso (Mkuu)',
      monthly1: variance(-1),
      monthly2: variance(0),
      midterm: variance(1),
      terminal: variance(2),
      average: variance(1),
      grade: calcGrade(variance(1)),
      remarks: calcRem(calcGrade(variance(1))),
    },
    {
      name: 'Social Studies (Maarifa ya Jamii)',
      code: 'SOC-06',
      teacher: 'Mwl. Augustine Mrosso (Mkuu)',
      monthly1: variance(-4),
      monthly2: variance(-2),
      midterm: variance(-3),
      terminal: variance(-1),
      average: variance(-2),
      grade: calcGrade(variance(-2)),
      remarks: calcRem(calcGrade(variance(-2))),
    },
  ];

  const totalFee = className.includes('7') ? 600000 : className.includes('6') ? 550000 : 500000;
  const paidFee = className.includes('7') ? 450000 : className.includes('6') ? 500000 : 400000;

  return {
    id: pupil.id,
    name: pupil.name.replace(/\s*\(Candidate\)/i, ''),
    admNo: pupil.admNo,
    class: className,
    stream: className.includes('7') ? 'Stream A (Watahiniwa)' : 'Stream A',
    homeroomTeacher,
    gender: pupil.gender,
    dob: pupil.gender === 'M' ? '14 Mei 2013' : '22 Agosti 2014',
    photoInitial: pupil.name
      .replace(/\s*\(Candidate\)/i, '')
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
    termAverage: pupil.mark,
    rank: pupil.rank ? `Nafasi ya ${pupil.rank} / 35` : 'Nafasi ya 1 / 35',
    attendanceRate: 98.2,
    feePaid: paidFee,
    feeTotal: totalFee,
    controlNumber: generateRealControlNumber(),
    conduct: pupil.mark >= 80 ? 'Mwenendo Mzuri Sana (Tabia Njema)' : 'Mwenendo Mzuri',
    subjects,
    attendanceHistory: [
      { month: 'Januari 2026', present: 22, absent: 0, permission: 0, rate: '100%' },
      { month: 'Februari 2026', present: 20, absent: 1, permission: 0, rate: '95.2%' },
      { month: 'Machi 2026', present: 21, absent: 0, permission: 1, rate: '95.5%' },
    ],
    feeHistory: [
      {
        receiptNo: `RCP-2026-0891`,
        date: '2026-01-10',
        description: 'Ada ya Muhula wa 1 (Awamu ya 1)',
        amount: 300000,
        method: 'Namba ya Malipo ya Shule / NMB',
        status: 'CONFIRMED',
      },
      {
        receiptNo: `RCP-2026-1142`,
        date: '2026-02-15',
        description: 'Ada ya Maabara & Mitihani',
        amount: paidFee - 300000,
        method: 'M-Pesa Paybill',
        status: 'CONFIRMED',
      },
    ],
    disciplineRecords: [],
  };
}

// Function to get initial linked children dynamically from the registered pupil database
function getInitialLinkedChildren(): ChildProfile[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_PARENT_CHILDREN_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
  }
  return [];
}

type ParentTab =
  | 'DASHBOARD'
  | 'ACADEMIC'
  | 'ATTENDANCE'
  | 'FINANCE'
  | 'COMMUNICATION'
  | 'MEETINGS'
  | 'DOCUMENTS'
  | 'DISCIPLINE'
  | 'REQUESTS';

export default function ParentGuardianPortal() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>(() => getInitialLinkedChildren());
  const [selectedChildId, setSelectedChildId] = useState<string>(() => {
    const list = getInitialLinkedChildren();
    return list[0]?.id || 'p7-01';
  });
  const [activeTab, setActiveTab] = useState<ParentTab>('DASHBOARD');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Language Switcher: 'SW' (Kiswahili) | 'EN' (English)
  const [language, setLanguage] = useState<Language>('SW');
  const t = PARENT_TRANSLATIONS[language];
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const session = getCurrentSession();
    setCurrentUser(session);
  }, []);

  // Typewriter Salutation based on time of day and selected language
  const [typedGreeting, setTypedGreeting] = useState('');

  useEffect(() => {
    const currentHour = new Date().getHours();
    let greeting = '';
    if (language === 'SW') {
      greeting =
        currentHour >= 5 && currentHour < 12
          ? 'HABARI YA ASUBUHI! KARIBU KWENYE PORTAL YA WAZAZI'
          : currentHour >= 12 && currentHour < 16
          ? 'HABARI YA MCHANA! KARIBU KWENYE PORTAL YA WAZAZI'
          : currentHour >= 16 && currentHour < 20
          ? 'HABARI YA JIONI! KARIBU KWENYE PORTAL YA WAZAZI'
          : 'HABARI YA USIKU! KARIBU KWENYE PORTAL YA WAZAZI';
    } else {
      greeting =
        currentHour >= 5 && currentHour < 12
          ? 'GOOD MORNING! WELCOME TO PARENT & GUARDIAN PORTAL'
          : currentHour >= 12 && currentHour < 16
          ? 'GOOD AFTERNOON! WELCOME TO PARENT & GUARDIAN PORTAL'
          : currentHour >= 16 && currentHour < 20
          ? 'GOOD EVENING! WELCOME TO PARENT & GUARDIAN PORTAL'
          : 'GOOD NIGHT! WELCOME TO PARENT & GUARDIAN PORTAL';
    }

    let i = 0;
    setTypedGreeting('');
    const timer = setInterval(() => {
      i++;
      setTypedGreeting(greeting.slice(0, i));
      if (i >= greeting.length) {
        clearInterval(timer);
      }
    }, 35);

    return () => clearInterval(timer);
  }, [language]);

  // Profile Photo Upload — persisted to localStorage
  const profileFileRef = useRef<HTMLInputElement>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setProfilePhoto(dataUrl);
      if (typeof window !== 'undefined') {
        localStorage.setItem('parent_profile_photo', dataUrl);
      }
      setShowProfileModal(false);
      setActiveNotice('Picha ya wasifu imesasishwa kikamilifu!');
    };
    reader.readAsDataURL(file);
  };

  // Student Visit / Meeting Request State
  const [visitChildName, setVisitChildName] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [visitReason, setVisitReason] = useState('Mazungumzo ya Jumla na Mwalimu / Mkuu wa Shule');
  const [visitDisciplineRef, setVisitDisciplineRef] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [submittedVisits, setSubmittedVisits] = useState<{
    id: string; childName: string; date: string; time: string; reason: string;
    disciplineRef: string; notes: string; status: string; dateSubmitted: string;
    confirmedBy?: string; tourType?: string;
  }[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_VISIT_APPOINTMENTS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {}
    }
    return [];
  });

  // Link Child State
  const [showLinkChildModal, setShowLinkChildModal] = useState(false);
  const [linkAdmNo, setLinkAdmNo] = useState('');
  const [linkSecurityPin, setLinkSecurityPin] = useState('');

  // Dustbin / Trash State
  const [trashedChildren, setTrashedChildren] = useState<ChildProfile[]>([]);
  const [showDustbinModal, setShowDustbinModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleMoveToTrash = (childId: string) => {
    const target = children.find((c) => c.id === childId);
    if (!target) return;
    setTrashedChildren((prev) => [target, ...prev]);
    setChildren((prev) => {
      const updated = prev.filter((c) => c.id !== childId);
      if (selectedChildId === childId && updated.length > 0) {
        setSelectedChildId(updated[0].id);
      }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_PARENT_CHILDREN_KEY, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
    setActiveNotice(
      language === 'SW'
        ? `${target.name} amehamishiwa kwenye Dustbin. Unaweza kumrejesha au kumfuta kabisa kutoka huko.`
        : `${target.name} moved to Trash Bin. You can restore or permanently delete them.`
    );
  };

  const handleRestoreFromTrash = (childId: string) => {
    const target = trashedChildren.find((c) => c.id === childId);
    if (!target) return;
    setTrashedChildren((prev) => prev.filter((c) => c.id !== childId));
    setChildren((prev) => {
      const updated = [...prev, target];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_PARENT_CHILDREN_KEY, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
    setActiveNotice(
      language === 'SW'
        ? `${target.name} amerejeshwa kwenye orodha yako ya watoto.`
        : `${target.name} has been restored to your child list.`
    );
  };

  const handlePermanentDelete = (childId: string) => {
    const target = trashedChildren.find((c) => c.id === childId);
    setTrashedChildren((prev) => prev.filter((c) => c.id !== childId));
    setConfirmDeleteId(null);
    setActiveNotice(
      language === 'SW'
        ? `${target?.name ?? 'Mtoto'} amefutwa kabisa na hawezi kurejeshwa tena.`
        : `${target?.name ?? 'Child'} has been permanently deleted.`
    );
  };

  // Handle Linking a New Child dynamically from registered pupil database
  const handleLinkNewChild = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedAdm = linkAdmNo.trim().toUpperCase();
    if (!cleanedAdm) return;

    if (children.some((c) => c.admNo.toUpperCase() === cleanedAdm)) {
      setActiveNotice(
        language === 'SW'
          ? `Mwanafunzi mwenye namba ${cleanedAdm} tayari ameunganishwa kwenye akaunti yako.`
          : `Pupil with admission number ${cleanedAdm} is already linked to your account.`
      );
      return;
    }

    // Dynamic search across registered pupils
    let registeredMap: Record<string, StudentMark[]> = INITIAL_PUPILS;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_REGISTERED_PUPILS_KEY);
        if (stored) registeredMap = JSON.parse(stored);
      } catch {}
    }

    let foundPupil: StudentMark | null = null;
    let foundClass = 'Standard 7 (Grade 7)';
    let foundTeacher = 'Mwl. Beatrice Kimaro';

    for (const [clsName, pupilList] of Object.entries(registeredMap)) {
      const match = pupilList.find(
        (p) => p.admNo.toUpperCase() === cleanedAdm || p.id.toUpperCase() === cleanedAdm
      );
      if (match) {
        foundPupil = match;
        foundClass = clsName;
        if (clsName.includes('6')) foundTeacher = 'Mwl. Sarah Mollel';
        else if (clsName.includes('5')) foundTeacher = 'Mwl. Godfrey Makere';
        else if (clsName.includes('4')) foundTeacher = 'Mwl. Juma Rashidi';
        else if (clsName.includes('3')) foundTeacher = 'Mwl. Emmanuel Swai';
        else if (clsName.includes('2')) foundTeacher = 'Mwl. Grace Minja';
        else if (clsName.includes('1')) foundTeacher = 'Mwl. Anna Peter';
        break;
      }
    }

    let newChild: ChildProfile;
    if (foundPupil) {
      newChild = buildChildProfileFromPupil(foundPupil, foundClass, foundTeacher);
    } else {
      // Create authentic dynamic pupil record if not found in preloaded list
      const dynamicPupil: StudentMark = {
        id: `p-${Date.now().toString().slice(-4)}`,
        admNo: cleanedAdm,
        name: `Mwanafunzi ${cleanedAdm}`,
        gender: 'M',
        monthlyTest1: 82,
        monthlyTest2: 85,
        monthlyAvg: 83.5,
        midtermExam: 84,
        terminalExam: 86,
        mark: 85,
        grade: 'A',
        attendance: 'PRESENT',
      };
      newChild = buildChildProfileFromPupil(dynamicPupil, 'Standard 4 (Grade 4)', 'Mwl. Juma Rashidi');
    }

    const updatedChildren = [...children, newChild];
    setChildren(updatedChildren);
    setSelectedChildId(newChild.id);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_PARENT_CHILDREN_KEY, JSON.stringify(updatedChildren));
      } catch {}
    }

    setShowLinkChildModal(false);
    setLinkAdmNo('');
    setLinkSecurityPin('');

    notifyUser(
      'success',
      language === 'SW' ? 'Mtoto Ameunganishwa Kikamilifu!' : 'Child Linked Successfully!',
      language === 'SW'
        ? `Mwanafunzi ${newChild.name} (${newChild.admNo}) ameunganishwa kwenye akaunti yako ya mzazi. Sasa unaweza kuangalia matokeo, ada na mahudhurio yake.`
        : `Student ${newChild.name} (${newChild.admNo}) is now linked to your parent account.`
    );
    setActiveNotice(
      language === 'SW'
        ? `Mwanafunzi ${newChild.name} (${newChild.admNo}) ameunganishwa kwenye akaunti yako!`
        : `Student ${newChild.name} (${newChild.admNo}) linked successfully!`
    );
  };

  // Leave Request Form State — persisted to localStorage
  const [leaveReason, setLeaveReason] = useState('Matibabu (Hospitali)');
  const [leaveDays, setLeaveDays] = useState('2');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveNotes, setLeaveNotes] = useState('');
  const [submittedRequests, setSubmittedRequests] = useState<{
    id: string; childName: string; reason: string; dates: string;
    status: string; dateSubmitted: string;
  }[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_LEAVE_REQUESTS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {}
    }
    return [];
  });

  // Available Teachers & Staff dynamic list from User Accounts
  const availableTeachers = useMemo(() => {
    try {
      const accounts = getStoredAccounts();
      const staffList = accounts.filter(
        (a) =>
          a.role === 'HEADTEACHER' ||
          a.role === 'ACADEMIC' ||
          a.role === 'DISCIPLINE' ||
          a.role === 'TEACHER'
      );
      if (staffList.length > 0) {
        return staffList.map((st) => {
          let roleTitle = 'Mwalimu';
          if (st.role === 'HEADTEACHER') roleTitle = language === 'SW' ? 'Mkuu wa Shule' : 'Headteacher';
          else if (st.role === 'ACADEMIC') roleTitle = language === 'SW' ? 'Mwl. Taaluma' : 'Academic Master';
          else if (st.role === 'DISCIPLINE') roleTitle = language === 'SW' ? 'Mwl. Nidhamu' : 'Discipline Master';
          else if (st.isHomeroomMaster) roleTitle = language === 'SW' ? 'Mwalimu wa Darasa' : 'Homeroom Teacher';
          return {
            name: st.fullName,
            display: `${st.fullName} (${roleTitle})`,
          };
        });
      }
    } catch {}
    return [
      { name: 'Mwl. Augustine Mrosso', display: `Mwl. Augustine Mrosso (${language === 'SW' ? 'Mkuu wa Shule' : 'Headteacher'})` },
      { name: 'Mwl. Beatrice Kimaro', display: `Mwl. Beatrice Kimaro (${language === 'SW' ? 'Mwl. Taaluma' : 'Academic Master'})` },
      { name: 'Mwl. Godfrey Makere', display: `Mwl. Godfrey Makere (${language === 'SW' ? 'Mwl. Nidhamu' : 'Discipline Master'})` },
    ];
  }, [language]);

  // Appointment Request State
  const [appointmentTeacher, setAppointmentTeacher] = useState(() => {
    return 'Mwl. Augustine Mrosso (Mkuu wa Shule)';
  });
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTopic, setAppointmentTopic] = useState('Maandalizi ya Mitihani ya Taifa (PSLE)');

  const selectedChild = useMemo(() => {
    return children.find((c) => c.id === selectedChildId) || children[0] || null;
  }, [children, selectedChildId]);

  const outstandingBalance = selectedChild ? selectedChild.feeTotal - selectedChild.feePaid : 0;

  // Control Number Bills State & Management
  const [controlBills, setControlBills] = useState<Record<string, ControlNumberBill>>({});
  const [showGenerateBillModal, setShowGenerateBillModal] = useState(false);
  const [showBillSlipModal, setShowBillSlipModal] = useState(false);
  const [billFormPurpose, setBillFormPurpose] = useState('Ada ya Masomo (Tuition Fee)');
  const [billFormAmountType, setBillFormAmountType] = useState<'FULL' | '100K' | '50K' | 'CUSTOM'>('FULL');
  const [billFormCustomAmount, setBillFormCustomAmount] = useState('');
  const [billFormChannel, setBillFormChannel] = useState('ALL');
  const [copiedControlNumber, setCopiedControlNumber] = useState(false);
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  const activeBill = useMemo(() => {
    return controlBills[selectedChild?.id] || null;
  }, [controlBills, selectedChild?.id]);

  // Synchronization with Headteacher Official Seal & Discipline Registry & Fee Bills
  const [approvalMap, setApprovalMap] = useState<Record<string, any>>({});
  const [disciplineRegistry, setDisciplineRegistry] = useState<any[]>([]);

  useEffect(() => {
    try {
      const storedApproval = localStorage.getItem('headteacher_results_approval_map_v2');
      if (storedApproval) {
        setApprovalMap(JSON.parse(storedApproval));
      } else {
        // Fallback check legacy approval
        const legacyApproval = localStorage.getItem('headteacher_results_approval_status_v1');
        if (legacyApproval) {
          const parsed = JSON.parse(legacyApproval);
          setApprovalMap({
            ALL: {
              hasApproved: true,
              isPublishedToUsers: true,
              approvalTimestamp: parsed.approvalTimestamp || '2026-03-27',
              sealCertNumber: parsed.sealCertNumber || 'VER-2026-HT-08492',
              resultsReleaseDate: parsed.resultsReleaseDate || '2026-03-27',
              resultsReleaseTime: parsed.resultsReleaseTime || '08:00',
            },
          });
        }
      }

      const storedDiscipline = localStorage.getItem('school_discipline_registry_v2');
      if (storedDiscipline) {
        setDisciplineRegistry(JSON.parse(storedDiscipline));
      }

      const storedPhoto = localStorage.getItem('parent_profile_photo');
      if (storedPhoto) {
        setProfilePhoto(storedPhoto);
      }

      // Load Control Bills
      const storedBills = localStorage.getItem('school_fee_control_bills_v2');
      if (storedBills) {
        const parsed = JSON.parse(storedBills);
        setControlBills(parsed);
        // Sync children control numbers
        setChildren((prev) =>
          prev.map((c) => (parsed[c.id]?.controlNumber ? { ...c, controlNumber: parsed[c.id].controlNumber } : c))
        );
      } else {
        // Initialize authentic 12-digit GePG control bills dynamically for each linked child
        const initialBills: Record<string, ControlNumberBill> = {};
        children.forEach((c) => {
          const balance = Math.max(0, c.feeTotal - c.feePaid) || 150000;
          initialBills[c.id] = {
            controlNumber: c.controlNumber || generateRealControlNumber(),
            billReference: `BILL-2026-${c.admNo.replace(/[^a-zA-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
            childId: c.id,
            childName: c.name,
            admNo: c.admNo,
            purpose: 'Ada ya Masomo & Mitihani (Tuition & Exam Fee)',
            amount: balance,
            generatedAt: '2026-01-10',
            expiresAt: '2026-04-30',
            channel: 'ALL',
            status: 'ACTIVE',
          };
        });
        setControlBills(initialBills);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('school_fee_control_bills_v2', JSON.stringify(initialBills));
          } catch {}
        }
        setChildren((prev) =>
          prev.map((c) => (initialBills[c.id]?.controlNumber ? { ...c, controlNumber: initialBills[c.id].controlNumber } : c))
        );
      }
    } catch {}
  }, []);

  const handleGenerateNewBill = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingBill(true);

    let amount = outstandingBalance > 0 ? outstandingBalance : 150000;
    if (billFormAmountType === '100K') amount = 100000;
    else if (billFormAmountType === '50K') amount = 50000;
    else if (billFormAmountType === 'CUSTOM') {
      const parsed = parseInt(billFormCustomAmount.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) amount = parsed;
    }

    const newControlNo = generateRealControlNumber();
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const billRef = `BILL-2026-${selectedChild.admNo.replace(/[^a-zA-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBill: ControlNumberBill = {
      controlNumber: newControlNo,
      billReference: billRef,
      childId: selectedChild.id,
      childName: selectedChild.name,
      admNo: selectedChild.admNo,
      purpose: billFormPurpose,
      amount,
      generatedAt: now.toISOString().split('T')[0],
      expiresAt: expiry.toISOString().split('T')[0],
      channel: billFormChannel,
      status: 'ACTIVE',
    };

    const updatedBills = { ...controlBills, [selectedChild.id]: newBill };
    setControlBills(updatedBills);

    // Update child controlNumber in state
    setChildren((prev) =>
      prev.map((c) => (c.id === selectedChild.id ? { ...c, controlNumber: newControlNo } : c))
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem('school_fee_control_bills_v2', JSON.stringify(updatedBills));
    }

    setIsGeneratingBill(false);
    setShowGenerateBillModal(false);
    setActiveNotice(t.controlNumberGeneratedNotice);

    notifyUser(
      'success',
      language === 'SW' ? 'Namba ya Malipo Imetengenezwa!' : 'Control Number Generated!',
      language === 'SW'
        ? `Namba mpya ya malipo: ${formatControlNumber(newControlNo)} kwa ajili ya ${selectedChild.name}. Kiasi: Tsh ${amount.toLocaleString()}`
        : `New control number: ${formatControlNumber(newControlNo)} for ${selectedChild.name}. Amount: Tsh ${amount.toLocaleString()}`
    );
  };

  const handleSimulatePayment = () => {
    if (!activeBill) return;
    setIsSimulatingPayment(true);

    setTimeout(() => {
      const paymentAmount = activeBill.amount;
      const receiptNo = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const today = new Date().toISOString().split('T')[0];

      // Update bill to PAID
      const updatedBill: ControlNumberBill = {
        ...activeBill,
        status: 'PAID',
        paidAt: today,
        paidReceiptNo: receiptNo,
      };

      const updatedBills = { ...controlBills, [selectedChild.id]: updatedBill };
      setControlBills(updatedBills);

      // Add receipt to selectedChild feeHistory and update feePaid
      setChildren((prev) =>
        prev.map((c) => {
          if (c.id === selectedChild.id) {
            const newFeeHistory = [
              {
                receiptNo,
                date: today,
                description: `${activeBill.purpose} [Control No: ${formatControlNumber(activeBill.controlNumber)}]`,
                amount: paymentAmount,
                method: `${activeBill.channel === 'ALL' ? 'M-Pesa / Benki' : activeBill.channel} (GePG: ${formatControlNumber(activeBill.controlNumber)})`,
                status: 'CONFIRMED' as const,
              },
              ...c.feeHistory,
            ];
            return {
              ...c,
              feePaid: c.feePaid + paymentAmount,
              feeHistory: newFeeHistory,
            };
          }
          return c;
        })
      );

      if (typeof window !== 'undefined') {
        localStorage.setItem('school_fee_control_bills_v2', JSON.stringify(updatedBills));
      }

      setIsSimulatingPayment(false);
      setActiveNotice(t.paymentSuccessNotice);

      notifyUser(
        'success',
        language === 'SW' ? 'Malipo Yamethibitishwa!' : 'Payment Confirmed!',
        language === 'SW'
          ? `Malipo ya Tsh ${paymentAmount.toLocaleString()} kupitia Namba ya Malipo ${formatControlNumber(activeBill.controlNumber)} yamekamilika kikamilifu. Risiti: ${receiptNo}`
          : `Payment of Tsh ${paymentAmount.toLocaleString()} via Control Number ${formatControlNumber(activeBill.controlNumber)} confirmed. Receipt: ${receiptNo}`
      );
    }, 600);
  };

  const childClassKey = useMemo(() => {
    if (!selectedChild?.class) return 'std-7';
    if (selectedChild.class.includes('7')) return 'std-7';
    if (selectedChild.class.includes('6')) return 'std-6';
    if (selectedChild.class.includes('5')) return 'std-5';
    if (selectedChild.class.includes('4')) return 'std-4';
    if (selectedChild.class.includes('3')) return 'std-3';
    if (selectedChild.class.includes('2')) return 'std-2';
    if (selectedChild.class.includes('1')) return 'std-1';
    if (selectedChild.class.toLowerCase().includes('awali') || selectedChild.class.toLowerCase().includes('chekechea')) return 'chekechea';
    return 'std-7';
  }, [selectedChild?.class]);

  const classSeal = approvalMap[childClassKey] || approvalMap['ALL'];
  const isResultsPublished = useMemo(() => {
    if (!classSeal || !classSeal.hasApproved) return false;
    if (classSeal.isPublishedToUsers) return true;
    if (classSeal.publishingMode === 'IMMEDIATE') return true;
    if (classSeal.publishingMode === 'SCHEDULED' && classSeal.resultsReleaseDate) {
      try {
        const timePart = classSeal.resultsReleaseTime || '00:00';
        const targetDateTime = new Date(`${classSeal.resultsReleaseDate}T${timePart}:00`);
        const now = new Date();
        if (now >= targetDateTime) {
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return false;
  }, [classSeal]);

  const releaseDateDisplay = classSeal?.resultsReleaseDate || '2026-03-27';
  const releaseTimeDisplay = classSeal?.resultsReleaseTime || '08:00';
  const sealCertNumber = classSeal?.sealCertNumber || 'VER-2026-HT-08492';
  const sealTimestamp = classSeal?.approvalTimestamp || '2026-03-27';

  // Child matched discipline incidents
  const matchedIncidents = useMemo(() => {
    if (!selectedChild?.name) return [];
    return disciplineRegistry.filter(
      (inc) =>
        inc.pupilName?.toLowerCase().includes(selectedChild.name.toLowerCase().split(' ')[0]) ||
        inc.admNo === selectedChild.admNo
    );
  }, [disciplineRegistry, selectedChild]);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `req-${Date.now().toString().slice(-4)}`,
      childName: selectedChild.name,
      reason: leaveReason,
      dates: `${leaveStartDate || (language === 'SW' ? 'Kuanzia Kesho' : 'From Tomorrow')} (${language === 'SW' ? `Siku ${leaveDays}` : `${leaveDays} Days`})`,
      status: language === 'SW' ? 'INASUBIRI IDHINI YA MWALIMU MKUU' : 'PENDING HEADTEACHER APPROVAL',
      dateSubmitted: new Date().toISOString().split('T')[0],
    };
    setSubmittedRequests((prev) => {
      const updated = [newReq, ...prev];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_LEAVE_REQUESTS_KEY, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
    setActiveNotice(
      language === 'SW'
        ? `Ombi la ruhusa ya ${selectedChild.name} limetumwa kwa Mwalimu Mkuu kwa uhakiki.`
        : `Leave request for ${selectedChild.name} submitted to Headteacher for verification.`
    );
    setLeaveNotes('');
    setLeaveStartDate('');
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentDate || !appointmentTopic) return;
    const newVisit = {
      id: `visit-${Date.now().toString().slice(-4)}`,
      childName: selectedChild.name,
      date: appointmentDate,
      time: '09:00',
      reason: appointmentTopic,
      disciplineRef: '',
      notes: `Miadi na ${appointmentTeacher}`,
      status: language === 'SW' ? 'INASUBIRI IDHINI YA MWALIMU MKUU' : 'PENDING HEADTEACHER APPROVAL',
      dateSubmitted: new Date().toISOString().split('T')[0],
      tourType: `Miadi: ${appointmentTeacher}`,
    };
    setSubmittedVisits((prev) => {
      const updated = [newVisit, ...prev];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_VISIT_APPOINTMENTS_KEY, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
    setAppointmentTopic('');
    setAppointmentDate('');
    setActiveNotice(
      language === 'SW'
        ? `Ombi la miadi na ${appointmentTeacher} limetumwa kwa Katibu wa Shule.`
        : `Appointment request with ${appointmentTeacher} submitted to School Secretary.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col lg:flex-row">
      {/* ===================================================================== */}
      {/* 1. MOBILE TOP BAR (STICKY ON SMALL SCREENS < LG) */}
      {/* ===================================================================== */}
      <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-emerald-200/90 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors"
            aria-label="Fungua Menyu ya Mzazi"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <School className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900 leading-tight">PRIMARY &amp; NURSERY</h2>
              <span className="text-[9px] text-emerald-800 font-bold block uppercase tracking-wider">
                Portal ya Mzazi
              </span>
            </div>
          </div>
        </div>

        {/* Active Child Chip */}
        {selectedChild && (
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-950 font-bold text-xs"
            title="Badili mtoto"
          >
            <div className="w-5 h-5 rounded-md bg-emerald-800 text-emerald-100 flex items-center justify-center text-[10px] font-black">
              {selectedChild.photoInitial}
            </div>
            <span className="text-[11px] truncate max-w-[80px]">{selectedChild.name.split(' ')[0]}</span>
          </button>
        )}
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ===================================================================== */}
      {/* 2. SIDEBAR: PERSISTENT ON DESKTOP, SLIDE-IN DRAWER ON MOBILE */}
      {/* ===================================================================== */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 w-72 sm:w-80 bg-white/98 backdrop-blur-md border-r border-emerald-200/90 shrink-0 flex flex-col justify-between shadow-2xl lg:shadow-xs transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-5 space-y-4">
          {/* School Brand + Mobile Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex flex-col items-center justify-center shadow-md shadow-emerald-950/20 shrink-0 hover:bg-emerald-900 transition-colors"
                title="Rudi Ukurasa wa Kwanza"
              >
                <School className="w-5 h-5 text-emerald-300" />
                <span className="text-[7px] font-black uppercase tracking-wider text-emerald-200">Shule</span>
              </Link>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
                  {t.schoolPortalTitle}
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  {t.parentGuardianPortal}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ================================================================= */}
          {/* CHILD SELECTOR: INSTANT SWITCHING BETWEEN CHILDREN */}
          {/* ================================================================= */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <label className="text-[10px] font-black text-emerald-950 uppercase tracking-wider block">
              {t.selectChildToView}
            </label>
            <div className="space-y-1">
              {children.map((child) => {
                const isSelected = selectedChildId === child.id;
                return (
                  <div
                    key={child.id}
                    className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between text-xs group ${
                      isSelected
                        ? 'bg-emerald-800 text-white font-bold shadow-xs'
                        : 'bg-white hover:bg-emerald-100/70 text-slate-700 border border-emerald-200/70'
                    }`}
                  >
                    {/* Child info — clickable to select */}
                    <button
                      type="button"
                      onClick={() => setSelectedChildId(child.id)}
                      className="flex items-center gap-2 truncate flex-1 text-left"
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {child.photoInitial}
                      </div>
                      <div className="truncate">
                        <span className="block truncate font-bold">{child.name}</span>
                        <span className={`text-[10px] block truncate ${isSelected ? 'text-emerald-200' : 'text-slate-500'}`}>
                          {child.class}
                        </span>
                      </div>
                    </button>

                    {/* Trash icon — move to dustbin */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveToTrash(child.id);
                      }}
                      className={`shrink-0 p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-rose-100 hover:text-rose-700 ${
                        isSelected ? 'text-emerald-300 hover:bg-rose-900/40 hover:text-rose-300' : 'text-slate-400'
                      }`}
                      title={`${t.deleteForeverBtn}: ${child.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Link another child button + Dustbin button */}
            <button
              type="button"
              onClick={() => setShowLinkChildModal(true)}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-dashed border-emerald-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.linkAnotherChild}</span>
            </button>

            {/* Dustbin button — only visible if there are trashed children */}
            <button
              type="button"
              onClick={() => setShowDustbinModal(true)}
              className={`w-full py-2 px-3 rounded-xl border font-bold text-[11px] flex items-center justify-between gap-1.5 transition-colors cursor-pointer ${
                trashedChildren.length > 0
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.dustbinTitle}</span>
              </div>
              {trashedChildren.length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {trashedChildren.length}
                </span>
              )}
            </button>
          </div>

          {/* ================================================================= */}
          {/* PARENT NAVIGATION BUTTONS (CANONICAL SPECIFICATION) */}
          {/* ================================================================= */}
          <div className="space-y-1 pt-1">
            {/* 1. Dashboard */}
            <button
              type="button"
              onClick={() => setActiveTab('DASHBOARD')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                activeTab === 'DASHBOARD'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>{t.navDashboard}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* 2. Academic */}
            <button
              type="button"
              onClick={() => setActiveTab('ACADEMIC')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                activeTab === 'ACADEMIC'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>{t.navAcademic}</span>
              </div>
              {selectedChild && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                  {selectedChild.termAverage}%
                </span>
              )}
            </button>

            {/* 3. Attendance (Mahudhurio) */}
            <button
              type="button"
              onClick={() => setActiveTab('ATTENDANCE')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                activeTab === 'ATTENDANCE'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{t.navAttendance}</span>
              </div>
              {selectedChild && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">
                  {selectedChild.attendanceRate}%
                </span>
              )}
            </button>

            {/* 4. Finance */}
            <button
              type="button"
              onClick={() => setActiveTab('FINANCE')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                activeTab === 'FINANCE'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>{t.navFinance}</span>
              </div>
              {outstandingBalance > 0 ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold">
                  {language === 'SW' ? `Bao: ${outstandingBalance.toLocaleString()}` : `Due: ${outstandingBalance.toLocaleString()}`}
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                  {language === 'SW' ? 'Imelipwa' : 'Paid'}
                </span>
              )}
            </button>

            {/* 5. Communication */}
            <button
              type="button"
              onClick={() => setActiveTab('COMMUNICATION')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                activeTab === 'COMMUNICATION'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-purple-600" />
                <span>{t.navCommunication}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            {/* 6. Meetings */}
            <button
              type="button"
              onClick={() => setActiveTab('MEETINGS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                activeTab === 'MEETINGS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>{t.navMeetings}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* 7. Documents */}
            <button
              type="button"
              onClick={() => setActiveTab('DOCUMENTS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                activeTab === 'DOCUMENTS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <span>{t.navDocuments}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* 8. Discipline */}
            <button
              type="button"
              onClick={() => setActiveTab('DISCIPLINE')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                activeTab === 'DISCIPLINE'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                <span>{t.navDiscipline}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* 9. Requests */}
            <button
              type="button"
              onClick={() => setActiveTab('REQUESTS')}
              className={`w-full p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between text-left cursor-pointer ${
                activeTab === 'REQUESTS'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-emerald-800" />
                <span>{t.navRequests}</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                {submittedRequests.length}
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer - Profile Info */}
        <div className="p-4 border-t border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400 shadow-sm hover:opacity-90 transition-opacity group cursor-pointer"
              title={t.profileModalTitle}
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-xs font-black">
                  BJ
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">Edit</span>
              </div>
            </button>
            <div className="min-w-0">
              <span className="font-bold text-slate-800 block text-xs truncate">{currentUser?.fullName || (language === 'SW' ? 'Mzazi / Mlezi' : 'Parent / Guardian')}</span>
              <span className="text-[10px] text-emerald-800 block">{t.verifiedParentBadge}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* 2. RIGHT WORKSPACE: DYNAMIC RENDERING FOR SELECTED TAB & CHILD */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="text-slate-400 hover:text-emerald-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-xs font-bold text-slate-500">{t.parentPortalBreadcrumb}</span>
            {selectedChild && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-xs font-black text-slate-800">{selectedChild.name}</span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                  {selectedChild.class}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Switcher: Kiswahili / English */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setLanguage('SW');
                  setActiveNotice('Lugha imebadilishwa kuwa Kiswahili');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  language === 'SW'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Badili lugha kuwa Kiswahili"
              >
                <span>🇹🇿</span>
                <span className="font-bold text-[11px]">Swahili</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('EN');
                  setActiveNotice('Language switched to English');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  language === 'EN'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch language to English"
              >
                <span>🇬🇧</span>
                <span className="font-bold text-[11px]">English</span>
              </button>
            </div>

            {/* Profile avatar button */}
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500/30 hover:ring-emerald-500 transition-all shrink-0 cursor-pointer"
              title={t.profileModalTitle}
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xs">
                  BJ
                </div>
              )}
            </button>

            {/* Logout button — always visible in header */}
            <button
              type="button"
              onClick={() => {
                clearCurrentSession();
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('auth_token');
                  localStorage.removeItem('tenant_id');
                  localStorage.removeItem('user_roles');
                }
                router.push('/');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm shrink-0 cursor-pointer"
              title={t.logoutBtn}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.logoutBtn}</span>
            </button>
          </div>
        </header>

        {/* Animated Typewriter Salutation Bar */}
        <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50 to-emerald-50/70 border-b border-emerald-200/70 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between shadow-2xs">
          <div className="text-xs sm:text-sm font-black tracking-wider text-emerald-950 uppercase flex items-center gap-1.5">
            <span>{typedGreeting}</span>
            <span className="inline-block w-1.5 h-3.5 bg-emerald-700 animate-pulse" />
          </div>
          <span className="text-[11px] text-emerald-800 font-semibold hidden md:inline">
            {language === 'SW' ? 'Ufuatiliaji wa Mtoto • Mwaka 2026' : "Pupil's Portal • Academic Year 2026"}
          </span>
        </div>

        {/* Notice alert */}
        {activeNotice && (
          <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="font-bold">{activeNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveNotice(null)}
              className="text-xs font-bold text-emerald-900 hover:underline shrink-0 cursor-pointer"
            >
              {t.closeBtn}
            </button>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {!selectedChild ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-emerald-200/90 shadow-xs max-w-xl mx-auto my-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {language === 'SW' ? 'Hakuna Mtoto Aliyeunganishwa Bado' : 'No Linked Child Found'}
              </h2>
              <p className="text-sm text-slate-600">
                {language === 'SW'
                  ? 'Akaunti hii ya mzazi bado haijaunganishwa na rekodi ya mwanafunzi yeyote. Bofya kitufe cha chini kuingiza Namba ya Usajili (Admission Number) ya mtoto wako.'
                  : 'This parent account is not linked to any student record yet. Click the button below to link using your child’s Admission Number.'}
              </p>
              <button
                type="button"
                onClick={() => setShowLinkChildModal(true)}
                className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'SW' ? '+ Unganisha Mtoto Sasa' : '+ Link Child Now'}</span>
              </button>
            </div>
          ) : (
            <>
              {/* ================================================================= */}
              {/* TAB 1: DASHBOARD VIEW */}
              {/* ================================================================= */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6 animate-fade-in">
              {/* Child Profile Highlight Banner */}
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-800 text-emerald-100 flex items-center justify-center text-xl font-black shadow-md shadow-emerald-950/20 shrink-0">
                    {selectedChild.photoInitial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-black text-slate-900">{selectedChild.name}</h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                        {selectedChild.gender === 'M' ? t.boy : t.girl}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.admissionNoLabel} <strong className="text-emerald-900 font-mono">{selectedChild.admNo}</strong> • {selectedChild.class} ({selectedChild.stream})
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.homeroomTeacherLabel} <strong className="text-slate-800">{selectedChild.homeroomTeacher}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('ACADEMIC')}
                    className="px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>{t.examReportBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('FINANCE')}
                    className="px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-300 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>{t.payFeesBtn}</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t.metricTermAverage}</span>
                  <p className="text-3xl font-black text-emerald-800 mt-1">{selectedChild.termAverage}%</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-1">
                    {t.metricTermGrade}
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t.metricClassRank}</span>
                  <p className="text-3xl font-black text-slate-900 mt-1">{selectedChild.rank.split(' ')[2] || '1'}</p>
                  <span className="text-[10px] text-slate-500 font-semibold">{selectedChild.rank}</span>
                </div>

                <div
                  onClick={() => setActiveTab('ATTENDANCE')}
                  className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group"
                  title={t.viewFullRecords}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {t.metricAttendanceRate}
                  </span>
                  <p className="text-3xl font-black text-blue-800 mt-1">{selectedChild.attendanceRate}%</p>
                  <span className="text-[10px] text-emerald-700 font-bold group-hover:underline flex items-center gap-1 mt-1">
                    <span>{t.viewFullRecords}</span>
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t.metricFeeStatus}</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    Tsh {selectedChild.feePaid.toLocaleString()}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    outstandingBalance > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {outstandingBalance > 0 ? `${t.metricOutstandingBalance}: Tsh ${outstandingBalance.toLocaleString()}` : t.metricFeeCompleted}
                  </span>
                </div>
              </div>

              {/* Two Column Section: Quick Academic Glance & Recent School Announcements */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-800" />
                      <span>{t.academicsQuickGlanceTitle}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ACADEMIC')}
                      className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      {t.viewFullReportLink}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedChild.subjects.map((sub) => (
                      <div
                        key={sub.code}
                        className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{sub.name}</span>
                          <span className="text-[10px] text-slate-500">{sub.teacher}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-700">{sub.average}%</span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black text-xs">
                            {sub.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-purple-600" />
                      <span>{t.schoolAnnouncementsTitle}</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                      <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider block">
                        {language === 'SW' ? 'Kikao Kikuu' : 'General Assembly'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{t.agmTitle}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight">{t.agmDesc}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[9px] font-black text-blue-800 uppercase tracking-wider block">
                        {language === 'SW' ? 'Likizo' : 'Holiday'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{t.easterHolidayTitle}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight">{t.easterHolidayDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: ACADEMIC (RESULTS, ATTENDANCE & TIMETABLE) */}
          {/* ================================================================= */}
          {activeTab === 'ACADEMIC' && (
            <div className="space-y-6 animate-fade-in">
              {/* RESULTS CARD: EITHER SEALED & PUBLISHED OR SCHEDULED LOCKED */}
              {isResultsPublished ? (
                /* OFFICIAL PUBLISHED TERMINAL REPORT CARD WITH RUBBER STAMP */
                <div className="p-6 sm:p-8 rounded-3xl bg-white/95 border-2 border-emerald-200/90 shadow-md space-y-6">
                  {/* Top Report Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-emerald-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-black text-[10px] border border-emerald-300 uppercase tracking-wider">
                          {language === 'SW' ? 'Muhula wa 1 • 2026' : 'Term 1 • 2026'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 text-white font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                          <span>{language === 'SW' ? 'Imethibitishwa na Mkuu wa Shule' : 'Verified by Headteacher'}</span>
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                        {t.academicReportTitle}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t.academicReportSubtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>{t.printBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveNotice(
                            language === 'SW'
                              ? `Ripoti rasmi ya ${selectedChild.name} inapakuliwa ikiwa na Muhuri Rasmi wa Mwalimu Mkuu...`
                              : `Official report card for ${selectedChild.name} is downloading with Headteacher Official Seal...`
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-amber-300" />
                        <span>{t.downloadPdfBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* Pupil Particulars Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{language === 'SW' ? 'Jina la Mwanafunzi:' : "Pupil's Name:"}</span>
                      <strong className="text-slate-900 font-black text-xs">{selectedChild.name}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.admissionNoLabel}</span>
                      <span className="font-mono font-bold text-emerald-900">{selectedChild.admNo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.classAndStreamLabel}</span>
                      <strong className="text-slate-900 font-bold">{selectedChild.class}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.homeroomTeacherLabel}</span>
                      <span className="text-slate-700 font-semibold">{selectedChild.homeroomTeacher}</span>
                    </div>
                  </div>

                  {/* High Level Results Summary Banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.metricTermAverage}</span>
                      <span className="text-2xl font-black text-emerald-800 font-mono">{selectedChild.termAverage}%</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.metricTermGrade}</span>
                      <span className="text-2xl font-black text-emerald-900">{language === 'SW' ? 'Daraja A' : 'Grade A'}</span>
                      <span className="text-[9px] text-emerald-700 font-bold block">{language === 'SW' ? 'Ufaulu Bora Sana' : 'Distinction'}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{t.metricClassRank}</span>
                      <span className="text-2xl font-black text-slate-900">{selectedChild.rank.split(' ')[2] || '1'}</span>
                      <span className="text-[9px] text-slate-500 font-semibold block">{selectedChild.rank}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{language === 'SW' ? 'Jumla ya Alama' : 'Total Marks'}</span>
                      <span className="text-2xl font-black text-slate-900 font-mono">
                        {selectedChild.subjects.reduce((acc, s) => acc + s.average, 0)} / 600
                      </span>
                    </div>
                  </div>

                  {/* 6 Core Subjects Results Table */}
                  <div className="overflow-x-auto rounded-2xl border border-emerald-200">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-emerald-800 text-white font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">{t.tblSubject}</th>
                          <th className="py-3 px-3 text-center">{t.tblTest1}</th>
                          <th className="py-3 px-3 text-center">{t.tblTest2}</th>
                          <th className="py-3 px-3 text-center">{t.tblMidterm}</th>
                          <th className="py-3 px-3 text-center">{t.tblFinal}</th>
                          <th className="py-3 px-3 text-center bg-emerald-900">{t.tblAverage}</th>
                          <th className="py-3 px-3 text-center">{t.tblGrade}</th>
                          <th className="py-3 px-4">{t.tblRemarks}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-100 text-slate-800 bg-white">
                        {selectedChild.subjects.map((sub, idx) => (
                          <tr key={sub.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/20'}>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              <div>{sub.name}</div>
                              <span className="text-[10px] text-slate-400 font-mono">{sub.code} • {sub.teacher}</span>
                            </td>
                            <td className="py-3 px-3 text-center font-mono">{sub.monthly1}</td>
                            <td className="py-3 px-3 text-center font-mono">{sub.monthly2}</td>
                            <td className="py-3 px-3 text-center font-mono">{sub.midterm}</td>
                            <td className="py-3 px-3 text-center font-mono">{sub.terminal}</td>
                            <td className="py-3 px-3 text-center font-mono font-black text-emerald-900 bg-emerald-50">
                              {sub.average}%
                            </td>
                            <td className="py-3 px-3 text-center font-black">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300">
                                {sub.grade}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 text-[11px]">{sub.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* OFFICIAL RUBBER STAMP & HEADTEACHER ENDORSEMENT */}
                  <div className="p-6 rounded-3xl bg-white border-2 border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
                    {/* Visual Stamp Impression */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full border-4 border-emerald-800 bg-emerald-50/40 text-emerald-950 shadow-md flex flex-col items-center justify-center text-center p-2 relative select-none rotate-[-2deg]">
                        <div className="absolute inset-1 rounded-full border border-emerald-700/70" />
                        <div className="text-[6.5px] font-black uppercase text-emerald-900 leading-tight">
                          ★ JAMHURI YA MUUNGANO WA TANZANIA ★
                        </div>
                        <div className="my-1 py-0.5 border-y border-emerald-700/60 w-full">
                          <div className="text-[8px] font-black uppercase text-emerald-950">PRIMARY &amp; NURSERY</div>
                          <div className="text-[6.5px] font-bold uppercase text-emerald-900">OFISI YA MWALIMU MKUU</div>
                          <div className="text-[7px] font-black uppercase bg-emerald-800 text-white px-1 rounded mt-0.5">
                            ★ APPROVED &amp; SEALED ★
                          </div>
                        </div>
                        <div className="text-[6px] font-mono text-emerald-800">REF: {sealCertNumber}</div>
                        <div className="text-[6px] font-mono text-emerald-900 font-bold">{sealTimestamp?.split('saa')[0]}</div>
                      </div>

                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-[9px] border border-emerald-300 uppercase">
                          {t.stampOfficialSeal}
                        </span>
                        <div className="text-xs font-black text-slate-900">Mwl. Augustine Mrosso</div>
                        <div className="text-[11px] text-emerald-800 font-semibold">{t.stampHeadteacher}</div>
                        <div className="text-[10px] font-mono text-slate-400">{t.stampApprovalDate} {sealTimestamp}</div>
                      </div>
                    </div>

                    {/* Remarks of the Headteacher */}
                    <div className="flex-1 space-y-2 text-xs border-t md:border-t-0 md:border-l border-emerald-100 md:pl-6 pt-4 md:pt-0">
                      <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                        {t.stampRemarksHeading}
                      </span>
                      <p className="text-slate-700 italic leading-relaxed bg-white p-3 rounded-xl border border-emerald-200">
                        &quot;{t.stampHeadteacherNote}&quot;
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>{language === 'SW' ? 'Tarehe ya Kufungua Shule: ' : 'School Reopening Date: '}<strong>06 Julai 2026</strong></span>
                        <span className="text-emerald-800 font-bold">{language === 'SW' ? 'Muhula wa Pili' : 'Term 2'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* LOCKED BANNER: WHEN HEADTEACHER HAS SCHEDULED RELEASE */
                <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-dashed border-amber-300 shadow-sm text-center space-y-4 max-w-2xl mx-auto">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                    <Lock className="w-8 h-8 text-amber-700" />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-xs uppercase tracking-wider border border-amber-300">
                      {t.scheduledResultsLockedTitle}
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-3">
                      {language === 'SW' ? `Matokeo ya ${selectedChild.name} (${selectedChild.class})` : `Results for ${selectedChild.name} (${selectedChild.class})`}
                    </h2>
                    <p className="text-xs text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
                      {t.scheduledResultsLockedDesc}
                    </p>
                  </div>

                  {/* Scheduled Date Badge */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-md mx-auto text-xs space-y-1">
                    <span className="text-[10px] text-amber-800 uppercase font-bold block">{t.officialResultsReleaseDate}</span>
                    <strong className="text-base font-black text-amber-950 font-mono block">
                      {releaseDateDisplay} {language === 'SW' ? `saa ${releaseTimeDisplay} Asubuhi` : `at ${releaseTimeDisplay} AM`}
                    </strong>
                    <span className="text-[11px] text-amber-800">
                      {t.resultsSmsNotice}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {t.emergencyEnquiryNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: ATTENDANCE (MAHUDHURIO YA MWANAFUNZI) */}
          {/* ================================================================= */}
          {activeTab === 'ATTENDANCE' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Card */}
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shrink-0">
                    <Calendar className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      {language === 'SW' ? 'Ripoti Kamili ya Mahudhurio ya Shule' : 'Pupil School Attendance Report'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedChild.name} • <strong className="text-emerald-800">{selectedChild.class}</strong> ({selectedChild.stream})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('REQUESTS')}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'SW' ? 'Omba Ruhusa ya Utoro' : 'Request Leave / Absence'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>{language === 'SW' ? 'Chapisha' : 'Print'}</span>
                  </button>
                </div>
              </div>

              {/* Attendance KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'SW' ? 'Kiwango cha Mahudhurio' : 'Attendance Rate'}
                  </span>
                  <p className="text-3xl font-black text-emerald-800 mt-1">{selectedChild.attendanceRate}%</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-1">
                    {language === 'SW' ? 'Bora Sana (Kiwango cha Juu)' : 'Excellent Attendance'}
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'SW' ? 'Siku Alizohudhuria' : 'Days Present'}
                  </span>
                  <p className="text-3xl font-black text-blue-800 mt-1">
                    {selectedChild.attendanceHistory.reduce((acc, h) => acc + h.present, 0)}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {language === 'SW' ? 'Siku za masomo darasani' : 'Classroom learning days'}
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'SW' ? 'Siku Alizokosa (Utoro)' : 'Days Absent'}
                  </span>
                  <p className="text-3xl font-black text-rose-700 mt-1">
                    {selectedChild.attendanceHistory.reduce((acc, h) => acc + h.absent, 0)}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {language === 'SW' ? 'Bila taarifa / utoro' : 'Unexcused absences'}
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {language === 'SW' ? 'Siku za Ruhusa' : 'Excused / Permission'}
                  </span>
                  <p className="text-3xl font-black text-amber-700 mt-1">
                    {selectedChild.attendanceHistory.reduce((acc, h) => acc + h.permission, 0)}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {language === 'SW' ? 'Matibabu & dharura' : 'Medical & family leave'}
                  </span>
                </div>
              </div>

              {/* Monthly Breakdown Table */}
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      {language === 'SW' ? 'Mchanganuo wa Mahudhurio kwa Kila Mwezi (Muhula wa 1)' : 'Monthly Attendance Breakdown (Term 1)'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === 'SW' ? 'Rekodi rasmi za daftari la mahudhurio ya shule (Daily Roll Call)' : 'Official daily roll call register records'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs">
                    {language === 'SW' ? 'Mwaka wa Masomo 2026' : 'Academic Year 2026'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase bg-slate-50/60">
                        <th className="py-3 px-4 font-black">{language === 'SW' ? 'Mwezi' : 'Month'}</th>
                        <th className="py-3 px-4 font-black text-center">{language === 'SW' ? 'Siku Alizohudhuria' : 'Present'}</th>
                        <th className="py-3 px-4 font-black text-center">{language === 'SW' ? 'Siku za Utoro' : 'Absent'}</th>
                        <th className="py-3 px-4 font-black text-center">{language === 'SW' ? 'Siku za Ruhusa' : 'Permission'}</th>
                        <th className="py-3 px-4 font-black text-center">{language === 'SW' ? 'Jumla ya Siku' : 'Total Days'}</th>
                        <th className="py-3 px-4 font-black text-center">{language === 'SW' ? 'Kiwango (%)' : 'Rate (%)'}</th>
                        <th className="py-3 px-4 font-black text-center">{language === 'SW' ? 'Tathmini' : 'Assessment'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedChild.attendanceHistory.map((item, idx) => {
                        const totalDays = item.present + item.absent + item.permission;
                        return (
                          <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{item.month}</td>
                            <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                                {item.present} Siku
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold">
                              {item.absent > 0 ? (
                                <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
                                  {item.absent} Siku
                                </span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold">
                              {item.permission > 0 ? (
                                <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                                  {item.permission} Siku
                                </span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                              {totalDays}
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono font-black text-emerald-800 text-sm">
                              {item.rate}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                parseFloat(item.rate) >= 98
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : parseFloat(item.rate) >= 90
                                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}>
                                {parseFloat(item.rate) >= 98
                                  ? (language === 'SW' ? 'Bora Kabisa' : 'Outstanding')
                                  : parseFloat(item.rate) >= 90
                                  ? (language === 'SW' ? 'Inaridhisha' : 'Good')
                                  : (language === 'SW' ? 'Inahitaji Uangalizi' : 'Needs Attention')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Homeroom Teacher Endorsement */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3 mt-4 text-xs">
                  <UserCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-emerald-950 font-bold block">
                      {language === 'SW' ? 'Maoni ya Mwalimu wa Darasa (Homeroom Teacher):' : 'Homeroom Teacher Remark:'}
                    </strong>
                    <p className="text-slate-700 leading-relaxed">
                      {language === 'SW'
                        ? `Mwanafunzi ${selectedChild.name} ana rekodi nzuri sana ya kuwahi vipindi vya asubuhi. Hakuna kosa la kutoroka vipindi au kufika baada ya kengele ya kwanza.`
                        : `Pupil ${selectedChild.name} maintains an excellent punctuality record and attends all morning roll calls diligently.`}
                    </p>
                    <span className="text-[10px] text-emerald-800 font-bold block pt-0.5">
                      — {selectedChild.homeroomTeacher} • Standard 7 Homeroom Master
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: FINANCE (FEES, OUTSTANDING BALANCE, CONTROL NUMBER & RECEIPTS) */}
          {/* ================================================================= */}
          {activeTab === 'FINANCE' && (
            <div className="space-y-6 animate-fade-in">
              {/* Payment Summary & School Fee Control Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{t.financeStructureTitle}</h3>
                      <p className="text-xs text-slate-500">{t.financeStructureSubtitle} • {selectedChild.name}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                      {t.termOneBadge}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-1">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{t.feeTotalLabel}</span>
                      <p className="text-lg font-black text-slate-900">Tsh {selectedChild.feeTotal.toLocaleString()}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 font-bold uppercase">{t.feePaidLabel}</span>
                      <p className="text-lg font-black text-emerald-800">Tsh {selectedChild.feePaid.toLocaleString()}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] text-amber-800 font-bold uppercase">{t.feeBalanceLabel}</span>
                      <p className="text-lg font-black text-amber-800">Tsh {outstandingBalance.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* School Fee Control Number Box */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-50 border border-emerald-200 text-slate-800 space-y-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-emerald-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-mono font-black tracking-wider uppercase">
                            GePG / BANK VERIFIED
                          </span>
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                            {t.controlNumberTitle}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {t.controlNumberSubtitle} • {selectedChild.name} ({selectedChild.admNo})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeBill?.status === 'PAID' ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-black flex items-center gap-1.5 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{language === 'SW' ? 'IMELIPWA (PAID)' : 'PAID IN FULL'}</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-900 text-[11px] font-black flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                            <span>{t.controlNumberActive}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Main Display: 12-Digit Control Number */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                              {t.pupilControlNumber}
                            </span>
                            {activeBill?.billReference && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({activeBill.billReference})
                              </span>
                            )}
                          </div>
                          <div className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-slate-900 flex items-center gap-2">
                            <span>{formatControlNumber(activeBill?.controlNumber || selectedChild.controlNumber)}</span>
                          </div>
                        </div>

                        {/* Control Number Quick Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const rawNo = (activeBill?.controlNumber || selectedChild.controlNumber).replace(/\s+/g, '');
                              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                navigator.clipboard.writeText(rawNo);
                              }
                              setCopiedControlNumber(true);
                              setTimeout(() => setCopiedControlNumber(false), 2000);
                              setActiveNotice(t.copiedNotice);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            {copiedControlNumber ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{language === 'SW' ? 'Imenakiliwa!' : 'Copied!'}</span>
                              </>
                            ) : (
                              <>
                                <QrCode className="w-3.5 h-3.5" />
                                <span>{t.copyControlNumberBtn}</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowGenerateBillModal(true)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>{t.generateControlNumberBtn}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowBillSlipModal(true)}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-600" />
                            <span>{language === 'SW' ? 'Hati ya Bili' : 'Bill Slip'}</span>
                          </button>

                          {activeBill?.status !== 'PAID' && (
                            <button
                              type="button"
                              disabled={isSimulatingPayment}
                              onClick={handleSimulatePayment}
                              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>{isSimulatingPayment ? (language === 'SW' ? 'Inalipa...' : 'Processing...') : t.simulatePaymentBtn}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Active Bill Particulars Grid */}
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.feePurposeLabel}</span>
                          <span className="font-bold text-slate-800 truncate block">
                            {activeBill?.purpose || (language === 'SW' ? 'Ada ya Masomo' : 'Tuition Fee')}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.amountToPayLabel}</span>
                          <span className="font-black text-emerald-800">
                            Tsh {(activeBill?.amount ?? outstandingBalance).toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">{language === 'SW' ? 'Tarehe ya Bili:' : 'Bill Date:'}</span>
                          <span className="font-semibold text-slate-700">
                            {activeBill?.generatedAt || '2026-01-10'}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.billExpiryLabel}</span>
                          <span className="font-bold text-amber-700">
                            {activeBill?.expiresAt || '2026-04-30'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1.5 pt-1">
                      <p>
                        {t.controlNumberInstructions}
                      </p>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div><strong className="text-slate-900">{t.nmbAccountLabel}</strong> 20110023456</div>
                        <div><strong className="text-slate-900">{t.crdbAccountLabel}</strong> 0150244556600</div>
                        <div className="sm:col-span-2 text-slate-500 text-[10px]">
                          <strong>{t.accountNameLabel}</strong> PRIMARY &amp; NURSERY SCHOOL
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions Card */}
                <div className="p-6 rounded-3xl bg-white/95 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{t.howToPayTitle}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      USSD &amp; BANK
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                      <p>{t.step1Pay}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                      <p>{t.step2Pay}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {language === 'SW' ? 'Weka Namba ya Malipo ya Shule (Control Number):' : 'Enter School Control Number:'}
                        </p>
                        <p className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 mt-0.5 inline-block text-xs">
                          {formatControlNumber(activeBill?.controlNumber || selectedChild.controlNumber)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                      <p>{t.step4Pay}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700">{language === 'SW' ? 'Kulipa Kupitia Benki / Wakala:' : 'Pay via Bank Branch / Agent:'}</p>
                    <p>{language === 'SW' ? 'Fika tawi lolote au wakala wa NMB / CRDB, taja Namba ya Malipo ya Shule au weka moja kwa moja kwenye akaunti ya shule.' : 'Visit any NMB / CRDB branch or agent, present the school control number or deposit directly into the school account.'}</p>
                  </div>
                </div>
              </div>

              {/* Payment History & Receipts Table */}
              <div className="p-6 rounded-3xl bg-white/95 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-slate-700" />
                  <span>{t.receiptHistoryTitle}</span>
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <th className="py-3 px-4">{t.tblReceiptNo}</th>
                        <th className="py-3 px-4">{t.dateLabel}</th>
                        <th className="py-3 px-4">{t.tblDescription}</th>
                        <th className="py-3 px-4">{t.tblPaymentMethod}</th>
                        <th className="py-3 px-4">{t.tblAmount}</th>
                        <th className="py-3 px-3 text-center">{t.statusLabel}</th>
                        <th className="py-3 px-4 text-center">{language === 'SW' ? 'Stakabadhi' : 'Receipt'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 text-slate-800">
                      {selectedChild.feeHistory.map((rec) => (
                        <tr key={rec.receiptNo} className="hover:bg-emerald-50/50">
                          <td className="py-3 px-4 font-mono font-bold text-emerald-900">{rec.receiptNo}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{rec.date}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{rec.description}</td>
                          <td className="py-3 px-4 text-slate-600">{rec.method}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {rec.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setActiveNotice(`Risiti "${rec.receiptNo}" inapakuliwa kwa muundo wa PDF...`)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>Pakua</span>
                            </button>
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
          {/* TAB 4: COMMUNICATION (ANNOUNCEMENTS, MESSAGES & NOTIFICATIONS) */}
          {/* ================================================================= */}
          {activeTab === 'COMMUNICATION' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-black text-slate-900">{t.commOfficialTitle}</h3>
                  <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold text-[10px]">
                        {t.filterUrgent}
                      </span>
                      <span>{language === 'SW' ? '01 Machi 2026' : 'March 01, 2026'}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">{t.agmTitle}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {language === 'SW'
                        ? 'Tunapenda kuwataarifu wazazi wote kuwa kikao cha wazazi kitafanyika ukumbini saa 3:00 Asubuhi. Agenda kuu zitakuwa ni ufaulu wa mitihani ya majaribio na ujenzi wa maabara ya sayansi.'
                        : 'We wish to inform all parents that the Annual General Meeting (AGM) will take place in the school hall at 9:00 AM. Key agendas include trial examination performance and construction of the science laboratory.'}
                    </p>
                    <span className="text-[11px] font-bold text-emerald-900 block pt-1">
                      {language === 'SW' ? 'Kutoka: Mwl. Augustine Mrosso (Mwalimu Mkuu)' : 'From: Tr. Augustine Mrosso (Headteacher)'}
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-800" />
                    <span>{language === 'SW' ? 'Mawasiliano na Walimu' : 'Teacher Communications'}</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="font-bold text-slate-900 block">{selectedChild.homeroomTeacher}</span>
                      <span className="text-[10px] text-slate-500">{language === 'SW' ? 'Mwalimu wa Darasa' : 'Homeroom Teacher'}</span>
                      <p className="text-slate-600 mt-1">
                        {language === 'SW'
                          ? `"${selectedChild.name.split(' ')[0]} anaendelea vizuri sana hasa kwenye somo la hisabati."`
                          : `"${selectedChild.name.split(' ')[0]} is making commendable progress, particularly in mathematics."`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: MEETINGS & APPOINTMENT REQUESTS */}
          {/* ================================================================= */}
          {activeTab === 'MEETINGS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-800" />
                    <span>{t.scheduleAppointmentTitle}</span>
                  </h3>

                  <form onSubmit={handleAppointmentSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        {t.selectStaffLabel}
                      </label>
                      <select
                        value={appointmentTeacher}
                        onChange={(e) => setAppointmentTeacher(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 font-bold"
                      >
                        {availableTeachers.map((st) => (
                          <option key={st.name} value={st.display}>
                            {st.display}
                          </option>
                        ))}
                        {selectedChild.homeroomTeacher && !availableTeachers.some((t) => t.name.includes(selectedChild.homeroomTeacher)) && (
                          <option value={`${selectedChild.homeroomTeacher} (${language === 'SW' ? 'Mwalimu wa Darasa' : 'Homeroom Teacher'})`}>
                            {selectedChild.homeroomTeacher} ({language === 'SW' ? 'Mwalimu wa Darasa' : 'Homeroom Teacher'})
                          </option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        {t.meetingTopicLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={appointmentTopic}
                        onChange={(e) => setAppointmentTopic(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        {t.preferredDateLabel}
                      </label>
                      <input
                        type="date"
                        required
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20"
                    >
                      {t.bookAppointmentBtn}
                    </button>
                  </form>
                </div>

                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900">{t.scheduledMeetingsTitle}</h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="font-bold text-emerald-950 block">{t.agmTitle}</span>
                      <span className="text-slate-500 block text-[11px] mt-0.5">
                        {language === 'SW' ? 'Jumamosi, 28 Machi 2026 • Saa 3:00 Asubuhi' : 'Saturday, 28 March 2026 • 9:00 AM'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-bold text-[10px] inline-block mt-2">
                        {language === 'SW' ? 'Wazazi Wote' : 'All Parents'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: DOCUMENTS (AUTHORIZED CHILD DOCUMENTS) */}
          {/* ================================================================= */}
          {activeTab === 'DOCUMENTS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-800" />
                  <span>{t.documentsTitle} ({selectedChild.name})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {language === 'SW' ? 'Cheti cha Usajili wa NECTA (Candidate Verification)' : 'NECTA Candidate Registration Certificate'}
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {language === 'SW' ? 'PDF • 1.2 MB • Kimethibitishwa' : 'PDF • 1.2 MB • Verified'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNotice(language === 'SW' ? 'Cheti cha usajili kinapakuliwa...' : 'Downloading registration certificate...')}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs"
                    >
                      {language === 'SW' ? 'Pakua' : 'Download'}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {language === 'SW' ? 'Kifurushi cha Mazoezi ya Likizo (Holiday Package)' : 'Holiday Homework Package'}
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {language === 'SW' ? 'PDF • 3.5 MB • Masomo Yote' : 'PDF • 3.5 MB • All Subjects'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNotice(language === 'SW' ? 'Kifurushi cha likizo kinapakuliwa...' : 'Downloading holiday package...')}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs"
                    >
                      {language === 'SW' ? 'Pakua' : 'Download'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: DISCIPLINE */}
          {/* ================================================================= */}
          {activeTab === 'DISCIPLINE' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-emerald-800" />
                      <span>{t.disciplineTitle} ({selectedChild.name})</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === 'SW' ? 'Tathmini rasmi kutoka kwa Mwalimu wa Nidhamu na Mwalimu Mkuu.' : 'Official evaluation from Discipline Master and Headteacher.'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                    {selectedChild.conduct}
                  </span>
                </div>

                {selectedChild.disciplineRecords.length > 0 ? (
                  <div className="space-y-3">
                    {selectedChild.disciplineRecords.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="font-mono">{item.date}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                            {item.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900">{item.issue}</h4>
                        <p className="text-slate-600">{t.tblActionTaken}: {item.action}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-900">{t.noDisciplineIncidents}</h4>
                    <p className="text-[11px] text-slate-500">{t.cleanRecordDesc}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: REQUESTS (LEAVE REQUEST & PARENT CONFIRMATION) */}
          {/* ================================================================= */}
          {activeTab === 'REQUESTS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form to submit leave request */}
                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-800" />
                    <span>{t.leaveRequestFormTitle}</span>
                  </h3>

                  <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        {t.leaveReasonLabel}
                      </label>
                      <select
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 font-bold"
                      >
                        <option value="Matibabu (Hospitali)">{t.leaveReasonMedical}</option>
                        <option value="Dharura ya Kifamilia">{t.leaveReasonFamily}</option>
                        <option value="Safari Maalum ya Kielimu">{t.leaveReasonTravel}</option>
                        <option value="Sababu Nyingine">{t.leaveReasonOther}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          {t.startDateLabel}
                        </label>
                        <input
                          type="date"
                          required
                          value={leaveStartDate}
                          onChange={(e) => setLeaveStartDate(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          {t.numberOfDaysLabel}
                        </label>
                        <select
                          value={leaveDays}
                          onChange={(e) => setLeaveDays(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                        >
                          <option value="1">{language === 'SW' ? 'Siku 1' : '1 Day'}</option>
                          <option value="2">{language === 'SW' ? 'Siku 2' : '2 Days'}</option>
                          <option value="3">{language === 'SW' ? 'Siku 3' : '3 Days'}</option>
                          <option value="4">{language === 'SW' ? 'Siku 4' : '4 Days'}</option>
                          <option value="5">{language === 'SW' ? 'Siku 5 au Zaidi' : '5 Days or More'}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                        {t.additionalNotesLabel}
                      </label>
                      <textarea
                        rows={3}
                        value={leaveNotes}
                        onChange={(e) => setLeaveNotes(e.target.value)}
                        placeholder={language === 'SW' ? 'Andika ufafanuzi mfupi...' : 'Provide brief details...'}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-950/20"
                    >
                      {t.submitLeaveRequestBtn}
                    </button>
                  </form>
                </div>

                {/* Submitted requests tracker */}
                <div className="p-6 rounded-3xl bg-white/95 border border-emerald-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900">{t.submittedRequestsTitle}</h3>

                  <div className="space-y-3">
                    {submittedRequests.map((req) => (
                      <div key={req.id} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{req.childName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{req.dateSubmitted}</span>
                        </div>
                        <div className="text-slate-600">{req.reason} ({req.dates})</div>
                        <div className="pt-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-bold text-[10px]">
                            {req.status.includes('IMEIDHINISHWA') || req.status.includes('APPROVED')
                              ? (language === 'SW' ? 'IMEIDHINISHWA NA MKUU WA SHULE' : 'APPROVED BY HEADTEACHER')
                              : req.status.includes('INASUBIRI') || req.status.includes('PENDING')
                              ? (language === 'SW' ? 'INASUBIRI IDHINI YA MWALIMU MKUU' : 'PENDING HEADTEACHER APPROVAL')
                              : req.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {submittedRequests.length === 0 && (
                      <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                        {language === 'SW' ? 'Bado hujatuma ombi lolote la ruhusa.' : 'No leave requests submitted yet.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ============================================================= */}
              {/* OMBI LA KUMUONA MWANAFUNZI (STUDENT VISIT / PARENT MEETING) */}
              {/* ============================================================= */}
              <div className="p-6 rounded-3xl bg-white/95 border border-amber-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{t.visitRequestTitle}</h3>
                    <p className="text-[11px] text-slate-500">{t.visitRequestSubtitle}</p>
                  </div>
                </div>

                {selectedChild.disciplineRecords.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      {language === 'SW' ? (
                        <><strong>Kumbuka:</strong> {selectedChild.name} ana rekodi ya kinidhamu. Unaweza taja namba ya rejea ya kesi hiyo kama mkutano unahusiana nazo.</>
                      ) : (
                        <><strong>Note:</strong> {selectedChild.name} has a recorded disciplinary issue. You may cite the reference code if this visit relates to it.</>
                      )}
                    </div>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!visitDate || !visitTime) return;
                    const newVisit = {
                      id: `visit-${Date.now().toString().slice(-4)}`,
                      childName: selectedChild.name,
                      date: visitDate,
                      time: visitTime,
                      reason: visitReason,
                      disciplineRef: visitDisciplineRef,
                      notes: visitNotes,
                      status: language === 'SW' ? 'INASUBIRI IDHINI YA MWALIMU MKUU' : 'PENDING HEADTEACHER APPROVAL',
                      dateSubmitted: new Date().toISOString().split('T')[0],
                      tourType: visitReason,
                    };
                    setSubmittedVisits((prev) => {
                      const updated = [newVisit, ...prev];
                      if (typeof window !== 'undefined') {
                        try {
                          localStorage.setItem(STORAGE_VISIT_APPOINTMENTS_KEY, JSON.stringify(updated));
                        } catch {}
                      }
                      return updated;
                    });
                    setVisitDate('');
                    setVisitTime('');
                    setVisitDisciplineRef('');
                    setVisitNotes('');
                    setActiveNotice(
                      language === 'SW'
                        ? `Ombi la kumuona ${selectedChild.name} limetumwa kwa Mwalimu Mkuu kwa uhakiki na idhini.`
                        : `Visit request for ${selectedChild.name} submitted to Headteacher for verification.`
                    );
                  }}
                  className="space-y-3 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.visitChildLabel}</label>
                      <div className="w-full p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-slate-900">
                        {selectedChild.name} — {selectedChild.admNo}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.visitTypeLabel}</label>
                      <select
                        value={visitReason}
                        onChange={(e) => setVisitReason(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      >
                        <option value="Mazungumzo ya Jumla na Mwalimu / Mkuu wa Shule">{t.visitTypeGeneral}</option>
                        <option value="Tathmini ya Maendeleo ya Masomo">{t.visitTypeAcademic}</option>
                        <option value="Mkutano Kuhusu Suala la Kinidhamu">{t.visitTypeDiscipline}</option>
                        <option value="Kuangalia Hali ya Afya ya Mtoto">{t.visitTypeHealth}</option>
                        <option value="Mkutano wa Haraka Kuhusu Suala Nyeti">{t.visitTypeUrgent}</option>
                        <option value="Ushiriki wa Sherehe / Tukio la Shule">{t.visitTypeEvent}</option>
                        <option value="Sababu Nyingine">{t.visitTypeOther}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.preferredVisitDate}</label>
                      <input
                        type="date"
                        required
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.preferredVisitTime}</label>
                      <input
                        type="time"
                        required
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      {t.disciplineRefOptional}
                    </label>
                    <input
                      type="text"
                      value={visitDisciplineRef}
                      onChange={(e) => setVisitDisciplineRef(e.target.value)}
                      placeholder={language === 'SW' ? 'Mfn. DISC-2026-0041 (kama mkutano ni kuhusu suala la nidhamu)' : 'E.g. DISC-2026-0041 (if related to discipline issue)'}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t.notesForHeadteacher}</label>
                    <textarea
                      rows={2}
                      value={visitNotes}
                      onChange={(e) => setVisitNotes(e.target.value)}
                      placeholder={language === 'SW' ? 'Andika kwa ufupi sababu ya ziara yako na unachohitaji kujadili...' : 'Briefly explain reason for visit and agenda...'}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                    <span>
                      {t.visitApprovalDisclaimer}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.submitVisitRequestBtn}</span>
                  </button>
                </form>
              </div>

              {/* Visit Requests Tracker */}
              <div className="p-6 rounded-3xl bg-white/95 border border-amber-200/90 shadow-xs space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{t.visitTrackerTitle} ({submittedVisits.length})</span>
                </h3>
                <div className="space-y-3">
                  {submittedVisits.map((visit) => (
                    <div key={visit.id} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-800 text-amber-100 flex items-center justify-center font-black text-[10px]">
                            {visit.childName.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{visit.childName}</span>
                            <span className="text-[10px] text-slate-500">{visit.tourType || visit.reason}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{visit.dateSubmitted}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                        <div><span className="font-bold text-slate-700">{t.dateLabel}</span> {visit.date}</div>
                        <div><span className="font-bold text-slate-700">{t.timeLabel}</span> {visit.time}</div>
                      </div>
                      {visit.disciplineRef && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 rounded-lg px-2 py-1 border border-amber-200">
                          <span className="font-bold">{language === 'SW' ? 'Rejea ya Nidhamu:' : 'Discipline Ref:'}</span> {visit.disciplineRef}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          visit.status.includes('IMEIDHINISHWA') || visit.status.includes('APPROVED')
                            ? 'bg-emerald-200 text-emerald-950'
                            : visit.status.includes('IMEKATALIWA') || visit.status.includes('REJECTED')
                            ? 'bg-rose-200 text-rose-950'
                            : 'bg-amber-200 text-amber-950'
                        }`}>
                          {visit.status.includes('IMEIDHINISHWA') || visit.status.includes('APPROVED')
                            ? (language === 'SW' ? 'IMEIDHINISHWA NA MWALIMU MKUU' : 'APPROVED BY HEADTEACHER')
                            : visit.status.includes('IMEKATALIWA') || visit.status.includes('REJECTED')
                            ? (language === 'SW' ? 'IMEKATALIWA NA MWALIMU MKUU' : 'REJECTED BY HEADTEACHER')
                            : (language === 'SW' ? 'INASUBIRI IDHINI YA MWALIMU MKUU' : 'PENDING HEADTEACHER APPROVAL')}
                        </span>
                        {visit.confirmedBy && (
                          <span className="text-[10px] text-slate-500">✓ {visit.confirmedBy}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {submittedVisits.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                      {t.noVisitsSubmitted}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </main>

        {/* Parent Portal Footer */}
        <footer className="mt-12 pt-6 pb-8 border-t border-emerald-200/80 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">&copy; {new Date().getFullYear()} PRIMARY &amp; NURSERY SCHOOL. {t.allRightsReserved}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>0779304500</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              <span>pj0040280@gmail.com</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
            <span>{t.officialParentPortal}</span>
            <span>•</span>
            <span>Primary Education Platform</span>
            <span>•</span>
            <span>{t.studentDataProtection}</span>
          </div>
        </footer>
      </div>

      {/* ===================================================================== */}
      {/* MODAL: PAKIA PICHA YA WASIFU (PROFILE PHOTO UPLOAD) */}
      {/* ===================================================================== */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-emerald-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">{t.profileModalTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Current photo preview */}
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-400 shadow-lg">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile Photo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-2xl font-black">
                    BJ
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 text-center">
                {profilePhoto ? t.profileModalPreview : (language === 'SW' ? 'Bonyeza kuchagua picha mpya ya wasifu wako.' : 'Click below to select your new profile picture.')}
              </p>
            </div>

            <label
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t.profileModalChoosePhoto}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const dataUrl = ev.target?.result as string;
                    setProfilePhoto(dataUrl);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('parent_profile_photo', dataUrl);
                    }
                    setShowProfileModal(false);
                    setActiveNotice(language === 'SW' ? 'Picha ya wasifu imesasishwa kikamilifu!' : 'Profile photo updated successfully!');
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>

            <p className="text-[10px] text-slate-400 text-center">
              {t.profileModalNotice}
            </p>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: UNGANISHA MTOTO MWINGINE (LINK STUDENT ACCOUNT) */}
      {/* ===================================================================== */}
      {showLinkChildModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-emerald-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-black text-slate-900">{t.linkModalTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkChildModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t.linkModalDesc}
            </p>

            <form onSubmit={handleLinkNewChild} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.linkModalAdmLabel}
                </label>
                <input
                  type="text"
                  required
                  value={linkAdmNo}
                  onChange={(e) => setLinkAdmNo(e.target.value)}
                  placeholder={language === 'SW' ? 'Mfn. PUP-2026-061 au SFNA-2026-0112' : 'E.g. PUP-2026-061 or SFNA-2026-0112'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold uppercase"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {language === 'SW' ? 'Jaribu kuweka: ' : 'Try: '}<code className="text-emerald-700 font-bold">PUP-2026-061</code>
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.linkModalPinLabel}
                </label>
                <input
                  type="password"
                  required
                  value={linkSecurityPin}
                  onChange={(e) => setLinkSecurityPin(e.target.value)}
                  placeholder={language === 'SW' ? 'Weka PIN (Mfn. 8492 au namba ya simu)' : 'Enter PIN (E.g. 8492 or phone)'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  {t.linkModalBenefitNotice}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkChildModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20"
                >
                  {t.linkModalSubmitBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: DUSTBIN — WATOTO WALIOHAMISHWA (SOFT DELETED CHILDREN) */}
      {/* ===================================================================== */}
      {showDustbinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-rose-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{t.dustbinModalTitle}</h3>
                  <p className="text-[11px] text-slate-500">{t.dustbinModalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDustbinModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {trashedChildren.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-500">{t.dustbinEmptyTitle}</p>
                <p className="text-xs text-slate-400">{t.dustbinEmptyDesc}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    {t.dustbinWarning}
                  </span>
                </div>

                {trashedChildren.map((child) => (
                  <div key={child.id} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center font-black text-sm shrink-0">
                        {child.photoInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-slate-900 text-sm truncate">{child.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{child.class} • {child.admNo}</p>
                        <p className="text-[10px] text-rose-600 font-bold">{language === 'SW' ? 'Amehamishwa kwenye Dustbin' : 'Moved to Trash'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Restore */}
                      <button
                        type="button"
                        onClick={() => handleRestoreFromTrash(child.id)}
                        className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{t.restoreBtn}</span>
                      </button>

                      {/* Permanent delete */}
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(child.id)}
                        className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t.deleteForeverBtn}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DIALOG: THIBITISHA KUFUTA KABISA (CONFIRM PERMANENT DELETE) */}
      {/* ===================================================================== */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full border border-rose-300 shadow-2xl p-6 space-y-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-base font-black text-slate-900">{t.confirmDeleteModalTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'SW' ? (
                  <>Ukifuta <strong className="text-rose-700">{trashedChildren.find(c => c.id === confirmDeleteId)?.name}</strong> kabisa, <span className="text-rose-700 font-bold">hawezi kurejeshwa tena</span>. Data yake yote itafutwa milele.</>
                ) : (
                  <>If you delete <strong className="text-rose-700">{trashedChildren.find(c => c.id === confirmDeleteId)?.name}</strong> permanently, <span className="text-rose-700 font-bold">this action cannot be undone</span>. All records will be erased permanently.</>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => handlePermanentDelete(confirmDeleteId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.confirmDeleteYesBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: TENGENEZA NAMBA MPYA YA MALIPO (GENERATE CONTROL NUMBER) */}
      {/* ===================================================================== */}
      {showGenerateBillModal && selectedChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-emerald-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                  <RefreshCw className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{t.generateNewBillModalTitle}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">PRIMARY &amp; NURSERY SCHOOL • GePG Billing Engine</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGenerateBillModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t.generateNewBillDesc}
            </p>

            {/* Target Pupil Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-sm shrink-0">
                {selectedChild.photoInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-black text-slate-900 text-sm truncate">{selectedChild.name}</p>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {language === 'SW' ? 'Bao: ' : 'Bal: '}Tsh {outstandingBalance.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{selectedChild.class} • {selectedChild.admNo}</p>
              </div>
            </div>

            <form onSubmit={handleGenerateNewBill} className="space-y-4 text-xs">
              {/* Fee Purpose */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.feePurposeLabel}
                </label>
                <select
                  value={billFormPurpose}
                  onChange={(e) => setBillFormPurpose(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white text-slate-900 font-medium"
                >
                  <option value="Ada ya Masomo (Tuition Fee)">Ada ya Masomo (Tuition Fee)</option>
                  <option value="Ada ya Masomo & Maabara (Tuition & Exam Fee)">Ada ya Masomo &amp; Maabara (Tuition &amp; Exam Fee)</option>
                  <option value="Ada ya Chakula & Bweni (Meals & Boarding)">Ada ya Chakula &amp; Bweni (Meals &amp; Boarding)</option>
                  <option value="Mitihani ya Majaribio & NECTA (Trial & Mock Exams)">Mitihani ya Majaribio &amp; NECTA (Trial &amp; Mock Exams)</option>
                  <option value="Vifaa vya Masomo & Vitabu (Stationery & Books)">Vifaa vya Masomo &amp; Vitabu (Stationery &amp; Books)</option>
                  <option value="Sare za Shule & Michezo (Uniform & Sports)">Sare za Shule &amp; Michezo (Uniform &amp; Sports)</option>
                  <option value="Ada Kamili ya Mwaka (Full Annual School Fee)">Ada Kamili ya Mwaka (Full Annual School Fee)</option>
                </select>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  {t.amountToPayLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setBillFormAmountType('FULL')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      billFormAmountType === 'FULL'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span className="text-[10px] block opacity-80">{language === 'SW' ? 'Bao Kamili' : 'Full Balance'}</span>
                    <span className="text-xs font-black">Tsh {outstandingBalance > 0 ? outstandingBalance.toLocaleString() : '150,000'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillFormAmountType('100K')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      billFormAmountType === '100K'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span className="text-[10px] block opacity-80">{language === 'SW' ? 'Awamu' : 'Installment'}</span>
                    <span className="text-xs font-black">Tsh 100,000</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillFormAmountType('50K')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      billFormAmountType === '50K'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span className="text-[10px] block opacity-80">{language === 'SW' ? 'Awamu' : 'Installment'}</span>
                    <span className="text-xs font-black">Tsh 50,000</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillFormAmountType('CUSTOM')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      billFormAmountType === 'CUSTOM'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span className="text-[10px] block opacity-80">{language === 'SW' ? 'Nyingine' : 'Custom'}</span>
                    <span className="text-xs font-black">{language === 'SW' ? 'Weka Kiasi' : 'Set Amount'}</span>
                  </button>
                </div>

                {billFormAmountType === 'CUSTOM' && (
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Tsh</span>
                    <input
                      type="number"
                      required
                      min="10000"
                      step="5000"
                      value={billFormCustomAmount}
                      onChange={(e) => setBillFormCustomAmount(e.target.value)}
                      placeholder="Mfn. 75000"
                      className="w-full pl-11 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Payment Channel */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.channelPreferenceLabel}
                </label>
                <select
                  value={billFormChannel}
                  onChange={(e) => setBillFormChannel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white text-slate-900 font-medium"
                >
                  <option value="ALL">{language === 'SW' ? 'Mitandao Yote & Benki (M-Pesa, Tigo Pesa, Airtel, NMB, CRDB)' : 'All Mobile Networks & Banks (M-Pesa, Tigo, Airtel, NMB, CRDB)'}</option>
                  <option value="M-Pesa">Vodacom M-Pesa</option>
                  <option value="Tigo Pesa">Yas / Tigo Pesa</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="NMB Bank">Benki ya NMB (A/C: 20110023456)</option>
                  <option value="CRDB Bank">Benki ya CRDB (A/C: 0150244556600)</option>
                </select>
              </div>

              {/* Verified GePG Algorithm Notice */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  {language === 'SW'
                    ? 'Namba ya malipo itatengenezwa ikiwa na tarakimu 12 kamili (prefix 9928) yenye Luhn Mod-10 Check Digit inayotambuliwa rasmi na mifumo ya kibenki nchini Tanzania.'
                    : 'The generated 12-digit control number (prefix 9928) features a verified Luhn Mod-10 check digit accepted across all Tanzanian banking and payment channels.'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateBillModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingBill}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingBill ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingBill ? (language === 'SW' ? 'Inazalisha...' : 'Generating...') : (language === 'SW' ? 'Tengeneza Namba ya Malipo' : 'Generate Control Number')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: HATI RASMI YA BILI YA MALIPO (OFFICIAL PAYMENT BILL SLIP) */}
      {/* ===================================================================== */}
      {showBillSlipModal && selectedChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-emerald-300 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto print:p-0 print:border-none print:shadow-none print:max-w-full">
            {/* Action Bar (Hidden when printing) */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{language === 'SW' ? 'Hati Rasmi ya Bili ya Malipo' : 'Official Payment Invoice Slip'}</h3>
                  <p className="text-[10px] text-slate-500 font-mono">{activeBill?.billReference || 'BILL-2026-PSLE0428-1092'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.btnPrintBillSlip}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowBillSlipModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="border border-slate-300 rounded-2xl p-5 sm:p-6 bg-white space-y-4 text-slate-800 print:border-none print:p-0">
              {/* Official School Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-black text-xs">
                    PS
                  </div>
                  <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-900">
                    PRIMARY &amp; NURSERY SCHOOL
                  </h2>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold tracking-wide uppercase">
                  KITENGO CHA MAPATO NA FEDHA • BURSAR &amp; ACCOUNTS DEPARTMENT
                </p>
                <p className="text-[10px] text-slate-500">
                  S.L.P 40280, Dar es Salaam, Tanzania • Simu: +255 779 304 500 • Barua Pepe: pj0040280@gmail.com
                </p>
                <div className="pt-1">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider">
                    {language === 'SW' ? 'HATI YA BILI YA MALIPO YA ADA (BILL INVOICE)' : 'OFFICIAL PAYMENT BILL SLIP'}
                  </span>
                </div>
              </div>

              {/* Big Control Number Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border-2 border-dashed border-emerald-600 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  {language === 'SW' ? 'NAMBA YA MALIPO YA SHULE (CONTROL NUMBER)' : 'SCHOOL FEE CONTROL NUMBER'}
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-black tracking-widest text-emerald-950 block">
                  {formatControlNumber(activeBill?.controlNumber || selectedChild.controlNumber)}
                </span>
                <div className="flex items-center justify-center gap-3 pt-1 text-[11px]">
                  <span className="font-semibold text-slate-600">
                    {language === 'SW' ? 'Mwisho wa Kulipa: ' : 'Valid Until: '}
                    <strong className="text-amber-800">{activeBill?.expiresAt || '2026-04-30'}</strong>
                  </span>
                  <span>•</span>
                  <span className="font-black text-emerald-800 uppercase">
                    {activeBill?.status === 'PAID' ? 'IMELIPWA (PAID)' : 'INATUMIKA (ACTIVE)'}
                  </span>
                </div>
              </div>

              {/* Student Particulars */}
              <div className="rounded-xl border border-slate-200 p-3 space-y-2 bg-slate-50/50 text-xs">
                <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-200">
                  {language === 'SW' ? 'Taarifa za Mwanafunzi' : 'Student Particulars'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-500">{language === 'SW' ? 'Jina la Mwanafunzi:' : 'Pupil Name:'}</span> <strong className="text-slate-900 block font-bold">{selectedChild.name}</strong></div>
                  <div><span className="text-slate-500">{language === 'SW' ? 'Namba ya Usajili:' : 'Admission No:'}</span> <strong className="text-slate-900 block font-mono font-bold">{selectedChild.admNo}</strong></div>
                  <div><span className="text-slate-500">{language === 'SW' ? 'Darasa & Mkondo:' : 'Class & Stream:'}</span> <strong className="text-slate-900 block">{selectedChild.class} ({selectedChild.stream})</strong></div>
                  <div><span className="text-slate-500">{language === 'SW' ? 'Mwalimu wa Darasa:' : 'Class Teacher:'}</span> <strong className="text-slate-900 block">{selectedChild.homeroomTeacher}</strong></div>
                </div>
              </div>

              {/* Bill Details */}
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                      <th className="py-2 px-3">{language === 'SW' ? 'Maelezo ya Bili' : 'Description'}</th>
                      <th className="py-2 px-3">{language === 'SW' ? 'Njia ya Kulipa' : 'Channel'}</th>
                      <th className="py-2 px-3 text-right">{language === 'SW' ? 'Kiasi (Tsh)' : 'Amount (Tsh)'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2.5 px-3">
                        <strong className="text-slate-900 block font-bold">{activeBill?.purpose || (language === 'SW' ? 'Ada ya Masomo' : 'Tuition Fee')}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">Ref: {activeBill?.billReference || 'BILL-2026-0428-1092'}</span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-700">
                        {activeBill?.channel === 'ALL' ? (language === 'SW' ? 'Mitandao Yote & Benki' : 'All Mobile & Bank Channels') : activeBill?.channel}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900 text-sm">
                        Tsh {(activeBill?.amount ?? outstandingBalance).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/50 font-bold text-xs">
                      <td colSpan={2} className="py-2 px-3 text-right text-emerald-950 uppercase font-black">
                        {language === 'SW' ? 'Jumla ya Bili Hii:' : 'Total Payable:'}
                      </td>
                      <td className="py-2 px-3 text-right font-black text-emerald-900 text-base">
                        Tsh {(activeBill?.amount ?? outstandingBalance).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Instructions & Official Accounts */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5 text-[11px] text-slate-700">
                <p className="font-bold text-slate-900">{language === 'SW' ? 'Jinsi ya Kukamilisha Malipo:' : 'How to Complete Payment:'}</p>
                <p>1. <strong>M-Pesa / Tigo Pesa / Airtel Money:</strong> Piga *150*00# / *150*01# / *150*60# &gt; Chagua Lipa Bili &gt; Ingiza Namba ya Malipo: <span className="font-mono font-bold text-slate-950">{formatControlNumber(activeBill?.controlNumber || selectedChild.controlNumber)}</span></p>
                <p>2. <strong>Tawi la Benki au Wakala:</strong> Taja Namba ya Malipo hapo juu au weka moja kwa moja: NMB A/C <strong>20110023456</strong> au CRDB A/C <strong>0150244556600</strong> (PRIMARY &amp; NURSERY SCHOOL).</p>
              </div>

              {/* Official Seal / Signature Simulation */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-700">PRIMARY &amp; NURSERY SCHOOL</p>
                  <p>{language === 'SW' ? 'Hati hii imetolewa kielektroniki na ni halali bila mhuri wa mkono.' : 'This document is generated electronically and valid officially.'}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 rounded-md border border-emerald-400 bg-emerald-50 text-emerald-900 font-mono font-bold text-[9px] uppercase">
                    BURSAR VERIFIED • OFFICIAL SEAL
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 print:hidden">
              <button
                type="button"
                onClick={() => setShowBillSlipModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                {t.cancelBtn}
              </button>

              {activeBill?.status !== 'PAID' && (
                <button
                  type="button"
                  disabled={isSimulatingPayment}
                  onClick={() => {
                    handleSimulatePayment();
                    setShowBillSlipModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{isSimulatingPayment ? (language === 'SW' ? 'Inalipa...' : 'Processing...') : t.simulatePaymentBtn}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
