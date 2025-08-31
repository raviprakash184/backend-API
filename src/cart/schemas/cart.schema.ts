// src/cart/schemas/cart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      discount: { type: Number, default: 0 },
    },
  ])
  items: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
    discount?: number;
  }[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  cartTotal?: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
