import { IsEnum, IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from './delivery-status.enum';

export class CreateDeliveryDto {
  @ApiProperty({ example: 'Ravi Prakash' })
  @IsNotEmpty()
  @IsString()
  deliveryAgentName: string;

  @ApiProperty({ example: '9876543210' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    enum: DeliveryStatus,
    example: DeliveryStatus.AVAILABLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @ApiProperty({ example: 'HR26AB1234', required: false })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;
}
