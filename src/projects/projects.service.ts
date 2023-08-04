import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './schemas/project.schema';
import { Model } from 'mongoose';
import { BuyProjectDto } from './dto/buy-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Imember } from '@/common/interfaces/member.interface';
import { HttpException } from '@nestjs/common';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
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

  async buy(buyProjectDto: BuyProjectDto, user) {
    const project = await this.projectModel.findById(buyProjectDto.id).exec();
    if (!project) {
      throw new Error('project not found');
    }
    const maximum: number = project.maximum;

    if (project.amount + buyProjectDto.amount > maximum) {
      throw new Error('maximum amount exceeded');
    }

    const isIDinMember = await this.projectModel
      .findOne({ _id: project.id, 'member.user': user._id })
      .exec();
    if (isIDinMember == null) {
      const now = new Date();
      const updateMember = await this.projectModel.findOneAndUpdate(
        { _id: project.id },
        {
          $push: {
            member: {
              user: user._id,
              amount: buyProjectDto.amount,
              lastbuy: now.toLocaleDateString(),
              percentage: 0,
            },
          },
        },
      );
    } else {
      const now = new Date();
      const currentAmount = project.member.find((m) =>
        m.user.equals(user._id),
      ).amount;

      const updatedAmount = currentAmount + buyProjectDto.amount;
      const updatedLastBuy = now.toLocaleDateString(); // Set the new value for lastbuy here
      const updatedPercentage = (updatedAmount / maximum) * 100; // Set the new value for percentage here

      const updateMember = await this.projectModel.findOneAndUpdate(
        { _id: project.id, 'member.user': user._id },
        {
          $set: {
            'member.$.amount': updatedAmount,
            'member.$.lastbuy': updatedLastBuy,
            'member.$.percentage': updatedPercentage,
          },
        },
        { new: true },
      );
      console.log(updateMember);
    }
  }

  async findOne(id: string) {
    const projectExits = await this.projectModel.findById(id).exec();
    if (projectExits) {
      return projectExits;
    }
  }

  async remove(id: string) {
    //todo
    return await this.projectModel.findByIdAndDelete(id).exec();
  }
}
