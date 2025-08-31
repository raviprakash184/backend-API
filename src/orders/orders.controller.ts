import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.ordersService.create(createOrderDto);
      return { statusCode: 201, message: 'Order created successfully', data: order };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with optional pagination, search, and sorting' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'order123' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'displayOrder' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, example: 'asc' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    try {
      const result = await this.ordersService.findAll({ page, limit, search, sortBy, sortOrder });
      return { statusCode: 200, message: 'Orders fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const order = await this.ordersService.findOne(id);
      return { statusCode: 200, message: 'Order fetched successfully', data: order };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Order not found' };
    }
  }

  @Get(':id/tracking')
  @ApiOperation({ summary: 'Get order tracking info (status and timeline)' })
  async getTracking(@Param('id') id: string) {
    try {
      const tracking = await this.ordersService.getTracking(id);
      return { statusCode: 200, message: 'Order tracking fetched successfully', data: tracking };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Order not found' };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update order by ID' })
  @ApiBody({ type: UpdateOrderDto })
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.ordersService.update(id, updateOrderDto);
      return { statusCode: 200, message: 'Order updated successfully', data: order };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Order not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order by ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.ordersService.remove(id);
      return { statusCode: 200, message: 'Order deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Order not found' };
    }
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel order by ID (before dispatch)' })
  async cancelOrder(@Param('id') id: string) {
    try {
      const order = await this.ordersService.cancelOrder(id);
      return { statusCode: 200, message: 'Order cancelled successfully', data: order };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Order not found or cannot be cancelled' };
    }
  }

  @Put(':id/modify')
  @ApiOperation({ summary: 'Modify order by ID (before dispatch)' })
  async modifyOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.ordersService.modifyOrder(id, updateOrderDto);
      return { statusCode: 200, message: 'Order modified successfully', data: order };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Order not found or cannot be modified' };
    }
  }
}
