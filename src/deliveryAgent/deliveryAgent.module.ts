import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryAgentController } from './deliveryAgent.controller';
import { DeliveryAgentService } from './deliveryAgent.service';
import { DeliveryAgent, DeliveryAgentSchema } from './schemas/deliveryAgent.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DeliveryAgent.name, schema: DeliveryAgentSchema }])],
  controllers: [DeliveryAgentController],
  providers: [DeliveryAgentService],
})
export class DeliveryAgentModule {}
