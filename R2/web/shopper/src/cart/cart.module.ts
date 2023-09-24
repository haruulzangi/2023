import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/auth/user.entity';
import { ProductModule } from 'src/product/product.module';

import { CartEntity } from './cart.entity';
import { CartService } from './cart.service';
import { CartProductEntity } from './cart-product.entity';
import { CartController } from './cart.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartProductEntity, CartEntity, UserEntity]),
    ProductModule,
  ],
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController],
})
export class CartModule {}
