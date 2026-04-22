import { Injectable, NotFoundException } from '@nestjs/common';

import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import RegisterDto from '../dto/register.dto';
import { hashPassword } from 'src/common/utils/bcrypt.util';
import { ConflictException } from '@nestjs/common';
import { Role } from 'src/modules/role/entities/role.entity';
import { UserRole } from 'src/modules/user/entities/user-role.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}
  async register(registerData: RegisterDto) {
    const { username, email, password } = registerData;
    const userExist = await this.userRepository.findOne({
      where: { email: email, deleted: false },
    });
    if (userExist) {
      throw new ConflictException('Email đã tồn tại');
    }
    const hashedPassword = await hashPassword(password);
    const role = await this.roleRepository.findOne({
      where: { name: ILike('USER') },
    });
    if (!role) {
      throw new NotFoundException('Role USER không tồn tại');
    }
    const newUser = await this.userRepository.save(
      this.userRepository.create({
        username: username,
        email: email,
        password: hashedPassword,
      }),
    );
    await this.userRoleRepository.save({
      user: newUser,
      role: role,
    });

    return newUser;
  }
}
