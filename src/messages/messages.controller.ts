import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AppAuthGuard } from '../auth/auth.guard';

@UseGuards(AppAuthGuard)
@Controller('topics/:topic/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  sendMessage(@Param('topic') topic: string, @Body('name') name: string) {
    return this.messagesService.send(topic, { name });
  }

  @Get()
  listMessages(@Param('topic') topic: string) {
    return this.messagesService.list(topic);
  }

  @Get('next')
  @HttpCode(HttpStatus.OK)
  async getNextMessage(
    @Param('topic') topic: string,
    @Query('listenerId') listenerId: string,
  ) {
    if (!listenerId) {
      throw new NotFoundException('listenerId query parameter is required');
    }
    const nextMessage = await this.messagesService.getNextMessage(
      topic,
      listenerId,
    );
    if (!nextMessage) {
      return { message: null };
    }
    return nextMessage;
  }
}
