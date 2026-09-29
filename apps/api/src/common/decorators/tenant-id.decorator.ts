import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser } from '@academic/shared';

export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user || !user.tenantId) {
      throw new ForbiddenException('Tenant identification context is missing or access is unauthorized');
    }

    return user.tenantId;
  },
);
