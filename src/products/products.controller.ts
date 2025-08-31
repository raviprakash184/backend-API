import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { File as MulterFile } from 'multer';
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':categoryId/:subCategoryId')
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiParam({ name: 'subCategoryId', description: 'Sub-Category ID' })
 @ApiBody({ type: CreateProductDto })
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
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Body() dto: CreateProductDto,
    @UploadedFiles() files?: MulterFile[]
  ) {
    try {
      if (files && files.length > 0) {
        dto.image_url = files.map(file => `/uploads/${file.filename}`);
      }
      const product = await this.productsService.create(categoryId, subCategoryId, dto);
      return { statusCode: 201, message: 'Product created successfully', data: product };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Put(':id/:categoryId/:subCategoryId')
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Product ID' })
  // @ApiParam({ name: 'categoryId', description: 'Category ID' })
  // @ApiParam({ name: 'subCategoryId', description: 'Sub-Category ID' })
 @ApiBody({ type: CreateProductDto })
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
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files?: MulterFile[]
  ) {
    try {
      if (files && files.length > 0) {
        dto.image_url = files.map(file => `/uploads/${file.filename}`);
      }
      const product = await this.productsService.update(id, dto);
      return { statusCode: 200, message: 'Product updated successfully', data: product };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Product not found' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all products (pagination/search optional)' })
  @ApiResponse({ status: 200, description: 'Return all products' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page for pagination (optional)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name (optional)' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    try {
      const result = await this.productsService.findAll(page, limit, search);
      return { statusCode: 200, message: 'Products fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Return product by id' })
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      return { statusCode: 200, message: 'Product fetched successfully', data: product };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Product not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  async remove(@Param('id') id: string) {
    try {
      await this.productsService.remove(id);
      return { statusCode: 200, message: 'Product deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Product not found' };
    }
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category ID' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    try {
      const result = await this.productsService.getProductsByCategory(categoryId, page, limit, search);
      return { statusCode: 200, message: 'Products by category fetched successfully', data: result };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Products not found' };
    }
  }

  @Get('sub-category/:subCategoryId')
  @ApiOperation({ summary: 'Get products by sub-category ID' })
  @ApiParam({ name: 'subCategoryId', description: 'Sub-Category ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getProductsBySubCategory(
    @Param('subCategoryId') subCategoryId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    try {
      const result = await this.productsService.getProductsBySubCategory(subCategoryId, page, limit, search);
      return { statusCode: 200, message: 'Products by sub-category fetched successfully', data: result };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Products not found' };
    }
  }
}