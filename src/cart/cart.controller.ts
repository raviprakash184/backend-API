// src/cart/cart.controller.ts
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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add items to cart' })
  @ApiResponse({ status: 201, description: 'Cart created successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: '64e8c2f2e3b8a2a1c8d6f1b2' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string', example: '64e8c2f2e3b8a2a1c8d6f1b3' },
              quantity: { type: 'number', example: 2 },
              price: { type: 'number', example: 100 },
              discount: { type: 'number', example: 10 },
            },
          },
        },
        isActive: { type: 'boolean', example: true },
        cartTotal: { type: 'number', example: 180 },
      },
    },
  })
  async create(@Body() createCartDto: CreateCartDto) {
    try {
      const cart = await this.cartService.create(createCartDto);
      return { statusCode: 201, message: 'Cart created successfully', data: cart };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all carts (pagination/search optional)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page for pagination (optional)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by userId (optional)' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    try {
      const result = await this.cartService.findAll({ page, limit, search });
      return { statusCode: 200, message: 'Carts fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get cart by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findByUser(@Param('userId') userId: string) {
    try {
      const cart = await this.cartService.findByUserId(userId);
      return { statusCode: 200, message: 'Cart fetched successfully', data: cart };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Cart not found' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cart by ID' })
  async findOne(@Param('id') id: string) {
    try {
      const cart = await this.cartService.findOne(id);
      return { statusCode: 200, message: 'Cart fetched successfully', data: cart };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Cart not found' };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update cart by ID' })
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    try {
      const cart = await this.cartService.update(id, updateCartDto);
      return { statusCode: 200, message: 'Cart updated successfully', data: cart };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'Cart not found' };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete cart by ID' })
  async remove(@Param('id') id: string) {
    try {
      await this.cartService.remove(id);
      return { statusCode: 200, message: 'Cart deleted successfully' };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Cart not found' };
    }
  }
}
