import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScheduledOrder } from './scheduledOrder.schema';

@Injectable()
export class ScheduledOrdersService {
  constructor(@InjectModel(ScheduledOrder.name) private scheduledOrderModel: Model<ScheduledOrder>) {}

  async createScheduledOrder(userId: string, items: any[], deliveryAddress: string, scheduleType: string, nextDeliveryDate: Date) {
    const order = new this.scheduledOrderModel({ userId, items, deliveryAddress, scheduleType, nextDeliveryDate });
    return order.save();
  }

  async getUserScheduledOrders(userId: string) {
    return this.scheduledOrderModel.find({ userId }).sort({ nextDeliveryDate: 1 }).exec();
  }

  async cancelScheduledOrder(orderId: string) {
    return this.scheduledOrderModel.findByIdAndUpdate(orderId, { isActive: false }, { new: true });
  }
}
