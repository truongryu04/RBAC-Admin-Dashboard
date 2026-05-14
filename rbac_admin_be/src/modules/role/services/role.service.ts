import { Injectable, NotFoundException } from '@nestjs/common';

import { ILike, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import CreateRoleDto from '../dto/create-role.dto';
import { Permission } from 'src/modules/permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async createRole(createRoleData: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(createRoleData);
    return this.roleRepository.save(newRole);
  }

  findAll() {
    return this.roleRepository.find({ order: { id: 'ASC' } });
  }

  async findById(id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role không tồn tại');
    }
    return role;
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { name: ILike(name) } });
  }

  private normalizeCode(code: string) {
    return code.trim().toLowerCase();
  }

  async setPermissions(roleId: number, permissionCodes: string[]) {
    const role = await this.findById(roleId);

    const normalized = [
      ...new Set(permissionCodes.map((c) => this.normalizeCode(c))),
    ];

    const permissions = await this.permissionRepository.find({
      where: { code: In(normalized) },
      order: { id: 'ASC' },
    });

    if (permissions.length !== normalized.length) {
      const found = new Set(permissions.map((p) => p.code));
      const missing = normalized.filter((c) => !found.has(c));
      throw new NotFoundException(
        `Permission không tồn tại: ${missing.join(', ')}`,
      );
    }

    role.permissions = permissions;
    return this.roleRepository.save(role);
  }
  async getPermissions(roleId: number) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role không tồn tại');
    }

    return role.permissions;
  }
  async removePermissionFromRoles(permissionId: number): Promise<void> {
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('permission.id = :permissionId', {
        permissionId,
      })
      .getMany();

    for (const role of roles) {
      role.permissions = role.permissions.filter((p) => p.id !== permissionId);

      await this.roleRepository.save(role);
    }
  }
}
