import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupportTicket } from './supportTicket.schema';

@Injectable()
export class SupportService {
  constructor(@InjectModel(SupportTicket.name) private ticketModel: Model<SupportTicket>) {}

  async createTicket(userId: string, subject: string, message: string) {
    const ticket = new this.ticketModel({ userId, subject, message });
    return ticket.save();
  }

  async getUserTickets(userId: string) {
    return this.ticketModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async respondToTicket(ticketId: string, response: string) {
    return this.ticketModel.findByIdAndUpdate(ticketId, { response, status: 'closed' }, { new: true });
  }
}
