import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OffsetService } from './offset.service';
import { CreateOffsetDto } from './dto/create-offset.dto';
import { UpdateOffsetDto } from './dto/update-offset.dto';

@Controller('Offset')
export class OffsetController {
  constructor(private readonly OffsetService: OffsetService) {}

  @Post()
  create(@Body() createOffsetDto: CreateOffsetDto) {
    return this.OffsetService.create(createOffsetDto);
  }

  @Get()
  findAll() {
    return this.OffsetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.OffsetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOffsetDto: UpdateOffsetDto) {
    return this.OffsetService.update(+id, updateOffsetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.OffsetService.remove(+id);
  }
}
