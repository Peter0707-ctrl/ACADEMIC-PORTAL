import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateAcademicYearDto {
  @IsString()
  @IsNotEmpty()
  name: string; // e.g. "2026"

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;
}

export class CreateAcademicTermDto {
  @IsString()
  @IsNotEmpty()
  name: string; // e.g. "Term 1"

  @IsNumber()
  @IsNotEmpty()
  termNumber: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;
}

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  code: string; // e.g. "F1"

  @IsString()
  @IsNotEmpty()
  name: string; // e.g. "Form 1"

  @IsNumber()
  @IsNotEmpty()
  levelNumber: number;

  @IsNumber()
  @IsOptional()
  capacity?: number;
}

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  code: string; // e.g. "PHY"

  @IsString()
  @IsNotEmpty()
  name: string; // e.g. "Physics"

  @IsBoolean()
  @IsOptional()
  isCore?: boolean;

  @IsNumber()
  @IsOptional()
  credits?: number;

  @IsNumber()
  @IsOptional()
  passMark?: number;
}

export class AssignTeacherDto {
  @IsString()
  @IsNotEmpty()
  staffId: string;

  @IsString()
  @IsNotEmpty()
  programClassId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  academicYearId: string;

  @IsString()
  @IsOptional()
  streamId?: string;
}

export class EnrollStudentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  programClassId: string;

  @IsString()
  @IsNotEmpty()
  academicYearId: string;

  @IsString()
  @IsOptional()
  streamId?: string;
}
