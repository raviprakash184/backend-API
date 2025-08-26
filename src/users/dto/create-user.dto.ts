import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  email?: string;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional({ enum: ['male', 'female', 'other'] })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @ApiPropertyOptional({ type: String, format: 'date' })
  @IsOptional()
  @IsDateString()
  dob?: Date;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary', // Swagger will show file upload option
  })
  @IsOptional()
  photo?: string;
}
