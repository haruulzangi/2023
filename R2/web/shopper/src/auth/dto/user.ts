import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../user.entity';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  role: string;

  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;

  static fromEntity(user: UserEntity): UserDto {
    const result = new UserDto();
    result.id = user.id;
    result.username = user.username;
    result.balance = user.balance;
    result.role = user.role;
    result.createdAt = user.createdAt;
    result.updatedAt = result.updatedAt;
    return result;
  }
}
