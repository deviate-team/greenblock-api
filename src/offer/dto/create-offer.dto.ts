import { TimePeriod, Contract } from '../schemas/offer.schema';

export class CreateOfferDto {
  type: string;
  project_name: string;
  description: string;
  owner: string;
  time_period: TimePeriod;
  contact: Contract;
  price_by_unit: number;
  image: string;
  maximum: number;
}
