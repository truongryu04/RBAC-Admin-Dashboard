import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../entities/user-role.entity';
import { User } from '../entities/user.entity';
import { Role } from 'src/modules/role/entities/role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async assignRole(user: User, role: Role): Promise<UserRole> {
    const userRole = this.userRoleRepository.create({ user, role });
    return this.userRoleRepository.save(userRole);
  }
}
