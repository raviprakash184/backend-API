import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Food {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Category', required: false })
  categories?: Types.ObjectId[]; // Uses unified Category model from src/category

  @Prop({ type: [Types.ObjectId], ref: 'SubCategory', required: false })
  subCategories?: Types.ObjectId[]; // Uses SubCategory model from src/subcategorie

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: [String], required: false })
  images?: string[];

  @Prop({ type: Object })
  nutrition?: Record<string, any>;

  @Prop({ type: Object })
  meta?: Record<string, any>;
}

export type FoodDocument = Food & Document;
export const FoodSchema = SchemaFactory.createForClass(Food);
