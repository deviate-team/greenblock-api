import { Injectable, HttpException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { AddMoneyDto } from '@/users/dto/add-money.dto';
import { MoneyType } from '@/common/enums/money-type.enum';
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

  async addMoney(id: string, addMoneyDto: AddMoneyDto) {
    const moneyType = addMoneyDto.option;
    const quantity = addMoneyDto.quantity;
    const money_enum = Object.values(MoneyType);
    if(!money_enum.includes(moneyType as String as unknown as MoneyType)){
      throw new HttpException(
        {
          success: false,
          message: 'Money type not found',
        },
        400,
      );

    }
    if(quantity < 0){
      throw new HttpException(
        {
          success: false,
          message: 'Quantity must be positive',
        },
        400,
      );
    }
    const userExists = await this.findOneById(id);
    if (!userExists) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
        },
        404,
      );
    }
    if (moneyType === 'carbonCredit') {
      userExists.carbonCredit += quantity;
    }
    if (moneyType === 'money') {
      userExists.money += quantity;
    }
    if (moneyType === 'retailCC') {
      userExists.retailCC += quantity;
    }
    
    userExists.save();
    //console.log(userExists);
    return userExists;
  }

}


