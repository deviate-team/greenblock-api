import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class JoinProjectDto {
  @ApiProperty({
    description: 'amount',
    example: 20,
  })
  @IsNumber()
  amount: number;
}
