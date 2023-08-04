import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './schemas/project.schema';
import { Model } from 'mongoose';
import { BuyProjectDto } from './dto/buy-project.dto';
import {InjectModel} from "@nestjs/mongoose";
import { Imember } from '@/common/interfaces/member.interface';
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


  async buy(buyProjectDto:BuyProjectDto,user) {
    const project = await this.projectModel.findById(buyProjectDto.id).exec();
    
    const maximum = project.maximum;

    if (project.amount + buyProjectDto.amount > project.maximum) {
      throw new Error('maximum amount exceeded');
    }else{
      const customer = await project.member.find((member) => {
        return member.user == user._id;
      });
      if (customer) {
        customer.amount += buyProjectDto.amount;
      } else {
        let to_add:Imember = {
          user: user._id,
          amount: buyProjectDto.amount,
          lastbuy: Date.now() as unknown as Date,
          percentage: 0,
        } 
        // project.member.push({
          
        // });
      project.amount += buyProjectDto.amount;
      project.save();
    }


    project.member.push(user._id);
    await project.save();
  }
  }

  async findMember(id: string) {

  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
