import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsMongoId, IsOptional, IsBoolean } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '64e8b7f2c2a1b2d3e4f5a6b7', description: 'User ID' })
  @IsMongoId()
  user: string;

  @ApiProperty({ example: '64e8b7f2c2a1b2d3e4f5a6b8', description: 'Product ID' })
  @IsMongoId()
  product: string;

  @ApiProperty({ example: 5, description: 'Rating (1-5)' })
  @IsNumber()
  rating: number;

  @ApiProperty({ example: 'Great product!', description: 'Review comment' })
  @IsString()
  comment: string;

  @ApiProperty({ example: true, description: 'Is review active?' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: { verified: true }, description: 'Additional metadata' })
  @IsOptional()
  meta?: Record<string, any>;
}
