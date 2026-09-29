import { Module } from '@nestjs/common';
import { ExaminationsService } from './examinations.service';
import { ExcelExaminationService } from './services/excel-examination.service';
import { ExaminationsController } from './examinations.controller';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ExaminationsController],
  providers: [ExaminationsService, ExcelExaminationService, PrismaService],
  exports: [ExaminationsService, ExcelExaminationService],
})
export class ExaminationsModule {}
