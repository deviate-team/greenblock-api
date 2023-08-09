import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MoneyType } from '@/common/enums/money-type.enum';
export class AddMoneyDto {
  @ApiProperty({
    description: 'Quantity',
    example: 20,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Option',
    example: MoneyType.carbonCredit,
  })
  @IsNotEmpty()
  @IsEnum(MoneyType)
  option: MoneyType;
}
