import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { Permission } from '../permission/entities/permission.entity';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
  imports: [TypeOrmModule.forFeature([Role, Permission])],
})
export class RoleModule {}
