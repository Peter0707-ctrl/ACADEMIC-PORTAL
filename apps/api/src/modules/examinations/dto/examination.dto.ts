import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { ExamStatus } from '@academic/shared';

export class CreateExaminationDto {
  @IsString()
  @IsNotEmpty()
  academicYearId: string;

  @IsString()
  @IsOptional()
  termId?: string;

  @IsString()
  @IsNotEmpty()
  name: string; // e.g. "Term 1 Mid-Term 2026"

  @IsString()
  @IsNotEmpty()
  code: string; // e.g. "MID-2026-T1"

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(ExamStatus)
  @IsOptional()
  status?: ExamStatus;
}

export class ScheduleExamDto {
  @IsString()
  @IsNotEmpty()
  programClassId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsNumber()
  @IsNotEmpty()
  maxMarks: number;

  @IsDateString()
  @IsOptional()
  examDate?: string;

  @IsDateString()
  @IsOptional()
  submissionDeadline?: string;
}
