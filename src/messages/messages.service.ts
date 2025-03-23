import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  send(topic: string, message: { name: string }): Promise<Message> {
    return this.prisma.message.create({
      data: {
        topic,
        name: message.name,
      },
    });
  }

  list(topic: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { topic },
      orderBy: { createdAt: 'asc' },
    });
  }
}
