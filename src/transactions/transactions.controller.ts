import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { GetUser } from '@/common/decorators/get-user.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';

import { TransactionsService } from './transactions.service';
@Controller('transactions')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findAll() {
    const transactions = await this.transactionsService.findAll();
    return {
      success: true,
      message: 'Transactions fetched successfully',
      data: transactions,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const transaction = await this.transactionsService.findOne(id);

    return {
      success: true,
      message: 'Transaction fetched successfully',
      data: transaction,
    };
  }

  @Get('/list')
  async findAllWithPagination(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @GetUser() user,
  ) {
    const transactions = await this.transactionsService.findAllWithPagination(
      page,
      limit,
      user,
    );

    return {
      success: true,
      message: 'Transactions fetched successfully',
      data: transactions,
    };
  }
}
