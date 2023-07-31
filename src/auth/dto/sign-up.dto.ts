import {
  IsStrongPassword,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly middleName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsDateString()
  @IsNotEmpty()
  readonly birthDate: Date;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  readonly confirmPassword: string;
}
