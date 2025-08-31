import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsBoolean, IsOptional, IsEnum } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'WELCOME10', description: 'Coupon code' })
  @IsString()
  code: string;

  @ApiProperty({ example: '10% off for new users', description: 'Coupon description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed'], description: 'Type of discount' })
  @IsEnum(['percentage', 'fixed'])
  discountType: 'percentage' | 'fixed';

  @ApiProperty({ example: 10, description: 'Discount value (percentage or fixed amount)' })
  @IsNumber()
  discountValue: number;

  @ApiProperty({ example: 100, description: 'Minimum order amount to apply coupon' })
  @IsNumber()
  minOrderAmount: number;

  @ApiProperty({ example: 50, description: 'Maximum discount amount allowed' })
  @IsNumber()
  maxDiscountAmount: number;

  @ApiProperty({ example: '2025-08-29T00:00:00.000Z', description: 'Coupon start date' })
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2025-09-30T23:59:59.000Z', description: 'Coupon end date' })
  @IsDate()
  endDate: Date;

  @ApiProperty({ example: true, description: 'Is coupon active?' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 100, description: 'Usage limit for the coupon' })
  @IsNumber()
  @IsOptional()
  usageLimit?: number;

  @ApiProperty({ example: 0, description: 'Number of times coupon has been used' })
  @IsNumber()
  @IsOptional()
  usedCount?: number;

  @ApiProperty({ example: { category: 'grocery' }, description: 'Additional metadata' })
  @IsOptional()
  meta?: Record<string, any>;
}
