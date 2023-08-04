import { TimePeriod, Contract } from '../schemas/offsets.schema';
export class CreateOffsetDto {
    project_name: string;
    description: string;
    owner: string;
    time_period: TimePeriod;
    contact: Contract;
    price_by_unit: number;
    _id: string;
    image: string;
    maximum: number;
  }
