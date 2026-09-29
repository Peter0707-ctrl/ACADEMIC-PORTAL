import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { PrismaService } from '../../../database/prisma.service';
import { ExcelValidationResult, RowValidationError, ExcelMarkRow, RoleType } from '@academic/shared';

@Injectable()
export class ExcelExaminationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generates a pre-filled Excel template for teachers to enter marks.
   */
  async generateMarksTemplate(
    institutionId: string,
    examScheduleId: string,
    requestingUserId: string,
    userRoles: RoleType[],
  ): Promise<Buffer> {
    const schedule = await this.prisma.examSchedule.findFirst({
      where: {
        id: examScheduleId,
        examination: { institutionId },
      },
      include: {
        examination: true,
        programClass: {
          include: {
            enrollments: {
              where: { isActive: true },
              include: { student: true },
              orderBy: { student: { lastName: 'asc' } },
            },
          },
        },
        subject: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Exam schedule not found in this institution');
    }

    // Authorization check: If user is only a TEACHER, verify they are assigned to this class & subject
    const isElevated = userRoles.some((r) =>
      [RoleType.SUPER_ADMIN, RoleType.INSTITUTION_ADMIN, RoleType.HEADMASTER_PRINCIPAL, RoleType.ACADEMIC_MASTER].includes(r),
    );

    if (!isElevated) {
      const staff = await this.prisma.staff.findFirst({
        where: { userId: requestingUserId, institutionId },
      });

      if (!staff) {
        throw new ForbiddenException('Staff profile not found');
      }

      const assignment = await this.prisma.teacherAssignment.findFirst({
        where: {
          staffId: staff.id,
          programClassId: schedule.programClassId,
          subjectId: schedule.subjectId,
        },
      });

      if (!assignment) {
        throw new ForbiddenException('You are not assigned to teach this subject in this class');
      }
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Academic Digital OS';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Marks Entry', {
      views: [{ state: 'frozen', ySplit: 5 }],
    });

    // Title & Metadata Headers
    sheet.mergeCells('A1:F1');
    sheet.getCell('A1').value = `${schedule.examination.name.toUpperCase()} - OFFICIAL MARKS ENTRY`;
    sheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    sheet.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E40AF' }, // Blue
    };
    sheet.getCell('A1').alignment = { horizontal: 'center' };

    sheet.mergeCells('A2:F2');
    sheet.getCell('A2').value = `Class: ${schedule.programClass.name} | Subject: ${schedule.subject.name} (${schedule.subject.code}) | Max Marks: ${schedule.maxMarks}`;
    sheet.getCell('A2').font = { italic: true, size: 11 };
    sheet.getCell('A2').alignment = { horizontal: 'center' };

    sheet.mergeCells('A3:F3');
    sheet.getCell('A3').value = `Schedule ID: ${schedule.id} (DO NOT MODIFY)`;
    sheet.getCell('A3').font = { size: 9, color: { argb: 'FF6B7280' } };
    sheet.getCell('A3').alignment = { horizontal: 'center' };

    // Column Headers
    sheet.getRow(5).values = [
      'Row #',
      'Student ID',
      'Admission No',
      'Student Full Name',
      `Mark (0 - ${schedule.maxMarks})`,
      'Teacher Comments',
    ];

    sheet.getRow(5).font = { bold: true };
    sheet.getRow(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2E8F0' },
    };

    // Populate rows with enrolled students
    const enrollments = schedule.programClass.enrollments;
    let rowIndex = 6;

    for (let i = 0; i < enrollments.length; i++) {
      const student = enrollments[i].student;
      sheet.getRow(rowIndex).values = [
        i + 1,
        student.studentNumber,
        student.admissionNumber,
        `${student.lastName}, ${student.firstName} ${student.middleName || ''}`.trim(),
        '', // Mark to be filled by teacher
        '',
      ];
      rowIndex++;
    }

    // Formatting columns
    sheet.columns = [
      { width: 8 },
      { width: 18 },
      { width: 18 },
      { width: 30 },
      { width: 18 },
      { width: 35 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Parses and validates uploaded Excel marks workbook with strict row-by-row checks.
   */
  async validateUploadedMarks(
    institutionId: string,
    examScheduleId: string,
    fileBuffer: Buffer,
    requestingUserId: string,
    userRoles: RoleType[],
  ): Promise<ExcelValidationResult> {
    const schedule = await this.prisma.examSchedule.findFirst({
      where: {
        id: examScheduleId,
        examination: { institutionId },
      },
      include: {
        examination: true,
        programClass: {
          include: {
            enrollments: {
              where: { isActive: true },
              include: { student: true },
            },
          },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException('Exam schedule not found in this institution');
    }

    // Examination status check
    if (schedule.examination.status !== 'OPEN' && schedule.examination.status !== 'MARKING') {
      throw new BadRequestException(
        `Examination is currently ${schedule.examination.status}. Marks can only be entered when OPEN or MARKING.`,
      );
    }

    // Authorization check
    const isElevated = userRoles.some((r) =>
      [RoleType.SUPER_ADMIN, RoleType.INSTITUTION_ADMIN, RoleType.HEADMASTER_PRINCIPAL, RoleType.ACADEMIC_MASTER].includes(r),
    );

    if (!isElevated) {
      const staff = await this.prisma.staff.findFirst({
        where: { userId: requestingUserId, institutionId },
      });

      if (!staff) {
        throw new ForbiddenException('Staff record not found');
      }

      const assignment = await this.prisma.teacherAssignment.findFirst({
        where: {
          staffId: staff.id,
          programClassId: schedule.programClassId,
          subjectId: schedule.subjectId,
        },
      });

      if (!assignment) {
        throw new ForbiddenException('You are not authorized to upload marks for this subject and class');
      }
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer as any);

    const sheet = workbook.getWorksheet(1);
    if (!sheet) {
      throw new BadRequestException('Uploaded file does not contain a valid worksheet');
    }

    const errors: RowValidationError[] = [];
    const parsedMarks: ExcelMarkRow[] = [];
    const seenStudentNumbers = new Set<string>();

    const enrolledStudentsMap = new Map<string, any>();
    for (const enrollment of schedule.programClass.enrollments) {
      enrolledStudentsMap.set(enrollment.student.studentNumber, enrollment.student);
    }

    // Iterate starting from row 6 (after headers)
    const rowCount = sheet.rowCount;
    let validCount = 0;

    for (let r = 6; r <= rowCount; r++) {
      const row = sheet.getRow(r);
      const studentNumberVal = row.getCell(2).value;

      if (!studentNumberVal) {
        continue; // Skip empty rows
      }

      const studentNumber = String(studentNumberVal).trim();
      const rawMarkVal = row.getCell(5).value;
      const commentsVal = row.getCell(6).value ? String(row.getCell(6).value).trim() : undefined;

      // 1. Check duplicate student row in Excel
      if (seenStudentNumbers.has(studentNumber)) {
        errors.push({
          rowNumber: r,
          studentNumber,
          field: 'studentNumber',
          error: `Duplicate entry for Student ID '${studentNumber}' found in uploaded file`,
        });
        continue;
      }
      seenStudentNumbers.add(studentNumber);

      // 2. Validate student enrollment in this class & tenant
      const student = enrolledStudentsMap.get(studentNumber);
      if (!student) {
        errors.push({
          rowNumber: r,
          studentNumber,
          field: 'studentNumber',
          error: `Student ID '${studentNumber}' does not belong to this class (${schedule.programClass.name})`,
        });
        continue;
      }

      // 3. Validate numeric mark
      if (rawMarkVal === null || rawMarkVal === undefined || rawMarkVal === '') {
        errors.push({
          rowNumber: r,
          studentNumber,
          field: 'mark',
          error: `Mark is required and cannot be empty`,
        });
        continue;
      }

      const numericMark = Number(rawMarkVal);
      if (isNaN(numericMark)) {
        errors.push({
          rowNumber: r,
          studentNumber,
          field: 'mark',
          error: `Mark '${rawMarkVal}' is not a valid number`,
          receivedValue: rawMarkVal,
        });
        continue;
      }

      // 4. Validate mark boundary [0, maxMarks]
      if (numericMark < 0 || numericMark > schedule.maxMarks) {
        errors.push({
          rowNumber: r,
          studentNumber,
          field: 'mark',
          error: `Mark ${numericMark} is outside allowed range (0 - ${schedule.maxMarks})`,
          receivedValue: numericMark,
        });
        continue;
      }

      validCount++;
      parsedMarks.push({
        rowNumber: r,
        studentNumber,
        studentName: `${student.lastName}, ${student.firstName}`,
        mark: numericMark,
        comments: commentsVal,
      });
    }

    return {
      isValid: errors.length === 0,
      totalRows: parsedMarks.length + errors.length,
      validRowsCount: validCount,
      errorsCount: errors.length,
      errors,
      parsedMarks,
    };
  }
}
