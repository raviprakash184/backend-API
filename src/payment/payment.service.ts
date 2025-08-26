// src/payment/payment.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const created = new this.paymentModel(createPaymentDto);
    return created.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().populate('user');
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).populate('user');
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const updated = await this.paymentModel.findByIdAndUpdate(id, updatePaymentDto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Payment not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Payment not found');
  }
}
