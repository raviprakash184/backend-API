import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { Delivery, DeliverySchema } from './schemas/delivery.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Delivery.name, schema: DeliverySchema }])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
