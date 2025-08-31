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

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ data: Notification[]; total: number; page?: number; limit?: number }> {
    const query: any = {};
    if (options?.search) {
      query.$or = [
        { title: { $regex: options.search, $options: 'i' } },
        { message: { $regex: options.search, $options: 'i' } },
      ];
    }
    let mongooseQuery = this.notificationModel.find(query);
    if (options?.sortBy) {
      const order = options.sortOrder === 'desc' ? -1 : 1;
      mongooseQuery = mongooseQuery.sort({ [options.sortBy]: order });
    } else {
      mongooseQuery = mongooseQuery.sort({ createdAt: -1 });
    }
    if (options?.page || options?.limit || options?.search) {
      const pageNum = options?.page ? Number(options.page) : 1;
      const limitNum = options?.limit ? Number(options.limit) : 10;
      const skip = (pageNum - 1) * limitNum;
      mongooseQuery = mongooseQuery.skip(skip).limit(limitNum);
      const [data, total] = await Promise.all([
        mongooseQuery.exec(),
        this.notificationModel.countDocuments(query)
      ]);
      return { data, total, page: pageNum, limit: limitNum };
    } else {
      const data = await mongooseQuery.exec();
      const total = data.length;
      return { data, total };
    }
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
