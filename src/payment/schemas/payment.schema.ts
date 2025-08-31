// src/payment/schemas/payment.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {


  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  notes: string;

  @Prop()
  profilePhoto: string;

  @Prop({ min: 0, max: 5 })
  rating: number;

  @Prop()
  paymentDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' })
  agent: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' })
  status: string;

  @Prop({ enum: ['upi', 'card', 'netbanking', 'cod', 'wallet'], required: true })
  method: string;

  @Prop({ enum: ['payment', 'refund'], default: 'payment' })
  paymentType: string;

  @Prop({ required: false })
  transactionId?: string;

  @Prop({ required: false })
  refundAmount?: number;

  @Prop({ required: false })
  refundReason?: string;

  @Prop()
  orderId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
