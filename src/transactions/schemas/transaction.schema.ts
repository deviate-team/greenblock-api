import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

import { TransactionType } from '@/common/enums/transaction-type.enum';
import { TransactionStatus } from '@/common/enums/transaction-status.enum';

export type TransactionDocument = Transaction & HydratedDocument<Transaction>;

@Schema()
export class Transaction extends Document {
  @Prop({ required: true, enum: TransactionType })
  type: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: TransactionStatus })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Ticket' })
  ticket: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  total_price: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
