import { Injectable, NotFoundException } from '@nestjs/common';

import RegisterDto from '../dto/register.dto';

import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/services/user.service';
import { UserRoleService } from 'src/modules/user/services/user-role.service';
import { RoleService } from 'src/modules/role/services/role.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerData: RegisterDto) {
    const userExist = await this.userService.validateUser(registerData.email);
    if (userExist) {
      throw new ConflictException('Email đã tồn tại');
    }
    const role = await this.roleService.findRoleByName('User');
    if (!role) {
      throw new NotFoundException('Role USER không tồn tại');
    }

    const newUser = await this.userService.createUser(registerData);
    await this.userRoleService.assignRole(newUser, role);

    return newUser;
  }
}
