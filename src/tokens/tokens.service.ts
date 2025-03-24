import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(userId: number, name?: string): Promise<string> {
    const token = randomBytes(32).toString('hex');

    const record = await this.prisma.permanentToken.create({
      data: {
        userId,
        token,
        name,
      },
    });

    return record.token;
  }

  findByToken(token: string) {
    return this.prisma.permanentToken.findUnique({ where: { token } });
  }

  revokeToken(token: string) {
    return this.prisma.permanentToken.delete({ where: { token } });
  }
}
