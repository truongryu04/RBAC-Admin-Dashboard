import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import CreateRoleDto from '../dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async createRole(createRoleData: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(createRoleData);
    return this.roleRepository.save(newRole);
  }
}
