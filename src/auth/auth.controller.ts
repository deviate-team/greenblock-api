import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() body: SignInDto, @Res() res: Response) {
    const token = await this.authService.signIn(body);
    console.log(token);
    res.setHeader('Authorization', token);

    return res.status(200).json({
      message: 'User logged in successfully',
      token: token,
    });
  }

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    const token = await this.authService.signUp(body);
    console.log(token);
    res.setHeader('Authorization', token);

    return res.status(201).json({
      message: 'User registered successfully',
      token: token,
    });
  }
}
