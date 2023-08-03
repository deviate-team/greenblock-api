import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

import { IProvider } from '@/common/interfaces/provider.interface';
import { ILocation } from '@/common/interfaces/location.interface';

export type TicketDocument = Ticket & HydratedDocument<Ticket>;

@Schema()
export class Ticket extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  depart_location: string; // TODO: change to location object with lat and long
  // depart_location: ILocation;

  @Prop({ required: true })
  arrive_location: string; // TODO: change to location object with lat and long
  // arrive_location: ILocation;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  depart_time: string;

  @Prop({ required: true })
  arrive_time: string;

  @Prop({ required: true })
  standard_price: number;

  @Prop({ required: true })
  business_price: number;

  @Prop({ required: true })
  provider: IProvider;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
