import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoleService } from 'src/modules/role/services/role.service';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  async onModuleInit() {
    const enabled = this.configService.get<string>('SEED_ADMIN') === 'true';
    if (!enabled) return;

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminUsername =
      this.configService.get<string>('ADMIN_USERNAME') ?? 'admin';

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'SEED_ADMIN=true nhưng thiếu ADMIN_EMAIL/ADMIN_PASSWORD; bỏ qua seed.',
      );
      return;
    }

    const adminRole = await this.roleService.findRoleByName('Admin');
    if (!adminRole) {
      await this.roleService.createRole({
        name: 'Admin',
        description: 'System administrator',
      });
      this.logger.log('Seeded role: Admin');
    }

    const existedUser = await this.userService.findByEmail(adminEmail);
    if (!existedUser) {
      await this.userService.createUser({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        roleName: 'Admin',
        status: 'ACTIVE',
      });
      this.logger.log(`Seeded admin user: ${adminEmail}`);
    } else {
      this.logger.log(`Admin user already exists: ${adminEmail}`);
    }
  }
}
