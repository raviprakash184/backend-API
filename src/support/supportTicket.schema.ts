import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SupportTicket extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'open' })
  status: string; // open, in-progress, closed

  @Prop()
  response?: string;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);
