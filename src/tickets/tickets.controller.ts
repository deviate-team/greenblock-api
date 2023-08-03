import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    const newTicket = await this.ticketsService.create(createTicketDto);
    return {
      success: true,
      message: 'Ticket created successfully',
      data: newTicket,
    };
  }

  @Get()
  async findAll() {
    const tikets = await this.ticketsService.findAll();
    return {
      success: true,
      message: 'Tickets retrieved successfully',
      data: tikets,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const ticket = await this.ticketsService.findOne(id);
    return {
      success: true,
      message: 'Ticket retrieved successfully',
      data: ticket,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    const ticket = await this.ticketsService.update(id, updateTicketDto);
    return {
      success: true,
      message: 'Ticket updated successfully',
      data: ticket,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const ticketRemoved = await this.ticketsService.remove(id);
    return {
      success: true,
      message: 'Ticket removed successfully',
      data: ticketRemoved,
    };
  }
}
