import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsObject,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'Project name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Project description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Project owner',
    example: 'Project owner',
  })
  @IsObject()
  @IsNotEmpty()
  contract: {
    name: string;
    email: string;
    phoneNumber: string;
  };

  @ApiProperty({
    description: 'Project start date',
    example: '2021-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'Project end date',
    example: '2021-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  end_date: Date;

  @ApiProperty({
    description: 'Project image',
    example: 'Project image',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Project max shares',
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  max_shares: number;
}
