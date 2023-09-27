import { ApiProperty } from '@nestjs/swagger';

import { ProductEntity } from '../product.entity';

export class ProductDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;

  static fromEntity(data: ProductEntity): ProductDto {
    const dto = new ProductDto();
    dto.id = data.id;
    dto.name = data.name;
    dto.description = data.description;
    dto.price = data.price;
    dto.createdAt = data.createdAt;
    dto.updatedAt = data.updatedAt;
    return dto;
  }
}
