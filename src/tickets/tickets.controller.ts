import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

// import { GetUser } from '@/common/decorators/get-user.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';

import { TicketsService } from './tickets.service';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles(Role.Provider, Role.Admin)
  @UseGuards(RolesGuard)
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

  @Post()
  @Roles(Role.Provider, Role.Admin)
  @UseGuards(RolesGuard)
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

  @Post()
  @Roles(Role.Provider, Role.Admin)
  @UseGuards(RolesGuard)
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
