import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schemas/ticket.schema';

import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

import { TransactionsModule } from '@/transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    TransactionsModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
