import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  sendMessage(
    @Body('orderId') orderId: string,
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
    @Body('message') message: string,
  ) {
    return this.chatService.sendMessage(orderId, senderId, receiverId, message);
  }

  @Get('order/:orderId')
  getOrderChat(@Param('orderId') orderId: string) {
    return this.chatService.getOrderChat(orderId);
  }

  @Post('read/:id')
  markAsRead(@Param('id') id: string) {
    return this.chatService.markAsRead(id);
  }
}
