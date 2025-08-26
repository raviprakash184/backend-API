// src/payment/dto/create-payment.dto.ts

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  amount: number;

  @IsEnum(['pending', 'completed', 'failed'])
  status: string;

  @IsEnum(['upi', 'card', 'netbanking', 'cod'])
  method: string;

  @IsOptional()
  transactionId?: string;

  @IsNotEmpty()
  orderId: string;
}
