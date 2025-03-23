import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message } from '@prisma/client';

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: MessagesService;

  const mockMessagesService = {
    send: jest.fn(),
    list: jest.fn(),
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
    }).compile();

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
});
