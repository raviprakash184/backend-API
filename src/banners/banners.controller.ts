import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BannerService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@ApiTags('Banner')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a banner' })
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all banners' })
  findAll() {
    return this.bannerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update banner by ID' })
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.update(id, updateBannerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete banner by ID' })
  remove(@Param('id') id: string) {
    return this.bannerService.remove(id);
  }
}
