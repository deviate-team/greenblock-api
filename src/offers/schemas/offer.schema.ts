import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

import { User } from '@/users/schemas/user.schema';
import { Project } from '@/projects/schemas/project.schema';
export type OfferDocument = Offer & HydratedDocument<Offer>;

@Schema()
export class Offer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  project: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ default: 50 })
  price_per_kg: number;

  @Prop({ required: true })
  image: string;

  @Prop({ default: 420 })
  available: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

}

export const OfferSchema = SchemaFactory.createForClass(Offer);
