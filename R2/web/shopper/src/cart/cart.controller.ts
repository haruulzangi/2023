import {
  Get,
  Body,
  Post,
  Patch,
  Param,
  Request,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { CartEntity } from './cart.entity';
import { CartService } from './cart.service';
import { UpdateCartProductDto } from './dto/cart-product';
import { AddToCartDto, CartDto } from './dto/cart';

@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private cartService: CartService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cart' })
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: CartDto })
  @Get()
  async getCart(@Request() req: Express.Request): Promise<CartEntity | null> {
    return await this.cartService.getCart((req.user as any)?.username);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to cart' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ type: CartDto })
  async addToCart(
    @Body() body: AddToCartDto,
    @Request() req: Express.Request,
  ): Promise<CartEntity | null> {
    const { productId, quantity } = body;
    return await this.cartService.addToCart(
      productId,
      quantity,
      (req.user as any)?.username,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cart product' })
  @UseGuards(JwtAuthGuard)
  @Patch('product/:id')
  @ApiOkResponse({ type: CartDto })
  async updateCartProduct(
    @Param('id') id: number,
    @Body()
    body: UpdateCartProductDto,
    @Request() req: Express.Request,
  ) {
    return await this.cartService.updateCartProduct(
      id,
      body,
      (req.user as any)?.username,
    );
  }
}
