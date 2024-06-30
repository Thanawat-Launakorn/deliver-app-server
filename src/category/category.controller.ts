import {
  Get,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { Role } from 'src/auth/helpers/role';
import { RolesGuard } from 'src/guards/roles.guard';
import { CategoryService } from './category.service';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  // create cagetory ===> 🍔
  @Post('create')
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/category',
        filename: (_, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async create(
    @Res() res: Response,
    @UploadedFile() image: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const filePath = `${process.env.ENDPOINT}uploads/category/${image.filename}`;
    const response = await this.categoryService.create({
      image: filePath,
      ...createCategoryDto,
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
    return await this.categoryService.findAll();
  }
  // detail category ===> 🍔
  @Get('detail/:id')
  @Roles([Role.ADMIN, Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(+id);
  }

  @Patch('update/:id')
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/category',
        filename: (req, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    // Fetch the current category to get the existing image path
    const categoryTarget = await this.categoryService.findOne(+id);
    // Check if categoryTarget exists
    if (!categoryTarget) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Category not found',
        response_status: HttpStatus.NOT_FOUND,
      });
    }

    // Initialize filePath with the existing image path
    let filePath: string = categoryTarget.image;

    // If a new image is provided, update the filePath
    if (image) {
      filePath = `${process.env.ENDPOINT}uploads/category/${image.filename}`;

      // Optional: Delete the old image file from the server
      if (categoryTarget.image && categoryTarget.image !== filePath) {
        const oldFilePath = categoryTarget.image.replace(
          `${process.env.ENDPOINT}`,
          '',
        );
        fs.unlink(`./${oldFilePath}`, () => {});
      }
    } else {
      console.log('Image is undefined, keeping existing image path');
    }

    // Perform the update
    const response = await this.categoryService.update(+id, {
      image: filePath,
      category: updateCategoryDto.category,
      description: updateCategoryDto.description,
    });

    return res.status(HttpStatus.OK).json({
      response,
      response_status: HttpStatus.OK,
      message: 'Category updated successfully',
    });
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('delete/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const categoryTarget = await this.categoryService.findOne(+id);

      if (!categoryTarget) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Category not found.',
          response_status: res.statusCode,
        });
      }

      const filePath = categoryTarget.image;
      const fullFilePath = join(
        process.cwd(),
        'uploads/category',
        filePath.split('/').pop(),
      );

      if (filePath && fs.existsSync(fullFilePath)) {
        fs.unlinkSync(fullFilePath);
        const response = await this.categoryService.remove(+id);
        return res.status(HttpStatus.OK).json({
          response,
          response_status: res.statusCode,
        });
      }
    } catch (err) {
      console.error(`Error removing category or file: ${err}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred while deleting the category',
        error: err.message,
        response_status: res.statusCode,
      });
    }
  }
}
