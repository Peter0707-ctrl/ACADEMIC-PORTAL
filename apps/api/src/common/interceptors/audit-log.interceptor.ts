import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../modules/audit/audit.service';
import { AuthenticatedUser } from '@academic/shared';

export const AUDIT_METADATA_KEY = 'audit_metadata';

export interface AuditActionConfig {
  action: string;
  resource: string;
}

export const AuditableAction = (action: string, resource: string) =>
  SetMetadata(AUDIT_METADATA_KEY, { action, resource });

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const config = this.reflector.get<AuditActionConfig | undefined>(
      AUDIT_METADATA_KEY,
      context.getHandler(),
    );

    if (!config) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.auditService.log({
            institutionId: user?.tenantId,
            userId: user?.id,
            action: config.action,
            resource: config.resource,
            resourceId: request.params?.id || data?.id || undefined,
            details: {
              body: this.sanitizePayload(request.body),
              params: request.params,
              query: request.query,
            },
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        },
      }),
    );
  }

  private sanitizePayload(body: any): any {
    if (!body || typeof body !== 'object') return body;
    const sanitized = { ...body };
    const sensitiveKeys = ['password', 'passwordHash', 'token', 'secret', 'creditCard'];
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    return sanitized;
  }
}
