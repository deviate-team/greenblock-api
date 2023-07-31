import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signIn(@Body() body: any) {
    return this.authService.signIn(body);
  }

  @Post('signup')
  signUp(@Body() body: any) {
    return this.authService.signUp(body);
  }
}
