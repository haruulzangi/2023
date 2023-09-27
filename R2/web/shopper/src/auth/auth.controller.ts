import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Body, Controller, UseGuards, Post, Request } from '@nestjs/common';

import { UserDto } from './dto/user';
import { SigninDto, SigninResponse, SignupDto } from './dto/auth';

import { AuthService } from './auth.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({ type: UserDto })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  async signup(@Body() data: SignupDto): Promise<UserDto> {
    const user = await this.authService.signup(data);
    return UserDto.fromEntity(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: SigninDto })
  @ApiCreatedResponse({ type: SigninResponse })
  async login(@Request() req: Express.Request) {
    return this.authService.login(req.user);
  }
}
