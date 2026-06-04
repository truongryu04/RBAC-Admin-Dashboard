import { IsOptional, IsString, Matches } from 'class-validator';
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;
  @IsOptional()
  @IsString()
  @Matches(/^0\d{9}$/, {
    message: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0',
  })
  phone!: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
