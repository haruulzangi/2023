import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PromoModule } from './promo/promo.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/shopper.sqlite',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true,
    }),
    AuthModule,
    ProductModule,
    CartModule,
    OrderModule,
    PromoModule,
    ProfileModule,
  ],
  providers: [AppService],
})
export class AppModule {}
