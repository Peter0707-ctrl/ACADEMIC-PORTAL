import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AcademicsService } from './academics.service';
import {
  CreateAcademicYearDto,
  CreateAcademicTermDto,
  CreateClassDto,
  CreateSubjectDto,
  AssignTeacherDto,
  EnrollStudentDto,
} from './dto/academics.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { Permissions } from '@academic/shared';
import { AuditableAction } from '../../common/interceptors/audit-log.interceptor';

@Controller('academics')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class AcademicsController {
  constructor(private academicsService: AcademicsService) {}

  @Post('academic-years')
  @RequirePermissions(Permissions.ACADEMIC_MANAGE)
  @AuditableAction('ACADEMIC_YEAR_CREATED', 'AcademicYear')
  async createYear(@TenantId() tenantId: string, @Body() dto: CreateAcademicYearDto) {
    return this.academicsService.createAcademicYear(tenantId, dto);
  }

  @Get('academic-years')
  @RequirePermissions(Permissions.ACADEMIC_VIEW)
  async getYears(@TenantId() tenantId: string) {
    return this.academicsService.getAcademicYears(tenantId);
  }

  @Post('academic-years/:yearId/terms')
  @RequirePermissions(Permissions.ACADEMIC_MANAGE)
  @AuditableAction('ACADEMIC_TERM_CREATED', 'AcademicTerm')
  async createTerm(@Param('yearId') yearId: string, @Body() dto: CreateAcademicTermDto) {
    return this.academicsService.createTerm(yearId, dto);
  }

  @Post('classes')
  @RequirePermissions(Permissions.CLASSES_MANAGE)
  @AuditableAction('CLASS_CREATED', 'ProgramClass')
  async createClass(@TenantId() tenantId: string, @Body() dto: CreateClassDto) {
    return this.academicsService.createClass(tenantId, dto);
  }

  @Get('classes')
  @RequirePermissions(Permissions.CLASSES_VIEW)
  async getClasses(@TenantId() tenantId: string) {
    return this.academicsService.getClasses(tenantId);
  }

  @Post('subjects')
  @RequirePermissions(Permissions.SUBJECTS_MANAGE)
  @AuditableAction('SUBJECT_CREATED', 'SubjectCourse')
  async createSubject(@TenantId() tenantId: string, @Body() dto: CreateSubjectDto) {
    return this.academicsService.createSubject(tenantId, dto);
  }

  @Get('subjects')
  @RequirePermissions(Permissions.SUBJECTS_VIEW)
  async getSubjects(@TenantId() tenantId: string) {
    return this.academicsService.getSubjects(tenantId);
  }

  @Post('assignments')
  @RequirePermissions(Permissions.ACADEMIC_MANAGE)
  @AuditableAction('TEACHER_ASSIGNED', 'TeacherAssignment')
  async assignTeacher(@TenantId() tenantId: string, @Body() dto: AssignTeacherDto) {
    return this.academicsService.assignTeacher(tenantId, dto);
  }

  @Post('enrollments')
  @RequirePermissions(Permissions.STUDENTS_UPDATE)
  @AuditableAction('STUDENT_ENROLLED', 'StudentEnrollment')
  async enrollStudent(@TenantId() tenantId: string, @Body() dto: EnrollStudentDto) {
    return this.academicsService.enrollStudent(tenantId, dto);
  }
}
