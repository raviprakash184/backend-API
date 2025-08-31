import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItem {
  @ApiProperty({ type: String, example: '64f0c2e2b8e4e2a1b8e4e2a1' })
  @IsMongoId()
  product: string;

  @ApiProperty({ type: Number, example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Number, example: 199 })
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @ApiPropertyOptional({ type: String, example: 'ORD123456' })
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @ApiPropertyOptional({ type: Boolean, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: String, example: 'Leave at the door' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: Number, example: 4.5 })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ type: String, example: '64f0c2e2b8e4e2a1b8e4e2a2' })
  @IsOptional()
  @IsMongoId()
  agent?: string;

  @ApiPropertyOptional({ type: String, example: 'profile-photo.png' })
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiProperty({ type: String, example: '64f0c2e2b8e4e2a1b8e4e2a3' })
  @IsMongoId()
  user: string;

  @ApiProperty({ type: [OrderItem] })
  @IsArray()
  items: OrderItem[];

  @ApiProperty({ type: Number, example: 398 })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ type: String, example: '64f0c2e2b8e4e2a1b8e4e2a4' })
  @IsMongoId()
  deliveryAddress: string;

  @ApiProperty({ type: String, example: 'COD' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ type: String, example: 'paid' })
  @IsString()
  paymentStatus: string;
}
