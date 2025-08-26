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
    page = 1,
    limit = 10,
    search?: string
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const total = await this.productModel.countDocuments(query);
    const data = await this.productModel
      .find(query)
      .populate('category')
      .populate('subCategory')
      .populate('brand')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { data, total, page, limit };
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
    page = 1,
    limit = 10,
    search?: string
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const query: any = { category: categoryId };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const total = await this.productModel.countDocuments(query);
    const data = await this.productModel
      .find(query)
      .populate('category')
      .populate('subCategory')
      .populate('brand')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    if (!data.length) throw new NotFoundException('No products found for this category');
    return { data, total, page, limit };
  }

  async getProductsBySubCategory(
    subCategoryId: string,
    page = 1,
    limit = 10,
    search?: string
  ): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const query: any = { subCategory: subCategoryId };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const total = await this.productModel.countDocuments(query);
    const data = await this.productModel
      .find(query)
      .populate('category')
      .populate('subCategory')
      .populate('brand')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    if (!data.length) throw new NotFoundException('No products found for this sub-category');
    return { data, total, page, limit };
  }
}