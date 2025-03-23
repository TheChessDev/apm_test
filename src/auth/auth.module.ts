import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { GitHubStrategy } from './github.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

export const AccessJwtProvider = {
  provide: 'ACCESS_JWT',
  useFactory: (config: ConfigService) =>
    new JwtService({
      secret: config.get('JWT_SECRET'),
      signOptions: { expiresIn: config.get('JWT_EXPIRATION_MS') },
    }),
  inject: [ConfigService],
};

export const RefreshJwtProvider = {
  provide: 'REFRESH_JWT',
  useFactory: (config: ConfigService) =>
    new JwtService({
      secret: config.get('JWT_REFRESH_SECRET'),
      signOptions: { expiresIn: config.get('JWT_REFRESH_EXPIRATION_MS') },
    }),
  inject: [ConfigService],
};

@Module({
  imports: [AppConfigModule, HttpModule, PrismaModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AccessJwtProvider,
    GitHubStrategy,
    JwtStrategy,
    RefreshJwtProvider,
  ],
})
export class AuthModule {}
