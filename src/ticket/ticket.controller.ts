import { Controller,Get,Post,Body,Delete,Put,Param} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from '@/_schema/ticket.schema';
import { Ticket } from '@/_schema/ticket.schema';
@Controller('ticket')
export class TicketController {
    
    constructor(private ticketService: TicketService) {}
    

    @Post()
    async create(@Body() ticket: Ticket): Promise<Ticket> {
        console.log(ticket)
        return await this.ticketService.create(ticket);
        
    }

    @Get()
    async getAll(): Promise<any[]> {
        return await this.ticketService.findAll();
    }

    @Get(':id')
    async getById(id: string): Promise<any[]> {
        return await this.ticketService.findById(id);
    }
    @Put(':id')
    async update(@Param('id') id: string, @Body() ticket: Ticket): Promise<any[]> {
        return await this.ticketService.update(id, ticket);
    }

    @Delete(':id')
    async Delete(id: string): Promise<any[]> {
        return await this.ticketService.delete(id);
    }


    
}
