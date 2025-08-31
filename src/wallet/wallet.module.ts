import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet, WalletSchema } from './schemas/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
  ],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
