import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ScheduledOrdersService } from './scheduledOrders.service';

@Controller('scheduled-orders')
export class ScheduledOrdersController {
  constructor(private readonly scheduledOrdersService: ScheduledOrdersService) {}

  @Post('create')
  createScheduledOrder(
    @Body('userId') userId: string,
    @Body('items') items: any[],
    @Body('deliveryAddress') deliveryAddress: string,
    @Body('scheduleType') scheduleType: string,
    @Body('nextDeliveryDate') nextDeliveryDate: Date,
  ) {
    return this.scheduledOrdersService.createScheduledOrder(userId, items, deliveryAddress, scheduleType, nextDeliveryDate);
  }

  @Get('user/:userId')
  getUserScheduledOrders(@Param('userId') userId: string) {
    return this.scheduledOrdersService.getUserScheduledOrders(userId);
  }

  @Post('cancel/:id')
  cancelScheduledOrder(@Param('id') id: string) {
    return this.scheduledOrdersService.cancelScheduledOrder(id);
  }
}
