import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create Address for a user' })
  @ApiBody({ type: CreateAddressDto })
  create(@Param('userId') userId: string, @Body() createDto: CreateAddressDto) {
    return this.addressService.create(userId, createDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all addresses of a user' })
  findAll(@Param('userId') userId: string) {
    return this.addressService.findByuserID(userId);
  }

  @Get('single/:id')
  @ApiOperation({ summary: 'Get address by ID' })
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update address' })
  @ApiBody({ type: UpdateAddressDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateAddressDto) {
    return this.addressService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
