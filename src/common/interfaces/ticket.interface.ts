import { IProvider } from './provider.interface';

export interface ITicket {
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
