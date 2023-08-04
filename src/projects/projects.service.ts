import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';

import { CreateProjectDto } from './dto/create-project.dto';
import { JoinProjectDto } from './dto/join-project.dto';

import { User, UserDocument } from '@/users/schemas/user.schema';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto, user) {
    return await this.projectModel.create({
      ...createProjectDto,
      owner: user._id,
    });
  }

  async findAll() {
    return await this.projectModel.find().exec();
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
    const userExists = projectExists.shares_holders.find(
      (member) => member.user == user._id,
    );

    if (userExists) {
      const index = projectExists.shares_holders.findIndex(
        (member) => member.user == user._id,
      );
      projectExists.shares_holders[index].shares += amount;
      projectExists.shares_holders[index].percentage =
        (projectExists.shares_holders[index].shares / maximum_shares) * 100;
      projectExists.shares_holders[index].last_payment = new Date();
    } else {
      projectExists.shares_holders.push({
        user: user._id,
        shares: amount,
        percentage: (amount / maximum_shares) * 100,
        last_payment: new Date(),
      });
    }

    projectExists.balance += amount;
    currentUser.money -= amount;
    await currentUser.save();
    await projectExists.save();
    return projectExists;
  }

  async findOne(id: string) {
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
