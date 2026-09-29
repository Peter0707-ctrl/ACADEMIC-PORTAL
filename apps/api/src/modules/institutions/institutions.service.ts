import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInstitutionDto, UpdateInstitutionSettingsDto } from './dto/institution.dto';
import { InstitutionType, AcademicCycleType, ResultApprovalMode, DefaultRolePermissions, RoleType } from '@academic/shared';

@Injectable()
export class InstitutionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInstitutionDto) {
    const existing = await this.prisma.institution.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException(`Institution with code '${dto.code}' already exists`);
    }

    const isHigherEd =
      dto.type === InstitutionType.UNIVERSITY ||
      dto.type === InstitutionType.COLLEGE ||
      dto.type === InstitutionType.VOCATIONAL_COLLEGE;

    return this.prisma.$transaction(async (tx) => {
      const institution = await tx.institution.create({
        data: {
          code: dto.code,
          name: dto.name,
          type: dto.type,
          country: dto.country || 'TZ',
          registrationNo: dto.registrationNo,
          address: dto.address,
          region: dto.region,
          district: dto.district,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
        },
      });

      // Initialize default configurable settings
      await tx.institutionSetting.create({
        data: {
          institutionId: institution.id,
          cycleType: isHigherEd ? AcademicCycleType.SEMESTERS : AcademicCycleType.TERMS,
          cyclesPerYear: 2,
          hasStreams: !isHigherEd,
          hasFaculties: isHigherEd,
          hasCredits: isHigherEd,
          positionEnabled: !isHigherEd,
          resultApprovalMode: ResultApprovalMode.OR,
          requireFinancialClearanceForResults: isHigherEd,
          attendanceThresholdPercent: 75.0,
        },
      });

      // Seed default composable roles and their permissions for this tenant
      for (const [roleCode, permissions] of Object.entries(DefaultRolePermissions)) {
        const role = await tx.role.create({
          data: {
            institutionId: institution.id,
            code: roleCode,
            name: roleCode.replace(/_/g, ' '),
            isSystemRole: true,
          },
        });

        for (const permCode of permissions) {
          // Upsert permission record
          const perm = await tx.permission.upsert({
            where: { code: permCode },
            update: {},
            create: {
              code: permCode,
              module: permCode.split('.')[0],
              description: `Permission for ${permCode}`,
            },
          });

          await tx.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId: perm.id,
            },
          });
        }
      }

      // Seed default Grade Scale (e.g. A to F)
      const gradeScale = await tx.gradeScale.create({
        data: {
          institutionId: institution.id,
          name: isHigherEd ? 'University Standard GPA Scale' : 'Secondary School Grade Scale (A-F)',
        },
      });

      if (isHigherEd) {
        await tx.gradeBoundary.createMany({
          data: [
            { gradeScaleId: gradeScale.id, grade: 'A', minMark: 70, maxMark: 100, gradePoints: 5.0, remarks: 'Excellent' },
            { gradeScaleId: gradeScale.id, grade: 'B+', minMark: 60, maxMark: 69.99, gradePoints: 4.0, remarks: 'Very Good' },
            { gradeScaleId: gradeScale.id, grade: 'B', minMark: 50, maxMark: 59.99, gradePoints: 3.0, remarks: 'Good' },
            { gradeScaleId: gradeScale.id, grade: 'C', minMark: 40, maxMark: 49.99, gradePoints: 2.0, remarks: 'Pass' },
            { gradeScaleId: gradeScale.id, grade: 'D', minMark: 35, maxMark: 39.99, gradePoints: 1.0, remarks: 'Marginal Fail' },
            { gradeScaleId: gradeScale.id, grade: 'E', minMark: 0, maxMark: 34.99, gradePoints: 0.0, remarks: 'Absolute Fail' },
          ],
        });
      } else {
        await tx.gradeBoundary.createMany({
          data: [
            { gradeScaleId: gradeScale.id, grade: 'A', minMark: 75, maxMark: 100, gradePoints: 5.0, remarks: 'Distinction' },
            { gradeScaleId: gradeScale.id, grade: 'B', minMark: 65, maxMark: 74.99, gradePoints: 4.0, remarks: 'Merit' },
            { gradeScaleId: gradeScale.id, grade: 'C', minMark: 45, maxMark: 64.99, gradePoints: 3.0, remarks: 'Credit' },
            { gradeScaleId: gradeScale.id, grade: 'D', minMark: 30, maxMark: 44.99, gradePoints: 2.0, remarks: 'Pass' },
            { gradeScaleId: gradeScale.id, grade: 'F', minMark: 0, maxMark: 29.99, gradePoints: 1.0, remarks: 'Fail' },
          ],
        });
      }

      return institution;
    });
  }

  async findById(id: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        settings: true,
        gradeScales: {
          include: {
            boundaries: true,
          },
        },
      },
    });

    if (!institution) {
      throw new NotFoundException(`Institution with id '${id}' not found`);
    }

    return institution;
  }

  async updateSettings(institutionId: string, dto: UpdateInstitutionSettingsDto) {
    const settings = await this.prisma.institutionSetting.findUnique({
      where: { institutionId },
    });

    if (!settings) {
      throw new NotFoundException('Institution settings not found');
    }

    return this.prisma.institutionSetting.update({
      where: { institutionId },
      data: dto,
    });
  }

  async listAll() {
    return this.prisma.institution.findMany({
      include: {
        settings: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
