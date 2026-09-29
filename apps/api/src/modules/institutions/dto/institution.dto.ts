import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { InstitutionType, AcademicCycleType, ResultApprovalMode } from '@academic/shared';

export class CreateInstitutionDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(InstitutionType)
  type: InstitutionType;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  registrationNo?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;
}

export class UpdateInstitutionSettingsDto {
  @IsEnum(AcademicCycleType)
  @IsOptional()
  cycleType?: AcademicCycleType;

  @IsNumber()
  @IsOptional()
  cyclesPerYear?: number;

  @IsBoolean()
  @IsOptional()
  hasStreams?: boolean;

  @IsBoolean()
  @IsOptional()
  hasFaculties?: boolean;

  @IsBoolean()
  @IsOptional()
  hasCredits?: boolean;

  @IsBoolean()
  @IsOptional()
  positionEnabled?: boolean;

  @IsEnum(ResultApprovalMode)
  @IsOptional()
  resultApprovalMode?: ResultApprovalMode;

  @IsBoolean()
  @IsOptional()
  requireFinancialClearanceForResults?: boolean;

  @IsNumber()
  @IsOptional()
  attendanceThresholdPercent?: number;
}
