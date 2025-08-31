import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsInt, IsArray, IsObject } from 'class-validator';

export class CreateSubCategoryDto {
  @ApiProperty({ example: 'Apple', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Fresh apples', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: ['https://yourcdn.com/apple.png'], type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image_url?: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  displayOrder?: number;

  @ApiProperty({ example: 'apple', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'apple-icon.png', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: { featured: true }, required: false })
  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;

  @ApiProperty({ example: '2025-08-29T12:00:00Z', required: false })
  @IsOptional()
  @IsString()
  createdAt?: string;

  @ApiProperty({ example: '2025-08-29T12:00:00Z', required: false })
  @IsOptional()
  @IsString()
  updatedAt?: string;

  @ApiProperty({ example: '64e8b2f2c2a1b2e8b2f2c2a1', required: true })
  @IsNotEmpty()
  @IsString()
  category: string;
}
