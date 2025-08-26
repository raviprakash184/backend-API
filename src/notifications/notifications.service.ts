import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    return this.notificationModel.create(dto);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<Notification> {
    const notif = await this.notificationModel.findById(id);
    if (!notif) throw new NotFoundException('Notification not found');
    return notif;
  }

  async update(id: string, dto: UpdateNotificationDto): Promise<Notification> {
    const notif = await this.notificationModel.findByIdAndUpdate(id, dto, { new: true });
    if (!notif) throw new NotFoundException('Notification not found');
    return notif;
  }

  async remove(id: string): Promise<void> {
    const res = await this.notificationModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Notification not found');
  }
}
