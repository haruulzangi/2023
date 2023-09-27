import { IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartProductDto {
  @ApiProperty({ minimum: 1 })
  @IsPositive()
  quantity: number;
}
