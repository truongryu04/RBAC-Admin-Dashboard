import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  username!: string;

  @IsString()
  @Length(8, 255, { message: 'Mật khẩu phải có độ dài tối thiểu 8 ký tự' })
  password!: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email không được để trống ' })
  email!: string;

  @IsString()
  @Matches(/^0\d{9}$/, {
    message: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0',
  })
  phone!: string;

  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
