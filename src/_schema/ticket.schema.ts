import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const TicketSchema = new mongoose.Schema({
  ticket_id: String,
  title: String,
  description: String,
  depart_location: String,
  arrive_location: String,
  date: String,
  depart_time: String,
  arrive_time: String,
  standard_price: Number,
  business_price: Number,
  provider: {
    id: Number,
    name: String,
    logo: String
  }

});

export class CreateTicketDto {
    ticket_id: string;
    title: string;
    description: string;
    depart_location: string;
    arrive_location: string;
    date: string;
    depart_time: string;
    arrive_time: string;
    standard_price: number;
    business_price: number;
    provider: IProvider;

}


export interface Ticket extends Document {
    id: number;
    ticket_id: string;
    title: string;
    description: string;
    depart_location: string;
    arrive_location: string;
    date: string;
    depart_time: string;
    arrive_time: string;
    standard_price: number;
    business_price: number;
    provider: IProvider;
}

export interface IProvider {
    id: number;
    name: string;
    logo:string
}