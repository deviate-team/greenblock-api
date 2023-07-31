import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signIn(createAuthDto) {
    return 'This action adds a new auth';
  }

  signUp(createAuthDto) {
    return 'This action adds a new auth';
  }
}
