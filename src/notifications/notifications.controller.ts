import { Controller, Post, Get, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  async create(@Body() dto: CreateNotificationDto) {
    try {
      const notification = await this.service.create(dto);
      return { statusCode: 201, message: 'Notification created successfully', data: notification };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all notifications with optional pagination, search, and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page for pagination (optional)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term (optional)' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field (optional)' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, description: 'Sort order asc/desc (optional)' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    try {
      const result = await this.service.findAll({ page, limit, search, sortBy, sortOrder });
      return { statusCode: 200, message: 'Notifications fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const notification = await this.service.findOne(id);
      return { statusCode: 200, message: 'Notification fetched successfully', data: notification };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Notification not found' };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a notification' })
  async update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
    try {
      const notification = await this.service.update(id, dto);
      return { statusCode: 200, message: 'Notification updated successfully', data: notification };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Notification not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  async remove(@Param('id') id: string) {
    try {
      await this.service.remove(id);
      return { statusCode: 200, message: 'Notification deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Notification not found' };
    }
  }
}
