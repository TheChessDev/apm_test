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

  /**
   * returns the next message for the given listener if at least 60 seconds have passed
   * since the last delivered message; otherwise, it returns null.
   */
  async getNextMessage(
    topic: string,
    listenerId: string,
  ): Promise<Message | null> {
    let progress = await this.prisma.listenerProgress.findUnique({
      where: { listenerId_topic: { listenerId, topic } },
    });

    if (!progress) {
      progress = await this.prisma.listenerProgress.create({
        data: { listenerId, topic },
      });
    }

    const now = new Date();
    if (now.getTime() - new Date(progress.updatedAt).getTime() < 60 * 1000) {
      return null;
    }

    const nextMessages = await this.prisma.message.findMany({
      where: {
        topic,
        id: { gt: progress.lastSeenId },
      },
      orderBy: { id: 'asc' },
      take: 1,
    });

    if (nextMessages.length === 0) {
      return null;
    }

    const nextMessage = nextMessages[0];

    await this.prisma.listenerProgress.update({
      where: { id: progress.id },
      data: {
        lastSeenId: nextMessage.id,
      },
    });

    return nextMessage;
  }
}
