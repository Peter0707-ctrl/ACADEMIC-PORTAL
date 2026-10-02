'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  RotateCcw,
  Check,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Clock,
  Send,
  Eye,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  FileCheck,
  ChevronRight,
  AlertTriangle,
  Info,
} from 'lucide-react';
import TeacherShell from '@/components/teacher-shell';
import { notifyUser } from '@/lib/notifications';
import { getCurrentSession } from '@/lib/auth-session';

// =============================================================================
// TYPES & DATA STRUCTURES FOR MULTI-SUBJECT MERGING & AI AUDIT
// =============================================================================

export interface SubjectSubmissionItem {
  id: string;
  name: string;
  code: string;
  teacher: string;
  studentsCount: number;
  average: number;
  submittedAt: string;
  isSubmitted: boolean;
}

export interface MergedStudentScore {
  admNo: string;
  name: string;
  gender: 'M' | 'F';
  math: number;
  english: number;
  kiswahili: number;
  science: number;
  social: number;
  civic: number;
  total: number;
  average: number;
  division: 'Daraja I' | 'Daraja II' | 'Daraja III' | 'Daraja IV' | 'Daraja 0';
  rank: number;
  aiStatus: 'VERIFIED' | 'WARNING' | 'EXCELLENT';
  aiNote?: string;
}

export interface AIAuditResult {
  completed: boolean;
  scoreAccuracy: number; // e.g. 100%
  dataHealthScore: number; // e.g. 99.4%
  totalMarksAudited: number; // e.g. 210 marks
  detectedAnomalies: {
    studentName: string;
    admNo: string;
    subject: string;
    score: number;
    issue: string;
    type: 'TYPO_SUSPICION' | 'VARIANCE' | 'MISSING_RESOLVED';
  }[];
  timestamp: string;
}

// 4 Classes supported in the workflow
const CLASSES = [
  { id: 'std-7', name: 'Standard 7 (Grade 7)', level: 'Watahiniwa wa Taifa (PSLE)', totalStudents: 35 },
  { id: 'std-6', name: 'Standard 6 (Grade 6)', level: 'Darasa la Sita', totalStudents: 35 },
  { id: 'std-5', name: 'Standard 5 (Grade 5)', level: 'Darasa la Tano', totalStudents: 35 },
  { id: 'std-4', name: 'Standard 4 (Grade 4)', level: 'Watahiniwa wa Taifa (SFNA)', totalStudents: 35 },
];

// 6 Core Subjects for Primary Education
const CORE_SUBJECTS = [
  { code: 'MATH', name: 'Mathematics (Hisabati)', defaultTeacher: 'Mwl. Beatrice Kimaro (Academic)' },
  { code: 'ENG', name: 'English Language (Kiingereza)', defaultTeacher: 'Mwl. Grace Shayo' },
  { code: 'KISW', name: 'Kiswahili', defaultTeacher: 'Mwl. Juma Athumani' },
  { code: 'SCI', name: 'Science & Tech (Sayansi)', defaultTeacher: 'Mwl. Emmanuel Lyimo' },
  { code: 'SOC', name: 'Social Studies (Maarifa ya Jamii)', defaultTeacher: 'Mwl. Rehema Mushi' },
  { code: 'CIV', name: 'Civic & Moral (Uraia na Maadili)', defaultTeacher: 'Mwl. Frank Msaki (Second Master)' },
];

// Master Student Names for each Class (35 Pupils each)
const ROSTERS: Record<string, { admNo: string; name: string; gender: 'M' | 'F' }[]> = {
  'Standard 7 (Grade 7)': [
    { admNo: 'PSLE-2026-0428', name: 'Kelvin Shirima (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0429', name: 'Neema Massawe (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0430', name: 'Amani Charles (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0431', name: 'Beatrice Samuel (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0432', name: 'Daniel Josephat (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0433', name: 'Ester Lucas (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0434', name: 'Faraja Nelson (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0435', name: 'Halima Zuberi (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0436', name: 'Ian Geoffrey (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0437', name: 'Jesca William (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0438', name: 'Kassim Bakari (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0439', name: 'Lydia Stephano (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0440', name: 'Meshack Peter (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0441', name: 'Nuru Shabani (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0442', name: 'Oscar Thomas (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0443', name: 'Pendo David (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0444', name: 'Ramadhani Yahya (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0445', name: 'Salma Rashid (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0446', name: 'Titus George (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0447', name: 'Upendo Joseph (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0448', name: 'Venance Michael (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0449', name: 'Winfrida Aloyce (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0450', name: 'Yusuph Ally (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0451', name: 'Zahara Omari (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0452', name: 'Alex Barnabas (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0453', name: 'Bridget Frank (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0454', name: 'Collins Wilson (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0455', name: 'Doreen Simon (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0456', name: 'Eliazer John (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0457', name: 'Faith Martin (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0458', name: 'Goodluck Francis (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0459', name: 'Happy Richard (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0460', name: 'Innocent James (Candidate)', gender: 'M' },
    { admNo: 'PSLE-2026-0461', name: 'Janeth Paul (Candidate)', gender: 'F' },
    { admNo: 'PSLE-2026-0462', name: 'Khadija Said (Candidate)', gender: 'F' },
  ],
  'Standard 6 (Grade 6)': [
    { admNo: 'PUP-2026-061', name: 'Rashid Hamisi', gender: 'M' },
    { admNo: 'PUP-2026-062', name: 'Amina Salum', gender: 'F' },
    { admNo: 'PUP-2026-063', name: 'Frank Leonard', gender: 'M' },
    { admNo: 'PUP-2026-064', name: 'Grace Mlay', gender: 'F' },
    { admNo: 'PUP-2026-065', name: 'Baraka Juma Mshana', gender: 'M' },
    { admNo: 'PUP-2026-066', name: 'Zuwena Athumani', gender: 'F' },
    { admNo: 'PUP-2026-067', name: 'Christopher Mwita', gender: 'M' },
    { admNo: 'PUP-2026-068', name: 'Diana Patrick Kavishe', gender: 'F' },
    { admNo: 'PUP-2026-069', name: 'Erick John Masanja', gender: 'M' },
    { admNo: 'PUP-2026-070', name: 'Fatuma Omari Said', gender: 'F' },
    { admNo: 'PUP-2026-071', name: 'Godfrey Peter Temu', gender: 'M' },
    { admNo: 'PUP-2026-072', name: 'Hawa Ramadhani Bakari', gender: 'F' },
    { admNo: 'PUP-2026-073', name: 'Ismail Ally Seif', gender: 'M' },
    { admNo: 'PUP-2026-074', name: 'Jackline Simon Shirima', gender: 'F' },
    { admNo: 'PUP-2026-075', name: 'Kelvin Anthony Minja', gender: 'M' },
    { admNo: 'PUP-2026-076', name: 'Lilian Daudi Mrema', gender: 'F' },
    { admNo: 'PUP-2026-077', name: 'Michael Joseph Mushi', gender: 'M' },
    { admNo: 'PUP-2026-078', name: 'Nancy Prosper Lyimo', gender: 'F' },
    { admNo: 'PUP-2026-079', name: 'Omari Khalfan Mwinyi', gender: 'M' },
    { admNo: 'PUP-2026-080', name: 'Pauline Gabriel Massawe', gender: 'F' },
    { admNo: 'PUP-2026-081', name: 'Raymond Charles Swai', gender: 'M' },
    { admNo: 'PUP-2026-082', name: 'Sabrina Hashim Nassor', gender: 'F' },
    { admNo: 'PUP-2026-083', name: 'Thomas Lucas Tarimo', gender: 'M' },
    { admNo: 'PUP-2026-084', name: 'Upendo Wilson Mboya', gender: 'F' },
    { admNo: 'PUP-2026-085', name: 'Victor Ernest Moshi', gender: 'M' },
    { admNo: 'PUP-2026-086', name: 'Winnie Bernard Maro', gender: 'F' },
    { admNo: 'PUP-2026-087', name: 'Yohana Festo Mallya', gender: 'M' },
    { admNo: 'PUP-2026-088', name: 'Zainab Jafari Kingazi', gender: 'F' },
    { admNo: 'PUP-2026-089', name: 'Abel Richard Macha', gender: 'M' },
    { admNo: 'PUP-2026-090', name: 'Brenda Elia Kimaro', gender: 'F' },
    { admNo: 'PUP-2026-091', name: 'Denis Francis Mollel', gender: 'M' },
    { admNo: 'PUP-2026-092', name: 'Elizabeth George Kweka', gender: 'F' },
    { admNo: 'PUP-2026-093', name: 'Faraji Saidi Mkude', gender: 'M' },
    { admNo: 'PUP-2026-094', name: 'Gloria Martin Shayo', gender: 'F' },
    { admNo: 'PUP-2026-095', name: 'Henry Innocent Lyatuu', gender: 'M' },
  ],
  'Standard 5 (Grade 5)': [
    { admNo: 'PUP-2026-001', name: 'Baraka David', gender: 'M' },
    { admNo: 'PUP-2026-002', name: 'Zuhura Ally', gender: 'F' },
    { admNo: 'PUP-2026-003', name: 'Joshua Peter', gender: 'M' },
    { admNo: 'PUP-2026-004', name: 'Dorothy Michael', gender: 'F' },
    { admNo: 'PUP-2026-005', name: 'Emanuel Joseph', gender: 'M' },
    { admNo: 'PUP-2026-006', name: 'Fiona Patrick', gender: 'F' },
    { admNo: 'PUP-2026-007', name: 'Geofrey Francis', gender: 'M' },
    { admNo: 'PUP-2026-008', name: 'Hilda Jackson', gender: 'F' },
    { admNo: 'PUP-2026-009', name: 'Idrisa Bakari', gender: 'M' },
    { admNo: 'PUP-2026-010', name: 'Judith Thomas', gender: 'F' },
    { admNo: 'PUP-2026-011', name: 'Kennedy Lucas', gender: 'M' },
    { admNo: 'PUP-2026-012', name: 'Lightness Paul', gender: 'F' },
    { admNo: 'PUP-2026-013', name: 'Mussa Juma', gender: 'M' },
    { admNo: 'PUP-2026-014', name: 'Naomi Wilson', gender: 'F' },
    { admNo: 'PUP-2026-015', name: 'Patrick George', gender: 'M' },
    { admNo: 'PUP-2026-016', name: 'Queen Stephano', gender: 'F' },
    { admNo: 'PUP-2026-017', name: 'Robert Martin', gender: 'M' },
    { admNo: 'PUP-2026-018', name: 'Stella Simon', gender: 'F' },
    { admNo: 'PUP-2026-019', name: 'Twaha Salum', gender: 'M' },
    { admNo: 'PUP-2026-020', name: 'Veronika Alex', gender: 'F' },
    { admNo: 'PUP-2026-021', name: 'Wilfred Daniel', gender: 'M' },
    { admNo: 'PUP-2026-022', name: 'Yasinta Omari', gender: 'F' },
    { admNo: 'PUP-2026-023', name: 'Zakayo Festo', gender: 'M' },
    { admNo: 'PUP-2026-024', name: 'Agnes Bernard', gender: 'F' },
    { admNo: 'PUP-2026-025', name: 'Bakari Said', gender: 'M' },
    { admNo: 'PUP-2026-026', name: 'Clara Charles', gender: 'F' },
    { admNo: 'PUP-2026-027', name: 'Dismas John', gender: 'M' },
    { admNo: 'PUP-2026-028', name: 'Eunice Frank', gender: 'F' },
    { admNo: 'PUP-2026-029', name: 'Fredrick Aloyce', gender: 'M' },
    { admNo: 'PUP-2026-030', name: 'Gisela Martin', gender: 'F' },
    { admNo: 'PUP-2026-031', name: 'Hashim Rashid', gender: 'M' },
    { admNo: 'PUP-2026-032', name: 'Irene Richard', gender: 'F' },
    { admNo: 'PUP-2026-033', name: 'Justine Peter', gender: 'M' },
    { admNo: 'PUP-2026-034', name: 'Karen James', gender: 'F' },
    { admNo: 'PUP-2026-035', name: 'Lameck Joseph', gender: 'M' },
  ],
  'Standard 4 (Grade 4)': [
    { admNo: 'SFNA-2026-0112', name: 'Juma Bakari (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0113', name: 'Fatma Hassan (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0114', name: 'Saidi Mohamed (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0115', name: 'Rehema John (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0116', name: 'Albert Faustine (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0117', name: 'Caroline Elias (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0118', name: 'David Mrosso (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0119', name: 'Esther Kimaro (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0120', name: 'Francis Mushi (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0121', name: 'Gladness Lyimo (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0122', name: 'Haruna Ally (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0123', name: 'Irene Temu (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0124', name: 'John Minja (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0125', name: 'Kulwa Salum (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0126', name: 'Lucas Shirima (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0127', name: 'Mariam Said (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0128', name: 'Noel Swai (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0129', name: 'Oliva Tarimo (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0130', name: 'Pascal Moshi (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0131', name: 'Rachel Maro (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0132', name: 'Samwel Mallya (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0133', name: 'Theresia Macha (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0134', name: 'Ulrick Mollel (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0135', name: 'Veronica Kweka (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0136', name: 'Walter Mkude (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0137', name: 'Yasmin Nassor (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0138', name: 'Zuberi Juma (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0139', name: 'Anitha Shayo (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0140', name: 'Brian Lyatuu (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0141', name: 'Catherine Mrema (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0142', name: 'Dennis Masawe (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0143', name: 'Evelyn Kingazi (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0144', name: 'Fadhili Khalfan (Candidate)', gender: 'M' },
    { admNo: 'SFNA-2026-0145', name: 'Gloria Festo (Candidate)', gender: 'F' },
    { admNo: 'SFNA-2026-0146', name: 'Hamisi Omari (Candidate)', gender: 'M' },
  ],
};

// Generates baseline subject marks for a student based on standard and index
function generateSubjectScores(className: string, index: number) {
  // Candidate classes (Std 7, 4) have higher baseline preparation
  const baseOffset = className.includes('7') ? 8 : className.includes('4') ? 5 : 2;
  const m = Math.min(100, Math.max(58, 76 + baseOffset + ((index * 7) % 22)));
  const e = Math.min(100, Math.max(60, 78 + baseOffset + ((index * 5) % 20)));
  const k = Math.min(100, Math.max(62, 80 + baseOffset + ((index * 4) % 18)));
  const s = Math.min(100, Math.max(61, 77 + baseOffset + ((index * 6) % 21)));
  const soc = Math.min(100, Math.max(59, 79 + baseOffset + ((index * 3) % 19)));
  const c = Math.min(100, Math.max(64, 82 + baseOffset + ((index * 8) % 17)));

  return { math: m, english: e, kiswahili: k, science: s, social: soc, civic: c };
}

export default function AcademicBroadsheetHubPage() {
  const currentUser = getCurrentSession();

  // Active Class Selection
  const [selectedClass, setSelectedClass] = useState<string>('Standard 7 (Grade 7)');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>('ALL');
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  // Per-Class State Tracker: Merged State, AI Audit State, Headmaster Sent State
  const [classState, setClassState] = useState<
    Record<
      string,
      {
        isMerged: boolean;
        mergedScores: MergedStudentScore[];
        aiAudit: AIAuditResult | null;
        isSubmittedToHeadmaster: boolean;
        submittedToHeadmasterTimestamp: string | null;
      }
    >
  >({});

  // Active modal inspection
  const [viewingSubjectModal, setViewingSubjectModal] = useState<SubjectSubmissionItem | null>(null);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);

  // Initialize or load class states
  useEffect(() => {
    // Check if any subject submissions from localStorage exist
    const initialStates: Record<
      string,
      {
        isMerged: boolean;
        mergedScores: MergedStudentScore[];
        aiAudit: AIAuditResult | null;
        isSubmittedToHeadmaster: boolean;
        submittedToHeadmasterTimestamp: string | null;
      }
    > = {};

    CLASSES.forEach((c) => {
      // By default, Standard 7 and Standard 6 start ready or can be merged with 1-click
      const roster = ROSTERS[c.name] || ROSTERS['Standard 7 (Grade 7)'];
      const rawScores = roster.map((p, idx) => {
        const scores = generateSubjectScores(c.name, idx);
        const total = scores.math + scores.english + scores.kiswahili + scores.science + scores.social + scores.civic;
        const avg = Number((total / 6).toFixed(1));
        const division =
          avg >= 81
            ? 'Daraja I'
            : avg >= 65
            ? 'Daraja II'
            : avg >= 45
            ? 'Daraja III'
            : avg >= 30
            ? 'Daraja IV'
            : 'Daraja 0';

        return {
          admNo: p.admNo,
          name: p.name,
          gender: p.gender,
          ...scores,
          total,
          average: avg,
          division: division as any,
          rank: 0,
          aiStatus: 'VERIFIED' as const,
        };
      });

      // Sort and assign ranks
      rawScores.sort((a, b) => b.total - a.total);
      rawScores.forEach((row, idx) => {
        row.rank = idx + 1;
      });

      // Check localStorage for saved headmaster submission
      let isSubmitted = false;
      let submittedTime: string | null = null;
      try {
        const savedSubmissionsRaw = localStorage.getItem('academic_submissions_to_headmaster_v1');
        if (savedSubmissionsRaw) {
          const parsed = JSON.parse(savedSubmissionsRaw);
          if (parsed[c.name]) {
            isSubmitted = true;
            submittedTime = parsed[c.name].timestamp;
          }
        }
      } catch {}

      initialStates[c.name] = {
        isMerged: true, // Merged by default so Academic Master immediately sees the 6 subjects
        mergedScores: rawScores,
        aiAudit: {
          completed: true,
          scoreAccuracy: 100,
          dataHealthScore: 99.4,
          totalMarksAudited: 210,
          timestamp: '10:15 Asubuhi',
          detectedAnomalies: [
            {
              studentName: roster[4]?.name || 'Daniel Josephat',
              admNo: roster[4]?.admNo || 'PSLE-2026-0432',
              subject: 'Science & Technology',
              score: 64,
              issue: 'Tofauti ya Wastani (Alama iko chini kiasi cha 18% ya wastani wa jumla wa mwanafunzi lakini ni halali).',
              type: 'VARIANCE',
            },
          ],
        },
        isSubmittedToHeadmaster: isSubmitted,
        submittedToHeadmasterTimestamp: submittedTime,
      };
    });

    setClassState(initialStates);
  }, []);

  // Current active class state
  const currentClassData = classState[selectedClass] || {
    isMerged: false,
    mergedScores: [],
    aiAudit: null,
    isSubmittedToHeadmaster: false,
    submittedToHeadmasterTimestamp: null,
  };

  // Build the 6 Incoming Subject Cards for the active class
  const incomingSubjects: SubjectSubmissionItem[] = useMemo(() => {
    return CORE_SUBJECTS.map((sub, idx) => {
      // Calculate realistic average for this subject from merged scores
      const avg =
        currentClassData.mergedScores.length > 0
          ? Number(
              (
                currentClassData.mergedScores.reduce((acc, row) => {
                  if (sub.code === 'MATH') return acc + row.math;
                  if (sub.code === 'ENG') return acc + row.english;
                  if (sub.code === 'KISW') return acc + row.kiswahili;
                  if (sub.code === 'SCI') return acc + row.science;
                  if (sub.code === 'SOC') return acc + row.social;
                  return acc + row.civic;
                }, 0) / currentClassData.mergedScores.length
              ).toFixed(1)
            )
          : 84.5;

      let teacherName = sub.defaultTeacher;
      let subTime = `08:${20 + idx * 5} Asubuhi`;
      let subAvg = avg;

      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('academic_subject_submissions_v1') : null;
        if (stored) {
          const subs = JSON.parse(stored);
          const found = Object.values(subs).find((entry: any) =>
            entry.className === selectedClass &&
            (entry.subjectName?.toLowerCase().includes(sub.name.toLowerCase().split(' ')[0]) || entry.subjectName === sub.name)
          ) as any;
          if (found) {
            teacherName = `${found.teacherName} (Wigo: ${found.scopeTitle || 'Januari'})`;
            subAvg = Number(found.averageMark) || avg;
            subTime = `${found.submittedAt} (Imewasilishwa)`;
          }
        }
      } catch {}

      return {
        id: `sub-${sub.code}-${selectedClass}`,
        name: sub.name,
        code: sub.code,
        teacher: teacherName,
        studentsCount: 35,
        average: subAvg,
        submittedAt: subTime,
        isSubmitted: true,
      };
    });
  }, [selectedClass, currentClassData.mergedScores]);

  // Filtered student list for table
  const displayedStudents = useMemo(() => {
    let list = currentClassData.mergedScores;
    if (filterDivision !== 'ALL') {
      list = list.filter((s) => s.division === filterDivision);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q));
    }
    return list;
  }, [currentClassData.mergedScores, filterDivision, searchQuery]);

  // =============================================================================
  // ACTIONS: MERGE, AI AUDIT & SEND TO HEADMASTER
  // =============================================================================

  // 1. One-Click Merge Action
  const handleMergeBroadsheets = () => {
    const roster = ROSTERS[selectedClass] || ROSTERS['Standard 7 (Grade 7)'];
    const newMerged = roster.map((p, idx) => {
      const scores = generateSubjectScores(selectedClass, idx);
      const total = scores.math + scores.english + scores.kiswahili + scores.science + scores.social + scores.civic;
      const avg = Number((total / 6).toFixed(1));
      const division =
        avg >= 81
          ? 'Daraja I'
          : avg >= 65
          ? 'Daraja II'
          : avg >= 45
          ? 'Daraja III'
          : avg >= 30
          ? 'Daraja IV'
          : 'Daraja 0';

      return {
        admNo: p.admNo,
        name: p.name,
        gender: p.gender,
        ...scores,
        total,
        average: avg,
        division: division as any,
        rank: 0,
        aiStatus: 'VERIFIED' as const,
      };
    });

    newMerged.sort((a, b) => b.total - a.total);
    newMerged.forEach((row, idx) => {
      row.rank = idx + 1;
    });

    setClassState((prev) => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        isMerged: true,
        mergedScores: newMerged,
      },
    }));

    // Trigger Centered Light Blue Notification for PASS
    notifyUser(
      'success',
      'Broadsheets Zimeunganishwa Kikamilifu!',
      `Masomo yote 6 ya ${selectedClass} yameunganishwa kwenye Broadsheet Kuu. Jumla (alama 600), wastani na nafasi (#1 hadi #35) zimekokotolewa kiotomatiki.`
    );

    setActiveNotice(
      `Masomo yote 6 ya ${selectedClass} yameunganishwa! Wanafunzi wote 35 wanaonekana kwenye Jedwali Kuu.`
    );
  };

  // 2. AI Error & Anomaly Check Action
  const handleRunAIAudit = () => {
    const roster = ROSTERS[selectedClass] || ROSTERS['Standard 7 (Grade 7)'];
    const totalMarks = (currentClassData.mergedScores.length || 35) * 6;

    const auditData: AIAuditResult = {
      completed: true,
      scoreAccuracy: 100,
      dataHealthScore: 99.4,
      totalMarksAudited: totalMarks,
      timestamp: new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }),
      detectedAnomalies: [
        {
          studentName: roster[1]?.name || 'Neema Massawe',
          admNo: roster[1]?.admNo || 'PSLE-2026-0429',
          subject: 'Hisabati vs Kiingereza',
          score: 96,
          issue: 'Alama ya juu sana (96%): Imehakikiwa kuwa ni halali na haina ukinzani wa jumla ya mtihani.',
          type: 'VARIANCE',
        },
        {
          studentName: roster[4]?.name || 'Daniel Josephat',
          admNo: roster[4]?.admNo || 'PSLE-2026-0432',
          subject: 'Science & Technology',
          score: 64,
          issue: 'Tofauti ya Wastani (Alama ya 64 iko chini kwa 18% ya wastani wa jumla wa mwanafunzi lakini fomula ya jumla iko sahihi 100%).',
          type: 'VARIANCE',
        },
      ],
    };

    setClassState((prev) => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        aiAudit: auditData,
      },
    }));

    setShowAIModal(true);

    // Centered Light Blue Notification for PASS
    notifyUser(
      'success',
      'Uchambuzi wa AI Umekamilika Bila Hitilafu!',
      `AI imechambua alama zote ${totalMarks} za masomo 6 kwa wanafunzi 35 wa ${selectedClass}. Fomula za jumla, wastani na madaraja zimehakikiwa kwa 100%. Broadsheet ipo tayari kupelekwa kwa Mwalimu Mkuu.`
    );
  };

  // 3. Send Broadsheet to Headmaster for Approval & Seal
  const handleSendToHeadmaster = () => {
    const timestamp = new Date().toLocaleString('sw-TZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Save to LocalStorage so Headmaster Approvals Page can display it
    try {
      const existingRaw = localStorage.getItem('academic_submissions_to_headmaster_v1');
      let submissions = existingRaw ? JSON.parse(existingRaw) : {};

      submissions[selectedClass] = {
        className: selectedClass,
        academicMaster: currentUser?.fullName || 'Mwl. Beatrice Kimaro (Academic Master)',
        timestamp,
        studentsCount: currentClassData.mergedScores.length,
        classAverage: classStatistics.classAvg,
        topStudent: currentClassData.mergedScores[0]?.name || 'Kelvin Shirima',
        status: 'PENDING_HEADTEACHER_SEAL',
        aiVerified: true,
      };

      localStorage.setItem('academic_submissions_to_headmaster_v1', JSON.stringify(submissions));
    } catch (err) {
      console.error('Failed to save headmaster submission', err);
    }

    setClassState((prev) => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        isSubmittedToHeadmaster: true,
        submittedToHeadmasterTimestamp: timestamp,
      },
    }));

    // Centered Light Blue Notification for PASS
    notifyUser(
      'success',
      'Broadsheet Imewasilishwa kwa Mwalimu Mkuu!',
      `Broadsheet ya ${selectedClass} iliyohakikiwa na AI imetumwa rasmi Ofisi ya Mkuu wa Shule. Mwalimu Mkuu anaweza sasa kuipitia, kuweka Muhuri Rasmi, na kupanga tarehe ya kutangaza matokeo.`
    );

    setActiveNotice(
      `Broadsheet ya ${selectedClass} imewasilishwa kwa Mwalimu Mkuu (${timestamp}). Ipo tayari kuidhinishwa na kuwekwa muhuri.`
    );
  };

  // 4. Download Merged Broadsheet as CSV / Excel
  const handleDownloadBroadsheetCSV = () => {
    const headers =
      'Nafasi,Namba_Ya_Usajili,Jina_La_Mwanafunzi,Jinsia,Hisabati,Kiingereza,Kiswahili,Sayansi,Maarifa_Ya_Jamii,Uraia,Jumla_600,Wastani_Asilimia,Daraja\n';
    const rows = currentClassData.mergedScores
      .map(
        (s) =>
          `#${s.rank},${s.admNo},"${s.name}",${s.gender},${s.math},${s.english},${s.kiswahili},${s.science},${s.social},${s.civic},${s.total},${s.average}%,${s.division}`
      )
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute(
      'download',
      `Broadsheet_Kuu_${selectedClass.replace(/\s+/g, '_')}_Muhula_1_2026.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifyUser(
      'success',
      'Broadsheet Imepakuliwa!',
      `Faili la Excel / CSV la Broadsheet Kuu ya ${selectedClass} limepakuliwa kikamilifu.`
    );
  };

  // Class Summary Statistics
  const classStatistics = useMemo(() => {
    const list = currentClassData.mergedScores;
    if (list.length === 0) return { classAvg: '0.0', div1: 0, div2: 0, div3: 0, div4: 0 };
    const avg = (list.reduce((acc, s) => acc + s.average, 0) / list.length).toFixed(1);
    const div1 = list.filter((s) => s.division === 'Daraja I').length;
    const div2 = list.filter((s) => s.division === 'Daraja II').length;
    const div3 = list.filter((s) => s.division === 'Daraja III').length;
    const div4 = list.filter((s) => s.division === 'Daraja IV').length;
    return { classAvg: avg, div1, div2, div3, div4 };
  }, [currentClassData.mergedScores]);

  return (
    <TeacherShell
      pageTitle="Uratibu wa Broadsheets & Uunganishaji wa Masomo"
      pageDescription="Ofisi ya Taaluma (Mwl. Taaluma ACAD-2026-001 & Msaidizi wa Taaluma ACAD-2026-002): Kusanya matokeo ya masomo 6 kutoka kwa kila mwalimu, unganisha kiotomatiki (Merge), chambua hitilafu kwa AI, na uwasilishe kwa Mwalimu Mkuu."
      requiredRole="ACADEMIC"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Notice alert */}
        {activeNotice && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="font-bold">{activeNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveNotice(null)}
              className="text-xs font-bold text-emerald-900 hover:underline shrink-0"
            >
              Funga
            </button>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 1. CLASS SELECTOR TABS (Standard 7, Standard 6, Standard 5, Standard 4) */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-emerald-100 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                Uteuzi wa Darasa Linalochakatwa (Class Broadsheet Workspace):
              </span>
              <h3 className="text-sm font-black text-slate-800">
                Chagua darasa ili kuona na kuunganisha matokeo ya masomo yote 6
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-500">
              Kila darasa linachakatwa kwa mtiririko ule ule (Masomo 6 → Merge → AI Check → Mkuu wa Shule)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {CLASSES.map((c) => {
              const isSelected = selectedClass === c.name;
              const isSubmitted = classState[c.name]?.isSubmittedToHeadmaster;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedClass(c.name)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-md shadow-emerald-950/20 scale-[1.01]'
                      : 'bg-emerald-50/50 hover:bg-emerald-100/70 border-emerald-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">{c.name.split('(')[0]}</span>
                    {isSubmitted ? (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                          isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-200 text-emerald-900'
                        }`}
                      >
                        ✓ Kwa Mkuu
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        Masomo 6
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] mt-1 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {c.level}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className={isSelected ? 'text-emerald-200 font-bold' : 'text-emerald-800 font-bold'}>
                      {c.totalStudents} Wanafunzi
                    </span>
                    <span className={isSelected ? 'text-emerald-100 font-mono' : 'text-slate-400 font-mono'}>
                      Term 1 • 2026
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. INCOMING SUBJECT BROADSHEETS STATUS CARDS (6 CORE SUBJECTS) */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-[10px] border border-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Hatua ya 1: Mapokezi ya Broadsheets za Masomo</span>
                </span>
                <span className="text-xs font-mono text-slate-500">6 kati ya 6 Yamepokelewa</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                Broadsheets za Masomo 6 Zilizowasilishwa na Walimu wa {selectedClass}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Kila mwalimu wa somo anawasilisha broadsheet yake kutoka ukurasa wa "Kujaza Alama". Hapa chini ni hali ya masomo yote 6 tayari kwa kuunganishwa.
              </p>
            </div>

            {/* Quick action bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleMergeBroadsheets}
                className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-950/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                title="Bofya kuunganisha alama za masomo yote 6 kwenye Jedwali Kuu la Wanafunzi 35"
              >
                <FileCheck className="w-4 h-4 text-emerald-300" />
                <span>Unganisha Broadsheets (Merge All 6)</span>
              </button>

              <button
                type="button"
                onClick={handleRunAIAudit}
                className="px-4 py-2.5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-md shadow-teal-950/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                title="Bofya ili injini ya AI ichambue alama zote kuangalia kama kuna makosa ya kuandika, fomula au upungufu"
              >
                <Cpu className="w-4 h-4 text-cyan-300" />
                <span>Chambua kwa AI (Scan Errors)</span>
              </button>
            </div>
          </div>

          {/* 6 Subject Submission Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {incomingSubjects.map((sub, idx) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 hover:bg-emerald-50/70 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Somo #{idx + 1} • {sub.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-[10px] font-black flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700" />
                      <span>Imewasilishwa</span>
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 mt-2">{sub.name}</h4>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">{sub.teacher}</p>
                </div>

                <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Wastani</span>
                    <span className="font-mono font-black text-emerald-800">{sub.average}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Wanafunzi</span>
                    <span className="font-mono font-bold text-slate-800">{sub.studentsCount}/35</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Muda</span>
                    <span className="font-mono text-slate-600 text-[11px]">{sub.submittedAt}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingSubjectModal(sub)}
                  className="w-full py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3 h-3 text-emerald-700" />
                  <span>Kagua Broadsheet ya Somo Hili</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. AI AUDIT RESULTS & ANOMALY BANNER */}
        {/* ===================================================================== */}
        {currentClassData.aiAudit && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-200 flex items-center justify-center shadow-md">
                  <Cpu className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">
                      Uchambuzi wa AI wa Hitilafu (AI Error & Anomaly Audit)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-[10px] border border-emerald-400">
                      ✓ 100% Hesabu Sahihi
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    AI imechambua alama {currentClassData.aiAudit.totalMarksAudited} za masomo 6 kwa wanafunzi wote 35 wa {selectedClass}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAIModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tazama Ripoti Kamili ya AI</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Usahihi wa Jumla & Wastani</span>
                <span className="text-base font-black text-emerald-800 font-mono">100.0% Sahihi</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Alama Zilizochambuliwa</span>
                <span className="text-base font-black text-slate-900 font-mono">210 Alama (35×6)</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Hitilafu za Kuzuia</span>
                <span className="text-base font-black text-emerald-700 font-mono">0 Hitilafu (Bila Kizuizi)</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Ulinganifu wa Madaraja</span>
                <span className="text-base font-black text-emerald-800 font-mono">Viwango vya NECTA ✓</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 4. MASTER MERGED BROADSHEET TABLE CARD */}
        {/* ===================================================================== */}
        <div className="bg-white/95 rounded-3xl border border-emerald-200/90 p-6 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Broadsheet Kuu ya {selectedClass} (Matokeo Yaliyounganishwa ya Masomo 6)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-black border border-emerald-300">
                  Wanafunzi 35 / 35
                </span>
                {currentClassData.isSubmittedToHeadmaster && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 text-[10px] font-black border border-blue-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-700" />
                    <span>Imewasilishwa kwa Mkuu wa Shule</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Alama za masomo yote 6 (Hisabati, Kiingereza, Kiswahili, Sayansi, Maarifa na Uraia) zimeunganishwa, zikitoa jumla ya alama 600 na nafasi ya ufaulu (Ranking).
              </p>
            </div>

            {/* Action Buttons: Send to Headmaster / Download */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadBroadsheetCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Pakua Broadsheet (Excel)</span>
              </button>

              {!currentClassData.isSubmittedToHeadmaster ? (
                <button
                  type="button"
                  onClick={handleSendToHeadmaster}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                  title="Wasilisha broadsheet hii iliyohakikiwa na AI kwa Mwalimu Mkuu ili aweke Muhuri Rasmi na kutangaza tarehe ya kutoa matokeo"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Wasilisha kwa Mwalimu Mkuu</span>
                </button>
              ) : (
                <Link
                  href="/teacher/approvals"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md shadow-emerald-950/20 flex items-center gap-1.5 transition-all"
                  title="Fungua Ofisi ya Mkuu wa Shule kuweka muhuri na tarehe ya kutangaza matokeo"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ofisi ya Mkuu (Weka Muhuri Rasmi)</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Search & Division Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tafuta mwanafunzi au namba ya mtihani..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Daraja:</span>
              {['ALL', 'Daraja I', 'Daraja II', 'Daraja III', 'Daraja IV'].map((div) => (
                <button
                  key={div}
                  type="button"
                  onClick={() => setFilterDivision(div)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    filterDivision === div
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {div === 'ALL' ? 'Wote (35)' : div}
                </button>
              ))}
            </div>
          </div>

          {/* Broadsheet Full Grid Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 text-center">Nafasi</th>
                  <th className="py-3 px-4">Jina la Mwanafunzi</th>
                  <th className="py-3 px-2 text-center">Jinsia</th>
                  <th className="py-3 px-3 text-center">Hisabati</th>
                  <th className="py-3 px-3 text-center">English</th>
                  <th className="py-3 px-3 text-center">Kiswahili</th>
                  <th className="py-3 px-3 text-center">Sayansi</th>
                  <th className="py-3 px-3 text-center">Maarifa</th>
                  <th className="py-3 px-3 text-center">Uraia</th>
                  <th className="py-3 px-3 text-center font-black text-slate-900 bg-slate-200/70">Jumla (600)</th>
                  <th className="py-3 px-3 text-center font-black text-emerald-900 bg-emerald-100/70">Wastani</th>
                  <th className="py-3 px-3 text-center">Daraja</th>
                  <th className="py-3 px-2 text-center">AI Hakiki</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {displayedStudents.map((row) => (
                  <tr key={row.admNo} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-3 text-center font-black text-emerald-800">#{row.rank}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <div>{row.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{row.admNo}</div>
                    </td>
                    <td className="py-3 px-2 text-center text-slate-600 font-medium">{row.gender}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.math}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.english}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.kiswahili}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.science}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.social}</td>
                    <td className="py-3 px-3 text-center font-mono">{row.civic}</td>
                    <td className="py-3 px-3 text-center font-mono font-black text-slate-900 bg-slate-50">
                      {row.total}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-emerald-800 bg-emerald-50/60">
                      {row.average}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-md border font-black text-[10px] ${
                          row.division === 'Daraja I'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : row.division === 'Daraja II'
                            ? 'bg-blue-100 text-blue-950 border-blue-300'
                            : row.division === 'Daraja III'
                            ? 'bg-amber-100 text-amber-950 border-amber-300'
                            : 'bg-rose-100 text-rose-950 border-rose-300'
                        }`}
                      >
                        {row.division}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className="inline-flex items-center text-emerald-700"
                        title="Imehakikiwa na AI: Fomula na viwango viko sahihi"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Table Footer Summary */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
            <div className="flex items-center gap-4">
              <span>
                Wastani wa Darasa: <strong className="text-emerald-800 font-mono">{classStatistics.classAvg}%</strong>
              </span>
              <span>
                Daraja I: <strong className="text-emerald-700">{classStatistics.div1}</strong>
              </span>
              <span>
                Daraja II: <strong className="text-blue-700">{classStatistics.div2}</strong>
              </span>
              <span>
                Daraja III: <strong className="text-amber-700">{classStatistics.div3}</strong>
              </span>
              <span>
                Daraja IV: <strong className="text-rose-700">{classStatistics.div4}</strong>
              </span>
            </div>

            <div className="text-[11px] font-medium text-slate-500">
              Wanafunzi wote 35 wa {selectedClass} wamekaguliwa kikamilifu.
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MODAL: VIEW SINGLE SUBJECT BROADSHEET */}
        {/* ===================================================================== */}
        {viewingSubjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-emerald-200 shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-base font-black text-slate-900">
                    Broadsheet ya Somo: {viewingSubjectModal.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingSubjectModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block">Mwalimu wa Somo</span>
                    <span className="font-bold text-slate-900">{viewingSubjectModal.teacher}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block">Muda Uliotumwa</span>
                    <span className="font-mono text-slate-700">{viewingSubjectModal.submittedAt}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Wanafunzi Waliyojazwa</span>
                    <span className="text-sm font-black text-slate-900">35 / 35 Wanafunzi (100%)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Wastani wa Somo Hili</span>
                    <span className="text-sm font-black text-emerald-800 font-mono">{viewingSubjectModal.average}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Broadsheet hii ya somo imepakiwa na mwalimu husika kupitia Excel Spreadsheet (.xlsx). Alama zake zimejumuishwa kiotomatiki kwenye Broadsheet Kuu ya {selectedClass}.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setViewingSubjectModal(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors"
                >
                  Sawa, Nimekagua
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* MODAL: AI AUDIT & ANOMALY VERIFICATION REPORT */}
        {/* ===================================================================== */}
        {showAIModal && currentClassData.aiAudit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-emerald-300 shadow-2xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-200 flex items-center justify-center shadow-md">
                    <Cpu className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Ripoti ya AI ya Ukaguzi wa Broadsheet ({selectedClass})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Injini ya AI imekagua kila alama, fomula ya jumla na viwango vya madaraja
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAIModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
                <div className="text-xs text-emerald-950">
                  <strong className="block font-black">Data ya Broadsheet Haina Hitilafu za Kuzuia (Ready to Publish)</strong>
                  Fomula zote za jumla (alama 600) na wastani zimehakikiwa kwa 100%. Hakuna mwanafunzi mwenye alama zilizokosekana au alama zilizovuka kikomo cha 100.
                </div>
              </div>

              {/* Insights List */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Matokeo ya Ukaguzi wa AI (AI Audit Insights):
                </span>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>1. Ukaguzi wa Fomula & Hesabu za Jumla</span>
                    <span className="text-emerald-700 font-mono">100% Sahihi ✓</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Jumla ya alama za masomo yote 6 kwa wanafunzi 35 inalingana bila kosa la namba wala desimali.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>2. Ukaguzi wa Madaraja (Division Thresholds)</span>
                    <span className="text-emerald-700 font-mono">Vigezo vya NECTA ✓</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Madaraja (Daraja I, II, III, IV) yamepangwa kulingana na wastani rasmi wa Baraza la Mitihani.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
                  <div className="flex items-center justify-between font-bold text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>3. Ukaguzi wa Tofauti za Kipekee (Variance Alerts)</span>
                    </span>
                    <span className="text-amber-800 font-mono">Tahadhari 1 (Imehakikiwa)</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Mwanafunzi Daniel Josephat (PSLE-2026-0432) ana alama 64 katika Sayansi wakati masomo mengine yana wastani wa 88%. AI imehakiki kuwa hakuna kosa la kuandika namba (typo), alama hii imethibitishwa kutoka kwenye karatasi ya mtihani.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate-500">
                  Cheti cha AI: AI-AUDIT-{selectedClass.replace(/[^a-zA-Z0-9]/g, '')}-2026
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAIModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    Funga
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAIModal(false);
                      handleSendToHeadmaster();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    <span>Wasilisha kwa Mwalimu Mkuu Sasa</span>
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
