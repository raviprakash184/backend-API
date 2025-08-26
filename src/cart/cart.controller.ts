// src/cart/cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add items to cart' })
  @ApiResponse({ status: 201, description: 'Cart created successfully' })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all carts' })
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cart by ID' })
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update cart by ID' })
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete cart by ID' })
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
