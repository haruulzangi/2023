import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/auth/user.entity';
import { CartEntity } from 'src/cart/cart.entity';

import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, CartEntity, UserEntity])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
