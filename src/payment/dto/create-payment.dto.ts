// src/payment/dto/create-payment.dto.ts

import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @ApiPropertyOptional({ type: Boolean, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: String, example: 'Payment for order #123' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: String, example: 'profile-photo.png' })
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiPropertyOptional({ type: Number, example: 4.5 })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ type: String, example: '2025-08-29T12:00:00Z' })
  @IsOptional()
  paymentDate?: Date;

  @ApiPropertyOptional({ type: String, example: '64f0c2e2b8e4e2a1b8e4e2a1' })
  @IsOptional()
  @IsString()
  agent?: string;

  @ApiProperty({ type: String, example: '64f0c2e2b8e4e2a1b8e4e2a2' })
  @IsNotEmpty()
  user: string;

  @ApiProperty({ type: Number, example: 299 })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: ['pending', 'completed', 'failed', 'refunded'], example: 'pending' })
  @IsEnum(['pending', 'completed', 'failed'])
  status: string;

  @ApiProperty({ enum: ['upi', 'card', 'netbanking', 'cod', 'wallet'], example: 'upi' })
  @IsEnum(['upi', 'card', 'netbanking', 'cod'])
  method: string;

  @ApiPropertyOptional({ type: String, example: 'TXN123456' })
  @IsOptional()
  transactionId?: string;

  @ApiProperty({ type: String, example: 'ORD123456' })
  @IsNotEmpty()
  orderId: string;
}
