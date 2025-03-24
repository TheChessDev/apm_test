import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { AppAuthGuard } from '../auth/auth.guard';

describe('TopicsController', () => {
  let controller: TopicsController;

  const mockTopicsService = {
    findAll: jest.fn().mockResolvedValue(['demo-topic', 'another-topic']),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [{ provide: TopicsService, useValue: mockTopicsService }],
    })
      .overrideGuard(AppAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TopicsController>(TopicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return topics', async () => {
    const topics = await controller.findAll();
    expect(topics).toEqual(['demo-topic', 'another-topic']);
  });
});
