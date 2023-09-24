import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { CartDto } from 'src/cart/dto/cart';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { PromoService } from './promo.service';
import { ApplyPromoDto } from './dto/promo';

@Controller({ path: 'promo', version: '1' })
export class PromoController {
  constructor(private promoService: PromoService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Apply promocode',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiOkResponse({ type: CartDto })
  async applyPromo(
    @Req() req: Express.Request,
    @Body() { code }: ApplyPromoDto,
  ): Promise<CartDto> {
    return CartDto.fromEntity(
      await this.promoService.applyPromo(code, (req.user as any)?.username),
    );
  }
}
