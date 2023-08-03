import { Injectable, HttpException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOneByEmail(email: string): Promise<UserDocument> {
    const userExists = await this.userModel
      .findOne({ email })
      .select('-__v -password')
      .exec();
    if (!userExists) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
        },
        404,
      );
    }

    return userExists;
  }

  async findOneById(id: string): Promise<UserDocument> {
    const userExists = await this.userModel
      .findById(id)
      .select('-__v -password')
      .exec();

    if (!userExists) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
        },
        404,
      );
    }

    return userExists;
  }

  async findOneByUsername(username: string): Promise<UserDocument> {
    const userExists = await this.userModel
      .findOne({ username })
      .select('-__v -password')
      .exec();
    if (!userExists) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
        },
        404,
      );
    }

    return userExists;
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().select('-__v -password').exec();
  }
}
