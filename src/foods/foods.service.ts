import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Food, FoodDocument } from './schemas/food.schema';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodsService {
  constructor(@InjectModel(Food.name) private foodModel: Model<FoodDocument>) {}

  async create(createFoodDto: CreateFoodDto): Promise<Food> {
    const food = new this.foodModel(createFoodDto);
    return food.save();
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    restaurant?: string;
    category?: string;
  }): Promise<{ data: Food[]; total: number; page?: number; limit?: number }> {
    const filter: any = {};
    if (options?.search) {
      filter.name = { $regex: options.search, $options: 'i' };
    }
    if (options?.restaurant) {
      filter.restaurant = options.restaurant;
    }
    if (options?.category) {
      filter.categories = options.category;
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
      sort = { name: 1 };
    }
    const hasOptions = options?.page || options?.limit || options?.search || options?.sort || options?.restaurant || options?.category;
    if (hasOptions) {
      const page = options?.page && options.page > 0 ? options.page : 1;
      const limit = options?.limit && options.limit > 0 ? options.limit : 10;
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.foodModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
        this.foodModel.countDocuments(filter)
      ]);
      return { data, total, page, limit };
    } else {
      // If no options, return all data
      const data = await this.foodModel.find(filter).sort(sort).exec();
      const total = data.length;
      return { data, total };
    }
  }

  async findOne(id: string): Promise<Food> {
    const food = await this.foodModel.findById(id).exec();
    if (!food) throw new NotFoundException(`Food with id ${id} not found`);
    return food;
  }

  async update(id: string, updateFoodDto: UpdateFoodDto): Promise<Food> {
    const food = await this.foodModel.findByIdAndUpdate(id, updateFoodDto, { new: true });
    if (!food) throw new NotFoundException(`Food with id ${id} not found`);
    return food;
  }

  async remove(id: string): Promise<void> {
    const result = await this.foodModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException(`Food with id ${id} not found`);
  }
}
