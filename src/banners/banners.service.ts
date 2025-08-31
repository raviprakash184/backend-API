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

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<{ data: Banner[]; total: number; page: number; limit: number }> {
    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit = options?.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (options?.search) {
      filter.$or = [
        { title: { $regex: options.search, $options: 'i' } },
        { description: { $regex: options.search, $options: 'i' } }
      ];
    }
    let sort: any = {};
    if (options?.sort) {
      options.sort.split(',').forEach((field) => {
        if (field.startsWith('-')) {
          sort[field.substring(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    } else {
      sort = { displayOrder: 1, priority: -1 };
    }
    const [data, total] = await Promise.all([
      this.bannerModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.bannerModel.countDocuments(filter)
    ]);
    return { data, total, page, limit };
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
