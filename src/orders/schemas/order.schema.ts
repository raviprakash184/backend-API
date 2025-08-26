import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number,
      },
    ],
    required: true,
  })
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true })
  deliveryAddress: string;

  @Prop({ default: 'pending' })
  status: string; // pending | confirmed | shipped | delivered | cancelled

  @Prop()
  paymentMethod: string; // COD, online, UPI, etc.

  @Prop()
  paymentStatus: string; // paid | unpaid

  @Prop()
  deliveryDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
