import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ unique: true })
  orderNumber: string;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  notes: string;

  @Prop()
  rating: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent' })
  agent: any;

  @Prop()
  profilePhoto: string;
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
  estimatedDeliveryTime: Date; // For countdown timer in customer app

  @Prop({
    type: [
      {
        status: String,
        timestamp: Date,
        note: String,
      },
    ],
    default: [],
  })
  orderTimeline: {
    status: string;
    timestamp: Date;
    note?: string;
  }[];

  @Prop()
  paymentMethod: string; // COD, online, UPI, etc.

  @Prop()
  paymentStatus: string; // paid | unpaid

  @Prop()
  deliveryDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
