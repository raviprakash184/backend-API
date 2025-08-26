import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from './schemas/address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

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

  async findByuserID(userId: string): Promise<Address[]> {
    return this.addressModel.find({ user: userId });
  }

  async findAll(): Promise<Address[]> {
    return this.addressModel.find({});
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