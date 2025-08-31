import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@ApiTags('Food')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a food item' })
  async create(@Body() createFoodDto: CreateFoodDto) {
    try {
      const food = await this.foodsService.create(createFoodDto);
      return { statusCode: 201, message: 'Food created successfully', data: food };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all foods with pagination, search, filter, and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page for pagination (optional)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for food name (optional)' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Sort by field, e.g. name,-price (optional)' })
  @ApiQuery({ name: 'restaurant', required: false, type: String, description: 'Filter by restaurant ID (optional)' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category ID (optional)' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('restaurant') restaurant?: string,
    @Query('category') category?: string,
  ) {
    try {
      const result = await this.foodsService.findAll({ page, limit, search, sort, restaurant, category });
      return { statusCode: 200, message: 'Foods fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get food item by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const food = await this.foodsService.findOne(id);
      return { statusCode: 200, message: 'Food fetched successfully', data: food };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Food not found' };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update food item by ID' })
  async update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    try {
      const food = await this.foodsService.update(id, updateFoodDto);
      return { statusCode: 200, message: 'Food updated successfully', data: food };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Food not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete food item by ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.foodsService.remove(id);
      return { statusCode: 200, message: 'Food deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Food not found' };
    }
  }
}
