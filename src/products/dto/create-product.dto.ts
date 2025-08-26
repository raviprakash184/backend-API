import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ type:String,required:true})
  @IsString()
  name: string;

  @ApiPropertyOptional({ type:String })
  @IsOptional()
  @IsString()
  description?: string;

//  @ApiPropertyOptional({ example: '64e8c2f2e3b8a2a1c8d6f1b2', description: 'Category ObjectId' })
//   @IsOptional()
//   @IsString()
//   category?: string;

//   @ApiPropertyOptional({ example: '64e8c2f2e3b8a2a1c8d6f1b3', description: 'SubCategory ObjectId' })
//   @IsOptional()
//   @IsString()
//   subCategory?: string;

  @ApiPropertyOptional({ example: '64e8c2f2e3b8a2a1c8d6f1b4', description: 'Brand ObjectId or name' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image_url?: string[];

  @ApiProperty({ example: 100 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'kg', description: 'Unit (kg, gm, pcs, etc.)' })
  @IsString()
  unit: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVeg?: boolean;

  @ApiPropertyOptional({ example: '6 months' })
  @IsOptional()
  @IsString()
  shelfLife?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPrescriptionRequired?: boolean;

  @ApiPropertyOptional({ example: 'For external use only' })
  @IsOptional()
  @IsString()
  disclaimer?: string;

  @ApiPropertyOptional({ example: 'FreshFarms' })
  @IsOptional()
  @IsString()
  sellerName?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  countryOfOrigin?: string;
}