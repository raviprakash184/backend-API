import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  image_url: string[];

  @Prop({ default: true })
  isActive: boolean;
  
  @Prop()
  description?: string;

  @Prop()
  displayOrder?: number;

  // slug removed

  @Prop()
  icon?: string;

  @Prop({ type: Object })
  meta?: Record<string, any>;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
