import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferDocument } from './schemas/offer.schema';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
// import { Offer } from './entities/offer.entity';
import { Offer } from './schemas/offer.schema';
import { BuyCarbonDto } from './dto/buy-carbon.dto';
import { Project, ProjectDocument } from '@/projects/schemas/project.schema';
import { ProjectsService } from '@/projects/projects.service';
import { Inject } from '@nestjs/common';
@Injectable()
export class OffersService {
  // @Inject(ProjectsService)
  // private readonly projectsService: ProjectsService;

  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
    //@InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    
  ) {}


  async create(createOfferDto: CreateOfferDto, user) {
    return await this.offerModel.create({
      ...createOfferDto,
      owner: user._id,
    });
  }

  async findAll() {
    return await this.offerModel.find({});
  }
  

  async buyCarbon(buyCarbonDto:BuyCarbonDto, user) {
    const offer = await this.offerModel.findById(buyCarbonDto.id);
    if (offer.available < buyCarbonDto.amount) {
      throw new Error('Not enough carbon available');
    }
    // const project = await this.projectsService.findOne(offer.project_id);
    
    offer.available -= buyCarbonDto.amount;
    offer.save();

    // return await this.offerModel.create({
    //   ...buyCarbonDto,
    //   owner: user._id,
    // });


  }

  async findOne(id: string) {
    return await this.offerModel.findById(id);
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  remove(id: number) {
    return `This action removes a #${id} offer`;
  }
}
