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
  ) { }

  async create(createTicketDto: CreateTicketDto, user) {
    const newTicket = await this.ticketModel.create({
      ...createTicketDto,
      provider: user._id,
    });

    return await this.ticketModel
      .findById(newTicket._id)
      .populate(
        'provider',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName',
      )
      .select('-__v')
      .exec();
  }

  async findAll() {
    return await this.ticketModel
      .find()
      .populate(
        'provider',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName -firstName -lastName',
      )
      .select('-__v')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllWithPagination(page = '1', limit = '10') {
    const parsedPage = Math.max(Number(page), 1);
    const parsedLimit = Number(limit);

    const count = await this.ticketModel.countDocuments().exec();
    const tickets = await this.ticketModel
      .find()
      .limit(parsedLimit)
      .skip((parsedPage - 1) * parsedLimit)
      .populate(
        'provider',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName',
      )
      .select('-__v')
      .sort({ createdAt: -1 })
      .exec();

    return {
      totalTickets: count,
      currentPage: parsedPage,
      totalPages: Math.ceil(count / parsedLimit),
      tickets,
    };
  }

  async findOne(id: string) {
    const ticketExists = await this.ticketModel
      .findById(id)
      .populate(
        'provider',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName',
      )
      .select('-__v')
      .exec();
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

  async update(id: string, updateTicketDto: UpdateTicketDto, user) {
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

    if (ticketExists.provider.toString() !== user._id.toString()) {
      return new HttpException(
        {
          success: false,
          message: 'You are not authorized to update this ticket',
        },
        401,
      );
    }

    const updatedTicket = await this.ticketModel
      .findByIdAndUpdate(id, updateTicketDto, { new: true })
      .populate(
        'provider',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName',
      )
      .select('-__v')
      .exec();

    return updatedTicket;
  }

  async remove(id: string) {
    const ticketExists = await this.ticketModel
      .findById(id)
      .populate(
        'provider',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName',
      )
      .select('-__v')
      .exec();

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
