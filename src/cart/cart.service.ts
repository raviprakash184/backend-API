// src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartModel.create(createCartDto);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartModel.find().populate('userId items.productId');
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartModel.findById(id).populate('userId items.productId');
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartModel.findByIdAndUpdate(id, updateCartDto, { new: true });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async remove(id: string): Promise<void> {
    const result = await this.cartModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Cart not found');
  }
}
