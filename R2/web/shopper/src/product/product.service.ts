import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async getAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find();
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    return await this.productRepository.save(product);
  }

  async getOne(id: string): Promise<ProductEntity | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(id: number, product: ProductEntity): Promise<UpdateResult> {
    return await this.productRepository.update(id, product);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.productRepository.delete(id);
  }
}
