import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, IsObject } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  image_url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  redirect_url?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @ApiPropertyOptional({ type: String, example: 'homepage' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ type: String, example: '2025-08-29T12:00:00Z' })
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ type: String, example: '2025-09-01T12:00:00Z' })
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ type: Number, example: 1 })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({ type: Object, example: { categoryId: 'CAT123' } })
  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;
}
