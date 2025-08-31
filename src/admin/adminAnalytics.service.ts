import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../orders/schemas/order.schema';
import { DeliveryAgent } from '../deliveryAgent/schemas/deliveryAgent.schema';
import { User } from '../users/schema/user.schema';

@Injectable()
export class AdminAnalyticsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(DeliveryAgent.name) private agentModel: Model<DeliveryAgent>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getOrderStats() {
    const totalOrders = await this.orderModel.countDocuments();
    const delivered = await this.orderModel.countDocuments({ status: 'delivered' });
    const pending = await this.orderModel.countDocuments({ status: 'pending' });
    const cancelled = await this.orderModel.countDocuments({ status: 'cancelled' });
    return { totalOrders, delivered, pending, cancelled };
  }

  async getRevenueStats() {
    const orders = await this.orderModel.find({ status: 'delivered' });
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return { totalRevenue };
  }

  async getUserStats() {
    const totalUsers = await this.userModel.countDocuments();
    const newUsers = await this.userModel.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } });
    return { totalUsers, newUsersLast7Days: newUsers };
  }

  async getTopProducts() {
    // Example: aggregate top products by order count
    return this.orderModel.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
  }

  async getAgentPerformance() {
    return this.agentModel.find().sort({ totalDeliveries: -1 }).limit(5).exec();
  }
}
