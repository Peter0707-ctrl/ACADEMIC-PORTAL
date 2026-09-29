import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from '../src/common/guards/permissions.guard';
import { Permissions, RoleType } from '@academic/shared';

describe('PermissionsGuard (Granular & Composable Authorization)', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);
  });

  const createMockContext = (user: any): ExecutionContext => {
    const request = { user };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;
  };

  it('should allow access when endpoint requires no specific permissions', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = createMockContext({ id: 'u1', permissions: [] });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when user holds the required permissions', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Permissions.RESULTS_APPROVE, Permissions.RESULTS_PUBLISH]);

    const context = createMockContext({
      id: 'u1',
      roles: [RoleType.ACADEMIC_MASTER],
      permissions: [Permissions.RESULTS_APPROVE, Permissions.RESULTS_PUBLISH, Permissions.RESULTS_VIEW],
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should reject with ForbiddenException when user is missing required permissions', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Permissions.RESULTS_APPROVE]);

    const context = createMockContext({
      id: 'u1',
      roles: [RoleType.TEACHER],
      permissions: [Permissions.RESULTS_VIEW, Permissions.RESULTS_CREATE],
    });

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException(`Missing required permissions: ${Permissions.RESULTS_APPROVE}`),
    );
  });

  it('should permit SUPER_ADMIN unconditionally', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Permissions.SETTINGS_UPDATE, Permissions.FINANCE_CLEARANCE]);

    const context = createMockContext({
      id: 'super-admin-id',
      roles: [RoleType.SUPER_ADMIN],
      permissions: [],
    });

    expect(guard.canActivate(context)).toBe(true);
  });
});
