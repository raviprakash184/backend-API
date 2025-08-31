import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  message: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: new Date() })
  sentAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop()
  image: string;

  @Prop({ default: 1 })
  priority: number;

  @Prop({ default: 'push' })
  channel: string;

  @Prop({ type: Object })
  meta: Record<string, any>;

  @Prop({ default: 'system' })
  type: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
