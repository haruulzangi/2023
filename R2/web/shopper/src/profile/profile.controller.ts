import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  Get,
  Req,
  UseGuards,
  Controller,
  NotFoundException,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { ProfileService } from './profile.service';
import { UserDto } from 'src/auth/dto/user';

@Controller({ path: 'profile', version: '1' })
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ type: UserDto })
  @Get()
  async getProfile(@Req() req: Express.Request): Promise<UserDto> {
    const user = await this.profileService.getProfile(
      (req.user as any).username,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserDto.fromEntity(user);
  }
}
