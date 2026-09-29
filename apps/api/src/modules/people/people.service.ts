import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateStudentDto, CreateStaffDto, LinkParentChildDto } from './dto/people.dto';

@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) {}

  // ==================== Students ====================
  async createStudent(institutionId: string, dto: CreateStudentDto) {
    const existing = await this.prisma.student.findFirst({
      where: {
        institutionId,
        OR: [
          { studentNumber: dto.studentNumber },
          { admissionNumber: dto.admissionNumber },
        ],
      },
    });

    if (existing) {
      throw new BadRequestException('A student with this Student ID or Admission Number already exists in this institution');
    }

    let userId: string | undefined = undefined;

    if (dto.email && dto.password) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          institutionId,
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      // Assign STUDENT role
      const studentRole = await this.prisma.role.findFirst({
        where: { institutionId, code: 'STUDENT' },
      });

      if (studentRole) {
        await this.prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: studentRole.id,
          },
        });
      }

      userId = user.id;
    }

    return this.prisma.student.create({
      data: {
        institutionId,
        userId,
        studentNumber: dto.studentNumber,
        admissionNumber: dto.admissionNumber,
        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName: dto.lastName,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        gender: dto.gender,
        status: dto.status,
      },
    });
  }

  async getStudents(institutionId: string, classId?: string) {
    return this.prisma.student.findMany({
      where: {
        institutionId,
        ...(classId
          ? {
              enrollments: {
                some: { programClassId: classId, isActive: true },
              },
            }
          : {}),
      },
      include: {
        enrollments: {
          where: { isActive: true },
          include: { programClass: true, stream: true },
        },
      },
      orderBy: { lastName: 'asc' },
    });
  }

  async getStudent360(institutionId: string, studentId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, institutionId },
      include: {
        enrollments: {
          include: {
            academicYear: true,
            programClass: true,
            stream: true,
          },
        },
        parents: {
          include: {
            parent: {
              include: { user: true },
            },
          },
        },
        results: {
          include: {
            examSchedule: {
              include: {
                examination: true,
                subject: true,
                programClass: true,
              },
            },
          },
        },
        clearances: true,
        invoices: {
          include: { payments: true },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student record not found in this institution');
    }

    return student;
  }

  // ==================== Staff / Teachers ====================
  async createStaff(institutionId: string, dto: CreateStaffDto) {
    const existing = await this.prisma.staff.findFirst({
      where: { institutionId, staffNumber: dto.staffNumber },
    });

    if (existing) {
      throw new BadRequestException('A staff member with this Staff Number already exists');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          institutionId,
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
        },
      });

      // Find TEACHER role
      const teacherRole = await tx.role.findFirst({
        where: { institutionId, code: 'TEACHER' },
      });

      if (teacherRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: teacherRole.id,
          },
        });
      }

      return tx.staff.create({
        data: {
          institutionId,
          userId: user.id,
          staffNumber: dto.staffNumber,
          designation: dto.designation,
          department: dto.department,
        },
        include: {
          user: true,
        },
      });
    });
  }

  async getStaff(institutionId: string) {
    return this.prisma.staff.findMany({
      where: { institutionId },
      include: {
        user: true,
        assignments: {
          include: {
            programClass: true,
            subject: true,
          },
        },
      },
      orderBy: { staffNumber: 'asc' },
    });
  }

  // ==================== Parent - Child Linkage ====================
  async linkParentChild(institutionId: string, dto: LinkParentChildDto) {
    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, institutionId },
    });

    if (!student) {
      throw new NotFoundException('Student does not belong to this institution');
    }

    return this.prisma.parentStudent.upsert({
      where: {
        parentGuardianId_studentId: {
          parentGuardianId: dto.parentGuardianId,
          studentId: dto.studentId,
        },
      },
      update: {
        isVerified: true,
        verifiedAt: new Date(),
      },
      create: {
        parentGuardianId: dto.parentGuardianId,
        studentId: dto.studentId,
        isVerified: true,
        verifiedAt: new Date(),
      },
    });
  }
}
