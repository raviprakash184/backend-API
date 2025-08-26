import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all delivery agents' })
  findAll() {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a delivery agent by ID' })
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a delivery agent' })
  @ApiBody({ type: UpdateDeliveryDto })
  update(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveryService.update(id, updateDeliveryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a delivery agent' })
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(id);
  }
}
