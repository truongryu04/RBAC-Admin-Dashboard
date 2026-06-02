import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUsersDto } from '../dto/get-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Query() query: GetUsersDto) {
    return {
      statusCode: 200,
      message: 'Get users success',
      data: await this.userService.findAll(query),
    };
  }
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }
}
