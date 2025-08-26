import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  message: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: new Date() })
  sentAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
