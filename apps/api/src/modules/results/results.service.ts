import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CalculationEngineService } from './services/calculation-engine.service';
import {
  RecordMarksDto,
  ApproveResultsDto,
  SchedulePublicationDto,
  RequestCorrectionDto,
  ReviewCorrectionDto,
} from './dto/results.dto';
import {
  ApprovalDecision,
  ResultSubmissionStatus,
  PublicationScheduleStatus,
  CorrectionStatus,
  FinancialClearanceStatus,
} from '@prisma/client';
import { RoleType } from '@academic/shared';

@Injectable()
export class ResultsService {
  constructor(
    private prisma: PrismaService,
    private calculationEngine: CalculationEngineService,
  ) {}

  /**
   * Saves or updates draft marks entered by a teacher.
   */
  async recordDraftMarks(
    institutionId: string,
    examScheduleId: string,
    dto: RecordMarksDto,
    requestingUserId: string,
    userRoles: RoleType[],
  ) {
    const schedule = await this.prisma.examSchedule.findFirst({
      where: { id: examScheduleId, examination: { institutionId } },
      include: { examination: true },
    });

    if (!schedule) {
      throw new NotFoundException('Exam schedule not found');
    }

    if (schedule.examination.status !== 'OPEN' && schedule.examination.status !== 'MARKING') {
      throw new BadRequestException('Marks cannot be entered for closed or draft examinations');
    }

    // Verify Teacher Assignment if not elevated
    await this.verifyTeacherAuthorization(institutionId, schedule, requestingUserId, userRoles);

    // Save marks in transaction
    return this.prisma.$transaction(async (tx) => {
      const saved = [];
      for (const m of dto.marks) {
        if (m.rawMark < 0 || m.rawMark > schedule.maxMarks) {
          throw new BadRequestException(
            `Mark ${m.rawMark} for student ${m.studentId} exceeds maximum allowable mark of ${schedule.maxMarks}`,
          );
        }

        const entry = await tx.resultEntry.upsert({
          where: {
            examScheduleId_studentId: {
              examScheduleId,
              studentId: m.studentId,
            },
          },
          update: {
            rawMark: m.rawMark,
            comments: m.comments,
            status: ResultSubmissionStatus.DRAFT,
          },
          create: {
            examScheduleId,
            studentId: m.studentId,
            rawMark: m.rawMark,
            comments: m.comments,
            status: ResultSubmissionStatus.DRAFT,
          },
        });
        saved.push(entry);
      }
      return { count: saved.length, results: saved };
    });
  }

  /**
   * Teacher submits results for review. Locks teacher from further direct modifications.
   */
  async submitResults(
    institutionId: string,
    examScheduleId: string,
    requestingUserId: string,
    userRoles: RoleType[],
  ) {
    const schedule = await this.prisma.examSchedule.findFirst({
      where: { id: examScheduleId, examination: { institutionId } },
      include: { results: true },
    });

    if (!schedule) {
      throw new NotFoundException('Exam schedule not found');
    }

    await this.verifyTeacherAuthorization(institutionId, schedule, requestingUserId, userRoles);

    if (schedule.results.length === 0) {
      throw new BadRequestException('Cannot submit empty results. Please enter marks first.');
    }

    // Lock results to SUBMITTED
    await this.prisma.resultEntry.updateMany({
      where: { examScheduleId },
      data: { status: ResultSubmissionStatus.SUBMITTED },
    });

    return {
      success: true,
      message: 'Results have been submitted successfully and are now awaiting review and approval',
      submittedCount: schedule.results.length,
    };
  }

  /**
   * Approver (Academic Master or Headmaster) reviews and approves or returns results.
   */
  async approveResults(
    institutionId: string,
    examScheduleId: string,
    dto: ApproveResultsDto,
    approverUserId: string,
  ) {
    const staff = await this.prisma.staff.findFirst({
      where: { userId: approverUserId, institutionId },
    });

    if (!staff) {
      throw new ForbiddenException('Approver must have an active staff record in this institution');
    }

    const schedule = await this.prisma.examSchedule.findFirst({
      where: { id: examScheduleId, examination: { institutionId } },
      include: {
        examination: true,
        programClass: true,
        subject: true,
        results: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Exam schedule not found');
    }

    if (schedule.results.length === 0) {
      throw new BadRequestException('No results found to approve');
    }

    // If returning for correction
    if (dto.decision === ApprovalDecision.RETURNED_FOR_CORRECTION) {
      await this.prisma.$transaction([
        this.prisma.resultEntry.updateMany({
          where: { examScheduleId },
          data: { status: ResultSubmissionStatus.RETURNED },
        }),
        this.prisma.resultApproval.create({
          data: {
            examScheduleId,
            staffId: staff.id,
            decision: ApprovalDecision.RETURNED_FOR_CORRECTION,
            comments: dto.comments || 'Returned to teacher for corrections',
          },
        }),
      ]);

      return {
        decision: 'RETURNED_FOR_CORRECTION',
        message: 'Results have been returned to teacher for corrections',
      };
    }

    // Approval flow: fetch Institution Settings & Grade Boundaries
    const settings = await this.prisma.institutionSetting.findUnique({
      where: { institutionId },
    });

    const gradeScale = await this.prisma.gradeScale.findFirst({
      where: { institutionId },
      include: { boundaries: true },
    });

    const boundaries = gradeScale?.boundaries || [];
    const positionEnabled = settings?.positionEnabled ?? true;

    // Run calculation engine for grades and positions
    const calculated = this.calculationEngine.calculatePositions(
      schedule.results.map((r) => ({ id: r.id, studentId: r.studentId, rawMark: r.rawMark })),
      boundaries,
      positionEnabled,
    );

    // Apply calculations and update status to APPROVED in transaction
    await this.prisma.$transaction(async (tx) => {
      for (const calc of calculated) {
        await tx.resultEntry.update({
          where: { id: calc.resultId },
          data: {
            grade: calc.grade,
            gradePoints: calc.gradePoints,
            position: calc.position,
            status: ResultSubmissionStatus.APPROVED,
          },
        });
      }

      await tx.resultApproval.create({
        data: {
          examScheduleId,
          staffId: staff.id,
          decision: ApprovalDecision.APPROVED,
          comments: dto.comments,
        },
      });
    });

    return {
      decision: 'APPROVED',
      message: 'Results have been approved, graded, and ranked successfully',
      approvedCount: calculated.length,
    };
  }

  /**
   * Schedules results for automatic publication or publishes immediately.
   */
  async schedulePublication(
    institutionId: string,
    examScheduleId: string,
    dto: SchedulePublicationDto,
  ) {
    const schedule = await this.prisma.examSchedule.findFirst({
      where: { id: examScheduleId, examination: { institutionId } },
      include: { results: true },
    });

    if (!schedule) {
      throw new NotFoundException('Exam schedule not found');
    }

    // Must be approved first
    const hasUnapproved = schedule.results.some((r) => r.status !== ResultSubmissionStatus.APPROVED);
    if (hasUnapproved || schedule.results.length === 0) {
      throw new BadRequestException('Results cannot be published or scheduled before receiving official approval');
    }

    const scheduledDate = dto.scheduledAt ? new Date(dto.scheduledAt) : new Date();
    const isImmediate = scheduledDate <= new Date();

    if (isImmediate) {
      return this.publishResults(institutionId, examScheduleId);
    }

    const pubSchedule = await this.prisma.publicationSchedule.upsert({
      where: { examScheduleId },
      update: {
        scheduledAt: scheduledDate,
        status: PublicationScheduleStatus.SCHEDULED,
      },
      create: {
        examScheduleId,
        scheduledAt: scheduledDate,
        status: PublicationScheduleStatus.SCHEDULED,
      },
    });

    return {
      isImmediate: false,
      scheduledAt: pubSchedule.scheduledAt,
      message: `Publication scheduled for ${pubSchedule.scheduledAt.toISOString()}`,
    };
  }

  /**
   * Publishes results, transitioning visibility to students and parents.
   */
  async publishResults(institutionId: string, examScheduleId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.resultEntry.updateMany({
        where: { examScheduleId },
        data: {
          status: ResultSubmissionStatus.PUBLISHED,
          isPublished: true,
          publishedAt: new Date(),
        },
      });

      await tx.publicationSchedule.upsert({
        where: { examScheduleId },
        update: {
          status: PublicationScheduleStatus.PUBLISHED,
          publishedAt: new Date(),
        },
        create: {
          examScheduleId,
          scheduledAt: new Date(),
          status: PublicationScheduleStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Results are now officially published and visible to authorized students and parents',
      };
    });
  }

  /**
   * Background processor job: Scans and publishes scheduled results due now.
   */
  async processScheduledPublications() {
    const now = new Date();
    const pending = await this.prisma.publicationSchedule.findMany({
      where: {
        status: PublicationScheduleStatus.SCHEDULED,
        scheduledAt: { lte: now },
      },
      include: {
        examSchedule: {
          include: { examination: true },
        },
      },
    });

    const results = [];
    for (const item of pending) {
      try {
        await this.publishResults(item.examSchedule.examination.institutionId, item.examScheduleId);
        results.push({ scheduleId: item.examScheduleId, status: 'PUBLISHED' });
      } catch (err: any) {
        await this.prisma.publicationSchedule.update({
          where: { id: item.id },
          data: {
            status: PublicationScheduleStatus.FAILED,
            failureReason: err.message,
          },
        });
        results.push({ scheduleId: item.examScheduleId, status: 'FAILED', error: err.message });
      }
    }

    return results;
  }

  /**
   * Student portal view: Retrieves published results with financial clearance enforcement.
   */
  async getStudentResults(institutionId: string, studentUserId: string) {
    const student = await this.prisma.student.findFirst({
      where: { userId: studentUserId, institutionId },
    });

    if (!student) {
      throw new NotFoundException('Student record not found for current user');
    }

    // Check Financial Clearance Policy
    const settings = await this.prisma.institutionSetting.findUnique({
      where: { institutionId },
    });

    if (settings?.requireFinancialClearanceForResults) {
      const clearance = await this.prisma.financialClearance.findFirst({
        where: { studentId: student.id },
      });

      if (!clearance || clearance.status !== FinancialClearanceStatus.CLEARED) {
        // Find outstanding balance
        const invoices = await this.prisma.invoice.findMany({
          where: { studentId: student.id },
        });
        const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.balance, 0);

        return {
          isHeld: true,
          clearanceStatus: clearance?.status || 'HOLD',
          outstandingBalance: totalOutstanding,
          message:
            'Your examination results have been approved but are currently held pending financial clearance. Please contact the Bursar or settle your balance.',
          results: [],
        };
      }
    }

    // Retrieve published results only
    const results = await this.prisma.resultEntry.findMany({
      where: {
        studentId: student.id,
        isPublished: true,
      },
      include: {
        examSchedule: {
          include: {
            examination: true,
            subject: true,
            programClass: true,
          },
        },
      },
      orderBy: { examSchedule: { examDate: 'desc' } },
    });

    return {
      isHeld: false,
      student: {
        id: student.id,
        studentNumber: student.studentNumber,
        fullName: `${student.firstName} ${student.lastName}`,
      },
      results: results.map((r) => ({
        id: r.id,
        examName: r.examSchedule.examination.name,
        subjectName: r.examSchedule.subject.name,
        subjectCode: r.examSchedule.subject.code,
        className: r.examSchedule.programClass.name,
        rawMark: r.rawMark,
        maxMarks: r.examSchedule.maxMarks,
        grade: r.grade,
        gradePoints: r.gradePoints,
        position: settings?.positionEnabled ? r.position : undefined,
        comments: r.comments,
        publishedAt: r.publishedAt,
      })),
    };
  }

  /**
   * Parent portal view: Retrieves child's published results after verified relationship check.
   */
  async getParentChildResults(institutionId: string, parentUserId: string, studentId: string) {
    const parentGuardian = await this.prisma.parentGuardian.findFirst({
      where: { userId: parentUserId },
    });

    if (!parentGuardian) {
      throw new ForbiddenException('Parent profile not found');
    }

    // Verify parent-child relationship
    const relationship = await this.prisma.parentStudent.findFirst({
      where: {
        parentGuardianId: parentGuardian.id,
        studentId,
        isVerified: true,
      },
      include: { student: true },
    });

    if (!relationship) {
      throw new ForbiddenException('You do not have a verified guardian relationship with this student');
    }

    const student = relationship.student;
    if (student.institutionId !== institutionId) {
      throw new ForbiddenException('Student does not belong to this institution');
    }

    // Financial clearance check
    const settings = await this.prisma.institutionSetting.findUnique({
      where: { institutionId },
    });

    if (settings?.requireFinancialClearanceForResults) {
      const clearance = await this.prisma.financialClearance.findFirst({
        where: { studentId: student.id },
      });

      if (!clearance || clearance.status !== FinancialClearanceStatus.CLEARED) {
        return {
          isHeld: true,
          clearanceStatus: clearance?.status || 'HOLD',
          message: "Results for this student are currently held pending the institution's financial clearance.",
          results: [],
        };
      }
    }

    const results = await this.prisma.resultEntry.findMany({
      where: {
        studentId: student.id,
        isPublished: true,
      },
      include: {
        examSchedule: {
          include: {
            examination: true,
            subject: true,
            programClass: true,
          },
        },
      },
      orderBy: { examSchedule: { examDate: 'desc' } },
    });

    return {
      isHeld: false,
      student: {
        id: student.id,
        studentNumber: student.studentNumber,
        fullName: `${student.firstName} ${student.lastName}`,
      },
      results: results.map((r) => ({
        id: r.id,
        examName: r.examSchedule.examination.name,
        subjectName: r.examSchedule.subject.name,
        rawMark: r.rawMark,
        maxMarks: r.examSchedule.maxMarks,
        grade: r.grade,
        position: settings?.positionEnabled ? r.position : undefined,
      })),
    };
  }

  /**
   * Helper: validates teacher assignment before allowing mark updates.
   */
  private async verifyTeacherAuthorization(
    institutionId: string,
    schedule: any,
    userId: string,
    roles: RoleType[],
  ) {
    const isElevated = roles.some((r) =>
      [RoleType.SUPER_ADMIN, RoleType.INSTITUTION_ADMIN, RoleType.HEADMASTER_PRINCIPAL, RoleType.ACADEMIC_MASTER].includes(r),
    );

    if (isElevated) return;

    const staff = await this.prisma.staff.findFirst({
      where: { userId, institutionId },
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
      throw new ForbiddenException('You are not assigned to record marks for this subject and class');
    }
  }
}
