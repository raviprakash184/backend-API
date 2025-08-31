import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './chatMessage.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(ChatMessage.name) private chatModel: Model<ChatMessage>) {}

  async sendMessage(orderId: string, senderId: string, receiverId: string, message: string) {
    const chat = new this.chatModel({ orderId, senderId, receiverId, message });
    return chat.save();
  }

  async getOrderChat(orderId: string) {
    return this.chatModel.find({ orderId }).sort({ createdAt: 1 }).exec();
  }

  async markAsRead(messageId: string) {
    return this.chatModel.findByIdAndUpdate(messageId, { read: true }, { new: true });
  }
}
