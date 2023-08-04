import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketOption } from '@/common/enums/ticket-option.enum';
export class BookingTicketDto {
  @ApiProperty({
    description: 'Quantity',
    example: 20,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Option',
    example: TicketOption.Standard,
  })
  @IsNotEmpty()
  @IsEnum(TicketOption)
  option: TicketOption;
}
