import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
// const uuidv4 = require('uuid').v4; 

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  refreshToken: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  // @BeforeInsert()
  // generateId() {
  //   this.id = uuidv4();
  // }
}
