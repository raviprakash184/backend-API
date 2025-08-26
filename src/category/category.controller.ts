// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Put,
//   Delete,
// } from '@nestjs/common';
// import { CategoriesService } from './category.service';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// @ApiTags('Categories')
// @Controller('categories')
// export class CategoriesController {
//   constructor(private readonly categoriesService: CategoriesService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create a new category' })
//   @ApiResponse({ status: 201, description: 'Category created successfully' })
//   create(@Body() dto: CreateCategoryDto) {
//     return this.categoriesService.create(dto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all categories' })
//   @ApiResponse({ status: 200, description: 'List of categories' })
//   findAll() {
//     return this.categoriesService.findAll();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get category by ID' })
//   @ApiResponse({ status: 200, description: 'Category found' })
//   findOne(@Param('id') id: string) {
//     return this.categoriesService.findOne(id);
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Update category by ID' })
//   @ApiResponse({ status: 200, description: 'Category updated' })
//   update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
//     return this.categoriesService.update(id, dto);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete category by ID' })
//   @ApiResponse({ status: 200, description: 'Category deleted' })
//   remove(@Param('id') id: string) {
//     return this.categoriesService.remove(id);
//   }
// }

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Grocery' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
        isActive: { type: 'boolean', example: true }
      }
    }
  })
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async create(
    @Body() dto: CreateCategoryDto,
    @UploadedFiles() files?: MulterFile[]
  ) {
    if (files && files.length > 0) {
      dto.image_url = files.map(file => `/uploads/${file.filename}`);
    }
    return this.categoriesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Fruits' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
        isActive: { type: 'boolean', example: true }
      }
    }
  })
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFiles() files?: MulterFile[]
  ) {
    if (files && files.length > 0) {
      dto.image_url = files.map(file => `/uploads/${file.filename}`);
    }
    return this.categoriesService.update(id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
