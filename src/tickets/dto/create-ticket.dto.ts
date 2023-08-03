import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IProvider } from '@/common/interfaces/provider.interface';
import { ILocation } from '@/common/interfaces/location.interface';
export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  depart_location: ILocation;

  @ApiProperty()
  @IsString()
  arrive_location: ILocation;

  @ApiProperty()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsDateString()
  depart_time: Date;

  @ApiProperty()
  @IsDateString()
  arrive_time: Date;

  @ApiProperty()
  @IsNumber()
  standard_price: number;

  @ApiProperty()
  @IsNumber()
  business_price: number;

  @ApiProperty()
  @IsNotEmpty()
  provider: IProvider;
}
