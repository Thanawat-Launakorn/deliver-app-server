import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }
  // validateUser ตรวจสอบ ว่ามี user คนนี่ไหม
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

// response_status: HttpStatus.OK,
// response: {
//   data: {
//     errorDetails: {
//       errorDesc_TH: 'อีเมลล์หรือรหัสผ่านไม่ถูกต้อง',
//       errorDesc_EN: 'email or password not correct',
//     },
//   },
// },
