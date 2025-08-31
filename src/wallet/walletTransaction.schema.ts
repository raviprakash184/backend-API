import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WalletTransaction extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  type: string; // 'credit', 'debit', 'refund'

  @Prop()
  orderId?: string;

  @Prop({ default: 'completed' })
  status: string; // completed, pending, failed
}

export const WalletTransactionSchema = SchemaFactory.createForClass(WalletTransaction);
