import { Injectable, HttpException } from '@nestjs/common';
import { User, UserDocument } from '@/users/schemas/user.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtService } from '@nestjs/jwt';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private generateToken({
    userId,
    role,
  }: {
    userId: string;
    role: string;
  }): string {
    const payload = { sub: userId, role };

    return this.jwtService.sign(payload);
  }

  async signIn(signInDto: SignInDto): Promise<string> {
    const { email, password } = signInDto;

    const userExists = await this.userModel.findOne({ email }).exec();
    if (!userExists) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
        },
        404,
      );
    }

    const passwordMatch = await bcrypt.compareSync(
      password,
      userExists.password,
    );
    if (!passwordMatch) {
      throw new HttpException(
        {
          success: false,
          message: 'Invalid credentials',
        },
        401,
      );
    }

    return await this.generateToken({
      userId: userExists._id,
      role: userExists.role,
    });
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, username, password, confirmPassword } = signUpDto;
    if (password !== confirmPassword) {
      throw new HttpException(
        {
          success: false,
          message: 'Passwords do not match',
        },
        400,
      );
    }

    const userExists = await this.userModel.find({
      $or: [{ email }, { username }],
    });

    if (userExists.length) {
      throw new HttpException(
        {
          success: false,
          message: 'User already exists',
        },
        409,
      );
    }
    const salt = await bcrypt.genSalt();
    const newUser = await this.userModel.create({
      ...signUpDto,
      password: await bcrypt.hashSync(password, salt),
    });

    console.log(newUser);

    return await this.generateToken({
      userId: newUser._id,
      role: newUser.role,
    });
  }
}
