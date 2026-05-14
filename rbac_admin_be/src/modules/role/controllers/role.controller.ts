import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import CreateRoleDto from '../dto/create-role.dto';
import SetRolePermissionsDto from '../dto/set-role-permissions.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  createRole(@Body(new ValidationPipe()) createRoleData: CreateRoleDto) {
    return this.roleService.createRole(createRoleData);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findById(id);
  }

  @Put(':id/permissions')
  setPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SetRolePermissionsDto,
  ) {
    return this.roleService.setPermissions(id, dto.codes);
  }
}
