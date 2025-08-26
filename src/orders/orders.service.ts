import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = new this.orderModel(createOrderDto);
    return newOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('user')
      .populate('items.product')
      .populate('deliveryAddress')
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('user')
      .populate('items.product')
      .populate('deliveryAddress');

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
  const order = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
  
  if (!order) {
    throw new NotFoundException(`Order with id ${id} not found`);
  }

  return order;
}

  async remove(id: string): Promise<void> {
    await this.orderModel.findByIdAndDelete(id);
  }
}
