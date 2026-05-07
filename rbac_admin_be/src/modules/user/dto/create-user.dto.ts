import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

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

  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
