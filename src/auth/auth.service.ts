import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(signInDto: SignInDto): Promise<any> {
    const { email } = signInDto;
    const user = await this.userService.findOne(email);
    if (user && user.password === signInDto.password) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, userId: user.userId, role: user.role };
    console.log(payload);
    return this.jwtService.sign(payload);
  }
}
