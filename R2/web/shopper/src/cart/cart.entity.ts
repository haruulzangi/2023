import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/auth/user.entity';
import { CartProductEntity } from './cart-product.entity';

@Entity()
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  cashback: number;

  @OneToMany(() => CartProductEntity, (cartProduct) => cartProduct.cart, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  products: CartProductEntity[];

  @OneToOne(() => UserEntity, (user) => user.cart)
  user: UserEntity;
}
