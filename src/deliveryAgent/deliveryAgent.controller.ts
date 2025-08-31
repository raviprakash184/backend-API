import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBody } from '@nestjs/swagger';
import { DeliveryAgentService } from './deliveryAgent.service';
import { CreateDeliveryAgentDto } from './dto/create-deliveryAgent.dto';
import { UpdateDeliveryAgentDto } from './dto/update-deliveryAgent.dto';

@ApiTags('DeliveryAgent')
@Controller('delivery-agents')
export class DeliveryAgentController {
  @Post(':id/location')
  @ApiOperation({ summary: 'Update delivery agent current location' })
  @ApiBody({ schema: { type: 'object', properties: { latitude: { type: 'number' }, longitude: { type: 'number' } }, required: ['latitude', 'longitude'] } })
  async updateLocation(
    @Param('id') agentId: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number
  ) {
    try {
      const result = await this.deliveryAgentService.updateLocation(agentId, latitude, longitude);
      return { statusCode: 200, message: 'Location updated successfully', data: result };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Agent not found or location update failed' };
    }
  }
  constructor(private readonly deliveryAgentService: DeliveryAgentService) {}

  async login(@Body('phone') phone: string) {
    try {
      const result = await this.deliveryAgentService.sendOtp(phone);
      return { statusCode: 200, message: 'OTP sent successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and login delivery agent' })
  @ApiBody({ schema: { type: 'object', properties: { phone: { type: 'string' }, otp: { type: 'string' } }, required: ['phone', 'otp'] } })
  async verifyOtp(@Body('phone') phone: string, @Body('otp') otp: string) {
    try {
      const result = await this.deliveryAgentService.verifyOtp(phone, otp);
      return { statusCode: 200, message: 'OTP verified successfully', data: result };
    } catch (error) {
      return { statusCode: 400, message: error.message || 'OTP verification failed' };
    }
  }

  @Get(':id/orders')
  @ApiOperation({ summary: 'Get delivered order history for delivery agent' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  async getOrderHistory(
    @Param('id') agentId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    try {
      const result = await this.deliveryAgentService.getOrderHistory(agentId, { page, limit, search, sort });
      return { statusCode: 200, message: 'Order history fetched successfully', data: result };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Order history not found' };
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a delivery agent' })
  async create(@Body() createDeliveryAgentDto: CreateDeliveryAgentDto) {
    try {
      const agent = await this.deliveryAgentService.create(createDeliveryAgentDto);
      return { statusCode: 201, message: 'Delivery agent created successfully', data: agent };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all delivery agents with pagination, search, sorting, and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for name, phone, or email' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Sort by field, e.g. totalDeliveries,-rating' })
  @ApiQuery({ name: 'isOnline', required: false, type: Boolean, description: 'Filter by online status' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('isOnline') isOnline?: boolean,
    @Query('isActive') isActive?: boolean,
  ) {
    try {
      const result = await this.deliveryAgentService.findAll({ page, limit, search, sort, isOnline, isActive });
      return { statusCode: 200, message: 'Delivery agents fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get delivery agent by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const agent = await this.deliveryAgentService.findOne(id);
      return { statusCode: 200, message: 'Delivery agent fetched successfully', data: agent };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Delivery agent not found' };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update delivery agent by ID' })
  async update(@Param('id') id: string, @Body() updateDeliveryAgentDto: UpdateDeliveryAgentDto) {
    try {
      const agent = await this.deliveryAgentService.update(id, updateDeliveryAgentDto);
      return { statusCode: 200, message: 'Delivery agent updated successfully', data: agent };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Delivery agent not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete delivery agent by ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.deliveryAgentService.remove(id);
      return { statusCode: 200, message: 'Delivery agent deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Delivery agent not found' };
    }
  }
}
