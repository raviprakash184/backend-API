import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeliveryDocument = Delivery & Document;

@Schema({ timestamps: true })
export class Delivery {
  @Prop({ required: true })
  deliveryAgentName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true, enum: ['available', 'on_delivery', 'offline'], default: 'available' })
  status: 'available' | 'on_delivery' | 'offline';

  @Prop()
  vehicleNumber: string;

  @Prop({ default: 0 })
  totalDeliveries: number;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
