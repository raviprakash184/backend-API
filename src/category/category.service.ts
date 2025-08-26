import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {}

  async create(createDto: CreateCategoryDto): Promise<Category> {
      const existing = await this.categoryModel.findOne({ name: createDto.name });
    if (existing) {
      throw new BadRequestException('Category name already exists');
    }
    const category = new this.categoryModel(createDto);
    return category.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
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
  }
}
