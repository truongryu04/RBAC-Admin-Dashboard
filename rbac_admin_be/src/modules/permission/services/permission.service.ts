import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import CreatePermissionDto from '../dto/create-permission.dto';
import UpdatePermissionDto from '../dto/update-permission.dto';
import { RoleService } from 'src/modules/role/services/role.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly roleService: RoleService,
  ) {}

  private normalizeCode(code: string) {
    return code.trim().toLowerCase();
  }

  async create(dto: CreatePermissionDto) {
    const code = this.normalizeCode(dto.code);
    const existed = await this.permissionRepository.findOne({
      where: { code },
    });
    if (existed) {
      throw new ConflictException('Permission code đã tồn tại');
    }
    const permission = this.permissionRepository.create({
      code,
      description: dto.description?.trim(),
    });
    return this.permissionRepository.save(permission);
  }

  findAll() {
    return this.permissionRepository.find({ order: { id: 'ASC' } });
  }

  async findById(id: number) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission không tồn tại');
    }
    return permission;
  }

  async update(id: number, dto: UpdatePermissionDto) {
    const permission = await this.findById(id);

    if (dto.code?.trim()) {
      const nextCode = this.normalizeCode(dto.code);
      if (nextCode !== permission.code) {
        const existed = await this.permissionRepository.findOne({
          where: { code: nextCode },
        });
        if (existed) {
          throw new ConflictException('Permission code đã tồn tại');
        }
        permission.code = nextCode;
      }
    }

    if (dto.description !== undefined) {
      permission.description = dto.description?.trim();
    }

    return this.permissionRepository.save(permission);
  }

  async delete(id: number) {
    await this.findById(id);

    await this.roleService.removePermissionFromRoles(id);

    await this.permissionRepository.delete(id);

    return {
      message: 'Xoá permission thành công',
    };
  }

  async findByCodes(codes: string[]) {
    const normalized = [...new Set(codes.map((c) => this.normalizeCode(c)))];
    if (normalized.length === 0) return [];
    return this.permissionRepository.find({ where: { code: In(normalized) } });
  }
}
