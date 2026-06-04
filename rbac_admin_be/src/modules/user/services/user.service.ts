import { UpdateUserDto } from './../dto/update-user.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Like, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { comparePassword, hashPassword } from 'src/common/utils/bcrypt.util';
import { RoleService } from 'src/modules/role/services/role.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUsersDto } from '../dto/get-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { UserStatus } from '../enums/user-status.enum';
// type CreateUserInput = Pick<User, 'username' | 'email' | 'password'> & {
//   roleName?: string;
//   status?: string;
// };
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  private toResponse(user: User): ResponseUserDto {
    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      role: user.role.name,
      createdAt: user.createdAt,
    };
  }
  async createUser(user: CreateUserDto): Promise<User> {
    const existedEmail = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (existedEmail) {
      throw new ConflictException('Email đã tồn tại');
    }

    const existedPhone = await this.userRepository.findOne({
      where: { phone: user.phone },
    });

    if (existedPhone) {
      throw new ConflictException('Số điện thoại đã tồn tại');
    }
    if (!user.password?.trim()) {
      throw new BadRequestException('Mật khẩu không hợp lệ');
    }

    const roleName = user.roleName ?? 'User';
    const role = await this.roleService.findRoleByName(roleName);
    if (!role) {
      throw new NotFoundException(`Role ${roleName} không tồn tại`);
    }

    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
    const { status, ...userData } = user;
    const newUser = this.userRepository.create(userData);
    newUser.role = role;
    newUser.status = status ?? UserStatus.ACTIVE;
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, deleted: false },
      relations: { role: true },
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .andWhere('user.deleted = :deleted', { deleted: false })
      .getOne();
    if (!user) {
      return null;
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return null;
    }
    return user;
  }
  async findById(id: number) {
    return this.userRepository.findOne({
      where: { id },

      relations: {
        role: {
          permissions: true,
        },
      },
    });
  }
  async findAll(query: GetUsersDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const where: FindOptionsWhere<User> = {};

    if (query.keyword) {
      where.username = Like(`%${query.keyword}%`);
    }

    if (query.status) {
      where.status = query.status;
    }
    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      items: users.map((u) => this.toResponse(u)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const existedPhone = await this.userRepository.findOne({
      where: { phone: updateUserDto.phone },
    });
    if (existedPhone) {
      throw new ConflictException('Số điện thoại đã tồn tại');
    }
    const updateUser = { ...user, ...updateUserDto };
    return await this.userRepository.save(updateUser);
  }
}
