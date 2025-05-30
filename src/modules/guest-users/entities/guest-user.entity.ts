import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Inquiry } from '../../inquiries/entities/inquiry.entity';
import { Booking } from '../../bookings/entities/booking.entity';
// const uuidv4 = require('uuid').v4; 

@Entity()
export class GuestUser {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Inquiry, (inquiry) => inquiry.guestUser, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  inquiries: Inquiry[];

  @OneToMany(() => Booking, (booking) => booking.guestUser, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  bookings: Booking[];
  // @BeforeInsert()
  // generateId() {
  //   this.id = uuidv4();
  // }
}
