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

  async create(createTicketDto: CreateTicketDto, user) {
    await this.ticketModel.create({
      ...createTicketDto,
      provider: user._id,
    });
  }

  async findAll() {
    const tickets = await this.ticketModel
      .find()
      .populate(
        'provider',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName -firstName -lastName',
      )
      .select('-__v')
      .sort({ createdAt: -1 })
      .exec();
    const transformedTickets = tickets.map((ticket) => ({
      ...ticket.toJSON(),
      seat_booked: ticket.seat_booked.length,
      availableTickets: ticket.seat_limit - ticket.seat_booked.length,
    }));

    return transformedTickets;
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

    const transformedTickets = tickets.map((ticket) => ({
      ...ticket.toJSON(),
      seat_booked: ticket.seat_booked.length,
      availableTickets: ticket.seat_limit - ticket.seat_booked.length,
    }));

    return {
      totalTickets: count,
      currentPage: parsedPage,
      totalPages: Math.ceil(count / parsedLimit),
      tickets: transformedTickets,
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

    return {
      ...ticketExists.toJSON(),
      seat_booked: ticketExists.seat_booked.length,
      availableTickets:
        ticketExists.seat_limit - ticketExists.seat_booked.length,
    };
  }

  async book(id: string, user) {
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

    if (ticketExists.seat_booked.length >= ticketExists.seat_limit) {
      return new HttpException(
        {
          success: false,
          message: 'Ticket is full',
        },
        400,
      );
    }

    if (ticketExists.seat_booked.includes(user._id)) {
      return new HttpException(
        {
          success: false,
          message: 'You already booked this ticket',
        },
        400,
      );
    }

    const updatedTicket = await this.ticketModel
      .findByIdAndUpdate(
        id,
        {
          $push: { seat_booked: user._id },
        },
        { new: true },
      )
      .populate(
        'provider',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName',
      )
      .select('-__v')
      .exec();

    return {
      ...updatedTicket.toJSON(),
      seat_booked: updatedTicket.seat_booked.length,
      availableTickets:
        updatedTicket.seat_limit - updatedTicket.seat_booked.length,
    };
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

    return {
      ...updatedTicket.toJSON(),
      seat_booked: updatedTicket.seat_booked.length,
      availableTickets:
        updatedTicket.seat_limit - updatedTicket.seat_booked.length,
    };
  }

  async remove(id: string) {
    const ticketExists = await this.ticketModel
      .findById(id)
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
    await this.ticketModel.findByIdAndDelete(id);
  }
}
