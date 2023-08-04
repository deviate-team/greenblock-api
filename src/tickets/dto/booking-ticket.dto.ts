import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { TicketOption } from '@/common/enums/ticket-option.enum';

export class BookingTicketDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsEnum(TicketOption)
  option: TicketOption;
}
