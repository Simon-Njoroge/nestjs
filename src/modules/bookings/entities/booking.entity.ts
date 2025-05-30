import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from 'typeorm';
// const uuidv4 = require('uuid').v4; 
import { User } from '../../users/entities/user.entity';
import { GuestUser } from '../../guest-users/entities/guest-user.entity';
import { TourPackage } from '../../tour-packages/entities/tour-package.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'booking_reference', unique: true })
  bookingReference: string;

  @Column('int')
  numberOfGuests: number;

  @Column({ type: 'date' })
  bookingDate: Date;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.bookings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User;

  @ManyToOne(() => GuestUser, (guestUser) => guestUser.bookings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  guestUser: GuestUser;

  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.bookings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  tourPackage: TourPackage;

  @BeforeInsert()
  generateBookingReference() {
    this.bookingReference =
      'BK-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  // @BeforeInsert()
  // generateId() {
  //   this.id = uuidv4();
  // }
}
