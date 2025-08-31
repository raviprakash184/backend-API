import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop()
  notes: string;

  @Prop({ type: [Object], default: [] })
  transactions: Array<{
    amount: number;
    type: 'credit' | 'debit';
    date: Date;
    description?: string;
    orderId?: string;
    paymentId?: string;
  }>;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
