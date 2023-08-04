import { IsEnum } from 'class-validator';
import { TransactionType } from '@/common/enums/transaction-type.enum';
import { TransactionStatus } from '@/common/enums/transaction-status.enum';

export class CreateTransactionDTO {
  @IsEnum(TransactionType)
  type: string;
  user: string;
  @IsEnum(TransactionStatus)
  status: string;
  description: string;
  ticket?: string;
  quantity: number;
  total_price: number;
}
