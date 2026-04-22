import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { hashPassword } from 'src/common/utils/bcrypt.util';

type CreateUserInput = Pick<User, 'username' | 'email' | 'password'>;
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  getUser(): Promise<User[]> {
    return this.userRepository.find();
  }
  async createUser(user: CreateUserInput): Promise<User> {
    if (!user.password?.trim()) {
      throw new Error('Mật khẩu không hợp lệ');
    }
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async validateUser(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email, deleted: false },
    });
  }
}
