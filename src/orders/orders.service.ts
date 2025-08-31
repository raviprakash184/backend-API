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
  const estimatedDeliveryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
  const newOrder = new this.orderModel({ ...createOrderDto, estimatedDeliveryTime });
  return newOrder.save();
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<Order[]> {
    const query: any = {};
    if (options?.search) {
      query['$or'] = [
        { orderNumber: { $regex: options.search, $options: 'i' } },
        { status: { $regex: options.search, $options: 'i' } },
      ];
    }
    let mongooseQuery = this.orderModel.find(query)
      .populate('user')
      .populate('items.product')
      .populate('deliveryAddress');
    if (options?.sortBy) {
      const order = options.sortOrder === 'desc' ? -1 : 1;
      mongooseQuery = mongooseQuery.sort({ [options.sortBy]: order });
    }
    if (options?.page && options?.limit) {
      const skip = (options.page - 1) * options.limit;
      mongooseQuery = mongooseQuery.skip(skip).limit(options.limit);
    }
    return mongooseQuery.exec();
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

  async getTracking(id: string): Promise<{ status: string; timeline: any[]; agentLocation?: any; estimatedDeliveryTime?: Date }> {
    const order = await this.orderModel.findById(id).populate('agent');
    if (!order) throw new NotFoundException('Order not found');
    let agentLocation = null;
    if (order.agent && order.agent.currentLocation) {
      agentLocation = order.agent.currentLocation;
    }
    return {
      status: order.status,
      timeline: order.orderTimeline || [],
      agentLocation,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
    };
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

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      throw new NotFoundException('Order cannot be cancelled after dispatch');
    }
    order.status = 'cancelled';
    order.orderTimeline = order.orderTimeline || [];
    order.orderTimeline.push({ status: 'cancelled', timestamp: new Date(), note: 'Order cancelled by user' });
    await order.save();
    return order;
  }

  async modifyOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      throw new NotFoundException('Order cannot be modified after dispatch');
    }
    Object.assign(order, updateOrderDto);
    order.orderTimeline = order.orderTimeline || [];
    order.orderTimeline.push({ status: 'modified', timestamp: new Date(), note: 'Order modified by user' });
    await order.save();
    return order;
  }
}
