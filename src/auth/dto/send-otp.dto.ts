import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+919876543210', description: 'User phone number' })
  @IsNotEmpty()
  @IsPhoneNumber('IN')
  phone: string;
}
