import { Injectable } from '@nestjs/common';
import { CreateOffsetDto } from './dto/create-offset.dto';
import { UpdateOffsetDto } from './dto/update-offset.dto';
import { Offset, OffsetDocument } from './schemas/offset.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OffsetService {
  constructor(
    @InjectModel(Offset.name) private OffsetModel: Model<OffsetDocument>,
  ) {}

  async create(createOffsetDto: CreateOffsetDto) {
    return await this.OffsetModel.create(createOffsetDto);
  }

  findAll() {
    return `This action returns all Offset`;
  }

  findOne(id: number) {
    return `This action returns a #${id} Offset`;
  }

  update(id: number, updateOffsetDto: UpdateOffsetDto) {
    return `This action updates a #${id} Offset`;
  }

  remove(id: number) {
    return `This action removes a #${id} Offset`;
  }
}
