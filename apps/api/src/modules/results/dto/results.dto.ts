import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApprovalDecision } from '@prisma/client';

export class SingleMarkDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  @IsNotEmpty()
  rawMark: number;

  @IsString()
  @IsOptional()
  comments?: string;
}

export class RecordMarksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleMarkDto)
  marks: SingleMarkDto[];
}

export class SubmitResultsDto {
  @IsString()
  @IsOptional()
  submissionNotes?: string;
}

export class ApproveResultsDto {
  @IsEnum(ApprovalDecision)
  @IsNotEmpty()
  decision: ApprovalDecision; // APPROVED | RETURNED_FOR_CORRECTION | REJECTED

  @IsString()
  @IsOptional()
  comments?: string;
}

export class SchedulePublicationDto {
  @IsDateString()
  @IsOptional()
  scheduledAt?: string; // If omitted or <= now(), publishes immediately
}

export class RequestCorrectionDto {
  @IsString()
  @IsNotEmpty()
  resultEntryId: string;

  @IsNumber()
  @IsNotEmpty()
  proposedMark: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class ReviewCorrectionDto {
  @IsEnum(['APPROVED', 'REJECTED'])
  @IsNotEmpty()
  decision: 'APPROVED' | 'REJECTED';

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
