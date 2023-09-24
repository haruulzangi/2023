import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

import { ProductDto } from 'src/product/dto/product';

import { CartEntity } from '../cart.entity';
import { CartProductEntity } from '../cart-product.entity';

export class AddToCartDto {
  @ApiProperty({ format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({ minimum: 1 })
  @IsPositive()
  quantity: number;
}

export class CartProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  product: ProductDto;

  static fromEntity(data: CartProductEntity): CartProductDto {
    const dto = new CartProductDto();
    dto.id = data.id;
    dto.quantity = data.quantity;
    dto.totalPrice = data.product.price * data.quantity;
    dto.product = ProductDto.fromEntity(data.product);
    return dto;
  }
}

export class CartDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  cashback: number;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: [CartProductDto] })
  products: CartProductDto[];

  static fromEntity(data: CartEntity): CartDto {
    const dto = new CartDto();
    dto.id = data.id;
    dto.cashback = data.cashback;
    dto.products = data.products.map((product) =>
      CartProductDto.fromEntity(product),
    );
    dto.total = dto.products.reduce(
      (total, product) => total + product.totalPrice,
      0,
    );
    return dto;
  }
}
