import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DeliveryAgent {
  @Prop({
    type: {
      latitude: { type: Number },
      longitude: { type: Number },
      timestamp: { type: Date }
    },
    default: null
  })
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'Address', required: false })
  address?: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop({ default: 0 })
  totalDeliveries: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ type: Object })
  meta?: Record<string, any>;
}

export type DeliveryAgentDocument = DeliveryAgent & Document;
export const DeliveryAgentSchema = SchemaFactory.createForClass(DeliveryAgent);
