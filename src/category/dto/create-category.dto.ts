import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsInt, IsArray, IsObject } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Fruits' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Fresh fruits and vegetables', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
    description: 'Category images'
  })
  @IsOptional()
  @IsArray()
  image_url?: any[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  displayOrder?: number;

  // slug removed

  @ApiProperty({ example: 'fruit-icon.png', required: false })
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
}
