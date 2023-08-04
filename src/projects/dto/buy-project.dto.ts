import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class BuyProjectDto {
  @ApiProperty({
    description: 'project id',
    example: 'fk3jof83jdo3eiqeir',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'amount',
    example: 20,
  })
  @IsNumber()
  amount: number;
}
