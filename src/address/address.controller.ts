import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/helpers/role';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Response } from 'express';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('create')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Res() res: Response,
  ) {
    const response = await this.addressService.create(createAddressDto);
    return res.status(HttpStatus.CREATED).json({
      response,
      response_status: res.statusCode,
    });
  }

  @Get('all')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    return await this.addressService.findAll();
  }

  @Get('detail/:id')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    return await this.addressService.findOne(+id);
  }

  @Get('user/:id')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAddressOne(@Param('id') id: number) {
    return await this.addressService.findAddressOne(id);
  }

  @Patch('update/:id')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return await this.addressService.update(+id, updateAddressDto);
  }

  @Delete('delete/:id')
  @Roles([Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return await this.addressService.remove(+id);
  }
}
