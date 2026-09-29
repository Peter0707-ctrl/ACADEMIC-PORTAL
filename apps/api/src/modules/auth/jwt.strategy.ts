import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser, UserJwtPayload } from '@academic/shared';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'dev-secret-key-change-in-production',
    });
  }

  async validate(payload: UserJwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        staffProfile: true,
        studentProfile: true,
        parentProfile: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account is inactive or does not exist');
    }

    // Reconstruct composable roles and aggregated permissions from DB
    const roles = user.userRoles.map((ur) => ur.role.code as any);
    const permissionSet = new Set<string>();

    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        permissionSet.add(rp.permission.code);
      }
    }

    return {
      id: user.id,
      email: user.email,
      tenantId: user.institutionId,
      roles,
      permissions: Array.from(permissionSet) as any,
      firstName: user.firstName,
      lastName: user.lastName,
      teacherId: user.staffProfile?.id,
      studentId: user.studentProfile?.id,
      parentId: user.parentProfile?.id,
    };
  }
}
