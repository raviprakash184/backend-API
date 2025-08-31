import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduledOrder, ScheduledOrderSchema } from './scheduledOrder.schema';
import { ScheduledOrdersService } from './scheduledOrders.service';
import { ScheduledOrdersController } from './scheduledOrders.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ScheduledOrder.name, schema: ScheduledOrderSchema }]),
  ],
  controllers: [ScheduledOrdersController],
  providers: [ScheduledOrdersService],
})
export class ScheduledOrdersModule {}
