import { Controller, Get, UseGuards } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { AppAuthGuard } from '../auth/auth.guard';

@UseGuards(AppAuthGuard)
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  findAll(): Promise<string[]> {
    return this.topicsService.findAll();
  }
}
