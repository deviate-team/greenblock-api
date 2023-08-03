import { Injectable, HttpException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Ticket, TicketDocument } from './schemas/ticket.schema';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    return await this.ticketModel.create(createTicketDto);
  }

  async findAll() {
    return await this.ticketModel.find().exec();
  }

  async findOne(id: string) {
    const ticketExists = await this.ticketModel.findById(id).exec();
    if (!ticketExists) {
      return new HttpException(
        {
          success: false,
          message: 'Ticket not found',
        },
        404,
      );
    }

    return ticketExists;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const ticketExists = await this.ticketModel.findById(id).exec();
    if (!ticketExists) {
      return new HttpException(
        {
          success: false,
          message: 'Ticket not found',
        },
        404,
      );
    }

    const updatedTicket = await this.ticketModel.findByIdAndUpdate(
      id,
      updateTicketDto,
      { new: true },
    );

    return updatedTicket;
  }

  async remove(id: string) {
    const ticketExists = await this.ticketModel.findById(id).exec();
    if (!ticketExists) {
      return new HttpException(
        {
          success: false,
          message: 'Ticket not found',
        },
        404,
      );
    }

    return await this.ticketModel.findByIdAndDelete(id);
  }
}
