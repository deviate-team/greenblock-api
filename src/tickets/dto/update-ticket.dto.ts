import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ILocation } from '@/common/interfaces/location.interface';
import { IProvider } from '@/common/interfaces/provider.interface';
export class UpdateTicketDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  depart_location?: ILocation;

  @ApiProperty({ required: false })
  @IsOptional()
  arrive_location?: ILocation;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  depart_time?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  arrive_time?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  standard_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  business_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  provider?: IProvider;
}
