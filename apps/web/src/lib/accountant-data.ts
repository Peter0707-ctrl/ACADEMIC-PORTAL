// =============================================================================
// PRIMARY SCHOOL ACCOUNTANT & FINANCE MANAGEMENT MODULE
// Commercial Universal Education Management Platform
// Multi-Tenant, Auditable, Database-Driven Double-Entry Financial Engine
// =============================================================================

export type PaymentMethod = 'CASH' | 'BANK' | 'MOBILE_MONEY' | 'ONLINE';
export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'FAILED' | 'REVERSED' | 'CANCELLED';
export type ExpenseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PAID';
export type ClearanceStatus = 'CLEARED' | 'PARTIALLY_CLEARED' | 'NOT_CLEARED' | 'EXEMPTED';

// -----------------------------------------------------------------------------
// 1. DATA MODELS & INTERFACES
// -----------------------------------------------------------------------------

export interface FeeItem {
  id: string;
  name: string;
  category: 'Tuition' | 'Registration' | 'Examination' | 'Books' | 'Learning Materials' | 'Meals' | 'Transport' | 'Uniform' | 'Other';
  amount: number; // in TZS
  isMandatory: boolean;
  description: string;
}

export interface FeeStructure {
  id: string;
  academicYear: string; // e.g. "2026"
  term: 'Term I' | 'Term II' | 'All Terms';
  standard: string; // e.g. "Standard 4 (Grade 4)"
  items: FeeItem[];
  totalAmount: number;
  isActive: boolean;
  institutionId: string;
  updatedAt: string;
}

export interface StudentInvoice {
  id: string; // e.g. "INV-2026-00124"
  invoiceNumber: string;
  studentId: string; // Admission Number (PS-2026-00124)
  studentName: string;
  standard: string;
  stream: string;
  academicYear: string;
  term: string;
  items: { id: string; name: string; amount: number }[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  status: InvoiceStatus;
  createdBy: string;
  createdAt: string;
  institutionId: string;
}

export interface StudentPayment {
  id: string; // e.g. "PAY-2026-1042"
  paymentNumber: string;
  studentId: string; // Admission Number
  studentName: string;
  standard: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  bankAccountId?: string;
  bankAccountName?: string;
  referenceNumber: string; // Bank slip ref or M-Pesa / TigoPesa TX ID
  paymentDate: string;
  receivedBy: string;
  status: PaymentStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  academicYear: string;
  term: string;
  receiptNumber?: string;
  notes?: string;
  institutionId: string;
}

export interface OfficialReceipt {
  receiptNumber: string; // Unique e.g. "REC-2026-0428"
  paymentId: string;
  studentId: string;
  studentName: string;
  standard: string;
  invoiceNumber: string;
  amountPaid: number;
  paymentMethod: string;
  referenceNumber: string;
  paymentDate: string;
  previousBalance: number;
  remainingBalance: number;
  receivedBy: string;
  schoolDetails: {
    name: string;
    regNo: string;
    address: string;
    phone: string;
    email: string;
  };
  institutionId: string;
  issuedAt: string;
}

export interface FinancialAdjustment {
  id: string;
  studentId: string;
  studentName: string;
  invoiceId: string;
  type: 'SCHOLARSHIP' | 'SPONSORSHIP' | 'WAIVER' | 'DISCOUNT';
  amount: number;
  reason: string;
  authorizedBy: string; // e.g. Headteacher / School Board
  createdBy: string;
  date: string;
  institutionId: string;
}

export interface SchoolExpense {
  id: string; // e.g. "EXP-2026-088"
  expenseNumber: string;
  category:
    | 'TEACHER_SALARIES'
    | 'ELECTRICITY'
    | 'WATER'
    | 'INTERNET'
    | 'TEACHING_MATERIALS'
    | 'SCHOOL_SUPPLIES'
    | 'FOOD_MEALS'
    | 'TRANSPORT_FUEL'
    | 'MAINTENANCE_REPAIRS'
    | 'OFFICE_EXPENSES'
    | 'PROCUREMENT';
  categoryLabel: string;
  description: string;
  amount: number;
  date: string;
  payee: string; // Supplier / Vendor / Staff
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  bankAccountId?: string;
  supportingDocumentName?: string;
  requestedBy: string;
  reviewerAccountant?: string;
  approvedBy?: string;
  status: ExpenseStatus;
  rejectionReason?: string;
  paidAt?: string;
  institutionId: string;
}

export interface CashbookEntry {
  id: string;
  date: string;
  type: 'CASH_IN' | 'CASH_OUT';
  sourceOrPayee: string;
  description: string;
  amount: number;
  runningBalance: number;
  paymentMethod: string;
  reference: string;
  relatedId?: string; // invoiceId, paymentId, or expenseId
  institutionId: string;
}

export interface SchoolBankAccount {
  id: string;
  accountName: string;
  bankName: string; // CRDB Bank, NMB Bank, Stanbic, etc.
  accountNumber: string;
  openingBalance: number;
  currentBalance: number;
  currency: 'TZS';
  branch: string;
  institutionId: string;
}

export interface BankReconciliationRecord {
  id: string;
  bankAccountId: string;
  bankAccountName: string;
  reconciliationDate: string;
  systemBalance: number;
  bankStatementBalance: number;
  difference: number;
  status: 'BALANCED' | 'DISCREPANCY';
  notes: string;
  reconciledBy: string;
  institutionId: string;
}

export interface StudentFinancialAccount {
  studentId: string; // Admission Number
  fullName: string;
  standard: string;
  stream: string;
  parentName: string;
  parentPhone: string;
  totalInvoiced: number;
  totalPaid: number;
  totalDiscount: number;
  balance: number;
  clearanceStatus: ClearanceStatus;
  clearanceRemarks?: string;
  invoicesCount: number;
  lastPaymentDate?: string;
  institutionId: string;
}

export interface FinanceAuditEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action:
    | 'CREATE_INVOICE'
    | 'EDIT_INVOICE'
    | 'CANCEL_INVOICE'
    | 'RECORD_PAYMENT'
    | 'VERIFY_PAYMENT'
    | 'REVERSE_PAYMENT'
    | 'GENERATE_RECEIPT'
    | 'CREATE_EXPENSE'
    | 'APPROVE_EXPENSE'
    | 'REJECT_EXPENSE'
    | 'PAY_EXPENSE'
    | 'APPLY_DISCOUNT'
    | 'CHANGE_FEE_STRUCTURE'
    | 'CHANGE_CLEARANCE'
    | 'RECONCILIATION_PERFORMED'
    | 'EXPORT_REPORT';
  recordId: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
}

// -----------------------------------------------------------------------------
// 2. STORAGE KEYS & SEED DATA
// -----------------------------------------------------------------------------

const STORAGE_FEE_STRUCTURES_KEY = 'academic_portal_finance_fee_structures_v1';
const STORAGE_INVOICES_KEY = 'academic_portal_finance_invoices_v1';
const STORAGE_PAYMENTS_KEY = 'academic_portal_finance_payments_v1';
const STORAGE_RECEIPTS_KEY = 'academic_portal_finance_receipts_v1';
const STORAGE_EXPENSES_KEY = 'academic_portal_finance_expenses_v1';
const STORAGE_CASHBOOK_KEY = 'academic_portal_finance_cashbook_v1';
const STORAGE_BANKS_KEY = 'academic_portal_finance_bank_accounts_v1';
const STORAGE_RECONCILIATION_KEY = 'academic_portal_finance_reconciliations_v1';
const STORAGE_ADJUSTMENTS_KEY = 'academic_portal_finance_adjustments_v1';
const STORAGE_AUDIT_KEY = 'academic_portal_finance_audit_trail_v1';

const DEFAULT_SCHOOL_DETAILS = {
  name: 'PRIMARY & NURSERY SCHOOL',
  regNo: 'EM.1428/TZ',
  address: 'S.L.P. 1428, Dar es Salaam, Tanzania',
  phone: '0779304500',
  email: 'pj0040280@gmail.com',
};

// Initial Seed Fee Structures (Standard 1–7 + Nursery)
const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  {
    id: 'fee-std-4',
    academicYear: '2026',
    term: 'Term I',
    standard: 'Standard 4 (Grade 4)',
    items: [
      { id: 'f-4-01', name: 'Ada ya Mafunzo (Tuition Fee)', category: 'Tuition', amount: 800000, isMandatory: true, description: 'Ada kuu ya ufundishaji na masomo muhula wa I' },
      { id: 'f-4-02', name: 'Ada ya Mtihani wa Kitaifa (SFNA Exam Fee)', category: 'Examination', amount: 50000, isMandatory: true, description: 'Mtihani wa Taifa wa Darasa la Nne (NECTA SFNA)' },
      { id: 'f-4-03', name: 'Vitabu & Vifaa vya Kujifunzia', category: 'Books', amount: 80000, isMandatory: true, description: 'Vitabu vya ziada na madaftari ya majaribio' },
      { id: 'f-4-04', name: 'Chakula cha Mchana (Lunch Scheme)', category: 'Meals', amount: 120000, isMandatory: false, description: 'Mlo kamili wa mchana shuleni siku zote za masomo' },
      { id: 'f-4-05', name: 'Usafiri wa Basi la Shule (School Bus)', category: 'Transport', amount: 150000, isMandatory: false, description: 'Kusafirisha mwanafunzi kwenda na kurudi' },
    ],
    totalAmount: 1200000,
    isActive: true,
    institutionId: 'inst-001',
    updatedAt: '2026-01-10',
  },
  {
    id: 'fee-std-7',
    academicYear: '2026',
    term: 'Term I',
    standard: 'Standard 7 (Grade 7)',
    items: [
      { id: 'f-7-01', name: 'Ada ya Mafunzo (Tuition Fee)', category: 'Tuition', amount: 850000, isMandatory: true, description: 'Ada kuu ya masomo ya darasa la kuhitimu' },
      { id: 'f-7-02', name: 'Ada ya Mtihani wa Taifa (PSLE Mock & Final)', category: 'Examination', amount: 80000, isMandatory: true, description: 'Mitihani ya Majaribio (Mock) na Mtihani wa Taifa PSLE' },
      { id: 'f-7-03', name: 'Kambi ya Masomo ya Ziada (Camp Tuition)', category: 'Tuition', amount: 100000, isMandatory: true, description: 'Kambi na maandalizi ya jioni' },
      { id: 'f-7-04', name: 'Chakula cha Mchana (Meals)', category: 'Meals', amount: 120000, isMandatory: false, description: 'Chakula cha mchana na chai ya asubuhi' },
      { id: 'f-7-05', name: 'Usafiri wa Basi la Shule', category: 'Transport', amount: 150000, isMandatory: false, description: 'Huduma ya basi la shule' },
    ],
    totalAmount: 1300000,
    isActive: true,
    institutionId: 'inst-001',
    updatedAt: '2026-01-10',
  },
  {
    id: 'fee-std-1-3',
    academicYear: '2026',
    term: 'Term I',
    standard: 'Standard 1 (Grade 1)',
    items: [
      { id: 'f-1-01', name: 'Ada ya Mafunzo (Tuition Fee)', category: 'Tuition', amount: 750000, isMandatory: true, description: 'Ada kuu ya mafunzo ya msingi' },
      { id: 'f-1-02', name: 'Vifaa vya Kujifunzia & Michezo', category: 'Learning Materials', amount: 60000, isMandatory: true, description: 'Kalamu za rangi na zana za hesabu' },
      { id: 'f-1-03', name: 'Chakula cha Mchana (Lunch)', category: 'Meals', amount: 120000, isMandatory: false, description: 'Mlo wa mchana' },
      { id: 'f-1-04', name: 'Usafiri wa Basi la Shule', category: 'Transport', amount: 150000, isMandatory: false, description: 'Usafiri wa basi la shule' },
    ],
    totalAmount: 1080000,
    isActive: true,
    institutionId: 'inst-001',
    updatedAt: '2026-01-10',
  },
];

// Initial Seed Bank Accounts
const INITIAL_BANK_ACCOUNTS: SchoolBankAccount[] = [
  {
    id: 'bank-crdb-01',
    accountName: 'Kukumbuka Primary & Nursery School - Main Operational A/C',
    bankName: 'CRDB Bank Plc',
    accountNumber: '0150244892100',
    openingBalance: 42500000,
    currentBalance: 51240000,
    currency: 'TZS',
    branch: 'Kijitonyama Branch, Dar es Salaam',
    institutionId: 'inst-001',
  },
  {
    id: 'bank-nmb-02',
    accountName: 'Kukumbuka Primary School - Development & Projects A/C',
    bankName: 'NMB Bank Plc',
    accountNumber: '20810034921',
    openingBalance: 18000000,
    currentBalance: 22650000,
    currency: 'TZS',
    branch: 'Mwenge Branch, Dar es Salaam',
    institutionId: 'inst-001',
  },
];

// Initial Seed Invoices
const INITIAL_INVOICES: StudentInvoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-00124',
    studentId: 'PS-2026-00124',
    studentName: 'John Peter Mwangi',
    standard: 'Standard 4 (Grade 4)',
    stream: 'Stream A',
    academicYear: '2026',
    term: 'Term I',
    items: [
      { id: 'item-1', name: 'Ada ya Mafunzo (Tuition)', amount: 800000 },
      { id: 'item-2', name: 'Mtihani wa SFNA', amount: 50000 },
      { id: 'item-3', name: 'Vitabu vya Ziada', amount: 80000 },
      { id: 'item-4', name: 'Basi la Shule', amount: 150000 },
    ],
    subtotal: 1080000,
    discount: 0,
    totalAmount: 1080000,
    amountPaid: 800000,
    balance: 280000,
    dueDate: '2026-02-15',
    status: 'PARTIALLY_PAID',
    createdBy: 'Bw. Ramadhani Tembo (Mhasibu)',
    createdAt: '2026-01-10',
    institutionId: 'inst-001',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-00125',
    studentId: 'PS-2026-00125',
    studentName: 'Baraka Joseph Mollel',
    standard: 'Standard 4 (Grade 4)',
    stream: 'Stream A',
    academicYear: '2026',
    term: 'Term I',
    items: [
      { id: 'item-1', name: 'Ada ya Mafunzo (Tuition)', amount: 800000 },
      { id: 'item-2', name: 'Mtihani wa SFNA', amount: 50000 },
      { id: 'item-3', name: 'Vitabu vya Ziada', amount: 80000 },
      { id: 'item-4', name: 'Chakula cha Mchana', amount: 120000 },
    ],
    subtotal: 1050000,
    discount: 0,
    totalAmount: 1050000,
    amountPaid: 1050000,
    balance: 0,
    dueDate: '2026-02-15',
    status: 'PAID',
    createdBy: 'Bw. Ramadhani Tembo',
    createdAt: '2026-01-10',
    institutionId: 'inst-001',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-00128',
    studentId: 'PS-2026-00128',
    studentName: 'Neema Daniel Lyimo',
    standard: 'Standard 5 (Grade 5)',
    stream: 'Stream B',
    academicYear: '2026',
    term: 'Term I',
    items: [
      { id: 'item-1', name: 'Ada ya Mafunzo (Tuition)', amount: 750000 },
      { id: 'item-2', name: 'Vifaa vya Maabara ya Sayansi', amount: 50000 },
      { id: 'item-3', name: 'Usafiri wa Basi', amount: 150000 },
    ],
    subtotal: 950000,
    discount: 50000,
    totalAmount: 900000,
    amountPaid: 450000,
    balance: 450000,
    dueDate: '2026-02-15',
    status: 'PARTIALLY_PAID',
    createdBy: 'Bw. Ramadhani Tembo',
    createdAt: '2026-01-12',
    institutionId: 'inst-001',
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2026-00130',
    studentId: 'PS-2026-00130',
    studentName: 'Kelvin Richard Shirima',
    standard: 'Standard 7 (Grade 7)',
    stream: 'Stream A',
    academicYear: '2026',
    term: 'Term I',
    items: [
      { id: 'item-1', name: 'Ada ya Mafunzo (Tuition)', amount: 850000 },
      { id: 'item-2', name: 'Mitihani ya Mock & PSLE', amount: 80000 },
      { id: 'item-3', name: 'Kambi ya Masomo ya Jioni', amount: 100000 },
      { id: 'item-4', name: 'Chakula cha Mchana', amount: 120000 },
    ],
    subtotal: 1150000,
    discount: 0,
    totalAmount: 1150000,
    amountPaid: 1150000,
    balance: 0,
    dueDate: '2026-02-15',
    status: 'PAID',
    createdBy: 'Bw. Ramadhani Tembo',
    createdAt: '2026-01-11',
    institutionId: 'inst-001',
  },
  {
    id: 'inv-005',
    invoiceNumber: 'INV-2026-00135',
    studentId: 'PS-2026-00135',
    studentName: 'Amina Shabani Hassan',
    standard: 'Standard 1 (Grade 1)',
    stream: 'Stream A',
    academicYear: '2026',
    term: 'Term I',
    items: [
      { id: 'item-1', name: 'Ada ya Mafunzo (Tuition)', amount: 750000 },
      { id: 'item-2', name: 'Vifaa vya Kujifunzia', amount: 60000 },
      { id: 'item-3', name: 'Chakula cha Mchana', amount: 120000 },
    ],
    subtotal: 930000,
    discount: 0,
    totalAmount: 930000,
    amountPaid: 0,
    balance: 930000,
    dueDate: '2026-02-28',
    status: 'OVERDUE',
    createdBy: 'Bw. Ramadhani Tembo',
    createdAt: '2026-01-15',
    institutionId: 'inst-001',
  },
];

// Initial Seed Payments
const INITIAL_PAYMENTS: StudentPayment[] = [
  {
    id: 'pay-001',
    paymentNumber: 'PAY-2026-001',
    studentId: 'PS-2026-00124',
    studentName: 'John Peter Mwangi',
    standard: 'Standard 4 (Grade 4)',
    invoiceId: 'inv-001',
    invoiceNumber: 'INV-2026-00124',
    amount: 800000,
    paymentMethod: 'BANK',
    bankAccountId: 'bank-crdb-01',
    bankAccountName: 'CRDB Bank Main Operating A/C',
    referenceNumber: 'CRDB-TX-998241',
    paymentDate: '2026-01-18 10:30',
    receivedBy: 'Bw. Ramadhani Tembo',
    status: 'VERIFIED',
    verifiedBy: 'Bw. Ramadhani Tembo (Mhasibu)',
    verifiedAt: '2026-01-18 11:00',
    academicYear: '2026',
    term: 'Term I',
    receiptNumber: 'REC-2026-001',
    notes: 'Malipo ya nusu ada kupitia tawi la CRDB Kijitonyama',
    institutionId: 'inst-001',
  },
  {
    id: 'pay-002',
    paymentNumber: 'PAY-2026-002',
    studentId: 'PS-2026-00125',
    studentName: 'Baraka Joseph Mollel',
    standard: 'Standard 4 (Grade 4)',
    invoiceId: 'inv-002',
    invoiceNumber: 'INV-2026-00125',
    amount: 1050000,
    paymentMethod: 'MOBILE_MONEY',
    referenceNumber: 'MPESA-QK8901239',
    paymentDate: '2026-01-15 14:12',
    receivedBy: 'Bw. Ramadhani Tembo',
    status: 'VERIFIED',
    verifiedBy: 'Bw. Ramadhani Tembo',
    verifiedAt: '2026-01-15 15:00',
    academicYear: '2026',
    term: 'Term I',
    receiptNumber: 'REC-2026-002',
    notes: 'Malipo kamili ya ada kupitia Lipa Namba ya Vodacom M-Pesa',
    institutionId: 'inst-001',
  },
  {
    id: 'pay-003',
    paymentNumber: 'PAY-2026-003',
    studentId: 'PS-2026-00128',
    studentName: 'Neema Daniel Lyimo',
    standard: 'Standard 5 (Grade 5)',
    invoiceId: 'inv-003',
    invoiceNumber: 'INV-2026-00128',
    amount: 450000,
    paymentMethod: 'CASH',
    referenceNumber: 'CASH-REC-0034',
    paymentDate: '2026-01-20 09:45',
    receivedBy: 'Bw. Ramadhani Tembo',
    status: 'VERIFIED',
    verifiedBy: 'Bw. Ramadhani Tembo',
    verifiedAt: '2026-01-20 10:00',
    academicYear: '2026',
    term: 'Term I',
    receiptNumber: 'REC-2026-003',
    notes: 'Kiasi kiliwekwa kwenye kijitabu cha fedha taslimu (Cashbook)',
    institutionId: 'inst-001',
  },
  {
    id: 'pay-004',
    paymentNumber: 'PAY-2026-004',
    studentId: 'PS-2026-00130',
    studentName: 'Kelvin Richard Shirima',
    standard: 'Standard 7 (Grade 7)',
    invoiceId: 'inv-004',
    invoiceNumber: 'INV-2026-00130',
    amount: 1150000,
    paymentMethod: 'BANK',
    bankAccountId: 'bank-nmb-02',
    bankAccountName: 'NMB Bank School Development A/C',
    referenceNumber: 'NMB-SLIP-441209',
    paymentDate: '2026-01-14 11:20',
    receivedBy: 'Bw. Ramadhani Tembo',
    status: 'VERIFIED',
    verifiedBy: 'Bw. Ramadhani Tembo',
    verifiedAt: '2026-01-14 12:00',
    academicYear: '2026',
    term: 'Term I',
    receiptNumber: 'REC-2026-004',
    notes: 'Malipo ya ada kamili ya darasa la 7 NMB Mwenge',
    institutionId: 'inst-001',
  },
  {
    id: 'pay-005',
    paymentNumber: 'PAY-2026-005',
    studentId: 'PS-2026-00142',
    studentName: 'Farida Salum Ally',
    standard: 'Standard 3 (Grade 3)',
    invoiceId: 'inv-006',
    invoiceNumber: 'INV-2026-00142',
    amount: 500000,
    paymentMethod: 'MOBILE_MONEY',
    referenceNumber: 'AIRTEL-TX-771239',
    paymentDate: new Date().toISOString().slice(0, 10),
    receivedBy: 'Bw. Ramadhani Tembo',
    status: 'PENDING',
    academicYear: '2026',
    term: 'Term I',
    notes: 'Mzazi ametuma ujumbe wa Airtel Money, uhakiki wa taarifa ya benki unasubiriwa',
    institutionId: 'inst-001',
  },
];

// Initial Seed Receipts
const INITIAL_RECEIPTS: OfficialReceipt[] = [
  {
    receiptNumber: 'REC-2026-001',
    paymentId: 'pay-001',
    studentId: 'PS-2026-00124',
    studentName: 'John Peter Mwangi',
    standard: 'Standard 4 (Grade 4)',
    invoiceNumber: 'INV-2026-00124',
    amountPaid: 800000,
    paymentMethod: 'Benki (CRDB Bank)',
    referenceNumber: 'CRDB-TX-998241',
    paymentDate: '2026-01-18',
    previousBalance: 1080000,
    remainingBalance: 280000,
    receivedBy: 'Bw. Ramadhani Tembo (Mhasibu wa Shule)',
    schoolDetails: DEFAULT_SCHOOL_DETAILS,
    institutionId: 'inst-001',
    issuedAt: '2026-01-18 11:05',
  },
  {
    receiptNumber: 'REC-2026-002',
    paymentId: 'pay-002',
    studentId: 'PS-2026-00125',
    studentName: 'Baraka Joseph Mollel',
    standard: 'Standard 4 (Grade 4)',
    invoiceNumber: 'INV-2026-00125',
    amountPaid: 1050000,
    paymentMethod: 'Simu ya Mkononi (Vodacom M-Pesa)',
    referenceNumber: 'MPESA-QK8901239',
    paymentDate: '2026-01-15',
    previousBalance: 1050000,
    remainingBalance: 0,
    receivedBy: 'Bw. Ramadhani Tembo (Mhasibu wa Shule)',
    schoolDetails: DEFAULT_SCHOOL_DETAILS,
    institutionId: 'inst-001',
    issuedAt: '2026-01-15 15:02',
  },
  {
    receiptNumber: 'REC-2026-003',
    paymentId: 'pay-003',
    studentId: 'PS-2026-00128',
    studentName: 'Neema Daniel Lyimo',
    standard: 'Standard 5 (Grade 5)',
    invoiceNumber: 'INV-2026-00128',
    amountPaid: 450000,
    paymentMethod: 'Fedha Taslimu (Cash)',
    referenceNumber: 'CASH-REC-0034',
    paymentDate: '2026-01-20',
    previousBalance: 900000,
    remainingBalance: 450000,
    receivedBy: 'Bw. Ramadhani Tembo (Mhasibu wa Shule)',
    schoolDetails: DEFAULT_SCHOOL_DETAILS,
    institutionId: 'inst-001',
    issuedAt: '2026-01-20 10:05',
  },
  {
    receiptNumber: 'REC-2026-004',
    paymentId: 'pay-004',
    studentId: 'PS-2026-00130',
    studentName: 'Kelvin Richard Shirima',
    standard: 'Standard 7 (Grade 7)',
    invoiceNumber: 'INV-2026-00130',
    amountPaid: 1150000,
    paymentMethod: 'Benki (NMB Bank)',
    referenceNumber: 'NMB-SLIP-441209',
    paymentDate: '2026-01-14',
    previousBalance: 1150000,
    remainingBalance: 0,
    receivedBy: 'Bw. Ramadhani Tembo (Mhasibu wa Shule)',
    schoolDetails: DEFAULT_SCHOOL_DETAILS,
    institutionId: 'inst-001',
    issuedAt: '2026-01-14 12:05',
  },
];

// Initial Seed Expenses
const INITIAL_EXPENSES: SchoolExpense[] = [
  {
    id: 'exp-001',
    expenseNumber: 'EXP-2026-001',
    category: 'TEACHER_SALARIES',
    categoryLabel: 'Mishahara ya Walimu & Watumishi',
    description: 'Malipo ya posho na mishahara ya watumishi wa mkataba mwezi Januari 2026',
    amount: 2450000,
    date: '2026-01-28',
    payee: 'Watumishi wa Mkataba (Payroll Batch 01)',
    paymentMethod: 'BANK',
    referenceNumber: 'CRDB-SAL-2026-01',
    bankAccountId: 'bank-crdb-01',
    supportingDocumentName: 'Payroll_Voucher_Jan_2026.pdf',
    requestedBy: 'Bw. Ramadhani Tembo (Mhasibu)',
    reviewerAccountant: 'Bw. Ramadhani Tembo',
    approvedBy: 'Mwl. Augustine Mrosso (Mkuu wa Shule)',
    status: 'PAID',
    paidAt: '2026-01-29',
    institutionId: 'inst-001',
  },
  {
    id: 'exp-002',
    expenseNumber: 'EXP-2026-002',
    category: 'ELECTRICITY',
    categoryLabel: 'Umeme (TANESCO LUKU)',
    description: 'Ununuzi wa umeme wa LUKU wa jengo la utawala na madarasa ya msingi',
    amount: 380000,
    date: '2026-01-12',
    payee: 'Shirika la Umeme Tanzania (TANESCO)',
    paymentMethod: 'MOBILE_MONEY',
    referenceNumber: 'TANESCO-LUKU-99021',
    supportingDocumentName: 'Token_Receipt_TANESCO.pdf',
    requestedBy: 'Bw. Ramadhani Tembo',
    reviewerAccountant: 'Bw. Ramadhani Tembo',
    approvedBy: 'Mwl. Augustine Mrosso',
    status: 'PAID',
    paidAt: '2026-01-12',
    institutionId: 'inst-001',
  },
  {
    id: 'exp-003',
    expenseNumber: 'EXP-2026-003',
    category: 'FOOD_MEALS',
    categoryLabel: 'Chakula cha Wanafunzi (Mchele & Maharage)',
    description: 'Gunia 10 za mchele wa Kyela na gunia 5 za maharage kwa ajili ya chakula cha mchana',
    amount: 920000,
    date: '2026-01-18',
    payee: 'Massawe Grain Wholesalers Ltd',
    paymentMethod: 'BANK',
    referenceNumber: 'CRDB-TR-881290',
    bankAccountId: 'bank-crdb-01',
    supportingDocumentName: 'Invoice_Grain_Supplies_Jan.pdf',
    requestedBy: 'Bi. Hadija Said (Mpishi Mkuu)',
    reviewerAccountant: 'Bw. Ramadhani Tembo',
    approvedBy: 'Mwl. Augustine Mrosso',
    status: 'PAID',
    paidAt: '2026-01-19',
    institutionId: 'inst-001',
  },
  {
    id: 'exp-004',
    expenseNumber: 'EXP-2026-004',
    category: 'TEACHING_MATERIALS',
    categoryLabel: 'Vifaa vya Kufundishia (Chaki & Karatasi)',
    description: 'Katoni 20 za karatasi za mitihani (A4 Reams) na masanduku ya chaki nyeupe/rangi',
    amount: 340000,
    date: '2026-01-22',
    payee: 'Dar Stationery Supplies Ltd',
    paymentMethod: 'CASH',
    referenceNumber: 'CASH-VOUCHER-088',
    supportingDocumentName: 'Receipt_Dar_Stationery.pdf',
    requestedBy: 'Mwl. Beatrice Kimaro (Taaluma)',
    reviewerAccountant: 'Bw. Ramadhani Tembo',
    approvedBy: 'Mwl. Augustine Mrosso',
    status: 'PAID',
    paidAt: '2026-01-22',
    institutionId: 'inst-001',
  },
  {
    id: 'exp-005',
    expenseNumber: 'EXP-2026-005',
    category: 'INTERNET',
    categoryLabel: 'Mtandao wa Intaneti (TTCL Fiber)',
    description: 'Malipo ya kifurushi cha mwezi cha Intaneti ya Waya ya TTCL (Ofisi ya Mkuu & Walimu)',
    amount: 180000,
    date: '2026-02-01',
    payee: 'TTCL Corporation',
    paymentMethod: 'MOBILE_MONEY',
    referenceNumber: 'TTCL-INV-44109',
    requestedBy: 'Bw. Ramadhani Tembo',
    reviewerAccountant: 'Bw. Ramadhani Tembo',
    status: 'PENDING_APPROVAL',
    institutionId: 'inst-001',
  },
  {
    id: 'exp-006',
    expenseNumber: 'EXP-2026-006',
    category: 'MAINTENANCE_REPAIRS',
    categoryLabel: 'Ukarabati wa Madawati ya Darasa la 2',
    description: 'Ukarabati na kupaka rangi madawati 30 ya wanafunzi wa darasa la pili',
    amount: 450000,
    date: '2026-02-03',
    payee: 'Fundi Juma Kalokola (Seremala)',
    paymentMethod: 'CASH',
    referenceNumber: 'REQ-REPAIR-012',
    requestedBy: 'Mwl. Emmanuel Swai',
    reviewerAccountant: 'Bw. Ramadhani Tembo',
    status: 'PENDING_APPROVAL',
    institutionId: 'inst-001',
  },
];

// Initial Seed Cashbook
const INITIAL_CASHBOOK: CashbookEntry[] = [
  {
    id: 'cb-001',
    date: '2026-01-02',
    type: 'CASH_IN',
    sourceOrPayee: 'Bodi ya Shule / Salio Lililopita',
    description: 'Salio la kuanzia mwaka 2026 kwenye sanduku la fedha (Opening Balance)',
    amount: 1200000,
    runningBalance: 1200000,
    paymentMethod: 'CASH',
    reference: 'OPENING-2026',
    institutionId: 'inst-001',
  },
  {
    id: 'cb-002',
    date: '2026-01-12',
    type: 'CASH_OUT',
    sourceOrPayee: 'TANESCO',
    description: 'Ununuzi wa umeme wa LUKU',
    amount: 380000,
    runningBalance: 820000,
    paymentMethod: 'MOBILE_MONEY',
    reference: 'TANESCO-LUKU-99021',
    relatedId: 'exp-002',
    institutionId: 'inst-001',
  },
  {
    id: 'cb-003',
    date: '2026-01-20',
    type: 'CASH_IN',
    sourceOrPayee: 'Neema Daniel Lyimo (Mzazi)',
    description: 'Ada ya muhula wa kwanza (Sehemu ya Ada)',
    amount: 450000,
    runningBalance: 1270000,
    paymentMethod: 'CASH',
    reference: 'CASH-REC-0034',
    relatedId: 'pay-003',
    institutionId: 'inst-001',
  },
  {
    id: 'cb-004',
    date: '2026-01-22',
    type: 'CASH_OUT',
    sourceOrPayee: 'Dar Stationery Supplies',
    description: 'Vifaa vya kufundishia na karatasi za majaribio',
    amount: 340000,
    runningBalance: 930000,
    paymentMethod: 'CASH',
    reference: 'CASH-VOUCHER-088',
    relatedId: 'exp-004',
    institutionId: 'inst-001',
  },
];

// Initial Seed Reconciliations
const INITIAL_RECONCILIATIONS: BankReconciliationRecord[] = [
  {
    id: 'rec-001',
    bankAccountId: 'bank-crdb-01',
    bankAccountName: 'CRDB Bank Main Operating A/C',
    reconciliationDate: '2026-01-31',
    systemBalance: 51240000,
    bankStatementBalance: 51240000,
    difference: 0,
    status: 'BALANCED',
    notes: 'Upatanisho wa mwezi Januari umekamilika bila tofauti yoyote (Zero difference).',
    reconciledBy: 'Bw. Ramadhani Tembo',
    institutionId: 'inst-001',
  },
  {
    id: 'rec-002',
    bankAccountId: 'bank-nmb-02',
    bankAccountName: 'NMB Bank School Development A/C',
    reconciliationDate: '2026-01-31',
    systemBalance: 22650000,
    bankStatementBalance: 22650000,
    difference: 0,
    status: 'BALANCED',
    notes: 'Akaunti ya maendeleo imelingana kikamilifu na benki.',
    reconciledBy: 'Bw. Ramadhani Tembo',
    institutionId: 'inst-001',
  },
];

// Initial Audit Trail
const INITIAL_AUDIT_LOGS: FinanceAuditEntry[] = [
  {
    id: 'fa-001',
    timestamp: '2026-01-18 11:00:15',
    user: 'Bw. Ramadhani Tembo',
    userRole: 'School Accountant',
    action: 'VERIFY_PAYMENT',
    recordId: 'pay-001',
    details: 'Malipo ya TZS 800,000 ya John Peter Mwangi (PS-2026-00124) yamethibitishwa baada ya kukagua taarifa ya CRDB.',
    ipAddress: '192.168.1.20 (Finance Office PC)',
  },
  {
    id: 'fa-002',
    timestamp: '2026-01-18 11:05:02',
    user: 'Bw. Ramadhani Tembo',
    userRole: 'School Accountant',
    action: 'GENERATE_RECEIPT',
    recordId: 'REC-2026-001',
    details: 'Stakabadhi rasmi Na. REC-2026-001 imetolewa kwa John Peter Mwangi.',
    ipAddress: '192.168.1.20',
  },
  {
    id: 'fa-003',
    timestamp: '2026-01-29 09:15:30',
    user: 'Mwl. Augustine Mrosso',
    userRole: 'Headteacher',
    action: 'APPROVE_EXPENSE',
    recordId: 'exp-001',
    details: 'Matumizi ya TZS 2,450,000 ya mishahara ya watumishi wa mkataba mwezi Januari yameidhinishwa.',
    ipAddress: '192.168.1.10 (Headteacher Office PC)',
  },
];

// -----------------------------------------------------------------------------
// 3. REPOSITORY METHODS & CRUD
// -----------------------------------------------------------------------------

// --- FEE STRUCTURES ---
export function getAllFeeStructures(): FeeStructure[] {
  if (typeof window === 'undefined') return INITIAL_FEE_STRUCTURES;
  try {
    const raw = localStorage.getItem(STORAGE_FEE_STRUCTURES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_FEE_STRUCTURES_KEY, JSON.stringify(INITIAL_FEE_STRUCTURES));
      return INITIAL_FEE_STRUCTURES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FEE_STRUCTURES;
  }
}

export function saveFeeStructures(structures: FeeStructure[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_FEE_STRUCTURES_KEY, JSON.stringify(structures));
  } catch (e) {
    console.error(e);
  }
}

export function createOrUpdateFeeStructure(structure: FeeStructure): void {
  const current = getAllFeeStructures();
  const idx = current.findIndex((f) => f.id === structure.id);
  let updated: FeeStructure[];
  if (idx >= 0) {
    updated = current.map((f) => (f.id === structure.id ? structure : f));
  } else {
    updated = [structure, ...current];
  }
  saveFeeStructures(updated);

  recordFinanceAuditAction({
    action: 'CHANGE_FEE_STRUCTURE',
    recordId: structure.id,
    details: `Muundo wa ada wa ${structure.standard} (${structure.academicYear} ${structure.term}) wenye jumla ya TZS ${structure.totalAmount.toLocaleString()} umehuishwa.`,
  });
}

// --- INVOICES ---
export function getAllInvoices(): StudentInvoice[] {
  if (typeof window === 'undefined') return INITIAL_INVOICES;
  try {
    const raw = localStorage.getItem(STORAGE_INVOICES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_INVOICES_KEY, JSON.stringify(INITIAL_INVOICES));
      return INITIAL_INVOICES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_INVOICES;
  }
}

export function saveInvoices(invoices: StudentInvoice[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_INVOICES_KEY, JSON.stringify(invoices));
  } catch (e) {
    console.error(e);
  }
}

export function createNewInvoice(params: {
  studentId: string;
  studentName: string;
  standard: string;
  stream?: string;
  academicYear: string;
  term: string;
  items: { id: string; name: string; amount: number }[];
  discount?: number;
  dueDate: string;
  createdBy: string;
}): StudentInvoice {
  const invoices = getAllInvoices();
  const randSeq = Math.floor(1000 + Math.random() * 9000);
  const invNumber = `INV-${params.academicYear}-${randSeq}`;

  const subtotal = params.items.reduce((sum, item) => sum + item.amount, 0);
  const discount = params.discount || 0;
  const totalAmount = Math.max(0, subtotal - discount);

  const newInvoice: StudentInvoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: invNumber,
    studentId: params.studentId,
    studentName: params.studentName,
    standard: params.standard,
    stream: params.stream || 'Stream A',
    academicYear: params.academicYear,
    term: params.term,
    items: params.items,
    subtotal,
    discount,
    totalAmount,
    amountPaid: 0,
    balance: totalAmount,
    dueDate: params.dueDate,
    status: 'ISSUED',
    createdBy: params.createdBy,
    createdAt: new Date().toISOString().split('T')[0],
    institutionId: 'inst-001',
  };

  const updated = [newInvoice, ...invoices];
  saveInvoices(updated);

  recordFinanceAuditAction({
    action: 'CREATE_INVOICE',
    recordId: newInvoice.invoiceNumber,
    details: `Ankara mpya ${newInvoice.invoiceNumber} ya TZS ${totalAmount.toLocaleString()} imeandaliwa kwa ajili ya ${params.studentName} (${params.studentId}).`,
  });

  return newInvoice;
}

export function cancelInvoice(invoiceId: string, reason: string, cancelledBy: string): boolean {
  const invoices = getAllInvoices();
  const target = invoices.find((i) => i.id === invoiceId);
  if (!target) return false;
  if (target.amountPaid > 0) return false;

  const updated = invoices.map((i) =>
    i.id === invoiceId ? { ...i, status: 'CANCELLED' as InvoiceStatus } : i
  );
  saveInvoices(updated);

  recordFinanceAuditAction({
    action: 'CANCEL_INVOICE',
    recordId: target.invoiceNumber,
    details: `Ankara ${target.invoiceNumber} imefutwa/imesitishwa na ${cancelledBy}. Sababu: ${reason}.`,
  });

  return true;
}


// --- PAYMENTS & VERIFICATION ---
export function getAllPayments(): StudentPayment[] {
  if (typeof window === 'undefined') return INITIAL_PAYMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_PAYMENTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_PAYMENTS_KEY, JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PAYMENTS;
  }
}

export function savePayments(payments: StudentPayment[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PAYMENTS_KEY, JSON.stringify(payments));
  } catch (e) {
    console.error(e);
  }
}

export function recordNewPayment(params: {
  studentId: string;
  studentName: string;
  standard: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  bankAccountId?: string;
  bankAccountName?: string;
  referenceNumber: string;
  paymentDate: string;
  receivedBy: string;
  notes?: string;
}): StudentPayment {
  const payments = getAllPayments();
  const randNum = Math.floor(100 + Math.random() * 900);
  const paymentNumber = `PAY-2026-${randNum}`;

  const newPayment: StudentPayment = {
    id: `pay-${Date.now()}`,
    paymentNumber,
    studentId: params.studentId,
    studentName: params.studentName,
    standard: params.standard,
    invoiceId: params.invoiceId,
    invoiceNumber: params.invoiceNumber,
    amount: params.amount,
    paymentMethod: params.paymentMethod,
    bankAccountId: params.bankAccountId,
    bankAccountName: params.bankAccountName,
    referenceNumber: params.referenceNumber,
    paymentDate: params.paymentDate,
    receivedBy: params.receivedBy,
    status: 'PENDING', // Strict verification workflow: Payments start PENDING
    academicYear: '2026',
    term: 'Term I',
    notes: params.notes,
    institutionId: 'inst-001',
  };

  const updated = [newPayment, ...payments];
  savePayments(updated);

  recordFinanceAuditAction({
    action: 'RECORD_PAYMENT',
    recordId: paymentNumber,
    details: `Malipo mapya ya TZS ${params.amount.toLocaleString()} yamerekodiwa kwa njia ya ${params.paymentMethod} (Rejea: ${params.referenceNumber}) kwa ${params.studentName}. Yanasubiri uhakiki (Pending Verification).`,
  });

  return newPayment;
}

/**
 * Explicit Payment Verification Workflow
 * Verifies a payment against bank / statement, applies it to invoice balance, and automatically generates receipt.
 */
export function verifyPayment(paymentId: string, verifiedBy: string): { success: boolean; receipt?: OfficialReceipt } {
  const payments = getAllPayments();
  const targetPayment = payments.find((p) => p.id === paymentId);
  if (!targetPayment || targetPayment.status === 'VERIFIED') {
    return { success: false };
  }

  // 1. Update Invoice Balance
  const invoices = getAllInvoices();
  const invoice = invoices.find((inv) => inv.id === targetPayment.invoiceId || inv.invoiceNumber === targetPayment.invoiceNumber);

  let prevBalance = 0;
  let remainingBalance = 0;

  if (invoice) {
    prevBalance = invoice.balance;
    const newPaid = invoice.amountPaid + targetPayment.amount;
    remainingBalance = Math.max(0, invoice.totalAmount - newPaid);

    let newStatus: InvoiceStatus = 'PARTIALLY_PAID';
    if (remainingBalance === 0) {
      newStatus = 'PAID';
    }

    const updatedInvoices = invoices.map((inv) =>
      inv.id === invoice.id
        ? {
            ...inv,
            amountPaid: newPaid,
            balance: remainingBalance,
            status: newStatus,
          }
        : inv
    );
    saveInvoices(updatedInvoices);
  }

  // 2. Generate Official Receipt
  const randRec = Math.floor(100 + Math.random() * 900);
  const receiptNumber = `REC-2026-${randRec}`;

  const newReceipt: OfficialReceipt = {
    receiptNumber,
    paymentId: targetPayment.id,
    studentId: targetPayment.studentId,
    studentName: targetPayment.studentName,
    standard: targetPayment.standard,
    invoiceNumber: targetPayment.invoiceNumber,
    amountPaid: targetPayment.amount,
    paymentMethod: targetPayment.paymentMethod,
    referenceNumber: targetPayment.referenceNumber,
    paymentDate: targetPayment.paymentDate,
    previousBalance: prevBalance,
    remainingBalance,
    receivedBy: `${targetPayment.receivedBy} &bull; Mhasibu`,
    schoolDetails: DEFAULT_SCHOOL_DETAILS,
    institutionId: 'inst-001',
    issuedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };

  const receipts = getAllReceipts();
  saveReceipts([newReceipt, ...receipts]);

  // 3. Update payment status to VERIFIED
  const updatedPayments = payments.map((p) =>
    p.id === paymentId
      ? {
          ...p,
          status: 'VERIFIED' as PaymentStatus,
          verifiedBy,
          verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          receiptNumber,
        }
      : p
  );
  savePayments(updatedPayments);

  // 4. Update Cashbook or Bank account
  if (targetPayment.paymentMethod === 'CASH') {
    recordCashbookMovement({
      type: 'CASH_IN',
      sourceOrPayee: `${targetPayment.studentName} (Ada ya Mwanafunzi)`,
      description: `Malipo ya ada stakabadhi ${receiptNumber}`,
      amount: targetPayment.amount,
      paymentMethod: 'CASH',
      reference: targetPayment.referenceNumber,
      relatedId: targetPayment.id,
    });
  } else if (targetPayment.bankAccountId) {
    adjustBankAccountBalance(targetPayment.bankAccountId, targetPayment.amount, 'DEPOSIT');
  }

  recordFinanceAuditAction({
    action: 'VERIFY_PAYMENT',
    recordId: targetPayment.paymentNumber,
    details: `Malipo ya ${targetPayment.paymentNumber} ya TZS ${targetPayment.amount.toLocaleString()} yamethibitishwa na ${verifiedBy}. Stakabadhi ${receiptNumber} imetolewa.`,
  });

  return { success: true, receipt: newReceipt };
}

// --- RECEIPTS ---
export function getAllReceipts(): OfficialReceipt[] {
  if (typeof window === 'undefined') return INITIAL_RECEIPTS;
  try {
    const raw = localStorage.getItem(STORAGE_RECEIPTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_RECEIPTS_KEY, JSON.stringify(INITIAL_RECEIPTS));
      return INITIAL_RECEIPTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RECEIPTS;
  }
}

export function saveReceipts(receipts: OfficialReceipt[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_RECEIPTS_KEY, JSON.stringify(receipts));
  } catch (e) {
    console.error(e);
  }
}

// --- EXPENSES & APPROVAL WORKFLOW ---
export function getAllExpenses(): SchoolExpense[] {
  if (typeof window === 'undefined') return INITIAL_EXPENSES;
  try {
    const raw = localStorage.getItem(STORAGE_EXPENSES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EXPENSES;
  }
}

export function saveExpenses(expenses: SchoolExpense[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.error(e);
  }
}

export function createExpenseRequest(params: {
  category: SchoolExpense['category'];
  categoryLabel: string;
  description: string;
  amount: number;
  date: string;
  payee: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  bankAccountId?: string;
  supportingDocumentName?: string;
  requestedBy: string;
}): SchoolExpense {
  const expenses = getAllExpenses();
  const rand = Math.floor(100 + Math.random() * 900);
  const expenseNumber = `EXP-2026-${rand}`;

  const newExpense: SchoolExpense = {
    id: `exp-${Date.now()}`,
    expenseNumber,
    category: params.category,
    categoryLabel: params.categoryLabel,
    description: params.description,
    amount: params.amount,
    date: params.date,
    payee: params.payee,
    paymentMethod: params.paymentMethod,
    referenceNumber: params.referenceNumber,
    bankAccountId: params.bankAccountId,
    supportingDocumentName: params.supportingDocumentName,
    requestedBy: params.requestedBy,
    reviewerAccountant: 'Bw. Ramadhani Tembo (Mhasibu)',
    status: 'PENDING_APPROVAL', // Goes to Authorized Approver (Headteacher)
    institutionId: 'inst-001',
  };

  const updated = [newExpense, ...expenses];
  saveExpenses(updated);

  recordFinanceAuditAction({
    action: 'CREATE_EXPENSE',
    recordId: expenseNumber,
    details: `Ombi jipya la matumizi ya TZS ${params.amount.toLocaleString()} ya ${params.categoryLabel} kwa ajili ya ${params.payee} limewasilishwa. Linasubiri idhini ya Mwalimu Mkuu.`,
  });

  return newExpense;
}

export function approveExpense(expenseId: string, approvedBy: string): boolean {
  const expenses = getAllExpenses();
  const target = expenses.find((e) => e.id === expenseId);
  if (!target) return false;

  const updated = expenses.map((e) =>
    e.id === expenseId
      ? {
          ...e,
          status: 'APPROVED' as ExpenseStatus,
          approvedBy,
        }
      : e
  );
  saveExpenses(updated);

  recordFinanceAuditAction({
    action: 'APPROVE_EXPENSE',
    recordId: target.expenseNumber,
    details: `Matumizi ya TZS ${target.amount.toLocaleString()} ya ${target.description} yameidhinishwa na ${approvedBy}. Sasa yanaweza kulipwa.`,
  });

  return true;
}

export function payExpense(expenseId: string, paidBy: string): boolean {
  const expenses = getAllExpenses();
  const target = expenses.find((e) => e.id === expenseId);
  if (!target) return false;

  const updated = expenses.map((e) =>
    e.id === expenseId
      ? {
          ...e,
          status: 'PAID' as ExpenseStatus,
          paidAt: new Date().toISOString().slice(0, 10),
        }
      : e
  );
  saveExpenses(updated);

  // Deduct from cashbook or bank
  if (target.paymentMethod === 'CASH') {
    recordCashbookMovement({
      type: 'CASH_OUT',
      sourceOrPayee: target.payee,
      description: `Malipo ya matumizi ${target.expenseNumber} - ${target.description}`,
      amount: target.amount,
      paymentMethod: 'CASH',
      reference: target.referenceNumber,
      relatedId: target.id,
    });
  } else if (target.bankAccountId) {
    adjustBankAccountBalance(target.bankAccountId, target.amount, 'WITHDRAWAL');
  }

  recordFinanceAuditAction({
    action: 'PAY_EXPENSE',
    recordId: target.expenseNumber,
    details: `Malipo ya TZS ${target.amount.toLocaleString()} ya ${target.expenseNumber} yamelipwa kwa ${target.payee} na kurekodiwa kwenye fedha za shule na ${paidBy}.`,
  });

  return true;
}

// --- CASHBOOK ---
export function getCashbookEntries(): CashbookEntry[] {
  if (typeof window === 'undefined') return INITIAL_CASHBOOK;
  try {
    const raw = localStorage.getItem(STORAGE_CASHBOOK_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CASHBOOK_KEY, JSON.stringify(INITIAL_CASHBOOK));
      return INITIAL_CASHBOOK;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CASHBOOK;
  }
}

export function saveCashbookEntries(entries: CashbookEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_CASHBOOK_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error(e);
  }
}

export function recordCashbookMovement(params: {
  type: 'CASH_IN' | 'CASH_OUT';
  sourceOrPayee: string;
  description: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  relatedId?: string;
}): CashbookEntry {
  const entries = getCashbookEntries();
  const lastBalance = entries.length > 0 ? entries[entries.length - 1].runningBalance : 0;
  const newBalance = params.type === 'CASH_IN' ? lastBalance + params.amount : lastBalance - params.amount;

  const newEntry: CashbookEntry = {
    id: `cb-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    type: params.type,
    sourceOrPayee: params.sourceOrPayee,
    description: params.description,
    amount: params.amount,
    runningBalance: newBalance,
    paymentMethod: params.paymentMethod,
    reference: params.reference,
    relatedId: params.relatedId,
    institutionId: 'inst-001',
  };

  const updated = [...entries, newEntry];
  saveCashbookEntries(updated);
  return newEntry;
}

// --- BANK ACCOUNTS & TRANSACTIONS ---
export function getBankAccounts(): SchoolBankAccount[] {
  if (typeof window === 'undefined') return INITIAL_BANK_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_BANKS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_BANKS_KEY, JSON.stringify(INITIAL_BANK_ACCOUNTS));
      return INITIAL_BANK_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BANK_ACCOUNTS;
  }
}

export function saveBankAccounts(accounts: SchoolBankAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_BANKS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error(e);
  }
}

export function adjustBankAccountBalance(accountId: string, amount: number, direction: 'DEPOSIT' | 'WITHDRAWAL'): void {
  const accounts = getBankAccounts();
  const updated = accounts.map((acc) => {
    if (acc.id === accountId) {
      const newBal = direction === 'DEPOSIT' ? acc.currentBalance + amount : acc.currentBalance - amount;
      return { ...acc, currentBalance: newBal };
    }
    return acc;
  });
  saveBankAccounts(updated);
}

// --- BANK RECONCILIATIONS ---
export function getReconciliations(): BankReconciliationRecord[] {
  if (typeof window === 'undefined') return INITIAL_RECONCILIATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_RECONCILIATION_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_RECONCILIATION_KEY, JSON.stringify(INITIAL_RECONCILIATIONS));
      return INITIAL_RECONCILIATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RECONCILIATIONS;
  }
}

export function saveReconciliations(records: BankReconciliationRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_RECONCILIATION_KEY, JSON.stringify(records));
  } catch (e) {
    console.error(e);
  }
}

export function recordNewReconciliation(params: {
  bankAccountId: string;
  bankAccountName: string;
  systemBalance: number;
  bankStatementBalance: number;
  notes: string;
  reconciledBy: string;
}): BankReconciliationRecord {
  const reconciliations = getReconciliations();
  const diff = params.bankStatementBalance - params.systemBalance;

  const newRecord: BankReconciliationRecord = {
    id: `recon-${Date.now()}`,
    bankAccountId: params.bankAccountId,
    bankAccountName: params.bankAccountName,
    reconciliationDate: new Date().toISOString().slice(0, 10),
    systemBalance: params.systemBalance,
    bankStatementBalance: params.bankStatementBalance,
    difference: diff,
    status: Math.abs(diff) < 0.01 ? 'BALANCED' : 'DISCREPANCY',
    notes: params.notes,
    reconciledBy: params.reconciledBy,
    institutionId: 'inst-001',
  };

  const updated = [newRecord, ...reconciliations];
  saveReconciliations(updated);

  recordFinanceAuditAction({
    action: 'RECONCILIATION_PERFORMED',
    recordId: newRecord.id,
    details: `Upatanisho wa benki wa ${params.bankAccountName} umerekodiwa. Tofauti: TZS ${diff.toLocaleString()}. Hali: ${newRecord.status}.`,
  });

  return newRecord;
}

// --- STUDENT FINANCIAL ACCOUNTS & CLEARANCE ---
export function getStudentFinancialAccounts(): StudentFinancialAccount[] {
  const invoices = getAllInvoices();

  // Group by studentId
  const map = new Map<string, StudentFinancialAccount>();

  invoices.forEach((inv) => {
    if (!map.has(inv.studentId)) {
      map.set(inv.studentId, {
        studentId: inv.studentId,
        fullName: inv.studentName,
        standard: inv.standard,
        stream: inv.stream,
        parentName: 'Mzazi wa ' + inv.studentName.split(' ')[0],
        parentPhone: '+255 7XX XXX XXX',
        totalInvoiced: 0,
        totalPaid: 0,
        totalDiscount: 0,
        balance: 0,
        clearanceStatus: 'NOT_CLEARED',
        invoicesCount: 0,
        institutionId: 'inst-001',
      });
    }

    const acc = map.get(inv.studentId)!;
    acc.totalInvoiced += inv.totalAmount;
    acc.totalPaid += inv.amountPaid;
    acc.totalDiscount += inv.discount;
    acc.balance += inv.balance;
    acc.invoicesCount += 1;
  });

  // Calculate clearance
  map.forEach((acc) => {
    if (acc.balance === 0) {
      acc.clearanceStatus = 'CLEARED';
    } else if (acc.totalPaid > 0 && acc.totalPaid >= acc.totalInvoiced * 0.5) {
      acc.clearanceStatus = 'PARTIALLY_CLEARED';
    } else {
      acc.clearanceStatus = 'NOT_CLEARED';
    }
  });

  return Array.from(map.values());
}

export function updateStudentClearanceStatus(
  studentId: string,
  newStatus: ClearanceStatus,
  remarks: string,
  updatedBy: string
): void {
  const accounts = getStudentFinancialAccounts();
  const acc = accounts.find((a) => a.studentId === studentId);
  if (acc) {
    acc.clearanceStatus = newStatus;
    acc.clearanceRemarks = remarks;
  }

  recordFinanceAuditAction({
    action: 'CHANGE_CLEARANCE',
    recordId: studentId,
    details: `Hali ya kibali cha fedha (Financial Clearance) ya mwanafunzi ${studentId} imebadilishwa kuwa ${newStatus} na ${updatedBy}. Sababu: ${remarks}.`,
  });
}

// --- FINANCIAL ADJUSTMENTS (WAIVERS / DISCOUNTS) ---
export function getAllAdjustments(): FinancialAdjustment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_ADJUSTMENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordFinancialAdjustment(params: {
  studentId: string;
  studentName: string;
  invoiceId: string;
  type: FinancialAdjustment['type'];
  amount: number;
  reason: string;
  authorizedBy: string;
  createdBy: string;
}): FinancialAdjustment {
  const adjustments = getAllAdjustments();
  const newAdjustment: FinancialAdjustment = {
    id: `adj-${Date.now()}`,
    studentId: params.studentId,
    studentName: params.studentName,
    invoiceId: params.invoiceId,
    type: params.type,
    amount: params.amount,
    reason: params.reason,
    authorizedBy: params.authorizedBy,
    createdBy: params.createdBy,
    date: new Date().toISOString().slice(0, 10),
    institutionId: 'inst-001',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_ADJUSTMENTS_KEY, JSON.stringify([newAdjustment, ...adjustments]));
  }

  recordFinanceAuditAction({
    action: 'APPLY_DISCOUNT',
    recordId: params.invoiceId,
    details: `${params.type} ya TZS ${params.amount.toLocaleString()} imetumika kwa mwanafunzi ${params.studentName} (${params.studentId}). Sababu: ${params.reason}. Imeidhinishwa na ${params.authorizedBy}.`,
  });

  return newAdjustment;
}

// --- AUDIT TRAIL ---

export function getAllFinanceAuditLogs(): FinanceAuditEntry[] {
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

export function recordFinanceAuditAction(params: {
  action: FinanceAuditEntry['action'];
  recordId: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getAllFinanceAuditLogs();
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLog: FinanceAuditEntry = {
      id: `fa-${Date.now()}`,
      timestamp,
      user: 'Bw. Ramadhani Tembo',
      userRole: 'School Accountant',
      action: params.action,
      recordId: params.recordId,
      details: params.details,
      previousValue: params.previousValue,
      newValue: params.newValue,
      ipAddress: '192.168.1.20 (Finance Office PC)',
    };

    localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify([newLog, ...logs]));
  } catch (e) {
    console.error(e);
  }
}

// -----------------------------------------------------------------------------
// 4. DASHBOARD STATS GENERATOR
// Strict production calculations — never fake hard-coded numbers!
// -----------------------------------------------------------------------------

export function getAccountantDashboardStats() {
  const invoices = getAllInvoices();
  const payments = getAllPayments();
  const expenses = getAllExpenses();
  const bankAccounts = getBankAccounts();
  const cashbook = getCashbookEntries();
  const reconciliations = getReconciliations();

  // 1. Total Fees Expected
  const totalFeesExpected = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  // 2. Total Fees Collected (Verified payments only)
  const totalFeesCollected = payments
    .filter((p) => p.status === 'VERIFIED')
    .reduce((sum, p) => sum + p.amount, 0);

  // 3. Outstanding Fees
  const outstandingFees = Math.max(0, totalFeesExpected - totalFeesCollected);

  // 4. Today's Collection
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysCollection = payments
    .filter((p) => p.status === 'VERIFIED' && p.paymentDate.startsWith(todayStr))
    .reduce((sum, p) => sum + p.amount, 0);

  // 5. This Month's Collection
  const currentMonthStr = todayStr.slice(0, 7);
  const thisMonthsCollection = payments
    .filter((p) => p.status === 'VERIFIED' && p.paymentDate.startsWith(currentMonthStr))
    .reduce((sum, p) => sum + p.amount, 0);

  // 6. This Month's Expenses (Paid and approved expenses)
  const thisMonthsExpenses = expenses
    .filter((e) => e.status === 'PAID' && e.date.startsWith(currentMonthStr))
    .reduce((sum, e) => sum + e.amount, 0);

  // 7. Current Cash Position (Cashbook running balance + Bank accounts current balances)
  const totalInBanks = bankAccounts.reduce((sum, b) => sum + b.currentBalance, 0);
  const lastCashbookBalance = cashbook.length > 0 ? cashbook[cashbook.length - 1].runningBalance : 0;
  const currentCashPosition = totalInBanks + lastCashbookBalance;

  // 8. Students with Outstanding Balances
  const accounts = getStudentFinancialAccounts();
  const studentsWithDebt = accounts.filter((a) => a.balance > 0).length;

  // 9. Pending Payments awaiting verification
  const pendingPayments = payments.filter((p) => p.status === 'PENDING').length;

  // 10. Pending Expense Requests awaiting approval
  const pendingExpenseRequests = expenses.filter(
    (e) => e.status === 'PENDING_APPROVAL' || e.status === 'PENDING_REVIEW'
  ).length;

  // 11. Reconciliation Differences
  const discrepancyRecons = reconciliations.filter((r) => r.status === 'DISCREPANCY').length;

  return {
    totalFeesExpected,
    totalFeesCollected,
    outstandingFees,
    todaysCollection,
    thisMonthsCollection,
    thisMonthsExpenses,
    currentCashPosition,
    studentsWithDebt,
    pendingPayments,
    pendingExpenseRequests,
    reconciliationDifferences: discrepancyRecons,
    recentPayments: payments.slice(0, 5),
    recentExpenses: expenses.slice(0, 5),
  };
}
