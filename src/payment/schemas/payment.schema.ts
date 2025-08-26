// src/payment/schemas/payment.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ enum: ['pending', 'completed', 'failed'], default: 'pending' })
  status: string;

  @Prop({ enum: ['upi', 'card', 'netbanking', 'cod'], required: true })
  method: string;

  @Prop({ required: false })
  transactionId?: string;

  @Prop()
  orderId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
