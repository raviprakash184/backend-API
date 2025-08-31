import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsMongoId, IsOptional, IsBoolean, IsNumber, IsEmail } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Tasty Bites', description: 'Restaurant name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123 Main St', description: 'Address' })
  @IsString()
  address: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'tasty@example.com', description: 'Email' })
  @IsEmail()
  email: string;

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

  @ApiProperty({ example: true, description: 'Is active?' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 4.5, description: 'Rating' })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: { open: '10:00', close: '22:00' }, description: 'Timings' })
  @IsOptional()
  timings?: Record<string, any>;

  @ApiProperty({ example: { deliveryZone: 'Zone 1' }, description: 'Additional metadata' })
  @IsOptional()
  meta?: Record<string, any>;
}
