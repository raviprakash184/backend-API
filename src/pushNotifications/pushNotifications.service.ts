import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PushNotification } from './pushNotification.schema';

@Injectable()
export class PushNotificationsService {
  constructor(@InjectModel(PushNotification.name) private notificationModel: Model<PushNotification>) {}

  async sendNotification(userId: string, title: string, message: string, type = 'info') {
    const notification = new this.notificationModel({ userId, title, message, type });
    return notification.save();
  }

  async scheduleNotification(userId: string, title: string, message: string, scheduledAt: Date, type = 'info') {
    const notification = new this.notificationModel({ userId, title, message, type, scheduledAt });
    return notification.save();
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(notificationId, { read: true }, { new: true });
  }
}
