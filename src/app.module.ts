import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { AddressModule } from './address/address.module';
import { PaymentModule } from './payment/payment.module';
import { WalletModule } from './wallet/wallet.module';
import { CategoriesModule } from './category/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategoriesModule } from './subcategorie/subcategorie.module';
import { BannerModule } from './banners/banners.module';
import { CouponsModule } from './coupons/coupons.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DeliveryAgentModule } from './deliveryAgent/deliveryAgent.module';
import { FoodsModule } from './foods/foods.module';
import { DeliveryModule } from './delivery/delivery.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PushNotificationsModule } from './pushNotifications/pushNotifications.module';
import { SupportModule } from './support/support.module';
import { AdminAnalyticsModule } from './admin/adminAnalytics.module';
import { ScheduledOrdersModule } from './scheduledOrders/scheduledOrders.module';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/photography'),
    AuthModule,
    UsersModule,
    AddressModule,
    CategoriesModule,
    SubCategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    // PaymentModule,
    // WalletModule,
    // BannerModule,
    // DeliveryModule,
    // NotificationsModule,
    // CouponsModule,
    // ReviewsModule,
    DeliveryAgentModule,
    // FoodsModule,
    // PushNotificationsModule,
    // SupportModule,
    // AdminAnalyticsModule,
    // ScheduledOrdersModule,
    // ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to uploads directory
      serveRoot: '/uploads/', // Prefix for serving static files
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
