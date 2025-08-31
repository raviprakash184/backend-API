import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@ApiTags('Delivery') // 👈 Important for grouping in Swagger
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a delivery agent' })
  @ApiBody({ type: CreateDeliveryDto }) // 👈 This shows the body schema in Swagger
    async create(@Body() createDeliveryDto: CreateDeliveryDto) {
      try {
        const data = await this.deliveryService.create(createDeliveryDto);
        return {
          statusCode: 201,
          message: 'Delivery agent created successfully',
          data,
        };
      } catch (error) {
        if (error.code === 11000) {
          return {
            statusCode: 400,
            message: 'Duplicate delivery agent entry',
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
  @ApiOperation({ summary: 'Get all delivery agents with optional pagination, search, and sorting' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        search: { type: 'string', example: 'Ravi' },
        sortBy: { type: 'string', example: 'displayOrder' },
        sortOrder: { type: 'string', example: 'asc' },
      },
    },
    required: false,
  })
    async findAll(
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('search') search?: string,
      @Query('sortBy') sortBy?: string,
      @Query('sortOrder') sortOrder?: string,
    ) {
      try {
        const data = await this.deliveryService.findAll({ page, limit, search, sortBy, sortOrder });
        return {
          statusCode: 200,
          message: 'Delivery agents fetched successfully',
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
  @ApiOperation({ summary: 'Get a delivery agent by ID' })
    async findOne(@Param('id') id: string) {
      try {
        const data = await this.deliveryService.findOne(id);
        return {
          statusCode: 200,
          message: 'Delivery agent fetched successfully',
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update a delivery agent' })
  @ApiBody({ type: UpdateDeliveryDto })
    async update(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
      try {
        const data = await this.deliveryService.update(id, updateDeliveryDto);
        return {
          statusCode: 200,
          message: 'Delivery agent updated successfully',
          data,
        };
      } catch (error) {
        if (error.code === 11000) {
          return {
            statusCode: 400,
            message: 'Duplicate delivery agent entry',
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
  @ApiOperation({ summary: 'Delete a delivery agent' })
    async remove(@Param('id') id: string) {
      try {
        await this.deliveryService.remove(id);
        return {
          statusCode: 200,
          message: 'Delivery agent deleted successfully',
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
