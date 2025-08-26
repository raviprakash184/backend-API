import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to mobile number' })
  @ApiResponse({ status: 201, description: 'OTP sent successfully' })
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone);
  }

  @Get('login')
  @ApiOperation({ summary: 'Login using phone and OTP' })
  @ApiQuery({ name: 'phone', type: String, example: '+919876543210' })
  @ApiQuery({ name: 'otp', type: String, example: '1234' })
  async loginWithOtp(
    @Query('phone') phone: string,
    @Query('otp') otp: string,
  ) {
    return this.authService.validateOtp(phone, otp);
  }
}
