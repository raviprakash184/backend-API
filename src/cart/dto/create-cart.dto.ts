// src/cart/dto/create-cart.dto.ts
import { IsMongoId, IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateCartDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
