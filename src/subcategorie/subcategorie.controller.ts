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
import { SubCategoriesService } from './subcategorie.service';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';
@ApiTags('SubCategories')
@Controller('subcategories')
export class SubCategoriesController {
  constructor(private readonly service: SubCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a subcategory' })
  @ApiResponse({ status: 201, description: 'Subcategory created successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Milk, Curd & Paneer' },
        category: { type: 'string', example: 'Grocery id ' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } }
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
    @Body() dto: CreateSubCategoryDto,
    @UploadedFiles() files?: MulterFile[]
  ) {
    if (files && files.length > 0) {
      dto.image_url = files.map(file => `/uploads/${file.filename}`);
    }
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subcategories' })
  @ApiResponse({ status: 200, description: 'List of subcategories' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subcategory by ID' })
  @ApiResponse({ status: 200, description: 'Subcategory found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Get subcategories by category ID' })
  @ApiResponse({ status: 200, description: 'Subcategories found' })
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.service.findByCategoryId(categoryId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update subcategory by ID' })
  @ApiResponse({ status: 200, description: 'Subcategory updated' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Grocery' },
        category: { type: 'string', example: 'Milk, Curd & Paneer' },
        images: { type: 'array', items: { type: 'string', format: 'binary' } }
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
    @Body() dto: UpdateSubCategoryDto,
    @UploadedFiles() files?: MulterFile[]
  ) {
    if (files && files.length > 0) {
      dto.image_url = files.map(file => `/uploads/${file.filename}`);
    }
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete subcategory by ID' })
  @ApiResponse({ status: 200, description: 'Subcategory deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}