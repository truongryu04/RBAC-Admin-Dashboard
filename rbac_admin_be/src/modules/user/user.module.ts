import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRoleService } from './services/user-role.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRoleService],
  exports: [UserService, UserRoleService],
  imports: [TypeOrmModule.forFeature([User, UserRole])], // Thêm các entity vào đây khi có
})
export class UserModule {}
