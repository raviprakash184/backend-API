import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
 
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}
  async countCategories(): Promise<number> {
    return this.categoryModel.countDocuments();
  }
  async updateOrder(order: { _id: string; displayOrder: number }[]): Promise<void> {
    
    
    // Validate unique displayOrder values in payload
    const displayOrders = order.map(item => item.displayOrder);
   // console.log('New displayOrder values:', displayOrders);
    const hasDuplicates = displayOrders.length !== new Set(displayOrders).size;
    if (hasDuplicates) {
      throw new BadRequestException('Duplicate displayOrder values detected in payload');
    }
    
    // Check if payload contains all categories (should match total count)
    const totalCategories = await this.categoryModel.countDocuments();
    if (order.length !== totalCategories) {
      throw new BadRequestException(`Payload must contain all ${totalCategories} categories, received ${order.length}`);
    }
    
    // Step 1: Set all displayOrder to negative values first to avoid conflicts
    const tempOps = order.map((item, index) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { displayOrder: -(index + 1) } }
      }
    }));
    await this.categoryModel.bulkWrite(tempOps);
    
    // Step 2: Set final displayOrder values
    const finalOps = order.map(item => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { displayOrder: item.displayOrder } }
      }
    }));
    await this.categoryModel.bulkWrite(finalOps);
    
    console.log('Category order updated successfully');
  }
  async create(createDto: CreateCategoryDto): Promise<Category> {
      const existing = await this.categoryModel.findOne({ name: createDto.name });
    if (existing) {
      throw new BadRequestException('Category name already exists');
    }
    const category = new this.categoryModel(createDto);
    return category.save();
  }

  async findAll({ page, limit, search }: { page?: number; limit?: number; search?: string } = {}): Promise<{ data: Category[]; total: number; page?: number; limit?: number }> {
    const query: any = {};
    // If search is provided, filter by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    // If page, limit, or search is provided, use pagination/search
    if (page || limit || search) {
      const pageNum = page ? Number(page) : 1;
      const limitNum = limit ? Number(limit) : 10;
      const skip = (pageNum - 1) * limitNum;
      const [data, total] = await Promise.all([
        this.categoryModel.find(query).sort({ displayOrder: 1 }).skip(skip).limit(limitNum).exec(),
        this.categoryModel.countDocuments(query)
      ]);
      return { data, total, page: pageNum, limit: limitNum };
    } else {
      // If no pagination or search, return all data
      const data = await this.categoryModel.find({}).sort({ displayOrder: 1 }).exec();
      const total = data.length;
      return { data, total };
    }
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    if (updateDto.name) {
      const existing = await this.categoryModel.findOne({ name: updateDto.name, _id: { $ne: id } });
      if (existing) {
        throw new BadRequestException('Category name already exists');
      }
    }
    const updated = await this.categoryModel.findByIdAndUpdate(id, updateDto, { new: true });
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Category not found');
    // After delete, rearrange displayOrder for all categories
    const categories = await this.categoryModel.find({}).sort({ displayOrder: 1 }).exec();
    const ops = categories.map((cat, idx) => ({
      updateOne: {
        filter: { _id: cat._id },
        update: { $set: { displayOrder: idx + 1 } }
      }
    }));
    if (ops.length > 0) {
      await this.categoryModel.bulkWrite(ops);
    }
  }
}
