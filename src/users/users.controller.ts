import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { GetUser } from '@/common/decorators/get-user.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';

import { UsersService } from './users.service';
import { Patch, Param, Body } from '@nestjs/common';
import { AddMoneyDto } from './dto/add-money.dto';
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @UseGuards(RolesGuard)
  @Roles(Role.Provider, Role.User, Role.Admin)
  async getProfile(@GetUser() currentUser) {
    const user = await this.usersService.findOneById(currentUser._id);
    return {
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    };
  }


  @Patch(':id/add-money')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.User, Role.Provider, Role.Admin) //for dev
  async addMoney(
  @Param('id') id: string,
  @Body() addMoneyDto: AddMoneyDto,
  @GetUser() user) 
  {
    const addMoney = await this.usersService.addMoney(id,addMoneyDto, user);
    return {
      message: 'success',
      data: addMoney
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findOne(id: string) {
    const user = await this.usersService.findOneById(id);
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Get('/username/:username')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async findOneByUsername(username: string) {
    const user = await this.usersService.findOneByUsername(username);
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Get('/email/:email')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async findOneByEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }
}
