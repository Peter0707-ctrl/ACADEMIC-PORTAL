import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TenantGuard } from '../src/common/guards/tenant.guard';
import { RoleType } from '@academic/shared';

describe('TenantGuard (Strict Multi-Tenant Isolation)', () => {
  let guard: TenantGuard;

  beforeEach(() => {
    guard = new TenantGuard();
  });

  const createMockContext = (user: any, params: any = {}, headers: any = {}): ExecutionContext => {
    const request = { user, params, headers };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  it('should allow access when user belongs to the requested institution', () => {
    const context = createMockContext(
      { id: 'u1', tenantId: 'tenant-school-a', roles: [RoleType.TEACHER] },
      { institutionId: 'tenant-school-a' },
    );

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should strictly throw ForbiddenException when user from Tenant A tries to access Tenant B data', () => {
    const context = createMockContext(
      { id: 'u1', tenantId: 'tenant-school-a', roles: [RoleType.TEACHER] },
      { institutionId: 'tenant-school-b' },
    );

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('Cross-tenant data access is strictly forbidden'),
    );
  });

  it('should block cross-tenant attempt passed via x-tenant-id header', () => {
    const context = createMockContext(
      { id: 'u1', tenantId: 'tenant-school-a', roles: [RoleType.TEACHER] },
      {},
      { 'x-tenant-id': 'tenant-school-c' },
    );

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('Cross-tenant data access is strictly forbidden'),
    );
  });

  it('should throw ForbiddenException if user has no tenant association', () => {
    const context = createMockContext({ id: 'u1', tenantId: null, roles: [RoleType.TEACHER] });

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('User is not associated with any educational institution'),
    );
  });

  it('should permit platform Super Admin across tenants', () => {
    const context = createMockContext(
      { id: 'admin1', tenantId: null, roles: [RoleType.SUPER_ADMIN] },
      { institutionId: 'any-institution-id' },
    );

    expect(guard.canActivate(context)).toBe(true);
  });
});
