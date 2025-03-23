import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GitHubStrategy } from './github.strategy';
import { AppConfigModule } from '../config/config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [AuthController],
  providers: [GitHubStrategy],
})
export class AuthModule {}
