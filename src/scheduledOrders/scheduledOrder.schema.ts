import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ScheduledOrder extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  items: any[];

  @Prop({ required: true })
  deliveryAddress: string;

  @Prop({ required: true })
  scheduleType: string; // 'once', 'daily', 'weekly', 'monthly'

  @Prop({ required: true })
  nextDeliveryDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const ScheduledOrderSchema = SchemaFactory.createForClass(ScheduledOrder);
