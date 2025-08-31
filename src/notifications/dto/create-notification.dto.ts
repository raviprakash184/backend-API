import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsMongoId, IsBoolean, IsNumber, IsObject } from 'class-validator';

export class CreateNotificationDto {
  @ApiPropertyOptional({ type: String, example: '64f0c2e2b8e4e2a1b8e4e2a2' })
  @IsOptional()
  @IsMongoId()
  user?: string;

  @ApiProperty({ example: 'Order Shipped' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Your order #123 has been shipped' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ type: Boolean, example: false })
  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @ApiPropertyOptional({ type: String, example: '2025-08-29T12:00:00Z' })
  @IsOptional()
  sentAt?: Date;

  @ApiPropertyOptional({ type: Boolean, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @ApiPropertyOptional({ type: String, example: 'banner.png' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({ type: String, example: 'push' })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiPropertyOptional({ type: Object, example: { orderId: 'ORD123456' } })
  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;

  @ApiPropertyOptional({ type: String, example: 'order' })
  @IsOptional()
  @IsString()
  type?: string;
}
