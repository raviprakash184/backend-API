import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true })
  subCategory: string;

//   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
//   brand?: string;
@Prop()
brand?: string;

  @Prop()
  image_url?: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discount?: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit: string; // e.g., kg, gm, pcs

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  isVeg?: boolean;

  @Prop()
  shelfLife?: string;

  @Prop()
  isPrescriptionRequired?: boolean;

  @Prop()
  disclaimer?: string;

  @Prop()
  sellerName?: string;

  @Prop()
  countryOfOrigin?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
