import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderEntity } from 'src/order/order.entity';
import { CartEntity } from 'src/cart/cart.entity';

export type UserRole = 'user' | 'admin';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user', enum: ['user', 'admin'] })
  role: UserRole;

  @Column()
  balance: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToOne(() => CartEntity, (cart) => cart.user, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  cart: CartEntity;

  @OneToMany(() => OrderEntity, (order) => order.user, { cascade: ['insert'] })
  orders: OrderEntity[];
}
