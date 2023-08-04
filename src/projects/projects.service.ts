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
    const maximum = project.maximum;

    if (project.amount + buyProjectDto.amount > maximum) {
      throw new Error('maximum amount exceeded');
    } else {
      const customer = await project.member.find((member) => {
        if (member.user == user._id) {
          return member;
        }
      });

      if (customer) {
        const update = await customer.findOneAndUpdate(
          { user: user._id },
          { amount: customer.amount + buyProjectDto.amount },
        );
        console.log(update);
        // customer.amount += buyProjectDto.amount;
        // customer.percentage = (customer.amount / maximum)*100;
        // customer.lastbuy = Date.now() as unknown as Date;
      } else {
        project.member.push({
          user: user._id,
          amount: buyProjectDto.amount,
          lastbuy: Date.now() as unknown as Date,
          percentage: 0,
        } as Imember);

        project.amount += buyProjectDto.amount;
        //project.save();
        //this.projectModel.findByIdAndUpdate(project._id,project).exec();
      }

      project.member.push(user._id);
      await project.save();
    }
  }

  async findMember(id: string) {}

  async findOne(id: string) {
    const projectExits = await this.projectModel.findById(id).exec();
    if (projectExits) {
      return projectExits;
    }
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  async remove(id: string) {
    //todo
    return await this.projectModel.findByIdAndDelete(id).exec();
  }
}
