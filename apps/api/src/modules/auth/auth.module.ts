import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        const secret = configService.get<string>('JWT_SECRET');

        if (isProduction && (!secret || secret === 'dev-secret-key-change-in-production')) {
          throw new Error(
            'FATAL SECURITY EXCEPTION: JWT_SECRET must be configured with a cryptographically secure random string in production!',
          );
        }

        return {
          secret: secret || 'dev-secret-key-change-in-production',
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
