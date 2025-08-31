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

  async findAll({ page, limit, search }: { page?: number; limit?: number; search?: string } = {}): Promise<{ data: Cart[]; total: number; page?: number; limit?: number }> {
    const query: any = {};
    if (search) {
      query.userId = { $regex: search, $options: 'i' };
    }
    let data: Cart[];
    let total: number;
    if (!page && !limit && !search) {
      data = await this.cartModel.find(query).populate('userId items.productId').exec();
      total = data.length;
      return { data, total };
    }
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    const skip = (pageNum - 1) * limitNum;
    [data, total] = await Promise.all([
      this.cartModel.find(query).populate('userId items.productId').skip(skip).limit(limitNum).exec(),
      this.cartModel.countDocuments(query)
    ]);
    return { data, total, page: pageNum, limit: limitNum };
  }
  async findByUserId(userId: string): Promise<Cart[]> {
    return this.cartModel.find({ userId }).populate('userId items.productId').exec();
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
