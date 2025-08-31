import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('Review')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  async create(@Body() createReviewDto: CreateReviewDto) {
    try {
      const review = await this.reviewsService.create(createReviewDto);
      return { statusCode: 201, message: 'Review created successfully', data: review };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with pagination, search, sorting, and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for review comment' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Sort by field, e.g. createdAt,-rating' })
  @ApiQuery({ name: 'product', required: false, type: String, description: 'Filter by product ID' })
  @ApiQuery({ name: 'user', required: false, type: String, description: 'Filter by user ID' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('product') product?: string,
    @Query('user') user?: string,
  ) {
    try {
      const result = await this.reviewsService.findAll({ page, limit, search, sort, product, user });
      return { statusCode: 200, message: 'Reviews fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const review = await this.reviewsService.findOne(id);
      return { statusCode: 200, message: 'Review fetched successfully', data: review };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Review not found' };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update review by ID' })
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    try {
      const review = await this.reviewsService.update(id, updateReviewDto);
      return { statusCode: 200, message: 'Review updated successfully', data: review };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Review not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete review by ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.reviewsService.remove(id);
      return { statusCode: 200, message: 'Review deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Review not found' };
    }
  }
}
