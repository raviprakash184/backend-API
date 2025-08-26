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
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
