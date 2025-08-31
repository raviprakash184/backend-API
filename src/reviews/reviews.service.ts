import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = new this.reviewModel(createReviewDto);
    return review.save();
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    product?: string;
    user?: string;
  }): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit = options?.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (options?.search) {
      filter.comment = { $regex: options.search, $options: 'i' };
    }
    if (options?.product) {
      filter.product = options.product;
    }
    if (options?.user) {
      filter.user = options.user;
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
      sort = { createdAt: -1 };
    }
    const [data, total] = await Promise.all([
      this.reviewModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.reviewModel.countDocuments(filter)
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException(`Review with id ${id} not found`);
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true });
    if (!review) throw new NotFoundException(`Review with id ${id} not found`);
    return review;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException(`Review with id ${id} not found`);
  }
}
