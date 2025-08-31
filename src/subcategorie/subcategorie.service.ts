import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory } from './schemas/subcategory.schema';
import { CreateSubCategoryDto } from './dto/create-subcategorie.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategorie.dto';
import { Category } from '../category/schemas/category.schema';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectModel(SubCategory.name)
    private subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  // Helper method to get category name by categoryId
  async getCategoryName(categoryId: string): Promise<string | null> {
    console.log('Getting category name for categoryId:', categoryId);
    const category = await this.categoryModel.findById(categoryId).select('name');
    return category ? category.name : null;
  }

  // Update subcategory order (similar to category)
  async updateOrder(order: { _id: string; displayOrder: number }[]): Promise<void> {
    console.log('Updating subcategory order:', order);
    
    // Validate unique displayOrder values in payload
    const displayOrders = order.map(item => item.displayOrder);
    const hasDuplicates = displayOrders.length !== new Set(displayOrders).size;
    if (hasDuplicates) {
      throw new BadRequestException('Duplicate displayOrder values detected in payload');
    }
    
    // Check if payload contains all subcategories (should match total count)
    const totalSubcategories = await this.subCategoryModel.countDocuments();
    if (order.length !== totalSubcategories) {
      throw new BadRequestException(`Payload must contain all ${totalSubcategories} subcategories, received ${order.length}`);
    }
    
    // Step 1: Set all displayOrder to negative values first to avoid conflicts
    const tempOps = order.map((item, index) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { displayOrder: -(index + 1) } }
      }
    }));
    await this.subCategoryModel.bulkWrite(tempOps);
    
    // Step 2: Set final displayOrder values
    const finalOps = order.map(item => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { displayOrder: item.displayOrder } }
      }
    }));
    await this.subCategoryModel.bulkWrite(finalOps);
    
    console.log('Subcategory order updated successfully');
  }

  async create(dto: CreateSubCategoryDto): Promise<SubCategory> {
    const subcategory = new this.subCategoryModel(dto);
    return subcategory.save();
  }

  async findAll({ page, limit, search }: { page?: number; limit?: number; search?: string } = {}): Promise<{ data: SubCategory[]; total: number; page?: number; limit?: number }> {
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    let data: SubCategory[];
    let total: number;
    if (!page && !limit && !search) {
      data = await this.subCategoryModel.find(query).sort({ displayOrder: 1 }).populate('category').exec();
      total = data.length;
      // Add category name to each subcategory
      const dataWithCategoryName = await Promise.all(
        data.map(async (subcategory) => {
        //  console.log('subcategory.parentCategory:', subcategory);
          const categoryName = await this.getCategoryName((subcategory as any).category || subcategory.category);
          return { ...((subcategory as any).toObject()), categoryName };
        })
      );
      return { data: dataWithCategoryName, total };
    }
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    const skip = (pageNum - 1) * limitNum;
    [data, total] = await Promise.all([
      this.subCategoryModel.find(query).sort({ displayOrder: 1 }).skip(skip).limit(limitNum).populate('category').exec(),
      this.subCategoryModel.countDocuments(query)
    ]);
    // Add category name to each subcategory
    const dataWithCategoryName = await Promise.all(
      data.map(async (subcategory) => {
        console.log('subcategory.parentCategory1:', subcategory);
        const categoryName = await this.getCategoryName((subcategory as any).category || subcategory.category);
        return { ...((subcategory as any).toObject()), categoryName };
      })
    );
    return { data: dataWithCategoryName, total, page: pageNum, limit: limitNum };
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
    // After delete, rearrange displayOrder for all subcategories
    const subcategories = await this.subCategoryModel.find({}).sort({ displayOrder: 1 }).exec();
    const ops = subcategories.map((subcat, idx) => ({
      updateOne: {
        filter: { _id: subcat._id },
        update: { $set: { displayOrder: idx + 1 } }
      }
    }));
    if (ops.length > 0) {
      await this.subCategoryModel.bulkWrite(ops);
    }
  }
}
