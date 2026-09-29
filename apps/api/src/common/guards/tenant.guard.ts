import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser, RoleType } from '@academic/shared';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) {
      throw new ForbiddenException('Authentication context required for tenant isolation');
    }

    // Platform Super Admin is allowed across institutions if explicitly permitted
    if (user.roles?.includes(RoleType.SUPER_ADMIN)) {
      return true;
    }

    if (!user.tenantId) {
      throw new ForbiddenException('User is not associated with any educational institution');
    }

    // Check path params or headers for explicit institution targeting
    const targetInstitutionId =
      request.params?.institutionId ||
      request.params?.tenantId ||
      request.headers['x-tenant-id'];

    if (targetInstitutionId && targetInstitutionId !== user.tenantId) {
      throw new ForbiddenException('Cross-tenant data access is strictly forbidden');
    }

    return true;
  }
}
