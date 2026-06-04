export class ResponseUserDto {
  id!: number;
  username!: string;

  email!: string;
  phone?: string;
  role!: string;
  avatar?: string;
  status!: string;

  createdAt!: Date;
}
