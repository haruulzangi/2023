import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  Controller,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import {
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';

@Controller({ path: 'products', version: '1' })
export class ProductController {
  constructor(private productsService: ProductService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<ProductEntity[]> {
    return await this.productsService.getAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new product' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: Express.Request,
    @Body() product: ProductEntity,
  ): Promise<ProductEntity> {
    if ((req.user as any)?.role !== 'admin') {
      throw new UnauthorizedException();
    }
    return await this.productsService.create(product);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product' })
  @ApiParam({ name: 'id', type: String })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiNotFoundResponse({ description: 'Product was not found' })
  async getOne(@Param('id') id: string): Promise<ProductEntity | null> {
    const product = await this.productsService.getOne(id);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', type: String })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() product: ProductEntity,
    @Request() req: Express.Request,
  ): Promise<UpdateResult> {
    if ((req.user as any)?.role !== 'admin') {
      throw new UnauthorizedException();
    }
    return await this.productsService.update(id, product);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', type: String })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Request() req: Express.Request,
  ): Promise<DeleteResult> {
    if ((req.user as any)?.role !== 'admin') {
      throw new UnauthorizedException();
    }
    return await this.productsService.delete(id);
  }
}
