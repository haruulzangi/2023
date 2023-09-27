import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyPromoDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;
}
