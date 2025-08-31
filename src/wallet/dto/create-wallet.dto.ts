import { IsMongoId, IsNumber, IsOptional, IsBoolean, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class WalletTransactionDto {
  @ApiProperty({ type: Number, example: 100 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: ['credit', 'debit'], example: 'credit' })
  @IsString()
  type: 'credit' | 'debit';

  @ApiProperty({ type: String, example: '2025-08-29T12:00:00Z' })
  @IsOptional()
  date?: Date;

  @ApiPropertyOptional({ type: String, example: 'Order refund' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: String, example: 'ORD123456' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({ type: String, example: 'PAY123456' })
  @IsOptional()
  @IsString()
  paymentId?: string;
}

export class CreateWalletDto {
  @ApiProperty({ type: String, example: '64f0c2e2b8e4e2a1b8e4e2a2' })
  @IsMongoId()
  user: string;

  @ApiProperty({ type: Number, example: 500 })
  @IsNumber()
  balance: number;

  @ApiPropertyOptional({ type: Boolean, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @ApiPropertyOptional({ type: String, example: 'Welcome bonus' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [WalletTransactionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WalletTransactionDto)
  transactions?: WalletTransactionDto[];
}
