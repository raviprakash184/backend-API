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
import { SubCategoriesService } from './subcategorie.service';
import { CreateSubCategoryDto } from './dto/create-subcategorie.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategorie.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';
@ApiTags('SubCategories')
@Controller('subcategories')
export class SubCategoriesController {
  constructor(private readonly service: SubCategoriesService) {}

  @Put('arrange-order')
  @ApiOperation({ summary: 'Update subcategory order' })
  @ApiResponse({ status: 200, description: 'Subcategory order updated' })
  async updateOrder(@Body('order') order: { _id: string; displayOrder: number }[]) {
    try {
      await this.service.updateOrder(order);
      return { statusCode: 200, message: 'Subcategory order updated successfully' };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a subcategory' })
  @ApiResponse({ status: 201, description: 'Subcategory created successfully' })
  @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Milk, Curd & Paneer' },
          category: { type: 'string', example: 'Grocery category id' },
          description: { type: 'string', example: 'Dairy products' },
          image_url: { type: 'array', items: { type: 'string', format: 'binary' } },
          isActive: { type: 'boolean', example: true },
          displayOrder: { type: 'integer', example: 1 },
          slug: { type: 'string', example: 'milk-curd-paneer' },
          icon: { type: 'string', example: 'milk-icon.png' },
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
      @Body() dto: CreateSubCategoryDto,
      @UploadedFiles() files?: MulterFile[]
  ) {
    try {
      if (files && files.length > 0) {
        dto.image_url = files.map(file => `/uploads/${file.filename}`);
      }
      const subcategory = await this.service.create(dto);
      return { statusCode: 201, message: 'Subcategory created successfully', data: subcategory };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all subcategories (pagination/search optional)' })
  @ApiResponse({ status: 200, description: 'List of subcategories' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page for pagination (optional)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name (optional)' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    try {
      const result = await this.service.findAll({ page, limit, search });
      return { statusCode: 200, message: 'Subcategories fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subcategory by ID' })
  @ApiResponse({ status: 200, description: 'Subcategory found' })
  async findOne(@Param('id') id: string) {
    try {
      const subcategory = await this.service.findOne(id);
      return { statusCode: 200, message: 'Subcategory fetched successfully', data: subcategory };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Subcategory not found' };
    }
  }

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Get subcategories by category ID' })
  @ApiResponse({ status: 200, description: 'Subcategories found' })
  async findByCategory(@Param('categoryId') categoryId: string) {
    try {
      const result = await this.service.findByCategoryId(categoryId);
      return { statusCode: 200, message: 'Subcategories by category fetched successfully', data: result };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Subcategories not found' };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update subcategory by ID' })
  @ApiResponse({ status: 200, description: 'Subcategory updated' })
  @ApiConsumes('multipart/form-data')
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Milk, Curd & Paneer' },
          category: { type: 'string', example: 'Grocery category id' },
          description: { type: 'string', example: 'Dairy products' },
          image_url: { type: 'array', items: { type: 'string', format: 'binary' } },
          isActive: { type: 'boolean', example: true },
          displayOrder: { type: 'integer', example: 1 },
          slug: { type: 'string', example: 'milk-curd-paneer' },
          icon: { type: 'string', example: 'milk-icon.png' },
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
  async update(
      @Param('id') id: string,
      @Body() dto: UpdateSubCategoryDto,
      @UploadedFiles() files?: MulterFile[]
  ) {
    try {
      if (files && files.length > 0) {
        dto.image_url = files.map(file => `/uploads/${file.filename}`);
      }
      const subcategory = await this.service.update(id, dto);
      return { statusCode: 200, message: 'Subcategory updated successfully', data: subcategory };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Subcategory not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete subcategory by ID' })
  @ApiResponse({ status: 200, description: 'Subcategory deleted' })
  async remove(@Param('id') id: string) {
    try {
      await this.service.remove(id);
      return { statusCode: 200, message: 'Subcategory deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Subcategory not found' };
    }
  }
}