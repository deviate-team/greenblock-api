import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { IJwtPayload } from '../interfaces/jwt.interface';

import { User } from '@/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const userExists = await this.userModel
      .findOne({ _id: payload.sub })
      .select('-password')
      .exec();

    if (!userExists) {
      throw new UnauthorizedException();
    }

    return userExists;
  }
}
