import { IsEnum, IsOptional, IsNotEmpty, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';
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

  @ApiProperty({ type: [Number], example: [77.5946, 12.9716], required: false, description: 'Location coordinates [longitude, latitude]' })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  location?: number[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 4.5, required: false })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({ example: 'profile-photo.png', required: false })
  @IsOptional()
  @IsString()
  profilePhoto?: string;
}
