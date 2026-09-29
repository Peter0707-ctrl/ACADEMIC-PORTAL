import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreateStudentDto, CreateStaffDto, LinkParentChildDto } from './dto/people.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { Permissions } from '@academic/shared';
import { AuditableAction } from '../../common/interceptors/audit-log.interceptor';

@Controller('people')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class PeopleController {
  constructor(private peopleService: PeopleService) {}

  @Post('students')
  @RequirePermissions(Permissions.STUDENTS_CREATE)
  @AuditableAction('STUDENT_CREATED', 'Student')
  async createStudent(@TenantId() tenantId: string, @Body() dto: CreateStudentDto) {
    return this.peopleService.createStudent(tenantId, dto);
  }

  @Get('students')
  @RequirePermissions(Permissions.STUDENTS_VIEW)
  async getStudents(@TenantId() tenantId: string, @Query('classId') classId?: string) {
    return this.peopleService.getStudents(tenantId, classId);
  }

  @Get('students/:id/360')
  @RequirePermissions(Permissions.STUDENTS_VIEW)
  async getStudent360(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.peopleService.getStudent360(tenantId, id);
  }

  @Post('staff')
  @RequirePermissions(Permissions.USERS_CREATE)
  @AuditableAction('STAFF_CREATED', 'Staff')
  async createStaff(@TenantId() tenantId: string, @Body() dto: CreateStaffDto) {
    return this.peopleService.createStaff(tenantId, dto);
  }

  @Get('staff')
  @RequirePermissions(Permissions.USERS_VIEW)
  async getStaff(@TenantId() tenantId: string) {
    return this.peopleService.getStaff(tenantId);
  }

  @Post('parents/link-child')
  @RequirePermissions(Permissions.PARENTS_MANAGE)
  @AuditableAction('PARENT_CHILD_LINKED', 'ParentStudent')
  async linkChild(@TenantId() tenantId: string, @Body() dto: LinkParentChildDto) {
    return this.peopleService.linkParentChild(tenantId, dto);
  }
}
