import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ResultsService } from './results.service';
import {
  RecordMarksDto,
  ApproveResultsDto,
  SchedulePublicationDto,
} from './dto/results.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions, AuthenticatedUser } from '@academic/shared';
import { AuditableAction } from '../../common/interceptors/audit-log.interceptor';

@Controller('results')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Post('schedules/:scheduleId/draft')
  @RequirePermissions(Permissions.RESULTS_CREATE)
  @AuditableAction('RESULT_DRAFT_RECORDED', 'ResultEntry')
  async recordDraft(
    @TenantId() tenantId: string,
    @Param('scheduleId') scheduleId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RecordMarksDto,
  ) {
    return this.resultsService.recordDraftMarks(
      tenantId,
      scheduleId,
      dto,
      user.id,
      user.roles,
    );
  }

  @Post('schedules/:scheduleId/submit')
  @RequirePermissions(Permissions.RESULTS_SUBMIT)
  @AuditableAction('RESULT_SUBMITTED', 'ExamSchedule')
  async submitResults(
    @TenantId() tenantId: string,
    @Param('scheduleId') scheduleId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.resultsService.submitResults(
      tenantId,
      scheduleId,
      user.id,
      user.roles,
    );
  }

  @Post('schedules/:scheduleId/approve')
  @RequirePermissions(Permissions.RESULTS_APPROVE)
  @AuditableAction('RESULT_APPROVED', 'ExamSchedule')
  async approveResults(
    @TenantId() tenantId: string,
    @Param('scheduleId') scheduleId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ApproveResultsDto,
  ) {
    return this.resultsService.approveResults(
      tenantId,
      scheduleId,
      dto,
      user.id,
    );
  }

  @Post('schedules/:scheduleId/schedule-publication')
  @RequirePermissions(Permissions.RESULTS_PUBLISH)
  @AuditableAction('RESULT_PUBLICATION_SCHEDULED', 'PublicationSchedule')
  async schedulePublication(
    @TenantId() tenantId: string,
    @Param('scheduleId') scheduleId: string,
    @Body() dto: SchedulePublicationDto,
  ) {
    return this.resultsService.schedulePublication(tenantId, scheduleId, dto);
  }

  @Post('process-scheduled')
  @RequirePermissions(Permissions.RESULTS_PUBLISH)
  async processScheduledPublications() {
    return this.resultsService.processScheduledPublications();
  }

  @Get('my-results')
  @RequirePermissions(Permissions.RESULTS_VIEW)
  async getMyResults(
    @TenantId() tenantId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.resultsService.getStudentResults(tenantId, user.id);
  }

  @Get('children/:studentId')
  @RequirePermissions(Permissions.RESULTS_VIEW)
  async getChildResults(
    @TenantId() tenantId: string,
    @Param('studentId') studentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.resultsService.getParentChildResults(tenantId, user.id, studentId);
  }
}
