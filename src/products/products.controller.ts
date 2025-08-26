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
    if (files && files.length > 0) {
      dto.image_url = files.map(file => `/uploads/${file.filename}`);
    }
    // dto.category = categoryId;
    // dto.subCategory = subCategoryId;
    return this.productsService.create(categoryId,subCategoryId,dto);
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
    // @Param('categoryId') categoryId: string,
    // @Param('subCategoryId') subCategoryId: string,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() files?: MulterFile[]
  ) {
    if (files && files.length > 0) {
      dto.image_url = files.map(file => `/uploads/${file.filename}`);
    }
    // dto.category = categoryId;
    // dto.subCategory = subCategoryId;
    return this.productsService.update(id,dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    return this.productsService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Return product by id' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category ID' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  getProductsByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    return this.productsService.getProductsByCategory(categoryId, page, limit, search);
  }

  @Get('sub-category/:subCategoryId')
  @ApiOperation({ summary: 'Get products by sub-category ID' })
  @ApiParam({ name: 'subCategoryId', description: 'Sub-Category ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  getProductsBySubCategory(
    @Param('subCategoryId') subCategoryId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    return this.productsService.getProductsBySubCategory(subCategoryId, page, limit, search);
  }
}