import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';

@Controller('user')
export class UserConroller {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const response = await this.userService.create(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      response,
      response_status: res.statusCode,
    });
  }

  @Get('all')
  async findAll() {
    return await this.userService.findAll();
  }

  @Delete('delete/:userId')
  async remove(@Param() id: number, @Res() res: Response) {
    const response = await this.userService.remove(id);
    return res.status(HttpStatus.OK).json({
      response,
      response_status: res.statusCode,
    });
  }
}
