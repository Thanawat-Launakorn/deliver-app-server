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
        filename: (req, file, cb) => {
          console.log('req ===>', req.body);
          console.log('file ===>', file);
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
    console.log('image ==>', image);

    const filePath = `${process.env.ENDPOINT}uploads/${image.filename}`;
    const response = this.categoryService.create({
      image: filePath,
      ...createCategoryDto,
    });
    const message = `create category ${createCategoryDto.category}`;
    console.log('body createCategory ===> ', createCategoryDto);
    return res.status(HttpStatus.OK).json({
      message,
      filePath,
      response,
      response_status: res.statusCode,
    });
  }

  @Roles([Role.ADMIN, Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all')
  async findAll() {
    return this.categoryService.findAll();
  }

  @Roles([Role.ADMIN, Role.CLIENT])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
