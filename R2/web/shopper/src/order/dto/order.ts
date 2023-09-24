import { ApiProperty } from '@nestjs/swagger';

import { CartProductDto } from 'src/cart/dto/cart';

import { OrderEntity } from '../order.entity';

export class OrderDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ type: [CartProductDto] })
  items: CartProductDto[];

  @ApiProperty()
  cashback: number;

  @ApiProperty()
  total: number;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  static fromEntity(data: OrderEntity): OrderDto {
    const dto = new OrderDto();
    dto.id = data.id;
    dto.items = data.items.map((cartProduct) =>
      CartProductDto.fromEntity(cartProduct),
    );
    dto.cashback = data.cashback;
    dto.total = data.total;
    dto.createdAt = data.createdAt;
    dto.updatedAt = data.updatedAt;
    return dto;
  }
}
