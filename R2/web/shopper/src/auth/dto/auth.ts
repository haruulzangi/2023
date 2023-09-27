import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignupDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ format: 'password' })
  @IsNotEmpty()
  password: string;
}

export class SigninDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ format: 'password' })
  @IsNotEmpty()
  password: string;
}

export class SigninResponse {
  @ApiProperty()
  accessToken: string;
}
