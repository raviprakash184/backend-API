import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsBoolean, IsNumber, IsOptional, IsEmail } from 'class-validator';

export class CreateDeliveryAgentDto {
  @ApiProperty({ example: 'John Doe', description: 'Agent name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '+1234567890', description: 'Agent phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'john@example.com', description: 'Agent email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '64e8b7f2c2a1b2d3e4f5a6b7', description: 'Address ID' })
  @IsMongoId()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: true, description: 'Is agent active?' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: false, description: 'Is agent online?' })
  @IsBoolean()
  @IsOptional()
  isOnline?: boolean;

  @ApiProperty({ example: 100, description: 'Total deliveries completed' })
  @IsNumber()
  @IsOptional()
  totalDeliveries?: number;

  @ApiProperty({ example: 4.8, description: 'Agent rating' })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: { vehicle: 'bike' }, description: 'Additional metadata' })
  @IsOptional()
  meta?: Record<string, any>;
}
