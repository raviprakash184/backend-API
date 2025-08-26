import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';

@Injectable()
export class AuthService {
  private otpStore = new Map<string, string>(); // phone → otp

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Step 1: Send OTP
  async sendOtp(phone: string): Promise<{ message: string }> {
    const otp = '1234'

    this.otpStore.set(phone, otp);

    console.log(`✅ OTP for ${phone} is ${otp}`); // Replace with Twilio/MSG91

    return { message: 'OTP sent successfully' };
  }

  // Step 2: Verify OTP + Login/Signup
  async validateOtp(phone: string, otp: string) {
    const storedOtp = this.otpStore.get(phone);
// await this.userModel.collection.dropIndex("email_1");


    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // OTP valid → remove from store
    this.otpStore.delete(phone);

    // Check if user exists
    let user = await this.userModel.findOne({ phone });

    // If not, create new user
    if (!user) {
      user = new this.userModel({
        phone,
        name: 'gest User', // placeholder, can be updated later

      });
      await user.save();
    }

    // Generate JWT
    const payload = { sub: user._id, phone: user.phone };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token: token,
      user,
    };
  }
}
