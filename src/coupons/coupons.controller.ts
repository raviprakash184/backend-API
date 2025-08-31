import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@ApiTags('Coupon')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a coupon' })
  async create(@Body() createCouponDto: CreateCouponDto) {
    try {
      const coupon = await this.couponsService.create(createCouponDto);
      return { statusCode: 201, message: 'Coupon created successfully', data: coupon };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all coupons with pagination, search, and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for coupon code or description' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Sort by field, e.g. startDate,-discountValue' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    try {
      const result = await this.couponsService.findAll({ page, limit, search, sort });
      return { statusCode: 200, message: 'Coupons fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const coupon = await this.couponsService.findOne(id);
      return { statusCode: 200, message: 'Coupon fetched successfully', data: coupon };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Coupon not found' };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update coupon by ID' })
  async update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    try {
      const coupon = await this.couponsService.update(id, updateCouponDto);
      return { statusCode: 200, message: 'Coupon updated successfully', data: coupon };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Coupon not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete coupon by ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.couponsService.remove(id);
      return { statusCode: 200, message: 'Coupon deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Coupon not found' };
    }
  }
}
