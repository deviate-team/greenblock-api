import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type OfferDocument = Offer & HydratedDocument<Offer>;

export interface TimePeriod {
  start: Date;
  end: Date;
}

export interface Contract {
  name: string;
  email: string;
  tel: number;
}

@Schema()
export class Offer extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  project_name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true, type: Object })
  time_period: TimePeriod;

  @Prop({ required: true })
  price_by_unit: number;

  @Prop({ required: true, type: Object })
  contract: Contract;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  maximun: 5;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
