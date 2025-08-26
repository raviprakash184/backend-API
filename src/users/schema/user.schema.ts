import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false, sparse: true })
  email?: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ enum: ['male', 'female', 'other'], required: false })
  gender?: string;

  @Prop({ required: false })
  photo?: string; // will store image URL or file path

  @Prop({ required: false })
  dob?: Date;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Address', default: [] })
  addresses: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address', default: null })
  defaultAddressId: mongoose.Schema.Types.ObjectId | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
