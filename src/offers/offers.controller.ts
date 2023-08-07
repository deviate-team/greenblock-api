import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { Role } from '@/common/enums/role.enum';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { BuyCarbonDto } from './dto/buy-carbon.dto';
@ApiTags('Offers')
@ApiBearerAuth()
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.Provider, Role.Admin)
  create(@Body() createOfferDto: CreateOfferDto, @GetUser() user) {
    return this.offersService.create(createOfferDto, user);
  }

  @Patch(':id/buy')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.User, Role.Provider, Role.Admin)
  buyCarbon(
  @Param('id') id: string,
  @Body() buyCarbonDto: BuyCarbonDto,
  @GetUser() user) 
  {
    return this.offersService.buyCarbon(id,buyCarbonDto, user);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(+id, updateOfferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offersService.remove(+id);
  }
}
