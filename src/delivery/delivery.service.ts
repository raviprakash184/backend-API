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

  async findAll(): Promise<Delivery[]> {
    return this.deliveryModel.find();
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
