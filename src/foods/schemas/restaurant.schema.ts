import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: [Types.ObjectId], ref: 'Category', required: false })
  categories?: Types.ObjectId[]; // Uses unified Category model from src/category

  @Prop({ type: [Types.ObjectId], ref: 'SubCategory', required: false })
  subCategories?: Types.ObjectId[]; // Uses SubCategory model from src/subcategorie

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ type: Object })
  timings?: Record<string, any>;

  @Prop({ type: Object })
  meta?: Record<string, any>;
}

export type RestaurantDocument = Restaurant & Document;
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
