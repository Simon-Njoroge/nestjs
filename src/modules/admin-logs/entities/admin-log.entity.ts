import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { Admin } from '../../admin/entities/admin.entity';
// const uuidv4 = require('uuid').v4; 

@Entity()
export class AdminLog {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Admin, (admin) => admin.logs, { onDelete: 'CASCADE' })
  admin: Admin;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // @BeforeInsert()
  // generateId() {
  //   this.id = uuidv4();
  // }
}
