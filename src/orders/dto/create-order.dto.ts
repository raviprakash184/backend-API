import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class OrderItem {
  @IsMongoId()
  product: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsMongoId()
  user: string;

  @IsArray()
  items: OrderItem[];

  @IsNumber()
  totalAmount: number;

  @IsMongoId()
  deliveryAddress: string;

  @IsString()
  paymentMethod: string;

  @IsString()
  paymentStatus: string;
}
