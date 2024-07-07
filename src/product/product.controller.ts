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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { Role } from 'src/auth/helpers/role';
import { ProductService } from './product.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/product',
        filename: (_, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async create(
    @Res() res: Response,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const filePath = `${process.env.ENDPOINT}uploads/product/${image.filename}`;
    const response = await this.productService.create({
      image: filePath,
      ...createProductDto,
    });
    return res.status(HttpStatus.CREATED).json({
      response,
      response_status: res.statusCode,
    });
  }

  @Get('all')
  @Roles([Role.ADMIN, Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    return await this.productService.findAll();
  }

  @Get('detail/:id')
  @Roles([Role.ADMIN, Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(+id);
  }

  @Get('category/:id')
  @Roles([Role.ADMIN, Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findCategoryOne(@Param('id') id: string) {
    return await this.productService.findCategoryOne(+id);
  }

  @Patch('update/:id')
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const fileName = `${Date.now()}=${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const productTarget = await this.productService.findOne(+id);

    if (!productTarget) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: `Product ${id} not found`,
        response_status: HttpStatus.NOT_FOUND,
      });
    }

    let filePath: string = productTarget.image;

    if (image) {
      filePath = `${process.env.ENDPOINT}uploads/product/${image.filename}`;

      if (productTarget.image && productTarget.image !== filePath) {
        const oldFilePath = productTarget.image.replace(
          `${process.env.ENDPOINT}`,
          '',
        );
        fs.unlink(`./${oldFilePath}`, () => {});
      }
    }

    const response = await this.productService.update(+id, {
      image: filePath,
      name: updateProductDto.name,
      price: updateProductDto.price,
      description: updateProductDto.description,
    });

    return res.status(HttpStatus.OK).json({
      response,
      response_status: HttpStatus.OK,
      message: 'Product updated successfully',
    });
  }

  @Roles([Role.ADMIN])
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const productTarget = await this.productService.findOne(+id);

      if (!productTarget) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Product not found.',
          response_status: res.statusCode,
        });
      }

      const filePath = productTarget.image;
      const fullFilePath = join(  
        process.cwd(),
        'uploads/product',
        filePath.split('/').pop(),
      );

      console.log('fullfilepath ==>', fullFilePath)

      if (filePath && fs.existsSync(fullFilePath)) {
        fs.unlinkSync(fullFilePath);
        const response = await this.productService.remove(+id);
        return res.status(HttpStatus.OK).json({
          response,
          response_status: res.statusCode,
        });
      }
    } catch (err) {
      console.error(`Error removing product or file: ${err}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while deleting the product',
        error: err.message,
        response_status: res.statusCode,
      });
    }
    return await this.productService.remove(+id);
  }
}
