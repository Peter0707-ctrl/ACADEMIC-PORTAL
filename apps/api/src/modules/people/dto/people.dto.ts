import { IsNotEmpty, IsString, IsEmail, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { StudentStatus } from '@academic/shared';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  studentNumber: string;

  @IsString()
  @IsNotEmpty()
  admissionNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(StudentStatus)
  @IsOptional()
  status?: StudentStatus;
}

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  staffNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class LinkParentChildDto {
  @IsString()
  @IsNotEmpty()
  parentGuardianId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  relationship: string;
}
