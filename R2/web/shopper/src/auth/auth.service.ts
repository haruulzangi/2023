import * as argon2 from 'argon2';

import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable } from '@nestjs/common';

import { SignupDto } from './dto/auth';
import { UserEntity } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwt: JwtService,
  ) {}

  async signup(data: SignupDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.username = data.username;
    user.password = await argon2.hash(data.password);
    user.balance = 10;
    try {
      return await this.userRepository.save(user);
    } catch (err) {
      if ('code' in err && err.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const foundUser = await this.userRepository.findOne({
      where: { username },
    });
    if (!foundUser) {
      return null;
    }

    const verified = await argon2.verify(foundUser.password, password);
    if (!verified) {
      return null;
    }

    const result: Omit<UserEntity, 'password'> & { password?: string } = {
      ...foundUser,
    };
    delete result['password'];
    return result;
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      accessToken: this.jwt.sign(payload),
    };
  }
}
