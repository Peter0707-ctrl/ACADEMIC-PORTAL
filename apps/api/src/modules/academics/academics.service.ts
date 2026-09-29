import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateAcademicYearDto,
  CreateAcademicTermDto,
  CreateClassDto,
  CreateSubjectDto,
  AssignTeacherDto,
  EnrollStudentDto,
} from './dto/academics.dto';

@Injectable()
export class AcademicsService {
  constructor(private prisma: PrismaService) {}

  // ==================== Academic Years ====================
  async createAcademicYear(institutionId: string, dto: CreateAcademicYearDto) {
    const existing = await this.prisma.academicYear.findFirst({
      where: { institutionId, name: dto.name },
    });

    if (existing) {
      throw new BadRequestException(`Academic year '${dto.name}' already exists in this institution`);
    }

    if (dto.isCurrent) {
      // Clear previous current flags
      await this.prisma.academicYear.updateMany({
        where: { institutionId },
        data: { isCurrent: false },
      });
    }

    return this.prisma.academicYear.create({
      data: {
        institutionId,
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isCurrent: dto.isCurrent ?? false,
      },
    });
  }

  async getAcademicYears(institutionId: string) {
    return this.prisma.academicYear.findMany({
      where: { institutionId },
      include: { terms: true },
      orderBy: { startDate: 'desc' },
    });
  }

  // ==================== Terms ====================
  async createTerm(academicYearId: string, dto: CreateAcademicTermDto) {
    const year = await this.prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!year) {
      throw new NotFoundException('Academic year not found');
    }

    return this.prisma.academicTerm.create({
      data: {
        academicYearId,
        name: dto.name,
        termNumber: dto.termNumber,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        isCurrent: dto.isCurrent ?? false,
      },
    });
  }

  // ==================== Program Classes ====================
  async createClass(institutionId: string, dto: CreateClassDto) {
    const existing = await this.prisma.programClass.findFirst({
      where: { institutionId, code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(`Class code '${dto.code}' already exists in this institution`);
    }

    return this.prisma.programClass.create({
      data: {
        institutionId,
        code: dto.code,
        name: dto.name,
        levelNumber: dto.levelNumber,
        capacity: dto.capacity,
      },
    });
  }

  async getClasses(institutionId: string) {
    return this.prisma.programClass.findMany({
      where: { institutionId },
      include: { streams: true },
      orderBy: { levelNumber: 'asc' },
    });
  }

  // ==================== Subjects ====================
  async createSubject(institutionId: string, dto: CreateSubjectDto) {
    const existing = await this.prisma.subjectCourse.findFirst({
      where: { institutionId, code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(`Subject code '${dto.code}' already exists in this institution`);
    }

    return this.prisma.subjectCourse.create({
      data: {
        institutionId,
        code: dto.code,
        name: dto.name,
        isCore: dto.isCore ?? true,
        credits: dto.credits,
        passMark: dto.passMark ?? 40.0,
      },
    });
  }

  async getSubjects(institutionId: string) {
    return this.prisma.subjectCourse.findMany({
      where: { institutionId },
      orderBy: { name: 'asc' },
    });
  }

  // ==================== Teacher Assignment ====================
  async assignTeacher(institutionId: string, dto: AssignTeacherDto) {
    // Validate staff, class, subject belong to this tenant
    const [staff, programClass, subject] = await Promise.all([
      this.prisma.staff.findFirst({ where: { id: dto.staffId, institutionId } }),
      this.prisma.programClass.findFirst({ where: { id: dto.programClassId, institutionId } }),
      this.prisma.subjectCourse.findFirst({ where: { id: dto.subjectId, institutionId } }),
    ]);

    if (!staff) throw new NotFoundException('Staff member not found in this institution');
    if (!programClass) throw new NotFoundException('Class not found in this institution');
    if (!subject) throw new NotFoundException('Subject not found in this institution');

    const existing = await this.prisma.teacherAssignment.findFirst({
      where: {
        staffId: dto.staffId,
        programClassId: dto.programClassId,
        streamId: dto.streamId || null,
        subjectId: dto.subjectId,
        academicYearId: dto.academicYearId,
      },
    });

    if (existing) {
      throw new BadRequestException('This teacher assignment already exists');
    }

    return this.prisma.teacherAssignment.create({
      data: {
        staffId: dto.staffId,
        programClassId: dto.programClassId,
        streamId: dto.streamId || null,
        subjectId: dto.subjectId,
        academicYearId: dto.academicYearId,
      },
      include: {
        staff: { include: { user: true } },
        programClass: true,
        subject: true,
      },
    });
  }

  // ==================== Student Enrollment ====================
  async enrollStudent(institutionId: string, dto: EnrollStudentDto) {
    const [student, programClass] = await Promise.all([
      this.prisma.student.findFirst({ where: { id: dto.studentId, institutionId } }),
      this.prisma.programClass.findFirst({ where: { id: dto.programClassId, institutionId } }),
    ]);

    if (!student) throw new NotFoundException('Student not found in this institution');
    if (!programClass) throw new NotFoundException('Class not found in this institution');

    return this.prisma.studentEnrollment.upsert({
      where: {
        studentId_academicYearId: {
          studentId: dto.studentId,
          academicYearId: dto.academicYearId,
        },
      },
      update: {
        programClassId: dto.programClassId,
        streamId: dto.streamId || null,
        isActive: true,
      },
      create: {
        studentId: dto.studentId,
        academicYearId: dto.academicYearId,
        programClassId: dto.programClassId,
        streamId: dto.streamId || null,
        isActive: true,
      },
      include: {
        student: true,
        programClass: true,
      },
    });
  }
}
