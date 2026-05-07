import { Injectable, NotFoundException } from '@nestjs/common';

import RegisterDto from '../dto/register.dto';

import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/services/user.service';
import LoginDto from '../dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerData: RegisterDto) {
    const userExist = await this.userService.findByEmail(registerData.email);
    if (userExist) {
      throw new ConflictException('Email đã tồn tại');
    }

    return this.userService.createUser({
      ...registerData,
      roleName: 'User',
      status: 'PENDING',
    });
  }
  async login(loginData: LoginDto) {
    const user = await this.userService.validateUser(
      loginData.email,
      loginData.password,
    );
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    const payload = { email: user.email, sub: user.id, role: user.role.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
