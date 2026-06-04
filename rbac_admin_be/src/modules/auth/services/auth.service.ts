import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import RegisterDto from '../dto/register.dto';

import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/services/user.service';
import LoginDto from '../dto/login.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleService } from 'src/modules/role/services/role.service';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';

interface JwtPayload {
  sub: number;
  email?: string;
  role?: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
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
      status: UserStatus.ACTIVE,
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
    const role = await this.roleService.findRoleByName(user.role.name);
    const permissions = role?.permissions.map((p) => p.code) ?? [];
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role.name,
      permissions: permissions,
    };
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
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
      permissions: permissions,
      access_token: this.jwtService.sign(payload),
      refresh_token: refresh_token,
    };
  }
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const newAccessToken = this.jwtService.sign(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '1h',
      },
    );

    return {
      accessToken: newAccessToken,
    };
  }
  async logout(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }
    await this.refreshTokenRepository.delete({
      token: refreshToken,
    });
    return {
      message: 'Logout successful',
    };
  }
}
