import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class BuyCarbonDto {
  @ApiProperty({
    description: 'offer id',
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
