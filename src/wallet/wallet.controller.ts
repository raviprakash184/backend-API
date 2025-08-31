import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
	constructor(private readonly walletService: WalletService) {}

	@Post()
	@ApiOperation({ summary: 'Create wallet' })
	@ApiBody({ type: CreateWalletDto })
		async create(@Body() createWalletDto: CreateWalletDto) {
			try {
				const wallet = await this.walletService.create(createWalletDto);
				return { statusCode: 201, message: 'Wallet created successfully', data: wallet };
			} catch (error) {
				if (error.code === 11000) {
					return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
				}
				return { statusCode: 500, message: error.message || 'Server error' };
			}
		}

	@Get()
	@ApiOperation({ summary: 'Get all wallets' })
		async findAll() {
			try {
				const result = await this.walletService.findAll();
				return { statusCode: 200, message: 'Wallets fetched successfully', data: result };
			} catch (error) {
				return { statusCode: 500, message: error.message || 'Server error' };
			}
		}

	@Get(':id')
	@ApiOperation({ summary: 'Get wallet by ID' })
		async findOne(@Param('id') id: string) {
			try {
				const wallet = await this.walletService.findOne(id);
				return { statusCode: 200, message: 'Wallet fetched successfully', data: wallet };
			} catch (error) {
				return { statusCode: error.status || 404, message: error.message || 'Wallet not found' };
			}
		}

	@Patch(':id')
	@ApiOperation({ summary: 'Update wallet' })
	@ApiBody({ type: UpdateWalletDto })
		async update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
			try {
				const wallet = await this.walletService.update(id, updateWalletDto);
				return { statusCode: 200, message: 'Wallet updated successfully', data: wallet };
			} catch (error) {
				if (error.code === 11000) {
					return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
				}
				return { statusCode: error.status || 404, message: error.message || 'Wallet not found' };
			}
		}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete wallet' })
		async remove(@Param('id') id: string) {
			try {
				await this.walletService.remove(id);
				return { statusCode: 200, message: 'Wallet deleted successfully' };
			} catch (error) {
				return { statusCode: error.status || 404, message: error.message || 'Wallet not found' };
			}
		}
}
