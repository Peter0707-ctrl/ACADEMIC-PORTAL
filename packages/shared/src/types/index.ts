import { InstitutionType, AcademicCycleType, RoleType, ResultApprovalMode } from '../enums';
import { PermissionKey } from '../permissions';

export interface UserJwtPayload {
  sub: string;             // User ID (UUID)
  email: string;
  tenantId: string | null; // null for platform Super Admin
  roles: RoleType[];
  permissions: PermissionKey[];
  firstName: string;
  lastName: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  tenantId: string | null;
  roles: RoleType[];
  permissions: PermissionKey[];
  firstName: string;
  lastName: string;
  teacherId?: string;
  studentId?: string;
  parentId?: string;
}

export interface TenantContext {
  tenantId: string;
  institutionType: InstitutionType;
  institutionName: string;
}

export interface InstitutionConfig {
  institutionType: InstitutionType;
  academicCycle: AcademicCycleType;
  hasStreams: boolean;
  hasFaculties: boolean;
  hasCredits: boolean;
  positionEnabled: boolean;
  resultApprovalMode: ResultApprovalMode;
  requireFinancialClearanceForResults: boolean;
  attendanceThresholdPercent: number;
}

export interface ExcelMarkRow {
  rowNumber: number;
  studentNumber: string;
  studentName: string;
  mark: number;
  comments?: string;
}

export interface RowValidationError {
  rowNumber: number;
  studentNumber: string;
  field: string;
  error: string;
  receivedValue?: any;
}

export interface ExcelValidationResult {
  isValid: boolean;
  totalRows: number;
  validRowsCount: number;
  errorsCount: number;
  errors: RowValidationError[];
  parsedMarks: ExcelMarkRow[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    page?: number;
    limit?: number;
    total?: number;
  };
}
