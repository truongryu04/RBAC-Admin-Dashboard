import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser() {
    return this.userService.getUser();
  }
  @Post()
  createUser(@Body() body: any) {
    return this.userService.createUser(body);
  }
}
