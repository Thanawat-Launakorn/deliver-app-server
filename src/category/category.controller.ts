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
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/helpers/role';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlink } from 'fs/promises';

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
        destination: './uploads',
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
    const filePath = `${process.env.ENDPOINT}uploads/${image.filename}`;
    const response = this.categoryService.create({
      image: filePath,
      ...createCategoryDto,
    });
    const message = `create category ${createCategoryDto.category}`;
    return res.status(HttpStatus.OK).json({
      message,
      filePath,
      response,
      response_status: res.statusCode,
    });
  }

  @Get('all')
  @Roles([Role.ADMIN, Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    return this.categoryService.findAll();
  }
  // detail category ===> 🍔
  @Get('detail/:id')
  @Roles([Role.ADMIN, Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch('update/:id')
  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
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
    console.log(categoryTarget)
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
      filePath = `${process.env.ENDPOINT}uploads/${image.filename}`;

      // Optional: Delete the old image file from the server
      if (categoryTarget.image && categoryTarget.image !== filePath) {
        const oldFilePath = categoryTarget.image.replace(
          `${process.env.ENDPOINT}`,
          '',
        );
        await unlink(`./${oldFilePath}`).catch((err) =>
          console.error(`Failed to delete old image: ${err}`),
        );
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
  remove(@Param('id') id: string) {
    console.log('id remove', id);
    return this.categoryService.remove(+id);
  }
}
