import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';
import { SeedService } from './seed.service';

@Module({
  imports: [ConfigModule, RoleModule, UserModule],
  providers: [SeedService],
})
export class SeedModule {}
