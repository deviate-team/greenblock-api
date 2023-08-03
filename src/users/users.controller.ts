import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { GetUser } from '@/common/decorators/get-user.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';

import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Provider, Role.User)
  @UseGuards(RolesGuard)
  @Get('/profile')
  async getProfile(@GetUser() currentUser) {
    const user = await this.usersService.findOneById(currentUser._id);
    return {
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    };
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get(':id')
  async findOne(id: string) {
    const user = await this.usersService.findOneById(id);
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  // Find by username
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('/username/:username')
  async findOneByUsername(username: string) {
    const user = await this.usersService.findOneByUsername(username);
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  // Find by email
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('/email/:email')
  async findOneByEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    return {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    };
  }
}
