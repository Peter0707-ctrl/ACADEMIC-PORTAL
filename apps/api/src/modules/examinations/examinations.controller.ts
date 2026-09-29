import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExaminationsService } from './examinations.service';
import { ExcelExaminationService } from './services/excel-examination.service';
import { CreateExaminationDto, ScheduleExamDto } from './dto/examination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { TenantId } from '../../common/decorators/tenant-id.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions, ExamStatus, AuthenticatedUser } from '@academic/shared';
import { AuditableAction } from '../../common/interceptors/audit-log.interceptor';

@Controller('examinations')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class ExaminationsController {
  constructor(
    private examinationsService: ExaminationsService,
    private excelExaminationService: ExcelExaminationService,
  ) {}

  @Post()
  @RequirePermissions(Permissions.EXAMS_MANAGE)
  @AuditableAction('EXAM_CREATED', 'Examination')
  async createExam(@TenantId() tenantId: string, @Body() dto: CreateExaminationDto) {
    return this.examinationsService.createExamination(tenantId, dto);
  }

  @Get()
  @RequirePermissions(Permissions.EXAMS_VIEW)
  async getExams(@TenantId() tenantId: string) {
    return this.examinationsService.getExaminations(tenantId);
  }

  @Post(':id/schedule')
  @RequirePermissions(Permissions.EXAMS_MANAGE)
  @AuditableAction('EXAM_SCHEDULED', 'ExamSchedule')
  async scheduleExam(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body() dto: ScheduleExamDto,
  ) {
    return this.examinationsService.scheduleExam(tenantId, id, dto);
  }

  @Patch(':id/status')
  @RequirePermissions(Permissions.EXAMS_MANAGE)
  @AuditableAction('EXAM_STATUS_UPDATED', 'Examination')
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('id') id: string,
    @Body('status') status: ExamStatus,
  ) {
    return this.examinationsService.updateExamStatus(tenantId, id, status);
  }

  @Get('schedules/:scheduleId')
  @RequirePermissions(Permissions.EXAMS_VIEW)
  async getSchedule(@TenantId() tenantId: string, @Param('scheduleId') scheduleId: string) {
    return this.examinationsService.getScheduleById(tenantId, scheduleId);
  }

  @Get('schedules/:scheduleId/template')
  @RequirePermissions(Permissions.RESULTS_CREATE)
  async downloadTemplate(
    @TenantId() tenantId: string,
    @Param('scheduleId') scheduleId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ) {
    const buffer = await this.excelExaminationService.generateMarksTemplate(
      tenantId,
      scheduleId,
      user.id,
      user.roles,
    );

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="marks_template_${scheduleId}.xlsx"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }

  @Post('schedules/:scheduleId/upload-validate')
  @RequirePermissions(Permissions.RESULTS_CREATE)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndValidateMarks(
    @TenantId() tenantId: string,
    @Param('scheduleId') scheduleId: string,
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Excel file (.xlsx) is required');
    }

    return this.excelExaminationService.validateUploadedMarks(
      tenantId,
      scheduleId,
      file.buffer,
      user.id,
      user.roles,
    );
  }
}
