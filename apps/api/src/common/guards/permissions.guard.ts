import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { AuthenticatedUser, PermissionKey, RoleType } from '@academic/shared';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionKey[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) {
      throw new ForbiddenException('User authentication context is required');
    }

    // Platform Super Admin bypasses individual permission restrictions
    if (user.roles?.includes(RoleType.SUPER_ADMIN)) {
      return true;
    }

    const userPermissions = new Set(user.permissions || []);
    const hasAllRequired = requiredPermissions.every((perm) => userPermissions.has(perm));

    if (!hasAllRequired) {
      const missing = requiredPermissions.filter((perm) => !userPermissions.has(perm));
      throw new ForbiddenException(`Missing required permissions: ${missing.join(', ')}`);
    }

    return true;
  }
}
