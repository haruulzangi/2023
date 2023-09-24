import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { UserEntity } from 'src/auth/user.entity';
import { ProductService } from 'src/product/product.service';

import { CartEntity } from './cart.entity';
import { CartProductEntity } from './cart-product.entity';
import { UpdateCartProductDto } from './dto/cart-product';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartProductEntity)
    private cartProductRepository: Repository<CartProductEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private productsService: ProductService,
  ) {}

  async getCart(username: string): Promise<CartEntity | null> {
    return await this.cartRepository.findOne({
      where: { user: { username } },
    });
  }

  async addToCart(
    productId: string,
    quantity: number,
    username: string,
  ): Promise<CartEntity | null> {
    const product = await this.productsService.getOne(productId);
    if (!product) {
      return null;
    }

    const user = await this.userRepository.findOne({
      relations: { cart: { products: { product: true } } },
      where: { username },
    });
    if (!user) {
      return null;
    }
    if (!user.cart) {
      user.cart = new CartEntity();
      user.cart.cashback = 0;
      user.cart.products = [];
    }

    let cartProduct = user.cart.products.find(
      (cartProduct) => cartProduct.product.id === productId,
    );
    if (!cartProduct) {
      cartProduct = new CartProductEntity();
      cartProduct.product = product;
      cartProduct.quantity = quantity;
      user.cart.products.push(cartProduct);
    } else {
      cartProduct.quantity += quantity;
    }

    await this.userRepository.save(user);
    return user.cart;
  }

  async updateCartProduct(
    cartProductId: number,
    data: UpdateCartProductDto,
    username: string,
  ): Promise<UpdateResult> {
    const cartProduct = await this.cartProductRepository.findOne({
      relations: { cart: { user: true } },
      where: { id: cartProductId },
    });
    if (!cartProduct || cartProduct.cart?.user.username !== username) {
      throw new ForbiddenException();
    }
    return await this.cartProductRepository.update({ id: cartProductId }, data);
  }
}
