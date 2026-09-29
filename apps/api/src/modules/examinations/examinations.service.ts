import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateExaminationDto, ScheduleExamDto } from './dto/examination.dto';
import { ExamStatus } from '@academic/shared';

@Injectable()
export class ExaminationsService {
  constructor(private prisma: PrismaService) {}

  async createExamination(institutionId: string, dto: CreateExaminationDto) {
    const existing = await this.prisma.examination.findFirst({
      where: { institutionId, code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(`Examination code '${dto.code}' already exists`);
    }

    return this.prisma.examination.create({
      data: {
        institutionId,
        academicYearId: dto.academicYearId,
        termId: dto.termId || null,
        name: dto.name,
        code: dto.code,
        status: dto.status || ExamStatus.DRAFT,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async scheduleExam(institutionId: string, examinationId: string, dto: ScheduleExamDto) {
    const exam = await this.prisma.examination.findFirst({
      where: { id: examinationId, institutionId },
    });

    if (!exam) {
      throw new NotFoundException('Examination not found in this institution');
    }

    const [programClass, subject] = await Promise.all([
      this.prisma.programClass.findFirst({ where: { id: dto.programClassId, institutionId } }),
      this.prisma.subjectCourse.findFirst({ where: { id: dto.subjectId, institutionId } }),
    ]);

    if (!programClass) throw new NotFoundException('Class not found in this institution');
    if (!subject) throw new NotFoundException('Subject not found in this institution');

    return this.prisma.examSchedule.upsert({
      where: {
        examinationId_programClassId_subjectId: {
          examinationId,
          programClassId: dto.programClassId,
          subjectId: dto.subjectId,
        },
      },
      update: {
        maxMarks: dto.maxMarks,
        examDate: dto.examDate ? new Date(dto.examDate) : null,
        submissionDeadline: dto.submissionDeadline ? new Date(dto.submissionDeadline) : null,
      },
      create: {
        examinationId,
        programClassId: dto.programClassId,
        subjectId: dto.subjectId,
        maxMarks: dto.maxMarks,
        examDate: dto.examDate ? new Date(dto.examDate) : null,
        submissionDeadline: dto.submissionDeadline ? new Date(dto.submissionDeadline) : null,
      },
      include: {
        programClass: true,
        subject: true,
      },
    });
  }

  async updateExamStatus(institutionId: string, examinationId: string, status: ExamStatus) {
    const exam = await this.prisma.examination.findFirst({
      where: { id: examinationId, institutionId },
    });

    if (!exam) {
      throw new NotFoundException('Examination not found');
    }

    return this.prisma.examination.update({
      where: { id: examinationId },
      data: { status },
    });
  }

  async getExaminations(institutionId: string) {
    return this.prisma.examination.findMany({
      where: { institutionId },
      include: {
        academicYear: true,
        term: true,
        schedules: {
          include: {
            programClass: true,
            subject: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getScheduleById(institutionId: string, scheduleId: string) {
    const schedule = await this.prisma.examSchedule.findFirst({
      where: {
        id: scheduleId,
        examination: { institutionId },
      },
      include: {
        examination: true,
        programClass: true,
        subject: true,
        results: {
          include: {
            student: true,
          },
        },
        publication: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Exam schedule not found');
    }

    return schedule;
  }
}
