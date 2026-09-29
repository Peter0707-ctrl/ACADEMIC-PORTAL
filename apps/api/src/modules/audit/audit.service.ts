import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface AuditLogDto {
  institutionId?: string | null;
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async log(data: AuditLogDto): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          institutionId: data.institutionId ?? null,
          userId: data.userId ?? null,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          details: data.details,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });

      this.logger.log(
        `[AUDIT] Action: ${data.action} | Resource: ${data.resource} (${data.resourceId || 'N/A'}) | Tenant: ${
          data.institutionId || 'SYSTEM'
        } | User: ${data.userId || 'SYSTEM'}`,
      );
    } catch (err: any) {
      // Do not allow audit logging failure to crash primary transaction, but log securely
      this.logger.error(`Failed to persist audit log: ${err.message}`, err.stack);
    }
  }

  async getTenantLogs(institutionId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: { institutionId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where: { institutionId } }),
    ]);

    return { logs, total, page, limit };
  }
}
