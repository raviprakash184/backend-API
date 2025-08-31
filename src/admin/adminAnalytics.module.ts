import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { DeliveryAgent, DeliveryAgentSchema } from '../deliveryAgent/schemas/deliveryAgent.schema';
import { User, UserSchema } from '../users/schema/user.schema';
import { AdminAnalyticsService } from './adminAnalytics.service';
import { AdminAnalyticsController } from './adminAnalytics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: DeliveryAgent.name, schema: DeliveryAgentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminAnalyticsController],
  providers: [AdminAnalyticsService],
})
export class AdminAnalyticsModule {}
