import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../database/prisma.service';

export function resolveJwtSecret(configService: ConfigService): string {
  const configured = configService.get<string>('JWT_SECRET')?.trim();
  if (configured && configured.length >= 16) {
    return configured;
  }
  const dbUrl = configService.get<string>('DATABASE_URL') || 'academic-portal-zk-jwt-kdf-v2';
  return createHmac('sha256', 'academic-portal-jwt-salt-2026').update(dbUrl).digest('hex');
}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: resolveJwtSecret(configService),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRATION') || '24h',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
