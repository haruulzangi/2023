import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/auth/user.entity';

import { PromoEntity } from './promo.entity';
import { PromoService } from './promo.service';
import { PromoController } from './promo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PromoEntity, UserEntity])],
  providers: [PromoService],
  exports: [PromoService],
  controllers: [PromoController],
})
export class PromoModule {}
