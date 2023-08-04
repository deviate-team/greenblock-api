import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsObject,
  IsDateString,
} from 'class-validator';
export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @IsNotEmpty()
  contact: {
    name: string;
    email: string;
    phoneNumber: string;
  };

  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @IsNotEmpty()
  @IsDateString()
  end_date: Date;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  max_shares: number;

  @IsNumber()
  @IsNotEmpty()
  balance: number;
}
