import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery, DeliveryDocument } from './schemas/delivery.schema';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(@InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>) {}

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const delivery = new this.deliveryModel(createDeliveryDto);
    return delivery.save();
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<Delivery[]> {
    const query: any = {};
    if (options?.search) {
      query.deliveryAgentName = { $regex: options.search, $options: 'i' };
    }
    let mongooseQuery = this.deliveryModel.find(query);
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

  async findOne(id: string): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(id);
    if (!delivery) {
      throw new NotFoundException(`Delivery agent with id ${id} not found`);
    }
    return delivery;
  }

  async update(id: string, updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery> {
    const delivery = await this.deliveryModel.findByIdAndUpdate(id, updateDeliveryDto, { new: true });
    if (!delivery) {
      throw new NotFoundException(`Delivery agent with id ${id} not found`);
    }
    return delivery;
  }

  async remove(id: string): Promise<Delivery> {
    const delivery = await this.deliveryModel.findByIdAndDelete(id);
    if (!delivery) {
      throw new NotFoundException(`Delivery agent with id ${id} not found`);
    }
    return delivery;
  }
}
