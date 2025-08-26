import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(@InjectModel(Banner.name) private bannerModel: Model<BannerDocument>) {}

  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    const banner = new this.bannerModel(createBannerDto);
    return banner.save();
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerModel.find().exec();
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) throw new NotFoundException(`Banner with id ${id} not found`);
    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    const banner = await this.bannerModel.findByIdAndUpdate(id, updateBannerDto, { new: true });
    if (!banner) throw new NotFoundException(`Banner with id ${id} not found`);
    return banner;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bannerModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException(`Banner with id ${id} not found`);
  }
}
