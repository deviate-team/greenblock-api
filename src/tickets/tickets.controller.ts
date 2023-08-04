import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { GetUser } from '@/common/decorators/get-user.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';

import { TicketsService } from './tickets.service';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { BookingTicketDto } from './dto/booking-ticket.dto';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Provider, Role.Admin)
  async create(@Body() createTicketDto: CreateTicketDto, @GetUser() user) {
    await this.ticketsService.create(createTicketDto, user);
    return {
      success: true,
      message: 'Ticket created successfully',
    };
  }

  @Post(':id/book')
  @UseGuards(JwtGuard)
  async book(
    @Param('id') id: string,
    @Body() bookingDto: BookingTicketDto,
    @GetUser() user,
  ) {
    const ticket = await this.ticketsService.book(id, bookingDto, user);
    return {
      success: true,
      message: 'Ticket booked successfully',
      data: ticket,
    };
  }

  @Get('/list')
  async findAllWithPagination(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const tikets = await this.ticketsService.findAllWithPagination(page, limit);
    return {
      success: true,
      message: 'Tickets retrieved successfully',
      data: tikets,
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
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Provider, Role.Admin)
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @GetUser() user,
  ) {
    const ticket = await this.ticketsService.update(id, updateTicketDto, user);
    return {
      success: true,
      message: 'Ticket updated successfully',
      data: ticket,
    };
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Provider, Role.Admin)
  async remove(@Param('id') id: string) {
    const ticketRemoved = await this.ticketsService.remove(id);

    return {
      success: true,
      message: 'Ticket deleted successfully',
      data: ticketRemoved,
    };
  }
}
