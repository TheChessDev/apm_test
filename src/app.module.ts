import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [AppConfigModule, AuthModule, MessagesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
