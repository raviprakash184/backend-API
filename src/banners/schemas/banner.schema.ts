import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  image_url: string;

  @Prop()
  redirect_url?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ default: 'homepage' })
  type: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ default: 1 })
  priority: number;

  @Prop({ type: Object })
  meta?: Record<string, any>;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
