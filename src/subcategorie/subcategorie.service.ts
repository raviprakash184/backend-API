import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory } from './schemas/subcategory.schema';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<SubCategory>,
  ) {}

  async create(dto: CreateSubCategoryDto): Promise<SubCategory> {
    const subcategory = new this.subCategoryModel(dto);
    return subcategory.save();
  }

  async findAll(): Promise<SubCategory[]> {
    return this.subCategoryModel.find().populate('category').exec();
  }

  async findOne(id: string): Promise<SubCategory> {
    const subcategory = await this.subCategoryModel.findById(id).populate('category');
    if (!subcategory) throw new NotFoundException('Subcategory not found');
    return subcategory;
  }

  async findByCategoryId(categoryId: string): Promise<SubCategory[]> {
  const subcategories = await this.subCategoryModel
    .find({ category: categoryId })
    .populate('category')
    .exec();

  if (!subcategories || subcategories.length === 0) {
    throw new NotFoundException('No subcategories found for this category');
  }

  return subcategories;
}


  async update(id: string, dto: UpdateSubCategoryDto): Promise<SubCategory> {
    const updated = await this.subCategoryModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Subcategory not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.subCategoryModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Subcategory not found');
  }
}
 