import {
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotAcceptableResponse,
} from '@nestjs/swagger';
import {
  Get,
  Post,
  Request,
  UseGuards,
  Controller,
  ForbiddenException,
} from '@nestjs/common';

import { flag, flagId } from 'src/config';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { OrderDto } from './dto/order';
import { OrderService } from './order.service';

@Controller({ path: 'order', version: '1' })
export class OrderController {
  constructor(private orderService: OrderService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all orders' })
  @Get()
  async getOrders(@Request() req: Express.Request): Promise<OrderDto[] | null> {
    const orders = await this.orderService.getOrders(
      (req.user as any)?.username,
    );
    return orders?.map((orderEntity) => OrderDto.fromEntity(orderEntity));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Place an order' })
  @ApiResponse({ status: 402, description: 'Insufficient balance' })
  @ApiNotAcceptableResponse({ description: 'Cart is empty' })
  @ApiOkResponse({ type: OrderDto })
  @Post()
  async order(@Request() req: Express.Request): Promise<OrderDto> {
    return OrderDto.fromEntity(
      await this.orderService.order((req.user as any)?.username),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a flag' })
  @ApiOkResponse({ type: String })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @Get('/win')
  async win(@Request() req: Express.Request): Promise<string> {
    const orders = await this.orderService.getOrders(
      (req.user as any)?.username,
    );
    if (
      !orders.some((order) =>
        order.items.some((item) => item.product.id === flagId),
      )
    ) {
      throw new ForbiddenException();
    }
    return flag;
  }
}
