import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto, UpdateInstitutionSettingsDto } from './dto/institution.dto';
import { JwtAuthGuard, Public } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permissions } from '@academic/shared';
import { AuditableAction } from '../../common/interceptors/audit-log.interceptor';

@Controller('institutions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InstitutionsController {
  constructor(private institutionsService: InstitutionsService) {}

  @Public()
  @Post()
  @AuditableAction('INSTITUTION_CREATED', 'Institution')
  async create(@Body() dto: CreateInstitutionDto) {
    return this.institutionsService.create(dto);
  }

  @Public()
  @Get()
  async list() {
    return this.institutionsService.listAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.institutionsService.findById(id);
  }

  @Put(':institutionId/settings')
  @UseGuards(TenantGuard)
  @RequirePermissions(Permissions.SETTINGS_UPDATE)
  @AuditableAction('INSTITUTION_SETTINGS_UPDATED', 'InstitutionSetting')
  async updateSettings(
    @Param('institutionId') institutionId: string,
    @Body() dto: UpdateInstitutionSettingsDto,
  ) {
    return this.institutionsService.updateSettings(institutionId, dto);
  }
}
