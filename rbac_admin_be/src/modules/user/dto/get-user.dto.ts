import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../enums/user-status.enum';

export class GetUsersDto {
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';

  @IsOptional()
  @IsString()
  keyword?: string;
  @IsOptional()
  @IsString()
  status?: UserStatus;
}
