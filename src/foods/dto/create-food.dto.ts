import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsMongoId, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateFoodDto {
  @ApiProperty({ example: 'Paneer Butter Masala', description: 'Food name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Delicious paneer curry', description: 'Description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 250, description: 'Price' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: '64e8b7f2c2a1b2d3e4f5a6b7', description: 'Restaurant ID' })
  @IsMongoId()
  restaurant: string;

  @ApiProperty({ example: ['64e8b7f2c2a1b2d3e4f5a6b8'], description: 'Category IDs (from unified Category model)' })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiProperty({ example: ['64e8b7f2c2a1b2d3e4f5a6b9'], description: 'SubCategory IDs (from SubCategory model)', required: false })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  subCategories?: string[];

  @ApiProperty({ example: true, description: 'Is available?' })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ example: ['food1.png'], description: 'Image URLs' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: { calories: 300 }, description: 'Nutrition info' })
  @IsOptional()
  nutrition?: Record<string, any>;

  @ApiProperty({ example: { spicy: true }, description: 'Additional metadata' })
  @IsOptional()
  meta?: Record<string, any>;
}
