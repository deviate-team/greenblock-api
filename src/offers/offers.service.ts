import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferDocument } from './schemas/offer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Offer } from './entities/offer.entity';
import { Offer } from './schemas/offer.schema';
import { BuyCarbonDto } from './dto/buy-carbon.dto';
import { Project, ProjectDocument } from '@/projects/schemas/project.schema';
import { ProjectsService } from '@/projects/projects.service';
import { Inject } from '@nestjs/common';
import { TransactionsService } from '@/transactions/transactions.service';
import { User, UserDocument } from '@/users/schemas/user.schema';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>, 
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private readonly transactionService: TransactionsService,
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

  async buyCarbon(id:string,buyCarbonDto: BuyCarbonDto, user) {
    const offer = await this.offerModel.findById(id);
    if (offer.available < buyCarbonDto.amount) {
      throw new Error('Not enough carbon available');
    }
    const currentUser = await this.userModel.findById(user._id).exec();
    if (currentUser.money < buyCarbonDto.amount * offer.price_per_kg) {
      throw new Error('Not enough money');
    }
    if(buyCarbonDto.amount > offer.available) {
      throw new Error('Not enough carbon credit');
    }

    // share money
    const project = await this.projectModel.findById(offer.project_id).exec();
    if(project.shares_holders.length == 0) {
      //No share Holder give all to owener
      const owner = await this.userModel.findById(project.owner).exec();
      owner.money += buyCarbonDto.amount * offer.price_per_kg;
    }else{
      let all_money:number  = 50;
      for (const member of project.shares_holders) {
        const user = await this.userModel.findById(member.user).exec();
        user.money += buyCarbonDto.amount * (offer.price_per_kg * member.percentage / 100);
        all_money -= buyCarbonDto.amount * (offer.price_per_kg * member.percentage / 100);
        
      }
    }

    currentUser.carbonCredit += buyCarbonDto.amount;
    currentUser.money -= buyCarbonDto.amount * offer.price_per_kg;
    offer.available -= buyCarbonDto.amount;
    offer.save();
    currentUser.save();
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
