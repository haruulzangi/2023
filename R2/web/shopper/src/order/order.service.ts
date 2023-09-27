import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  HttpStatus,
  Injectable,
  HttpException,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';

import { UserEntity } from 'src/auth/user.entity';

import { OrderEntity } from './order.entity';

export class InsufficientBalanceException extends HttpException {
  constructor() {
    super('Insufficient balance', HttpStatus.PAYMENT_REQUIRED);
  }
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getOrders(username: string): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      where: { user: { username } },
    });
  }

  async order(username: string): Promise<OrderEntity> {
    const user = await this.userRepository.findOne({
      relations: { cart: { products: { product: true } } },
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.cart.products.length === 0) {
      throw new NotAcceptableException('Cart is empty');
    }

    const orderTotal = user.cart.products.reduce(
      (total, { quantity, product }) => total + quantity * product.price,
      0,
    );
    if (user.balance < orderTotal) {
      throw new InsufficientBalanceException();
    }

    const order = new OrderEntity();
    order.user = user;
    order.items = user.cart.products;
    order.cashback = user.cart.cashback;
    order.total = orderTotal;

    user.cart.products = [];
    user.cart.products.forEach((product) => {
      product.cart = null;
    });
    user.cart.cashback = 0;

    user.balance -= order.total;
    user.balance += order.total * (order.cashback / 100);
    if (!user.orders) {
      user.orders = [];
    }
    user.orders.push(order);
    await this.userRepository.save(user);

    return order;
  }
}
