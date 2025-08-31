import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject, forwardRef } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { FoodsService } from './foods.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@ApiTags('Restaurant')
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly foodsService: FoodsService,
  ) {}
  @Get(':id/foods')
  @ApiOperation({ summary: 'Get all foods for a restaurant with pagination, search, and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for food name' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Sort by field, e.g. name,-price' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category ID' })
  getFoodsForRestaurant(
    @Param('id') restaurantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('category') category?: string,
  ) {
    return this.foodsService.findAll({ page, limit, search, sort, restaurant: restaurantId, category });
  }

  @Post()
  @ApiOperation({ summary: 'Create a restaurant' })
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants with pagination, search, filter, and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for restaurant name' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Sort by field, e.g. rating,-name' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category ID' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('category') category?: string,
  ) {
    return this.restaurantsService.findAll({ page, limit, search, sort, category });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant by ID' })
  update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete restaurant by ID' })
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
}
