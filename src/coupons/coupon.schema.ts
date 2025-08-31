import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Coupon extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  discountType: string; // 'percent', 'amount'

  @Prop({ required: true })
  discountValue: number;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  minOrderAmount?: number;

  @Prop()
  maxDiscountAmount?: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
