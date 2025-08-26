import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Order Shipped' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Your order #123 has been shipped' })
  @IsOptional()
  @IsString()
  message?: string;
}
