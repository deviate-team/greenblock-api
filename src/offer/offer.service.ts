import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer, OfferDocument } from './schemas/offer.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OfferService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
  ) {}

  async create(createOfferDto: CreateOfferDto) {
    return await this.offerModel.create(createOfferDto);
  }

  findAll() {
    return `This action returns all offer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
