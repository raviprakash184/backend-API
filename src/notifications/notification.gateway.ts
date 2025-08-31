import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: true })
@Injectable()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  // Send notification to user
  @SubscribeMessage('sendNotification')
  handleSendNotification(
    @MessageBody() data: { userId: string; message: string; type?: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`user_${data.userId}`).emit('notification', {
      message: data.message,
      type: data.type || 'info',
      timestamp: new Date(),
    });
  }

  // User joins notification room
  @SubscribeMessage('joinNotification')
  handleJoinNotification(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user_${data.userId}`);
  }

  // User leaves notification room
  @SubscribeMessage('leaveNotification')
  handleLeaveNotification(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`user_${data.userId}`);
  }
}
