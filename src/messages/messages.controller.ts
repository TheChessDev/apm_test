import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';

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
}
