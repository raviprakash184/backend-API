// src/cart/dto/update-cart.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {}
