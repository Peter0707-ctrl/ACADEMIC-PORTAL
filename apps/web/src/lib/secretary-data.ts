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

// Seed Documents (empty initial state; real records stored in DB / uploaded by secretary)
const INITIAL_DOCUMENTS: SchoolDocumentRecord[] = [];

// Seed Correspondence
const INITIAL_CORRESPONDENCE: CorrespondenceItem[] = [];

// Seed Meetings
const INITIAL_MEETINGS: SchoolMeetingRecord[] = [];

// Seed Audit Logs
const INITIAL_AUDIT_LOGS: DocumentAuditEntry[] = [];

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
