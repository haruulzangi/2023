import { Repository } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { flagId } from './config';

import { AppModule } from './app.module';
import { PromoEntity } from './promo/promo.entity';
import { ProductEntity } from './product/product.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');
  app.enableVersioning();

  const config = new DocumentBuilder()
    .setTitle('Shopper')
    .setDescription('Shopper API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const promoRepository = app.get<Repository<PromoEntity>>(
    getRepositoryToken(PromoEntity),
  );
  const productRepository = app.get<Repository<ProductEntity>>(
    getRepositoryToken(ProductEntity),
  );
  if ((await productRepository.count()) === 0) {
    await productRepository.insert([
      {
        name: 'Pitaya',
        description:
          'Pitaya usually refers to fruit of the genus Stenocereus, while pitahaya or dragon fruit refers to fruit of the genus Selenicereus (formerly Hylocereus), both in the family Cactaceae. The common name in English – dragon fruit – derives from the leather-like skin and scaly spikes on the fruit exterior. Depending on the variety, pitaya fruits may have sweet- or sour-tasting flesh that can be red, white, or yellow in color.',
        price: 5,
      },
      {
        name: 'Durian',
        description:
          'The durian (/ˈdʊəriən/, /ˈdjʊəriən/) is the edible fruit of several tree species belonging to the genus Durio. There are 30 recognised Durio species, at least nine of which produce edible fruit. Durio zibethinus, native to Borneo and Sumatra, is the only species available on the international market. It has over 300 named varieties in Thailand and 100 in Malaysia as of 1987. Other species are sold in their local regions.',
        price: 10,
      },
      {
        id: flagId,
        name: 'Flag',
        description:
          'A flag is a piece of fabric (most often rectangular) with a distinctive design and colours. It is used as a symbol, a signalling device, or for decoration. The term flag is also used to refer to the graphic design employed, and flags have evolved into a general tool for rudimentary signalling and identification, especially in environments where communication is challenging (such as the maritime environment, where semaphore is used). Many flags fall into groups of similar designs called flag families. The study of flags is known as "vexillology" from the Latin vexillum, meaning "flag" or "banner".',
        price: 10000,
      },
    ]);
  }
  if ((await promoRepository.count()) === 0) {
    await promoRepository.insert({
      code: 'haruulzangi5',
      cashback: 5,
      endsAt: '2030-09-01T13:00:01.337Z',
    });
  }

  await app.listen(3000);
}
bootstrap();
