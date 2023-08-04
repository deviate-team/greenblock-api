import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

import { ILocation } from '@/common/interfaces/location.interface';

export type TicketDocument = Ticket & HydratedDocument<Ticket>;

@Schema()
export class Ticket extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: Object,
  })
  depart_location: ILocation;

  @Prop({
    required: true,
    type: Object,
  })
  arrive_location: ILocation;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  depart_time: Date;

  @Prop({ required: true })
  arrive_time: Date;

  @Prop({ required: true })
  standard_price: number;

  @Prop({ required: true })
  business_price: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  provider: string;

  @Prop({ required: true })
  seat_limit: number;

  @Prop({ required: true, type: [Types.ObjectId], ref: 'User' })
  seat_booked: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
