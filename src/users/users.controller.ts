import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { GetUser } from '@/common/decorators/get-user.decorator';
import { JwtGuard } from '@/common/guards/jwt.guard';

import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  async getProfile(@GetUser() user) {
    return this.usersService.findOneById(user._id);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(id: string) {
    return this.usersService.findOneById(id);
  }
}
