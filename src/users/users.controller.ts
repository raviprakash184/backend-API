import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async create(@Body() dto: CreateUserDto, @UploadedFile() file?: any) {
    try {
      if (file) {
        dto.photo = `/uploads/users/${file.filename}`;
      }
      const user = await this.usersService.create(dto);
      return { statusCode: 201, message: 'User created successfully', data: user };
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users (pagination/search optional)' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (optional)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page for pagination (optional)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name (optional)' })
  async getAllUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    try {
      const result = await this.usersService.findAll(page, limit, search);
      return { statusCode: 200, message: 'Users fetched successfully', data: result };
    } catch (error) {
      return { statusCode: 500, message: error.message || 'Server error' };
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(id);
      return { statusCode: 200, message: 'User fetched successfully', data: user };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'User not found' };
    }
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: any,
  ) {
    try {
      if (file) {
        dto.photo = `/uploads/users/${file.filename}`;
      }
      const user = await this.usersService.update(id, dto);
      return { statusCode: 200, message: 'User updated successfully', data: user };
    } catch (error) {
      if (error.code === 11000) {
        return { statusCode: 400, message: 'Duplicate field value', error: error.keyValue };
      }
      return { statusCode: error.status || 404, message: error.message || 'User not found' };
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const result = await this.usersService.delete(id);
      return { statusCode: 200, message: result.message };
    } catch (error) {
      return { statusCode: error.status || 404, message: error.message || 'User not found' };
    }
  }
}
