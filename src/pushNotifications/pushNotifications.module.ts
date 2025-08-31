import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PushNotification, PushNotificationSchema } from './pushNotification.schema';
import { PushNotificationsService } from './pushNotifications.service';
import { PushNotificationsController } from './pushNotifications.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PushNotification.name, schema: PushNotificationSchema }]),
  ],
  controllers: [PushNotificationsController],
  providers: [PushNotificationsService],
})
export class PushNotificationsModule {}
