import { Injectable, HttpException } from '@nestjs/common';
import { User, UserDocument } from '@/users/schemas/user.schema';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { JwtService } from '@nestjs/jwt';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Role } from '@/common/enums/role.enum';
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
    const { email, username, password, confirmPassword, phoneNumber,role } =
      signUpDto;
    if(role == "admin") {
      throw new HttpException(
        {
          success: false,
          message: 'You can not register as admin',
        },
        400,
      );
    }
    const role_enum = Object.values(Role);
    if(!role_enum.includes(role as String as unknown as Role)) {
      throw new HttpException(
        {
          success: false,
          message: 'Role not found',
        },
        400,
      );
    }

    if (password !== confirmPassword) {
      throw new HttpException(
        {
          success: false,
          message: 'Passwords do not match',
        },
        400,
      );
    }

    if (!phoneNumber) {
      throw new HttpException(
        {
          success: false,
          message: 'Phone number is required',
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
          message: 'Username or email already exists',
        },
        409,
      );
    }
    const salt = await bcrypt.genSalt();
    const newUser = await this.userModel.create({
      ...signUpDto,
      password: await bcrypt.hashSync(password, salt),
    });

    return await this.generateToken({
      userId: newUser._id,
      role: newUser.role,
    });
  }
}
