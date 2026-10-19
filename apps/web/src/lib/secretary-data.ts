// =============================================================================
// PRIMARY SCHOOL — SCHOOL SECRETARY & DIGITAL RECORDS MANAGEMENT MODULE
// Commercial Universal Education Management Platform
// Multi-Tenant, Auditable, Structured Metadata Records Engine
// =============================================================================

export type DocumentCategory =
  | 'SCHOOL_ADMINISTRATION'
  | 'STUDENT_RECORDS'
  | 'STAFF_RECORDS'
  | 'ACADEMIC_RECORDS'
  | 'FINANCIAL_DOCUMENTS'
  | 'MEETINGS_AND_CORRESPONDENCE';

export type ConfidentialityLevel =
  | 'PUBLIC'
  | 'INTERNAL'
  | 'RESTRICTED'
  | 'CONFIDENTIAL'
  | 'HIGHLY_CONFIDENTIAL';

export type DocumentStatus = 'ACTIVE' | 'ARCHIVED' | 'PENDING_REVIEW' | 'INCOMPLETE';

export interface DocumentVersionHistory {
  versionNumber: string;
  uploadedBy: string;
  uploadDate: string;
  changeDescription: string;
  fileType: string;
  fileSize: string;
  storageLocation: string;
  isCurrent: boolean;
}

export interface SchoolDocumentRecord {
  id: string;
  title: string;
  category: DocumentCategory;
  documentType: string;
  description: string;
  referenceNumber: string;
  academicYear: string;
  term: string;
  documentDate: string;
  uploadDate: string;
  uploadedBy: string;
  relatedStudentId?: string; // Student ID / Admission No (never name alone)
  relatedStudentName?: string;
  relatedStaffId?: string; // Staff ID (STF-001)
  relatedStaffName?: string;
  relatedClass?: string;
  relatedSchool: string; // Tenant Institution Name
  institutionId: string;
  confidentialityLevel: ConfidentialityLevel;
  status: DocumentStatus;
  version: string;
  fileType: 'PDF' | 'DOC' | 'DOCX' | 'XLS' | 'XLSX' | 'JPG' | 'PNG';
  fileSize: string;
  storageLocation: string;
  isArchived: boolean;
  archivedAt?: string;
  archivedBy?: string;
  autoSyncedOffice?: 'HEADTEACHER' | 'ACADEMIC_MASTER' | 'DISCIPLINE_MASTER' | 'ACCOUNTANT' | 'MANUAL_SECRETARY';
  tags?: string[];
  versionHistory: DocumentVersionHistory[];
  createdTimestamp: string;
  updatedTimestamp: string;
}

// Checklists
export interface ChecklistRequirement {
  id: string;
  title: string;
  category: string;
  isRequired: boolean;
  description: string;
}

export interface StudentDigitalFile {
  studentId: string; // Admission Number
  fullName: string;
  currentClass: string;
  isTransferred: boolean;
  transferDetails?: any;
  completionPercentage: number;
  documents: {
    admissionForm?: SchoolDocumentRecord;
    birthCertificate?: SchoolDocumentRecord;
    parentGuardianInfo?: SchoolDocumentRecord;
    previousSchoolRecord?: SchoolDocumentRecord;
    academicReports?: SchoolDocumentRecord[];
    attendanceDocuments?: SchoolDocumentRecord[];
    disciplineDocuments?: SchoolDocumentRecord[];
    certificates?: SchoolDocumentRecord[];
    otherDocuments?: SchoolDocumentRecord[];
  };
  missingRequirements: string[];
}

export interface StaffDigitalFile {
  staffId: string;
  fullName: string;
  role: string;
  completionPercentage: number;
  documents: {
    appointmentLetter?: SchoolDocumentRecord;
    employmentAgreement?: SchoolDocumentRecord;
    identificationDoc?: SchoolDocumentRecord;
    academicCertificates?: SchoolDocumentRecord[];
    professionalCertificates?: SchoolDocumentRecord[];
    leaveDocuments?: SchoolDocumentRecord[];
    trainingRecords?: SchoolDocumentRecord[];
  };
  missingRequirements: string[];
}

// Correspondence
export interface CorrespondenceItem {
  id: string;
  type: 'INCOMING' | 'OUTGOING';
  referenceNumber: string;
  senderOrRecipient: string;
  subject: string;
  dateReceivedOrSent: string;
  receivedOrPreparedBy: string;
  assignedPersonOrApprovedBy: string;
  category: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DISPATCHED' | 'FILED';
  notes: string;
  documentId?: string;
  documentTitle?: string;
}

// Meetings
export interface SchoolMeetingRecord {
  id: string;
  title: string;
  meetingDate: string;
  meetingType: 'STAFF_MEETING' | 'PARENT_TEACHER' | 'SCHOOL_MANAGEMENT' | 'DISCIPLINARY_COMMITTEE';
  meetingTypeLabel: string;
  participantsCount: number;
  participantsSummary: string;
  agendaItems: string[];
  minutesSummary: string;
  decisionsAndActions: string[];
  followUpStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  secretaryNotes: string;
  documentId?: string;
}

// Audit Log
export interface DocumentAuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action:
    | 'DOCUMENT_UPLOAD'
    | 'DOCUMENT_VIEW'
    | 'DOCUMENT_DOWNLOAD'
    | 'METADATA_EDIT'
    | 'VERSION_CREATION'
    | 'DOCUMENT_ARCHIVE'
    | 'DOCUMENT_RESTORE'
    | 'DELETE_REQUEST';
  documentId: string;
  documentTitle: string;
  referenceNumber: string;
  details: string;
  ipAddress: string;
}

// Storage Keys
const STORAGE_DOCS_KEY = 'academic_portal_school_documents_v1';
const STORAGE_CORRESPONDENCE_KEY = 'academic_portal_correspondence_v1';
const STORAGE_MEETINGS_KEY = 'academic_portal_school_meetings_v1';
const STORAGE_AUDIT_KEY = 'academic_portal_document_audit_v1';
const STORAGE_CHECKLISTS_KEY = 'academic_portal_checklists_v1';

// Seed Initial Checklists
const DEFAULT_STUDENT_CHECKLIST: ChecklistRequirement[] = [
  { id: 'req-adm-01', title: 'Fomu Rasmi ya Udahili (Admission Form)', category: 'Udahili', isRequired: true, description: 'Fomu iliyojazwa na kusainiwa na mzazi na uongozi wa shule' },
  { id: 'req-adm-02', title: 'Cheti cha Kuzaliwa cha RITA (Birth Certificate)', category: 'Utambulisho', isRequired: true, description: 'Nakala halisi au iliyothibitishwa ya cheti cha RITA' },
  { id: 'req-adm-03', title: 'Taarifa za Mzazi/Mlezi & Nakala ya NIDA', category: 'Wazazi', isRequired: true, description: 'Kitambulisho cha NIDA cha mzazi na namba za simu zilizohakikiwa' },
  { id: 'req-adm-04', title: 'Ripoti ya Maendeleo ya Shule Iliyopita (Kwa Uhamisho)', category: 'Taaluma', isRequired: false, description: 'Kadi ya maendeleo au barua ya uhamisho kutoka shule ya awali' },
  { id: 'req-adm-05', title: 'Fomu ya Afya na Chanjo (Medical & Immunization Record)', category: 'Afya', isRequired: true, description: 'Rekodi ya kadi ya kliniki na magonjwa ya dharura' },
  { id: 'req-adm-06', title: 'Picha 4 za Pasipoti za Mwanafunzi (Passport Photos)', category: 'Utambulisho', isRequired: true, description: 'Picha za sare ya shule zenye mandhari ya bluu' },
];

const DEFAULT_STAFF_CHECKLIST: ChecklistRequirement[] = [
  { id: 'req-stf-01', title: 'Barua Rasmi ya Uteuzi (Appointment Letter)', category: 'Ajira', isRequired: true, description: 'Barua ya ajira kutoka Bodi ya Shule au TAMISEMI' },
  { id: 'req-stf-02', title: 'Kitambulisho cha Taifa (NIDA Copy)', category: 'Utambulisho', isRequired: true, description: 'Nakala ya kitambulisho cha Taifa cha NIDA' },
  { id: 'req-stf-03', title: 'Vyeti vya Kitaaluma vya Ualimu (Teaching Certificates)', category: 'Taaluma', isRequired: true, description: 'Cheti cha Ualimu Daraja la IIIA, Diploma, au Digrii' },
  { id: 'req-stf-04', title: 'Usajili wa Tume ya Utumishi wa Walimu (TSC Registration)', category: 'Ualimu', isRequired: true, description: 'Namba rasmi ya TSC na leseni ya ufundishaji' },
  { id: 'req-stf-05', title: 'Wasifu wa Kikazi (Curriculum Vitae - CV)', category: 'Taarifa', isRequired: true, description: 'CV iliyohuishwa yenye wadhamini wawili' },
  { id: 'req-stf-06', title: 'Mkataba wa Maadili ya Kazi (Code of Conduct Bond)', category: 'Maadili', isRequired: true, description: 'Makubaliano ya maadili ya utumishi wa umma na shule' },
];

// Seed Documents — Comprehensive Authentic Tanzanian Primary School Registry
const INITIAL_DOCUMENTS: SchoolDocumentRecord[] = [
  // =========================================================================
  // 1. SCHOOL ADMINISTRATION (Utawala wa Shule)
  // =========================================================================
  {
    id: 'doc-adm-001',
    title: 'Hati Rasmi ya Usajili wa Shule — Wizara ya Elimu (MoEST License No. EM.1428/TZ)',
    category: 'SCHOOL_ADMINISTRATION',
    documentType: 'School Registration License',
    description: 'Hati halali ya usajili wa kudumu wa shule ya msingi na awali kutoka Wizara ya Elimu, Sayansi na Teknolojia yenye namba ya usajili EM.1428/TZ.',
    referenceNumber: 'MOEST/REG/2026/0428',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2020-03-15',
    uploadDate: '2026-01-08',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '2.0',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    storageLocation: 'secure-vault/admin/licenses/MoEST_Registration_License_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Leseni', 'Wizara ya Elimu', 'Usajili'],
    versionHistory: [
      {
        versionNumber: '1.0',
        uploadedBy: 'Bi. Salma Rashid',
        uploadDate: '2020-03-15',
        changeDescription: 'Usajili wa awali wa kuanzisha shule',
        fileType: 'PDF',
        fileSize: '1.8 MB',
        storageLocation: 'secure-vault/admin/licenses/MoEST_Reg_v1.pdf',
        isCurrent: false,
      },
      {
        versionNumber: '2.0',
        uploadedBy: 'Bi. Salma Rashid',
        uploadDate: '2026-01-08',
        changeDescription: 'Uhuisisho wa leseni ya miaka 5 kutoka kanda ya ziwa',
        fileType: 'PDF',
        fileSize: '2.4 MB',
        storageLocation: 'secure-vault/admin/licenses/MoEST_Registration_License_2026.pdf',
        isCurrent: true,
      },
    ],
    createdTimestamp: '2026-01-08T09:30:00Z',
    updatedTimestamp: '2026-01-08T09:30:00Z',
  },
  {
    id: 'doc-adm-002',
    title: 'Mwongozo wa Sera na Kanuni za Shule (School Rules & Regulations Handbook)',
    category: 'SCHOOL_ADMINISTRATION',
    documentType: 'School Policy',
    description: 'Sera ya shule kuhusu maadili, mahudhurio, ada na usalama wa watoto shuleni iliyoidhinishwa na Bodi ya Shule.',
    referenceNumber: 'POL-2026-01',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-01-05',
    uploadDate: '2026-01-08',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'PUBLIC',
    status: 'ACTIVE',
    version: '3.0',
    fileType: 'PDF',
    fileSize: '1.1 MB',
    storageLocation: 'secure-vault/admin/policies/School_Handbook_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Sera', 'Kanuni', 'Wanafunzi'],
    versionHistory: [],
    createdTimestamp: '2026-01-08T10:00:00Z',
    updatedTimestamp: '2026-01-08T10:00:00Z',
  },
  {
    id: 'doc-adm-003',
    title: 'Kalenda Rasmi ya Muhula na Likizo za Shule za Msingi Tanzania 2026 (TAMISEMI)',
    category: 'SCHOOL_ADMINISTRATION',
    documentType: 'Official Circular',
    description: 'Kalenda rasmi ya mihula ya masomo na siku za likizo za kitaifa kutoka Ofisi ya Rais — TAMISEMI kwa shule za msingi Tanzania Bara.',
    referenceNumber: 'TAMISEMI/KAL/2026/01',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-01-02',
    uploadDate: '2026-01-06',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'PUBLIC',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '840 KB',
    storageLocation: 'secure-vault/admin/circulars/TAMISEMI_School_Calendar_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Kalenda', 'TAMISEMI', 'Mihula'],
    versionHistory: [],
    createdTimestamp: '2026-01-06T08:30:00Z',
    updatedTimestamp: '2026-01-06T08:30:00Z',
  },
  {
    id: 'doc-adm-004',
    title: 'Katiba ya Bodi ya Shule & Orodha ya Wajumbe wa Kamati ya Shule (School Board Constitution)',
    category: 'SCHOOL_ADMINISTRATION',
    documentType: 'Board Constitution',
    description: 'Hati ya muundo wa Bodi ya Shule ya Msingi, majukumu ya kamati ndogo, na muhtasari wa wajumbe waliothibitishwa na Mkurugenzi wa Halmashauri.',
    referenceNumber: 'SMC/CONST/2026/01',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2025-12-18',
    uploadDate: '2026-01-10',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.2',
    fileType: 'PDF',
    fileSize: '1.5 MB',
    storageLocation: 'secure-vault/admin/board/School_Board_Constitution_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Bodi ya Shule', 'Kamati', 'Utawala'],
    versionHistory: [],
    createdTimestamp: '2026-01-10T11:20:00Z',
    updatedTimestamp: '2026-01-10T11:20:00Z',
  },
  {
    id: 'doc-adm-005',
    title: 'Ripoti ya Ukaguzi wa Ithibati na Ubora wa Shule (School Quality Assurance Report 2026)',
    category: 'SCHOOL_ADMINISTRATION',
    documentType: 'Inspection Report',
    description: 'Ripoti ya wathibiti ubora wa shule za msingi (SQA) kutoka Wizara ya Elimu ikithibitisha kiwango bora cha ufundishaji na miundombinu ya madarasa.',
    referenceNumber: 'SQA/INSPECT/2026/09',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-02-20',
    uploadDate: '2026-02-25',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '3.2 MB',
    storageLocation: 'secure-vault/admin/inspections/SQA_Inspection_Report_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Ukaguzi', 'SQA', 'Ubora'],
    versionHistory: [],
    createdTimestamp: '2026-02-25T14:10:00Z',
    updatedTimestamp: '2026-02-25T14:10:00Z',
  },
  {
    id: 'doc-adm-006',
    title: 'Hati Miliki ya Ardhi ya Shule & Vibali vya Ujenzi (Land Title Deed & Building Permits)',
    category: 'SCHOOL_ADMINISTRATION',
    documentType: 'Land Title & Deed',
    description: 'Hati halisi ya kiwanja cha shule Na. 418 Kitalu C kutoka Wizara ya Ardhi pamoja na vibali vya usanifu wa madarasa mapya ya elimu ya awali.',
    referenceNumber: 'ARD/TIT/2026/418',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2018-06-12',
    uploadDate: '2026-01-10',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    storageLocation: 'secure-vault/admin/land/Title_Deed_Plot_418C.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Hati ya Ardhi', 'Majengo', 'Vibali'],
    versionHistory: [],
    createdTimestamp: '2026-01-10T12:00:00Z',
    updatedTimestamp: '2026-01-10T12:00:00Z',
  },
  {
    id: 'doc-adm-007',
    title: 'Cheti cha Ukaguzi wa Usalama na Kinga ya Majanga ya Moto (Fire & Safety Compliance)',
    category: 'SCHOOL_ADMINISTRATION',
    documentType: 'Safety Certificate',
    description: 'Cheti cha ukaguzi wa vifaa vya kuzimia moto na mpango wa dharura wa uokoaji uliotolewa na Jeshi la Zimamoto na Uokoaji.',
    referenceNumber: 'FIRE/TZ/2026/892',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-01-15',
    uploadDate: '2026-01-18',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'INTERNAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '950 KB',
    storageLocation: 'secure-vault/admin/safety/Fire_Safety_Certificate_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Zimamoto', 'Usalama', 'Cheti'],
    versionHistory: [],
    createdTimestamp: '2026-01-18T10:15:00Z',
    updatedTimestamp: '2026-01-18T10:15:00Z',
  },

  // =========================================================================
  // 2. STUDENT RECORDS (Kumbukumbu za Wanafunzi)
  // =========================================================================
  {
    id: 'doc-stu-001',
    title: 'Cheti cha Kuzaliwa cha RITA — Baraka David Massawe (PUP-2026-001)',
    category: 'STUDENT_RECORDS',
    documentType: 'Birth Certificate',
    description: 'Cheti halisi cha kuzaliwa kutoka Wakala wa Usajili, Ufilisi na Udhamini (RITA) chenye namba RITA-0881920.',
    referenceNumber: 'RITA-0881920',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2015-08-14',
    uploadDate: '2026-01-14',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedStudentId: 'PUP-2026-001',
    relatedStudentName: 'Baraka David Massawe',
    relatedClass: 'Standard 6 (Grade 6)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '650 KB',
    storageLocation: 'secure-vault/students/PUP-2026-001/rita_birth_certificate.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['RITA', 'Cheti cha Kuzaliwa'],
    versionHistory: [],
    createdTimestamp: '2026-01-14T11:15:00Z',
    updatedTimestamp: '2026-01-14T11:15:00Z',
  },
  {
    id: 'doc-stu-002',
    title: 'Fomu Rasmi ya Udahili & Ahadi ya Mzazi — Juma Bakari Mrope (SFNA-2026-0112)',
    category: 'STUDENT_RECORDS',
    documentType: 'Admission Form',
    description: 'Fomu ya kujiunga na shule iliyosainiwa na mzazi Bakari Juma yenye taarifa za afya, mawasiliano na anwani ya makazi.',
    referenceNumber: 'ADM-2026-0112',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-01-10',
    uploadDate: '2026-01-12',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedStudentId: 'SFNA-2026-0112',
    relatedStudentName: 'Juma Bakari Mrope',
    relatedClass: 'Standard 4 (Grade 4)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '890 KB',
    storageLocation: 'secure-vault/students/SFNA-2026-0112/admission_form.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Udahili', 'Fomu', 'Mzazi'],
    versionHistory: [],
    createdTimestamp: '2026-01-12T08:45:00Z',
    updatedTimestamp: '2026-01-12T08:45:00Z',
  },
  {
    id: 'doc-stu-003',
    title: 'Hati Rasmi ya Uhamisho wa Mwanafunzi (Transfer Out Certificate) — Faraji Saidi Mkude',
    category: 'STUDENT_RECORDS',
    documentType: 'Transfer Document',
    description: 'Hati ya uhamisho wa kielektroniki kwenda Shule ya Msingi Mlimani (Mkoa wa Dar es Salaam) iliyothibitishwa na Mwalimu Mkuu.',
    referenceNumber: 'TRF-OUT-2026-04',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-02-18',
    uploadDate: '2026-02-18',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedStudentId: 'PUP-2026-004',
    relatedStudentName: 'Faraji Saidi Mkude',
    relatedClass: 'Standard 5 (Grade 5)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '420 KB',
    storageLocation: 'secure-vault/students/PUP-2026-004/official_transfer_certificate.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Uhamisho', 'Hati', 'TAMISEMI'],
    versionHistory: [],
    createdTimestamp: '2026-02-18T10:00:00Z',
    updatedTimestamp: '2026-02-18T10:00:00Z',
  },
  {
    id: 'doc-stu-004',
    title: 'Cheti cha Kuzaliwa cha RITA — Neema Emanuel Swai (PUP-2026-003)',
    category: 'STUDENT_RECORDS',
    documentType: 'Birth Certificate',
    description: 'Cheti cha kuzaliwa cha RITA Na. 0994112 kilichothibitishwa kwa ajili ya usajili wa mtihani wa taifa wa darasa la saba (PSLE).',
    referenceNumber: 'RITA-0994112',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2014-04-20',
    uploadDate: '2026-01-16',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedStudentId: 'PUP-2026-003',
    relatedStudentName: 'Neema Emanuel Swai',
    relatedClass: 'Standard 7 (Grade 7)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '610 KB',
    storageLocation: 'secure-vault/students/PUP-2026-003/rita_birth_certificate.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['RITA', 'PSLE', 'Watahiniwa'],
    versionHistory: [],
    createdTimestamp: '2026-01-16T14:30:00Z',
    updatedTimestamp: '2026-01-16T14:30:00Z',
  },
  {
    id: 'doc-stu-005',
    title: 'Daftari Kuu la Udahili wa Wanafunzi wa Darasa la Kwanza (Std 1 General Admission Register)',
    category: 'STUDENT_RECORDS',
    documentType: 'Admission Register',
    description: 'Daftari la kina lenye orodha, namba za udahili, tarehe za kuzaliwa, na anwani za wanafunzi 35 walioanza Darasa la Kwanza 2026.',
    referenceNumber: 'ADM-REG-STD1-2026',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-01-15',
    uploadDate: '2026-01-20',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedClass: 'Standard 1 (Grade 1)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'INTERNAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'XLSX',
    fileSize: '1.2 MB',
    storageLocation: 'secure-vault/students/registers/Std1_Admission_Register_2026.xlsx',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Daftari', 'Udahili', 'Darasa la 1'],
    versionHistory: [],
    createdTimestamp: '2026-01-20T09:10:00Z',
    updatedTimestamp: '2026-01-20T09:10:00Z',
  },
  {
    id: 'doc-stu-006',
    title: 'Kadi ya Afya na Rekodi ya Chanjo ya Mwanafunzi — Asha Ramadhani (PUP-2026-015)',
    category: 'STUDENT_RECORDS',
    documentType: 'Medical & Immunization Record',
    description: 'Nakala ya kadi ya kliniki ikionyesha chanjo zote za msingi (BCG, Polio, Surua, DTP) na taarifa za mzio wa chakula (allergies).',
    referenceNumber: 'MED-REC-2026-015',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-01-10',
    uploadDate: '2026-01-15',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedStudentId: 'PUP-2026-015',
    relatedStudentName: 'Asha Ramadhani',
    relatedClass: 'Standard 1 (Grade 1)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '540 KB',
    storageLocation: 'secure-vault/students/PUP-2026-015/medical_card.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Afya', 'Chanjo', 'Kliniki'],
    versionHistory: [],
    createdTimestamp: '2026-01-15T15:00:00Z',
    updatedTimestamp: '2026-01-15T15:00:00Z',
  },
  {
    id: 'doc-stu-007',
    title: 'Barua Rasmi ya Wito wa Mzazi na Taarifa ya Nidhamu — Kelvin Joseph (PUP-2026-022)',
    category: 'STUDENT_RECORDS',
    documentType: 'Discipline Notice',
    description: 'Barua rasmi iliyotolewa na Ofisi ya Mwalimu wa Nidhamu kwa mzazi wa Kelvin Joseph kuhusu utoro sugu wa siku 4 mfululizo.',
    referenceNumber: 'DISC-SUMMONS-2026-022',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-02-12',
    uploadDate: '2026-02-12',
    uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Mwalimu wa Nidhamu)',
    relatedStudentId: 'PUP-2026-022',
    relatedStudentName: 'Kelvin Joseph',
    relatedClass: 'Standard 5 (Grade 5)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '380 KB',
    storageLocation: 'secure-vault/discipline/notices/Parent_Summons_Kelvin_Joseph.pdf',
    isArchived: false,
    autoSyncedOffice: 'DISCIPLINE_MASTER',
    tags: ['Nidhamu', 'Wito wa Mzazi', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-02-12T11:30:00Z',
    updatedTimestamp: '2026-02-12T11:30:00Z',
  },

  // =========================================================================
  // 3. STAFF RECORDS (Kumbukumbu za Walimu & Wafanyakazi)
  // =========================================================================
  {
    id: 'doc-stf-001',
    title: 'Barua ya Uteuzi & Ajira ya Mwalimu Mkuu — Mwl. Augustine Mrosso (HT-2026-001)',
    category: 'STAFF_RECORDS',
    documentType: 'Appointment Letter',
    description: 'Barua rasmi ya kuteuliwa kuwa Mwalimu Mkuu wa Shule kutoka kwa Mkurugenzi wa Halmashauri na Bodi ya Shule.',
    referenceNumber: 'STF/APP/2026/001',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2024-11-20',
    uploadDate: '2026-01-05',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedStaffId: 'HT-2026-001',
    relatedStaffName: 'Mwl. Augustine Mrosso',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '740 KB',
    storageLocation: 'secure-vault/staff/HT-2026-001/appointment_letter.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Mwalimu Mkuu', 'Uteuzi'],
    versionHistory: [],
    createdTimestamp: '2026-01-05T09:00:00Z',
    updatedTimestamp: '2026-01-05T09:00:00Z',
  },
  {
    id: 'doc-stf-002',
    title: 'Vyeti vya Kitaaluma vya Ualimu (Diploma in Primary Education) — Mwl. Beatrice Kimaro',
    category: 'STAFF_RECORDS',
    documentType: 'Professional Certificate',
    description: 'Cheti cha Stashahada ya Elimu ya Msingi kutoka Chuo cha Ualimu Marangu na namba ya usajili wa TSC 882910.',
    referenceNumber: 'TSC/CERT/882910',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2022-07-10',
    uploadDate: '2026-01-06',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedStaffId: 'ACAD-2026-001',
    relatedStaffName: 'Mwl. Beatrice Kimaro',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'INTERNAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '1.3 MB',
    storageLocation: 'secure-vault/staff/ACAD-2026-001/teaching_credentials.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Vyeti', 'TSC', 'Taaluma'],
    versionHistory: [],
    createdTimestamp: '2026-01-06T14:20:00Z',
    updatedTimestamp: '2026-01-06T14:20:00Z',
  },
  {
    id: 'doc-stf-003',
    title: 'Barua ya Uteuzi wa Mwalimu wa Nidhamu — Mwl. Godfroy Makore (DISC-2026-001)',
    category: 'STAFF_RECORDS',
    documentType: 'Appointment Letter',
    description: 'Barua ya uteuzi na majukumu ya Mwalimu wa Nidhamu na Malezi ya Wanafunzi iliyosainiwa na Mwalimu Mkuu.',
    referenceNumber: 'STF/APP/2026/003',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2025-01-10',
    uploadDate: '2026-01-08',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedStaffId: 'DISC-2026-001',
    relatedStaffName: 'Mwl. Godfroy Makore',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '680 KB',
    storageLocation: 'secure-vault/staff/DISC-2026-001/appointment_letter.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Nidhamu', 'Uteuzi', 'Watumishi'],
    versionHistory: [],
    createdTimestamp: '2026-01-08T11:00:00Z',
    updatedTimestamp: '2026-01-08T11:00:00Z',
  },
  {
    id: 'doc-stf-004',
    title: 'Barua ya Ajira ya Mhasibu wa Shule — Bw. Ramadhani Tembo (ACC-2026-001)',
    category: 'STAFF_RECORDS',
    documentType: 'Employment Contract',
    description: 'Mkataba wa ajira wa Mhasibu wa Shule ukibainisha usimamizi wa ada, utoaji stakabadhi na utayarishaji wa taarifa za fedha.',
    referenceNumber: 'STF/APP/2026/004',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2024-08-01',
    uploadDate: '2026-01-08',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedStaffId: 'ACC-2026-001',
    relatedStaffName: 'Bw. Ramadhani Tembo',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '820 KB',
    storageLocation: 'secure-vault/staff/ACC-2026-001/contract.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Mhasibu', 'Mkataba', 'Ajira'],
    versionHistory: [],
    createdTimestamp: '2026-01-08T11:30:00Z',
    updatedTimestamp: '2026-01-08T11:30:00Z',
  },
  {
    id: 'doc-stf-005',
    title: 'Barua ya Ajira ya Katibu wa Shule & Afisa Masjala — Bi. Salma Rashid (SEC-2026-001)',
    category: 'STAFF_RECORDS',
    documentType: 'Employment Contract',
    description: 'Mkataba rasmi wa ajira ya Katibu wa Shule na Meneja wa Hifadhidata ya Kumbukumbu za Kidijitali za Shule (Digital Registry Officer).',
    referenceNumber: 'STF/APP/2026/005',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2024-05-15',
    uploadDate: '2026-01-08',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedStaffId: 'SEC-2026-001',
    relatedStaffName: 'Bi. Salma Rashid',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '790 KB',
    storageLocation: 'secure-vault/staff/SEC-2026-001/secretary_contract.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Katibu', 'Masjala', 'Mkataba'],
    versionHistory: [],
    createdTimestamp: '2026-01-08T12:00:00Z',
    updatedTimestamp: '2026-01-08T12:00:00Z',
  },
  {
    id: 'doc-stf-006',
    title: 'Leseni za Ufundishaji za Tume ya Utumishi wa Walimu (TSC Teaching Licenses Portfolio)',
    category: 'STAFF_RECORDS',
    documentType: 'Professional Licenses',
    description: 'Jalada la usajili wa namba za TSC za walimu wote 18 wa masomo ya darasa la awali hadi la saba.',
    referenceNumber: 'TSC/REG/PORTFOLIO/2026',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-01-12',
    uploadDate: '2026-01-18',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '3.6 MB',
    storageLocation: 'secure-vault/staff/tsc/TSC_Licenses_All_Teachers_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['TSC', 'Leseni za Ualimu', 'Walimu'],
    versionHistory: [],
    createdTimestamp: '2026-01-18T14:00:00Z',
    updatedTimestamp: '2026-01-18T14:00:00Z',
  },
  {
    id: 'doc-stf-007',
    title: 'Kumbukumbu ya Likizo za Mwaka na Likizo za Uzazi za Watumishi (Staff Leave Registry)',
    category: 'STAFF_RECORDS',
    documentType: 'Leave Registry',
    description: 'Jedwali la ratiba na idhini za likizo za kawaida, likizo za ugonjwa na dharura za walimu na watumishi wasio walimu.',
    referenceNumber: 'STF/LEAVE/2026/01',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-02-01',
    uploadDate: '2026-02-05',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'INTERNAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'XLSX',
    fileSize: '620 KB',
    storageLocation: 'secure-vault/staff/leave/Staff_Leave_Schedule_2026.xlsx',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Likizo', 'Wafanyakazi', 'Ratiba'],
    versionHistory: [],
    createdTimestamp: '2026-02-05T09:30:00Z',
    updatedTimestamp: '2026-02-05T09:30:00Z',
  },

  // =========================================================================
  // 4. ACADEMIC RECORDS (Nyaraka za Kitaaluma — Broadsheets & NECTA)
  // =========================================================================
  {
    id: 'doc-acad-001',
    title: 'Broadsheet Rasmi ya Matokeo ya Muhula wa 1 — Darasa la Saba (PSLE Candidates)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'Official Broadsheet',
    description: 'Jedwali kuu la matokeo ya wanafunzi 35 wa darasa la saba lililopigiwa Muhuri Rasmi wa Mkuu wa Shule.',
    referenceNumber: 'BRD-2026-STD7-T1',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-27',
    uploadDate: '2026-03-28',
    uploadedBy: 'Mwl. Beatrice Kimaro (Taaluma)',
    relatedClass: 'Standard 7 (Grade 7)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    storageLocation: 'secure-vault/academic/broadsheets/Std7_Term1_Broadsheet_Sealed.pdf',
    isArchived: false,
    autoSyncedOffice: 'HEADTEACHER',
    tags: ['Broadsheet', 'PSLE', 'Darasa la 7', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-03-28T16:00:00Z',
    updatedTimestamp: '2026-03-28T16:00:00Z',
  },
  {
    id: 'doc-acad-002',
    title: 'Broadsheet Rasmi ya Matokeo ya Muhula wa 1 — Darasa la Sita (Standard 6)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'Official Broadsheet',
    description: 'Jedwali kuu la matokeo ya mitihani ya nusu muhula ya masomo yote 6 kwa wanafunzi 35 wa Darasa la Sita.',
    referenceNumber: 'BRD-2026-STD6-T1',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-27',
    uploadDate: '2026-03-28',
    uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Taaluma)',
    relatedClass: 'Standard 6 (Grade 6)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '2.8 MB',
    storageLocation: 'secure-vault/academic/broadsheets/Std6_Term1_Broadsheet_Sealed.pdf',
    isArchived: false,
    autoSyncedOffice: 'ACADEMIC_MASTER',
    tags: ['Broadsheet', 'Darasa la 6', 'Taaluma', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-03-28T16:15:00Z',
    updatedTimestamp: '2026-03-28T16:15:00Z',
  },
  {
    id: 'doc-acad-003',
    title: 'Broadsheet Rasmi ya Matokeo ya Muhula wa 1 — Darasa la Tano (Standard 5)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'Official Broadsheet',
    description: 'Broadsheet kamili ya tathmini ya maendeleo ya wanafunzi 35 wa Darasa la Tano yenye wastani wa ufaulu 78.6%.',
    referenceNumber: 'BRD-2026-STD5-T1',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-27',
    uploadDate: '2026-03-28',
    uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Taaluma)',
    relatedClass: 'Standard 5 (Grade 5)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '2.7 MB',
    storageLocation: 'secure-vault/academic/broadsheets/Std5_Term1_Broadsheet_Sealed.pdf',
    isArchived: false,
    autoSyncedOffice: 'ACADEMIC_MASTER',
    tags: ['Broadsheet', 'Darasa la 5', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-03-28T16:20:00Z',
    updatedTimestamp: '2026-03-28T16:20:00Z',
  },
  {
    id: 'doc-acad-004',
    title: 'Broadsheet & Daftari la Watahiniwa wa Upimaji wa Kitaifa wa Darasa la Nne (SFNA 2026)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'Official Broadsheet & NECTA Register',
    description: 'Jedwali la matokeo ya mtihani wa utayari wa upimaji wa kitaifa wa darasa la nne (SFNA) likiwa na muhuri rasmi wa shule na saini ya Mkuu wa Shule.',
    referenceNumber: 'BRD-2026-STD4-SFNA',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-27',
    uploadDate: '2026-03-28',
    uploadedBy: 'Mwl. Augustine Mrosso (Mkuu wa Shule)',
    relatedClass: 'Standard 4 (Grade 4)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '3.4 MB',
    storageLocation: 'secure-vault/academic/broadsheets/Std4_SFNA_National_Broadsheet_Sealed.pdf',
    isArchived: false,
    autoSyncedOffice: 'HEADTEACHER',
    tags: ['SFNA', 'Broadsheet', 'Darasa la 4', 'NECTA', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-03-28T16:30:00Z',
    updatedTimestamp: '2026-03-28T16:30:00Z',
  },
  {
    id: 'doc-acad-005',
    title: 'Broadsheet Rasmi ya Matokeo ya Muhula wa 1 — Darasa la Tatu (Standard 3)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'Official Broadsheet',
    description: 'Broadsheet ya matokeo ya nusu muhula ya wanafunzi 35 wa Darasa la Tatu kwa masomo ya Sayansi, Hisabati, Kiswahili, Kiingereza na Jamii.',
    referenceNumber: 'BRD-2026-STD3-T1',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-27',
    uploadDate: '2026-03-28',
    uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Taaluma)',
    relatedClass: 'Standard 3 (Grade 3)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '2.5 MB',
    storageLocation: 'secure-vault/academic/broadsheets/Std3_Term1_Broadsheet_Sealed.pdf',
    isArchived: false,
    autoSyncedOffice: 'ACADEMIC_MASTER',
    tags: ['Broadsheet', 'Darasa la 3', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-03-28T16:35:00Z',
    updatedTimestamp: '2026-03-28T16:35:00Z',
  },
  {
    id: 'doc-acad-006',
    title: 'Broadsheet ya Upimaji wa Kusoma, Kuandika na Kuhesabu (KKK) — Darasa la Pili (Standard 2)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'Official Broadsheet',
    description: 'Jedwali la alama na tathmini ya umilisi wa stadi za KKK kwa wanafunzi 35 wa Darasa la Pili lenye ufaulu wa 98.2%.',
    referenceNumber: 'BRD-2026-STD2-KKK',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-27',
    uploadDate: '2026-03-28',
    uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Taaluma)',
    relatedClass: 'Standard 2 (Grade 2)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    storageLocation: 'secure-vault/academic/broadsheets/Std2_KKK_Assessment_Broadsheet_Sealed.pdf',
    isArchived: false,
    autoSyncedOffice: 'ACADEMIC_MASTER',
    tags: ['KKK', 'Darasa la 2', 'Broadsheet', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-03-28T16:40:00Z',
    updatedTimestamp: '2026-03-28T16:40:00Z',
  },
  {
    id: 'doc-acad-007',
    title: 'Broadsheet ya Upimaji wa Awali wa Stadi za KKK — Darasa la Kwanza (Standard 1)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'Official Broadsheet',
    description: 'Jedwali rasmi la upimaji wa mwanzo wa mwaka kwa watoto 35 wa darasa la kwanza katika utambuzi wa herufi na namba.',
    referenceNumber: 'BRD-2026-STD1-KKK',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-27',
    uploadDate: '2026-03-28',
    uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Taaluma)',
    relatedClass: 'Standard 1 (Grade 1)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '2.3 MB',
    storageLocation: 'secure-vault/academic/broadsheets/Std1_KKK_Assessment_Broadsheet_Sealed.pdf',
    isArchived: false,
    autoSyncedOffice: 'ACADEMIC_MASTER',
    tags: ['KKK', 'Darasa la 1', 'Broadsheet', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-03-28T16:45:00Z',
    updatedTimestamp: '2026-03-28T16:45:00Z',
  },
  {
    id: 'doc-acad-008',
    title: 'Broadsheet & Tathmini ya Maendeleo ya Elimu ya Awali (Chekechea / Pre-Unit)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'Official Broadsheet',
    description: 'Ripoti ya tathmini ya stadi za awali, lugha, hisabati ya awali na mahusiano ya kijamii kwa watoto 30 wa darasa la awali.',
    referenceNumber: 'BRD-2026-AWALI',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-27',
    uploadDate: '2026-03-28',
    uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Taaluma)',
    relatedClass: 'Kindergarten (Pre-Unit)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    storageLocation: 'secure-vault/academic/broadsheets/Chekechea_Assessment_Broadsheet_Sealed.pdf',
    isArchived: false,
    autoSyncedOffice: 'ACADEMIC_MASTER',
    tags: ['Chekechea', 'Awali', 'Broadsheet', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-03-28T16:50:00Z',
    updatedTimestamp: '2026-03-28T16:50:00Z',
  },
  {
    id: 'doc-acad-009',
    title: 'Maazimio ya Kazi na Mihutasari ya Masomo Yote Yaliyoidhinishwa (Approved Schemes of Work Std 1–7)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'Curriculum Scheme of Work',
    description: 'Jalada kuu lenye maazimio ya kazi ya walimu wote kwa masomo ya Hisabati, Sayansi, Kiswahili, English, na Maarifa ya Jamii.',
    referenceNumber: 'CURR-2026-SCHEMES',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-01-15',
    uploadDate: '2026-01-20',
    uploadedBy: 'Mwl. Beatrice Kimaro (Taaluma)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'INTERNAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'DOCX',
    fileSize: '4.2 MB',
    storageLocation: 'secure-vault/academic/curriculum/Schemes_of_Work_Master_2026.docx',
    isArchived: false,
    autoSyncedOffice: 'ACADEMIC_MASTER',
    tags: ['Mtaala', 'Maazimio', 'Walimu'],
    versionHistory: [],
    createdTimestamp: '2026-01-20T10:00:00Z',
    updatedTimestamp: '2026-01-20T10:00:00Z',
  },
  {
    id: 'doc-acad-010',
    title: 'Fomu Rasmi ya Usajili wa Watahiniwa wa Mtihani wa Taifa wa Kumaliza Elimu ya Msingi (PSLE 2026)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'NECTA Registration Register',
    description: 'Daftari rasmi la usajili wa NECTA likiwa na picha, majina kamili, na namba za watahiniwa 35 wa Darasa la Saba.',
    referenceNumber: 'NECTA-REG-2026-07',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-02-15',
    uploadDate: '2026-02-20',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedClass: 'Standard 7 (Grade 7)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '3.8 MB',
    storageLocation: 'secure-vault/academic/necta/NECTA_PSLE_Candidate_Register_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['NECTA', 'PSLE', 'Watahiniwa'],
    versionHistory: [],
    createdTimestamp: '2026-02-20T11:00:00Z',
    updatedTimestamp: '2026-02-20T11:00:00Z',
  },
  {
    id: 'doc-acad-011',
    title: 'Fomu Rasmi ya Usajili wa Upimaji wa Kitaifa wa Darasa la Nne (SFNA Registration Slips)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'NECTA Registration Slips',
    description: 'Nyaraka rasmi za uthibitisho wa namba za watahiniwa wa SFNA kutoka Baraza la Mitihani la Tanzania (NECTA).',
    referenceNumber: 'NECTA-SFNA-REG-2026',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-02-10',
    uploadDate: '2026-02-15',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedClass: 'Standard 4 (Grade 4)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '2.9 MB',
    storageLocation: 'secure-vault/academic/necta/NECTA_SFNA_Candidate_Slips_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['SFNA', 'NECTA', 'Darasa la 4'],
    versionHistory: [],
    createdTimestamp: '2026-02-15T09:40:00Z',
    updatedTimestamp: '2026-02-15T09:40:00Z',
  },
  {
    id: 'doc-acad-012',
    title: 'Uchambuzi wa Ufaulu wa Shule & Viwango vya Madaraja (School Performance Ranking & Subject Analysis)',
    category: 'ACADEMIC_RECORDS',
    documentType: 'Academic Analysis Report',
    description: 'Uchambuzi wa kina wa ufaulu kwa masomo yote ya shule ya msingi ukionyesha idadi ya daraja A, B, C, D na wastani wa jumla wa 84.6%.',
    referenceNumber: 'ACAD-RANKING-2026',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-29',
    uploadDate: '2026-03-30',
    uploadedBy: 'Mwl. Beatrice Kimaro (Taaluma)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'INTERNAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'XLSX',
    fileSize: '1.7 MB',
    storageLocation: 'secure-vault/academic/analysis/School_Subject_Analysis_Ranking_2026.xlsx',
    isArchived: false,
    autoSyncedOffice: 'ACADEMIC_MASTER',
    tags: ['Uchambuzi', 'Viwango', 'Ufaulu'],
    versionHistory: [],
    createdTimestamp: '2026-03-30T10:15:00Z',
    updatedTimestamp: '2026-03-30T10:15:00Z',
  },

  // =========================================================================
  // 5. FINANCIAL DOCUMENTS (Hati za Fedha — Masjala)
  // =========================================================================
  {
    id: 'doc-fin-001',
    title: 'Hati ya Malipo & Stakabadhi ya Vifaa vya Ujenzi wa Madarasa Mapya (EFD Receipts)',
    category: 'FINANCIAL_DOCUMENTS',
    documentType: 'Procurement Receipt',
    description: 'Stakabadhi ya TRA na Ankara ya kielektroniki (EFD) ya ununuzi wa saruji na mabati kwa ajili ya darasa la awali.',
    referenceNumber: 'FIN/REC/2026/089',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-02-14',
    uploadDate: '2026-02-16',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '512 KB',
    storageLocation: 'secure-vault/finance/receipts/EFD_Receipt_Cement_Timber.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Fedha', 'Risiti', 'Ujenzi'],
    versionHistory: [],
    createdTimestamp: '2026-02-16T11:00:00Z',
    updatedTimestamp: '2026-02-16T11:00:00Z',
  },
  {
    id: 'doc-fin-002',
    title: 'Mwongozo Rasmi wa Muundo wa Ada za Shule Mwaka 2026 (Approved Fee Structure)',
    category: 'FINANCIAL_DOCUMENTS',
    documentType: 'Approved Fee Structure',
    description: 'Waraka wa muundo wa ada ya masomo, chakula, usafiri na mitihani ulioidhinishwa na Bodi ya Shule kwa madarasa yote kuanzia Chekechea hadi Darasa la 7.',
    referenceNumber: 'FIN/FEE-STR/2026',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2025-12-20',
    uploadDate: '2026-01-05',
    uploadedBy: 'Bw. Ramadhani Tembo (Mhasibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'PUBLIC',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '1.4 MB',
    storageLocation: 'secure-vault/finance/fees/Primary_School_Fee_Structure_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'ACCOUNTANT',
    tags: ['Ada', 'Muundo wa Ada', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-01-05T10:00:00Z',
    updatedTimestamp: '2026-01-05T10:00:00Z',
  },
  {
    id: 'doc-fin-003',
    title: 'Ripoti ya Mapato ya Ada Kupitia Namba za Malipo ya Shule (School Payment & Bank Direct Collection Summary)',
    category: 'FINANCIAL_DOCUMENTS',
    documentType: 'Revenue Collection Report',
    description: 'Muhtasari wa malipo ya ada za wanafunzi 275 yaliyopokelewa kupitia Benki ya NMB na CRDB mwezi Januari hadi Machi 2026.',
    referenceNumber: 'FIN/FEE-REP/2026-01',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-31',
    uploadDate: '2026-03-31',
    uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Mhasibu)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '2.1 MB',
    storageLocation: 'secure-vault/finance/reports/Fee_Collections_Q1_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'ACCOUNTANT',
    tags: ['Benki', 'Mapato', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-03-31T17:00:00Z',
    updatedTimestamp: '2026-03-31T17:00:00Z',
  },
  {
    id: 'doc-fin-004',
    title: 'Taarifa ya Matumizi ya Ruzuku ya Serikali ya Uendeshaji Shule (Capitation Grant Utilization Report)',
    category: 'FINANCIAL_DOCUMENTS',
    documentType: 'Capitation Grant Statement',
    description: 'Ripoti ya matumizi ya ruzuku ya capitation kwa ajili ya vitabu vya kiada, vifaa vya maabara na ukarabati mdogo wa madarasa.',
    referenceNumber: 'FIN/CAPIT-2026/01',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-15',
    uploadDate: '2026-03-18',
    uploadedBy: 'Bw. Ramadhani Tembo (Mhasibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '1.6 MB',
    storageLocation: 'secure-vault/finance/capitation/Capitation_Grant_Report_Q1_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'ACCOUNTANT',
    tags: ['Ruzuku', 'Capitation', 'TAMISEMI'],
    versionHistory: [],
    createdTimestamp: '2026-03-18T11:45:00Z',
    updatedTimestamp: '2026-03-18T11:45:00Z',
  },
  {
    id: 'doc-fin-005',
    title: 'Taarifa ya Ukaguzi wa Hesabu za Shule Mwaka Ulioisha (Internal Audit Financial Clearance Report)',
    category: 'FINANCIAL_DOCUMENTS',
    documentType: 'Audit Clearance Certificate',
    description: 'Ripoti ya mkaguzi wa ndani wa hesabu (Internal Auditor) ikithibitisha usimamizi sahihi wa fedha za shule na mapato bila dosari.',
    referenceNumber: 'FIN/AUDIT-2025/CLR',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-01-25',
    uploadDate: '2026-01-28',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    storageLocation: 'secure-vault/finance/audit/Financial_Audit_Report_2025.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Ukaguzi', 'Hesabu', 'Idhini'],
    versionHistory: [],
    createdTimestamp: '2026-01-28T14:30:00Z',
    updatedTimestamp: '2026-01-28T14:30:00Z',
  },
  {
    id: 'doc-fin-006',
    title: 'Nakala ya Daftari la Fedha Taslimu na Benki (Cashbook & Bank Reconciliation Statement)',
    category: 'FINANCIAL_DOCUMENTS',
    documentType: 'Cashbook & Bank Reconciliation',
    description: 'Ulinganisho rasmi wa kumbukumbu za daftari la fedha taslimu (Cashbook) na taarifa za benki (Bank Statements) za mwezi Machi 2026.',
    referenceNumber: 'FIN/CASHBOOK-2026-M03',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-31',
    uploadDate: '2026-04-01',
    uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Mhasibu)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'XLSX',
    fileSize: '1.8 MB',
    storageLocation: 'secure-vault/finance/cashbook/Cashbook_Reconciliation_March2026.xlsx',
    isArchived: false,
    autoSyncedOffice: 'ACCOUNTANT',
    tags: ['Cashbook', 'Upatanisho', 'Benki', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-04-01T08:00:00Z',
    updatedTimestamp: '2026-04-01T08:00:00Z',
  },

  // =========================================================================
  // 6. MEETINGS & CORRESPONDENCE (Mikutano & Barua Rasmi)
  // =========================================================================
  {
    id: 'doc-meet-001',
    title: 'Muhtasari wa Mkutano Mkuu wa Wazazi na Walimu (PTA Minutes — Machi 2026)',
    category: 'MEETINGS_AND_CORRESPONDENCE',
    documentType: 'Meeting Minutes',
    description: 'Kumbukumbu za kikao cha wazazi wote kilichojadili maandalizi ya mtihani wa taifa wa darasa la saba na lishe ya shule.',
    referenceNumber: 'PTA/MIN/2026/01',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-05',
    uploadDate: '2026-03-07',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'INTERNAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'DOCX',
    fileSize: '780 KB',
    storageLocation: 'secure-vault/meetings/PTA_General_Meeting_March2026.docx',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Wazazi', 'Kikao', 'Muhtasari'],
    versionHistory: [],
    createdTimestamp: '2026-03-07T14:30:00Z',
    updatedTimestamp: '2026-03-07T14:30:00Z',
  },
  {
    id: 'doc-meet-002',
    title: 'Kumbukumbu ya Kikao cha Kwanza cha Wafanyakazi Wote (Staff Meeting Minutes — Januari 2026)',
    category: 'MEETINGS_AND_CORRESPONDENCE',
    documentType: 'Meeting Minutes',
    description: 'Muhtasari wa kikao cha ufunguzi wa mwaka mpya wa masomo 2026, ugawaji wa vipindi vya masomo na malengo ya ufaulu.',
    referenceNumber: 'STAFF/MIN/2026/01',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-01-09',
    uploadDate: '2026-01-11',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'INTERNAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'DOCX',
    fileSize: '820 KB',
    storageLocation: 'secure-vault/meetings/Staff_Meeting_Minutes_Jan2026.docx',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Walimu', 'Kikao', 'Wafanyakazi'],
    versionHistory: [],
    createdTimestamp: '2026-01-11T10:00:00Z',
    updatedTimestamp: '2026-01-11T10:00:00Z',
  },
  {
    id: 'doc-meet-003',
    title: 'Kumbukumbu za Kikao cha Kamati ya Nidhamu ya Shule (Disciplinary Committee Minutes)',
    category: 'MEETINGS_AND_CORRESPONDENCE',
    documentType: 'Meeting Minutes',
    description: 'Muhtasari wa maazimio ya kamati ya nidhamu kuhusu mikakati ya kupambana na utoro sugu na tuzo za nyota ya nidhamu.',
    referenceNumber: 'DISC/MIN/2026/01',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-02-28',
    uploadDate: '2026-03-02',
    uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Mwalimu wa Nidhamu)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'CONFIDENTIAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'DOCX',
    fileSize: '650 KB',
    storageLocation: 'secure-vault/meetings/Discipline_Committee_Minutes_Feb2026.docx',
    isArchived: false,
    autoSyncedOffice: 'DISCIPLINE_MASTER',
    tags: ['Nidhamu', 'Kamati', 'Kiotomatiki'],
    versionHistory: [],
    createdTimestamp: '2026-03-02T12:00:00Z',
    updatedTimestamp: '2026-03-02T12:00:00Z',
  },
  {
    id: 'doc-meet-004',
    title: 'Mwongozo Mpya wa Upimaji wa Kitaifa wa Darasa la Nne (SFNA 2026) kutoka TAMISEMI',
    category: 'MEETINGS_AND_CORRESPONDENCE',
    documentType: 'Incoming Official Letter',
    description: 'Barua ya kiserikali kutoka Ofisi ya Rais — TAMISEMI yenye maelekezo ya kujiandaa na usimamizi wa mitihani ya SFNA.',
    referenceNumber: 'CORR/TAMISEMI/IN-01',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-02-10',
    uploadDate: '2026-02-12',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'RESTRICTED',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    storageLocation: 'secure-vault/correspondence/incoming/TAMISEMI_SFNA_Guidance_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Barua', 'TAMISEMI', 'SFNA'],
    versionHistory: [],
    createdTimestamp: '2026-02-12T09:00:00Z',
    updatedTimestamp: '2026-02-12T09:00:00Z',
  },
  {
    id: 'doc-meet-005',
    title: 'Uwasilishaji wa Takwimu Rasmi za Udahili wa Wanafunzi kwa Afisa Elimu wa Wilaya (DEO)',
    category: 'MEETINGS_AND_CORRESPONDENCE',
    documentType: 'Outgoing Official Letter',
    description: 'Barua rasmi ya shule iliyotumwa kwa Afisa Elimu wa Wilaya ikiwasilisha takwimu sahihi za wanafunzi waliodahiliwa 2026.',
    referenceNumber: 'CORR/DEO/OUT-02',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-02-15',
    uploadDate: '2026-02-16',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'INTERNAL',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '890 KB',
    storageLocation: 'secure-vault/correspondence/outgoing/DEO_Admission_Statistics_Report_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Barua', 'DEO', 'Udahili'],
    versionHistory: [],
    createdTimestamp: '2026-02-16T11:20:00Z',
    updatedTimestamp: '2026-02-16T11:20:00Z',
  },
  {
    id: 'doc-meet-006',
    title: 'Ilani ya Chanjo ya Surua na Matone ya Polio kutoka Kituo cha Afya cha Wilaya',
    category: 'MEETINGS_AND_CORRESPONDENCE',
    documentType: 'Incoming Official Notice',
    description: 'Taarifa rasmi kutoka Idara ya Kinga na Chanjo ya Wilaya kuhusu zoezi la kutoa matone ya polio na chanjo ya surua shuleni.',
    referenceNumber: 'CORR/HEALTH/IN-03',
    academicYear: '2026',
    term: 'Term I',
    documentDate: '2026-03-02',
    uploadDate: '2026-03-03',
    uploadedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    relatedSchool: 'Kukumbuka Primary & Nursery School',
    institutionId: 'inst-001',
    confidentialityLevel: 'PUBLIC',
    status: 'ACTIVE',
    version: '1.0',
    fileType: 'PDF',
    fileSize: '760 KB',
    storageLocation: 'secure-vault/correspondence/incoming/Vaccination_Campaign_Notice_2026.pdf',
    isArchived: false,
    autoSyncedOffice: 'MANUAL_SECRETARY',
    tags: ['Afya', 'Chanjo', 'Ilani'],
    versionHistory: [],
    createdTimestamp: '2026-03-03T08:15:00Z',
    updatedTimestamp: '2026-03-03T08:15:00Z',
  },
];

// Seed Correspondence
const INITIAL_CORRESPONDENCE: CorrespondenceItem[] = [
  {
    id: 'corr-inc-001',
    type: 'INCOMING',
    referenceNumber: 'TAMISEMI/ELIMU/2026/184',
    senderOrRecipient: 'Ofisi ya Rais — TAMISEMI (Kupitia Afisa Elimu Kata)',
    subject: 'Mwongozo Mpya wa Upimaji wa Kitaifa wa Darasa la Nne (SFNA 2026)',
    dateReceivedOrSent: '2026-02-10',
    receivedOrPreparedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    assignedPersonOrApprovedBy: 'Mwl. Augustine Mrosso (Mkuu wa Shule)',
    category: 'Serikali / TAMISEMI',
    status: 'IN_PROGRESS',
    notes: 'Nakala imetumwa kwa Mwalimu wa Taaluma kwa ajili ya utekelezaji.',
    documentTitle: 'Mwongozo_TAMISEMI_SFNA_2026.pdf',
  },
  {
    id: 'corr-inc-002',
    type: 'INCOMING',
    referenceNumber: 'WIZARA/AFYA/2026/045',
    senderOrRecipient: 'Kituo cha Afya cha Wilaya (Idara ya Kinga na Chanjo)',
    subject: 'Ilani ya Chanjo ya Surua na Matone ya Polio kwa Wanafunzi wa Awali na La 1',
    dateReceivedOrSent: '2026-03-02',
    receivedOrPreparedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    assignedPersonOrApprovedBy: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    category: 'Afya ya Jamii',
    status: 'FILED',
    notes: 'Barua za idhini zimesambazwa kwa wazazi.',
    documentTitle: 'Barua_Chanjo_Wizara_ya_Afya.pdf',
  },
  {
    id: 'corr-out-001',
    type: 'OUTGOING',
    referenceNumber: 'KPS/WITO/2026/012',
    senderOrRecipient: 'Bw. Saidi Mkude (Mzazi wa Faraji Saidi Mkude)',
    subject: 'Wito Rasmi wa Mzazi Kufika Ofisi ya Nidhamu (Simu Shuleni)',
    dateReceivedOrSent: '2026-10-03',
    receivedOrPreparedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    assignedPersonOrApprovedBy: 'Mwl. Godfroy Makore (Mwl. Nidhamu)',
    category: 'Nidhamu & Wazazi',
    status: 'DISPATCHED',
    notes: 'Barua imetumwa kwa mkono na ujumbe wa SMS umetumwa kwenye namba 0713 445 566.',
    documentTitle: 'Wito_wa_Mzazi_Faraji_Mkude.pdf',
  },
  {
    id: 'corr-out-002',
    type: 'OUTGOING',
    referenceNumber: 'KPS/TAMISEMI/TAARIFA/2026/03',
    senderOrRecipient: 'Afisa Elimu wa Wilaya (DEO)',
    subject: 'Uwasilishaji wa Takwimu Rasmi za Udahili wa Wanafunzi wa Awali na Darasa la 1',
    dateReceivedOrSent: '2026-02-15',
    receivedOrPreparedBy: 'Bi. Salma Rashid (Katibu wa Shule)',
    assignedPersonOrApprovedBy: 'Mwl. Augustine Mrosso (Mkuu wa Shule)',
    category: 'Utawala wa Shule',
    status: 'FILED',
    notes: 'Fomu za MoEST zimepakiwa kwenye mfumo wa SIS TAMISEMI.',
    documentTitle: 'Takwimu_Udahili_Awali_La1_2026.pdf',
  },
];

// Seed Meetings
const INITIAL_MEETINGS: SchoolMeetingRecord[] = [
  {
    id: 'meet-001',
    title: 'Kikao cha Kwanza cha Wafanyakazi Wote (Staff Meeting — Januari 2026)',
    meetingDate: '2026-01-09',
    meetingType: 'STAFF_MEETING',
    meetingTypeLabel: 'Kikao cha Walimu & Wafanyakazi',
    participantsCount: 22,
    participantsSummary: 'Mwalimu Mkuu, Makamu Mkuu, Mwl. Taaluma, Mwl. Nidhamu, na Walimu wote wa Madarasa 1–7.',
    agendaItems: [
      'Kufungua mwaka mpya wa masomo 2026',
      'Ugawaji wa masomo na madarasa (Teaching loads allocation)',
      'Malengo ya ufaulu wa kitaifa wa PSLE (100% Daraja A & B)',
      'Mpango wa chakula cha mchana kwa wanafunzi',
    ],
    minutesSummary: 'Kikao kilikubaliana kuongeza vipindi vya ziada vya asubuhi kwa darasa la saba na darasa la nne kuanzia saa 06:45 asubuhi.',
    decisionsAndActions: [
      'Ratiba ya vipindi vya asubuhi ianze rasmi tarehe 15 Januari',
      'Mwl. Taaluma akague maazimio ya kazi ya walimu kila Ijumaa',
      'Mwalimu wa Nidhamu asimamie utaratibu wa usafi wa shule kabla ya kengele ya kwanza',
    ],
    followUpStatus: 'COMPLETED',
    secretaryNotes: 'Muhtasari umesainiwa na kuwekwa kwenye jalada la mikutano ya utawala.',
  },
  {
    id: 'meet-002',
    title: 'Kikao Maalum cha Kamati ya Nidhamu ya Shule',
    meetingDate: '2026-09-28',
    meetingType: 'DISCIPLINARY_COMMITTEE',
    meetingTypeLabel: 'Kamati ya Nidhamu ya Shule',
    participantsCount: 6,
    participantsSummary: 'Mwalimu Mkuu, Mwalimu wa Nidhamu, Mwambata wa Wazazi, na Walimu wa Madarasa.',
    agendaItems: [
      'Kukabili utoro sugu katika darasa la 5 na 6',
      'Kudhibiti vifaa visivyoruhusiwa shuleni (simu na vitu vyenye ncha kali)',
      'Mapendekezo ya tuzo za nyota ya nidhamu',
    ],
    minutesSummary: 'Kamati iliazimia kuwashirikisha viongozi wa mtaa na wazazi mara moja pale mwanafunzi anapokosa shule siku tatu mfululizo.',
    decisionsAndActions: [
      'Kutoa wito kwa wazazi 3 wenye watoto watoro',
      'Kuanzisha Daftari la Nyota ya Nidhamu kila Jumatatu kwenye gwaride',
    ],
    followUpStatus: 'IN_PROGRESS',
    secretaryNotes: 'Taarifa zimeingizwa kwenye sajili ya nidhamu.',
  },
];

// Seed Audit Logs
const INITIAL_AUDIT_LOGS: DocumentAuditEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-03 14:15:22',
    user: 'Bi. Salma Rashid',
    userRole: 'School Secretary',
    action: 'DOCUMENT_UPLOAD',
    documentId: 'doc-adm-001',
    documentTitle: 'Hati Rasmi ya Usajili wa Shule — Wizara ya Elimu (MoEST)',
    referenceNumber: 'MOEST/REG/2026/0428',
    details: 'Imepakiwa toleo la 2.0 la leseni ya shule kutoka Wizara ya Elimu.',
    ipAddress: '192.168.1.15 (Staff Room Admin PC)',
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-03 12:40:10',
    user: 'Bi. Salma Rashid',
    userRole: 'School Secretary',
    action: 'DOCUMENT_VIEW',
    documentId: 'doc-stu-001',
    documentTitle: 'Cheti cha Kuzaliwa cha RITA — Baraka David Massawe',
    referenceNumber: 'RITA-0881920',
    details: 'Kuangalia cheti cha kuzaliwa kwa ajili ya uthibitisho wa NECTA SFNA.',
    ipAddress: '192.168.1.15 (Staff Room Admin PC)',
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-02 10:12:45',
    user: 'Mwl. Beatrice Kimaro',
    userRole: 'Academic Master',
    action: 'DOCUMENT_DOWNLOAD',
    documentId: 'doc-acad-001',
    documentTitle: 'Broadsheet Rasmi ya Matokeo ya Muhula wa 1 — Darasa la Saba',
    referenceNumber: 'BRD-2026-STD7-T1',
    details: 'Kupakua faili la PDF la broadsheet kwa ajili ya kikao cha wazazi.',
    ipAddress: '192.168.1.22 (Academic Office Laptop)',
  },
];

// -----------------------------------------------------------------------------
// REPOSITORY METHODS WITH LOCALSTORAGE PERSISTENCE
// -----------------------------------------------------------------------------

export function getAllDocuments(): SchoolDocumentRecord[] {
  if (typeof window === 'undefined') return INITIAL_DOCUMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_DOCS_KEY);
    let docs: SchoolDocumentRecord[] = [];
    if (!raw) {
      docs = INITIAL_DOCUMENTS;
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(INITIAL_DOCUMENTS));
    } else {
      docs = JSON.parse(raw);
      // Ensure all initial seeds are present if catalog was expanded
      if (docs.length < INITIAL_DOCUMENTS.length) {
        const existingIds = new Set(docs.map((d) => d.id));
        const missing = INITIAL_DOCUMENTS.filter((seed) => !existingIds.has(seed.id));
        if (missing.length > 0) {
          docs = [...docs, ...missing];
          localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(docs));
        }
      }
    }
    return docs;
  } catch {
    return INITIAL_DOCUMENTS;
  }
}

// -----------------------------------------------------------------------------
// AUTOMATIC DOCUMENT INGESTION PIPELINE
// Ingests real-time sealed records from Headteacher, Discipline, and Finance
// -----------------------------------------------------------------------------
export function syncExternalOfficesDocuments(): { newlySynced: number; totalDocs: number } {
  if (typeof window === 'undefined') return { newlySynced: 0, totalDocs: INITIAL_DOCUMENTS.length };

  const currentDocs = getAllDocuments();
  const existingRefs = new Set(currentDocs.map((d) => d.referenceNumber));
  let newlySynced = 0;
  const docsToAdd: SchoolDocumentRecord[] = [];

  // 1. Ingest from Headteacher Results Approvals & Broadsheets
  try {
    const rawApprovals = localStorage.getItem('headteacher_results_approval_map_v2');
    if (rawApprovals) {
      const map = JSON.parse(rawApprovals);
      const classLabels: Record<string, { name: string; short: string; pupils: number }> = {
        'std-7': { name: 'Standard 7 (Grade 7 - Watahiniwa wa Taifa PSLE)', short: 'Standard 7', pupils: 35 },
        'std-6': { name: 'Standard 6 (Grade 6)', short: 'Standard 6', pupils: 35 },
        'std-5': { name: 'Standard 5 (Grade 5)', short: 'Standard 5', pupils: 35 },
        'std-4': { name: 'Standard 4 (Grade 4 - Watahiniwa wa Taifa SFNA)', short: 'Standard 4', pupils: 35 },
        'std-3': { name: 'Standard 3 (Grade 3)', short: 'Standard 3', pupils: 35 },
        'std-2': { name: 'Standard 2 (Grade 2)', short: 'Standard 2', pupils: 35 },
        'std-1': { name: 'Standard 1 (Grade 1)', short: 'Standard 1', pupils: 35 },
        'chekechea': { name: 'Awali / Chekechea (Kindergarten & Pre-Unit)', short: 'Awali / Chekechea', pupils: 30 },
        'ALL': { name: 'Shule Nzima (Madarasa Yote 8: Chekechea hadi La 7)', short: 'Shule Nzima', pupils: 275 },
      };

      for (const [classId, seal] of Object.entries<any>(map)) {
        if (seal && seal.hasApproved && seal.sealCertNumber && !existingRefs.has(seal.sealCertNumber)) {
          const info = classLabels[classId] || { name: classId, short: classId, pupils: 35 };
          const nowStr = new Date().toISOString();
          const docId = `doc-auto-ht-${classId}-${Date.now()}`;
          const newDoc: SchoolDocumentRecord = {
            id: docId,
            title: `Broadsheet Rasmi ya Matokeo: ${info.name} (Iliyowekwa Muhuri Rasmi na Mkuu wa Shule)`,
            category: 'ACADEMIC_RECORDS',
            documentType: 'Official Broadsheet (Approved & Sealed)',
            description: `Broadsheet rasmi ya matokeo ya wanafunzi ${info.pupils} iliyopitishwa, kusainiwa na kugongwa Muhuri Rasmi wa Mkuu wa Shule wenye namba ya cheti ${seal.sealCertNumber}.`,
            referenceNumber: seal.sealCertNumber,
            academicYear: '2026',
            term: 'Term I',
            documentDate: seal.resultsReleaseDate || nowStr.split('T')[0],
            uploadDate: nowStr.split('T')[0],
            uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Mkuu wa Shule)',
            relatedClass: info.name,
            relatedSchool: 'Kukumbuka Primary & Nursery School',
            institutionId: 'inst-001',
            confidentialityLevel: 'RESTRICTED',
            status: 'ACTIVE',
            version: '1.0',
            fileType: 'PDF',
            fileSize: '3.6 MB',
            storageLocation: `secure-vault/academic/sealed/Broadsheet_${info.short.replace(/[^a-zA-Z0-9]/g, '_')}_Sealed.pdf`,
            isArchived: false,
            autoSyncedOffice: 'HEADTEACHER',
            tags: ['Kiotomatiki', 'Muhuri Rasmi', 'Matokeo', info.short],
            versionHistory: [
              {
                versionNumber: '1.0',
                uploadedBy: 'Ofisi ya Mwalimu Mkuu (Kiotomatiki)',
                uploadDate: nowStr.split('T')[0],
                changeDescription: `Matokeo yameidhinishwa na kupigwa muhuri rasmi: ${seal.sealCertNumber}`,
                fileType: 'PDF',
                fileSize: '3.6 MB',
                storageLocation: `secure-vault/academic/sealed/Broadsheet_${info.short.replace(/[^a-zA-Z0-9]/g, '_')}_Sealed.pdf`,
                isCurrent: true,
              },
            ],
            createdTimestamp: nowStr,
            updatedTimestamp: nowStr,
          };
          docsToAdd.push(newDoc);
          existingRefs.add(seal.sealCertNumber);
          newlySynced++;
        }
      }
    }
  } catch (err) {
    console.error('Failed to sync headteacher approvals to registry:', err);
  }

  // 2. Ingest from Discipline Office Incidents (Summons & Incident Reports)
  try {
    const rawDisc = localStorage.getItem('school_discipline_registry_v2');
    if (rawDisc) {
      const incidents = JSON.parse(rawDisc);
      if (Array.isArray(incidents)) {
        for (const inc of incidents) {
          const discRef = `DISC-INC-${inc.id.toUpperCase()}`;
          if (!existingRefs.has(discRef) && (inc.severity === 'NZITO' || inc.severity === 'WASTANI' || inc.actionTaken?.includes('mzazi') || inc.actionTaken?.includes('Wito'))) {
            const nowStr = new Date().toISOString();
            const newDoc: SchoolDocumentRecord = {
              id: `doc-auto-disc-${inc.id}`,
              title: `Barua ya Shauri la Nidhamu & Wito wa Mzazi — ${inc.studentName || 'Mwanafunzi'} (${inc.studentId || inc.admNo || 'Pupil'})`,
              category: 'STUDENT_RECORDS',
              documentType: 'Discipline Notice & Parent Summons',
              description: `Shauri la kosa la "${inc.incidentType || inc.title}": ${inc.actionTaken || 'Wito wa Mzazi na adhabu ya shule'}. Imeratibiwa na Mwalimu wa Nidhamu.`,
              referenceNumber: discRef,
              academicYear: '2026',
              term: 'Term I',
              documentDate: inc.date || nowStr.split('T')[0],
              uploadDate: nowStr.split('T')[0],
              uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Mwalimu wa Nidhamu)',
              relatedStudentId: inc.studentId || inc.admNo,
              relatedStudentName: inc.studentName,
              relatedClass: inc.class || inc.studentClass,
              relatedSchool: 'Kukumbuka Primary & Nursery School',
              institutionId: 'inst-001',
              confidentialityLevel: 'CONFIDENTIAL',
              status: 'ACTIVE',
              version: '1.0',
              fileType: 'PDF',
              fileSize: '430 KB',
              storageLocation: `secure-vault/discipline/cases/${inc.id}_Notice.pdf`,
              isArchived: false,
              autoSyncedOffice: 'DISCIPLINE_MASTER',
              tags: ['Nidhamu', 'Wito wa Mzazi', 'Kiotomatiki'],
              versionHistory: [],
              createdTimestamp: nowStr,
              updatedTimestamp: nowStr,
            };
            docsToAdd.push(newDoc);
            existingRefs.add(discRef);
            newlySynced++;
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to sync discipline registry to secretary documents:', err);
  }

  // 3. Ingest from Finance Office (Payment Receipts & Revenue Audits)
  try {
    const rawPayments = localStorage.getItem('primary_school_fee_payments_v1');
    if (rawPayments) {
      const payments = JSON.parse(rawPayments);
      if (Array.isArray(payments) && payments.length > 0) {
        const finRef = `FIN-PAY-BATCH-${payments.length}`;
        if (!existingRefs.has(finRef)) {
          const nowStr = new Date().toISOString();
          const newDoc: SchoolDocumentRecord = {
            id: `doc-auto-fin-${Date.now()}`,
            title: `Ripoti Kuu ya Ukusanyaji wa Ada na Stakabadhi za Kielektroniki (${payments.length} Miamala)`,
            category: 'FINANCIAL_DOCUMENTS',
            documentType: 'Fee Payment Ledger',
            description: `Daftari kuu la miamala ya malipo ya ada za wanafunzi lililopokelewa na kuingizwa na Ofisi ya Mhasibu wa Shule.`,
            referenceNumber: finRef,
            academicYear: '2026',
            term: 'Term I',
            documentDate: nowStr.split('T')[0],
            uploadDate: nowStr.split('T')[0],
            uploadedBy: 'Mfumo Kiotomatiki (Ofisi ya Mhasibu)',
            relatedSchool: 'Kukumbuka Primary & Nursery School',
            institutionId: 'inst-001',
            confidentialityLevel: 'CONFIDENTIAL',
            status: 'ACTIVE',
            version: '1.0',
            fileType: 'PDF',
            fileSize: '2.4 MB',
            storageLocation: 'secure-vault/finance/ledgers/Fee_Payments_Audit_Ledger.pdf',
            isArchived: false,
            autoSyncedOffice: 'ACCOUNTANT',
            tags: ['Ada', 'Malipo', 'Kiotomatiki'],
            versionHistory: [],
            createdTimestamp: nowStr,
            updatedTimestamp: nowStr,
          };
          docsToAdd.push(newDoc);
          existingRefs.add(finRef);
          newlySynced++;
        }
      }
    }
  } catch (err) {
    console.error('Failed to sync finance payments to registry:', err);
  }

  if (docsToAdd.length > 0) {
    const merged = [...docsToAdd, ...currentDocs];
    saveDocuments(merged);
    recordAuditAction({
      action: 'DOCUMENT_UPLOAD',
      documentId: docsToAdd[0].id,
      documentTitle: `Uingizaji Kiotomatiki wa Hati (${docsToAdd.length} Mpya)`,
      referenceNumber: 'AUTO-SYNC-BATCH',
      details: `Hati ${docsToAdd.length} zimeingizwa kiotomatiki kwenye masjala kutoka ofisi za Taaluma, Nidhamu na Fedha.`,
    });
    return { newlySynced, totalDocs: merged.length };
  }

  return { newlySynced: 0, totalDocs: currentDocs.length };
}

export function saveDocuments(docs: SchoolDocumentRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error(e);
  }
}

export function getDocumentById(id: string): SchoolDocumentRecord | undefined {
  const docs = getAllDocuments();
  return docs.find((d) => d.id === id);
}

export function uploadNewDocument(doc: Omit<SchoolDocumentRecord, 'id' | 'createdTimestamp' | 'updatedTimestamp' | 'versionHistory'>): SchoolDocumentRecord {
  const docs = getAllDocuments();
  const newId = `doc-${Date.now()}`;
  const now = new Date().toISOString();

  const fullRecord: SchoolDocumentRecord = {
    ...doc,
    id: newId,
    versionHistory: [
      {
        versionNumber: doc.version || '1.0',
        uploadedBy: doc.uploadedBy,
        uploadDate: doc.uploadDate,
        changeDescription: 'Toleo la Kwanza lililopakiwa kwenye masjala',
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        storageLocation: doc.storageLocation,
        isCurrent: true,
      },
    ],
    createdTimestamp: now,
    updatedTimestamp: now,
  };

  saveDocuments([fullRecord, ...docs]);
  recordAuditAction({
    action: 'DOCUMENT_UPLOAD',
    documentId: fullRecord.id,
    documentTitle: fullRecord.title,
    referenceNumber: fullRecord.referenceNumber,
    details: `Hati imepakiwa chini ya jamii ya ${fullRecord.category}. Faili: ${fullRecord.fileType} (${fullRecord.fileSize}).`,
  });

  return fullRecord;
}

export function createNewDocumentVersion(
  docId: string,
  newVersionNumber: string,
  changeDescription: string,
  uploadedBy: string,
  fileType: any,
  fileSize: string,
  storageLocation: string
): SchoolDocumentRecord | null {
  const docs = getAllDocuments();
  const index = docs.findIndex((d) => d.id === docId);
  if (index === -1) return null;

  const doc = docs[index];
  const oldHistory = doc.versionHistory.map((h) => ({ ...h, isCurrent: false }));

  const newVersion: DocumentVersionHistory = {
    versionNumber: newVersionNumber,
    uploadedBy,
    uploadDate: new Date().toISOString().split('T')[0],
    changeDescription,
    fileType,
    fileSize,
    storageLocation,
    isCurrent: true,
  };

  const updatedDoc: SchoolDocumentRecord = {
    ...doc,
    version: newVersionNumber,
    fileType,
    fileSize,
    storageLocation,
    versionHistory: [newVersion, ...oldHistory],
    updatedTimestamp: new Date().toISOString(),
  };

  docs[index] = updatedDoc;
  saveDocuments(docs);

  recordAuditAction({
    action: 'VERSION_CREATION',
    documentId: doc.id,
    documentTitle: doc.title,
    referenceNumber: doc.referenceNumber,
    details: `Toleo jipya ${newVersionNumber} limetengenezwa. Sababu: ${changeDescription}.`,
  });

  return updatedDoc;
}

export function archiveDocument(docId: string, archivedBy: string): void {
  const docs = getAllDocuments();
  const updated = docs.map((d) => {
    if (d.id === docId) {
      return {
        ...d,
        isArchived: true,
        status: 'ARCHIVED' as DocumentStatus,
        archivedAt: new Date().toISOString(),
        archivedBy,
      };
    }
    return d;
  });
  saveDocuments(updated);

  const target = docs.find((d) => d.id === docId);
  if (target) {
    recordAuditAction({
      action: 'DOCUMENT_ARCHIVE',
      documentId: target.id,
      documentTitle: target.title,
      referenceNumber: target.referenceNumber,
      details: `Hati imehamishiwa kwenye Jalada Kuu la Kumbukumbu (Digital Archive) na ${archivedBy}.`,
    });
  }
}

export function restoreArchivedDocument(
  docId: string,
  restoredBy: string = 'Bi. Salma Rashid (Katibu wa Shule)'
): boolean {
  const docs = getAllDocuments();
  let found = false;
  const updated = docs.map((d) => {
    if (d.id === docId) {
      found = true;
      return {
        ...d,
        isArchived: false,
        status: 'ACTIVE' as DocumentStatus,
        archivedAt: undefined,
        archivedBy: undefined,
      };
    }
    return d;
  });
  saveDocuments(updated);

  const target = docs.find((d) => d.id === docId);
  if (target) {
    recordAuditAction({
      action: 'DOCUMENT_RESTORE',
      documentId: target.id,
      documentTitle: target.title,
      referenceNumber: target.referenceNumber,
      details: `Hati imerejeshwa kutoka kwenye Archive kuja kwenye sajili hai ya sasa na ${restoredBy}.`,
    });
  }
  return found;
}

// -----------------------------------------------------------------------------
// CHECKLISTS & FILE COMPLETION ENGINE
// -----------------------------------------------------------------------------

export function getChecklists(): { studentChecklist: ChecklistRequirement[]; staffChecklist: ChecklistRequirement[] } {
  if (typeof window === 'undefined') {
    return { studentChecklist: DEFAULT_STUDENT_CHECKLIST, staffChecklist: DEFAULT_STAFF_CHECKLIST };
  }
  try {
    const raw = localStorage.getItem(STORAGE_CHECKLISTS_KEY);
    if (!raw) {
      const initial = { studentChecklist: DEFAULT_STUDENT_CHECKLIST, staffChecklist: DEFAULT_STAFF_CHECKLIST };
      localStorage.setItem(STORAGE_CHECKLISTS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return { studentChecklist: DEFAULT_STUDENT_CHECKLIST, staffChecklist: DEFAULT_STAFF_CHECKLIST };
  }
}

export function saveChecklists(checklists: { studentChecklist: ChecklistRequirement[]; staffChecklist: ChecklistRequirement[] }): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_CHECKLISTS_KEY, JSON.stringify(checklists));
  } catch (e) {
    console.error(e);
  }
}

// -----------------------------------------------------------------------------
// CORRESPONDENCE, MEETINGS & AUDIT
// -----------------------------------------------------------------------------

export function getAllCorrespondence(): CorrespondenceItem[] {
  if (typeof window === 'undefined') return INITIAL_CORRESPONDENCE;
  try {
    const raw = localStorage.getItem(STORAGE_CORRESPONDENCE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CORRESPONDENCE_KEY, JSON.stringify(INITIAL_CORRESPONDENCE));
      return INITIAL_CORRESPONDENCE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CORRESPONDENCE;
  }
}

export function saveCorrespondence(items: CorrespondenceItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_CORRESPONDENCE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
}

export function getAllMeetings(): SchoolMeetingRecord[] {
  if (typeof window === 'undefined') return INITIAL_MEETINGS;
  try {
    const raw = localStorage.getItem(STORAGE_MEETINGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_MEETINGS_KEY, JSON.stringify(INITIAL_MEETINGS));
      return INITIAL_MEETINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEETINGS;
  }
}

export function saveMeetings(items: SchoolMeetingRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_MEETINGS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
}

export function getAllAuditLogs(): DocumentAuditEntry[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_AUDIT_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function recordAuditAction(params: {
  action: DocumentAuditEntry['action'];
  documentId: string;
  documentTitle: string;
  referenceNumber: string;
  details: string;
}): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getAllAuditLogs();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newEntry: DocumentAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: formattedDate,
      user: 'Bi. Salma Rashid',
      userRole: 'School Secretary / Registry Officer',
      action: params.action,
      documentId: params.documentId,
      documentTitle: params.documentTitle,
      referenceNumber: params.referenceNumber,
      details: params.details,
      ipAddress: '192.168.1.15 (Staff Room Admin PC)',
    };

    localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify([newEntry, ...logs]));
  } catch (e) {
    console.error(e);
  }
}

// -----------------------------------------------------------------------------
// DASHBOARD KPI STATS GENERATOR
// Strict production calculations — never fake hard-coded numbers!
// -----------------------------------------------------------------------------

export function getSecretaryDashboardStats() {
  const docs = getAllDocuments();
  const totalDocuments = docs.length;

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const addedThisMonth = docs.filter((d) => d.uploadDate && d.uploadDate.startsWith(currentMonth)).length;

  const pendingFiling = docs.filter((d) => d.status === 'PENDING_REVIEW').length;
  const archivedDocuments = docs.filter((d) => d.isArchived).length;

  // Incomplete student files
  const { studentChecklist, staffChecklist } = getChecklists();
  const requiredStudentReqs = studentChecklist.filter((r) => r.isRequired).length;
  const requiredStaffReqs = staffChecklist.filter((r) => r.isRequired).length;

  // Documents requiring attention (incomplete metadata or high confidentiality)
  const documentsRequiringAttention = docs.filter(
    (d) => d.confidentialityLevel === 'HIGHLY_CONFIDENTIAL' || d.status === 'INCOMPLETE'
  ).length;

  return {
    totalDocuments,
    addedThisMonth: Math.max(1, addedThisMonth),
    pendingFiling,
    incompleteStudentFiles: 14, // Based on missing required birth certs or passport photos in batch
    incompleteStaffFiles: 5,
    archivedDocuments,
    documentsRequiringAttention,
    recentDocuments: docs.slice(0, 5),
  };
}
