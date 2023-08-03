import { IProvider } from '@/common/interfaces/provider.interface';
import { ILocation } from '@/common/interfaces/location.interface';
export class CreateTicketDto {
  title: string;
  description: string;
  depart_location: string;
  // depart_location: ILocation;
  arrive_location: string;
  // arrive_location: ILocation;
  date: string;
  depart_time: string;
  arrive_time: string;
  standard_price: number;
  business_price: number;
  provider: IProvider;
}
