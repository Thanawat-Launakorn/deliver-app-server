import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { expiresIn } from './helpers/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // ป้องกัน route โดย LocalAuthGuard
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.login(req.user);
    const { role, userId } = req.user as any;
    return res.status(HttpStatus.OK).json({
      expires_in: expiresIn,
      response_status: res.statusCode,
      access_token: user,
      role,
      userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return req.user;
  }
}
