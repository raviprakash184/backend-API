import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PushNotification extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'info' })
  type: string;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  scheduledAt?: Date;
}

export const PushNotificationSchema = SchemaFactory.createForClass(PushNotification);
