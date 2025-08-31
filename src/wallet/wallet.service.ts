import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
	constructor(@InjectModel(Wallet.name) private walletModel: Model<WalletDocument>) {}

	async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
		const wallet = new this.walletModel(createWalletDto);
		return wallet.save();
	}

	async findAll(): Promise<Wallet[]> {
		return this.walletModel.find().populate('user');
	}

	async findOne(id: string): Promise<Wallet> {
		const wallet = await this.walletModel.findById(id).populate('user');
		if (!wallet) throw new NotFoundException('Wallet not found');
		return wallet;
	}

	async update(id: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
		const wallet = await this.walletModel.findByIdAndUpdate(id, updateWalletDto, { new: true });
		if (!wallet) throw new NotFoundException('Wallet not found');
		return wallet;
	}

	async remove(id: string): Promise<void> {
		const result = await this.walletModel.findByIdAndDelete(id);
		if (!result) throw new NotFoundException('Wallet not found');
	}
}
