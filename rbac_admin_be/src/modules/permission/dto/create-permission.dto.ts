import { IsOptional, IsString, Length } from 'class-validator';

export default class CreatePermissionDto {
  @IsString()
  @Length(1, 255, { message: 'Permission code không được để trống' })
  code!: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}
