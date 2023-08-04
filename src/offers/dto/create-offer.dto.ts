import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsNumber,
  IsObject,
  IsUrl,
  IsPositive,
  isNotEmpty,
} from 'class-validator';
import { Project } from '@/projects/schemas/project.schema';

export class CreateOfferDto {
  @ApiProperty({
    description: 'Offer Name',
    example: 'ปลูกต้นไม้100ล้านต้น',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Offer description',
    example: 'ปลูกต้นไม่กับพี่ตูน',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Project Reference',
    example: 'ปลูกต้นไม่กับพี่ตูน',
  })
  @IsString()
  project_id: String;

  @ApiProperty({
    description: 'Carbon credit sell price',
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  price_per_kg: number;

  @ApiProperty({
    description: 'Offer image',
    example: 'img_path',
  })
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'how much this offer cab sell',
    example: 10000,
  })
  @IsNumber()
  @IsPositive()
  avaliable: number;
}
