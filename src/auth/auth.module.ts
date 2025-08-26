import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from '../users/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'SECRET_KEY', // should move to .env later
      signOptions: { expiresIn: '1d' },
    }),
     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
