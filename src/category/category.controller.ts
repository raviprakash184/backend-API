// ...existing imports...
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
  Query,
} from '@nestjs/common';
import { CategoriesService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';
@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  @Put('arrange-order')
  @ApiOperation({ summary: 'Update category order' })
  @ApiResponse({ status: 200, description: 'Category order updated' })
  async updateOrder(@Body('order') order: { _id: string; displayOrder: number }[]) {
    try {
      await this.categoriesService.updateOrder(order);
      return { statusCode: 200, message: 'Category order updated successfully' };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }
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
          description: { type: 'string', example: 'All grocery items' },
          image_url: { type: 'array', items: { type: 'string', format: 'binary' } },
          isActive: { type: 'boolean', example: true },
          displayOrder: { type: 'integer', example: 1 },
          icon: { type: 'string', example: 'grocery-icon.png' },
          meta: { type: 'object', example: { featured: true } },
          createdAt: { type: 'string', example: '2025-08-29T12:00:00Z' },
          updatedAt: { type: 'string', example: '2025-08-29T12:00:00Z' }
        }
      }
    })
    @UseInterceptors(FilesInterceptor('image_url', 10, {
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
    try {
      if (files && files.length > 0) {
        dto.image_url = files.map(file => `/uploads/${file.filename}`);
      }
      if (dto.displayOrder === undefined || dto.displayOrder === null) {
        const count = await this.categoriesService.countCategories();
        dto.displayOrder = count + 1;
      }
      const category = await this.categoriesService.create(dto);
      return { statusCode: 201, message: 'Category created successfully', data: category };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
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
          description: { type: 'string', example: 'Fresh fruits' },
          image_url: { type: 'array', items: { type: 'string', format: 'binary' } },
          isActive: { type: 'boolean', example: true },
          displayOrder: { type: 'integer', example: 2 },
          icon: { type: 'string', example: 'fruits-icon.png' },
          meta: { type: 'object', example: { featured: false } },
          createdAt: { type: 'string', example: '2025-08-29T12:00:00Z' },
          updatedAt: { type: 'string', example: '2025-08-29T12:00:00Z' }
        }
      }
    })
    @UseInterceptors(FilesInterceptor('image_url', 10, {
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
    try {
      if (files && files.length > 0) {
        dto.image_url = files.map(file => `/uploads/${file.filename}`);
      }
      const category = await this.categoriesService.update(id, dto);
      return { statusCode: 200, message: 'Category updated successfully', data: category };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Category not found' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories (pagination/search optional)' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page for pagination (optional)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name (optional)' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    try {
      const result = await this.categoriesService.findAll({ page, limit, search });
      return { statusCode: 200, message: 'Categories fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  async findOne(@Param('id') id: string) {
    try {
      const category = await this.categoriesService.findOne(id);
      return { statusCode: 200, message: 'Category fetched successfully', data: category };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Category not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  async remove(@Param('id') id: string) {
    try {
      await this.categoriesService.remove(id);
      return { statusCode: 200, message: 'Category deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Category not found' };
    }
  }
}
