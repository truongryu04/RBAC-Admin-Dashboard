import { Role } from 'src/modules/role/entities/role.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { UserRole } from './user-role.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column({ select: false })
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: 'ACTIVE' })
  status!: string;

  @Column({ default: false })
  deleted!: boolean;
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => UserRole, (ur) => ur.user)
  userRoles!: UserRole[];
}
