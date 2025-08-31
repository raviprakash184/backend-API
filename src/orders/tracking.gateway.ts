import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: true })
@Injectable()
export class TrackingGateway {
  @WebSocketServer()
  server: Server;

  // Delivery agent sends location update
  @SubscribeMessage('agentLocationUpdate')
  handleAgentLocationUpdate(
    @MessageBody() data: { orderId: string; agentId: string; latitude: number; longitude: number },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast location to all clients tracking this order
    this.server.to(`order_${data.orderId}`).emit('orderLocation', {
      agentId: data.agentId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date(),
    });
  }

  // Customer joins order tracking room
  @SubscribeMessage('joinOrderTracking')
  handleJoinOrderTracking(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`order_${data.orderId}`);
  }

  // Customer leaves order tracking room
  @SubscribeMessage('leaveOrderTracking')
  handleLeaveOrderTracking(
    @MessageBody() data: { orderId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`order_${data.orderId}`);
  }

  // Real-time order status update
  @SubscribeMessage('orderStatusUpdate')
  handleOrderStatusUpdate(
    @MessageBody() data: { orderId: string; status: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`order_${data.orderId}`).emit('orderStatus', {
      orderId: data.orderId,
      status: data.status,
      timestamp: new Date(),
    });
  }
}
