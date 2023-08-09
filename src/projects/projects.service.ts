import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';

import { CreateProjectDto } from './dto/create-project.dto';
import { JoinProjectDto } from './dto/join-project.dto';
import { TransactionsService } from '@/transactions/transactions.service';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { Offer, OfferDocument } from '@/offers/schemas/offer.schema';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
    private readonly transactionService: TransactionsService,
  ) {}

  async create(createProjectDto: CreateProjectDto, user) {
    return await this.projectModel.create({
      ...createProjectDto,
      owner: user._id,
    });
  }

  async findAll() {
    return await this.projectModel.find().select('-__v').exec();
  }

  async join(id: string, buyProjectDto: JoinProjectDto, user) {
    const { amount } = buyProjectDto;
    if (amount < 0) {
      throw new HttpException(
        {
          success: false,
          message: 'Amount must be greater than 0',
        },
        400,
      );
    }
    const projectExists = await this.projectModel.findById(id).exec();
    if (!projectExists) {
      throw new HttpException(
        {
          success: false,
          message: 'Project not found',
        },
        404,
      );
    }

    const maximum_shares = projectExists.max_shares;
    const currentUser = await this.userModel.findById(user._id).exec();

    if (currentUser.money < amount) {
      throw new HttpException(
        {
          success: false,
          message: 'Insufficient balance',
        },
        400,
      );
    }

    if (amount + projectExists.balance > maximum_shares) {
      throw new HttpException(
        {
          success: false,
          message: 'Amount exceeds maximum shares',
        },
        400,
      );
    }

    // if user is not in member, add user to member also if user is in member, update the amount
    const finduser = await this.projectModel.findOne({
      _id: id,
      'shares_holders.user': user._id,
    });
    if (finduser != undefined) {
      await this.projectModel.findOneAndUpdate(
        {
          _id: id,
          'shares_holders.user': user._id,
        },
        {
          $inc: {
            'shares_holders.$.shares': amount,
          },
        },
        {
          new: true,
        },
      );
      await this.projectModel.findOneAndUpdate(
        {
          _id: id,
          'shares_holders.user': user._id,
        },
        {
          $set: {
            'shares_holders.$.percentage': amount / maximum_shares,
            'shares_holders.$.last_paymet': new Date(),
          },
        },
        {
          new: true,
        },
      );
    } else {
      projectExists.shares_holders.push({
        user: user._id,
        shares: amount,
        percentage: (amount / maximum_shares) * 100,
        last_payment: new Date(),
      });
    }
    projectExists.isNew = false;
    projectExists.balance += amount;
    currentUser.money -= amount;
    await currentUser.save();
    await projectExists.save();

    if (projectExists.balance == maximum_shares) {
      for (let i = 0; i < projectExists.shares_holders.length; i++) {
        const user = await this.userModel
          .findById(projectExists.shares_holders[i].user)
          .exec();

        user.retailCC +=
          (projectExists.shares_holders[i].percentage *
            projectExists.estimated_outcome) /
          100;
        await user.save();

        await this.transactionService.create({
          type: 'project',
          user: user._id,
          ticket: id,
          quantity:
            projectExists.shares_holders[i].percentage *
            projectExists.estimated_outcome,
          description: `Get ${
            (projectExists.shares_holders[i].percentage *
              projectExists.estimated_outcome) /
            100
          } retailCC(s)`,
          status: 'success',
          total_price:
            projectExists.shares_holders[i].percentage *
            projectExists.estimated_outcome,
        });
      }
    }

    await this.transactionService.create({
      type: 'project',
      user: user._id,
      ticket: id,
      quantity: amount,
      description: `Funding ${amount} retailCC(s)`,
      status: 'success',
      total_price: amount,
    });

    // transaction of provider
    await this.transactionService.create({
      type: 'project',
      user: projectExists.owner._id,
      ticket: id,
      quantity: amount,
      description: `Get ${amount} retailCC(s)`,
      status: 'success',
      total_price: amount,
    });
    return {
      ...projectExists.toJSON(),
    };
  }

  async findOne(id: string) {
    const projectExists = await this.projectModel
      .findById(id)
      .populate('owner', '-__v')
      .populate('shares_holders.user', '-__v')
      .select('-__v')
      .exec();
    if (!projectExists) {
      throw new HttpException(
        {
          success: false,
          message: 'Project not found',
        },
        404,
      );
    }

    return projectExists;
  }

  async remove(id: string) {
    const projectExists = await this.projectModel.findById(id).exec();
    if (!projectExists) {
      throw new HttpException(
        {
          success: false,
          message: 'Project not found',
        },
        404,
      );
    }

    return await this.projectModel.findByIdAndDelete(id).exec();
  }
}
