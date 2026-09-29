import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { CalculationEngineService } from './services/calculation-engine.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [ResultsController],
  providers: [ResultsService, CalculationEngineService, PrismaService],
  exports: [ResultsService, CalculationEngineService],
})
export class ResultsModule {}
