import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUsersDto } from '../dto/get-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
@Controller('users')
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
  async createUser(@Body() body: CreateUserDto) {
    return {
      statusCode: 201,
      message: 'Tạo người dùng thành công',
      data: await this.userService.createUser(body),
    };
  }
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      statusCode: 200,
      message: 'Thay đổi thành công',
      data: await this.userService.update(id, updateUserDto),
    };
  }
}
