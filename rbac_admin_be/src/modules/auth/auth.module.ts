import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    RoleModule,
    JwtModule.register({
      secret: jwtConfig.accessToken.secret,
      signOptions: {
        expiresIn: jwtConfig.accessToken.expiresIn,
      },
    }),
  ],
})
export class AuthModule {}
