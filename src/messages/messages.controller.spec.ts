import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import type { Message } from '@prisma/client';
import { AppAuthGuard } from '../auth/auth.guard';

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;

  const mockMessagesService = {
    send: jest.fn(),
    list: jest.fn(),
    getNextMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    })
      .overrideGuard(AppAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get<MessagesService>(MessagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send a message', async () => {
    const topic = 'test-topic';
    const name = 'Test Message';
    const result: Message = {
      id: 1,
      topic,
      name,
      createdAt: new Date(),
    };

    mockMessagesService.send.mockResolvedValue(result);

    const response = await controller.sendMessage(topic, name);

    expect(response).toEqual(result);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.send).toHaveBeenCalledWith(topic, { name });
  });

  it('should list messages', async () => {
    const topic = 'test-topic';
    const result: Message[] = [
      { id: 1, topic, name: 'A', createdAt: new Date() },
      { id: 2, topic, name: 'B', createdAt: new Date() },
    ];

    mockMessagesService.list.mockResolvedValue(result);

    const response = await controller.listMessages(topic);

    expect(response).toEqual(result);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.list).toHaveBeenCalledWith(topic);
  });

  describe('getNextMessage', () => {
    const topic = 'test-topic';
    const listenerId = 'listener-123';

    it('should throw NotFoundException if listenerId is not provided', async () => {
      await expect(controller.getNextMessage(topic, '')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return { message: null } when no next message is found', async () => {
      mockMessagesService.getNextMessage.mockResolvedValue(null);

      const response = await controller.getNextMessage(topic, listenerId);
      expect(response).toEqual({ message: null });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getNextMessage).toHaveBeenCalledWith(topic, listenerId);
    });

    it('should return the next message if found', async () => {
      const nextMessage: Message = {
        id: 3,
        topic,
        name: 'Next Message',
        createdAt: new Date(),
      };

      mockMessagesService.getNextMessage.mockResolvedValue(nextMessage);

      const response = await controller.getNextMessage(topic, listenerId);
      expect(response).toEqual(nextMessage);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getNextMessage).toHaveBeenCalledWith(topic, listenerId);
    });
  });
});
