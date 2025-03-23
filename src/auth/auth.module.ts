import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GitHubStrategy } from './github.strategy';
import { AppConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AppConfigModule, UsersModule],
  controllers: [AuthController],
  providers: [GitHubStrategy],
})
export class AuthModule {}
