import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '9876543210', description: 'User phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '1234', description: 'Hardcoded OTP for now' })
  @IsString()
  otp: string;
}
