import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PushNotificationsService } from './pushNotifications.service';

@Controller('push-notifications')
export class PushNotificationsController {
  constructor(private readonly pushNotificationsService: PushNotificationsService) {}

  @Post('send')
  async sendNotification(
    @Body('userId') userId: string,
    @Body('title') title: string,
    @Body('message') message: string,
    @Body('type') type?: string,
  ) {
    try {
      const result = await this.pushNotificationsService.sendNotification(userId, title, message, type);
      return { statusCode: 200, message: 'Notification sent successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Post('schedule')
  async scheduleNotification(
    @Body('userId') userId: string,
    @Body('title') title: string,
    @Body('message') message: string,
    @Body('scheduledAt') scheduledAt: Date,
    @Body('type') type?: string,
  ) {
    try {
      const result = await this.pushNotificationsService.scheduleNotification(userId, title, message, scheduledAt, type);
      return { statusCode: 200, message: 'Notification scheduled successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    try {
      const result = await this.pushNotificationsService.getUserNotifications(userId);
      return { statusCode: 200, message: 'User notifications fetched successfully', data: result };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Notifications not found' };
    }
  }

  @Post('read/:id')
  async markAsRead(@Param('id') id: string) {
    try {
      const result = await this.pushNotificationsService.markAsRead(id);
      return { statusCode: 200, message: 'Notification marked as read', data: result };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'Notification not found' };
    }
  }
}
