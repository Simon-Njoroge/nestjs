import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Inquiry } from '../../inquiries/entities/inquiry.entity';
import { Review } from '../../review/entities/review.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @OneToMany(() => Booking, booking => booking.user)
  bookings: Booking[];

  @OneToMany(() => Inquiry, inquiry => inquiry.user)
  inquiries: Inquiry[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];
}
