import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @ApiProperty({ example: 'Apple' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '64f88df21b3ab5a75ae91c1a', description: 'Category ID' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ example: 'https://yourcdn.com/apple.png' })
  @IsOptional()
  @IsString()
  image_url?: string[];

  @ApiProperty({ example: true })
  @IsOptional()
  isActive?: boolean;
}
