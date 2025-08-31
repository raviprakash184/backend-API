import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeliveryAgent, DeliveryAgentDocument } from './schemas/deliveryAgent.schema';
import { CreateDeliveryAgentDto } from './dto/create-deliveryAgent.dto';
import { UpdateDeliveryAgentDto } from './dto/update-deliveryAgent.dto';

@Injectable()
export class DeliveryAgentService {
  constructor(@InjectModel(DeliveryAgent.name) private agentModel: Model<DeliveryAgentDocument>) {}

  // Simulate sending OTP (in production, integrate with SMS provider)
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    // Generate and store OTP (in-memory or DB, here just simulate)
    // TODO: Store OTP securely and expire after some time
    return { success: true, message: `OTP sent to ${phone}` };
  }

  // Simulate verifying OTP
  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; agent?: DeliveryAgent; message: string; token?: string }> {
    // TODO: Verify OTP from storage
    const agent = await this.agentModel.findOne({ phone });
    if (!agent) return { success: false, message: 'Agent not found' };
    // Simulate OTP check
    if (otp === '123456') {
    // Mark phone as verified in DB if needed
    // Issue JWT token (simulate for now)
    const token = this.generateJwt(phone);
    return { success: true, agent, message: 'OTP verified, login successful', token };
    }
    return { success: false, message: 'Invalid OTP' };
  }
  // Simulate JWT generation (replace with real JWT logic in production)
  private generateJwt(phone: string): string {
    // In production, use a secret and sign with agent info
    return Buffer.from(`${phone}:deliveryagent:123456`).toString('base64');
  }

  // Get delivered order history for agent
  async getOrderHistory(agentId: string, options?: { page?: number; limit?: number; search?: string; sort?: string }) {
    // Assuming you have an Order model and agent field in order schema
    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit = options?.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;
    const filter: any = { agent: agentId, status: 'delivered' };
    if (options?.search) {
      filter.$or = [
        { orderNumber: { $regex: options.search, $options: 'i' } },
        { notes: { $regex: options.search, $options: 'i' } },
      ];
    }
    let sort: any = {};
    if (options?.sort) {
      options.sort.split(',').forEach((field) => {
        if (field.startsWith('-')) {
          sort[field.substring(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    } else {
      sort = { createdAt: -1 };
    }
    // Dynamically import Order model to avoid circular dependency
    const OrderModel = this.agentModel.db.model('Order');
    const [data, total] = await Promise.all([
      OrderModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      OrderModel.countDocuments(filter)
    ]);
    return { data, total, page, limit };
  }

  async create(createAgentDto: CreateDeliveryAgentDto): Promise<DeliveryAgent> {
    const agent = new this.agentModel(createAgentDto);
    return agent.save();
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    isOnline?: boolean;
    isActive?: boolean;
  }): Promise<{ data: DeliveryAgent[]; total: number; page: number; limit: number }> {
    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit = options?.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (options?.search) {
      filter.$or = [
        { name: { $regex: options.search, $options: 'i' } },
        { phone: { $regex: options.search, $options: 'i' } },
        { email: { $regex: options.search, $options: 'i' } }
      ];
    }
    if (options?.isOnline !== undefined) {
      filter.isOnline = options.isOnline;
    }
    if (options?.isActive !== undefined) {
      filter.isActive = options.isActive;
    }
    let sort: any = {};
    if (options?.sort) {
      options.sort.split(',').forEach((field) => {
        if (field.startsWith('-')) {
          sort[field.substring(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    } else {
      sort = { totalDeliveries: -1 };
    }
    const [data, total] = await Promise.all([
      this.agentModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.agentModel.countDocuments(filter)
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<DeliveryAgent> {
    const agent = await this.agentModel.findById(id).exec();
    if (!agent) throw new NotFoundException(`Delivery agent with id ${id} not found`);
    return agent;
  }

  async updateLocation(agentId: string, latitude: number, longitude: number) {
    const agent = await this.agentModel.findById(agentId);
    if (!agent) throw new NotFoundException('Delivery agent not found');
    agent.currentLocation = {
      latitude,
      longitude,
      timestamp: new Date()
    };
    await agent.save();
    return { success: true, message: 'Location updated', location: agent.currentLocation };
  }

  async update(id: string, updateAgentDto: UpdateDeliveryAgentDto): Promise<DeliveryAgent> {
    const agent = await this.agentModel.findByIdAndUpdate(id, updateAgentDto, { new: true });
    if (!agent) throw new NotFoundException(`Delivery agent with id ${id} not found`);
    return agent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.agentModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException(`Delivery agent with id ${id} not found`);
  }
}
