import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { OrderEntity } from 'src/order/order.entity';
import { ProductEntity } from 'src/product/product.entity';

import { CartEntity } from './cart.entity';

@Entity()
export class CartProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, { eager: true })
  product: ProductEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.products, {
    cascade: ['remove'],
    nullable: true,
  })
  cart: CartEntity | null;
  @ManyToOne(() => OrderEntity, (order) => order.items, { nullable: true })
  order?: OrderEntity;
}
