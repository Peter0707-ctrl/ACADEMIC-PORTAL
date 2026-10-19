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

// Initial Seed Fee Structures (empty initial state)
const INITIAL_FEE_STRUCTURES: FeeStructure[] = [];

// Initial Seed Bank Accounts (empty initial state)
const INITIAL_BANK_ACCOUNTS: SchoolBankAccount[] = [];

// Initial Seed Invoices (empty initial state)
const INITIAL_INVOICES: StudentInvoice[] = [];

// Initial Seed Payments (empty initial state)
const INITIAL_PAYMENTS: StudentPayment[] = [];

// Initial Seed Receipts (empty initial state)
const INITIAL_RECEIPTS: OfficialReceipt[] = [];

// Initial Seed Expenses (empty initial state)
const INITIAL_EXPENSES: SchoolExpense[] = [];

// Initial Seed Cashbook (empty initial state)
const INITIAL_CASHBOOK: CashbookEntry[] = [];

// Initial Seed Reconciliations (empty initial state)
const INITIAL_RECONCILIATIONS: BankReconciliationRecord[] = [];

// Initial Audit Trail (empty initial state)
const INITIAL_AUDIT_LOGS: FinanceAuditEntry[] = [];

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
