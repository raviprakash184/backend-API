import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class SubCategory extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
  category: string;

  @Prop()
  description?: string;

  @Prop()
  image_url?: string[];

  @Prop({ default: true })
  isActive?: boolean;

  @Prop()
  displayOrder?: number;

  @Prop()
  slug?: string;

  @Prop()
  icon?: string;

  @Prop({ type: Object })
  meta?: Record<string, any>;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
