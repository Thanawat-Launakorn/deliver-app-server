import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(signInDto: SignInDto): Promise<any> {
    const { email } = signInDto;
    const user = await this.userService.findOne(email);
    console.log('user ===>', user);
    if (user && user.password === signInDto.password) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return this.jwtService.sign(payload);
  }
}
