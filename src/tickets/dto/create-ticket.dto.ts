import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ILocation } from '@/common/interfaces/location.interface';
export class CreateTicketDto {
  @ApiProperty({
    description: 'Ticket title',
    example: 'Ticket title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Ticket description',
    example: 'Ticket description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Depart location',
    example: {
      latitude: 10.123,
      longitude: 10.123,
    },
  })
  @IsNotEmpty()
  depart_location: ILocation;

  @ApiProperty({
    description: 'Arrive location',
    example: {
      latitude: 10.123,
      longitude: 10.123,
    },
  })
  @IsNotEmpty()
  @IsString()
  arrive_location: ILocation;

  @ApiProperty({
    description: 'Date',
    example: '2021-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({
    description: 'Depart time',
    example: '2021-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  depart_time: Date;

  @ApiProperty({
    description: 'Arrive time',
    example: '2021-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  arrive_time: Date;

  @ApiProperty({
    description: 'Standard price',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  standard_price: number;

  @ApiProperty({
    description: 'Business price',
    example: 120,
  })
  @IsNotEmpty()
  @IsNumber()
  business_price: number;

  @ApiProperty({
    description: 'The limit of seat',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  seat_limit: number;


  
}
