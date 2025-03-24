import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokensController } from './tokens.controller';

@Module({
  imports: [PrismaModule],
  providers: [TokensService],
  controllers: [TokensController],
  exports: [TokensService],
})
export class TokensModule {}
