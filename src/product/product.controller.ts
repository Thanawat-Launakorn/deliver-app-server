import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/auth/helpers/role';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    const response = this.productService.create(createProductDto);
    const message = '';
    return res.status(HttpStatus.OK).json({
      response,
      response_status: res.statusCode,
      message,
    });
  }

  @Get('all')
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
