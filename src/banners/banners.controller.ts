import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BannerService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@ApiTags('Banner')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a banner' })
  async create(@Body() createBannerDto: CreateBannerDto) {
    try {
      const banner = await this.bannerService.create(createBannerDto);
      return { statusCode: 201, message: 'Banner created successfully', data: banner };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all banners with pagination, search, and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for banner title or description' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Sort by field, e.g. displayOrder,-priority' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    try {
      const result = await this.bannerService.findAll({ page, limit, search, sort });
      return { statusCode: 200, message: 'Banners fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const banner = await this.bannerService.findOne(id);
      return { statusCode: 200, message: 'Banner fetched successfully', data: banner };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Banner not found' };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update banner by ID' })
  async update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    try {
      const banner = await this.bannerService.update(id, updateBannerDto);
      return { statusCode: 200, message: 'Banner updated successfully', data: banner };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Banner not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete banner by ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.bannerService.remove(id);
      return { statusCode: 200, message: 'Banner deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Banner not found' };
    }
  }
}
