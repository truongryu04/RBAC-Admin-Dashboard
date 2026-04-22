import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import CreateRoleDto from '../dto/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  createRole(@Body(new ValidationPipe()) createRoleData: CreateRoleDto) {
    return this.roleService.createRole(createRoleData);
  }
}
