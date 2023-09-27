import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PromoEntity {
  @PrimaryColumn()
  code: string;

  @Column()
  cashback: number;

  @CreateDateColumn()
  createdAt: string;
  @Column()
  endsAt: string;
}
