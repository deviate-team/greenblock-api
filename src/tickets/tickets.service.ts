import { Injectable, HttpException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { BookingTicketDto } from './dto/booking-ticket.dto';
import { TransactionsService } from '@/transactions/transactions.service';
import { User, UserDocument } from '@/users/schemas/user.schema';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly transactionService: TransactionsService,
  ) {}

  async create(createTicketDto: CreateTicketDto, user) {
    console.log(user._id);
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
      throw new HttpException(
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

  async book(id: string, bookingDto: BookingTicketDto, user) {
    const ticketExists = await this.ticketModel.findById(id).exec();

    const { quantity, option, donation } = bookingDto;

    if (!ticketExists) {
      throw new HttpException(
        {
          success: false,
          message: 'Ticket not found',
        },
        404,
      );
    }

    if (ticketExists.seat_booked.length >= ticketExists.seat_limit) {
      throw new HttpException(
        {
          success: false,
          message: 'Ticket is full',
        },
        400,
      );
    }
    const providerExits = await this.userModel
      .findById(ticketExists.provider)
      .exec();
    const userExists = await this.userModel.findById(user._id).exec();
    if (!userExists) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
        },
        404,
      );
    }
    if (!providerExits) {
      throw new HttpException(
        {
          success: false,
          message: 'Provider not found',
        },
        404,
      );
    }
    const ticketPrice =
      option === 'standard'
        ? ticketExists.standard_price
        : ticketExists.business_price;

    if (userExists.money < ticketPrice * quantity) {
      throw new HttpException(
        {
          success: false,
          message: 'Not enough balance',
        },
        400,
      );
    }

    if (quantity > ticketExists.seat_limit - ticketExists.seat_booked.length) {
      throw new HttpException(
        {
          success: false,
          message: 'Not enough tickets',
        },
        400,
      );
    }

    // TODO: Check if user no enough balance
    const updatedTicket = await this.ticketModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            seat_booked: {
              $each: Array(quantity).fill(user._id),
            },
          },
        },
        { new: true },
      )
      .populate(
        'provider',
        '-__v -password -createdAt -updatedAt -role -birthDate -firstName -lastName',
      )
      .select('-__v')
      .exec();

    userExists.money -= ticketPrice * quantity;
    userExists.save();
    // transaction of buyed ticket
    await this.transactionService.create({
      type: 'ticket',
      user: user._id,
      ticket: id,
      quantity,
      description: `Booked ${quantity} ticket(s)`,
      status: 'success',
      total_price:
        option === 'standard'
          ? ticketPrice * quantity + donation
          : ticketPrice * quantity + donation,
    });

    // transaction of provider
    await this.transactionService.create({
      type: 'ticket',
      user: updatedTicket.provider,
      ticket: id,
      quantity,
      description: `Sold ${quantity} ticket(s)`,
      status: 'success',
      total_price:
        option === 'standard'
          ? ticketExists.standard_price * quantity
          : ticketExists.business_price * quantity,
    });
    providerExits.money += ticketPrice * quantity;
    if (donation > 0) {
      await this.transactionService.create({
        type: 'donate',
        user: updatedTicket.provider,
        ticket: id,
        quantity: 1,
        description: `Got ${quantity} RetailCC(s)`,
        status: 'success',
        total_price: donation * 0.7,
      });
      providerExits.retailCC += donation * 0.7;
      providerExits.save();
    }
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
      throw new HttpException(
        {
          success: false,
          message: 'Ticket not found',
        },
        404,
      );
    }

    if (ticketExists.provider.toString() !== user._id.toString()) {
      throw new HttpException(
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
      throw new HttpException(
        {
          success: false,
          message: 'Ticket not found',
        },
        404,
      );
    }
    await this.ticketModel.findByIdAndDelete(id);
  }

  async getDistance(id: string) {
    const ticketExists = await this.ticketModel.findById(id).exec();
    if (!ticketExists) {
      throw new HttpException(
        {
          success: false,
          message: 'Ticket not found',
        },
        404,
      );
    }
    const origin_latitude = ticketExists.depart_location.latitude;
    const origin_longitude = ticketExists.depart_location.longitude;

    const destination_latitude = ticketExists.arrive_location.latitude;
    const destination_longitude = ticketExists.arrive_location.longitude;
    if (
      origin_latitude == destination_latitude &&
      origin_longitude == destination_longitude
    ) {
      return 0;
    } else {
      const radlat1 = (Math.PI * origin_latitude) / 180;
      const radlat2 = (Math.PI * destination_latitude) / 180;
      const theta = origin_longitude - destination_longitude;
      const radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      const unit = 'K';
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      return dist;
    }
  }
}
