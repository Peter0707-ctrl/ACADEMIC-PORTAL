import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './common/guards/jwt-auth.guard';
import { PrismaService } from './database/prisma.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Liveness and Readiness probe for Railway and container orchestration' })
  async checkHealth() {
    let dbStatus = 'healthy';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'disconnected_or_provisioning';
    }

    return {
      status: 'ok',
      service: 'academic-portal-api',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbStatus,
    };
  }
}
