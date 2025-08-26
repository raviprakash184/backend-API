import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: '221B Baker Street' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'London' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Greater London' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'NW1 6XE' })
  @IsString()
  pincode: string;

  @ApiProperty({ example: 'UK' })
  @IsString()
  country: string;

  @ApiProperty({ enum: ['home', 'work', 'other'], example: 'home' })
  @IsEnum(['home', 'work', 'other'])
  addressType: string;

  @ApiProperty({ example: 'Near Police Station', required: false })
  @IsString()
  landmark?: string;

  @ApiProperty({ example: 28.6139 }) // Delhi
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 77.2090 }) // Delhi
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: false, default: false })
  @IsBoolean()
  isDefault?: boolean;
}
