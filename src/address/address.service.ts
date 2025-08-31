  // Helper method to get username by userId
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from './schemas/address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from 'src/users/schema/user.schema';
import mongoose from 'mongoose';
import { get } from 'http';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Helper method to get username by userId
  async getUserName(userId: string): Promise<string | null> {
    const user = await this.userModel.findById(userId).select('name');
    return user ? user.name : null;
  }

  async create(userId: string, createDto: CreateAddressDto): Promise<Address> {
    const newAddress = new this.addressModel({
      ...createDto,
      user: userId,
    });

    const address = await newAddress.save();

    // Add address to user's addresses array
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { addresses: address._id },
      // Optionally set as default if isDefault is true
      ...(createDto.isDefault ? { defaultAddressId: address._id } : {}),
    });

    return address;
  }

  async findByuserID(userId: string, page?: number, limit?: number, search?: string): Promise<{ data: Address[]; total: number; page?: number; limit?: number }> {
    const query: any = { user: userId };
    if (search) query.city = { $regex: search, $options: 'i' };
      if (page || limit || search) {
        const pageNum = page ? Number(page) : 1;
        const limitNum = limit ? Number(limit) : 10;
        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
          this.addressModel.find(query).skip(skip).limit(limitNum).exec(),
          this.addressModel.countDocuments(query)
        ]);
        return { data, total, page: pageNum, limit: limitNum };
      } else {
        const data = await this.addressModel.find(query).exec();
        const total = data.length;
        return { data, total };
      }
  }

  async findAll(page?: number, limit?: number, search?: string): Promise<{ data: Address[]; total: number; page?: number; limit?: number }> {
    const query: any = {};
    if (search) {
      const orConditions: any[] = [
        { street: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { pincode: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { addressType: { $regex: search, $options: 'i' } },
        { landmark: { $regex: search, $options: 'i' } }
      ];
      // For user field, match ObjectId string
      if (/^[a-fA-F0-9]{24}$/.test(search)) {
        orConditions.push({ user: new mongoose.Types.ObjectId(search) });
      }
      query.$or = orConditions;
    }
    let data: Address[];
    let total: number;
    if (!page && !limit && !search) {
      data = await this.addressModel.find(query).exec();
      total = data.length;
      // Add username to each address
      const dataWithUsername = await Promise.all(
        data.map(async (address) => {
          const username = await this.getUserName(address.user);
          return { ...((address as any).toObject()), username };
        })
      );
      return { data: dataWithUsername, total };
    }
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    const skip = (pageNum - 1) * limitNum;
    [data, total] = await Promise.all([
      this.addressModel.find(query).skip(skip).limit(limitNum).exec(),
      this.addressModel.countDocuments(query)
    ]);
    // Add username to each address
    const dataWithUsername = await Promise.all(
      data.map(async (address) => {
        const username = await this.getUserName(address.user);
        return { ...((address as any).toObject()), username };
      })
    );
    return { data: dataWithUsername, total, page: pageNum, limit: limitNum };
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressModel.findById(id);
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(id: string, updateDto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // If isDefault is true, update the user's defaultAddressId
    if (updateDto.isDefault) {
      const userId = address.user?.toString();
      if (userId) {
        await this.userModel.findByIdAndUpdate(userId, {
          defaultAddressId: address._id,
        });
      }
    }

    return address;
  }

  async remove(id: string): Promise<void> {
    const address = await this.addressModel.findByIdAndDelete(id);
    if (!address) throw new NotFoundException('Address not found');

    // Remove address from user's addresses array
    await this.userModel.findByIdAndUpdate(address.user, {
      $pull: { addresses: address._id },
    });

    // If deleted address was default, unset defaultAddressId
    const user = await this.userModel.findById(address.user);
    if (user && user.defaultAddressId?.toString() === String(address._id)) {
      user.defaultAddressId = null;
      await user.save();
    }
  }
}