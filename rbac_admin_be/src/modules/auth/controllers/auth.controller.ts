import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import RegisterDto from '../dto/register.dto';
import { HttpStatus } from '@nestjs/common';
import LoginDto from '../dto/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() registerData: RegisterDto) {
    await this.authService.register(registerData);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Đăng ký thành công',
    };
  }
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() loginData: LoginDto) {
    const {
      user,
      access_token: access_token,
      refresh_token: refresh_token,
    } = await this.authService.login(loginData);
    return {
      statusCode: HttpStatus.OK,
      message: 'Đăng nhập thành công',
      data: { user, access_token: access_token, refresh_token: refresh_token },
    };
  }
}
