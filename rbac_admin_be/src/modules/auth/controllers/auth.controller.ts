import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import RegisterDto from '../dto/register.dto';
import { HttpStatus } from '@nestjs/common';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body(new ValidationPipe()) registerData: RegisterDto) {
    await this.authService.register(registerData);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Đăng ký thành công',
    };
  }
}
