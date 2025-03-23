import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Message } from '@prisma/client';

describe('Messages API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const topic = 'demo-topic';
  const message = { name: 'Demo Message' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await prisma.listenerProgress.deleteMany();
    await prisma.message.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should send a message to a topic', async () => {
    const response = await request(app.getHttpServer())
      .post(`/topics/${topic}/messages`)
      .send(message)
      .expect(201);

    expect(response.body).toMatchObject({
      topic,
      name: message.name,
    });

    const messages = await prisma.message.findMany();
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({
      topic,
      name: message.name,
    });
  });

  it('should list all messages for a topic', async () => {
    await prisma.message.create({
      data: { topic, name: message.name },
    });

    const res = await request(app.getHttpServer())
      .get(`/topics/${topic}/messages`)
      .expect(200);

    const body = res.body as Message[];
    expect(body).toHaveLength(1);
    expect(body[0]).toMatchObject({
      topic,
      name: message.name,
    });
  });
});
