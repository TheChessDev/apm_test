import { Controller, Get, UseGuards } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  findAll(): Promise<string[]> {
    return this.topicsService.findAll();
  }
}
