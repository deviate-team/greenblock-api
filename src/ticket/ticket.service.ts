import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto } from '@/_schema/ticket.schema';
import { Ticket } from '@/_schema/ticket.schema';
@Injectable()
export class TicketService {
    constructor(@InjectModel('tickets') private readonly ticketModel: Model<any>) { }

    async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
        const createdTicket = new this.ticketModel(createTicketDto);
        return await createdTicket.save()
      }

    async findAll(){
        return await this.ticketModel.find({}).exec();
    }
    async findById(id : string) {
        return await this.ticketModel.find({ _id: id }).exec();
    }
    async update(id : string, ticket : Ticket) {
        return await this.ticketModel.findByIdAndUpdate(id, ticket).exec();
    }

    async delete(id : string) {
        return await this.Delete(id).exec();
    }
}
