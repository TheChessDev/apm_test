import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { MessagesService } from './messages.service';

describe('MessagesService (integration)', () => {
  let service: MessagesService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [MessagesService],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.listenerProgress.deleteMany();
    await prisma.message.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a message and store it in the database', async () => {
    const topic = 'integration-topic';
    const name = 'Real DB Test';

    await service.send(topic, { name });

    const stored = await prisma.message.findMany();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ topic, name });
  });

  it('should list messages for a topic', async () => {
    const topic = 'integration-topic';
    await prisma.message.createMany({
      data: [
        { topic, name: 'First' },
        { topic, name: 'Second' },
      ],
    });

    const messages = await service.list(topic);
    expect(messages).toHaveLength(2);
    expect(messages[0].name).toBe('First');
    expect(messages[1].name).toBe('Second');
  });
});
