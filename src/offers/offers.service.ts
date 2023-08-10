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
import { TransactionsService } from '@/transactions/transactions.service';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { HttpException } from '@nestjs/common';
@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private readonly transactionService: TransactionsService,
  ) { }

  async create(createOfferDto: CreateOfferDto, user) {
    return await this.offerModel.create({
      ...createOfferDto,
      owner: user._id,
    });
  }

  async findAll() {
    return await this.offerModel.find({});
  }

  async buyCarbon(id: string, buyCarbonDto: BuyCarbonDto, user) {
    // const offer = await this.offerModel.findById(id);
    // if (offer.available < buyCarbonDto.amount) {
    //   throw new Error('Not enough carbon available');
    // }
    // const currentUser = await this.userModel.findById(user._id).exec();
    // if (currentUser.money < buyCarbonDto.amount * offer.price_per_kg) {
    //   throw new Error('Not enough money');
    // }
    // if (buyCarbonDto.amount > offer.available) {
    //   throw new Error('Not enough carbon credit');
    // }

    // const project = await this.projectModel.findById(offer.project_id).exec();

    // const owner = await this.userModel.findById(project.owner).exec();
    // if (project.shares_holders.length == 0) {
    //   //No share Holder give all to owener
    //   owner.money += buyCarbonDto.amount * offer.price_per_kg;
    // } else {
    //   let all_money: number = offer.price_per_kg * buyCarbonDto.amount;
    //   for (const member of project.shares_holders) {
    //     const user = await this.userModel.findById(member.user).exec();
    //     let share_amount: number =
    //       buyCarbonDto.amount *
    //       ((offer.price_per_kg * member.percentage) / 100);
    //     user.money += share_amount;
    //     all_money -= share_amount;
    //     //create per member transaction
    //     // await this.transactionService.create({
    //     //   type: 'share',
    //     //   user: user._id,
    //     //   ticket: id,
    //     //   quantity: buyCarbonDto.amount,
    //     //   description: `Get share from project ${share_amount} Baht`,
    //     //   status: 'success',
    //     //   total_price: share_amount,
    //     // });
    //     user.save();
    //   }
    //   owner.money += all_money;
    //   // await this.transactionService.create({
    //   //   type: 'share',
    //   //   user: owner._id,
    //   //   ticket: id,
    //   //   quantity: buyCarbonDto.amount,
    //   //   description: `Get share from project ${all_money} Baht`,
    //   //   status: 'success',
    //   //   total_price: all_money,
    //   // });
    //   owner.save();
    // }

    // currentUser.carbonCredit += buyCarbonDto.amount;
    // currentUser.money -= buyCarbonDto.amount * offer.price_per_kg;
    // offer.available -= buyCarbonDto.amount;
    // // await this.transactionService.create({
    // //   type: 'carbon',
    // //   user: currentUser._id,
    // //   ticket: id,
    // //   quantity: buyCarbonDto.amount,
    // //   description: `Buy CaronCredit ${buyCarbonDto.amount} ton(s)`,
    // //   status: 'success',
    // //   total_price: buyCarbonDto.amount * offer.price_per_kg,
    // // });
    // offer.save();
    // currentUser.save();
    // return offer;
    return null;
  }

  async findOne(id: string) {
    return await this.offerModel.findById(id);
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return `This action updates a #${id} offer`;
  }

  async remove(id: number) {
    const offerExits = await this.offerModel.findById(id).select('-__v').exec();

    if (!offerExits) {
      throw new HttpException(
        {
          success: false,
          message: 'Offer not found',
        },
        404,
      );
    }
    await this.offerModel.findByIdAndDelete(id);
  }

  //return `This action removes a #${id} offer`;
}
