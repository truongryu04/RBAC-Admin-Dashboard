import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { comparePassword, hashPassword } from 'src/common/utils/bcrypt.util';
import { RoleService } from 'src/modules/role/services/role.service';
import { CreateUserDto } from '../dto/create-user.dto';

type CreateUserInput = Pick<User, 'username' | 'email' | 'password'> & {
  roleName?: string;
  status?: string;
};
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}
  getUser(): Promise<User[]> {
    return this.userRepository.find();
  }
  async createUser(user: CreateUserDto): Promise<User> {
    if (!user.password?.trim()) {
      throw new Error('Mật khẩu không hợp lệ');
    }

    const roleName = user.roleName ?? 'User';
    const role = await this.roleService.findRoleByName(roleName);
    if (!role) {
      throw new Error(`Role ${roleName} không tồn tại`);
    }

    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
    const { roleName: _roleName, status, ...userData } = user;
    const newUser = this.userRepository.create(userData);
    newUser.role = role;
    newUser.status = status ?? 'PENDING';
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, deleted: false },
      relations: { role: true },
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .andWhere('user.deleted = :deleted', { deleted: false })
      .getOne();
    if (!user) {
      return null;
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return null;
    }
    return user;
  }
}
