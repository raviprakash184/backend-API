import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(categoryId,subCategoryId,createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel({...createProductDto, category: categoryId, subCategory: subCategoryId});
    return product.save();
  }

  async findAll(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ data: Product[]; total: number; page?: number; limit?: number }> {
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    let data: Product[];
    let total: number;
    if (!page && !limit && !search) {
      data = await this.productModel
        .find(query)
        // .sort({ displayOrder: 1 })
        .populate('category')
        .populate('subCategory')
        .populate('brand')
        .exec();
      total = data.length;
      return { data, total };
    }
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    const skip = (pageNum - 1) * limitNum;
    [data, total] = await Promise.all([
      this.productModel
        .find(query)
        // .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limitNum)
        .populate('category')
        .populate('subCategory')
        .populate('brand')
        .exec(),
      this.productModel.countDocuments(query)
    ]);
    return { data, total, page: pageNum, limit: limitNum };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .populate('subCategory')
      .populate('brand')
      .exec();

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string,updateProductDto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, {...updateProductDto}, { new: true });
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Product not found');
  }

  async getProductsByCategory(
    categoryId: string,
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ data: Product[]; total: number; page?: number; limit?: number }> {
    const query: any = { category: categoryId };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    let data: Product[];
    let total: number;
    if (!page && !limit && !search) {
      data = await this.productModel
        .find(query)
        // .sort({ displayOrder: 1 })
        .populate('category')
        .populate('subCategory')
        .populate('brand')
        .exec();
      total = data.length;
      if (!data.length) throw new NotFoundException('No products found for this category');
      return { data, total };
    }
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    const skip = (pageNum - 1) * limitNum;
    [data, total] = await Promise.all([
      this.productModel
        .find(query)
        // .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limitNum)
        .populate('category')
        .populate('subCategory')
        .populate('brand')
        .exec(),
      this.productModel.countDocuments(query)
    ]);
    if (!data.length) throw new NotFoundException('No products found for this category');
    return { data, total, page: pageNum, limit: limitNum };
  }

  async getProductsBySubCategory(
    subCategoryId: string,
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ data: Product[]; total: number; page?: number; limit?: number }> {
    const query: any = { subCategory: subCategoryId };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    let data: Product[];
    let total: number;
    if (!page && !limit && !search) {
      data = await this.productModel
        .find(query)
        // .sort({ displayOrder: 1 })
        .populate('category')
        .populate('subCategory')
        .populate('brand')
        .exec();
      total = data.length;
      if (!data.length) throw new NotFoundException('No products found for this sub-category');
      return { data, total };
    }
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    const skip = (pageNum - 1) * limitNum;
    [data, total] = await Promise.all([
      this.productModel
        .find(query)
        // .sort({ displayOrder: 1 })
        .skip(skip)
        .limit(limitNum)
        .populate('category')
        .populate('subCategory')
        .populate('brand')
        .exec(),
      this.productModel.countDocuments(query)
    ]);
    if (!data.length) throw new NotFoundException('No products found for this sub-category');
    return { data, total, page: pageNum, limit: limitNum };
  }
}