import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/helpers/role';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Response } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
    const response = await this.orderService.create(createOrderDto);
    return res.status(HttpStatus.CREATED).json({
      response,
      response_status: res.statusCode,
    });
  }

  @Get('all')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Res() res: Response) {
    const response = await this.orderService.findAll();
    return res.status(HttpStatus.OK).json({
      response,
      response_status: res.statusCode,
    });
  }

  @Get('all/orderItem')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOrderAll(@Res() res: Response) {
    const response = await this.orderService.findOrderAll();
    return res.status(HttpStatus.OK).json({
      response,
      response_status: res.statusCode,
    })
  }

  @Get('user/:id')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findUserOrder(@Param('userId') userId: number, @Res() res: Response) {
    const response = await this.orderService.findOrderUser(userId);
    return res.status(HttpStatus.OK).json({
      response,
      response_status: res.statusCode,
    });
  }

  @Get('detail/:id')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const response = await this.orderService.findOne(id);
    return res.status(HttpStatus.OK).json({
      response,
      response_status: res.statusCode,
    });
  }

  @Delete('delete/:id')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: number, @Res() res: Response) {
    const response = await this.orderService.remove(id);
    return res.status(HttpStatus.OK).json({
      response,
      response_status: res.statusCode,
    });
  }
}
