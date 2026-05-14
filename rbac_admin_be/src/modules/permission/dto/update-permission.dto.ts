import { IsOptional, IsString, Length } from 'class-validator';

export default class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  code?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
}
