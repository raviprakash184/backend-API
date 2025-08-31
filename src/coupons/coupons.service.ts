import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const coupon = new this.couponModel(createCouponDto);
    return coupon.save();
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }): Promise<{ data: Coupon[]; total: number; page: number; limit: number }> {
    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit = options?.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (options?.search) {
      filter.$or = [
        { code: { $regex: options.search, $options: 'i' } },
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
      sort = { startDate: -1 };
    }
    const [data, total] = await Promise.all([
      this.couponModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.couponModel.countDocuments(filter)
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) throw new NotFoundException(`Coupon with id ${id} not found`);
    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.couponModel.findByIdAndUpdate(id, updateCouponDto, { new: true });
    if (!coupon) throw new NotFoundException(`Coupon with id ${id} not found`);
    return coupon;
  }

  async remove(id: string): Promise<void> {
    const result = await this.couponModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException(`Coupon with id ${id} not found`);
  }
}
