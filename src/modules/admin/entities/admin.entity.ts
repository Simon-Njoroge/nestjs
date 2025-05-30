import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { AdminLog } from '../../admin-logs/entities/admin-log.entity';
import { Role } from '../../../common/constants';
import { Exclude } from 'class-transformer';
// const uuidv4 = require('uuid').v4; 

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMIN,
  })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => AdminLog, (log) => log.admin)
  logs: AdminLog[];

  @BeforeInsert()
  normalizeEmail() {
    this.email = this.email.toLowerCase().trim();
  }
  // @BeforeInsert()
  // generateId() {
  //   this.id = uuidv4();
  // }
}
