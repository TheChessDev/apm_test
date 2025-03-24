import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TopicsService', () => {
  let service: TopicsService;

  const mockPrisma = {
    message: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return topics in ascending order', async () => {
    const topics = [
      { topic: 'a-topic' },
      { topic: 'b-topic' },
      { topic: 'c-topic' },
    ];
    mockPrisma.message.findMany.mockResolvedValue(topics);

    const result = await service.findAll();
    expect(result).toEqual(['a-topic', 'b-topic', 'c-topic']);
  });

  it('should return an empty array when no topics are found', async () => {
    mockPrisma.message.findMany.mockResolvedValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
  });
});
