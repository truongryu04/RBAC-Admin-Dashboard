import { Injectable, NotFoundException } from '@nestjs/common';

import RegisterDto from '../dto/register.dto';

import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/services/user.service';
import LoginDto from '../dto/login.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
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
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    console.log('Refresh token:', refresh_token);
    await this.refreshTokenRepository.save({
      user_id: user.id,
      token: refresh_token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
      },
      access_token: this.jwtService.sign(payload),
      refresh_token: refresh_token,
    };
  }
}
