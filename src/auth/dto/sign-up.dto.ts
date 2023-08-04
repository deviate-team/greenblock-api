import {
  IsStrongPassword,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsPhoneNumber
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'User email',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'User first name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({
    description: 'User middle name',
    type: String,
  })
  @IsOptional()
  @IsString()
  readonly middleName: string;

  @ApiProperty({
    description: 'User last name',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    description: 'User birth date',
    type: Date,
  })
  @IsDateString()
  @IsNotEmpty()
  readonly birthDate: Date;

  @ApiProperty({
    description: 'User username',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: 'User password',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
  })
  readonly password: string;

  @ApiProperty({
    description: 'User confirm password',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
  })
  readonly confirmPassword: string;

  @ApiProperty({
    description: 'User phone number',
    type: String,
  })
  @IsPhoneNumber('ID')
  @IsNotEmpty({
    message: 'Phone number is required',
  })
  readonly phoneNumber: string;
}
