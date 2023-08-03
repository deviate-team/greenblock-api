import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ILocation } from '@/common/interfaces/location.interface';

export class UpdateTicketDto {
  @ApiProperty({
    description: 'Ticket title',
    example: 'Updated ticket title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Ticket description',
    example: 'Updated ticket description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Depart location',
    example: {
      lagitude: 10.123,
      longitude: 10.123,
    },
  })
  @IsOptional()
  depart_location?: ILocation;

  @ApiProperty({
    description: 'Arrive location',
    example: {
      lagitude: 10.123,
      longitude: 10.123,
    },
  })
  @IsOptional()
  arrive_location?: ILocation;

  @ApiProperty({
    description: 'Date',
    example: '2021-01-01',
  })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiProperty({
    description: 'Depart time',
    example: '2021-01-01',
  })
  @IsOptional()
  @IsDateString()
  depart_time?: Date;

  @ApiProperty({
    description: 'Arrive time',
    example: '2021-01-01',
  })
  @IsOptional()
  @IsDateString()
  arrive_time?: Date;

  @ApiProperty({
    description: 'Standard price',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  standard_price?: number;

  @ApiProperty({
    description: 'Business price',
    example: 120,
  })
  @IsOptional()
  @IsNumber()
  business_price?: number;

  @ApiProperty({
    description: 'The limit of seat',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  seat_limit?: number;
}
