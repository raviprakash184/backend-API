import { Controller, Post, Body, Get, Param, Put, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { Response } from 'express';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create Address for a user' })
  @ApiBody({ type: CreateAddressDto })
  async create(@Param('userId') userId: string, @Body() createDto: CreateAddressDto, @Res() res: Response) {
    try {
      const address = await this.addressService.create(userId, createDto);
      return res.status(HttpStatus.CREATED).json({ statusCode: 201, message: 'Address created successfully', data: address });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: 400, message: 'Duplicate field value', error: error.keyValue });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ statusCode: 500, message: error.message || 'Server error' });
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all addresses (pagination/search optional)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page for pagination (optional)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by city (optional)' })
  async getAll(@Res() res: Response, @Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
    try {
      const result = await this.addressService.findAll(page, limit, search);
      return res.status(HttpStatus.OK).json({ statusCode: 200, message: 'Addresses fetched successfully', data: result });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ statusCode: 500, message: error.message || 'Server error' });
    }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all addresses of a user' })
  async findAll(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const result = await this.addressService.findByuserID(userId);
      return res.status(HttpStatus.OK).json({ statusCode: 200, message: 'Addresses fetched successfully', data: result });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ statusCode: 404, message: error.message || 'Addresses not found' });
    }
  }

  @Get('single/:id')
  @ApiOperation({ summary: 'Get address by ID' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const address = await this.addressService.findOne(id);
      return res.status(HttpStatus.OK).json({ statusCode: 200, message: 'Address fetched successfully', data: address });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ statusCode: 404, message: error.message || 'Address not found' });
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update address' })
  @ApiBody({ type: UpdateAddressDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateAddressDto, @Res() res: Response) {
    try {
      const address = await this.addressService.update(id, updateDto);
      return res.status(HttpStatus.OK).json({ statusCode: 200, message: 'Address updated successfully', data: address });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: 400, message: 'Duplicate field value', error: error.keyValue });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: 400, message: error.message || 'Update failed' });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.addressService.remove(id);
      return res.status(HttpStatus.OK).json({ statusCode: 200, message: 'Address deleted successfully' });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ statusCode: 404, message: error.message || 'Address not found' });
    }
  }
}
