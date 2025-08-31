// src/payment/payment.controller.ts

import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new payment' })
  @ApiBody({ type: CreatePaymentDto })
    async create(@Body() createPaymentDto: CreatePaymentDto) {
      try {
        const data = await this.paymentService.create(createPaymentDto);
        return {
          statusCode: 201,
          message: 'Payment created successfully',
          data,
        };
      } catch (error) {
        if (error.code === 11000) {
          return {
            statusCode: 400,
            message: 'Duplicate payment entry',
            data: null,
          };
        }
        return {
          statusCode: error.status || 500,
          message: error.message || 'Server error',
          data: null,
        };
      }
    }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
    async findAll() {
      try {
        const data = await this.paymentService.findAll();
        return {
          statusCode: 200,
          message: 'Payments fetched successfully',
          data,
        };
      } catch (error) {
        return {
          statusCode: error.status || 500,
          message: error.message || 'Server error',
          data: null,
        };
      }
    }

  @Get(':id')
  @ApiOperation({ summary: 'Get single payment by ID' })
    async findOne(@Param('id') id: string) {
      try {
        const data = await this.paymentService.findOne(id);
        return {
          statusCode: 200,
          message: 'Payment fetched successfully',
          data,
        };
      } catch (error) {
        return {
          statusCode: error.status || 500,
          message: error.message || 'Server error',
          data: null,
        };
      }
    }

  @Put(':id')
  @ApiOperation({ summary: 'Update payment by ID' })
  @ApiBody({ type: UpdatePaymentDto })
    async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
      try {
        const data = await this.paymentService.update(id, updatePaymentDto);
        return {
          statusCode: 200,
          message: 'Payment updated successfully',
          data,
        };
      } catch (error) {
        if (error.code === 11000) {
          return {
            statusCode: 400,
            message: 'Duplicate payment entry',
            data: null,
          };
        }
        return {
          statusCode: error.status || 500,
          message: error.message || 'Server error',
          data: null,
        };
      }
    }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment by ID' })
    async remove(@Param('id') id: string) {
      try {
        await this.paymentService.remove(id);
        return {
          statusCode: 200,
          message: 'Payment deleted successfully',
          data: null,
        };
      } catch (error) {
        return {
          statusCode: error.status || 500,
          message: error.message || 'Server error',
          data: null,
        };
      }
    }
}
