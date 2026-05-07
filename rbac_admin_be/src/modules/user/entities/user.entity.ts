import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from 'src/modules/role/entities/role.entity';
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

  @ManyToOne(() => Role, (role) => role.users, { nullable: false, eager: true })
  @JoinColumn({ name: 'role_id' })
  role!: Role;
}
