import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Fruits' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://yourcdn.com/fruits.png' })
  @IsOptional()
  @IsString()
  image_url?: string[];

  @ApiProperty({ example: true })
  @IsOptional()
  isActive?: boolean;
}
