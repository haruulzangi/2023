import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CartEntity } from 'src/cart/cart.entity';
import { UserEntity } from 'src/auth/user.entity';

import { PromoEntity } from './promo.entity';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(PromoEntity)
    private promoRepository: Repository<PromoEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async applyPromo(code: string, username: string): Promise<CartEntity> {
    const promo = await this.promoRepository.findOneBy({ code });
    if (!promo) {
      throw new NotFoundException('Promocode was not found');
    }
    if (new Date() >= new Date(promo?.endsAt)) {
      throw new GoneException('Promocode has expired');
    }

    const user = await this.userRepository.findOne({
      relations: { cart: { products: { product: true } } },
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.cart) {
      user.cart = new CartEntity();
      user.cart.cashback = 0;
    }
    user.cart.cashback += promo.cashback;
    await this.userRepository.save(user);

    return user.cart;
  }
}
